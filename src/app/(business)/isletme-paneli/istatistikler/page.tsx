import Link from 'next/link'
import { BarChart3, Eye, Star, Users, Clock } from 'lucide-react'

// İşletme istatistikleri: arkada gerçek bir analitik altyapısı (görüntülenme sayacı,
// trafik kaynağı, dönem karşılaştırması) henüz YOK. Sahte "2.847 görüntülenme / 4.8 puan"
// ve uydurma trafik/heatmap grafikleri göstermek yerine dürüst "çok yakında" sayfası
// gösteriyoruz. Eksiksiz prototip UI (grafikler, heatmap, rapor indirme) git geçmişinde
// kaldı; analitik altyapısı kurulunca gerçek veriye bağlı geri yazılır.
// bkz. TECH_DEBT #12. (2026-06-07)
export default function IstatistiklerPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-xl">
          <BarChart3 className="w-10 h-10 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-primary">İstatistikler çok yakında</h1>
          <p className="text-text-secondary">
            İşletmenizin görüntülenme, yorum ve ziyaretçi verileri biriktikçe burada
            ayrıntılı grafiklerle görünecek. Şu anda gerçek ölçüm altyapısını hazırlıyoruz.
          </p>
        </div>
        <div className="bg-surface rounded-2xl border border-border p-5 text-left space-y-4">
          <div className="flex items-start gap-3">
            <Eye className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">Profil görüntülemeleri:</span>{' '}
              işletmenizi kaç kişinin gördüğünü takip edin.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">Puan ve yorumlar:</span>{' '}
              değerlendirmelerinizin zaman içindeki seyri.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">Ziyaretçi analizi:</span>{' '}
              yoğun saatler ve gün bazında performans.
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 text-sm text-text-muted">
          <Clock className="w-4 h-4" />
          <span>Veriler biriktikçe bu sayfa otomatik dolacak.</span>
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
