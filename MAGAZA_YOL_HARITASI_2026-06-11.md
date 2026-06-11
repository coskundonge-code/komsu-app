# iOS + Android Mağaza Hazırlık Denetimi ve Yol Haritası

Tarih: 2026-06-11 · Denetim: 13 Kapı (ai-architecture-rules) + 3 paralel ret-riski taraması
Hedef: Kullanıcıların ~%90'ı mobil uygulamadan gelecek; başvuruda beklememek için
tüm ret sebepleri ÖNDEN kapatılacak.

## KARAR: Bugün mağazaya gönderilemez — ama yol kısa ve net

Web tarafı sağlam (güvenlik sertleştirildi, 268 test, canlıda). Mobil tarafta ise
**native uygulama henüz hiç üretilmedi** ve 3 kesin Apple ret sebebi açık.
Gerçekçi takvim: **~1 hafta yoğun işle beta (TestFlight/kapalı test), 3-5 hafta
içinde mağazada** (mağaza hesap onay süreçleri dahil).

## 13 Kapı Skorkartı (mobil odaklı)

| Kapı | Durum | Not |
|---|---|---|
| 0 Niyet & Kapsam | 🟢 | Net: mahalle uygulaması, %90 mobil hedefi |
| 1 Mimari & Plan | 🔴 | **Mobil mimari kararı verilmemiş**: capacitor.config `webDir:'out'` statik çıktı bekliyor ama uygulama SSR+middleware+API route (statik export imkânsız). ios/android projeleri yok. |
| 2 Geliştirme Disiplini | 🟡 | Gizlilik ayarlarında SAHTE "engellenen kullanıcı" listesi (mock, 3 sahte kişi) — dürüstlük + ret riski |
| 3 Test | 🟡 | Web testleri güçlü (268 birim + E2E tarayıcı); gerçek cihaz/mobil test sıfır |
| 4 Güvenlik | 🟢 | Bu oturumlarda sertleştirildi (RLS, kapılar, ödeme zinciri) |
| 5 Veri & Gizlilik | 🟡 | Sayfalar tam + login'siz erişilebilir; TC/kart saklanmıyor ✓. Eksik: hesap silmede `documents` bucket temizlenmiyor; avukat onayı bekliyor |
| 6 Performans | 🟡 | Mobil viewport test edildi; düşük-uç Android cihaz testi yok |
| 7 Altyapı & Dağıtım | 🔴 (mobil) | Web Vercel'de canlı ✓; mobil build hattı yok. **iOS derlemesi için macOS+Xcode şart** — yoksa bulut build (Codemagic/Appflow) |
| 8 Gözlem & İzleme | 🟡 | Vercel Analytics var; hata izleme (Sentry) yok |
| 9 Operasyon | 🟡 | Admin panel + moderasyon kuyruğu çalışıyor; mobil sürüm operasyonu tanımsız |
| 10 Platforma Özel (MAĞAZA) | 🔴 | Aşağıdaki ret listesi |
| 11 Lansman | 🟡 | Mağaza varlıkları (ekran görüntüsü, açıklama, grafik) yok |
| 12 Sürekli İyileştirme | 🟢 | Raf akışı + raporlama oturmuş |

## A. KESİN RET SEBEPLERİ (başvurmadan önce şart)

| # | Sorun | Apple kuralı | Kanıt | Çözüm | Efor |
|---|---|---|---|---|---|
| A1 | **Kullanıcı engelleme (block) yok** — üstelik ayarlarda mock liste var | 1.2(b) UGC: kötü kullanıcıyı engelleme ZORUNLU | `ayarlar/gizlilik/page.tsx:18-43` mock; DB'de blocked_users tablosu yok | `blocked_users` tablosu + RLS (engellenen kişi mesaj atamaz/içerik göremez) + profil/mesajda "Engelle" + ayarlar gerçek listeye | 1-2 gün |
| A2 | **Google girişi açık ama Sign in with Apple yok** | 4.8: 3. taraf login varsa Apple girişi ZORUNLU | `giris/page.tsx:71-85`, `kayit:111-125` signInWithOAuth('google') | İKİ YOL: (hızlı) Google butonlarını kaldır → 4.8 düşer; (tam) Apple Sign-In ekle (Supabase provider). Not: Google OAuth Supabase'te zaten yapılandırılmamış → buton muhtemelen kırık = ayrıca 2.1 reddi. Önerim: şimdilik kaldır | 0.5 gün (kaldır) / 1-2 gün (Apple ekle) |
| A3 | **Native uygulama yok** | — | ios/, android/ klasörleri hiç oluşturulmamış | Faz 1 (aşağıda) | ~1 hafta |

## B. YÜKSEK RİSK (ilk sürümde kapatılmalı)

| # | Sorun | Risk | Çözüm | Efor |
|---|---|---|---|---|
| B1 | Mahallem Kart "çok yakında" placeholder | 2.1 tamlık reddi | Mobil sürümde menüden gizle (web'de kalabilir) | 0.5 gün |
| B2 | Push uçtan uca yok (plugin var; token kaydı/gönderim yok) | 4.2 "web sarmalayıcı" reddine açık kapı — native değer şart | FCM: push_tokens tablosu + kayıt + bildirim gönderimi (yeni mesaj/yorum) | 2-3 gün |
| B3 | İnceleme hesabı sorunu: **incelemeci e-Devlet belgesi sağlayamaz** → kapı sistemi yüzünden hiçbir etkileşimi deneyemez | 2.1 ret (özellikler test edilemedi) | Review Notes'a ÖNCEDEN DOĞRULANMIŞ demo hesap (hazır: test hesapları) + kapıların nedenini açıklayan not | 0 gün (hazır) |
| B4 | İletişim sayfasında sahte görünümlü telefon (+90 212 555-1234) | Metadata güvenilirliği | Gerçek destek e-postası/telefonu (sahip) | sahip |
| B5 | Hesap silmede `documents` bucket temizlenmiyor | 5.1.1 + KVKK | delete route'a bucket ekle | 0.5 saat |
| B6 | Derin bağlantı yok (paylaşılan ilan linki uygulamada açılmıyor) | UX + Play 2024 önerisi | `.well-known/apple-app-site-association` + `assetlinks.json` + route hook | 1 gün |
| B7 | İzin gerekçe metinleri (Info.plist/AndroidManifest) | İzin reddi | Faz 1'de hazır şablonla (raporda XML'ler hazır) | Faz 1 içinde |

## C. UYGUN OLANLAR (güçlü yanlar — değiştirme)

- **Ödeme:** Tüm akışlar (işletme üyeliği, ilan ücreti, öne çıkarma) gerçek-dünya/fiziksel
  hizmet sınıfında ve PayTR iframe ile → Apple 3.1.1 IAP ihlali YOK (3.1.3/3.1.5 kapsamı).
  Kart verisi hiç dokunulmuyor. (Gri alan notu: Apple işletme üyeliğini sorgularsa
  konum: "uygulama dışında verilen esnaf hizmeti".)
- **Hesap silme:** Gerçek ve tam (auth+profil+storage+kaskad) — 5.1.1(v) ✓
- **UGC önlemleri 4/5:** rapor modalı + AI/kural moderasyonu + admin kuyruğu +
  topluluk kuralları + iletişim ✓ (eksik tek şey A1 block)
- **Gizlilik:** sayfalar login'siz, kapsamlı; TC kimlik ve kart SAKLANMIYOR ✓
- **Veri envanteri çıkarıldı** → Privacy Label / Data Safety formları doldurulmaya hazır

## D. MOBİL MİMARİ KARARI (öneri)

Statik export bu mimaride imkânsız (SSR + middleware + 10+ API route). İki yol:

1. **ÖNERİLEN — Hibrit kabuk:** Capacitor `server.url = https://komsu-app.vercel.app`
   (canlı siteyi yükler) + native değer katmanı: push bildirimleri, native paylaşım,
   haptics, derin bağlantılar, splash/status bar, offline ekranı. Apple'ın "salt web
   sarmalayıcı" (4.2) itirazını native özellikler savuşturur. Efor: ~1 hafta.
   Avantaj: tek kod tabanı, web ile aynı anda güncellenir (kritik düzeltmeler mağaza
   onayı beklemez).
2. **Yedek plan (Apple 4.2 reddi gelirse):** API route'ları Supabase Edge Functions'a,
   middleware'i istemci korumalarına taşıyıp `output:'export'` ile gerçek yerel paket.
   Efor: 1-2 hafta refactor. (Karar gerekirse o gün veririz; plan hazır.)

## E. YOL HARİTASI

### Faz 0 — Ret engelleri (kod; ~3-4 gün) ← "başla" dersen hemen
1. blocked_users sistemi (A1): tablo+RLS+UI+mesaj/içerik filtresi
2. Google login butonlarını kaldır (A2-hızlı yol)
3. Mahallem Kart'ı mobil menüden gizle (B1)
4. documents bucket silme (B5)
5. Sentry (ücretsiz plan) hata izleme — mobil çökme görünürlüğü

### Faz 1 — Native temel (~1 hafta)
1. Mimari: hibrit kabuk (D1) — capacitor.config'e server.url + offline ekranı
2. `npx cap add ios && npx cap add android`
3. 1024px ikon + splash kaynağı → `npx capacitor-assets generate`
4. Info.plist gerekçeleri + AndroidManifest izinleri (şablonlar raporda hazır)
5. Build: Android (yerelde olur) · iOS → **Mac yoksa Codemagic/Appflow bulut build**
6. Gerçek cihazda duman testi (giriş→feed→ilan→mesaj→askıda)

### Faz 2 — Mobil değer + cila (~1 hafta, Faz 3 ile paralel)
1. Push uçtan uca (B2): FCM + token tablosu + yeni mesaj/yorum bildirimi
2. Derin bağlantılar (B6)
3. Safe-area/çentik kontrolü, klavye davranışı, geri tuşu (Android)
4. PWA manifest düzeltmeleri (id, gerçek App Store id, ekran görüntüleri)

### Faz 3 — Mağaza operasyonu (sahip + ben; paralel başlat — onay süreleri uzun)
| İş | Kim | Not |
|---|---|---|
| Apple Developer Program ($99/yıl) | SAHİP | Şirket hesabı için DUNS no gerekir (MERSİS işiyle birleştir); bireysel hesap daha hızlı açılır |
| Google Play Console ($25, tek seferlik) | SAHİP | **KRİTİK:** Bireysel yeni hesapta "12 test kullanıcısı × 14 gün kapalı test" zorunluluğu var; KURUMSAL hesapta YOK → kurumsal aç |
| Ekran görüntüleri (6.7"+6.5" iPhone, telefon+7" Android), feature graphic | BEN (cihaz çerçeveli) | Faz 1 build'inden |
| Mağaza metinleri (TR): başlık, alt başlık, açıklama, anahtar kelimeler | BEN → sahip onayı | |
| Privacy Nutrition Label + Data Safety formu | BEN (envanter hazır) | Konum=hassas, mesajlar, foto, ad/e-posta/telefon; TC=yalnız iletimde |
| Yaş derecelendirme anketi | BEN | UGC → 12+ (Apple) / "Ebeveyn onayı" (Play) |
| Review Notes + demo hesap (B3) | BEN | Doğrulanmış test hesabı + kapı sistemi açıklaması + e-Devlet akışının videosu |
| Gerçek destek iletişimi (B4) + avukat onaylı metinler | SAHİP | YAPILACAKLAR A bölümüyle aynı |

### Faz 4 — Beta ve gönderim (~1 hafta)
1. TestFlight (iOS) + Play kapalı test — gerçek kullanıcılarla (test hesapları + tanıdıklar)
2. Çökme/performans gözle (Sentry), düzelt
3. Gönderim. İnceleme süreleri: Apple genelde 24-48 saat, Play ilk uygulamada birkaç gün.
   Ret gelirse: itiraz + düzeltme döngüsü için B3 notları hazır.

**Toplam gerçekçi takvim:** Faz 0-2 ≈ 2,5 hafta kod işi → beta; mağaza hesap onayları
ve kapalı test dahil **mağazada yayın: ~4-5 hafta** (kurumsal hesap onay hızına bağlı).

## F. Sahibin ŞİMDİ başlatması gerekenler (onay süreçleri en uzun kalemler)
1. Google Play **kurumsal** hesabı ($25) — şirket evrakı + D-U-N-S
2. Apple Developer ($99) — şirket için DUNS, ya da hızlı başlamak için bireysel
3. Gerçek destek e-postası/telefonu kararı
4. Avukat onaylı KVKK/koşullar (zaten listede) + MERSİS
5. iOS build için: Mac var mı? Yoksa Codemagic (ücretsiz katman var) hesabı
