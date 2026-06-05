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

### 5. Lint borcu (343 error / 1710 warning)
- **Ne:** `npm run lint` → react-hooks/react-compiler kuralları (effect içinde setState, render'da impure çağrı) + `no-explicit-any`.
- **Ödeme planı:** Önce 343 error, sonra warning'ler. **Hedef: Faz 1.**

### 6. Tanrı-dosyalar (>500 satır)
- **Ne:** `askida-bagis/page.tsx` (1994), `kayit/page.tsx` (1272), `pazar/ilan-ver/page.tsx` (1130) + 9 dosya 800–999.
- **Ödeme planı:** Bileşen + hook'a böl; veri çekmeyi servis/hook katmanına taşı. **Hedef: Faz 1.**

### 7. CI audit adımı henüz "bilgilendirme" modunda
- **Ne:** `.github/workflows/ci.yml` → `npm audit` adımı `continue-on-error: true`.
- **Ödeme planı:** Üretim açıkları temizlenince "high ve üzeri = kırmızı" zorunlu kapıya çevir. **Hedef: Faz 1.**
