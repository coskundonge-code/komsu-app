import Link from 'next/link'
import { CreditCard, Gift, QrCode, Clock, Percent } from 'lucide-react'

// Mahallem Kart: backing tablolar (mahallem_cards / business_discounts / card_transactions)
// canlı şemada VAR ama tamamen BOŞ; kart-verme, puan biriktirme ve indirim itfa (redemption)
// mantığı henüz YOK. Sahte 1250 puan + gerçek işletmelere atfedilmiş uydurma indirim göstermek
// yerine dürüst "çok yakında" sayfası gösteriyoruz. Eksiksiz prototip UI (kart, QR, indirim
// listesi, puan geçmişi) git geçmişinde kaldı; özellik canlıya alınınca (issuance + accrual +
// redemption + esnaf indirim yönetimi) gerçek veriye bağlı olarak geri yazılır.
// bkz. TECH_DEBT #12. (2026-06-07)
export default function MahallemizKartPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-xl">
          <CreditCard className="w-10 h-10 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-primary">Mahallem Kart çok yakında</h1>
          <p className="text-text-secondary">
            Mahalle esnafından özel indirimler, alışverişten puan ve dijital üyelik kartı — hepsi
            tek yerde. Şu anda esnaflarımızla kampanyaları hazırlıyoruz.
          </p>
        </div>
        <div className="bg-surface rounded-2xl border border-border p-5 text-left space-y-4">
          <div className="flex items-start gap-3">
            <Percent className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">Esnaf indirimleri:</span>{' '}
              mahallendeki işletmelerde anında indirim.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Gift className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">Puan biriktir:</span> alışveriş,
              etkinlik ve bağışlardan puan kazan.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <QrCode className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">Dijital kart:</span> QR ile kasada
              hızlı kullanım.
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 text-sm text-text-muted">
          <Clock className="w-4 h-4" />
          <span>Hazır olduğunda buradan haberdar olacaksın.</span>
        </div>
        <div>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-hover transition-colors"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  )
}
