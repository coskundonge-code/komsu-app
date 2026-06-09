'use client';

import { useState, useMemo } from 'react';
import { Plus, Heart, MapPin, ChevronDown, X, Package, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { useListings } from '@/lib/hooks/use-listings';
import { useCurrentUser } from '@/lib/hooks/use-auth';

// NOT (2026-06-07): Bu sayfa eskiden boş DB'de 16 sahte ilan (mockListings + demo-images)
// gösteriyordu; ayrıca GERÇEK ilanları bile uydurma verilerle süslüyordu: rastgele demo
// görsel (media_urls boşsa), Math.random() ile "mesafe", "puan" ve "yorum sayısı", ve var
// olmayan is_featured kolonuna dayanan "Öne Çıkanlar" karuseli. Hepsi kaldırıldı; sayfa
// artık yalnızca gerçek listings verisini gösteriyor. Mesafe filtresi de kaldırıldı çünkü
// kullanıcı konumu + haversine olmadan gerçek mesafe hesaplanamıyordu. Bkz. TECH_DEBT #12.

const tabs = [
  { id: 'all', label: 'Tüm İlanlar' },
  { id: 'rental', label: 'Kirala & Ödünç Ver' },
  { id: 'yours', label: 'İlanlarınız' },
  { id: 'saved', label: 'Kaydedilenler' },
];

const sortOptions = [
  { label: 'En Yeni', value: 'newest' },
  { label: 'En Düşük Fiyat', value: 'price-low' },
  { label: 'En Yüksek Fiyat', value: 'price-high' },
];

const priceRanges = [
  { label: 'Tümü', value: null },
  { label: '0 - 500 ₺', value: { min: 0, max: 500 } },
  { label: '500 - 2,000 ₺', value: { min: 500, max: 2000 } },
  { label: '2,000 - 5,000 ₺', value: { min: 2000, max: 5000 } },
  { label: '5,000+ ₺', value: { min: 5000, max: null } },
];

// listing_condition enum (types.ts): new | like_new | good | fair
const conditions = [
  { label: 'Tümü', value: null },
  { label: 'Sıfır', value: 'new' },
  { label: 'Az Kullanılmış', value: 'like_new' },
  { label: 'İyi', value: 'good' },
  { label: 'Orta', value: 'fair' },
];

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

export default function MarketplacePage() {
  const { user } = useCurrentUser();
  const [activeTab, setActiveTab] = useState('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(12);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number | null } | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState('newest');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const { data: listingsResult, isLoading: loading } = useListings({ status: 'active', limit: 50 });

  const listings = useMemo(() => {
    if (!listingsResult?.data) return [];
    return (listingsResult.data as any[]).map((item) => ({
      id: item.id,
      sellerId: item.seller_id,
      title: item.title || 'Başlıksız İlan',
      price: item.price || 0,
      listing_type: item.listing_type || 'sale',
      image: item.media_urls && item.media_urls.length > 0 ? item.media_urls[0] : null,
      neighborhood: item.neighborhoods?.name || null,
      timeAgo: item.created_at ? formatTimeAgo(new Date(item.created_at)) : '',
      isFree: item.price === 0 || item.price === null || item.listing_type === 'free',
      category: item.listing_categories?.name || 'Diğer',
      condition: item.condition || null,
    }));
  }, [listingsResult]);

  // Kategori seçenekleri gerçek ilanlardan türetiliyor (sabit liste yok → filtre her
  // zaman gerçek veriyle eşleşir).
  const categories = useMemo(
    () => Array.from(new Set(listings.map((l) => l.category).filter(Boolean))) as string[],
    [listings]
  );

  const toggleFavorite = (id: string) => {
    const next = new Set(favorites);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setFavorites(next);
  };

  let allFiltered = listings.filter((l) => {
    if (activeTab === 'saved' && !favorites.has(l.id)) return false;
    if (activeTab === 'yours' && l.sellerId !== user?.id) return false;
    if (activeTab === 'rental' && l.listing_type !== 'rental' && l.listing_type !== 'lend') return false;
    if (selectedCategory && l.category !== selectedCategory) return false;
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
      case 'newest':
      default:
        return 0;
    }
  });

  const filtered = allFiltered.slice(0, visibleCount);
  const hasMore = visibleCount < allFiltered.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
        {/* Header Section */}
        <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="p-6">
            {/* Title and Action Button */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-text-primary">Pazar</h1>
              <Link
                href="/pazar/ilan-ver"
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors text-sm font-semibold shadow-sm"
              >
                <Plus className="w-4 h-4" />
                İlan Ver
              </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 border-b border-border -mx-6 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-5 py-4 text-sm font-medium border-b-[3px] transition-colors whitespace-nowrap',
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
          {categories.length > 0 && (
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
          )}

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
          {(selectedCategory || selectedPriceRange || selectedCondition) && (
            <button
              onClick={() => {
                setSelectedCategory(null);
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

        {/* Listings Grid */}
        <div>
          {loading ? (
            <div className="text-center py-16 text-text-muted">Yükleniyor...</div>
          ) : filtered.length === 0 ? (
            <div className="bg-surface rounded-xl border border-border p-12 text-center">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {activeTab === 'saved'
                  ? 'Kaydedilen ilan yok'
                  : activeTab === 'yours'
                  ? 'Henüz ilanınız yok'
                  : 'Henüz ilan yok'}
              </h3>
              <p className="text-text-muted mb-6">
                {activeTab === 'saved'
                  ? 'Beğendiğin ilanları kalp simgesiyle buraya ekleyebilirsin.'
                  : activeTab === 'yours'
                  ? 'İlk ilanını vererek komşularınla paylaşmaya başla.'
                  : 'Bu mahallede ilk ilanı sen verebilirsin.'}
              </p>
              <Link
                href="/pazar/ilan-ver"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors font-semibold text-sm"
              >
                İlan Ver
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/pazar/ilan/${listing.id}`}
                  className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition-shadow duration-200 group"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-background">
                    {listing.image ? (
                      <Image
                        src={listing.image}
                        alt={listing.title}
                        fill
                        unoptimized
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted">
                        <Package className="w-10 h-10" />
                      </div>
                    )}
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
                    {/* Price */}
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
                    {listing.neighborhood && (
                      <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{listing.neighborhood}</span>
                      </div>
                    )}
                    {listing.timeAgo && (
                      <div className="flex items-center gap-1.5 text-xs text-text-muted">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{listing.timeAgo}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="px-8 py-3 border border-border bg-surface rounded-full text-sm font-semibold text-text-secondary hover:bg-surface-hover transition-colors shadow-sm"
              >
                Daha Fazla Göster ({allFiltered.length - visibleCount} ilan daha)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
