'use client';

import React from 'react';
import {
  Users,
  MessageSquare,
  Flag,
  Briefcase,
  TrendingUp,
  Activity,
  Server,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
} from 'lucide-react';

const STATS = [
  {
    id: 1,
    label: 'Toplam Kullanıcı',
    value: '12,847',
    change: '+5.2%',
    trend: 'up',
    icon: Users,
    bgColor: '#e6f4ec',
    textColor: '#00833e',
    changeColor: 'text-green-600',
  },
  {
    id: 2,
    label: 'Aktif Kullanıcı',
    value: '9,234',
    change: '+8.1%',
    trend: 'up',
    icon: Activity,
    bgColor: '#dbeafe',
    textColor: '#1e40af',
    changeColor: 'text-blue-600',
  },
  {
    id: 3,
    label: 'Yayınlanmış Paylaşım',
    value: '48,293',
    change: '+12.3%',
    trend: 'up',
    icon: MessageSquare,
    bgColor: '#fce7f3',
    textColor: '#be185d',
    changeColor: 'text-pink-600',
  },
  {
    id: 4,
    label: 'İçerik Raporları',
    value: '234',
    change: '-3.1%',
    trend: 'down',
    icon: Flag,
    bgColor: '#fee2e2',
    textColor: '#991b1b',
    changeColor: 'text-red-600',
  },
  {
    id: 5,
    label: 'Kayıtlı İşletme',
    value: '1,234',
    change: '+8.7%',
    trend: 'up',
    icon: Briefcase,
    bgColor: '#fef3c7',
    textColor: '#92400e',
    changeColor: 'text-amber-600',
  },
  {
    id: 6,
    label: 'Sistem Sağlığı',
    value: '99.8%',
    change: 'Normal',
    trend: 'stable',
    icon: Server,
    bgColor: '#d1fae5',
    textColor: '#065f46',
    changeColor: 'text-emerald-600',
  },
];

const GROWTH_CHART_DATA = [
  { week: 'Hf1', users: 1200, posts: 2400, reviews: 800 },
  { week: 'Hf2', users: 1900, posts: 2210, reviews: 1290 },
  { week: 'Hf3', users: 2000, posts: 2290, reviews: 1000 },
  { week: 'Hf4', users: 2780, posts: 2000, reviews: 1890 },
  { week: 'Hf5', users: 1890, posts: 2181, reviews: 1300 },
  { week: 'Hf6', users: 2390, posts: 2500, reviews: 1800 },
  { week: 'Hf7', users: 3490, posts: 2100, reviews: 2100 },
];

const RECENT_ACTIVITY = [
  {
    id: 1,
    type: 'user_signup',
    description: 'Ahmet K. yeni hesap açtı',
    timestamp: '5 dakika önce',
    icon: Users,
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 2,
    type: 'post_reported',
    description: 'Bir paylaşım uygunsuz içerik olarak bildirildi',
    timestamp: '12 dakika önce',
    icon: Flag,
    badgeColor: 'bg-red-100 text-red-700',
  },
  {
    id: 3,
    type: 'business_added',
    description: '"Yeni Kahvehane" işletmesi eklendi',
    timestamp: '28 dakika önce',
    icon: Briefcase,
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    id: 4,
    type: 'post_published',
    description: 'Fatma D. yeni bir paylaşım yaptı',
    timestamp: '45 dakika önce',
    icon: MessageSquare,
    badgeColor: 'bg-purple-100 text-purple-700',
  },
  {
    id: 5,
    type: 'user_verified',
    description: 'Mustafa T. profilini doğruladı',
    timestamp: '1 saat önce',
    icon: CheckCircle,
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    id: 6,
    type: 'alert',
    description: 'Sistem yedeklemesi başarıyla tamamlandı',
    timestamp: '2 saat önce',
    icon: Server,
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
];

const SYSTEM_STATUS = [
  { name: 'API Sunucusu', status: 'online', latency: '24ms' },
  { name: 'Veritabanı', status: 'online', latency: '15ms' },
  { name: 'Depolama Hizmeti', status: 'online', latency: '32ms' },
  { name: 'E-posta Servisi', status: 'online', latency: '45ms' },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Yönetim Panosu</h1>
        <p className="text-gray-600">
          Hoş geldiniz! İşte bugünün özet istatistikleri.
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          const isNegative = stat.trend === 'down';

          return (
            <div
              key={stat.id}
              className="bg-white rounded-lg border border-[#e0e0e0] p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <Icon size={24} style={{ color: stat.textColor }} />
                </div>
                <span
                  className={`text-sm font-semibold ${stat.changeColor}`}
                >
                  {isNegative ? stat.change : stat.change}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-2">
                {stat.trend === 'up'
                  ? 'Son 30 günde artış'
                  : stat.trend === 'down'
                  ? 'Son 30 günde azalış'
                  : 'Sistem durumu'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Growth Chart */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Haftalık Büyüme</h2>
              <p className="text-sm text-gray-600">Son 7 haftanın eğilimi</p>
            </div>
            <BarChart3 size={24} className="text-[#00833e]" />
          </div>

          {/* Mini Bar Chart */}
          <div className="space-y-4">
            {GROWTH_CHART_DATA.map((data) => (
              <div key={data.week}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {data.week}
                  </span>
                  <span className="text-xs text-gray-500">
                    {data.users + data.posts + data.reviews} toplam
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#00833e] h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        ((data.users + data.posts + data.reviews) / 9000) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-6">
            Güncellenme: Son 1 saat
          </p>
        </div>

        {/* Content Distribution */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                İçerik Dağılımı
              </h2>
              <p className="text-sm text-gray-600">Kategori başına oranlar</p>
            </div>
            <PieChartIcon size={24} className="text-[#00833e]" />
          </div>

          {/* Distribution Stats */}
          <div className="space-y-4">
            {[
              { label: 'Paylaşımlar', percentage: 45, color: 'bg-[#00833e]' },
              { label: 'Yorumlar', percentage: 28, color: 'bg-blue-500' },
              { label: 'Raporlar', percentage: 15, color: 'bg-red-500' },
              { label: 'Diğer', percentage: 12, color: 'bg-gray-400' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {item.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-6">
            Toplam 72,520 içerik
          </p>
        </div>
      </div>

      {/* System Status and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="lg:col-span-1 bg-white rounded-lg border border-[#e0e0e0] p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Server size={20} className="text-[#00833e]" />
            Sistem Durumu
          </h2>

          <div className="space-y-3">
            {SYSTEM_STATUS.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-3 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0]"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {service.name}
                    </p>
                    <p className="text-xs text-gray-600">{service.latency}</p>
                  </div>
                </div>
                <CheckCircle size={16} className="text-green-600" />
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-medium text-green-800">
              ✓ Tüm sistemler normal çalışıyor
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-[#e0e0e0] p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity size={20} className="text-[#00833e]" />
            Son Aktiviteler
          </h2>

          <div className="space-y-3">
            {RECENT_ACTIVITY.map((activity) => {
              const Icon = activity.icon;

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0] hover:border-[#00833e] transition-colors"
                >
                  <div
                    className={`p-2 rounded-lg ${activity.badgeColor} flex-shrink-0`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="mt-4 w-full py-2 px-4 text-sm font-medium text-[#00833e] bg-[#e6f4ec] hover:bg-[#d1fae5] rounded-lg transition-colors">
            Tüm Aktiviteleri Görüntüle
          </button>
        </div>
      </div>
    </div>
  );
}
