/**
 * İstemci hatası bildirimi (K8 — Gözlem).
 *
 * Tarayıcıda yakalanan hataları sunucudaki /api/client-error ucuna gönderir.
 * Oradan merkezi logger'a (src/lib/logger.ts) akar. Bu fonksiyon ASLA hata
 * fırlatmaz — hata raporlarken yeni hata üretmek kullanıcı deneyimini bozar.
 *
 * `sendBeacon` tercih edilir (sayfa kapanırken bile gider); yoksa keepalive
 * fetch'e düşer.
 */

export interface ClientErrorContext {
  [key: string]: unknown;
}

interface ClientErrorPayload {
  message: string;
  stack?: string;
  digest?: string;
  path?: string;
  source?: string;
  context?: ClientErrorContext;
}

function buildPayload(error: unknown, context?: ClientErrorContext): ClientErrorPayload {
  const payload: ClientErrorPayload = { message: "Bilinmeyen istemci hatası" };

  if (error instanceof Error) {
    payload.message = error.message || error.name || payload.message;
    if (error.stack) payload.stack = error.stack;
    // Next.js error boundary'leri error.digest taşır.
    const digest = (error as { digest?: unknown }).digest;
    if (typeof digest === "string") payload.digest = digest;
  } else if (typeof error === "string") {
    payload.message = error;
  } else if (error != null) {
    try {
      payload.message = String(error);
    } catch {
      /* yoksay */
    }
  }

  if (typeof window !== "undefined" && window.location) {
    payload.path = window.location.pathname;
  }

  if (context && Object.keys(context).length > 0) {
    payload.context = context;
  }

  return payload;
}

export function reportClientError(error: unknown, context?: ClientErrorContext): void {
  try {
    if (typeof window === "undefined") return;

    const payload = buildPayload(error, context);
    const body = JSON.stringify(payload);
    const url = "/api/client-error";

    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      const queued = navigator.sendBeacon(url, blob);
      if (queued) return;
    }

    if (typeof fetch === "function") {
      void fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {
        /* sessiz: rapor gönderimi başarısız olsa da uygulama akışını bozma */
      });
    }
  } catch {
    /* hata raporlama asla zincirleme hata üretmemeli */
  }
}
