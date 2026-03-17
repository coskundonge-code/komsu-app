import { Metadata } from 'next';
import SettingsLayoutClient from './layout-client';

export const metadata: Metadata = {
  title: 'Ayarlar',
  description: 'KomşuApp hesap ayarlarınızı yönetin. Gizlilik, güvenlik, bildirim tercihlerini ve mahalle ayarlarınızı özelleştirin.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SettingsLayoutClient>{children}</SettingsLayoutClient>;
}
