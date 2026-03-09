'use client';

import { useState } from 'react';
import { Search, Plus, ArrowUpDown } from 'lucide-react';
import { ListingCard } from '@/components/marketplace/listing-card';
import { CategoryFilter } from '@/components/marketplace/category-filter';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { CategoryType } from '@/components/marketplace/category-filter';

// Mock data
const mockListings = [
  {
    id: '1',
    title: 'Laptop Lenovo IdeaPad 5',
    price: 8500,
    imageUrl:
      'https://images.unsplash.com/photo-1588405748847-5e9d6f6abc05?w=400&h=300&fit=crop',
    condition: 'good' as const,
    location: 'Şişli, İstanbul',
    timeAgo: '2 saat önce',
  },
  {
    id: '2',
    title: 'IKEA Kanepe - Açık Gri',
    price: 2200,
    imageUrl:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
    condition: 'excellent' as const,
    location: 'Beşiktaş, İstanbul',
    timeAgo: '4 saat önce',
  },
  {
    id: '3',
    title: 'Nike Spor Ayakkabı - 42 Beden',
    price: 450,
    imageUrl:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    condition: 'excellent' as const,
    location: 'Nişantaşı, İstanbul',
    timeAgo: '5 saat önce',
  },
  {
    id: '4',
    title: 'Öğrenci Ders Kitapları Paketi',
    price: 350,
    imageUrl:
      'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=300&fit=crop',
    condition: 'good' as const,
    location: 'Kadıköy, İstanbul',
    timeAgo: '6 saat önce',
  },
  {
    id: '5',
    title: 'DumbbellSeti 20kg',
    price: 1200,
    imageUrl:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
    condition: 'used' as const,
    location: 'Taksim, İstanbul',
    timeAgo: '1 gün önce',
  },
  {
    id: '6',
    title: 'Playstation 5 Konsolu',
    price: 6500,
    imageUrl:
      'https://images.unsplash.com/photo-1606841838e57-76cd55ab8e8f?w=400&h=300&fit=crop',
    condition: 'excellent' as const,
    location: 'Levent, İstanbul',
    timeAgo: '1 gün önce',
  },
  {
    id: '7',
    title: 'Ahşap Yemek Masası',
    price: 1800,
    imageUrl:
      'https://images.unsplash.com/photo-1565636192335-14c9cbf2b0ae?w=400&h=300&fit=crop',
    condition: 'fair' as const,
    location: 'Aksaray, İstanbul',
    timeAgo: '1 gün önce',
  },
  {
    id: '8',
    title: 'Çocuk Oyuncak Koleksiyonu',
    price: 600,
    imageUrl:
      'https://images.unsplash.com/photo-1605026312519-c90900e2a306?w=400&h=300&fit=crop',
    condition: 'used' as const,
    location: 'Bakırköy, İstanbul',
    timeAgo: '2 gün önce',
  },
];

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular';

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleCategoryChange = (category: CategoryType) => {
    setActiveCategory(category);
  };

  const handleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  // Filter and sort listings
  let filteredListings = [...mockListings];

  if (searchQuery) {
    filteredListings = filteredListings.filter((listing) =>
      listing.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sort listings
  switch (sortBy) {
    case 'price-asc':
      filteredListings.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filteredListings.sort((a, b) => b.price - a.price);
      break;
    case 'popular':
      filteredListings.sort(() => Math.random() - 0.5);
      break;
    default:
      break;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Pazar Yeri</h1>
            <Link
              href="/pazar/ilan-ver"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              <Plus size={20} />
              İlan Ver
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="İlan ara... (telefon, masa, elbise...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <CategoryFilter
              onCategoryChange={handleCategoryChange}
              defaultCategory="all"
              variant="sidebar"
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Sort Options */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600">
                  {filteredListings.length} ilan bulundu
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown size={16} className="text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="newest">En Yeni</option>
                  <option value="price-asc">Fiyat: Düşük-Yüksek</option>
                  <option value="price-desc">Fiyat: Yüksek-Düşük</option>
                  <option value="popular">Popüler</option>
                </select>
              </div>
            </div>

            {/* Listings Grid */}
            {filteredListings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">Arama sonucu bulunamadı</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredListings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/pazar/ilan/${listing.id}`}
                  >
                    <ListingCard
                      {...listing}
                      isFavorite={favorites.has(listing.id)}
                      onFavoriteClick={() => handleFavorite(listing.id)}
                    />
                  </Link>
                ))}
              </div>
            )}

            {/* Load More */}
            {filteredListings.length > 0 && (
              <div className="text-center mt-8">
                <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  Daha Fazla Yükle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
