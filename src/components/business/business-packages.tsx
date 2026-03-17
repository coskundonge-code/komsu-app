'use client';

import React, { useState } from 'react';
import { Check, Star } from 'lucide-react';
import { BUSINESS_PACKAGES, BillingPeriod, PackageType } from '@/lib/services/business-subscription';

interface BusinessPackagesProps {
  onSelectPackage?: (packageId: PackageType, billingPeriod: BillingPeriod) => void;
  selectedPackage?: PackageType;
  selectedBillingPeriod?: BillingPeriod;
}

export default function BusinessPackages({
  onSelectPackage,
  selectedPackage,
  selectedBillingPeriod = 'monthly',
}: BusinessPackagesProps) {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>(selectedBillingPeriod);

  const packages = Object.values(BUSINESS_PACKAGES).sort((a, b) => {
    // Profesyonel paketi ortada göster
    if (a.id === 'profesyonel') return -1;
    if (b.id === 'profesyonel') return 1;
    return 0;
  });

  const handleSelectPackage = (packageId: PackageType) => {
    if (onSelectPackage) {
      onSelectPackage(packageId, billingPeriod);
    }
  };

  const getPrice = (packageId: PackageType) => {
    const pkg = BUSINESS_PACKAGES[packageId];
    if (billingPeriod === 'monthly') {
      return pkg.monthlyPrice;
    }
    return pkg.yearlyPrice;
  };

  const getSavings = (packageId: PackageType) => {
    const pkg = BUSINESS_PACKAGES[packageId];
    if (billingPeriod === 'monthly') {
      return 0;
    }
    const monthlyTotal = pkg.monthlyPrice * 12;
    const yearlyPrice = pkg.yearlyPrice;
    return monthlyTotal - yearlyPrice;
  };

  return (
    <div className="bg-white rounded-lg border border-[#e0e0e0] p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          İşletme Paketleri
        </h2>
        <p className="text-[#8f8f8f] mb-6">
          İşletmenize en uygun paketi seçin ve komşularınızla bağlantı kurun
        </p>

        {/* Billing Period Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span
            className={`text-sm font-medium ${
              billingPeriod === 'monthly'
                ? 'text-gray-900'
                : 'text-[#8f8f8f]'
            }`}
          >
            Aylık
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            className="relative inline-flex h-8 w-14 items-center rounded-full bg-[#e0e0e0]"
            style={{
              backgroundColor: billingPeriod === 'yearly' ? '#00833e' : '#e0e0e0',
            }}
          >
            <span
              className="inline-block h-6 w-6 transform rounded-full bg-white transition-transform"
              style={{
                transform:
                  billingPeriod === 'yearly'
                    ? 'translateX(1.75rem)'
                    : 'translateX(0.25rem)',
              }}
            />
          </button>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                billingPeriod === 'yearly'
                  ? 'text-gray-900'
                  : 'text-[#8f8f8f]'
              }`}
            >
              Yıllık
            </span>
            {billingPeriod === 'yearly' && (
              <span className="inline-block px-2 py-1 bg-[#d1fae5] text-[#006b32] text-xs font-bold rounded">
                %20 İndirim
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {packages.map((pkg) => {
          const isMostPopular = pkg.popular;
          const price = getPrice(pkg.id);
          const savings = getSavings(pkg.id);

          return (
            <div
              key={pkg.id}
              className={`relative rounded-lg transition-all duration-300 ${
                isMostPopular
                  ? 'ring-2 ring-[#00833e] shadow-lg scale-105 md:scale-110'
                  : 'border border-[#e0e0e0]'
              } ${selectedPackage === pkg.id ? 'ring-2 ring-[#00833e]' : ''}`}
            >
              {isMostPopular && (
                <div className="absolute -top-3 left-0 right-0 flex justify-center">
                  <span className="inline-flex items-center gap-1 px-4 py-1 bg-[#00833e] text-white text-xs font-bold rounded-full">
                    <Star className="w-3 h-3 fill-white" />
                    En Popüler
                  </span>
                </div>
              )}

              <div
                className={`p-6 rounded-lg ${
                  isMostPopular ? 'bg-white' : 'bg-white'
                }`}
              >
                {/* Package Header */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {pkg.name}
                </h3>
                <p className="text-sm text-[#8f8f8f] mb-6">
                  {pkg.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-[#00833e]">
                      {price}
                    </span>
                    <span className="text-lg text-gray-900">₺</span>
                    <span className="text-sm text-[#8f8f8f] ml-2">
                      /{billingPeriod === 'monthly' ? 'ay' : 'yıl'}
                    </span>
                  </div>
                  {savings > 0 && (
                    <p className="text-xs text-[#00833e] font-medium">
                      ₺{savings} tasarruf edin
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature.id}
                      className="flex items-start gap-3 text-sm"
                    >
                      <Check
                        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          feature.included
                            ? 'text-[#00833e]'
                            : 'text-[#e0e0e0]'
                        }`}
                      />
                      <span
                        className={
                          feature.included
                            ? 'text-gray-900'
                            : 'text-[#c0c0c0] line-through'
                        }
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPackage(pkg.id)}
                  className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors ${
                    selectedPackage === pkg.id
                      ? 'bg-[#00833e] hover:bg-[#006b32] text-white'
                      : 'bg-[#00833e] hover:bg-[#006b32] text-white'
                  }`}
                >
                  Seç
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Features Comparison Table */}
      <div className="border-t border-[#e0e0e0] pt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Özellikleri Karşılaştır
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e0e0e0]">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Özellik
                </th>
                {packages.map((pkg) => (
                  <th
                    key={pkg.id}
                    className="text-center py-3 px-4 font-semibold text-gray-900"
                  >
                    {pkg.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Get unique features */}
              {packages[0].features.map((feature) => (
                <tr key={feature.id} className="border-b border-[#f0f2f5]">
                  <td className="py-3 px-4 text-gray-900">{feature.name}</td>
                  {packages.map((pkg) => {
                    const pkgFeature = pkg.features.find(
                      (f) => f.id === feature.id
                    );
                    return (
                      <td
                        key={`${pkg.id}-${feature.id}`}
                        className="text-center py-3 px-4"
                      >
                        {pkgFeature?.included ? (
                          <Check className="w-5 h-5 text-[#00833e] mx-auto" />
                        ) : (
                          <span className="text-[#e0e0e0] text-xl">–</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Price Row */}
              <tr className="bg-[#f0f2f5]">
                <td className="py-3 px-4 font-semibold text-gray-900">
                  Fiyat ({billingPeriod === 'monthly' ? 'Aylık' : 'Yıllık'})
                </td>
                {packages.map((pkg) => (
                  <td
                    key={`price-${pkg.id}`}
                    className="text-center py-3 px-4 font-bold text-[#00833e]"
                  >
                    {getPrice(pkg.id)}₺
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ or Additional Info */}
      <div className="mt-8 bg-[#f0f2f5] rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3">
          Paket değiştirmek istiyorum?
        </h4>
        <p className="text-sm text-[#8f8f8f] mb-3">
          Paketler arasında istediğiniz zaman geçiş yapabilirsiniz. Yükseltirseniz,
          gün olarak hesaplanan kısmı size iade edilecektir.
        </p>
        <p className="text-xs text-[#8f8f8f]">
          Herhangi bir sorunuz varsa, destek ekibimiz size yardımcı olmaktan
          memnun olacaktır.
        </p>
      </div>
    </div>
  );
}
