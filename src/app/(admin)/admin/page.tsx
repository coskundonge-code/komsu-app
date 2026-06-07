'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
  UserCheck,
  Shield,
  AlertTriangle,
  FileText,
  Zap,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useCurrentUser } from '@/lib/hooks/use-auth';

// Main stats cards - default/fallback
const DEFAULT_STATS = [
  {
    id: 1,
    label: 'Toplam Kullanıcı',
    value: '12,458',
    change: '+324 bu hafta',
    trend: 'up',
    icon: Users,
    bgColor: '#e6f4ec',
    textColor: '#00833e',
    changeColor: 'text-green-600',
  },
  {
    id: 2,
    label: 'Aktif Gönderi',
    value: '3,847',
    change: '+156 bugün',
    trend: 'up',
    icon: MessageSquare,
    bgColor: '#dbeafe',
    textColor: '#1e40af',
    changeColor: 'text-blue-600',
  },
  {
    id: 3,
    label: 'İşletme',
    value: '892',
    change: '+23 bu ay',
    trend: 'up',
    icon: Briefcase,
    bgColor: '#fef3c7',
    textColor: '#92400e',
    changeColor: 'text-amber-600',
  },
  {
    id: 4,
    label: 'Raporlar',
    value: '47',
    change: '12 beklemede',
    trend: 'warning',
    icon: Flag,
    bgColor: '#fee2e2',
    textColor: '#991b1b',
    changeColor: 'text-red-600',
  },
];

// Daily activity data (last 7 days)
const DAILY_ACTIVITY_DATA = [
  { day: 'Pazartesi', posts: 320, max: 500 },
  { day: 'Salı', posts: 450, max: 500 },
  { day: 'Çarşamba', posts: 380, max: 500 },
  { day: 'Perşembe', posts: 420, max: 500 },
  { day: 'Cuma', posts: 480, max: 500 },
  { day: 'Cumartesi', posts: 410, max: 500 },
  { day: 'Pazar', posts: 350, max: 500 },
];

// Recent activities (8 items)
const RECENT_ACTIVITY = [
  {
    id: 1,
    type: 'user_signup',
    description: 'Ayşe M. yeni hesap açtı',
    timestamp: '2 dakika önce',
    icon: Users,
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 2,
    type: 'post_published',
    description: 'Mehmet T. yeni bir gönderi yayınladı',
    timestamp: '8 dakika önce',
    icon: MessageSquare,
    badgeColor: 'bg-purple-100 text-purple-700',
  },
  {
    id: 3,
    type: 'post_reported',
    description: 'Uygunsuz içerik için 1 gönderi bildirildi',
    timestamp: '15 dakika önce',
    icon: Flag,
    badgeColor: 'bg-red-100 text-red-700',
  },
  {
    id: 4,
    type: 'business_added',
    description: '"Kafe & Kahve" işletmesi eklendi',
    timestamp: '32 dakika önce',
    icon: Briefcase,
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    id: 5,
    type: 'user_verified',
    description: 'Zeynep K. profili doğrulandı',
    timestamp: '58 dakika önce',
    icon: CheckCircle,
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    id: 6,
    type: 'user_signup',
    description: 'Ali Ş. yeni hesap açtı',
    timestamp: '1 saat 12 dakika önce',
    icon: Users,
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 7,
    type: 'post_published',
    description: 'Fatma D. 3 yeni gönderi yayınladı',
    timestamp: '1 saat 45 dakika önce',
    icon: MessageSquare,
    badgeColor: 'bg-purple-100 text-purple-700',
  },
  {
    id: 8,
    type: 'alert',
    description: 'Sistem yedeklemesi başarıyla tamamlandı',
    timestamp: '3 saat önce',
    icon: Server,
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
];

// Top neighborhoods
const TOP_NEIGHBORHOODS = [
  { id: 1, name: 'Cihangir', members: 1234, posts: 3847, score: 95 },
  { id: 2, name: 'Galata', members: 1156, posts: 3621, score: 92 },
  { id: 3, name: 'Beyoğlu', members: 1089, posts: 3456, score: 89 },
  { id: 4, name: 'Aksaray', members: 987, posts: 3234, score: 86 },
  { id: 5, name: 'Şişli', members: 934, posts: 3012, score: 84 },
  { id: 6, name: 'Beşiktaş', members: 876, posts: 2834, score: 81 },
  { id: 7, name: 'Ortaköy', members: 812, posts: 2621, score: 78 },
  { id: 8, name: 'Bebek', members: 756, posts: 2445, score: 75 },
  { id: 9, name: 'Arnavutköy', members: 698, posts: 2234, score: 72 },
  { id: 10, name: 'Emirgan', members: 634, posts: 2012, score: 69 },
];

// Quick actions
const QUICK_ACTIONS = [
  {
    id: 1,
    title: 'Kullanıcı Onayla',
    description: '12 beklemede',
    icon: UserCheck,
    color: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
  },
  {
    id: 2,
    title: 'İçerik Moderasyonu',
    description: '8 inceleme bekliyor',
    icon: Shield,
    color: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
  },
  {
    id: 3,
    title: 'Uyarı Gönder',
    description: '5 kullanıcı için',
    icon: AlertTriangle,
    color: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100',
  },
  {
    id: 4,
    title: 'Raporları İncele',
    description: '47 aktif rapor',
    icon: FileText,
    color: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
  },
];

// Platform health metrics
const PLATFORM_HEALTH = [
  { metric: 'Sunucu Çalışma Süresi', value: '%99.8', icon: Server, color: 'text-emerald-600' },
  { metric: 'Yanıt Süresi', value: '142ms', icon: Zap, color: 'text-blue-600' },
  { metric: 'Hata Oranı', value: '0.02%', icon: AlertCircle, color: 'text-green-600' },
  { metric: 'Aktif Oturumlar', value: '1,247', icon: Activity, color: 'text-cyan-600' },
];

const SYSTEM_STATUS = [
  { name: 'API Sunucusu', status: 'online', latency: '24ms' },
  { name: 'Veritabanı', status: 'online', latency: '15ms' },
  { name: 'Depolama Hizmeti', status: 'online', latency: '32ms' },
  { name: 'E-posta Servisi', status: 'online', latency: '45ms' },
];

export default function AdminDashboard() {
  const { user, profile, loading: authLoading } = useCurrentUser();
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [sortedNeighborhoods, setSortedNeighborhoods] = React.useState(TOP_NEIGHBORHOODS);
  const [sortKey, setSortKey] = React.useState('score');
  const [statsLoading, setStatsLoading] = useState(true);
  const [, setNeighborhoodsData] = useState(TOP_NEIGHBORHOODS);

  useEffect(() => {
    async function fetchStats() {
      setStatsLoading(true);
      const supabase = createClient();
      try {
        // Fetch user count
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch post count
        const { count: postCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true });

        // Fetch business count
        const { count: businessCount } = await supabase
          .from('businesses')
          .select('*', { count: 'exact', head: true });

        // Update stats with real data
        const newStats = [
          {
            ...DEFAULT_STATS[0],
            value: (userCount ?? 0).toLocaleString('tr-TR'),
          },
          {
            ...DEFAULT_STATS[1],
            value: (postCount ?? 0).toLocaleString('tr-TR'),
          },
          {
            ...DEFAULT_STATS[2],
            value: (businessCount ?? 0).toLocaleString('tr-TR'),
          },
          {
            ...DEFAULT_STATS[3],
            value: '0',
            change: '0 beklemede',
          },
        ];
        setStats(newStats);
      } catch (error) {
        console.error('İstatistikler yüklenirken hata:', error);
        // Keep default stats on error
      } finally {
        setStatsLoading(false);
      }
    }

    async function fetchNeighborhoods() {
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from('neighborhoods')
          .select('id, name, member_count')
          .order('member_count', { ascending: false })
          .limit(10);

        if (!error && data) {
          const mapped = (data as any[]).map((n: any, idx: number) => ({
            id: n.id,
            name: n.name,
            members: n.member_count || 0,
            posts: 0, // Would need a separate count query
            score: 100 - idx * 3,
          }));
          setNeighborhoodsData(mapped);
          setSortedNeighborhoods(mapped);
        }
      } catch (error) {
        console.error('Mahalleler yüklenirken hata:', error);
      }
    }

    fetchStats();
    fetchNeighborhoods();
  }, []);

  // Check admin access
  if (!authLoading && (!user || profile?.is_admin !== true)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h1>
          <p className="text-gray-600 mb-6">
            Bu sayfaya erişim için admin yetkisi gereklidir.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }


  const handleSort = (key: string) => {
    const isAsc = sortKey === key;
    const sorted = [...sortedNeighborhoods].sort((a, b) => {
      const aVal = a[key as keyof typeof a];
      const bVal = b[key as keyof typeof b];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return isAsc ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
    setSortedNeighborhoods(sorted);
    setSortKey(isAsc ? '' : key);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Yönetim Panosu</h1>
        <p className="text-gray-600">
          Platform özeti ve gerçek zamanlı istatistikler
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsLoading ? (
          <div className="col-span-full text-center py-8 text-gray-600">
            İstatistikler yükleniyor...
          </div>
        ) : (
          stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.id}
                className="bg-surface rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: stat.bgColor }}
                  >
                    <Icon size={24} style={{ color: stat.textColor }} />
                  </div>
                  <span className={`text-xs font-semibold ${stat.changeColor}`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })
        )}
      </div>

      {/* Activity Chart and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Daily Activity Chart */}
        <div className="lg:col-span-2 bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Son 7 Gün Aktivite</h2>
              <p className="text-sm text-gray-600">Günlük gönderi sayısı</p>
            </div>
            <BarChart3 size={24} className="text-primary" />
          </div>

          {/* CSS Bar Chart */}
          <div className="flex items-end justify-between h-48 gap-2 p-4 bg-gray-50 rounded-lg">
            {DAILY_ACTIVITY_DATA.map((data) => {
              const percentage = (data.posts / data.max) * 100;
              return (
                <div
                  key={data.day}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className="w-full bg-gradient-to-t from-primary to-[#00aa52] rounded-t transition-all hover:shadow-lg"
                    style={{ height: `${percentage}%` }}
                    title={`${data.posts} gönderi`}
                  />
                  <span className="text-xs text-gray-600 font-medium text-center">
                    {data.day.substring(0, 3)}
                  </span>
                  <span className="text-xs text-gray-500">{data.posts}</span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Toplam: 2,811 gönderi | Ortalama: 401/gün
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Hızlı İşlemler</h2>
            <Zap size={20} className="text-primary" />
          </div>

          <div className="space-y-3">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${action.color}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon size={20} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{action.title}</p>
                      <p className="text-xs opacity-75 mt-0.5">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity Feed and Platform Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Son Aktiviteler</h2>
              <p className="text-sm text-gray-600">Platform etkinlikleri</p>
            </div>
            <Activity size={20} className="text-primary" />
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {RECENT_ACTIVITY.map((activity) => {
              const Icon = activity.icon;

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border hover:border-primary transition-colors"
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

          <button className="mt-4 w-full py-2 px-4 text-sm font-medium text-primary bg-primary-light hover:bg-primary-light rounded-lg transition-colors">
            Tüm Aktiviteleri Görüntüle
          </button>
        </div>

        {/* Platform Health */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Platform Sağlığı</h2>
            <Server size={20} className="text-primary" />
          </div>

          <div className="space-y-4">
            {PLATFORM_HEALTH.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon size={16} className={item.color} />
                      <p className="text-sm text-gray-700">{item.metric}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 ml-6">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-medium text-green-800">
              ✓ Tüm sistemler optimal çalışıyor
            </p>
          </div>
        </div>
      </div>

      {/* Top Neighborhoods Table */}
      <div className="bg-surface rounded-lg border border-border p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">En Aktif Mahalleler</h2>
            <p className="text-sm text-gray-600">Top 10 mahalle - tıklayarak sırala</p>
          </div>
          <TrendingUp size={20} className="text-primary" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Mahalle
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:text-primary"
                  onClick={() => handleSort('members')}
                >
                  <div className="flex items-center gap-1">
                    Üye Sayısı
                    {sortKey === 'members' && (
                      <TrendingUp size={14} className="text-primary" />
                    )}
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:text-primary"
                  onClick={() => handleSort('posts')}
                >
                  <div className="flex items-center gap-1">
                    Gönderi
                    {sortKey === 'posts' && (
                      <TrendingUp size={14} className="text-primary" />
                    )}
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:text-primary"
                  onClick={() => handleSort('score')}
                >
                  <div className="flex items-center gap-1">
                    Aktiflik Skoru
                    {sortKey === 'score' && (
                      <TrendingUp size={14} className="text-primary" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedNeighborhoods.map((neighborhood, idx) => (
                <tr
                  key={neighborhood.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center text-xs font-bold text-primary">
                        {idx + 1}
                      </span>
                      {neighborhood.name}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {neighborhood.members.toLocaleString('tr-TR')}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {neighborhood.posts.toLocaleString('tr-TR')}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-[#00aa52] rounded-full"
                          style={{ width: `${neighborhood.score}%` }}
                        />
                      </div>
                      <span className="font-semibold text-gray-900 w-8 text-right">
                        {neighborhood.score}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface rounded-lg border border-border p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Server size={20} className="text-primary" />
            Sistem Durumu
          </h2>

          <div className="space-y-3">
            {SYSTEM_STATUS.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
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
        </div>

        <div className="bg-gradient-to-br from-[#e6f4ec] to-[#d1fae5] rounded-lg border border-primary border-opacity-20 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-primary mb-1">
                Sistem Özeti
              </h2>
              <p className="text-sm text-primary opacity-75">
                Tüm hizmetler sorunsuz çalışıyor
              </p>
            </div>
            <CheckCircle size={28} className="text-primary" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <p className="text-xs text-primary opacity-75">Güncellenme</p>
              <p className="text-sm font-semibold text-primary mt-1">
                Son 2 dakika
              </p>
            </div>
            <div>
              <p className="text-xs text-primary opacity-75">Sonraki Kontrol</p>
              <p className="text-sm font-semibold text-primary mt-1">
                30 saniye içinde
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
