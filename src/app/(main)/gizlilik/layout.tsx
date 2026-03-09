import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Gizlilik Politikası | KomşuApp",
  description:
    "KomşuApp Gizlilik Politikası. Verileriniz nasıl korunduğunu ve kullanıldığını öğrenin.",
  openGraph: {
    url: "https://komsuapp.com/gizlilik",
    title: "Gizlilik Politikası | KomşuApp",
    description:
      "KomşuApp Gizlilik Politikası. Verileriniz nasıl korunduğunu ve kullanıldığını öğrenin.",
  },
  twitter: {
    title: "Gizlilik Politikası | KomşuApp",
    description:
      "KomşuApp Gizlilik Politikası. Verileriniz nasıl korunduğunu ve kullanıldığını öğrenin.",
  },
});

export default function GizlilikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
