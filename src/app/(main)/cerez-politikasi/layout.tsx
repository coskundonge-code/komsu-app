import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Çerez Politikası | Mahallemiz",
  description:
    "Mahallemiz Çerez Politikası. Çerezlerin nasıl kullanıldığını ve ayarlarınızı nasıl yönetebileceğinizi öğrenin.",
  openGraph: {
    url: "https://mahallem.com/cerez-politikasi",
    title: "Çerez Politikası | Mahallemiz",
    description:
      "Mahallemiz Çerez Politikası. Çerezlerin nasıl kullanıldığını ve ayarlarınızı nasıl yönetebileceğinizi öğrenin.",
  },
  twitter: {
    title: "Çerez Politikası | Mahallemiz",
    description:
      "Mahallemiz Çerez Politikası. Çerezlerin nasıl kullanıldığını ve ayarlarınızı nasıl yönetebileceğinizi öğrenin.",
  },
});

export default function CerezPolitikasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
