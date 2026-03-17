import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Güvenlik | Mahallem",
  description:
    "Mahallem Güvenlik. Hesabınızı nasıl koruyabileceğinizi ve güvenli kalabileceğinizi öğrenin.",
  openGraph: {
    url: "https://mahallem.com/guvenlik",
    title: "Güvenlik | Mahallem",
    description:
      "Mahallem Güvenlik. Hesabınızı nasıl koruyabileceğinizi ve güvenli kalabileceğinizi öğrenin.",
  },
  twitter: {
    title: "Güvenlik | Mahallem",
    description:
      "Mahallem Güvenlik. Hesabınızı nasıl koruyabileceğinizi ve güvenli kalabileceğinizi öğrenin.",
  },
});

export default function GuvenlikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
