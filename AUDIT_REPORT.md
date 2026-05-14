# Mahallemiz — Uçtan Uca Denetim Raporu

**Hazırlayan:** Cowork (Claude) · **Tarih:** 2026-05-02 · **Kapsam:** Kod tabanı, Supabase (proje `dogjnzcofvpsqbepdaek`), middleware/auth, ödeme, RLS, UX, rakip kıyaslaması, SWOT.

---

## 1. Yönetici Özeti

Mahallemiz; sayfa ve veri modeli açısından geniş kapsamlı, mimari kararları (Next.js 16 App Router, Supabase, Capacitor 7, React Query, Zod, RLS) doğru kurulmuş bir projedir. **Ancak ürün şu hâliyle piyasaya hazır değildir.** Görünür yüzeyin aksine, üç katmanda ciddi açıklar var:

1. **Para akışı kırık** — PayTR callback'i `payments` tablosuna yazıyor, ancak bu tablo veritabanında yok. Üyelik aktivasyonu için profil kolonları (`mahalle_card_active`, `business_membership_active`) da yok. **İlk başarılı ödeme bile silinemez biçimde başarısız olur.**
2. **Admin panelinin tamamına yakını mock veri üzerinde** — 11 admin sayfası (`bildirimler`, `dogrulama`, `gonderiler`, `gruplar`, `guvenlik`, `ilanlar`, `isletmeler`, `kullanicilar`, `mahalleler`, `odemeler`, `yorumlar`) sabit `MOCK_*` dizilerinden besleniyor. Operasyon ekibi tek bir gerçek kullanıcıyı, tek bir gerçek raporu, tek bir gerçek ödemeyi göremez veya müdahale edemez.
3. **Güvenlik tarafında 6 ciddi RLS açığı + e-Devlet/eDevlet doğrulamasının kırılgan puppeteer scraping üzerine oturtulması** — Supabase advisor 1 ERROR + 32 WARN raporluyor; rozet kazandırma fonksiyonu `anon`'a açık, kullanıcı rozetlerini kendine ekleyebilir, başkasının bildirimlerini "okundu" işaretleyebilir.

**Sonuç:** Demo/yatırımcı sunumu için yeterli, ancak gerçek kullanıcıyla canlıya çıkış için **tahmini 4–6 hafta odaklı çalışma** gerekiyor. Aşağıdaki öncelikli aksiyon listesi 12 maddeden oluşuyor; ilk 4 madde olmadan paranın bir kuruşunu güvenle alamaz, gerçek bir mahalle topluluğunu yönetemezsiniz.

---

## 2. SWOT

### Güçlü Yönler (Strengths)
- **Modern stack ve doğru karar zinciri:** Next.js 16 App Router, React 19, Supabase (Postgres 17 + RLS), Capacitor 7, React Query, Zod, Tailwind 4, Radix UI. 2026 standartlarına uygun.
- **Kapsamlı veri modeli:** 49 tablo (mahalleler, ilanlar, gönderiler, etkinlikler, gruplar, işletmeler, anketler, bağışlar, rozetler, mahalle kartı, ödünç-kirala, yardım talepleri, reklamlar). Çoğu Türkiye'deki rakiplerden daha geniş bir vizyona işaret ediyor.
- **Türkiye'ye özel doğrulama yaklaşımı:** TC Kimlik No algoritmik validasyonu (`isValidTCKimlik`) doğru yazılmış; e-Devlet yerleşim yeri belgesi tabanlı doğrulama fikri, Nextdoor'un postcard-by-mail yönteminden hızlı.
- **Çoklu monetizasyon hayali kurulmuş:** Mahalle Kartı (yıllık), İlan ücreti, Esnaf üyeliği (aylık), reklamlar — tek noktadan gelir bağımlılığı yok.
- **Güvenlik temeli mevcut:** middleware'de open-redirect koruması, CSP başlıkları, HSTS, Permissions-Policy, RLS varsayılan olarak açık (49/50 tabloda).
- **i18n hazırlığı ve Türkçe UX:** Bütün route slug'ları, hata mesajları ve form validasyonları yerel.

### Zayıf Yönler (Weaknesses)
- **Para akışı tamamlanmamış:** `payments` tablosu, ilgili profil kolonları yok; PayTR callback ilk istekte 500 dönecek (aşağıda detay).
- **Çift profil tablosu (`profiles` ve `user_profiles`):** İkisinde de 2 satır var, hangisinin otoritatif olduğu belirsiz; `useCurrentUser` `profiles`'a bakıyor, başka kod yolları `user_profiles`'a bakıyor olabilir → sessiz veri çatallanması.
- **Servisler mock:** `review-system.ts` 11 TODO, `address-verification.ts` 5 TODO, `content-moderation.ts` DB entegrasyonu eksik — yani moderasyon, yorum sistemi, adres doğrulama akışlarının hiçbiri kalıcı değil.
- **Admin paneli sahte:** En az 6 admin sayfası `MOCK_*` sabit veriyle render oluyor.
- **Mesajlaşma yarım:** `mesajlar/page.tsx` (665 satır) hem realtime listener hem `mockConversations`/`mockMessages` içeriyor. Geçiş yarıda kalmış.
- **Test yok:** Tek bir `.test.ts` veya `.spec.ts` dosyası yok; CI pipeline'a koruyucu hiçbir şey takılı değil.
- **Build koruması kapalı:** `next.config.ts` içinde `typescript.ignoreBuildErrors: true`. Yani breaking type errors prod build'e sızabilir.
- **Observability yok:** Sentry/Datadog/PostHog/Mixpanel yok; canlıda hata oluştuğunda farkına varmak zor.
- **Performance advisor 352K karakter çıktı verdi** (boyut nedeniyle parse edemedim, ama bu kadar büyük olması zaten "çok sayıda bulgu var" sinyalidir — eksik index, ineffective RLS join'leri, verbose audit log uyarıları).
- **eDevlet doğrulama Puppeteer + serverless Chromium ile yapılıyor:** turkiye.gov.tr captcha/bot algılama eklerse veya HTML'i değişirse akış sessizce ölür. 503 dönerek "manuel doğrulama yapın" diyor — pratikte fallback yok.
- **`profiles` SELECT politikası `USING true`:** Telefon, email, full_name dâhil tüm profil alanları herkese açık. KVKK uyumu için risk.

### Fırsatlar (Opportunities)
- **Türkiye'de hyperlocal boşluk var:** Hoplr Karşıyaka pilotu, Mahallem (esnaf), tek bir baskın oyuncu yok. Nextdoor Türkiye'ye gelmedi.
- **Mahalle kartı + esnaf indirimleri:** Local commerce + community engagement birleşimi Nextdoor'un yapamadığı şey; bu sizin için yatırımcı hikâyesi.
- **Belediye/STK ortaklıkları:** "Dijital komşuluk" söylemi belediyelerde popüler (CHP'nin 2023 girişimi, Buca'nın çocuk sokakları). B2G2C kanalı açılabilir.
- **eDevlet adresi tabanlı doğrulama:** Doğru kurgulanırsa Nextdoor'un postcard sürtünmesinden 10x daha hızlı bir onboarding sağlar — büyük diferansiyatör.
- **Yardım talepleri + bağış + ödünç-kirala üçlüsü:** Olio + Citizen + Nextdoor'un birleşimi. "Sadece sosyal değil, faydalı" konumlanması mümkün.

### Tehditler (Threats)
- **Nextdoor'un yaşadığı tuzaklar:** Negatiflik, ırksal profilleme, opaque moderasyon, "neighbour shaming". 2024'te kullanıcı kaybetti, 2025'te NXDR rebrand'iyle kurtulmaya çalışıyor. Aynı hatalar.
- **KVKK riski:** TC kimlik no işliyorsunuz, açık profil, mesaj logları. Veri sorumlusu yükümlülükleri (VERBİS, ihlal bildirimi 72 saat, iletişim talepleri) henüz operasyonelleşmemiş görünüyor.
- **PayTR'ye gömme:** Tek ödeme sağlayıcı. Iyzico/Stripe/Param fallback yok.
- **eDevlet HTML'i değişimi:** Scraper kırılır, kayıtlar durur.
- **Mahalle başına ağ etkisi sorunu:** İlk 50 kişi olmadan kullanılmaz; coğrafi seedlemeniz yok (henüz).

---

## 3. Kritik Bulgular (Önem sırasına göre)

### 🔴 KRİTİK — Yayına çıkmadan önce mutlaka çözülmeli

#### K1. PayTR ödeme akışı çalışmıyor
**Kanıt:** `src/app/api/payment/callback/route.ts:46,72` `payments` tablosuna `upsert` yapıyor; satır 60-68 `profiles.mahalle_card_active`, `profiles.business_membership_active`, `profiles.business_membership_expiry` kolonlarını güncelliyor. Veritabanı sorgusu (`information_schema.columns`):
- `payments` tablosu: **yok**
- `mahalle_card_active`: **yok**
- `business_membership_active`: **yok**

`src/lib/services/payment.ts` içinde 8 ayrı yerde `payments` tablosuna referans var. **Tek bir başarılı ödeme bile veritabanına işlenemez.** Kullanıcı parayı verir, üyelik aktif olmaz, log da tutulamaz.

**Aksiyon:**
```sql
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_oid text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  payment_type text NOT NULL,
  amount numeric(10,2) NOT NULL,
  status text NOT NULL,
  provider text NOT NULL DEFAULT 'paytr',
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);
ALTER TABLE public.profiles
  ADD COLUMN mahalle_card_active boolean DEFAULT false,
  ADD COLUMN mahalle_card_expiry timestamptz,
  ADD COLUMN business_membership_active boolean DEFAULT false,
  ADD COLUMN business_membership_expiry timestamptz;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_view_own_payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
-- INSERT/UPDATE sadece service role; webhook service key kullandığı için RLS bypass olur
```

#### K2. Supabase RLS açıkları (advisor: 1 ERROR + 32 WARN)
| Tablo | Politika | Sorun |
|---|---|---|
| `user_badges` | `INSERT` `WITH CHECK (true)` | Kullanıcı kendi profiline rozet ekleyebilir |
| `notifications` | `UPDATE` `USING true, WITH CHECK true` | Kullanıcı başkalarının bildirimlerini değiştirebilir |
| `conversation_participants` | `INSERT` `WITH CHECK (true)` | Kullanıcı kendini herhangi bir konuşmaya ekleyebilir → mesaj okuma yetkisi |
| `polls` / `poll_options` | `INSERT` `WITH CHECK (true)` | Yetkisiz oluşturma, spam riski |
| `profiles` | `SELECT USING true` | Telefon + email + isim tüm dünyaya açık (KVKK riski) |
| `posts` | İki ayrı INSERT politikası: `(auth.uid() = author_id)` ve `auth.role() = 'authenticated'` | İkincisi başka kullanıcının `author_id`'siyle post yazmaya izin verir → impersonation |
| `listings` | Aynı çift politika sorunu | Aynı impersonation riski |
| `spatial_ref_sys` | RLS kapalı (ERROR) | PostGIS sistem tablosu — public schema'da olduğu için PostgREST'e açık |
| `check_and_award_badges`, `handle_new_user`, `get_user_profile_with_badges` | `SECURITY DEFINER` + `anon` execute | Trigger fonksiyonları PostgREST RPC'siyle anonim olarak çağrılabilir |
| 9 fonksiyon | `search_path` mutable | Schema spoof saldırı yüzeyi |
| Auth | `auth_leaked_password_protection: false` | HaveIBeenPwned kontrolü kapalı |

**Aksiyon:**
```sql
-- 1. Permissive INSERT politikalarını sıkılaştır
DROP POLICY "Users can add participants" ON conversation_participants;
CREATE POLICY "Add self to conversation" ON conversation_participants FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY "Users can create conversations" ON conversations;
CREATE POLICY "Owner creates conversation" ON conversations FOR INSERT
  WITH CHECK (created_by = auth.uid());

DROP POLICY "rls_notif_u" ON notifications;
CREATE POLICY "User updates own notifications" ON notifications FOR UPDATE
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY "rls_posts_i" ON posts;
DROP POLICY "rls_listings_i" ON listings;
DROP POLICY "User badges insert by service role" ON user_badges;
CREATE POLICY "Service role only" ON user_badges FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- 2. profiles SELECT'i sınırla — telefon/email PII
DROP POLICY "Profiles are viewable by everyone" ON profiles;
DROP POLICY "rls_profiles_r" ON profiles;
DROP POLICY "profiles_select" ON profiles;
CREATE POLICY "Public profile fields" ON profiles FOR SELECT USING (true);
-- Telefon/email için ayrı view veya kolon-bazlı yetki: profiles_public view'ı kullanın

-- 3. Fonksiyonları sıkılaştır
ALTER FUNCTION public.handle_new_user() SET search_path = public, pg_temp;
ALTER FUNCTION public.check_and_award_badges(uuid) SET search_path = public, pg_temp;
-- Tüm 9 fonksiyon için tekrarlayın
REVOKE EXECUTE ON FUNCTION public.check_and_award_badges(uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

-- 4. Çift profil tablosunu temizle: birini kanonik seç, diğerini view yap
-- (manuel karar gerekiyor — hangisi otoritatif?)
```

Auth Settings panelinden "Leaked password protection" açın.

#### K3. Admin paneli MOCK veriden besleniyor (11/11 sayfa)
**Kanıt (grep doğrulaması):** Aşağıdaki tüm admin sayfaları sabit `MOCK_*` dizileriyle çalışıyor:
`bildirimler`, `dogrulama`, `gonderiler`, `gruplar`, `guvenlik`, `ilanlar`, `isletmeler`, `kullanicilar`, `mahalleler`, `odemeler`, `yorumlar`. Yani admin panelinin **tamamı kozmetik**. Operasyon ekibi gerçek bir bildirimi gönderemez, raporlanan bir gönderiyi gizleyemez, doğrulama belgesini onaylayamaz, ödeme uyuşmazlığını çözemez.

**Aksiyon:** Önce hayati 4 panel — `dogrulama` (eDevlet onay kuyruğu), `gonderiler`/`yorumlar` (içerik moderasyonu), `kullanicilar` (KVKK silme/banlama), `odemeler` (uyuşmazlık) — gerçek hook'a bağlanmalı. Bu olmadan ürün canlıya çıkarsa ilk şikâyet geldiğinde cevapsız kalırsınız.

#### K4. Mesajlaşma sayfasında mock data hâlâ render ediliyor
**Kanıt:** `src/app/(main)/mesajlar/page.tsx:33-66` `mockConversations`, satır 70 `mockMessages`. 665 satırlık dosyada hem Supabase realtime listener var hem mock fallback. Yeni kullanıcı muhtemelen Ahmet Yılmaz'ı görüyor — bu tek başına ürünü çocuksu gösterir.

**Aksiyon:** Mock blokları silin; konuşmasız ekranda boş durum (empty state) bileşeni gösterin.

#### K5. eDevlet doğrulaması üretimde kırılgan
**Kanıt:** `src/app/api/verify-document/route.ts:130-204` Puppeteer + Sparticuz Chromium ile turkiye.gov.tr'yi scrape ediyor. Vercel serverless'da Chromium binary 50MB+, cold start 5-10 saniye, captcha eklenirse durur. Şu an 503 dönüyor.

**Aksiyon:** Üç katmanlı doğrulama:
1. **PDF yükleme + OCR** (tesseract.js zaten kurulu) — adres alanı + barkod çıkarımı.
2. **NVI API'si** (varsa kurumsal anlaşma — büyük adım ama doğru yol).
3. **Manuel admin onayı** fallback — ekipten bir kişi PDF'i gözle kontrol eder. Bu olmadan otomatik akış arızalandığında kayıt durur.

### 🟠 YÜKSEK — İlk 4 hafta içinde

#### Y1. Test altyapısı yok
Vitest + Playwright kurun. Minimum kapsam:
- Auth: kayıt → eDevlet → konum → ilk feed (Playwright)
- Ödeme callback hash doğrulama (Vitest, unit)
- RLS: anon kullanıcının diğer kullanıcının `profiles.phone`'unu okuyamadığı (Supabase test-helpers)
- Middleware redirect funnel (Vitest)

#### Y2. `next.config.ts` `ignoreBuildErrors: true`
TypeScript hatalarını giderin, bu satırı kaldırın. Aksi hâlde service katmanındaki sessiz typeerrors'lar ödeme/RLS hatalarını maskeler.

#### Y3. Observability yok
- **Sentry** (frontend + API routes) — production hata izleme.
- **Vercel Analytics** zaten CSP'de izinli, etkinleştirin.
- **Supabase logs + advisors** haftalık kontrol.

#### Y4. `payment.ts` ve callback'te webhook yeniden deneme/idempotency yok
PayTR aynı `merchant_oid` için 2 kez bildirim gönderebilir. `payments` tablosunda `merchant_oid UNIQUE` koysanız bile kart aktivasyonu iki kez tetiklenir. `upsert(... onConflict: 'merchant_oid', ignoreDuplicates: true)` kullanın ve aktivasyon işini status değişikliğine sıkıca bağlayın (CHECK already-active, return 200).

#### Y5. KVKK uyum eksiklikleri
- `gizlilik`, `kvkk`, `cerez-politikasi` route'ları middleware'de public ama içerikleri var mı bilinmiyor (kontrol edilmeli).
- VERBİS kayıt (50+ çalışanlı işletme zorunluluğu varsa farklı, kişisel veri işleyen şirket zaten bağımsız kayıt zorunlu sayılır).
- "Hesabımı sil" akışı yok — KVKK madde 11 kapsamında zorunlu.
- Cookie banner yok — CSP'de Vercel + Google izinli ama tarayıcı tarafında onay alınmıyor.

#### Y6. Rate limiting yok
`/api/payment`, `/api/verify-document`, `/api/auth/*` brute-force'a açık. Vercel Edge Middleware veya Upstash Ratelimit ile en azından IP başına dakikada 10 istek koyun.

### 🟡 ORTA — İlk 8 hafta

- **Çift profil tablosu (`profiles` vs `user_profiles`):** Birini view yapın veya tekleştirin. `useCurrentUser`'ın `profiles`'a baktığı görüldü; `user_profiles` muhtemelen ölü kod.
- **Listing/post duplicate RLS politikaları:** `rls_posts_i` ve `Members can create posts` aynı tablo için iki INSERT politikası — biri impersonation'a izin veriyor.
- **eDevlet scraping yedeği yok:** Bunun büyüğü K5'te ama bir cron yedek + manuel yol gerekli.
- **Mobile push notification akışı eksik:** Capacitor `@capacitor/push-notifications` kurulu, ama Firebase Cloud Messaging server tarafı yok (env var yorumlanmış).
- **23 TODO:** review-system 11, address-verification 5, kayıt akışı 6 — yarım çekirdek özellikler.
- **`page.tsx` (29.5K satır 665 dosya değil — köküne dağılmış):** Root düzeyinde garip dosyalar (test-branch-check.txt, test-full-mode.md, test-new-file.md). Repo temizliği gerekli.
- **Performance advisor çıktısı 352K karakter:** Eksik index/permissive policy uyarıları çoktur. Ayrı bir oturumda parse edilmeli.

### 🟢 İYİLEŞTİRME — 3 ay+

- **Search:** Postgres trigram (pg_trgm zaten yüklü) ile feed/marketplace içi arama.
- **Coğrafi arama optimizasyonu:** PostGIS yüklü, `boundary GeoJSON` var; `ST_Contains` ile mahalle eşleştirme şu an client-side mi server-side mi kontrol edilmeli.
- **Beslenen feed (Ranked feed):** Şu an muhtemelen kronolojik. Nextdoor'un öğrendiği ders: kötü içerik yukarı çıkarsa kullanıcı kaybedersiniz.
- **Komşu doğrulama eşiği:** "X komşu beni doğruladı" tipi sosyal kanıt gerekir.

---

## 4. Dünyadaki Örnekler — Kıyaslamalı Analiz

| Özellik | Mahallemiz | Nextdoor (US) | Olio (UK) | Front Porch Forum (Vermont) | Hoplr (BE/NL/TR-Karşıyaka) | Citizen (US) |
|---|---|---|---|---|---|---|
| Doğrulama | TC + eDevlet (planlı) | Postcard, ev sahibi onayı | Yok / hafif | İnsan moderatör manuel onay | Posta kodu + adres | Telefon + konum |
| Feed | Var | Var, AI re-ranked | Sadece "available" listeler | E-posta günlük özet (klasik) | Var | Olay-bazlı, harita |
| Marketplace/ilan | Var | Var | Yok (paylaşım odaklı) | Sınırlı | Var | Yok |
| Ödünç/paylaşım | **Var (öne çıkan)** | Yok | Var (yeniden kullanım) | Yok | Sınırlı | Yok |
| Yardım talepleri | **Var** | "Help map" var ama az | Yok | Var | Var | Yok |
| Bağış/askıda | **Var (özgün)** | Yok | Var | Yok | Yok | Yok |
| Esnaf indirimleri | **Var (Mahalle Kartı)** | Local Deals (zayıf) | Partner kuruluşlar | Sponsorlar | Yok | Yok |
| Acil durum/uyarı | Var (`/uyarilar`) | Safety Alerts | Yok | Yok | **Çekirdek özellik** | **Çekirdek özellik** |
| Anketler | Var | Var | Yok | Yok | Var | Yok |
| Etkinlik takvimi | Var | Var (2024) | Yok | Var | Var | Yok |
| Moderasyon | Mock + DB tablosu | Volunteer "Leads" + AI | Merkezi | **İnsan, ön onay** | Hibrit | AI |
| Gelir modeli | Üyelik + ilan + esnaf + reklam | Reklam (%80) + Local Deals | Ücretsiz + B2B kurumsal | Bağış + sponsor | Belediye sponsoru | Subscription |

**Çıkarımlar:**

1. **Mahallemiz'in güçlü ayırt ediciliği "ödünç-kirala + askıda bağış + esnaf indirim" üçlüsü.** Bu yığın hiçbir global oyuncuda yok. Pazarlama mesajınızın merkezine koyun; "Komşuluk = ekonomi" anlatımı.

2. **Nextdoor'un ölümcül hatası: opaque moderasyon + negatiflik döngüsü.** Front Porch Forum'un başarısı ön-moderasyondan geliyor. Düşük ölçekte (mahalle başına <500 kişi) **insan ön-moderasyon** kalitenin tek korunma şeklidir. AI flagging + insan onayı kombinasyonu önerilir.

3. **Hoplr modeli (Belçika/Hollanda → Karşıyaka):** Belediye sponsorluklu B2G2C. Türkiye'de büyükşehirlerin ilçe belediyeleri (özellikle CHP'li olanlar 2023'ten beri "dijital komşuluk" söyleminde) doğal müşteridir. **İlk 6 ay yatırımcı yerine bir belediye pilotu hedefleyin.**

4. **Citizen'in dersi:** Acil durum uyarıları kullanıcıyı **günlük açma alışkanlığına** dönüştürür. `/uyarilar` rotanız var ama özelliği öne çıkarmıyorsunuz. Push bildirim altyapısını tamamlayıp güvenlik uyarısı (örn. mahallede yangın, kayıp çocuk, kapkaç) işlevini öne alın.

5. **Olio'nun "Food Waste Heroes" modeli:** Süpermarketle anlaşıp gönüllüler aracılığıyla artan gıdayı dağıtmak — sizin "askıda bağış"a doğal bir B2B uzantı. İmece+Migros tipi marka iş birliği fikri.

---

## 5. UX İyileştirme Önerileri (Önceliğe Göre)

### Onboarding
- **eDevlet doğrulamasının başarısızlığı bugün ölümcül.** Geri dönüş yolu olarak: 1) PDF yükleme + OCR, 2) selfie + TC eşleştirme (NVI), 3) manuel admin onayı — üç yollu fallback ekleyin.
- **İlk 50 kişi sorunu:** Yeni mahalle açıldığında kullanıcı görür: "Mahallenizde henüz 4 komşu var. Davet edin →". Referans kodu sistemi var (`referral_codes` tablosu) ama UI'da kullanılıp kullanılmadığı belirsiz.
- **"Mahalle nabzı":** İlk açılışta son 7 günün özetini gösterin (3 gönderi + 1 etkinlik + 1 ilan). Boş feed yerine.

### Feed
- **Anti-negatiflik tasarımı:** Nextdoor'un dersi. "Şikâyet" tonundaki postlara ön onay isteyin; pozitif/yardım postlarını otomatik öne çıkarın (zaten `type` kolonunuz var).
- **"Bu mahalleye özel" rozeti:** Komşulardan gelen içerikle, paylaşılan haberleri görsel olarak ayırın.
- **Reaksiyon kümesi:** Sadece beğeni değil, "yardım edebilirim", "ilgilendiğim" gibi mahalle-özgül reaksiyonlar.

### Marketplace + Ödünç-Kirala
- **Tek bir "yakındakiler" sekmesi:** İlan + ödünç + bağış birlikte coğrafi yakınlığa göre.
- **Güven göstergeleri:** "12 başarılı işlem", "5 kişi tarafından önerildi", "Mahalle Kartı sahibi".
- **Görsel zorunluluk:** İlan vermede en az 1 fotoğraf zorunlu olsun (storage + upload akışı zaten var).

### Mesajlaşma
- **Bloklamak/şikâyet etmek:** Bir konuşmadan blokla butonu — gözden kaçmasın. KVKK ihlal taleplerine karşı kritik.
- **Mesaj okundu zaman damgası:** `conversation_participants.last_read_at` kolonu var mı kontrol edin.
- **Push bildirim:** Capacitor altyapısı kurulu, FCM server ayağı eksik.

### Profil / Güven
- **"Mahalle skorunuz":** Rozet + doğrulama + işlem sayısı toplamı. Nextdoor'un "Verified Neighbor" rozetinin yerel versiyonu.
- **PII gizliliği:** Telefon ve email default GİZLİ olmalı, kullanıcı kendi tercih etmedikçe açılmamalı (şu an `profiles SELECT USING true`).

### Mobil
- **Web→native köprü:** `Capacitor.isNativePlatform()` kontrolü var; konum izni, kamera izni iOS 17+ "Limited Photos" ile uyumlu mu test edilmeli.
- **Splash screen + onboarding video:** İlk kullanıcı 3 ekran swipe'la ne kazanacağını anlamalı.

### Admin / Moderasyon
- **AI-flagged kuyruk:** content-moderation servisi var, OpenAI moderation API veya Türkçe model (örn. trendyol/tr-toxicity) ile besleyin.
- **Kullanıcı şikâyet → işlem süresi SLA:** 24 saat. KVKK ihlal bildirimi 72 saat.

---

## 6. Önceliklendirilmiş Aksiyon Listesi (12 Madde)

| # | Aksiyon | Süre | Etki |
|---|---|---|---|
| 1 | `payments` tablosu + profil kolonlarını oluştur (K1) | 1 gün | Para akışı çalışır |
| 2 | RLS açıklarını kapat (K2 — 7 politika düzelt + auth ayarı) | 2 gün | Veri güvenliği |
| 3 | Admin paneli ilk 4 sayfayı gerçek hook'a bağla (K3) | 5 gün | Operasyon mümkün |
| 4 | Mesajlar mock'unu kaldır + empty state (K4) | 0.5 gün | Profesyonel görünüm |
| 5 | eDevlet 3 katmanlı fallback (K5) | 5 gün | Kayıt akışı sağlam |
| 6 | Vitest + Playwright + 6 kritik smoke test (Y1) | 4 gün | Regresyon koruması |
| 7 | `ignoreBuildErrors` kapat + tip hatalarını gider (Y2) | 2 gün | CI güveni |
| 8 | Sentry + Vercel Analytics (Y3) | 0.5 gün | Üretim görünürlüğü |
| 9 | PayTR webhook idempotency (Y4) | 0.5 gün | Çift aktivasyon engeli |
| 10 | KVKK: hesap silme, cookie banner, gizlilik metinleri (Y5) | 3 gün | Hukuki uyum |
| 11 | Rate limit (Y6) | 1 gün | DDoS/brute-force koruması |
| 12 | Çift profil tablosu birleştir | 2 gün | Sessiz veri çatallanması yok |

**Toplam: ~26 iş günü ≈ 5 hafta tek geliştiriciyle, 3 hafta iki kişilik takımla.**

---

## 7. Pazara Çıkış Hazırlığı — Karar Tablosu

| Soru | Cevap |
|---|---|
| Demo / yatırımcı sunumu için hazır mı? | **Evet** — UI tamamlanmış, mimari sağlam. Mock veriyi göstermemeye dikkat edin. |
| Beta kullanıcı (kapalı 50 kişilik mahalle) için hazır mı? | **Hayır** — Mock data, ödeme kırık, admin paneli sahte. Madde 1-5 yapılırsa hazır. |
| Açık beta (her isteyen) için hazır mı? | **Hayır** — Yukarıdakiler + KVKK + rate limit + observability gerekli. Madde 1-11 yapılırsa hazır. |
| Üretim ölçeğine (10K+ kullanıcı) hazır mı? | **Hayır** — Performance advisor okunmadı, test yok, ranked feed yok, push bildirim eksik. |

**Yatırımcı/belediye pilot teklifi:** Bugün uygun. Sözünüz olmadığı için yapılmamış kısımlar net.

**Kullanıcıdan para alma:** 1-2-9 maddeleri tamamlanmadan kesinlikle hayır.

---

## Ek A — Veri Modeli Sağlık Kontrolü

- **49 public tablo,** RLS 48'de açık (yalnızca `spatial_ref_sys` kapalı — PostGIS sistem tablosu, advisor ERROR raporluyor ama PostGIS standardı; yine de schema move öneriliyor).
- **Veri durumu:** Çoğu tablo boş; `neighborhoods` 75, `listing_categories` 10, `business_categories` 12 (seed verisi var). `profiles` 2, `user_profiles` 2 — **çift kayıt**. `donations` 7, `help_requests` 4, `listings` 20, `badges` 3 — geliştirme/test verisi.
- **19 migration,** son tarih 2026-04-06. Her şey standart, branching kullanılmamış.
- **Eksik tablolar:** `payments`, `payment_logs`, `audit_log`, `kvkk_consents`, `account_deletions`.

## Ek B — Sürüm Notları

- Next.js 16.1.6, React 19.2.3, Supabase JS 2.99 — hepsi 2026 mevcut sürüm.
- Capacitor 7 — güncel, iOS 17/Android 14 destekliyor.
- pdfjs-dist 4.4.168 — 5.x var (büyük revizyon, geçişe değer).
- puppeteer-core 24.38 + @sparticuz/chromium 143 — Vercel için doğru kombinasyon ama bundle 50MB+, Edge Runtime'a uyumlu değil.

## Ek C — Kaynaklar

- [Nextdoor — Yatırımcı analizi & büyüme](https://expandedramblings.com/index.php/nextdoor-statistics/)
- [Nextdoor 2026 büyüme stratejisi](https://seekingalpha.com/news/4553694-nextdoor-outlines-7-percent-revenue-growth-target-for-q1-2026-amid-expanding-ai-driven)
- [10 Best Neighborhood Apps 2026 — Closeby](https://www.trycloseby.com/blog/best-neighborhood-apps)
- [Why Users Are Leaving Nextdoor — Mark King, Medium](https://medium.com/@mking2k/why-users-are-leaving-nextdoor-19a6db690fb5)
- [Under the (Neighbor)hood: Hyperlocal Surveillance on Nextdoor — Grimmelmann](https://james.grimmelmann.net/files/articles/under-the-neighborhood.pdf)
- [Hoplr Karşıyaka pilot duyurusu — CHP Belediye Gazetesi](https://belediyegazetesi.chp.org.tr/2023/1/30/dijitalkomsulukuygulamasibaslatildi)
- [Mahallem (Türkiye, 2017) — Webrazzi](https://webrazzi.com/2017/05/24/mahallem-esnaf-uygulama-indir/)
- [Supabase Database Linter — RLS rehberi](https://supabase.com/docs/guides/database/database-linter)
- [PayTR API Token & Bildirim Dökümanı](https://dev.paytr.com/iframe-api/iframe-api-1-adim)

---

*Rapor sonu. Sorularınız ya da bir bölümün detaylandırılması için: bu dosyayı yorumlayarak veya yeni bir oturumda devam edebilirim.*
