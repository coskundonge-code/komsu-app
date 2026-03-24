import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get("title") || "Mahallemiz";
  const description =
    searchParams.get("description") ||
    "Mahalleni Keşfet, Komşularınla Bağlan";
  const type = searchParams.get("type") || "default";

  // Type-based icon mapping
  const typeIcons: Record<string, string> = {
    default: "🏘️",
    pazar: "🛒",
    etkinlik: "🎉",
    isletme: "🏪",
    blog: "📝",
    grup: "👥",
    uyari: "🔔",
    profil: "👤",
  };

  const icon = typeIcons[type] || typeIcons.default;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f2f5",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            backgroundColor: "#00833e",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 60px",
            maxWidth: "900px",
          }}
        >
          {/* Icon */}
          <div
            style={{
              fontSize: "72px",
              marginBottom: "20px",
              display: "flex",
            }}
          >
            {icon}
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: "#1a1a1a",
              textAlign: "center",
              lineHeight: 1.2,
              marginBottom: "16px",
              display: "flex",
            }}
          >
            {title.length > 60 ? title.substring(0, 57) + "..." : title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: "24px",
              color: "#666666",
              textAlign: "center",
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            {description.length > 120
              ? description.substring(0, 117) + "..."
              : description}
          </div>
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#00833e",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            M
          </div>
          <div
            style={{
              fontSize: "22px",
              fontWeight: "600",
              color: "#00833e",
              display: "flex",
            }}
          >
            Mahallemiz
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "#999999",
              display: "flex",
            }}
          >
            • Mahalle Sosyal Ağı
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
