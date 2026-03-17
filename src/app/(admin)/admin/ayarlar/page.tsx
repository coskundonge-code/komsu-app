'use client';

import React, { useState } from 'react';
import {
  Save,
  RotateCw,
  Eye,
  EyeOff,
} from 'lucide-react';

interface Settings {
  general: {
    siteName: string;
    siteDescription: string;
    maintenanceMode: boolean;
  };
  moderation: {
    autoApproveThreshold: number;
    aiSensitivity: string;
  };
  listing: {
    freeQuotaPerYear: number;
    listingPrice: number;
    featuredPrice: number;
  };
  packages: {
    temelPrice: number;
    proPrice: number;
    premiumPrice: number;
  };
  api: {
    apiKey: string;
    apiSecret: string;
  };
}

const TABS = [
  { id: 'general', label: 'Genel Ayarlar' },
  { id: 'moderation', label: 'Moderasyon' },
  { id: 'listing', label: 'İlan Ayarları' },
  { id: 'packages', label: 'Paket Fiyatlandırması' },
  { id: 'api', label: 'API Yönetimi' },
  { id: 'email', label: 'Email Şablonları' },
  { id: 'notifications', label: 'Bildirim Ayarları' },
];

export default function AyarlarPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<Settings>({
    general: {
      siteName: 'KomşuApp',
      siteDescription: 'Mahalle komşularını birleştiren platform',
      maintenanceMode: false,
    },
    moderation: {
      autoApproveThreshold: 0.75,
      aiSensitivity: 'medium',
    },
    listing: {
      freeQuotaPerYear: 3,
      listingPrice: 250,
      featuredPrice: 150,
    },
    packages: {
      temelPrice: 99,
      proPrice: 249,
      premiumPrice: 499,
    },
    api: {
      apiKey: 'sk_live_1a2b3c4d5e6f7g8h9i0j',
      apiSecret: 'sk_secret_1a2b3c4d5e6f7g8h9i0j',
    },
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistem Ayarları</h1>
        <p className="text-gray-600">
          Platform ayarlarını yönetin, paketleri fiyatlandırın ve API anahtarlarını yapılandırın
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden mb-6">
        <div className="flex border-b border-[#e0e0e0] overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-[#00833e] text-[#00833e]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Site Adı
                </label>
                <input
                  type="text"
                  value={settings.general.siteName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, siteName: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Site Açıklaması
                </label>
                <textarea
                  value={settings.general.siteDescription}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, siteDescription: e.target.value },
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
                />
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#f0f2f5] rounded-lg">
                <input
                  type="checkbox"
                  checked={settings.general.maintenanceMode}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, maintenanceMode: e.target.checked },
                    })
                  }
                  className="w-5 h-5 accent-[#00833e]"
                />
                <label className="font-semibold text-gray-900">
                  Bakım Modu (Etkinleştirilirse, kullanıcılar siteye erişemeyecektir)
                </label>
              </div>
            </div>
          )}

          {/* Moderation */}
          {activeTab === 'moderation' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Otomatik Onaylama Eşiği (0.0 - 1.0)
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.moderation.autoApproveThreshold}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        moderation: {
                          ...settings.moderation,
                          autoApproveThreshold: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="flex-1"
                  />
                  <span className="font-bold text-gray-900 min-w-12">
                    {(settings.moderation.autoApproveThreshold * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Ayarlamada yer alan puan bu eşiğin üzerinde olan içerik otomatik olarak onaylanacaktır.
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  AI Hassasiyet Seviyesi
                </label>
                <select
                  value={settings.moderation.aiSensitivity}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      moderation: {
                        ...settings.moderation,
                        aiSensitivity: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
                >
                  <option value="low">Düşük (Daha az filter)</option>
                  <option value="medium">Orta (Dengeli)</option>
                  <option value="high">Yüksek (Daha katı)</option>
                </select>
              </div>
            </div>
          )}

          {/* Listing Settings */}
          {activeTab === 'listing' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Yıllık Ücretsiz İlan Kotu (Kullanıcı Başına)
                </label>
                <input
                  type="number"
                  value={settings.listing.freeQuotaPerYear}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      listing: { ...settings.listing, freeQuotaPerYear: parseInt(e.target.value) },
                    })
                  }
                  className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  İlan Fiyatı (₺)
                </label>
                <input
                  type="number"
                  value={settings.listing.listingPrice}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      listing: { ...settings.listing, listingPrice: parseInt(e.target.value) },
                    })
                  }
                  className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Öne Çıkarma Fiyatı (₺)
                </label>
                <input
                  type="number"
                  value={settings.listing.featuredPrice}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      listing: { ...settings.listing, featuredPrice: parseInt(e.target.value) },
                    })
                  }
                  className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
                />
              </div>
            </div>
          )}

          {/* Packages */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Temel Paket (₺/aylık)
                  </label>
                  <input
                    type="number"
                    value={settings.packages.temelPrice}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        packages: { ...settings.packages, temelPrice: parseInt(e.target.value) },
                      })
                    }
                    className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Profesyonel Paket (₺/aylık)
                  </label>
                  <input
                    type="number"
                    value={settings.packages.proPrice}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        packages: { ...settings.packages, proPrice: parseInt(e.target.value) },
                      })
                    }
                    className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Premium Paket (₺/aylık)
                  </label>
                  <input
                    type="number"
                    value={settings.packages.premiumPrice}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        packages: { ...settings.packages, premiumPrice: parseInt(e.target.value) },
                      })
                    }
                    className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* API Management */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ API anahtarlarınızı güvende tutun. Başkasıyla paylaşmayın!
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  API Anahtarı
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={settings.api.apiKey}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          api: { ...settings.api, apiKey: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-gray-900"
                    >
                      {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <button className="px-4 py-2 bg-[#f0f2f5] text-gray-900 rounded-lg hover:bg-[#e0e0e0] font-medium">
                    Yenile
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  API Sırrı
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type={showApiSecret ? 'text' : 'password'}
                      value={settings.api.apiSecret}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          api: { ...settings.api, apiSecret: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
                    />
                    <button
                      onClick={() => setShowApiSecret(!showApiSecret)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-gray-900"
                    >
                      {showApiSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <button className="px-4 py-2 bg-[#f0f2f5] text-gray-900 rounded-lg hover:bg-[#e0e0e0] font-medium">
                    Yenile
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Email Templates */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Email şablonlarını özelleştirin. Kullanılabilir değişkenler: {'{name}'}, {'{email}'}, {'{link}'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Hoş Geldiniz Email Şablonu
                </label>
                <textarea
                  defaultValue="Merhaba {name},\n\nKomşuApp'e hoş geldiniz! Hesabınız başarıyla oluşturuldu.\n\nProfilinizi tamamlamak için lütfen {link} ziyaret edin.\n\nSaygılar,\nKomşuApp Ekibi"
                  rows={6}
                  className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
                />
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Bildirim Tercihlerini Yapılandırın</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border border-[#e0e0e0] rounded-lg hover:bg-[#f0f2f5]">
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#00833e]" />
                    <label className="font-medium text-gray-900">
                      Yeni Gönderi Bildirimleri
                    </label>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-[#e0e0e0] rounded-lg hover:bg-[#f0f2f5]">
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#00833e]" />
                    <label className="font-medium text-gray-900">
                      Grup Aktiviteleri
                    </label>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-[#e0e0e0] rounded-lg hover:bg-[#f0f2f5]">
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#00833e]" />
                    <label className="font-medium text-gray-900">
                      Sistem Güncellemeleri
                    </label>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-[#e0e0e0] rounded-lg hover:bg-[#f0f2f5]">
                    <input type="checkbox" className="w-5 h-5 accent-[#00833e]" />
                    <label className="font-medium text-gray-900">
                      Pazarlama Emails
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={() => setSaved(false)}
          className="px-6 py-2 border border-[#e0e0e0] rounded-lg text-gray-900 font-medium hover:bg-[#f0f2f5] flex items-center gap-2"
        >
          <RotateCw size={18} />
          Sıfırla
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-[#00833e] text-white rounded-lg font-medium hover:bg-[#006b32] flex items-center gap-2"
        >
          <Save size={18} />
          Kaydet
        </button>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="fixed bottom-4 right-4 bg-[#00833e] text-white px-6 py-3 rounded-lg shadow-lg">
          ✓ Ayarlar başarıyla kaydedildi!
        </div>
      )}
    </div>
  );
}
