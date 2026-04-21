import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'İşletmeler',
  description: 'Mahallenizdeki en iyi işletmeleri, restoranları, kafeleri ve hizmet sağlayıcılarını keşfedin. Komşularının önerileri ve değerlendirmeleri ile seçim yapın.',
  keywords: ['işletmeler', 'mahalle işletmeleri', 'restoranlar', 'kafeler', 'hizmet sağlayıcılar', 'yerel işletmeler'],
  openGraph: { url: 'https://komsu-app.vercel.app/isletmeler' },
});

export default function IsletmelerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
