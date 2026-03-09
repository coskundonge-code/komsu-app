import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";

export const metadata: Metadata = {
  title: "KomşuApp - Mahallende Birlikte",
  description:
    "KomşuApp ile mahallenizdeki insanlarla bağlanın, haberleşin ve birlikte etkinlikler düzenleyin.",
  keywords: [
    "komşu",
    "mahalle",
    "sosyal ağ",
    "topluluk",
    "yerel",
    "etkinlik",
  ],
  openGraph: {
    title: "KomşuApp - Mahallende Birlikte",
    description:
      "KomşuApp ile mahallenizdeki insanlarla bağlanın, haberleşin ve birlikte etkinlikler düzenleyin.",
    type: "website",
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
