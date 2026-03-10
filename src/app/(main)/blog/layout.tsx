import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Blog - Mahalle, Güvenlik ve Topluluk Rehberi",
  description: "Mahalleleriniz, güvenlik ve topluluk hakkında ilham verici hikayeler, pratik ipuçları ve son güncellemeleri okuyun. Komşuluk kültürünü güçlendirin.",
  keywords: ["blog", "mahalle rehberi", "güvenlik ipuçları", "topluluk haberleri", "komşuluk"],
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
