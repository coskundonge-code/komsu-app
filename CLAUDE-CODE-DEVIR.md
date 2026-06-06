# KOMŞU-APP — CLAUDE CODE DEVİR & TALİMAT
**Tarih:** 2026-06-06 · **Branch:** `coskun` · **Önceki ajan:** Cowork (Claude) · **Devralan:** Claude Code

> Bu doküman, Cowork'te yapılan uzun bir denetim+düzeltme oturumunun tam devridir.
> Claude Code, bu projede çalışacaksan **önce bunu ve `TECH_DEBT.md`'yi oku.** Her şey burada.

---

## 0. 30 saniyelik özet
Mahallemiz (komşu-app), `ai-architecture-rules` 13-kapı denetiminden geçirildi. 4 Haziran'da **4 kırmızı kapı** vardı; bu oturumda **0 kırmızıya** indi. Tip hataları 0, CI yeşil (typecheck+build+test zorunlu kapı), 4 gerçek runtime bug + 4 prod tablo/migration, types.ts canlı şemayla hizalı. Kalan iş **tracked debt** (TECH_DEBT.md) — market-ready'i bloklamıyor ama yayından önce kapatılmalı.

## 1. Proje
- **Mahallemiz** — Türk mahalle/komşuluk platformu. Next.js 16 (App Router) + Supabase + Capacitor 7. Yol: `C:\dev\komsu-app`.
- **Supabase project id:** `dogjnzcofvpsqbepdaek` ("Mahallemiz App"). **Canlı şema = TEK gerçek kaynak** (migration dosyaları ve types.ts geçmişte bayattı).
- Güncel denetim raporu: **`PAZARA-HAZIRLIK-DENETIM-RAPORU-2026-06-06.md`**. Borç defteri: **`TECH_DEBT.md`** (#3–#8). Önceki rapor: `PAZARA-HAZIRLIK-DENETIM-RAPORU.md` (4 Haz baseline).

## 2. ÇALIŞMA KURALLARI (önce oku — yoksa zaman kaybedersin)
- **git iki-raf düzeni:** `coskun` = geliştirme rafı (her şey buraya); `main`'e SADECE kullanıcı "deploy et" derse. Push, kullanıcının Windows'ta kayıtlı git kimliğiyle olur.
- **Sen (Claude Code) Windows makinesinde çalışıyorsun** → `npm run test`, `npm run build`, `npm run lint`, `npx tsc --noEmit`, `git` komutlarını **doğrudan çalıştırabilirsin.** (Cowork ajanı sandbox'ta vitest/next build çalıştıramıyordu, o yüzden bat'lar üretildi — sen bunlara mecbur değilsin, doğrudan komut çalıştır.)
- **Kullanıcı kod bilmiyor.** Ona terminal komutu dikte etme; değişiklikleri sen yap, sonucu sade anlat. Kısa/net Türkçe yaz.
- **Yardımcı bat'lar (repo kökünde, istersen kullan):**
  - `gonder.bat` → tsc + test geçerse commit+push (tek tık ship).
  - `faz1-dogrula.bat` → tam `next build` doğrulama.
  - `regen-types.bat` → types.ts'i canlı şemadan üretir. **DİKKAT: büyük dosyada stdout'u kesiyor (truncate).** Kullanırsan dosyanın `} as const` ile bittiğini DOĞRULA; kesilmişse Supabase MCP `generate_typescript_types` ile üret ya da elle onar.
- **CI:** `.github/workflows/ci.yml` → `typecheck` + `next build` + `test` ZORUNLU kapı (yeşil). `lint` + `npm audit` informational (continue-on-error). Her push CI'yı tetikler.
- **KRİTİK DERS — şema her zaman canlıdan doğrula:** Geçmişteki bug'ların kökü, kodun migration/types.ts varsaymasıydı; canlı DB farklıydı. Supabase tablosuna dokunmadan önce **MUTLAKA** `execute_sql` ile canlı şemayı kontrol et (`information_schema.columns`).

## 3. BU OTURUMDA YAPILANLAR
**Faz 0:** `next` 16.1.6→16.2.7 (üretim "high" açığı); sabit `@next/swc-win32` kaldırıldı (Linux CI/Vercel'i kırıyordu); vitest v2'de tutuldu (v4 rolldown native-binding kırılganlığı); sahte `sk_live` anahtarları + ölü kök `page.tsx` + çöp test dosyaları silindi; CI workflow + `TECH_DEBT.md` eklendi. Prod deps: 0 kritik / 0 yüksek.

**Tip güvenliği:** `tsc --noEmit` **101 hata → 0.** Kök neden: `src/types/modules.d.ts` içinde react-query'yi `any`'ye ezen ambient override → kaldırıldı (implicit-any cascade'inin sebebiydi).

**Gerçek runtime bug'lar (canlı şemayla bulundu):** konum-secimi adres-kaydı var olmayan kolonlara yazıyordu → gerçek kolonlar; ilanlar `'removed'`→`'expired'` (geçersiz enum); isletme-ekle businesses insert + **migration** + category dropdown'ı canlı `business_categories`'ten; 2 hook-sıralama bug'ı (pazar/kategori, admin).

**types.ts canlı şemadan yenilendi** → 3 `as any` kaldırıldı (audit_log/user_addresses/businesses).

**Eksik-özellik tabloları OLUŞTURULDU (migration + RLS):** `user_listing_quotas`, `business_subscriptions`, `payments`. → listing-quota, business-subscription, payment/callback, address-verification, review-system servisleri tip-denetimine açıldı (`@ts-nocheck` 7→2).

**CI sıkılaştırıldı:** typecheck+build+test zorunlu kapı, yeşil.

**K3 testleri:** 4→6 dosya (`pricing.test.ts`, `validations.test.ts`, `format.test.ts` — ~43 yeni senaryo, para/auth/format saf mantığı).

**Lint:** 356 → ~254 (rules-of-hooks 17 [2 gerçek bug], 65 kozmetik, prefer-const, react-query override).

## 4. ŞU ANKİ DURUM
- `npx tsc --noEmit` → **0 hata.** CI (#12) **yeşil** (build dahil).
- 13 kapı: **0 🔴, 1 🟢 (K1), 12 🟡.** Sert stop-ship yok; "tam market-ready" değil (hepsi 🟢 değil).
- Test: 6 unit (`src/__tests__/`) + 1 e2e (`e2e/auth-flow.spec.ts`, Playwright).
- Lint: ~254 error (informational). `@ts-nocheck`: **0 dosya** — content-moderation.ts 2026-06-06'da temizlendi (sonuncuydu). Tüm servisler tip-denetimli.
- **Bekleyen commit:** `types.ts.bak` + `regen-types-error.txt` silindi + `.gitignore`'a eklendi — bir sonraki push'la repo'dan kalkacak.

## 5. KALAN İŞLER (öncelik sırası + NASIL)
1. ~~**`payment.ts` — `@ts-nocheck`'i kaldır.**~~ ✅ **TAMAMLANDI (2026-06-06).** `payment_type` konvansiyonuna indirildi, boş `type` kolonu migration ile düşürüldü, `refunded_at` eklendi, `getRevenueReport` enum-dışı değerlere null-guard'landı, `@ts-nocheck` kaldırıldı (tsc 0). Ek olarak PayTR callback'ine status allowlist + total_amount NaN-guard eklendi (TECH_DEBT #3 büyük ölçüde kapandı). **Kalan:** PayTR token (ödeme başlatma) akışı hâlâ yarım — uçtan uca çalışması ayrı ürün işi; ve `paytr-hash.test.ts`'i red yollarına genişlet.
2. ~~**`content-moderation.ts` — `@ts-nocheck`'i kaldır.**~~ ✅ **TAMAMLANDI (2026-06-06).** Eksik kolonlar additive migration ile eklendi (`author_id`+FK, `ai_categories`, `ai_reviewed_at`, snapshot'lar, `priority`, `auto_approved`); `ai_reasoning→reason`, `admin_id→resolved_by`, `admin_note→admin_notes`, `admin_reviewed_at→resolved_at`. RLS düzeltildi (AI insert + admin görünürlüğü). types.ts hizalandı, `@ts-nocheck` kaldırıldı (tsc 0). **Kalan:** dosya hâlâ 771 satır (god-file #6) — bölme ayrı iş.
3. **God-file bölme (K2/#6):** `askida-bagis/page.tsx` (1994), `kayit/page.tsx` (1272), `pazar/ilan-ver/page.tsx` (1130) + 9 dosya 800–999. Bileşen/hook'a böl, veri çekmeyi servise taşı. **Riskli — her bölünen sayfayı dev server'da smoke-test et** (tsc/build davranış regresyonunu yakalamaz).
4. **Akış testleri (K3 derinleştir):** ödeme callback, ilan oluşturma, mesajlaşma için entegrasyon/e2e. DB-mock veya Playwright kurulumu gerek.
5. **Lint tail (~254):** çoğu load-bearing supabase `(data as any[])` cast'i. Kademeli erit; bittiğinde CI'da `lint`'i de zorunlu kapıya çevir (ci.yml'de `continue-on-error: true` kaldır). **Market-ready için zorunlu DEĞİL** (K2 "görünür+planlı" ister, sıfır değil).
6. **K5 KVKK:** TC Kimlik+adres özel-nitelikli veri → veri envanteri + saklama/silme + hukuki gözden geçirme. **K10 mobil:** `cap add` + izin gerekçeleri + gizlilik etiketleri.

## 6. DOĞRULAMA
- Hızlı: `npx tsc --noEmit` (0 olmalı) + `npm run test` (hepsi geçmeli).
- Tam: `npm run build` (üretim build).
- Ship: değişiklikten sonra commit + push `coskun`'a (gonder.bat veya doğrudan git). CI'yı izle (typecheck+build+test yeşil olmalı).
- Migration: Supabase MCP `apply_migration` (additive/RLS güvenli). Yeni tablo = MUTLAKA RLS + policy (kullanıcı kendi kaydı), yoksa güvenlik açığı.

## 7. KAYNAKLAR
`TECH_DEBT.md` (canlı borç defteri, #3–#8) · `PAZARA-HAZIRLIK-DENETIM-RAPORU-2026-06-06.md` (kapı skorları) · `CLAUDE.md` (mevcut proje notları) · `.github/workflows/ci.yml` · bat'lar (gonder/faz1-dogrula/regen-types).
