import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'İşletmeler',
  description: 'Mahallenizdeki yerel işletmeleri keşfedin. Restoranlar, kafeler, dükkanlar ve diğer hizmetleri bulun. Komşu işletmelerini destekleyin.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
