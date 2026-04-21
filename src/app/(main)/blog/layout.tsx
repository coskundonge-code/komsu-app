import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Blog',
  description: 'Mahalleleriniz, güvenlik ve topluluk hakkında ilham verici hikayeler, pratik ipuçları ve son güncellemeleri okuyun. Komşuluk kültürünü güçlendirin.',
  keywords: ['blog', 'mahalle rehberi', 'güvenlik ipuçları', 'topluluk haberleri', 'komşuluk'],
  openGraph: { url: 'https://komsu-app.vercel.app/blog' },
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
