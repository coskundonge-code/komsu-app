'use client';

import { Clock, MapPin, Plus, Search, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const MONTH_ABBREVIATIONS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

type Category = 'all' | 'social' | 'sports' | 'education' | 'culture' | 'music';
type SortOption = 'date' | 'popularity';

const CATEGORY_LABELS: Record<Category, string> = {
  all: 'Tümü',
  social: 'Sosyal',
  sports: 'Spor',
  education: 'Eğitim',
  culture: 'Kültür',
  music: 'Müzik',
};

interface Event {
  id: string;
  title: string;
  date: string; // Format: "2026-03-15"
  day: number;
  month: number;
  time: string;
  location: string;
  coverImage: string;
  isInterested: boolean;
  category: Category;
  interestedCount: number;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Komşu Kahvaltısı ve Sosyal Buluşma',
    date: '2026-03-15',
    day: 15,
    month: 2,
    time: '10:00',
    location: 'Mahalle Parkı',
    coverImage: 'https://picsum.photos/500/350?random=45',
    isInterested: false,
    category: 'social',
    interestedCount: 24,
  },
  {
    id: '2',
    title: 'Sabah Yoga Dersi',
    date: '2026-03-16',
    day: 16,
    month: 2,
    time: '07:00',
    location: 'Mahalle Spor Salonu',
    coverImage: 'https://picsum.photos/500/350?random=46',
    isInterested: true,
    category: 'sports',
    interestedCount: 42,
  },
  {
    id: '3',
    title: 'Online Kitap Kulübü Tartışması',
    date: '2026-03-18',
    day: 18,
    month: 2,
    time: '19:30',
    location: 'Çevrimiçi',
    coverImage: 'https://picsum.photos/500/350?random=47',
    isInterested: false,
    category: 'culture',
    interestedCount: 18,
  },
  {
    id: '4',
    title: 'Çocuklar için Piknik Günü',
    date: '2026-03-22',
    day: 22,
    month: 2,
    time: '14:00',
    location: 'Moda Parkı',
    coverImage: 'https://picsum.photos/500/350?random=48',
    isInterested: false,
    category: 'social',
    interestedCount: 35,
  },
  {
    id: '5',
    title: 'Bahçe Tasarımı ve Peyzaj Atölyesi',
    date: '2026-03-25',
    day: 25,
    month: 2,
    time: '15:00',
    location: 'Toplantı Salonu',
    coverImage: 'https://picsum.photos/500/350?random=49',
    isInterested: true,
    category: 'education',
    interestedCount: 28,
  },
  {
    id: '6',
    title: 'Mahalle Futsal Turnuvası',
    date: '2026-04-05',
    day: 5,
    month: 3,
    time: '18:00',
    location: 'Spor Alanı',
    coverImage: 'https://picsum.photos/500/350?random=50',
    isInterested: false,
    category: 'sports',
    interestedCount: 56,
  },
  {
    id: '7',
    title: 'Mahalle Konser Gecesi',
    date: '2026-04-10',
    day: 10,
    month: 3,
    time: '20:00',
    location: 'Toplum Merkezi',
    coverImage: 'https://picsum.photos/500/350?random=51',
    isInterested: false,
    category: 'music',
    interestedCount: 67,
  },
];

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [interested, setInterested] = useState<Record<string, boolean>>(
    mockEvents.reduce((acc, e) => ({ ...acc, [e.id]: e.isInterested }), {})
  );
  const [showMine, setShowMine] = useState(false);

  const filtered = mockEvents
    .filter((e) => {
      if (showMine && !interested[e.id]) return false;
      if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
      return e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return b.interestedCount - a.interestedCount;
      }
    });

  const handleInterested = (e: React.MouseEvent, eventId: string) => {
    e.preventDefault();
    setInterested((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tüm etkinlikleri ara"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-[#e0e0e0] rounded-full text-base focus:outline-none focus:ring-2 focus:ring-[#00833e] focus:border-transparent"
            />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Yakınındaki Etkinlikler</h2>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <Link
            href="/etkinlikler/olustur"
            className="flex items-center gap-2 px-6 py-2.5 bg-[#333] text-white rounded-full text-sm font-medium hover:bg-[#1a1a1a] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Etkinlik Oluştur
          </Link>
          <button
            onClick={() => setShowMine(!showMine)}
            className={`px-6 py-2.5 border-2 rounded-full text-sm font-medium transition-colors ${
              showMine
                ? 'bg-[#00833e] text-white border-[#00833e]'
                : 'border-gray-400 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Etkinliklerim
          </button>
        </div>

        {/* Category Filter Buttons */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-gray-700 mb-3">Kategori</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(CATEGORY_LABELS) as Category[]).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#00833e] text-white'
                    : 'bg-[#f0f2f5] text-gray-700 hover:bg-gray-300'
                }`}
              >
                {CATEGORY_LABELS[category]}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="mb-8 flex items-center gap-4">
          <p className="text-sm font-semibold text-gray-700">Sırala:</p>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('date')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'date'
                  ? 'bg-[#00833e] text-white'
                  : 'bg-[#f0f2f5] text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tarih
            </button>
            <button
              onClick={() => setSortBy('popularity')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'popularity'
                  ? 'bg-[#00833e] text-white'
                  : 'bg-[#f0f2f5] text-gray-700 hover:bg-gray-300'
              }`}
            >
              Popülerlik
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 font-medium mb-1">Etkinlik bulunamadı</p>
            <p className="text-gray-400 text-sm">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((event) => (
              <Link
                key={event.id}
                href={`/etkinlikler/${event.id}`}
                className="group flex flex-col h-full rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative overflow-hidden rounded-lg mb-3 flex-shrink-0 h-48 bg-gray-200">
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    width={500}
                    height={350}
                    unoptimized
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Date Badge */}
                  <div className="absolute bottom-3 left-3 bg-white rounded-lg px-2.5 py-2 shadow-md">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 leading-none">{event.day}</p>
                      <p className="text-xs font-medium text-gray-600">{MONTH_ABBREVIATIONS[event.month]}</p>
                    </div>
                  </div>

                  {/* Interested Count Badge */}
                  <div className="absolute top-3 right-3 bg-[#00833e] text-white rounded-full px-3 py-1 flex items-center gap-1 shadow-md">
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span className="text-sm font-medium">{event.interestedCount}</span>
                  </div>
                </div>

                {/* Event Info */}
                <div className="flex flex-col flex-1 bg-white rounded-lg -mt-1 pt-4 px-4 pb-4">
                  <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>

                  {/* Time and Location */}
                  <div className="space-y-1 mb-4 flex-1">
                    <div className="flex items-center gap-2 text-sm text-[#8f8f8f]">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#8f8f8f]">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {/* Interested Button */}
                  <button
                    onClick={(e) => handleInterested(e, event.id)}
                    className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium border-2 transition-colors ${
                      interested[event.id]
                        ? 'bg-[#00833e] text-white border-[#00833e]'
                        : 'border-[#e0e0e0] text-gray-700 hover:border-[#00833e] hover:text-[#00833e]'
                    }`}
                  >
                    {interested[event.id] ? '✓ İlgileniyorum' : 'İlgileniyorum?'}
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
