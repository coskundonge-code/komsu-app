import { redirect } from 'next/navigation'

// NOT (2026-06-07 / pazara-hazırlık denetimi): Bu sayfa, gerçek işletme kayıt
// akışı olan /isletme-ekle tarafından ASILDI (supersede). Eski prototipte
// "Doğrula" butonu adres doğrulamayı SAHTE yapıyordu ve kayıtta startFreeTrial()
// çağrılmıyordu; referans değeri kalmadığı için kaldırıldı (gerekirse git
// geçmişinden bulunabilir). Güncel üyelik modeli: 99₺/ay veya 990₺/yıl + 3 ay
// ücretsiz deneme (tek kaynak: pricing.ts → BUSINESS_MEMBERSHIP). Ziyaretçiyi
// kanonik /isletme-ekle akışına sunucu tarafında yönlendiriyoruz.
export default function EsnafKayitPage() {
  redirect('/isletme-ekle')
}
