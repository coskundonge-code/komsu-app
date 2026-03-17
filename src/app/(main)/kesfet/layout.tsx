import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Keşfet',
  description: 'Mahallem\'de mahallenizdeki yeni insanları, etkinlikleri ve fırsatları keşfedin. İlginizi çeken içeriği görüntüleyin ve bağlantı kurun.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
