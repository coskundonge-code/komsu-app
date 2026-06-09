import { redirect } from 'next/navigation'

// NOT (2026-06-07): Bu rota eskiden `mockNewsDetail` adında 2 sahte "haber" makalesi
// (+ demo-images görselleri) gösteriyordu. Gerçek bir "haberler" tablosu YOK; gerçek
// gönderi/etkinlik id'leri bu iki anahtarla (1/2) eşleşmediği için sayfa HER ZAMAN
// sahte içeriğe düşüyordu. Üstelik beğen/yorum/paylaş/kaydet düğmeleri hiçbir şey
// yapmıyordu. /kesfet akışı artık her öğeyi kendi gerçek detay sayfasına bağlıyor
// (/etkinlikler/[id], /pazar/ilan/[id], /uyarilar). Bu ölü rotaya gelen herkesi
// /kesfet'e geri yönlendiriyoruz. Bkz. TECH_DEBT #12.
export default function KesfetDetailRedirect() {
  redirect('/kesfet')
}
