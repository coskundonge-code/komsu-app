import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Mahallemiz Kart',
  description: 'Dijital mahalle kartınızla yerel esnaflardan indirim kazanın, puan biriktirin ve askıda bağış yapın.',
  openGraph: { url: 'https://komsu-app.vercel.app/mahallem-kart' },
});

export default function MahallemizKartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
