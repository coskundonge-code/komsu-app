import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Keşfet',
  description: 'Mahallemiz\'de mahallenizdeki yeni insanları, etkinlikleri ve fırsatları keşfedin. İlginizi çeken içeriği görüntüleyin ve bağlantı kurun.',
  openGraph: { url: 'https://komsu-app.vercel.app/kesfet' },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
