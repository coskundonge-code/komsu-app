'use client';

import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
  Clock,
  Heart,
  Share2,
  X,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images';

interface ListingDetail {
  id: string;
  title: string;
  type: 'free' | 'hourly' | 'daily';
  price?: number;
  images: string[];
  location: string;
  neighborhood: string;
  distance: string;
  description: string;
  ownerName: string;
  ownerAvatar: string;
  ownerRating: number;
  ownerReviewCount: number;
  ownerMemberSince: string;
  rating: number;
  reviewCount: number;
  category: string;
  condition: string;
  pickupLocation: string;
  availability: string;
  rules: string[];
  similarItems: Array<{
    id: string;
    title: string;
    image: string;
    type: 'free' | 'hourly' | 'daily';
    price?: number;
    distance: string;
  }>;
}

const mockListingDetail: ListingDetail = {
  id: '1',
  title: 'Bosch Matkap - Profesyonel Model',
  type: 'hourly',
  price: 15,
  images: [
    getFeedImageUrl(1, 600, 600),
    getFeedImageUrl(2, 600, 600),
    getFeedImageUrl(3, 600, 600),
  ],
  location: 'Kadıköy',
  neighborhood: 'Moda',
  distance: '2 km',
  description: 'Profesyonel Bosch matkap, çok iyi durumda. Ev ve ofis projelerine uygundur. Tüm aksesuarları ile beraber kiralık.',
  ownerName: 'Ahmet Kaya',
  ownerAvatar: getAvatarUrl('AK'),
  ownerRating: 4.8,
  ownerReviewCount: 12,
  ownerMemberSince: 'Ocak 2023',
  rating: 4.8,
  reviewCount: 12,
  category: 'Elektrikli Aletler',
  condition: 'Çok İyi',
  pickupLocation: 'Moda Sokak No: 42, Kadıköy',
  availability: 'Pazardan Cumaya 08:00 - 18:00',
  rules: [
    'Depozito: 50₺ gereklidir',
    'Maksimum süre: 7 gün',
    'Hasardan sorumlu olacaksınız',
    'Teslim saatinde pil değiştirilmiş olmalı',
  ],
  similarItems: [
    {
      id: '2',
      title: 'Makita Testere',
      image: getFeedImageUrl(4, 400, 400),
      type: 'daily',
      price: 50,
      distance: '1 km',
    },
    {
      id: '3',
      title: 'Tornavida Seti',
      image: getFeedImageUrl(5, 400, 400),
      type: 'free',
      distance: '3 km',
    },
    {
      id: '4',
      title: 'Bahçe Makası',
      image: getFeedImageUrl(6, 400, 400),
      type: 'free',
      distance: '4 km',
    },
    {
      id: '5',
      title: 'Çim Biçme Makinesi',
      image: getFeedImageUrl(7, 400, 400),
      type: 'hourly',
      price: 25,
      distance: '1 km',
    },
  ],
};

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [duration, setDuration] = useState('');
  const [message, setMessage] = useState('');

  const listing = mockListingDetail;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  const handleRequestSubmit = () => {
    setShowRequestModal(false);
    setSelectedDate('');
    setDuration('');
    setMessage('');
  };

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

  const priceLabel = (listing: ListingDetail) => {
    if (listing.type === 'free') return 'Ücretsiz';
    if (listing.type === 'hourly') return `₺${listing.price}/saat`;
    if (listing.type === 'daily') return `₺${listing.price}/gün`;
  };

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
            {/* Main Image */}
            <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-lg shadow-sm border border-[#e0e0e0] mb-4 bg-[#f0f2f5]">
              <Image
                src={listing.images[currentImageIndex]}
                alt={listing.title}
                fill
                unoptimized
                className="w-full h-full object-cover"
              />

              {/* Navigation Buttons */}
              {listing.images.length > 1 && (
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

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1}/{listing.images.length}
                  </div>
                </>
              )}

              {/* Favorite Button */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
                aria-label="Kaydet"
              >
                <Heart
                  className={cn(
                    'w-6 h-6',
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-[#404040]'
                  )}
                />
              </button>
            </div>

            {/* Thumbnail Strip */}
            {listing.images.length > 1 && (
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
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Card - Right */}
          <div className="space-y-6">
            {/* Type Badge and Price */}
            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span className={cn(
                    'inline-block text-white text-xs font-bold px-3 py-1 rounded-md mb-3',
                    listing.type === 'free' ? 'bg-[#00833e]' : 'bg-[#ff9500]'
                  )}>
                    {typeLabel(listing.type)}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#333]">{listing.title}</h1>
                </div>
                <button className="p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors">
                  <Share2 className="w-5 h-5 text-[#8f8f8f]" />
                </button>
              </div>

              <div className="mb-4 pb-4 border-b border-[#e0e0e0]">
                <p className="text-2xl sm:text-3xl font-bold text-[#00833e] mb-1">
                  {priceLabel(listing)}
                </p>
                <p className="text-sm text-[#8f8f8f]">{listing.category}</p>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-[#404040] mb-4">
                <MapPin className="w-4 h-4 text-[#8f8f8f] flex-shrink-0" />
                <span>{listing.distance} • {listing.neighborhood}</span>
              </div>

              {/* Availability */}
              <div className="flex items-start gap-2 text-sm text-[#404040] mb-6">
                <Clock className="w-4 h-4 text-[#8f8f8f] flex-shrink-0 mt-0.5" />
                <span>{listing.availability}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="w-full px-4 py-3 bg-[#00833e] text-white rounded-lg text-sm font-bold hover:bg-[#006b32] transition-colors"
                >
                  Talep Gönder
                </button>
              </div>
            </div>

            {/* Owner Card */}
            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
              <h2 className="text-lg font-bold text-[#333] mb-4">Mal Sahibi</h2>

              <div className="flex items-start gap-3 mb-4">
                <Image
                  src={listing.ownerAvatar}
                  alt={listing.ownerName}
                  width={56}
                  height={56}
                  unoptimized
                  className="w-14 h-14 rounded-full"
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#333]">{listing.ownerName}</p>
                  <p className="text-xs text-[#8f8f8f]">{listing.ownerMemberSince}'den beri üye</p>

                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-[#00833e] fill-[#00833e]" />
                    <span className="text-xs font-semibold text-[#00833e]">{listing.ownerRating}</span>
                    <span className="text-xs text-[#8f8f8f]">({listing.ownerReviewCount})</span>
                  </div>
                </div>
              </div>

              <button className="w-full px-4 py-2.5 border border-[#e0e0e0] bg-white text-[#333] rounded-lg text-sm font-semibold hover:bg-[#f0f2f5] transition-colors">
                Profili Ziyaret Et
              </button>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
          <h2 className="text-lg font-bold text-[#333] mb-4">Ürün Açıklaması</h2>
          <p className="text-sm text-[#404040] leading-relaxed mb-4">{listing.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#8f8f8f] font-semibold mb-1">DURUM</p>
              <p className="text-sm text-[#333] font-semibold">{listing.condition}</p>
            </div>
            <div>
              <p className="text-xs text-[#8f8f8f] font-semibold mb-1">TESLİM YERİ</p>
              <p className="text-sm text-[#333] font-semibold">{listing.pickupLocation}</p>
            </div>
          </div>
        </div>

        {/* Rules/Conditions Section */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
          <h2 className="text-lg font-bold text-[#333] mb-4">Koşullar ve Kurallar</h2>
          <div className="space-y-3">
            {listing.rules.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-[#ff9500] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#404040]">{rule}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Availability Calendar */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
          <h2 className="text-lg font-bold text-[#333] mb-4">Uygunluk Takvimi</h2>
          <div className="grid grid-cols-7 gap-2">
            {['Pzr', 'Pzt', 'Salı', 'Çar', 'Per', 'Cum', 'Cmt'].map((day) => (
              <div key={day} className="text-center">
                <p className="text-[10px] sm:text-xs text-[#8f8f8f] font-semibold mb-1">{day}</p>
                <div className="space-y-1">
                  {[1, 2, 3, 4].map((week) => (
                    <div
                      key={week}
                      className={cn(
                        'h-6 sm:h-8 rounded border-2 transition-colors',
                        Math.random() > 0.3
                          ? 'bg-[#e8f5e9] border-[#00833e]'
                          : 'bg-[#f5f5f5] border-[#e0e0e0] opacity-50'
                      )}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#8f8f8f] mt-3 text-center">
            Koyu renkli alanlar uygun tarihleri göstermektedir.
          </p>
        </div>

        {/* Similar Items */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
          <h2 className="text-lg font-bold text-[#333] mb-4">Benzer İlanlar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {listing.similarItems.map((item) => (
              <Link
                key={item.id}
                href={`/odunc-kirala/${item.id}`}
                className="bg-[#f0f2f5] rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="relative aspect-square overflow-hidden bg-[#e0e0e0]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    unoptimized
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className={cn(
                    'absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded',
                    item.type === 'free' ? 'bg-[#00833e]' : 'bg-[#ff9500]'
                  )}>
                    {typeLabel(item.type)}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-[#333] line-clamp-2 mb-1">
                    {item.title}
                  </p>
                  <p className="text-lg font-bold text-[#00833e] mb-1">
                    {item.type === 'free' ? 'Ücretsiz' : item.type === 'hourly' ? `₺${item.price}/saat` : `₺${item.price}/gün`}
                  </p>
                  <p className="text-xs text-[#8f8f8f]">{item.distance}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Talep Gönder Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-[#e0e0e0]">
              <h2 className="text-xl font-bold text-[#333]">Talep Gönder</h2>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#404040]" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#333] mb-2">
                  Talep Tarihi
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#e0e0e0] rounded-lg text-sm text-[#333] focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e] focus:ring-opacity-30"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#333] mb-2">
                  Süre
                </label>
                <input
                  type="text"
                  placeholder="örn: 2 gün, 5 saat"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#e0e0e0] rounded-lg text-sm text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e] focus:ring-opacity-30"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#333] mb-2">
                  İleti
                </label>
                <textarea
                  placeholder="Talep hakkında kısa bir açıklama..."
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#e0e0e0] rounded-lg text-sm text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e] focus:ring-opacity-30 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-2.5 border border-[#e0e0e0] text-[#404040] rounded-lg text-sm font-semibold hover:bg-[#f0f2f5] transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleRequestSubmit}
                  className="flex-1 px-4 py-2.5 bg-[#00833e] text-white rounded-lg text-sm font-semibold hover:bg-[#006b32] transition-colors"
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
