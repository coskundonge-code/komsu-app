import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Mesajlar',
  description: 'Mahallemiz\'de komşularınızla güvenli bir şekilde mesajlaşın. Bire bir veya grup sohbetleri yapın ve daha yakın bağlantılar kurun.',
  openGraph: { url: 'https://komsu-app.vercel.app/mesajlar' },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
