'use client';

import { Search, ChevronRight, MessageCircle, FileText, Shield, Users, Settings, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const categories = [
  { icon: Users, title: 'Hesap ve Profil', description: 'Hesap ayarları, profil düzenleme, şifre değiştirme', count: 12 },
  { icon: Shield, title: 'Gizlilik ve Güvenlik', description: 'Gizlilik ayarları, hesap güvenliği, engelleme', count: 8 },
  { icon: MessageCircle, title: 'Mesajlaşma', description: 'Mesaj gönderme, sohbet ayarları, bildirimler', count: 6 },
  { icon: FileText, title: 'Gönderi ve İçerik', description: 'Gönderi oluşturma, düzenleme, silme, raporlama', count: 10 },
  { icon: Settings, title: 'Bildirim Ayarları', description: 'E-posta, push ve uygulama bildirimleri', count: 5 },
  { icon: HelpCircle, title: 'Genel Sorular', description: 'KomşuApp hakkında sık sorulan sorular', count: 15 },
];

const popularQuestions = [
  'Profilimi nasıl düzenlerim?',
  'Mahallemi nasıl değiştiririm?',
  'Gönderiyi nasıl silerim?',
  'Birini nasıl engellerim?',
  'Bildirimlerimi nasıl kapatırım?',
  'Hesabımı nasıl silebilirim?',
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <div className="bg-[#00833e] text-white py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-3">Yardım Merkezi</h1>
          <p className="text-white/80 mb-6">Size nasıl yardımcı olabiliriz?</p>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Sorunuzu arayın..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white text-[#333] rounded-full focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Categories */}
        <h2 className="text-xl font-bold text-[#333] mb-4">Kategoriler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.title}
                className="bg-white border border-[#e0e0e0] rounded-lg p-4 hover:border-[#00833e] hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#f0f2f5] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#00833e]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-[#333]">{cat.title}</h3>
                    <p className="text-xs text-[#8f8f8f] mt-0.5">{cat.description}</p>
                    <p className="text-xs text-[#00833e] mt-1">{cat.count} makale</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8f8f8f] flex-shrink-0 mt-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Popular Questions */}
        <h2 className="text-xl font-bold text-[#333] mb-4">Sık Sorulan Sorular</h2>
        <div className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden">
          {popularQuestions.map((q, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e0] last:border-b-0 hover:bg-[#f0f2f5] transition-colors cursor-pointer"
            >
              <span className="text-sm text-[#333]">{q}</span>
              <ChevronRight className="w-4 h-4 text-[#8f8f8f]" />
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-8 bg-white border border-[#e0e0e0] rounded-lg p-6 text-center">
          <MessageCircle className="w-10 h-10 text-[#00833e] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#333] mb-1">Hâlâ yardıma mı ihtiyacınız var?</h3>
          <p className="text-sm text-[#8f8f8f] mb-4">Destek ekibimize mesaj gönderin, en kısa sürede yanıt vereceğiz.</p>
          <Link
            href="/mesajlar"
            className="inline-block px-6 py-2.5 bg-[#00833e] hover:bg-[#006b32] text-white font-medium rounded-lg transition-colors"
          >
            Destek ile İletişime Geç
          </Link>
        </div>
      </div>
    </div>
  );
}
