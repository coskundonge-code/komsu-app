import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Topluluk Kuralları | KomşuApp",
  description:
    "KomşuApp Topluluk Kuralları. Güvenli ve saygılı bir topluluk oluşturmak için bizimle yapın.",
  openGraph: {
    url: "https://komsuapp.com/topluluk-kurallari",
    title: "Topluluk Kuralları | KomşuApp",
    description:
      "KomşuApp Topluluk Kuralları. Güvenli ve saygılı bir topluluk oluşturmak için bizimle yapın.",
  },
  twitter: {
    title: "Topluluk Kuralları | KomşuApp",
    description:
      "KomşuApp Topluluk Kuralları. Güvenli ve saygılı bir topluluk oluşturmak için bizimle yapın.",
  },
});

export default function TopluluKurallarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
