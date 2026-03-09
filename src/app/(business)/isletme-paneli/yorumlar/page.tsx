'use client';

import { useState } from 'react';
import { Star, Send, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const ratingFilters = [
  { id: 'all', label: 'Tümü', stars: null },
  { id: '5', label: '5 Yıldız', stars: 5 },
  { id: '4', label: '4 Yıldız', stars: 4 },
  { id: '3', label: '3 Yıldız', stars: 3 },
  { id: '2', label: '2 Yıldız', stars: 2 },
  { id: '1', label: '1 Yıldız', stars: 1 },
];

const mockReviews = [
  {
    id: '1',
    authorName: 'Ayşe Kaya',
    avatar: 'https://picsum.photos/48/48?random=101',
    rating: 5,
    date: '2026-03-09',
    text: 'Harika bir deneyim yaşadım! Personel çok ilgili ve nazik, yemekler lezzetli ve taze. Kesinlikle tekrar gelirim ve arkadaşlarıma tavsiye ederim.',
    replied: false,
  },
  {
    id: '2',
    authorName: 'Mert Demir',
    avatar: 'https://picsum.photos/48/48?random=102',
    rating: 4,
    date: '2026-03-07',
    text: 'Genel olarak güzel bir yer. Ortam ve ambiyans çok hoş. Tek sıkıntısı menü biraz daha çeşitli olabilir ama yemek kalitesi iyiydi.',
    replied: true,
  },
  {
    id: '3',
    authorName: 'Zeynep Şahin',
    avatar: 'https://picsum.photos/48/48?random=103',
    rating: 5,
    date: '2026-03-05',
    text: 'Muhteşem! Servis hızlı, yemekler damak tadına hitap ediyordu. Fiyatlar da oldukça uygun. Kesinlikle geleceğim.',
    replied: false,
  },
  {
    id: '4',
    authorName: 'Fatma Yılmaz',
    avatar: 'https://picsum.photos/48/48?random=104',
    rating: 3,
    date: '2026-03-03',
    text: 'Ortalama bir deneyim. Yemek iyiydi ama bekleme süresi biraz uzundu. Personel ise çok ilgiliydi.',
    replied: false,
  },
  {
    id: '5',
    authorName: 'Ahmet Çetin',
    avatar: 'https://picsum.photos/48/48?random=105',
    rating: 5,
    date: '2026-03-01',
    text: 'Birinci sınıf hizmet! Mekan çok güzel tasarlanmış, müzik seviyesi mükemmel, yemekler süper lezzetli. Sahibine teşekkürler!',
    replied: true,
  },
  {
    id: '6',
    authorName: 'Seda Eren',
    avatar: 'https://picsum.photos/48/48?random=106',
    rating: 4,
    date: '2026-02-27',
    text: 'Güzel bir mekan, temizlik standartları yüksek. Biraz kalabalık olsa da keyifli bir zaman geçirdim.',
    replied: false,
  },
  {
    id: '7',
    authorName: 'Emre Koç',
    avatar: 'https://picsum.photos/48/48?random=107',
    rating: 5,
    date: '2026-02-25',
    text: 'En son ziyaretimiz harika geçti. Yeni menüdeki tatlılar resmen mübarek! Özellikle baklava enfes.',
    replied: false,
  },
  {
    id: '8',
    authorName: 'Nuri Polat',
    avatar: 'https://picsum.photos/48/48?random=108',
    rating: 2,
    date: '2026-02-23',
    text: 'Kahveler biraz nötr geldi bana. Ortam güzel ama yemek kalitesi beklenenden düşüktü. Fiyata göre biraz pahalı.',
    replied: false,
  },
];

const getAverageRating = (reviews: typeof mockReviews): string => {
  if (reviews.length === 0) return '0.0';
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};

const getTotalCount = (reviews: typeof mockReviews) => reviews.length;

const getMonthlyCount = (reviews: typeof mockReviews) => {
  const now = new Date();
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  return reviews.filter((r) => new Date(r.date) > oneMonthAgo).length;
};

export default function BusinessPanelReviewsPage() {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState<Record<string, boolean>>({});

  const filtered = mockReviews.filter((review) => {
    if (selectedRating === null) return true;
    return review.rating === selectedRating;
  });

  const handleReplySubmit = (reviewId: string) => {
    if (replyText.trim()) {
      setReplies({ ...replies, [reviewId]: true });
      setReplyText('');
      setReplyingId(null);
    }
  };

  const selectedLabel = ratingFilters.find((f) => f.stars === selectedRating)?.label || 'Tümü';
  const averageRating = getAverageRating(mockReviews);
  const totalCount = getTotalCount(mockReviews);
  const monthlyCount = getMonthlyCount(mockReviews);

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-5xl mx-auto py-6 px-4">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden mb-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#333]">Müşteri Yorumları</h1>
              <p className="text-[#8f8f8f] text-sm mt-1">Müşterilerinizin değerlendirmelerini yönetin ve yanıtlayın</p>
            </div>

            {/* Rating Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(!openDropdown)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#f0f2f5] border border-[#e0e0e0] rounded-lg text-[#333] font-medium text-sm hover:bg-[#e0e0e0] transition-colors"
              >
                {selectedLabel}
                <ChevronDown className={cn('w-4 h-4 transition-transform', openDropdown && 'rotate-180')} />
              </button>

              {openDropdown && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-[#e0e0e0] rounded-lg shadow-lg z-50 min-w-40">
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
                          ? 'bg-[#00833e] text-white font-medium'
                          : 'text-[#404040] hover:bg-[#f0f2f5]'
                      )}
                    >
                      {filter.label}
                      {filter.stars && (
                        <div className="flex gap-0.5 ml-auto">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={
                                i < filter.stars!
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Average Rating */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#8f8f8f] text-sm mb-2">Ortalama Puan</p>
                <p className="text-3xl font-bold text-[#333] mb-1">{averageRating}</p>
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
              <div className="text-right">
                <p className="text-xs text-[#8f8f8f]">Mükemmel</p>
              </div>
            </div>
          </div>

          {/* Total Reviews */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
            <p className="text-[#8f8f8f] text-sm mb-2">Toplam Yorum</p>
            <p className="text-3xl font-bold text-[#333]">{totalCount}</p>
            <p className="text-xs text-[#8f8f8f] mt-2">Tüm zamanlar</p>
          </div>

          {/* New This Month */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
            <p className="text-[#8f8f8f] text-sm mb-2">Bu Ay Yeni</p>
            <p className="text-3xl font-bold text-[#333]">{monthlyCount}</p>
            <p className="text-xs text-[#8f8f8f] mt-2">Son 30 gün</p>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filtered.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6 hover:shadow-md transition-shadow"
            >
              {/* Review Header */}
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <Image
                    src={review.avatar}
                    alt={review.authorName}
                    width={48}
                    height={48}
                    unoptimized
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>

                {/* Author Info and Stars */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="font-semibold text-[#333]">{review.authorName}</p>
                      <p className="text-xs text-[#8f8f8f]">
                        {new Date(review.date).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
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
                </div>
              </div>

              {/* Review Text */}
              <p className="text-[#333] text-sm mb-4 leading-relaxed">{review.text}</p>

              {/* Reply Section */}
              {replies[review.id] || review.replied ? (
                <div className="mb-4 p-4 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0]">
                  <p className="text-xs font-semibold text-[#8f8f8f] mb-2">İŞLETME CEVABI</p>
                  <p className="text-sm text-[#333]">
                    {replies[review.id]
                      ? replyText
                      : 'Teşekkür ederiz! Yorumunuz için minnettarız. Daha iyi hizmet sunmak için çalışmaya devam edeceğiz.'}
                  </p>
                </div>
              ) : replyingId === review.id ? (
                <div className="mb-4 p-4 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0]">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Müşteriye yanıt yazın..."
                    className="w-full bg-white border border-[#e0e0e0] rounded-lg p-3 text-sm text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e] focus:ring-opacity-30 resize-none mb-3"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReplySubmit(review.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#00833e] text-white rounded-lg hover:bg-[#006b32] transition-colors font-medium text-sm"
                    >
                      <Send className="w-4 h-4" />
                      Gönder
                    </button>
                    <button
                      onClick={() => {
                        setReplyingId(null);
                        setReplyText('');
                      }}
                      className="px-4 py-2 border border-[#e0e0e0] text-[#333] rounded-lg hover:bg-[#f0f2f5] transition-colors font-medium text-sm"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Action Buttons */}
              {!replies[review.id] && !review.replied && replyingId !== review.id && (
                <div className="flex gap-3 pt-4 border-t border-[#e0e0e0]">
                  <button
                    onClick={() => setReplyingId(review.id)}
                    className="text-sm font-medium text-[#00833e] hover:text-[#006b32] transition-colors"
                  >
                    Cevap Ver
                  </button>
                  <button className="text-sm font-medium text-[#8f8f8f] hover:text-[#333] transition-colors">
                    Raporla
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-12 text-center">
            <Star className="w-12 h-12 text-[#e0e0e0] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#333] mb-2">Yorum bulunamadı</h3>
            <p className="text-[#8f8f8f]">
              {selectedRating !== null
                ? 'Seçilen derecelendirme için yorum bulunmuyor.'
                : 'Henüz yorum alınmamış.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
