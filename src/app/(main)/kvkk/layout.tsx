import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "KVKK | KomşuApp",
  description:
    "KomşuApp KVKK Aydınlatma Metni. Kişisel verilerinizin korunması hakkında bilgi edinin.",
  openGraph: {
    url: "https://komsuapp.com/kvkk",
    title: "KVKK | KomşuApp",
    description:
      "KomşuApp KVKK Aydınlatma Metni. Kişisel verilerinizin korunması hakkında bilgi edinin.",
  },
  twitter: {
    title: "KVKK | KomşuApp",
    description:
      "KomşuApp KVKK Aydınlatma Metni. Kişisel verilerinizin korunması hakkında bilgi edinin.",
  },
});

export default function KVKKLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
