'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronDown, Filter, ArrowUpDown, Loader2, Store } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useCurrentUser } from '@/lib/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';

// NOT (2026-06-07): Bu sayfa eskiden 8 sahte yorumla (mockReviews + demo-images
// avatarları) çalışıyordu ve "Cevap Ver" düğmesi yalnızca yerel state değiştiriyor,
// hiçbir yere kaydetmiyordu. Gerçekte `business_reviews` tablosunda CEVAP (reply)
// kolonu YOK; sahibe reviews üzerinde UPDATE vermek müşteri puanını değiştirmesine
// yol açar (güven riski). Bu yüzden sayfa artık giriş yapan kullanıcının işletmesine
// ait GERÇEK yorumları gösteren dürüst, salt-okunur bir panel. Sahip-cevabı özelliği
// ayrı (kurcalamaya kapalı) bir tabloyla ileride eklenecek. Bkz. TECH_DEBT #12.

const ratingFilters = [
  { id: 'all', label: 'Tümü', stars: null },
  { id: '5', label: '5 Yıldız', stars: 5 },
  { id: '4', label: '4 Yıldız', stars: 4 },
  { id: '3', label: '3 Yıldız', stars: 3 },
  { id: '2', label: '2 Yıldız', stars: 2 },
  { id: '1', label: '1 Yıldız', stars: 1 },
];

interface Review {
  id: string;
  authorName: string;
  avatar: string | null;
  rating: number;
  date: string;
  text: string;
}

const getAverageRating = (reviews: Review[]): string => {
  if (reviews.length === 0) return '0.0';
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};

const getMonthlyCount = (reviews: Review[]) => {
  const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return reviews.filter((r) => r.date && new Date(r.date).getTime() > oneMonthAgo).length;
};

export default function BusinessPanelReviewsPage() {
  const { user } = useCurrentUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasNoBusiness, setHasNoBusiness] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const supabase = createClient() as any;

      // Giriş yapan kullanıcının işletmesini bul
      const { data: business, error: bizError } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (cancelled) return;

      if (bizError || !business) {
        setHasNoBusiness(true);
        setLoading(false);
        return;
      }

      // O işletmeye ait gerçek yorumları çek (yorum sahibinin adı/avatarı join ile)
      const { data: reviewData } = await supabase
        .from('business_reviews')
        .select('*, profiles!business_reviews_user_id_fkey(full_name, avatar_url)')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      if (cancelled) return;

      const mapped: Review[] = ((reviewData as any[]) || []).map((r) => ({
        id: r.id,
        authorName: r.profiles?.full_name || 'Anonim',
        avatar: r.profiles?.avatar_url || null,
        rating: r.rating || 0,
        date: r.created_at,
        text: r.body || '',
      }));

      setReviews(mapped);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const filtered = reviews.filter((review) => {
    if (selectedRating === null) return true;
    return review.rating === selectedRating;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return b.rating - a.rating;
  });

  const selectedLabel = ratingFilters.find((f) => f.stars === selectedRating)?.label || 'Tümü';
  const averageRating = getAverageRating(reviews);
  const totalCount = reviews.length;
  const monthlyCount = getMonthlyCount(reviews);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (hasNoBusiness) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Henüz bir işletmeniz yok</h1>
          <p className="text-text-muted mb-6">
            Yorumları görüntülemek için önce bir işletme eklemeniz gerekir.
          </p>
          <Link
            href="/isletme-ekle"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors"
          >
            İşletme Ekle
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto py-6 px-4">
        {/* Header Section */}
        <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden mb-6 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Müşteri Yorumları</h1>
              <p className="text-text-muted text-sm mt-1">
                İşletmenize gelen değerlendirmeleri filtreleyin ve performansınızı takip edin
              </p>
            </div>
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Rating Filter Dropdown */}
            <div className="relative flex-1">
              <button
                onClick={() => setOpenDropdown(!openDropdown)}
                className="w-full flex items-center gap-2 px-4 py-2.5 bg-background border border-border rounded-lg text-text-primary font-medium text-sm hover:bg-[#e0e0e0] transition-colors"
              >
                <Filter size={16} />
                {selectedLabel}
                <ChevronDown className={cn('w-4 h-4 transition-transform ml-auto', openDropdown && 'rotate-180')} />
              </button>

              {openDropdown && (
                <div className="absolute left-0 top-full mt-2 bg-surface border border-border rounded-lg shadow-lg z-50 min-w-48">
                  {ratingFilters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => {
                        setSelectedRating(filter.stars);
                        setOpenDropdown(false);
                      }}
                      className={cn(
                        'w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-2',
                        selectedRating === filter.stars
                          ? 'bg-primary text-white font-medium'
                          : 'text-text-secondary hover:bg-background'
                      )}
                    >
                      {filter.label}
                      {filter.stars && (
                        <div className="flex gap-0.5 ml-auto">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={i < filter.stars! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-background border border-border rounded-lg text-text-primary font-medium text-sm hover:bg-[#e0e0e0] transition-colors whitespace-nowrap"
              >
                <ArrowUpDown size={16} />
                {sortBy === 'date' ? 'Tarih' : 'Puan'}
                <ChevronDown className={cn('w-4 h-4 transition-transform', sortOpen && 'rotate-180')} />
              </button>

              {sortOpen && (
                <div className="absolute right-0 top-full mt-2 bg-surface border border-border rounded-lg shadow-lg z-50 min-w-40">
                  <button
                    onClick={() => {
                      setSortBy('date');
                      setSortOpen(false);
                    }}
                    className={cn(
                      'w-full text-left px-4 py-3 text-sm transition-colors',
                      sortBy === 'date' ? 'bg-primary text-white font-medium' : 'text-text-secondary hover:bg-background'
                    )}
                  >
                    En Yeni
                  </button>
                  <button
                    onClick={() => {
                      setSortBy('rating');
                      setSortOpen(false);
                    }}
                    className={cn(
                      'w-full text-left px-4 py-3 text-sm transition-colors',
                      sortBy === 'rating' ? 'bg-primary text-white font-medium' : 'text-text-secondary hover:bg-background'
                    )}
                  >
                    En Yüksek Puan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Average Rating */}
          <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-text-muted text-sm mb-2">Ortalama Puan</p>
                <p className="text-3xl font-bold text-text-primary mb-1">{averageRating}</p>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.floor(parseFloat(averageRating))
                          ? 'fill-[#f59e0b] text-[#f59e0b]'
                          : 'text-[#e0e0e0]'
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Total Reviews */}
          <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
            <p className="text-text-muted text-sm mb-2">Toplam Yorum</p>
            <p className="text-3xl font-bold text-text-primary">{totalCount}</p>
            <p className="text-xs text-text-muted mt-2">Tüm zamanlar</p>
          </div>

          {/* New This Month */}
          <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
            <p className="text-text-muted text-sm mb-2">Bu Ay Yeni</p>
            <p className="text-3xl font-bold text-text-primary">{monthlyCount}</p>
            <p className="text-xs text-text-muted mt-2">Son 30 gün</p>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {sorted.map((review) => (
            <div
              key={review.id}
              className="bg-surface rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
            >
              {/* Review Header */}
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {review.avatar ? (
                    <Image
                      src={review.avatar}
                      alt={review.authorName}
                      width={48}
                      height={48}
                      unoptimized
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                      {review.authorName[0]?.toUpperCase() || 'A'}
                    </div>
                  )}
                </div>

                {/* Author Info and Stars */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="font-semibold text-text-primary">{review.authorName}</p>
                      {review.date && (
                        <p className="text-xs text-text-muted">
                          {new Date(review.date).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-[#e0e0e0]'}
                        />
                      ))}
                    </div>
                  </div>
                  {review.text && (
                    <p className="text-text-primary text-sm mt-3 leading-relaxed">{review.text}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sorted.length === 0 && (
          <div className="bg-surface rounded-lg shadow-sm border border-border p-12 text-center">
            <Star className="w-12 h-12 text-[#e0e0e0] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">Yorum bulunamadı</h3>
            <p className="text-text-muted">
              {selectedRating !== null
                ? 'Seçilen derecelendirme için yorum bulunmuyor.'
                : 'Henüz yorum alınmamış.'}
            </p>
          </div>
        )}

        {/* Star Rating Distribution */}
        {reviews.length > 0 && (
          <div className="bg-surface rounded-lg shadow-sm border border-border p-6 mt-8">
            <h3 className="text-lg font-bold text-text-primary mb-4">Yıldız Dağılımı</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.filter((r) => r.rating === rating).length;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < rating ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-[#e0e0e0]'}
                        />
                      ))}
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-[#e0e0e0] rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-text-primary w-12 text-right">
                      {count} ({Math.round(percentage)}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
