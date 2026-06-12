# Mağaza Başvuru Paketi (hesaplar açılınca kopyala-yapıştır)

Hazırlık: 2026-06-12 · Bağlam: [MAGAZA_YOL_HARITASI_2026-06-11.md](../../MAGAZA_YOL_HARITASI_2026-06-11.md)

## Bu klasördekiler
| Dosya | Ne işe yarar |
|---|---|
| `METADATA_TR.md` | App Store + Google Play başlık/açıklama/anahtar kelimeler (kopyala-yapıştır) |
| `PRIVACY_FORMS.md` | Apple "Privacy Nutrition Label" + Google "Data Safety" form cevapları satır satır |
| `REVIEW_NOTES.md` | İncelemeciye notlar (EN) + demo hesap — Apple/Play "App Review Information" alanına |
| `apple-app-site-association.template.json` | iOS Universal Links — TEAM_ID gelince doldur, `public/.well-known/` altına koy |
| `assetlinks.template.json` | Android App Links — imza SHA-256 gelince doldur, `public/.well-known/` altına koy |

## Hesaplar açıldıktan sonra sıra (özet)
1. **Apple:** Identifiers → `com.mahallemiz.app` App ID (Push Notifications capability işaretle)
   → App Store Connect'te uygulama oluştur → TEAM_ID'yi AASA şablonuna işle.
2. **Google Play:** Uygulama oluştur (`com.mahallemiz.app`) → Play App Signing AÇIK bırak
   → imza sertifikası SHA-256'yı assetlinks şablonuna işle.
3. **Firebase** (push için, ücretsiz): proje aç → Android app ekle (`google-services.json`
   → `android/app/`) → iOS app ekle (`GoogleService-Info.plist` → `ios/App/App/`)
   → APNs anahtarını Firebase'e yükle.
4. Build: Android → `cd android && gradlew bundleRelease` (Android Studio veya CI);
   iOS → Mac/Codemagic ile Xcode archive → TestFlight.
5. Formlar: PRIVACY_FORMS.md'deki cevapları aynen gir; metadata'yı METADATA_TR.md'den al;
   REVIEW_NOTES.md'yi inceleme notlarına yapıştır.
6. Yaş derecelendirme: Apple anketi → 12+ çıkar (UGC); Play IARC anketi → UGC işaretle.

## Kod tarafında bugün hazır olanlar
- Hibrit kabuk (canlı site + native katman), iOS/Android projeleri üretildi
- İzin gerekçeleri yazıldı (yalnız kullanılan izinler), ikon/splash tüm boyutlarda üretildi
- Push token toplama altyapısı hazır (gönderim Firebase sonrası)
- Engelleme sistemi, hesap silme (documents dahil), Google butonları kaldırıldı,
  Mahallem Kart menüden gizlendi
