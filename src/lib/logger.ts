/**
 * Merkezi yapısal loglama (K8 — Gözlem).
 *
 * Tek değişiklik noktası: ileride Sentry / Logtail / Axiom eklenince yalnızca
 * `emit` fonksiyonu değişir, çağrı yerleri aynı kalır.
 *
 * Üretimde tek satır JSON basar — Vercel/log toplayıcılar parse edip
 * filtreleyebilir. Geliştirmede okunaklı satır basar.
 *
 * Sunucu tarafında kullanılır (instrumentation onRequestError, API route'ları,
 * servis katmanı). İstemci hataları /api/client-error üzerinden buraya akar.
 */

type LogLevel = "error" | "warn" | "info";

export interface LogContext {
  [key: string]: unknown;
}

function emit(level: LogLevel, message: string, context?: LogContext) {
  const entry: Record<string, unknown> = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };

  // Tanımsız alanları ayıkla (log gürültüsünü azalt).
  for (const key of Object.keys(entry)) {
    if (entry[key] === undefined) delete entry[key];
  }

  const isProd = process.env.NODE_ENV === "production";
  const sink =
    level === "error" ? console.error : level === "warn" ? console.warn : console.log;

  if (isProd) {
    sink(JSON.stringify(entry));
  } else {
    sink(`[${level}] ${message}`, context ?? "");
  }
}

function describeError(error: unknown): LogContext {
  if (error instanceof Error) {
    return {
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack,
    };
  }
  if (error === undefined || error === null) return {};
  return { error: String(error) };
}

export function logError(message: string, error?: unknown, context?: LogContext) {
  emit("error", message, { ...context, ...describeError(error) });
}

export function logWarn(message: string, context?: LogContext) {
  emit("warn", message, context);
}

export function logInfo(message: string, context?: LogContext) {
  emit("info", message, context);
}
