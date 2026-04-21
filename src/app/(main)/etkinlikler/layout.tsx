import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Etkinlikler',
  description: 'Mahallenizdeki sosyal, spor, kültür ve eğitim etkinliklerini keşfedin. Komşularınızla katılın, yeni arkadaşlıklar kurun ve topluluk etkinliklerine katılın.',
  keywords: ['etkinlikler', 'mahalle etkinlikleri', 'sosyal etkinlikler', 'spor etkinlikleri', 'kültür etkinlikleri'],
  openGraph: { url: 'https://komsu-app.vercel.app/etkinlikler' },
});

export default function EtkinliklerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
