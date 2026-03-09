import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pazar Yeri',
  description: 'KomşuApp Pazar Yeri\'nde mahallenizdeki ürünleri keşfedin. Komşularınızdan satın alın ve satış yapın. Güvenli ve kolay alışveriş deneyimi.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
