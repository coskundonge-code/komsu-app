'use client';

import { useState, useMemo } from 'react';
import {
  CheckCircle,
  XCircle,
  Pause,
  TrendingUp,
  Wallet,
  Zap,
  BarChart3,
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  businessName: string;
  status: 'aktif' | 'duraklatilmis' | 'tamamlandi' | 'beklemede';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Bahar Indirimi 2026',
    businessName: 'Işık Elektronik',
    status: 'aktif',
    budget: 5000,
    spent: 2340,
    impressions: 45230,
    clicks: 892,
    startDate: '2026-02-15',
    endDate: '2026-03-31',
    createdAt: '2026-02-10',
  },
  {
    id: '2',
    name: 'Yazlık Koleksiyon',
    businessName: 'ModaTrend Butik',
    status: 'aktif',
    budget: 3500,
    spent: 3245,
    impressions: 32100,
    clicks: 534,
    startDate: '2026-02-20',
    endDate: '2026-03-20',
    createdAt: '2026-02-18',
  },
  {
    id: '3',
    name: 'Restoran Açılış Promosyonu',
    businessName: 'Lezzet Mutfağı',
    status: 'beklemede',
    budget: 2000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    startDate: '2026-03-15',
    endDate: '2026-04-15',
    createdAt: '2026-03-09',
  },
  {
    id: '4',
    name: 'Yazlık Hizmetleri Kampanyası',
    businessName: 'Bahçe Tasarımı Pro',
    status: 'duraklatilmis',
    budget: 2500,
    spent: 1200,
    impressions: 18900,
    clicks: 234,
    startDate: '2026-02-01',
    endDate: '2026-03-15',
    createdAt: '2026-01-28',
  },
  {
    id: '5',
    name: 'Sporcu Malzemeleri Satışı',
    businessName: 'AktifSpor Mağazası',
    status: 'aktif',
    budget: 4200,
    spent: 1890,
    impressions: 56780,
    clicks: 1203,
    startDate: '2026-02-25',
    endDate: '2026-04-25',
    createdAt: '2026-02-22',
  },
  {
    id: '6',
    name: 'Güzellik Ürünleri Lansman',
    businessName: 'RadyantGüzellik',
    status: 'tamamlandi',
    budget: 3000,
    spent: 3000,
    impressions: 42300,
    clicks: 672,
    startDate: '2026-01-15',
    endDate: '2026-02-28',
    createdAt: '2026-01-10',
  },
  {
    id: '7',
    name: 'Ev Dekorasyonu Seçkisi',
    businessName: 'Yaşam Tasarımı',
    status: 'beklemede',
    budget: 2800,
    spent: 0,
    impressions: 0,
    clicks: 0,
    startDate: '2026-03-20',
    endDate: '2026-05-20',
    createdAt: '2026-03-08',
  },
  {
    id: '8',
    name: 'Otomotiv Aksesuarları',
    businessName: 'AraçDünyası',
    status: 'aktif',
    budget: 6000,
    spent: 4560,
    impressions: 78900,
    clicks: 1540,
    startDate: '2026-02-10',
    endDate: '2026-04-10',
    createdAt: '2026-02-05',
  },
];

export default function ReklamlarPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [filter, setFilter] = useState<'tumu' | 'aktif' | 'beklemede' | 'duraklatilmis' | 'tamamlandi'>('tumu');

  const filteredCampaigns = useMemo(() => {
    if (filter === 'tumu') return campaigns;
    return campaigns.filter((campaign) => campaign.status === filter);
  }, [campaigns, filter]);

  const stats = useMemo(() => {
    const activeCampaigns = campaigns.filter((c) => c.status === 'aktif').length;
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
    const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

    return {
      activeCampaigns,
      totalBudget,
      totalSpent,
      ctr,
    };
  }, [campaigns]);

  const handleApprove = (id: string) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === id ? { ...campaign, status: 'aktif' as const } : campaign,
      ),
    );
  };

  const handleReject = (id: string) => {
    setCampaigns((prev) => prev.filter((campaign) => campaign.id !== id));
  };

  const handlePause = (id: string) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === id ? { ...campaign, status: 'duraklatilmis' as const } : campaign,
      ),
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('tr-TR').format(num);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'aktif':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'beklemede':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'duraklatilmis':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'tamamlandi':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aktif':
        return 'Aktif';
      case 'beklemede':
        return 'Beklemede';
      case 'duraklatilmis':
        return 'Duraklatılmış';
      case 'tamamlandi':
        return 'Tamamlandı';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Reklam Kampanyaları</h1>
          <p className="text-text-muted">Tüm reklam kampanyalarını yönet ve izle</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm font-medium mb-1">Aktif Kampanya</p>
                <p className="text-2xl font-bold text-text-primary">{stats.activeCampaigns}</p>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <TrendingUp size={24} className="text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm font-medium mb-1">Toplam Bütçe</p>
                <p className="text-2xl font-bold text-text-primary">{formatCurrency(stats.totalBudget)}</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <Wallet size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm font-medium mb-1">Toplam Harcama</p>
                <p className="text-2xl font-bold text-text-primary">{formatCurrency(stats.totalSpent)}</p>
              </div>
              <div className="bg-orange-100 rounded-lg p-3">
                <Zap size={24} className="text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm font-medium mb-1">Tıklama Oranı</p>
                <p className="text-2xl font-bold text-text-primary">{stats.ctr}%</p>
              </div>
              <div className="bg-purple-100 rounded-lg p-3">
                <BarChart3 size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-surface rounded-lg shadow-sm border border-border mb-6 p-4">
          <div className="flex gap-2 flex-wrap">
            {(['tumu', 'aktif', 'beklemede', 'duraklatilmis', 'tamamlandi'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary text-white'
                    : 'bg-background text-text-primary hover:bg-[#e0e0e0]'
                }`}
              >
                {status === 'tumu'
                  ? 'Tümü'
                  : status === 'aktif'
                    ? 'Aktif'
                    : status === 'beklemede'
                      ? 'Beklemede'
                      : status === 'duraklatilmis'
                        ? 'Duraklatılmış'
                        : 'Tamamlandı'}
              </button>
            ))}
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-background border-b border-border">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                    Kampanya Adı
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                    İşletme Adı
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                    Durum
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                    Bütçe
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                    Harcama
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                    Gösterim
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                    Tıklamalar
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                    CTR
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                    Tarih Aralığı
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-text-primary">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign, index) => {
                  const ctr =
                    campaign.impressions > 0
                      ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2)
                      : '0.00';

                  return (
                    <tr
                      key={campaign.id}
                      className={`border-b border-border hover:bg-surface-hover transition-colors ${
                        index % 2 === 0 ? 'bg-surface' : 'bg-[#fafafa]'
                      }`}
                    >
                      <td className="px-6 py-4 text-sm text-text-primary font-medium">
                        {campaign.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#666]">{campaign.businessName}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(
                            campaign.status,
                          )}`}
                        >
                          {getStatusLabel(campaign.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-text-primary">
                        {formatCurrency(campaign.budget)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-text-primary">
                        {formatCurrency(campaign.spent)}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#666]">
                        {formatNumber(campaign.impressions)}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#666]">
                        {formatNumber(campaign.clicks)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-primary">
                        {ctr}%
                      </td>
                      <td className="px-6 py-4 text-sm text-[#666]">
                        {campaign.startDate} / {campaign.endDate}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          {campaign.status === 'beklemede' && (
                            <>
                              <button
                                onClick={() => handleApprove(campaign.id)}
                                className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600 hover:text-primary"
                                title="Onayla"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => handleReject(campaign.id)}
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                                title="Reddet"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                          {campaign.status === 'aktif' && (
                            <button
                              onClick={() => handlePause(campaign.id)}
                              className="p-2 hover:bg-orange-100 rounded-lg transition-colors text-orange-600"
                              title="Duraklat"
                            >
                              <Pause size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-muted text-base">Bu filtreye uygun kampanya bulunamadı</p>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-surface rounded-lg border border-border">
            <p className="text-text-muted text-sm mb-1">Toplam Kampanya</p>
            <p className="text-xl font-bold text-text-primary">{campaigns.length}</p>
          </div>
          <div className="text-center p-4 bg-surface rounded-lg border border-border">
            <p className="text-text-muted text-sm mb-1">Kullanılan Bütçe</p>
            <p className="text-xl font-bold text-text-primary">
              {stats.totalBudget > 0 ? (((stats.totalSpent / stats.totalBudget) * 100).toFixed(1) + '%') : '0%'}
            </p>
          </div>
          <div className="text-center p-4 bg-surface rounded-lg border border-border">
            <p className="text-text-muted text-sm mb-1">Ortalama CTR</p>
            <p className="text-xl font-bold text-text-primary">{stats.ctr}%</p>
          </div>
          <div className="text-center p-4 bg-surface rounded-lg border border-border">
            <p className="text-text-muted text-sm mb-1">Kalan Bütçe</p>
            <p className="text-xl font-bold text-primary">
              {formatCurrency(stats.totalBudget - stats.totalSpent)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
