import Link from 'next/link'
import { TrendingUp, QrCode, Users, Percent, Clock } from 'lucide-react'

// Mahalle Kart performans takibi: backing tablolar (card_transactions / business_discounts)
// canlı şemada VAR ama BOŞ; QR tarama, ciro ve sadık-müşteri ölçümü için gerçek veri akışı
// henüz YOK. Sahte "147 tarama / ₺24.500 ciro" ve uydurma müşteri isimleri (Ahmet K. vb.)
// göstermek yerine dürüst "çok yakında" sayfası gösteriyoruz. Eksiksiz prototip UI git
// geçmişinde kaldı; Mahalle Kart canlıya alınınca gerçek veriye bağlı geri yazılır.
// bkz. TECH_DEBT #12. (2026-06-07)
export default function PerformansPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-xl">
          <TrendingUp className="w-10 h-10 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-primary">Performans takibi çok yakında</h1>
          <p className="text-text-secondary">
            Mahalle Kart ile yapılan QR taramaları, verdiğiniz indirimler ve sadık
            müşterileriniz burada raporlanacak. Mahalle Kart hazır olunca bu ekran gerçek
            verilerinizle dolacak.
          </p>
        </div>
        <div className="bg-surface rounded-2xl border border-border p-5 text-left space-y-4">
          <div className="flex items-start gap-3">
            <QrCode className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">QR taramaları:</span>{' '}
              günlük ve haftalık tarama sayıları.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">Sadık müşteriler:</span>{' '}
              en sık gelen müşterilerinizi görün.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Percent className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">Ciro ve indirim:</span>{' '}
              kampanyalarınızın getirisini ölçün.
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 text-sm text-text-muted">
          <Clock className="w-4 h-4" />
          <span>Mahalle Kart yayınlanınca buradan haberdar olacaksınız.</span>
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
