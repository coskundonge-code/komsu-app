'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Shield, X, Clock, MapPin } from 'lucide-react'
import { useCurrentUser } from '@/lib/hooks/use-auth'

interface AddressVerificationBannerProps {
  // Opsiyonel override; verilmezse durum giriş yapan kullanıcının profilinden türetilir.
  status?: 'unverified' | 'pending' | 'verified'
  daysRemaining?: number
}

export function AddressVerificationBanner({
  status: statusProp,
}: AddressVerificationBannerProps) {
  const { profile, loading } = useCurrentUser()
  const [dismissed, setDismissed] = useState(false)

  // Kademeli kapı modeli (2026-06-11): e-Devlet doğrulaması zorunlu değil,
  // süre/kilit yok — ama her ETKİLEŞİM (gönderi, yorum, ilan, askıda, yardım,
  // mesaj...) için gerekli. Banner bunu dürüstçe anlatır; doğrulanmışsa görünmez.
  const derived = useMemo(() => {
    if (statusProp) return { status: statusProp }
    if (!profile) return null
    if (profile.edevlet_verified_at) return { status: 'verified' as const }
    return { status: 'unverified' as const }
  }, [statusProp, profile])

  if (loading || dismissed || !derived || derived.status === 'verified') return null

  const status = derived.status

  if (status === 'pending') {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-800 text-sm">Adres Doğrulama Bekleniyor</h3>
            <p className="text-amber-700 text-xs mt-1">
              Belgeleriniz inceleniyor. Genellikle 1-2 iş günü içinde onaylanır.
            </p>
          </div>
          <button onClick={() => setDismissed(true)} className="p-1 hover:bg-amber-100 rounded-lg">
            <X className="w-4 h-4 text-amber-500" />
          </button>
        </div>
      </div>
    )
  }

  // unverified — yeni kullanıcılar için ana durum (zorlama yok, dürüst bilgi)
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <MapPin className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-blue-800 text-sm">Adresinizi Doğrulayın</h3>
          <p className="text-blue-700 text-xs mt-1">
            Gezinmek serbest — ama gönderi paylaşmak, ilan vermek, askıda bağış ve
            mesajlaşma gibi tüm etkileşimler için e-Devlet adres doğrulaması gerekir.
            Yaklaşık 2 dakika sürer, belgeniz saklanmaz.
          </p>

          <div className="mt-3">
            <Link
              href="/adres-dogrulama"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors"
            >
              <Shield className="w-4 h-4" />
              e-Devlet ile Doğrula (~2 dk)
            </Link>
          </div>
        </div>
        <button onClick={() => setDismissed(true)} aria-label="Kapat" className="p-1 hover:bg-blue-100 rounded-lg flex-shrink-0">
          <X className="w-4 h-4 text-blue-400" />
        </button>
      </div>
    </div>
  )
}
