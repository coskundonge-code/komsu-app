'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Eye,
  Star,
  MessageCircle,
} from 'lucide-react';

const DATE_RANGES = [
  { label: 'Bu Hafta', value: 'week' },
  { label: 'Bu Ay', value: 'month' },
  { label: 'Üç Ay', value: 'quarter' },
  { label: 'Bu Yıl', value: 'year' },
];

const CHART_TYPES = [
  {
    title: 'Profil Görüntülemeleri',
    data: '2,847',
    change: '+12.5%',
    icon: Eye,
    trend: 'up',
  },
  {
    title: 'Ortalama Puan',
    data: '4.8/5',
    change: '+0.2',
    icon: Star,
    trend: 'up',
  },
  {
    title: 'Toplam Yorum',
    data: '145',
    change: '+23',
    icon: MessageCircle,
    trend: 'up',
  },
];

export default function IstatistiklerPage() {
  const [dateRange, setDateRange] = useState('month');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">İstatistikler</h1>
          <p className="text-gray-600">İşletmenizin performansını analiz edin</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          <Download size={18} />
          Rapor İndir
        </button>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-lg border border-emerald-100 p-4 mb-6 flex gap-2 flex-wrap">
        {DATE_RANGES.map((range) => (
          <button
            key={range.value}
            onClick={() => setDateRange(range.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              dateRange === range.value
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {CHART_TYPES.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className="bg-white rounded-lg border border-emerald-100 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                  <Icon size={24} />
                </div>
                <div className="flex items-center gap-1 text-green-600 font-medium text-sm">
                  <TrendingUp size={16} />
                  {metric.change}
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{metric.title}</p>
              <p className="text-3xl font-bold text-gray-900">{metric.data}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Views Over Time */}
        <div className="bg-white rounded-lg border border-emerald-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 size={20} className="text-emerald-600" />
              Görüntülemeler (Zaman Serileri)
            </h2>
          </div>
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
              <p className="font-medium">Grafik Yükleniyor...</p>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-lg border border-emerald-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <PieChart size={20} className="text-emerald-600" />
              Puan Dağılımı
            </h2>
          </div>
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <PieChart size={48} className="mx-auto mb-2 opacity-50" />
              <p className="font-medium">Grafik Yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Reviews Breakdown */}
        <div className="bg-white rounded-lg border border-emerald-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Yorum Dağılımı
          </h2>
          <div className="space-y-4">
            {[
              { rating: 5, count: 89, percent: 61 },
              { rating: 4, count: 34, percent: 23 },
              { rating: 3, count: 15, percent: 10 },
              { rating: 2, count: 5, percent: 4 },
              { rating: 1, count: 2, percent: 2 },
            ].map((item) => (
              <div key={item.rating}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">
                      {item.rating} Yıldız
                    </span>
                    <span className="text-sm text-gray-500">({item.count})</span>
                  </div>
                  <span className="font-bold text-emerald-600">{item.percent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all"
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Days */}
        <div className="bg-white rounded-lg border border-emerald-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            En İyi Performans Gösteren Günler
          </h2>
          <div className="space-y-3">
            {[
              { day: 'Pazarlamı', views: 487, reviews: 12 },
              { day: 'Cumartesi', views: 456, reviews: 9 },
              { day: 'Cuma', views: 423, reviews: 8 },
              { day: 'Perşembe', views: 345, reviews: 6 },
              { day: 'Çarşamba', views: 298, reviews: 5 },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.day}</p>
                  <p className="text-sm text-gray-500">
                    {item.views} görüntüleme, {item.reviews} yorum
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600">{item.views}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Rapor İndir
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-emerald-300 rounded-lg hover:bg-white transition-colors text-left">
            <p className="font-medium text-gray-900 mb-1">PDF Raporu</p>
            <p className="text-sm text-gray-600">Detaylı istatistik raporu</p>
          </button>
          <button className="p-4 border border-emerald-300 rounded-lg hover:bg-white transition-colors text-left">
            <p className="font-medium text-gray-900 mb-1">Excel Dosyası</p>
            <p className="text-sm text-gray-600">Verileri analiz et</p>
          </button>
          <button className="p-4 border border-emerald-300 rounded-lg hover:bg-white transition-colors text-left">
            <p className="font-medium text-gray-900 mb-1">E-posta Raporu</p>
            <p className="text-sm text-gray-600">Haftalık özet</p>
          </button>
        </div>
      </div>
    </div>
  );
}
