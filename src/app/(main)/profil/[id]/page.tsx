'use client';

import {
  MapPin,
  Calendar,
  MessageCircle,
  Settings,
  Heart,
  Bookmark,
  Users,
  Star,
  Edit,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const mockProfile = {
  name: 'Coşkun Dönge',
  avatar: null, // Will use initials
  initials: 'C',
  coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=400&fit=crop',
  neighborhood: 'Kadıköy, Moda',
  city: 'İstanbul, Türkiye',
  joinDate: 'Mart 2026',
  bio: 'Mahalle gönüllüsü. Toplum oluşturmada tutkulu.',
  profileProgress: 65,
  stats: {
    posts: 12,
    thanks: 45,
    neighbors: 87,
  },
  interests: ['Spor', 'Müzik', 'Teknoloji', 'Bahçecilik'],
  groups: [
    { name: 'Komşu Kahvaltıları', members: 47 },
    { name: 'Mahalle Spor Kulübü', members: 89 },
  ],
  bookmarks: [
    { title: 'Mahalle Temizlik Günü Organizasyonu', author: 'Mehmet Y.', timeAgo: '2 gün' },
    { title: 'Yeni açılan kafe hakkında', author: 'Fatma Ç.', timeAgo: '3 gün' },
  ],
  recentActivity: [
    { type: 'post', text: 'Gelecek cumartesi yine mahalle kahvaltısı yapacağız!', likes: 45, comments: 12, timeAgo: '2 gün' },
    { type: 'post', text: 'Mahallede yeni bir spor kulübü kuruyoruz.', likes: 67, comments: 23, timeAgo: '5 gün' },
    { type: 'post', text: 'Kütüphanede edebiyat klasikleri tartışması yapacağız.', likes: 34, comments: 15, timeAgo: '8 gün' },
  ],
};

const tabs = [
  { id: 'activity', label: 'Aktivite' },
  { id: 'about', label: 'Hakkında' },
  { id: 'bookmarks', label: 'Kaydedilenler' },
];

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('activity');
  const isOwnProfile = params.id === 'me';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cover Image */}
      <div className="relative h-[200px] bg-[#00833e]">
        <img
          src={mockProfile.coverImage}
          alt="Kapak"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Profile Header */}
      <div className="max-w-[680px] mx-auto px-4">
        <div className="relative -mt-16 mb-4">
          <div className="flex items-end gap-4">
            {/* Avatar */}
            <div className="w-28 h-28 bg-gray-700 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg flex-shrink-0">
              {mockProfile.initials}
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold text-gray-900">{mockProfile.name}</h1>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                {mockProfile.neighborhood}
              </div>
            </div>
            {isOwnProfile ? (
              <div className="flex gap-2 pb-2">
                <Link
                  href="/ayarlar"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Profili Düzenle
                </Link>
              </div>
            ) : (
              <div className="flex gap-2 pb-2">
                <button className="px-4 py-2 bg-[#00833e] text-white rounded-lg text-sm font-medium hover:bg-[#006b32] transition-colors">
                  Mesaj Gönder
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Progress (Nextdoor Dashboard style) */}
        {isOwnProfile && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">Profil Tamamlama</h3>
              <span className="text-sm font-bold text-[#00833e]">{mockProfile.profileProgress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00833e] rounded-full transition-all"
                style={{ width: `${mockProfile.profileProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Bio ve fotoğraf ekleyerek profilini tamamla.</p>
          </div>
        )}

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-gray-900">{mockProfile.stats.posts}</p>
              <p className="text-xs text-gray-500">Gönderi</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{mockProfile.stats.thanks}</p>
              <p className="text-xs text-gray-500">Teşekkür</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{mockProfile.stats.neighbors}</p>
              <p className="text-xs text-gray-500">Komşu</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4">
          <div className="flex border-b border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'text-[#006b32] border-[#00833e]'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4">
            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-4">
                {mockProfile.recentActivity.map((item, idx) => (
                  <div key={idx} className="p-4 border border-gray-100 rounded-lg">
                    <p className="text-sm text-gray-800 mb-2">{item.text}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" /> {item.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" /> {item.comments}
                      </span>
                      <span>{item.timeAgo}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                {mockProfile.bio && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Bio</h4>
                    <p className="text-sm text-gray-600">{mockProfile.bio}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">İlgi Alanları</h4>
                  <div className="flex flex-wrap gap-2">
                    {mockProfile.interests.map((interest) => (
                      <span key={interest} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Gruplar</h4>
                  <div className="space-y-2">
                    {mockProfile.groups.map((group) => (
                      <div key={group.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                        <Users className="w-5 h-5 text-[#00833e]" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{group.name}</p>
                          <p className="text-xs text-gray-500">{group.members} üye</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Üye Olma Tarihi</h4>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {mockProfile.joinDate}
                  </div>
                </div>
              </div>
            )}

            {/* Bookmarks Tab */}
            {activeTab === 'bookmarks' && (
              <div className="space-y-3">
                {mockProfile.bookmarks.map((bm, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <Bookmark className="w-5 h-5 text-[#00833e] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{bm.title}</p>
                      <p className="text-xs text-gray-500">{bm.author} · {bm.timeAgo}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
