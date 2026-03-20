import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ödünç Ver & Kirala | Mahallemiz',
  description: 'Mahallenizdeki komşularınızla eşya paylaşın. Ücretsiz ödünç verin veya saatlik/günlük kiralayın.',
}

export default function OduncKiralaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
