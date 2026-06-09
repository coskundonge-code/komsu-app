'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  ChevronDown,
  X,
  Tag,
  Clock,
  Package,
  Drill,
  Leaf,
  Sofa,
  Tv,
  Dumbbell,
  UtensilsCrossed,
  Droplet,
  MoreHorizontal,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { getLendingItems } from '@/lib/hooks/use-lending';

// NOT (2026-06-07): Bu sayfa eskiden 12 elemanlık dev `mockListings` dizisi (demo-images
// görselleri) taşıyordu ve gerçek veriyi dönüştürürken mesafe/puan/yorum sayısını
// `Math.random()` ile, konum/mahalleyi sabit "Kadıköy, Moda" olarak UYDURUYORDU.
// `lending_items` tablosunda mesafe/puan/yorum/mahalle-adı yok; bu yüzden bunların
// hepsi kaldırıldı. Ayrıca veritabanına yazılmayan (ve bu yüzden hep boş kalan)
// sahte mesafe filtresi ile hiçbir şey yapmayan "Talep Gönder" modalı da silindi —
// iletişim, ilan detayındaki gerçek mesajlaşma düğmesi üzerinden yürür.
// Kart yalnızca gerçek alanları gösterir: başlık, tür (Ücretsiz/Kiralık), fiyat,
// gerçek görsel (yoksa placeholder), gerçek ilan sahibi ve kategori/zaman.
// Bkz. TECH_DEBT #12.

type LendingType = 'free' | 'paid';

interface Listing {
  id: string;
  title: string;
  type: LendingType;
  price: number;
  image: string | null;
  ownerName: string;
  ownerAvatar: string | null;
  category: string;
  timeAgo: string;
}

const tabs = [
  { id: 'all', label: 'Tüm İlanlar' },
  { id: 'lend', label: 'Ödünç Ver' },
  { id: 'rent', label: 'Kirala' },
];

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// NOT: `label` değerleri ilan-ver formundaki kategori değerleriyle birebir aynıdır;
// filtre gerçekten eşleşsin diye seçim `label` üzerinden yapılır.
const categories: Category[] = [
  { id: 'tools', label: 'Elektrikli Aletler', icon: <Drill className="w-5 h-5" /> },
  { id: 'garden', label: 'Bahçe Aletleri', icon: <Leaf className="w-5 h-5" /> },
  { id: 'furniture', label: 'Mobilya', icon: <Sofa className="w-5 h-5" /> },
  { id: 'electronics', label: 'Elektronik', icon: <Tv className="w-5 h-5" /> },
  { id: 'sports', label: 'Spor Malzemeleri', icon: <Dumbbell className="w-5 h-5" /> },
  { id: 'kitchen', label: 'Mutfak', icon: <UtensilsCrossed className="w-5 h-5" /> },
  { id: 'cleaning', label: 'Temizlik', icon: <Droplet className="w-5 h-5" /> },
  { id: 'other', label: 'Diğer', icon: <MoreHorizontal className="w-5 h-5" /> },
];

const typeOptions = [
  { label: 'Ücretsiz Ödünç', value: 'free' },
  { label: 'Kiralık', value: 'paid' },
  { label: 'Tümü', value: null },
];

const sortOptions = [
  { label: 'En Yeni', value: 'newest' },
  { label: 'Fiyat (Artan)', value: 'price-low' },
  { label: 'Fiyat (Azalan)', value: 'price-high' },
];

function formatTimeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffHours < 1) return 'az önce';
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays < 30) return `${diffDays} gün önce`;
  return `${Math.floor(diffDays / 30)} ay önce`;
}

function ownerInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('');
}

export default function OduncKiralaPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState('newest');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchListings = async () => {
      setLoading(true);
      const { data } = await getLendingItems({ status: 'available', limit: 50 });
      if (cancelled) return;

      const transformed: Listing[] = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title || 'Başlıksız İlan',
        type: (item.lending_type === 'paid' ? 'paid' : 'free') as LendingType,
        price: item.price_per_unit || 0,
        image: item.image_urls?.[0] || null,
        ownerName: item.profiles?.full_name || 'Üye',
        ownerAvatar: item.profiles?.avatar_url || null,
        category: item.category || 'Diğer',
        timeAgo: item.created_at ? formatTimeAgo(new Date(item.created_at)) : '',
      }));

      setListings(transformed);
      setLoading(false);
    };

    fetchListings().catch(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  let filtered = listings.filter((l) => {
    if (searchQuery && !l.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeTab === 'lend' && l.type !== 'free') return false;
    if (activeTab === 'rent' && l.type !== 'paid') return false;
    if (selectedCategory && l.category !== selectedCategory) return false;
    if (selectedType && l.type !== selectedType) return false;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    switch (selectedSort) {
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'newest':
      default:
        return 0;
    }
  });

  const displayedListings = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const typeLabel = (type: LendingType) => (type === 'free' ? 'Ücretsiz' : 'Kiralık');
  const priceLabel = (listing: Listing) => (listing.type === 'free' ? 'Ücretsiz' : `₺${listing.price}`);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
        {/* Header Section */}
        <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6">
              <h1 className="text-2xl font-bold text-text-primary">Ödünç Ver & Kirala</h1>
              <Link
                href="/odunc-kirala/ilan-ver"
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors text-sm font-semibold shadow-sm"
              >
                <Plus className="w-4 h-4" />
                İlan Ver
              </Link>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Aletler, mobilya, elektronik ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-5 py-3 bg-background border border-border rounded-full text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 transition"
              />
            </div>

            <div className="flex gap-0 border-b border-border -mx-6 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-5 py-4 text-sm font-medium border-b-[3px] transition-colors whitespace-nowrap flex-shrink-0',
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

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.label ? null : cat.label)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors shadow-sm',
                selectedCategory === cat.label
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-text-secondary hover:bg-surface-hover'
              )}
              title={cat.label}
            >
              {cat.icon}
              <span className="hidden sm:inline">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {/* Type Filter */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-colors',
                selectedType
                  ? 'bg-primary text-white border border-primary'
                  : 'bg-surface border border-border text-text-secondary hover:bg-surface-hover'
              )}
            >
              Tür
              <ChevronDown className={cn('w-4 h-4', openDropdown === 'type' && 'rotate-180')} />
            </button>
            {openDropdown === 'type' && (
              <div className="absolute top-full left-0 mt-2 bg-surface border border-border rounded-lg shadow-lg z-50 min-w-48">
                {typeOptions.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setSelectedType(opt.value);
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      'w-full text-left px-4 py-3 text-sm transition-colors',
                      selectedType === opt.value
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

          {/* Sort Filter */}
          <div className="relative flex-shrink-0">
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

          {/* Clear Filters */}
          {(selectedCategory || selectedType) && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedType(null);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-full text-sm font-medium text-red-700 hover:bg-red-100 transition-colors flex-shrink-0"
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
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
              <p className="text-text-muted text-sm">İlanlar yükleniyor...</p>
            </div>
          ) : displayedListings.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-lg transition-shadow duration-200 group"
                  >
                    <Link href={`/odunc-kirala/${listing.id}`}>
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
                          <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                            <Package className="w-12 h-12 mb-1" />
                            <span className="text-xs">Görsel yok</span>
                          </div>
                        )}
                        <span
                          className={cn(
                            'absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-md',
                            listing.type === 'free' ? 'bg-primary' : 'bg-[#ff9500]'
                          )}
                        >
                          {typeLabel(listing.type)}
                        </span>
                      </div>
                    </Link>

                    <div className="p-4">
                      <div className="mb-1">
                        <p className="text-lg font-bold text-primary">{priceLabel(listing)}</p>
                      </div>

                      <Link href={`/odunc-kirala/${listing.id}`} className="block">
                        <p className="text-sm text-text-secondary line-clamp-2 mb-3 leading-snug font-semibold hover:text-primary transition-colors">
                          {listing.title}
                        </p>
                      </Link>

                      <div className="flex items-center gap-2 mb-3">
                        {listing.ownerAvatar ? (
                          <Image
                            src={listing.ownerAvatar}
                            alt={listing.ownerName}
                            width={28}
                            height={28}
                            unoptimized
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center text-[10px] font-bold text-primary">
                            {ownerInitials(listing.ownerName) || 'Ü'}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-text-secondary font-medium truncate">{listing.ownerName}</p>
                          <p className="text-xs text-text-muted truncate">{listing.category}</p>
                        </div>
                      </div>

                      {listing.timeAgo && (
                        <div className="flex items-center gap-1.5 text-xs text-text-muted mb-3">
                          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{listing.timeAgo}</span>
                        </div>
                      )}

                      <Link
                        href={`/odunc-kirala/${listing.id}`}
                        className="block w-full px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors text-center"
                      >
                        Detayları Gör
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="px-8 py-3 border border-border bg-surface rounded-full text-sm font-semibold text-text-secondary hover:bg-surface-hover transition-colors shadow-sm"
                  >
                    Daha Fazla Göster ({filtered.length - visibleCount} ilan daha)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <Tag className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <p className="text-text-primary font-medium">
                {listings.length === 0 ? 'Henüz ilan yok' : 'İlan bulunamadı'}
              </p>
              <p className="text-text-muted text-sm mt-1">
                {listings.length === 0
                  ? 'İlk ödünç/kiralık ilanını sen ekleyebilirsin.'
                  : 'Arama veya filtre kriterlerine uyan ilan yok.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
