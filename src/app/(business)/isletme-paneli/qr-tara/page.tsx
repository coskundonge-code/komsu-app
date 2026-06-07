import Link from 'next/link'
import { QrCode, CreditCard, Percent, Clock } from 'lucide-react'

// Mahalle Kart QR tarama: kart-okutma → müşteri doğrulama → indirim itfa (redemption)
// akışı henüz YOK; backing tablolar (mahallem_cards / card_transactions) BOŞ. Sahte
// "Geçerli Kart / Ahmet Kaya / MK-2026-0847" ve uydurma tarama geçmişi göstermek
// (kasada yanlış indirim uygulanmasına yol açabilir) yerine dürüst "çok yakında" sayfası
// gösteriyoruz. Prototip tarayıcı UI git geçmişinde kaldı; Mahalle Kart canlıya alınınca
// gerçek kart doğrulamasına bağlı geri yazılır.
// bkz. TECH_DEBT #12. (2026-06-07)
export default function QRTaraPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-xl">
          <QrCode className="w-10 h-10 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-primary">QR kod tarama çok yakında</h1>
          <p className="text-text-secondary">
            Müşterilerinizin Mahalle Kart QR kodunu okutup anında indirim uygulayabileceğiniz
            bu ekran, Mahalle Kart yayınlandığında gerçek kart doğrulamasıyla birlikte açılacak.
          </p>
        </div>
        <div className="bg-surface rounded-2xl border border-border p-5 text-left space-y-4">
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">Kart doğrula:</span>{' '}
              müşterinin kartını okutarak üyeliği teyit edin.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Percent className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">İndirim uygula:</span>{' '}
              tanımladığınız indirimi tek dokunuşla geçerli kılın.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">Tarama geçmişi:</span>{' '}
              gün içindeki işlemlerinizi takip edin.
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 text-sm text-text-muted">
          <Clock className="w-4 h-4" />
          <span>Mahalle Kart yayınlanınca tarama açılacak.</span>
        </div>
        <div>
          <Link
            href="/isletme-paneli"
            className="inline-block px-6 py-3 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-hover transition-colors"
          >
            Panele dön
          </Link>
        </div>
      </div>
    </div>
  )
}
