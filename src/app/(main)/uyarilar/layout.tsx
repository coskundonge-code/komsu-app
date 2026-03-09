import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Güvenlik Uyarıları',
  description: 'Mahallenizdeki güvenlik uyarıları ve önemli duyurular. Komşularınızın paylaştığı tehlikeleri hakkında haberdar kalın ve birlikte güvenli bir mahalle oluşturun.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
