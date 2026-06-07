import { redirect } from 'next/navigation'

// NOT (2026-06-07 / pazara-hazırlık denetimi): Bu sayfa, gerçek işletme kayıt
// akışı olan /isletme-ekle tarafından ASILDI (supersede). Eski prototip
// (99₺/ay üyelik modeli — gerçek model 1900₺/ay + 3 ay ücretsiz deneme ile
// çelişiyordu, "Doğrula" butonu adres doğrulamayı SAHTE yapıyordu, kayıtta
// startFreeTrial() çağrılmıyordu) referans değeri kalmadığı için kaldırıldı;
// gerekirse git geçmişinden bulunabilir. Ziyaretçiyi kanonik /isletme-ekle
// akışına sunucu tarafında yönlendiriyoruz.
export default function EsnafKayitPage() {
  redirect('/isletme-ekle')
}
