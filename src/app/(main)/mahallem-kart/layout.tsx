import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mahallem Kart | Mahallem',
  description: 'Dijital mahalle kartınızla yerel esnaflardan indirim kazanın, puan biriktirin ve askıda bağış yapın.',
}

export default function MahallemKartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
