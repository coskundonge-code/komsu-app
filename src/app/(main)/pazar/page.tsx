'use client';

import { useState } from 'react';
import { Search, Plus, Heart, MapPin, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const tabs = [
  { id: 'all', label: 'Tüm İlanlar' },
  { id: 'mine', label: 'İlanlarınız' },
  { id: 'saved', label: 'Kaydedilen İlanlar' },
];

const filterButtons = [
  { id: 'category', label: 'Kategoriler' },
  { id: 'free', label: 'Ücretsiz' },
  { id: 'distance', label: 'Mesafe' },
  { id: 'sort', label: 'Sırala' },
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
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    const next = new Set(favorites);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setFavorites(next);
  };

  const filtered = mockListings.filter((l) => {
    if (searchQuery && !l.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="py-4 px-4">
      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden mb-4">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[20px] font-bold text-[#333]">Satılık ve Ücretsiz</h1>
            <Link
              href="/pazar/ilan-ver"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#00833e] text-white rounded-full hover:bg-[#006b32] transition-colors text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              İlan Ver
            </Link>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8f8f8f]" />
            <input
              type="text"
              placeholder="İlan ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f0f2f5] border border-[#e0e0e0] rounded-full text-sm text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e] transition"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-0 border-b border-[#e0e0e0] -mx-4 px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-3 text-sm font-medium border-b-[3px] transition-colors',
                  activeTab === tab.id
                    ? 'text-[#00833e] border-[#00833e]'
                    : 'text-[#8f8f8f] border-transparent hover:text-[#404040]'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        {filterButtons.map((filter) => (
          <button
            key={filter.id}
            className="flex items-center gap-1 px-4 py-2 bg-white border border-[#e0e0e0] rounded-full text-sm font-medium text-[#404040] hover:bg-[#f0f2f5] transition-colors whitespace-nowrap"
          >
            {filter.label}
            <ChevronDown className="w-3.5 h-3.5 text-[#8f8f8f]" />
          </button>
        ))}
      </div>

      {/* Listings Grid — 3 columns like Nextdoor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((listing) => (
          <Link
            key={listing.id}
            href={`/pazar/ilan/${listing.id}`}
            className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden hover:shadow-md transition-shadow group"
          >
            <div className="relative aspect-[4/3]">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              {listing.isFree && (
                <span className="absolute top-2 left-2 bg-[#00833e] text-white text-xs font-bold px-2 py-0.5 rounded">
                  ÜCRETSİZ
                </span>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(listing.id);
                }}
                className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm"
              >
                <Heart
                  className={cn('w-4 h-4', favorites.has(listing.id) ? 'fill-red-500 text-red-500' : 'text-[#404040]')}
                />
              </button>
            </div>
            <div className="p-3">
              <p className="text-[15px] font-bold text-[#333] mb-0.5">
                {listing.isFree ? 'Ücretsiz' : `₺${listing.price.toLocaleString('tr-TR')}`}
              </p>
              <p className="text-sm text-[#404040] line-clamp-2 mb-1.5">{listing.title}</p>
              <div className="flex items-center gap-1 text-xs text-[#8f8f8f]">
                <MapPin className="w-3 h-3" />
                {listing.location} · {listing.timeAgo}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Load more */}
      <div className="text-center mt-6 mb-4">
        <button className="px-6 py-2.5 border border-[#e0e0e0] bg-white rounded-full text-sm font-semibold text-[#404040] hover:bg-[#f0f2f5] transition-colors">
          Daha Fazla Göster
        </button>
      </div>
    </div>
  );
}
