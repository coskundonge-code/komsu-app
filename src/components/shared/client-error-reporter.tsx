"use client";

/**
 * Yakalanmayan istemci hatalarını dinler (K8 — Gözlem).
 *
 * React error boundary'lerine düşmeyen hataları yakalar:
 *  - window "error" (senkron çalışma zamanı hataları)
 *  - window "unhandledrejection" (yakalanmayan Promise reddi)
 *
 * Görsel çıktısı yoktur (null döner); yalnızca yan etki olarak dinleyici kurar.
 * layout.tsx içinde bir kez monte edilir.
 */

import { useEffect } from "react";
import { reportClientError } from "@/lib/utils/report-client-error";

export function ClientErrorReporter() {
  useEffect(() => {
    function handleError(event: ErrorEvent) {
      reportClientError(event.error ?? event.message, {
        source: "window.onerror",
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
      });
    }

    function handleRejection(event: PromiseRejectionEvent) {
      reportClientError(event.reason, { source: "unhandledrejection" });
    }

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}
