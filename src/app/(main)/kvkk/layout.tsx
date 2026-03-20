import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "KVKK | Mahallemiz",
  description:
    "Mahallemiz KVKK Aydınlatma Metni. Kişisel verilerinizin korunması hakkında bilgi edinin.",
  openGraph: {
    url: "https://mahallem.com/kvkk",
    title: "KVKK | Mahallemiz",
    description:
      "Mahallemiz KVKK Aydınlatma Metni. Kişisel verilerinizin korunması hakkında bilgi edinin.",
  },
  twitter: {
    title: "KVKK | Mahallemiz",
    description:
      "Mahallemiz KVKK Aydınlatma Metni. Kişisel verilerinizin korunması hakkında bilgi edinin.",
  },
});

export default function KVKKLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
