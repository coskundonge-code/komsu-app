import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Blog | KomşuApp",
  description:
    "KomşuApp Blog. Mahalle hayatı, komşuluk ve yerel topluluklar hakkında yazılar.",
  openGraph: {
    url: "https://komsuapp.com/blog",
    title: "Blog | KomşuApp",
    description:
      "KomşuApp Blog. Mahalle hayatı, komşuluk ve yerel topluluklar hakkında yazılar.",
  },
  twitter: {
    title: "Blog | KomşuApp",
    description:
      "KomşuApp Blog. Mahalle hayatı, komşuluk ve yerel topluluklar hakkında yazılar.",
  },
});

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
