'use client';

import { useState, useMemo, use } from 'react';
import { Search, Plus, Heart, MapPin, MessageCircle, X, Package, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { useListings } from '@/lib/hooks/use-listings';

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffHours < 1) return 'az önce';
  if (diffHours < 24) return `${diffHours} saat`;
  if (diffDays < 30) return `${diffDays} gün`;
  return `${Math.floor(diffDays / 30)} ay`;
}

// Category mapping from slug to Turkish name.
// NOT: name alanları canlı listing_categories.name ile BİREBİR eşleşmeli (gerçek veriyi
// kategori adına göre filtrelediğimiz için). Slug'lar da canlı slug kolonuyla aynı.
const categoryMap: Record<string, { name: string; description: string }> = {
  'arac': {
    name: 'Araç',
    description: 'Bisiklet, scooter, araba aksesuarları ve araç ürünleri'
  },
  'bebek-cocuk': {
    name: 'Bebek & Çocuk',
    description: 'Bebek arabası, oyuncak, çocuk giyim ve daha fazlası'
  },
  'diger': {
    name: 'Diğer',
    description: 'Diğer kategorilere uymayan ürünler'
  },
  'elektronik': {
    name: 'Elektronik',
    description: 'Bilgisayar, telefon, tablet ve diğer elektronik ürünler'
  },
  'ev-bahce': {
    name: 'Ev & Bahçe',
    description: 'Ev dekorasyonu, bahçe aletleri ve ev tekstilleri'
  },
  'giyim': {
    name: 'Giyim',
    description: 'Elbise, gömlek, ayakkabı ve diğer giyim eşyaları'
  },
  'kitap-kirtasiye': {
    name: 'Kitap & Kırtasiye',
    description: 'Roman, teknik kitaplar, kırtasiye ve daha fazlası'
  },
  'mobilya': {
    name: 'Mobilya',
    description: 'Masa, sandalye, kanepe ve diğer ev mobilyaları'
  },
  'spor-hobi': {
    name: 'Spor & Hobi',
    description: 'Spor ekipmanı, hobi malzemeleri ve fitness ürünleri'
  },
  'ucretsiz': {
    name: 'Ücretsiz',
    description: 'Komşulardan ücretsiz paylaşılan ürünler'
  }
};

const sortOptions = [
  { label: 'En Yeni', value: 'newest' },
  { label: 'Fiyat (Düşük-Yüksek)', value: 'price-low' },
  { label: 'Fiyat (Yüksek-Düşük)', value: 'price-high' },
];

const conditionOptions = [
  { label: 'Sıfır', value: 'new' },
  { label: 'Az Kullanılmış', value: 'like_new' },
  { label: 'İyi', value: 'good' },
  { label: 'Orta', value: 'fair' },
];

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CategoryPage({ params }: PageProps) {
  // Next 16: params is a Promise even in client components — must unwrap with use().
  const { slug: slugParam } = use(params);
  const slug = slugParam.toLowerCase();
  const categoryInfo = categoryMap[slug];

  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedSort, setSelectedSort] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(8);

  // Price range filter
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Condition filter
  const [selectedConditions, setSelectedConditions] = useState<Set<string>>(new Set());

  // Gerçek ilanlar (pazar ile aynı useListings hook'u) — sahte mockListings yerine.
  // Hook'lar erken-return'dan ÖNCE çağrılmalı (React hook kuralları).
  const { data: listingsResult, isLoading: loading } = useListings({ status: 'active', limit: 100 });
  const allListings = useMemo(() => {
    if (!listingsResult?.data) return [];
    return (listingsResult.data as any[]).map((item) => ({
      id: item.id,
      title: item.title || 'Başlıksız İlan',
      price: item.price || 0,
      image: item.media_urls && item.media_urls.length > 0 ? item.media_urls[0] : null,
      neighborhood: item.neighborhoods?.name || null,
      timeAgo: item.created_at ? formatTimeAgo(new Date(item.created_at)) : '',
      condition: item.condition || null,
      category: item.listing_categories?.name || 'Diğer',
    }));
  }, [listingsResult]);

  // Redirect or handle invalid category
  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-[#f0f2f5]">
        <div className="max-w-7xl mx-auto py-12 px-4 text-center">
          <h1 className="text-2xl font-bold text-[#333] mb-2">Kategori Bulunamadı</h1>
          <p className="text-[#8f8f8f] mb-6">Aradığınız kategori mevcut değil</p>
          <Link
            href="/pazar"
            className="px-6 py-2.5 bg-[#00833e] text-white rounded-full hover:bg-[#006b32] transition-colors font-semibold inline-block"
          >
            Tüm İlanları Gör
          </Link>
        </div>
      </div>
    );
  }

  // Filter listings by category (gerçek veriden, kategori ADINA göre)
  const categoryListings = allListings.filter((l) => l.category === categoryInfo.name);


  const toggleCondition = (value: string) => {
    const next = new Set(selectedConditions);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setSelectedConditions(next);
  };

  const toggleFavorite = (id: string) => {
    const next = new Set(favorites);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setFavorites(next);
  };

  // Apply filters and sorting
  let filtered = categoryListings.filter((l) => {
    // Search filter
    if (searchQuery && !l.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Price range filter
    const min = minPrice ? parseInt(minPrice) : 0;
    const max = maxPrice ? parseInt(maxPrice) : Infinity;
    if (l.price < min || l.price > max) {
      return false;
    }

    // Condition filter
    if (selectedConditions.size > 0 && (!l.condition || !selectedConditions.has(l.condition))) {
      return false;
    }

    return true;
  });

  // Apply sorting
  filtered = [...filtered].sort((a, b) => {
    switch (selectedSort) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
      default:
        return 0;
    }
  });

  const visibleListings = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden mb-6">
          <div className="p-6">
            {/* Category Title and Description */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-[#333] mb-2">{categoryInfo.name}</h1>
              <p className="text-[#8f8f8f]">{categoryInfo.description}</p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8f8f8f]" />
              <input
                type="text"
                placeholder={`${categoryInfo.name} içinde ara`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-5 py-3 bg-[#f0f2f5] border border-[#e0e0e0] rounded-full text-sm text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e] focus:ring-opacity-30 transition"
              />
            </div>
          </div>
        </div>

        {/* Filter and Sort Options */}
        <div className="flex items-start gap-6">
          {/* Left Sidebar - Filters */}
          <div className="w-64 flex-shrink-0">
            {/* Sort Dropdown */}
            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-4 mb-4">
              <h3 className="text-sm font-bold text-[#333] mb-3">Sıralama</h3>
              <div className="space-y-2">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedSort(opt.value)}
                    className={cn(
                      'w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors',
                      selectedSort === opt.value
                        ? 'bg-[#00833e] text-white font-medium'
                        : 'text-[#404040] hover:bg-[#f0f2f5]'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-4 mb-4">
              <h3 className="text-sm font-bold text-[#333] mb-3">Fiyat Aralığı (₺)</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#8f8f8f] mb-1 block">En Az</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e0e0e0] rounded-lg text-sm focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8f8f8f] mb-1 block">En Fazla</label>
                  <input
                    type="number"
                    placeholder="Sınırsız"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e0e0e0] rounded-lg text-sm focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e]"
                  />
                </div>
              </div>
            </div>

            {/* Condition Filter */}
            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-4">
              <h3 className="text-sm font-bold text-[#333] mb-3">Durumu</h3>
              <div className="space-y-2">
                {conditionOptions.map((option) => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedConditions.has(option.value)}
                      onChange={() => toggleCondition(option.value)}
                      className="w-4 h-4 rounded border-[#e0e0e0] text-[#00833e] focus:ring-[#00833e] focus:ring-1"
                    />
                    <span className="text-sm text-[#404040] group-hover:text-[#00833e] transition-colors">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>

              {/* Clear Filters */}
              {(minPrice || maxPrice || selectedConditions.size > 0) && (
                <button
                  onClick={() => {
                    setMinPrice('');
                    setMaxPrice('');
                    setSelectedConditions(new Set());
                  }}
                  className="w-full mt-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs font-medium text-red-700 hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  Filtreleri Temizle
                </button>
              )}
            </div>
          </div>

          {/* Main Grid - Listings */}
          <div className="flex-1">
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-12 text-center">
                <p className="text-[#8f8f8f]">Yükleniyor...</p>
              </div>
            ) : visibleListings.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {visibleListings.map((listing) => (
                    <Link
                      key={listing.id}
                      href={`/pazar/ilan/${listing.id}`}
                      className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden hover:shadow-lg transition-shadow duration-200 group"
                    >
                      {/* Image Container */}
                      <div className="relative aspect-square overflow-hidden bg-[#f0f2f5]">
                        {listing.image ? (
                          <Image
                            src={listing.image}
                            alt={listing.title}
                            fill
                            unoptimized
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#8f8f8f]">
                            <Package className="w-10 h-10" />
                          </div>
                        )}

                        {/* Condition Badge */}
                        {listing.condition && (
                          <div className="absolute top-3 left-3 flex items-center gap-1">
                            <span
                              className={cn(
                                'text-xs font-bold px-2.5 py-1 rounded-md',
                                listing.condition === 'new' && 'bg-green-500 text-white',
                                listing.condition === 'like_new' && 'bg-blue-500 text-white',
                                listing.condition === 'good' && 'bg-yellow-500 text-white',
                                listing.condition === 'fair' && 'bg-orange-500 text-white'
                              )}
                            >
                              {conditionOptions.find(c => c.value === listing.condition)?.label}
                            </span>
                          </div>
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
                        {/* Price */}
                        <div className="mb-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-[#333]">
                              ₺{listing.price.toLocaleString('tr-TR')}
                            </span>
                            <span className="text-xs text-[#8f8f8f]">TL</span>
                          </div>
                        </div>

                        {/* Title */}
                        <p className="text-sm text-[#404040] line-clamp-2 mb-3 leading-snug">
                          {listing.title}
                        </p>

                        {/* Meta Info — yalnızca gerçek veriden gelen alanlar */}
                        {listing.neighborhood && (
                          <div className="flex items-center gap-1.5 text-xs text-[#8f8f8f]">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{listing.neighborhood}</span>
                          </div>
                        )}
                        {listing.timeAgo && (
                          <div className="flex items-center gap-1.5 text-xs text-[#8f8f8f] mt-1">
                            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{listing.timeAgo}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center mb-6">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 8)}
                      className="px-8 py-3 border border-[#e0e0e0] bg-white rounded-full text-sm font-semibold text-[#404040] hover:bg-[#f0f2f5] transition-colors shadow-sm"
                    >
                      Daha Fazla Göster ({filtered.length - visibleCount} ilan daha)
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-12 text-center">
                <h3 className="text-lg font-semibold text-[#333] mb-2">İlan Bulunamadı</h3>
                <p className="text-[#8f8f8f] mb-6">
                  Arama kriterlerinize uygun ilan bulunmamaktadır. Filtreleri değiştirerek tekrar deneyin.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setMinPrice('');
                    setMaxPrice('');
                    setSelectedConditions(new Set());
                  }}
                  className="px-6 py-2.5 bg-[#00833e] text-white rounded-full hover:bg-[#006b32] transition-colors font-semibold text-sm"
                >
                  Filtreleri Temizle
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
          <div className="flex items-start gap-4">
            <MessageCircle className="w-6 h-6 text-[#00833e] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-[#333] mb-1">Doğru İlanı bulamadınız mı?</h3>
              <p className="text-sm text-[#8f8f8f] mb-3">
                Komşularınıza istediğiniz ürünü arayışınızı bildirin ve direkt olarak teklif alın.
              </p>
              <Link
                href="/pazar/ilan-ver"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#00833e] text-white rounded-full hover:bg-[#006b32] transition-colors font-semibold text-sm"
              >
                <Plus className="w-4 h-4" />
                Aranan İlan Oluştur
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
