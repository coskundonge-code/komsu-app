import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Pazar',
  description: 'Mahallenizdeki ikinci el eşya, ürün ve hizmetleri keşfedin. Komşularınızdan doğrudan alışveriş yapın, güvenli işlemler ve hızlı teslimat.',
  keywords: ['satılık eşya', 'ikinci el', 'pazar', 'mahalle pazarı', 'ücretsiz eşya', 'komşu alışverişi'],
  openGraph: { url: 'https://komsu-app.vercel.app/pazar' },
});

export default function PazarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
