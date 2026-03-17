import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Hakkında | Mahallem",
  description:
    "Mahallem hakkında, misyonumuz, vizyonumuz ve değerlerimiz hakkında bilgi edinin. Mahalle topluluklarını güçlendiren platform.",
  openGraph: {
    url: "https://mahallem.com/hakkinda",
    title: "Hakkında | Mahallem",
    description:
      "Mahallem hakkında, misyonumuz, vizyonumuz ve değerlerimiz hakkında bilgi edinin.",
  },
  twitter: {
    title: "Hakkında | Mahallem",
    description:
      "Mahallem hakkında, misyonumuz, vizyonumuz ve değerlerimiz hakkında bilgi edinin.",
  },
});

export default function HakkindaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
