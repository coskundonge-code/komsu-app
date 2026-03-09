import { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/admin",
          "/isletme-paneli",
          "/ayarlar",
          "/mesajlar",
          "/profil",
          "/bildirimler",
          "/uyarilar",
          "/gonderi",
          "/pazar/ilanlarim",
          "/kesfet",
          "/ara",
          "/*.json",
          "/*?*",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/"],
        disallow: [
          "/admin",
          "/isletme-paneli",
          "/ayarlar",
          "/mesajlar",
          "/profil",
          "/bildirimler",
        ],
      },
      {
        userAgent: "Bingbot",
        allow: ["/"],
        disallow: [
          "/admin",
          "/isletme-paneli",
          "/ayarlar",
          "/mesajlar",
          "/profil",
          "/bildirimler",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
