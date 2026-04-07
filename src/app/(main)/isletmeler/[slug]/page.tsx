'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images';
import { createClient } from '@/lib/supabase/client';
import { checkSubscriptionStatus } from '@/lib/services/business-subscription';
import SubscriptionExpiredOverlay from '@/components/business/subscription-expired-overlay';

const GoogleMap = dynamic(() => import('@/components/map/google-map'), { ssr: false });
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
  const [subscriptionExpired, setSubscriptionExpired] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // Abonelik durumu kontrolü
  useEffect(() => {
    const checkSub = async () => {
      try {
        const supabase = createClient();
        // İşletme bilgilerini slug ile çek
        const { data: business } = await supabase
          .from('businesses')
          .select('id, owner_id')
          .eq('slug', params.slug)
          .single();

        if (!business) return;

        // Mevcut kullanıcı işletme sahibi mi?
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.id === business.owner_id) {
          setIsOwner(true);
        }

        // Abonelik durumunu kontrol et
        const result = await checkSubscriptionStatus(business.id);
        if (result.shouldBlur) {
          setSubscriptionExpired(true);
        }
      } catch (err) {
        // Hata durumunda blur gösterme (mock data ile çalışırken)
        console.log('Subscription check skipped:', err);
      }
    }
    checkSub();
  }, [params.slug]);

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
      {/* Subscription Expired Overlay - blur/lock */}
      {subscriptionExpired && (
        <SubscriptionExpiredOverlay
          businessName={MOCK_BUSINESS.name}
          isOwner={isOwner}
        />
      )}

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