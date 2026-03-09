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
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const mockEvent = {
  id: '1',
  title: 'Komşu Kahvaltısı',
  description: 'Mahallede tüm komşular bir araya gelip sohbet edecek ve lezzetli bir kahvaltı yapacağız. Taze ekmek, peynir, zeytin, domates, salatalık ve daha birçok lezzetlilik hazırlanacak.',
  date: new Date(2026, 2, 15, 10, 0),
  time: '10:00 - 12:00',
  location: 'Mahalle Parkı, Açık Alanı',
  coordinates: { lat: 41.0082, lng: 28.9784 },
  coverImage: 'https://images.unsplash.com/photo-1585518419759-ab60cb0bf33f?w=1200&h=600&fit=crop',
  organizer: {
    name: 'Ayşe Yılmaz',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    bio: 'Mahalle temsilcisi ve sosyal aktiviteler koordinatörü',
  },
  attendeeCount: 24,
  maxAttendees: 50,
  isOnline: false,
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
      text: 'Harika bir etkinlik! Herkes davetlidir, lütfen katılın!',
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
      text: 'Evet Zeynep, çocuklar için oyunlar ve etkinlikler organize ettim. Herkes eğlenecek!',
      timestamp: new Date(2026, 2, 11),
      likes: 8,
    },
  ],
};

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [isJoined, setIsJoined] = useState(false);
  const [isInterested, setIsInterested] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(mockEvent.comments);

  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: String(comments.length + 1),
        author: 'Benim Adım',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=99',
        text: commentText,
        timestamp: new Date(),
        likes: 0,
      };
      setComments([...comments, newComment]);
      setCommentText('');
    }
  };

  const spotsRemaining = mockEvent.maxAttendees ? mockEvent.maxAttendees - mockEvent.attendeeCount : null;
  const isFull = spotsRemaining !== null && spotsRemaining <= 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/etkinlikler" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Etkinliklere Geri Dön
          </Link>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-96 bg-gray-200 overflow-hidden">
        <Image
          src={mockEvent.coverImage}
          alt={mockEvent.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title and Actions */}
        <div className="bg-white rounded-lg shadow-md p-8 -mt-20 relative z-10 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {mockEvent.title}
              </h1>
              <p className="text-gray-600">
                Tarafından düzenleniyor: <span className="font-semibold text-gray-900">{mockEvent.organizer.name}</span>
              </p>
            </div>
            <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Event Info Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8 pb-8 border-b">
            <div className="flex gap-4">
              <Calendar className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Tarih ve Saat</p>
                <p className="text-lg font-semibold text-gray-900">
                  {mockEvent.date.toLocaleDateString('tr-TR')}
                </p>
                <p className="text-gray-700">{mockEvent.time}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Konum</p>
                <p className="text-lg font-semibold text-gray-900">
                  {mockEvent.location}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Users className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Katılımcılar</p>
                <p className="text-lg font-semibold text-gray-900">
                  {mockEvent.attendeeCount}
                  {mockEvent.maxAttendees ? `/${mockEvent.maxAttendees}` : ''}
                </p>
                {spotsRemaining !== null && (
                  <p className="text-sm text-gray-600">
                    {spotsRemaining} yer kaldı
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsJoined(!isJoined)}
              disabled={isFull && !isJoined}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                isJoined
                  ? 'bg-emerald-100 text-emerald-600'
                  : isFull
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isJoined && <Check className="w-5 h-5" />}
              {isJoined ? 'Katılıyorum' : isFull ? 'Dolu' : 'Katılıyorum'}
            </button>
            <button
              onClick={() => setIsInterested(!isInterested)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors border-2 flex items-center justify-center gap-2 ${
                isInterested
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-600'
                  : 'border-gray-300 text-gray-600 hover:border-emerald-600'
              }`}
            >
              <Heart className="w-5 h-5" fill={isInterested ? 'currentColor' : 'none'} />
              İlgileniyorum
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Etkinlik Hakkında</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {mockEvent.description}
          </p>
        </div>

        {/* Organizer */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Organizatör</h2>
          <div className="flex items-start gap-4">
            <Image
              src={mockEvent.organizer.avatar}
              alt={mockEvent.organizer.name}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">
                {mockEvent.organizer.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {mockEvent.organizer.bio}
              </p>
              <Link href={`/profil/1`}>
                <Button variant="outline">
                  Profili Ziyaret Et
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Attendees */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Katılımcılar ({mockEvent.attendees.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockEvent.attendees.map((attendee) => (
              <div key={attendee.id} className="text-center">
                <Image
                  src={attendee.avatar}
                  alt={attendee.name}
                  width={60}
                  height={60}
                  className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                />
                <p className="font-semibold text-gray-900">{attendee.name}</p>
                <p className="text-xs text-gray-600">
                  {attendee.status === 'joined' ? 'Katılıyor' : 'İlgileniyor'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-emerald-600" />
            Yorumlar ({comments.length})
          </h2>

          {/* Comment Input */}
          <div className="mb-8 pb-8 border-b">
            <div className="flex gap-4">
              <Image
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=99"
                alt="You"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Bir yorum ekle..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Gönder
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Image
                  src={comment.avatar}
                  alt={comment.author}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900">{comment.author}</h4>
                    <span className="text-sm text-gray-500">
                      {comment.timestamp.toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">{comment.text}</p>
                  <button className="mt-2 text-sm text-gray-600 hover:text-emerald-600 flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {comment.likes} Beğeni
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
