import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Nasıl Çalışır? | Mahallemiz",
  description:
    "Mahallemiz nasıl çalışıyor öğrenin. Adım adım rehberimizi izleyin ve başlayın.",
  openGraph: {
    url: "https://mahallem.com/nasil-calisir",
    title: "Nasıl Çalışır? | Mahallemiz",
    description:
      "Mahallemiz nasıl çalışıyor öğrenin. Adım adım rehberimizi izleyin ve başlayın.",
  },
  twitter: {
    title: "Nasıl Çalışır? | Mahallemiz",
    description:
      "Mahallemiz nasıl çalışıyor öğrenin. Adım adım rehberimizi izleyin ve başlayın.",
  },
});

export default function NasilCalisirLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
