'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Store, MapPin, Percent, CreditCard, CheckCircle, AlertTriangle,
  ArrowRight, ArrowLeft, Shield, Phone, Mail, Clock, Building2
} from 'lucide-react'
import { toast } from '@/lib/utils/show-toast'
import { BUSINESS_MEMBERSHIP } from '@/lib/pricing'
import { createClient as createTypedClient } from '@/lib/supabase/client'
import { useCurrentUser } from '@/lib/hooks/use-auth'

type Step = 1 | 2 | 3 | 4

export default function EsnafKayitPage() {
  const router = useRouter()
  const { user } = useCurrentUser()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)

  // Form state
  const [businessName, setBusinessName] = useState('')
  const [businessCategory, setBusinessCategory] = useState('')
  const [businessPhone, setBusinessPhone] = useState('')
  const [businessEmail, setBusinessEmail] = useState('')
  const [businessAddress, setBusinessAddress] = useState('')
  const [businessDescription, setBusinessDescription] = useState('')

  // İndirim state
  const [discountName, setDiscountName] = useState('Mahalleli İndirimi')
  const [discountPercent, setDiscountPercent] = useState(10)
  const [discountDescription, setDiscountDescription] = useState('')

  // Doğrulama state
  const [addressVerified, setAddressVerified] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const categories = [
    'Restoran / Kafe', 'Market / Bakkal', 'Fırın / Pastane', 'Kasap',
    'Manav', 'Kuaför / Berber', 'Eczane', 'Kırtasiye', 'Temizlik',
    'Tamir / Tadilat', 'Elektronik', 'Giyim', 'Spor Salonu', 'Diğer'
  ]

  const handleSubmit = async () => {
    if (!addressVerified) {
      toast.warning('Adres doğrulaması yapılmalıdır')
      return
    }
    if (discountPercent < 5) {
      toast.warning('Minimum %5 indirim tanımlanmalıdır')
      return
    }
    if (!termsAccepted) {
      toast.warning('Üyelik koşullarını kabul etmelisiniz')
      return
    }
    if (!user) {
      toast.warning('Giriş yapmalısınız')
      return
    }

    setLoading(true)
    try {
      const supabase = createTypedClient() as any

      // Generate a slug from business name
      const slug = businessName
        .toLowerCase()
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
        .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
        .trim() + '-' + Date.now().toString(36)

      const { error } = await supabase.from('businesses').insert({
        owner_id: user.id,
        name: businessName,
        slug,
        description: businessDescription || null,
        address: businessAddress || null,
        phone: businessPhone || null,
        is_verified: false,
      })

      setLoading(false)
      if (error) {
        toast.error('Kayıt başarısız: ' + error.message)
        return
      }
      setStep(4)
    } catch (err: any) {
      setLoading(false)
      toast.error('Bir hata oluştu: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7f2] to-[#f8fafb]">
      {/* Header */}
      <div className="w-full px-6 py-4 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Store className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-text-primary">Mahallemiz Esnaf</span>
        </Link>
        <Link href="/" className="text-sm text-text-muted hover:text-primary">
          Ana Sayfaya Dön
        </Link>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}
                ${step === 4 ? 'bg-green-500 text-white' : ''}`}>
                {step > s || step === 4 ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-primary' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: İşletme Bilgileri */}
        {step === 1 && (
          <div className="bg-surface rounded-2xl shadow-sm border border-border p-6">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">İşletme Bilgileri</h1>
              <p className="text-sm text-text-muted mt-1">İşletmenizin temel bilgilerini girin</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">İşletme Adı *</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm"
                  placeholder="Örn: Moda Fırını"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kategori *</label>
                <select
                  value={businessCategory}
                  onChange={e => setBusinessCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm"
                >
                  <option value="">Seçiniz...</option>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefon *</label>
                <input
                  type="tel"
                  value={businessPhone}
                  onChange={e => setBusinessPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm"
                  placeholder="05XX XXX XX XX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">E-posta</label>
                <input
                  type="email"
                  value={businessEmail}
                  onChange={e => setBusinessEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm"
                  placeholder="isletme@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Adres *</label>
                <textarea
                  value={businessAddress}
                  onChange={e => setBusinessAddress(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm"
                  rows={2}
                  placeholder="İşletme adresi..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">İşletme Tanıtımı</label>
                <textarea
                  value={businessDescription}
                  onChange={e => setBusinessDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm"
                  rows={3}
                  placeholder="İşletmenizi kısaca tanıtın..."
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (!businessName || !businessCategory || !businessPhone) {
                  toast.warning('Zorunlu alanları doldurun')
                  return
                }
                setStep(2)
              }}
              className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"
            >
              Devam Et
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: İndirim Tanımlama (ZORUNLU) */}
        {step === 2 && (
          <div className="bg-surface rounded-2xl shadow-sm border border-border p-6">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Percent className="w-7 h-7 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold">İndirim Tanımla</h1>
              <p className="text-sm text-text-muted mt-1">Mahalleli müşterilerinize özel indirim belirleyin</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">İndirim Zorunludur</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Esnaf olarak kayıt olmak için en az bir indirim tanımlamanız gerekmektedir.
                    Minimum %5 indirim zorunludur.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">İndirim Adı *</label>
                <input
                  type="text"
                  value={discountName}
                  onChange={e => setDiscountName(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">İndirim Oranı (%) *</label>
                <div className="relative">
                  <input
                    type="number"
                    min={5}
                    max={50}
                    value={discountPercent}
                    onChange={e => setDiscountPercent(parseInt(e.target.value) || 5)}
                    className="w-full px-4 py-3 border border-border rounded-xl text-sm"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold text-primary">
                    %{discountPercent}
                  </span>
                </div>
                {discountPercent < 5 && (
                  <p className="text-xs text-red-500 mt-1">Minimum %5 indirim gereklidir</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">İndirim Açıklaması</label>
                <textarea
                  value={discountDescription}
                  onChange={e => setDiscountDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm"
                  rows={2}
                  placeholder="Mahalleli müşterilerinize sunduğunuz indirim detayları..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-border rounded-xl font-medium hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Geri
              </button>
              <button
                onClick={() => {
                  if (discountPercent < 5) {
                    toast.warning('Minimum %5 indirim gereklidir')
                    return
                  }
                  setStep(3)
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"
              >
                Devam Et
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Adres Doğrulama + Ödeme */}
        {step === 3 && (
          <div className="bg-surface rounded-2xl shadow-sm border border-border p-6">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-7 h-7 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold">Doğrulama ve Üyelik</h1>
              <p className="text-sm text-text-muted mt-1">Son adım: adres doğrulama ve üyelik başlatma</p>
            </div>

            <div className="space-y-4">
              {/* Adres Doğrulama */}
              <div className={`rounded-xl border-2 p-4 ${addressVerified ? 'border-green-300 bg-green-50' : 'border-border'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className={`w-5 h-5 ${addressVerified ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                      <p className="font-medium">Adres Doğrulama</p>
                      <p className="text-xs text-text-muted">e-Devlet ile işletme adresinizi doğrulayın</p>
                    </div>
                  </div>
                  {addressVerified ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <button
                      onClick={() => setAddressVerified(true)} // Mock - gerçekte e-Devlet akışına yönlendirir
                      className="px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary/90"
                    >
                      Doğrula
                    </button>
                  )}
                </div>
              </div>

              {/* Üyelik Detayları */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Esnaf Üyelik Planı
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Aylık Üyelik Ücreti</span>
                  <span className="text-xl font-bold text-primary">{BUSINESS_MEMBERSHIP.monthlyFee} ₺/ay</span>
                </div>
                <p className="text-xs text-text-muted">
                  İlk ödeme kayıt sonrası alınacaktır. İstediğiniz zaman iptal edebilirsiniz.
                  Başka herhangi bir ücret alınmaz.
                </p>
              </div>

              {/* Özet */}
              <div className="bg-primary/5 rounded-xl p-4 space-y-2">
                <h3 className="font-semibold text-sm">Kayıt Özeti</h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-text-muted">İşletme:</span>
                    <span className="font-medium">{businessName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Kategori:</span>
                    <span className="font-medium">{businessCategory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">İndirim:</span>
                    <span className="font-medium text-green-600">%{discountPercent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Aylık Ücret:</span>
                    <span className="font-medium">{BUSINESS_MEMBERSHIP.monthlyFee} ₺</span>
                  </div>
                </div>
              </div>

              {/* Koşullar */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-primary"
                />
                <span className="text-xs text-text-muted">
                  <Link href="/kosullar" className="text-primary underline">Esnaf üyelik koşullarını</Link> okudum ve kabul ediyorum.
                  Aylık {BUSINESS_MEMBERSHIP.monthlyFee} ₺ üyelik ücretinin kartımdan otomatik çekileceğini onaylıyorum.
                </span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(2)}
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-border rounded-xl font-medium hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Geri
              </button>
              <button
                onClick={handleSubmit}
                disabled={!addressVerified || !termsAccepted || loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-pulse">İşleniyor...</span>
                ) : (
                  <>
                    Kaydı Tamamla
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Başarılı */}
        {step === 4 && (
          <div className="bg-surface rounded-2xl shadow-sm border border-border p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-700 mb-2">Kayıt Başarılı!</h1>
            <p className="text-text-muted mb-6">
              İşletmeniz başarıyla kaydedildi. Artık esnaf panelinize erişebilirsiniz.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/isletme-paneli')}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"
              >
                <Store className="w-5 h-5" />
                Esnaf Paneline Git
              </button>
              <button
                onClick={() => router.push('/isletme-paneli/qr-tara')}
                className="w-full flex items-center justify-center gap-2 py-3 border border-border rounded-xl font-medium hover:bg-gray-50"
              >
                QR Kod Taramaya Başla
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
