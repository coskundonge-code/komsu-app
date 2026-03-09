'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Users, UserCheck, MessageSquare, UserPlus, Download, ChevronDown, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const timeRanges = [
  { id: 'week', label: 'Bu Hafta' },
  { id: 'month', label: 'Bu Ay' },
  { id: 'quarter', label: 'Son 3 Ay' },
  { id: 'year', label: 'Son 1 Yıl' },
];

const STATS = [
  {
    id: 1,
    label: 'Toplam Kullanıcı',
    value: '15,847',
    change: '+8.2%',
    icon: Users,
    bgColor: '#e6f4ec',
    textColor: '#00833e',
  },
  {
    id: 2,
    label: 'Aktif Kullanıcı',
    value: '11,234',
    change: '+12.5%',
    icon: UserCheck,
    bgColor: '#dbeafe',
    textColor: '#1e40af',
  },
  {
    id: 3,
    label: 'Toplam Gönderi',
    value: '52,847',
    change: '+15.3%',
    icon: MessageSquare,
    bgColor: '#fce7f3',
    textColor: '#be185d',
  },
  {
    id: 4,
    label: 'Yeni Kayıtlar',
    value: '2,345',
    change: '+6.7%',
    icon: UserPlus,
    bgColor: '#fef3c7',
    textColor: '#92400e',
  },
];

const GROWTH_DATA = [
  { week: 'Hafta 1', users: 1200, posts: 2400, active: 900 },
  { week: 'Hafta 2', users: 1900, posts: 2210, active: 1400 },
  { week: 'Hafta 3', users: 2000, posts: 2290, active: 1500 },
  { week: 'Hafta 4', users: 2780, posts: 2000, active: 2100 },
];

const CONTENT_BREAKDOWN = [
  { name: 'Paylaşımlar', count: 23500, percentage: 44, color: 'bg-[#00833e]' },
  { name: 'Yorumlar', count: 15200, percentage: 29, color: 'bg-blue-500' },
  { name: 'Raporlar', count: 8900, percentage: 17, color: 'bg-red-500' },
  { name: 'Diğer', count: 4847, percentage: 10, color: 'bg-gray-400' },
];

const TOP_NEIGHBORHOODS = [
  { rank: 1, name: 'Kadıköy', users: 2847, posts: 5234, engagement: 84 },
  { rank: 2, name: 'Beşiktaş', users: 2156, posts: 4123, engagement: 78 },
  { rank: 3, name: 'Moda', users: 1987, posts: 3456, engagement: 81 },
  { rank: 4, name: 'Caferağa', users: 1654, posts: 2890, engagement: 75 },
  { rank: 5, name: 'Fenerbahçe', users: 1423, posts: 2456, engagement: 72 },
];

const HOURLY_ACTIVITY = [
  { hour: '00:00', activity: 120 },
  { hour: '04:00', activity: 85 },
  { hour: '08:00', activity: 450 },
  { hour: '12:00', activity: 890 },
  { hour: '16:00', activity: 1200 },
  { hour: '20:00', activity: 950 },
  { hour: '23:00', activity: 320 },
];

export default function AdminReportsPage() {
  const [selectedRange, setSelectedRange] = useState('month');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const selectedLabel = timeRanges.find((r) => r.id === selectedRange)?.label || 'Bu Ay';

  const handleExport = () => {
    setIsExporting(true);
    console.log('Rapor indiriliyor...');
    setTimeout(() => setIsExporting(false), 1500);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    console.log('Veriler yenileniyor...');
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen">
      <div>
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden mb-6 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#333]">Raporlar ve Analizler</h1>
              <p className="text-[#8f8f8f] text-sm mt-1">Platform performansı ve kullanıcı aktiviteleri</p>
            </div>

            {/* Time Range Selector and Actions */}
            <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#f0f2f5] border border-[#e0e0e0] rounded-lg text-[#333] font-medium text-sm hover:bg-[#e0e0e0] disabled:opacity-50 transition-colors"
                title="Verileri Yenile"
              >
                <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
                Yenile
              </button>

              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#f0f2f5] border border-[#e0e0e0] rounded-lg text-[#333] font-medium text-sm hover:bg-[#e0e0e0] transition-colors"
                >
                  {selectedLabel}
                  <ChevronDown className={cn('w-4 h-4 transition-transform', openDropdown && 'rotate-180')} />
                </button>

                {openDropdown && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-[#e0e0e0] rounded-lg shadow-lg z-50 min-w-40">
                    {timeRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => {
                          setSelectedRange(range.id);
                          setOpenDropdown(false);
                        }}
                        className={cn(
                          'w-full text-left px-4 py-3 text-sm transition-colors',
                          selectedRange === range.id
                            ? 'bg-[#00833e] text-white font-medium'
                            : 'text-[#404040] hover:bg-[#f0f2f5]'
                        )}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#00833e] text-white rounded-lg hover:bg-[#006b32] disabled:opacity-50 transition-colors font-medium text-sm shadow-sm"
              >
                <Download className="w-4 h-4" />
                {isExporting ? 'İndiriliyor...' : 'Rapor İndir'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {STATS.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.id}
                className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="p-2.5 rounded-lg"
                    style={{ backgroundColor: stat.bgColor }}
                  >
                    <Icon size={20} style={{ color: stat.textColor }} />
                  </div>
                  <span className="text-sm font-semibold text-[#00833e]">{stat.change}</span>
                </div>
                <p className="text-[#8f8f8f] text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-[#333]">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Growth Metrics and Content Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Growth Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 size={20} className="text-[#00833e]" />
              <div>
                <h2 className="text-lg font-bold text-[#333]">Haftalık Büyüme</h2>
                <p className="text-xs text-[#8f8f8f]">Son 4 hafta eğilimi</p>
              </div>
            </div>

            <div className="space-y-4">
              {GROWTH_DATA.map((data) => {
                const maxValue = 2800;
                const percentage = (data.users / maxValue) * 100;

                return (
                  <div key={data.week}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[#333]">{data.week}</span>
                      <span className="text-xs text-[#8f8f8f] font-medium">{data.users.toLocaleString('tr-TR')} kullanıcı</span>
                    </div>
                    <div className="w-full bg-[#e0e0e0] rounded-full h-2.5">
                      <div
                        className="bg-[#00833e] h-2.5 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-[#8f8f8f] mt-6 bg-[#f0f2f5] p-3 rounded">
              <span className="font-medium">Ortalama:</span> {Math.round(GROWTH_DATA.reduce((a, b) => a + b.users, 0) / GROWTH_DATA.length).toLocaleString('tr-TR')} kullanıcı/hafta
            </p>
          </div>

          {/* Content Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={20} className="text-[#00833e]" />
              <div>
                <h2 className="text-lg font-bold text-[#333]">İçerik Dağılımı</h2>
                <p className="text-xs text-[#8f8f8f]">Toplam {CONTENT_BREAKDOWN.reduce((a, b) => a + b.count, 0).toLocaleString('tr-TR')} içerik</p>
              </div>
            </div>

            <div className="space-y-4">
              {CONTENT_BREAKDOWN.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[#333]">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#333]">{item.percentage}%</span>
                      <span className="text-xs text-[#8f8f8f]">({item.count.toLocaleString('tr-TR')})</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#e0e0e0] rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-[#e0e0e0]">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {CONTENT_BREAKDOWN.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-[#404040]">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* User Activity Heatmap and Top Neighborhoods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Heatmap */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
            <h2 className="text-lg font-bold text-[#333] mb-6">Saatlik Aktivite Haritası</h2>

            <div className="space-y-3">
              {HOURLY_ACTIVITY.map((data) => {
                const maxActivity = 1200;
                const percentage = (data.activity / maxActivity) * 100;

                return (
                  <div key={data.hour}>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-[#333] w-12">{data.hour}</span>
                      <div className="flex-1">
                        <div className="w-full bg-[#e0e0e0] rounded-full h-2.5">
                          <div
                            className="bg-[#00833e] h-2.5 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-[#8f8f8f] font-medium w-16 text-right">{data.activity} etkinlik</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-[#8f8f8f] mt-6 bg-[#f0f2f5] p-3 rounded">
              <span className="font-medium">En yüksek aktivite:</span> 16:00 ile 20:00 saatleri arasında
            </p>
          </div>

          {/* Top Neighborhoods */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
            <h2 className="text-lg font-bold text-[#333] mb-6">En Aktif Mahalleler</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e0e0e0]">
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-[#8f8f8f] uppercase">Sıra</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-[#8f8f8f] uppercase">Mahalle</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-[#8f8f8f] uppercase">Kullanıcı</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-[#8f8f8f] uppercase">Gönderi</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-[#8f8f8f] uppercase">Katılım</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_NEIGHBORHOODS.map((neighborhood) => (
                    <tr
                      key={neighborhood.rank}
                      className="border-b border-[#e0e0e0] hover:bg-[#f0f2f5] transition-colors"
                    >
                      <td className="px-3 py-3 text-sm font-semibold text-[#00833e] w-8">
                        {neighborhood.rank}
                      </td>
                      <td className="px-3 py-3 text-sm font-medium text-[#333]">
                        {neighborhood.name}
                      </td>
                      <td className="px-3 py-3 text-sm text-[#404040]">
                        {neighborhood.users.toLocaleString('tr-TR')}
                      </td>
                      <td className="px-3 py-3 text-sm text-[#404040]">
                        {neighborhood.posts.toLocaleString('tr-TR')}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-[#e0e0e0] rounded-full h-1.5">
                            <div
                              className="bg-[#00833e] h-1.5 rounded-full"
                              style={{ width: `${neighborhood.engagement}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-[#333] w-8 text-right">
                            {neighborhood.engagement}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
