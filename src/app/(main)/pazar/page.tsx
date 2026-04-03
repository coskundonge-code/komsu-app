'use client';

import { useState, useEffect } from 'react';
import { Plus, Heart, MapPin, ChevronDown, X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images';
import { getListings } from '@/lib/hooks/use-listings';

const tabs = [
  { id: 'all', label: 'Tüm İlanlar' },
  { id: 'rental', label: 'Kirala & Ödünç Ver' },
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
  'Ev & Yaşam',
  'Spor Malzemeleri',
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

const priceRanges = [
  { label: 'Tümü', value: null },
  { label: '0 - 500 ₺', value: { min: 0, max: 500 } },
  { label: '500 - 2,000 ₺', value: { min: 500, max: 2000 } },
  { label: '2,000 - 5,000 ₺', value: { min: 2000, max: 5000 } },
  { label: '5,000+ ₺', value: { min: 5000, max: null } },
];

const conditions = [
  { label: 'Tümü', value: null },
  { label: 'Sıfır', value: 'new' },
  { label: 'Az Kullanılmış', value: 'barely-used' },
  { label: 'İyi', value: 'good' },
  { label: 'Orta', value: 'fair' },
];

const mockListings = [
  {
    id: '1',
    title: 'Laptop Lenovo IdeaPad 5 - Az Kullanılmış',
    price: 8500,
    image: getFeedImageUrl(18, 500, 500),
    location: 'Kadıköy',
    neighborhood: 'Moda',
    timeAgo: '2 saat',
    distance: '2 km',
    isFree: false,
    featured: true,
    category: 'Elektronik',
    condition: 'barely-used',
    rating: 4.8,
    reviewCount: 12,
  },
  {
    id: '2',
    title: 'IKEA Kanepe - Açık Gri Renk, Çok İyi Durumda',
    price: 2200,
    image: getFeedImageUrl(19, 500, 500),
    location: 'Moda',
    neighborhood: 'Moda',
    timeAgo: '4 saat',
    distance: '1 km',
    isFree: false,
    featured: true,
    category: 'Mobilya',
    condition: 'good',
    rating: 5,
    reviewCount: 8,
  },
  {
    id: '3',
    title: 'Nike Spor Ayakkabı - Beden 42, Siyah',
    price: 450,
    image: getFeedImageUrl(20, 500, 500),
    location: 'Caferağa',
    neighborhood: 'Caferağa',
    timeAgo: '5 saat',
    distance: '3 km',
    isFree: false,
    featured: false,
    category: 'Giyim',
    condition: 'barely-used',
    rating: 4.6,
    reviewCount: 5,
  },
  {
    id: '4',
    title: 'Çocuk Kitapları Seti - 20 Adet',
    price: 0,
    image: getFeedImageUrl(21, 500, 500),
    location: 'Kadıköy',
    neighborhood: 'Güzeltepe',
    timeAgo: '6 saat',
    distance: '4 km',
    isFree: true,
    featured: false,
    category: 'Kitaplar',
    condition: 'good',
    rating: 4.9,
    reviewCount: 15,
  },
  {
    id: '5',
    title: 'Dumbbell Seti 20kg - Yeni, Ambalajında',
    price: 1200,
    image: getFeedImageUrl(22, 500, 500),
    location: 'Moda',
    neighborhood: 'Moda',
    timeAgo: '1 gün',
    distance: '1 km',
    isFree: false,
    featured: false,
    category: 'Spor Malzemeleri',
    condition: 'new',
    rating: 5,
    reviewCount: 3,
  },
  {
    id: '6',
    title: 'PlayStation 5 - Orjinal Kutu ile Satılıyor',
    price: 6500,
    image: getFeedImageUrl(23, 500, 500),
    location: 'Kadıköy',
    neighborhood: 'Fenerbahçe',
    timeAgo: '1 gün',
    distance: '2 km',
    isFree: false,
    featured: true,
    category: 'Elektronik',
    condition: 'new',
    rating: 4.7,
    reviewCount: 9,
  },
  {
    id: '7',
    title: 'Ahşap Yemek Masası - Masif Ceviz',
    price: 1800,
    image: getFeedImageUrl(24, 500, 500),
    location: 'Fenerbahçe',
    neighborhood: 'Fenerbahçe',
    timeAgo: '1 gün',
    distance: '5 km',
    isFree: false,
    featured: false,
    category: 'Mobilya',
    condition: 'good',
    rating: 4.5,
    reviewCount: 6,
  },
  {
    id: '8',
    title: 'Bebek Arabası - Stroller, İyi Durumda',
    price: 0,
    image: getFeedImageUrl(25, 500, 500),
    location: 'Moda',
    neighborhood: 'Moda',
    timeAgo: '2 gün',
    distance: '1 km',
    isFree: true,
    featured: false,
    category: 'Ev & Yaşam',
    condition: 'good',
    rating: 4.8,
    reviewCount: 11,
  },
  {
    id: '9',
    title: 'Samsung Galaxy Tab S9 - 11 inç, Gümüş',
    price: 4200,
    image: getFeedImageUrl(26, 500, 500),
    location: 'Caferağa',
    neighborhood: 'Caferağa',
    timeAgo: '2 gün',
    distance: '3 km',
    isFree: false,
    featured: false,
    category: 'Elektronik',
    condition: 'barely-used',
    rating: 4.7,
    reviewCount: 7,
  },
  {
    id: '10',
    title: 'Ahşap Kitaplık - Antika, Dekoratif',
    price: 800,
    image: getFeedImageUrl(27, 500, 500),
    location: 'Kadıköy',
    neighborhood: 'Fenerbahçe',
    timeAgo: '3 saat',
    distance: '2 km',
    isFree: false,
    featured: false,
    category: 'Mobilya',
    condition: 'fair',
    rating: 4.3,
    reviewCount: 4,
  },
  {
    id: '11',
    title: 'Bisiklet Kask - Derece Standartlı',
    price: 250,
    image: getFeedImageUrl(28, 500, 500),
    location: 'Moda',
    neighborhood: 'Moda',
    timeAgo: '5 saat',
    distance: '1 km',
    isFree: false,
    featured: false,
    category: 'Spor Malzemeleri',
    condition: 'good',
    rating: 4.8,
    reviewCount: 10,
  },
  {
    id: '12',
    title: 'Ütü Masası - Profesyonel, Metal Yapı',
    price: 350,
    image: getFeedImageUrl(29, 500, 500),
    location: 'Fenerbahçe',
    neighborhood: 'Fenerbahçe',
    timeAgo: '6 saat',
    distance: '5 km',
    isFree: false,
    featured: false,
    category: 'Ev & Yaşam',
    condition: 'good',
    rating: 4.6,
    reviewCount: 5,
  },
  {
    id: '13',
    title: 'LED Panel Işık Seti - Fotoğrafçılık için',
    price: 1500,
    image: getFeedImageUrl(30, 500, 500),
    location: 'Caferağa',
    neighborhood: 'Caferağa',
    timeAgo: '1 gün',
    distance: '3 km',
    isFree: false,
    featured: false,
    category: 'Elektronik',
    condition: 'barely-used',
    rating: 4.9,
    reviewCount: 8,
  },
  {
    id: '14',
    title: 'Kulaklık - Bluetooth, Beyaz',
    price: 0,
    image: getFeedImageUrl(31, 500, 500),
    location: 'Kadıköy',
    neighborhood: 'Moda',
    timeAgo: '2 gün',
    distance: '2 km',
    isFree: true,
    featured: false,
    category: 'Elektronik',
    condition: 'good',
    rating: 4.7,
    reviewCount: 6,
  },
  {
    id: '15',
    title: 'Golf Topu Seti - 50 Adet, Yeni',
    price: 650,
    image: getFeedImageUrl(32, 500, 500),
    location: 'Şişli',
    neighborhood: 'Teşvikiye',
    timeAgo: '3 saat',
    distance: '4 km',
    isFree: false,
    featured: false,
    category: 'Spor Malzemeleri',
    condition: 'new',
    rating: 5,
    reviewCount: 2,
  },
  {
    id: '16',
    title: 'Vintage Türk Halısı - 2x3m',
    price: 5200,
    image: getFeedImageUrl(33, 500, 500),
    location: 'Moda',
    neighborhood: 'Moda',
    timeAgo: '4 saat',
    distance: '1 km',
    isFree: false,
    featured: false,
    category: 'Ev & Yaşam',
    condition: 'fair',
    rating: 4.4,
    reviewCount: 7,
  },
];

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(6);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number | null } | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState('newest');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Fetch real listings on mount
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data, error } = await getListings({ status: 'active', limit: 50 });
        if (data) {
          // Transform DB data to UI format
          const transformed = (data as any[]).map((item: any) => ({
            id: item.id,
            title: item.title || 'Başlıksız İlan',
            price: item.price || 0,
            listing_type: item.listing_type || 'sale',
            image: (item.media_urls && item.media_urls.length > 0 ? item.media_urls[0] : null) || getFeedImageUrl(Math.floor(Math.random() * 30) + 1, 500, 500),
            location: item.neighborhood || 'Bilinmiyor',
            neighborhood: item.neighborhood || 'Bilinmiyor',
            timeAgo: item.created_at ? formatTimeAgo(new Date(item.created_at)) : '1 saat',
            distance: `${Math.floor(Math.random() * 10) + 1} km`, // Fallback
            isFree: (item.price === 0 || item.price === null),
            featured: Math.random() > 0.7,
            category: (item as any).listing_categories?.name || 'Diğer',
            condition: item.item_condition || 'good',
            rating: Math.random() * 2 + 3,
            reviewCount: Math.floor(Math.random() * 20),
          }));
          setListings(transformed);
        } else if (error) {
          console.warn('Error fetching listings:', error);
          setListings(mockListings);
        }
      } catch (err) {
        console.error('Error:', err);
        setListings(mockListings);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffHours < 24) return `${diffHours} saat`;
    if (diffDays < 30) return `${diffDays} gün`;
    return `${Math.floor(diffDays / 30)} ay`;
  };

  const toggleFavorite = (id: string) => {
    const next = new Set(favorites);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setFavorites(next);
  };

  // Apply filters and sorting
  let allFiltered = (listings.length > 0 ? listings : mockListings).filter((l) => {
    if (activeTab === 'saved' && !favorites.has(l.id)) return false;
    if (activeTab === 'rental' && l.listing_type !== 'rental' && l.listing_type !== 'lend') return false;
    if (activeTab === 'yours') return false; // handled separately
    if (selectedCategory && l.category !== selectedCategory) return false;
    if (selectedDistance && parseFloat(l.distance) > selectedDistance) return false;
    if (selectedCondition && l.condition !== selectedCondition) return false;
    if (selectedPriceRange) {
      const price = l.price;
      if (price < selectedPriceRange.min) return false;
      if (selectedPriceRange.max !== null && price > selectedPriceRange.max) return false;
    }
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

  const featuredListings = (listings.length > 0 ? listings : mockListings).filter((l) => l.featured);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
        {/* Featured Carousel */}
        {featuredListings.length > 0 && (
          <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="p-4">
              <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Öne Çıkanlar
              </h2>
              <div className="overflow-x-auto pb-2 -mx-4 px-4">
                <div className="flex gap-4">
                  {featuredListings.map((listing) => (
                    <Link
                      key={listing.id}
                      href={`/pazar/ilan/${listing.id}`}
                      className="flex-shrink-0 w-56 bg-surface border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
                    >
                      <div className="relative aspect-video overflow-hidden bg-background">
                        <Image
                          src={listing.image}
                          alt={listing.title}
                          fill
                          unoptimized
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                          ÖNE ÇIKAN
                        </span>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-semibold text-text-primary line-clamp-2 mb-1">
                          {listing.title}
                        </p>
                        <p className="text-lg font-bold text-primary mb-1">
                          {listing.isFree ? "Ücretsiz" : `₺${listing.price.toLocaleString("tr-TR")}`}
                        </p>
                        <p className="text-xs text-text-muted">
                          {listing.neighborhood} • {listing.timeAgo}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="p-6">
            {/* Title and Action Button */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-text-primary">Satılık ve Ücretsiz</h1>
              <Link
                href="/pazar/ilan-ver"
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors text-sm font-semibold shadow-sm"
              >
                <Plus className="w-4 h-4" />
                İlan Ver
              </Link>
            </div>


            {/* Tabs */}
            <div className="flex gap-0 border-b border-border -mx-6 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-5 py-4 text-sm font-medium border-b-[3px] transition-colors',
                    activeTab === tab.id
                      ? 'text-primary border-primary'
                      : 'text-text-muted border-transparent hover:text-text-secondary'
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
                  ? 'bg-primary text-white border border-primary'
                  : 'bg-surface border border-border text-text-secondary hover:bg-surface-hover'
              )}
            >
              {selectedCategory || 'Kategoriler'}
              <ChevronDown className={cn('w-4 h-4', openDropdown === 'category' && 'rotate-180')} />
            </button>
            {openDropdown === 'category' && (
              <div className="absolute top-full left-0 mt-2 bg-surface border border-border rounded-lg shadow-lg z-50 min-w-48">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-text-muted hover:bg-surface-hover border-b border-border"
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
                        ? 'bg-primary text-white font-medium'
                        : 'text-text-secondary hover:bg-surface-hover'
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
                  ? 'bg-primary text-white border border-primary'
                  : 'bg-surface border border-border text-text-secondary hover:bg-surface-hover'
              )}
            >
              {selectedDistance ? `${selectedDistance} km` : 'Mesafe'}
              <ChevronDown className={cn('w-4 h-4', openDropdown === 'distance' && 'rotate-180')} />
            </button>
            {openDropdown === 'distance' && (
              <div className="absolute top-full left-0 mt-2 bg-surface border border-border rounded-lg shadow-lg z-50">
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
                        ? 'bg-primary text-white font-medium'
                        : 'text-text-secondary hover:bg-surface-hover'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Range Filter */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-colors',
                selectedPriceRange
                  ? 'bg-primary text-white border border-primary'
                  : 'bg-surface border border-border text-text-secondary hover:bg-surface-hover'
              )}
            >
              {selectedPriceRange ? 'Fiyat Aralığı' : 'Fiyat'}
              <ChevronDown className={cn('w-4 h-4', openDropdown === 'price' && 'rotate-180')} />
            </button>
            {openDropdown === 'price' && (
              <div className="absolute top-full left-0 mt-2 bg-surface border border-border rounded-lg shadow-lg z-50 min-w-48">
                {priceRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => {
                      setSelectedPriceRange(range.value);
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      'w-full text-left px-4 py-3 text-sm transition-colors',
                      selectedPriceRange === range.value
                        ? 'bg-primary text-white font-medium'
                        : 'text-text-secondary hover:bg-surface-hover'
                    )}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Condition Filter */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'condition' ? null : 'condition')}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-colors',
                selectedCondition
                  ? 'bg-primary text-white border border-primary'
                  : 'bg-surface border border-border text-text-secondary hover:bg-surface-hover'
              )}
            >
              Durum
              <ChevronDown className={cn('w-4 h-4', openDropdown === 'condition' && 'rotate-180')} />
            </button>
            {openDropdown === 'condition' && (
              <div className="absolute top-full left-0 mt-2 bg-surface border border-border rounded-lg shadow-lg z-50 min-w-48">
                {conditions.map((cond) => (
                  <button
                    key={cond.label}
                    onClick={() => {
                      setSelectedCondition(cond.value);
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      'w-full text-left px-4 py-3 text-sm transition-colors',
                      selectedCondition === cond.value
                        ? 'bg-primary text-white font-medium'
                        : 'text-text-secondary hover:bg-surface-hover'
                    )}
                  >
                    {cond.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort Filter */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
              className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-border rounded-full text-sm font-medium text-text-secondary hover:bg-surface-hover transition-colors whitespace-nowrap shadow-sm"
            >
              Sıralama
              <ChevronDown className={cn('w-4 h-4 text-text-muted', openDropdown === 'sort' && 'rotate-180')} />
            </button>
            {openDropdown === 'sort' && (
              <div className="absolute top-full left-0 mt-2 bg-surface border border-border rounded-lg shadow-lg z-50">
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
                        ? 'bg-primary text-white font-medium'
                        : 'text-text-secondary hover:bg-surface-hover'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Filters Display */}
          {(selectedCategory || selectedDistance || selectedPriceRange || selectedCondition) && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedDistance(null);
                setSelectedPriceRange(null);
                setSelectedCondition(null);
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
        <div>
          {/* Listings Grid - Full Width */}
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/pazar/ilan/${listing.id}`}
                  className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition-shadow duration-200 group"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-background">
                    <Image
                      src={listing.image}
                      alt={listing.title}
                      fill
                      unoptimized
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {/* Free Badge */}
                    {listing.isFree && (
                      <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-md">
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
                      className="absolute top-3 right-3 p-2 bg-surface/95 rounded-full hover:bg-surface transition-colors shadow-md"
                      aria-label="Kaydet"
                    >
                      <Heart
                        className={cn(
                          'w-5 h-5',
                          favorites.has(listing.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-text-secondary'
                        )}
                      />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Price - Bold with improved formatting */}
                    <div className="mb-1">
                      {listing.isFree ? (
                        <span className="text-lg font-bold text-primary">Ücretsiz</span>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-text-primary">₺{listing.price.toLocaleString('tr-TR')}</span>
                          <span className="text-xs text-text-muted">TL</span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <p className="text-sm text-text-secondary line-clamp-2 mb-3 leading-snug">
                      {listing.title}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">
                        {listing.timeAgo} • {listing.distance}
                      </span>
                    </div>
                    <div className="text-xs text-text-muted mb-2">
                      {listing.neighborhood}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-primary">★ {listing.rating}</span>
                      <span className="text-xs text-text-muted">({listing.reviewCount})</span>
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
                  className="px-8 py-3 border border-border bg-surface rounded-full text-sm font-semibold text-text-secondary hover:bg-surface-hover transition-colors shadow-sm"
                >
                  Daha Fazla Göster ({allFiltered.length - visibleCount} ilan daha)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
