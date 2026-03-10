'use client';

import Image from 'next/image';
import { Plus, Search, Users, Lock } from 'lucide-react';
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
    avatar: getGroupAvatarUrl('Mahalle Yardımlaşma', 'Yardımlaşma'),
    category: 'Yardımlaşma',
    description: 'Komşuluk bağlarını güçlendirerek birbirimize yardım etmek için kurulmuş bir topluluk.',
    privacy: 'Açık',
    coverImage: getGroupCoverUrl('Mahalle Yardımlaşma', 'Yardımlaşma'),
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
    id: '9',
    slug: 'evcil-hayvan-dostlari',
    name: 'Evcil Hayvan Dostları',
    memberCount: 95,
    avatar: getGroupAvatarUrl('Evcil Hayvan Dostları', 'Evcil Hayvan'),
    category: 'Evcil Hayvanlar',
    description: 'Köpek, kedi, kuş ve diğer evcil hayvanlarımızın bakım ve eğitimi hakkında tartışmalar.',
    privacy: 'Açık',
    coverImage: getGroupCoverUrl('Evcil Hayvan Dostları', 'Evcil Hayvan'),
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
  { id: 'Yardımlaşma', label: 'Yardımlaşma' },
  { id: 'Komşuluk', label: 'Komşuluk' },
  { id: 'Evcil Hayvanlar', label: 'Evcil Hayvanlar' },
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
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#00833e] to-[#006b32] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Mahalle Grupları</h1>
              <p className="text-green-100 text-lg">Çıkarlarınızı paylaşan komşuları bulun ve bağlantı kurun</p>
            </div>
            <Link
              href="/gruplar/olustur"
              className="flex items-center gap-2 px-6 py-3 bg-white text-[#00833e] rounded-lg hover:bg-gray-100 transition-colors font-bold text-sm whitespace-nowrap"
            >
              <Plus size={20} />
              Grup Oluştur
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Grupları ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-[#e0e0e0] rounded-full text-base focus:outline-none focus:ring-2 focus:ring-[#00833e] focus:border-transparent bg-white"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-[#e0e0e0]">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 font-bold text-lg transition-colors ${
              activeTab === 'all'
                ? 'text-[#00833e] border-b-2 border-[#00833e]'
                : 'text-[#8f8f8f] hover:text-[#333]'
            }`}
          >
            Keşfet
          </button>
          <button
            onClick={() => setActiveTab('mine')}
            className={`pb-3 font-bold text-lg transition-colors ${
              activeTab === 'mine'
                ? 'text-[#00833e] border-b-2 border-[#00833e]'
                : 'text-[#8f8f8f] hover:text-[#333]'
            }`}
          >
            Gruplarım
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
                  ? 'bg-[#00833e] text-white'
                  : 'bg-white text-[#333] border border-[#e0e0e0] hover:border-[#00833e]'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Groups Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-[#e0e0e0]">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-[#333] font-medium mb-1">Grup bulunamadı</p>
            <p className="text-[#8f8f8f] text-sm">Yeni bir grup oluşturabilirsiniz.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((group) => (
              <Link
                key={group.id}
                href={`/gruplar/${group.slug}`}
                className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-[#00833e]"
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
                      <h3 className="font-bold text-[#333] text-sm line-clamp-2">
                        {group.name}
                      </h3>
                      <p className="text-xs text-[#00833e] font-medium">
                        {group.category}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#404040] line-clamp-2 mb-3">
                    {group.description}
                  </p>

                  {/* Member Count and Privacy */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#e0e0e0]">
                    <div className="flex items-center gap-1">
                      <Users size={16} className="text-[#8f8f8f]" />
                      <span className="text-xs text-[#8f8f8f] font-medium">
                        {group.memberCount}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-[#f0f2f5] rounded-full">
                      {group.privacy === 'Gizli' && (
                        <Lock size={14} className="text-[#8f8f8f]" />
                      )}
                      <span className="text-xs text-[#8f8f8f] font-medium">
                        {group.privacy}
                      </span>
                    </div>
                  </div>

                  {/* Join Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setJoinedGroups((prev) => {
                        const next = new Set(prev);
                        if (next.has(group.id)) next.delete(group.id);
                        else next.add(group.id);
                        return next;
                      });
                    }}
                    className={`w-full py-2 px-4 border-2 rounded-lg font-bold text-sm transition-all ${
                      joinedGroups.has(group.id)
                        ? 'bg-[#00833e] text-white border-[#00833e]'
                        : 'border-[#00833e] text-[#00833e] hover:bg-[#f0f2f5]'
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
