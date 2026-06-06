# TECH_DEBT.md — Teknik Borç & Kabul Edilen Riskler

> Kural (AI Architecture Rules / K2+K12): Borç sıfır olmak zorunda değil; **görünür ve
> planlı** olmalı. Her madde: ne · nerede · etki · neden ertelendi · ödeme planı + tarih.
> Son güncelleme: 2026-06-05

## Kabul edilen riskler (Faz 0'da bilinçli bırakıldı)

### 1. Test aracında 2 "critical" npm açığı (dev-only)
- **Ne:** `npm audit` → `vitest` + `@vitest/ui` (v2) zincirinde 2 critical + birkaç moderate.
- **Nerede:** Yalnızca `devDependencies` (test koşucusu). Üretim paketine (production bundle) **girmez**, kullanıcıya ulaşmaz.
- **Etki:** Düşük (geliştirici makinesi/CI ile sınırlı).
- **Neden ertelendi:** Açığı kapatan tek sürüm `vitest@4`, beraberinde `rolldown` native-binding bağımlılığı getiriyor; bu Windows-dev + Linux-CI + Vercel'de çapraz-platform kırılganlık yarattı (npm bug #4828, native binding bulunamadı). Sadelik ilkesi gereği stabil `vitest@2`'de kalındı.
- **Ödeme planı:** `vitest@4` + `rolldown` ekosistemi olgunlaşınca yükselt; veya native-binding gerektirmeyen koşucuya geç. **Hedef: Faz 2.**

### 2. Üretimde 3 "moderate" npm açığı (postcss zinciri)
- **Ne:** `postcss` → `next` → `@vercel/analytics` üzerinden 3 moderate.
- **Nerede:** Build/transitive bağımlılık.
- **Etki:** Düşük-orta.
- **Neden ertelendi:** npm'in önerdiği tek "çözüm" Next'i kıracak şekilde geri almak (`--force`); temiz ileri yönlü yama yok.
- **Ödeme planı:** Yeni `next`/`@vercel/analytics` sürümlerini izle, çıkınca yükselt. **Hedef: Faz 1 sonu kontrol.**

## Faz 1 — Yayın öncesi kapatılacak borçlar

### 3. PayTR callback hardening (güvenlik, derinlemesine savunma)
- **Ne:** Callback hash'i PayTR spec'i gereği ayırıcısız birleştirme kullanıyor; güvenlik gizli `merchant_key`'e dayanıyor (yeterli). Ek savunma için `status` `{success,failed}` allowlist'i + `total_amount` sayısal doğrulaması eklenmeli.
- **Nerede:** `src/app/api/payment/callback/route.ts` (ayrıca `// @ts-nocheck` var).
- **Etki:** Orta (ödeme henüz canlı değil; canlıya almadan kapatılmalı).
- **Neden ertelendi:** Ödeme altyapısı (payments tablosu) yarım; K1 tamamlanınca yapılacak.
- **Ödeme planı:** payments tablosu + allowlist + `@ts-nocheck` kaldırma; `src/__tests__/paytr-hash.test.ts`'i gerçek route'a karşı genişlet. **Hedef: Faz 1.**

### 4. Tip güvenliği borcu (~96 `tsc` hatası)
- **Ne:** `npx tsc --noEmit` → 96 hata (çoğu admin sayfalarında implicit `any` (TS7006), ayrıca `use-listings.ts`/`use-posts.ts`'te gerçek tip uyumsuzlukları).
- **Etki:** Yüksek — bu hatalar muhtemelen `next build`'i de kırıyor (`next.config.ts` → `ignoreBuildErrors:false`).
- **Ödeme planı:** Tipleri düzelt; `any` sayısını düşür (~197). **Hedef: Faz 1 (öncelikli).**

### 5. Lint borcu (Faz 1'de 356 → 265 indirildi)
- **Yapıldı (2026-06-06):** rules-of-hooks 17 (2 gerçek hook-sıralama bug'ı: pazar/kategori + admin) ✅ · no-unescaped-entities 65 (kozmetik) ✅ · **react-query ambient override kaldırıldı** — `src/types/modules.d.ts` içinde `useQuery(options:any):any` tüm react-query tiplerini `any`'ye eziyordu; implicit-any cascade'inin KÖK NEDENİ idi ✅
- **Kalan (265):** 214 `no-explicit-any` (çoğu supabase join-select'lerinde load-bearing `(data as any[])` cast'leri, ~50 dosyaya yayılı) + 17 set-state-in-effect + ~34 misc (immutability, ban-ts-comment, prefer-const…).
- **Not:** K2 kapısı "borç SIFIR" istemez; "görünür + planlı" ister (bu kayıt onu sağlar). Kalan `any`'yi sıfırlamak market-ready için ZORUNLU değil.
- **Ödeme planı:** Bulk `any`'yi köken azaltmanın kaldıracı = types.ts'i canlı şemadan yeniden üret (supabase sonuçları tiplenince `as any[]` gereksizleşir) → kalan cast'leri kaldır. Dosya dosya da eritilebilir. CI lint bu süre informational. **Hedef: kademeli.**

### 6. Tanrı-dosyalar (>500 satır)
- **Ne:** `askida-bagis/page.tsx` (1994), `kayit/page.tsx` (1272), `pazar/ilan-ver/page.tsx` (1130) + 9 dosya 800–999.
- **Ödeme planı:** Bileşen + hook'a böl; veri çekmeyi servis/hook katmanına taşı. **Hedef: Faz 1.**

### 7. CI kapıları (2026-06-06 sıkılaştırıldı)
- **Yapıldı:** `typecheck (tsc --noEmit)` + `next build` + `test` artık ZORUNLU kapı (kırmızı = push'ta görünür/CI patlar). ✅
- **@ts-nocheck servisleri:** address-verification + review-system temizlendi (tip denetimi açık) ✅. Hâlâ kapalı: payment, payment/callback, listing-quota, business-subscription, content-moderation — hepsi bayat types.ts yüzünden; **types.ts regen** ile açılacak (bkz. #8).
- **Hâlâ informational:** `lint` (~253 kalan borç) + `npm audit` (3 prod-moderate).
- **Ödeme planı:** lint borcu eriyince lint'i, üretim açığı kalmayınca audit'i de zorunlu yap.

### 8. Şema kayması: types.ts ↔ canlı DB (KÖK NEDEN — büyük kısmı çözüldü)
- **Kanıt (canlı DB sorgulandı 2026-06-06):** Kaynak gerçek = CANLI şema; hem migration dosyaları hem types.ts kısmen bayat.
  - `user_addresses` gerçek kolonlar: `address_line, city, district, neighborhood_id, lat, lng, is_primary, verified_at` → konum-secimi DÜZELTİLDİ ✅
  - `listing_status` enum: `active|sold|reserved|expired` ('removed' YOK) → ilanlar 'removed'→'expired' DÜZELTİLDİ ✅
  - `businesses`: `instagram/facebook/twitter/working_hours` yoktu + `category` yerine `category_id` → **migration ile kolonlar eklendi** (add_business_social_and_hours) + dropdown canlı `business_categories`'ten besleniyor → DÜZELTİLDİ ✅
  - `profiles` location_* kolonları doğruymuş — bug yok ✅
- **Kalan (düşük öncelik; runtime çalışıyor):** types.ts bayat olduğu için 3 yerde `as any`: konum-secimi (user_addresses), guvenlik (audit_log types.ts'te yok), isletme-ekle (businesses). Kod doğru kolonları yazıyor; yalnız tip güvenliği kapalı.
- **Ödeme planı:** `supabase gen types typescript --project-id dogjnzcofvpsqbepdaek > src/lib/supabase/types.ts` → 3 `as any`'yi kaldır → tsc doğrula. **Hedef: Faz 1 sonu (opsiyonel temizlik).**
