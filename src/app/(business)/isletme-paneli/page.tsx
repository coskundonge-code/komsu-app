'use client';

import React from 'react';
import Link from 'next/link';
import {
  Eye,
  Star,
  Heart,
  MessageCircle,
  TrendingUp,
  ChevronRight,
  BarChart3,
  Calendar,
  ArrowUpRight,
} from 'lucide-react';

const STATS = [
  {
    id: 1,
    label: 'Görüntülemeler',
    value: '2,847',
    change: '+12.5%',
    icon: Eye,
    bgColor: '#e6f4ec',
    iconColor: '#00833e',
  },
  {
    id: 2,
    label: 'Değerlendirmeler',
    value: '4.8 ⭐',
    change: '+0.2',
    icon: Star,
    bgColor: '#fef3c7',
    iconColor: '#f59e0b',
  },
  {
    id: 3,
    label: 'Mesajlar',
    value: '45',
    change: '+12',
    icon: MessageCircle,
    bgColor: '#dbeafe',
    iconColor: '#3b82f6',
  },
  {
    id: 4,
    label: 'Favorilere Eklenenler',
    value: '189',
    change: '+28',
    icon: Heart,
    bgColor: '#fce7f3',
    iconColor: '#ec4899',
  },
];

const RECENT_REVIEWS = [
  {
    id: 1,
    author: 'Ahmet K.',
    rating: 5,
    date: '2026-03-08',
    text: 'Harika bir kahvehane! Personeli çok hoş, kahveler lezzetli. Kesinlikle geleceğim.',
  },
  {
    id: 2,
    author: 'Fatma D.',
    rating: 4,
    date: '2026-03-06',
    text: 'Ortam çok güzel, çay seçenekleri iyi. Biraz daha ucuz olabilir ama tavsiye ederim.',
  },
  {
    id: 3,
    author: 'Mustafa T.',
    rating: 5,
    date: '2026-03-05',
    text: 'En iyi Türk kahvesi bu mahallede! Fincan sunumundan ev sahibi tutumuna her şey mükemmel.',
  },
];

const UPCOMING_EVENTS = [
  {
    id: 1,
    title: 'Cuma Akşamı Müzik Gecesi',
    date: '2026-03-15',
    time: '19:00',
    capacity: 50,
    registered: 34,
  },
  {
    id: 2,
    title: 'Sabah Kahvesi Anılarım',
    date: '2026-03-17',
    time: '08:00',
    capacity: 25,
    registered: 18,
  },
  {
    id: 3,
    title: 'Pazar Brunch',
    date: '2026-03-19',
    time: '10:00',
    capacity: 60,
    registered: 42,
  },
];

export default function IsletmePaneliPage() {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#333] mb-2">Hoşgeldiniz, Kahvehane Keyif</h1>
        <p className="text-[#8f8f8f] text-lg">
          İşletmenizin günlük performansını ve müşteri etkileşimini takip edin
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {STATS.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.id}
              className="bg-white rounded-lg border border-[#e0e0e0] p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <Icon size={24} color={stat.iconColor} />
                </div>
                <div className="flex items-center gap-1 text-[#00833e] font-medium text-sm">
                  <ArrowUpRight size={14} />
                  {stat.change}
                </div>
              </div>
              <p className="text-[#8f8f8f] text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-[#333]">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Reviews Section - 2 cols */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-[#e0e0e0] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#333]">Son Yorumlar</h2>
                <p className="text-sm text-[#8f8f8f] mt-1">En yakın 3 yorum</p>
              </div>
              <Link
                href="#"
                className="text-[#00833e] hover:text-[#006b32] font-medium text-sm flex items-center gap-1"
              >
                Tümünü Gör
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="space-y-4">
              {RECENT_REVIEWS.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-[#e0e0e0] pb-4 last:border-b-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-[#333]">{review.author}</p>
                      <p className="text-xs text-[#8f8f8f]">
                        {new Date(review.date).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < review.rating
                              ? 'fill-[#f59e0b] text-[#f59e0b]'
                              : 'text-[#e0e0e0]'
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[#333] text-sm mb-3">{review.text}</p>

                  {/* Quick Actions */}
                  <div className="flex gap-3">
                    <button className="text-xs text-[#00833e] hover:text-[#006b32] font-medium hover:underline">
                      Cevap Ver
                    </button>
                    <button className="text-xs text-[#8f8f8f] hover:text-[#333] font-medium hover:underline">
                      Raporla
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-[#00833e] to-[#006b32] rounded-lg text-white p-6 shadow-md">
            <h3 className="text-lg font-bold mb-4">Hızlı İşlemler</h3>
            <div className="space-y-2">
              <Link
                href="/isletme-paneli/istatistikler"
                className="block w-full bg-[#006b32] hover:bg-[#005a2b] font-medium py-3 px-4 rounded-lg transition-colors text-center text-sm"
              >
                İstatistikleri Görüntüle
              </Link>
              <Link
                href="/isletme-paneli/reklamlar"
                className="block w-full bg-[#006b32] hover:bg-[#005a2b] font-medium py-3 px-4 rounded-lg transition-colors text-center text-sm"
              >
                Reklam Yönet
              </Link>
              <button className="w-full bg-[#006b32] hover:bg-[#005a2b] font-medium py-3 px-4 rounded-lg transition-colors text-sm">
                Profili Düzenle
              </button>
              <button className="w-full bg-[#006b32] hover:bg-[#005a2b] font-medium py-3 px-4 rounded-lg transition-colors text-sm">
                Mesajlar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart & Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Performance Chart */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6">
          <h2 className="text-xl font-bold text-[#333] mb-6 flex items-center gap-2">
            <BarChart3 size={20} color="#00833e" />
            Performans Grafik
          </h2>

          {/* Mock Bar Chart */}
          <div className="space-y-4">
            {[
              { label: 'Pazartesi', value: 285, max: 400 },
              { label: 'Salı', value: 320, max: 400 },
              { label: 'Çarşamba', value: 295, max: 400 },
              { label: 'Perşembe', value: 350, max: 400 },
              { label: 'Cuma', value: 375, max: 400 },
              { label: 'Cumartesi', value: 380, max: 400 },
              { label: 'Pazar', value: 340, max: 400 },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-[#333]">{item.label}</span>
                  <span className="text-xs text-[#8f8f8f]">{item.value}</span>
                </div>
                <div className="w-full bg-[#e0e0e0] rounded-full h-2">
                  <div
                    className="bg-[#00833e] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(item.value / item.max) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6">
          <h2 className="text-xl font-bold text-[#333] mb-6 flex items-center gap-2">
            <Calendar size={20} color="#00833e" />
            Yaklaşan Etkinlikler
          </h2>

          <div className="space-y-3">
            {UPCOMING_EVENTS.map((event) => (
              <div
                key={event.id}
                className="p-4 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0] hover:border-[#00833e] transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-[#333]">{event.title}</h3>
                  <span className="text-xs bg-[#e6f4ec] text-[#00833e] px-2 py-1 rounded">
                    {event.registered}/{event.capacity}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-[#8f8f8f]">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(event.date).toLocaleDateString('tr-TR')}
                  </div>
                  <div>{event.time}</div>
                </div>
                {/* Capacity Bar */}
                <div className="mt-2">
                  <div className="w-full bg-[#e0e0e0] rounded-full h-1.5">
                    <div
                      className="bg-[#00833e] h-1.5 rounded-full"
                      style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Performance Summary */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6">
          <h3 className="text-lg font-bold text-[#333] mb-6">Performans Özeti</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium text-[#333]">Profil Tamamlama</p>
                <p className="text-sm font-bold text-[#00833e]">85%</p>
              </div>
              <div className="w-full bg-[#e0e0e0] rounded-full h-2">
                <div
                  className="bg-[#00833e] h-2 rounded-full"
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium text-[#333]">İçerik Kalitesi</p>
                <p className="text-sm font-bold text-[#00833e]">92%</p>
              </div>
              <div className="w-full bg-[#e0e0e0] rounded-full h-2">
                <div
                  className="bg-[#00833e] h-2 rounded-full"
                  style={{ width: '92%' }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium text-[#333]">Müşteri Memnuniyeti</p>
                <p className="text-sm font-bold text-[#00833e]">96%</p>
              </div>
              <div className="w-full bg-[#e0e0e0] rounded-full h-2">
                <div
                  className="bg-[#00833e] h-2 rounded-full"
                  style={{ width: '96%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips & Recommendations */}
        <div className="bg-gradient-to-br from-[#e6f4ec] to-[#d1fae5] rounded-lg border border-[#a7dbb8] p-6">
          <h3 className="text-lg font-bold text-[#004d24] mb-4">Tavsiyeler</h3>
          <ul className="space-y-3 text-sm text-[#004d24]">
            <li className="flex gap-3">
              <span className="flex-shrink-0">✓</span>
              <span>Profil fotoğrafınızı yüksek kaliteli bir görselle güncelleyin</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0">✓</span>
              <span>Bu ay en az 2 yeni ürün/hizmet ekleyin</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0">✓</span>
              <span>Reklam kampanyası başlatarak görünürlüğü artırın</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0">✓</span>
              <span>Müşteri yorumlarına düzenli olarak cevap verin</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
