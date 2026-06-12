# Gizlilik Form Cevapları — Apple Privacy Label + Google Data Safety

Kaynak: kod taraması veri envanteri (2026-06-11 denetimi). İkisi de aynı envantere dayanır.

## Ortak veri envanteri (gerçek durum)
| Veri | Toplanıyor? | Kimliğe bağlı? | Amaç | Not |
|---|---|---|---|---|
| Ad-soyad | Evet | Evet | Uygulama işlevi | profiles.full_name |
| E-posta | Evet | Evet | Hesap | auth |
| Telefon | Evet (ops) | Evet | Uygulama işlevi | profiles.phone |
| Kesin konum (lat/lng) | Evet | Evet | Mahalle eşleşmesi/harita | kullanıcı kendisi seçer; arkaplan takibi YOK |
| Açık adres | Evet | Evet | Doğrulama/teslimat | |
| TC Kimlik No | **HAYIR (saklanmaz)** | — | Yalnız doğrulama ANINDA iletilir | e-Devlet sorgusu; DB'de tutulmaz |
| e-Devlet belge barkodu | Evet | Evet | Doğrulama kanıtı | belge DOSYASI saklanmaz |
| Fotoğraf/video | Evet | Evet | İlan/profil/işletme içerikleri | kullanıcı yükler |
| Mesajlar | Evet | Evet | Uygulama işlevi | uçtan uca şifreli DEĞİL (sunucuda saklanır) |
| Ödeme bilgisi | Tutar/durum Evet; **kart verisi HAYIR** | Evet | Satın alma kaydı | kart PayTR'de işlenir |
| Kullanım verisi (sayfa görüntüleme, web vitals) | Evet | Hayır (anonim) | Analitik | Vercel Analytics |
| Cihaz push token | Evet (native) | Evet | Bildirim | push_tokens |
| Takip (cross-app tracking / reklam) | **HAYIR** | — | — | reklam SDK'sı yok |

## Apple Privacy Nutrition Label cevapları
**Data Used to Track You: NONE** (3. taraf reklam/tracking yok → ATT izni GEREKMEZ)

**Data Linked to You:**
- Contact Info: Name, Email Address, Phone Number
- Location: Precise Location (App Functionality)
- User Content: Photos or Videos, Other User Content (gönderi/ilan/mesaj)
- Identifiers: User ID
- Purchases: Purchase History (App Functionality)
- Sensitive Info: SEÇME (TC saklanmadığı için "collected" sayılmaz; iletim anlıktır)

**Data Not Linked to You:**
- Usage Data: Product Interaction (Analytics — Vercel, anonim)

## Google Play Data Safety cevapları
- Veri paylaşımı (3. taraf): **PayTR** (ödeme işleme — yalnız işlem sırasında), bulut altyapı (işleyici)
- Veri toplama: yukarıdaki tablo aynen; tümü "Encrypted in transit" ✓
- Silme talebi: **Evet, uygulama içinden** (Ayarlar → Hesabı Sil) ✓
- Bağımsız güvenlik incelemesi: Hayır
- Kategoriler işaretle: Personal info (name, email, phone, address), Location (precise),
  Photos/Videos, Messages, Financial info (purchase history yalnız), App activity (analytics)
- Reklam/tracking: YOK

## Hatırlatma
- Gizlilik politikası URL'i login'siz açılır: /gizlilik ✓ (formlarda bu URL kullanılacak)
- KVKK veri talepleri: kvkk@mahallem.com (gizlilik sayfasında yazıyor — alan adı e-postası
  gerçek mi? SAHİP kontrol etmeli; değilse politikada güncellenecek)
