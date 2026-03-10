'use client';

import React, { useState } from 'react';
import { Star, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { submitReview } from '@/lib/services/review-system';

interface EnhancedReviewFormProps {
  businessId: string;
  userId: string;
  isVerifiedUser: boolean;
  onReviewSubmitted?: (reviewId: string) => void;
  onError?: (error: string) => void;
}

const MIN_REVIEW_LENGTH = 50;
const MAX_IMAGES = 3;

export default function EnhancedReviewForm({
  businessId,
  userId,
  isVerifiedUser,
  onReviewSubmitted,
  onError,
}: EnhancedReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const contentLength = content.length;
  const remainingChars = Math.max(0, MIN_REVIEW_LENGTH - contentLength);
  const isContentValid = contentLength >= MIN_REVIEW_LENGTH;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).slice(0, MAX_IMAGES - images.length);

    newImages.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (rating === 0) {
      setSubmitError('Lütfen bir puan seçin');
      return;
    }

    if (!title.trim()) {
      setSubmitError('Lütfen bir başlık yazın');
      return;
    }

    if (!isContentValid) {
      setSubmitError(`Yorum en az ${MIN_REVIEW_LENGTH} karakter olmalıdır`);
      return;
    }

    if (!isVerifiedUser) {
      setSubmitError('Sadece onaylanmış komşular yorum yapabilirler');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitReview(
        userId,
        businessId,
        rating,
        title.trim(),
        content.trim(),
        images.length > 0 ? images : undefined
      );

      if (result.success && result.review) {
        setSubmitSuccess(true);
        setRating(0);
        setTitle('');
        setContent('');
        setImages([]);

        // Reset success message after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);

        if (onReviewSubmitted) {
          onReviewSubmitted(result.review.id);
        }
      } else {
        setSubmitError(result.error || 'Yorum gönderilirken bir hata oluştu');
        if (onError) {
          onError(result.error || 'Hata');
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Bir hata oluştu';
      setSubmitError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-[#e0e0e0] p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Yorum Yapın</h3>

      {/* Verified Badge Requirement */}
      {!isVerifiedUser && (
        <div className="mb-6 p-4 bg-[#fff3cd] border border-[#ffc107] rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-[#ff9800] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[#856404]">
              Onaylanmış Komşu Kimliği Gerekli
            </p>
            <p className="text-xs text-[#8f8f8f] mt-1">
              Yorum yapabilmek için adres doğrulamasını tamamlamanız gerekir.
            </p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {submitSuccess && (
        <div className="mb-6 p-4 bg-[#d1fae5] border border-[#00833e] rounded-lg flex gap-3">
          <CheckCircle className="w-5 h-5 text-[#00833e] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[#006b32]">
              Yorum başarıyla gönderildi
            </p>
            <p className="text-xs text-[#8f8f8f] mt-1">
              Yorum moderasyon kontrolünden geçiyor.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="mb-6 p-4 bg-[#fee] border border-[#ff6b6b] rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-[#ff6b6b] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#c3180a]">{submitError}</p>
        </div>
      )}

      {/* Rating Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Puanınız <span className="text-[#ff6b6b]">*</span>
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoverRating || rating)
                    ? 'fill-[#ffc107] text-[#ffc107]'
                    : 'text-[#e0e0e0]'
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-xs text-[#8f8f8f] mt-2">
            {rating === 1 && 'Çok kötü'}
            {rating === 2 && 'Kötü'}
            {rating === 3 && 'Orta'}
            {rating === 4 && 'İyi'}
            {rating === 5 && 'Çok iyi'}
          </p>
        )}
      </div>

      {/* Title Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Yorum Başlığı <span className="text-[#ff6b6b]">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ör: Harika hizmet ve kaliteli ürünler"
          maxLength={100}
          disabled={!isVerifiedUser || isSubmitting}
          className="w-full px-4 py-2 rounded border border-[#e0e0e0] text-sm focus:border-[#00833e] focus:outline-none disabled:bg-[#f0f2f5] disabled:cursor-not-allowed"
        />
        <p className="text-xs text-[#8f8f8f] mt-1">{title.length}/100 karakter</p>
      </div>

      {/* Content Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Yorum Metni <span className="text-[#ff6b6b]">*</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`En az ${MIN_REVIEW_LENGTH} karakter yazın. Deneyiminizi ayrıntılı olarak anlatın...`}
          maxLength={2000}
          rows={5}
          disabled={!isVerifiedUser || isSubmitting}
          className="w-full px-4 py-2 rounded border border-[#e0e0e0] text-sm focus:border-[#00833e] focus:outline-none disabled:bg-[#f0f2f5] disabled:cursor-not-allowed resize-none"
        />
        <div className="flex justify-between items-center mt-2">
          <p
            className={`text-xs ${
              isContentValid ? 'text-[#00833e]' : 'text-[#ff6b6b]'
            }`}
          >
            {isContentValid ? (
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                {contentLength}/{2000} karakter
              </span>
            ) : (
              <span>
                {remainingChars} karakter daha yazmalısınız ({contentLength}/{MIN_REVIEW_LENGTH})
              </span>
            )}
          </p>
          <p className="text-xs text-[#8f8f8f]">{contentLength}/2000</p>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Fotoğraf Ekle (İsteğe bağlı)
        </label>
        <p className="text-xs text-[#8f8f8f] mb-3">
          En fazla {MAX_IMAGES} fotoğraf yükleyebilirsiniz
        </p>

        {/* Image Preview */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded border border-[#e0e0e0]"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  disabled={isSubmitting}
                  className="absolute top-1 right-1 bg-[#ff6b6b] hover:bg-[#ff5252] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold disabled:opacity-50"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        {images.length < MAX_IMAGES && (
          <label
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded border-2 border-dashed border-[#e0e0e0] cursor-pointer transition-colors ${
              !isVerifiedUser || isSubmitting
                ? 'bg-[#f0f2f5] cursor-not-allowed opacity-50'
                : 'hover:border-[#00833e] hover:bg-[#f9f9f9]'
            }`}
          >
            <Upload className="w-4 h-4 text-[#8f8f8f]" />
            <span className="text-sm text-[#8f8f8f]">
              Fotoğraf seçin ({images.length}/{MAX_IMAGES})
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={!isVerifiedUser || isSubmitting || images.length >= MAX_IMAGES}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isVerifiedUser || !isContentValid || rating === 0 || isSubmitting}
        className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors ${
          !isVerifiedUser || !isContentValid || rating === 0 || isSubmitting
            ? 'bg-[#e0e0e0] text-[#8f8f8f] cursor-not-allowed'
            : 'bg-[#00833e] hover:bg-[#006b32] text-white'
        }`}
      >
        {isSubmitting ? 'Gönderiliyor...' : 'Yorumu Gönder'}
      </button>

      {!isVerifiedUser && (
        <p className="text-xs text-[#8f8f8f] text-center mt-3">
          Yorum göndermek için onaylanmış komşu olmak gerekir
        </p>
      )}
    </form>
  );
}
