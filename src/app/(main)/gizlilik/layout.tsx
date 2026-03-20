import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Gizlilik Politikası | Mahallemiz",
  description:
    "Mahallemiz Gizlilik Politikası. Verileriniz nasıl korunduğunu ve kullanıldığını öğrenin.",
  openGraph: {
    url: "https://mahallem.com/gizlilik",
    title: "Gizlilik Politikası | Mahallemiz",
    description:
      "Mahallemiz Gizlilik Politikası. Verileriniz nasıl korunduğunu ve kullanıldığını öğrenin.",
  },
  twitter: {
    title: "Gizlilik Politikası | Mahallemiz",
    description:
      "Mahallemiz Gizlilik Politikası. Verileriniz nasıl korunduğunu ve kullanıldığını öğrenin.",
  },
});

export default function GizlilikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
