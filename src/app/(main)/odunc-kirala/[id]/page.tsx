'use client';

import { useState, useEffect, use } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  AlertCircle,
  Loader2,
  Package,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { getLendingItemById } from '@/lib/hooks/use-lending';
import { VerifiedMessageButton } from '@/components/ui/verified-message-button';

// NOT (2026-06-07): Bu sayfa eskiden YANLIŞ tabloyu (marketplace `listings`,
// getListingById) sorguluyor, hata/boş olunca da `mockListingDetail` adında sahte
// bir "Bosch Matkap" ilanına (demo-images görselleri, uydurma sahip puanı/yorumu,
// sahte benzer ilanlar, Math.random ile boyanan uygunluk takvimi, sabit kurallar)
// düşüyordu. Artık doğru tablo olan `lending_items` gerçek veriyle bağlandı; bulunamazsa
// dürüst "bulunamadı" durumu gösterilir. Sahibiyle iletişim gerçek mesajlaşma
// (VerifiedMessageButton) üzerinden. Bkz. TECH_DEBT #12.

// NOT: `lending_items.lending_type` veritabanında yalnızca 'free' veya 'paid'
// değerini tutar (ilan-ver formu saatlik/günlük ayrımını KAYDETMİYOR, birim de
// saklanmıyor). Bu yüzden burada uydurma "Saatlik/Günlük" yerine gerçek modeli
// (Ücretsiz / Kiralık) kullanıyoruz.
type LendingType = 'free' | 'paid';

interface LendingDetail {
  id: string;
  ownerId: string;
  title: string;
  type: LendingType;
  pricePerUnit: number;
  depositAmount: number;
  maxLendingDays: number;
  images: string[];
  description: string;
  ownerName: string;
  ownerAvatar: string | null;
  memberSinceYear: string;
  category: string;
  condition: string;
}

function typeLabel(type: LendingType) {
  return type === 'free' ? 'Ücretsiz' : 'Kiralık';
}

function priceLabel(item: Pick<LendingDetail, 'type' | 'pricePerUnit'>) {
  if (item.type === 'free') return 'Ücretsiz';
  return `₺${item.pricePerUnit}`;
}

function ownerInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('');
}

export default function LendingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Next 16: params is a Promise even in client components — must unwrap with use().
  const { id } = use(params);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [listing, setListing] = useState<LendingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchListing = async () => {
      setLoading(true);
      const { data, error } = await getLendingItemById(id);
      if (cancelled) return;

      if (error || !data) {
        setListing(null);
        setLoading(false);
        return;
      }

      const d = data as any;
      const type: LendingType = d.lending_type === 'paid' ? 'paid' : 'free';

      setListing({
        id: d.id,
        ownerId: d.user_id,
        title: d.title || 'Başlıksız İlan',
        type,
        pricePerUnit: d.price_per_unit || 0,
        depositAmount: d.deposit_amount || 0,
        maxLendingDays: d.max_lending_days || 0,
        images: Array.isArray(d.image_urls) ? d.image_urls.filter(Boolean) : [],
        description: d.description || 'Açıklama bulunmamaktadır.',
        ownerName: d.profiles?.full_name || 'Üye',
        ownerAvatar: d.profiles?.avatar_url || null,
        memberSinceYear: d.created_at ? new Date(d.created_at).getFullYear().toString() : '',
        category: d.category || 'Diğer',
        condition: d.condition || 'Belirtilmedi',
      });
      setLoading(false);
    };

    fetchListing();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#00833e] animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#8f8f8f]">İlan yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <Package className="w-12 h-12 text-[#bdbdbd] mx-auto mb-4" />
          <h1 className="text-lg font-bold text-[#333] mb-2">İlan bulunamadı</h1>
          <p className="text-sm text-[#8f8f8f] mb-6">
            Bu ilan kaldırılmış veya hiç var olmamış olabilir.
          </p>
          <Link
            href="/odunc-kirala"
            className="inline-block px-5 py-2.5 bg-[#00833e] text-white rounded-lg text-sm font-semibold hover:bg-[#006b32] transition-colors"
          >
            Tüm İlanlara Dön
          </Link>
        </div>
      </div>
    );
  }

  const hasImages = listing.images.length > 0;
  const rules: string[] = [];
  if (listing.depositAmount > 0) rules.push(`Depozito: ${listing.depositAmount}₺ gereklidir`);
  if (listing.maxLendingDays > 0) rules.push(`Maksimum kullanım süresi: ${listing.maxLendingDays} gün`);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#8f8f8f] overflow-hidden">
          <Link href="/odunc-kirala" className="hover:text-[#00833e]">
            Ödünç Ver & Kirala
          </Link>
          <span>/</span>
          <span className="text-[#333] truncate">{listing.title}</span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image Gallery - Left */}
          <div className="lg:col-span-2">
            <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-lg shadow-sm border border-[#e0e0e0] mb-4 bg-[#f0f2f5]">
              {hasImages ? (
                <Image
                  src={listing.images[currentImageIndex]}
                  alt={listing.title}
                  fill
                  unoptimized
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#bdbdbd]">
                  <Package className="w-16 h-16 mb-2" />
                  <span className="text-sm">Görsel eklenmemiş</span>
                </div>
              )}

              {hasImages && listing.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
                    aria-label="Önceki resim"
                  >
                    <ChevronLeft className="w-6 h-6 text-[#333]" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
                    aria-label="Sonraki resim"
                  >
                    <ChevronRight className="w-6 h-6 text-[#333]" />
                  </button>
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1}/{listing.images.length}
                  </div>
                </>
              )}

              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
                aria-label="Kaydet"
              >
                <Heart
                  className={cn('w-6 h-6', isFavorite ? 'fill-red-500 text-red-500' : 'text-[#404040]')}
                />
              </button>
            </div>

            {/* Thumbnail Strip */}
            {hasImages && listing.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      'relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors',
                      currentImageIndex === idx
                        ? 'border-[#00833e]'
                        : 'border-[#e0e0e0] hover:border-[#d0d0d0]'
                    )}
                  >
                    <Image src={img} alt={`Thumbnail ${idx + 1}`} fill unoptimized className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Card - Right */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span
                    className={cn(
                      'inline-block text-white text-xs font-bold px-3 py-1 rounded-md mb-3',
                      listing.type === 'free' ? 'bg-[#00833e]' : 'bg-[#ff9500]'
                    )}
                  >
                    {typeLabel(listing.type)}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#333]">{listing.title}</h1>
                </div>
                <button className="p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors">
                  <Share2 className="w-5 h-5 text-[#8f8f8f]" />
                </button>
              </div>

              <div className="mb-4 pb-4 border-b border-[#e0e0e0]">
                <p className="text-2xl sm:text-3xl font-bold text-[#00833e] mb-1">{priceLabel(listing)}</p>
                <p className="text-sm text-[#8f8f8f]">{listing.category}</p>
              </div>

              {/* Primary contact action — gerçek mesajlaşma */}
              <VerifiedMessageButton
                recipientId={listing.ownerId}
                recipientName={listing.ownerName}
                listingTitle={listing.title}
              />
            </div>

            {/* Owner Card */}
            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
              <h2 className="text-lg font-bold text-[#333] mb-4">Mal Sahibi</h2>

              <div className="flex items-start gap-3 mb-4">
                {listing.ownerAvatar ? (
                  <Image
                    src={listing.ownerAvatar}
                    alt={listing.ownerName}
                    width={56}
                    height={56}
                    unoptimized
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#e8f5e9] flex items-center justify-center text-[#00833e] font-bold">
                    {ownerInitials(listing.ownerName) || <User className="w-6 h-6" />}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#333]">{listing.ownerName}</p>
                  {listing.memberSinceYear && (
                    <p className="text-xs text-[#8f8f8f]">{listing.memberSinceYear}&apos;den beri üye</p>
                  )}
                </div>
              </div>

              <Link
                href={`/profil/${listing.ownerId}`}
                className="block w-full text-center px-4 py-2.5 border border-[#e0e0e0] bg-white text-[#333] rounded-lg text-sm font-semibold hover:bg-[#f0f2f5] transition-colors"
              >
                Profili Ziyaret Et
              </Link>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
          <h2 className="text-lg font-bold text-[#333] mb-4">Ürün Açıklaması</h2>
          <p className="text-sm text-[#404040] leading-relaxed mb-4 whitespace-pre-line">{listing.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#8f8f8f] font-semibold mb-1">DURUM</p>
              <p className="text-sm text-[#333] font-semibold">{listing.condition}</p>
            </div>
            <div>
              <p className="text-xs text-[#8f8f8f] font-semibold mb-1">KATEGORİ</p>
              <p className="text-sm text-[#333] font-semibold">{listing.category}</p>
            </div>
          </div>
        </div>

        {/* Rules/Conditions Section — yalnızca gerçek alanlardan üretilir */}
        {rules.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
            <h2 className="text-lg font-bold text-[#333] mb-4">Koşullar ve Kurallar</h2>
            <div className="space-y-3">
              {rules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-[#ff9500] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[#404040]">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
