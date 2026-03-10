'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, X, Clock, UserPlus, MapPin, AlertTriangle, CheckCircle } from 'lucide-react'

interface AddressVerificationBannerProps {
  status?: 'unverified' | 'pending' | 'locked' | 'referral' | 'verified'
  daysRemaining?: number
}

export function AddressVerificationBanner({
  status = 'unverified',
  daysRemaining = 27
}: AddressVerificationBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || status === 'verified') return null

  if (status === 'locked') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-800 text-sm">Hesabınız Kilitlendi</h3>
            <p className="text-red-700 text-xs mt-1">
              Adres doğrulama süresi doldu. Hesabınızı açmak için adresinizi doğrulayın.
            </p>
            <Link
              href="/adres-dogrulama"
              className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              <Shield className="w-4 h-4" />
              Şimdi Doğrula
            </Link>
          </div>
        </div>
      </div>
    )
  }

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

  // unverified - main state for new users
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <MapPin className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-blue-800 text-sm">Adresinizi Doğrulayın</h3>
            {daysRemaining <= 10 && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                {daysRemaining} gün kaldı!
              </span>
            )}
          </div>
          <p className="text-blue-700 text-xs mt-1">
            Mahallenizi doğrulayın ve tüm özellikleri kullanın.
            {daysRemaining > 0 && <> <strong>{daysRemaining} gün</strong> içinde doğrulamanız gerekiyor.</>}
          </p>

          {/* Progress bar */}
          <div className="mt-3 mb-3">
            <div className="flex items-center justify-between text-xs text-blue-600 mb-1">
              <span>Süre</span>
              <span>{daysRemaining}/30 gün</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all ${daysRemaining <= 10 ? 'bg-red-500' : 'bg-blue-500'}`}
                style={{ width: `${((30 - daysRemaining) / 30) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/adres-dogrulama"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#00833e] text-white text-sm font-medium rounded-lg hover:bg-[#006b32] transition-colors"
            >
              <Shield className="w-4 h-4" />
              e-Devlet ile Doğrula
            </Link>
            <Link
              href="/referans-kullan"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-700 text-sm font-medium rounded-lg border border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Referans Kodu Kullan
            </Link>
          </div>
        </div>
        <button onClick={() => setDismissed(true)} className="p-1 hover:bg-blue-100 rounded-lg flex-shrink-0">
          <X className="w-4 h-4 text-blue-400" />
        </button>
      </div>
    </div>
  )
}
