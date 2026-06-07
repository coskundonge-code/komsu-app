"use client";

/**
 * Kök düzen (root layout) çökme sınırı (K8 — Gözlem).
 *
 * Next.js'te global-error YALNIZCA kök layout'un kendisi render sırasında
 * çökerse devreye girer ve normal layout'un yerini aldığı için kendi
 * <html>/<body> etiketlerini render etmek ZORUNDADIR. Uygulama sağlayıcıları
 * (Providers, tema vb.) burada YOKTUR — bu yüzden olabildiğince yalın tutulur.
 */

import { useEffect } from "react";
import { reportClientError } from "@/lib/utils/report-client-error";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportClientError(error, { boundary: "global-error" });
  }, [error]);

  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          background: "#f8fafc",
          color: "#0f172a",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "28rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            Beklenmeyen bir hata oluştu
          </h1>
          <p style={{ color: "#475569", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            Bir sorun nedeniyle sayfa yüklenemedi. Lütfen tekrar deneyin. Sorun
            sürerse birkaç dakika sonra yeniden ziyaret edebilirsiniz.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.5rem",
              border: "none",
              background: "#0f172a",
              color: "#ffffff",
              padding: "0.625rem 1.25rem",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Tekrar dene
          </button>
        </div>
      </body>
    </html>
  );
}
