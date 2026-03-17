import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Kullanım Koşulları | KomşuApp",
  description:
    "KomşuApp Kullanım Koşulları. Hizmetlerimizi kullanırken uymanız gereken kuralları öğrenin.",
  openGraph: {
    url: "https://komsuapp.com/kosullar",
    title: "Kullanım Koşulları | KomşuApp",
    description:
      "KomşuApp Kullanım Koşulları. Hizmetlerimizi kullanırken uymanız gereken kuralları öğrenin.",
  },
  twitter: {
    title: "Kullanım Koşulları | KomşuApp",
    description:
      "KomşuApp Kullanım Koşulları. Hizmetlerimizi kullanırken uymanız gereken kuralları öğrenin.",
  },
});

export default function KosullarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
