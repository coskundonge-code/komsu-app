'use client';

import React, { useState } from 'react';
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reklam Kampanyaları</h1>
          <p className="text-gray-600">
            Toplam {MOCK_CAMPAIGNS.length} kampanya ({filterStatus === 'all' ? filteredCampaigns.length : filterStatus}), Toplam Bütçe: ₺10,500
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-[#00833e] hover:bg-[#006b32] text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Kampanya Oluştur
        </button>
      </div>

      {/* Add Campaign Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg border border-[#a7dbb8] p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Yeni Kampanya Oluştur</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kampanya Adı
                </label>
                <input
                  type="text"
                  placeholder="Örn: Yaz Promosyonu"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bütçe (₺)
                </label>
                <input
                  type="number"
                  placeholder="5000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                placeholder="Kampanyayı tanıtın..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e] resize-none"
              ></textarea>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-[#00833e] hover:bg-[#006b32] text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Kampanyayı Başlat
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-lg border border-[#d1fae5] p-4 mb-6 flex gap-2 flex-wrap">
        {(['all', 'active', 'paused', 'ended'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === status
                ? 'bg-[#00833e] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => {
          const statusConfig =
            STATUS_CONFIG[campaign.status as keyof typeof STATUS_CONFIG];
          const progress = (campaign.spent / campaign.budget) * 100;

          return (
            <div
              key={campaign.id}
              className="bg-white rounded-lg border border-[#d1fae5] p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#d1fae5] rounded-lg text-[#00833e]">
                      <Megaphone size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {campaign.name}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
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
                  <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                    <MoreVertical size={18} className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Budget Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-[#00833e]" />
                    <span className="text-sm font-medium text-gray-700">Bütçe</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ₺{campaign.spent.toLocaleString()} / ₺{campaign.budget.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      progress < 50
                        ? 'bg-green-600'
                        : progress < 80
                        ? 'bg-yellow-600'
                        : 'bg-red-600'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye size={16} className="text-blue-600" />
                    <p className="text-xs text-gray-600">Görüntüleme</p>
                  </div>
                  <p className="text-lg font-bold text-blue-900">
                    {campaign.views.toLocaleString()}
                  </p>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Users size={16} className="text-purple-600" />
                    <p className="text-xs text-gray-600">Tıklama</p>
                  </div>
                  <p className="text-lg font-bold text-purple-900">
                    {campaign.clicks}
                  </p>
                </div>

                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={16} className="text-green-600" />
                    <p className="text-xs text-gray-600">Dönüşüm</p>
                  </div>
                  <p className="text-lg font-bold text-green-900">
                    {campaign.conversions}
                  </p>
                </div>

                <div className="p-3 bg-[#e6f4ec] rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye size={16} className="text-[#00833e]" />
                    <p className="text-xs text-gray-600">CTR</p>
                  </div>
                  <p className="text-lg font-bold text-[#004d24]">
                    {campaign.ctr}%
                  </p>
                </div>
              </div>

              {/* Actions */}
              {campaign.status === 'active' && (
                <div className="flex gap-2 border-t border-[#d1fae5] pt-4">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-[#e6f4ec] hover:bg-[#d1fae5] text-[#006b32] font-medium py-2 px-3 rounded-lg transition-colors text-sm">
                    <Edit2 size={16} />
                    Düzenle
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-medium py-2 px-3 rounded-lg transition-colors text-sm">
                    Duraklat
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="bg-white rounded-lg border border-[#d1fae5] p-12 text-center">
          <Megaphone size={48} className="mx-auto mb-4 text-[#00833e]" />
          <p className="text-lg font-bold text-gray-900">Kampanya Yok</p>
          <p className="text-gray-600 mt-2">Yeni bir reklam kampanyası başlatın</p>
        </div>
      )}
    </div>
  );
}
