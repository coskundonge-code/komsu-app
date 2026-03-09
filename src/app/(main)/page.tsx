'use client';

import { useState } from 'react';
import { Camera, MoreHorizontal, Globe, ThumbsUp, MessageCircle, Share2, ChevronRight, Download, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Feed filter tabs - Nextdoor style pill buttons
const feedTabs = [
  { id: 'foryou', label: 'Senin İçin' },
  { id: 'recent', label: 'Son Paylaşılanlar' },
  { id: 'nearby', label: 'Yakın Mahalleler' },
  { id: 'trending', label: 'Gündem' },
];

// Onboarding steps
const onboardingCards = [
  {
    icon: Building2,
    title: 'İşletme sahibi? Sayfanı oluştur',
    cta: 'Başla',
    ctaColor: 'bg-[#00833e] text-white',
  },
  {
    icon: Download,
    title: 'Mobil uygulamayı indir',
    cta: 'Uygulamayı İndir',
    ctaColor: 'bg-[#333] text-white',
  },
];

// Mock posts
const mockPosts = [
  {
    id: '1',
    author: { name: 'Ayşe K.', initial: 'A', neighborhood: 'Kadıköy, Moda' },
    timeAgo: '2 dk',
    isSponsored: false,
    title: '',
    body: 'Merhaba komşular, bu akşam saat 20:00\'de mahalle parkında piknik yapıyoruz. Katılmak isteyen herkesi bekliyoruz! Yanınıza battaniye ve atıştırmalık getirmeniz yeterli.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    reactions: 24,
    comments: 8,
  },
  {
    id: '2',
    author: { name: 'Mehmet Y.', initial: 'M', neighborhood: 'Kadıköy, Caferağa' },
    timeAgo: '1 sa',
    isSponsored: false,
    title: 'Kayıp Kedi - Turuncu Tekir',
    body: 'Pazartesi günü turuncu renkli kedim mahallede kayboldu. Adı Mişmiş, çok uysal. Görürseniz lütfen haber verin.',
    image: 'https://images.unsplash.com/photo-1574158622147-e121217e33f3?w=800&h=400&fit=crop',
    reactions: 42,
    comments: 15,
  },
  {
    id: '3',
    author: { name: 'Fatma Ç.', initial: 'F', neighborhood: 'Kadıköy, Moda' },
    timeAgo: '3 sa',
    isSponsored: false,
    title: '',
    body: 'Yeni açılan Moda Kafe\'yi denediniz mi? Kahveleri harika ve fiyatlar gayet makul. Bir denemenizi tavsiye ederim! Özellikle çilekli cheesecake mutlaka denmeli.',
    reactions: 18,
    comments: 5,
  },
  {
    id: 'sponsored',
    author: { name: 'Moda Ev Temizlik', initial: 'M', neighborhood: '' },
    timeAgo: '',
    isSponsored: true,
    title: 'Profesyonel Ev Temizliği Hizmeti',
    body: 'Mahallenizdeki güvenilir temizlik hizmeti. İlk temizliğe %20 indirim! Hemen randevu alın.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=400&fit=crop',
    reactions: 5,
    comments: 2,
  },
  {
    id: '4',
    author: { name: 'Emre D.', initial: 'E', neighborhood: 'Kadıköy, Moda' },
    timeAgo: '5 sa',
    isSponsored: false,
    title: 'Mahallede Şüpheli Araç',
    body: 'Dün gece saat 23:00 civarında Moda Caddesi üzerinde uzun süre park halinde bekleyen koyu renkli bir araç dikkatimi çekti. Plakayı not edemedim ama dikkatli olalım komşular.',
    reactions: 67,
    comments: 23,
  },
];

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState('foryou');

  return (
    <div className="max-w-[680px] mx-auto px-4 py-4">
      {/* Create Post Box - Nextdoor style */}
      <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#404040] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            C
          </div>
          <button className="flex-1 px-4 py-2.5 bg-[#f0f2f5] text-[#8f8f8f] rounded-full hover:bg-[#e4e6e9] transition-colors text-left text-[15px]">
            Neler oluyor, komşu?
          </button>
          <button className="p-2 hover:bg-[#f0f2f5] rounded-full transition-colors">
            <Camera className="w-5 h-5 text-[#8f8f8f]" />
          </button>
          <button className="px-5 py-2 bg-[#00833e] hover:bg-[#006b32] text-white font-semibold text-sm rounded-full transition-colors">
            Paylaş
          </button>
        </div>
      </div>

      {/* Feed Tabs - Nextdoor style pill buttons */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {feedTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors',
              activeTab === tab.id
                ? 'border-[#333] text-[#333] bg-white'
                : 'border-[#e0e0e0] text-[#8f8f8f] bg-white hover:border-[#c4c4c4] hover:text-[#404040]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Onboarding Section */}
      <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-4 mb-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#333]">KomşuApp&apos;a Başla</h2>
          <button className="p-1 hover:bg-[#f0f2f5] rounded-full">
            <MoreHorizontal className="w-5 h-5 text-[#8f8f8f]" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto">
          {onboardingCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="min-w-[200px] border border-[#e0e0e0] rounded-lg p-4 flex flex-col items-start gap-3">
                <div className="w-10 h-10 bg-[#f0f2f5] rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#404040]" />
                </div>
                <p className="text-sm font-medium text-[#333]">{card.title}</p>
                <button className={cn('px-4 py-2 rounded-full text-sm font-semibold', card.ctaColor)}>
                  {card.cta}
                </button>
              </div>
            );
          })}
        </div>
        <div className="mt-3 pt-3 border-t border-[#e0e0e0]">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#00833e] font-medium">3 / 7 adım tamamlandı</span>
          </div>
          <div className="w-full h-1.5 bg-[#e0e0e0] rounded-full mt-2">
            <div className="h-full bg-[#00833e] rounded-full" style={{ width: '43%' }} />
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-3">
        {mockPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-sm border border-[#e0e0e0]">
            {/* Post Header */}
            <div className="p-4 pb-0">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#e0e0e0] rounded-full flex items-center justify-center text-[#404040] text-sm font-bold flex-shrink-0">
                    {post.author.initial}
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-[#333]">{post.author.name}</p>
                    {post.isSponsored ? (
                      <p className="text-xs text-[#8f8f8f]">Sponsorlu</p>
                    ) : (
                      <p className="text-xs text-[#8f8f8f]">
                        {post.author.neighborhood} · {post.timeAgo} · <Globe className="w-3 h-3 inline" />
                      </p>
                    )}
                  </div>
                </div>
                <button className="p-1 hover:bg-[#f0f2f5] rounded-full">
                  <MoreHorizontal className="w-5 h-5 text-[#8f8f8f]" />
                </button>
              </div>
            </div>

            {/* Post Content */}
            <div className="px-4 py-2">
              {post.title && (
                <h3 className="text-[15px] font-bold text-[#333] mb-1">{post.title}</h3>
              )}
              <p className="text-[15px] text-[#404040] leading-relaxed">{post.body}</p>
            </div>

            {/* Post Image */}
            {post.image && (
              <div className="mt-1">
                <img
                  src={post.image}
                  alt={post.title || 'Gönderi görseli'}
                  className="w-full object-cover max-h-[400px]"
                />
              </div>
            )}

            {/* Learn more for sponsored */}
            {post.isSponsored && (
              <div className="px-4 py-3 border-t border-[#e0e0e0] flex items-center justify-between">
                <span className="text-sm font-medium text-[#404040]">Daha fazla bilgi</span>
                <ChevronRight className="w-4 h-4 text-[#8f8f8f]" />
              </div>
            )}

            {/* Reactions summary */}
            {!post.isSponsored && (
              <>
                <div className="px-4 py-2 flex items-center justify-between text-xs text-[#8f8f8f]">
                  <div className="flex items-center gap-1">
                    <span className="flex -space-x-1">
                      <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px]">👍</span>
                      <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]">❤️</span>
                    </span>
                    <span className="ml-1 text-[13px]">{post.reactions}</span>
                  </div>
                  <span className="text-[13px]">{post.comments} yorum</span>
                </div>

                {/* Action buttons */}
                <div className="px-4 py-1 border-t border-[#e0e0e0]">
                  <div className="flex items-center">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-[#404040] hover:bg-[#f0f2f5] rounded-lg transition-colors">
                      <ThumbsUp className="w-5 h-5" />
                      Beğen
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-[#404040] hover:bg-[#f0f2f5] rounded-lg transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      Yorum
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-[#404040] hover:bg-[#f0f2f5] rounded-lg transition-colors">
                      <Share2 className="w-5 h-5" />
                      Paylaş
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-2 text-[#8f8f8f] text-sm">
          <div className="w-5 h-5 border-2 border-[#e0e0e0] border-t-[#00833e] rounded-full animate-spin" />
          Daha fazla yükleniyor...
        </div>
      </div>
    </div>
  );
}
