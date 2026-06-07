'use client';

import { toast } from '@/lib/utils/show-toast';

import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Share2,
  Heart,
  Check,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  CalendarPlus,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, use } from 'react';
import { getEventById, getEvents, rsvpEvent } from '@/lib/hooks/use-events';
import { useCurrentUser } from '@/lib/hooks/use-auth';

const CATEGORY_LABELS: Record<string, string> = {
  social: 'Sosyal',
  sports: 'Spor',
  education: 'Eğitim',
  culture: 'Kültür',
  music: 'Müzik',
  online: 'Çevrimiçi',
};

interface AttendeeRow {
  user_id: string;
  status: string | null;
  profiles?: { full_name: string | null; avatar_url: string | null } | null;
}

interface EventRow {
  id: string;
  organizer_id: string;
  title: string;
  description: string | null;
  location: string | null;
  lat: number | null;
  lng: number | null;
  start_date: string;
  end_date: string | null;
  cover_image: string | null;
  max_attendees: number | null;
  is_online: boolean | null;
  attendee_count: number | null;
  category: string | null;
  profiles?: { full_name: string | null; avatar_url: string | null } | null;
  event_attendees?: AttendeeRow[];
}

interface SimilarRow {
  id: string;
  title: string;
  start_date: string;
  location: string | null;
  cover_image: string | null;
  attendee_count: number | null;
  category: string | null;
}

function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

function categoryLabel(c: string | null | undefined): string | null {
  if (!c) return null;
  return CATEGORY_LABELS[c] ?? c;
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useCurrentUser();

  const [event, setEvent] = useState<EventRow | null>(null);
  const [attendees, setAttendees] = useState<AttendeeRow[]>([]);
  const [similar, setSimilar] = useState<SimilarRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<'joined' | 'interested' | 'none'>('none');
  const [rsvpSaving, setRsvpSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const { data, error } = await getEventById(id);
      if (cancelled) return;
      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const ev = data as EventRow;
      setEvent(ev);
      const att = Array.isArray(ev.event_attendees) ? ev.event_attendees : [];
      setAttendees(att);

      // Benzer etkinlikler: yaklaşan etkinliklerden, aynı kategori (varsa), kendisi hariç
      const { data: sim } = await getEvents({ upcoming: true, limit: 8 });
      if (!cancelled && Array.isArray(sim)) {
        const filtered = (sim as SimilarRow[])
          .filter((e) => e.id !== id && (!ev.category || e.category === ev.category))
          .slice(0, 3);
        setSimilar(filtered);
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Kullanıcının kendi RSVP durumunu gerçek katılımcı kaydından başlat
  useEffect(() => {
    if (!user) return;
    const mine = attendees.find((a) => a.user_id === user.id);
    if (mine) {
      setRsvpStatus(
        mine.status === 'attending' ? 'joined' : mine.status === 'interested' ? 'interested' : 'none'
      );
    }
  }, [user, attendees]);

  async function handleRsvp(next: 'joined' | 'interested' | 'none') {
    if (!user) {
      toast.error('Katılmak için giriş yapmalısınız');
      return;
    }
    const newStatus = next === 'joined' ? 'attending' : next === 'interested' ? 'interested' : 'not_attending';
    const prev = rsvpStatus;
    setRsvpStatus(next);
    setRsvpSaving(true);
    const { error } = await rsvpEvent(id, user.id, newStatus);
    setRsvpSaving(false);
    if (error) {
      setRsvpStatus(prev);
      toast.error('İşlem kaydedilemedi, tekrar deneyin');
    }
  }

  const handleShare = () => {
    if (!event) return;
    if (navigator.share) {
      navigator
        .share({
          title: event.title,
          text: `${event.title} etkinliğine katılmak ister misin?`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Etkinlik linki kopyalandı!');
    }
  };

  const handleAddToCalendar = () => {
    if (!event) return;
    const startDate = new Date(event.start_date);
    const endDate = event.end_date
      ? new Date(event.end_date)
      : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Mahallemiz//Mahallemiz//EN
BEGIN:VEVENT
UID:${event.id}@komsuu.app
DTSTAMP:${fmt(new Date())}
DTSTART:${fmt(startDate)}
DTEND:${fmt(endDate)}
SUMMARY:${event.title}
DESCRIPTION:${(event.description ?? '').substring(0, 200)}
LOCATION:${event.location ?? ''}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/\s+/g, '_')}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // --- Yükleniyor ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#00833e] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#404040] text-sm">Etkinlik yükleniyor…</p>
        </div>
      </div>
    );
  }

  // --- Bulunamadı ---
  if (notFound || !event) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center px-4">
        <div className="text-center">
          <Calendar className="w-14 h-14 text-[#8f8f8f] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#333] mb-2">Etkinlik bulunamadı</h1>
          <p className="text-[#404040] mb-6">Aradığınız etkinlik kaldırılmış veya hiç var olmamış olabilir.</p>
          <Link
            href="/etkinlikler"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00833e] hover:bg-[#006b32] text-white rounded-lg font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Etkinliklere Dön
          </Link>
        </div>
      </div>
    );
  }

  const start = new Date(event.start_date);
  const now = new Date();
  const isPast = start.getTime() < now.getTime();
  const daysUntil = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const timeText = start.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const endTimeText = event.end_date
    ? new Date(event.end_date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    : null;
  const attendeeCount = event.attendee_count ?? attendees.length;
  const spotsRemaining = event.max_attendees != null ? event.max_attendees - attendeeCount : null;
  const isFull = spotsRemaining !== null && spotsRemaining <= 0;
  const catLabel = categoryLabel(event.category);
  const organizerName = event.profiles?.full_name ?? 'Organizatör';

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#e0e0e0] py-3 sm:py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/etkinlikler" className="inline-flex items-center gap-2 text-[#00833e] hover:text-[#006b32] font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Etkinliklere Geri Dön</span>
            <span className="sm:hidden">Geri</span>
          </Link>
        </div>
      </div>

      {/* Cover Image with Overlay */}
      <div className="relative h-64 sm:h-96 bg-[#e0e0e0] overflow-hidden">
        {event.cover_image ? (
          <Image
            src={event.cover_image}
            alt={event.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#00833e]/15 via-[#f0f2f5] to-[#e0e0e0] flex items-center justify-center">
            <Calendar className="w-16 h-16 text-[#00833e]/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>

        {/* Badges */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex gap-2">
          {catLabel && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white text-[#00833e] text-sm font-semibold">
              {catLabel}
            </span>
          )}
          {event.is_online && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500 text-white text-sm font-semibold">
              Çevrimiçi
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Title Card */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-6 sm:p-8 -mt-16 sm:-mt-20 relative z-10 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-4xl font-bold text-[#333] mb-1 sm:mb-2 leading-tight">
                {event.title}
              </h1>
              <p className="text-sm sm:text-base text-[#404040]">
                Tarafından düzenleniyor: <span className="font-semibold text-[#333]">{organizerName}</span>
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleShare}
                className="flex-1 sm:flex-initial p-2 sm:p-3 bg-[#f0f2f5] hover:bg-[#e0e0e0] rounded-lg transition-colors flex items-center justify-center"
                title="Paylaş"
              >
                <Share2 className="w-5 h-5 text-[#404040]" />
              </button>
              <button
                onClick={handleAddToCalendar}
                className="flex-1 sm:flex-initial p-2 sm:p-3 bg-[#f0f2f5] hover:bg-[#e0e0e0] rounded-lg transition-colors flex items-center justify-center"
                title="Takvime Ekle"
              >
                <CalendarPlus className="w-5 h-5 text-[#404040]" />
              </button>
            </div>
          </div>

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-[#e0e0e0]">
            <div className="flex gap-3 sm:gap-4">
              <Calendar className="w-5 h-5 text-[#00833e] flex-shrink-0 mt-1" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-[#8f8f8f] font-medium">Tarih ve Saat</p>
                <p className="text-base sm:text-lg font-semibold text-[#333] truncate">
                  {start.toLocaleDateString('tr-TR')}
                </p>
                <p className="text-sm text-[#404040]">{endTimeText ? `${timeText} - ${endTimeText}` : timeText}</p>
              </div>
            </div>
            {event.location && (
              <div className="flex gap-3 sm:gap-4">
                <MapPin className="w-5 h-5 text-[#00833e] flex-shrink-0 mt-1" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-[#8f8f8f] font-medium">Konum</p>
                  <p className="text-base sm:text-lg font-semibold text-[#333] truncate">
                    {event.location}
                  </p>
                  {event.is_online && <p className="text-sm text-[#404040]">Çevrimiçi etkinlik</p>}
                </div>
              </div>
            )}
            <div className="flex gap-3 sm:gap-4">
              <Users className="w-5 h-5 text-[#00833e] flex-shrink-0 mt-1" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-[#8f8f8f] font-medium">Katılımcılar</p>
                <p className="text-base sm:text-lg font-semibold text-[#333]">
                  {event.max_attendees != null ? `${attendeeCount}/${event.max_attendees}` : attendeeCount}
                </p>
                {spotsRemaining !== null && (
                  <p className="text-sm text-[#404040]">
                    {spotsRemaining > 0 ? `${spotsRemaining} yer kaldı` : 'Dolu'}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4">
              <Clock className="w-5 h-5 text-[#00833e] flex-shrink-0 mt-1" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-[#8f8f8f] font-medium">Durumu</p>
                <p className={`text-base sm:text-lg font-semibold ${isPast ? 'text-[#8f8f8f]' : 'text-[#00833e]'}`}>
                  {isPast ? 'Geçti' : 'Yaklaşıyor'}
                </p>
                {!isPast && (
                  <p className="text-sm text-[#404040]">
                    {daysUntil <= 0 ? 'Bugün' : `${daysUntil} gün kaldı`}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleRsvp(rsvpStatus === 'joined' ? 'none' : 'joined')}
              disabled={rsvpSaving || (isFull && rsvpStatus !== 'joined')}
              className={`py-2 sm:py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                rsvpStatus === 'joined'
                  ? 'bg-[#d1fae5] text-[#00833e] hover:bg-[#a7dbb8]'
                  : isFull
                  ? 'bg-[#e0e0e0] text-[#8f8f8f] cursor-not-allowed'
                  : 'bg-[#00833e] hover:bg-[#006b32] text-white'
              }`}
            >
              {rsvpStatus === 'joined' && <Check className="w-4 h-4 sm:w-5 sm:h-5" />}
              <span className="text-sm sm:text-base">{rsvpStatus === 'joined' ? 'Katılıyorum' : isFull ? 'Dolu' : 'Katılacağım'}</span>
            </button>
            <button
              onClick={() => handleRsvp(rsvpStatus === 'interested' ? 'none' : 'interested')}
              disabled={rsvpSaving}
              className={`py-2 sm:py-3 px-4 rounded-lg font-semibold transition-all border-2 flex items-center justify-center gap-2 ${
                rsvpStatus === 'interested'
                  ? 'border-[#00833e] bg-[#e6f4ec] text-[#00833e] hover:bg-[#d1fae5]'
                  : 'border-[#e0e0e0] text-[#404040] hover:border-[#00833e] bg-white'
              }`}
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" fill={rsvpStatus === 'interested' ? 'currentColor' : 'none'} />
              <span className="text-sm sm:text-base">İlgileniyorum</span>
            </button>
            <button
              onClick={() => handleRsvp('none')}
              disabled={rsvpSaving || rsvpStatus === 'none'}
              className={`py-2 sm:py-3 px-4 rounded-lg font-semibold transition-all border-2 flex items-center justify-center gap-2 ${
                rsvpStatus === 'none'
                  ? 'border-[#e0e0e0] text-[#8f8f8f] bg-white cursor-not-allowed'
                  : 'border-[#e0e0e0] text-[#404040] hover:border-red-300 bg-white'
              }`}
            >
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Katılmayacağım</span>
            </button>
          </div>

          {/* RSVP Status Display */}
          {rsvpStatus !== 'none' && (
            <div className={`p-4 rounded-lg mt-6 flex items-center gap-2 ${
              rsvpStatus === 'joined'
                ? 'bg-[#d1fae5] text-[#00833e]'
                : 'bg-[#fef3c7] text-[#d97706]'
            }`}>
              {rsvpStatus === 'joined' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm font-semibold">
                {rsvpStatus === 'joined'
                  ? 'Bu etkinliğe katılacağınız kaydedildi'
                  : 'Bu etkinlikle ilgilendiğiniz kaydedildi'}
              </span>
            </div>
          )}
        </div>

        {/* Description Section */}
        {event.description && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-6 sm:p-8 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#333] mb-4">Etkinlik Hakkında</h2>
            <p className="text-sm sm:text-base text-[#404040] leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>
        )}

        {/* Organizer Section */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-6 sm:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#333] mb-6">Organizatör</h2>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {event.profiles?.avatar_url ? (
              <Image
                src={event.profiles.avatar_url}
                alt={organizerName}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                unoptimized
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#d1fae5] text-[#00833e] flex items-center justify-center text-2xl font-bold flex-shrink-0">
                {getInitials(organizerName)}
              </div>
            )}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-bold text-[#333] mb-3">
                {organizerName}
              </h3>
              <Link href={`/profil/${event.organizer_id}`}>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  Profili Ziyaret Et
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Attendees Section */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-6 sm:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#333] mb-6">
            Katılımcılar ({attendees.length})
          </h2>
          {attendees.length === 0 ? (
            <p className="text-sm sm:text-base text-[#8f8f8f] py-2">
              Henüz katılımcı yok. İlk katılan siz olun!
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {attendees.map((attendee) => {
                const name = attendee.profiles?.full_name ?? 'Komşu';
                return (
                  <Link key={attendee.user_id} href={`/profil/${attendee.user_id}`} className="text-center group">
                    <div className="relative mb-2">
                      {attendee.profiles?.avatar_url ? (
                        <Image
                          src={attendee.profiles.avatar_url}
                          alt={name}
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-full object-cover mx-auto group-hover:opacity-80 transition-opacity"
                          unoptimized
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-[#d1fae5] text-[#00833e] flex items-center justify-center text-lg font-bold mx-auto group-hover:opacity-80 transition-opacity">
                          {getInitials(name)}
                        </div>
                      )}
                    </div>
                    <p className="font-semibold text-[#333] text-sm truncate group-hover:text-[#00833e]">{name}</p>
                    <p className="text-xs text-[#8f8f8f]">
                      {attendee.status === 'attending' ? '✓ Katılıyor' : attendee.status === 'interested' ? '♡ İlgileniyor' : ''}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Similar Events Section */}
        {similar.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#333] mb-6">Benzer Etkinlikler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {similar.map((ev) => {
                const sd = new Date(ev.start_date);
                return (
                  <Link
                    key={ev.id}
                    href={`/etkinlikler/${ev.id}`}
                    className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <div className="relative h-40 sm:h-48 overflow-hidden bg-[#e0e0e0]">
                      {ev.cover_image ? (
                        <Image
                          src={ev.cover_image}
                          alt={ev.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00833e]/15 to-[#e0e0e0] flex items-center justify-center">
                          <Calendar className="w-10 h-10 text-[#00833e]/40" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="font-bold text-[#333] text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-[#00833e]">
                        {ev.title}
                      </h3>
                      <div className="space-y-1 text-xs sm:text-sm">
                        <div className="flex items-center gap-2 text-[#8f8f8f]">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>{sd.toLocaleDateString('tr-TR')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#8f8f8f]">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span>{sd.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {ev.location && (
                          <div className="flex items-center gap-2 text-[#8f8f8f]">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{ev.location}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t border-[#e0e0e0] text-xs sm:text-sm text-[#404040]">
                        <Users className="inline w-4 h-4 mr-1" />
                        {ev.attendee_count ?? 0} katılımcı
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
