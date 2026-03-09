'use client';

import React from 'react';
import Image from 'next/image';
import { Search, MapPin, Newspaper, Store, Home, Building2, Flame } from 'lucide-react';
import Link from 'next/link';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  time: string;
  category: string;
  categoryId: string;
  thumbnail?: string;
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Mahallede Yeni Kahvehane Açılıyor',
    excerpt: 'Lokantanın yerine yeni bir kahvehane işletmesi açılıyor. Açılış 15 Mart\'ta yapılacak.',
    source: 'Komşu Haberleri',
    time: '2 saat önce',
    category: 'İşletmeler',
    categoryId: 'business',
    thumbnail: 'https://picsum.photos/200/150?random=71',
  },
  {
    id: '2',
    title: 'Park Yenileme Projesi Tamamlandı',
    excerpt: 'Yazlık park yenileme projesi başarıyla tamamlanmıştır. Yeni oyun alanları ve banklar eklendi.',
    source: 'Belediye Duyurusu',
    time: '4 saat önce',
    category: 'Belediye',
    categoryId: 'municipality',
    thumbnail: 'https://picsum.photos/200/150?random=72',
  },
  {
    id: '3',
    title: 'Evinizi Satmaya mı Karar Verdiniz?',
    excerpt: 'Mahallede gayrimenkul fiyatları hızla artıyor. Tavsiyelerimizi okuyun.',
    source: 'Emlak Bilgisi',
    time: '6 saat önce',
    category: 'Gayrimenkul',
    categoryId: 'realestate',
    thumbnail: 'https://picsum.photos/200/150?random=73',
  },
  {
    id: '4',
    title: 'Komşu Mahallesi Spor Etkinliği',
    excerpt: 'Cumartesi günü merkez parkında futbol turnuvası yapılacaktır. Katılımcılar arıyor.',
    source: 'Etkinlik Davet',
    time: '8 saat önce',
    category: 'Haberler',
    categoryId: 'news',
    thumbnail: 'https://picsum.photos/200/150?random=74',
  },
  {
    id: '5',
    title: 'Yerel Elektrikçi Hizmetlerinizi Anlatıyor',
    excerpt: 'Mahalle halkına yoğun ilgi gören elektrik ustası Serkan, hizmetleri hakkında konuşuyor.',
    source: 'Komşu Profili',
    time: '1 gün önce',
    category: 'İşletmeler',
    categoryId: 'business',
    thumbnail: 'https://picsum.photos/200/150?random=75',
  },
];

const trendingTopics = [
  { title: 'Mahallede başlatılan yenileme projesi', id: '2', discussions: 48 },
  { title: 'Yakın komşuluk etkinlikleri ve davetler', id: '4', discussions: 32 },
  { title: 'Yerel işletmelerdeki güncellemeler', id: '1', discussions: 27 },
  { title: 'Gayrimenkul piyasası analizi', id: '3', discussions: 19 },
];

const categories = [
  { id: 'all', label: 'Tümü' },
  { id: 'news', label: 'Haberler' },
  { id: 'business', label: 'İşletmeler' },
  { id: 'realestate', label: 'Gayrimenkul' },
  { id: 'municipality', label: 'Belediye' },
];

export default function KesfetPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('all');

  const filteredNews = mockNews.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.categoryId === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header Section */}
      <div className="bg-white border-b border-[#e0e0e0] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8f8f8f]" />
            <input
              type="text"
              placeholder="Mahallende haber ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f0f2f5] border border-[#e0e0e0] rounded-full text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e]"
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-[#333] mb-4">Yerel Haberler</h1>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#e0e0e0] -mx-4 px-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeCategory === category.id
                    ? 'border-[#00833e] text-[#00833e]'
                    : 'border-transparent text-[#8f8f8f] hover:text-[#333]'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* News Feed */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {filteredNews.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#e0e0e0] p-12 text-center">
            <Newspaper size={48} className="mx-auto text-[#8f8f8f] mb-3" />
            <p className="text-[#333] font-medium">Haber bulunamadı</p>
            <p className="text-[#8f8f8f] text-sm mt-1">Arama kriterlerinize eşleşen haber yok</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNews.map((item) => (
              <Link
                key={item.id}
                href={`/kesfet/${item.id}`}
                className="card-hover block bg-white border border-[#e0e0e0] rounded-lg p-4 transition-all duration-200 hover:shadow-lg hover:border-[#00833e] hover:scale-102"
              >
                <div className="flex gap-3">
                  {/* Thumbnail */}
                  {item.thumbnail && (
                    <div className="flex-shrink-0 w-28 h-28 rounded-lg overflow-hidden bg-gray-300">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium px-3 py-1 bg-[#00833e] text-white rounded-full">
                          {item.category}
                        </span>
                      </div>

                      <h3 className="font-bold text-[#333] line-clamp-2 mb-2">{item.title}</h3>

                      <p className="text-sm text-[#404040] line-clamp-2 mb-3">{item.excerpt}</p>

                      <div className="flex items-center gap-3 text-xs text-[#8f8f8f]">
                        <span className="font-medium">{item.source}</span>
                        <span>•</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 flex items-center justify-center text-[#8f8f8f]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Trending Section */}
        <div className="mt-8 bg-white border border-[#e0e0e0] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Flame size={20} className="text-orange-500" />
            <h2 className="text-lg font-bold text-[#333]">Sıcak Konular</h2>
          </div>

          <div className="space-y-3">
            {trendingTopics.map((trend, index) => (
              <Link key={index} href={`/kesfet/${trend.id}`} className="card-hover flex items-center gap-3 p-4 rounded-lg transition-all duration-200 hover:bg-[#f0f2f5]">
                <span className="text-base font-bold text-white bg-[#00833e] rounded-full w-8 h-8 flex items-center justify-center min-w-max">{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#333] line-clamp-2">{trend.title}</p>
                  <p className="text-xs text-[#8f8f8f] mt-1">{trend.discussions} konuşma</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
