'use client';

import { useState } from 'react';
import { Search, Plus, Heart, MapPin, ChevronDown, MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

const tabs = [
  { id: 'all', label: 'Tüm İlanlar' },
  { id: 'yours', label: 'İlanlarınız' },
  { id: 'saved', label: 'Kaydedilenler' },
];

const categories = [
  'Elektronik',
  'Mobilya',
  'Giyim',
  'Spor',
  'Kitaplar',
  'Bahçe',
  'Oyuncak',
  'Diğer',
];

const distanceOptions = [
  { label: '1 km', value: 1 },
  { label: '3 km', value: 3 },
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 },
  { label: 'Tümü', value: null },
];

const sortOptions = [
  { label: 'En Yeni', value: 'newest' },
  { label: 'En Düşük Fiyat', value: 'price-low' },
  { label: 'En Yüksek Fiyat', value: 'price-high' },
  { label: 'En Yakın', value: 'nearest' },
];

const mockListings = [
  {
    id: '1',
    title: 'Laptop Lenovo IdeaPad 5 - Az Kullanılmış',
    price: 8500,
    image: 'https://picsum.photos/500/500?random=18',
    location: 'Kadıköy',
    neighborhood: 'Moda',
    timeAgo: '2 saat',
    distance: '2 km',
    isFree: false,
    category: 'Elektronik',
  },
  {
    id: '2',
    title: 'IKEA Kanepe - Açık Gri Renk, Çok İyi Durumda',
    price: 2200,
    image: 'https://picsum.photos/500/500?random=19',
    location: 'Moda',
    neighborhood: 'Moda',
    timeAgo: '4 saat',
    distance: '1 km',
    isFree: false,
    category: 'Mobilya',
  },
  {
    id: '3',
    title: 'Nike Spor Ayakkabı - Beden 42, Siyah',
    price: 450,
    image: 'https://picsum.photos/500/500?random=20',
    location: 'Caferağa',
    neighborhood: 'Caferağa',
    timeAgo: '5 saat',
    distance: '3 km',
    isFree: false,
    category: 'Giyim',
  },
  {
    id: '4',
    title: 'Çocuk Kitapları Seti - 20 Adet',
    price: 0,
    image: 'https://picsum.photos/500/500?random=21',
    location: 'Kadıköy',
    neighborhood: 'Güzeltepe',
    timeAgo: '6 saat',
    distance: '4 km',
    isFree: true,
    category: 'Kitaplar',
  },
  {
    id: '5',
    title: 'Dumbbell Seti 20kg - Yeni, Ambalajında',
    price: 1200,
    image: 'https://picsum.photos/500/500?random=22',
    location: 'Moda',
    neighborhood: 'Moda',
    timeAgo: '1 gün',
    distance: '1 km',
    isFree: false,
    category: 'Spor',
  },
  {
    id: '6',
    title: 'PlayStation 5 - Orjinal Kutu ile Satılıyor',
    price: 6500,
    image: 'https://picsum.photos/500/500?random=23',
    location: 'Kadıköy',
    neighborhood: 'Fenerbahçe',
    timeAgo: '1 gün',
    distance: '2 km',
    isFree: false,
    category: 'Oyun Konsolleri',
  },
  {
    id: '7',
    title: 'Ahşap Yemek Masası - Masif Ceviz',
    price: 1800,
    image: 'https://picsum.photos/500/500?random=24',
    location: 'Fenerbahçe',
    neighborhood: 'Fenerbahçe',
    timeAgo: '1 gün',
    distance: '5 km',
    isFree: false,
    category: 'Mobilya',
  },
  {
    id: '8',
    title: 'Bebek Arabası - Stroller, İyi Durumda',
    price: 0,
    image: 'https://picsum.photos/500/500?random=25',
    location: 'Moda',
    neighborhood: 'Moda',
    timeAgo: '2 gün',
    distance: '1 km',
    isFree: true,
    category: 'Bebek Ürünleri',
  },
  {
    id: '9',
    title: 'Samsung Galaxy Tab S9 - 11 inç, Gümüş',
    price: 4200,
    image: 'https://picsum.photos/500/500?random=26',
    location: 'Caferağa',
    neighborhood: 'Caferağa',
    timeAgo: '2 gün',
    distance: '3 km',
    isFree: false,
    category: 'Tablet',
  },
  {
    id: '10',
    title: 'Eski Kütüphaneler - Antika, Dekoratif',
    price: 800,
    image: 'https://picsum.photos/500/500?random=27',
    location: 'Kadıköy',
    neighborhood: 'Fenerbahçe',
    timeAgo: '3 saat',
    distance: '2 km',
    isFree: false,
    category: 'Antikalar',
  },
  {
    id: '11',
    title: 'Bisiklet Kask - Derece Standartlı',
    price: 250,
    image: 'https://picsum.photos/500/500?random=28',
    location: 'Moda',
    neighborhood: 'Moda',
    timeAgo: '5 saat',
    distance: '1 km',
    isFree: false,
    category: 'Spor',
  },
  {
    id: '12',
    title: 'Ütü Masası - Profesyonel, Metal Yapı',
    price: 350,
    image: 'https://picsum.photos/500/500?random=29',
    location: 'Fenerbahçe',
    neighborhood: 'Fenerbahçe',
    timeAgo: '6 saat',
    distance: '5 km',
    isFree: false,
    category: 'Ev Eşyaları',
  },
  {
    id: '13',
    title: 'LED Panel Işık Seti - Fotoğrafçılık için',
    price: 1500,
    image: 'https://picsum.photos/500/500?random=30',
    location: 'Caferağa',
    neighborhood: 'Caferağa',
    timeAgo: '1 gün',
    distance: '3 km',
    isFree: false,
    category: 'Fotoğrafçılık',
  },
  {
    id: '14',
    title: 'Kulaklık - Bluetooth, Beyaz',
    price: 0,
    image: 'https://picsum.photos/500/500?random=31',
    location: 'Kadıköy',
    neighborhood: 'Moda',
    timeAgo: '2 gün',
    distance: '2 km',
    isFree: true,
    category: 'Elektronik',
  },
];

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(6);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
  const [selectedSort, setSelectedSort] = useState('newest');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleFavorite = (id: string) => {
    const next = new Set(favorites);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setFavorites(next);
  };

  // Apply filters and sorting
  let allFiltered = mockListings.filter((l) => {
    if (searchQuery && !l.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeTab === 'saved' && !favorites.has(l.id)) return false;
    if (selectedCategory && l.category !== selectedCategory) return false;
    if (selectedDistance && parseFloat(l.distance) > selectedDistance) return false;
    return true;
  });

  // Apply sorting
  allFiltered = [...allFiltered].sort((a, b) => {
    switch (selectedSort) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'nearest':
        return parseFloat(a.distance) - parseFloat(b.distance);
      case 'newest':
      default:
        return 0;
    }
  });

  const filtered = allFiltered.slice(0, visibleCount);
  const hasMore = visibleCount < allFiltered.length;

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden mb-6">
          <div className="p-6">
            {/* Title and Action Button */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-[#333]">Satılık ve Ücretsiz</h1>
              <Link
                href="/pazar/ilan-ver"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#00833e] text-white rounded-full hover:bg-[#006b32] transition-colors text-sm font-semibold shadow-sm"
              >
                <Plus className="w-4 h-4" />
                İlan Ver
              </Link>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8f8f8f]" />
              <input
                type="text"
                placeholder="Tüm ilanları ara"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-5 py-3 bg-[#f0f2f5] border border-[#e0e0e0] rounded-full text-sm text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e] focus:ring-opacity-30 transition"
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-0 border-b border-[#e0e0e0] -mx-6 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-5 py-4 text-sm font-medium border-b-[3px] transition-colors',
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

        {/* Filter Pills */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 -mx-4 px-4">
          {/* Category Filter */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-colors',
                selectedCategory
                  ? 'bg-[#00833e] text-white border border-[#00833e]'
                  : 'bg-white border border-[#e0e0e0] text-[#404040] hover:bg-[#f0f2f5]'
              )}
            >
              {selectedCategory || 'Kategoriler'}
              <ChevronDown className={cn('w-4 h-4', openDropdown === 'category' && 'rotate-180')} />
            </button>
            {openDropdown === 'category' && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-[#e0e0e0] rounded-lg shadow-lg z-50 min-w-48">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-[#8f8f8f] hover:bg-[#f0f2f5] border-b border-[#e0e0e0]"
                >
                  Tüm Kategoriler
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      'w-full text-left px-4 py-3 text-sm transition-colors',
                      selectedCategory === cat
                        ? 'bg-[#00833e] text-white font-medium'
                        : 'text-[#404040] hover:bg-[#f0f2f5]'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Distance Filter */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'distance' ? null : 'distance')}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-colors',
                selectedDistance
                  ? 'bg-[#00833e] text-white border border-[#00833e]'
                  : 'bg-white border border-[#e0e0e0] text-[#404040] hover:bg-[#f0f2f5]'
              )}
            >
              {selectedDistance ? `${selectedDistance} km` : 'Mesafe'}
              <ChevronDown className={cn('w-4 h-4', openDropdown === 'distance' && 'rotate-180')} />
            </button>
            {openDropdown === 'distance' && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-[#e0e0e0] rounded-lg shadow-lg z-50">
                {distanceOptions.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setSelectedDistance(opt.value);
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      'w-full text-left px-4 py-3 text-sm transition-colors whitespace-nowrap',
                      selectedDistance === opt.value
                        ? 'bg-[#00833e] text-white font-medium'
                        : 'text-[#404040] hover:bg-[#f0f2f5]'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort Filter */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#e0e0e0] rounded-full text-sm font-medium text-[#404040] hover:bg-[#f0f2f5] transition-colors whitespace-nowrap shadow-sm"
            >
              Sıralama
              <ChevronDown className={cn('w-4 h-4 text-[#8f8f8f]', openDropdown === 'sort' && 'rotate-180')} />
            </button>
            {openDropdown === 'sort' && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-[#e0e0e0] rounded-lg shadow-lg z-50">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSelectedSort(opt.value);
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      'w-full text-left px-4 py-3 text-sm transition-colors whitespace-nowrap',
                      selectedSort === opt.value
                        ? 'bg-[#00833e] text-white font-medium'
                        : 'text-[#404040] hover:bg-[#f0f2f5]'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Filters Display */}
          {(selectedCategory || selectedDistance) && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedDistance(null);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-full text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
              title="Filtreleri temizle"
            >
              <X className="w-4 h-4" />
              Temizle
            </button>
          )}
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Listings Grid - Takes 3 columns on desktop */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/pazar/ilan/${listing.id}`}
                  className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden hover:shadow-lg transition-shadow duration-200 group"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-[#f0f2f5]">
                    <Image
                      src={listing.image}
                      alt={listing.title}
                      fill
                      unoptimized
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {/* Free Badge */}
                    {listing.isFree && (
                      <span className="absolute top-3 left-3 bg-[#00833e] text-white text-xs font-bold px-3 py-1 rounded-md">
                        ÜCRETSİZ
                      </span>
                    )}
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(listing.id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/95 rounded-full hover:bg-white transition-colors shadow-md"
                      aria-label="Kaydet"
                    >
                      <Heart
                        className={cn(
                          'w-5 h-5',
                          favorites.has(listing.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-[#404040]'
                        )}
                      />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Price - Bold with improved formatting */}
                    <div className="mb-1">
                      {listing.isFree ? (
                        <span className="text-lg font-bold text-[#00833e]">Ücretsiz</span>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-[#333]">₺{listing.price.toLocaleString('tr-TR')}</span>
                          <span className="text-xs text-[#8f8f8f]">TL</span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <p className="text-sm text-[#404040] line-clamp-2 mb-3 leading-snug">
                      {listing.title}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-1.5 text-xs text-[#8f8f8f]">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">
                        {listing.timeAgo} • {listing.distance}
                      </span>
                    </div>
                    <div className="text-xs text-[#8f8f8f] mt-1">
                      {listing.neighborhood}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-8 py-3 border border-[#e0e0e0] bg-white rounded-full text-sm font-semibold text-[#404040] hover:bg-[#f0f2f5] transition-colors shadow-sm"
                >
                  Daha Fazla Göster ({allFiltered.length - visibleCount} ilan daha)
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar - Chat Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white rounded-lg shadow-md border border-[#e0e0e0] overflow-hidden">
              <div className="bg-gradient-to-br from-[#00833e] to-[#006b32] p-6 text-white">
                <div className="flex items-start gap-3 mb-4">
                  <MessageCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-bold mb-1">
                      Satılık ve Ücretsiz Sohbetleri
                    </h3>
                    <p className="text-sm text-green-100">
                      Komşularınız soru soruyor
                    </p>
                  </div>
                </div>

                <div className="space-y-3 bg-white/10 rounded-lg p-4 mb-4">
                  <div className="text-sm text-green-50">
                    <span className="font-semibold">Ayşe K.:</span> Bu laptop halen var mı?
                  </div>
                  <div className="text-sm text-green-50">
                    <span className="font-semibold">Mert D.:</span> Kanepenin boyutları kaç?
                  </div>
                  <div className="text-sm text-green-50">
                    <span className="font-semibold">Zeynep S.:</span> Teslimat yapılıyor mu?
                  </div>
                </div>

                <Link href="/mesajlar" className="block w-full px-4 py-2.5 bg-white text-[#00833e] rounded-full font-semibold text-sm hover:bg-green-50 transition-colors text-center">
                  Sohbeti Aç
                </Link>
              </div>

              <div className="p-4 bg-[#f0f2f5]">
                <p className="text-xs text-[#8f8f8f] text-center">
                  Bu hafta {filtered.length} yeni ilan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
