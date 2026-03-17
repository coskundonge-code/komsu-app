import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "İletişim | Mahallem",
  description:
    "Mahallem ile iletişime geçin. Sorular, öneriler ve destek için bize yazın.",
  openGraph: {
    url: "https://mahallem.com/iletisim",
    title: "İletişim | Mahallem",
    description:
      "Mahallem ile iletişime geçin. Sorular, öneriler ve destek için bize yazın.",
  },
  twitter: {
    title: "İletişim | Mahallem",
    description:
      "Mahallem ile iletişime geçin. Sorular, öneriler ve destek için bize yazın.",
  },
});

export default function IletisimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
