'use client';

import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';

interface ReviewFormProps {
  businessName: string;
  onSubmit?: (review: { rating: number; text: string }) => void;
}

export function ReviewForm({ businessName, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit?.({ rating, text });
      setText('');
      setRating(5);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-[#d1fae5] p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{businessName} için Yorum Yaz</h3>

      {/* Star Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Puanı Seç</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={32}
                className={
                  star <= rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 hover:text-yellow-300'
                }
              />
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {rating === 5 && 'Mükemmel!'}
          {rating === 4 && 'Çok iyi'}
          {rating === 3 && 'İyi'}
          {rating === 2 && 'Kötü'}
          {rating === 1 && 'Çok kötü'}
        </p>
      </div>

      {/* Review Text */}
      <div className="mb-4">
        <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
          Yorum (isteğe bağlı)
        </label>
        <textarea
          id="review"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Bu işletmeniz hakkında ne düşünüyorsunuz?"
          maxLength={500}
          rows={4}
          className="w-full rounded-lg border border-[#a7dbb8] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00833e] focus:border-transparent resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">{text.length}/500</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!text.trim()}
        className="w-full bg-[#00833e] hover:bg-[#006b32] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Send size={16} />
        Yorumu Gönder
      </button>

      {/* Success Message */}
      {submitted && (
        <div className="mt-3 p-3 bg-[#e6f4ec] border border-[#a7dbb8] rounded-lg text-sm text-[#006b32] font-medium">
          ✓ Yorum başarıyla gönderildi!
        </div>
      )}
    </form>
  );
}
