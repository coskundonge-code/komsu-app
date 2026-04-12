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
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, use, useRef } from 'react';
import { cn } from '@/lib/utils';
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images';
import { AddressVerificationStatus } from '@/components/verification/address-verification-status';
import { useCurrentUser } from '@/lib/hooks/use-auth';
import { getFullProfile } from '@/lib/hooks/use-profile';

// Badge icon/color mapping
const badgeStyles: Record<string, { icon: typeof Award; color: string; bgFrom: string; bgTo: string; borderColor: string }> = {
  helper: { icon: Award, color: '#ffd700', bgFrom: '#ffd700', bgTo: '#ffed4e', borderColor: '#ffd700' },
  active: { icon: Zap, color: '#00833e', bgFrom: '#00833e', bgTo: '#006b32', borderColor: '#00833e' },
  trusted: { icon: Shield, color: '#e74c3c', bgFrom: '#e74c3c', bgTo: '#c0392b', borderColor: '#e74c3c' },
  verified: { icon: CheckCircle, color: '#00833e', bgFrom: '#00833e', bgTo: '#006b32', borderColor: '#00833e' },
  leader: { icon: TrendingUp, color: '#3498db', bgFrom: '#3498db', bgTo: '#2980b9', borderColor: '#3498db' },
};

// Fallback mock data for things not yet in DB
const mockRecentPosts = [
  {
    id: '1',
    author: 'CoÅkun DÃ¶nge',
    text: 'Gelecek cumartesi yine mahalle kahvaltÄ±sÄ± yapacaÄÄ±z! Herkes katÄ±lmaya davetli ð',
    likes: 45,
    comments: 12,
    time: '2 gÃ¼n',
  },
  {
    id: '2',
    author: 'CoÅkun DÃ¶nge',
    text: 'Mahallede yeni bir spor kulÃ¼bÃ¼ kuruyoruz. Futbol ve voleybol turnuvalarÄ± dÃ¼zenlenecek!',
    likes: 67,
    comments: 23,
    time: '5 gÃ¼n',
  },
  {
    id: '3',
    author: 'CoÅkun DÃ¶nge',
    text: 'KÃ¼tÃ¼phanede edebiyat klasikleri tartÄ±ÅmasÄ± yapacaÄÄ±z. "Araba SevdasÄ±" hakkÄ±nda konuÅacaÄÄ±z.',
    likes: 34,
    comments: 15,
    time: '8 gÃ¼n',
  },
  {
    id: '4',
    author: 'CoÅkun DÃ¶nge',
    text: 'Yeni kitap Ã¶nerileriniz var mÄ±? Åu sÄ±ralar yazÄ±mda yoÄunlaÅmaya baÅladÄ±ÄÄ±m dÃ¶nemler hakkÄ±nda okuduÄumuz mÃ¼zayaka var.',
    likes: 28,
    comments: 8,
    time: '12 gÃ¼n',
  },
  {
    id: '5',
    author: 'CoÅkun DÃ¶nge',
    text: 'Mahalle pikniÄi Ã§ok gÃ¼zel geÃ§ti! KatÄ±lan herkese teÅekkÃ¼rler. ÃnÃ¼mÃ¼zdeki ay yine buluÅalÄ±m.',
    likes: 56,
    comments: 19,
    time: '15 gÃ¼n',
  },
];

const mockRecommendations = [
  {
    id: '1',
    business: 'Moda Kahvesi',
    category: 'Kahvehane',
    description: 'Harika kahvesi ve sÄ±cak ortamÄ± ile mahalle\'nin en gÃ¼zel kahvesi. Sahipleri Ã§ok misafirperver.',
    rating: 5,
  },
  {
    id: '2',
    business: 'Elif PazarlamasÄ±',
    category: 'Market',
    description: 'Ãok taze ve kaliteli Ã¼rÃ¼nleri var. FiyatlarÄ± makul ve kasa hattÄ± hÄ±zlÄ±.',
    rating: 4.5,
  },
  {
    id: '3',
    business: 'Spor Merkezi KadÄ±kÃ¶y',
    category: 'Spor Tesisi',
    description: 'Modern ekipmanlarÄ± ve deneyimli antrenÃ¶rleriyle tavsiye ediyorum. Ãyelik fiyatlarÄ± ise Ã§ok uygun.',
    rating: 4.8,
  },
];

const mockNeighbors = [
  { id: '1', name: 'AyÅe YÄ±lmaz', initials: 'AY' },
  { id: '2', name: 'Mehmet Kara', initials: 'MK' },
  { id: '3', name: 'Zeynep Ãelik', initials: 'ZÃ' },
  { id: '4', name: 'Ali Demir', initials: 'AD' },
  { id: '5', name: 'Fatma Åahin', initials: 'FÅ' },
  { id: '6', name: 'Can Ãzer', initials: 'CÃ' },
];

const tabs = [
  { id: 'posts', label: 'GÃ¶nderiler' },
  { id: 'recommendations', label: 'Ãneriler' },
  { id: 'marketplace', label: 'Pazar Yeri Ä°lanlarÄ±' },
  { id: 'groups', label: 'Gruplar' },
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n.charAt(0).toUpperCase())
    .join('');
}

function formatJoinDate(dateStr: string): string {
  const date = new Date(dateStr);
  const months = [
    'Ocak', 'Åubat', 'Mart', 'Nisan', 'MayÄ±s', 'Haziran',
    'Temmuz', 'AÄustos', 'EylÃ¼l', 'Ekim', 'KasÄ±m', 'AralÄ±k',
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState('posts');
  const { user, loading: authLoading } = useCurrentUser();
  const fetchedRef = useRef<string | null>(null);

  // Profile data from Supabase
  const [profileData, setProfileData] = useState<any>(null);
  const [addressData, setAddressData] = useState<any>(null);
  const [badgesData, setBadgesData] = useState<any[]>([]);
  const [postsData, setPostsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = id === 'me' || (user && id === user.id);
  const targetUserId = id === 'me' ? user?.id : id;

  useEffect(() => {
    async function fetchProfile() {
      if (!targetUserId || fetchedRef.current === targetUserId) return;
      fetchedRef.current = targetUserId;
      setLoading(true);
      try {
        const result = await getFullProfile(targetUserId);
        if (result.profile) setProfileData(result.profile);
        if (result.address) setAddressData(result.address);
        if (result.badges) setBadgesData(result.badges);
        if (result.posts) setPostsData(result.posts);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
      setLoading(false);
    }
    if (!authLoading) {
      fetchProfile();
    }
  }, [targetUserId, authLoading]);

  // Derived display values (real data with fallbacks)
  const displayName = profileData?.full_name || 'KullanÄ±cÄ±';
  const displayInitials = getInitials(displayName);
  const displayBio = profileData?.bio || '';
  const displayNeighborhood = addressData
    ? `${addressData.district}, ${addressData.city}`
    : profileData?.user_addresses?.[0]
      ? `${profileData.user_addresses[0].district}, ${profileData.user_addresses[0].city}`
      : '';
  const displayJoinDate = profileData?.created_at
    ? formatJoinDate(profileData.created_at)
    : '';
  const displayAvatar = profileData?.avatar_url || getFeedImageUrl(78, 200, 200);

  // Badges from DB
  const displayBadges = badgesData.map((ub: any) => ({
    id: ub.badges?.id || ub.badge_id,
    label: ub.badges?.label || '',
    description: ub.badges?.description || '',
    icon: ub.badges?.icon || 'helper',
    color: ub.badges?.color || '#00833e',
    earnedAt: ub.earned_at,
  }));

  // Stats - from real data where possible, mock for rest
  const displayStats = {
    posts: postsData.length || 45,
    helps: 128,
    neighbors: 89,
  };

  // Posts for display (real DB posts or fallback to mock)
  const displayPosts = postsData.length > 0
    ? postsData.map((p: any) => ({
        id: p.id,
        author: displayName,
        text: p.body || p.title || '',
        likes: 0,
        comments: 0,
        time: new Date(p.created_at).toLocaleDateString('tr-TR'),
      }))
    : mockRecentPosts;

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#00833e]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Cover Image with Enhanced Gradient Overlay */}
      <div className="relative h-56 bg-gradient-to-b from-[#00833e] to-[#006b32] overflow-hidden">
        <img
          src={getFeedImageUrl(78, 1200, 400)}
          alt="Profil KapaÄÄ±"
          className="w-full h-full object-cover"
        />
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
                  {displayInitials}
                </div>

                {/* Profile Info and Badges */}
                <div className="flex-1">
                  <div className="mb-3">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#333] mb-2">{displayName}</h1>
                    {/* Badges from DB */}
                    {displayBadges.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {displayBadges.map((badge) => {
                          const style = badgeStyles[badge.icon] || badgeStyles.helper;
                          const IconComponent = style.icon;
                          return (
                            <div
                              key={badge.id}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#00833e]/10 to-[#006b32]/10 rounded-full border border-[#00833e]/30"
                            >
                              <IconComponent size={14} className="text-[#00833e]" />
                              <span className="text-xs font-medium text-[#006b32]">{badge.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-row gap-2">
                      {isOwnProfile ? (
                        <Link
                          href="/ayarlar"
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#00833e] hover:bg-[#006b32] text-white font-medium rounded-lg transition-all card-hover"
                        >
                          <Edit size={16} />
                          Profili DÃ¼zenle
                        </Link>
                      ) : (
                        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-[#00833e] text-[#00833e] hover:bg-[#00833e]/5 font-medium rounded-lg transition-all card-hover text-sm">
                          <UserPlus size={16} />
                          KomÅu Ekle
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Location and Join Date */}
                  <div className="space-y-1">
                    {displayNeighborhood && (
                      <div className="flex items-center gap-2 text-[#8f8f8f]">
                        <MapPin size={16} className="text-[#00833e]" />
                        <span className="text-sm">{displayNeighborhood}</span>
                      </div>
                    )}
                    {displayJoinDate && (
                      <div className="flex items-center gap-2 text-[#8f8f8f]">
                        <Calendar size={16} className="text-[#00833e]" />
                        <span className="text-sm">{displayJoinDate} tarihinde katÄ±ldÄ±</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              {displayBio && (
                <div className="border-t border-[#e0e0e0] pt-4">
                  <p className="text-[#404040] text-sm leading-relaxed">{displayBio}</p>
                </div>
              )}
            </div>

            {/* Address Verification Status */}
            {isOwnProfile && (
              <div className="mb-6">
                <AddressVerificationStatus
                  status={addressData?.verified_at ? 'verified' : 'unverified'}
                  daysRemaining={27}
                />
              </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 text-center card-hover">
                <p className="text-2xl font-bold text-[#00833e]">{displayStats.posts}</p>
                <p className="text-xs text-[#8f8f8f] mt-1 font-medium">GÃ¶nderi</p>
              </div>
              <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 text-center card-hover">
                <p className="text-2xl font-bold text-[#00833e]">{displayStats.helps}</p>
                <p className="text-xs text-[#8f8f8f] mt-1 font-medium">YardÄ±m</p>
              </div>
              <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 text-center card-hover">
                <p className="text-2xl font-bold text-[#00833e]">{displayStats.neighbors}</p>
                <p className="text-xs text-[#8f8f8f] mt-1 font-medium">KomÅu</p>
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
                    {displayPosts.length === 0 ? (
                      <div className="p-8 text-center">
                        <p className="text-[#8f8f8f]">HenÃ¼z gÃ¶nderi yok</p>
                      </div>
                    ) : (
                      displayPosts.map((post) => (
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
                      <p className="text-[#8f8f8f]">HenÃ¼z pazar yeri ilanÄ± yok</p>
                    </div>
                  </div>
                )}

                {/* Groups Tab */}
                {activeTab === 'groups' && (
                  <div className="divide-y divide-[#e0e0e0]">
                    <div className="p-8 text-center">
                      <Users size={32} className="mx-auto text-[#e0e0e0] mb-2" />
                      <p className="text-[#8f8f8f]">HenÃ¼z grup Ã¼yeliÄi yok</p>
                    </div>
                  </div>
                )}

                {/* Recommendations Tab */}
                {activeTab === 'recommendations' && (
                  <div className="p-4 space-y-3">
                    {mockRecommendations.length === 0 ? (
                      <div className="p-8 text-center">
                        <Star size={32} className="mx-auto text-[#e0e0e0] mb-2" />
                        <p className="text-[#8f8f8f]">HenÃ¼z Ã¶neri yok</p>
                      </div>
                    ) : (
                      mockRecommendations.map((rec) => (
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
                  KomÅular
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {mockNeighbors.map((neighbor) => (
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
                  TÃ¼mÃ¼nÃ¼ GÃ¶r
                </button>
              </div>
            </div>

            {/* Badges Card - from DB */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden shadow-sm card-hover">
              <div className="px-4 py-4 border-b border-[#e0e0e0]">
                <h3 className="text-sm font-bold text-[#333] flex items-center gap-2">
                  <Award size={16} className="text-[#00833e]" />
                  Rozetler
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {displayBadges.length === 0 ? (
                  <div className="p-4 text-center">
                    <Award size={32} className="mx-auto text-[#e0e0e0] mb-2" />
                    <p className="text-xs text-[#8f8f8f]">HenÃ¼z rozet kazanÄ±lmadÄ±</p>
                  </div>
                ) : (
                  displayBadges.map((badge) => {
                    const style = badgeStyles[badge.icon] || badgeStyles.helper;
                    const IconComponent = style.icon;
                    return (
                      <div
                        key={badge.id}
                        className={`p-3 bg-gradient-to-r from-[${style.bgFrom}]/10 to-[${style.bgTo}]/10 rounded-lg border border-[${style.borderColor}]/20 hover:border-[${style.borderColor}]/40 transition-colors`}
                        style={{
                          background: `linear-gradient(to right, ${style.bgFrom}1a, ${style.bgTo}1a)`,
                          borderColor: `${style.borderColor}33`,
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <IconComponent size={20} style={{ color: style.color }} className="flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-[#333]">{badge.label}</p>
                            <p className="text-xs text-[#8f8f8f] mt-1">{badge.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Neighborhood Info Card - from DB */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden shadow-sm card-hover">
              <div className="px-4 py-4 border-b border-[#e0e0e0]">
                <h3 className="text-sm font-bold text-[#333] flex items-center gap-2">
                  <MapPin size={16} className="text-[#00833e]" />
                  Mahalle Bilgisi
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs font-medium text-[#8f8f8f] mb-1">BÃ¶lge</p>
                  <p className="text-sm font-medium text-[#333]">{displayNeighborhood || 'BelirtilmemiÅ'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#8f8f8f] mb-1">Mahalle NÃ¼fusu</p>
                  <p className="text-sm font-medium text-[#333]">2.500+ komÅu</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#8f8f8f] mb-1">Etkinlikler</p>
                  <p className="text-sm font-medium text-[#333]">Ayda 8-10 etkinlik</p>
                </div>
                <button className="w-full mt-2 py-2 text-sm font-medium text-[#00833e] border border-[#00833e] rounded hover:bg-[#00833e]/5 transition-colors">
                  Mahalle SayfasÄ±
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
