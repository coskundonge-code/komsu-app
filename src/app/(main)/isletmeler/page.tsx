'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, MapPin, ChevronRight, Map, List, Clock, Star, Zap, Phone } from 'lucide-react';
import { BusinessCard } from '@/components/business/business-card';

interface Business {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  address: string;
  distance: number;
  logo: string;
  phone: string;
  website?: string;
  isOpen: boolean;
  isFeatured?: boolean;
}

const MOCK_BUSINESSES: Business[] = [
  {
    id: '1',
    name: "Kahvehane Keyif",
    category: 'Kafe',
    rating: 4.8,
    reviewCount: 145,
    address: 'Mah. Cad. No: 25, Beşiktaş/İstanbul',
    distance: 0.3,
    logo: 'https://picsum.photos/200/200?random=100',
    phone: '+90 212 123 4567',
    website: 'kahvehane-keyif.com',
    isOpen: true,
    isFeatured: true,
  },
  {
    id: '2',
    name: "Tatlı Dünyası",
    category: 'Restoran',
    rating: 4.6,
    reviewCount: 89,
    address: 'Altı Sok. No: 12, Kadıköy/İstanbul',
    distance: 0.5,
    logo: 'https://picsum.photos/200/200?random=101',
    phone: '+90 216 456 7890',
    isOpen: true,
    isFeatured: false,
  },
  {
    id: '3',
    name: 'Usta Berber',
    category: 'Kuaför',
    rating: 4.9,
    reviewCount: 234,
    address: 'İmam Cad. No: 8, Cihangir/İstanbul',
    distance: 0.8,
    logo: 'https://picsum.photos/200/200?random=102',
    phone: '+90 212 234 5678',
    isOpen: false,
    isFeatured: true,
  },
  {
    id: '4',
    name: 'Güzellik Merkezi Ayşe',
    category: 'Spor',
    rating: 4.5,
    reviewCount: 67,
    address: 'Fatih Cad. No: 45, Beyoğlu/İstanbul',
    distance: 1.2,
    logo: 'https://picsum.photos/200/200?random=103',
    phone: '+90 212 567 8901',
    website: 'guzellik-ayse.com',
    isOpen: true,
    isFeatured: false,
  },
  {
    id: '5',
    name: 'Elektrik Ustası Serkan',
    category: 'Terzi',
    rating: 4.7,
    reviewCount: 156,
    address: 'Kültür Sok. No: 33, Şişli/İstanbul',
    distance: 1.5,
    logo: 'https://picsum.photos/200/200?random=104',
    phone: '+90 212 345 6789',
    isOpen: true,
    isFeatured: false,
  },
  {
    id: '6',
    name: 'Aşk Dolu Kuru Temizleme',
    category: 'Market',
    rating: 4.4,
    reviewCount: 102,
    address: 'Nispetiye Cad. No: 18, Levent/İstanbul',
    distance: 0.6,
    logo: 'https://picsum.photos/200/200?random=105',
    phone: '+90 212 678 9012',
    isOpen: false,
    isFeatured: false,
  },
  {
    id: '7',
    name: 'Sağlık & Eczane Demi',
    category: 'Eczane',
    rating: 4.8,
    reviewCount: 178,
    address: 'Meşrutiyet Cad. No: 55, Tepebaşı/İstanbul',
    distance: 0.4,
    logo: 'https://picsum.photos/200/200?random=106',
    phone: '+90 212 789 0123',
    website: 'sağlık-eczane.com',
    isOpen: true,
    isFeatured: true,
  },
  {
    id: '8',
    name: 'Pet Bakım & Veteriner',
    category: 'Veteriner',
    rating: 4.6,
    reviewCount: 94,
    address: 'Abdülhak Hamid Cad. No: 22, Fatih/İstanbul',
    distance: 2.1,
    logo: 'https://picsum.photos/200/200?random=107',
    phone: '+90 212 901 2345',
    website: 'pet-bakım.com',
    isOpen: true,
    isFeatured: false,
  },
  {
    id: '9',
    name: 'Oto Yıkama Express',
    category: 'Oto Yıkama',
    rating: 4.3,
    reviewCount: 56,
    address: 'Gümrük Cad. No: 7, Galata/İstanbul',
    distance: 1.1,
    logo: 'https://picsum.photos/200/200?random=108',
    phone: '+90 212 555 1111',
    isOpen: true,
    isFeatured: false,
  },
  {
    id: '10',
    name: 'Sağlık Klinigi Plus',
    category: 'Restoran',
    rating: 4.7,
    reviewCount: 120,
    address: 'Taksim Cad. No: 33, Taksim/İstanbul',
    distance: 0.9,
    logo: 'https://picsum.photos/200/200?random=109',
    phone: '+90 212 222 3333',
    website: 'saglik-klinik.com',
    isOpen: true,
    isFeatured: false,
  },
];

type SortOption = 'recommended' | 'nearest' | 'rating' | 'newest';

const CATEGORIES = [
  'Tümü',
  'Restoran',
  'Market',
  'Terzi',
  'Kuaför',
  'Eczane',
  'Kafe',
  'Spor',
  'Oto Yıkama',
  'Veteriner',
];

export default function IsletmelerPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
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
        case 'newest':
          return b.reviewCount - a.reviewCount;
        case 'nearest':
          return a.distance - b.distance;
        case 'recommended':
        default:
          // Featured first, then by rating
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.rating - a.rating;
      }
    });

    return sorted;
  }, [search, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#00833e] to-green-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Mahallenizdeki İşletmeler</h1>
          <p className="text-[#d1fae5] mb-6">
            Komşularınızın tercih ettiği en iyi işletmeleri keşfedin
          </p>

          {/* Hero Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-4 text-[#00833e]" size={20} />
            <input
              type="text"
              placeholder="İşletme adı, kategori veya konum ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-transparent focus:border-[#00833e] focus:outline-none bg-white text-[#333] placeholder-[#8f8f8f]"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Category Filter - Horizontal Scrollable Chips */}
        <div className="mb-8 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
          <div className="flex gap-2 whitespace-nowrap">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all flex-shrink-0 ${
                  selectedCategory === category
                    ? 'bg-[#00833e] text-white shadow-md'
                    : 'bg-white text-[#333] border border-[#e0e0e0] hover:border-[#00833e]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header and Controls */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[#333] font-bold text-lg">
              {filteredAndSortedBusinesses.length} işletme bulundu
            </p>
          </div>

          {/* Sort and View Options */}
          <div className="flex gap-3 items-center flex-wrap">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 rounded-lg border-2 border-[#e0e0e0] bg-white text-[#333] font-medium text-sm focus:border-[#00833e] focus:outline-none hover:border-[#00833e] transition-colors cursor-pointer"
            >
              <option value="recommended">Önerilen</option>
              <option value="nearest">En Yakın</option>
              <option value="rating">En İyi Puan</option>
              <option value="newest">En Yeni</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex gap-1 border-2 border-[#e0e0e0] rounded-lg p-1 bg-white">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#00833e] text-white'
                    : 'text-[#8f8f8f] hover:text-[#00833e]'
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
                    : 'text-[#8f8f8f] hover:text-[#00833e]'
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
                  className="hover:no-underline group"
                >
                  <div className="relative h-full">
                    <BusinessCard {...business} />

                    {/* Featured Badge */}
                    {business.isFeatured && (
                      <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Star size={14} className="fill-current" />
                        Öne Çıkan
                      </div>
                    )}

                    {/* Distance Badge */}
                    <div className="absolute bottom-4 left-4 bg-[#00833e] text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <MapPin size={14} />
                      {business.distance} km
                    </div>

                    {/* Phone Quick Action */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `tel:${business.phone}`;
                        }}
                        className="bg-[#00833e] hover:bg-[#006b32] text-white p-2 rounded-full shadow-lg transition-colors"
                        title="Ara"
                      >
                        <Phone size={18} />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mb-12 bg-white rounded-lg border-2 border-[#e0e0e0] overflow-hidden">
              <div className="h-96 bg-gradient-to-br from-[#f0f2f5] to-[#e0e0e0] flex flex-col items-center justify-center p-8 text-center">
                <Map size={64} className="text-[#8f8f8f] mb-4" />
                <h3 className="text-xl font-bold text-[#333] mb-2">Harita Görünümü</h3>
                <p className="text-[#8f8f8f] max-w-md">
                  Harita özelliği yakında kullanıma sunulacak. Şu anda liste görünümünü kullanabilirsiniz.
                </p>
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-[#e0e0e0]">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-[#333] mb-2">
              İşletme bulunamadı
            </h3>
            <p className="text-[#8f8f8f]">
              Farklı arama terimlerini veya filtreleri deneyebilirsiniz
            </p>
          </div>
        )}

        {/* Add Business CTA */}
        <div className="bg-gradient-to-r from-[#e6f4ec] to-[#f0f2f5] rounded-lg border-2 border-[#00833e] p-8 text-center mb-8">
          <h3 className="text-2xl font-bold text-[#333] mb-2">
            Kendi İşletmenizi Ekleyin
          </h3>
          <p className="text-[#8f8f8f] mb-6 max-w-2xl mx-auto">
            Mahallenizdeki müşterilerinize ulaşın, işletmenizi tanıtın ve büyütün
          </p>
          <Link
            href="/isletme-ekle"
            className="inline-flex items-center gap-2 bg-[#00833e] hover:bg-[#006b32] text-white font-bold py-3 px-8 rounded-lg transition-all hover:shadow-lg"
          >
            <Zap size={20} />
            İşletme Ekle
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
