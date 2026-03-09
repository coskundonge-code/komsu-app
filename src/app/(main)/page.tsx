'use client';

import { useState } from 'react';
import { Plus, TrendingUp, Calendar } from 'lucide-react';
import { PostForm, PostCard, PostFilters, CommentSection, PollCard } from '@/components/feed';
import type { PostFormData, FilterType } from '@/components/feed';

// Mock data
const mockPosts = [
  {
    id: '1',
    authorAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop',
    authorName: 'Ayşe Kaya',
    authorHandle: 'ayse.kaya',
    timeAgo: '2 saat önce',
    type: 'guvenlik' as const,
    title: 'Mahallede Şüpheli Aktivite',
    body: 'Dün gece saat 23:00 civarında mahalle parkında şüpheli hareketler gözlendi. Lütfen dikkatli olun ve gerekirse polise haber verin.',
    commentCount: 8,
    reactions: { likes: 24, thanks: 15, agree: 32 },
  },
  {
    id: '2',
    authorAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop',
    authorName: 'Mehmet Yıldız',
    authorHandle: 'mehmet.yildiz',
    timeAgo: '4 saat önce',
    type: 'oneri' as const,
    title: 'Mahalle Temizlik Günü',
    body: 'Cumartesi günü mahallede ortak bir temizlik günü yapabiliriz. Komşularımızla birlikte parkımızı temizleyip düzenleyelim. Faydacı olmak isteyen arkadaşlar lütfen yorumda belirtsin.',
    mediaUrl:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    commentCount: 12,
    reactions: { likes: 18, thanks: 25, agree: 10 },
  },
  {
    id: '3',
    authorAvatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop',
    authorName: 'Emre Demir',
    authorHandle: 'emre.demir',
    timeAgo: '6 saat önce',
    type: 'kayipbuluntu' as const,
    title: 'Kayıp Kedisi Aranıyor - Turuncu',
    body: 'Pazartesi günü turuncu renkli kedim mahallede kayboldu. Adı Mişmiş. Spot fotoğrafı ekli. Görürseniz lütfen haber verin. 0532-XXX-XXXX',
    mediaUrl:
      'https://images.unsplash.com/photo-1574158622147-e121217e33f3?w=400&h=300&fit=crop',
    commentCount: 5,
    reactions: { likes: 15, thanks: 8, agree: 2 },
  },
];

const mockComments = [
  {
    id: 'c1',
    authorAvatar:
      'https://images.unsplash.com/photo-1507496159949-79c74b64b91e?w=96&h=96&fit=crop',
    authorName: 'Ali Demir',
    authorHandle: 'ali.demir',
    body: 'Biz de birkaç gün önce benzer bir durum yaşadık. Mahalle güvenliğine haber vermişlik.',
    timeAgo: '1 saat önce',
    likes: 5,
  },
  {
    id: 'c2',
    authorAvatar:
      'https://images.unsplash.com/photo-1534528741775-53a8c7b1e899?w=96&h=96&fit=crop',
    authorName: 'Fatma Yüksek',
    authorHandle: 'fatma.yuksek',
    body: 'Muhtar bey ile konuştum. Akşam saatleri karakola çağrı yapılmasını söyledi.',
    timeAgo: '45 dakika önce',
    likes: 8,
    replies: [
      {
        id: 'c2-r1',
        authorAvatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop',
        authorName: 'Ayşe Kaya',
        authorHandle: 'ayse.kaya',
        body: 'Teşekkür ederim bilgi için Fatma ablı.',
        timeAgo: '30 dakika önce',
        likes: 2,
      },
    ],
  },
];

const mockPoll = {
  id: 'poll1',
  question: 'Mahallede sosyal etkinlikler ne sıklıkta yapılmalı?',
  options: [
    { id: 'o1', label: 'Haftalık', votes: 45 },
    { id: 'o2', label: 'İki haftada bir', votes: 82 },
    { id: 'o3', label: 'Aylık', votes: 156 },
    { id: 'o4', label: 'Gerektiğinde', votes: 43 },
  ],
  totalVotes: 326,
};

export default function FeedPage() {
  const [showPostForm, setShowPostForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const handlePostSubmit = (data: PostFormData) => {
    console.log('New post:', data);
    setShowPostForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop"
                  alt="Your avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <button
                  onClick={() => setShowPostForm(true)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors text-left text-sm"
                >
                  Harita gönderi oluştur...
                </button>
                <button
                  onClick={() => setShowPostForm(true)}
                  className="p-2.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>

              {showPostForm && (
                <PostForm
                  authorAvatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop"
                  authorName="Benim Adım"
                  onSubmit={handlePostSubmit}
                  onCancel={() => setShowPostForm(false)}
                  isOpen={showPostForm}
                />
              )}
            </div>

            {/* Post Filters */}
            <PostFilters
              onFilterChange={setActiveFilter}
              defaultFilter="all"
            />

            {/* Posts Feed */}
            <div className="space-y-4">
              {mockPosts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>

            {/* Poll Card Example */}
            <PollCard {...mockPoll} />

            {/* Comments Section Example */}
            <div className="mt-8 pt-8 border-t-2 border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Yorum Örnekleri
              </h2>
              <CommentSection
                comments={mockComments}
                userAvatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop"
                userName="Benim Adım"
              />
            </div>

            {/* Infinite Scroll Placeholder */}
            <div className="text-center py-8">
              <p className="text-gray-500">Daha fazla gönderi yükleniyor...</p>
            </div>
          </div>

          {/* Right Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Neighborhood Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Mahalle Bilgisi</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Mahalle</p>
                  <p className="font-medium text-gray-900">Nişantaşı, Şişli</p>
                </div>
                <div>
                  <p className="text-gray-500">Toplam Komşu</p>
                  <p className="font-medium text-gray-900">2,341</p>
                </div>
                <div>
                  <p className="text-gray-500">Aktif Kullanıcı</p>
                  <p className="font-medium text-gray-900">487</p>
                </div>
                <div>
                  <p className="text-gray-500">Kuruluş Tarihi</p>
                  <p className="font-medium text-gray-900">3 yıl önce</p>
                </div>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-emerald-600" />
                <h3 className="font-semibold text-gray-900">Trend Konular</h3>
              </div>
              <div className="space-y-3">
                {[
                  { topic: 'Mahalle Güvenliği', count: 142 },
                  { topic: 'Parklar ve Bahçeler', count: 89 },
                  { topic: 'Komşu İş Birlikleri', count: 64 },
                  { topic: 'Sosyal Etkinlikler', count: 52 },
                  { topic: 'Çevresel Sorunlar', count: 38 },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {item.topic}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.count} söyleşi
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={20} className="text-emerald-600" />
                <h3 className="font-semibold text-gray-900">Yaklaşan Etkinlikler</h3>
              </div>
              <div className="space-y-3">
                {[
                  {
                    name: 'Mahalle Temizliği',
                    date: 'Cumartesi, 15 Mart',
                  },
                  {
                    name: 'Komşular Pikniği',
                    date: 'Pazar, 16 Mart',
                  },
                  {
                    name: 'Buluşma Kahvesi',
                    date: 'Pazartesi, 17 Mart',
                  },
                ].map((event, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-emerald-50 rounded-lg border border-emerald-200"
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {event.name}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{event.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
