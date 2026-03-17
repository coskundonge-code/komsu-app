import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Kariyer | Mahallem",
  description:
    "Mahallem Kariyer. Ekibimize katılın ve mahalle topluluklarını güçlendirmeye yardımcı olun.",
  openGraph: {
    url: "https://mahallem.com/kariyer",
    title: "Kariyer | Mahallem",
    description:
      "Mahallem Kariyer. Ekibimize katılın ve mahalle topluluklarını güçlendirmeye yardımcı olun.",
  },
  twitter: {
    title: "Kariyer | Mahallem",
    description:
      "Mahallem Kariyer. Ekibimize katılın ve mahalle topluluklarını güçlendirmeye yardımcı olun.",
  },
});

export default function KariyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
