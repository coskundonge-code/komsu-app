import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "İletişim | KomşuApp",
  description:
    "KomşuApp ile iletişime geçin. Sorular, öneriler ve destek için bize yazın.",
  openGraph: {
    url: "https://komsuapp.com/iletisim",
    title: "İletişim | KomşuApp",
    description:
      "KomşuApp ile iletişime geçin. Sorular, öneriler ve destek için bize yazın.",
  },
  twitter: {
    title: "İletişim | KomşuApp",
    description:
      "KomşuApp ile iletişime geçin. Sorular, öneriler ve destek için bize yazın.",
  },
});

export default function IletisimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
