import { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/pazar",
          "/etkinlikler",
          "/gruplar",
          "/isletmeler",
          "/blog",
          "/hakkinda",
          "/nasil-calisir",
          "/pazar/kategori",
          "/isletmeler/kategori",
        ],
        disallow: [
          "/admin",
          "/isletme-paneli",
          "/ayarlar",
          "/profil",
          "/bildirimler",
          "/uyarilar",
          "/gonderi",
          "/pazar/ilanlarim",
          "/kesfet",
          "/ara",
          "/*.json$",
          "/*\\?*",
          "/api",
          "/*api*",
        ],
        crawlDelay: 1,
      },
      {
        userAgent: "Googlebot",
        allow: ["/"],
        disallow: [
          "/admin",
          "/isletme-paneli",
          "/ayarlar",
          "/profil",
          "/bildirimler",
          "/api",
        ],
        crawlDelay: 0,
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/"],
      },
      {
        userAgent: "Bingbot",
        allow: ["/"],
        disallow: [
          "/admin",
          "/isletme-paneli",
          "/ayarlar",
          "/profil",
          "/bildirimler",
          "/api",
        ],
        crawlDelay: 1,
      },
      {
        userAgent: "Slurp",
        allow: ["/"],
        disallow: [
          "/admin",
          "/isletme-paneli",
          "/ayarlar",
          "/profil",
          "/bildirimler",
        ],
        crawlDelay: 1,
      },
    ],
    sitemap: [
      `${BASE_URL}/sitemap.xml`,
    ],
    host: BASE_URL,
  };
}
