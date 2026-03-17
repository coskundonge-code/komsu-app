import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Pazar Yeri - Satılık ve Ücretsiz Eşya",
  description: "Mahallenizdeki ikinci el eşya, ürün ve hizmetleri keşfedin. Komşularınızdan doğrudan alışveriş yapın, güvenli işlemler ve hızlı teslimat.",
  keywords: ["satılık eşya", "ikinci el", "pazar", "mahalle pazarı", "ücretsiz eşya", "komşu alışverişi"],
};

export default function PazarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
