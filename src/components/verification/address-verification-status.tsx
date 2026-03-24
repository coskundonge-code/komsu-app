'use client';

import { AlertTriangle, CheckCircle2, Clock, Lock } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface AddressVerificationStatusProps {
  status: 'verified' | 'pending' | 'unverified' | 'locked' | 'referral';
  daysRemaining?: number;
  referredBy?: string;
}

export function AddressVerificationStatus({
  status,
  daysRemaining = 0,
  referredBy,
}: AddressVerificationStatusProps) {
  // Verified status
  if (status === 'verified') {
    return (
      <div className="bg-gradient-to-r from-primary/10 to-primary-hover/10 border border-primary rounded-lg p-4 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-text-primary">Adresiniz Doğrulandı</p>
          <p className="text-sm text-[#666] mt-1">Hesabınız tamamen etkindir ve tüm özellikleri kullanabilirsiniz.</p>
        </div>
      </div>
    );
  }

  // Referral status
  if (status === 'referral') {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-300 rounded-lg p-4 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-text-primary">Referans ile Davet Edildiniz</p>
          <p className="text-sm text-[#666] mt-1">
            {referredBy && `${referredBy} tarafından davete edilerek katıldınız. Adres doğrulaması yapmanız gerekmemektedir.`}
          </p>
        </div>
      </div>
    );
  }

  // Locked status
  if (status === 'locked') {
    return (
      <div className="bg-gradient-to-r from-[#ef4444]/10 to-[#dc2626]/10 border border-[#ef4444] rounded-lg p-4 flex items-start gap-3">
        <Lock className="w-5 h-5 text-[#ef4444] flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-text-primary">Hesabınız Kilitlendi</p>
          <p className="text-sm text-[#666] mt-1">Adres doğrulaması yapılmadığı için hesabınız kilitlenmiştir. Lütfen e-Devlet aracılığıyla adresinizi doğrulayın.</p>
          <Link
            href="/ayarlar/adres-dogrulama"
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-[#ef4444] text-white font-medium rounded-lg hover:bg-[#dc2626] transition-colors"
          >
            Adresimi Doğrula
          </Link>
        </div>
      </div>
    );
  }

  // Pending status
  if (status === 'pending') {
    return (
      <div className="bg-gradient-to-r from-[#f59e0b]/10 to-[#d97706]/10 border border-[#f59e0b] rounded-lg p-4 flex items-start gap-3">
        <Clock className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-text-primary">Adres Doğrulaması Bekleniyor</p>
          <p className="text-sm text-[#666] mt-1">Yüklediğiniz belge inceleniyor. İşlem 2-3 iş günü sürebilir.</p>
        </div>
      </div>
    );
  }

  // Unverified status (default)
  return (
    <div className="bg-gradient-to-r from-[#f59e0b]/10 to-[#d97706]/10 border border-[#f59e0b] rounded-lg p-4 space-y-3">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-text-primary">Adresiniz Doğrulanmamış</p>
          <p className="text-sm text-[#666] mt-1">
            {daysRemaining > 0
              ? `Adresinizi doğrulamak için ${daysRemaining} gün zamanınız var. Sonra hesabınız kilitlenecektir.`
              : 'Lütfen e-Devlet aracılığıyla adresinizi doğrulayın.'}
          </p>
        </div>
      </div>

      {daysRemaining > 0 && daysRemaining <= 3 && (
        <div className="bg-[#fef3c7] border border-[#fcd34d] rounded p-2 text-sm text-[#92400e]">
          <p className="font-medium">Uyarı: Hesabınız {daysRemaining} gün sonra kilitlenecektir!</p>
        </div>
      )}

      <Link
        href="/ayarlar/adres-dogrulama"
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#f59e0b] text-white font-medium rounded-lg hover:bg-[#d97706] transition-colors"
      >
        Adresini Doğrula
      </Link>
    </div>
  );
}
