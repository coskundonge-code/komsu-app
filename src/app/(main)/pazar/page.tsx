'use client';

import { useState } from 'react';
import { Search, Plus, SlidersHorizontal, Heart, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const tabs = [
  { id: 'all', label: 'Tüm İlanlar' },
  { id: 'mine', label: 'İlanlarım' },
  { id: 'saved', label: 'Kaydedilenler' },
];

const categories = [
  'Tümü', 'Ücretsiz', 'Mobilya', 'Elektronik', 'Giyim', 'Ev Eşyaları',
  'Spor', 'Kitap', 'Oyuncak', 'Araç', 'Diğer',
];

const mockListings = [
  {
    id: '1',
    title: 'Laptop Lenovo IdeaPad 5',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1588405748847-5e9d6f6abc05?w=400&h=300&fit=crop',
    location: 'Kadıköy',
    timeAgo: '2 sa',
    isFree: false,
  },
  {
    id: '2',
    title: 'IKEA Kanepe - Açık Gri',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
    location: 'Moda',
    timeAgo: '4 sa',
    isFree: false,
  },
  {
    id: '3',
    title: 'Nike Spor Ayakkabı 42',
    price: 450,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    location: 'Caferağa',
    timeAgo: '5 sa',
    isFree: false,
  },
  {
    id: '4',
    title: 'Çocuk Kitapları Seti',
    price: 0,
    image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=300&fit=crop',
    location: 'Kadıköy',
    timeAgo: '6 sa',
    isFree: true,
  },
  {
    id: '5',
    title: 'Dumbbell Seti 20kg',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
    location: 'Moda',
    timeAgo: '1 gün',
    isFree: false,
  },
  {
    id: '6',
    title: 'PlayStation 5',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
    location: 'Kadıköy',
    timeAgo: '1 gün',
    isFree: false,
  },
  {
    id: '7',
    title: 'Ahşap Yemek Masası',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1565636192335-14c9cbf2b0ae?w=400&h=300&fit=crop',
    location: 'Fenerbahçe',
    timeAgo: '1 gün',
    isFree: false,
  },
  {
    id: '8',
    title: 'Bebek Arabası',
    price: 0,
    image: 'https://images.unsplash.com/photo-1605026312519-c90900e2a306?w=400&h=300&fit=crop',
    location: 'Moda',
    timeAgo: '2 gün',
    isFree: true,
  },
  {
    id: '9',
    title: 'Samsung Galaxy Tab S9',
    price: 4200,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
    location: 'Caferağa',
    timeAgo: '2 gün',
    isFree: false,
  },
];

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    const next = new Set(favorites);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setFavorites(next);
  };

  const filtered = mockListings.filter((l) => {
    if (searchQuery && !l.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCategory === 'Ücretsiz' && !l.isFree) return false;
    if (selectedCategory !== 'Tümü' && selectedCategory !== 'Ücretsiz') return true; // would filter by category
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[900px] mx-auto px-4 py-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Satılık ve Ücretsiz</h1>
            <Link
              href="/pazar/ilan-ver"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              İlan Ver
            </Link>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Eşya ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-100 -mx-4 px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'text-emerald-700 border-emerald-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors',
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              )}
            >
              {cat}
            </button>
          ))}
          <button className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border border-gray-200 bg-white text-gray-700 hover:border-gray-300 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" />
            Filtreler
          </button>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-3">{filtered.length} ilan bulundu</p>

        {/* Listings Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map((listing) => (
            <Link
              key={listing.id}
              href={`/pazar/ilan/${listing.id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="relative aspect-square">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                {listing.isFree && (
                  <span className="absolute top-2 left-2 bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                    ÜCRETSİZ
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(listing.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors"
                >
                  <Heart
                    className={cn('w-4 h-4', favorites.has(listing.id) ? 'fill-red-500 text-red-500' : 'text-gray-600')}
                  />
                </button>
              </div>
              <div className="p-3">
                <p className="text-sm font-bold text-gray-900 mb-0.5">
                  {listing.isFree ? 'Ücretsiz' : `₺${listing.price.toLocaleString('tr-TR')}`}
                </p>
                <p className="text-sm text-gray-700 line-clamp-2 mb-1">{listing.title}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  {listing.location} · {listing.timeAgo}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load more */}
        <div className="text-center mt-6 mb-4">
          <button className="px-6 py-2.5 border border-gray-300 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Daha Fazla Göster
          </button>
        </div>
      </div>
    </div>
  );
}
