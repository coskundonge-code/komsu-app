/**
 * İstemci hata toplama ucu (K8 — Gözlem).
 *
 * Tarayıcıdan reportClientError() ile gelen hataları merkezi logger'a yazar.
 * Bu uç ASLA hata döndürmez (her durumda 200) — istemci tarafı yanıtı zaten
 * beklemiyor (sendBeacon/keepalive). Açık bir uçtur: gövde boyutları sınırlanır,
 * ileride hız sınırı (rate-limit) eklenmesi bir sertleştirme adımıdır.
 */

import { NextResponse } from "next/server";
import { logError } from "@/lib/logger";

export const runtime = "nodejs";

/** Log gürültüsünü ve kötüye kullanımı sınırlamak için alan kırpma. */
function cap(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}

export async function POST(request: Request) {
  try {
    const raw: unknown = await request.json().catch(() => ({}));
    const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

    const context = body.context && typeof body.context === "object" ? body.context : undefined;

    logError("İstemci hatası", undefined, {
      source: "client",
      clientMessage: cap(body.message, 500) ?? "Bilinmeyen istemci hatası",
      clientStack: cap(body.stack, 4000),
      digest: cap(body.digest, 200),
      path: cap(body.path, 500),
      userAgent: cap(request.headers.get("user-agent"), 500),
      clientContext: context,
    });
  } catch {
    // Hata toplama ucu kendi içinde hata üretmemeli.
  }

  return NextResponse.json({ ok: true });
}
