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
  Users,
  Award,
  FileText,
  Table,
  Mail,
  ArrowUpRight,
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
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-[#333] mb-2">İstatistikler</h1>
          <p className="text-[#8f8f8f]">İşletmenizin performansını derinlemesine analiz edin</p>
        </div>
        <button className="flex items-center gap-2 bg-[#00833e] hover:bg-[#006b32] text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md">
          <Download size={18} />
          Rapor İndir
        </button>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 mb-6 flex gap-2 flex-wrap">
        {DATE_RANGES.map((range) => (
          <button
            key={range.value}
            onClick={() => setDateRange(range.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              dateRange === range.value
                ? 'bg-[#00833e] text-white'
                : 'bg-[#f0f2f5] text-[#333] hover:bg-[#e0e0e0]'
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
          const bgColors = {
            'Profil Görüntülemeleri': '#e6f4ec',
            'Ortalama Puan': '#fef3c7',
            'Toplam Yorum': '#dbeafe',
          };
          const iconColors = {
            'Profil Görüntülemeleri': '#00833e',
            'Ortalama Puan': '#f59e0b',
            'Toplam Yorum': '#3b82f6',
          };

          return (
            <div
              key={metric.title}
              className="bg-white rounded-lg border border-[#e0e0e0] p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{
                    backgroundColor: bgColors[metric.title as keyof typeof bgColors],
                  }}
                >
                  <Icon
                    size={24}
                    color={iconColors[metric.title as keyof typeof iconColors]}
                  />
                </div>
                <div className="flex items-center gap-1 text-[#00833e] font-medium text-sm">
                  <ArrowUpRight size={14} />
                  {metric.change}
                </div>
              </div>
              <p className="text-[#8f8f8f] text-sm mb-1">{metric.title}</p>
              <p className="text-3xl font-bold text-[#333]">{metric.data}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Views Over Time */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#333] flex items-center gap-2">
              <BarChart3 size={20} color="#00833e" />
              Görüntülemeler (Haftalık)
            </h2>
          </div>
          <div className="space-y-3">
            {[
              { day: 'Pazartesi', views: 320, max: 500 },
              { day: 'Salı', views: 285, max: 500 },
              { day: 'Çarşamba', views: 350, max: 500 },
              { day: 'Perşembe', views: 380, max: 500 },
              { day: 'Cuma', views: 420, max: 500 },
              { day: 'Cumartesi', views: 380, max: 500 },
              { day: 'Pazar', views: 290, max: 500 },
            ].map((item) => (
              <div key={item.day}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-[#333]">{item.day}</span>
                  <span className="text-xs font-bold text-[#00833e]">{item.views}</span>
                </div>
                <div className="w-full bg-[#e0e0e0] rounded-full h-2">
                  <div
                    className="bg-[#00833e] h-2 rounded-full transition-all"
                    style={{ width: `${(item.views / item.max) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visitor Demographics Placeholder */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#333] flex items-center gap-2">
              <Users size={20} color="#00833e" />
              Ziyaretçi Demografisi
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { demographic: 'Erkek (18-24)', percent: 28 },
              { demographic: 'Kadın (25-34)', percent: 32 },
              { demographic: 'Erkek (35-44)', percent: 18 },
              { demographic: 'Kadın (45+)', percent: 14 },
              { demographic: 'Diğer', percent: 8 },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-[#333]">{item.demographic}</span>
                  <span className="text-xs font-bold text-[#00833e]">{item.percent}%</span>
                </div>
                <div className="w-full bg-[#e0e0e0] rounded-full h-2">
                  <div
                    className="bg-[#00833e] h-2 rounded-full transition-all"
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Rating Distribution */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6">
          <h2 className="text-lg font-bold text-[#333] mb-6 flex items-center gap-2">
            <Star size={20} color="#00833e" />
            Değerlendirme Dağılımı
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
                    <span className="font-medium text-[#333]">
                      {item.rating} Yıldız
                    </span>
                    <span className="text-sm text-[#8f8f8f]">({item.count} yorum)</span>
                  </div>
                  <span className="font-bold text-[#00833e]">{item.percent}%</span>
                </div>
                <div className="w-full bg-[#e0e0e0] rounded-full h-2">
                  <div
                    className="bg-[#00833e] h-2 rounded-full transition-all"
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Days */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6">
          <h2 className="text-lg font-bold text-[#333] mb-6 flex items-center gap-2">
            <Award size={20} color="#00833e" />
            En İyi Performans Gösteren Günler
          </h2>
          <div className="space-y-3">
            {[
              { day: 'Pazar', views: 487, reviews: 12 },
              { day: 'Cumartesi', views: 456, reviews: 9 },
              { day: 'Cuma', views: 423, reviews: 8 },
              { day: 'Perşembe', views: 345, reviews: 6 },
              { day: 'Çarşamba', views: 298, reviews: 5 },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0] hover:border-[#00833e] transition-colors"
              >
                <div>
                  <p className="font-medium text-[#333]">{item.day}</p>
                  <p className="text-sm text-[#8f8f8f]">
                    {item.views} görüntüleme • {item.reviews} yorum
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#00833e]">{item.views}</p>
                  <p className="text-xs text-[#8f8f8f]">ziyaretçi</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Completion & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Profile Completion */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6">
          <h2 className="text-lg font-bold text-[#333] mb-6 flex items-center gap-2">
            <Award size={20} color="#00833e" />
            Profil Tamamlanma Durumu
          </h2>
          <div className="space-y-5">
            {[
              { section: 'Temel Bilgiler', percent: 100 },
              { section: 'Hizmetler & Ürünler', percent: 95 },
              { section: 'Fotoğraflar & Galerisi', percent: 85 },
              { section: 'İletişim Bilgileri', percent: 100 },
              { section: 'Çalışma Saatleri', percent: 100 },
              { section: 'Sosyal Medya Bağlantıları', percent: 70 },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-[#333]">{item.section}</span>
                  <span className="text-xs font-bold text-[#00833e]">{item.percent}%</span>
                </div>
                <div className="w-full bg-[#e0e0e0] rounded-full h-2">
                  <div
                    className="bg-[#00833e] h-2 rounded-full transition-all"
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-[#e6f4ec] rounded-lg border border-[#a7dbb8]">
            <p className="text-sm text-[#004d24] font-medium">
              Genel Tamamlanma: <span className="font-bold text-lg">92%</span>
            </p>
            <p className="text-xs text-[#004d24] mt-1">
              Sosyal medya bağlantılarınızı ekleyerek profil tamamlanmanızı artırabilirsiniz
            </p>
          </div>
        </div>

        {/* Content Performance */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6">
          <h2 className="text-lg font-bold text-[#333] mb-6 flex items-center gap-2">
            <TrendingUp size={20} color="#00833e" />
            En İyi Performans Gösteren İçerikler
          </h2>
          <div className="space-y-3">
            {[
              { content: 'Kahve Çeşitleri Rehberi', views: 523, likes: 89, comments: 23 },
              { content: 'Hafta Sonu Etkinliği Duyurusu', views: 456, likes: 76, comments: 18 },
              { content: 'Yeni Tatlı Çeşitleri', views: 389, likes: 64, comments: 14 },
              { content: 'Müşteri Selamlaması', views: 234, likes: 42, comments: 8 },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0]"
              >
                <p className="font-medium text-[#333] text-sm mb-2">{item.content}</p>
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1 text-[#8f8f8f]">
                    <Eye size={12} />
                    <span>{item.views} görüntüleme</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#8f8f8f]">
                    <Star size={12} />
                    <span>{item.likes} beğeni</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#8f8f8f]">
                    <MessageCircle size={12} />
                    <span>{item.comments} yorum</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-gradient-to-br from-[#e6f4ec] to-[#d1fae5] rounded-lg border border-[#a7dbb8] p-8">
        <h2 className="text-lg font-bold text-[#004d24] mb-2">Rapor İndir & Dışa Aktar</h2>
        <p className="text-sm text-[#004d24] mb-6">
          İstatistik raporlarınızı çeşitli formatlarda indirin veya haftalık özeti e-posta ile alın
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-[#a7dbb8] rounded-lg bg-white hover:border-[#00833e] hover:shadow-md transition-all text-left">
            <div className="flex items-center gap-3 mb-2">
              <FileText size={20} color="#00833e" />
              <p className="font-semibold text-[#333]">PDF Raporu</p>
            </div>
            <p className="text-sm text-[#8f8f8f]">Detaylı istatistik raporu ve grafikleri</p>
          </button>
          <button className="p-4 border-2 border-[#a7dbb8] rounded-lg bg-white hover:border-[#00833e] hover:shadow-md transition-all text-left">
            <div className="flex items-center gap-3 mb-2">
              <Table size={20} color="#00833e" />
              <p className="font-semibold text-[#333]">Excel Dosyası</p>
            </div>
            <p className="text-sm text-[#8f8f8f]">Tüm verileri Excel'de analiz et</p>
          </button>
          <button className="p-4 border-2 border-[#a7dbb8] rounded-lg bg-white hover:border-[#00833e] hover:shadow-md transition-all text-left">
            <div className="flex items-center gap-3 mb-2">
              <Mail size={20} color="#00833e" />
              <p className="font-semibold text-[#333]">E-posta Raporu</p>
            </div>
            <p className="text-sm text-[#8f8f8f]">Haftalık özeti düzenli olarak al</p>
          </button>
        </div>
      </div>
    </div>
  );
}
