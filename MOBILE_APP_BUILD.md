# Mahallemiz - iOS & Android App Build Guide

## Prerequisites

- Node.js 18+
- Xcode 15+ (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS: `sudo gem install cocoapods`)

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Capacitor
```bash
npx cap init Mahallemiz com.mahallemiz.app --web-dir=out
```

### 3. Add Platforms
```bash
npx cap add ios
npx cap add android
```

## Building

### Web Build for Mobile
```bash
# Use the Capacitor-specific Next.js config
cp next.config.capacitor.ts next.config.ts.bak
cp next.config.capacitor.ts next.config.ts
npm run build
mv next.config.ts.bak next.config.ts

# Sync with native platforms
npx cap sync
```

### iOS
```bash
npx cap open ios
# Build and run from Xcode
# Or: npx cap run ios
```

### Android
```bash
npx cap open android
# Build and run from Android Studio
# Or: npx cap run android
```

## App Configuration

- **App ID**: `com.mahallemiz.app`
- **App Name**: Mahallemiz
- **Bundle Version**: 0.1.0
- **Min iOS**: 14.0
- **Min Android API**: 22 (Android 5.1)

## Native Features

The app uses these Capacitor plugins:

| Feature | Plugin | Usage |
|---------|--------|-------|
| Push Notifications | @capacitor/push-notifications | Bildirimler |
| Geolocation | @capacitor/geolocation | Konum Seçimi |
| Camera | @capacitor/camera | Fotoğraf Yükleme |
| Share | @capacitor/share | Gönderi Paylaşımı |
| Haptics | @capacitor/haptics | Dokunma Geri Bildirimi |
| Status Bar | @capacitor/status-bar | Durum Çubuğu Stili |
| Splash Screen | @capacitor/splash-screen | Açılış Ekranı |
| Keyboard | @capacitor/keyboard | Klavye Yonetimi |
| App | @capacitor/app | Uygulama Yaşam Dövüsü |

## Icon Generation

Place your app icon as a 1024x1024 PNG f
crources/icon.png` (App icon)
- `resources/splash.png` (Splash screen - 2732x2732)

Then generate all sizes:
```bash
npx capacitor-assets generate
```

## Release

### iOS App Store
1. Open Xcode: `npx cap open ios`
2. Set signing team in project settings
3. Archive: Product > Archive
4. Upload to App Store Connect

### Google Play Store
1. Open Android Studio: `npx cap open android`
2. Build > Generate Signed Bundle/APK
3. Upload AAB to Google Play Console