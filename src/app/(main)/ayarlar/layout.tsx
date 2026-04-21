import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import SettingsLayoutClient from './layout-client';

export const metadata: Metadata = generatePageMetadata({
  title: 'Ayarlar',
  description: 'Mahallemiz hesap ayarlarınızı yönetin. Gizlilik, güvenlik, bildirim tercihlerini ve mahalle ayarlarınızı özelleştirin.',
  openGraph: { url: 'https://komsu-app.vercel.app/ayarlar' },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SettingsLayoutClient>{children}</SettingsLayoutClient>;
}
