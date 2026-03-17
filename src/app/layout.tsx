import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { JsonLd } from "@/components/shared/json-ld";
import { CookieBanner } from "@/components/shared/cookie-banner";
import { PWAInstallPrompt } from "@/components/shared/pwa-install-prompt";
import { BackToTop } from "@/components/shared/back-to-top";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#00833e",
};

export const metadata: Metadata = {
  title: {
    default: "Mahallem - Mahalleni Keşfet, Komşularınla Bağlan",
    template: "%s | Mahallem",
  },
  description:
    "Türkiye'nin mahalle sosyal ağı. Mahallem ile mahallenizdeki komşularınızla tanışın, haberleşin, alışveriş yapın, etkinliklere katılın ve yerel işletmeleri keşfedin.",
  keywords: [
    "komşu",
    "mahalle",
    "sosyal ağ",
    "topluluk",
    "yerel",
    "etkinlik",
    "pazar yeri",
    "komşuluk",
    "mahalle haberleri",
    "yerel işletmeler",
    "mahalle pazarı",
    "komşu ağı",
    "mahalle uygulaması",
    "yerel iş",
    "mahalle grupları",
  ],
  authors: [
    {
      name: "Mahallem",
      url: "https://mahallem.com",
    },
  ],
  creator: "Mahallem",
  publisher: "Mahallem",
  openGraph: {
    title: "Mahallem - Mahalleni Keşfet, Komşularınla Bağlan",
    description:
      "Türkiye'nin mahalle sosyal ağı. Mahallem ile mahallenizdeki komşularınızla tanışın, haberleşin, alışveriş yapın ve etkinliklere katılın.",
    type: "website",
    siteName: "Mahallem",
    locale: "tr_TR",
    url: "https://mahallem.com",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Mahallem Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@mahallem",
    creator: "@mahallem",
    title: "Mahallem - Mahalleni Keşfet, Komşularınla Bağlan",
    description:
      "Türkiye'nin mahalle sosyal ağı. Komşularınızla bağlanın, etkinliklere katılın, alışveriş yapın.",
    images: ["/icon-512.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mahallem",
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
  formatDetection: {
    email: false,
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
          {children}
          <PWAInstallPrompt />
          <CookieBanner />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
