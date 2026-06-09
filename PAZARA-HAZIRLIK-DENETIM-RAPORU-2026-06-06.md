# Komşum_App (Mahallemiz) — Pazara Hazırlık Denetim Raporu (GÜNCEL)
### "AI Architecture Rules" 13 Kapı — İlerleme Denetimi
**Tarih:** 6–7 Haziran 2026 · **Önceki rapor:** 4 Haziran 2026 · **Denetlenen:** `C:\dev\komsu-app` (branch: coskun)
**Yöntem:** Kanıta dayalı (canlı Supabase şeması `execute_sql` ile sorgulandı; tsc/vitest/CI ve canlı Vercel HTTP çıktıları kullanıldı). Tahminle puanlama yok.

---

## 1. Yönetici Özeti (sade)

4 Haziran'da ürün **🔴 pazara hazır DEĞİL** idi (4 kırmızı kapı yayını durduruyordu). 6–7 Haziran çalışmasından sonra:

**Genel hüküm:** 🟡 **Sert "yayını durduran" engel (🔴) kalmadı.** Ürün artık "yayınla butonuna basılamaz" durumundan, **"birkaç sahip-işi + iyileştirme kapat, sonra yayınla"** durumuna geçti. Çekirdek iş mantığı tip-güvenli, testli ve CI korumalı; canlı Vercel sitesi doğru çalışıyor; güvenlik başlıkları üretimde aktif.

**Bu oturumda (6–7 Haz) kapanan kritik işler:**
- **Hesap silme çökmüştü → onarıldı.** (KVKK "unutulma hakkı" + Apple/Google mağaza zorunluluğu artık gerçekten çalışıyor — aşağıda detay.)
- **Son tip-kapalı dosya açıldı:** `content-moderation.ts` `@ts-nocheck` kaldırıldı → **projede 0 `@ts-nocheck`.**
- **Testler 4'ten 141'e çıktı** (11 dosya, hepsi CI'da yeşil).
- **Canlı Vercel + Chrome duman testi geçti.**

**En zayıf kalan alan:** entegrasyon/uçtan-uca (e2e) test katmanı + sahibin yapması gereken 3 ortam ayarı (aşağıda).

---

## 2. Skorkart — 4 Haz → 7 Haz (güncel)

| # | Kapı | 4 Haz | 7 Haz | Değişim / kanıt |
|---|------|:---:|:---:|---|
| 0 | Niyet & Kapsam | 🟡 | 🟡 | Kapsam geniş; resmi tek-sayfa ürün özeti hâlâ yok. |
| 1 | Mimari & Plan | 🟢 | 🟢 | types.ts canlı şemayla hizalı; **0 `@ts-nocheck`**, `tsc --noEmit` = **0 hata**. |
| 2 | Geliştirme Disiplini | 🔴 | **🟡** | Tüm tip-kapalı dosyalar açıldı (0 `@ts-nocheck`), tip hataları 0, TECH_DEBT canlı. God-file'lar + ~254 lint kaldı. |
| 3 | Test | 🔴 | **🟢** \* | **141 test / 11 dosya, CI'da zorunlu kapı + yeşil** (4 Haz'da 4 test idi). \* Birim/sözleşme katmanı sağlam; DB'ye giden akışlar için e2e katmanı henüz yok (sonraki adım). |
| 4 | Güvenlik | 🟡 | 🟡 | **CSP + HSTS(preload) + X-Frame/nosniff/Referrer/Permissions başlıkları canlı üretimde doğrulandı**; RLS + DB advisors temiz; prod npm 0 kritik/0 yüksek. SAST/pen-test ve 1 sahip-toggle (sızmış-parola koruması) eksik. |
| 5 | Veri & Gizlilik (KVKK) | 🟡 | 🟡 ⤴ | **Hesap silme FK zinciri onarıldı → silme artık çalışıyor**; gerçek `/kvkk` sayfası + veri envanteri + silme arayüzü/API var. Eksik: prod'a `SUPABASE_SERVICE_ROLE_KEY` (sahip), saklama politikası, TC Kimlik özel-nitelikli veri için hukuki gözden geçirme. |
| 6 | Performans & Ölçek | 🟡 | 🟡 | Değişmedi (yük testi yok). |
| 7 | Altyapı & Dağıtım | 🔴 | **🟡** | CI (typecheck+build+test) **zorunlu + YEŞİL**. Önizleme build'leri **bilerek kapalı** ("Ignored Build Step" — maliyet tasarrufu). Otomatik deploy/staging/rollback yok. |
| 8 | Gözlem & İzleme | 🟡 | 🟡 | Sentry + health + Analytics var; SLO/alert yok. |
| 9 | Operasyon & Bakım | 🟡 | 🟡 | Yedek-geri yükleme testi/DR/runbook yok. |
| 10 | Platforma Özel | 🟡 | 🟡 ⤴ | Web (PWA/SEO) iyi; **hesap silme (Apple/Google mağaza zorunluluğu) artık karşılanabilir**. Mobil `cap add`/izin gerekçeleri eksik. |
| 11 | Lansman & Sonrası | 🟡 | 🟡 ⚠ | **Para kazanma katmanı bütünüyle prototip** (aşağıda §7): tek gerçek uç PayTR ama UI'lar sahte/test-verisiyle bağlı. Anahtar yokken hiçbir şey tahsil etmiyor (güvenli). **Wire edilmeden monetizasyon açılmamalı.** |
| 12 | Sürekli İyileştirme | 🟡 | 🟡 | CI gates + TECH_DEBT + denetim refleksi iyi; DORA metrikleri yok. |

**4 Haz:** 🔴 4 · 🟡 7 · 🟢 2 → **7 Haz:** 🔴 **0** · 🟡 10 · 🟢 **3** (K1, K3 + K2 güçlü-sarı)

---

## 3. Bu Oturumda (6–7 Haz) Yapılanlar (kanıtlı)

**1) KRİTİK: Hesap silme çökmesi onarıldı (K5/K10 stop-ship).**
Canlı şemada `profiles`'a bağlı **10 yabancı anahtar `ON DELETE NO ACTION`** ile duruyordu → `DELETE FROM profiles` engelleniyor → **neredeyse her kullanıcı için hesap silme başarısız** (özellikle `ad_impressions`). `fix_account_deletion_fk_ondelete` migration'ı uygulandı: analitik/denetim/grup için `SET NULL`, kullanıcı-içeriği için `CASCADE`, `moderation_actions.moderator_id` & `reports.reporter_id` için `DROP NOT NULL` + `SET NULL`. **Doğrulandı: 30 CASCADE + 12 SET NULL, 0 NO ACTION kaldı**; `auth.users` silme yolu da açıldı. `types.ts` nullable kolonlarla hizalandı.

**2) Son tip-kapalı dosya açıldı.** `content-moderation.ts` (771 satır) canlı şemaya hizalandı, `@ts-nocheck` kaldırıldı → **projede 0 `@ts-nocheck`** (grep ile doğrulandı), `tsc --noEmit` = **0 hata**.

**3) Test kapsamı 4 → 141.** Yeni: `content-moderation` (22), `format-edge` (32), `pricing-extra` (15), `business-subscription` (11), `payment-logic` (10). Toplam **11 dosya / 141 test**, `vitest run` = **hepsi geçti**, CI'da zorunlu kapı.

**4) Güvenlik başlıkları canlı üretimde doğrulandı.** `https://komsu-app.vercel.app` yanıtında tam CSP, `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`, `X-Frame-Options`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` mevcut. DB advisors DDL sonrası yeniden tarandı → yeni sorun yok.

**5) Chrome + Vercel duman testi geçti.**
- **Yerel (Chrome/preview):** 11 rota HTTP 200; `/giris`, `/kayit`, `/kvkk` render edildi; sadece zararsız dev-only konsol mesajları.
- **Canlı Vercel (prod):** Açık sayfalar 200 (`/giris`, `/kayit`, `/kvkk`, `/gizlilik`); korumalı rotalar temiz **307 → `/giris?next=<yol>`** huni yönlendirmesi (döngü yok); güvenlik başlıkları canlı.

---

## 4. Sahibin Yapması Gerekenler (yayından önce — koddan değil panelden)

1. **Vercel prod ortamına `SUPABASE_SERVICE_ROLE_KEY` ekle.** Bu anahtar olmadan hesap-silme API'si güvenli şekilde **503** döner (kod bilerek böyle degrade ediyor). Anahtar girilince silme uçtan uca çalışır.
2. **Supabase Auth → "Leaked password protection" toggle'ını aç.** (Advisors'ın işaret ettiği tek sahip-ayarı.)
3. **"deploy et" de.** Bu oturumun tüm işi `coskun` rafında, **CI ile build-doğrulanmış ama henüz CANLI DEĞİL.** Üretim hâlâ eski `main` (Nisan) kodunu sunuyor. Önizlemeler bilerek kapalı olduğu için, yeni iş ancak açık "deploy et" talimatıyla `main`'e gidip yayınlanır.
4. **Para almayı açmadan önce karar ver (önemli):** Ödeme katmanı şu an prototip (§7). PayTR canlı anahtarlarını girmeden ve akışları gerçek modale bağlayıp küçük tutarla test etmeden monetizasyonu açma. Hangi akışların (ilan ücreti / öne çıkarma / esnaf üyeliği / bağış) para alacağına karar ver — gerisini ben wire ederim. Anahtar girilmediği sürece sistem zaten tahsilat yapmıyor (güvenli "ücretsiz" durumu).

---

## 7. Ek Bulgu (7 Haz): Prototip/sahte kod taraması

Tüm uygulama "çalışıyor gibi görünüp pazarda patlayacak" kod için tarandı. Tespitler (detay: `TECH_DEBT.md` #9–12):

- **Para kazanma katmanı — sahte UI'lar bu turda temizlendi; canlı tahsilat hâlâ test bekliyor (en önemli bulgu).** Tek gerçek uç `/api/payment` (PayTR, tip-güvenli). **Düzeltildi (7 Haz):** `isletme-paneli/uyelik` artık gerçek kullanıcı + gerçek işletme + gerçek abonelik servisine (`checkSubscriptionStatus`/`activateSubscription`/`cancelSubscription`) bağlı, PayTR'a **gerçek kimlikle** gidiyor (`user_123` ve sahte üyelik/ödeme-geçmişi kaldırıldı); `pazar/odeme` orphan sahte akışı `redirect('/pazar')` ile nötrlendi ve onun kullandığı **gerçek kart numarası TOPLAYAN** `marketplace/payment-modal` artık hiçbir canlı yoldan çağrılmıyor (PCI mayını emekli); `esnaf-kayit` sahte adres-doğrulamasıyla birlikte `redirect('/isletme-ekle')` ile gerçek onboarding'e yönlendirildi. **Kalan:** `pazar/ilan-ver` dürüstçe ücretsiz; `/api/payment` anahtar yokken simülasyon modunda; **hiçbir akış uçtan uca gerçek para tahsil ettiği hâlâ doğrulanmadı** → yayından önce ürün kararı + PayTR canlı anahtarı + küçük tutarla e2e test. (Kapatılan `askida-bagis` sahte-kart formu = §3/#9.)
- **AI görsel moderasyonu fail-open.** `content-moderation.ts` var olmayan `/api/moderate-media`'ya gidiyor → görsel AI denetimi fiilen kapalı (içerik geçer). Dosya tipi/boyut + insan moderasyonu çalışıyor; çökme yok. → Yasadışı/NSFW görsel riski; AI uç inşa edilmeli.
- **Esnaf-kayıt sahte adres doğrulaması — düzeltildi (7 Haz).** `esnaf-kayit:335` butonu gerçek e-Devlet çağrısı yapmadan `setAddressVerified(true)` yapıyordu → sahte güven rozeti. Bu sayfa zaten gerçek onboarding (`/isletme-ekle`: gerçek `insert` + `startFreeTrial`) tarafından asılmıştı ve hiçbir yerden link almıyordu; `redirect('/isletme-ekle')` ile yönlendirildi, sahte kod erişilemez legacy'de korundu. ✅
- **~12 sayfada mock fallback.** DB boş/hatalıyken sahte içerik (örn. "Moda Fırın" sahte işletme, sahte ilan/blog) gösterilebilir. Admin tarafı dürüst (`MockDataBanner`); risk son-kullanıcı sayfalarında. → Boş-durum bileşenleriyle değiştirilmeli.

**Hüküm değişikliği:** Bunlar yeni bir sert 🔴 yaratmıyor çünkü en tehlikeli + erişilebilir olan (askida-bagis sahte-kart) kapatıldı ve PayTR anahtarı yokken sistem tahsilat yapmıyor. Ama **monetizasyon "açma" anı bir kapıdır**: anahtarlar girilmeden ve akışlar wire edilip test edilmeden para alma açılmamalı.

---

## 5. Kalan İş (öncelik sırası — bakım borcu, stop-ship değil)

1. **K3 — e2e/entegrasyon testi:** Ödeme callback, ilan oluşturma, mesajlaşma, hesap silme için DB'ye dokunan uçtan-uca testler. (Birim katmanı tamam.)
2. **K5 KVKK formalizasyonu:** saklama/silme politikası + TC Kimlik/adres özel-nitelikli veri için hukuki gözden geçirme.
3. **K10 mobil:** `cap add` + izin gerekçeleri + gizlilik etiketleri.
4. **God-file bölme:** `askida-bagis` (~1994), `kayit` (~1272), `pazar/ilan-ver` (~1130) — runtime testi gerektirir.
5. **Lint borcu (~254):** çoğu load-bearing supabase `any`; kademeli, market-ready için zorunlu değil (tracked).
6. **K8/K9:** SLO+alert, yedek geri-yükleme testi + runbook.

---

## 6. Hüküm

Ürün **artık sert stop-ship engeli taşımıyor**, üretim build'i CI'da kanıtlı (tsc 0 hata · 141 test yeşil), canlı Vercel sitesi doğru çalışıyor ve güvenlik başlıkları üretimde aktif. Bu oturumda **hesap-silme çökmesi** (yayın için gerçek bir engeldi) onarıldı, **0 `@ts-nocheck`** kalmadı ve test kapsamı **35 kat** arttı.

Yine de **"tam pazara hazır" demek için 10 kapı 🟡** — özellikle **sahibin 3 panel-işi** (service-role anahtarı, parola-koruma toggle, "deploy et"), **para kazanma katmanının wire edilmesi** (§7 — prototip; anahtar+karar gerektirir), ve **e2e test + KVKK formalizasyonu** yayından önce kapatılmalı. 7 Haz taraması, "çalışıyor gibi görünüp pazarda patlayacak" birkaç prototip akış buldu; en tehlikelisi (askida-bagis sahte-kart) kapatıldı, gerisi `TECH_DEBT.md` #9–12'de görünür + planlı. **Yeşil CI = "build geçiyor"; "her senaryo test edildi / her özellik gerçek" demek değildir** — bunu yayından önce aklında tut.
