'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  MessageCircle,
  Heart,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  Filter,
} from 'lucide-react';

interface Post {
  id: string;
  content: string;
  author: string;
  type: 'gönderi' | 'ilan' | 'acil durum' | 'etkinlik';
  status: 'yayınlandı' | 'onay bekleniyor' | 'reddedildi' | 'kaldırıldı';
  moderationScore: number;
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
  neighborhood: string;
}

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    content: 'Mahallede çöp birikintisi sorunu var, belediye çağrıldı',
    author: 'Ahmet K.',
    type: 'gönderi',
    status: 'yayınlandı',
    moderationScore: 0.95,
    likes: 42,
    comments: 8,
    views: 234,
    createdAt: '2024-03-09 14:30',
    neighborhood: 'Beşiktaş',
  },
  {
    id: '2',
    content: 'Tasarımcı mobilya satılık, duruşu mükemmel',
    author: 'Fatma D.',
    type: 'ilan',
    status: 'yayınlandı',
    moderationScore: 0.92,
    likes: 23,
    comments: 5,
    views: 156,
    createdAt: '2024-03-09 12:15',
    neighborhood: 'Kadıköy',
  },
  {
    id: '3',
    content: 'Hastane yakınında kedi yaralı, acil bakıma ihtiyacı var!!!',
    author: 'Zeynep A.',
    type: 'acil durum',
    status: 'yayınlandı',
    moderationScore: 0.88,
    likes: 67,
    comments: 23,
    views: 890,
    createdAt: '2024-03-09 10:45',
    neighborhood: 'Şişli',
  },
  {
    id: '4',
    content: 'Cumartesi mahalle pikniği düzenlenecek, herkesi bekliyoruz',
    author: 'Mustafa T.',
    type: 'etkinlik',
    status: 'yayınlandı',
    moderationScore: 0.91,
    likes: 89,
    comments: 34,
    views: 567,
    createdAt: '2024-03-08 16:20',
    neighborhood: 'Levent',
  },
  {
    id: '5',
    content: 'Evdeğiştirme fırsat, 2+1 araniyor',
    author: 'Elif Y.',
    type: 'ilan',
    status: 'onay bekleniyor',
    moderationScore: 0.76,
    likes: 5,
    comments: 1,
    views: 45,
    createdAt: '2024-03-08 13:00',
    neighborhood: 'Fatih',
  },
  {
    id: '6',
    content: 'Yolda kaza var, lütfen alternatif rota kullanın',
    author: 'İbrahim M.',
    type: 'gönderi',
    status: 'yayınlandı',
    moderationScore: 0.93,
    likes: 34,
    comments: 12,
    views: 423,
    createdAt: '2024-03-08 09:30',
    neighborhood: 'Moda',
  },
  {
    id: '7',
    content: 'Yoga dersleri başlıyor, sıfırdan başlayanlar için',
    author: 'Ayşe S.',
    type: 'etkinlik',
    status: 'yayınlandı',
    moderationScore: 0.89,
    likes: 56,
    comments: 18,
    views: 312,
    createdAt: '2024-03-07 15:45',
    neighborhood: 'Caferağa',
  },
  {
    id: '8',
    content: 'Spam mesajlar gönderiyorum herkes satın alsın!!!',
    author: 'Fake User',
    type: 'gönderi',
    status: 'reddedildi',
    moderationScore: 0.15,
    likes: 0,
    comments: 0,
    views: 12,
    createdAt: '2024-03-07 10:00',
    neighborhood: 'Beşiktaş',
  },
  {
    id: '9',
    content: 'Komşu bir sorunla uğraşıyoruz, hukuki tavsiye arıyorum',
    author: 'Hasan B.',
    type: 'gönderi',
    status: 'yayınlandı',
    moderationScore: 0.87,
    likes: 28,
    comments: 9,
    views: 178,
    createdAt: '2024-03-06 14:20',
    neighborhood: 'Levent',
  },
  {
    id: '10',
    content: 'Bu post nefret söylemi içeriyor',
    author: 'Banned User',
    type: 'gönderi',
    status: 'kaldırıldı',
    moderationScore: 0.05,
    likes: 0,
    comments: 0,
    views: 8,
    createdAt: '2024-03-06 08:15',
    neighborhood: 'Şişli',
  },
  {
    id: '11',
    content: 'Elektrik tesisatçı aranıyor, acil durum',
    author: 'Cengiz K.',
    type: 'acil durum',
    status: 'yayınlandı',
    moderationScore: 0.90,
    likes: 19,
    comments: 4,
    views: 132,
    createdAt: '2024-03-05 18:00',
    neighborhood: 'Kadıköy',
  },
  {
    id: '12',
    content: 'İkinci el çamaşır makinesi, 50TL',
    author: 'Demet N.',
    type: 'ilan',
    status: 'yayınlandı',
    moderationScore: 0.94,
    likes: 12,
    comments: 3,
    views: 89,
    createdAt: '2024-03-05 11:30',
    neighborhood: 'Fatih',
  },
  {
    id: '13',
    content: 'Mahalle futbol turnuvası başlıyor, katılmak isteyen yazır',
    author: 'Serkan H.',
    type: 'etkinlik',
    status: 'onay bekleniyor',
    moderationScore: 0.88,
    likes: 34,
    comments: 15,
    views: 256,
    createdAt: '2024-03-04 16:45',
    neighborhood: 'Moda',
  },
  {
    id: '14',
    content: 'Bahçe bakım hizmetleri sağlıyorum',
    author: 'Kemal A.',
    type: 'ilan',
    status: 'yayınlandı',
    moderationScore: 0.86,
    likes: 8,
    comments: 2,
    views: 67,
    createdAt: '2024-03-04 10:00',
    neighborhood: 'Levent',
  },
  {
    id: '15',
    content: 'Polis kontrolü var, ön planda durmuş',
    author: 'Yusuf P.',
    type: 'gönderi',
    status: 'yayınlandı',
    moderationScore: 0.89,
    likes: 56,
    comments: 21,
    views: 534,
    createdAt: '2024-03-03 09:15',
    neighborhood: 'Beşiktaş',
  },
];

const TYPE_CONFIG = {
  gönderi: { label: 'Gönderi', color: 'bg-blue-100 text-blue-800', icon: '📝' },
  ilan: { label: 'İlan', color: 'bg-purple-100 text-purple-800', icon: '📌' },
  'acil durum': {
    label: 'Acil Durum',
    color: 'bg-red-100 text-red-800',
    icon: '🚨',
  },
  etkinlik: {
    label: 'Etkinlik',
    color: 'bg-green-100 text-green-800',
    icon: '🎉',
  },
};

const STATUS_CONFIG = {
  yayınlandı: {
    label: 'Yayınlandı',
    color: 'bg-green-100 text-green-800',
  },
  'onay bekleniyor': {
    label: 'Onay Bekleniyor',
    color: 'bg-yellow-100 text-yellow-800',
  },
  reddedildi: { label: 'Reddedildi', color: 'bg-orange-100 text-orange-800' },
  kaldırıldı: { label: 'Kaldırıldı', color: 'bg-red-100 text-red-800' },
};

export default function GonderilerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [actionModal, setActionModal] = useState<{
    open: boolean;
    post: Post | null;
    action: string;
  }>({ open: false, post: null, action: '' });

  const itemsPerPage = 10;

  const filteredPosts = useMemo(() => {
    return MOCK_POSTS.filter((post) => {
      const matchesSearch =
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !typeFilter || post.type === typeFilter;
      const matchesStatus = !statusFilter || post.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, typeFilter, statusFilter]);

  const paginatedPosts = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredPosts.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredPosts, currentPage]);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  const stats = [
    {
      title: 'Toplam Gönderi',
      value: MOCK_POSTS.length,
      icon: '📊',
      color: '#00833e',
    },
    {
      title: 'Yayınlanmış',
      value: MOCK_POSTS.filter((p) => p.status === 'yayınlandı').length,
      icon: '✓',
      color: '#4CAF50',
    },
    {
      title: 'Onay Bekleniyor',
      value: MOCK_POSTS.filter((p) => p.status === 'onay bekleniyor').length,
      icon: '⏳',
      color: '#FF9800',
    },
    {
      title: 'Reddedilmiş',
      value: MOCK_POSTS.filter(
        (p) => p.status === 'reddedildi' || p.status === 'kaldırıldı'
      ).length,
      icon: '✕',
      color: '#F44336',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gönderi Yönetimi</h1>
        <p className="text-gray-600">
          Tüm gönderileri yönetin, filtreleyin ve moderasyon işlemleri yapın
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-surface p-6 rounded-lg border border-border">
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
      <div className="bg-surface p-6 rounded-lg border border-border mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Gönderi veya yazar ara..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tüm Türler</option>
            {Object.entries(TYPE_CONFIG).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tüm Durumlar</option>
            {Object.entries(STATUS_CONFIG).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Gönderi
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Yazar
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Tür
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Moderasyon
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Etkileşim
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedPosts.map((post) => {
                const typeConfig = TYPE_CONFIG[post.type];
                const statusConfig = STATUS_CONFIG[post.status];
                return (
                  <tr
                    key={post.id}
                    className="border-b border-border hover:bg-background"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-2">
                          {post.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{post.createdAt}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{post.author}</p>
                        <p className="text-xs text-gray-500">{post.neighborhood}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}
                      >
                        {typeConfig.icon} {typeConfig.label}
                      </span>
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
                            className="h-full bg-primary"
                            style={{ width: `${post.moderationScore * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {Math.round(post.moderationScore * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-4 text-gray-600">
                        <span>👁 {post.views}</span>
                        <span>❤️ {post.likes}</span>
                        <span>💬 {post.comments}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          setActionModal({
                            open: true,
                            post,
                            action: 'view',
                          })
                        }
                        className="text-primary hover:text-primary-hover font-medium text-sm"
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <span className="text-sm text-gray-600">
            {filteredPosts.length === 0 ? (
              'Sonuç bulunamadı'
            ) : (
              <>
                Sayfa {currentPage} / {totalPages} ({filteredPosts.length} gönderi)
              </>
            )}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-background rounded-lg disabled:opacity-50 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-background rounded-lg disabled:opacity-50 transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {actionModal.open && actionModal.post && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900">Gönderi Detayı</h2>
              <button
                onClick={() => setActionModal({ open: false, post: null, action: '' })}
                className="text-gray-500 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 font-semibold">İçerik</p>
                <p className="text-gray-900 mt-1">{actionModal.post.content}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Yazar</p>
                  <p className="text-gray-900 mt-1">{actionModal.post.author}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Mahalle</p>
                  <p className="text-gray-900 mt-1">{actionModal.post.neighborhood}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Tür</p>
                  <p className="text-gray-900 mt-1">
                    {TYPE_CONFIG[actionModal.post.type].label}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Durum</p>
                  <p className="text-gray-900 mt-1">
                    {STATUS_CONFIG[actionModal.post.status].label}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Moderasyon Skoru</p>
                  <p className="text-gray-900 mt-1">
                    {Math.round(actionModal.post.moderationScore * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Tarih</p>
                  <p className="text-gray-900 mt-1">{actionModal.post.createdAt}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex gap-3">
              <button
                onClick={() => setActionModal({ open: false, post: null, action: '' })}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-gray-900 font-medium hover:bg-background"
              >
                Kapat
              </button>
              {actionModal.post.status === 'onay bekleniyor' && (
                <>
                  <button
                    onClick={() => setActionModal({ open: false, post: null, action: '' })}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover"
                  >
                    Onayla
                  </button>
                  <button
                    onClick={() => setActionModal({ open: false, post: null, action: '' })}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                  >
                    Reddet
                  </button>
                </>
              )}
              {actionModal.post.status === 'yayınlandı' && (
                <button
                  onClick={() => setActionModal({ open: false, post: null, action: '' })}
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
