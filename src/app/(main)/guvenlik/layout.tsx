import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: 'Güvenlik',
  description:
    "Mahallemiz Güvenlik. Hesabınızı nasıl koruyabileceğinizi ve güvenli kalabileceğinizi öğrenin.",
  openGraph: {
    url: "https://komsu-app.vercel.app/guvenlik",
    title: 'Güvenlik',
    description:
      "Mahallemiz Güvenlik. Hesabınızı nasıl koruyabileceğinizi ve güvenli kalabileceğinizi öğrenin.",
  },
  twitter: {
    title: 'Güvenlik',
    description:
      "Mahallemiz Güvenlik. Hesabınızı nasıl koruyabileceğinizi ve güvenli kalabileceğinizi öğrenin.",
  },
});

export default function GuvenlikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
