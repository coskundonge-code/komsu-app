'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { checkCanPost } from '@/lib/services/listing-quota';

export interface ListingQuotaBannerProps {
  userId: string;
  variant?: 'compact' | 'full';
  onUpgradeClick?: () => void;
  showPrice?: boolean;
}

export function ListingQuotaBanner({
  userId,
  variant = 'full',
  onUpgradeClick,
  showPrice = true,
}: ListingQuotaBannerProps) {
  const [quota, setQuota] = useState<{
    freeUsed: number;
    freeLimit: number;
    remainingFree: number;
    canPostFree: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuota = async () => {
      setLoading(true);
      const result = await checkCanPost(userId);
      if (result) {
        setQuota({
          freeUsed: result.freeUsed,
          freeLimit: result.freeLimit,
          remainingFree: result.remainingFree,
          canPostFree: result.canPostFree,
        });
      }
      setLoading(false);
    };

    fetchQuota();
  }, [userId]);

  if (loading || !quota) {
    return null;
  }

  const progressPercent = (quota.freeUsed / quota.freeLimit) * 100;

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'p-2 rounded-md text-xs font-medium',
          quota.canPostFree
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-orange-50 text-orange-700 border border-orange-200'
        )}
      >
        {quota.canPostFree ? (
          <span>{quota.remainingFree}/{quota.freeLimit} ücretsiz ilan hakkınız kaldı</span>
        ) : (
          <span>Ücretsiz ilan hakkınız bitti. Devam etmek için ödeme yapın.</span>
        )}
      </div>
    );
  }

  // Full variant
  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        quota.canPostFree
          ? 'bg-green-50 border-green-200'
          : 'bg-orange-50 border-orange-200'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {quota.canPostFree ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-orange-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              'font-semibold mb-1',
              quota.canPostFree ? 'text-green-900' : 'text-orange-900'
            )}
          >
            İlan Kotası
          </h3>

          <p
            className={cn(
              'text-sm mb-3',
              quota.canPostFree ? 'text-green-800' : 'text-orange-800'
            )}
          >
            {quota.canPostFree
              ? `Bu yıl ${quota.remainingFree} ücretsiz ilan hakkınız kaldı.`
              : 'Ücretsiz ilan hakkınız bitti. Devam etmek için ödeme yapın.'}
          </p>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              className={cn(
                'h-full transition-all duration-300',
                progressPercent >= 100
                  ? 'bg-orange-500'
                  : progressPercent >= 66
                    ? 'bg-yellow-500'
                    : 'bg-primary'
              )}
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">
              {quota.freeUsed}/{quota.freeLimit} ilan kullanıldı
            </p>

            {!quota.canPostFree && showPrice && (
              <button
                onClick={onUpgradeClick}
                className="text-xs font-semibold px-3 py-1.5 rounded-md bg-primary text-white hover:bg-[#006b2f] transition-colors"
              >
                250₺ ile İlan Ver
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
