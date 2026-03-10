import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "İşletmeler - Mahallenizdeki Önerilen Dükkanlar",
  description: "Mahallenizdeki en iyi işletmeleri, restoranları, kafeleri ve hizmet sağlayıcılarını keşfedin. Komşularının önerileri ve değerlendirmeleri ile seçim yapın.",
  keywords: ["işletmeler", "mahalle işletmeleri", "restoranlar", "kafeler", "hizmet sağlayıcılar", "yerel işletmeler"],
};

export default function IsletmelerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
