import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Askıda Bağış',
  description: 'Askıda ekmek, et, süt, traş ve daha fazlası. Komşuna bir iyilik bırak, mahalleni güzelleştir.',
}

export default function AskidaBagisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
