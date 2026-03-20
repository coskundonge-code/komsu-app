'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  MapPin,
  ChevronDown,
  X,
  Star,
  Zap,
  Drill,
  Wrench,
  Leaf,
  Sofa,
  Tv,
  Dumbbell,
  UtensilsCrossed,
  Droplet,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images';
import { getListings } from '@/lib/hooks/use-listings';

interface Listing {
  id: string;
  title: string;
  type: 'free' | 'hourly' | 'daily';
  price?: number;
  image: string;
  location: string;
  neighborhood: string;
  distance: string;
  ownerName: string;
  ownerAvatar: string;
  rating: number;
  reviewCount: number;
  category: string;
  timeAgo: string;
}

const tabs = [
  { id: 'all', label: 'Tüm İlanlar' },
  { id: 'lend', label: 'Ödünç Ver' },
  { id: 'rent', label: 'Kirala' },
  { id: 'requests', label: 'Taleplerim' },
];

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
}

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

const distanceOptions = [
  { label: '1 km', value: 1 },
  { label: '3 km', value: 3 },
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 },
  { label: 'Tümü', value: null },
];

const typeOptions = [
  { label: 'Ücretsiz Ödünç', value: 'free' },
  { label: 'Saatlik Kiralık', value: 'hourly' },
  { label: 'Günlük Kiralık', value: 'daily' },
  { label: 'Tümü', value: null },
];

const sortOptions = [
  { label: 'En Yeni', value: 'newest' },
  { label: 'En Yakın', value: 'nearest' },
  { label: 'Fiyat (Artan)', value: 'price-low' },
  { label: 'Fiyat (Azalan)', value: 'price-high' },
];

const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Bosch Matkap',
    type: 'hourly',
    price: 15,
    image: getFeedImageUrl(1, 500, 500),
    location: 'Kadıköy',
    neighborhood: 'Moda',
    distance: '2 km',
    ownerName: 'Ahmet K.',
    ownerAvatar: getAvatarUrl('AK'),
    rating: 4.8,
    reviewCount: 12,
    category: 'Elektrikli Aletler',
    timeAgo: '2 saat',
  },
  {
    id: '2',
    title: 'Makita Testere',
    type: 'daily',
    price: 50,
    image: getFeedImageUrl(2, 500, 500),
    location: 'Moda',
    neighborhood: 'Moda',
    distance: '1 km',
    ownerName: 'Zeynep T.',
    ownerAvatar: getAvatarUrl('ZT'),
    rating: 5,
    reviewCount: 8,
    category: 'Elektrikli Aletler',
    timeAgo: '4 saat',
  },
  {
    id: '3',
    title: 'Tornavida Seti',
    type: 'free',
    image: getFeedImageUrl(3, 500, 500),
    location: 'Caferağa',
    neighborhood: 'Caferağa',
    distance: '3 km',
    ownerName: 'Mert D.',
    ownerAvatar: getAvatarUrl('MD'),
    rating: 4.6,
    reviewCount: 5,
    category: 'Elektrikli Aletler',
    timeAgo: '5 saat',
  },
  {
    id: '4',
    title: 'Bahçe Makası',
    type: 'free',
    image: getFeedImageUrl(4, 500, 500),
    location: 'Fenerbahçe',
    neighborhood: 'Fenerbahçe',
    distance: '4 km',
    ownerName: 'Ayşe K.',
    ownerAvatar: getAvatarUrl('AyK'),
    rating: 4.9,
    reviewCount: 15,
    category: 'Bahçe Aletleri',
    timeAgo: '6 saat',
  },
  {
    id: '5',
    title: 'Çim Biçme Makinesi',
    type: 'hourly',
    price: 25,
    image: getFeedImageUrl(5, 500, 500),
    location: 'Moda',
    neighborhood: 'Moda',
    distance: '1 km',
    ownerName: 'Can B.',
    ownerAvatar: getAvatarUrl('CB'),
    rating: 5,
    reviewCount: 3,
    category: 'Bahçe Aletleri',
    timeAgo: '1 gün',
  },
  {
    id: '6',
    title: 'Katlanır Masa',
    type: 'daily',
    price: 30,
    image: getFeedImageUrl(6, 500, 500),
    location: 'Kadıköy',
    neighborhood: 'Moda',
    distance: '2 km',
    ownerName: 'Selin S.',
    ownerAvatar: getAvatarUrl('SS'),
    rating: 4.7,
    reviewCount: 9,
    category: 'Mobilya',
    timeAgo: '1 gün',
  },
  {
    id: '7',
    title: '50 Kişilik Sandalye Seti',
    type: 'daily',
    price: 100,
    image: getFeedImageUrl(7, 500, 500),
    location: 'Şişli',
    neighborhood: 'Teşvikiye',
    distance: '4 km',
    ownerName: 'Emre Y.',
    ownerAvatar: getAvatarUrl('EY'),
    rating: 4.5,
    reviewCount: 6,
    category: 'Mobilya',
    timeAgo: '2 gün',
  },
  {
    id: '8',
    title: 'Projektör',
    type: 'hourly',
    price: 20,
    image: getFeedImageUrl(8, 500, 500),
    location: 'Caferağa',
    neighborhood: 'Caferağa',
    distance: '3 km',
    ownerName: 'Deniz H.',
    ownerAvatar: getAvatarUrl('DH'),
    rating: 4.8,
    reviewCount: 11,
    category: 'Elektronik',
    timeAgo: '2 saat',
  },
  {
    id: '9',
    title: 'Kamp Çadırı',
    type: 'daily',
    price: 40,
    image: getFeedImageUrl(9, 500, 500),
    location: 'Moda',
    neighborhood: 'Moda',
    distance: '1 km',
    ownerName: 'Leyla E.',
    ownerAvatar: getAvatarUrl('LE'),
    rating: 4.9,
    reviewCount: 7,
    category: 'Spor Malzemeleri',
    timeAgo: '3 saat',
  },
  {
    id: '10',
    title: 'Merdiven',
    type: 'free',
    image: getFeedImageUrl(10, 500, 500),
    location: 'Fenerbahçe',
    neighborhood: 'Fenerbahçe',
    distance: '5 km',
    ownerName: 'Okan R.',
    ownerAvatar: getAvatarUrl('OR'),
    rating: 4.6,
    reviewCount: 4,
    category: 'Elektrikli Aletler',
    timeAgo: '4 saat',
  },
  {
    id: '11',
    title: 'Basınçlı Yıkama Makinesi',
    type: 'hourly',
    price: 30,
    image: getFeedImageUrl(11, 500, 500),
    location: 'Kadıköy',
    neighborhood: 'Güzeltepe',
    distance: '4 km',
    ownerName: 'Nur G.',
    ownerAvatar: getAvatarUrl('NG'),
    rating: 4.7,
    reviewCount: 10,
    category: 'Temizlik',
    timeAgo: '5 saat',
  },
  {
    id: '12',
    title: 'Pasta Kalıp Seti',
    type: 'free',
    image: getFeedImageUrl(12, 500, 500),
    location: 'Moda',
    neighborhood: 'Moda',
    distance: '1 km',
    ownerName: 'Pınar F.',
    ownerAvatar: getAvatarUrl('PF'),
    rating: 5,
    reviewCount: 13,
    category: 'Mutfak',
    timeAgo: '6 saat',
  },
];

export default function OduncKiralaPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState('newest');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real listings on mount
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data, error } = await getListings({ status: 'active', limit: 50 });
        if (data) {
          // Transform DB data to UI format - filter for lending/rental types
          const transformed = (data as any[])
            .filter((item: any) => item.listing_type === 'lending' || item.listing_type === 'rental')
            .map((item: any) => ({
              id: item.id,
              title: item.title || 'Başlıksız İlan',
              type: item.rental_type || 'free' as 'free' | 'hourly' | 'daily',
              price: item.price || 0,
              image: item.image_url || getFeedImageUrl(Math.floor(Math.random() * 30) + 1, 500, 500),
              location: item.neighborhood || 'Bilinmiyor',
              neighborhood: item.neighborhood || 'Bilinmiyor',
              distance: `${Math.floor(Math.random() * 10) + 1} km`,
              ownerName: (item as any).profiles?.full_name || 'Bilinmiyor',
              ownerAvatar: (item as any).profiles?.avatar_url || getAvatarUrl('U'),
              rating: Math.random() * 2 + 3,
              reviewCount: Math.floor(Math.random() * 20),
              category: (item as any).listing_categories?.name || 'Diğer',
              timeAgo: item.created_at ? formatTimeAgo(new Date(item.created_at)) : '1 saat',
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

  const openRequestModal = (id: string) => {
    setSelectedListingId(id);
    setShowRequestModal(true);
  };

  const closeRequestModal = () => {
    setShowRequestModal(false);
    setSelectedListingId(null);
  };

  // Filter listings
  let filtered = (listings.length > 0 ? listings : mockListings).filter((l) => {
    if (searchQuery && !l.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeTab === 'lend' && l.type !== 'free') return false;
    if (activeTab === 'rent' && l.type === 'free') return false;
    if (selectedCategory && l.category !== selectedCategory) return false;
    if (selectedDistance && parseFloat(l.distance) > selectedDistance) return false;
    if (selectedType && l.type !== selectedType) return false;
    return true;
  });

  // Apply sorting
  filtered = [...filtered].sort((a, b) => {
    switch (selectedSort) {
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'nearest':
        return parseFloat(a.distance) - parseFloat(b.distance);
      case 'newest':
      default:
        return 0;
    }
  });

  const displayedListings = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const typeLabel = (type: 'free' | 'hourly' | 'daily') => {
    switch (type) {
      case 'free':
        return 'Ücretsiz';
      case 'hourly':
        return 'Saatlik';
      case 'daily':
        return 'Günlük';
    }
  };

  const priceLabel = (listing: Listing) => {
    if (listing.type === 'free') return 'Ücretsiz';
    if (listing.type === 'hourly') return `₺${listing.price}/saat`;
    if (listing.type === 'daily') return `₺${listing.price}/gün`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
        {/* Header Section */}
        <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="p-4 sm:p-6">
            {/* Title and Action Button */}
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

            {/* Search Bar */}
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

            {/* Tabs */}
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
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors shadow-sm',
                selectedCategory === cat.id
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

          {/* Distance Filter */}
          <div className="relative flex-shrink-0">
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
          {(selectedCategory || selectedDistance || selectedType) && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedDistance(null);
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

        {/* Main Grid Layout */}
        <div>
          {/* Listings Grid */}
          <div>
            {displayedListings.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayedListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-lg transition-shadow duration-200 group"
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
                        {/* Type Badge */}
                        <span className={cn(
                          'absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-md',
                          listing.type === 'free' ? 'bg-primary' : 'bg-[#ff9500]'
                        )}>
                          {typeLabel(listing.type)}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* Price */}
                        <div className="mb-1">
                          <p className="text-lg font-bold text-primary">{priceLabel(listing)}</p>
                        </div>

                        {/* Title */}
                        <p className="text-sm text-text-secondary line-clamp-2 mb-3 leading-snug font-semibold">
                          {listing.title}
                        </p>

                        {/* Owner Info */}
                        <div className="flex items-center gap-2 mb-3">
                          <Image
                            src={listing.ownerAvatar}
                            alt={listing.ownerName}
                            width={28}
                            height={28}
                            unoptimized
                            className="w-7 h-7 rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-text-secondary font-medium truncate">{listing.ownerName}</p>
                            <p className="text-xs text-text-muted">{listing.neighborhood}</p>
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center gap-1.5 text-xs text-text-muted mb-2">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{listing.distance}</span>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3">
                          <Star className="w-4 h-4 text-primary fill-[#00833e]" />
                          <span className="text-xs font-semibold text-primary">{listing.rating}</span>
                          <span className="text-xs text-text-muted">({listing.reviewCount})</span>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => openRequestModal(listing.id)}
                          className="w-full px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors"
                        >
                          Talep Gönder
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
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
              <div className="col-span-full text-center py-12">
                <p className="text-text-muted text-lg">İlanlar bulunamadı. Filtreleri kontrol edin.</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Talep Gönder Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-surface rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-text-primary">Talep Gönder</h2>
              <button
                onClick={closeRequestModal}
                className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Talep Tarihi
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Süre (gün/saat)
                </label>
                <input
                  type="text"
                  placeholder="örn: 2 gün, 5 saat"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  İleti
                </label>
                <textarea
                  placeholder="Talep hakkında kısa bir açıklama..."
                  rows={4}
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeRequestModal}
                  className="flex-1 px-4 py-2.5 border border-border text-text-secondary rounded-lg text-sm font-semibold hover:bg-surface-hover transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={closeRequestModal}
                  className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors"
                >
                  Gönder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
