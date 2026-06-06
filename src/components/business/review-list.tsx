'use client';

import { toast } from '@/lib/utils/show-toast'

import React, { useState } from 'react';
import {
  Star,
  ThumbsUp,
  Flag,
  ShieldAlert,
  Calendar,
  Image as ImageIcon,
  X,
  ChevronDown,
} from 'lucide-react';
import { ReviewData, FlagReason, flagReview } from '@/lib/services/review-system';

interface ReviewListProps {
  businessId: string;
  userId: string;
  reviews: ReviewData[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };
}

type SortOption = 'newest' | 'highest' | 'lowest' | 'helpful';
type FilterOption = 'all' | 'verified' | 'photos';

const FLAG_REASONS: { value: FlagReason; label: string }[] = [
  { value: 'sahte', label: 'Sahte yorum' },
  { value: 'uygunsuz', label: 'Uygunsuz içerik' },
  { value: 'spam', label: 'Spam' },
  { value: 'cikarcatismasi', label: 'Çıkar çatışması' },
  { value: 'diger', label: 'Diğer' },
];

export default function ReviewList({
  businessId,
  userId,
  reviews,
  averageRating,
  totalReviews,
  ratingDistribution,
}: ReviewListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showFlagModal, setShowFlagModal] = useState<string | null>(null);
  const [flagReason, setFlagReason] = useState<FlagReason | ''>('');
  const [flagDescription, setFlagDescription] = useState('');
  const [flaggingReviewId, setFlaggingReviewId] = useState<string | null>(null);
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  // Filter reviews
  const filteredReviews = reviews.filter((review) => {
    if (filterBy === 'verified' && !review.isVerifiedUser) return false;
    if (filterBy === 'photos' && (!review.imageUrls || review.imageUrls.length === 0))
      return false;
    return true;
  });

  // Sort reviews
  filteredReviews.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpfulCount - a.helpfulCount;
      default:
        return 0;
    }
  });

  const handleToggleHelpful = (reviewId: string) => {
    setHelpfulReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const handleFlagReview = async (reviewId: string) => {
    if (!flagReason || flaggingReviewId) return;

    setFlaggingReviewId(reviewId);

    try {
      const result = await flagReview(
        reviewId,
        userId,
        flagReason as FlagReason,
        flagDescription || undefined
      );

      if (result.success) {
        setShowFlagModal(null);
        setFlagReason('');
        setFlagDescription('');
        // Show success message
        toast.success('Yorum raporlanmıştır. Teşekkür ederiz!');
      }
    } catch (error) {
      toast.error('Rapor gönderilirken bir hata oluştu');
    } finally {
      setFlaggingReviewId(null);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-primary';
    if (rating === 3) return 'text-[#ffc107]';
    return 'text-[#ff6b6b]';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Bugün';
    if (diffDays === 1) return 'Dün';
    if (diffDays < 7) return `${diffDays} gün önce`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} ay önce`;
    return `${Math.floor(diffDays / 365)} yıl önce`;
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Müşteri Yorumları
            </h3>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(averageRating)
                        ? 'fill-[#ffc107] text-[#ffc107]'
                        : 'text-[#e0e0e0]'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-lg text-gray-900">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-text-muted">({totalReviews} yorum)</span>
            </div>
          </div>
        </div>

        {/* Rating Distribution Bars */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-2">
              <span className="text-xs text-text-muted w-6">{rating}★</span>
              <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ffc107]"
                  style={{
                    width: `${
                      totalReviews > 0
                        ? ((ratingDistribution[String(rating) as keyof typeof ratingDistribution] || 0) /
                            totalReviews) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <span className="text-xs text-text-muted w-8 text-right">
                {ratingDistribution[String(rating) as keyof typeof ratingDistribution] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sort and Filter Controls */}
      <div className="flex flex-wrap gap-3">
        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded border border-border bg-surface hover:bg-background text-sm font-medium text-gray-900 transition-colors"
          >
            <span>
              {sortBy === 'newest' && 'En Yeni'}
              {sortBy === 'highest' && 'En Yüksek Puan'}
              {sortBy === 'lowest' && 'En Düşük Puan'}
              {sortBy === 'helpful' && 'En Faydalı'}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {sortDropdownOpen && (
            <div className="absolute top-full mt-1 left-0 bg-surface border border-border rounded shadow-lg z-10 w-48">
              {[
                { value: 'newest' as SortOption, label: 'En Yeni' },
                { value: 'highest' as SortOption, label: 'En Yüksek Puan' },
                { value: 'lowest' as SortOption, label: 'En Düşük Puan' },
                { value: 'helpful' as SortOption, label: 'En Faydalı' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setSortDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-background ${
                    sortBy === option.value
                      ? 'text-primary font-semibold'
                      : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded border border-border bg-surface hover:bg-background text-sm font-medium text-gray-900 transition-colors"
          >
            <span>
              {filterBy === 'all' && 'Tüm Yorumlar'}
              {filterBy === 'verified' && 'Sadece Onaylanmış'}
              {filterBy === 'photos' && 'Fotoğraflı'}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {filterDropdownOpen && (
            <div className="absolute top-full mt-1 left-0 bg-surface border border-border rounded shadow-lg z-10 w-48">
              {[
                { value: 'all' as FilterOption, label: 'Tüm Yorumlar' },
                { value: 'verified' as FilterOption, label: 'Sadece Onaylanmış Komşular' },
                { value: 'photos' as FilterOption, label: 'Fotoğraflı' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFilterBy(option.value);
                    setFilterDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-background ${
                    filterBy === option.value
                      ? 'text-primary font-semibold'
                      : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-surface rounded-lg border border-border p-8 text-center">
            <p className="text-text-muted">Bu filtrelere uygun yorum bulunmamaktadır.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-surface rounded-lg border border-border p-4"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  {/* Avatar placeholder */}
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-sm font-semibold text-text-muted flex-shrink-0">
                    {review.userId.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">
                        {review.userId}
                      </span>
                      {review.isVerifiedUser && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-light rounded-full text-xs font-medium text-primary-hover">
                          <ShieldAlert className="w-3 h-3" />
                          Onaylanmış Komşu
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= review.rating
                                ? 'fill-[#ffc107] text-[#ffc107]'
                                : 'text-[#e0e0e0]'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                {review.status === 'flagged' && (
                  <Flag className="w-5 h-5 text-[#ff6b6b]" />
                )}
              </div>

              {/* Review Title */}
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">{review.title}</h4>

              {/* Review Content */}
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                {review.content}
              </p>

              {/* Review Images */}
              {review.imageUrls && review.imageUrls.length > 0 && (
                <div className="flex gap-2 mb-3 overflow-x-auto">
                  {review.imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Review image ${index + 1}`}
                      className="h-20 w-20 rounded border border-border object-cover flex-shrink-0"
                    />
                  ))}
                </div>
              )}

              {/* Review Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#f0f2f5]">
                <button
                  onClick={() => handleToggleHelpful(review.id)}
                  className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
                    helpfulReviews.has(review.id)
                      ? 'bg-[#e8f5e9] text-primary'
                      : 'bg-background text-text-muted hover:bg-[#e0e0e0]'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  Faydalı ({review.helpfulCount + (helpfulReviews.has(review.id) ? 1 : 0)})
                </button>
                <button
                  onClick={() => setShowFlagModal(review.id)}
                  className="flex items-center gap-2 px-3 py-1 rounded text-sm font-medium bg-[#fee] text-[#c3180a] hover:bg-[#fed] transition-colors"
                >
                  <Flag className="w-4 h-4" />
                  Şikayet Et
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Flag Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Yorum Raporla</h4>
              <button
                onClick={() => {
                  setShowFlagModal(null);
                  setFlagReason('');
                  setFlagDescription('');
                }}
                className="text-text-muted hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Rapor Nedeni <span className="text-[#ff6b6b]">*</span>
                </label>
                <select
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value as FlagReason)}
                  className="w-full px-3 py-2 rounded border border-border text-sm focus:border-primary focus:outline-none"
                >
                  <option value="">Bir neden seçin</option>
                  {FLAG_REASONS.map((reason) => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Açıklama (İsteğe bağlı)
                </label>
                <textarea
                  value={flagDescription}
                  onChange={(e) => setFlagDescription(e.target.value)}
                  placeholder="Rapor hakkında detay bilgi yazın..."
                  maxLength={200}
                  rows={3}
                  className="w-full px-3 py-2 rounded border border-border text-sm focus:border-primary focus:outline-none resize-none"
                />
                <p className="text-xs text-text-muted mt-1">
                  {flagDescription.length}/200 karakter
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowFlagModal(null);
                    setFlagReason('');
                    setFlagDescription('');
                  }}
                  className="flex-1 px-4 py-2 rounded border border-border text-sm font-medium text-gray-900 hover:bg-background transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={() => handleFlagReview(showFlagModal)}
                  disabled={!flagReason || flaggingReviewId === showFlagModal}
                  className="flex-1 px-4 py-2 rounded bg-[#ff6b6b] hover:bg-[#ff5252] disabled:bg-[#e0e0e0] text-white text-sm font-medium transition-colors disabled:cursor-not-allowed"
                >
                  {flaggingReviewId === showFlagModal ? 'Gönderiliyor...' : 'Raporla'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
