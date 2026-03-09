'use client';

import Link from 'next/link';
import { ArrowLeft, Users, Shield, Heart, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#00833e] hover:text-[#006b32] font-medium mb-4">
          <ArrowLeft size={16} />
          Ana Sayfaya Dön
        </Link>

        <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden">
          {/* Hero */}
          <div className="bg-gradient-to-br from-[#00833e] to-[#006b32] p-12 text-center text-white">
            <svg viewBox="0 0 24 24" className="w-16 h-16 mx-auto mb-4" fill="currentColor">
              <path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z" />
            </svg>
            <h1 className="text-3xl font-bold mb-2">KomşuApp</h1>
            <p className="text-white/80">Komşularınızla bağlantıda kalın</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <h2 className="text-xl font-bold text-[#333] mb-4">Hakkımızda</h2>
            <p className="text-[#404040] mb-6 leading-relaxed">
              KomşuApp, mahalle sakinlerinin birbirleriyle bağlantı kurmasını, bilgi paylaşmasını ve güçlü topluluklar oluşturmasını sağlayan bir sosyal platformdur. Amacımız, dijital dünyada komşuluk ilişkilerini güçlendirmek ve daha güvenli, daha bağlantılı mahalleler yaratmaktır.
            </p>

            {/* Values */}
            <h2 className="text-xl font-bold text-[#333] mb-4">Değerlerimiz</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                { icon: Users, title: 'Topluluk', desc: 'Güçlü mahalle toplulukları oluşturuyoruz.' },
                { icon: Shield, title: 'Güvenlik', desc: 'Herkesin güvende hissettiği bir platform.' },
                { icon: Heart, title: 'Yardımlaşma', desc: 'Komşular birbirine yardım eder.' },
                { icon: MapPin, title: 'Yerellik', desc: 'Yerel bağlantılar, gerçek ilişkiler.' },
              ].map((v) => {
                const Icon = v.icon;
                return (
                  <div key={v.title} className="flex items-start gap-3 p-4 bg-[#f0f2f5] rounded-lg">
                    <Icon className="w-6 h-6 text-[#00833e] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-[#333] text-sm">{v.title}</h3>
                      <p className="text-xs text-[#8f8f8f] mt-0.5">{v.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer info */}
            <div className="border-t border-[#e0e0e0] pt-6 text-center">
              <p className="text-sm text-[#8f8f8f]">© 2026 KomşuApp — Trendex Lojistik tarafından geliştirilmiştir.</p>
              <div className="flex items-center justify-center gap-4 mt-3">
                <Link href="/gizlilik" className="text-sm text-[#00833e] hover:underline">Gizlilik</Link>
                <Link href="/kosullar" className="text-sm text-[#00833e] hover:underline">Koşullar</Link>
                <Link href="/yardim" className="text-sm text-[#00833e] hover:underline">Yardım</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
