'use client'

// NOT (2026-06-07 / pazara-hazırlık denetimi): Bu sayfa eskiden TAMAMEN SAHTE idi
// (sabit "aktif üyelik", uydurma ödeme geçmişi, PaymentModal'a user_123/test@example.com
// gibi sahte kimlik). Ayrıca 99₺/ay BUSINESS_MEMBERSHIP modeli, uygulamanın gerçek
// abonelik modeli (lib/services/business-subscription.ts: 3 ay ücretsiz deneme +
// 1.900₺/ay veya 19.900₺/yıl) ile çelişiyordu.
// Artık gerçek servise bağlı: gerçek kullanıcı kimliği, gerçek abonelik durumu
// (checkSubscriptionStatus), gerçek fiyatlar ve gerçek aktivasyon/iptal akışı.
// PayTR anahtarı yokken /api/payment "simülasyon modu" döner (hiçbir kart çekilmez).

import { toast } from '@/lib/utils/show-toast'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  ArrowLeft,
  CreditCard,
  CheckCircle,
  Calendar,
  Star,
  Crown,
  Gift,
  Loader2,
  XCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCurrentUser } from '@/lib/hooks/use-auth'
import {
  checkSubscriptionStatus,
  activateSubscription,
  cancelSubscription,
  MONTHLY_PRICE,
  YEARLY_PRICE,
  FREE_TRIAL_MONTHS,
  type SubscriptionCheckResult,
  type BillingPeriod,
} from '@/lib/services/business-subscription'

const PaymentModal = dynamic(() => import('@/components/payment/payment-modal'), { ssr: false })

const FEATURES = [
  'Sınırsız mahalleli müşteri erişimi',
  'QR kod indirim sistemi',
  'Performans ve analitik paneli',
  'Müşteri sadakat takibi',
  'İşletme profili özelleştirme',
  'Yerel harita üzerinde görünürlük',
  'Etkinlik oluşturma ve yönetim',
  'Öncelikli destek',
]

function formatDate(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function UyelikPage() {
  const { user, profile } = useCurrentUser()
  const [business, setBusiness] = useState<{ id: string; name: string } | null>(null)
  const [subStatus, setSubStatus] = useState<SubscriptionCheckResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasNoBusiness, setHasNoBusiness] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')
  const [actionLoading, setActionLoading] = useState(false)

  const load = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('businesses')
        .select('id, name')
        .eq('owner_id', user.id)
        .single()

      if (error && error.code === 'PGRST116') {
        setHasNoBusiness(true)
        return
      }
      if (data) {
        const biz = data as { id: string; name: string }
        setBusiness(biz)
        try {
          setSubStatus(await checkSubscriptionStatus(biz.id))
        } catch {
          setSubStatus(null)
        }
      }
    } catch (err) {
      console.error('Üyelik bilgisi alınamadı:', err)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    load()
  }, [load])

  const amount = billingPeriod === 'monthly' ? MONTHLY_PRICE : YEARLY_PRICE

  const handlePaymentSuccess = async () => {
    setShowPayment(false)
    if (!business) return
    setActionLoading(true)
    try {
      const result = await activateSubscription(business.id, billingPeriod)
      if (result) {
        toast.success('Aboneliğiniz başlatıldı')
      } else {
        toast.error('Abonelik kaydı güncellenemedi. Lütfen işletme panelinden tekrar deneyin.')
      }
      await load()
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!business) return
    if (!window.confirm('Aboneliğinizi iptal etmek istediğinize emin misiniz?')) return
    setActionLoading(true)
    try {
      const ok = await cancelSubscription(business.id)
      if (ok) {
        toast.success('Abonelik iptal edildi')
      } else {
        toast.error('İptal işlemi başarısız oldu')
      }
      await load()
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
          <p className="text-text-muted">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (hasNoBusiness) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Henüz bir işletmeniz yok</h1>
          <p className="text-text-muted mb-6">Üyelik yönetimi için önce bir işletme oluşturun.</p>
          <Link
            href="/isletme-ekle"
            className="inline-block px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            İşletme Oluştur
          </Link>
        </div>
      </div>
    )
  }

  const status = subStatus?.status ?? 'expired'
  const isTrial = subStatus?.isTrialPeriod ?? false
  const isActivePaid = status === 'active'
  const canSubscribe = !isActivePaid // trial, expired veya cancelled iken abone olunabilir
  const canCancel = isActivePaid || isTrial

  const statusLabel =
    isActivePaid ? 'Aktif Abonelik'
      : isTrial ? 'Ücretsiz Deneme'
        : status === 'cancelled' ? 'İptal Edildi'
          : 'Abonelik Pasif'

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface border-b border-border px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/isletme-paneli" className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Esnaf Üyeliği</h1>
            <p className="text-sm text-text-muted">{business?.name ?? 'İşletme'} — abonelik yönetimi</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Durum kartı */}
        <div className="bg-gradient-to-br from-primary to-[#004d23] rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Esnaf Üyeliği</h2>
              <p className="text-white/80 text-sm">{statusLabel}</p>
            </div>
          </div>

          {isTrial && (
            <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3">
              <Gift className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold">{subStatus?.trialDaysRemaining ?? 0} gün ücretsiz deneme kaldı</p>
                <p className="text-xs text-white/70">Deneme bitişi: {formatDate(subStatus?.trialEndDate ?? null)}</p>
              </div>
            </div>
          )}

          {isActivePaid && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-xs text-white/70">Güncel Ücret</p>
                <p className="text-xl font-bold">{(subStatus?.subscription?.currentPrice ?? 0).toLocaleString('tr-TR')} ₺</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-xs text-white/70">Sonraki Ödeme</p>
                <p className="text-xl font-bold">{formatDate(subStatus?.subscription?.subscriptionEndDate ?? null)}</p>
              </div>
            </div>
          )}

          {!isActivePaid && !isTrial && (
            <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">Aboneliğiniz pasif. Kesintisiz kullanım için abone olun.</p>
            </div>
          )}
        </div>

        {/* Plan / fiyat seçimi */}
        {canSubscribe && (
          <div className="bg-surface rounded-2xl border border-border p-6">
            <h3 className="font-semibold mb-1">Abonelik Planı</h3>
            <p className="text-sm text-text-muted mb-4">
              İlk {FREE_TRIAL_MONTHS} ay ücretsiz. Sonrasında aşağıdaki plandan biriyle devam edin.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`rounded-xl border-2 p-4 text-left transition ${billingPeriod === 'monthly' ? 'border-primary bg-primary/5' : 'border-border'}`}
              >
                <p className="text-sm text-text-muted">Aylık</p>
                <p className="text-xl font-bold text-primary">{MONTHLY_PRICE.toLocaleString('tr-TR')} ₺<span className="text-sm font-normal text-text-muted">/ay</span></p>
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`relative rounded-xl border-2 p-4 text-left transition ${billingPeriod === 'yearly' ? 'border-primary bg-primary/5' : 'border-border'}`}
              >
                <span className="absolute -top-2 right-3 px-2 py-0.5 bg-[#f59e0b] text-white text-xs font-bold rounded-full">Avantajlı</span>
                <p className="text-sm text-text-muted">Yıllık</p>
                <p className="text-xl font-bold text-primary">{YEARLY_PRICE.toLocaleString('tr-TR')} ₺<span className="text-sm font-normal text-text-muted">/yıl</span></p>
              </button>
            </div>
          </div>
        )}

        {/* Özellikler */}
        <div className="bg-surface rounded-2xl border border-border p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />Üyelik Özellikleri
          </h3>
          <div className="space-y-3">
            {FEATURES.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Eylemler */}
        <div className="space-y-3">
          {canSubscribe && (
            <button
              onClick={() => setShowPayment(true)}
              disabled={actionLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
              Abone Ol ({amount.toLocaleString('tr-TR')} ₺ / {billingPeriod === 'monthly' ? 'ay' : 'yıl'})
            </button>
          )}
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={actionLoading}
              className="w-full flex items-center justify-center gap-2 py-3 border border-border rounded-xl font-medium text-text-muted hover:bg-gray-50 disabled:opacity-50"
            >
              <XCircle className="w-5 h-5" />Aboneliği İptal Et
            </button>
          )}
          <p className="flex items-center gap-2 text-xs text-text-muted">
            <Calendar className="w-3.5 h-3.5" />
            Ödemeler PayTR güvenli altyapısı ile işlenir. İstediğiniz zaman iptal edebilirsiniz.
          </p>
        </div>
      </div>

      {business && user && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
          paymentType={billingPeriod === 'yearly' ? 'business_yearly' : 'business_membership'}
          amount={amount}
          title="Esnaf Üyeliği"
          description={`${billingPeriod === 'monthly' ? 'Aylık' : 'Yıllık'} esnaf üyelik ödemesi`}
          userId={user.id}
          userEmail={user.email ?? ''}
          userName={profile?.full_name ?? business.name}
        />
      )}
    </div>
  )
}
