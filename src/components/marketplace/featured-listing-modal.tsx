'use client';

import { useState } from 'react';
import { X, Sparkles, TrendingUp, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FEATURED_PRICING, PaymentType } from '@/lib/services/payment';

export interface FeaturedListingModalProps {
  isOpen: boolean;
  listingId: string;
  listingTitle: string;
  onClose: () => void;
  onSelectPlan: (type: PaymentType, amount: number) => void;
  isLoading?: boolean;
}

export function FeaturedListingModal({
  isOpen,
  listingId,
  listingTitle,
  onClose,
  onSelectPlan,
  isLoading = false,
}: FeaturedListingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PaymentType | null>(null);

  if (!isOpen) return null;

  const handleSelectPlan = (type: PaymentType) => {
    const pricing = FEATURED_PRICING[type as keyof typeof FEATURED_PRICING];
    if (pricing) {
      setSelectedPlan(type);
      onSelectPlan(type, pricing.amount);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-900">Ön Plana Çıkart</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Description */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-primary">&quot;{listingTitle}&quot;</span> ilanını
              ana sayfa ve arama sonuçlarında öne çıkartın.
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Avantajlar:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <Eye className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Daha fazla görüntüleme ve ilgi</span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Arama sonuçlarının en üstünde görünün</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>İlanınızda &quot;Ön Plana Çıkmış&quot; rozeti gösterilir</span>
              </li>
            </ul>
          </div>

          {/* Pricing Tiers */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Paket Seçin:</h3>
            <div className="space-y-2">
              {Object.entries(FEATURED_PRICING).map(([key, pricing]) => {
                const type = key as PaymentType;
                const isSelected = selectedPlan === type;
                const isPopular = type === PaymentType.FEATURED_7DAYS;

                return (
                  <button
                    key={type}
                    onClick={() => handleSelectPlan(type)}
                    disabled={isLoading}
                    className={cn(
                      'w-full p-3 rounded-lg border-2 transition-all text-left',
                      isSelected
                        ? 'border-primary bg-green-50'
                        : 'border-gray-200 hover:border-gray-300',
                      isLoading && 'opacity-50 cursor-not-allowed',
                      isPopular && !isSelected && 'ring-1 ring-[#00833e]'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {pricing.label}
                        </div>
                        <div className="text-xs text-gray-600">
                          {pricing.days} gün boyunca öne çıkmış olur
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">
                          {pricing.amount}₺
                        </div>
                        {isPopular && (
                          <div className="text-xs font-semibold text-primary mt-1">
                            En Popüler
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview of Featured Badge */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">
              İlanınız böyle görünecek:
            </h3>
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="bg-surface p-3 rounded border border-gray-200">
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-12 h-12 bg-gray-200 rounded" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-gray-900">
                        {listingTitle}
                      </h4>
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-semibold">
                        <Sparkles className="w-3 h-3" />
                        Öne Çıkmış
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">250 ₺</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-gray-200">
            <button
              onClick={() => {
                if (selectedPlan) {
                  handleSelectPlan(selectedPlan);
                }
              }}
              disabled={!selectedPlan || isLoading}
              className={cn(
                'w-full py-2.5 px-4 rounded-lg font-semibold transition-colors',
                selectedPlan && !isLoading
                  ? 'bg-primary text-white hover:bg-[#006b2f]'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              )}
            >
              {isLoading ? 'İşleniyor...' : 'Ödemeye Git'}
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              İptal Et
            </button>
          </div>

          {/* Info */}
          <div className="text-xs text-gray-600 text-center">
            İlanlar ön plana çıktıktan sonra otomatik olarak normal konuma döner.
            İstediğiniz zaman yeniden ön plana çıkartabilirsiniz.
          </div>
        </div>
      </div>
    </div>
  );
}
