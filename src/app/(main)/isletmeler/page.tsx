'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, MapPin, ChevronRight, Map, List, Clock } from 'lucide-react';
import { BusinessCard } from '@/components/business/business-card';

const MOCK_BUSINESSES = [
  {
    id: '1',
    name: 'Kahvehane Keyif',
    category: 'Kahve & Çay',
    rating: 4.8,
    reviewCount: 145,
    address: 'Mah. Cad. No: 25, Beşiktaş/İstanbul',
    logo: 'https://picsum.photos/200/200?random=100',
    phone: '+90 212 123 4567',
    website: 'kahvehane-keyif.com',
    isOpen: true,
  },
  {
    id: '2',
    name: 'Tatlı Dünyası',
    category: 'Pastane & Fırın',
    rating: 4.6,
    reviewCount: 89,
    address: 'Altı Sok. No: 12, Kadıköy/İstanbul',
    logo: 'https://picsum.photos/200/200?random=101',
    phone: '+90 216 456 7890',
    website: undefined,
    isOpen: true,
  },
  {
    id: '3',
    name: 'Usta Berber',
    category: 'Berberlik',
    rating: 4.9,
    reviewCount: 234,
    address: 'İmam Cad. No: 8, Cihangir/İstanbul',
    logo: 'https://picsum.photos/200/200?random=102',
    phone: '+90 212 234 5678',
    website: undefined,
    isOpen: false,
  },
  {
    id: '4',
    name: 'Güzellik Merkezi Ayşe',
    category: 'Güzellik & Spor',
    rating: 4.5,
    reviewCount: 67,
    address: 'Fatih Cad. No: 45, Beyoğlu/İstanbul',
    logo: 'https://picsum.photos/200/200?random=103',
    phone: '+90 212 567 8901',
    website: 'guzellik-ayse.com',
    isOpen: true,
  },
  {
    id: '5',
    name: 'Elektrik Ustası Serkan',
    category: 'Hizmet & Onarım',
    rating: 4.7,
    reviewCount: 156,
    address: 'Kültür Sok. No: 33, Şişli/İstanbul',
    logo: 'https://picsum.photos/200/200?random=104',
    phone: '+90 212 345 6789',
    website: undefined,
    isOpen: true,
  },
  {
    id: '6',
    name: 'Aşk Dolu Kuru Temizleme',
    category: 'Temizlik & Bakım',
    rating: 4.4,
    reviewCount: 102,
    address: 'Nispetiye Cad. No: 18, Levent/İstanbul',
    logo: 'https://picsum.photos/200/200?random=105',
    phone: '+90 212 678 9012',
    website: undefined,
    isOpen: false,
  },
  {
    id: '7',
    name: 'Sağlık & Eczane Demi',
    category: 'Sağlık',
    rating: 4.8,
    reviewCount: 178,
    address: 'Meşrutiyet Cad. No: 55, Tepebaşı/İstanbul',
    logo: 'https://picsum.photos/200/200?random=106',
    phone: '+90 212 789 0123',
    website: 'sağlık-eczane.com',
    isOpen: true,
  },
  {
    id: '8',
    name: 'Pet Bakım & Veteriner',
    category: 'Veterinerlik',
    rating: 4.6,
    reviewCount: 94,
    address: 'Abdülhak Hamid Cad. No: 22, Fatih/İstanbul',
    logo: 'https://picsum.photos/200/200?random=107',
    phone: '+90 212 901 2345',
    website: 'pet-bakım.com',
    isOpen: true,
  },
];

type SortOption = 'relevant' | 'rating' | 'reviews' | 'distance';

const CATEGORIES = [
  'Tümü',
  'Kahve & Çay',
  'Pastane & Fırın',
  'Berberlik',
  'Güzellik & Spor',
  'Hizmet & Onarım',
  'Temizlik & Bakım',
  'Sağlık',
  'Veterinerlik',
];

export default function IsletmelerPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [sortBy, setSortBy] = useState<SortOption>('relevant');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const filteredAndSortedBusinesses = useMemo(() => {
    let filtered = MOCK_BUSINESSES.filter((business) => {
      const matchesSearch =
        business.name.toLowerCase().includes(search.toLowerCase()) ||
        business.address.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === 'Tümü' || business.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        case 'distance':
          // In a real app, this would be based on actual distance
          // For now, we'll sort by rating as a proxy
          return b.rating - a.rating;
        case 'relevant':
        default:
          return 0;
      }
    });

    return sorted;
  }, [search, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-[#e6f4ec]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00833e] to-green-600 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Komşu İşletmeleri Keşfet</h1>
          <p className="text-[#d1fae5]">
            Mahallenizdeki en iyi işletmeleri bul ve yorumlarını oku
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-[#00833e]" size={20} />
            <input
              type="text"
              placeholder="İşletme adı veya konum ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-[#a7dbb8] focus:border-[#00833e] focus:outline-none bg-white"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex gap-2 whitespace-nowrap">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#00833e] text-white'
                    : 'bg-white text-gray-700 border border-[#a7dbb8] hover:border-[#00a24d]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results and Controls */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-gray-600 font-medium">
            {filteredAndSortedBusinesses.length} işletme bulundu
          </p>

          {/* Sort and View Options */}
          <div className="flex gap-3 items-center flex-wrap">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 rounded-lg border-2 border-[#a7dbb8] bg-white text-gray-700 font-medium text-sm focus:border-[#00833e] focus:outline-none hover:border-[#00a24d] transition-colors"
            >
              <option value="relevant">Alakalı</option>
              <option value="rating">Puan</option>
              <option value="reviews">Yorum Sayısı</option>
              <option value="distance">En Yakın</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex gap-2 border-2 border-[#a7dbb8] rounded-lg p-1 bg-white">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#00833e] text-white'
                    : 'text-gray-600 hover:text-[#00833e]'
                }`}
                title="Liste Görünümü"
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'map'
                    ? 'bg-[#00833e] text-white'
                    : 'text-gray-600 hover:text-[#00833e]'
                }`}
                title="Harita Görünümü"
              >
                <Map size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Business Grid or Map View */}
        {filteredAndSortedBusinesses.length > 0 ? (
          viewMode === 'list' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredAndSortedBusinesses.map((business) => (
                <Link
                  key={business.id}
                  href={`/isletmeler/${business.id}`}
                  className="hover:no-underline card-hover"
                >
                  <BusinessCard {...business} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="mb-12 bg-white rounded-lg border-2 border-[#a7dbb8] overflow-hidden">
              <div className="h-96 bg-gradient-to-br from-[#e6f4ec] to-[#d1fae5] flex flex-col items-center justify-center p-8 text-center">
                <Map size={64} className="text-[#00833e] mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Harita Görünümü</h3>
                <p className="text-gray-600 max-w-md">
                  Harita özelliği yakında kullanıma sunulacak. Şu anda liste görünümünü kullanabilirsiniz.
                </p>
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              İşletme bulunamadı
            </h3>
            <p className="text-gray-600">
              Farklı arama terimlerini deneyebilirsiniz
            </p>
          </div>
        )}

        {/* Add Business CTA */}
        <div className="bg-white rounded-lg border-2 border-[#a7dbb8] p-6 text-center mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Kendi İşletmenizi Ekleyin
          </h3>
          <p className="text-gray-600 mb-4">
            Komşularınıza ulaşın ve işletmenizi büyütün
          </p>
          <Link
            href="/isletme-ekle"
            className="inline-flex items-center gap-2 bg-[#00833e] hover:bg-[#006b32] text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            İşletme Ekle
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
