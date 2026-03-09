'use client';

import { useState } from 'react';
import { Camera, FileText, AlertTriangle, BarChart3, Heart, MessageCircle, Share2, ThumbsUp, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

// Feed filter tabs like Nextdoor
const feedTabs = [
  { id: 'foryou', label: 'Senin İçin' },
  { id: 'recent', label: 'Son Paylaşılanlar' },
  { id: 'nearby', label: 'Yakın Mahalleler' },
  { id: 'trending', label: 'Gündem' },
];

// Mock posts matching Nextdoor style
const mockPosts = [
  {
    id: '1',
    author: {
      name: 'Ayşe Kaya',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop',
      neighborhood: 'Kadıköy, Moda',
    },
    timeAgo: '2 sa',
    category: 'Güvenlik',
    categoryColor: 'text-red-600 bg-red-50',
    title: 'Mahallede Şüpheli Aktivite',
    body: 'Dün gece saat 23:00 civarında mahalle parkında şüpheli hareketler gözlendi. Lütfen dikkatli olun ve gerekirse polise haber verin. Kapılarınızı kilitlemeyi unutmayın.',
    reactions: { like: 24, thank: 15, agree: 32 },
    commentCount: 8,
  },
  {
    id: '2',
    author: {
      name: 'Mehmet Yıldız',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop',
      neighborhood: 'Kadıköy, Caferağa',
    },
    timeAgo: '4 sa',
    category: 'Genel',
    categoryColor: 'text-gray-600 bg-gray-50',
    title: 'Mahalle Temizlik Günü Organizasyonu',
    body: 'Cumartesi günü mahallede ortak bir temizlik günü yapabiliriz. Komşularımızla birlikte parkımızı temizleyip düzenleyelim. Katılmak isteyenler lütfen yorumda belirtsin.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    reactions: { like: 18, thank: 25, agree: 10 },
    commentCount: 12,
  },
  {
    id: '3',
    author: {
      name: 'Emre Demir',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop',
      neighborhood: 'Kadıköy, Moda',
    },
    timeAgo: '6 sa',
    category: 'Kayıp/Buluntu',
    categoryColor: 'text-orange-600 bg-orange-50',
    title: 'Kayıp Kedi - Turuncu Tekir',
    body: 'Pazartesi günü turuncu renkli kedim mahallede kayboldu. Adı Mişmiş. Görürseniz lütfen haber verin. İletişim: 0532-XXX-XXXX',
    image: 'https://images.unsplash.com/photo-1574158622147-e121217e33f3?w=600&h=400&fit=crop',
    reactions: { like: 15, thank: 8, agree: 2 },
    commentCount: 5,
  },
  {
    id: '4',
    author: {
      name: 'Fatma Çelik',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53a8c7b1e899?w=96&h=96&fit=crop',
      neighborhood: 'Kadıköy, Moda',
    },
    timeAgo: '8 sa',
    category: 'Öneri',
    categoryColor: 'text-blue-600 bg-blue-50',
    title: 'Yeni açılan kafe hakkında',
    body: 'Moda caddesinde yeni açılan "Komşu Kafe" çok güzel olmuş. Kahveleri harika ve fiyatlar gayet makul. Bir denemenizi tavsiye ederim!',
    reactions: { like: 42, thank: 18, agree: 7 },
    commentCount: 15,
  },
];

// Mock poll
const mockPoll = {
  question: 'Mahallede hangi etkinlik daha çok yapılmalı?',
  options: [
    { id: '1', text: 'Spor aktiviteleri', votes: 87, percentage: 35 },
    { id: '2', text: 'Kültür-sanat etkinlikleri', votes: 62, percentage: 25 },
    { id: '3', text: 'Çocuk etkinlikleri', votes: 56, percentage: 22 },
    { id: '4', text: 'Çevre temizliği', votes: 45, percentage: 18 },
  ],
  totalVotes: 250,
  author: {
    name: 'Mahalle Yönetimi',
    avatar: 'https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=96&h=96&fit=crop',
  },
  timeAgo: '1 gün',
};

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState('foryou');
  const [showPostForm, setShowPostForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[680px] mx-auto px-4 py-4">
        {/* Create Post Box - Nextdoor style */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              C
            </div>
            <button
              onClick={() => setShowPostForm(!showPostForm)}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors text-left text-sm"
            >
              Neler oluyor, komşu?
            </button>
          </div>
          {/* Quick actions */}
          <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              <Camera className="w-4 h-4 text-emerald-600" />
              Fotoğraf
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Güvenlik
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              Anket
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              <FileText className="w-4 h-4 text-purple-500" />
              Etkinlik
            </button>
          </div>
        </div>

        {/* Feed Tabs - Nextdoor style */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4">
          <div className="flex overflow-x-auto">
            {feedTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'text-emerald-700 border-emerald-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {mockPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Post Header */}
              <div className="p-4 pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{post.author.name}</p>
                      <p className="text-xs text-gray-500">
                        {post.author.neighborhood} · {post.timeAgo}
                      </p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded-full">
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                {/* Category badge */}
                <span className={cn('inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium', post.categoryColor)}>
                  {post.category}
                </span>
              </div>

              {/* Post Content */}
              <div className="px-4 py-2">
                <h3 className="text-base font-semibold text-gray-900 mb-1">{post.title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{post.body}</p>
              </div>

              {/* Post Image */}
              {post.image && (
                <div className="mt-2">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full object-cover max-h-[400px]"
                  />
                </div>
              )}

              {/* Reactions summary */}
              <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <span className="flex -space-x-1">
                    <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px]">👍</span>
                    <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]">❤️</span>
                  </span>
                  <span className="ml-1">{post.reactions.like + post.reactions.thank + post.reactions.agree}</span>
                </div>
                <span>{post.commentCount} yorum</span>
              </div>

              {/* Action buttons */}
              <div className="px-4 py-1 border-t border-gray-100">
                <div className="flex items-center">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <ThumbsUp className="w-5 h-5" />
                    Beğen
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    Yorum
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <Share2 className="w-5 h-5" />
                    Paylaş
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Poll Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-start gap-3 mb-3">
              <img
                src={mockPoll.author.avatar}
                alt={mockPoll.author.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">{mockPoll.author.name}</p>
                <p className="text-xs text-gray-500">{mockPoll.timeAgo}</p>
              </div>
            </div>
            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-purple-600 bg-purple-50 mb-2">
              Anket
            </span>
            <h3 className="text-base font-semibold text-gray-900 mb-3">{mockPoll.question}</h3>
            <div className="space-y-2">
              {mockPoll.options.map((option) => (
                <button
                  key={option.id}
                  className="w-full relative overflow-hidden border border-gray-200 rounded-lg p-3 text-left hover:border-emerald-300 transition-colors"
                >
                  <div
                    className="absolute inset-0 bg-emerald-50"
                    style={{ width: `${option.percentage}%` }}
                  />
                  <div className="relative flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800">{option.text}</span>
                    <span className="text-sm text-gray-500">{option.percentage}%</span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">{mockPoll.totalVotes} oy</p>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-emerald-600 rounded-full animate-spin" />
            Daha fazla yükleniyor...
          </div>
        </div>
      </div>
    </div>
  );
}
