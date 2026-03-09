'use client';

import { useState } from 'react';
import { MessageCircle, MapPin, Clock, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const mockListing = {
  id: '1',
  title: 'Laptop Lenovo IdeaPad 5 - 15.6 inç Full HD',
  price: 8500,
  condition: 'good' as const,
  category: 'electronics',
  location: 'Şişli, İstanbul',
  timeAgo: '2 saat önce',
  description: 'Lenovo IdeaPad 5 15.6" Full HD IPS ekran, Intel Core i5-1135G7, 8GB DDR4 RAM, 512GB SSD. Çok az kullanılmıştır.',
  images: [
    'https://images.unsplash.com/photo-1588405748847-5e9d6f6abc05?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1559056169-641ef0ac8b9b?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=450&fit=crop',
  ],
  seller: {
    id: 'seller1',
    name: 'Mehmet Yılmaz',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop',
    rating: 4.8,
    reviewCount: 23,
    responseTime: '< 1 saat',
    joinDate: '2 yıl önce',
  },
  specs: [
    { label: 'İşlemci', value: 'Intel Core i5-1135G7' },
    { label: 'RAM', value: '8GB DDR4' },
    { label: 'Depolama', value: '512GB SSD' },
    { label: 'Ekran', value: '15.6" Full HD IPS' },
  ],
};

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + mockListing.images.length) % mockListing.images.length
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mockListing.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Link
          href="/pazar"
          className="flex items-center gap-1 text-[#00833e] hover:text-[#006b32] font-medium mb-4"
        >
          <ChevronLeft size={20} />
          Pazara Dön
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative bg-gray-100 aspect-square">
                <img
                  src={mockListing.images[currentImageIndex]}
                  alt={mockListing.title}
                  className="w-full h-full object-cover"
                />

                {mockListing.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {mockListing.images.length}
                </div>

                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-3 left-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                  <Heart
                    size={24}
                    className={cn(
                      isFavorite
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-400'
                    )}
                  />
                </button>
              </div>

              {mockListing.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto bg-gray-50 border-t border-gray-200">
                  {mockListing.images.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={cn(
                        'w-20 h-20 rounded-lg flex-shrink-0 overflow-hidden border-2 transition-colors',
                        currentImageIndex === idx
                          ? 'border-[#00833e]'
                          : 'border-gray-300'
                      )}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Özellikleri</h2>
              <div className="grid grid-cols-2 gap-4">
                {mockListing.specs.map((spec, idx) => (
                  <div key={idx}>
                    <p className="text-sm text-gray-500 mb-1">{spec.label}</p>
                    <p className="text-sm font-medium text-gray-900">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Açıklama</h2>
              <p className="text-gray-700 leading-relaxed">{mockListing.description}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h1 className="text-2xl font-bold text-gray-900">
                ₺{mockListing.price.toLocaleString('tr-TR')}
              </h1>
              <p className="text-sm text-gray-500 mt-1">{mockListing.condition}</p>

              <div className="space-y-2 text-sm text-gray-600 my-4">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{mockListing.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{mockListing.timeAgo}</span>
                </div>
              </div>

              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className="w-full px-4 py-3 bg-[#00833e] text-white rounded-lg font-medium hover:bg-[#006b32] transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Satıcıya Mesaj Gönder
              </button>
            </div>

            {showContactForm && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Satıcıya Mesaj Gönder</h3>
                <textarea
                  placeholder="Sorunuz veya teklifinizi yazın..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00833e] resize-none"
                />
                <button className="w-full mt-3 px-4 py-2 bg-[#00833e] text-white rounded-lg font-medium hover:bg-[#006b32] transition-colors">
                  Gönder
                </button>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Satıcı Bilgisi</h3>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={mockListing.seller.avatar}
                  alt={mockListing.seller.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{mockListing.seller.name}</p>
                  <p className="text-xs text-gray-500">{mockListing.seller.joinDate}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div>
                  <p className="text-gray-500">Puan</p>
                  <p className="font-medium text-gray-900">
                    {mockListing.seller.rating} ({mockListing.seller.reviewCount} yorum)
                  </p>
                </div>
              </div>

              <button className="w-full px-4 py-2 border border-[#00833e] text-[#00833e] rounded-lg font-medium hover:bg-[#e6f4ec] transition-colors">
                Profili Görüntüle
              </button>
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              <Share2 size={18} />
              Paylaş
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
