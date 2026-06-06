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
- **Yapıldı (2026-06-06):** `status` `{success,failed}` allowlist'i + `total_amount` sayısal (`NaN`) doğrulaması eklendi → geçersiz değerler artık 400 döner ve DB'ye yazılmaz. Doğrulanmış tutar tek yerde hesaplanıp iki upsert'te paylaşılıyor. Callback zaten tip-denetimliydi (`@ts-nocheck` yok). ✅
- **Nerede:** `src/app/api/payment/callback/route.ts`.
- **Kalan:** `src/__tests__/paytr-hash.test.ts`'i gerçek route'a (status/amount red yolları) karşı genişlet. **Hedef: Faz 1.**

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

### 8. Şema kayması ÇÖZÜLDÜ + eksik-özellik tabloları OLUŞTURULDU
- **types.ts canlı şemadan yenilendi** → 3 `as any` + 5 servis `@ts-nocheck`'i kaldırıldı (audit_log/user_addresses/businesses tipli).
- **2026-06-06 — 3 eksik tablo migration + RLS ile OLUŞTURULDU:** `user_listing_quotas`, `business_subscriptions`, `payments`. RLS: kullanıcı/işletme-sahibi sadece kendi kaydını görür. types.ts'e tipleri elle eklendi (regen bat'ı büyük dosyada kesiyor — bilinen sorun).
  - **Aktive edildi (artık tip-denetimli):** listing-quota ✅ · business-subscription ✅ · payment/callback (PayTR webhook) ✅ · address-verification ✅ · review-system ✅
- **2026-06-06 — `payment.ts` (intent servisi) AKTİVE EDİLDİ:** Mükerrer `type`/`payment_type` kolonları tek konvansiyona (`payment_type`) indirildi, boş `type` kolonu migration ile düşürüldü; `refunded_at` kolonu eklendi (iade audit izi); `getRevenueReport` enum-dışı tür/durum/yöntem değerlerine (PayTR `mahalle_card` vb.) karşı null-guard'landı; nullable kolonlar mapping sınırında coalesce edildi → `@ts-nocheck` kaldırıldı, `tsc` 0 hata. ✅
- **2026-06-06 — `content-moderation.ts` AKTİVE EDİLDİ:** `content_moderation` tablosu VARDI ama servis canlıda olmayan kolonlara yazıyordu. Eksik kolonlar additive migration ile eklendi (`author_id`+FK, `ai_categories`, `ai_reviewed_at`, `content_snapshot`, `title_snapshot`, `image_urls_snapshot`, `priority`, `auto_approved`); `ai_reasoning`→`reason`, `admin_id`→`resolved_by`, `admin_note`→`admin_notes`, `admin_reviewed_at`→`resolved_at` konvansiyonuna indirildi. **RLS düzeltildi:** insert artık AI akışını (`author_id=auth.uid()`) + şikâyet akışını kabul ediyor, admin'ler tüm kayıtları görüp güncelleyebiliyor (önceki politika AI insert'i runtime'da reddediyordu). types.ts hizalandı → `@ts-nocheck` kaldırıldı, `tsc` 0. ✅
- **Kalan `@ts-nocheck`: 0 dosya.** Tüm servisler tip-denetimli.
- **Not:** Tablo + tip = servisler DERLENEBİLİR/tip-güvenli. Özelliklerin uçtan uca ÇALIŞMASI için UI bağlama + test ayrı bir adım (ürün işi).
