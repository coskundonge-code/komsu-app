'use client';

import React from 'react';
import {
  MapPin,
  TrendingUp,
  Users,
  MessageCircle,
  Heart,
  Eye,
  Clock,
} from 'lucide-react';

const NEARBY_ACTIVITIES = [
  {
    id: '1',
    type: 'post',
    author: 'Ahmet K.',
    avatar: undefined,
    timestamp: '2 saat önce',
    content: 'Mahallede yeni bir kahvehane açıldı! Kahveleri harika, ortam çok hoş.',
    reactions: 34,
    comments: 8,
    category: 'Yeni İşletme',
  },
  {
    id: '2',
    type: 'event',
    author: 'Komşu Derneği',
    avatar: undefined,
    timestamp: '4 saat önce',
    content: 'Bu hafta parkta komşu buluşması var. Saat 15:00de başlıyor!',
    reactions: 127,
    comments: 45,
    category: 'Olay/Etkinlik',
  },
  {
    id: '3',
    type: 'recommendation',
    author: 'Fatma D.',
    avatar: undefined,
    timestamp: '6 saat önce',
    content: 'Elektrikçi Serkan çok güvenilir birisi. İşini iyi yapıyor, tavsiye ederim!',
    reactions: 23,
    comments: 5,
    category: 'Tavsiye',
  },
  {
    id: '4',
    type: 'question',
    author: 'Mustafa T.',
    avatar: undefined,
    timestamp: '8 saat önce',
    content: 'Mahallede usta tesisatçı bilen var mı? Öneriniz nedir?',
    reactions: 12,
    comments: 18,
    category: 'Soru',
  },
  {
    id: '5',
    type: 'post',
    author: 'Elif Y.',
    avatar: undefined,
    timestamp: '10 saat önce',
    content: 'Parkın yenilenmesi harika oldu. Çocuklarla oynamak için ideal bir yer şimdi.',
    reactions: 89,
    comments: 22,
    category: 'Paylaşım',
  },
];

const TRENDING = [
  {
    id: '1',
    title: 'En İyi Kahve Dükkanları',
    posts: 234,
    engagement: 'Çok yüksek',
  },
  {
    id: '2',
    title: 'Komşu Etkinlikleri',
    posts: 156,
    engagement: 'Yüksek',
  },
  {
    id: '3',
    title: 'Yerel İş Önerileri',
    posts: 145,
    engagement: 'Yüksek',
  },
  {
    id: '4',
    title: 'Parklar & Oyun Alanları',
    posts: 98,
    engagement: 'Orta',
  },
  {
    id: '5',
    title: 'Restoranlar & Mekanlar',
    posts: 87,
    engagement: 'Orta',
  },
];

export default function KesfetPage() {
  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-8 px-4 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold">Keşfet</h1>
          <p className="text-emerald-100 mt-1">
            Mahallendeki haberler ve trendler
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Activities */}
          <div className="lg:col-span-2">
            {/* Map Placeholder */}
            <div className="bg-white rounded-lg border border-emerald-100 p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={20} className="text-emerald-600" />
                <h2 className="text-lg font-bold text-gray-900">Yakında Neler Oluyor?</h2>
              </div>
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="font-medium">Harita Yükleniyor...</p>
                </div>
              </div>
            </div>

            {/* Nearby Activity Feed */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Yakın Zamanda Yapılan Paylaşımlar
              </h2>
              <div className="space-y-4">
                {NEARBY_ACTIVITIES.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-white rounded-lg border border-emerald-100 p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center text-emerald-700 font-bold flex-shrink-0">
                        {activity.author.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <p className="font-medium text-gray-900">
                            {activity.author}
                          </p>
                          <span className="text-xs font-medium px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                            {activity.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Clock size={12} />
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {activity.content}
                    </p>

                    {/* Engagement */}
                    <div className="flex gap-4 border-t border-emerald-100 pt-3">
                      <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors text-sm font-medium">
                        <Heart size={16} />
                        {activity.reactions}
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors text-sm font-medium">
                        <MessageCircle size={16} />
                        {activity.comments}
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors text-sm font-medium ml-auto">
                        <Eye size={16} />
                        Görüntüle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Trending */}
          <div className="lg:col-span-1">
            {/* Trending Section */}
            <div className="bg-white rounded-lg border border-emerald-100 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={20} className="text-emerald-600" />
                <h2 className="text-lg font-bold text-gray-900">Mahalleden Trendler</h2>
              </div>

              <div className="space-y-4">
                {TRENDING.map((trend, index) => (
                  <button
                    key={trend.id}
                    className="w-full text-left p-3 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl font-bold text-emerald-600">
                        #{index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm line-clamp-2">
                          {trend.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <Users size={12} />
                          <span>{trend.posts} paylaşım</span>
                        </div>
                        <p
                          className={`text-xs font-medium mt-1 ${
                            trend.engagement === 'Çok yüksek'
                              ? 'text-red-600'
                              : trend.engagement === 'Yüksek'
                              ? 'text-orange-600'
                              : 'text-yellow-600'
                          }`}
                        >
                          {trend.engagement} etkileşim
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Explore More */}
              <button className="w-full mt-6 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                Tüm Trendleri Gör
              </button>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-lg text-white p-6 mt-6">
              <h3 className="font-bold mb-4">Mahalle İstatistikleri</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-emerald-100 text-sm">Aktif Komşu</p>
                  <p className="text-2xl font-bold">2,847</p>
                </div>
                <div>
                  <p className="text-emerald-100 text-sm">Bu ay Paylaşım</p>
                  <p className="text-2xl font-bold">1,234</p>
                </div>
                <div>
                  <p className="text-emerald-100 text-sm">Katılılan Etkinlik</p>
                  <p className="text-2xl font-bold">45</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
