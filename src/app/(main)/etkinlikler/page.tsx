'use client';

import { Calendar, Clock, MapPin, Plus, Search, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const mockEvents = [
  {
    id: '1',
    title: 'Komşu Kahvaltısı',
    description: 'Tüm komşular bir araya gelip sohbet edecek.',
    date: '15 Mar',
    dayName: 'Cmt',
    time: '10:00',
    location: 'Mahalle Parkı',
    coverImage: 'https://images.unsplash.com/photo-1585518419759-ab60cb0bf33f?w=500&h=300&fit=crop',
    attendeeCount: 24,
    isInterested: false,
  },
  {
    id: '2',
    title: 'Yoga Dersi - Sabah Seansı',
    description: 'Rahatlatıcı yoga dersi ile güne başlayın.',
    date: '16 Mar',
    dayName: 'Paz',
    time: '07:00',
    location: 'Mahalle Spor Salonu',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=300&fit=crop',
    attendeeCount: 18,
    isInterested: true,
  },
  {
    id: '3',
    title: 'Online Kitap Kulübü',
    description: 'Bu ay okuduğumuz kitap hakkında tartışma.',
    date: '18 Mar',
    dayName: 'Sal',
    time: '19:30',
    location: 'Çevrimiçi',
    coverImage: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=300&fit=crop',
    attendeeCount: 32,
    isInterested: false,
  },
  {
    id: '4',
    title: 'Çocuk Parkında Piknik',
    description: 'Çocuklar için eğlenceli bir öğleden sonra.',
    date: '22 Mar',
    dayName: 'Cmt',
    time: '14:00',
    location: 'Moda Parkı',
    coverImage: 'https://images.unsplash.com/photo-1552821081-7ffcfbf6ef14?w=500&h=300&fit=crop',
    attendeeCount: 42,
    isInterested: false,
  },
  {
    id: '5',
    title: 'Bahçe Tasarımı Atölyesi',
    description: 'Balkonunuzu güzelleştirmek için ipuçları.',
    date: '25 Mar',
    dayName: 'Sal',
    time: '15:00',
    location: 'Toplantı Salonu',
    coverImage: 'https://images.unsplash.com/photo-1585516031632-dfd21dbdc8b3?w=500&h=300&fit=crop',
    attendeeCount: 15,
    isInterested: true,
  },
  {
    id: '6',
    title: 'Mahalle Spor Turnuvası',
    description: 'Mahalle takımları arası futsal turnuvası.',
    date: '5 Nis',
    dayName: 'Cmt',
    time: '18:00',
    location: 'Spor Alanı',
    coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop',
    attendeeCount: 56,
    isInterested: false,
  },
];

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockEvents.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[900px] mx-auto px-4 py-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Etkinlikler</h1>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Etkinliklerim
              </button>
              <Link
                href="/etkinlikler/olustur"
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Etkinlik Oluştur
              </Link>
            </div>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Etkinlik ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Events List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium mb-1">Etkinlik bulunamadı</p>
            <p className="text-gray-400 text-sm">Yeni bir etkinlik oluşturabilirsiniz.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((event) => (
              <Link
                key={event.id}
                href={`/etkinlikler/${event.id}`}
                className="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image with date badge */}
                  <div className="relative sm:w-[200px] h-[160px] sm:h-auto flex-shrink-0">
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white rounded-lg shadow-md px-3 py-1.5 text-center">
                      <p className="text-xs font-bold text-emerald-600 uppercase">{event.dayName}</p>
                      <p className="text-lg font-bold text-gray-900 leading-tight">{event.date.split(' ')[0]}</p>
                      <p className="text-xs text-gray-500">{event.date.split(' ')[1]}</p>
                    </div>
                  </div>

                  {/* Event info */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-1">{event.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {event.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {event.attendeeCount} ilgileniyor
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={(e) => e.preventDefault()}
                        className={cn(
                          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                          event.isInterested
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        )}
                      >
                        {event.isInterested ? '✓ İlgileniyorum' : 'İlgileniyorum'}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
