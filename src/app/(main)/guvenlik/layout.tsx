import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Güvenlik | KomşuApp",
  description:
    "KomşuApp Güvenlik. Hesabınızı nasıl koruyabileceğinizi ve güvenli kalabileceğinizi öğrenin.",
  openGraph: {
    url: "https://komsuapp.com/guvenlik",
    title: "Güvenlik | KomşuApp",
    description:
      "KomşuApp Güvenlik. Hesabınızı nasıl koruyabileceğinizi ve güvenli kalabileceğinizi öğrenin.",
  },
  twitter: {
    title: "Güvenlik | KomşuApp",
    description:
      "KomşuApp Güvenlik. Hesabınızı nasıl koruyabileceğinizi ve güvenli kalabileceğinizi öğrenin.",
  },
});

export default function GuvenlikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
