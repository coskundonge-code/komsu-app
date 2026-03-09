'use client';

import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Share2,
  MessageCircle,
  Heart,
  Check,
  Clock,
  Bookmark,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const mockEvent = {
  id: '1',
  title: 'Mahalle Kahvaltısı ve Sosyal Buluşma',
  description: `Komşu uygulamasının organizasyonunda, mahallede yaşayan tüm komşuların bir araya gelip sohbet edebileceği, birbirini tanıyabileceği ve lezzetli bir kahvaltı yapabileceği unutulmaz bir etkinlik!

Taze ekmek, peynir, zeytin, domates, salatalık, reçel, tereyağı, çay, kahve ve daha birçok lezzetlilik hazırlanacak. Etkinlik tamamen ücretsiz ve herkese açık.

Aileleriniz, dostlarınız ve komşularınız ile gelmeniz çok hoş olacak. Mahalle coğrafyasından bağımsız olarak herkesin katılabileceği sosyal bir aktivite.`,
  date: new Date(2026, 2, 15, 10, 0),
  time: '10:00 - 12:00',
  location: 'Mahalle Parkı, Açık Alanı',
  neighborhood: 'Fatih Mahallesi, İstanbul',
  coordinates: { lat: 41.0082, lng: 28.9784 },
  coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop',
  organizer: {
    id: '1',
    name: 'Ayşe Yılmaz',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    bio: 'Mahalle temsilcisi ve sosyal aktiviteler koordinatörü',
    verified: true,
  },
  attendeeCount: 45,
  interestedCount: 12,
  maxAttendees: 100,
  isOnline: false,
  category: 'Sosyal',
  attendees: [
    { id: '1', name: 'Fatih Demir', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', status: 'joined' },
    { id: '2', name: 'Zeynep Kaya', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', status: 'interested' },
    { id: '3', name: 'Meral Çetin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4', status: 'joined' },
    { id: '4', name: 'Hakan Yağız', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5', status: 'joined' },
  ],
  comments: [
    {
      id: '1',
      author: 'Fatih Demir',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
      text: 'Harika bir etkinlik! Herkes davetlidir, lütfen katılın! Mahallede daha çok birbirini tanımamız gerekiyor.',
      timestamp: new Date(2026, 2, 10),
      likes: 5,
    },
    {
      id: '2',
      author: 'Zeynep Kaya',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
      text: 'Ben ve ailelerim kesinlikle geleceğiz. Çocuklar için de aktiviteler var mı?',
      timestamp: new Date(2026, 2, 11),
      likes: 3,
    },
    {
      id: '3',
      author: 'Ayşe Yılmaz',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      text: 'Evet Zeynep, çocuklar için boyama etkinliği ve oyun alanı organize ettim. Herkes eğlenecek ve keyifli zaman geçirecek!',
      timestamp: new Date(2026, 2, 11),
      likes: 8,
    },
  ],
};

const similarEvents = [
  {
    id: '2',
    title: 'Spor Turnuvası',
    date: '2026-03-22',
    time: '14:00',
    location: 'Spor Alanı',
    coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop',
    attendeeCount: 32,
  },
  {
    id: '3',
    title: 'Kitap Kulübü Tartışması',
    date: '2026-03-25',
    time: '19:00',
    location: 'Toplantı Salonu',
    coverImage: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=500&h=300&fit=crop',
    attendeeCount: 18,
  },
  {
    id: '4',
    title: 'Yoga ve Meditasyon Dersi',
    date: '2026-04-02',
    time: '07:00',
    location: 'Mahalle Parkı',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop',
    attendeeCount: 24,
  },
];

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [isJoined, setIsJoined] = useState(false);
  const [isInterested, setIsInterested] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(mockEvent.comments);

  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: String(comments.length + 1),
        author: 'Sizin Adınız',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=99',
        text: commentText,
        timestamp: new Date(),
        likes: 0,
      };
      setComments([...comments, newComment]);
      setCommentText('');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: mockEvent.title,
        text: `${mockEvent.title} etkinliğine katılmak ister misin?`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Etkinlik linki kopyalandı!');
    }
  };

  const handleAddToCalendar = () => {
    const event = mockEvent;
    const startDate = new Date(event.date);
    const endDate = new Date(event.date);
    const [hours, minutes] = event.time.split(' - ')[1].split(':');
    endDate.setHours(parseInt(hours), parseInt(minutes));

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//KomşuApp//KomşuApp//EN
BEGIN:VEVENT
UID:${event.id}@komsuu.app
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${event.title}
DESCRIPTION:${event.description.substring(0, 100)}...
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/\s+/g, '_')}.ics`;
    link.click();
  };

  const spotsRemaining = mockEvent.maxAttendees ? mockEvent.maxAttendees - mockEvent.attendeeCount : null;
  const isFull = spotsRemaining !== null && spotsRemaining <= 0;

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
        <Image
          src={mockEvent.coverImage}
          alt={mockEvent.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white text-[#00833e] text-sm font-semibold">
            {mockEvent.category}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Title Card */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-6 sm:p-8 -mt-16 sm:-mt-20 relative z-10 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-4xl font-bold text-[#333] mb-1 sm:mb-2 leading-tight">
                {mockEvent.title}
              </h1>
              <p className="text-sm sm:text-base text-[#404040]">
                Tarafından düzenleniyor: <span className="font-semibold text-[#333]">{mockEvent.organizer.name}</span>
                {mockEvent.organizer.verified && <span className="ml-1">✓</span>}
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
                onClick={() => setIsSaved(!isSaved)}
                className={`flex-1 sm:flex-initial p-2 sm:p-3 rounded-lg transition-colors flex items-center justify-center ${
                  isSaved
                    ? 'bg-[#d1fae5] text-[#00833e]'
                    : 'bg-[#f0f2f5] hover:bg-[#e0e0e0] text-[#404040]'
                }`}
                title="Kaydet"
              >
                <Bookmark className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} />
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
                  {mockEvent.date.toLocaleDateString('tr-TR')}
                </p>
                <p className="text-sm text-[#404040]">{mockEvent.time}</p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4">
              <MapPin className="w-5 h-5 text-[#00833e] flex-shrink-0 mt-1" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-[#8f8f8f] font-medium">Konum</p>
                <p className="text-base sm:text-lg font-semibold text-[#333] truncate">
                  {mockEvent.location}
                </p>
                <p className="text-sm text-[#404040] truncate">{mockEvent.neighborhood}</p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4">
              <Users className="w-5 h-5 text-[#00833e] flex-shrink-0 mt-1" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-[#8f8f8f] font-medium">Katılımcılar</p>
                <p className="text-base sm:text-lg font-semibold text-[#333]">
                  {mockEvent.attendeeCount}/{mockEvent.maxAttendees}
                </p>
                <p className="text-sm text-[#404040]">
                  {spotsRemaining && spotsRemaining > 0 ? `${spotsRemaining} yer kaldı` : 'Dolu'}
                </p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4">
              <Clock className="w-5 h-5 text-[#00833e] flex-shrink-0 mt-1" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-[#8f8f8f] font-medium">Durumu</p>
                <p className="text-base sm:text-lg font-semibold text-[#00833e]">Yaklaşıyor</p>
                <p className="text-sm text-[#404040]">5 gün kaldı</p>
              </div>
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="mb-6 sm:mb-8 p-4 bg-[#f0f2f5] rounded-lg">
            <p className="text-sm sm:text-base text-[#333]">
              <span className="font-bold text-[#00833e]">{mockEvent.attendeeCount}</span> kişi katılacak, <span className="font-bold text-[#00833e]">{mockEvent.interestedCount}</span> kişi ilgileniyor
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setIsJoined(!isJoined)}
              disabled={isFull && !isJoined}
              className={`py-2 sm:py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                isJoined
                  ? 'bg-[#d1fae5] text-[#00833e] hover:bg-[#a7dbb8]'
                  : isFull
                  ? 'bg-[#e0e0e0] text-[#8f8f8f] cursor-not-allowed'
                  : 'bg-[#00833e] hover:bg-[#006b32] text-white'
              }`}
            >
              {isJoined && <Check className="w-4 h-4 sm:w-5 sm:h-5" />}
              <span className="text-sm sm:text-base">{isJoined ? 'Katılıyorum' : isFull ? 'Dolu' : 'Katılacağım'}</span>
            </button>
            <button
              onClick={() => setIsInterested(!isInterested)}
              className={`py-2 sm:py-3 px-4 rounded-lg font-semibold transition-all border-2 flex items-center justify-center gap-2 ${
                isInterested
                  ? 'border-[#00833e] bg-[#e6f4ec] text-[#00833e] hover:bg-[#d1fae5]'
                  : 'border-[#e0e0e0] text-[#404040] hover:border-[#00833e] bg-white'
              }`}
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" fill={isInterested ? 'currentColor' : 'none'} />
              <span className="text-sm sm:text-base">İlgileniyorum</span>
            </button>
            <button
              onClick={handleAddToCalendar}
              className="py-2 sm:py-3 px-4 rounded-lg font-semibold transition-all border-2 border-[#e0e0e0] text-[#404040] hover:border-[#00833e] bg-white flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Takvime Ekle</span>
            </button>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-6 sm:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#333] mb-4">Etkinlik Hakkında</h2>
          <p className="text-sm sm:text-base text-[#404040] leading-relaxed whitespace-pre-line">
            {mockEvent.description}
          </p>
        </div>

        {/* Organizer Section */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-6 sm:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#333] mb-6">Organizatör</h2>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <Image
              src={mockEvent.organizer.avatar}
              alt={mockEvent.organizer.name}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h3 className="text-lg sm:text-xl font-bold text-[#333]">
                  {mockEvent.organizer.name}
                </h3>
                {mockEvent.organizer.verified && (
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-[#00833e] text-white rounded-full text-xs">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base text-[#404040] mb-4">
                {mockEvent.organizer.bio}
              </p>
              <Link href={`/profil/1`}>
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
            Katılımcılar ({mockEvent.attendees.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockEvent.attendees.map((attendee) => (
              <Link key={attendee.id} href={`/profil/${attendee.id}`} className="text-center group">
                <div className="relative mb-2">
                  <Image
                    src={attendee.avatar}
                    alt={attendee.name}
                    width={60}
                    height={60}
                    className="w-16 h-16 rounded-full object-cover mx-auto group-hover:opacity-80 transition-opacity"
                  />
                </div>
                <p className="font-semibold text-[#333] text-sm truncate group-hover:text-[#00833e]">{attendee.name}</p>
                <p className="text-xs text-[#8f8f8f]">
                  {attendee.status === 'joined' ? '✓ Katılıyor' : '♡ İlgileniyor'}
                </p>
              </Link>
            ))}
          </div>
          {mockEvent.attendeeCount > mockEvent.attendees.length && (
            <div className="mt-6 pt-6 border-t border-[#e0e0e0]">
              <p className="text-center text-sm text-[#404040]">
                <span className="font-semibold text-[#00833e]">{mockEvent.attendeeCount - mockEvent.attendees.length}</span> daha fazla kişi katılacak
              </p>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-6 sm:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#333] mb-6 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-[#00833e]" />
            Yorumlar ({comments.length})
          </h2>

          {/* Comment Input */}
          <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-[#e0e0e0]">
            <div className="flex gap-3 sm:gap-4">
              <Image
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=99"
                alt="Sizin profiliniz"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Bir yorum ekle..."
                  className="w-full p-3 text-sm sm:text-base border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e] focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                    className="bg-[#00833e] hover:bg-[#006b32] disabled:bg-[#e0e0e0] disabled:cursor-not-allowed text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                  >
                    Gönder
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4 sm:space-y-6">
            {comments.length === 0 ? (
              <p className="text-center text-sm sm:text-base text-[#8f8f8f] py-6">
                Henüz yorum yapılmadı. İlk yorum yapan siz olun!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 sm:gap-4">
                  <Image
                    src={comment.avatar}
                    alt={comment.author}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="font-bold text-[#333] text-sm sm:text-base">{comment.author}</h4>
                      <span className="text-xs sm:text-sm text-[#8f8f8f]">
                        {comment.timestamp.toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-[#404040] break-words">{comment.text}</p>
                    <button className="mt-2 text-xs sm:text-sm text-[#8f8f8f] hover:text-[#00833e] flex items-center gap-1 transition-colors">
                      <Heart className="w-4 h-4" />
                      {comment.likes} Beğeni
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Similar Events Section */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#333] mb-6">Benzer Etkinlikler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {similarEvents.map((event) => (
              <Link
                key={event.id}
                href={`/etkinlikler/${event.id}`}
                className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="relative h-40 sm:h-48 overflow-hidden bg-[#e0e0e0]">
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="font-bold text-[#333] text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-[#00833e]">
                    {event.title}
                  </h3>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-[#8f8f8f]">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>{new Date(event.date).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#8f8f8f]">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#8f8f8f]">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#e0e0e0] text-xs sm:text-sm text-[#404040]">
                    <Users className="inline w-4 h-4 mr-1" />
                    {event.attendeeCount} katılımcı
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
