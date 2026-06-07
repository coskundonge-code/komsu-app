// Next.js instrumentation hook.
//
// K8 (Gözlem): Sunucu tarafı istek hataları onRequestError ile merkezi
// logger'a akar — harici servis (Sentry vb.) gerekmeden. Sentry Next 16
// desteğini eklediğinde aşağıdaki register() yorumları açılır ve onRequestError
// Sentry'ninkiyle değiştirilebilir.
import type { Instrumentation } from "next";
import { logError } from "./lib/logger";

export async function register() {
  // Sentry geçici olarak devre dışı (Next 16 desteği henüz yok).
  // Eklendiğinde:
  //   1. package.json'a "@sentry/nextjs": "^10.x" ekle
  //   2. sentry.{client,server,edge}.config.ts dosyalarını geri ekle
  //   3. Aşağıdaki yorumları aç
  // if (process.env.NEXT_RUNTIME === "nodejs") {
  //   await import("../sentry.server.config");
  // }
  // if (process.env.NEXT_RUNTIME === "edge") {
  //   await import("../sentry.edge.config");
  // }
}

// Tüm sunucu tarafı render/route hatalarını yakalar (App Router, API route'ları,
// Server Components, middleware). Sentry gelince `export { onRequestError } from
// "@sentry/nextjs"` ile değiştirilebilir.
export const onRequestError: Instrumentation.onRequestError = (err, request, context) => {
  logError("Sunucu istek hatası", err, {
    source: "instrumentation.onRequestError",
    path: request.path,
    method: request.method,
    routerKind: context.routerKind,
    routePath: context.routePath,
    routeType: context.routeType,
    renderSource: context.renderSource,
    revalidateReason: context.revalidateReason,
  });
};
