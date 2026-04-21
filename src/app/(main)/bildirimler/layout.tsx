import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Bildirimler',
  description: 'Mahallemiz bildirimlerinizi görüntüleyin. Etkinlik davetiyeleri, grup güncellemeleri ve diğer önemli haberler hakkında haberdar kalın.',
  openGraph: { url: 'https://komsu-app.vercel.app/bildirimler' },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
