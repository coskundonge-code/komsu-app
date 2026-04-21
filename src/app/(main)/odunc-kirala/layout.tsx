import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Ödünç Ver & Kirala',
  description: 'Mahallenizdeki komşularınızla eşya paylaşın. Matkap, testere, masa, sandalye gibi eşyaları ücretsiz ödünç verin veya saatlik/günlük kiralayın.',
  openGraph: { url: 'https://komsu-app.vercel.app/odunc-kirala' },
});

export default function OduncKiralaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
