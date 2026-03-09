'use client';

import { EventCard } from '@/components/events/event-card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Grid3x3,
  List,
  Plus,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const mockEvents = [
  {
    id: '1',
    title: 'Komşu Kahvaltısı',
    description: 'Mahallede tüm komşular bir araya gelip sohbet edecek ve lezzetli bir kahvaltı yapacağız.',
    date: new Date(2026, 2, 15, 10, 0),
    location: 'Mahalle Parkı',
    coverImage: 'https://images.unsplash.com/photo-1585518419759-ab60cb0bf33f?w=500&h=300&fit=crop',
    organizer: {
      name: 'Ayşe Yılmaz',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    },
    attendeeCount: 24,
    maxAttendees: 50,
    isOnline: false,
  },
  {
    id: '2',
    title: 'Yoga Dersi - Sabah Seansı',
    description: 'Rahatlatıcı yoga dersi ile günü en iyi şekilde başlayın. Tüm seviyeler için uygun.',
    date: new Date(2026, 2, 16, 7, 0),
    location: 'Mahalle Spor Salonu',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=300&fit=crop',
    organizer: {
      name: 'Fatih Demir',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    },
    attendeeCount: 18,
    maxAttendees: 20,
    isOnline: false,
  },
  {
    id: '3',
    title: 'Online Kitap Kulübü Toplantısı',
    description: 'Bu ay okuduğumuz kitap hakkında tartışacağız. "Simavi Kütüphanesi" üzerine konuşma yapılacak.',
    date: new Date(2026, 2, 18, 19, 30),
    location: 'Çevrimiçi',
    coverImage: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=300&fit=crop',
    organizer: {
      name: 'Zeynep Kaya',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    },
    attendeeCount: 32,
    maxAttendees: undefined,
    isOnline: true,
  },
  {
    id: '4',
    title: 'Çocuk Oyun Parkında Piknik',
    description: 'Çocuklar için eğlenceli bir öğleden sonra. Oyunlar, çizgi roman ve eğlencelendirme.',
    date: new Date(2026, 2, 22, 14, 0),
    location: 'Mahalle Parkı - Çocuk Bölümü',
    coverImage: 'https://images.unsplash.com/photo-1552821081-7ffcfbf6ef14?w=500&h=300&fit=crop',
    organizer: {
      name: 'Meral Çetin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    },
    attendeeCount: 42,
    maxAttendees: 60,
    isOnline: false,
  },
  {
    id: '5',
    title: 'Bahçe Tasarımı Atölyesi',
    description: 'Balkonunuzu ve bahçenizi daha güzel hale getirmek için ipuçları ve teknikler öğrenin.',
    date: new Date(2026, 2, 25, 15, 0),
    location: 'Mahalle Toplantı Salonu',
    coverImage: 'https://images.unsplash.com/photo-1585516031632-dfd21dbdc8b3?w=500&h=300&fit=crop',
    organizer: {
      name: 'Hakan Yağız',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    },
    attendeeCount: 15,
    maxAttendees: 25,
    isOnline: false,
  },
  {
    id: '6',
    title: 'Komşu Spor Turnuvası',
    description: 'Mahalle takımları arasında futsal turnuvası. Herkes katılabilir, takım oluşturabilirsiniz.',
    date: new Date(2026, 3, 5, 18, 0),
    location: 'Mahalle Spor Alanı',
    coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop',
    organizer: {
      name: 'Emre Kılıç',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
    },
    attendeeCount: 56,
    maxAttendees: 100,
    isOnline: false,
  },
];

export default function EventsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  const now = new Date();
  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const isUpcoming = event.date > now;

    if (activeTab === 'upcoming') {
      return matchesSearch && isUpcoming;
    } else {
      return matchesSearch && !isUpcoming;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Etkinlikler</h1>
            <Link href="/etkinlikler/olustur">
              <Button className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Etkinlik Oluştur
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Etkinlik ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Tabs and Controls */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                  activeTab === 'upcoming'
                    ? 'text-emerald-600 border-emerald-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Yaklaşan Etkinlikler
                </div>
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                  activeTab === 'past'
                    ? 'text-emerald-600 border-emerald-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                Geçmiş Etkinlikler
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-emerald-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-emerald-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'upcoming'
                ? 'Yaklaşan etkinlik bulunamadı'
                : 'Geçmiş etkinlik bulunamadı'}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'upcoming'
                ? 'Yeni etkinlikler oluşturulmadı henüz.'
                : 'Henüz katılmış etkinlik yok.'}
            </p>
            {activeTab === 'upcoming' && (
              <Link href="/etkinlikler/olustur">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  İlk Etkinliği Oluştur
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
