'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { createClient as createTypedClient } from '@/lib/supabase/client';
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
  CheckCircle,
  Navigation,
  Loader2,
  Store,
  MessageSquare,
} from 'lucide-react';

// NOT (2026-06-07): Bu sayfa eskiden tümüyle sahte "Moda Fırın" verisi + sahte
// yorumlar gösteriyordu — geçersiz slug'da bile. Artık yalnızca gerçek
// businesses + business_reviews verisine bağlı. Veride bulunmayan alanlar
// (kategori, harita, çalışma saatleri, hizmet listesi, foto galerisi) sahte
// doldurulmaz; ilgili bölüm gizlenir veya boş-durum gösterilir. Bkz. TECH_DEBT #12.

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface BusinessRow {
  id: string;
  owner_id: string | null;
  name: string;
  slug: string;
  category_id: string | null;
  description: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  logo_url: string | null;
  cover_url: string | null;
  lat: number | null;
  lng: number | null;
  is_verified: boolean | null;
  rating_avg: number | null;
  review_count: number | null;
  recommendation_count: number | null;
  working_hours: Array<{ day: string; open: string; close: string }> | null;
  instagram: string | null;
  facebook: string | null;
  twitter: string | null;
}

interface ReviewRow {
  id: string;
  rating: number;
  body: string | null;
  created_at: string;
  profiles?: { full_name: string | null; avatar_url: string | null } | null;
}

interface SimilarRow {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  cover_url: string | null;
  rating_avg: number | null;
  review_count: number | null;
}

type TabType = 'about' | 'reviews' | 'similar';

function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function webHrefOf(website: string | null): string | null {
  if (!website) return null;
  return website.startsWith('http') ? website : `https://${website}`;
}

export default function BusinessDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<BusinessRow | null>(null);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [similar, setSimilar] = useState<SimilarRow[]>([]);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [subscriptionExpired, setSubscriptionExpired] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const supabase = createTypedClient() as any;

      // 1) İşletmeyi slug ile çek
      const { data: biz } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', slug)
        .single();

      if (cancelled) return;

      if (!biz) {
        setBusiness(null);
        setLoading(false);
        return;
      }
      setBusiness(biz as BusinessRow);

      // 2) Sahiplik + abonelik durumu
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!cancelled && user && user.id === biz.owner_id) {
          setIsOwner(true);
        }
        const result = await checkSubscriptionStatus(biz.id);
        if (!cancelled && result.shouldBlur) {
          setSubscriptionExpired(true);
        }
      } catch {
        // sessiz: abonelik kontrolü zorunlu değil
      }

      // 3) Gerçek yorumlar (yazar adı için profiles join; ilişki yoksa boş)
      try {
        const { data: revs, error: revErr } = await supabase
          .from('business_reviews')
          .select('id, rating, body, created_at, profiles:user_id(full_name, avatar_url)')
          .eq('business_id', biz.id)
          .order('created_at', { ascending: false });
        if (!cancelled) setReviews(revErr ? [] : ((revs as ReviewRow[]) || []));
      } catch {
        if (!cancelled) setReviews([]);
      }

      // 4) Diğer işletmeler (varsa aynı kategori, yoksa genel) — sahte öneri yok
      try {
        let q = supabase
          .from('businesses')
          .select('id, name, slug, logo_url, cover_url, rating_avg, review_count')
          .neq('id', biz.id)
          .limit(4);
        if (biz.category_id) q = q.eq('category_id', biz.category_id);
        const { data: others } = await q;
        if (!cancelled) setSimilar((others as SimilarRow[]) || []);
      } catch {
        if (!cancelled) setSimilar([]);
      }

      if (!cancelled) setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // ----- Yükleniyor -----
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex flex-col items-center justify-center gap-3">
        <Loader2 size={36} className="text-[#00833e] animate-spin" />
        <p className="text-gray-600 text-sm">İşletme yükleniyor…</p>
      </div>
    );
  }

  // ----- Bulunamadı -----
  if (!business) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-white border border-[#e0e0e0] flex items-center justify-center">
          <Store size={32} className="text-gray-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">İşletme bulunamadı</h1>
          <p className="text-gray-600 text-sm">
            Aradığınız işletme kaldırılmış veya bağlantı hatalı olabilir.
          </p>
        </div>
        <Link
          href="/isletmeler"
          className="inline-flex items-center gap-2 bg-[#00833e] hover:bg-[#006b32] text-white font-medium py-2.5 px-5 rounded-lg transition-colors"
        >
          <ChevronLeft size={18} />
          İşletmelere Dön
        </Link>
      </div>
    );
  }

  // ----- Türetilen değerler (yalnızca gerçek veriden) -----
  const reviewCount = reviews.length;
  const avgRating =
    reviewCount > 0
      ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviewCount
      : 0;
  const ratingBreakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const k = Math.round(r.rating);
    if (k >= 1 && k <= 5) ratingBreakdown[k] += 1;
  });

  const hasHours =
    Array.isArray(business.working_hours) && business.working_hours.length > 0;
  const hasLocation = business.lat != null && business.lng != null;
  const webHref = webHrefOf(business.website);

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Abonelik süresi dolmuş kaplaması */}
      {subscriptionExpired && (
        <SubscriptionExpiredOverlay businessName={business.name} isOwner={isOwner} />
      )}

      {/* Sticky geri butonu */}
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

      {/* Kapak */}
      <div className="relative h-64 bg-cover bg-center overflow-hidden bg-gradient-to-br from-[#00833e] to-[#006b32]">
        {business.cover_url && (
          <img
            src={business.cover_url}
            alt={business.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Başlık + logo */}
        <div className="-mt-20 mb-8 relative z-10 flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-shrink-0">
            {business.logo_url ? (
              <img
                src={business.logo_url}
                alt={business.name}
                className="w-32 h-32 rounded-lg border-4 border-white shadow-lg bg-white object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-lg border-4 border-white shadow-lg bg-[#e6f4ec] flex items-center justify-center">
                <Store size={48} className="text-[#00833e]" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {business.name}
                  </h1>
                  {business.is_verified && (
                    <CheckCircle
                      size={28}
                      className="text-[#00833e] flex-shrink-0"
                      fill="#00833e"
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {reviewCount > 0 ? (
                    <>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            className={
                              i < Math.floor(avgRating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-gray-900">
                        {avgRating.toFixed(1)}
                      </span>
                      <span className="text-gray-600">({reviewCount} yorum)</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">
                      Henüz değerlendirilmemiş
                    </span>
                  )}
                </div>
              </div>

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
                  <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                </button>
                <button
                  className="p-3 rounded-full bg-white text-gray-600 border border-[#e0e0e0] hover:bg-gray-50 transition-colors"
                  title="Paylaş"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ana içerik */}
          <div className="lg:col-span-2">
            {/* Hızlı bilgi çubuğu */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {business.phone && (
                  <div className="flex gap-3">
                    <Phone size={20} className="text-[#00833e] flex-shrink-0 mt-1" />
                    <div className="min-w-0">
                      <p className="text-sm text-[#8f8f8f] mb-1">Telefon</p>
                      <a
                        href={`tel:${business.phone}`}
                        className="text-[#00833e] hover:text-[#006b32] font-medium break-all transition-colors"
                      >
                        {business.phone}
                      </a>
                    </div>
                  </div>
                )}
                {webHref && (
                  <div className="flex gap-3">
                    <Globe size={20} className="text-[#00833e] flex-shrink-0 mt-1" />
                    <div className="min-w-0">
                      <p className="text-sm text-[#8f8f8f] mb-1">Web Sayfası</p>
                      <a
                        href={webHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00833e] hover:text-[#006b32] font-medium truncate transition-colors block"
                      >
                        {business.website}
                      </a>
                    </div>
                  </div>
                )}
                {hasHours && (
                  <div className="flex gap-3">
                    <Clock size={20} className="text-[#00833e] flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-[#8f8f8f] mb-1">Çalışma Saatleri</p>
                      <p className="text-gray-900 font-medium">
                        {business.working_hours![0].open} -{' '}
                        {business.working_hours![0].close}
                      </p>
                    </div>
                  </div>
                )}
                {business.address && (
                  <div className="flex gap-3">
                    <MapPin size={20} className="text-[#00833e] flex-shrink-0 mt-1" />
                    <div className="min-w-0">
                      <p className="text-sm text-[#8f8f8f] mb-1">Konum</p>
                      <p className="text-gray-900 font-medium text-sm">
                        {business.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sekmeler */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] mb-6 overflow-hidden">
              <div className="flex border-b border-[#e0e0e0] overflow-x-auto">
                {[
                  { id: 'about', label: 'Hakkında' },
                  { id: 'reviews', label: 'Yorumlar' },
                  { id: 'similar', label: 'Diğer İşletmeler' },
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

              <div className="p-6">
                {/* Hakkında */}
                {activeTab === 'about' && (
                  <div className="space-y-6">
                    {business.description && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                          İşletme Açıklaması
                        </h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {business.description}
                        </p>
                      </div>
                    )}

                    {hasHours && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                          Çalışma Saatleri
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <tbody>
                              {business.working_hours!.map((hour, index) => (
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
                    )}

                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        İletişim Bilgileri
                      </h3>
                      <div className="space-y-3">
                        {business.phone && (
                          <div>
                            <p className="text-sm text-[#8f8f8f] mb-1">Telefon</p>
                            <a
                              href={`tel:${business.phone}`}
                              className="text-[#00833e] hover:text-[#006b32] font-medium transition-colors"
                            >
                              {business.phone}
                            </a>
                          </div>
                        )}
                        {business.address && (
                          <div>
                            <p className="text-sm text-[#8f8f8f] mb-1">Adres</p>
                            <p className="text-gray-900 font-medium">
                              {business.address}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {hasLocation && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Konum</h3>
                        <div className="w-full h-64 rounded-lg overflow-hidden border border-[#d9d9d9]">
                          <GoogleMap
                            center={[business.lat as number, business.lng as number]}
                            zoom={15}
                            className="w-full h-full"
                            markers={[
                              {
                                lat: business.lat as number,
                                lng: business.lng as number,
                                title: business.name,
                                description: business.address || '',
                                color: 'green',
                              },
                            ]}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Yorumlar */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {reviewCount > 0 ? (
                      <>
                        <div className="bg-[#f0f2f5] rounded-lg p-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Puan Özeti
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col items-center justify-center">
                              <div className="text-5xl font-bold text-[#00833e] mb-2">
                                {avgRating.toFixed(1)}
                              </div>
                              <div className="flex gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={18}
                                    className={
                                      i < Math.floor(avgRating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }
                                  />
                                ))}
                              </div>
                              <p className="text-sm text-gray-600">{reviewCount} yorum</p>
                            </div>

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
                                        width: `${
                                          (ratingBreakdown[stars] / reviewCount) * 100
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-gray-600 w-8 text-right">
                                    {ratingBreakdown[stars]}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Müşteri Yorumları
                          </h3>
                          <div className="space-y-4">
                            {reviews.map((review) => (
                              <div
                                key={review.id}
                                className="border border-[#e0e0e0] rounded-lg p-4"
                              >
                                <div className="flex items-start justify-between gap-4 mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#00833e] text-white rounded-full flex items-center justify-center font-bold text-sm">
                                      {getInitials(review.profiles?.full_name)}
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900">
                                        {review.profiles?.full_name || 'Komşu'}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {new Date(review.created_at).toLocaleDateString(
                                          'tr-TR',
                                          {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                          }
                                        )}
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
                                {review.body && (
                                  <p className="text-gray-700 leading-relaxed">
                                    {review.body}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-14 h-14 rounded-full bg-[#f0f2f5] flex items-center justify-center mx-auto mb-4">
                          <MessageSquare size={26} className="text-gray-400" />
                        </div>
                        <p className="font-medium text-gray-900 mb-1">
                          Henüz yorum yapılmamış
                        </p>
                        <p className="text-sm text-gray-600">
                          Bu işletmeye ilk yorumu siz yapabilirsiniz.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Diğer işletmeler */}
                {activeTab === 'similar' && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Diğer İşletmeler
                    </h3>
                    {similar.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {similar.map((b) => (
                          <Link
                            key={b.id}
                            href={`/isletmeler/${b.slug}`}
                            className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden hover:shadow-lg hover:border-[#00833e] transition-all group"
                          >
                            <div className="h-40 overflow-hidden bg-[#e6f4ec] flex items-center justify-center">
                              {b.cover_url || b.logo_url ? (
                                <img
                                  src={(b.cover_url || b.logo_url) as string}
                                  alt={b.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <Store size={40} className="text-[#00833e]" />
                              )}
                            </div>
                            <div className="p-3">
                              <p className="font-bold text-gray-900 group-hover:text-[#00833e] transition-colors line-clamp-2 mb-1">
                                {b.name}
                              </p>
                              {(b.review_count || 0) > 0 ? (
                                <div className="flex items-center gap-1">
                                  <Star
                                    size={13}
                                    className="fill-yellow-400 text-yellow-400"
                                  />
                                  <span className="text-xs font-medium text-gray-700">
                                    {Number(b.rating_avg || 0).toFixed(1)} ({b.review_count})
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-500">
                                  Henüz değerlendirilmemiş
                                </span>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 py-6 text-center">
                        Şu an gösterilecek başka işletme bulunmuyor.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Yan panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6 space-y-3">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Hızlı İşlemler</h3>

              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  className="w-full flex items-center justify-center gap-2 bg-[#00833e] hover:bg-[#006b32] text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  <Phone size={18} />
                  Ara
                </a>
              )}

              {business.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    business.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-white border border-[#00833e] text-[#00833e] font-medium py-3 px-4 rounded-lg hover:bg-[#f0f2f5] transition-colors"
                >
                  <Navigation size={18} />
                  Yol Tarifi
                </a>
              )}

              {webHref && (
                <a
                  href={webHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-white border border-[#00833e] text-[#00833e] font-medium py-3 px-4 rounded-lg hover:bg-[#f0f2f5] transition-colors"
                >
                  <Globe size={18} />
                  Web Sitesi
                </a>
              )}

              <Link
                href="/iletisim"
                className="w-full flex items-center justify-center gap-2 bg-white border border-[#00833e] text-[#00833e] font-medium py-3 px-4 rounded-lg hover:bg-[#f0f2f5] transition-colors"
              >
                <MessageSquare size={18} />
                İletişime Geç
              </Link>
            </div>

            <div className="bg-white rounded-lg border border-[#e0e0e0] p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">İşletme Bilgisi</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-[#8f8f8f] mb-1">Puan</p>
                  <p className="font-medium text-gray-900">
                    {reviewCount > 0 ? `${avgRating.toFixed(1)} / 5.0` : 'Henüz yok'}
                  </p>
                </div>
                <div>
                  <p className="text-[#8f8f8f] mb-1">Yorum Sayısı</p>
                  <p className="font-medium text-gray-900">{reviewCount}</p>
                </div>
                <div>
                  <p className="text-[#8f8f8f] mb-1">Doğrulama</p>
                  <p className="font-medium text-gray-900">
                    {business.is_verified ? 'Doğrulanmış işletme' : 'Doğrulanmamış'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
