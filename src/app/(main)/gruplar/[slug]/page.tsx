'use client';

import {
  ArrowLeft,
  Clock,
  Tag,
  Users,
  UserPlus,
  LogOut,
  Lock,
  Globe,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import {
  getGroupBySlug,
  getGroupMembers,
  getGroupPosts,
  getUserGroupIds,
  joinGroup,
  leaveGroup,
} from '@/lib/hooks/use-groups-businesses';
import { useCurrentUser } from '@/lib/hooks/use-auth';

// NOT (2026-06-07): Bu sayfa eskiden 857 satırlık tamamen sahte mockGroupDetail
// (uydurma üye/gönderi/etkinlik/medya/kural) gösteriyordu, DB'ye hiç sormuyordu
// ve params.slug'ı use() olmadan okuyordu. Artık gerçek `groups` + `group_members`
// (→profiles) + `group_posts` (→posts→profiles) verisine bağlı. group_posts'ta
// INSERT politikası olmadığı için istemci tarafı gönderi yazma KALDIRILDI (sahte
// kompozisyon kutusu yok); gönderiler salt-okunur ve dürüst boş durumlu. Medya/
// Etkinlik/Kural sekmeleri (backing tablo yok) kaldırıldı. Bkz. TECH_DEBT #12.

interface GroupRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  is_private: boolean | null;
  member_count: number | null;
  category: string | null;
  created_at: string | null;
  created_by: string | null;
}

interface ProfileLite {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface MemberRow {
  user_id: string;
  role: string | null;
  joined_at: string | null;
  profiles: ProfileLite | null;
}

interface PostRow {
  id: string;
  title: string | null;
  body: string;
  media_urls: string[] | null;
  created_at: string | null;
  comment_count: number | null;
  reaction_count: number | null;
  profiles: ProfileLite | null;
}

type TabType = 'posts' | 'members' | 'about';

function formatDate(value: string | null) {
  if (!value) return '';
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value));
}

function formatTimeAgo(value: string | null) {
  if (!value) return '';
  const now = Date.now();
  const then = new Date(value).getTime();
  const diffMins = Math.floor((now - then) / 60000);
  const diffHours = Math.floor((now - then) / 3600000);
  const diffDays = Math.floor((now - then) / 86400000);
  if (diffMins < 1) return 'Şimdi';
  if (diffMins < 60) return `${diffMins} dakika önce`;
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays < 7) return `${diffDays} gün önce`;
  return formatDate(value);
}

function Avatar({ profile, size = 40 }: { profile: ProfileLite | null; size?: number }) {
  const name = profile?.full_name || 'Üye';
  if (profile?.avatar_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={profile.avatar_url}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover border border-[#e0e0e0] flex-shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function GroupDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user } = useCurrentUser();

  const [group, setGroup] = useState<GroupRow | null>(null);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [isJoined, setIsJoined] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data: g } = await getGroupBySlug(slug);
      if (cancelled) return;
      if (!g) {
        setGroup(null);
        setLoading(false);
        return;
      }
      setGroup(g as GroupRow);
      const [{ data: m }, { data: p }] = await Promise.all([
        getGroupMembers((g as GroupRow).id),
        getGroupPosts((g as GroupRow).id),
      ]);
      if (cancelled) return;
      setMembers((m as MemberRow[]) || []);
      const postRows = ((p as any[]) || [])
        .map((r) => r.posts as PostRow)
        .filter(Boolean)
        .sort(
          (a, b) =>
            new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
      setPosts(postRows);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Gerçek üyelik durumu.
  useEffect(() => {
    if (!user || !group) {
      setIsJoined(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await getUserGroupIds(user.id);
      if (cancelled) return;
      const ids = ((data as { group_id: string }[]) || []).map((x) => x.group_id);
      setIsJoined(ids.includes(group.id));
    })();
    return () => {
      cancelled = true;
    };
  }, [user, group]);

  async function handleJoinLeave() {
    if (!user || !group) return;
    setJoinLoading(true);
    if (isJoined) {
      await leaveGroup(group.id, user.id);
      setIsJoined(false);
      setMembers((prev) => prev.filter((m) => m.user_id !== user.id));
    } else {
      await joinGroup(group.id, user.id);
      setIsJoined(true);
      const { data: m } = await getGroupMembers(group.id);
      setMembers((m as MemberRow[]) || []);
    }
    setJoinLoading(false);
  }

  // ----- Yükleniyor -----
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex flex-col items-center justify-center gap-3">
        <Loader2 size={36} className="text-primary animate-spin" />
        <p className="text-[#8f8f8f] text-sm">Grup yükleniyor…</p>
      </div>
    );
  }

  // ----- Grup bulunamadı -----
  if (!group) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#333] mb-4">Grup Bulunamadı</h1>
          <Link href="/gruplar" className="text-primary hover:text-primary-hover font-semibold">
            ← Gruplara Dön
          </Link>
        </div>
      </div>
    );
  }

  const memberCount = members.length;
  const isOwner = !!user && group.created_by === user.id;

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Back Button Bar */}
      <div className="bg-white border-b border-[#e0e0e0] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href="/gruplar"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Gruplara Geri Dön
          </Link>
        </div>
      </div>

      {/* Group Header */}
      <div className="relative bg-white border-b border-[#e0e0e0]">
        {/* Cover — gerçek kapak varsa görsel, yoksa degrade */}
        <div className="relative h-48 sm:h-64 bg-gradient-to-r from-primary to-primary-hover overflow-hidden">
          {group.cover_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={group.cover_image}
              alt={group.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 -mt-16 sm:-mt-24 relative z-10 mb-6">
            {/* İkon — baş harf (avatar kolonu yok) */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-white shadow-lg bg-primary text-white flex items-center justify-center text-4xl sm:text-5xl font-bold">
                {group.name.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="flex-1 pt-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#333] mb-2">{group.name}</h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#d1fae5] text-primary rounded-full text-sm font-semibold">
                      {group.is_private ? (
                        <>
                          <Lock className="w-4 h-4" />
                          Özel
                        </>
                      ) : (
                        <>
                          <Globe className="w-4 h-4" />
                          Herkese Açık
                        </>
                      )}
                    </span>
                    {group.category && (
                      <span className="inline-flex items-center gap-1 text-sm text-[#8f8f8f]">
                        <Tag className="w-4 h-4" />
                        {group.category}
                      </span>
                    )}
                    <span className="text-sm text-[#8f8f8f]">{memberCount} üye</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Join/Leave — yalnızca giriş yapan ve kurucu olmayan kullanıcıya */}
          {user && !isOwner && (
            <div className="flex gap-3">
              <button
                onClick={handleJoinLeave}
                disabled={joinLoading}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 ${
                  isJoined
                    ? 'bg-[#e0e0e0] text-[#404040] hover:bg-[#d0d0d0]'
                    : 'bg-primary text-white hover:bg-primary-hover'
                }`}
              >
                {joinLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isJoined ? (
                  <>
                    <LogOut className="w-4 h-4" />
                    Ayrıl
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Gruba Katıl
                  </>
                )}
              </button>
            </div>
          )}
          {isOwner && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#fff7e6] text-[#8a5a00] rounded-full text-sm font-semibold">
              Bu grubun kurucususunuz
            </span>
          )}

          {/* Tabs */}
          <div className="flex gap-1 mt-6 border-b border-[#e0e0e0] overflow-x-auto">
            {(['posts', 'members', 'about'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-primary border-primary'
                    : 'text-[#8f8f8f] border-transparent hover:text-[#404040]'
                }`}
              >
                {tab === 'posts' && 'Gönderiler'}
                {tab === 'members' && `Üyeler (${memberCount})`}
                {tab === 'about' && 'Hakkında'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex gap-3 mb-4">
                          <Avatar profile={post.profiles} size={40} />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-[#333]">
                              {post.profiles?.full_name || 'Üye'}
                            </h4>
                            <p className="text-sm text-[#8f8f8f]">
                              {formatTimeAgo(post.created_at)}
                            </p>
                          </div>
                        </div>

                        {post.title && (
                          <h3 className="font-bold text-lg text-[#333] mb-2">{post.title}</h3>
                        )}
                        <p className="text-[#404040] mb-4 leading-relaxed whitespace-pre-wrap">
                          {post.body}
                        </p>

                        {post.media_urls && post.media_urls.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            {post.media_urls.map((url, i) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                key={i}
                                src={url}
                                alt="Gönderi görseli"
                                className="w-full h-48 object-cover rounded-lg border border-[#e0e0e0]"
                              />
                            ))}
                          </div>
                        )}

                        <div className="flex gap-6 pt-4 border-t border-[#e0e0e0] text-sm text-[#8f8f8f]">
                          <span>{post.reaction_count || 0} beğeni</span>
                          <span>{post.comment_count || 0} yorum</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-[#8f8f8f] mx-auto mb-3" />
                    <p className="text-[#8f8f8f]">Bu grupta henüz gönderi yok.</p>
                  </div>
                )}
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
                <h2 className="text-2xl font-bold text-[#333] mb-6">Grup Üyeleri ({memberCount})</h2>
                {members.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {members.map((member) => {
                      const owner = member.user_id === group.created_by;
                      const roleLabel = owner
                        ? 'Kurucu'
                        : member.role === 'admin'
                        ? 'Yönetici'
                        : 'Üye';
                      return (
                        <Link key={member.user_id} href={`/profil/${member.user_id}`}>
                          <div className="p-4 rounded-lg hover:bg-[#f0f2f5] transition-colors cursor-pointer border border-transparent hover:border-[#e0e0e0]">
                            <div className="flex flex-col items-center">
                              <Avatar profile={member.profiles} size={80} />
                              <p className="font-semibold text-[#333] text-center text-sm mt-3">
                                {member.profiles?.full_name || 'Üye'}
                              </p>
                              <div
                                className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                                  owner
                                    ? 'bg-[#fff7e6] text-[#8a5a00]'
                                    : member.role === 'admin'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-green-100 text-green-700'
                                }`}
                              >
                                {roleLabel}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Users className="w-12 h-12 text-[#8f8f8f] mx-auto mb-3" />
                    <p className="text-[#8f8f8f]">Bu grupta henüz üye yok.</p>
                  </div>
                )}
              </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
                  <h2 className="text-2xl font-bold text-[#333] mb-4">Grup Hakkında</h2>
                  <p className="text-[#404040] leading-relaxed">
                    {group.description || 'Bu grup için henüz bir açıklama eklenmemiş.'}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
                  <h3 className="text-xl font-bold text-[#333] mb-6">Grup Bilgileri</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 pb-4 border-b border-[#e0e0e0]">
                      <Users className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm text-[#8f8f8f]">Üye Sayısı</p>
                        <p className="font-bold text-[#333]">{memberCount} kişi</p>
                      </div>
                    </div>
                    {group.category && (
                      <div className="flex items-center gap-4 pb-4 border-b border-[#e0e0e0]">
                        <Tag className="w-5 h-5 text-primary flex-shrink-0" />
                        <div>
                          <p className="text-sm text-[#8f8f8f]">Kategori</p>
                          <p className="font-bold text-[#333]">{group.category}</p>
                        </div>
                      </div>
                    )}
                    {group.created_at && (
                      <div className="flex items-center gap-4">
                        <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                        <div>
                          <p className="text-sm text-[#8f8f8f]">Kurulma Tarihi</p>
                          <p className="font-bold text-[#333]">{formatDate(group.created_at)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
              <h3 className="font-bold text-[#333] mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Grup Bilgileri
              </h3>
              <div className="space-y-5">
                <div className="pb-5 border-b border-[#e0e0e0]">
                  <p className="text-sm text-[#8f8f8f] mb-2">Üye Sayısı</p>
                  <p className="text-3xl font-bold text-primary">{memberCount}</p>
                </div>
                <div className="pb-5 border-b border-[#e0e0e0]">
                  <p className="text-sm text-[#8f8f8f] mb-2">Gönderi</p>
                  <p className="text-3xl font-bold text-primary">{posts.length}</p>
                </div>
                {group.category && (
                  <div>
                    <p className="text-sm text-[#8f8f8f] mb-2">Kategori</p>
                    <p className="font-semibold text-[#333]">{group.category}</p>
                  </div>
                )}
              </div>
            </div>

            {group.description && (
              <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
                <h3 className="font-bold text-[#333] mb-4">Grup Açıklaması</h3>
                <p className="text-sm text-[#404040] leading-relaxed">{group.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
