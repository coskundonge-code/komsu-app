import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Etkinlikler - Mahallede Neler Oluyor?",
  description: "Mahallenizdeki sosyal, spor, kültür ve eğitim etkinliklerini keşfedin. Komşularınızla katılın, yeni arkadaşlıklar kurun ve topluluk etkinliklerine katılın.",
  keywords: ["etkinlikler", "mahalle etkinlikleri", "sosyal etkinlikler", "spor etkinlikleri", "kültür etkinlikleri"],
};

export default function EtkinliklerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
