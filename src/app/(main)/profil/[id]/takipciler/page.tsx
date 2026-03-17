'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Search,
  MessageCircle,
  MapPin,
  Users,
  ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images';

interface Neighbor {
  id: string;
  name: string;
  initials: string;
  avatar: string;
  neighborhood: string;
  district: string;
  mutualConnections: number;
  bio: string;
}

interface TabType {
  id: string;
  label: string;
}

const mockNeighbors: Neighbor[] = [
  {
    id: '1',
    name: 'Ayşe Yılmaz',
    initials: 'AY',
    avatar: getFeedImageUrl(1, 200, 200),
    neighborhood: 'Moda',
    district: 'Kadıköy',
    mutualConnections: 5,
    bio: 'Öğretmen, okuma severim, spor yapıyorum',
  },
  {
    id: '2',
    name: 'Mehmet Kara',
    initials: 'MK',
    avatar: getFeedImageUrl(2, 200, 200),
    neighborhood: 'Moda',
    district: 'Kadıköy',
    mutualConnections: 8,
    bio: 'Yazılım geliştirici, teknoloji tutkunu',
  },
  {
    id: '3',
    name: 'Zeynep Çelik',
    initials: 'ZÇ',
    avatar: getFeedImageUrl(3, 200, 200),
    neighborhood: 'Moda',
    district: 'Kadıköy',
    mutualConnections: 3,
    bio: 'Grafik tasarımcı, sanat seviyorum',
  },
  {
    id: '4',
    name: 'Ali Demir',
    initials: 'AD',
    avatar: getFeedImageUrl(4, 200, 200),
    neighborhood: 'Moda',
    district: 'Kadıköy',
    mutualConnections: 6,
    bio: 'Mimarı, şehir planlaması hakkında konuşuyorum',
  },
  {
    id: '5',
    name: 'Fatma Şahin',
    initials: 'FŞ',
    avatar: getFeedImageUrl(5, 200, 200),
    neighborhood: 'Moda',
    district: 'Kadıköy',
    mutualConnections: 4,
    bio: 'Hemşire, yaşlı bakımı ve sağlık hakkında tavsiye verebilirim',
  },
  {
    id: '6',
    name: 'Can Özer',
    initials: 'CÖ',
    avatar: getFeedImageUrl(6, 200, 200),
    neighborhood: 'Moda',
    district: 'Kadıköy',
    mutualConnections: 7,
    bio: 'Aşçı, yemek tarifi paylaşıyorum',
  },
  {
    id: '7',
    name: 'Elif Yıldız',
    initials: 'EY',
    avatar: getFeedImageUrl(7, 200, 200),
    neighborhood: 'Moda',
    district: 'Kadıköy',
    mutualConnections: 2,
    bio: 'Öğrenci, gönüllü çalışmalarımı yapıyorum',
  },
  {
    id: '8',
    name: 'Serhan Ceylan',
    initials: 'SC',
    avatar: getFeedImageUrl(8, 200, 200),
    neighborhood: 'Moda',
    district: 'Kadıköy',
    mutualConnections: 5,
    bio: 'İşletme sahibi, iş tavsiyesi verebilirim',
  },
];

const tabs: TabType[] = [
  { id: 'neighbors', label: 'Komşular' },
  { id: 'following', label: 'Takip Ettikleri' },
];

export default function FollowersPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<string>('neighbors');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNeighbors, setFilteredNeighbors] = useState(mockNeighbors);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = mockNeighbors.filter(
        (neighbor) =>
          neighbor.name.toLowerCase().includes(query.toLowerCase()) ||
          neighbor.neighborhood.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredNeighbors(filtered);
    } else {
      setFilteredNeighbors(mockNeighbors);
    }
  };

  const displayedNeighbors = activeTab === 'neighbors' ? filteredNeighbors : filteredNeighbors.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header with Navigation */}
      <div className="bg-white border-b border-[#e0e0e0] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Button and Title */}
          <div className="py-4 mb-0 flex items-center gap-3">
            <Link
              href={`/profil/${params.id}`}
              className="p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors text-[#333]"
            >
              <ChevronLeft size={24} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#333]">Mahalle Komşuları</h1>
              <p className="text-sm text-[#8f8f8f]">{mockNeighbors.length} komşu</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#e0e0e0]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 sm:flex-none px-4 py-4 text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-[#00833e] text-[#00833e]'
                    : 'border-transparent text-[#8f8f8f] hover:text-[#333]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="py-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8f8f8f]"
              />
              <input
                type="text"
                placeholder="Komşu adı veya mahalle ara..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-[#e0e0e0] rounded-lg bg-white text-[#333] placeholder-[#8f8f8f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00833e]/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {displayedNeighbors.length === 0 ? (
          <div className="text-center py-16">
            <Users size={48} className="mx-auto text-[#e0e0e0] mb-4" />
            <h3 className="text-lg font-semibold text-[#333] mb-2">Komşu bulunamadı</h3>
            <p className="text-[#8f8f8f]">Arama kriterlerine uygun komşu yok</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedNeighbors.map((neighbor) => (
              <div
                key={neighbor.id}
                className="bg-white rounded-lg border border-[#e0e0e0] p-5 hover:shadow-md transition-all card-hover"
              >
                {/* Neighbor Header */}
                <div className="flex items-start justify-between mb-4">
                  {/* Avatar and Name */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#00833e] to-[#006b32] rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
                      <Image
                        src={neighbor.avatar}
                        alt={neighbor.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#333] text-sm mb-1">
                        {neighbor.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-[#8f8f8f]">
                        <MapPin size={14} className="text-[#00833e] flex-shrink-0" />
                        <span className="truncate">
                          {neighbor.neighborhood}, {neighbor.district}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-[#404040] mb-4 line-clamp-2">
                  {neighbor.bio}
                </p>

                {/* Mutual Connections */}
                <div className="mb-4 p-3 bg-[#f0f2f5] rounded-lg">
                  <p className="text-xs text-[#8f8f8f] font-medium">
                    <Users size={14} className="inline text-[#00833e] mr-1" />
                    {neighbor.mutualConnections} ortak komşu
                  </p>
                </div>

                {/* Message Button */}
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00833e] hover:bg-[#006b32] text-white font-medium rounded-lg transition-colors">
                  <MessageCircle size={16} />
                  Mesaj Gönder
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Load More or No Results Message */}
        {activeTab === 'neighbors' && displayedNeighbors.length > 0 && (
          <div className="mt-8 text-center">
            <button className="px-8 py-3 border-2 border-[#00833e] text-[#00833e] hover:bg-[#00833e]/5 font-medium rounded-lg transition-colors">
              Daha Fazla Yükle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
