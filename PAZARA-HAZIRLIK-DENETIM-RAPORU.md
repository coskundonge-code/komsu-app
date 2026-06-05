# Komşum_App (Mahallemiz) — Pazara Hazırlık Denetim Raporu
### "AI Architecture Rules" 13 Kapı Denetimi
**Tarih:** 4 Haziran 2026 · **Denetlenen:** `C:\dev\komsu-app` · **Yöntem:** 13 kapılı sert kapı değerlendirmesi (kanıta dayalı)

> Bu rapor, kodun gerçek taranmasıyla üretilmiştir. Her bulgunun yanında dosya/satır veya komut kanıtı vardır.

---

## 1. Yönetici Özeti

Komşum_App, **güvenlik bilinciyle kurulmuş, olgun bir temele** sahip; "vibe-coding çöpü" değil. Ancak **sert kapıya göre pazara hazır DEĞİL**: 13 kapının **4'ü kırmızı**.

**Genel hüküm:** 🔴 Yayına hazır değil — 4 kırmızı kapı kapatılmadan müşteriye açılmamalı.

**Yayını durduran 4 kapı:** K2 (dev dosyalar), K3 (test ~yok), K4 (15 npm açığı / 2 kritik), K7 (CI/CD yok).

**Teknoloji yığını:** Next.js 16.1.6 + React 19 (web) · Capacitor 7 (iOS/Android) · Supabase (Postgres + Auth, 13 migration) · Upstash Redis (rate-limit) · PayTR (ödeme, henüz aktif değil) · Sentry (izleme) · TC Kimlik/eDevlet doğrulama.

---

## 2. Skorkart

| # | Kapı | Durum | Bulgu |
|---|------|:---:|---|
| 0 | Niyet & Kapsam | 🟡 | Kapsam çok geniş (tüm özellikler + 3 para modeli + AI aynı anda); "DB entegrasyonu yarım" notu. |
| 1 | Mimari & Plan | 🟢 | Modern, katmanlı, sağlam mimari. Ödeme entegrasyonu yarım. |
| 2 | Geliştirme Disiplini | 🔴 | 1.000–2.000 satırlık ekran dosyaları; "500 satır" kuralı aşılmış. |
| 3 | Test | 🔴 | ~73.000 satır koda karşı sadece 4 test dosyası. |
| 4 | Güvenlik | 🟡 | Güçlü taban (RLS/CSP/HSTS/rate-limit) ama **15 npm açığı (2 kritik, 4 yüksek)**. |
| 5 | Veri & Gizlilik (KVKK) | 🟡 | TC Kimlik + adres = özel nitelikli veri; yasal doğrulama şart. |
| 6 | Performans & Ölçek | 🟡 | İyi temel; Türkiye-geneli hedefe karşı yük testi yok. |
| 7 | Altyapı & Dağıtım | 🔴 | CI/CD yok; yayın elle (.bat). Otomatik kapı yok. |
| 8 | Gözlem & İzleme | 🟢 | Sentry + health endpoint + Analytics. SLO/alert eksik. |
| 9 | Operasyon & Bakım | 🟡 | audit_log var; yedek/geri-yükleme testi, felaket planı, runbook yok. |
| 10 | Platforma Özel (mağaza) | 🟡 | Capacitor + PWA/SEO + hesap silme (✅); izin gerekçeleri/gizlilik etiketleri doğrulanmadı. |
| 11 | Lansman & Sonrası | 🟡 | Kurumsal sayfalar var; PayTR ödemesi aktif değil. |
| 12 | Sürekli İyileştirme | 🟡 | graphify + önceki denetim refleksi iyi; DORA/metrik döngüsü yok. |

🟢 İyi 3 · 🟡 Orta 6 · 🔴 Kritik 4

---

## 3. Kapı Kapı Bulgular ve Kanıtlar

### K0 — Niyet & Kapsam 🟡
- Ürün net: Türk mahalle/komşuluk platformu (feed, pazar, etkinlik, grup, işletme/esnaf, bağış, admin moderasyon).
- **Risk:** Kapsam çok geniş — tüm özellikler + ücretsiz/reklam/abonelik + AI moderasyon aynı anda. `CLAUDE.md`'de "incomplete DB integration in progress" notu, ürünün tamamlanmamış olduğunu doğruluyor.
- **Öneri:** "Büyük düşün, parça parça aç" — Faz 1 pilot kapsamını yazılı sabitle.

### K1 — Mimari & Plan 🟢
- Güçlü, katmanlı mimari: `src/lib/services/` iş mantığı (payment, content-moderation, address-verification, listing-quota, business-subscription, review-system), `src/lib/hooks/` React Query, `src/lib/supabase/` client/server/middleware ayrımı.
- Auth funnel: `src/middleware.ts` → konum → eDevlet/TC Kimlik doğrulama.
- **Eksik:** `next.config.ts` içinde `payment.ts` ve `payment/callback/route.ts` için geçici `@ts-nocheck` (ödeme tablosu beklemede). Ödeme akışı yarım.

### K2 — Geliştirme Disiplini 🔴
- **Aşırı büyük dosyalar** (kanıt: `wc -l`): `(main)/askida-bagis/page.tsx` **1994**, `(auth)/kayit/page.tsx` **1272**, `(main)/pazar/ilan-ver/page.tsx` **1130**, kök `page.tsx` **777**, ayrıca 8+ dosya 800–999 satır.
- `CLAUDE.md` güncel değil: "TypeScript build errors are intentionally ignored" yazıyor ama gerçek `next.config.ts` `ignoreBuildErrors: false`.
- `src` içinde **46 `console.log`**.
- **Öneri:** En büyük 5 dosyayı bileşenlere böl; doküman-kod tutarlılığını sağla; console.log temizliği.

### K3 — Test 🔴
- Test altyapısı kurulu (Vitest + Playwright, `package.json` scriptleri var) ama **toplam 4 test dosyası**: `paytr-hash`, `rate-limit`, `tc-kimlik` (unit) + `e2e/auth-flow` (1 e2e).
- Kayıt, ödeme callback, moderasyon, RLS yetki sınırları, hesap silme gibi kritik akışların otomatik testi yok.
- **Öneri:** Önce kritik 6 akışa e2e + RLS güvenlik testleri; CI'da zorunlu kıl.

### K4 — Güvenlik 🟡 (2 kritik kalem içeriyor)
**Güçlü:**
- **RLS:** 101 `create policy`, 30 tabloda `enable row level security` (kanıt: grep). Çok değerli.
- **Güvenlik başlıkları:** `next.config.ts` gerçek CSP + HSTS + X-Frame-Options + Permissions-Policy.
- **Rate-limit:** Upstash Redis (`@upstash/ratelimit`).
- `security_hardening`, `revoke_security_definer_authenticated`, `create_audit_log` migration'ları.

**Kırmızı/Risk:**
- 🔴 **15 npm güvenlik açığı — 2 kritik, 4 yüksek, 9 orta** (kanıt: `npm audit --package-lock-only`; örn. `postcss <8.5.10` XSS, `ws` bellek sızıntısı). Videodaki "npm paket açıkları" riskinin birebir karşılığı.
- 🟡 `admin/ayarlar/page.tsx:70` — `'use client'` dosyada `sk_live_…`/`sk_secret_…` desenli değerler. **Gerçek anahtar değil** (sahte demo, `handleSave` hiçbir şey kaydetmiyor) ama tehlikeli desen; gerçek sır asla istemci tarafına konmamalı.
- 🟡 `kayit/page.tsx:99` — `password: 'temppass1'` (çok adımlı kayıtta 1. adım workaround'u). Sonraki adımın gerçek şifreyi kurduğu doğrulanmalı.
- 🟡 CSP'de `script-src 'unsafe-inline'` (Next ile yaygın; mümkünse nonce'a geçilmeli).

### K5 — Veri & Gizlilik (KVKK) 🟡
- **Hassasiyet yüksek:** TC Kimlik + adres + eDevlet doğrulaması = özel nitelikli/yüksek riskli kişisel veri.
- Var: gizlilik, çerez politikası, ayarlar/gizlilik, **hesabı-sil** sayfaları.
- **Doğrulanmalı:** Açık rıza + aydınlatma metinleri, VERBİS kaydı gerekliliği, saklama süreleri, verinin saklandığı bölge (Supabase region Türkiye mi / yurt dışı aktarım), TC Kimlik şifreli saklama.

### K6 — Performans & Ölçek 🟡
- İyi: React Query cache (5 dk stale), image AVIF/WebP + 1 yıl TTL, `compress`, Upstash rate-limit.
- **Eksik:** Türkiye-geneli hedefe karşı yük testi, ölçek/yedeklilik kanıtı yok.

### K7 — Altyapı & Dağıtım 🔴
- **CI/CD yok** (`.github/workflows` yok). Yayın `commit-push-coskun.bat` / `local-sync.bat` ile elle; "iki raf" (coskun/main) akışı.
- Otomatik test + güvenlik taraması + tip kontrolü içeren bir kapı yok → hatalı/güvensiz kod canlıya gidebilir.
- Hedef: Vercel. Staging/sandbox ortamı belirsiz.

### K8 — Gözlem & İzleme 🟢
- Sentry (client/server/edge config), `api/health` endpoint, Vercel Analytics.
- **Eksik:** SLO/SLA tanımı, uyarı (alert) kuralları, uptime izleme.

### K9 — Operasyon & Bakım 🟡
- `audit_log` migration var (iyi).
- **Eksik:** Yedekleme + geri-yükleme testi, felaket kurtarma planı, olay runbook'u, bağımlılık güncelleme disiplini (15 açık birikmiş).

### K10 — Platforma Özel / Mağaza 🟡
- Capacitor 7 (camera, geolocation, push-notifications…), PWA/SEO (manifest/robots/sitemap), Permissions-Policy `geolocation=(self)`.
- ✅ **Hesap silme var** — Apple'ın zorunlu şartı karşılanıyor.
- **Doğrulanmalı:** iOS/Android native proje yapılandırması, izin kullanım gerekçeleri (Info.plist), App Store gizlilik etiketleri / privacy manifest, push (Firebase) sertifikaları, içerik moderasyon + şikâyet/engelleme akışının uçtan uca çalışması.

### K11 — Lansman & Sonrası 🟡
- Kurumsal sayfalar (iletişim, blog, hakkında, kariyer) var; Analytics var.
- **Eksik:** PayTR ödemesi aktif değil; destek kanalı + fiyat akışı + go/no-go listesi netleşmeli.

### K12 — Sürekli İyileştirme 🟡
- graphify bilgi grafiği + önceki `AUDIT_REPORT.md` (iyi refleks).
- **Eksik:** DORA metrikleri ve düzenli güvenlik/bağımlılık gözden geçirme döngüsü.

---

## 4. Öncelikli Düzeltme Planı

### Faz 0 — Acil / Hızlı kazanım (bu hafta)
1. `npm audit fix` çalıştır; kalan kritik/yüksekleri tek tek kapat (gerekirse `npm audit fix --force` etkilerini test ederek). → K4
2. Basit **CI** kur: GitHub Actions ile her push'ta `lint` + `test` + `build` + `npm audit`. → K7
3. `admin/ayarlar` sahte sır desenini kaldır; admin ayarlarını gerçek (sunucu tarafı) yap ya da net "MOCK" işaretle. → K4
4. `kayit` akışında sonraki adımın gerçek şifreyi kurduğunu doğrula/test et. → K3/K4

### Faz 1 — Yayın öncesi şart (kırmızıları kapat)
5. En büyük 5 dosyayı bileşenlere böl (≤500 satır hedefi). → K2
6. Kritik 6 akışa otomatik test (kayıt, ödeme callback, moderasyon, RLS sınırları, hesap silme, adres doğrulama). → K3
7. KVKK paketi: rıza + aydınlatma + saklama + VERBİS + veri bölgesi doğrulaması. → K5
8. Yük testi (hedef tepe trafiğin üstü) + temel SLO/alert. → K6/K8
9. Yedekleme + geri-yükleme testi + kısa runbook. → K9
10. Mağaza ön-uçuş: izin gerekçeleri, gizlilik etiketleri, moderasyon/şikâyet akışı uçtan uca. → K10

### Faz 2 — Sonrası
11. PayTR ödemesini tamamla + abonelik/reklam fazlarını sırayla aç. → K1/K11
12. DORA metrikleri + düzenli güvenlik/bağımlılık gözden geçirme döngüsü. → K12

---

## 5. Pazara Çıkış Karar Tablosu

| Soru | Cevap |
|------|-------|
| Bugün müşteriye açılabilir mi? | **Hayır** — 4 kırmızı kapı açık. |
| En kısa "güvenli pilot" yolu? | Faz 0 + Faz 1 (madde 1–10) tamamlanınca tek mahalle pilotu. |
| En büyük tekil risk? | 15 npm açığı (2 kritik) + test yokluğu → fark edilmeyen bozulma/saldırı yüzeyi. |
| En güçlü yön? | RLS + güvenlik başlıkları + moderasyon + hesap silme: sağlam güvenlik tabanı. |

---

## Ek — Kanıt Özeti
- `npm audit --package-lock-only` → 15 açık (2 kritik, 4 yüksek, 9 orta).
- `wc -l` → `askida-bagis/page.tsx` 1994, `kayit/page.tsx` 1272, `pazar/ilan-ver/page.tsx` 1130, kök `page.tsx` 777.
- `grep "create policy"` → 101; `enable row level security` → 30.
- Test dosyası sayısı → 4. `.github/workflows` → yok.
- `admin/ayarlar/page.tsx:70` sahte `sk_live…`; `kayit/page.tsx:99` `temppass1`.
- `next.config.ts` → CSP + HSTS + güvenlik başlıkları mevcut (🟢).
- `.env.example` → temiz (sızıntı yok); entegrasyonlar: Supabase, PayTR, Resend, Firebase FCM, Sentry, Upstash, Google Maps.
