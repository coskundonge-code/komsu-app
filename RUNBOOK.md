# RUNBOOK.md — Mahallemiz İşletim Kılavuzu (K9: Operasyon & Bakım)

> **Amaç:** Uygulama yayına alındıktan sonra "kim, ne zaman, nasıl" sorularının
> tek kaynağı. Bir şey ters gittiğinde panikle değil, bu kılavuzla hareket edilir.
>
> **Bu kılavuz teknik bir operatör içindir.** Proje sahibi (kod bilmeyen) için her
> bölümün başında **sade özet** vardır; detaylı komutlar teknik kişi içindir.
>
> Son güncelleme: 2026-06-07 · İlgili kapılar: K4 (Güvenlik), K7 (Altyapı),
> K8 (Gözlem), K9 (Operasyon), K5 (Veri & Gizlilik / KVKK).

---

## İçindekiler

1. [Sistem haritası — neyin nerede olduğu](#1-sistem-haritası)
2. [Ortam değişkenleri & sırlar (secrets)](#2-ortam-değişkenleri--sırlar)
3. [Dağıtım (deploy) prosedürü](#3-dağıtım-deploy-prosedürü)
4. [Veritabanı (Supabase): yedek, geri yükleme, migration](#4-veritabanı-supabase)
5. [Hata izleme & gözlem (K8)](#5-hata-izleme--gözlem)
6. [Olay müdahale (incident response)](#6-olay-müdahale)
7. [Anahtar rotasyonu (key rotation)](#7-anahtar-rotasyonu)
8. [KVKK — veri sahibi başvuru prosedürü](#8-kvkk-veri-sahibi-başvuru-prosedürü)
9. [Hesap silme & veri saklama operasyonu](#9-hesap-silme--veri-saklama)
10. [Felaket kurtarma (disaster recovery)](#10-felaket-kurtarma)
11. [Bakım takvimi](#11-bakım-takvimi)
12. [Yayın öncesi son kontrol listesi](#12-yayın-öncesi-son-kontrol-listesi)

---

## 1. Sistem haritası

**Sade özet:** Uygulama üç parçadan oluşur: (a) kullanıcının gördüğü web/mobil
arayüz (Vercel'de barınır), (b) veritabanı + giriş sistemi (Supabase), (c) dışarıdan
bağlanan servisler (ödeme = PayTR, kimlik doğrulama = e-Devlet, harita, e-posta).

| Parça | Teknoloji | Nerede barınır | Yönetim paneli |
|---|---|---|---|
| Web/mobil arayüz | Next.js 16 (App Router) + Capacitor 7 | Vercel | vercel.com |
| Veritabanı + Auth + Depolama | Supabase (Postgres + RLS) | Supabase Cloud | supabase.com/dashboard |
| Ödeme | PayTR (hosted page + webhook) | — | paytr.com mağaza paneli |
| Kimlik/adres doğrulama | e-Devlet kazıma (puppeteer) | Vercel fonksiyonu | — |
| Hız sınırlama (rate limit) | Upstash Redis (opsiyonel) | Upstash | upstash.com |
| Hata izleme | Sentry (opsiyonel, DSN yoksa NO-OP) | Sentry | sentry.io |

- **Supabase proje kimliği:** `dogjnzcofvpsqbepdaek`
- **Üretim URL'i:** `https://komsu-app.vercel.app` (özel alan adı bağlanınca güncelle)
- **Kod deposu dalları:** `coskun` = geliştirme rafı · `main` = üretim (canlı)

---

## 2. Ortam değişkenleri & sırlar

**Sade özet:** Uygulamanın çalışması için gereken "şifreler/anahtarlar" buradadır.
Bunlar koda yazılmaz; Vercel panelinde saklanır. Anahtarlar asla e-posta/sohbet ile
paylaşılmaz, asla git'e commit edilmez (`.env*` dosyaları `.gitignore`'da).

### Zorunlu (bunlar olmadan uygulama açılmaz)
| Değişken | Nereden alınır | Not |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | Herkese açık (public) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → API | Herkese açık; RLS ile korunur |

### Sunucu tarafı sırlar (gizli — yalnızca Vercel'de, `NEXT_PUBLIC_` ÖNEKİ YOK)
| Değişken | Ne işe yarar | Kritiklik |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | RLS'i baypas eden tam yetki (webhook'lar, admin işlemleri) | **ÇOK YÜKSEK** — sızarsa tüm veri açığa çıkar |
| `PAYTR_MERCHANT_ID` / `PAYTR_MERCHANT_KEY` / `PAYTR_MERCHANT_SALT` | Ödeme tahsilatı + webhook imza doğrulama | **YÜKSEK** — sızarsa sahte ödeme/iade |
| `PAYTR_TEST_MODE` | `true` iken gerçek para çekilmez | Canlıda `false` yap |
| `RESEND_API_KEY` | E-posta gönderimi | Orta |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Hız sınırlama | Orta |
| `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` | Hata izleme | Düşük (yoksa NO-OP) |

### Herkese açık opsiyonel
`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_FIREBASE_API_KEY`,
`NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_BASE_URL`.

> Tam liste + örnek değerler: depo kökündeki **`.env.example`**. Yerel geliştirme için
> `.env.example`'ı `.env.local` olarak kopyala ve doldur. **`.env.local` asla commit edilmez.**

**Altın kural:** `NEXT_PUBLIC_` öneki olan her şey tarayıcıya gönderilir (gizli değildir).
Gerçek bir sır asla `NEXT_PUBLIC_` ile başlamamalıdır.

---

## 3. Dağıtım (deploy) prosedürü

**Sade özet:** Değişiklikler önce `coskun` rafında denenir. Hazır olunca `main`'e
taşınır; Vercel otomatik canlıya alır. **`main`'e geçiş = canlıya çıkmak** demektir,
bu yüzden yalnızca sahip "deploy et" deyince yapılır.

### Dal modeli
```
coskun  (geliştirme rafı)  ──►  main  (üretim/canlı)  ──►  Vercel otomatik deploy
```
- Her `coskun` ve `main` push'unda **CI çalışır** (aşağıdaki kapılar).
- Vercel **`main`** dalını canlıya, diğer dalları "önizleme (preview)" URL'ine alır.

### CI kapıları (`.github/workflows/ci.yml`)
Push edilince GitHub Actions şunları çalıştırır:

| Adım | Zorunlu mu? | Komut |
|---|---|---|
| Lint | Bilgi amaçlı (bloklamaz) | `npm run lint` |
| **Typecheck** | **ZORUNLU** | `npx tsc --noEmit` |
| **Birim testler** | **ZORUNLU** | `npm run test` (vitest) |
| **Üretim build** | **ZORUNLU** | `npm run build` |
| Bağımlılık taraması | Bilgi amaçlı | `npm audit --audit-level=high` |
| E2E duman testi | Bilgi amaçlı | `npm run test:e2e` |

**Üç ZORUNLU kapıdan biri kırmızıysa o kod canlıya gitmemelidir.**

### Deploy adımları (teknik operatör)
1. **Yerelde kapıları geçir** (CI'ı beklemeden erken yakala):
   ```bash
   npx tsc --noEmit --incremental false   # taze tip denetimi (test dosyaları dahil)
   npm run test                           # vitest
   npm run build                          # üretim derlemesi
   ```
   > **Tuzak:** `tsconfig.json`'da `incremental:true` var → düz `npx tsc --noEmit`
   > bayat önbellekle **yanlış yeşil** verebilir. Yetkili komut: `--incremental false`.
2. `coskun`'a push → CI yeşil olduğunu doğrula (GitHub → Actions).
3. **Sahip "deploy et" dediyse** `coskun`'u `main`'e birleştir:
   ```bash
   git checkout main && git merge coskun && git push origin main
   git checkout coskun
   ```
4. Vercel otomatik deploy eder. **Deploy sonrası duman testi:** üretim URL'inde giriş,
   feed, bir ilan açma, harita yükleme manuel kontrol.
5. Sorun varsa → [Bölüm 6: Olay müdahale](#6-olay-müdahale) → geri alma (rollback).

> **KURAL:** `main`'e push / canlı deploy YALNIZCA sahip açıkça "deploy et" deyince.
> `coskun` push'u serbest. `git push --force main` ve `git reset --hard` yapılmaz.

### Mobil (Capacitor) yayını
```bash
npm run app:build      # next build && npx cap sync
npm run cap:open:ios   # Xcode açar → App Store
npm run cap:open:android  # Android Studio → Play Store
```
Mağaza gönderiminden önce [Bölüm 12](#12-yayın-öncesi-son-kontrol-listesi) zorunlu.

---

## 4. Veritabanı (Supabase)

**Sade özet:** Tüm kullanıcı verisi Supabase'de. Düzenli yedek alınır; bir tablo
değişikliği (migration) yapılırken önce canlı şema kontrol edilir, sonra uygulanır.
Yıkıcı işlem (tablo silme, toplu veri silme) önce sahibe bildirilmeden yapılmaz.

### Yedekleme (backup)
- **Otomatik:** Supabase Pro planı **Point-in-Time Recovery (PITR)** sunar. Dashboard →
  Database → Backups bölümünden PITR'in **açık** olduğunu doğrula. (Free planda yalnızca
  günlük yedek; üretim için Pro + PITR önerilir.)
- **Manuel anlık yedek (büyük değişiklik öncesi):**
  ```bash
  # Supabase bağlantı dizesini Dashboard → Settings → Database'den al
  pg_dump "postgresql://...connection-string..." -F c -f yedek_$(date +%Y%m%d).dump
  ```
- **Saklama:** Manuel yedekleri şirket dışı güvenli depoda tut (uygulama sunucusuyla
  aynı yerde tutma). En az 30 gün sakla.

### Geri yükleme (restore)
- **Noktasal kurtarma:** Dashboard → Database → Backups → PITR → hedef zaman seç.
- **Dump'tan:** `pg_restore -d "postgresql://..." --clean yedek_YYYYMMDD.dump`
- **Geri yükleme YIKICIDIR** (mevcut veriyi ezer) → önce sahibe bildir, mümkünse önce
  bir test/branch ortamında dene.

### Migration (şema değişikliği) — altın kural
1. **ÖNCE canlı şemayı doğrula** (asla varsayma):
   ```sql
   -- Supabase SQL Editor'de veya MCP execute_sql ile
   SELECT column_name, data_type, is_nullable
   FROM information_schema.columns
   WHERE table_name = 'HEDEF_TABLO' ORDER BY ordinal_position;
   ```
2. Değişikliği **additive (ekleyici)** tasarla: yeni kolon/tablo ekle; mevcut kolonu
   silmek/yeniden adlandırmak yerine önce ekle-doldur-sonra-temizle (genişlet/daralt).
3. **Her yeni tablo MUTLAKA RLS + politika ile doğar.** RLS'siz tablo = açık veri.
   ```sql
   ALTER TABLE yeni_tablo ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "kendi_kaydini_gorur" ON yeni_tablo
     FOR SELECT USING (auth.uid() = user_id);
   ```
4. Migration'ı **Supabase migration** olarak uygula (MCP `apply_migration` veya
   Dashboard). Uygulamadan sonra `npx supabase gen types` ile `src/lib/supabase/types.ts`
   güncellenir (bu dosya elle düzenlenmez).
5. **Güvenlik danışmanını çalıştır:** Dashboard → Advisors (veya MCP `get_advisors`) →
   yeni RLS/politika uyarısı kalmadığını doğrula.

> **Yıkıcı SQL (DROP TABLE, DELETE, TRUNCATE) önce sahibe bildirilmeden çalıştırılmaz.**
> Geri dönüşü yoktur; önce yedek + onay.

---

## 5. Hata izleme & gözlem

**Sade özet:** Bir şey patlarsa nasıl haberdar oluruz? Uygulama hataları merkezî bir
yerde toplanır (Sentry — opsiyonel). Sentry bağlı değilse hatalar yine de sunucu
loglarına yazılır ama otomatik uyarı gelmez.

### Mevcut altyapı (K8)
- Hata yakalama sarmalayıcısı kodda **kuruludur** ama **Sentry DSN olmadan NO-OP** çalışır
  (hata fırlatmaz, sessizce geçer). DSN girilince otomatik aktifleşir.
- **Aktive etmek için:** Sentry.io'da proje aç → DSN'i al → Vercel'e `SENTRY_DSN` +
  `NEXT_PUBLIC_SENTRY_DSN` ekle → redeploy.

### Nereye bakılır
| Ne | Nerede |
|---|---|
| Uygulama çalışma-zamanı logları | Vercel → Project → Logs (veya MCP `get_runtime_logs`) |
| Build/deploy logları | Vercel → Deployments → ilgili deploy |
| Veritabanı logları + yavaş sorgu | Supabase → Logs / Reports |
| Auth (giriş) sorunları | Supabase → Authentication → Logs |
| Ödeme webhook'ları | PayTR mağaza paneli + Vercel logs (`/api/payment/callback`) |
| Güvenlik/RLS uyarıları | Supabase → Advisors |

### Asgari uyarı kurulumu (öneri)
- Sentry'de "yeni hata" + "hata oranı artışı" için e-posta/Slack uyarısı.
- Vercel'de deploy başarısızlığı bildirimi (varsayılan açık).
- Supabase'de disk/bağlantı limiti uyarısı (plan limitine yaklaşınca).

---

## 6. Olay müdahale

**Sade özet:** Canlı sistem bozulduğunda izlenecek sıralı adımlar. Önce **kanamayı
durdur** (geri al), sonra sebebini araştır.

### Önem dereceleri
| Seviye | Örnek | Hedef müdahale süresi |
|---|---|---|
| **SEV1 — kritik** | Site tamamen kapalı, giriş çalışmıyor, ödeme/veri sızıntısı | Hemen |
| **SEV2 — yüksek** | Önemli bir özellik bozuk (feed, ilan, mesaj) | Saatler içinde |
| **SEV3 — düşük** | Kozmetik hata, küçük sayfa sorunu | Sonraki sürüm |

### Genel akış
1. **Tespit:** Sentry/Vercel uyarısı veya kullanıcı bildirimi.
2. **Sınıflandır:** SEV1/2/3 (yukarıdaki tablo).
3. **Durdur (SEV1):** Son deploy bozduysa → **anında geri al:**
   - Vercel → Deployments → son **çalışan** deploy → **"Promote to Production"**
     (kodu değiştirmeden saniyeler içinde eski sürüme döner). Bu en hızlı geri almadır.
   - Alternatif (git): `git revert <bozuk_commit>` → `main`'e push → Vercel yeni deploy.
     `git reset --hard`/force-push **kullanılmaz**.
4. **İzole et:** Sorun kod mu (Vercel logs), veri/RLS mi (Supabase logs), dış servis mi
   (PayTR/e-Devlet durum sayfası)?
5. **Düzelt:** Önce `coskun`'ta düzelt + CI yeşil → sonra `main`.
6. **Doğrula:** Üretimde duman testi.
7. **Kayıt:** Olayı kısa bir not olarak `TECH_DEBT.md`'ye veya bir olay kaydına yaz
   (ne oldu, neden, nasıl çözüldü, tekrarını önlemek için ne yapılacak).

### Sık olaylar → ilk bakılacak yer
- **"Giriş yapılamıyor"** → Supabase Auth logs + Supabase servis durumu (status.supabase.com).
- **"Sayfa 500 hatası"** → Vercel runtime logs (ilgili route).
- **"Ödeme alınamıyor / çift tahsilat"** → PayTR panel + `/api/payment/callback` logları;
  `PAYTR_TEST_MODE` değerini kontrol et.
- **"Veri görünmüyor ama DB'de var"** → büyük olasılıkla RLS politikası; Supabase Advisors.
- **"Kullanıcı sahte içerik görüyor"** → mock fallback kalıntısı; `TECH_DEBT.md #12`.

---

## 7. Anahtar rotasyonu

**Sade özet:** Şifreler/anahtarlar belirli aralıklarla veya sızıntı şüphesinde
**yenilenir**. Eski anahtar iptal edilir. Bu, "anahtar çalınsa bile zararı sınırlama"
sigortasıdır.

### Ne zaman rotasyon?
- **Planlı:** Yüksek kritiklikteki sırlar için en az **6 ayda bir**.
- **Acil (hemen):** Sır git'e commit'lendi, log'a düştü, yanlış kişiyle paylaşıldı veya
  ekipten kritik erişimli biri ayrıldıysa.

### Anahtar bazında prosedür
| Anahtar | Nasıl yenilenir | Sonra ne yapılır |
|---|---|---|
| **Supabase service_role** | Dashboard → Settings → API → "Roll" / yeni key üret | Vercel'de `SUPABASE_SERVICE_ROLE_KEY` güncelle → redeploy |
| **Supabase anon key** | Aynı panel (genelde JWT secret rotasyonuyla) | `NEXT_PUBLIC_SUPABASE_ANON_KEY` güncelle → redeploy |
| **PayTR merchant key/salt** | PayTR mağaza paneli → güvenlik | 3 PayTR değişkenini güncelle → callback imzasını test et |
| **Resend / Upstash / Sentry** | İlgili servis panelinde "revoke + yeni token" | İlgili Vercel değişkenini güncelle → redeploy |

**Rotasyon altın kuralı:** Önce yeni anahtarı ekle + doğrula, **sonra** eskiyi iptal et
(kesintiyi önlemek için). Service_role gibi tek anahtarlarda kısa bakım penceresi planla.

> **Sızıntı müdahalesi:** Bir sır yanlışlıkla commit'lendiyse — anahtarı **döndürmek
> zorunludur** (git geçmişinden silmek tek başına yetmez; anahtar zaten görülmüş sayılır).

---

## 8. KVKK — veri sahibi başvuru prosedürü

**Sade özet:** Bir kullanıcı "verilerimi göster / sil / düzelt" derse, 6698 sayılı Kanun
gereği **en geç 30 gün** içinde yanıt vermek **zorunludur**. Bu, yasal bir yükümlülüktür,
opsiyonel değildir. Başvurular `kvkk@mahallem.com`'a gelir.

### Yasal çerçeve
- **6698 sayılı KVKK Madde 11** — ilgili kişinin hakları (bilgi alma, erişim, düzeltme,
  silme, aktarım bilgisi, itiraz, zarar tazmini).
- **Madde 13** — veri sorumlusu başvuruyu **en geç 30 gün** içinde sonuçlandırır.
- Aydınlatma metni: `src/app/(main)/kvkk/page.tsx` (uygulamada `/kvkk`).

### Adım adım işleyiş
1. **Kayıt:** Başvuruyu tarih/saat + kimlik + talep türüyle kaydet (KVKK başvuru defteri).
2. **Kimlik doğrula:** Başvuranın gerçekten o hesabın sahibi olduğunu doğrula (yetkisiz
   kişiye veri verme — bu da bir ihlaldir). Hesap e-postası üzerinden teyit.
3. **Talep türüne göre işle:**
   - **Erişim/bilgi ("verilerimi göster"):** Kullanıcının `profiles`, ilanları, gönderileri,
     mesajları, ödemeleri ilgili `user_id` ile dışa aktar (SQL SELECT → güvenli format).
   - **Düzeltme:** Yanlış veriyi uygulamadan veya DB'den düzelt.
   - **Silme ("unutulma"):** [Bölüm 9](#9-hesap-silme--veri-saklama) prosedürünü uygula.
   - **İşlemeye itiraz / rıza geri çekme:** İlgili açık-rıza temelli işlemeyi durdur
     (örn. pazarlama e-postası).
4. **Yanıtla:** 30 gün içinde yazılı yanıt ver. Talep reddediliyorsa **gerekçesini** yaz.
5. **Kapat:** Başvuru defterine sonucu ve tarihi işle.

> **Önemli kapsam notu:** TC Kimlik Numarası ve kart bilgisi sistemde **saklanmaz**
> (e-Devlet doğrulaması anlık yapılır, kart PayTR'da işlenir) → "verilerimi göster"de bu
> ikisi zaten yoktur. Bu, hem doğru yanıt hem de uyum lehine bir gerçektir.

> **Kurul şikâyeti:** Kullanıcı yanıttan memnun değilse Kişisel Verileri Koruma Kurumu'na
> (kvkk.gov.tr) başvurabilir. Bu nedenle yanıt süresi/gerekçe kayıtları titizlikle tutulur.

---

## 9. Hesap silme & veri saklama

**Sade özet:** Kullanıcı hesabını silince verisi gerçekten silinir (yasal olarak saklanması
zorunlu olanlar hariç). Mali kayıtlar (ödemeler) kanun gereği daha uzun saklanır.

### Saklama süreleri (kvkk sayfasındaki politikayla tutarlı)
| Veri | Saklama | Dayanak |
|---|---|---|
| Hesap + profil + içerik | Silme talebinden sonra **≤ 30 gün** içinde imha | KVKK Md. 7 (amaç ortadan kalktı) |
| Ödeme/fatura kayıtları | **10 yıl** | Vergi/mali mevzuat (saklama zorunluluğu) |
| e-Devlet doğrulama anlık verisi | **Saklanmaz** (TC kimlik kalıcı tutulmaz) | Veri minimizasyonu |
| Kart verisi | **Saklanmaz** (PayTR'da) | PCI / minimizasyon |

### Hesap silme operasyonu
- Uygulama içi "hesabımı sil" akışı kullanıcı kaydını ve bağlı verilerini siler.
- **FK zinciri:** Hesap silmede yabancı anahtar (foreign key) zinciri düzeltildi
  (bkz. `TECH_DEBT.md #14 / task #14`) → silme artık kırılmadan tüm bağlı satırları
  (gönderi, ilan, mesaj, üyelik vb.) `ON DELETE CASCADE`/temizleme ile kaldırır.
- **Mali istisna:** `payments` kayıtları kullanıcı kimliğinden arındırılarak (anonimleştirme)
  veya yasal saklama gereği tutulur — tamamen silinmez (10 yıl kuralı).
- **Doğrulama:** Silme sonrası ilgili `user_id` ile SELECT → mali kayıtlar dışında satır
  kalmadığını teyit et.

---

## 10. Felaket kurtarma

**Sade özet:** "Her şey gitti" senaryosunda nasıl geri döneriz? Kod git'te (GitHub),
veri Supabase yedeğinde, konfigürasyon Vercel'de. Üçü de ayrı yerlerde duruyor.

### Kurtarma kaynakları (RPO/RTO)
| Bileşen | Nereden geri gelir | Veri kaybı riski (RPO) |
|---|---|---|
| Kod | GitHub deposu (`main`/`coskun`) | 0 (her commit'te) |
| Veritabanı | Supabase PITR / pg_dump yedeği | PITR ile dakikalar; dump ile son yedek anı |
| Sırlar/konfig | Vercel env (+ güvenli şifre kasası kopyası) | 0 (kasada yedeği varsa) |
| Depolanan dosyalar | Supabase Storage (yedek kapsamında) | Yedek sıklığına bağlı |

### Tam yeniden kurulum senaryosu (Supabase projesi kaybı)
1. Yeni Supabase projesi oluştur.
2. Şemayı migration'lardan + en son `pg_dump` yedeğinden geri yükle.
3. RLS politikalarının geldiğini doğrula (Advisors).
4. Vercel env değişkenlerini yeni proje URL/anahtarlarıyla güncelle.
5. Üretimde duman testi.

> **Kritik önlem:** Sır kasasının (Vercel env'in bir kopyası) güvenli, ayrı bir yerde
> yedeği olmalı. Aksi halde anahtarlar kaybolursa bazı dış servisler yeniden kurulmalı.
> **PITR'in açık olduğunu bugün doğrula** — felaket anında açmak için geç olur.

---

## 11. Bakım takvimi

**Sade özet:** Düzenli yapılacak küçük işler. Aksatılırsa borç birikir.

| Sıklık | İş |
|---|---|
| **Haftalık** | Sentry/Vercel hata panelini gözden geçir; CI'ın yeşil olduğunu doğrula |
| **Haftalık** | Yeni içerik şikâyetleri (admin/moderasyon kuyruğu) işle |
| **Aylık** | `npm audit` → yeni güvenlik açığı var mı; `npm outdated` → bağımlılık güncelleme |
| **Aylık** | Supabase Advisors (RLS/güvenlik) temiz mi; yedeklerin alındığını doğrula |
| **3 aylık** | Bağımlılıkları güncelle (Next/Supabase/react-query), build+test ile doğrula |
| **6 aylık** | Yüksek-kritik anahtar rotasyonu ([Bölüm 7](#7-anahtar-rotasyonu)) |
| **6 aylık** | Yasal metinleri (KVKK/gizlilik/koşullar) mevzuat değişikliğine karşı gözden geçir |
| **Sürekli** | `TECH_DEBT.md`'deki Faz 1 borçlarını erit |

---

## 12. Yayın öncesi son kontrol listesi

**Sade özet:** Canlıya / mağazaya çıkmadan ÖNCE bu listenin tamamı ✅ olmalı. Bir madde
🔴 ise yayın **durur**. Yıldızlı (★) maddeler **yalnızca sahip/avukat** tarafından yapılır.

### Yasal & uyum (K5/K10) — **ŞU AN AÇIK OLANLAR**
- [ ] ★ **Şirket sicil bilgileri** yasal metinlere işlendi: tam ticari unvan, **açık adres**,
      **MERSİS no**, **VERBİS kayıt no**, **KEP adresi**. (Şu an `/kvkk` sayfasında "yayın
      öncesi tamamlanacak" notuyla bekliyor.)
- [ ] ★ **Avukat onayı:** KVKK aydınlatma metni, Gizlilik Politikası, Kullanım Koşulları
      (`/kvkk`, `/gizlilik`, `/kosullar`) bir avukat tarafından gözden geçirildi.
- [ ] **VERBİS kaydı** yapıldı (veri sorumlusu sicili — eşik aşılıyorsa zorunlu).
- [ ] Çalışan bir **içerik şikâyet** mekanizması var (Apple 1.2 / Google UGC) → ✅ kuruldu
      (`TECH_DEBT.md #13`), mağaza öncesi son kez manuel doğrula.
- [ ] **Hesap silme** uygulama içinden çalışıyor (Apple zorunlu) → ✅ (`#14`), doğrula.

### Teknik kapılar (K3/K4/K7/K8)
- [ ] Üç ZORUNLU CI kapısı yeşil: typecheck, test, build.
- [ ] Üretim env değişkenleri Vercel'de tam ve doğru ([Bölüm 2](#2-ortam-değişkenleri--sırlar)).
- [ ] `PAYTR_TEST_MODE=false` (gerçek tahsilat) — **ve** PayTR canlı anahtarları girildi,
      küçük tutarla uçtan uca test edildi (`TECH_DEBT.md #10`).
- [ ] Her tabloda RLS açık + politika var (Supabase Advisors temiz).
- [ ] Sentry DSN girildi → hata izleme canlı ([Bölüm 5](#5-hata-izleme--gözlem)).
- [ ] Supabase PITR/yedek açık ([Bölüm 4](#4-veritabanı-supabase)).
- [ ] Hız sınırlama (Upstash) hassas uçlarda aktif (giriş, ödeme, doğrulama).

### İçerik & dürüstlük (K10 — "deceptive content")
- [ ] Kullanıcıya sahte/mock veri gösteren kalıntı yok (`TECH_DEBT.md #12` listesi).
- [ ] "Yakında" ile kapatılan özellikler (askıda bağış, mahallem kart) net etiketli.
- [ ] Blog liste→detay bağlantıları gerçek içeriğe gidiyor (`#12` son madde, sahip kararı).

> **Bu listedeki ★ maddeler sahip/avukat işidir; otomatik yapılamaz. Geri kalanı teknik
> operatör tamamlar. Hepsi ✅ olmadan `main`'e deploy edilmez.**

---

*Bu kılavuz yaşayan bir belgedir. Operasyon değiştikçe güncellenir; her olaydan sonra
"bir dahakine ne farklı yapılmalı" buraya işlenir.*
