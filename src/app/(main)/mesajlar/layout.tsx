import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mesajlar',
  description: 'Mahallemiz\'de komşularınızla güvenli bir şekilde mesajlaşın. Bire bir veya grup sohbetleri yapın ve daha yakın bağlantılar kurun.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
