'use client';

import Image from 'next/image';
import {
  MapPin,
  Calendar,
  MessageCircle,
  Heart,
  Share2,
  Users,
  Edit,
  CheckCircle,
  Shield,
  UserPlus,
  Send,
  MessageSquare,
  Calendar as CalendarIcon,
  Lightbulb,
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
    posts: number;
    neighbors: number;
    helps: number;
    suggestions: number;
  };
  badges: Array<{
    id: string;
    label: string;
    icon: 'verified' | 'leader';
  }>;
  interests: string[];
  recentPosts: Array<{
    id: string;
    text: string;
    image?: string;
    likes: number;
    comments: number;
    time: string;
  }>;
  events: Array<{
    id: string;
    title: string;
    date: string;
    attendees: number;
  }>;
  suggestions: Array<{
    id: string;
    title: string;
    description: string;
    votes: number;
  }>;
}

const mockProfile: ProfileData = {
  name: 'Coşkun Dönge',
  initials: 'CD',
  coverImage: 'https://picsum.photos/1200/400?random=78',
  neighborhood: 'Kadıköy, Moda',
  joinDate: '15 Mart 2026',
  bio: 'Mahalle gönüllüsü. Komşu topluluğunu geliştirmede tutkulu. Spor, müzik ve sosyal projeler benim tutkum.',
  stats: {
    posts: 24,
    neighbors: 87,
    helps: 12,
    suggestions: 8,
  },
  badges: [
    { id: '1', label: 'Doğrulanmış Komşu', icon: 'verified' },
    { id: '2', label: 'Mahalle Lideri', icon: 'leader' },
  ],
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
  events: [
    { id: '1', title: 'Mahalle Kahvaltısı', date: 'Cumartesi, 15 Mart', attendees: 24 },
    { id: '2', title: 'Futbol Turnuvası', date: 'Pazar, 16 Mart', attendees: 18 },
  ],
  suggestions: [
    { id: '1', title: 'Yeni oyun parkı kurulması', description: 'Çocuklara yönelik modern oyun alanı', votes: 156 },
    { id: '2', title: 'Bisiklet yolu projesi', description: 'Mahalle içinde güvenli bisiklet yolları', votes: 89 },
  ],
};

const tabs = [
  { id: 'posts', label: 'Gönderiler' },
  { id: 'events', label: 'Etkinlikler' },
  { id: 'suggestions', label: 'Öneriler' },
  { id: 'about', label: 'Hakkında' },
];

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('posts');
  const isOwnProfile = params.id === 'me';

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Cover Image with Enhanced Gradient Overlay */}
      <div className="relative h-56 bg-gradient-to-b from-[#00833e] to-[#006b32] overflow-hidden">
        <Image
          src={mockProfile.coverImage}
          alt="Profil Kapağı"
          width={1200}
          height={400}
          className="w-full h-full object-cover"
          unoptimized
        />
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      </div>

      {/* Profile Section */}
      <div className="max-w-3xl mx-auto px-4 -mt-28 relative z-10 mb-8">
        {/* Header Card with Badges */}
        <div className="bg-white rounded-xl shadow-lg border border-[#e0e0e0] p-6 mb-6 card-hover">
          <div className="flex items-end gap-4 mb-6">
            {/* Avatar */}
            <div className="w-32 h-32 bg-gradient-to-br from-[#00833e] to-[#006b32] rounded-xl flex items-center justify-center text-white text-5xl font-bold border-4 border-white shadow-xl flex-shrink-0">
              {mockProfile.initials}
            </div>

            {/* Profile Info and Badges */}
            <div className="flex-1 pb-2">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-3xl font-bold text-[#333] mb-2">{mockProfile.name}</h1>
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {mockProfile.badges.map((badge) => (
                      <div
                        key={badge.id}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#00833e]/10 to-[#006b32]/10 rounded-full border border-[#00833e]/30"
                      >
                        {badge.icon === 'verified' ? (
                          <CheckCircle size={14} className="text-[#00833e]" />
                        ) : (
                          <Shield size={14} className="text-[#00833e]" />
                        )}
                        <span className="text-xs font-medium text-[#006b32]">{badge.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location and Join Date */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#8f8f8f]">
                  <MapPin size={16} className="text-[#00833e]" />
                  <span className="text-sm">{mockProfile.neighborhood}</span>
                </div>
                <div className="flex items-center gap-2 text-[#8f8f8f]">
                  <Calendar size={16} className="text-[#00833e]" />
                  <span className="text-sm">{mockProfile.joinDate} tarihinde katıldı</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              {isOwnProfile ? (
                <Link
                  href="/ayarlar"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#00833e] hover:bg-[#006b32] text-white font-medium rounded-lg transition-all card-hover"
                >
                  <Edit size={16} />
                  Düzenle
                </Link>
              ) : (
                <>
                  <Link
                    href="/mesajlar"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#00833e] hover:bg-[#006b32] text-white font-medium rounded-lg transition-all card-hover"
                  >
                    <Send size={16} />
                    Mesaj Gönder
                  </Link>
                  <button className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-[#00833e] text-[#00833e] hover:bg-[#00833e]/5 font-medium rounded-lg transition-all card-hover">
                    <UserPlus size={16} />
                    Komşu Ekle
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bio Section */}
          <div className="border-t border-[#e0e0e0] pt-4">
            <p className="text-[#404040] text-sm leading-relaxed">{mockProfile.bio}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 text-center card-hover">
            <p className="text-2xl font-bold text-[#00833e]">{mockProfile.stats.posts}</p>
            <p className="text-xs text-[#8f8f8f] mt-1 font-medium">Gönderi</p>
          </div>
          <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 text-center card-hover">
            <p className="text-2xl font-bold text-[#00833e]">{mockProfile.stats.neighbors}</p>
            <p className="text-xs text-[#8f8f8f] mt-1 font-medium">Komşu</p>
          </div>
          <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 text-center card-hover">
            <p className="text-2xl font-bold text-[#00833e]">{mockProfile.stats.helps}</p>
            <p className="text-xs text-[#8f8f8f] mt-1 font-medium">Yardım</p>
          </div>
          <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 text-center card-hover">
            <p className="text-2xl font-bold text-[#00833e]">{mockProfile.stats.suggestions}</p>
            <p className="text-xs text-[#8f8f8f] mt-1 font-medium">Öneri</p>
          </div>
        </div>

        {/* Tabs Container */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden shadow-sm">
          {/* Tab Navigation */}
          <div className="flex border-b border-[#e0e0e0] overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 px-4 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-[#00833e] text-[#00833e]'
                    : 'border-transparent text-[#8f8f8f] hover:text-[#333] hover:border-[#e0e0e0]'
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
                    <div key={post.id} className="p-5 hover:bg-[#f0f2f5] transition-colors card-hover border-l-4 border-transparent hover:border-[#00833e]">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-[#333] text-sm font-medium leading-relaxed">{post.text}</p>
                        </div>
                        <span className="text-xs text-[#8f8f8f] font-medium whitespace-nowrap ml-2">{post.time}</span>
                      </div>

                      {/* Post Actions */}
                      <div className="flex items-center gap-6 text-xs text-[#8f8f8f] pt-3 border-t border-[#e0e0e0]">
                        <button className="flex items-center gap-1.5 hover:text-[#00833e] transition-colors">
                          <Heart size={16} className="text-[#e74c3c]" />
                          <span className="font-medium">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-[#00833e] transition-colors">
                          <MessageCircle size={16} />
                          <span className="font-medium">{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-[#00833e] transition-colors">
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="p-4 space-y-3">
                {mockProfile.events.length === 0 ? (
                  <div className="p-8 text-center">
                    <CalendarIcon size={32} className="mx-auto text-[#e0e0e0] mb-2" />
                    <p className="text-[#8f8f8f]">Yaklaşan etkinlik yok</p>
                  </div>
                ) : (
                  mockProfile.events.map((event) => (
                    <div key={event.id} className="p-4 border border-[#e0e0e0] rounded-lg card-hover hover:border-[#00833e] hover:shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#00833e] to-[#006b32] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                          <CalendarIcon size={18} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-[#333] text-sm">{event.title}</h4>
                          <p className="text-xs text-[#8f8f8f] mt-1">{event.date}</p>
                          <p className="text-xs text-[#00833e] font-medium mt-2">{event.attendees} kişi katılıyor</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Suggestions Tab */}
            {activeTab === 'suggestions' && (
              <div className="p-4 space-y-3">
                {mockProfile.suggestions.length === 0 ? (
                  <div className="p-8 text-center">
                    <Lightbulb size={32} className="mx-auto text-[#e0e0e0] mb-2" />
                    <p className="text-[#8f8f8f]">Henüz öneri yok</p>
                  </div>
                ) : (
                  mockProfile.suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="p-4 border border-[#e0e0e0] rounded-lg card-hover hover:border-[#00833e] hover:shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#f0f2f5] to-[#e0e0e0] rounded-lg flex items-center justify-center text-[#00833e] flex-shrink-0">
                          <Lightbulb size={18} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-[#333] text-sm">{suggestion.title}</h4>
                          <p className="text-xs text-[#8f8f8f] mt-1">{suggestion.description}</p>
                          <div className="flex items-center gap-3 mt-3">
                            <button className="px-3 py-1 bg-[#f0f2f5] hover:bg-[#00833e]/10 text-[#00833e] text-xs font-medium rounded transition-colors">
                              Oyla
                            </button>
                            <span className="text-xs text-[#8f8f8f] font-medium">{suggestion.votes} oy</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="p-6 space-y-6">
                {/* User Bio */}
                <div>
                  <h3 className="text-sm font-bold text-[#333] mb-3 flex items-center gap-2">
                    <MessageSquare size={16} className="text-[#00833e]" />
                    Hakkında
                  </h3>
                  <p className="text-sm text-[#404040] leading-relaxed">{mockProfile.bio}</p>
                </div>

                {/* Location & Join Info */}
                <div>
                  <h3 className="text-sm font-bold text-[#333] mb-3 flex items-center gap-2">
                    <MapPin size={16} className="text-[#00833e]" />
                    Bilgiler
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-[#f0f2f5] rounded-lg">
                      <Calendar size={16} className="text-[#00833e] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-[#8f8f8f] mb-1">Katılım Tarihi</p>
                        <p className="text-sm text-[#333] font-medium">{mockProfile.joinDate}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-[#f0f2f5] rounded-lg">
                      <MapPin size={16} className="text-[#00833e] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-[#8f8f8f] mb-1">Bölge</p>
                        <p className="text-sm text-[#333] font-medium">{mockProfile.neighborhood}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-[#f0f2f5] rounded-lg">
                      <Users size={16} className="text-[#00833e] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-[#8f8f8f] mb-1">Komşu Ağı</p>
                        <p className="text-sm text-[#333] font-medium">{mockProfile.stats.neighbors} komşu</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <h3 className="text-sm font-bold text-[#333] mb-3 flex items-center gap-2">
                    <Lightbulb size={16} className="text-[#00833e]" />
                    İlgi Alanları
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {mockProfile.interests.map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1.5 bg-gradient-to-r from-[#00833e]/10 to-[#006b32]/10 text-[#006b32] text-xs font-medium rounded-full border border-[#00833e]/30 hover:border-[#00833e] transition-colors card-hover"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
