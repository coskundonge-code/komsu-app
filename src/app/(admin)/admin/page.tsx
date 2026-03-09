'use client';

import React from 'react';
import { Users, MessageSquare, Flag, Briefcase, TrendingUp, Activity } from 'lucide-react';

const STATS = [
  {
    id: 1,
    label: 'Toplam Kullanıcı',
    value: '12,847',
    change: '+5.2%',
    icon: Users,
    color: 'green',
  },
  {
    id: 2,
    label: 'Yayınlanmış Paylaşım',
    value: '48,293',
    change: '+12.3%',
    icon: MessageSquare,
    color: 'blue',
  },
  {
    id: 3,
    label: 'İçerik Raporları',
    value: '234',
    change: '-3.1%',
    icon: Flag,
    color: 'red',
  },
  {
    id: 4,
    label: 'Kayıtlı İşletme',
    value: '1,234',
    change: '+8.7%',
    icon: Briefcase,
    color: 'green',
  },
];

const RECENT_ACTIVITY = [
  {
    id: 1,
    type: 'user_signup',
    description: 'Ahmet K. yeni hesap açtı',
    timestamp: '5 dakika önce',
    icon: Users,
  },
  {
    id: 2,
    type: 'post_reported',
    description: 'Bir paylaşım uygunsuz içerik olarak bildirildi',
    timestamp: '12 dakika önce',
    icon: Flag,
  },
  {
    id: 3,
    type: 'business_added',
    description: '"Yeni Kahvehane" işletmesi eklendi',
    timestamp: '28 dakika önce',
    icon: Briefcase,
  },
  {
    id: 4,
    type: 'post_published',
    description: 'Fatma D. yeni bir paylaşım yaptı',
    timestamp: '45 dakika önce',
    icon: MessageSquare,
  },
  {
    id: 5,
    type: 'user_verified',
    description: 'Mustafa T. profilini doğruladı',
    timestamp: '1 saat önce',
    icon: Users,
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            emerald: 'bg-[#d1fae5] text-[#00833e]',
            blue: 'bg-blue-100 text-blue-600',
            red: 'bg-red-100 text-red-600',
            green: 'bg-green-100 text-green-600',
          };

          return (
            <div
              key={stat.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${
                    colorClasses[stat.color as keyof typeof colorClasses]
                  }`}
                >
                  <Icon size={24} />
                </div>
                <span className="text-sm font-medium text-green-600">
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Chart Placeholder 1 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Kullanıcı Büyümesi
          </h2>
          <div className="bg-gray-100 rounded h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
              <p className="font-medium">Grafik Yükleniyor...</p>
            </div>
          </div>
        </div>

        {/* Chart Placeholder 2 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            İçerik Dağılımı
          </h2>
          <div className="bg-gray-100 rounded h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Activity size={48} className="mx-auto mb-2 opacity-50" />
              <p className="font-medium">Grafik Yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Son Aktiviteler</h2>
        <div className="space-y-4">
          {RECENT_ACTIVITY.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0"
              >
                <div className="p-2 bg-[#e6f4ec] rounded-lg text-[#00833e]">
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium">
                    {activity.description}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
