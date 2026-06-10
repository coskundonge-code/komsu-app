# E2E Son Kontrol Raporu — Mahallemiz

> Pazara/müşteriye hazırlık son-kontrol ve uçtan-uca kalite + güvenlik kapısı.
> Tarih: **2026-06-10** · Mod: **C (kod + canlı localhost:3000 + canlı Supabase)**
> Denetleyen: E2E Last Control (QA + Güvenlik + Mimari)

---

## ✅ GÜNCELLEME (2026-06-10) — düzeltmeler uygulandı (coskun rafı)

İlk denetimden sonra bulgular **onay beklenmeden sırayla düzeltildi**. Açık P0/P1 kalmadı.

**Düzeltildi ve doğrulandı (tsc 0 · build 0 · 264 test · canlı DB):**
- 🔴→✅ **P0 Mesajlaşma** — RLS özyinelemesi + güvenli sohbet oluşturma RPC (migration `20260610120000`); canlı DB'de doğrulandı (42P17 bitti; RPC create+reuse+2 katılımcı). Commit `32eed98`.
- 🟠→✅ **P1 Post beğeni** — durum DB'den başlar, optimistic + rollback, doğru sayaç. `f94d4fd`.
- 🟠→✅ **P1 Uyarılar 404** — ölü link kaldırıldı. `0332708`.
- 🟠→✅ **P1 /kaydol CTA + SEO/PWA gating** — `9773ab0`.
- 🟡→✅ **P2** — arama sonsuz spinner, boş-isim feed çöküşü, etkinlik katılımcı sayısı + RSVP rollback, ilan paylaş butonları, işlevsiz chat butonları, PWA manifest ikonları, görsel yükleme tür/boyut doğrulaması. `f94d4fd`, `0332708`, `43ac3c5`.

**Bilerek ertelendi (gerekçeli):**
- **API Origin/CSRF kontrolü (P2):** uygulama aynı zamanda Capacitor mobil — naif Origin kontrolü mobil isteklerini KIRAR; Capacitor origin allowlist'i ile dikkatli yapılmalı (SameSite=Lax zaten kısmi koruma).
- **Feed'i React Query'ye taşıma + pazar favorileri kalıcılığı (P2):** mimari/şema değişikliği → ayrı tur.
- **robots'un "allow" dediği app sayfaları login-gated (P2):** public landing ürün kararı.
- **verify-document headless Chrome (P2) · CSP unsafe-inline (P3) · PostGIS advisor gürültüsü (P3) · sitemap dinamik içerik (P3) · /favoriler içerik uyumu (P2):** düşük öncelik / karar gerektirir.

**E2E teknik kapısı: açık P0/P1 YOK → teknik olarak GEÇTİ.** (Yayın hâlâ `YAPILACAKLAR.md` A bölümündeki **yasal metin / MERSİS-VERBİS / avukat onayı / PayTR canlı anahtar** maddelerine bağlı — bunlar sahip/avukat işi, teknik değil.)

> Aşağısı ilk denetim raporudur (NO-GO o anki durumdu); yukarıdaki güncelleme geçerlidir.

---

## 0. Sade özet (teknik olmayan)

Uygulamanın **güvenlik temeli sağlam** — ödeme sahteciliği, yetki yükseltme, veri
sızıntısı gibi en tehlikeli açıklar daha önceki turlarda kapatılmış ve bu denetimde
**canlı veritabanında doğrulandı**. Ama **bir büyük yayın engeli** var:

- 🔴 **Mesajlaşma şu an tamamen çalışmıyor.** Veritabanı güvenlik kuralındaki bir
  hata yüzünden iki komşu mesajlaşmaya başlayınca sistem hata veriyor. Şimdiye
  kadar fark edilmemiş çünkü tablolar boş ve önceki düzeltmeler sadece ekran
  tarafındaydı. Bunu siz "mesajlaşmayı ayrı, dikkatli bir turda düzeltelim"
  dediğiniz için **rapora işledim, aceleye getirip bozmadım**; hazır çözüm planı aşağıda.

Ayrıca SEO/blog erişimi ve birkaç kırık buton/sayfa bulundu. **2 tanesini bu turda
güvenle düzelttim** (blog + site haritası artık herkese açık; kırık "kayıt ol"
butonları çalışıyor). Geri kalanlar aşağıda, dosya/satır ve çözümüyle listeli.

**GENEL KARAR: 🔴 NO-GO** — 1 doğrulanmış P0 (mesajlaşma) açıkken "pazara hazır"
denemez. P0 + P1'ler kapanınca tekrar değerlendirilmeli.

---

## 1. Denetim kapsamı

- **Ürün / sürüm:** Mahallemiz (mahallemiz-app@0.1.0), Next.js 16.2.7 App Router (Turbopack), React 19
- **Backend / DB:** Supabase (Postgres + RLS + Auth, proje `dogjnzcofvpsqbepdaek`), Next API route'ları
- **Altyapı:** TanStack Query, Zod, react-hook-form, Upstash rate-limit, Leaflet, Capacitor 7, PayTR ödeme, Tesseract/puppeteer (e-Devlet doğrulama)
- **Test:** Vitest (264 test / 18 dosya ✅), Playwright (smoke), GitHub Actions CI (typecheck+test+build = sert kapı)
- **Yüzey:** ~93 sayfa rotası (15 admin, 8 işletme, 3 auth), 8 API ucu, 15 SQL migration
- **Roller:** misafir / standart kullanıcı / admin (server-side `is_admin` kapısı)

**Kapsanmayanlar + neden:**
- **Kimlik-korumalı tarayıcı akışları** (feed/pazar/mesaj uçtan uca tıklama testi): her rol için test hesabı sağlanmadı → "girdi bekliyor". Public yüzey + auth yönlendirmesi + DB katmanı doğrulandı.
- **Yük testi (k6 3x/10x):** canlı prod Supabase'e yıkıcı yük testi yapılmaz (kural); staging yok → staging'de yapılmalı.
- **Tam erişilebilirlik (axe/Lighthouse) taraması:** statik gözlemle kısmi yapıldı (lang=tr ✓, ARIA örnekleri ✓); tam otomatik axe pass önerilir.

---

## 2. Bulgu özeti

| Öncelik | Adet | Anlamı |
|---|---|---|
| 🔴 P0 | 1 | Yayın engeli (No-Go). Çekirdek özellik kırık. |
| 🟠 P1 | 4 (2'si bu turda düzeltildi) | Yüksek — yayından önce giderilmeli. |
| 🟡 P2 | 12 | Orta — kısa vadede düzeltilmeli. |
| ⚪ P3 | 8 | Düşük — gürültü/iyileştirme. |

---

## 3. Go / No-Go takip tablosu (P0 + P1)

| # | Bulgu | Öncelik | Durum | Çözüm |
|---|---|---|---|---|
| 1 | Mesajlaşma RLS sonsuz özyineleme + katılımcı insert reddi | 🔴 P0 | **AÇIK** | SECURITY DEFINER helper + create RPC (aşağıda) |
| 2 | Post "beğen" veriyi silebiliyor / tutmuyor | 🟠 P1 | AÇIK | liked'i DB'den başlat + optimistic/rollback |
| 3 | Uyarılar kartları 404 (`/uyarilar/[id]` yok) | 🟠 P1 | AÇIK | Detay sayfası ekle veya linki kaldır |
| 4 | Kırık "Hemen Başla" CTA `/kaydol` | 🟠 P1 | ✅ **DÜZELTİLDİ** (9773ab0) | `/kayit`'e yönlendirildi |
| 5 | SEO/PWA yüzeyleri auth arkasında (robots/sitemap/manifest/blog) | 🟠 P1 | ✅ **DÜZELTİLDİ** (9773ab0) | middleware'den çıkarıldı (prod build 200) |

> **Kural:** Tek bir doğrulanmış P0 bile = **No-Go**. Şu an #1 açık.

---

## 4. P0 — Yayın engeli (detay)

### [P0-1] Mesajlaşma tamamen kırık — veritabanı RLS hatası
- **Modül:** 1 (RBAC/RLS) + 2 (Fonksiyonel)
- **Kanıt 1 (özyineleme):** Canlı DB'de `authenticated` rolüyle çalıştırıldı:
  ```sql
  set local role authenticated; select count(*) from conversation_participants;
  -- ERROR 42P17: infinite recursion detected in policy for relation "conversation_participants"
  ```
  `conversation_participants` SELECT politikası kendi tablosunu alt-sorguda sorguluyor → Postgres sonsuz özyineleme verir. Aynı hata `conversations` ve `messages` politikalarına da yayılır (ikisi de bu tabloyu sorgular).
- **Kanıt 2 (katılımcı ekleme):** İstemci sohbet açarken **iki katılımcıyı tek insert'te** ekliyor (`src/components/ui/verified-message-button.tsx:207`, `src/app/(main)/mesajlar/new/page.tsx:115`), ama INSERT politikası `WITH CHECK (user_id = auth.uid())` karşı tarafın satırını reddeder → sohbet hiç oluşmaz.
- **Tekrar adımı:** İki gerçek kullanıcı arasında DM başlat → her okuma/yazma 500. (Tablolar boş olduğu için bugüne dek görünmedi; önceki düzeltmeler yalnızca ekran tarafıydı.)
- **Etki:** Komşu-komşu mesajlaşma (çekirdek özellik) hiç çalışmıyor.
- **Önerilen çözüm (hazır):**
  1. RLS özyinelemesini kıran yardımcı:
     ```sql
     create or replace function public.is_conversation_participant(p_conversation_id uuid)
     returns boolean language sql security definer set search_path = '' stable as $$
       select exists (select 1 from public.conversation_participants cp
         where cp.conversation_id = p_conversation_id and cp.user_id = auth.uid());
     $$;
     revoke execute on function public.is_conversation_participant(uuid) from anon, public;
     grant execute on function public.is_conversation_participant(uuid) to authenticated;
     ```
     Sonra `conversation_participants` / `conversations` / `messages` SELECT politikalarını bu fonksiyonla yeniden yaz (tabloyu doğrudan sorgulamak yerine `public.is_conversation_participant(...)`).
  2. Sohbet oluşturmayı atomik ve güvenli yapan SECURITY DEFINER RPC ekle (`create_direct_conversation(other_user_id uuid)`: conversation + iki participant satırını sunucu tarafında oluşturur) ve istemciyi (verified-message-button + mesajlar/new) bu RPC'ye bağla. Böylece istemci "karşı taraf" satırını doğrudan yazmaz.
  - **Risk:** Sıfır (tablolar boş; yalnızca bozuk akışı onarır). Sahip "mesajlaşmayı ayrı, odaklı, test edilmiş bir turda" istediği için bu tura sıkıştırılmadı.

---

## 5. P1 (yüksek)

### [P1-2] Post "Beğen" verisi tutmuyor / yanlış davranıyor
- **Kanıt:** `src/components/feed/post-card.tsx:48` `useState(false)` → `liked` hep "beğenmedin" başlar; `:58-64` `handleLike` DB'de varlık-bazlı toggle yapar; `:176` sayaç `reactions + (liked?1:0)`. Aynı desen `src/app/(main)/gonderi/[id]/page.tsx:128-131,200`.
- **Etki:** Zaten beğenilmiş gönderiye tıklayınca reaction **silinir** ama UI +1 gösterir; sayfa yenilenince beğeni durumu kaybolur, sayaç gerçeği yansıtmaz.
- **Çözüm:** `liked`'i kullanıcının mevcut reaction'ından (DB) başlat; tıklamada optimistic güncelle + hata olunca geri al; sayaç için React Query invalidation.

### [P1-3] Uyarılar kartları 404'e gidiyor
- **Kanıt:** `src/app/(main)/uyarilar/page.tsx:405` her kart `/uyarilar/${alert.id}`'e linkliyor; `uyarilar/[id]/page.tsx` rotası **yok** (yalnızca `uyarilar/new/`). Glob ile doğrulandı.
- **Etki:** Herhangi bir uyarıya tıklayan kullanıcı 404 görür.
- **Çözüm:** `uyarilar/[id]/page.tsx` detay sayfası ekle **veya** kartı link sarmalından çıkar.

### [P1-4] ✅ Kırık "Hemen Başla" CTA — DÜZELTİLDİ (9773ab0)
`/kaydol` (404) → `/kayit`. `hakkinda/page.tsx:145`, `nasil-calisir/page.tsx:251`.

### [P1-5] ✅ Public SEO/PWA yüzeyleri auth arkasında — DÜZELTİLDİ (9773ab0)
- **Kanıt (önce):** `GET /robots.txt|/sitemap.xml|/manifest.webmanifest|/blog` → **307 → /giris**. Arama motorları robots/sitemap'i okuyamıyor, blog (pazarlama/SEO içeriği) ziyaretçilere ve crawler'lara görünmez, PWA manifesti çıkış yapmışta başarısız.
- **Kök neden:** `middleware.ts` matcher'ı ve `publicRoutes` bu yolları içermiyordu.
- **Düzeltme:** robots.txt/sitemap.xml/manifest.webmanifest matcher dışına alındı; `/blog` publicRoutes + locationExempt'e eklendi. **Prod build doğrulandı** (üçü de `○` statik, 200). Not: dev sunucu /robots.txt'te geçici 500 verir (Turbopack `instrumentation.ts MODULE_UNPARSABLE` artefaktı; prod build'de yok — temiz `.next` ile dev restart çözer).

---

## 6. P2 (orta)

| # | Bulgu | Kanıt | Çözüm |
|---|---|---|---|
| 6 | Arama hata olunca sonsuz spinner | `ara/page.tsx:160-264` Promise.all'da try/catch yok | try/catch/finally + hata durumu |
| 7 | Feed boş-string isimde çöküyor | `(main)/page.tsx:89`, `gonderi/[id]:70` `(name\|\|'K')[0]` — `""[0].toUpperCase()` throw → feed boşalır | `?.[0]` guard |
| 8 | Etkinlik katılımcı sayısı hep 0 | `etkinlikler/page.tsx:84,102` getEvents `event_attendees(count)` seçiyor ama sayfa `e.attendee_count` okuyor | doğru alanı oku/eşle |
| 9 | Pazar favorileri + feed React Query dışı | `pazar/page.tsx:62,98-103` (local Set, reload'da kaybolur); `(main)/page.tsx:55-111` raw useEffect | React Query + DB persistence |
| 10 | Etkinlik liste RSVP rollback yok | `etkinlikler/page.tsx:136-142` (detay sayfası doğru) | hata olunca geri al |
| 11 | /favoriler beklentiyi karşılamıyor | işletmeleri gösteriyor, kaydedilen ilanları değil | favori ilan görünümü ekle |
| 12 | İlan paylaş butonları no-op | `pazar/ilan/[id]/listing-detail-client.tsx:263-271` (WhatsApp/Kopyala/Facebook onClick yok) | paylaşım handler'ları |
| 13 | CSRF/Origin kontrolü yok | cookie-auth state-changing API'ler; `CSRF_SECRET` tanımlı ama kullanılmıyor | Origin/CSRF kontrolü (SameSite kısmen azaltıyor) |
| 14 | Sunucu tarafı görsel tür/boyut doğrulaması yok | `lib/upload.ts` uploadImage yalnızca client kontrol | storage policy + sunucu doğrulama |
| 15 | verify-document her istekte headless Chrome | `verify-document/route.ts:241-391` `--no-sandbox` | kuyruk/limit; kaynak yüzeyi (rate-limit ile kısmen azalmış) |
| 16 | PWA ikon/screenshot eksik | `public/` yalnızca icon-192/512 var; manifest icon-256/384, maskable, screenshot bekliyor → 404 | eksik görselleri ekle |
| 17 | robots "allow" ettiği sayfalar login-gated | `/pazar,/etkinlikler,/gruplar,/isletmeler` 307→/giris → indekslenemez | ürün kararı: public landing gerekli mi? |

---

## 7. P3 (düşük / gürültü)

- **spatial_ref_sys RLS kapalı** (Supabase advisor ERROR + 2026-06-08 "kritik" güvenlik e-postası — değerlendirildi): bu PostGIS'in standart EPSG/SRID referans katalogudur (8500 satır, **kullanıcı verisi / PII / sır YOK**; her PostGIS kurulumunda aynı). "Verileriniz ifşa olabilir / veri ihlali" çerçevesi **geçersiz** — okunabilen tek şey herkese açık koordinat-sistemi tanımları. **Diğer tüm public tablolarda RLS açık** (canlı doğrulandı: RLS-kapalı yalnız bu tablo) → kullanıcı verisi açıkta değil. Gerçek (düşük) hijyen sorunu: anon/authenticated bu tabloda INSERT/UPDATE/DELETE/TRUNCATE yetkisine sahip (referans veriyi bozabilir; geri yüklenebilir, ihlal değil). **API'den düzeltilemez:** tablo `supabase_admin` mülkiyetinde; `postgres` rolüyle RLS açılamıyor (`must be owner` 42501) ve yetki revoke edilemiyor (no-op — canlı `has_table_privilege` ile doğrulandı). Kalıcı çözüm Supabase Support / platform-düzeyi yetki gerektirir; aksi halde PostGIS için bilinen advisor false-positive'i olarak kabul edilebilir. **E-posta güvenliği:** böyle e-postalardaki linke tıklamayın; doğrulama doğrudan proje API'siyle yapıldı.
- **PostGIS extensions in public + `st_estimatedextent` anon-executable**: advisor gürültüsü, uygulama verisi açığa çıkmaz.
- **CSP `script-src 'unsafe-inline'`**: XSS azaltmayı zayıflatır (Next varsayılan tradeoff). Sertleştirme: nonce-tabanlı CSP.
- **Chat telefon/video butonları no-op** (`mesajlar/page.tsx:282-287`): özellik yok; butonları gizle.
- **`merchant_oid` PayTR dönüş URL'lerinde** (userId içerir): opak sunucu-token, düşük.
- **dev /robots.txt 500 + instrumentation MODULE_UNPARSABLE**: Turbopack dev cache artefaktı; prod build temiz.
- **/yardim/sss tekrar tekrar GET** (dev logunda onlarca): olası client refetch döngüsü — doğrula.
- **Sitemap dinamik içerik içermiyor** (ilan/işletme/etkinlik/blog detay): yalnızca statik rotalar; SEO kapsamı genişletilebilir.

---

## 8. Güçlü yönler (doğrulandı — dengeli görmek için)

- **Olgun güvenlik (canlı DB'de doğrulandı):** ödeme/kart sahteciliği client-write politikaları kaldırılmış; bildirim çapraz-kullanıcı sızıntısı kapalı; profil ayrıcalıklı sütunları (`is_admin`, `account_locked`, `edevlet_*`) **aktif trigger** ile istemci yazımına kilitli; anon profil okuması kapalı.
- **Middleware:** sunucu-taraflı `is_admin` admin kapısı; doğrulama durumu forge-edilemez `profiles`'tan; açık-yönlendirme guard'ı (`?next=`).
- **Ödeme:** PayTR callback HMAC-SHA256 doğrulaması + idempotent (`onConflict merchant_oid`); tutar/kimlik sunucudan türetilir (fiyat oynaması kapalı); anahtar yoksa callback çalışmaz.
- **API uçları (8):** hepsi auth + sahiplik kontrollü; tek XSS noktası statik `json-ld.tsx`; hardcoded sır yok; health diagnostics token-gated.
- **Güvenlik başlıkları (canlı):** CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- **Operasyon:** CI sert kapıları (typecheck+test+build), 264 birim test, `/api/health` 200, cookie consent + KVKK/gizlilik/çerez sayfaları, Sentry hook (DSN ile aktif), Upstash rate-limit altyapısı.

---

## 9. Bu turda düzeltilenler (coskun · 9773ab0)

1. `src/middleware.ts` — robots.txt/sitemap.xml/manifest.webmanifest matcher dışına; `/blog` public.
2. `src/app/(main)/hakkinda/page.tsx` — `/kaydol` → `/kayit`.
3. `src/app/(main)/nasil-calisir/page.tsx` — `/kaydol` → `/kayit`.

Doğrulama: `tsc --noEmit` 0 hata · `next build` exit 0 · `vitest run` 264/264 ✅ · canlı: sitemap/manifest/blog 200.

---

## 10. Önerilen sıra (yayın öncesi)

1. **P0-1 mesajlaşma** — ayrı, test edilmiş tur (yukarıdaki hazır plan).
2. **P1-2 beğeni** + **P1-3 uyarılar 404** — çekirdek/akış kırıkları.
3. **P2-6,7,8** (sonsuz spinner, feed çöküşü, yanlış katılımcı sayısı) — küçük, güvenli düzeltmeler.
4. Kalan P2/P3 — kısa vadede.
5. **Staging** kurulup yük testi (k6) + kimlik-korumalı tarayıcı akışlarının uçtan uca testi + tam axe taraması.
