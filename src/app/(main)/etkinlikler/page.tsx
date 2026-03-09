'use client';

import { Clock, MapPin, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const MONTH_ABBREVIATIONS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

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
    coverImage: 'https://images.unsplash.com/photo-1585518419759-ab60cb0bf33f?w=500&h=350&fit=crop',
    isInterested: false,
  },
  {
    id: '2',
    title: 'Sabah Yoga Dersi',
    date: '2026-03-16',
    day: 16,
    month: 2,
    time: '07:00',
    location: 'Mahalle Spor Salonu',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=350&fit=crop',
    isInterested: true,
  },
  {
    id: '3',
    title: 'Online Kitap Kulübü Tartışması',
    date: '2026-03-18',
    day: 18,
    month: 2,
    time: '19:30',
    location: 'Çevrimiçi',
    coverImage: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=350&fit=crop',
    isInterested: false,
  },
  {
    id: '4',
    title: 'Çocuklar için Piknik Günü',
    date: '2026-03-22',
    day: 22,
    month: 2,
    time: '14:00',
    location: 'Moda Parkı',
    coverImage: 'https://images.unsplash.com/photo-1552821081-7ffcfbf6ef14?w=500&h=350&fit=crop',
    isInterested: false,
  },
  {
    id: '5',
    title: 'Bahçe Tasarımı ve Peyzaj Atölyesi',
    date: '2026-03-25',
    day: 25,
    month: 2,
    time: '15:00',
    location: 'Toplantı Salonu',
    coverImage: 'https://images.unsplash.com/photo-1585516031632-dfd21dbdc8b3?w=500&h=350&fit=crop',
    isInterested: true,
  },
  {
    id: '6',
    title: 'Mahalle Futsal Turnuvası',
    date: '2026-04-05',
    day: 5,
    month: 3,
    time: '18:00',
    location: 'Spor Alanı',
    coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=350&fit=crop',
    isInterested: false,
  },
];

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [interested, setInterested] = useState<Record<string, boolean>>(
    mockEvents.reduce((acc, e) => ({ ...acc, [e.id]: e.isInterested }), {})
  );

  const filtered = mockEvents.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Yakınındaki Etkinlikler</h2>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <Link
            href="/etkinlikler/olustur"
            className="flex items-center gap-2 px-6 py-2.5 bg-[#333] text-white rounded-full text-sm font-medium hover:bg-[#1a1a1a] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Etkinlik Oluştur
          </Link>
          <button className="px-6 py-2.5 border-2 border-gray-400 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
            Etkinliklerim
          </button>
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
                className="group flex flex-col h-full"
              >
                <div className="relative overflow-hidden rounded-lg mb-3 flex-shrink-0 h-48 bg-gray-200">
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                  />
                  {/* Date Badge */}
                  <div className="absolute bottom-3 left-3 bg-white rounded-lg px-2.5 py-2 shadow-md">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 leading-none">{event.day}</p>
                      <p className="text-xs font-medium text-gray-600">{MONTH_ABBREVIATIONS[event.month]}</p>
                    </div>
                  </div>
                </div>

                {/* Event Info */}
                <div className="flex flex-col flex-1">
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
                        : 'border-[#e0e0e0] text-gray-700 hover:border-[#333] hover:text-gray-900'
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
