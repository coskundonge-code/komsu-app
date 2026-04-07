'use client';

import React, { useState } from 'react';
import { Check, Gift, CreditCard, Shield, Sparkles, Clock } from 'lucide-react';
import {
  BillingPeriod,
  MONTHLY_PRICE,
  YEARLY_PRICE,
  FREE_TRIAL_MONTHS,
} from '@/lib/services/business-subscription';

// Legacy type compatibility
import { PackageType } from '@/lib/services/business-subscription';

interface BusinessPackagesProps {
  onSelectPackage?: (packageId: PackageType, billingPeriod: BillingPeriod) => void;
  selectedPackage?: PackageType;
  selectedBillingPeriod?: BillingPeriod;
  showTrialInfo?: boolean;
}

const FEATURES = [
  'İşletme profil sayfası',
  'Sınırsız fotoğraf yükleme',
  'Kategori listeleme',
  'Yorum ve değerlendirme sistemi',
  'Kampanya oluşturma',
  'Temel analitik',
  'İlan yayınlama',
  'Mesajlaşma',
  'Harita üzerinde görünürlük',
  'Öncelikli destek',
];

export default function BusinessPackages({
  onSelectPackage,
  selectedBillingPeriod = 'monthly',
  showTrialInfo = true,
}: BusinessPackagesProps) {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>(selectedBillingPeriod);

  const price = billingPeriod === 'monthly' ? MONTHLY_PRICE : YEARLY_PRICE;
  const monthlyEquivalent = billingPeriod === 'yearly'
    ? Math.round(YEARLY_PRICE / 12)
    : MONTHLY_PRICE;
  const yearlySavings = (MONTHLY_PRICE * 12) - YEARLY_PRICE;

  const handleSelect = () => {
    if (onSelectPackage) {
      onSelectPackage('profesyonel', billingPeriod);
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">İşletme Aboneliği</h2>
        <p className="text-text-muted mb-6">
          İşletmenizi komşularınıza tanıtın, müşterilerinizi büyütün
        </p>
      </div>

      {/* Free Trial Banner */}
      {showTrialInfo && (
        <div className="bg-gradient-to-r from-[#fef3c7] to-[#fde68a] rounded-xl p-5 mb-8 flex items-center gap-4 border border-[#f59e0b]/20">
          <div className="w-12 h-12 bg-[#f59e0b] rounded-xl flex items-center justify-center flex-shrink-0">
            <Gift size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#92400e]">İlk {FREE_TRIAL_MONTHS} Ay Ücretsiz!</h3>
            <p className="text-sm text-[#92400e]/80 mt-0.5">
              Kredi kartı gerekmeden başlayın. Tüm özellikler dahil.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-[#92400e]/60" />
            <span className="text-xs text-[#92400e]/60 font-medium whitespace-nowrap">Kart Gerekmez</span>
          </div>
        </div>
      )}

      {/* Billing Period Toggle */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-text-muted'}`}>
          Aylık
        </span>
        <button
          onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
          className="relative inline-flex h-8 w-14 items-center rounded-full"
          style={{ backgroundColor: billingPeriod === 'yearly' ? '#00833e' : '#e0e0e0' }}
        >
          <span
            className="inline-block h-6 w-6 transform rounded-full bg-surface transition-transform"
            style={{ transform: billingPeriod === 'yearly' ? 'translateX(1.75rem)' : 'translateX(0.25rem)' }}
          />
        </button>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${billingPeriod === 'yearly' ? 'text-gray-900' : 'text-text-muted'}`}>
            Yıllık
          </span>
          {billingPeriod === 'yearly' && (
            <span className="inline-block px-2 py-1 bg-primary-light text-primary-hover text-xs font-bold rounded">
              {yearlySavings.toLocaleString('tr-TR')}₺ Tasarruf
            </span>
          )}
        </div>
      </div>

      {/* Single Plan Card */}
      <div className="max-w-lg mx-auto">
        <div className="relative rounded-2xl ring-2 ring-[#00833e] shadow-lg bg-surface overflow-hidden">
          {/* Badge */}
          <div className="absolute -top-0 left-0 right-0 flex justify-center">
            <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-b-xl">
              <Sparkles className="w-3 h-3" />
              Tek Plan - Her Şey Dahil
            </span>
          </div>

          <div className="p-8 pt-12">
            {/* Price */}
            <div className="text-center mb-6">
              <div className="flex items-baseline justify-center gap-1 mb-1">
                <span className="text-5xl font-bold text-primary">
                  {price.toLocaleString('tr-TR')}
                </span>
                <span className="text-xl text-gray-900">₺</span>
                <span className="text-sm text-text-muted ml-1">
                  /{billingPeriod === 'monthly' ? 'ay' : 'yıl'}
                </span>
              </div>
              {billingPeriod === 'yearly' && (
                <p className="text-sm text-text-muted">
                  Aylık {monthlyEquivalent.toLocaleString('tr-TR')}₺'ye denk gelir
                </p>
              )}
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-primary-light rounded-full">
                <Clock size={14} className="text-primary" />
                <span className="text-xs font-semibold text-primary-hover">
                  İlk {FREE_TRIAL_MONTHS} ay ücretsiz
                </span>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                  <span className="text-gray-900">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            {onSelectPackage && (
              <button
                onClick={handleSelect}
                className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 px-4 rounded-lg transition-colors text-lg"
              >
                Ücretsiz Başla
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-10 bg-background rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Sıkça Sorulan Sorular</h4>
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-medium text-gray-900">Ücretsiz deneme nasıl çalışır?</p>
            <p className="text-text-muted mt-1">
              İlk {FREE_TRIAL_MONTHS} ay tüm özellikleri ücretsiz kullanırsınız. Kredi kartı bilgisi gerekmez.
              Süre sonunda ödeme yapmazsanız sayfanız kilitlenir.
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Sürem dolunca ne olur?</p>
            <p className="text-text-muted mt-1">
              Sayfanız bulanıklaşır ve yeni ilan paylaşamazsınız. Ödeme yaptığınızda tekrar aktif olur.
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-900">İstediğim zaman iptal edebilir miyim?</p>
            <p className="text-text-muted mt-1">
              Evet, aboneliğinizi istediğiniz zaman iptal edebilirsiniz. Kalan süreniz boyunca kullanmaya devam edersiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
