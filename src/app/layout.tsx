import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#00833e",
};

export const metadata: Metadata = {
  title: {
    default: "KomşuApp - Mahalleni Keşfet",
    template: "%s | KomşuApp",
  },
  description:
    "KomşuApp ile mahallenizdeki komşularınızla tanışın, haberleşin, alışveriş yapın ve birlikte etkinlikler düzenleyin. Türkiye'nin mahalle sosyal ağı.",
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
  ],
  openGraph: {
    title: "KomşuApp - Mahalleni Keşfet",
    description:
      "KomşuApp ile mahallenizdeki komşularınızla tanışın, haberleşin, alışveriş yapın ve birlikte etkinlikler düzenleyin.",
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
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KomşuApp - Mahalleni Keşfet",
    description:
      "Türkiye'nin mahalle sosyal ağı. Komşularınızla bağlanın.",
    images: ["/icon-512.png"],
    creator: "@komsuapp",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KomşuApp",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
