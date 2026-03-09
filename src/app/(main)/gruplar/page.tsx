'use client';

import { GroupCard } from '@/components/groups/group-card';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const mockGroups = [
  {
    id: '1',
    slug: 'komsu-kahvaltilari',
    name: 'Komşu Kahvaltıları',
    description: 'Mahallede her hafta bir araya gelen komşuların kahvaltı grubu. Sosyal aktiviteler ve ağ oluşturma.',
    coverImage: 'https://images.unsplash.com/photo-1585518419759-ab60cb0bf33f?w=500&h=300&fit=crop',
    memberCount: 47,
    category: 'Sosyal',
    isJoined: true,
  },
  {
    id: '2',
    slug: 'bahce-severler',
    name: 'Bahçe Severler Topluluğu',
    description: 'Bahçe tasarımı, bitki yetiştirme ve peyzaj mimarisi hakkında bilgi paylaşıyoruz.',
    coverImage: 'https://images.unsplash.com/photo-1585516031632-dfd21dbdc8b3?w=500&h=300&fit=crop',
    memberCount: 32,
    category: 'Hobi',
    isJoined: false,
  },
  {
    id: '3',
    slug: 'mahalle-spor-klubu',
    name: 'Mahalle Spor Kulübü',
    description: 'Futbol, badminton, yüzme ve fitness aktiviteleri düzenleyen spor grubu. Herkes için uygun.',
    coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop',
    memberCount: 89,
    category: 'Spor',
    isJoined: true,
  },
  {
    id: '4',
    slug: 'kitap-kurdu-klup',
    name: 'Kitap Kurdu Klübü',
    description: 'Aylık olarak kitap tartışmaları yapan, edebiyat seven insanların buluşma noktası.',
    coverImage: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=300&fit=crop',
    memberCount: 28,
    category: 'Kültür',
    isJoined: false,
  },
  {
    id: '5',
    slug: 'anne-cocuk-atolyesi',
    name: 'Anne-Çocuk Atölyesi',
    description: 'Çocuk gelişimi, eğitim ve yaratıcı aktiviteler hakkında bilgi paylaşan ve etkinlik düzenleyen grup.',
    coverImage: 'https://images.unsplash.com/photo-1552821081-7ffcfbf6ef14?w=500&h=300&fit=crop',
    memberCount: 56,
    category: 'Eğitim',
    isJoined: false,
  },
  {
    id: '6',
    slug: 'yardim-goenulluler',
    name: 'Yardım Gönüllüleri',
    description: 'Mahallede yaşlı, engelli ve ihtiyaç sahibi bireylere yardım eden gönüllü grubu.',
    coverImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=300&fit=crop',
    memberCount: 34,
    category: 'Sosyal Sorumluluk',
    isJoined: true,
  },
];

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  const categories = [
    'Tümü',
    'Sosyal',
    'Hobi',
    'Spor',
    'Kültür',
    'Eğitim',
    'Sosyal Sorumluluk',
  ];

  const filteredGroups = mockGroups.filter((group) => {
    const matchesSearch = group.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Tümü' || group.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Gruplar</h1>
            <Link href="/gruplar/olustur">
              <Button className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Grup Oluştur
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Grup ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Grup bulunamadı
            </h3>
            <p className="text-gray-600 mb-6">
              Lütfen arama kriterlerinizi değiştirin veya yeni bir grup oluşturun.
            </p>
            <Link href="/gruplar/olustur">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                İlk Grubu Oluştur
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <GroupCard key={group.id} {...group} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
