'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  MapPin,
  Phone,
  Globe,
  Clock,
  ChevronLeft,
  Heart,
  Share2,
  Briefcase,
} from 'lucide-react';
import { ReviewForm } from '@/components/business/review-form';

interface PageProps {
  params: {
    slug: string;
  };
}

const MOCK_BUSINESS = {
  id: '1',
  name: 'Kahvehane Keyif',
  category: 'Kahve & Çay',
  rating: 4.8,
  reviewCount: 145,
  address: 'Mah. Cad. No: 25, Beşiktaş/İstanbul',
  phone: '+90 212 123 4567',
  website: 'kahvehane-keyif.com',
  email: 'info@kahvehane-keyif.com',
  hours: '08:00 - 23:00',
  description:
    'Geleneksel Türk kahvesi ve çayları hazırladığımız cozy kahvehane. Yerli malzemeler kullanarak el emeği ile hazırlanan özel tariflerimiz var.',
  logo: undefined,
  images: [null, null, null],
};

const MOCK_REVIEWS = [
  {
    id: '1',
    author: 'Ahmet K.',
    rating: 5,
    date: '2024-03-08',
    text: 'Harika bir ortam ve lezzetli kahveler. Güleryüzlü personeli ve temiz işletmesi var. Kesinlikle tavsiye ederim!',
  },
  {
    id: '2',
    author: 'Fatma D.',
    rating: 4,
    date: '2024-03-06',
    text: 'Çay seçenekleri çok iyi. Biraz pahalı ama kalite ortada. Arkadaşlarla oturmak için ideal bir yer.',
  },
  {
    id: '3',
    author: 'Mustafa T.',
    rating: 5,
    date: '2024-03-05',
    text: 'En iyi Türk kahvesi bu mahallede. Fincan sunumundan ev sahibi tutumuna kadar her şey mükemmel.',
  },
  {
    id: '4',
    author: 'Elif Y.',
    rating: 4,
    date: '2024-03-03',
    text: 'Rahat bir ortam var ama biraz gürültülü oluyor bazı saatlerde. Yine de gelmek isterim.',
  },
];

const MOCK_RECOMMENDATIONS = [
  {
    id: '2',
    name: 'Tatlı Dünyası',
    category: 'Pastane & Fırın',
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: '3',
    name: 'Usta Berber',
    category: 'Berberlik',
    rating: 4.9,
    reviewCount: 234,
  },
  {
    id: '5',
    name: 'Elektrik Ustası Serkan',
    category: 'Hizmet & Onarım',
    rating: 4.7,
    reviewCount: 156,
  },
];

export default function BusinessDetailPage({ params }: PageProps) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="min-h-screen bg-[#e6f4ec]">
      {/* Back Button */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#d1fae5] px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/isletmeler"
            className="inline-flex items-center gap-2 text-[#00833e] hover:text-[#006b32] font-medium"
          >
            <ChevronLeft size={20} />
            Geri Dön
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#a7dbb8] to-green-200 rounded-lg h-48 mb-6 flex items-center justify-center">
          {MOCK_BUSINESS.logo ? (
            <img
              src={MOCK_BUSINESS.logo}
              alt={MOCK_BUSINESS.name}
              className="h-32 w-32 object-cover rounded"
            />
          ) : (
            <div className="h-32 w-32 bg-[#34d399] rounded flex items-center justify-center text-[#006b32] font-bold text-5xl">
              {MOCK_BUSINESS.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Business Header */}
            <div className="bg-white rounded-lg border border-[#d1fae5] p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {MOCK_BUSINESS.name}
                  </h1>
                  <p className="text-[#00833e] font-medium mb-3">
                    {MOCK_BUSINESS.category}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={
                            i < Math.floor(MOCK_BUSINESS.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : i < MOCK_BUSINESS.rating
                              ? 'fill-yellow-400 text-yellow-400 opacity-50'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                    <span className="font-medium text-gray-700">
                      {MOCK_BUSINESS.rating} ({MOCK_BUSINESS.reviewCount} yorum)
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`p-3 rounded-full transition-colors ${
                      liked
                        ? 'bg-red-100 text-red-600'
                        : 'bg-[#e6f4ec] text-[#00833e] hover:bg-[#d1fae5]'
                    }`}
                  >
                    <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                  </button>
                  <button className="p-3 rounded-full bg-[#e6f4ec] text-[#00833e] hover:bg-[#d1fae5] transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Business Info */}
            <div className="bg-white rounded-lg border border-[#d1fae5] p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">İşletme Bilgileri</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <MapPin size={20} className="text-[#00833e] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Konum</p>
                    <p className="text-gray-600">{MOCK_BUSINESS.address}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone size={20} className="text-[#00833e] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Telefon</p>
                    <a
                      href={`tel:${MOCK_BUSINESS.phone}`}
                      className="text-[#00833e] hover:text-[#006b32]"
                    >
                      {MOCK_BUSINESS.phone}
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Globe size={20} className="text-[#00833e] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Web Sayfası</p>
                    <a
                      href={`https://${MOCK_BUSINESS.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00833e] hover:text-[#006b32]"
                    >
                      {MOCK_BUSINESS.website}
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock size={20} className="text-[#00833e] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Çalışma Saatleri</p>
                    <p className="text-gray-600">{MOCK_BUSINESS.hours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg border border-[#d1fae5] p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Hakkında</h2>
              <p className="text-gray-700 leading-relaxed">{MOCK_BUSINESS.description}</p>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg border border-[#d1fae5] p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Müşteri Yorumları ({MOCK_BUSINESS.reviewCount})
              </h2>
              <div className="space-y-4">
                {MOCK_REVIEWS.map((review) => (
                  <div key={review.id} className="border-b border-[#d1fae5] pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{review.author}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Form */}
            <ReviewForm businessName={MOCK_BUSINESS.name} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact CTA */}
            <div className="bg-gradient-to-r from-[#00833e] to-green-600 rounded-lg text-white p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">İletişime Geç</h3>
              <button className="w-full bg-white text-[#00833e] font-medium py-2 px-4 rounded-lg mb-3 hover:bg-[#e6f4ec] transition-colors">
                <Phone size={18} className="inline mr-2" />
                Ara
              </button>
              <button className="w-full bg-[#006b32] hover:bg-[#005a2b] font-medium py-2 px-4 rounded-lg transition-colors">
                <Globe size={18} className="inline mr-2" />
                Web Sayfasına Git
              </button>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg border border-[#d1fae5] p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase size={20} className="text-[#00833e]" />
                Benzer İşletmeler
              </h3>
              <div className="space-y-3">
                {MOCK_RECOMMENDATIONS.map((rec) => (
                  <Link
                    key={rec.id}
                    href={`/isletmeler/${rec.id}`}
                    className="block p-3 border border-[#d1fae5] rounded-lg hover:border-[#00a24d] hover:bg-[#e6f4ec] transition-colors"
                  >
                    <p className="font-medium text-gray-900 text-sm">{rec.name}</p>
                    <p className="text-xs text-[#00833e] mb-2">{rec.category}</p>
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < Math.floor(rec.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        {rec.rating} ({rec.reviewCount})
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
