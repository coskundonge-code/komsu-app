'use client';

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
  MessageSquare,
  Calendar as CalendarIcon,
  Lightbulb,
  Award,
  ThumbsUp,
  Star,
  Zap,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images';
import { AddressVerificationStatus } from '@/components/verification/address-verification-status';

interface ProfileData {
  name: string;
  initials: string;
  avatar: string;
  coverImage: string;
  neighborhood: string;
  joinDate: string;
  bio: string;
  stats: {
    posts: number;
    neighbors: number;
    helps: number;
    thankyous: number;
  };
  badges: Array<{
    id: string;
    label: string;
    icon: 'verified' | 'leader' | 'helper' | 'trusted' | 'active';
  }>;
  interests: string[];
  recentPosts: Array<{
    id: string;
    author: string;
    text: string;
    image?: string;
    likes: number;
    comments: number;
    time: string;
  }>;
  comments: Array<{
    id: string;
    author: string;
    postTitle: string;
    text: string;
    likes: number;
    time: string;
  }>;
  recommendations: Array<{
    id: string;
    business: string;
    category: string;
    description: string;
    rating: number;
  }>;
  neighbors: Array<{
    id: string;
    name: string;
    initials: string;
  }>;
}

const mockProfile: ProfileData = {
  name: 'Coşkun Dönge',
  initials: 'CD',
  avatar: getFeedImageUrl(78, 200, 200),
  coverImage: getFeedImageUrl(78, 1200, 400),
  neighborhood: 'Kadıköy, Moda',
  joinDate: '15 Mart 2026',
  bio: 'Mahalle gönüllüsü. Komşu topluluğunu geliştirmede tutkulu. Spor, müzik ve sosyal projeler benim tutkum.',
  stats: {
    posts: 45,
    neighbors: 89,
    helps: 128,
    thankyous: 18,
  },
  badges: [
    { id: '1', label: 'Yardımsever', icon: 'helper' },
    { id: '2', label: 'Aktif Komşu', icon: 'active' },
    { id: '3', label: 'Güvenilir Satıcı', icon: 'trusted' },
  ],
  interests: ['Spor', 'Müzik', 'Teknoloji', 'Bahçecilik', 'Fotoğrafçılık'],
  recentPosts: [
    {
      id: '1',
      author: 'Coşkun Dönge',
      text: 'Gelecek cumartesi yine mahalle kahvaltısı yapacağız! Herkes katılmaya davetli 🎉',
      likes: 45,
      comments: 12,
      time: '2 gün',
    },
    {
      id: '2',
      author: 'Coşkun Dönge',
      text: 'Mahallede yeni bir spor kulübü kuruyoruz. Futbol ve voleybol turnuvaları düzenlenecek!',
      likes: 67,
      comments: 23,
      time: '5 gün',
    },
    {
      id: '3',
      author: 'Coşkun Dönge',
      text: 'Kütüphanede edebiyat klasikleri tartışması yapacağız. "Araba Sevdası" hakkında konuşacağız.',
      likes: 34,
      comments: 15,
      time: '8 gün',
    },
    {
      id: '4',
      author: 'Coşkun Dönge',
      text: 'Yeni kitap önerileriniz var mı? Şu sıralar yazımda yoğunlaşmaya başladığım dönemler hakkında okuduğumuz müzayaka var.',
      likes: 28,
      comments: 8,
      time: '12 gün',
    },
    {
      id: '5',
      author: 'Coşkun Dönge',
      text: 'Mahalle pikniği çok güzel geçti! Katılan herkese teşekkürler. Önümüzdeki ay yine buluşalım.',
      likes: 56,
      comments: 19,
      time: '15 gün',
    },
  ],
  comments: [
    {
      id: '1',
      author: 'Coşkun Dönge',
      postTitle: 'Mahallede yeni oyun parkı açıldı',
      text: 'Harika bir proje! Çocuklar çok sevinecek. Katılımınız için teşekkürler.',
      likes: 12,
      time: '3 gün',
    },
    {
      id: '2',
      author: 'Coşkun Dönge',
      postTitle: 'Komşu dayanışması - elektrik kesintisi',
      text: 'Yaşlı komşularımıza yardım ettik. Hep böyle dayanışmada olmak gerekir.',
      likes: 34,
      time: '5 gün',
    },
    {
      id: '3',
      author: 'Coşkun Dönge',
      postTitle: 'Bisiklet turuna katılacak mı?',
      text: 'Kesinlikle! Sabah saat 9\'da nerede toplanıyoruz?',
      likes: 8,
      time: '7 gün',
    },
    {
      id: '4',
      author: 'Coşkun Dönge',
      postTitle: 'İkinci el mobilya alış-satış',
      text: 'Çok iyi bir fiyatla buldum. Kalitesi ise harika, kesinlikle tavsiye ederim.',
      likes: 15,
      time: '10 gün',
    },
    {
      id: '5',
      author: 'Coşkun Dönge',
      postTitle: 'Mahalle güvenliği hakkında tartışma',
      text: 'Güvenlik kamerası sistemini geliştirmek için komşularımızla konuştuk.',
      likes: 22,
      time: '14 gün',
    },
  ],
  recommendations: [
    {
      id: '1',
      business: 'Moda Kahvesi',
      category: 'Kahvehane',
      description: 'Harika kahvesi ve sıcak ortamı ile mahalle\'nin en güzel kahvesi. Sahipleri çok misafirperver.',
      rating: 5,
    },
    {
      id: '2',
      business: 'Elif Pazarlaması',
      category: 'Market',
      description: 'Çok taze ve kaliteli ürünleri var. Fiyatları makul ve kasa hattı hızlı.',
      rating: 4.5,
    },
    {
      id: '3',
      business: 'Spor Merkezi Kadıköy',
      category: 'Spor Tesisi',
      description: 'Modern ekipmanları ve deneyimli antrenörleriyle tavsiye ediyorum. Üyelik fiyatları ise çok uygun.',
      rating: 4.8,
    },
  ],
  neighbors: [
    { id: '1', name: 'Ayşe Yılmaz', initials: 'AY' },
    { id: '2', name: 'Mehmet Kara', initials: 'MK' },
    { id: '3', name: 'Zeynep Çelik', initials: 'ZÇ' },
    { id: '4', name: 'Ali Demir', initials: 'AD' },
    { id: '5', name: 'Fatma Şahin', initials: 'FŞ' },
    { id: '6', name: 'Can Özer', initials: 'CÖ' },
  ],
};

const tabs = [
  { id: 'posts', label: 'Gönderiler' },
  { id: 'recommendations', label: 'Öneriler' },
  { id: 'marketplace', label: 'Pazar Yeri İlanları' },
  { id: 'groups', label: 'Gruplar' },
];

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('posts');
  const isOwnProfile = params.id === 'me';

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Cover Image with Enhanced Gradient Overlay */}
      <div className="relative h-56 bg-gradient-to-b from-[#00833e] to-[#006b32] overflow-hidden">
        <img
          src={mockProfile.coverImage}
          alt="Profil Kapağı"
          className="w-full h-full object-cover"
        />
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 -mt-28 relative z-10 mb-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left/Full */}
          <div className="lg:col-span-2">
            {/* Header Card with Badges */}
            <div className="bg-white rounded-xl shadow-lg border border-[#e0e0e0] p-6 mb-6 card-hover">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-6">
                {/* Avatar */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-[#00833e] to-[#006b32] rounded-xl flex items-center justify-center text-white text-4xl sm:text-5xl font-bold border-4 border-white shadow-xl flex-shrink-0">
                  {mockProfile.initials}
                </div>

                {/* Profile Info and Badges */}
                <div className="flex-1">
                  <div className="mb-3">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#333] mb-2">{mockProfile.name}</h1>
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {mockProfile.badges.map((badge) => (
                        <div
                          key={badge.id}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#00833e]/10 to-[#006b32]/10 rounded-full border border-[#00833e]/30"
                        >
                          {badge.icon === 'helper' && <Award size={14} className="text-[#00833e]" />}
                          {badge.icon === 'active' && <Zap size={14} className="text-[#00833e]" />}
                          {badge.icon === 'trusted' && <Shield size={14} className="text-[#00833e]" />}
                          <span className="text-xs font-medium text-[#006b32]">{badge.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-row gap-2">
                      {isOwnProfile ? (
                        <Link
                          href="/ayarlar"
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#00833e] hover:bg-[#006b32] text-white font-medium rounded-lg transition-all card-hover"
                        >
                          <Edit size={16} />
                          Profili Düzenle
                        </Link>
                      ) : (
                        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-[#00833e] text-[#00833e] hover:bg-[#00833e]/5 font-medium rounded-lg transition-all card-hover text-sm">
                          <UserPlus size={16} />
                          Komşu Ekle
                        </button>
                      )}
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
              </div>

              {/* Bio Section */}
              <div className="border-t border-[#e0e0e0] pt-4">
                <p className="text-[#404040] text-sm leading-relaxed">{mockProfile.bio}</p>
              </div>
            </div>

            {/* Address Verification Status */}
            <div className="mb-6">
              <AddressVerificationStatus status="unverified" daysRemaining={27} />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 text-center card-hover">
                <p className="text-2xl font-bold text-[#00833e]">{mockProfile.stats.posts}</p>
                <p className="text-xs text-[#8f8f8f] mt-1 font-medium">Gönderi</p>
              </div>
              <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 text-center card-hover">
                <p className="text-2xl font-bold text-[#00833e]">{mockProfile.stats.helps}</p>
                <p className="text-xs text-[#8f8f8f] mt-1 font-medium">Yardım</p>
              </div>
              <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 text-center card-hover">
                <p className="text-2xl font-bold text-[#00833e]">{mockProfile.stats.neighbors}</p>
                <p className="text-xs text-[#8f8f8f] mt-1 font-medium">Komşu</p>
              </div>
              <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 text-center card-hover">
                <p className="text-2xl font-bold text-[#f39c12]">4.9</p>
                <p className="text-xs text-[#8f8f8f] mt-1 font-medium">Puan</p>
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

                {/* Marketplace Tab */}
                {activeTab === 'marketplace' && (
                  <div className="divide-y divide-[#e0e0e0]">
                    <div className="p-8 text-center">
                      <MessageSquare size={32} className="mx-auto text-[#e0e0e0] mb-2" />
                      <p className="text-[#8f8f8f]">Henüz pazar yeri ilanı yok</p>
                    </div>
                  </div>
                )}

                {/* Groups Tab */}
                {activeTab === 'groups' && (
                  <div className="divide-y divide-[#e0e0e0]">
                    <div className="p-8 text-center">
                      <Users size={32} className="mx-auto text-[#e0e0e0] mb-2" />
                      <p className="text-[#8f8f8f]">Henüz grup üyeliği yok</p>
                    </div>
                  </div>
                )}

                {/* Recommendations Tab */}
                {activeTab === 'recommendations' && (
                  <div className="p-4 space-y-3">
                    {mockProfile.recommendations.length === 0 ? (
                      <div className="p-8 text-center">
                        <Star size={32} className="mx-auto text-[#e0e0e0] mb-2" />
                        <p className="text-[#8f8f8f]">Henüz öneri yok</p>
                      </div>
                    ) : (
                      mockProfile.recommendations.map((rec) => (
                        <div key={rec.id} className="p-4 border border-[#e0e0e0] rounded-lg card-hover hover:border-[#00833e] hover:shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#00833e] to-[#006b32] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                              <Star size={18} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-1">
                                <div>
                                  <h4 className="font-medium text-[#333] text-sm">{rec.business}</h4>
                                  <p className="text-xs text-[#8f8f8f] mt-0.5">{rec.category}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={12}
                                      className={i < Math.floor(rec.rating) ? 'fill-[#f39c12] text-[#f39c12]' : 'text-[#e0e0e0]'}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs text-[#404040] mt-2 leading-relaxed">{rec.description}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Sidebar - Right */}
          <div className="lg:col-span-1 space-y-6">
            {/* Neighbors Card */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden shadow-sm card-hover">
              <div className="px-4 py-4 border-b border-[#e0e0e0]">
                <h3 className="text-sm font-bold text-[#333] flex items-center gap-2">
                  <Users size={16} className="text-[#00833e]" />
                  Komşular
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {mockProfile.neighbors.map((neighbor) => (
                  <div key={neighbor.id} className="flex items-center gap-3 hover:bg-[#f0f2f5] p-2 rounded transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#00833e] to-[#006b32] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {neighbor.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#333] truncate">{neighbor.name}</p>
                    </div>
                  </div>
                ))}
                <button className="w-full mt-3 py-2 text-sm font-medium text-[#00833e] border border-[#00833e] rounded hover:bg-[#00833e]/5 transition-colors">
                  Tümünü Gör
                </button>
              </div>
            </div>

            {/* Badges Card */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden shadow-sm card-hover">
              <div className="px-4 py-4 border-b border-[#e0e0e0]">
                <h3 className="text-sm font-bold text-[#333] flex items-center gap-2">
                  <Award size={16} className="text-[#00833e]" />
                  Rozetler
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="p-3 bg-gradient-to-r from-[#ffd700]/10 to-[#ffed4e]/10 rounded-lg border border-[#ffd700]/20 hover:border-[#ffd700]/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <Award size={20} className="text-[#ffd700] flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#333]">Yardımsever</p>
                      <p className="text-xs text-[#8f8f8f] mt-1">5+ kişiye yardımcı oldu</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-[#00833e]/10 to-[#006b32]/10 rounded-lg border border-[#00833e]/20 hover:border-[#00833e]/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <Zap size={20} className="text-[#00833e] flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#333]">Aktif Komşu</p>
                      <p className="text-xs text-[#8f8f8f] mt-1">10+ etkinliğe katıldı</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-[#e74c3c]/10 to-[#c0392b]/10 rounded-lg border border-[#e74c3c]/20 hover:border-[#e74c3c]/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <Shield size={20} className="text-[#e74c3c] flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#333]">Güvenilir Satıcı</p>
                      <p className="text-xs text-[#8f8f8f] mt-1">20+ başarılı işlem</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Neighborhood Info Card */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden shadow-sm card-hover">
              <div className="px-4 py-4 border-b border-[#e0e0e0]">
                <h3 className="text-sm font-bold text-[#333] flex items-center gap-2">
                  <MapPin size={16} className="text-[#00833e]" />
                  Mahalle Bilgisi
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs font-medium text-[#8f8f8f] mb-1">Bölge</p>
                  <p className="text-sm font-medium text-[#333]">{mockProfile.neighborhood}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#8f8f8f] mb-1">Mahalle Nüfusu</p>
                  <p className="text-sm font-medium text-[#333]">2.500+ komşu</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#8f8f8f] mb-1">Etkinlikler</p>
                  <p className="text-sm font-medium text-[#333]">Ayda 8-10 etkinlik</p>
                </div>
                <button className="w-full mt-2 py-2 text-sm font-medium text-[#00833e] border border-[#00833e] rounded hover:bg-[#00833e]/5 transition-colors">
                  Mahalle Sayfası
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
