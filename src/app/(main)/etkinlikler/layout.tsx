import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Etkinlikler',
  description: 'Mahallenizdeki etkinlikleri keşfedin ve organize edin. Komşularınızla birlikte kültürel ve sosyal etkinliklerde katılın.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
