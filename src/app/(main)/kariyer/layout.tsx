import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: 'Kariyer',
  description:
    "Mahallemiz Kariyer. Ekibimize katılın ve mahalle topluluklarını güçlendirmeye yardımcı olun.",
  openGraph: {
    url: "https://komsu-app.vercel.app/kariyer",
    title: 'Kariyer',
    description:
      "Mahallemiz Kariyer. Ekibimize katılın ve mahalle topluluklarını güçlendirmeye yardımcı olun.",
  },
  twitter: {
    title: 'Kariyer',
    description:
      "Mahallemiz Kariyer. Ekibimize katılın ve mahalle topluluklarını güçlendirmeye yardımcı olun.",
  },
});

export default function KariyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
