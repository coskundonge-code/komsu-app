'use client';

import { Plus, Users, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { getGroups, joinGroup, leaveGroup, getUserGroupIds } from '@/lib/hooks/use-groups-businesses';
import { useCurrentUser } from '@/lib/hooks/use-auth';

// NOT (2026-06-07): Bu sayfa eskiden 8 sahte grup (mockGroups) +
// getGroupAvatarUrl/getGroupCoverUrl demo görselleri gösteriyordu ve DB'ye
// yalnızca "veri varsa" bakıyordu (boşsa sahteyi gösteriyordu). Artık yalnızca
// gerçek `groups` kayıtlarına bağlı; kapak yoksa degrade arka plan + baş harf,
// kategori çipleri gerçek veriden, "Gruplarım" gerçek üyelikten. Bkz.
// TECH_DEBT #12.

type TabType = 'all' | 'mine';

interface GroupDisplay {
  id: string;
  slug: string;
  name: string;
  memberCount: number;
  category: string;
  description: string;
  isPrivate: boolean;
  coverImage: string | null;
}

function mapDbGroup(g: any): GroupDisplay {
  return {
    id: g.id,
    slug: g.slug || g.id,
    name: g.name,
    memberCount: g.member_count || 0,
    category: g.category || 'Genel',
    description: g.description || '',
    isPrivate: !!g.is_private,
    coverImage: g.cover_image || null,
  };
}

export default function GroupsPage() {
  const { user } = useCurrentUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [groups, setGroups] = useState<GroupDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set());
  const [loadingJoin, setLoadingJoin] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await getGroups({ limit: 50 });
      if (cancelled) return;
      setGroups(((data as any[]) || []).map(mapDbGroup));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Gerçek üyelikleri yükle (Gruplarım + katıldın durumu).
  useEffect(() => {
    if (!user) {
      setJoinedGroups(new Set());
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await getUserGroupIds(user.id);
      if (cancelled) return;
      const ids = ((data as { group_id: string }[]) || []).map((x) => x.group_id);
      setJoinedGroups(new Set(ids));
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Kategori çipleri yalnızca veride gerçekten bulunan kategorilerden türetilir.
  const categories = useMemo(() => {
    const set = new Set<string>();
    groups.forEach((g) => {
      if (g.category) set.add(g.category);
    });
    return ['all', ...Array.from(set).sort((a, b) => a.localeCompare(b, 'tr'))];
  }, [groups]);

  async function handleJoinLeave(groupId: string) {
    if (!user) return;
    setLoadingJoin(groupId);
    const isJoined = joinedGroups.has(groupId);
    if (isJoined) {
      await leaveGroup(groupId, user.id);
      setJoinedGroups((prev) => {
        const n = new Set(prev);
        n.delete(groupId);
        return n;
      });
    } else {
      await joinGroup(groupId, user.id);
      setJoinedGroups((prev) => new Set([...prev, groupId]));
    }
    setLoadingJoin(null);
  }

  const filtered = groups.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || g.category === activeCategory;
    const matchesTab = activeTab === 'all' || (activeTab === 'mine' && joinedGroups.has(g.id));
    return matchesSearch && matchesCategory && matchesTab;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header with Title and Create Button */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-text-primary">Mahalle Grupları</h1>
          <Link
            href="/gruplar/olustur"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-bold text-sm"
          >
            <Plus size={20} />
            Grup Oluştur
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Grup ara..."
            className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 font-bold text-lg transition-colors ${
              activeTab === 'all'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Keşfet
          </button>
          <button
            onClick={() => {
              setActiveTab('mine');
              setActiveCategory('all');
            }}
            className={`pb-3 font-bold text-lg transition-colors ${
              activeTab === 'mine'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Gruplarım ({joinedGroups.size})
          </button>
        </div>

        {/* Category Filter Buttons — yalnızca veride birden fazla kategori varsa */}
        {categories.length > 1 && (
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 font-medium whitespace-nowrap rounded-full transition-all text-sm ${
                  activeCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text-primary border border-border hover:border-primary'
                }`}
              >
                {category === 'all' ? 'Tümü' : category}
              </button>
            ))}
          </div>
        )}

        {/* İçerik */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={36} className="text-primary animate-spin" />
            <p className="text-text-muted text-sm">Gruplar yükleniyor…</p>
          </div>
        ) : groups.length === 0 ? (
          // Hiç grup yok — dürüst boş durum + oluşturma çağrısı
          <div className="text-center py-16 bg-surface rounded-lg border border-border">
            <div className="w-16 h-16 rounded-full bg-[#e6f4ec] flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Henüz grup yok</h3>
            <p className="text-text-muted mb-6 max-w-md mx-auto">
              Mahallenizde ilk grubu siz oluşturun; komşularınız katılsın.
            </p>
            <Link
              href="/gruplar/olustur"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-lg transition-all"
            >
              <Plus size={20} />
              Grup Oluştur
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          // Grup var ama filtre/sekme eşleşmedi
          <div className="text-center py-16 bg-surface rounded-lg border border-border">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-text-primary font-medium mb-1">
              {activeTab === 'mine' ? 'Henüz bir gruba katılmadın' : 'Grup bulunamadı'}
            </p>
            <p className="text-text-muted text-sm">
              {activeTab === 'mine'
                ? 'Keşfet sekmesinden ilgi alanına uygun gruplara katılabilirsin.'
                : 'Farklı bir arama veya kategori deneyin.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((group) => (
              <Link
                key={group.id}
                href={`/gruplar/${group.slug}`}
                className="bg-surface rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-primary"
              >
                {/* Cover — gerçek kapak varsa görsel, yoksa degrade */}
                <div className="h-32 overflow-hidden bg-gradient-to-r from-[#e6f4ec] to-green-100">
                  {group.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={group.coverImage}
                      alt={group.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : null}
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Group Info Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-14 h-14 rounded-full border-2 border-white -mt-10 flex-shrink-0 bg-primary text-white flex items-center justify-center font-bold text-xl shadow">
                      {group.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-text-primary text-sm line-clamp-2">
                        {group.name}
                      </h3>
                      <p className="text-xs text-primary font-medium">{group.category}</p>
                    </div>
                  </div>

                  {/* Description — yalnızca gerçek açıklama varsa */}
                  {group.description && (
                    <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                      {group.description}
                    </p>
                  )}

                  {/* Member Count and Privacy */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                    <div className="flex items-center gap-1">
                      <Users size={16} className="text-text-muted" />
                      <span className="text-xs text-text-muted font-medium">
                        {group.memberCount}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-background rounded-full">
                      {group.isPrivate && <Lock size={14} className="text-text-muted" />}
                      <span className="text-xs text-text-muted font-medium">
                        {group.isPrivate ? 'Gizli' : 'Açık'}
                      </span>
                    </div>
                  </div>

                  {/* Join Button — yalnızca giriş yapan kullanıcıya */}
                  {user && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleJoinLeave(group.id);
                      }}
                      disabled={loadingJoin === group.id}
                      className={`w-full py-2 px-4 border-2 rounded-lg font-bold text-sm transition-all ${
                        joinedGroups.has(group.id)
                          ? 'bg-primary text-white border-primary'
                          : 'border-primary text-primary hover:bg-background'
                      } disabled:opacity-50`}
                    >
                      {loadingJoin === group.id
                        ? '...'
                        : joinedGroups.has(group.id)
                        ? '✓ Katıldın'
                        : 'Katıl'}
                    </button>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
