'use client';

import React from 'react';
import Link from 'next/link';
import {
  Eye,
  Star,
  ThumbsUp,
  TrendingUp,
  MessageCircle,
  ChevronRight,
} from 'lucide-react';

const STATS = [
  {
    id: 1,
    label: 'Profil Görüntülemeleri',
    value: '2,847',
    change: '+12.5%',
    icon: Eye,
    color: 'green',
  },
  {
    id: 2,
    label: 'Ortalama Puan',
    value: '4.8',
    change: '+0.2',
    icon: Star,
    color: 'yellow',
  },
  {
    id: 3,
    label: 'Yorum Sayısı',
    value: '145',
    change: '+23',
    icon: MessageCircle,
    color: 'blue',
  },
  {
    id: 4,
    label: 'Tavsiye Edilme',
    value: '89%',
    change: '+5%',
    icon: ThumbsUp,
    color: 'green',
  },
];

const RECENT_REVIEWS = [
  {
    id: 1,
    author: 'Ahmet K.',
    rating: 5,
    date: '2024-03-08',
    text: 'Harika bir kahvehane! Personeli çok hoş, kahveler lezzetli. Kesinlikle geleceğim.',
  },
  {
    id: 2,
    author: 'Fatma D.',
    rating: 4,
    date: '2024-03-06',
    text: 'Ortam çok güzel, çay seçenekleri iyi. Biraz daha ucuz olabilir ama tavsiye ederim.',
  },
  {
    id: 3,
    author: 'Mustafa T.',
    rating: 5,
    date: '2024-03-05',
    text: 'En iyi Türk kahvesi bu mahallede! Fincan sunumundan ev sahibi tutumuna her şey mükemmel.',
  },
];

export default function IsletmePaneliPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Hoşgeldiniz, Kahvehane Keyif</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            emerald: 'bg-[#d1fae5] text-[#00833e]',
            yellow: 'bg-yellow-100 text-yellow-600',
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
          };

          return (
            <div
              key={stat.id}
              className="bg-white rounded-lg border border-[#d1fae5] p-6 hover:shadow-lg transition-shadow"
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reviews */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-[#d1fae5] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Son Yorumlar</h2>
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
                  className="border-b border-[#d1fae5] pb-4 last:border-b-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{review.author}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">{review.text}</p>

                  {/* Quick Actions */}
                  <div className="flex gap-3 mt-3">
                    <button className="text-xs text-[#00833e] hover:text-[#006b32] font-medium">
                      Cevap Ver
                    </button>
                    <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                      Raporla
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-[#00833e] to-green-600 rounded-lg text-white p-6">
            <h3 className="text-lg font-bold mb-4">Hızlı İşlemler</h3>
            <div className="space-y-3">
              <Link
                href="/isletme-paneli/istatistikler"
                className="block w-full bg-[#006b32] hover:bg-[#005a2b] font-medium py-2 px-4 rounded-lg transition-colors text-center"
              >
                İstatistikleri Görüntüle
              </Link>
              <Link
                href="/isletme-paneli/reklamlar"
                className="block w-full bg-[#006b32] hover:bg-[#005a2b] font-medium py-2 px-4 rounded-lg transition-colors text-center"
              >
                Reklam Yönet
              </Link>
              <button className="w-full bg-[#006b32] hover:bg-[#005a2b] font-medium py-2 px-4 rounded-lg transition-colors">
                Profili Düzenle
              </button>
            </div>
          </div>

          {/* Performance Card */}
          <div className="bg-white rounded-lg border border-[#d1fae5] p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Performans Özeti
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Profil Tamamlama</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#00833e] h-2 rounded-full"
                    style={{ width: '85%' }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">85% Tamamlandı</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">İçerik Kalitesi</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: '92%' }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Harika</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Müşteri Memnuniyeti</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{ width: '96%' }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Çok İyi</p>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-3">Tavsiye</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex gap-2">
                <span>•</span>
                <span>Profil fotoğrafınızı güncelleyin</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Daha fazla yorum alın</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Reklam kampanyası başlatın</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
