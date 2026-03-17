'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images';

const LeafletMap = dynamic(() => import('@/components/map/leaflet-map'), { ssr: false });
import {
  Star,
  MapPin,
  Phone,
  Globe,
  Clock,
  ChevronLeft,
  Heart,
  Share2,
  MapIcon,
  MessageSquare,
  ThumbsUp,
  Camera,
  Award,
  CheckCircle,
  AlertCircle,
  Navigation,
} from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

// Mock business data - "Moda Fırın" (Bakery)
const MOCK_BUSINESS = {
  id: '1',
  name: 'Moda Fırın',
  category: 'Fırın & Pasta',
  verified: true,
  rating: 4.5,
  reviewCount: 128,
  address: 'Moda Cad. No: 42, Beşiktaş/İstanbul',
  phone: '+90 212 358 7624',
  website: 'modafirin.com.tr',
  email: 'info@modafirin.com.tr',
  description: 'Moda Fırın, 1985 yılından beri Beşiktaş\'ta hizmet vermektedir. Taze fırın ürünleri, keke, pastane ve özel siparişleri ile ünlüdür. Her sabah erken saatlerde hazırlanan ekmeklerimiz ve pastalarımız müşterilerimizin favorisidir.',
  isOpen: true,
  coverImage: getFeedImageUrl(201, 1200, 400),
  logo: getFeedImageUrl(202, 128, 128),
  hours: [
    { day: 'Pazartesi', open: '06:30', close: '21:00' },
    { day: 'Salı', open: '06:30', close: '21:00' },
    { day: 'Çarşamba', open: '06:30', close: '21:00' },
    { day: 'Perşembe', open: '06:30', close: '21:00' },
    { day: 'Cuma', open: '06:30', close: '21:00' },
    { day: 'Cumartesi', open: '07:00', close: '21:30' },
    { day: 'Pazar', open: '07:00', close: '21:00' },
  ],
  services: [
    'Taze Ekmek Üretimi',
    'Özel Siparişler',
    'Doğum Günü Pastaları',
    'Nişan & Düğün Pastaları',
    'Glutensiz Ürünler',
    'Tereyağlı Börek',
    'Susamlı Simit',
    'Baklava Çeşitleri',
  ],
  images: [
    getFeedImageUrl(203, 400, 300),
    getFeedImageUrl(204, 400, 300),
    getFeedImageUrl(205, 400, 300),
    getFeedImageUrl(206, 400, 300),
    getFeedImageUrl(207, 400, 300),
    getFeedImageUrl(208, 400, 300),
  ],
  ratingBreakdown: {
    5: 78,
    4: 35,
    3: 10,
    2: 3,
    1: 2,
  },
};

interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
  isHelpful?: boolean;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Ayşe K.',
    avatar: 'AK',
    rating: 5,
    date: '2024-03-08',
    text: 'Sabahları taze ekmekler ve çok lezzetli pastaları var. Personel çok güler yüzlü ve hızlı servis yapıyorlar. Özel gün pastalarında da çok iyi çalışmalar yapıyor. Kesinlikle tavsiye ederim!',
    helpful: 24,
  },
  {
    id: '2',
    author: 'Mehmet D.',
    avatar: 'MD',
    rating: 4,
    date: '2024-03-06',
    text: 'Fiyatlar biraz yüksek ama kalite gerçekten ortada. Ekmekler her zaman taze ve kurtlu değil. Pasta seçenekleri çok çeşitli. Hafta sonları kalabalık olabiliyor, erkenden gitmek iyi olur.',
    helpful: 18,
  },
  {
    id: '3',
    author: 'Fatma T.',
    avatar: 'FT',
    rating: 5,
    date: '2024-03-05',
    text: 'Kızımın doğum günü pastasını burada yaptırdım. Tasarım tam istediğim gibi çıktı ve lezzetiydi. Yöneticileri çok profesyonel ve müşteriyi dinleyen insanlar. Herkese öneririm.',
    helpful: 31,
  },
  {
    id: '4',
    author: 'Ali Y.',
    avatar: 'AY',
    rating: 4,
    date: '2024-03-03',
    text: 'Simitler çok taze ve lezzetli, susamları gerçekten kaliteli. Akşam saatlerinde bazı ürünlerin bitmesi normal tabii ama sabahları hiç sorun yok. Haftada 3-4 gün gidiyorum artık.',
    helpful: 15,
  },
  {
    id: '5',
    author: 'Gülay N.',
    avatar: 'GN',
    rating: 5,
    date: '2024-02-28',
    text: 'Glutensiz ekmek bulması çok zor şehirde, burası gerçekten sağlık açısından önemli bir yere sahip. Kalitesi çok iyi, lezzetli ve beslenme açısından da güvenli.',
    helpful: 22,
  },
];

const MOCK_RECOMMENDATIONS = [
  {
    id: '2',
    name: 'Tatlı Dünyası',
    category: 'Tatlı & Pasta',
    rating: 4.7,
    reviewCount: 94,
    coverImage: getFeedImageUrl(301, 600, 300),
  },
  {
    id: '3',
    name: 'Köy Kahvaltısı',
    category: 'Kahvaltı & Çay',
    rating: 4.6,
    reviewCount: 156,
    coverImage: getFeedImageUrl(302, 600, 300),
  },
  {
    id: '5',
    name: 'Krem Pastane',
    category: 'Pastane',
    rating: 4.8,
    reviewCount: 203,
    coverImage: getFeedImageUrl(303, 600, 300),
  },
  {
    id: '6',
    name: 'Halk Simitçisi',
    category: 'Simit & Peynir',
    rating: 4.4,
    reviewCount: 87,
    coverImage: getFeedImageUrl(304, 600, 300),
  },
];

type TabType = 'about' | 'reviews' | 'photos' | 'recommendations';

export default function BusinessDetailPage({ params }: PageProps) {
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [recommendationPrompt, setRecommendationPrompt] = useState(false);

  const handleHelpfulClick = (reviewId: string) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              isHelpful: !review.isHelpful,
              helpful: review.isHelpful ? review.helpful - 1 : review.helpful + 1,
            }
          : review
      )
    );
  };

  const calculateAverageRating = () => {
    const total = Object.values(MOCK_BUSINESS.ratingBreakdown).reduce(
      (a, b) => a + b,
      0
    );
    const weighted = Object.entries(MOCK_BUSINESS.ratingBreakdown).reduce(
      (sum, [stars, count]) => sum + parseInt(stars) * count,
      0
    );
    return (weighted / total).toFixed(1);
  };

  const getRatingBarWidth = (count: number) => {
    const total = Object.values(MOCK_BUSINESS.ratingBreakdown).reduce(
      (a, b) => a + b,
      0
    );
    return (count / total) * 100;
  };

  const openStatus = MOCK_BUSINESS.isOpen ? 'Açık' : 'Kapalı';
  const statusColor = MOCK_BUSINESS.isOpen ? 'text-green-600' : 'text-red-600';
  const statusBg = MOCK_BUSINESS.isOpen ? 'bg-green-100' : 'bg-red-100';

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Back Button - Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#e0e0e0] px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/isletmeler"
            className="inline-flex items-center gap-2 text-[#00833e] hover:text-[#006b32] font-medium transition-colors"
          >
            <ChevronLeft size={20} />
            Geri Dön
          </Link>
        </div>
      </div>

      {/* Hero Section with Cover Image */}
      <div className="relative h-64 bg-cover bg-center overflow-hidden">
        <img
          src={MOCK_BUSINESS.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Business Header with Logo Overlay */}
        <div className="-mt-20 mb-8 relative z-10 flex flex-col md:flex-row md:items-end gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src={MOCK_BUSINESS.logo}
              alt={MOCK_BUSINESS.name}
              className="w-32 h-32 rounded-lg border-4 border-white shadow-lg bg-white"
            />
          </div>

          {/* Business Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {MOCK_BUSINESS.name}
                  </h1>
                  {MOCK_BUSINESS.verified && (
                    <CheckCircle
                      size={28}
                      className="text-[#00833e] flex-shrink-0"
                      fill="#00833e"
                    />
                  )}
                </div>
                <p className="text-[#00833e] font-semibold mb-3 text-lg">
                  {MOCK_BUSINESS.category}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < Math.floor(MOCK_BUSINESS.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : i < MOCK_BUSINESS.rating
                            ? 'fill-yellow-400 text-yellow-400 opacity-40'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-900">
                    {MOCK_BUSINESS.rating}
                  </span>
                  <span className="text-gray-600">
                    ({MOCK_BUSINESS.reviewCount} yorum)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`p-3 rounded-full transition-colors ${
                    liked
                      ? 'bg-red-100 text-red-600'
                      : 'bg-white text-gray-600 border border-[#e0e0e0] hover:bg-red-50'
                  }`}
                  title="Beğen"
                >
                  <Heart
                    size={20}
                    fill={liked ? 'currentColor' : 'none'}
                  />
                </button>
                <button className="p-3 rounded-full bg-white text-gray-600 border border-[#e0e0e0] hover:bg-gray-50 transition-colors" title="Paylaş">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Quick Status Bar */}
            <div className="flex flex-wrap gap-2 items-center">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusBg} ${statusColor}`}
              >
                {openStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Quick Info Bar */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <Phone
                    size={20}
                    className="text-[#00833e] flex-shrink-0 mt-1"
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-[#8f8f8f] mb-1">Telefon</p>
                    <a
                      href={`tel:${MOCK_BUSINESS.phone}`}
                      className="text-[#00833e] hover:text-[#006b32] font-medium break-all transition-colors"
                    >
                      {MOCK_BUSINESS.phone}
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Globe
                    size={20}
                    className="text-[#00833e] flex-shrink-0 mt-1"
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-[#8f8f8f] mb-1">Web Sayfası</p>
                    <a
                      href={`https://${MOCK_BUSINESS.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00833e] hover:text-[#006b32] font-medium truncate transition-colors"
                    >
                      {MOCK_BUSINESS.website}
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock
                    size={20}
                    className="text-[#00833e] flex-shrink-0 mt-1"
                  />
                  <div>
                    <p className="text-sm text-[#8f8f8f] mb-1">Çalışma Saatleri</p>
                    <p className="text-gray-900 font-medium">
                      {MOCK_BUSINESS.hours[0].open} -{' '}
                      {MOCK_BUSINESS.hours[0].close}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin
                    size={20}
                    className="text-[#00833e] flex-shrink-0 mt-1"
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-[#8f8f8f] mb-1">Konum</p>
                    <p className="text-gray-900 font-medium text-sm">
                      {MOCK_BUSINESS.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] mb-6 overflow-hidden">
              <div className="flex border-b border-[#e0e0e0] overflow-x-auto">
                {[
                  { id: 'about', label: 'Hakkında' },
                  { id: 'reviews', label: 'Yorumlar' },
                  { id: 'photos', label: 'Fotoğraflar' },
                  { id: 'recommendations', label: 'Öneriler' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`px-4 md:px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'text-[#00833e] border-b-2 border-[#00833e] bg-[#f0f2f5]'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* About Tab */}
                {activeTab === 'about' && (
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        İşletme Açıklaması
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {MOCK_BUSINESS.description}
                      </p>
                    </div>

                    {/* Services */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        Hizmetler
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {MOCK_BUSINESS.services.map((service, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-[#f0f2f5] rounded-lg"
                          >
                            <Award
                              size={18}
                              className="text-[#00833e] flex-shrink-0"
                            />
                            <span className="text-gray-900 font-medium">
                              {service}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hours Table */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        Çalışma Saatleri
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <tbody>
                            {MOCK_BUSINESS.hours.map((hour, index) => (
                              <tr
                                key={index}
                                className="border-b border-[#e0e0e0] last:border-0"
                              >
                                <td className="py-3 font-medium text-gray-900">
                                  {hour.day}
                                </td>
                                <td className="py-3 text-right text-gray-700">
                                  {hour.open} - {hour.close}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        İletişim Bilgileri
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-[#8f8f8f] mb-1">Telefon</p>
                          <a
                            href={`tel:${MOCK_BUSINESS.phone}`}
                            className="text-[#00833e] hover:text-[#006b32] font-medium transition-colors"
                          >
                            {MOCK_BUSINESS.phone}
                          </a>
                        </div>
                        <div>
                          <p className="text-sm text-[#8f8f8f] mb-1">
                            Email
                          </p>
                          <a
                            href={`mailto:${MOCK_BUSINESS.email}`}
                            className="text-[#00833e] hover:text-[#006b32] font-medium transition-colors"
                          >
                            {MOCK_BUSINESS.email}
                          </a>
                        </div>
                        <div>
                          <p className="text-sm text-[#8f8f8f] mb-1">Adres</p>
                          <p className="text-gray-900 font-medium">
                            {MOCK_BUSINESS.address}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Map */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        Konum
                      </h3>
                      <div className="w-full h-64 rounded-lg overflow-hidden border border-[#d9d9d9]">
                        <LeafletMap
                          center={[41.0422, 29.0050]}
                          zoom={15}
                          className="w-full h-full"
                          markers={[{
                            lat: 41.0422,
                            lng: 29.0050,
                            title: MOCK_BUSINESS.name,
                            description: MOCK_BUSINESS.address,
                            color: 'green',
                          }]}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {/* Rating Summary */}
                    <div className="bg-[#f0f2f5] rounded-lg p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Puan Özeti
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col items-center justify-center">
                          <div className="text-5xl font-bold text-[#00833e] mb-2">
                            {calculateAverageRating()}
                          </div>
                          <div className="flex gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={18}
                                className={
                                  i <
                                  Math.floor(
                                    parseFloat(calculateAverageRating())
                                  )
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600">
                            {MOCK_BUSINESS.reviewCount} yorum
                          </p>
                        </div>

                        {/* Rating Bars */}
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((stars) => (
                            <div key={stars} className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-700 w-6">
                                {stars}★
                              </span>
                              <div className="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-400 transition-all"
                                  style={{
                                    width: `${getRatingBarWidth(
                                      MOCK_BUSINESS.ratingBreakdown[
                                        stars as keyof typeof MOCK_BUSINESS.ratingBreakdown
                                      ]
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 w-8 text-right">
                                {
                                  MOCK_BUSINESS.ratingBreakdown[
                                    stars as keyof typeof MOCK_BUSINESS.ratingBreakdown
                                  ]
                                }
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Reviews List */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Müşteri Yorumları
                      </h3>
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div
                            key={review.id}
                            className="border border-[#e0e0e0] rounded-lg p-4 hover:border-[#00833e] transition-colors"
                          >
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#00833e] text-white rounded-full flex items-center justify-center font-bold text-sm">
                                  {review.avatar}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {review.author}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(
                                      review.date
                                    ).toLocaleDateString('tr-TR', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                    })}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className={
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700 mb-4 leading-relaxed">
                              {review.text}
                            </p>
                            <button
                              onClick={() => handleHelpfulClick(review.id)}
                              className={`flex items-center gap-2 text-sm font-medium transition-colors px-3 py-2 rounded ${
                                review.isHelpful
                                  ? 'text-[#00833e] bg-[#e6f4ec]'
                                  : 'text-gray-600 hover:text-[#00833e] hover:bg-[#f0f2f5]'
                              }`}
                            >
                              <ThumbsUp size={16} />
                              Faydalı ({review.helpful})
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Photos Tab */}
                {activeTab === 'photos' && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Fotoğraf Galerisi
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {MOCK_BUSINESS.images.map((image, index) => (
                        <div
                          key={index}
                          className="aspect-square bg-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group relative"
                        >
                          <img
                            src={image}
                            alt={`Fotoğraf ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <Camera
                              size={32}
                              className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-[#e6f4ec] border border-[#00833e] rounded-lg flex items-start gap-3">
                      <Camera size={18} className="text-[#00833e] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Fotoğraf Ekleyin
                        </p>
                        <p className="text-xs text-gray-700">
                          İşletmeyi ziyaret ettiğinizde fotoğraf ekleyerek diğer komşuları bilgilendirin
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recommendations Tab */}
                {activeTab === 'recommendations' && (
                  <div className="space-y-6">
                    {/* Write Review Prompt */}
                    <div className="bg-gradient-to-r from-[#e6f4ec] to-[#f0f2f5] border border-[#00833e] rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <Heart size={32} className="text-[#00833e] flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            Yorum Yaz
                          </h3>
                          <p className="text-sm text-gray-700 mb-4">
                            Bu işletmede yaşadığınız deneyimi komşularınızla paylaşın ve diğer kullanıcılara yardımcı olun.
                          </p>
                          <button
                            onClick={() =>
                              setRecommendationPrompt(
                                !recommendationPrompt
                              )
                            }
                            className="bg-[#00833e] hover:bg-[#006b32] text-white font-bold py-2 px-6 rounded-lg transition-colors text-sm"
                          >
                            Yorum Yaz
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Similar Businesses */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Benzer İşletmeler
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {MOCK_RECOMMENDATIONS.map((rec) => (
                          <Link
                            key={rec.id}
                            href={`/isletmeler/${rec.id}`}
                            className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden hover:shadow-lg hover:border-[#00833e] transition-all group"
                          >
                            <div className="h-40 overflow-hidden bg-gray-200">
                              <img
                                src={rec.coverImage}
                                alt={rec.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="p-3">
                              <p className="font-bold text-gray-900 group-hover:text-[#00833e] transition-colors line-clamp-2 mb-1">
                                {rec.name}
                              </p>
                              <p className="text-xs text-[#00833e] font-medium mb-2">
                                {rec.category}
                              </p>
                              <div className="flex items-center gap-1">
                                <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={13}
                                      className={
                                        i < Math.floor(rec.rating)
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : i < rec.rating
                                          ? 'fill-yellow-400 text-yellow-400 opacity-40'
                                          : 'text-gray-300'
                                      }
                                    />
                                  ))}
                                </div>
                                <span className="text-xs font-medium text-gray-700">
                                  {rec.rating} ({rec.reviewCount})
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Action Buttons */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6 space-y-3">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Hızlı İşlemler
              </h3>

              <a
                href={`tel:${MOCK_BUSINESS.phone}`}
                className="w-full flex items-center justify-center gap-2 bg-[#00833e] hover:bg-[#006b32] text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <Phone size={18} />
                Ara
              </a>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  MOCK_BUSINESS.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-white border border-[#00833e] text-[#00833e] font-medium py-3 px-4 rounded-lg hover:bg-[#f0f2f5] transition-colors"
              >
                <Navigation size={18} />
                Yol Tarifi
              </a>

              <a
                href={`https://${MOCK_BUSINESS.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-white border border-[#00833e] text-[#00833e] font-medium py-3 px-4 rounded-lg hover:bg-[#f0f2f5] transition-colors"
              >
                <Globe size={18} />
                Web Sitesi
              </a>

              <Link href="/iletisim" className="w-full flex items-center justify-center gap-2 bg-white border border-[#00833e] text-[#00833e] font-medium py-3 px-4 rounded-lg hover:bg-[#f0f2f5] transition-colors">
                <Phone size={18} />
                İletişime Geç
              </Link>
            </div>

            {/* Recommend Button */}
            <div className="bg-[#e6f4ec] border border-[#00833e] rounded-lg p-6 text-center">
              <Heart size={36} className="text-[#00833e] mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-900 mb-3">
                Bu işletmeyi beğendiniz mi?
              </h3>
              <button className="w-full bg-[#00833e] hover:bg-[#006b32] text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Heart size={18} fill="white" />
                Öner
              </button>
              <p className="text-xs text-gray-600 mt-3">
                Komşularınız sizin önerinizi görecek
              </p>
            </div>

            {/* Business Info Card */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                İşletme Bilgisi
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-[#8f8f8f] mb-1">Kategori</p>
                  <p className="font-medium text-gray-900">
                    {MOCK_BUSINESS.category}
                  </p>
                </div>
                <div>
                  <p className="text-[#8f8f8f] mb-1">Durumu</p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        MOCK_BUSINESS.isOpen
                          ? 'bg-green-600'
                          : 'bg-red-600'
                      }`}
                    ></div>
                    <p className="font-medium text-gray-900">
                      {MOCK_BUSINESS.isOpen ? 'Açık' : 'Kapalı'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[#8f8f8f] mb-1">Puan</p>
                  <p className="font-medium text-gray-900">
                    {MOCK_BUSINESS.rating} / 5.0
                  </p>
                </div>
                <div>
                  <p className="text-[#8f8f8f] mb-1">Yorum Sayısı</p>
                  <p className="font-medium text-gray-900">
                    {MOCK_BUSINESS.reviewCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 py-8 border-t border-[#e0e0e0]">
          <div className="text-center text-sm text-gray-600">
            <p>
              Bu sayfadaki bilgiler son olarak{' '}
              <span className="font-medium">9 Mart 2024</span> tarihinde
              güncellenmiştir.
            </p>
            <p className="mt-2">
              Bilgiler hatalı veya eski midir?{' '}
              <button className="text-[#00833e] hover:text-[#006b32] font-medium transition-colors">
                Bize bildirin
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
