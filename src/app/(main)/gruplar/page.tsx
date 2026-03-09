'use client';

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
  },
  {
    id: '2',
    slug: 'kadikoy-kosucular',
    name: 'Kadıköy Koşucuları',
    memberCount: 287,
    avatar: 'https://picsum.photos/200/200?random=33',
  },
  {
    id: '3',
    slug: 'mahalle-yardimlas',
    name: 'Mahalle Yardımlaşma',
    memberCount: 156,
    avatar: 'https://picsum.photos/200/200?random=34',
  },
  {
    id: '4',
    slug: 'bahce-severler',
    name: 'Bahçe Severler',
    memberCount: 98,
    avatar: 'https://picsum.photos/200/200?random=35',
  },
  {
    id: '5',
    slug: 'kitap-kurdu-rehberi',
    name: 'Kitap Kurdu Rehberi',
    memberCount: 203,
    avatar: 'https://picsum.photos/200/200?random=36',
  },
  {
    id: '6',
    slug: 'yoga-meditasyon',
    name: 'Yoga & Meditasyon',
    memberCount: 124,
    avatar: 'https://picsum.photos/200/200?random=37',
  },
  {
    id: '7',
    slug: 'mahalle-cocuk-oyun',
    name: 'Mahalle Çocuk Oyun',
    memberCount: 267,
    avatar: 'https://picsum.photos/200/200?random=33',
  },
  {
    id: '8',
    slug: 'pazar-pazarligi',
    name: 'Pazar Pazarlığı',
    memberCount: 178,
    avatar: 'https://picsum.photos/200/200?random=38',
  },
];

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set());

  const filtered = mockGroups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                className="flex flex-col items-center text-center p-6 rounded-lg border border-[#e0e0e0] hover:border-[#00833e] transition-colors hover:shadow-md"
              >
                {/* Circle Avatar */}
                <div className="mb-4">
                  <img
                    src={group.avatar}
                    alt={group.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-[#e0e0e0]"
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
