'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowLeft, CreditCard, CheckCircle, Calendar, Shield, Star, Crown } from 'lucide-react'
import { BUSINESS_MEMBERSHIP } from '@/lib/pricing'

const PaymentModal = dynamic(() => import('@/components/payment/payment-modal'), { ssr: false })

export default function UyelikPage() {
  const [showPayment, setShowPayment] = useState(false)
  const membership = { active: true, expiryDate: '2026-04-22', plan: 'Aylık', autoRenew: true, startDate: '2026-03-22' }
  const features = ['Sınırsız mahalleli müşteri erişimi','QR kod indirim sistemi','Performans ve analitik paneli','Müşteri sadakat takibi','İşletme profili özelleştirme','Yerel harita üzerinde görünürlük','Etkinlik oluşturma ve yönetim','Öncelikli destek']

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface border-b border-border px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/isletme-paneli" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></Link>
          <div><h1 className="text-xl font-bold text-text-primary">Esnaf Üyeliği</h1><p className="text-sm text-text-muted">Aylık üyelik yönetimi</p></div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <div className="bg-gradient-to-br from-primary to-[#004d23] rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"><Crown className="w-6 h-6" /></div>
            <div><h2 className="font-bold text-lg">Esnaf Üyeliği</h2><p className="text-white/80 text-sm">{membership.active ? 'Aktif Üyelik' : 'Pasif Üyelik'}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/10 rounded-xl p-3"><p className="text-xs text-white/70">Aylık Ücret</p><p className="text-xl font-bold">{BUSINESS_MEMBERSHIP.monthlyFee} ₺</p></div>
            <div className="bg-white/10 rounded-xl p-3"><p className="text-xs text-white/70">Sonraki Ödeme</p><p className="text-xl font-bold">{new Date(membership.expiryDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</p></div>
          </div>
          {membership.active && (<div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2"><CheckCircle className="w-4 h-4" /><span className="text-sm">Otomatik yenileme aktif</span></div>)}
        </div>
        <div className="bg-surface rounded-2xl border border-border p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500" />Üyelik Özellikleri</h3>
          <div className="space-y-3">{features.map((feature, i) => (<div key={i} className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /><span className="text-sm">{feature}</span></div>))}</div>
        </div>
        <div className="bg-surface rounded-2xl border border-border">
          <div className="px-4 py-3 border-b border-border"><h3 className="font-semibold flex items-center gap-2"><Calendar className="w-4 h-4 text-text-muted" />Ödeme Geçmişi</h3></div>
          <div className="divide-y divide-border">
            {[{ date: '22 Mart 2026', amount: '99 ₺', status: 'Ödendi' },{ date: '22 Şubat 2026', amount: '99 ₺', status: 'Ödendi' },{ date: '22 Ocak 2026', amount: '99 ₺', status: 'Ödendi' }].map((payment, i) => (
              <div key={i} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3"><div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center"><CreditCard className="w-4 h-4 text-green-600" /></div><div><p className="text-sm font-medium">Aylık Üyelik</p><p className="text-xs text-text-muted">{payment.date}</p></div></div>
                <div className="text-right"><p className="text-sm font-semibold">{payment.amount}</p><p className="text-xs text-green-600">{payment.status}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <button onClick={() => setShowPayment(true)} className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"><CreditCard className="w-5 h-5" />Manuel Ödeme Yap ({BUSINESS_MEMBERSHIP.monthlyFee} ₺)</button>
          <button className="w-full flex items-center justify-center gap-2 py-3 border border-border rounded-xl font-medium text-text-muted hover:bg-gray-50"><Shield className="w-5 h-5" />Ödeme Yöntemi Değiştir</button>
        </div>
      </div>
      <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} onSuccess={(id) => { setShowPayment(false); alert('Ödeme başarılı! ID: ' + id) }} paymentType="business_membership" amount={BUSINESS_MEMBERSHIP.monthlyFee} title="Esnaf Üyeliği" description="Aylık esnaf üyelik ödemesi" userId="user_123" userEmail="test@example.com" userName="Test İşletme" />
    </div>
  )
}
