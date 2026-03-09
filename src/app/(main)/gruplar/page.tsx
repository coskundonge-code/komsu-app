'use client';

import Image from 'next/image';
import { Plus, Search, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const mockGroups = [
  {
    id: '1',
    slug: 'moda-anneler-klubu',
    name: 'Moda Anneler Kulübü',
    memberCount: 142,
    avatar: 'https://picsum.photos/200/200?random=32',
    category: 'Sosyal',
  },
  {
    id: '2',
    slug: 'kadikoy-kosucular',
    name: 'Kadıköy Koşucuları',
    memberCount: 287,
    avatar: 'https://picsum.photos/200/200?random=33',
    category: 'Spor',
  },
  {
    id: '3',
    slug: 'mahalle-yardimlas',
    name: 'Mahalle Yardımlaşma',
    memberCount: 156,
    avatar: 'https://picsum.photos/200/200?random=34',
    category: 'Yardımlaşma',
  },
  {
    id: '4',
    slug: 'bahce-severler',
    name: 'Bahçe Severler',
    memberCount: 98,
    avatar: 'https://picsum.photos/200/200?random=35',
    category: 'Hobi',
  },
  {
    id: '5',
    slug: 'kitap-kurdu-rehberi',
    name: 'Kitap Kurdu Rehberi',
    memberCount: 203,
    avatar: 'https://picsum.photos/200/200?random=36',
    category: 'Eğitim',
  },
  {
    id: '6',
    slug: 'yoga-meditasyon',
    name: 'Yoga & Meditasyon',
    memberCount: 124,
    avatar: 'https://picsum.photos/200/200?random=37',
    category: 'Spor',
  },
  {
    id: '7',
    slug: 'mahalle-cocuk-oyun',
    name: 'Mahalle Çocuk Oyun',
    memberCount: 267,
    avatar: 'https://picsum.photos/200/200?random=33',
    category: 'Sosyal',
  },
  {
    id: '8',
    slug: 'pazar-pazarligi',
    name: 'Pazar Pazarlığı',
    memberCount: 178,
    avatar: 'https://picsum.photos/200/200?random=38',
    category: 'Hobi',
  },
];

const categories = [
  { id: 'all', label: 'Tümü' },
  { id: 'Sosyal', label: 'Sosyal' },
  { id: 'Hobi', label: 'Hobi' },
  { id: 'Spor', label: 'Spor' },
  { id: 'Eğitim', label: 'Eğitim' },
  { id: 'Yardımlaşma', label: 'Yardımlaşma' },
];

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set());

  const filtered = mockGroups.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || g.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tüm grupları ara"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-[#e0e0e0] rounded-full text-base focus:outline-none focus:ring-2 focus:ring-[#00833e] focus:border-transparent"
            />
          </div>
        </div>

        {/* Header with Create Button */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#333]">Gruplar</h1>
          <Link
            href="/gruplar/olustur"
            className="px-6 py-2.5 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#333] transition-colors font-medium text-sm"
          >
            Oluştur
          </Link>
        </div>

        {/* Category Filter Buttons */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 font-medium whitespace-nowrap rounded-full transition-all ${
                activeCategory === category.id
                  ? 'bg-[#00833e] text-white'
                  : 'bg-[#f0f2f5] text-[#333] hover:bg-[#e0e0e0]'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Section Heading */}
        <h2 className="text-xl font-semibold text-[#333] mb-6">Yakınındaki Gruplar</h2>

        {/* Groups Grid - 2 columns Nextdoor style */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-[#333] font-medium mb-1">Grup bulunamadı</p>
            <p className="text-[#8f8f8f] text-sm">Yeni bir grup oluşturabilirsiniz.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((group) => (
              <Link
                key={group.id}
                href={`/gruplar/${group.slug}`}
                className="card-hover flex flex-col items-center text-center p-6 rounded-lg border border-[#e0e0e0] bg-white transition-all duration-200 hover:border-[#00833e] hover:shadow-lg hover:scale-105"
              >
                {/* Circle Avatar */}
                <div className="mb-4">
                  <Image
                    src={group.avatar}
                    alt={group.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover border-2 border-[#e0e0e0]"
                    unoptimized
                  />
                </div>

                {/* Group Name */}
                <h3 className="text-lg font-bold text-[#333] mb-1 line-clamp-2">
                  {group.name}
                </h3>

                {/* Member Count */}
                <p className="text-sm text-[#8f8f8f] mb-4">
                  {group.memberCount} üye
                </p>

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
                  className={`px-8 py-2 border-2 rounded-full font-medium text-sm transition-colors ${
                    joinedGroups.has(group.id)
                      ? 'bg-[#00833e] text-white border-[#00833e]'
                      : 'border-[#00833e] text-[#00833e] hover:bg-[#f0f0f0]'
                  }`}
                >
                  {joinedGroups.has(group.id) ? '✓ Katıldın' : 'Katıl'}
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
