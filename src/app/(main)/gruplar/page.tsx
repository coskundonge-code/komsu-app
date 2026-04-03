'use client';

import Image from 'next/image';
import { Plus, Users, Lock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { getGroupAvatarUrl, getGroupCoverUrl } from '@/lib/demo-images';

const mockGroups = [
  {
    id: '1',
    slug: 'moda-anneler-klubu',
    name: 'Moda Anneler Kulübü',
    memberCount: 142,
    avatar: getGroupAvatarUrl('Moda Anneler Kulübü', 'Ebeveynler'),
    category: 'Ebeveynler',
    description: 'Moda\'da yaşayan annelerin buluşma noktası. Çocuk eğitimi, beslenme ve yaşam deneyimleri paylaşıyoruz.',
    privacy: 'Açık',
    coverImage: getGroupCoverUrl('Moda Anneler Kulübü', 'Ebeveynler'),
  },
  {
    id: '2',
    slug: 'kadikoy-kosucular',
    name: 'Kadıköy Koşucuları',
    memberCount: 287,
    avatar: getGroupAvatarUrl('Kadıköy Koşucuları', 'Spor'),
    category: 'Spor',
    description: 'Her sabah Cadde Bostan\'da buluşan koşucuların topluluğu. Herkese açık antrenmanlar.',
    privacy: 'Açık',
    coverImage: getGroupCoverUrl('Kadıköy Koşucuları', 'Spor'),
  },
  {
    id: '3',
    slug: 'mahalle-yardimlas',
    name: 'Mahalle Yardımlaşma',
    memberCount: 156,
    avatar: getGroupAvatarUrl('Mahalle Yardımlaşma', 'Komşuluk'),
    category: 'Komşuluk',
    description: 'Komşuluk bağlarını güçlendirerek birbirimize yardım etmek için kurulmuş bir topluluk.',
    privacy: 'Açık',
    coverImage: getGroupCoverUrl('Mahalle Yardımlaşma', 'Komşuluk'),
  },
  {
    id: '4',
    slug: 'bahce-severler',
    name: 'Bahçe Severler',
    memberCount: 98,
    avatar: getGroupAvatarUrl('Bahçe Severler', 'Hobi'),
    category: 'Hobi',
    description: 'Ev bahçesi ve meyvelik tasarımı, bitkilere bakım, kompost yapımı hakkında sohbet.',
    privacy: 'Açık',
    coverImage: getGroupCoverUrl('Bahçe Severler', 'Hobi'),
  },
  {
    id: '5',
    slug: 'kitap-kurdu-rehberi',
    name: 'Kitap Kurdu Rehberi',
    memberCount: 203,
    avatar: getGroupAvatarUrl('Kitap Kurdu Rehberi', 'Hobi'),
    category: 'Hobi',
    description: 'Kitap sevenler için ayda bir buluşup tartışma ve tavsiye paylaşma grubu.',
    privacy: 'Açık',
    coverImage: getGroupCoverUrl('Kitap Kurdu Rehberi', 'Hobi'),
  },
  {
    id: '6',
    slug: 'yoga-meditasyon',
    name: 'Yoga & Meditasyon',
    memberCount: 124,
    avatar: getGroupAvatarUrl('Yoga & Meditasyon', 'Spor'),
    category: 'Spor',
    description: 'Sağlıklı yaşam için yoga ve meditasyon seansları. Tüm seviyeler hoşgeldiniz.',
    privacy: 'Açık',
    coverImage: getGroupCoverUrl('Yoga & Meditasyon', 'Spor'),
  },
  {
    id: '7',
    slug: 'mahalle-cocuk-oyun',
    name: 'Mahalle Çocuk Oyun',
    memberCount: 267,
    avatar: getGroupAvatarUrl('Mahalle Çocuk Oyun', 'Ebeveynler'),
    category: 'Ebeveynler',
    description: 'Çocukları için güvenli bir oyun ortamı bulan ve organize eden ebeveynler grubu.',
    privacy: 'Gizli',
    coverImage: getGroupCoverUrl('Mahalle Çocuk Oyun', 'Ebeveynler'),
  },
  {
    id: '8',
    slug: 'pazar-pazarligi',
    name: 'Pazar Pazarlığı',
    memberCount: 178,
    avatar: getGroupAvatarUrl('Pazar Pazarlığı', 'Komşuluk'),
    category: 'Komşuluk',
    description: 'Pazara gideceklere ürün almayı koordine ederek toplu alımlar yapan grup.',
    privacy: 'Açık',
    coverImage: getGroupCoverUrl('Pazar Pazarlığı', 'Komşuluk'),
  },
  {
    id: '10',
    slug: 'mahalle-spor-ligleri',
    name: 'Mahalle Spor Ligleri',
    memberCount: 234,
    avatar: getGroupAvatarUrl('Mahalle Spor Ligleri', 'Spor'),
    category: 'Spor',
    description: 'Futsal, voleybol ve badminton maçlarını organize eden spor topluluğu.',
    privacy: 'Açık',
    coverImage: getGroupCoverUrl('Mahalle Spor Ligleri', 'Spor'),
  },
];

const categories = [
  { id: 'all', label: 'Tümü' },
  { id: 'Ebeveynler', label: 'Ebeveynler' },
  { id: 'Spor', label: 'Spor' },
  { id: 'Hobi', label: 'Hobi' },
  { id: 'Komşuluk', label: 'Komşuluk' },
];

type TabType = 'all' | 'mine';

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set(['1', '3', '5']));

  const filtered = mockGroups.filter((g) => {
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
            onClick={() => { setActiveTab('mine'); setActiveCategory('all'); }}
            className={`pb-3 font-bold text-lg transition-colors ${
              activeTab === 'mine'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Gruplarım ({joinedGroups.size})
          </button>
        </div>

        {/* Category Filter Buttons */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 font-medium whitespace-nowrap rounded-full transition-all text-sm ${
                activeCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-primary border border-border hover:border-primary'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Groups Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-lg border border-border">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-text-primary font-medium mb-1">Grup bulunamadı</p>
            <p className="text-text-muted text-sm">Yeni bir grup oluşturabilirsiniz.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((group) => (
              <Link
                key={group.id}
                href={`/gruplar/${group.slug}`}
                className="bg-surface rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-primary"
              >
                {/* Cover Image */}
                <div className="h-32 overflow-hidden bg-gray-200">
                  <img
                    src={group.coverImage}
                    alt={group.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Group Info Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <Image
                      src={group.avatar}
                      alt={group.name}
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white -mt-10 flex-shrink-0"
                      unoptimized
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-text-primary text-sm line-clamp-2">
                        {group.name}
                      </h3>
                      <p className="text-xs text-primary font-medium">
                        {group.category}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                    {group.description}
                  </p>

                  {/* Member Count and Privacy */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                    <div className="flex items-center gap-1">
                      <Users size={16} className="text-text-muted" />
                      <span className="text-xs text-text-muted font-medium">
                        {group.memberCount}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-background rounded-full">
                      {group.privacy === 'Gizli' && (
                        <Lock size={14} className="text-text-muted" />
                      )}
                      <span className="text-xs text-text-muted font-medium">
                        {group.privacy}
                      </span>
                    </div>
                  </div>

                  {/* Join Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setJoinedGroups((prev) => {
                        const next = new Set(prev);
                        if (next.has(group.id)) next.delete(group.id);
                        else next.add(group.id);
                        return next;
                      });
                    }}
                    className={`w-full py-2 px-4 border-2 rounded-lg font-bold text-sm transition-all ${
                      joinedGroups.has(group.id)
                        ? 'bg-primary text-white border-primary'
                        : 'border-primary text-primary hover:bg-background'
                    }`}
                  >
                    {joinedGroups.has(group.id) ? '✓ Katıldın' : 'Katıl'}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
