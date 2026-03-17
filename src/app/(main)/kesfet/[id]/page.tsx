'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowLeft, Clock, MapPin, Share2, Bookmark, ThumbsUp, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images';

const mockNewsDetail: Record<string, {
  title: string;
  content: string;
  source: string;
  time: string;
  category: string;
  thumbnail: string;
  author: string;
  readTime: string;
}> = {
  '1': {
    title: 'Mahallede Yeni Kahvehane Açılıyor',
    content: 'Lokantanın yerine yeni bir kahvehane işletmesi açılıyor. Açılış 15 Mart\'ta yapılacak.\n\nMahalle sakinlerinin merakla beklediği yeni kahvehane, modern tasarımı ve geniş menüsüyle dikkat çekiyor. İşletme sahibi Ahmet Bey, "Komşularımıza kaliteli bir buluşma noktası sunmak istiyoruz" dedi.\n\nKahvehanede özel harman kahveler, ev yapımı pastalar ve hafif atıştırmalıklar sunulacak. Ayrıca hafta sonları canlı müzik etkinlikleri de planlanıyor.',
    source: 'Komşu Haberleri',
    time: '2 saat önce',
    category: 'İşletmeler',
    thumbnail: getFeedImageUrl(76, 800, 400),
    author: 'Editör',
    readTime: '3 dk okuma',
  },
  '2': {
    title: 'Park Yenileme Projesi Tamamlandı',
    content: 'Yazlık park yenileme projesi başarıyla tamamlanmıştır. Yeni oyun alanları ve banklar eklendi.\n\nBelediye tarafından yürütülen proje kapsamında parkın zemini yenilendi, çocuk oyun alanları güvenlik standartlarına uygun hale getirildi ve yeni oturma alanları eklendi.\n\nPark, mahalle sakinlerinin en çok kullandığı kamusal alanlardan biri olarak bilinmektedir.',
    source: 'Belediye Duyurusu',
    time: '4 saat önce',
    category: 'Belediye',
    thumbnail: getFeedImageUrl(77, 800, 400),
    author: 'Belediye Basın',
    readTime: '2 dk okuma',
  },
};

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const news = mockNewsDetail[params.id] || mockNewsDetail['1'];

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Link
          href="/kesfet"
          className="inline-flex items-center gap-2 text-sm text-[#00833e] hover:text-[#006b32] font-medium mb-4"
        >
          <ArrowLeft size={16} />
          Yerel Haberlere Dön
        </Link>

        {/* Article Card */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden">
          {/* Cover Image */}
          <Image
            src={news.thumbnail}
            alt={news.title}
            width={800}
            height={400}
            className="w-full h-64 object-cover"
            unoptimized
          />

          {/* Content */}
          <div className="p-6">
            {/* Category Badge */}
            <span className="text-xs font-medium px-2.5 py-1 bg-[#f0f2f5] text-[#00833e] rounded-full">
              {news.category}
            </span>

            <h1 className="text-2xl font-bold text-[#333] mt-3 mb-3">{news.title}</h1>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-[#8f8f8f] mb-6">
              <span className="font-medium">{news.source}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock size={14} />{news.time}</span>
              <span>•</span>
              <span>{news.readTime}</span>
            </div>

            {/* Body */}
            <div className="prose prose-sm max-w-none text-[#404040] leading-relaxed whitespace-pre-line">
              {news.content}
            </div>
          </div>

          {/* Action Bar */}
          <div className="px-6 py-3 border-t border-[#e0e0e0] flex items-center gap-4">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                liked ? 'bg-[#00833e] text-white' : 'text-[#404040] hover:bg-[#f0f2f5]'
              }`}
            >
              <ThumbsUp size={16} />
              {liked ? 'Beğendin' : 'Beğen'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#404040] hover:bg-[#f0f2f5] transition-colors">
              <MessageCircle size={16} />
              Yorum
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#404040] hover:bg-[#f0f2f5] transition-colors">
              <Share2 size={16} />
              Paylaş
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                saved ? 'bg-[#333] text-white' : 'text-[#404040] hover:bg-[#f0f2f5]'
              }`}
            >
              <Bookmark size={16} />
              {saved ? 'Kaydedildi' : 'Kaydet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
