import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";
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
    default: "KomşuApp - Mahalleni Keşfet, Komşularınla Bağlan",
    template: "%s | KomşuApp",
  },
  description:
    "Türkiye'nin mahalle sosyal ağı. KomşuApp ile mahallenizdeki komşularınızla tanışın, haberleşin, alışveriş yapın, etkinliklere katılın ve yerel işletmeleri keşfedin.",
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
      name: "KomşuApp",
      url: "https://komsuapp.com",
    },
  ],
  creator: "KomşuApp",
  publisher: "KomşuApp",
  openGraph: {
    title: "KomşuApp - Mahalleni Keşfet, Komşularınla Bağlan",
    description:
      "Türkiye'nin mahalle sosyal ağı. KomşuApp ile mahallenizdeki komşularınızla tanışın, haberleşin, alışveriş yapın ve etkinliklere katılın.",
    type: "website",
    siteName: "KomşuApp",
    locale: "tr_TR",
    url: "https://komsuapp.com",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "KomşuApp Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@komsuapp",
    creator: "@komsuapp",
    title: "KomşuApp - Mahalleni Keşfet, Komşularınla Bağlan",
    description:
      "Türkiye'nin mahalle sosyal ağı. Komşularınızla bağlanın, etkinliklere katılın, alışveriş yapın.",
    images: ["/icon-512.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KomşuApp",
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
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
