'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, MapPin, ChevronRight } from 'lucide-react';
import { BusinessCard } from '@/components/business/business-card';

const MOCK_BUSINESSES = [
  {
    id: '1',
    name: 'Kahvehane Keyif',
    category: 'Kahve & Çay',
    rating: 4.8,
    reviewCount: 145,
    address: 'Mah. Cad. No: 25, Beşiktaş/İstanbul',
    logo: undefined,
    phone: '+90 212 123 4567',
    website: 'kahvehane-keyif.com',
  },
  {
    id: '2',
    name: 'Tatlı Dünyası',
    category: 'Pastane & Fırın',
    rating: 4.6,
    reviewCount: 89,
    address: 'Altı Sok. No: 12, Kadıköy/İstanbul',
    logo: undefined,
    phone: '+90 216 456 7890',
    website: undefined,
  },
  {
    id: '3',
    name: 'Usta Berber',
    category: 'Berberlik',
    rating: 4.9,
    reviewCount: 234,
    address: 'İmam Cad. No: 8, Cihangir/İstanbul',
    logo: undefined,
    phone: '+90 212 234 5678',
    website: undefined,
  },
  {
    id: '4',
    name: 'Güzellik Merkezi Ayşe',
    category: 'Güzellik & Spor',
    rating: 4.5,
    reviewCount: 67,
    address: 'Fatih Cad. No: 45, Beyoğlu/İstanbul',
    logo: undefined,
    phone: '+90 212 567 8901',
    website: 'guzellik-ayse.com',
  },
  {
    id: '5',
    name: 'Elektrik Ustası Serkan',
    category: 'Hizmet & Onarım',
    rating: 4.7,
    reviewCount: 156,
    address: 'Kültür Sok. No: 33, Şişli/İstanbul',
    logo: undefined,
    phone: '+90 212 345 6789',
    website: undefined,
  },
  {
    id: '6',
    name: 'Aşk Dolu Kuru Temizleme',
    category: 'Temizlik & Bakım',
    rating: 4.4,
    reviewCount: 102,
    address: 'Nispetiye Cad. No: 18, Levent/İstanbul',
    logo: undefined,
    phone: '+90 212 678 9012',
    website: undefined,
  },
  {
    id: '7',
    name: 'Sağlık & Eczane Demi',
    category: 'Sağlık',
    rating: 4.8,
    reviewCount: 178,
    address: 'Meşrutiyet Cad. No: 55, Tepebaşı/İstanbul',
    logo: undefined,
    phone: '+90 212 789 0123',
    website: 'sağlık-eczane.com',
  },
  {
    id: '8',
    name: 'Pet Bakım & Veteriner',
    category: 'Veterinerlik',
    rating: 4.6,
    reviewCount: 94,
    address: 'Abdülhak Hamid Cad. No: 22, Fatih/İstanbul',
    logo: undefined,
    phone: '+90 212 901 2345',
    website: 'pet-bakım.com',
  },
];

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

  const filteredBusinesses = useMemo(() => {
    return MOCK_BUSINESSES.filter((business) => {
      const matchesSearch =
        business.name.toLowerCase().includes(search.toLowerCase()) ||
        business.address.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === 'Tümü' || business.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

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

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 font-medium">
            {filteredBusinesses.length} işletme bulundu
          </p>
        </div>

        {/* Business Grid */}
        {filteredBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredBusinesses.map((business) => (
              <Link
                key={business.id}
                href={`/isletmeler/${business.id}`}
                className="hover:no-underline"
              >
                <BusinessCard {...business} />
              </Link>
            ))}
          </div>
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
