import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Güvenlik Uyarıları',
  description: 'Mahallenizdeki güvenlik uyarıları ve önemli duyurular. Komşularınızın paylaştığı tehlikeleri hakkında haberdar kalın ve birlikte güvenli bir mahalle oluşturun.',
  openGraph: { url: 'https://komsu-app.vercel.app/uyarilar' },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
