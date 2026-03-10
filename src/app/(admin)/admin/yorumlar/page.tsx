'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Flag,
  Trash2,
  Star,
} from 'lucide-react';

interface Review {
  id: string;
  reviewer: string;
  business: string;
  rating: number;
  comment: string;
  date: string;
  flagged: boolean;
  verifiedPurchase: boolean;
  antiSpamScore: number;
  status: 'onaylanmış' | 'beklemede' | 'reddedildi';
  helpfulCount: number;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    reviewer: 'Ahmet K.',
    business: 'Özgür Elektrik',
    rating: 5,
    comment: 'Çok hızlı ve profesyonel hizmet. Kesinlikle tavsiye ediyorum!',
    date: '2024-03-09',
    flagged: false,
    verifiedPurchase: true,
    antiSpamScore: 0.98,
    status: 'onaylanmış',
    helpfulCount: 12,
  },
  {
    id: '2',
    reviewer: 'Fatma D.',
    business: 'Ayakkabı Tamircisi Ali',
    rating: 4,
    comment: 'İyi iş yapıyor ama biraz yavaş. Yine de tavsiye ediyorum.',
    date: '2024-03-08',
    flagged: false,
    verifiedPurchase: true,
    antiSpamScore: 0.95,
    status: 'onaylanmış',
    helpfulCount: 8,
  },
  {
    id: '3',
    reviewer: 'Mustafa T.',
    business: 'Bahçe Tasarımı Pro',
    rating: 3,
    comment: 'Orta düzey hizmet. Daha iyi olabilir ama kabul edilebilir.',
    date: '2024-03-07',
    flagged: false,
    verifiedPurchase: true,
    antiSpamScore: 0.89,
    status: 'onaylanmış',
    helpfulCount: 3,
  },
  {
    id: '4',
    reviewer: 'Elif Y.',
    business: 'Temizlik Şirketi Temizim',
    rating: 5,
    comment: 'Mükemmel! Ev temiz ve düzenli. Herkese tavsiye ediyorum!!!',
    date: '2024-03-06',
    flagged: true,
    verifiedPurchase: true,
    antiSpamScore: 0.72,
    status: 'beklemede',
    helpfulCount: 45,
  },
  {
    id: '5',
    reviewer: 'Hasan B.',
    business: 'Kuaför Şiddet',
    rating: 2,
    comment: 'Berbat hizmet, kesinlikle tavsiye etmiyorum.',
    date: '2024-03-05',
    flagged: false,
    verifiedPurchase: true,
    antiSpamScore: 0.91,
    status: 'onaylanmış',
    helpfulCount: 2,
  },
  {
    id: '6',
    reviewer: 'Ayşe S.',
    business: 'Çatı Onarımı Servis',
    rating: 5,
    comment: 'Harika iş! Zamanında ve profesyonel. En iyileri!',
    date: '2024-03-04',
    flagged: false,
    verifiedPurchase: true,
    antiSpamScore: 0.96,
    status: 'onaylanmış',
    helpfulCount: 18,
  },
  {
    id: '7',
    reviewer: 'İbrahim M.',
    business: 'Fotoğrafçı Düşle',
    rating: 5,
    comment: 'Fotoğraflarım çok güzel çıktı! Çok memnunum.',
    date: '2024-03-03',
    flagged: false,
    verifiedPurchase: true,
    antiSpamScore: 0.94,
    status: 'onaylanmış',
    helpfulCount: 25,
  },
  {
    id: '8',
    reviewer: 'Bot User 1',
    business: 'Oto Elektrikçi Hasan',
    rating: 5,
    comment: 'HARIKA HARIKA HARIKA!!! EN İYİSİ!!! HERKES GIT!!!',
    date: '2024-03-02',
    flagged: true,
    verifiedPurchase: false,
    antiSpamScore: 0.15,
    status: 'reddedildi',
    helpfulCount: 0,
  },
  {
    id: '9',
    reviewer: 'Zeynep A.',
    business: 'Pasta Şefi Aylin',
    rating: 5,
    comment: 'Pastaları lezzetli ve güzel. Özel günümüzde eğlenceli.',
    date: '2024-03-01',
    flagged: false,
    verifiedPurchase: true,
    antiSpamScore: 0.97,
    status: 'onaylanmış',
    helpfulCount: 31,
  },
  {
    id: '10',
    reviewer: 'Cengiz K.',
    business: 'Kuru Temizleme Yıldız',
    rating: 4,
    comment: 'İyi hizmet, ama fiyat biraz yüksek bence.',
    date: '2024-02-29',
    flagged: false,
    verifiedPurchase: true,
    antiSpamScore: 0.88,
    status: 'onaylanmış',
    helpfulCount: 5,
  },
  {
    id: '11',
    reviewer: 'Demet N.',
    business: 'Pet Bakımı Fluffy',
    rating: 5,
    comment: 'Evcil hayvanım çok mutlu! Güvenilir ve profesyonel.',
    date: '2024-02-28',
    flagged: false,
    verifiedPurchase: true,
    antiSpamScore: 0.99,
    status: 'onaylanmış',
    helpfulCount: 22,
  },
  {
    id: '12',
    reviewer: 'Serkan H.',
    business: 'İngilizce Öğretimi Deniz',
    rating: 4,
    comment: 'Dersleri eğlenceli ve öğretici. Başarılı öğrenme deneyimi.',
    date: '2024-02-27',
    flagged: false,
    verifiedPurchase: true,
    antiSpamScore: 0.93,
    status: 'onaylanmış',
    helpfulCount: 7,
  },
  {
    id: '13',
    reviewer: 'Kemal A.',
    business: 'Özgür Elektrik',
    rating: 4,
    comment: 'Güvenilir ve hızlı hizmet. Kesinlikle tekrar ederim.',
    date: '2024-02-26',
    flagged: false,
    verifiedPurchase: true,
    antiSpamScore: 0.90,
    status: 'onaylanmış',
    helpfulCount: 11,
  },
  {
    id: '14',
    reviewer: 'Yusuf P.',
    business: 'Bahçe Tasarımı Pro',
    rating: 3,
    comment: 'Makul fiyat, makul sonuç. Bekleneni sağladı.',
    date: '2024-02-25',
    flagged: false,
    verifiedPurchase: true,
    antiSpamScore: 0.85,
    status: 'onaylanmış',
    helpfulCount: 1,
  },
  {
    id: '15',
    reviewer: 'Ali K.',
    business: 'Temizlik Şirketi Temizim',
    rating: 5,
    comment: 'Her seferinde muhteşem. Güvenle tavsiye edebiliyorum.',
    date: '2024-02-24',
    flagged: false,
    verifiedPurchase: true,
    antiSpamScore: 0.96,
    status: 'onaylanmış',
    helpfulCount: 19,
  },
];

const STATUS_CONFIG = {
  onaylanmış: { label: 'Onaylanmış', color: 'bg-green-100 text-green-800' },
  beklemede: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' },
  reddedildi: { label: 'Reddedildi', color: 'bg-red-100 text-red-800' },
};

export default function YorumlarPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const itemsPerPage = 10;

  const filteredReviews = useMemo(() => {
    return MOCK_REVIEWS.filter((review) => {
      const matchesSearch =
        review.reviewer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || review.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const paginatedReviews = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredReviews, currentPage]);

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const totalReviews = MOCK_REVIEWS.length;
  const avgRating = (
    MOCK_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / MOCK_REVIEWS.length
  ).toFixed(1);
  const flaggedCount = MOCK_REVIEWS.filter((r) => r.flagged).length;
  const verifiedCount = MOCK_REVIEWS.filter((r) => r.verifiedPurchase).length;

  const stats = [
    {
      title: 'Toplam Yorum',
      value: totalReviews,
      icon: '💬',
      color: '#00833e',
    },
    {
      title: 'Ortalama Rating',
      value: `${avgRating}⭐`,
      icon: '⭐',
      color: '#FF9800',
    },
    {
      title: 'İşaretli Yorumlar',
      value: flaggedCount,
      icon: '🚩',
      color: '#F44336',
    },
    {
      title: 'Doğrulanmış Satışlar',
      value: verifiedCount,
      icon: '✓',
      color: '#4CAF50',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Yorum ve Değerlendirme Yönetimi
        </h1>
        <p className="text-gray-600">
          İşletme yorumlarını yönetin, onaylayın ve sahte yorumları filtreleyin
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg border border-[#e0e0e0]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold mt-2" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </div>
              <div className="text-2xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-[#e0e0e0] mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Yorum, yazar veya işletme ara..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
          >
            <option value="">Tüm Durumlar</option>
            <option value="onaylanmış">Onaylanmış</option>
            <option value="beklemede">Beklemede</option>
            <option value="reddedildi">Reddedildi</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e0e0e0] bg-[#f0f2f5]">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Yorum
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  İşletme
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Anti-Spam
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedReviews.map((review) => {
                const statusConfig = STATUS_CONFIG[review.status];
                const antiSpamColor =
                  review.antiSpamScore > 0.8
                    ? 'text-green-600'
                    : review.antiSpamScore > 0.5
                      ? 'text-yellow-600'
                      : 'text-red-600';
                return (
                  <tr
                    key={review.id}
                    className="border-b border-[#e0e0e0] hover:bg-[#f0f2f5]"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{review.reviewer}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {review.comment}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{review.business}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className="fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        <span className="ml-1 font-medium text-gray-900">
                          {review.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                      >
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#00833e]"
                            style={{ width: `${review.antiSpamScore * 100}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${antiSpamColor}`}>
                          {Math.round(review.antiSpamScore * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="text-[#00833e] hover:text-[#006b32] font-medium text-sm"
                      >
                        Detay
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#e0e0e0]">
          <span className="text-sm text-gray-600">
            {filteredReviews.length === 0 ? (
              'Sonuç bulunamadı'
            ) : (
              <>
                Sayfa {currentPage} / {totalPages} ({filteredReviews.length} yorum)
              </>
            )}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-[#f0f2f5] rounded-lg disabled:opacity-50 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-[#f0f2f5] rounded-lg disabled:opacity-50 transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-[#e0e0e0] flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900">Yorum Detayı</h2>
              <button
                onClick={() => setSelectedReview(null)}
                className="text-gray-500 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 font-semibold">Yorum</p>
                <p className="text-gray-900 mt-1">{selectedReview.comment}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Yorum Sahibi</p>
                  <p className="text-gray-900 mt-1">{selectedReview.reviewer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">İşletme</p>
                  <p className="text-gray-900 mt-1">{selectedReview.business}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Rating</p>
                  <p className="text-gray-900 mt-1">{selectedReview.rating}/5 ⭐</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Anti-Spam Skoru</p>
                  <p className="text-gray-900 mt-1">
                    {Math.round(selectedReview.antiSpamScore * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Doğrulanmış Satış</p>
                  <p className="text-gray-900 mt-1">
                    {selectedReview.verifiedPurchase ? '✓ Evet' : '✕ Hayır'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Yardımcı Sayısı</p>
                  <p className="text-gray-900 mt-1">{selectedReview.helpfulCount}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[#e0e0e0] flex gap-3">
              <button
                onClick={() => setSelectedReview(null)}
                className="flex-1 px-4 py-2 border border-[#e0e0e0] rounded-lg text-gray-900 font-medium hover:bg-[#f0f2f5]"
              >
                Kapat
              </button>
              {selectedReview.status === 'beklemede' && (
                <>
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="flex-1 px-4 py-2 bg-[#00833e] text-white rounded-lg font-medium hover:bg-[#006b32]"
                  >
                    Onayla
                  </button>
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                  >
                    Reddet
                  </button>
                </>
              )}
              {selectedReview.status === 'onaylanmış' && (
                <button
                  onClick={() => setSelectedReview(null)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                >
                  Kaldır
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
