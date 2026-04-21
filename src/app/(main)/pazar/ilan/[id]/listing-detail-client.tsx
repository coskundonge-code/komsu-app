'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Clock,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Star,
  AlertCircle,
  Check,
  Shield,
  Package,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getFeedImageUrl } from '@/lib/demo-images';
import { getListingById } from '@/lib/hooks/use-listings';
import { VerifiedMessageButton } from '@/components/ui/verified-message-button';

// Mock listings database - fallback for IDs not in the real DB
const mockListingsDB: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Laptop Lenovo IdeaPad 5 - 15.6 inç Full HD',
    price: 8500,
    condition: 'Az Kullanılmış',
    conditionBadgeColor: 'bg-green-100 text-green-800',
    category: 'Elektronik',
    categoryColor: 'bg-blue-100 text-blue-800',
    neighborhood: 'Moda',
    location: 'Moda, Kadıköy',
    timeAgo: '2 saat önce',
    views: 324,
    favorites: 45,
    description:
      'Lenovo IdeaPad 5 15.6" Full HD IPS ekran, Intel Core i5-1135G7, 8GB DDR4 RAM, 512GB SSD. Çok az kullanılmıştır. Orijinal kutusu ve tüm aksesuarları mevcuttur. Garantisi 1 yıl kalmıştır.',
    images: [
      getFeedImageUrl(1, 800, 600),
      getFeedImageUrl(2, 800, 600),
      getFeedImageUrl(3, 800, 600),
      getFeedImageUrl(4, 800, 600),
    ],
    seller: {
      id: 'seller1',
      name: 'Mehmet Yılmaz',
      avatar: getFeedImageUrl(5, 200, 200),
      rating: 4.8,
      reviewCount: 23,
      responseTime: '< 1 saat',
      joinDate: '2 yıl önce',
      listings: 45,
      verified: true,
      soldCount: 42,
    },
    specs: [
      { label: 'İşlemci', value: 'Intel Core i5-1135G7' },
      { label: 'RAM', value: '8GB DDR4' },
      { label: 'Depolama', value: '512GB SSD' },
      { label: 'Ekran', value: '15.6" Full HD IPS' },
      { label: 'Batarya', value: '10 saat' },
      { label: 'Ağırlık', value: '1.6 kg' },
    ],
  },
  '2': {
    id: '2',
    title: 'IKEA Kanepe - Açık Gri Renk, Çok İyi Durumda',
    price: 2200,
    condition: 'İyi Durumda',
    conditionBadgeColor: 'bg-green-100 text-green-800',
    category: 'Mobilya',
    categoryColor: 'bg-purple-100 text-purple-800',
    neighborhood: 'Moda',
    location: 'Moda, Kadıköy',
    timeAgo: '4 saat önce',
    views: 156,
    favorites: 28,
    description:
      'IKEA Ektorp serisi 3 kişilik kanepe. Açık gri renk, harika durumda. Temiz, hiç hasarı yok. Kılıfı çıkarılabilir ve yıkanabilir.',
    images: [
      getFeedImageUrl(6, 800, 600),
      getFeedImageUrl(7, 800, 600),
      getFeedImageUrl(8, 800, 600),
    ],
    seller: {
      id: 'seller2',
      name: 'Ayşe Kaya',
      avatar: getFeedImageUrl(9, 200, 200),
      rating: 4.9,
      reviewCount: 18,
      responseTime: '< 30 dakika',
      joinDate: '1 yıl önce',
      listings: 32,
      verified: true,
      soldCount: 30,
    },
    specs: [
      { label: 'Genişlik', value: '242 cm' },
      { label: 'Derinlik', value: '88 cm' },
      { label: 'Yükseklik', value: '88 cm' },
      { label: 'Renk', value: 'Açık Gri' },
      { label: 'Model', value: 'Ektorp Serisi' },
      { label: 'Kılıf', value: 'Çıkarılabilir' },
    ],
  },
  '3': {
    id: '3',
    title: 'PlayStation 5 - Orjinal Kutu ile Satılıyor',
    price: 6500,
    condition: 'Sıfır',
    conditionBadgeColor: 'bg-green-100 text-green-800',
    category: 'Elektronik',
    categoryColor: 'bg-blue-100 text-blue-800',
    neighborhood: 'Fenerbahçe',
    location: 'Fenerbahçe, Kadıköy',
    timeAgo: '1 gün önce',
    views: 892,
    favorites: 156,
    description:
      'PlayStation 5, orjinal kutusunda, hiç kullanılmamış. Satış belgesi ve 2 yılık garantisi mevcuttur.',
    images: [
      getFeedImageUrl(10, 800, 600),
      getFeedImageUrl(11, 800, 600),
      getFeedImageUrl(12, 800, 600),
    ],
    seller: {
      id: 'seller3',
      name: 'Mert Demir',
      avatar: getFeedImageUrl(13, 200, 200),
      rating: 4.7,
      reviewCount: 12,
      responseTime: '< 2 saat',
      joinDate: '6 ay önce',
      listings: 8,
      verified: false,
      soldCount: 7,
    },
    specs: [
      { label: 'Model', value: 'PS5 Standard Edition' },
      { label: 'Durum', value: 'Sıfır - Açılmamış' },
      { label: 'Garantisi', value: '2 yıl kalan' },
      { label: 'Satış Belgesi', value: 'Mevcuttur' },
    ],
  },
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays < 30) return `${diffDays} gün önce`;
  return `${Math.floor(diffDays / 30)} ay önce`;
}

const conditionMap: Record<string, string> = {
  new: 'Sıfır',
  like_new: 'Az Kullanılmış',
  good: 'İyi Durumda',
  fair: 'Orta',
  poor: 'Kötü',
};

export default function ListingDetailClient({ id }: { id: string }) {
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const { data, error } = await getListingById(id);

        if (error || !data) {
          const mockData = mockListingsDB[id];
          if (mockData) {
            setListing(mockData);
          } else {
            setNotFound(true);
          }
        } else {
          const d = data as any;
          const mediaUrls: string[] = d.media_urls?.length > 0
            ? d.media_urls
            : [getFeedImageUrl(1, 800, 600)];

          setListing({
            id: d.id,
            title: d.title,
            price: d.price || 0,
            condition: conditionMap[d.condition] || d.condition || 'İyi Durumda',
            conditionBadgeColor: 'bg-green-100 text-green-800',
            category: d.listing_categories?.name || 'Diğer',
            categoryColor: 'bg-blue-100 text-blue-800',
            neighborhood: d.neighborhoods?.name || 'Bilinmiyor',
            location: d.neighborhoods?.name || 'Bilinmiyor',
            timeAgo: d.created_at ? formatTimeAgo(new Date(d.created_at)) : '1 saat önce',
            views: d.view_count || 0,
            favorites: d.favorite_count || 0,
            description: d.description || '',
            images: mediaUrls,
            seller: {
              id: d.seller_id || 'seller1',
              name: d.profiles?.full_name || 'Bilinmiyor',
              avatar: d.profiles?.avatar_url || getFeedImageUrl(5, 200, 200),
              rating: 4.8,
              reviewCount: 23,
              responseTime: '< 1 saat',
              joinDate: '2 yıl önce',
              listings: 45,
              verified: true,
              soldCount: 42,
            },
            specs: [
              { label: 'Kategori', value: d.listing_categories?.name || 'Diğer' },
              { label: 'Durum', value: conditionMap[d.condition] || d.condition || 'İyi Durumda' },
            ],
          });
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        const mockData = mockListingsDB[id];
        if (mockData) {
          setListing(mockData);
        } else {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + listing.images.length) % listing.images.length
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  };

  const similarListings = [
    { id: '4', title: 'Dell Inspiron 15 - Yeni Model', price: 7200, image: getFeedImageUrl(14, 500, 500), location: 'Şişli', timeAgo: '3 saat' },
    { id: '5', title: 'HP Pavilion - 13 inç Ultrabook', price: 6800, image: getFeedImageUrl(15, 500, 500), location: 'Taksim', timeAgo: '5 saat' },
    { id: '6', title: 'Asus VivoBook 15 - İyi Fiyat', price: 5900, image: getFeedImageUrl(16, 500, 500), location: 'Beşiktaş', timeAgo: '6 saat' },
    { id: '7', title: 'MacBook Air M1 - 2023', price: 12500, image: getFeedImageUrl(17, 500, 500), location: 'Nişantaşı', timeAgo: '1 gün' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#00833e] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#8f8f8f]">İlan yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (notFound || !listing) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-10">
          <Package size={48} className="text-[#8f8f8f] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#333] mb-2">İlan Bulunamadı</h2>
          <p className="text-[#8f8f8f] mb-6">Bu ilan mevcut değil veya kaldırılmış olabilir.</p>
          <Link href="/pazar" className="px-6 py-3 bg-[#00833e] text-white rounded-lg font-semibold hover:bg-[#006b32] transition-colors">
            Pazara Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#e0e0e0] shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link
            href="/pazar"
            className="flex items-center gap-2 text-[#00833e] hover:text-[#006b32] font-semibold transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="hidden sm:inline">Pazara Dön</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 rounded-full hover:bg-[#f0f2f5] transition-colors"
              title={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
            >
              <Heart
                size={24}
                className={cn(isFavorite ? 'fill-red-500 text-red-500' : 'text-[#404040]')}
              />
            </button>
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2 rounded-full hover:bg-[#f0f2f5] transition-colors"
              title="Paylaş"
            >
              <Share2 size={24} className="text-[#404040]" />
            </button>
          </div>
        </div>

        {showShareMenu && (
          <div className="bg-white border-t border-[#e0e0e0] px-4 py-3">
            <div className="max-w-7xl mx-auto flex gap-2 flex-wrap">
              <button className="px-4 py-2 bg-[#f0f2f5] rounded-full text-sm font-medium text-[#404040] hover:bg-[#e0e0e0] transition-colors">
                WhatsApp&apos;ta Paylaş
              </button>
              <button className="px-4 py-2 bg-[#f0f2f5] rounded-full text-sm font-medium text-[#404040] hover:bg-[#e0e0e0] transition-colors">
                Bağlantıyı Kopyala
              </button>
              <button className="px-4 py-2 bg-[#f0f2f5] rounded-full text-sm font-medium text-[#404040] hover:bg-[#e0e0e0] transition-colors">
                Facebook&apos;ta Paylaş
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden">
            <div className="relative bg-[#f0f2f5] aspect-square overflow-hidden group">
              <Image
                src={listing.images[currentImageIndex]}
                alt={listing.title}
                fill
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium">
                {currentImageIndex + 1} / {listing.images.length}
              </div>
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
                    title="Önceki resim"
                  >
                    <ChevronLeft size={24} className="text-[#333]" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
                    title="Sonraki resim"
                  >
                    <ChevronRight size={24} className="text-[#333]" />
                  </button>
                </>
              )}
              <div className="absolute top-4 left-4 bg-white/90 text-[#333] px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
                <Eye size={16} />
                {listing.views} görüntüleme
              </div>
            </div>

            {listing.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto bg-[#f0f2f5] border-t border-[#e0e0e0]">
                {listing.images.map((image: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      'w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all hover:border-[#00833e] relative',
                      currentImageIndex === idx
                        ? 'border-[#00833e] ring-2 ring-[#00833e] ring-offset-1'
                        : 'border-[#e0e0e0]'
                    )}
                    title={`Resim ${idx + 1}`}
                  >
                    <Image
                      src={image}
                      alt={`Resim ${idx + 1}`}
                      fill
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#333] mb-3">{listing.title}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={cn('px-3 py-1 rounded-full text-xs font-semibold', listing.conditionBadgeColor)}>
                    {listing.condition}
                  </span>
                  <span className={cn('px-3 py-1 rounded-full text-xs font-semibold', listing.categoryColor)}>
                    {listing.category}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-[#00833e]">
                  ₺{listing.price.toLocaleString('tr-TR')}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#e0e0e0]">
              <div className="flex items-start gap-2">
                <MapPin size={18} className="text-[#8f8f8f] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[#8f8f8f]">Konum</p>
                  <p className="text-sm font-medium text-[#333]">{listing.neighborhood}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={18} className="text-[#8f8f8f] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[#8f8f8f]">İlan Tarihi</p>
                  <p className="text-sm font-medium text-[#333]">{listing.timeAgo}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
            <h2 className="text-xl font-bold text-[#333] mb-4">Açıklama</h2>
            <p className="text-[#404040] leading-relaxed whitespace-pre-wrap">{listing.description}</p>
          </div>

          {/* Specifications */}
          {listing.specs?.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
              <h2 className="text-xl font-bold text-[#333] mb-4">Özellikleri</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {listing.specs.map((spec: { label: string; value: string }, idx: number) => (
                  <div key={idx}>
                    <p className="text-sm text-[#8f8f8f] mb-1.5 font-medium">{spec.label}</p>
                    <p className="text-base font-semibold text-[#333]">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety Tips */}
          <div className="bg-blue-50 border-l-4 border-[#00833e] rounded-lg p-6">
            <div className="flex gap-3">
              <Shield size={24} className="text-[#00833e] flex-shrink-0" />
              <div>
                <h3 className="font-bold text-[#333] mb-2">Güvenli İşlem İpuçları</h3>
                <ul className="space-y-1 text-sm text-[#404040]">
                  {[
                    'Ürünü, satıcı ile yüz yüze görün ve kontrol edin',
                    'Ödeme işlemini ürünü kontrol ettikten sonra yapın',
                    'Kargo ödemesi seçeneğini kullanmaya çalışın',
                    'Bilinmeyen kişilere önceden para göndermeyin',
                  ].map((tip) => (
                    <li key={tip} className="flex items-start gap-2">
                      <Check size={16} className="text-[#00833e] flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
            <h2 className="text-lg font-bold text-[#333] mb-4">İlan İstatistikleri</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f0f2f5] rounded-lg p-4">
                <p className="text-xs text-[#8f8f8f] mb-1">Görüntüleme</p>
                <p className="text-2xl font-bold text-[#333]">{listing.views}</p>
              </div>
              <div className="bg-[#f0f2f5] rounded-lg p-4">
                <p className="text-xs text-[#8f8f8f] mb-1">Kaydedilme</p>
                <p className="text-2xl font-bold text-[#00833e]">{listing.favorites}</p>
              </div>
            </div>
          </div>

          {/* Similar Listings */}
          <div>
            <h2 className="text-lg font-bold text-[#333] mb-4">Benzer İlanlar</h2>
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-4">
                {similarListings.map((item) => (
                  <Link
                    key={item.id}
                    href={`/pazar/ilan/${item.id}`}
                    className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden hover:shadow-lg transition-shadow flex-shrink-0 w-48 group"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#f0f2f5]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        unoptimized
                      />
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded">
                        {item.timeAgo}
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-lg font-bold text-[#333] mb-1">
                        ₺{item.price.toLocaleString('tr-TR')}
                      </p>
                      <p className="text-xs text-[#404040] line-clamp-2 mb-2">{item.title}</p>
                      <p className="text-xs text-[#8f8f8f]">{item.location}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Seller Info */}
            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
              <h3 className="text-lg font-bold text-[#333] mb-4">Satıcı Bilgisi</h3>
              <div className="flex items-start gap-3 mb-5 pb-5 border-b border-[#e0e0e0]">
                <Image
                  src={listing.seller.avatar}
                  alt={listing.seller.name}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                  unoptimized
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-[#333]">{listing.seller.name}</p>
                    {listing.seller.verified && <Check size={16} className="text-[#00833e]" />}
                  </div>
                  <p className="text-xs text-[#8f8f8f]">{listing.seller.joinDate} katıldı</p>
                </div>
              </div>

              <div className="space-y-3 mb-5 pb-5 border-b border-[#e0e0e0]">
                <div>
                  <p className="text-xs text-[#8f8f8f] mb-1">Puan</p>
                  <div className="flex items-center gap-1.5">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={cn(
                            i < Math.floor(listing.seller.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : i < listing.seller.rating
                              ? 'fill-yellow-400 text-yellow-400 opacity-50'
                              : 'text-[#e0e0e0]'
                          )}
                        />
                      ))}
                    </div>
                    <p className="font-semibold text-[#333]">{listing.seller.rating}</p>
                    <p className="text-xs text-[#8f8f8f]">({listing.seller.reviewCount} yorum)</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#8f8f8f] mb-1">Tepki Süresi</p>
                  <p className="font-semibold text-[#333]">{listing.seller.responseTime}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8f8f8f] mb-1">İlan Sayısı</p>
                  <p className="font-semibold text-[#333]">{listing.seller.listings} aktif ilan</p>
                </div>
                <div>
                  <p className="text-xs text-[#8f8f8f] mb-1">Satılan Ürün</p>
                  <p className="font-semibold text-[#333]">{listing.seller.soldCount} başarılı satış</p>
                </div>
              </div>

              <div className="space-y-2">
                <VerifiedMessageButton
                  recipientId={listing.seller.id}
                  recipientName={listing.seller.name}
                  listingTitle={listing.title}
                  listingId={listing.id}
                />
                <Link
                  href={`/profil/${listing.seller.id}`}
                  className="w-full px-4 py-3 border-2 border-[#00833e] text-[#00833e] rounded-lg font-semibold hover:bg-green-50 transition-colors text-center block"
                >
                  Profili Gör
                </Link>
              </div>
            </div>

            {/* Report */}
            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-4">
              <button className="w-full flex items-center gap-2 text-[#8f8f8f] hover:text-red-500 transition-colors text-sm font-medium">
                <AlertCircle size={18} />
                Bu ilanı bildir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
