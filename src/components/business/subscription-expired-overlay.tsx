'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, CreditCard, Gift } from 'lucide-react';
import { MONTHLY_PRICE, YEARLY_PRICE } from '@/lib/services/business-subscription';

interface SubscriptionExpiredOverlayProps {
  businessName?: string;
  isOwner?: boolean;
}

/**
 * Abonelik süresi dolduğunda işletme sayfası üzerine yerleşen blur/kilit overlay
 * - Sayfa blur hale gelir
 * - Kilit mesajı gösterilir
 * - İşletme sahibi ise ödeme yönlendirilir
 * - Ziyaretçi ise bilgilendirme gösterilir
 */
export default function SubscriptionExpiredOverlay({
  businessName = 'Bu işletme',
  isOwner = false,
}: SubscriptionExpiredOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md" />

      {/* Lock card */}
      <div className="relative z-10 max-w-md mx-4 bg-surface rounded-2xl shadow-2xl border border-border p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <Lock size={32} className="text-red-500" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Sayfa Kilitlendi
        </h2>

        {isOwner ? (
          <>
            <p className="text-text-muted mb-6">
              <strong>{businessName}</strong> sayfanızın ücretsiz deneme süresi doldu.
              Sayfanızı tekrar aktif etmek ve ilan yayınlamak için abonelik başlatın.
            </p>

            <div className="bg-background rounded-xl p-4 mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard size={16} className="text-text-muted" />
                  <span className="text-sm font-medium text-gray-900">Aylık</span>
                </div>
                <span className="text-sm font-bold text-primary">{MONTHLY_PRICE.toLocaleString('tr-TR')}₺/ay</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift size={16} className="text-[#f59e0b]" />
                  <span className="text-sm font-medium text-gray-900">Yıllık (12 ay peşin)</span>
                </div>
                <span className="text-sm font-bold text-primary">{YEARLY_PRICE.toLocaleString('tr-TR')}₺/yıl</span>
              </div>
            </div>

            <Link
              href="/isletme-paneli"
              className="block w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-3"
            >
              Abonelik Başlat
            </Link>
            <Link
              href="/"
              className="block w-full bg-background hover:bg-[#e0e0e0] text-text-primary font-medium py-2.5 px-6 rounded-lg transition-colors text-sm"
            >
              Anasayfaya Dön
            </Link>
          </>
        ) : (
          <>
            <p className="text-text-muted mb-6">
              <strong>{businessName}</strong> sayfası şu anda aktif değil.
              İşletme sahibi sayfayı tekrar aktif ettiğinde erişebilirsiniz.
            </p>
            <Link
              href="/isletmeler"
              className="block w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-3"
            >
              Diğer İşletmeleri Keşfet
            </Link>
            <Link
              href="/"
              className="block w-full bg-background hover:bg-[#e0e0e0] text-text-primary font-medium py-2.5 px-6 rounded-lg transition-colors text-sm"
            >
              Anasayfaya Dön
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
