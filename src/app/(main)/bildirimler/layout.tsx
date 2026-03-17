import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bildirimler',
  description: 'Mahallem bildirimlerinizi görüntüleyin. Etkinlik davetiyeleri, grup güncellemeleri ve diğer önemli haberler hakkında haberdar kalın.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
