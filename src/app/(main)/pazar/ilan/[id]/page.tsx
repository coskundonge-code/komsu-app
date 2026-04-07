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
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images';
import { getListingById } from '@/lib/hooks/use-listings';
import { VerifiedMessageButton } from '@/components/ui/verified-message-button';

// Mock listings database - expanded with multiple variations
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
      'Lenovo IdeaPad 5 15.6" Full HD IPS ekran, Intel Core i5-1135G7, 8GB DDR4 RAM, 512GB SSD. Çok az kullanılmıştır. Orijinal kutusu ve tüm aksesuarları mevcuttur. Garantisi 1 yıl kalmıştır. İyi bir laptop arayan kişiler için ideal. Sadece kişisel kullanım için alınmıştı.',
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
      'IKEA Ektorp serisi 3 kişilik kanepe. Açık gri renk, harika durumda. Temiz, hiç hasarı yok. Çok konforlu oturuş. Kanepenin boyutları: Genişlik 242cm, Derinlik 88cm, Yükseklik 88cm. Kapı altından kolaylıkla geçebilir. Kılıfı çıkarılabilir ve yıkanabilir.',
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
      'PlayStation 5, orjinal kutusunda, hiç kullanılmamış, vinil sealiyle paketli. Satış belgesi ve 2 yılık garantisi mevcuttur. Çok nadir bulunur bu koşulda. Tüm kontroller yapılmıştır. Acil para ihtiyacı nedeniyle satılıyor. Elden teslim tercih edilir. Testini yüz yüze yapabilirsiniz.',
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
      { label: 'Aksesuar', value: 'Tüm orijinal aksesuar ve oyun + kol' },
      { label: 'Garantisi', value: '2 yıl kalan' },
      { label: 'Satış Belgesi', value: 'Mevcuttur' },
    ],
  },
};

export default function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [mockListing, setMockListing] = useState<any>(null);
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
        const { data, error } = await getListingById(params.id);

        if (error) {
          console.warn('Error fetching listing:', error);
          const mockData = mockListingsDB[params.id];
          if (mockData) {
            setMockListing(mockData);
          } else {
            setNotFound(true);
          }
        } else if (data) {
          // Map DB fields to UI format - enhanced detail page
          const listing = {
            id: (data as any).id,
            title: (data as any).title,
            price: (data as any).price || 0,
            condition: (data as any).item_condition || 'good',
            conditionBadgeColor: 'bg-green-100 text-green-800',
            category: (data as any).listing_categories?.name || 'Diğer',
            categoryColor: 'bg-blue-100 text-blue-800',
            neighborhood: (data as any).neighborhood || 'Bilinmiyor',
            location: (data as any).neighborhood || 'Bilinmiyor',
            timeAgo: (data as any).created_at ? formatTimeAgo(new Date((data as any).created_at)) : '1 saat',
            views: 324,
            favorites: 45,
            description: (data as any).description || '',
            images: (data as any).image_url ? [(data as any).image_url] : [getFeedImageUrl(1, 800, 600)],
            seller: {
              id: (data as any).profiles?.id || 'seller1',
              name: (data as any).profiles?.full_name || 'Bilinmiyor',
              avatar: (data as any).profiles?.avatar_url || getFeedImageUrl(5, 200, 200),
              rating: 4.8,
              reviewCount: 23,
              responseTime: '< 1 saat',
              joinDate: '2 yıl önce',
              listings: 45,
              verified: true,
              soldCount: 42,
            },
            specs: [
              { label: 'Kategori', value: (data as any).listing_categories?.name || 'Diğer' },
              { label: 'Durum', value: (data as any).item_condition || 'good' },
            ],
          };
          setMockListing(listing);
        } else {
          const mockData = mockListingsDB[params.id];
          if (mockData) {
            setMockListing(mockData);
          } else {
            setNotFound(true);
          }
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        const mockData = mockListingsDB[params.id];
        if (mockData) {
          setMockListing(mockData);
        } else {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.id]);

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays < 30) return `${diffDays} gün önce`;
    return `${Math.floor(diffDays / 30)} ay önce`;
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + mockListing.images.length) % mockListing.images.length
    );
  };

  const nextImage = () => {
    setCurrentImageIndex(
      (prev) => (prev + 1) % mockListing.images.length
    );
  };

  const similarListings = [
    {
      id: '4',
      title: 'Dell Inspiron 15 - Yeni Model',
      price: 7200,
      image:
        getFeedImageUrl(14, 500, 500),
      location: 'Şişli',
      timeAgo: '3 saat',
      isFree: false,
    },
    {
      id: '5',
      title: 'HP Pavilion - 13 inç Ultrabook',
      price: 6800,
      image:
        getFeedImageUrl(15, 500, 500),
      location: 'Taksim',
      timeAgo: '5 saat',
      isFree: false,
    },
    {
      id: '6',
      title: 'Asus VivoBook 15 - İi Fiyat',
      price: 5900,
      image:
        getFeedImageUrl(16, 500, 500),
      location: 'Beşiktaş',
      timeAgo: '6 saat',
      isFree: false,
    },
    {
      id: '7',
      title: 'MacBook Air M1 - 2023',
      price: 12500,
      image:
        getFeedImageUrl(17, 500, 500),
      location: 'Nişantaşı',
      timeAgo: '1 gün',
      isFree: false,
    },
  ];

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
                className={cn(
                  isFavorite
                    ? 'fill-red-500 text-red-500'
                    : 'text-[#404040]'
                )}
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

        {/* Share Menu */}
        {showShareMenu && (
          <div className="bg-white border-t border-[#e0e0e0] px-4 py-3">
            <div className="max-w-7xl mx-auto flex gap-2 flex-wrap">
              <button className="px-4 py-2 bg-[#f0f2f5] rounded-full text-sm font-medium text-[#404040] hover:bg-[#e0e0e0] transition-colors">
                WhatsApp'ta Paylaş
              </button>
              <button className="px-4 py-2 bg-[#f0f2f5] rounded-full text-sm font-medium text-[#404040] hover:bg-[#e0e0e0] transition-colors">
                Bağlantıyı Kopyala
              </button>
              <button className="px-4 py-2 bg-[#f0f2f5] rounded-full text-sm font-medium text-[#404040] hover:bg-[#e0e0e0] transition-colors">
                Facebook'ta Paylaş
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image Gallery */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden">
            {/* Main Image */}
            <div className="relative bg-[#f0f2f5] aspect-square overflow-hidden group">
              <Image
                src={mockListing.images[currentImageIndex]}
                alt={mockListing.title}
                fill
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium">
                {currentImageIndex + 1} / {mockListing.images.length}
              </div>

              {/* Image Navigation Buttons */}
              {mockListing.images.length > 1 && (
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

              {/* Views Badge */}
              <div className="absolute top-4 left-4 bg-white/90 text-[#333] px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
                <Eye size={16} />
                {mockListing.views} görüntüleme
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {mockListing.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto bg-[#f0f2f5] border-t border-[#e0e0e0]">
                {mockListing.images.map((image: string, idx: number) => (
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
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#333] mb-3">
                  {mockListing.title}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      mockListing.conditionBadgeColor
                    )}
                  >
                    {mockListing.condition}
                  </span>
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      mockListing.categoryColor
                    )}
                  >
                    {mockListing.category}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-[#00833e]">
                  ₺{mockListing.price.toLocaleString('tr-TR')}
                </p>
              </div>
            </div>

            {/* Meta Information */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#e0e0e0]">
              <div className="flex items-start gap-2">
                <MapPin size={18} className="text-[#8f8f8f] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[#8f8f8f]">Konum</p>
                  <p className="text-sm font-medium text-[#333]">
                    {mockListing.neighborhood}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={18} className="text-[#8f8f8f] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[#8f8f8f]">İlan Tarihi</p>
                  <p className="text-sm font-medium text-[#333]">
                    {mockListing.timeAgo}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
            <h2 className="text-xl font-bold text-[#333] mb-4">Açıklama</h2>
            <p className="text-[#404040] leading-relaxed whitespace-pre-wrap">
              {mockListing.description}
            </p>
          </div>

          {/* Specifications */}
          {mockListing.specs && mockListing.specs.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
              <h2 className="text-xl font-bold text-[#333] mb-4">
                Özellikleri
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {mockListing.specs.map((spec: { label: string; value: string }, idx: number) => (
                  <div key={idx}>
                    <p className="text-sm text-[#8f8f8f] mb-1.5 font-medium">
                      {spec.label}
                    </p>
                    <p className="text-base font-semibold text-[#333]">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety Tips Card */}
          <div className="bg-blue-50 border-l-4 border-[#00833e] rounded-lg p-6">
            <div className="flex gap-3">
              <Shield size={24} className="text-[#00833e] flex-shrink-0" />
              <div>
                <h3 className="font-bold text-[#333] mb-2">Güvenli İşlem İpuçları</h3>
                <ul className="space-y-1 text-sm text-[#404040]">
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-[#00833e] flex-shrink-0 mt-0.5" />
                    <span>Ürünü, satıcı ile kargo/kişisel teslimat öncesi yüz yüze görün ve kontrol edin</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-[#00833e] flex-shrink-0 mt-0.5" />
                    <span>Ödeme işlemini ürünü kontrol ettikten sonra yapın</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-[#00833e] flex-shrink-0 mt-0.5" />
                    <span>Para transferi yapmadan kargo ödemesi seçeneğini kullanmaya çalışın</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-[#00833e] flex-shrink-0 mt-0.5" />
                    <span>Bilinmeyen kişilere önceden para göndermeyin</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
            <h2 className="text-lg font-bold text-[#333] mb-4">İlan İstatistikleri</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f0f2f5] rounded-lg p-4">
                <p className="text-xs text-[#8f8f8f] mb-1">Görüntüleme</p>
                <p className="text-2xl font-bold text-[#333]">{mockListing.views}</p>
              </div>
              <div className="bg-[#f0f2f5] rounded-lg p-4">
                <p className="text-xs text-[#8f8f8f] mb-1">Kaydedilme</p>
                <p className="text-2xl font-bold text-[#00833e]">{mockListing.favorites}</p>
              </div>
            </div>
          </div>

          {/* Similar Listings */}
          <div>
            <h2 className="text-lg font-bold text-[#333] mb-4">Benzer İlanlar</h2>
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-4">
                {similarListings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/pazar/ilan/${listing.id}`}
                    className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden hover:shadow-lg transition-shadow flex-shrink-0 w-48 group"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#f0f2f5]">
                      <Image
                        src={listing.image}
                        alt={listing.title}
                        fill
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        unoptimized
                      />
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded">
                        {listing.timeAgo}
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-lg font-bold text-[#333] mb-1">
                        ₺{listing.price.toLocaleString('tr-TR')}
                      </p>
                      <p className="text-xs text-[#404040] line-clamp-2 mb-2">
                        {listing.title}
                      </p>
                      <p className="text-xs text-[#8f8f8f]">
                        {listing.location}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Seller Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
              <h3 className="text-lg font-bold text-[#333] mb-4">Satıcı Bilgisi</h3>

              {/* Seller Profile */}
              <div className="flex items-start gap-3 mb-5 pb-5 border-b border-[#e0e0e0]">
                <Image
                  src={mockListing.seller.avatar}
                  alt={mockListing.seller.name}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                  unoptimized
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-[#333]">
                      {mockListing.seller.name}
                    </p>
                    {mockListing.seller.verified && (
                      <Check size={16} className="text-[#00833e]" />
                    )}
                  </div>
                  <p className="text-xs text-[#8f8f8f]">
                    {mockListing.seller.joinDate} katıldı
                  </p>
                </div>
              </div>

              {/* Seller Stats */}
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
                            i < Math.floor(mockListing.seller.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : i < mockListing.seller.rating
                              ? 'fill-yellow-400 text-yellow-400 opacity-50'
                              : 'text-[#e0e0e0]'
                          )}
                        />
                      ))}
                    </div>
                    <p className="font-semibold text-[#333]">
                      {mockListing.seller.rating}
                    </p>
                    <p className="text-xs text-[#8f8f8f]">
                      ({mockListing.seller.reviewCount} yorum)
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[#8f8f8f] mb-1">Tepki Süresi</p>
                  <p className="font-semibold text-[#333]">
                    {mockListing.seller.responseTime}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#8f8f8f] mb-1">İlan Sayısı</p>
                  <p className="font-semibold text-[#333]">
                    {mockListing.seller.listings} aktif ilan
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#8f8f8f] mb-1">Satılan Ürün</p>
                  <p className="font-semibold text-[#333]">
                    {mockListing.seller.soldCount} başarılı satış
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <VerifiedMessageButton
                  recipientId={mockListing.seller.id}
                  recipientName={mockListing.seller.name}
                  listingTitle={mockListing.title}
                  listingId={mockListing.id}
                />
                <Link
                  href={`/profil/${mockListing.seller.id}`}
                  className="w-full px-4 py-3 border-2 border-[#00833e] text-[#00833e] rounded-lg font-semibold hover:bg-green-50 transition-colors text-center"
                >
                  Profili Gör
                </Link>
              </div>
            </div>

            {/* Report Card */}
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
