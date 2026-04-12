import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { JsonLd } from "@/components/shared/json-ld";
import { CookieBanner } from "@/components/shared/cookie-banner";
import { PWAInstallPrompt } from "@/components/shared/pwa-install-prompt";
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
    "Türkiye'nin mahalle sosyal ağı. Mahallemiz ile mahallenizdeki komşularınızla tanışın, haberleşin, alışveriş yapın, etkinliklere katılın ve yerel işletmeleri keşfedin.",
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
      name: "Mahallemiz",
      url: "https://komsu-app.vercel.app",
    },
  ],
  creator: "Mahallemiz",
  publisher: "Mahallemiz",
  openGraph: {
    title: "Mahallemiz - Mahalleni Keşfet, Komşularınla Bağlan",
    description:
      "Türkiye'nin mahalle sosyal ağı. Mahallemiz ile mahallenizdeki komşularınızla tanışın, haberleşin, alışveriş yapın ve etkinliklere katılın.",
    type: "website",
    siteName: "Mahallemiz",
    locale: "tr_TR",
    url: "https://komsu-app.vercel.app",
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
  metadataBase: new URL("https://komsu-app.vercel.app"),
  alternates: {
    canonical: "/",
  },
  twitter: {
    card: "summary_large_image",
    site: "@mahallemiz",
    creator: "@mahallemiz",
    title: "Mahallemiz - Mahalleni Keşfet, Komşularınla Bağlan",
    description:
      "Türkiye'nin mahalle sosyal ağı. Komşularınızla bağlanın, etkinliklere katılın, alışveriş yapın.",
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
        <meta charSet="utf-8" />
        <JsonLd />
      </head>
      <body className="antialiased">
        <Providers>
          <NativeAppInit />
          {children}
          <PWAInstallPrompt />
          <CookieBanner />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
