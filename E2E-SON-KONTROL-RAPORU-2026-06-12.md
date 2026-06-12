# E2E Son Kontrol — Pazara Hazırlık Denetim Raporu

**Tarih:** 2026-06-12 · **Denetleyen:** Claude (e2e-last-control skill, 17 modül)
**Ürün:** Mahallemiz (komsu-app) — Next.js 16.2.7 + Supabase + Capacitor 7
**Mod:** C (kod tabanı + canlı URL `https://komsu-app.vercel.app` + canlı DB şeması)
**Kapsam:** ~95 sayfa rotası, 9 API ucu, 55+ tablo RLS, 5 storage bucket, canlı HTTP başlıkları

---

## Özet karar: 🟡 ŞARTLI GO

Sert kapı kuralına göre: **bu denetimde bulunan 3 P1'in üçü de düzeltildi** (DB
migration + kod). Kalan tek P1 niteliğindeki madde, koddaki **bilinçli** "PayTR
yapılandırılana kadar ödeme kapısı açık" kararıdır → bu bir hata değil, **canlıya
çıkış ön koşuludur** (aşağıda Go koşulları).

**Go koşulları (canlıya çıkmadan önce):**
1. `PAYTR_MERCHANT_ID/KEY/SALT` env'leri Vercel'e girilmeli — girilmezse esnaf
   üyeliği **ödemesiz** aktive olur (kod: `business/subscription/activate`, bilinçli pre-launch davranışı).
2. Aktivasyon, ödemeyi **tüketmeli** (tek `merchant_oid` = tek aktivasyon).
   Şu an aynı tamamlanmış ödeme süresiz yeniden aktivasyona izin verir (kodda TODO olarak yazılı).
3. `UPSTASH_REDIS_REST_*` env'leri prod'da şart — yoksa rate-limit'ler
   serverless'ta etkisiz (in-memory, instance başına).
4. Hata izleme: Sentry Next 16 desteği beklemede (configler stub). Lansmanda en
   az Vercel log alarmı veya alternatif (GlitchTip) kurulmalı.

---

## A) Bu denetimde DÜZELTİLEN bulgular

| # | Öncelik | Bulgu | Kanıt | Çözüm |
|---|---|---|---|---|
| 1 | **P1** | **Mesaj gizliliği açığı:** `conversation_participants` INSERT politikası yalnız `user_id = auth.uid()` kontrol ediyordu → herhangi bir oturumlu kullanıcı, `conversation_id`'sini öğrendiği BAŞKASININ sohbetine kendini ekleyip tüm mesajları okuyabilirdi. Uygulama zaten SECURITY DEFINER RPC (`get_or_create_direct_conversation`) kullanıyor; politika yalnızca saldırı yüzeyiydi. | `pg_policies`: "Users add self to conversation" `check (user_id = auth.uid())` | Migration `e2e_audit_admin_rls_and_storage_hardening`: politika DROP edildi |
| 2 | **P1** | **Admin moderasyonu fiilen çalışmıyordu:** panel sayfaları (ilanlar, gönderiler, yorumlar, gruplar, reklamlar, doğrulama, moderasyon) istemci tarafında `update/delete` çağırıyor; ama `listings, posts, comments, business_reviews, groups, ad_campaigns, address_verifications, reports` tablolarında admin yazma RLS politikası **yoktu** → RLS 0 satır etkiler, UI "başarılı" gösterir (sessiz başarısızlık). Zararlı içerik kaldırılamıyordu. | `pg_policies` cmd dökümü + `admin/*/page.tsx` mutasyon grep'leri (örn. `admin/ilanlar/page.tsx:68`) | 13 adet `adm_*` politikası eklendi (`is_current_user_admin()` ile UPDATE/DELETE) |
| 3 | **P1** | **`business-images` bucket'ı canlı DB'de yoktu:** `isletme-ekle` logo/kapak buraya yüklüyor → işletme kaydı görselli yapılamıyordu ("Logo yüklenemedi" hatası). | `storage.buckets` sorgusu (4 bucket) vs `isletme-ekle/page.tsx:209` | Bucket oluşturuldu + path-kapsamlı politikalar (`logos|covers/{uid}` yalnız sahibi yazar/siler, herkes okur) |
| 4 | **P2** | **KVKK silme eksikti:** `account/delete` var olmayan bucket'lara (`business-images` yoktu, `listings` diye bucket yok) bakıyor; gerçek önekleri (`marketplace/{uid}`, `odunc-kirala/{uid}`, `post-images/{uid}`…) hiç taramıyordu → hesap silinince kullanıcı görselleri kalıyordu (KVKK Md.7). | eski kod `route.ts:61` vs gerçek yükleme akışları (`pazar/ilan-ver:363`, `odunc:178`, `post-form-modal:207`) | Temizlik haritası gerçek bucket+öneklerle yeniden yazıldı |
| 5 | **P2** | **Upload sınırsızdı:** bucket'larda `file_size_limit`/`allowed_mime_types` yoktu → oturumlu herkes herkese-açık bucket'lara istediği türde dosya barındırabilirdi (maliyet + kötüye kullanım). | `storage.buckets` (tümü null) | Görsel bucket'ları: 10MB + image/*; `listing-images`: 100MB + video (mp4/mov/webm — `uploadMultipleMedia` video destekliyor) |
| 6 | **P2** | **Rate-limit yapılandırma çakışması:** Upstash limiter İLK çağrının ayarlarıyla tek sefer kuruluyordu → farklı uçlar (örn. verify-document 5/10dk) ilk ucun penceresini miras alıyordu; limitler fiilen yanlıştı. | `src/lib/rate-limit.ts` eski `upstashInitTried` singleton'ı | Yapılandırma-başına limiter Map'i (`mahallemiz:rl:{limit}:{pencere}` prefix) |
| 7 | **P2** | **/api/moderate-media anonim çağrılabiliyordu:** 40 tarama/dk×IP ile Google Vision maliyeti dışarıdan tüketilebilirdi. | route'ta `getUser` yoktu | Oturum zorunlu (401 `auth_required`) |
| 8 | **P3** | **Arama filtre enjeksiyonu:** `.or(\`title.ilike.%${term}%\`)` — virgül/parantez PostgREST filtre ağacını bölüyor (arama bozuluyor, filtre mantığı değişebiliyor; RLS sayesinde veri sızıntısı sınırlı). | `ara/page.tsx:158`, `search-dropdown.tsx:91` | `term.replace(/[,()]/g,' ')` ayıklaması (2 dosya) |

**DB değişiklikleri** tek migration'da: `e2e_audit_admin_rls_and_storage_hardening` (geri almak kolay: politikalar isimli, `adm_*` / `business_images_*`).

## B) AÇIK kalan bulgular (öncelikli yapılacaklar)

| # | Öncelik | Bulgu | Önerilen çözüm |
|---|---|---|---|
| 9 | **P1 → Go koşulu** | Ödeme kapısı pre-launch fail-open + ödeme "tüketilmiyor" (yukarıda Özet'te). | PayTR env + `payments.merchant_oid` bazlı eşleştir-ve-tüket; aktivasyonda ödemeyi `consumed_at` ile işaretle |
| 10 | **P2** | **Sentry pasif** (Next 16 uyumu bekleniyor; config dosyaları stub) → prod'da hata izleme yok. | @sentry/nextjs Next16 sürümü çıkınca aktive et; o zamana dek Vercel log drains/alarm |
| 11 | **P2** | **Grup sahibi grubunu düzenleyemez/silemez:** `groups` tablosunda owner UPDATE/DELETE politikası hiç yok (admin kapısını ben ekledim; owner kapısı eksik). | `created_by = auth.uid()` UPDATE/DELETE politikası (kolon adı doğrulanarak) |
| 12 | **P2** | **Yedek/DR teyidi yapılamadı:** Supabase PITR/backup durumu MCP'den görünmüyor. | Dashboard → Database → Backups: PITR açık mı kontrol et; RPO hedefi yaz (RUNBOOK.md'ye) |
| 13 | **P3** | `documents` bucket'ı kodda anılıyor ama DB'de yok (hiçbir akış henüz yüklemiyor). Belge yükleme gelirse **PRIVATE** açılmalı (kimlik belgesi!). | Özellik gelmeden private bucket + sahibine-özel SELECT |
| 14 | **P3** | Giriş sayfasında "50.000+ komşu · 81 il" iddiası — lansman öncesi yanıltıcı. | Gerçek metrik ya da iddiasız metin |
| 15 | **P3** | Ölü prototip: `components/marketplace/payment-modal.tsx` + `_PaymentPageLegacy` (kart/CVV formu; sayfa zaten `redirect('/pazar')`). | Dosyaları sil (yanlışlıkla canlanma riski) |
| 16 | **P3** | CSP `script-src 'unsafe-inline'` (Next.js pratiği) + `spatial_ref_sys` RLS uyarısı (PostGIS sistem tablosu). | Nonce'lu CSP'ye geçiş (büyük iş); PostGIS uyarısı kabul edilen istisna |
| 17 | **P3** | PayTR/Vision `fetch` çağrılarında açık timeout yok (Vercel fonksiyon limiti tek koruma). | `AbortSignal.timeout(10_000)` ekle |

## C) Doğrulanan SAĞLAM alanlar (kanıtlı ✅)

- **Middleware kapıları:** doğrulama durumu forge-edilemez `profiles`'tan okunuyor (guard trigger `trg_guard_profile_privileged_columns` canlıda mevcut); admin kapısı sunucu tarafında `is_admin`; `next` parametresi open-redirect'e karşı süzülüyor; `/admin` anonim → redirect (canlıda da test edildi).
- **Ödeme zinciri (yapılandırıldığında):** tutar sunucu fiyat tablosundan, kimlik session'dan; callback hash + tutar çift kapısı, anahtarsızken fail-closed, `merchant_oid` UNIQUE idempotency; `payments` tablosu canlıda RLS'li.
- **verify-document:** IP + kullanıcı bazlı çift rate-limit, format validasyonu, rozet yalnız service-role ile yazılıyor.
- **RLS kapsaması:** tüm uygulama tablolarında RLS açık + politika var (tek istisna PostGIS `spatial_ref_sys`); mesajlar/katılımcı SELECT'leri katılımcıya kilitli; `payments` SELECT yalnız sahibi+admin.
- **Sırlar:** `SERVICE_ROLE` yalnız 5 sunucu route'unda; `.env*` git'te değil; kodda gerçek sır yok (tarama: yalnız test sabitleri).
- **Canlı başlıklar (https://komsu-app.vercel.app):** CSP, HSTS (preload), X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy — tümü mevcut (`check_headers.py` çıktısı).
- **SEO:** title/description/OG/Twitter/canonical canlıda doğru; `sitemap.ts`, `robots.ts`, `manifest.ts`, JSON-LD mevcut.
- **CI:** typecheck + unit test + production build **zorunlu kapı**; e2e duman bilgi amaçlı.
- **UI durumları:** 14× `loading.tsx`, 4× `error.tsx` + kök `error/global-error/not-found`; cookie banner + KVKK/gizlilik/çerez sayfaları + hesap silme (KVKK Md.11) mevcut.
- **health:** token'sız yalnız canlılık; ayrıntı `HEALTH_CHECK_TOKEN` ile (bilgi sızıntısı yok — canlıda doğrulandı).

## D) Kapsanamayanlar (neden + nasıl kapatılır)

| Alan | Neden | Nasıl |
|---|---|---|
| Gerçek tarayıcıda rol-bazlı tam akış (Modül 17 derin) | Claude in Chrome eklentisi bu oturumda bağlı değildi; test hesapları yok | `e2e/admin-rbac.spec.ts` hazır — `E2E_USER_EMAIL/PASSWORD` ver, ya da Chrome eklentisini bağla, tekrar isteyin |
| Lighthouse / axe erişilebilirlik taraması | Sandbox'ta tarayıcı yok | `npx playwright test` + `@axe-core/playwright` eklenmesi (TECH_DEBT'e yazıldı) |
| k6 yük koşusu | Staging ortamı yok; prod'a yük atılmaz (kural) | Şablon hazır: `scripts/k6-load-smoke.js` (yalnız staging'e karşı) |
| iOS/Android (Capacitor) cihaz testi | Cihaz/simülatör yok | `MOBILE_APP_BUILD.md` akışı + gerçek cihaz |

## E) Bu denetimde eklenen test varlıkları

- `e2e/security-headers.spec.ts` — başlıklar + anonim erişim kapıları + health sızıntı regresyonu (lokal & canlı çalışır)
- `e2e/admin-rbac.spec.ts` — RBAC duman testi (env'siz SKIP, CI kırmaz)
- `scripts/k6-load-smoke.js` — yük testi şablonu (yalnız staging)

## F) Go/No-Go takip tablosu

| Bulgu | Durum | Sahip | Tarih |
|---|---|---|---|
| #1 Mesaj gizliliği | ✅ Düzeltildi (migration) | Claude | 2026-06-12 |
| #2 Admin moderasyon RLS | ✅ Düzeltildi (migration) | Claude | 2026-06-12 |
| #3 business-images bucket | ✅ Düzeltildi (migration) | Claude | 2026-06-12 |
| #4–8 (P2/P3 kod) | ✅ Düzeltildi (commit) | Claude | 2026-06-12 |
| #9 PayTR env + ödeme tüketimi | ⏳ **Go koşulu** | Coşkun (env) + kod | lansman öncesi |
| #10 Hata izleme | ⏳ Açık | Coşkun | lansman öncesi |
| #11 groups owner politikası | ⏳ Açık | kod | — |
| #12 Yedek/PITR teyidi | ⏳ Açık (dashboard) | Coşkun | lansman öncesi |

> Not: Önceki denetim raporlarıyla (PAZARA-HAZIRLIK-DENETIM-RAPORU-2026-06-06.md, AUDIT_REPORT.md) çelişki yok; bu rapor onların üzerine **canlı DB + canlı URL kanıtlı** derin test katmanıdır.
