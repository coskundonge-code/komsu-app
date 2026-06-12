/// <reference types="@capacitor/cli" />

/**
 * Capacitor yapılandırması — Mahallemiz iOS/Android.
 *
 * MİMARİ KARAR (2026-06-11, mağaza yol haritası D-1): HİBRİT KABUK.
 * Uygulama SSR + middleware + API route kullandığı için statik export
 * (webDir build çıktısı) mümkün değil; native kabuk canlı siteyi yükler
 * (server.url) ve üstüne native değer katmanı ekler (push bildirimleri,
 * native paylaşım, derin bağlantılar, splash/status bar). Avantaj: tek kod
 * tabanı; kritik düzeltmeler mağaza onayı beklemeden yayına girer.
 * Apple 4.2 ("salt web sarmalayıcı") itirazına karşı savunma: push, kamera,
 * konum, haptics ve derin bağlantılar natif çalışır.
 *
 * webDir (mobile-shell): yalnızca cap sync'in istediği yerel yedek içerik —
 * cihaz çevrimdışıyken gösterilecek basit ekran.
 */
const config = {
  appId: 'com.mahallemiz.app',
  appName: 'Mahallemiz',
  webDir: 'mobile-shell',
  server: {
    url: 'https://komsu-app.vercel.app',
    androidScheme: 'https',
    iosScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#00833e',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#00833e',
    },
    Keyboard: {
      resize: 'body',
      style: 'LIGHT',
      resizeOnFullScreen: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  ios: {
    contentInset: 'always',
    preferredContentMode: 'mobile',
    scheme: 'Mahallemiz',
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
