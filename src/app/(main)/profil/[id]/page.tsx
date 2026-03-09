'use client';

import {
  MapPin,
  Calendar,
  MessageCircle,
  Heart,
  Share2,
  Users,
  Edit,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProfileData {
  name: string;
  initials: string;
  coverImage: string;
  neighborhood: string;
  joinDate: string;
  bio: string;
  stats: {
    neighbors: number;
    posts: number;
  };
  interests: string[];
  recentPosts: Array<{
    id: string;
    text: string;
    likes: number;
    comments: number;
    time: string;
  }>;
}

const mockProfile: ProfileData = {
  name: 'Coşkun Dönge',
  initials: 'CD',
  coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=400&fit=crop',
  neighborhood: 'Kadıköy, Moda',
  joinDate: '15 Mart 2026',
  bio: 'Mahalle gönüllüsü. Komşu topluluğunu geliştirmede tutkulu. Spor, müzik ve sosyal projeler benim tutkum.',
  stats: {
    neighbors: 87,
    posts: 24,
  },
  interests: ['Spor', 'Müzik', 'Teknoloji', 'Bahçecilik', 'Fotoğrafçılık'],
  recentPosts: [
    {
      id: '1',
      text: 'Gelecek cumartesi yine mahalle kahvaltısı yapacağız! Herkes katılmaya davetli 🎉',
      likes: 45,
      comments: 12,
      time: '2 gün',
    },
    {
      id: '2',
      text: 'Mahallede yeni bir spor kulübü kuruyoruz. Futbol ve voleybol turnuvaları düzenlenecek!',
      likes: 67,
      comments: 23,
      time: '5 gün',
    },
    {
      id: '3',
      text: 'Kütüphanede edebiyat klasikleri tartışması yapacağız. "Araba Sevdası" hakkında konuşacağız.',
      likes: 34,
      comments: 15,
      time: '8 gün',
    },
  ],
};

const tabs = [
  { id: 'posts', label: 'Gönderiler' },
  { id: 'about', label: 'Hakkında' },
  { id: 'neighbors', label: 'Komşular' },
];

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('posts');
  const isOwnProfile = params.id === 'me';

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Cover Image */}
      <div className="relative h-48 bg-[#00833e] overflow-hidden">
        <img
          src={mockProfile.coverImage}
          alt="Profil Kapağı"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
      </div>

      {/* Profile Section */}
      <div className="max-w-3xl mx-auto px-4 -mt-24 relative z-10 mb-6">
        {/* Header Card */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-4">
          <div className="flex items-end gap-4 mb-4">
            {/* Avatar */}
            <div className="w-32 h-32 bg-gradient-to-br from-[#00833e] to-[#006b32] rounded-lg flex items-center justify-center text-white text-5xl font-bold border-4 border-white shadow-lg flex-shrink-0">
              {mockProfile.initials}
            </div>

            {/* Profile Info */}
            <div className="flex-1 pb-2">
              <h1 className="text-3xl font-bold text-[#333] mb-1">{mockProfile.name}</h1>
              <div className="flex items-center gap-1 text-[#8f8f8f] mb-1">
                <MapPin size={16} />
                <span className="text-sm">{mockProfile.neighborhood}</span>
              </div>
              <div className="flex items-center gap-1 text-[#8f8f8f]">
                <Calendar size={16} />
                <span className="text-sm">Katılma tarihi: {mockProfile.joinDate}</span>
              </div>
            </div>

            {/* Action Button */}
            {isOwnProfile ? (
              <Link
                href="/ayarlar"
                className="flex items-center gap-2 px-4 py-2 bg-[#00833e] hover:bg-[#006b32] text-white font-medium rounded-lg transition-colors flex-shrink-0"
              >
                <Edit size={16} />
                Düzenle
              </Link>
            ) : (
              <Link
                href="/mesajlar"
                className="px-4 py-2 bg-[#00833e] hover:bg-[#006b32] text-white font-medium rounded-lg transition-colors flex-shrink-0"
              >
                Mesaj Gönder
              </Link>
            )}
          </div>

          {/* Bio */}
          <p className="text-[#404040] text-sm leading-relaxed">{mockProfile.bio}</p>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 text-center">
            <p className="text-2xl font-bold text-[#333]">{mockProfile.stats.neighbors}</p>
            <p className="text-sm text-[#8f8f8f] mt-1">Komşu</p>
          </div>
          <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 text-center">
            <p className="text-2xl font-bold text-[#333]">{mockProfile.stats.posts}</p>
            <p className="text-sm text-[#8f8f8f] mt-1">Gönderi</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden">
          <div className="flex border-b border-[#e0e0e0]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 px-4 py-4 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-[#00833e] text-[#00833e]'
                    : 'border-transparent text-[#8f8f8f] hover:text-[#333]'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-0">
            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div className="divide-y divide-[#e0e0e0]">
                {mockProfile.recentPosts.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-[#8f8f8f]">Henüz gönderi yok</p>
                  </div>
                ) : (
                  mockProfile.recentPosts.map((post) => (
                    <Link key={post.id} href="/" className="block p-4 hover:bg-[#f0f2f5] transition-colors">
                      <p className="text-[#333] text-sm mb-3">{post.text}</p>
                      <div className="flex items-center gap-4 text-xs text-[#8f8f8f]">
                        <span className="flex items-center gap-1">
                          <Heart size={14} /> {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={14} /> {post.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 size={14} />
                        </span>
                        <span className="ml-auto">{post.time}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="p-4 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-[#333] mb-3">İlgi Alanları</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockProfile.interests.map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1.5 bg-[#f0f2f5] text-[#00833e] text-xs font-medium rounded-full border border-[#e0e0e0]"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#333] mb-3">Hakkında</h3>
                  <div className="space-y-2 text-sm text-[#404040]">
                    <p className="flex items-center gap-2">
                      <Calendar size={16} className="text-[#00833e]" />
                      {mockProfile.joinDate} tarihinde katıldı
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#00833e]" />
                      {mockProfile.neighborhood} bölgesinde yaşıyor
                    </p>
                    <p className="flex items-center gap-2">
                      <Users size={16} className="text-[#00833e]" />
                      {mockProfile.stats.neighbors} kişi komşu olarak bağlantıda
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Neighbors Tab */}
            {activeTab === 'neighbors' && (
              <div className="p-4">
                <div className="space-y-3">
                  {[
                    { name: 'Ahmet Yılmaz', location: 'Blok A, Daire 5', id: '10' },
                    { name: 'Fatma Şahin', location: 'Blok B, Daire 12', id: '11' },
                    { name: 'Mehmet Demir', location: 'Blok A, Daire 8', id: '12' },
                    { name: 'Zeynep Kaya', location: 'Blok C, Daire 3', id: '13' },
                    { name: 'Elif Demir', location: 'Blok B, Daire 7', id: '14' },
                  ].map((neighbor) => (
                    <div
                      key={neighbor.name}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f0f2f5] transition-colors border border-[#e0e0e0]"
                    >
                      <Link href={`/profil/${neighbor.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#00833e] to-[#006b32] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {neighbor.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#333]">{neighbor.name}</p>
                          <p className="text-xs text-[#8f8f8f]">{neighbor.location}</p>
                        </div>
                      </Link>
                      <Link href="/mesajlar" className="text-[#00833e] hover:text-[#006b32] transition-colors flex-shrink-0">
                        <MessageCircle size={18} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
