import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mahallemiz Kart | Mahallemiz',
  description: 'Dijital mahalle kartınızla yerel esnaflardan indirim kazanın, puan biriktirin ve askıda bağış yapın.',
}

export default function MahallemizKartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
