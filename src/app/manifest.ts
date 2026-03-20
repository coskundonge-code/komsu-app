import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mahallemiz - Mahalle Sosyal Ağı",
    short_name: "Mahallemiz",
    description: "Türkiye'nin mahalle sosyal ağı. Komşularınızla tanışın, etkinliklere katılın, pazar yerde alışveriş yapın.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    theme_color: "#00833e",
    background_color: "#f0f2f5",
    lang: "tr",
    dir: "ltr",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-256.png",
        sizes: "256x256",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: [
      "social",
      "lifestyle",
      "productivity",
      "shopping",
      "utilities",
    ],
    screenshots: [
      {
        src: "/screenshot-narrow.png",
        sizes: "540x720",
        type: "image/png",
        form_factor: "narrow",
      },
      {
        src: "/screenshot-wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
      },
    ],
    shortcuts: [
      {
        name: "Pazar",
        short_name: "Pazar",
        description: "Komşularından ürün bul ve sat",
        url: "/pazar",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      {
        name: "Etkinlikler",
        short_name: "Etkinlikler",
        description: "Mahallendeki etkinlikleri keşfet",
        url: "/etkinlikler",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      {
        name: "Gruplar",
        short_name: "Gruplar",
        description: "İlgi alanlarında gruplar oluştur",
        url: "/gruplar",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      {
        name: "İşletmeler",
        short_name: "İşletmeler",
        description: "Yerel işletmeleri keşfet",
        url: "/isletmeler",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    ],
    share_target: {
      action: "/share",
      method: "POST",
      enctype: "multipart/form-data",
      params: {
        title: "title",
        text: "text",
        url: "url",
        files: [
          {
            name: "image",
            accept: ["image/*"],
          },
        ],
      },
    },
    prefer_related_applications: false,
    related_applications: [],
  };
}
