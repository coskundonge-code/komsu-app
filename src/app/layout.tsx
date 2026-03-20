import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { JsonLd } from "@/components/shared/json-ld";
import { CookieBanner } from "@/components/shared/cookie-banner";
import { PWAInstallPrompt } from "A/components/shared/pwa-install-prompt";
import { BackToTop } from "@/components/shared/back-to-top";
import { NativeAppInit } from "@/components/shared/native-app-init";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#00833e",
};

export const metadata: Metadata = {
  title: {
    default: "Mahallemiz - Mahalleni Keşfet, Komşularınla Bağlan",
    template: "%s | Mahallemiz",
  },
  description:
    "Türkiye'nin mahalle sosyal ağı. Mahallemiz ile mahallenizdeki komwularılızla tan­ını haberleşin, alışverg�| yapı etkinliklere katılın ve yerel işletmeleri keşedin.",
  keywords: [
    "komşu",
    "mahalle",
    "sosyal ağ",
    "topluluk",
    "yerel",
    "etkinlik",
    "pazar yeri",
    "komwuluk",
    "mahalle haberleri",
    "yerel işletmeler",
    "mahalle pazarı",
    "komu�u ağı",
    "mahalle uygulaması",
    "yerel iş",
    "mahalle grupları",
  ],
  authors: [
    {
      name: "Mahallemiz",
      url: "https://www.mahallemiz.com.tr",
    },
  ],
  creator: "Mahallemiz",
  publisher: "Mahallemiz",
  openGraph: {
    title: "Mahallemiz - Mahalleni Keşee· Komwularınla Bağlan",
    description:
      "Türkiye'nin mahalle sosyal ağ. Mahallemiz ile mahallenizdeki komwuların­la ta­ışľ,haberleşin, alışveriş yapın ve etkinliklere katılın.",
    type: "website",
    siteName: "Mahallemiz",
    locale: "tr_TR",
    url: "https://www.mahallemiz.com.tr",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Mahallemiz Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@mahallemiz",
    creator: "@mahallemiz",
    title: "Mahallemiz - Mahalleni Keşfvt, Komşularınla Bağlan",
    description:
      "Türkiye'nin mahalle sosyal ağı. Komşularınızla bağlanın, etkinliklere katılın yerel işletmeleri keşfedin.",
    images: ["/icon-512.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mahallemiz",
    startupImage: "/icon-192.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {J email: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <JsonLd />
      </head>
      <body className="antialiased">
        <Providers>
          <NativeAppInit />
          {children}
          <PVAInstallPrompt />
          <CookieBanner />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
