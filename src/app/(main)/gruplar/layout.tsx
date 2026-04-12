import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Gruplar',
  description: 'Mahallemiz\'de ilgi alanlarınıza göre gruplar oluşturun veya katılın. Mahallenizdeki insanlarla birlikte çeşitli konularda tartışın ve vakit geçirin.',
  openGraph: { url: 'https://komsu-app.vercel.app/gruplar' },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
