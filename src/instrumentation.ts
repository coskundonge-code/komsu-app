// Next.js instrumentation hook.
// Sentry geçici olarak devre dışı (Next 16 desteği henüz yok).
// Sentry Next 16 desteğini eklediğinde:
//   1. package.json'a "@sentry/nextjs": "^10.x" ekle
//   2. sentry.{client,server,edge}.config.ts dosyalarını geri ekle
//   3. Aşağıdaki yorumları aç
export async function register() {
  // if (process.env.NEXT_RUNTIME === "nodejs") {
  //   await import("../sentry.server.config");
  // }
  // if (process.env.NEXT_RUNTIME === "edge") {
  //   await import("../sentry.edge.config");
  // }
}

// export { onRequestError } from "@sentry/nextjs";
