import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Çerez Politikası | KomşuApp",
  description:
    "KomşuApp Çerez Politikası. Çerezlerin nasıl kullanıldığını ve ayarlarınızı nasıl yönetebileceğinizi öğrenin.",
  openGraph: {
    url: "https://komsuapp.com/cerez-politikasi",
    title: "Çerez Politikası | KomşuApp",
    description:
      "KomşuApp Çerez Politikası. Çerezlerin nasıl kullanıldığını ve ayarlarınızı nasıl yönetebileceğinizi öğrenin.",
  },
  twitter: {
    title: "Çerez Politikası | KomşuApp",
    description:
      "KomşuApp Çerez Politikası. Çerezlerin nasıl kullanıldığını ve ayarlarınızı nasıl yönetebileceğinizi öğrenin.",
  },
});

export default function CerezPolitikasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
