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
  AlertCircle,
  Check,
  Shield,
  Package,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getListingById, getListings } from '@/lib/hooks/use-listings';
import { VerifiedMessageButton } from '@/components/ui/verified-message-button';
import { ReportModal } from '@/components/shared/report-modal';

// NOT (2026-06-07): Bu sayfa eskiden gerçek ilan bulunamadığında sahte
// "Laptop / IKEA Kanepe / PS5" (mockListingsDB) gösteriyor; gerçek satıcılara
// uydurma puan/yorum/satış sayısı (4.8 puan, 23 yorum, 42 satış) atfediyor ve
// "Benzer İlanlar"ı tamamen sabit-sahte dolduruyordu. Artık yalnızca gerçek
// veri: ilan yoksa "İlan Bulunamadı"; satıcıda yalnızca gerçek alanlar (ad,
// avatar); benzer ilanlar gerçek kategoriden çekilir. Bkz. TECH_DEBT #12.

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffHours < 1) return 'Az önce';
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

function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

interface SellerInfo {
  id: string | null;
  name: string;
  avatar: string | null;
}

interface DetailListing {
  id: string;
  title: string;
  price: number;
  condition: string;
  category: string;
  neighborhood: string;
  timeAgo: string;
  views: number;
  description: string;
  images: string[];
  seller: SellerInfo;
  specs: { label: string; value: string }[];
}

interface SimilarListing {
  id: string;
  title: string;
  price: number;
  image: string | null;
  location: string;
  timeAgo: string;
}

export default function ListingDetailClient({ id }: { id: string }) {
  const [listing, setListing] = useState<DetailListing | null>(null);
  const [similar, setSimilar] = useState<SimilarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchListing = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const { data, error } = await getListingById(id);

        if (cancelled) return;

        if (error || !data) {
          // Sahte fallback yok: gerçek ilan yoksa "bulunamadı".
          setNotFound(true);
          return;
        }

        const d = data as any;
        const images: string[] = Array.isArray(d.media_urls)
          ? d.media_urls.filter(Boolean)
          : [];

        setListing({
          id: d.id,
          title: d.title,
          price: Number(d.price) || 0,
          condition: conditionMap[d.condition] || d.condition || 'Belirtilmemiş',
          category: d.listing_categories?.name || 'Diğer',
          neighborhood: d.neighborhoods?.name || 'Bilinmiyor',
          timeAgo: d.created_at ? formatTimeAgo(new Date(d.created_at)) : 'Bilinmiyor',
          views: d.view_count || 0,
          description: d.description || '',
          images,
          seller: {
            id: d.seller_id || null,
            name: d.profiles?.full_name || 'Komşu',
            avatar: d.profiles?.avatar_url || null,
          },
          specs: [
            { label: 'Kategori', value: d.listing_categories?.name || 'Diğer' },
            {
              label: 'Durum',
              value: conditionMap[d.condition] || d.condition || 'Belirtilmemiş',
            },
          ],
        });

        // Gerçek "benzer ilanlar": aynı kategori, kendisi hariç.
        if (d.category_id) {
          try {
            const { data: sim } = await getListings({
              categoryId: d.category_id,
              status: 'active',
              limit: 6,
            });
            if (!cancelled && Array.isArray(sim)) {
              const mapped: SimilarListing[] = (sim as any[])
                .filter((s) => s.id !== d.id)
                .slice(0, 4)
                .map((s) => ({
                  id: s.id,
                  title: s.title,
                  price: Number(s.price) || 0,
                  image: Array.isArray(s.media_urls) ? s.media_urls[0] || null : null,
                  location: s.neighborhoods?.name || 'Bilinmiyor',
                  timeAgo: s.created_at
                    ? formatTimeAgo(new Date(s.created_at))
                    : '',
                }));
              setSimilar(mapped);
            }
          } catch {
            if (!cancelled) setSimilar([]);
          }
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchListing();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const prevImage = () => {
    if (!listing) return;
    setCurrentImageIndex(
      (prev) => (prev - 1 + listing.images.length) % listing.images.length
    );
  };

  const nextImage = () => {
    if (!listing) return;
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  };

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

  const hasImages = listing.images.length > 0;

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
              {hasImages ? (
                <Image
                  src={listing.images[currentImageIndex]}
                  alt={listing.title}
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#8f8f8f] gap-2">
                  <Package size={48} />
                  <span className="text-sm">Görsel eklenmemiş</span>
                </div>
              )}
              {hasImages && (
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium">
                  {currentImageIndex + 1} / {listing.images.length}
                </div>
              )}
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
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    {listing.condition}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
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
          {listing.description && (
            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
              <h2 className="text-xl font-bold text-[#333] mb-4">Açıklama</h2>
              <p className="text-[#404040] leading-relaxed whitespace-pre-wrap">{listing.description}</p>
            </div>
          )}

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

          {/* Similar Listings (gerçek) */}
          {similar.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-[#333] mb-4">Benzer İlanlar</h2>
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-4">
                  {similar.map((item) => (
                    <Link
                      key={item.id}
                      href={`/pazar/ilan/${item.id}`}
                      className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden hover:shadow-lg transition-shadow flex-shrink-0 w-48 group"
                    >
                      <div className="relative aspect-square overflow-hidden bg-[#f0f2f5] flex items-center justify-center">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            unoptimized
                          />
                        ) : (
                          <Package size={32} className="text-[#8f8f8f]" />
                        )}
                        {item.timeAgo && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded">
                            {item.timeAgo}
                          </div>
                        )}
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
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Seller Info — yalnızca gerçek alanlar */}
            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
              <h3 className="text-lg font-bold text-[#333] mb-4">Satıcı Bilgisi</h3>
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[#e0e0e0]">
                {listing.seller.avatar ? (
                  <Image
                    src={listing.seller.avatar}
                    alt={listing.seller.name}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                    unoptimized
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#00833e] text-white flex items-center justify-center font-bold flex-shrink-0">
                    {getInitials(listing.seller.name)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#333] truncate">{listing.seller.name}</p>
                  <p className="text-xs text-[#8f8f8f]">Mahallemiz üyesi</p>
                </div>
              </div>

              <div className="space-y-2">
                {listing.seller.id && (
                  <VerifiedMessageButton
                    recipientId={listing.seller.id}
                    recipientName={listing.seller.name}
                    listingTitle={listing.title}
                    listingId={listing.id}
                  />
                )}
                {listing.seller.id && (
                  <Link
                    href={`/profil/${listing.seller.id}`}
                    className="w-full px-4 py-3 border-2 border-[#00833e] text-[#00833e] rounded-lg font-semibold hover:bg-green-50 transition-colors text-center block"
                  >
                    Profili Gör
                  </Link>
                )}
              </div>
            </div>

            {/* Report */}
            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-4">
              <button
                onClick={() => setReportOpen(true)}
                className="w-full flex items-center gap-2 text-[#8f8f8f] hover:text-red-500 transition-colors text-sm font-medium"
              >
                <AlertCircle size={18} />
                Bu ilanı bildir
              </button>
            </div>
          </div>
        </div>
      </div>

      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        type="listing"
        targetId={listing.id}
      />
    </div>
  );
}
