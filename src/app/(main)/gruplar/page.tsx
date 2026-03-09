'use client';

import { Plus, Search, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const mockGroups = [
  {
    id: '1',
    slug: 'komsu-kahvaltilari',
    name: 'Komşu Kahvaltıları',
    description: 'Her hafta bir araya gelen komşuların kahvaltı grubu.',
    coverImage: 'https://images.unsplash.com/photo-1585518419759-ab60cb0bf33f?w=500&h=300&fit=crop',
    memberCount: 47,
    isJoined: true,
  },
  {
    id: '2',
    slug: 'bahce-severler',
    name: 'Bahçe Severler',
    description: 'Bahçe tasarımı ve bitki yetiştirme hakkında bilgi paylaşıyoruz.',
    coverImage: 'https://images.unsplash.com/photo-1585516031632-dfd21dbdc8b3?w=500&h=300&fit=crop',
    memberCount: 32,
    isJoined: false,
  },
  {
    id: '3',
    slug: 'mahalle-spor',
    name: 'Mahalle Spor Kulübü',
    description: 'Futbol, badminton, yüzme ve fitness aktiviteleri.',
    coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop',
    memberCount: 89,
    isJoined: true,
  },
  {
    id: '4',
    slug: 'kitap-kurdu',
    name: 'Kitap Kurdu Klübü',
    description: 'Aylık kitap tartışmaları yapan edebiyat severler.',
    coverImage: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=300&fit=crop',
    memberCount: 28,
    isJoined: false,
  },
  {
    id: '5',
    slug: 'anne-cocuk',
    name: 'Anne-Çocuk Atölyesi',
    description: 'Çocuk gelişimi ve yaratıcı aktiviteler hakkında paylaşım.',
    coverImage: 'https://images.unsplash.com/photo-1552821081-7ffcfbf6ef14?w=500&h=300&fit=crop',
    memberCount: 56,
    isJoined: false,
  },
  {
    id: '6',
    slug: 'yardim-gonulluler',
    name: 'Yardım Gönüllüleri',
    description: 'İhtiyaç sahibi bireylere yardım eden gönüllü grubu.',
    coverImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=300&fit=crop',
    memberCount: 34,
    isJoined: true,
  },
];

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockGroups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[900px] mx-auto px-4 py-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Gruplar</h1>
            <Link
              href="/gruplar/olustur"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Grup Oluştur
            </Link>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Grup ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Groups Grid - Nextdoor style */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium mb-1">Grup bulunamadı</p>
            <p className="text-gray-400 text-sm">Yeni bir grup oluşturabilirsiniz.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((group) => (
              <Link
                key={group.id}
                href={`/gruplar/${group.slug}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Cover */}
                <div className="h-32 relative">
                  <img
                    src={group.coverImage}
                    alt={group.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 truncate">{group.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{group.memberCount} üye</p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{group.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => e.preventDefault()}
                    className={cn(
                      'mt-3 w-full py-2 rounded-lg text-sm font-medium transition-colors',
                      group.isJoined
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    )}
                  >
                    {group.isJoined ? 'Katıldın ✓' : 'Katıl'}
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
