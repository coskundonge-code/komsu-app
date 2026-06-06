'use client';

import { Clock, MapPin, Plus, Heart, Users, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images';
import { getEvents, rsvpEvent } from '@/lib/hooks/use-events';
import { useCurrentUser } from '@/lib/hooks/use-auth';

const MONTH_ABBREVIATIONS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

type Category = 'all' | 'social' | 'sports' | 'education' | 'culture' | 'music' | 'online';
type TimeFilter = 'all' | 'thisWeek' | 'thisMonth';
type SortOption = 'date' | 'popularity';

const CATEGORY_LABELS: Record<Exclude<Category, 'all'>, string> = {
  social: 'Sosyal',
  sports: 'Spor',
  education: 'Eğitim',
  culture: 'Kültür',
  music: 'Müzik',
  online: 'Çevrimiçi',
};

const TIME_FILTER_LABELS: Record<TimeFilter, string> = {
  all: 'Tümü',
  thisWeek: 'Bu Hafta',
  thisMonth: 'Bu Ay',
};

interface Event {
  id: string;
  title: string;
  date: string;
  day: number;
  month: number;
  time: string;
  location: string;
  coverImage: string;
  isInterested: boolean;
  category: Exclude<Category, 'all'>;
  interestedCount: number;
  attendees: number;
  organizerName: string;
  organizerImage: string;
  isOnline?: boolean;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: "Mahalle Temizlik Günü",
    date: '2026-03-12',
    day: 12,
    month: 2,
    time: '09:00',
    location: 'Mahalle Parkı',
    coverImage: getFeedImageUrl(100, 500, 350),
    isInterested: false,
    category: 'social',
    interestedCount: 31,
    attendees: 28,
    organizerName: 'Ayşe Demir',
    organizerImage: getFeedImageUrl(1, 40, 40),
  },
  {
    id: '2',
    title: 'Sabah Yoga Dersi',
    date: '2026-03-15',
    day: 15,
    month: 2,
    time: '07:00',
    location: 'Mahalle Spor Salonu',
    coverImage: getFeedImageUrl(101, 500, 350),
    isInterested: true,
    category: 'sports',
    interestedCount: 42,
    attendees: 38,
    organizerName: 'Zeynep Yıldız',
    organizerImage: getFeedImageUrl(2, 40, 40),
  },
  {
    id: '3',
    title: "Online Kitap Kulübü - 'Sabahat Kudret Boyacıoğlu'",
    date: '2026-03-18',
    day: 18,
    month: 2,
    time: '19:30',
    location: 'Çevrimiçi',
    coverImage: getFeedImageUrl(102, 500, 350),
    isInterested: false,
    category: 'culture',
    interestedCount: 18,
    attendees: 15,
    organizerName: 'Murat Kaya',
    organizerImage: getFeedImageUrl(3, 40, 40),
    isOnline: true,
  },
  {
    id: '4',
    title: 'Çocuklar için İlkbahar Festivali',
    date: '2026-03-22',
    day: 22,
    month: 2,
    time: '14:00',
    location: 'Moda Parkı',
    coverImage: getFeedImageUrl(103, 500, 350),
    isInterested: false,
    category: 'social',
    interestedCount: 45,
    attendees: 42,
    organizerName: 'Fatma Erdoğan',
    organizerImage: getFeedImageUrl(4, 40, 40),
  },
  {
    id: '5',
    title: 'Bahçe Tasarımı ve Peyzaj Atölyesi',
    date: '2026-03-25',
    day: 25,
    month: 2,
    time: '15:00',
    location: 'Toplantı Salonu',
    coverImage: getFeedImageUrl(104, 500, 350),
    isInterested: true,
    category: 'education',
    interestedCount: 28,
    attendees: 24,
    organizerName: 'Hasan Güzel',
    organizerImage: getFeedImageUrl(5, 40, 40),
  },
  {
    id: '6',
    title: 'Mahalle Futsal Turnuvası',
    date: '2026-04-05',
    day: 5,
    month: 3,
    time: '18:00',
    location: 'Spor Alanı',
    coverImage: getFeedImageUrl(105, 500, 350),
    isInterested: false,
    category: 'sports',
    interestedCount: 56,
    attendees: 50,
    organizerName: 'Ali Çetin',
    organizerImage: getFeedImageUrl(6, 40, 40),
  },
  {
    id: '7',
    title: 'Mahalle Konser Gecesi - Türk Müziği',
    date: '2026-04-10',
    day: 10,
    month: 3,
    time: '20:00',
    location: 'Toplum Merkezi',
    coverImage: getFeedImageUrl(106, 500, 350),
    isInterested: false,
    category: 'music',
    interestedCount: 67,
    attendees: 60,
    organizerName: 'Selin Korkmaz',
    organizerImage: getFeedImageUrl(7, 40, 40),
  },
  {
    id: '8',
    title: 'Komşu Kahvaltısı ve Sosyal Ağ Kurma',
    date: '2026-04-12',
    day: 12,
    month: 3,
    time: '10:00',
    location: 'Mahalle Kültür Merkezi',
    coverImage: getFeedImageUrl(107, 500, 350),
    isInterested: false,
    category: 'social',
    interestedCount: 32,
    attendees: 30,
    organizerName: 'Gül Şahin',
    organizerImage: getFeedImageUrl(8, 40, 40),
  },
];

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function isThisWeek(dateStr: string): boolean {
  const eventDate = new Date(dateStr);
  const today = new Date('2026-03-10');
  const weekStart = getWeekStart(today);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  return eventDate >= weekStart && eventDate <= weekEnd;
}

function isThisMonth(dateStr: string): boolean {
  const eventDate = new Date(dateStr);
  const today = new Date('2026-03-10');
  return eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear();
}

function mapDbEvent(e: any, i: number): Event {
  const d = new Date(e.start_date || e.created_at);
  const categoryMap: Record<string, Exclude<Category, 'all'>> = {
    social: 'social', sports: 'sports', education: 'education',
    culture: 'culture', music: 'music', online: 'online',
  };
  return {
    id: e.id,
    title: e.title,
    date: e.start_date?.split('T')[0] || new Date().toISOString().split('T')[0],
    day: d.getDate(),
    month: d.getMonth(),
    time: d.toTimeString().slice(0, 5),
    location: e.location || 'Mahalle',
    coverImage: e.cover_image || getFeedImageUrl(100 + i, 500, 350),
    isInterested: false,
    category: categoryMap[e.category] || 'social',
    interestedCount: e.attendee_count || 0,
    attendees: e.attendee_count || 0,
    organizerName: e.profiles?.full_name || 'Organizatör',
    organizerImage: getFeedImageUrl(i, 40, 40),
    isOnline: e.is_online || false,
  };
}

export default function EventsPage() {
  const { user } = useCurrentUser();
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<TimeFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [interested, setInterested] = useState<Record<string, boolean>>(
    mockEvents.reduce((acc, e) => ({ ...acc, [e.id]: e.isInterested }), {})
  );

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await getEvents({ upcoming: true, limit: 20 });
      if (!error && data && data.length > 0) {
        const mapped = data.map(mapDbEvent);
        setEvents(mapped);
        setInterested(mapped.reduce((acc: Record<string, boolean>, e: { id: string }) => ({ ...acc, [e.id]: false }), {}));
      }
    }
    fetchEvents();
  }, []);

  async function handleRsvp(eventId: string) {
    if (!user) return;
    const isCurrentlyInterested = interested[eventId];
    const newStatus = isCurrentlyInterested ? 'not_attending' : 'interested';
    setInterested(prev => ({ ...prev, [eventId]: !isCurrentlyInterested }));
    await rsvpEvent(eventId, user.id, newStatus);
  }

  const filtered = useMemo(() => {
    return events
      .filter((e) => {
        if (selectedTimeFilter === 'thisWeek' && !isThisWeek(e.date)) return false;
        if (selectedTimeFilter === 'thisMonth' && !isThisMonth(e.date)) return false;
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
  }, [events, searchQuery, selectedTimeFilter, sortBy]);

  const timeFilterCounts = useMemo(() => ({
    all: events.length,
    thisWeek: events.filter(e => isThisWeek(e.date)).length,
    thisMonth: events.filter(e => isThisMonth(e.date)).length,
  }), [events]);

  const handleInterested = (ev: React.MouseEvent, eventId: string) => {
    ev.preventDefault();
    handleRsvp(eventId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header with Title and Create Button */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-text-primary">Mahallenizde Neler Oluyor?</h1>
          <Link
            href="/etkinlikler/olustur"
            className="hidden sm:flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-bold text-sm"
          >
            <Plus className="w-5 h-5" />
            Etkinlik Oluştur
          </Link>
        </div>

        {/* Mobile Create Button */}
        <div className="sm:hidden mb-6">
          <Link
            href="/etkinlikler/olustur"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-hover transition-colors"
          >
            <Plus className="w-5 h-5" />
            Etkinlik Oluştur
          </Link>
        </div>

        {/* Time Filter Tabs */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-text-secondary mb-3">Zaman Filtresi</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(TIME_FILTER_LABELS) as TimeFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedTimeFilter(filter)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedTimeFilter === filter
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-surface text-text-secondary border border-border hover:border-primary'
                }`}
              >
                {TIME_FILTER_LABELS[filter]} <span className="ml-1 text-xs font-bold">({timeFilterCounts[filter]})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="mb-8 flex items-center gap-4">
          <p className="text-sm font-semibold text-text-secondary">Sırala:</p>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('date')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'date'
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-secondary border border-border hover:border-primary'
              }`}
            >
              Tarih
            </button>
            <button
              onClick={() => setSortBy('popularity')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'popularity'
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-secondary border border-border hover:border-primary'
              }`}
            >
              Popülerlik
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-1">Etkinlik bulunamadı</p>
            <p className="text-gray-400 text-sm">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event) => (
              <Link
                key={event.id}
                href={`/etkinlikler/${event.id}`}
                className="group flex flex-col h-full bg-surface rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Cover Image */}
                <div className="relative overflow-hidden h-48 bg-gray-200 flex-shrink-0">
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    width={500}
                    height={350}
                    unoptimized
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Date Badge */}
                  <div className="absolute bottom-3 left-3 bg-surface rounded-lg px-3 py-2 shadow-lg">
                    <div className="text-center">
                      <p className="text-xl font-bold text-primary leading-none">{event.day}</p>
                      <p className="text-xs font-medium text-gray-600">{MONTH_ABBREVIATIONS[event.month]}</p>
                    </div>
                  </div>

                  {/* Interest Count Badge */}
                  <div className="absolute top-3 right-3 bg-primary text-white rounded-full px-3 py-1.5 flex items-center gap-1 shadow-lg">
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span className="text-sm font-semibold">{event.interestedCount}</span>
                  </div>

                  {/* Online Badge */}
                  {event.isOnline && (
                    <div className="absolute top-3 left-3 bg-blue-500 text-white rounded-full px-3 py-1 text-xs font-semibold">
                      Çevrimiçi
                    </div>
                  )}
                </div>

                {/* Event Content */}
                <div className="flex flex-col flex-1 p-4">
                  {/* Title */}
                  <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-2">{event.title}</h3>

                  {/* Time and Location */}
                  <div className="space-y-2 mb-4 flex-1">
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <Clock className="w-4 h-4 flex-shrink-0 text-primary" />
                      <span className="font-medium">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <MapPin className="w-4 h-4 flex-shrink-0 text-primary" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>

                  {/* Organizer Info */}
                  <div className="border-t border-border pt-3 mb-4">
                    <p className="text-xs text-text-muted mb-2">Organize eden</p>
                    <div className="flex items-center gap-2">
                      <Image
                        src={event.organizerImage}
                        alt={event.organizerName}
                        width={28}
                        height={28}
                        unoptimized
                        className="w-7 h-7 rounded-full"
                      />
                      <span className="text-sm font-medium text-text-secondary">{event.organizerName}</span>
                    </div>
                  </div>

                  {/* Attendees and RSVP */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-xs text-text-muted"><span className="font-semibold text-text-secondary">{event.attendees}</span> katılıyor</span>
                    </div>
                  </div>

                  {/* RSVP Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRsvp(event.id); }}
                    className={`w-full mt-4 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      interested[event.id]
                        ? 'bg-primary text-white shadow-md hover:bg-primary-hover'
                        : 'bg-background text-primary border border-border hover:border-primary hover:bg-surface'
                    }`}
                  >
                    {interested[event.id] ? '✓ Katılıyorum' : 'Katılmak İçin Tıkla'}
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
