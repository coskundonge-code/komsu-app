import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gruplar',
  description: 'Mahallem\'de ilgi alanlarınıza göre gruplar oluşturun veya katılın. Mahallenizdeki insanlarla birlikte çeşitli konularda tartışın ve vakit geçirin.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
