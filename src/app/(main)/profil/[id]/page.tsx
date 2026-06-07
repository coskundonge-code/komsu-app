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
  ShoppingBag,
  Award,
  Zap,
  TrendingUp,
  Tag,
  Loader2,
  Flag,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, use, useRef } from 'react';
import { cn } from '@/lib/utils';
import { AddressVerificationStatus } from '@/components/verification/address-verification-status';
import { ReportModal } from '@/components/shared/report-modal';
import { useCurrentUser } from '@/lib/hooks/use-auth';
import { getFullProfile } from '@/lib/hooks/use-profile';
import { getUserGroups } from '@/lib/hooks/use-groups-businesses';

// NOT (2026-06-07): Bu sayfa eskiden çok sayıda uydurma veri gösteriyordu:
// mockRecentPosts (gerçek gönderi yoksa sahte "Coşkun Dönge" gönderileri),
// mockRecommendations (hep basılan 3 sahte işletme önerisi), mockNeighbors
// (6 sahte komşu), sahte istatistikler (45 gönderi / 128 yardım / 89 komşu /
// 4.9 puan), demo kapak görseli (getFeedImageUrl) ve "Mahalle Nüfusu 2.500+ /
// Ayda 8-10 etkinlik" gibi uydurma kutular. Takip (follows) tablosu olmadığı
// için "Komşu Ekle" butonu da işlevsizdi. Artık yalnızca gerçek veriye bağlı:
// gönderiler, pazar ilanları, grup üyelikleri, rozetler ve gerçek istatistikler.
// Backing'i olmayan her şey kaldırıldı. Bkz. TECH_DEBT #12.

const badgeStyles: Record<string, { icon: typeof Award; color: string }> = {
  helper: { icon: Award, color: '#ffd700' },
  active: { icon: Zap, color: '#00833e' },
  trusted: { icon: Shield, color: '#e74c3c' },
  verified: { icon: CheckCircle, color: '#00833e' },
  leader: { icon: TrendingUp, color: '#3498db' },
};

const tabs = [
  { id: 'posts', label: 'Gönderiler' },
  { id: 'marketplace', label: 'Pazar Yeri İlanları' },
  { id: 'groups', label: 'Gruplar' },
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}

function formatJoinDate(dateStr: string): string {
  const date = new Date(dateStr);
  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatShortDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('tr-TR');
}

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState('posts');
  const { user, loading: authLoading } = useCurrentUser();
  const fetchedRef = useRef<string | null>(null);

  const [profileData, setProfileData] = useState<any>(null);
  const [addressData, setAddressData] = useState<any>(null);
  const [badgesData, setBadgesData] = useState<any[]>([]);
  const [postsData, setPostsData] = useState<any[]>([]);
  const [listingsData, setListingsData] = useState<any[]>([]);
  const [groupsData, setGroupsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);

  const isOwnProfile = id === 'me' || (user && id === user.id);
  const targetUserId = id === 'me' ? user?.id : id;

  useEffect(() => {
    async function fetchProfile() {
      if (!targetUserId || fetchedRef.current === targetUserId) return;
      fetchedRef.current = targetUserId;
      setLoading(true);
      try {
        const [result, groupsRes] = await Promise.all([
          getFullProfile(targetUserId),
          getUserGroups(targetUserId),
        ]);
        if (result.profile) setProfileData(result.profile);
        if (result.address) setAddressData(result.address);
        if (result.badges) setBadgesData(result.badges);
        if (result.posts) setPostsData(result.posts);
        if (result.listings) setListingsData(result.listings);
        const groups = ((groupsRes.data as any[]) || [])
          .map((row: any) => row.groups)
          .filter(Boolean);
        setGroupsData(groups);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
      setLoading(false);
    }
    if (!authLoading) {
      fetchProfile();
    }
  }, [targetUserId, authLoading]);

  // Türetilmiş görüntü değerleri — yalnızca gerçek veri.
  const displayName = profileData?.full_name || 'Kullanıcı';
  const displayInitials = getInitials(displayName);
  const displayBio = profileData?.bio || '';
  const displayNeighborhood = addressData?.neighborhoods
    ? `${addressData.neighborhoods.district}, ${addressData.neighborhoods.city}`
    : profileData?.location_district && profileData?.location_province
      ? `${profileData.location_district}, ${profileData.location_province}`
      : '';
  const displayJoinDate = profileData?.created_at ? formatJoinDate(profileData.created_at) : '';

  // Rozetler — DB'den.
  const displayBadges = badgesData.map((ub: any) => ({
    id: ub.badges?.id || ub.badge_id,
    label: ub.badges?.label || ub.badges?.name || '',
    description: ub.badges?.description || '',
    icon: ub.badges?.icon || 'helper',
  }));

  // Gerçek istatistikler — uydurma yok.
  const displayStats = [
    { label: 'Gönderi', value: postsData.length },
    { label: 'İlan', value: listingsData.length },
    { label: 'Grup', value: groupsData.length },
    { label: 'Rozet', value: displayBadges.length },
  ];

  // Gerçek adres/e-Devlet doğrulama durumu (uydurma "27 gün" yerine).
  const verifyStatus: 'verified' | 'locked' | 'unverified' = profileData?.edevlet_verified_at
    ? 'verified'
    : profileData?.account_locked
      ? 'locked'
      : 'unverified';
  const verifyDaysRemaining = profileData?.edevlet_verification_deadline
    ? Math.max(0, Math.ceil((new Date(profileData.edevlet_verification_deadline).getTime() - Date.now()) / 86400000))
    : 0;

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#00833e]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Kapak — degrade (kullanıcı kapağı yükleme altyapısı yok) */}
      <div className="relative h-40 bg-gradient-to-b from-[#00833e] to-[#006b32] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol/Ana sütun */}
          <div className="lg:col-span-2">
            {/* Başlık kartı */}
            <div className="bg-white rounded-xl shadow-lg border border-[#e0e0e0] p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-6">
                <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-[#00833e] to-[#006b32] rounded-xl flex items-center justify-center text-white text-4xl sm:text-5xl font-bold border-4 border-white shadow-xl flex-shrink-0">
                  {displayInitials}
                </div>

                <div className="flex-1">
                  <div className="mb-3">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#333] mb-2">{displayName}</h1>

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

                    {/* Yalnızca kendi profilinde düzenleme butonu. "Komşu Ekle"
                        takip altyapısı (follows tablosu) olmadığı için kaldırıldı. */}
                    {isOwnProfile ? (
                      <div className="flex flex-row gap-2">
                        <Link
                          href="/ayarlar"
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#00833e] hover:bg-[#006b32] text-white font-medium rounded-lg transition-all"
                        >
                          <Edit size={16} />
                          Profili Düzenle
                        </Link>
                      </div>
                    ) : (
                      <div className="flex flex-row gap-2">
                        <button
                          onClick={() => setReportOpen(true)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-[#e0e0e0] text-[#8f8f8f] hover:text-red-500 hover:border-red-300 font-medium rounded-lg transition-all"
                        >
                          <Flag size={16} />
                          Şikâyet Et
                        </button>
                      </div>
                    )}
                  </div>

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
                        <span className="text-sm">{displayJoinDate} tarihinde katıldı</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {displayBio && (
                <div className="border-t border-[#e0e0e0] pt-4">
                  <p className="text-[#404040] text-sm leading-relaxed">{displayBio}</p>
                </div>
              )}
            </div>

            {/* Adres doğrulama durumu — gerçek e-Devlet alanlarından */}
            {isOwnProfile && (
              <div className="mb-6">
                <AddressVerificationStatus status={verifyStatus} daysRemaining={verifyDaysRemaining} />
              </div>
            )}

            {/* İstatistikler — gerçek sayılar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {displayStats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-lg border border-[#e0e0e0] p-4 text-center">
                  <p className="text-2xl font-bold text-[#00833e]">{stat.value}</p>
                  <p className="text-xs text-[#8f8f8f] mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Sekmeler */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden shadow-sm">
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

              <div className="p-0">
                {/* Gönderiler */}
                {activeTab === 'posts' && (
                  <div className="divide-y divide-[#e0e0e0]">
                    {postsData.length === 0 ? (
                      <div className="p-8 text-center">
                        <MessageCircle size={32} className="mx-auto text-[#e0e0e0] mb-2" />
                        <p className="text-[#8f8f8f]">Henüz gönderi yok</p>
                      </div>
                    ) : (
                      postsData.map((post: any) => (
                        <Link
                          key={post.id}
                          href={`/gonderi/${post.id}`}
                          className="block p-5 hover:bg-[#f0f2f5] transition-colors border-l-4 border-transparent hover:border-[#00833e]"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              {post.title && <p className="text-[#333] text-sm font-semibold mb-1">{post.title}</p>}
                              <p className="text-[#404040] text-sm leading-relaxed line-clamp-3">{post.body}</p>
                            </div>
                            <span className="text-xs text-[#8f8f8f] font-medium whitespace-nowrap ml-2">{formatShortDate(post.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-6 text-xs text-[#8f8f8f] pt-3 border-t border-[#e0e0e0]">
                            <span className="flex items-center gap-1.5">
                              <Heart size={16} className="text-[#e74c3c]" />
                              <span className="font-medium">{post.reaction_count || 0}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MessageCircle size={16} />
                              <span className="font-medium">{post.comment_count || 0}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Share2 size={16} />
                            </span>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                )}

                {/* Pazar Yeri İlanları — gerçek listings */}
                {activeTab === 'marketplace' && (
                  <div className="divide-y divide-[#e0e0e0]">
                    {listingsData.length === 0 ? (
                      <div className="p-8 text-center">
                        <ShoppingBag size={32} className="mx-auto text-[#e0e0e0] mb-2" />
                        <p className="text-[#8f8f8f]">Henüz pazar yeri ilanı yok</p>
                      </div>
                    ) : (
                      listingsData.map((listing: any) => (
                        <Link
                          key={listing.id}
                          href={`/pazar/ilan/${listing.id}`}
                          className="flex items-center gap-3 p-4 hover:bg-[#f0f2f5] transition-colors"
                        >
                          <div className="w-16 h-16 rounded-lg bg-[#e6f4ec] flex items-center justify-center overflow-hidden flex-shrink-0">
                            {listing.media_urls?.[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={listing.media_urls[0]} alt={listing.title} className="w-full h-full object-cover" />
                            ) : (
                              <ShoppingBag size={22} className="text-[#00833e]" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#333] truncate">{listing.title}</p>
                            {listing.listing_categories?.name && (
                              <p className="text-xs text-[#8f8f8f] mt-0.5">{listing.listing_categories.name}</p>
                            )}
                          </div>
                          <div className="text-sm font-bold text-[#00833e] whitespace-nowrap">
                            {listing.price != null ? `${Number(listing.price).toLocaleString('tr-TR')} ${listing.currency || '₺'}` : ''}
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                )}

                {/* Gruplar — gerçek üyelikler */}
                {activeTab === 'groups' && (
                  <div className="divide-y divide-[#e0e0e0]">
                    {groupsData.length === 0 ? (
                      <div className="p-8 text-center">
                        <Users size={32} className="mx-auto text-[#e0e0e0] mb-2" />
                        <p className="text-[#8f8f8f]">Henüz grup üyeliği yok</p>
                      </div>
                    ) : (
                      groupsData.map((group: any) => (
                        <Link
                          key={group.id}
                          href={`/gruplar/${group.slug || group.id}`}
                          className="flex items-center gap-3 p-4 hover:bg-[#f0f2f5] transition-colors"
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00833e] to-[#006b32] flex items-center justify-center text-white font-bold flex-shrink-0">
                            {(group.name || 'G').charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#333] truncate">{group.name}</p>
                            <p className="text-xs text-[#8f8f8f] mt-0.5 flex items-center gap-2">
                              {group.category && <span className="flex items-center gap-1"><Tag size={12} />{group.category}</span>}
                              <span className="flex items-center gap-1"><Users size={12} />{group.member_count || 0}</span>
                            </p>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sağ kenar çubuğu */}
          <div className="lg:col-span-1 space-y-6">
            {/* Rozetler — DB'den */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden shadow-sm">
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
                    <p className="text-xs text-[#8f8f8f]">Henüz rozet kazanılmadı</p>
                  </div>
                ) : (
                  displayBadges.map((badge) => {
                    const style = badgeStyles[badge.icon] || badgeStyles.helper;
                    const IconComponent = style.icon;
                    return (
                      <div
                        key={badge.id}
                        className="p-3 rounded-lg border border-[#e0e0e0]"
                      >
                        <div className="flex items-start gap-3">
                          <IconComponent size={20} style={{ color: style.color }} className="flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-[#333]">{badge.label}</p>
                            {badge.description && <p className="text-xs text-[#8f8f8f] mt-1">{badge.description}</p>}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Mahalle bilgisi — yalnızca gerçek bölge */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden shadow-sm">
              <div className="px-4 py-4 border-b border-[#e0e0e0]">
                <h3 className="text-sm font-bold text-[#333] flex items-center gap-2">
                  <MapPin size={16} className="text-[#00833e]" />
                  Mahalle Bilgisi
                </h3>
              </div>
              <div className="p-4">
                <p className="text-xs font-medium text-[#8f8f8f] mb-1">Bölge</p>
                <p className="text-sm font-medium text-[#333]">{displayNeighborhood || 'Belirtilmemiş'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isOwnProfile && targetUserId && (
        <ReportModal
          isOpen={reportOpen}
          onClose={() => setReportOpen(false)}
          type="user"
          targetId={targetUserId}
        />
      )}
    </div>
  );
}
