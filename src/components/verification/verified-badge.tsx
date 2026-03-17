'use client';

import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { ReactNode } from 'react';

interface VerifiedBadgeProps {
  variant?: 'compact' | 'full' | 'unverified';
  className?: string;
}

/**
 * Onaylanmış Komşu rozeti bileşeni
 * Kompakt versiyon: Yalnızca ikon + tooltip
 * Full versiyon: İkon + metin
 * Doğrulanmamış versiyon: Uyarı ikonu + metin
 */
export function VerifiedBadge({
  variant = 'full',
  className = '',
}: VerifiedBadgeProps): ReactNode {
  if (variant === 'compact') {
    return (
      <div
        title="Onaylanmış Komşu - Adres doğrulanmış"
        className={`inline-flex items-center justify-center ${className}`}
      >
        <div className="relative">
          <Shield className="h-5 w-5 text-[#00833e] fill-[#00833e]" />
          <CheckCircle className="absolute -bottom-1 -right-1 h-3 w-3 text-white fill-[#00833e] border border-white" />
        </div>
      </div>
    );
  }

  if (variant === 'unverified') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-1 bg-yellow-50 border border-yellow-200 rounded-full ${className}`}
      >
        <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
        <span className="text-xs font-medium text-yellow-800">Doğrulanmamış</span>
      </div>
    );
  }

  // Full variant - default
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 bg-[#e6f4ec] border border-[#00833e] rounded-full ${className}`}
    >
      <div className="relative">
        <Shield className="h-4 w-4 text-[#00833e] fill-[#00833e]" />
        <CheckCircle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 text-white fill-[#00833e] border border-white" />
      </div>
      <span className="text-xs font-semibold text-[#00833e]">Onaylanmış Komşu</span>
    </div>
  );
}

export default VerifiedBadge;
