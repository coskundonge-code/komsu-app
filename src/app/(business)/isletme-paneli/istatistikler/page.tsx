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
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">İstatistikler</h1>
          <p className="text-text-muted">İşletmenizin performansını derinlemesine analiz edin</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md">
          <Download size={18} />
          Rapor İndir
        </button>
      </div>

      {/* Date Range Selector */}
      <div className="bg-surface rounded-lg border border-border p-4 mb-6 flex gap-2 flex-wrap">
        {DATE_RANGES.map((range) => (
          <button
            key={range.value}
            onClick={() => setDateRange(range.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              dateRange === range.value
                ? 'bg-primary text-white'
                : 'bg-background text-text-primary hover:bg-[#e0e0e0]'
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
              className="bg-surface rounded-lg border border-border p-6 hover:shadow-md transition-all duration-200"
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
                <div className="flex items-center gap-1 text-primary font-medium text-sm">
                  <ArrowUpRight size={14} />
                  {metric.change}
                </div>
              </div>
              <p className="text-text-muted text-sm mb-1">{metric.title}</p>
              <p className="text-3xl font-bold text-text-primary">{metric.data}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Views Bar Chart */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <BarChart3 size={20} color="#00833e" />
              Aylık Görüntülemeler
            </h2>
          </div>
          <div className="space-y-3">
            {[
              { month: 'Ocak', views: 2850, max: 4000 },
              { month: 'Şubat', views: 3200, max: 4000 },
              { month: 'Mart', views: 3850, max: 4000 },
            ].map((item) => (
              <div key={item.month}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-text-primary">{item.month}</span>
                  <span className="text-xs font-bold text-primary">{item.views.toLocaleString()}</span>
                </div>
                <div className="w-full bg-[#e0e0e0] rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{ width: `${(item.views / item.max) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-xs text-text-muted">
                <strong>Ort. Aylık:</strong> 3,300 görüntüleme
              </p>
            </div>
          </div>
        </div>

        {/* Top Referral Sources */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <Users size={20} color="#00833e" />
              En İyi Trafik Kaynakları
            </h2>
          </div>
          <div className="space-y-3">
            {[
              { source: 'Google Arama', visitors: 1240, percent: 38 },
              { source: 'Doğrudan', visitors: 850, percent: 26 },
              { source: 'Instagram', visitors: 620, percent: 19 },
              { source: 'Facebook', visitors: 320, percent: 10 },
              { source: 'Diğer', visitors: 217, percent: 7 },
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-background rounded-lg border border-border hover:border-primary transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-text-primary">{item.source}</span>
                  <span className="text-xs font-bold text-primary">{item.percent}%</span>
                </div>
                <div className="w-full bg-[#e0e0e0] rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
                <p className="text-xs text-text-muted mt-1">{item.visitors} ziyaretçi</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peak Hours Heatmap & Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Peak Hours Heatmap */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
            <Calendar size={20} color="#00833e" />
            Yoğun Saatler Haritası
          </h2>
          <div className="space-y-2">
            <p className="text-xs text-text-muted mb-4">Ziyaretçilerin en aktif olduğu saatler</p>
            <div className="grid grid-cols-6 gap-1">
              {[
                { hour: '06:00', activity: 5 },
                { hour: '08:00', activity: 45 },
                { hour: '10:00', activity: 72 },
                { hour: '12:00', activity: 89 },
                { hour: '14:00', activity: 78 },
                { hour: '16:00', activity: 56 },
                { hour: '18:00', activity: 67 },
                { hour: '20:00', activity: 84 },
                { hour: '22:00', activity: 45 },
                { hour: '00:00', activity: 12 },
                { hour: '02:00', activity: 3 },
                { hour: '04:00', activity: 2 },
              ].map((item, idx) => {
                const intensity = item.activity / 100;
                const bgColor = intensity > 0.7 ? '#00833e' : intensity > 0.4 ? '#a7dbb8' : '#d1fae5';

                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className="w-full aspect-square rounded transition-all hover:shadow-md"
                      style={{ backgroundColor: bgColor }}
                      title={`${item.hour}: %${item.activity}`}
                    ></div>
                    <p className="text-xs text-text-muted mt-1">{item.hour}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary-light"></div>
                Düşük
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#a7dbb8]"></div>
                Orta
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary"></div>
                Yüksek
              </span>
            </div>
          </div>
        </div>

        {/* Period Comparison */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
            <TrendingUp size={20} color="#00833e" />
            Önceki Dönem Karşılaştırması
          </h2>
          <div className="space-y-4">
            {[
              { metric: 'Toplam Görüntüleme', current: 3850, previous: 3200, change: '+20.3%' },
              { metric: 'Ortalama Puan', current: 4.7, previous: 4.5, change: '+4.4%' },
              { metric: 'Yorum Sayısı', current: 32, previous: 24, change: '+33.3%' },
              { metric: 'Mesaj Sayısı', current: 156, previous: 134, change: '+16.4%' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-background rounded-lg border border-border">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-text-primary">{item.metric}</span>
                  <span className="text-xs bg-primary-light text-primary px-2 py-1 rounded font-semibold">
                    {item.change}
                  </span>
                </div>
                <div className="flex gap-6 text-xs">
                  <div>
                    <p className="text-text-muted">Bu Ay</p>
                    <p className="text-lg font-bold text-text-primary">{item.current}</p>
                  </div>
                  <div>
                    <p className="text-text-muted">Geçen Ay</p>
                    <p className="text-lg font-bold text-text-muted">{item.previous}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Rating Distribution */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
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
                    <span className="font-medium text-text-primary">
                      {item.rating} Yıldız
                    </span>
                    <span className="text-sm text-text-muted">({item.count} yorum)</span>
                  </div>
                  <span className="font-bold text-primary">{item.percent}%</span>
                </div>
                <div className="w-full bg-[#e0e0e0] rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Days */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
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
                className="flex items-center justify-between p-3 bg-background rounded-lg border border-border hover:border-primary transition-colors"
              >
                <div>
                  <p className="font-medium text-text-primary">{item.day}</p>
                  <p className="text-sm text-text-muted">
                    {item.views} görüntüleme • {item.reviews} yorum
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{item.views}</p>
                  <p className="text-xs text-text-muted">ziyaretçi</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Completion & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Profile Completion */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
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
                  <span className="text-sm font-medium text-text-primary">{item.section}</span>
                  <span className="text-xs font-bold text-primary">{item.percent}%</span>
                </div>
                <div className="w-full bg-[#e0e0e0] rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-primary-light rounded-lg border border-[#a7dbb8]">
            <p className="text-sm text-primary font-medium">
              Genel Tamamlanma: <span className="font-bold text-lg">92%</span>
            </p>
            <p className="text-xs text-primary mt-1">
              Sosyal medya bağlantılarınızı ekleyerek profil tamamlanmanızı artırabilirsiniz
            </p>
          </div>
        </div>

        {/* Content Performance */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
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
                className="p-3 bg-background rounded-lg border border-border"
              >
                <p className="font-medium text-text-primary text-sm mb-2">{item.content}</p>
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1 text-text-muted">
                    <Eye size={12} />
                    <span>{item.views} görüntüleme</span>
                  </div>
                  <div className="flex items-center gap-1 text-text-muted">
                    <Star size={12} />
                    <span>{item.likes} beğeni</span>
                  </div>
                  <div className="flex items-center gap-1 text-text-muted">
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
        <h2 className="text-lg font-bold text-primary mb-2">Rapor İndir & Dışa Aktar</h2>
        <p className="text-sm text-primary mb-6">
          İstatistik raporlarınızı çeşitli formatlarda indirin veya haftalık özeti e-posta ile alın
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-[#a7dbb8] rounded-lg bg-surface hover:border-primary hover:shadow-md transition-all text-left">
            <div className="flex items-center gap-3 mb-2">
              <FileText size={20} color="#00833e" />
              <p className="font-semibold text-text-primary">PDF Raporu</p>
            </div>
            <p className="text-sm text-text-muted">Detaylı istatistik raporu ve grafikleri</p>
          </button>
          <button className="p-4 border-2 border-[#a7dbb8] rounded-lg bg-surface hover:border-primary hover:shadow-md transition-all text-left">
            <div className="flex items-center gap-3 mb-2">
              <Table size={20} color="#00833e" />
              <p className="font-semibold text-text-primary">Excel Dosyası</p>
            </div>
            <p className="text-sm text-text-muted">Tüm verileri Excel&apos;de analiz et</p>
          </button>
          <button className="p-4 border-2 border-[#a7dbb8] rounded-lg bg-surface hover:border-primary hover:shadow-md transition-all text-left">
            <div className="flex items-center gap-3 mb-2">
              <Mail size={20} color="#00833e" />
              <p className="font-semibold text-text-primary">E-posta Raporu</p>
            </div>
            <p className="text-sm text-text-muted">Haftalık özeti düzenli olarak al</p>
          </button>
        </div>
      </div>
    </div>
  );
}
