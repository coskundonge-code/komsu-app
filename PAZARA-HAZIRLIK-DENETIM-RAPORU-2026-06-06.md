# Komşum_App (Mahallemiz) — Pazara Hazırlık Denetim Raporu (GÜNCEL)
### "AI Architecture Rules" 13 Kapı — İlerleme Denetimi
**Tarih:** 6 Haziran 2026 · **Önceki rapor:** 4 Haziran 2026 · **Denetlenen:** `C:\dev\komsu-app` (branch: coskun)
**Yöntem:** Kanıta dayalı (canlı Supabase şeması sorgulandı, tsc/eslint/CI çıktıları kullanıldı). Tahminle puanlama yok.

---

## 1. Yönetici Özeti

4 Haziran denetiminde ürün **🔴 pazara hazır DEĞİL** idi — **4 kırmızı kapı** (K2, K3, K7 + K4 sınırda) yayını durduruyordu. 6 Haziran çalışmasından sonra:

**Genel hüküm:** 🟡 **Sert stop-ship (🔴) kalmadı** — ama henüz "tam pazara hazır" da değil (kapıların çoğu 🟡, sadece 1'i tam 🟢). Ürün **"yayınlama" durumundan "🟡'leri kapat, sonra yayınla" durumuna** geçti.

**Bu oturumda kapanan kırmızılar:** K7 (CI yok → CI var), K2 (tip hataları/disiplin), K4 (npm açıkları).
**En zayıf kalan kapı:** **K3 (test coverage)** — testler artık CI'da zorunlu ve yeşil, ama kapsam hâlâ düşük (4 test).

---

## 2. Skorkart — Önce → Sonra

| # | Kapı | 4 Haz | 6 Haz | Değişim |
|---|------|:---:|:---:|---|
| 0 | Niyet & Kapsam | 🟡 | 🟡 | Kapsam geniş; resmi tek-sayfa ürün özeti hâlâ yok. |
| 1 | Mimari & Plan | 🟢 | 🟢 | types.ts artık canlı şemayla hizalı (kök-neden çözüldü). |
| 2 | Geliştirme Disiplini | 🔴 | **🟡** | 101 tip hatası→0, gerçek bug'lar düzeldi, TECH_DEBT canlı, react-query kök-neden; god-file'lar + 254 lint kaldı. |
| 3 | Test | 🔴 | **🟡** ⚠ | Testler CI'da **zorunlu kapı + yeşil**; ama coverage düşük (4 test) — **asıl açık burası.** |
| 4 | Güvenlik | 🟡 | 🟡 | npm açıkları temizlendi (**prod 0 kritik / 0 yüksek**); pen-test/SAST hâlâ yok. |
| 5 | Veri & Gizlilik (KVKK) | 🟡 | 🟡 | Adres-kaydı bug'ı düzeldi (veri artık doğru kaydediliyor); resmi veri envanteri/saklama yok. |
| 6 | Performans & Ölçek | 🟡 | 🟡 | Değişmedi (yük testi yok). |
| 7 | Altyapı & Dağıtım | 🔴 | **🟡** | **CI (typecheck+build+test) zorunlu kapı + YEŞİL.** Otomatik deploy/staging/rollback hâlâ yok. |
| 8 | Gözlem & İzleme | 🟡 | 🟡 | Sentry + health + Analytics var; SLO/alert yok. |
| 9 | Operasyon & Bakım | 🟡 | 🟡 | Yedek-geri yükleme testi/DR/runbook yok. |
| 10 | Platforma Özel | 🟡 | 🟡 | Web (PWA/SEO) iyi; mobil `cap add`/izin gerekçeleri eksik. |
| 11 | Lansman & Sonrası | 🟡 | 🟡 | 4 "eksik özellik" netleşti (aşağıda); ödeme hâlâ aktif değil. |
| 12 | Sürekli İyileştirme | 🟡 | 🟡 | CI gates + TECH_DEBT + denetim refleksi iyi; DORA metrikleri yok. |

**Önce:** 🔴 4 · 🟡 7 · 🟢 ~2 → **Sonra:** 🔴 **0** · 🟡 12 · 🟢 1

---

## 3. Bu Oturumda Yapılanlar (kanıtlı)

**Faz 0 (zemin):** next 16.1.6→16.2.7 (üretim "high" açığı kapandı), `@next/swc-win32` sabit-bağımlılığı kaldırıldı (Linux CI + Vercel build'ini kırıyordu), vitest stabil sürümde, sahte `sk_live` anahtarları + ölü `page.tsx` temizlendi, **CI workflow eklendi.**

**Tip güvenliği:** `tsc --noEmit` **101 hata → 0.** Kök-neden: `modules.d.ts` içindeki `useQuery(options:any):any` ambient override tüm react-query tiplerini `any`'ye eziyordu — kaldırıldı.

**Gerçek runtime bug'lar (canlı şema doğrulamasıyla bulundu):**
- Adres kaydı (konum-secimi) var olmayan kolonlara yazıyordu → gerçek kolonlara düzeltildi (KVKK verisi artık kaydediliyor).
- İlan kaldırma (ilanlar) geçersiz enum `'removed'` kullanıyordu → `'expired'`.
- İşletme kaydı (isletme-ekle) eksik kolonlara yazıyordu → **migration ile kolonlar eklendi** + kategori dropdown'ı canlı tablodan besleniyor.
- 2 gerçek hook-sıralama bug'ı (pazar/kategori, admin) düzeltildi.

**types.ts canlı şemadan yeniden üretildi** → 3 `as any` ve 2 servisin `@ts-nocheck`'i kaldırıldı (tip denetimi geri açıldı).

**CI sıkılaştırıldı:** typecheck + `next build` + test artık **zorunlu kapı**, koşu **yeşil** → üretim build'i hem kanıtlı hem her push'ta korunuyor.

---

## 4. Açık Denetim Bulgusu: "Yazılmış ama tablosu olmayan" 4 özellik

Bu servisler kodda var ama dayandıkları tablo canlı DB'de yok/eksik → **runtime'da çalışmazlar** (`@ts-nocheck` ile dormant):
- **Ödeme** (`payment`) → `payments` tablosu yok.
- **İşletme aboneliği** (`business-subscription`) → `business_subscriptions` tablosu yok.
- **İlan kotası** (`listing-quota`) → `user_listing_quotas` tablosu yok.
- **İçerik moderasyon** (`content-moderation`) → tablo VAR ama kolon uyumsuzlukları (düzeltilebilir).

→ **Ürün kararı:** Bu özellikler yayında olacaksa tabloları migration ile oluşturulmalı; olmayacaksa dormant kalabilir. (Detay: `TECH_DEBT.md` #3, #8.)

---

## 5. Kalan İş (öncelik sırası)

1. **K3 — Test coverage (en zayıf nokta):** Kritik akışlar (ödeme callback, ilan oluşturma, mesajlaşma, grup) için otomatik test ekle. Şu an 4 test.
2. **Eksik özellik tabloları (yukarıdaki 4):** ürün kararı + migration.
3. **K5 KVKK:** veri envanteri + saklama/silme politikası + (TC Kimlik/adres özel-nitelikli veri için) hukuki gözden geçirme.
4. **K10 mobil:** `cap add` + izin gerekçeleri + gizlilik etiketleri.
5. **God-file bölme (#6):** `askida-bagis` (1994), `kayit` (1272) vb. — bakım borcu; runtime test gerektirir.
6. **Lint borcu (254):** çoğu load-bearing supabase `any` — kademeli; market-ready için zorunlu değil (tracked).
7. **K8/K9:** SLO+alert, yedek geri-yükleme testi + runbook.

---

## 6. Hüküm

Ürün **artık sert stop-ship engeli taşımıyor** ve üretim build'i CI'da kanıtlı. Ancak 12 kapı 🟡 (sadece K1 tam 🟢) olduğu için **henüz "tam pazara hazır" değil** — özellikle **test coverage (K3)**, **eksik özellik tabloları** ve **KVKK formalizasyonu** yayından önce kapatılmalı. Tüm borç `TECH_DEBT.md`'de görünür ve planlı.
