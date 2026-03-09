import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";

export const metadata: Metadata = {
  title: {
    default: "KomşuApp - Mahallende Birlikte",
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
    title: "KomşuApp - Mahallende Birlikte",
    description:
      "KomşuApp ile mahallenizdeki komşularınızla tanışın, haberleşin, alışveriş yapın ve birlikte etkinlikler düzenleyin.",
    type: "website",
    siteName: "KomşuApp",
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: "KomşuApp - Mahallende Birlikte",
    description:
      "Türkiye'nin mahalle sosyal ağı. Komşularınızla bağlanın.",
  },
  manifest: "/manifest.json",
  themeColor: "#00833e",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KomşuApp",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
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
