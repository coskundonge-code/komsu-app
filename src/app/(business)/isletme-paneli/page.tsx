'use client';

// NOT (2026-06-07 / pazara-hazırlık denetimi): Bu panel kısmen gerçekti (işletme,
// abonelik durumu ve yorumlar canlı DB'den geliyordu) ama bir kısmı UYDURMA veriydi:
//  - "Abone Ol" butonu ölü (onClick yok) → gerçek üyelik sayfasına bağlandı,
//  - sahte istatistik deltaları (+12.5%, ₺12,450 gelir vb.) → gerçek değerler bırakıldı, uydurma trendler kaldırıldı,
//  - sahte haftalık aktivite grafiği + sahte "Yaklaşan Etkinlikler" + sahte performans yüzdeleri → dürüst "yakında" durumuyla değiştirildi,
//  - kullanılmayan ölü mock sabitleri (STATS, RECENT_REVIEWS, UPCOMING_EVENTS) → silindi.
// Artık panel yalnızca gerçek veriyi gerçek, henüz toplanmayan veriyi "yakında" gösteriyor.

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useCurrentUser } from '@/lib/hooks/use-auth';
import { checkSubscriptionStatus, SubscriptionCheckResult } from '@/lib/services/business-subscription';
import SubscriptionExpiredOverlay from '@/components/business/subscription-expired-overlay';
import {
  Eye,
  Star,
  Heart,
  MessageCircle,
  ChevronRight,
  BarChart3,
  Plus,
} from 'lucide-react';

export default function IsletmePaneliPage() {
  const { user } = useCurrentUser();
  const [business, setBusiness] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasNoBusiness, setHasNoBusiness] = useState(false);
  const [subStatus, setSubStatus] = useState<SubscriptionCheckResult | null>(null);

  // Fetch business data for current user
  useEffect(() => {
    async function fetchBusiness() {
      if (!user?.id) return;
      setLoading(true);
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('owner_id', user.id)
          .single();

        if (error && error.code === 'PGRST116') {
          // No business found
          setHasNoBusiness(true);
          setLoading(false);
          return;
        }

        if (!error && data) {
          setBusiness(data);

          // Abonelik durumu kontrolü
          try {
            const subResult = await checkSubscriptionStatus((data as any).id);
            setSubStatus(subResult);
          } catch (subErr) {
            console.log('Subscription check skipped:', subErr);
          }

          // Fetch reviews for this business
          const { data: reviewData } = await (supabase as any)
            .from('business_reviews')
            .select('*')
            .eq('business_id', (data as any).id)
            .order('created_at', { ascending: false })
            .limit(3);

          if (reviewData && reviewData.length > 0) {
            const mappedReviews = reviewData.map((r: any) => ({
              id: r.id,
              author: r.author_name || 'Anonim',
              rating: r.rating || 5,
              date: r.created_at,
              text: r.content || r.text || '',
            }));
            setReviews(mappedReviews);
          } else {
            setReviews([]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch business:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBusiness();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-text-muted">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (hasNoBusiness) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Henüz bir işletmeniz yok</h1>
            <p className="text-text-muted mb-6">İşletme panelini kullanmaya başlamak için bir işletme oluşturun.</p>
            <Link
              href="/isletme-ekle"
              className="inline-block px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors"
            >
              İşletme Oluştur
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const businessName = business?.name || 'İşletmeniz';

  return (
    <div className="min-h-screen bg-background">
      {/* Subscription Expired Overlay */}
      {subStatus?.shouldBlur && (
        <SubscriptionExpiredOverlay
          businessName={businessName}
          isOwner={true}
        />
      )}

      {/* Trial Banner */}
      {subStatus?.isTrialPeriod && (
        <div className="mb-6 bg-gradient-to-r from-[#fef3c7] to-[#fde68a] rounded-xl p-4 flex items-center gap-4 border border-[#f59e0b]/20">
          <div className="w-10 h-10 bg-[#f59e0b] rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg">🎁</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-[#92400e] text-sm">
              Ücretsiz Deneme: {subStatus.trialDaysRemaining} gün kaldı
            </p>
            <p className="text-xs text-[#92400e]/70 mt-0.5">
              Deneme süreniz dolmadan abonelik başlatarak kesintisiz kullanmaya devam edin.
            </p>
          </div>
          <Link
            href="/isletme-paneli/uyelik"
            className="px-4 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            Abone Ol
          </Link>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text-primary mb-2">Hoşgeldiniz, {businessName}</h1>
        <p className="text-text-muted text-lg">
          İşletmenizin günlük performansını ve müşteri etkileşimini takip edin
        </p>
      </div>

      {/* Stats Grid — gerçek işletme verisinden (uydurma trend deltaları kaldırıldı) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            id: 1,
            label: 'Ortalama Değerlendirme',
            value: business?.rating_avg ? `${business.rating_avg.toFixed(1)} ⭐` : 'N/A',
            icon: Star,
            bgColor: '#fef3c7',
            iconColor: '#f59e0b',
          },
          {
            id: 2,
            label: 'Toplam Yorum',
            value: business?.review_count || '0',
            icon: MessageCircle,
            bgColor: '#dbeafe',
            iconColor: '#3b82f6',
          },
          {
            id: 3,
            label: 'Öneriler',
            value: business?.recommendation_count || '0',
            icon: Heart,
            bgColor: '#fce7f3',
            iconColor: '#ec4899',
          },
          {
            id: 4,
            label: 'Doğrulama Durumu',
            value: business?.is_verified ? 'Doğrulandı ✓' : 'Beklemede',
            icon: Eye,
            bgColor: business?.is_verified ? '#e6f4ec' : '#fef3c7',
            iconColor: business?.is_verified ? '#00833e' : '#f59e0b',
          },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.id}
              className="bg-surface rounded-lg border border-border p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <Icon size={24} color={stat.iconColor} />
                </div>
              </div>
              <p className="text-text-muted text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Business Info Card */}
      <div className="bg-gradient-to-br from-primary to-primary-hover rounded-lg text-white p-8 mb-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#d1fae5] text-sm font-medium mb-2">İşletmeniz</p>
            <h2 className="text-4xl font-bold mb-4">{business?.name || 'İşletme'}</h2>
            <p className="text-[#d1fae5] text-sm flex items-center gap-1">
              {business?.category_id && '📍'}
              {business?.address || 'Konum belirtilmemiş'}
            </p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[#d1fae5] text-sm mb-2">İletişim</p>
            <p className="text-lg font-bold">{business?.phone || 'Telefon belirtilmemiş'}</p>
            <p className="text-xs text-[#d1fae5] mt-2 truncate">{business?.website || 'Website belirtilmemiş'}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Reviews Section - 2 cols */}
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-text-primary">Son Müşteri Yorumları</h2>
                <p className="text-sm text-text-muted mt-1">En yakın 3 yorum</p>
              </div>
              <Link
                href="/isletme-paneli/yorumlar"
                className="text-primary hover:text-primary-hover font-medium text-sm flex items-center gap-1"
              >
                Tümünü Gör
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-border pb-4 last:border-b-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-text-primary">{review.author}</p>
                        <p className="text-xs text-text-muted">
                          {new Date(review.date).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < review.rating
                                ? 'fill-[#f59e0b] text-[#f59e0b]'
                                : 'text-[#e0e0e0]'
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-text-primary text-sm">{review.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-text-muted">Henüz yorum yok</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-surface rounded-lg border border-border p-6 h-full">
            <h3 className="text-lg font-bold text-text-primary mb-4">Hızlı İşlemler</h3>
            <div className="space-y-2">
              <Link
                href="/isletme-paneli/reklamlar"
                className="flex items-center gap-2 w-full bg-primary-light hover:bg-primary-light text-primary font-medium py-3 px-4 rounded-lg transition-colors text-center text-sm justify-center"
              >
                <Plus size={16} />
                Reklam Oluştur
              </Link>
              <Link
                href="/isletme-paneli/yorumlar"
                className="flex items-center gap-2 w-full bg-[#fef3c7] hover:bg-[#fde68a] text-[#92400e] font-medium py-3 px-4 rounded-lg transition-colors text-center text-sm justify-center"
              >
                <MessageCircle size={16} />
                Yorum Yanıtla
              </Link>
              <Link
                href="/isletme-paneli/istatistikler"
                className="flex items-center gap-2 w-full bg-background hover:bg-[#e0e0e0] text-text-primary font-medium py-3 px-4 rounded-lg transition-colors text-sm justify-center"
              >
                <BarChart3 size={16} />
                İstatistikler
              </Link>
              <Link
                href="/isletme-paneli/uyelik"
                className="flex items-center gap-2 w-full bg-background hover:bg-[#e0e0e0] text-text-primary font-medium py-3 px-4 rounded-lg transition-colors text-sm justify-center"
              >
                <Star size={16} />
                Üyelik
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Detaylı istatistikler (yakında) + Tavsiyeler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Detailed Stats — dürüst boş durum (uydurma grafik/etkinlik/performans kaldırıldı) */}
        <div className="bg-surface rounded-lg border border-border p-6 flex flex-col items-center justify-center text-center min-h-[220px]">
          <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mb-3">
            <BarChart3 size={24} color="#00833e" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">Detaylı İstatistikler</h3>
          <p className="text-sm text-text-muted max-w-xs">
            Görüntülenme, haftalık aktivite ve etkinlik istatistikleriniz veriler biriktikçe burada görünecek. Çok yakında.
          </p>
        </div>

        {/* Tips & Recommendations — genel statik tavsiye (uydurma veri değil) */}
        <div className="bg-gradient-to-br from-[#e6f4ec] to-[#d1fae5] rounded-lg border border-[#a7dbb8] p-6">
          <h3 className="text-lg font-bold text-primary mb-4">Tavsiyeler</h3>
          <ul className="space-y-3 text-sm text-primary">
            <li className="flex gap-3">
              <span className="flex-shrink-0">✓</span>
              <span>Profil fotoğrafınızı yüksek kaliteli bir görselle güncelleyin</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0">✓</span>
              <span>Bu ay en az 2 yeni ürün/hizmet ekleyin</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0">✓</span>
              <span>Reklam kampanyası başlatarak görünürlüğü artırın</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0">✓</span>
              <span>Müşteri yorumlarına düzenli olarak cevap verin</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
