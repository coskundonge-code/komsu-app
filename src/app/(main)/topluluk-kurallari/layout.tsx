import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Topluluk Kuralları | Mahallem",
  description:
    "Mahallem Topluluk Kuralları. Güvenli ve saygılı bir topluluk oluşturmak için bizimle yapın.",
  openGraph: {
    url: "https://mahallem.com/topluluk-kurallari",
    title: "Topluluk Kuralları | Mahallem",
    description:
      "Mahallem Topluluk Kuralları. Güvenli ve saygılı bir topluluk oluşturmak için bizimle yapın.",
  },
  twitter: {
    title: "Topluluk Kuralları | Mahallem",
    description:
      "Mahallem Topluluk Kuralları. Güvenli ve saygılı bir topluluk oluşturmak için bizimle yapın.",
  },
});

export default function TopluluKurallarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
