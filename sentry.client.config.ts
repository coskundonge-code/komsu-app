// Sentry geçici olarak devre dışı (Next 16 desteği henüz Sentry'de yok).
// @sentry/nextjs Next 16'yı destekleyen sürüm yayınladığında:
//   1. package.json'a "@sentry/nextjs": "^10.x" ekle
//   2. Bu dosyayı eski Sentry init kodu ile geri doldur
//   3. instrumentation.ts'teki yorum satırlarını aç
export {}
