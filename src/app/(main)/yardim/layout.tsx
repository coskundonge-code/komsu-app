import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: 'Yardım Merkezi',
  description:
    "Mahallemiz Yardım Merkezi. Sık sorulan sorulara ve destek kaynağına erişin.",
  openGraph: {
    url: "https://mahallem.com/yardim",
    title: 'Yardım Merkezi',
    description:
      "Mahallemiz Yardım Merkezi. Sık sorulan sorulara ve destek kaynağına erişin.",
  },
  twitter: {
    title: 'Yardım Merkezi',
    description:
      "Mahallemiz Yardım Merkezi. Sık sorulan sorulara ve destek kaynağına erişin.",
  },
});

export default function YardimlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
