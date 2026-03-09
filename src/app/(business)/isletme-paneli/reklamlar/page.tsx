'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Megaphone,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  Edit2,
  Trash2,
  MoreVertical,
  Calendar,
  AlertCircle,
  Copy,
  Download,
} from 'lucide-react';

interface AdCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'ended';
  startDate: string;
  budget: number;
  spent: number;
  views: number;
  clicks: number;
  conversions: number;
  ctr: number;
}

const MOCK_CAMPAIGNS: AdCampaign[] = [
  {
    id: '1',
    name: 'Yaz Promosyonu',
    status: 'active',
    startDate: '2024-03-01',
    budget: 5000,
    spent: 3240,
    views: 12500,
    clicks: 342,
    conversions: 45,
    ctr: 2.7,
  },
  {
    id: '2',
    name: 'Yeni Ürün Lansman',
    status: 'active',
    startDate: '2024-02-15',
    budget: 3000,
    spent: 2890,
    views: 8900,
    clicks: 234,
    conversions: 28,
    ctr: 2.6,
  },
  {
    id: '3',
    name: 'Fidelite Programı',
    status: 'paused',
    startDate: '2024-02-01',
    budget: 2000,
    spent: 1956,
    views: 5600,
    clicks: 145,
    conversions: 15,
    ctr: 2.6,
  },
  {
    id: '4',
    name: 'Bahar İndirimleri',
    status: 'ended',
    startDate: '2024-01-20',
    budget: 2500,
    spent: 2500,
    views: 7200,
    clicks: 198,
    conversions: 22,
    ctr: 2.7,
  },
];

const STATUS_CONFIG = {
  active: { label: 'Aktif', color: 'bg-green-100 text-green-800' },
  paused: { label: 'Duraklatılmış', color: 'bg-yellow-100 text-yellow-800' },
  ended: { label: 'Sona Erdi', color: 'bg-gray-100 text-gray-800' },
};

export default function ReklamlarPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'ended'>('all');

  const filteredCampaigns = MOCK_CAMPAIGNS.filter((campaign) => {
    if (filterStatus === 'all') return true;
    return campaign.status === filterStatus;
  });

  const totalBudget = MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.spent, 0);
  const activeCampaigns = MOCK_CAMPAIGNS.filter((c) => c.status === 'active').length;

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-[#333] mb-2">Reklam Kampanyaları</h1>
          <p className="text-[#8f8f8f]">
            Tüm kampanyalarınızı yönetin ve performansınızı takip edin
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-[#00833e] hover:bg-[#006b32] text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md"
        >
          <Plus size={20} />
          Kampanya Oluştur
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#8f8f8f] text-sm mb-1">Aktif Kampanyalar</p>
              <p className="text-3xl font-bold text-[#333]">{activeCampaigns}</p>
            </div>
            <Megaphone size={32} color="#00833e" className="opacity-20" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#8f8f8f] text-sm mb-1">Toplam Bütçe</p>
              <p className="text-3xl font-bold text-[#333]">₺{totalBudget.toLocaleString()}</p>
            </div>
            <DollarSign size={32} color="#00833e" className="opacity-20" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#8f8f8f] text-sm mb-1">Harcanan</p>
              <p className="text-3xl font-bold text-[#333]">₺{totalSpent.toLocaleString()}</p>
              <p className="text-xs text-[#8f8f8f] mt-1">
                {Math.round((totalSpent / totalBudget) * 100)}% kullanıldı
              </p>
            </div>
            <TrendingUp size={32} color="#00833e" className="opacity-20" />
          </div>
        </div>
      </div>

      {/* Add Campaign Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg border border-[#a7dbb8] p-6 mb-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#333]">Yeni Kampanya Oluştur</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-[#8f8f8f] hover:text-[#333]"
            >
              ✕
            </button>
          </div>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#333] mb-2">
                  Kampanya Adı
                </label>
                <input
                  type="text"
                  placeholder="Örn: Yaz Promosyonu"
                  className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333] mb-2">
                  Bütçe (₺)
                </label>
                <input
                  type="number"
                  placeholder="5000"
                  className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333] mb-2">
                  Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333] mb-2">
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333] mb-2">
                Açıklama
              </label>
              <textarea
                placeholder="Kampanyayı tanıtın..."
                rows={3}
                className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e] focus:border-transparent resize-none"
              ></textarea>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#e0e0e0]">
              <button
                type="submit"
                className="bg-[#00833e] hover:bg-[#006b32] text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Kampanyayı Başlat
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-[#e0e0e0] hover:bg-[#d0d0d0] text-[#333] font-medium py-2 px-6 rounded-lg transition-colors"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 mb-6 flex gap-2 flex-wrap">
        {(['all', 'active', 'paused', 'ended'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === status
                ? 'bg-[#00833e] text-white'
                : 'bg-[#f0f2f5] text-[#333] hover:bg-[#e0e0e0]'
            }`}
          >
            {status === 'all'
              ? 'Tümü'
              : status === 'active'
              ? 'Aktif'
              : status === 'paused'
              ? 'Duraklatılmış'
              : 'Sona Erdi'}
          </button>
        ))}
      </div>

      {/* Campaigns List */}
      <div className="space-y-4 mb-8">
        {filteredCampaigns.map((campaign) => {
          const statusConfig =
            STATUS_CONFIG[campaign.status as keyof typeof STATUS_CONFIG];
          const progress = (campaign.spent / campaign.budget) * 100;

          return (
            <div
              key={campaign.id}
              className="bg-white rounded-lg border border-[#e0e0e0] p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#e6f4ec] rounded-lg text-[#00833e]">
                      <Megaphone size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#333]">
                        {campaign.name}
                      </h3>
                      <p className="text-sm text-[#8f8f8f] flex items-center gap-1 mt-1">
                        <Calendar size={14} />
                        {new Date(campaign.startDate).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}
                  >
                    {statusConfig.label}
                  </span>
                  <button className="p-2 hover:bg-[#f0f2f5] rounded transition-colors">
                    <MoreVertical size={18} className="text-[#8f8f8f]" />
                  </button>
                </div>
              </div>

              {/* Budget Progress */}
              <div className="mb-6 bg-[#f0f2f5] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-[#00833e]" />
                    <span className="text-sm font-medium text-[#333]">Bütçe Kullanımı</span>
                  </div>
                  <span className="text-sm font-bold text-[#333]">
                    ₺{campaign.spent.toLocaleString()} / ₺{campaign.budget.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-[#e0e0e0] rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      progress < 50
                        ? 'bg-[#00833e]'
                        : progress < 80
                        ? 'bg-[#f59e0b]'
                        : 'bg-[#ef4444]'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-[#8f8f8f] mt-2">
                  {progress.toFixed(1)}% kullanıldı
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-3 bg-[#dbeafe] rounded-lg border border-[#bfdbfe]">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye size={16} className="text-[#3b82f6]" />
                    <p className="text-xs text-[#8f8f8f]">Gösterim</p>
                  </div>
                  <p className="text-lg font-bold text-[#333]">
                    {campaign.views.toLocaleString()}
                  </p>
                </div>

                <div className="p-3 bg-[#f3e8ff] rounded-lg border border-[#e9d5ff]">
                  <div className="flex items-center gap-2 mb-1">
                    <Users size={16} className="text-[#a855f7]" />
                    <p className="text-xs text-[#8f8f8f]">Tıklama</p>
                  </div>
                  <p className="text-lg font-bold text-[#333]">
                    {campaign.clicks}
                  </p>
                </div>

                <div className="p-3 bg-[#d1fae5] rounded-lg border border-[#a7dbb8]">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={16} className="text-[#00833e]" />
                    <p className="text-xs text-[#8f8f8f]">Dönüşüm</p>
                  </div>
                  <p className="text-lg font-bold text-[#333]">
                    {campaign.conversions}
                  </p>
                </div>

                <div className="p-3 bg-[#fee2e2] rounded-lg border border-[#fecaca]">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye size={16} className="text-[#ef4444]" />
                    <p className="text-xs text-[#8f8f8f]">CTR</p>
                  </div>
                  <p className="text-lg font-bold text-[#333]">
                    {campaign.ctr}%
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 border-t border-[#e0e0e0] pt-4">
                {campaign.status === 'active' && (
                  <>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-[#e6f4ec] hover:bg-[#d1fae5] text-[#006b32] font-medium py-2 px-3 rounded-lg transition-colors text-sm">
                      <Edit2 size={16} />
                      Düzenle
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-[#fef3c7] hover:bg-[#fde68a] text-[#92400e] font-medium py-2 px-3 rounded-lg transition-colors text-sm">
                      Duraklat
                    </button>
                  </>
                )}
                {campaign.status === 'paused' && (
                  <>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-[#e6f4ec] hover:bg-[#d1fae5] text-[#006b32] font-medium py-2 px-3 rounded-lg transition-colors text-sm">
                      Sürdür
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-[#fee2e2] hover:bg-[#fecaca] text-[#b91c1c] font-medium py-2 px-3 rounded-lg transition-colors text-sm">
                      <Trash2 size={16} />
                      Sil
                    </button>
                  </>
                )}
                {campaign.status === 'ended' && (
                  <>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-[#e6f4ec] hover:bg-[#d1fae5] text-[#006b32] font-medium py-2 px-3 rounded-lg transition-colors text-sm">
                      <Copy size={16} />
                      Kopyala
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-[#f0f2f5] hover:bg-[#e0e0e0] text-[#333] font-medium py-2 px-3 rounded-lg transition-colors text-sm">
                      <Download size={16} />
                      Rapor
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-[#f0f2f5] rounded-full">
              <Megaphone size={48} className="text-[#00833e]" />
            </div>
          </div>
          <p className="text-lg font-bold text-[#333]">Henüz kampanya yok</p>
          <p className="text-[#8f8f8f] mt-2 mb-4">Yeni bir reklam kampanyası başlatarak işletmenizi daha fazla kişiye ulaştırın</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 bg-[#00833e] hover:bg-[#006b32] text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            <Plus size={18} />
            İlk Kampanyayı Oluştur
          </button>
        </div>
      )}
    </div>
  );
}
