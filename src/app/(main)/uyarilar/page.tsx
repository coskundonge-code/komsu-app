'use client';

import React from 'react';
import { Search, AlertCircle, AlertTriangle, Cloud, Zap, AlertOctagon } from 'lucide-react';
import Link from 'next/link';

interface Alert {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  icon: React.ReactNode;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Trafik Kazası - Ana Cadde',
    description: 'Ana caddede iki araç çarpışması meydana gelmiştir. Trafik sıkışıklığı beklenmektedir.',
    location: 'Ana Cadde, Dönüş Noktası',
    time: '15 dakika önce',
    severity: 'critical',
    icon: <AlertOctagon size={20} />,
  },
  {
    id: '2',
    title: 'Hava Durumu Uyarısı',
    description: 'Saat 14:00 itibariyle yağmur ve gök gürültüsü beklenmektedir. Lütfen tedbir alınız.',
    location: 'Tüm Bölge',
    time: '30 dakika önce',
    severity: 'high',
    icon: <Cloud size={20} />,
  },
  {
    id: '3',
    title: 'Elektrik Kesintisi Bildirimi',
    description: 'Bakım çalışmaları nedeniyle yarın 09:00-12:00 saatleri arasında elektrik kesintisi yapılacaktır.',
    location: 'Mahalle Merkezi',
    time: '2 saat önce',
    severity: 'medium',
    icon: <Zap size={20} />,
  },
  {
    id: '4',
    title: 'Şüpheli Aktivite Raporu',
    description: 'Yakında bilinmeyen kişilerin park alanında bulunması ihbar edilmiştir.',
    location: 'Merkez Parkı',
    time: '4 saat önce',
    severity: 'high',
    icon: <AlertTriangle size={20} />,
  },
  {
    id: '5',
    title: 'Yol Çalışması Haber',
    description: 'Sokak onarımları bu hafta başlayacaktır. Geçiş kısıtlamalarına hazır olunuz.',
    location: '2. Sokak',
    time: '1 gün önce',
    severity: 'low',
    icon: <AlertCircle size={20} />,
  },
];

const filterCategories = [
  { id: 'all', label: 'Tümü' },
  { id: 'security', label: 'Güvenlik' },
  { id: 'weather', label: 'Hava Durumu' },
  { id: 'traffic', label: 'Trafik' },
  { id: 'emergency', label: 'Afet' },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'border-l-4 border-red-600 bg-red-50';
    case 'high':
      return 'border-l-4 border-orange-500 bg-orange-50';
    case 'medium':
      return 'border-l-4 border-yellow-500 bg-yellow-50';
    case 'low':
      return 'border-l-4 border-green-500 bg-green-50';
    default:
      return 'border-l-4 border-gray-300 bg-gray-50';
  }
};

const getSeverityBadgeColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getSeverityLabel = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'Kritik';
    case 'high':
      return 'Yüksek';
    case 'medium':
      return 'Orta';
    case 'low':
      return 'Düşük';
    default:
      return 'Bilinmiyor';
  }
};

export default function AlertsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState('all');

  const filteredAlerts = mockAlerts.filter((alert) => {
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header Section */}
      <div className="bg-white border-b border-[#e0e0e0] sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8f8f8f]" />
            <input
              type="text"
              placeholder="Uyarılarda ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f0f2f5] border border-[#e0e0e0] rounded-full text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e]"
            />
          </div>

          {/* Title and Button */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-[#333]">Güvenlik Uyarıları</h1>
            <Link
              href="/uyarilar/new"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              Uyarı Paylaş
            </Link>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filterCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  activeFilter === category.id
                    ? 'bg-[#00833e] text-white'
                    : 'bg-white text-[#333] border border-[#e0e0e0] hover:border-[#00833e]'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#e0e0e0] p-12 text-center">
            <AlertCircle size={48} className="mx-auto text-[#8f8f8f] mb-3" />
            <p className="text-[#333] font-medium">Uyarı bulunamadı</p>
            <p className="text-[#8f8f8f] text-sm mt-1">Arama kriterlerinize eşleşen uyarı yok</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`${getSeverityColor(alert.severity)} rounded-lg p-4 border border-[#e0e0e0] hover:shadow-md transition-shadow cursor-pointer`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`flex-shrink-0 mt-1 ${
                    alert.severity === 'critical' ? 'text-red-600' :
                    alert.severity === 'high' ? 'text-orange-500' :
                    alert.severity === 'medium' ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>
                    {alert.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="font-bold text-[#333] text-sm">{alert.title}</h3>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${getSeverityBadgeColor(alert.severity)}`}>
                        {getSeverityLabel(alert.severity)}
                      </span>
                    </div>

                    <p className="text-sm text-[#404040] mb-2">{alert.description}</p>

                    <div className="flex items-center gap-4 text-xs text-[#8f8f8f]">
                      <span>{alert.location}</span>
                      <span>•</span>
                      <span>{alert.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
