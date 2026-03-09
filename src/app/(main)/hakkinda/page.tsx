'use client';

import Link from 'next/link';
import { ArrowLeft, Users, Shield, Heart, MapPin, Zap, Eye, Award, Rocket } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { number: '50K+', label: 'Aktif Kullanıcı', icon: Users },
    { number: '1000+', label: 'Mahalle', icon: MapPin },
    { number: '100K+', label: 'Günlük Etkileşim', icon: Zap },
    { number: '4.8★', label: 'App Rating', icon: Award },
  ];

  const values = [
    { icon: Users, title: 'Topluluk', desc: 'Güçlü mahalle toplulukları oluşturuyoruz.' },
    { icon: Shield, title: 'Güvenlik', desc: 'Herkesin güvende hissettiği bir platform.' },
    { icon: Heart, title: 'Yardımlaşma', desc: 'Komşular birbirine yardım eder.' },
    { icon: MapPin, title: 'Yerellik', desc: 'Yerel bağlantılar, gerçek ilişkiler.' },
    { icon: Eye, title: 'Şeffaflık', desc: 'Açık ve dürüst iletişime inanıyoruz.' },
    { icon: Rocket, title: 'İnovasyon', desc: 'Teknoloji ile hayatı iyileştiriyoruz.' },
  ];

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#00833e] hover:text-[#006b32] font-medium mb-6 transition-colors">
          <ArrowLeft size={16} />
          Ana Sayfaya Dön
        </Link>

        <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden shadow-sm">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-[#00833e] via-[#00833e] to-[#006b32] p-12 text-center text-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>

            <div className="relative z-10">
              <svg viewBox="0 0 24 24" className="w-20 h-20 mx-auto mb-4" fill="currentColor">
                <path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z" />
              </svg>
              <h1 className="text-4xl font-bold mb-3">KomşuApp</h1>
              <p className="text-green-100 text-lg">Komşularınızla bağlantıda kalın, güvenli bir mahalle oluşturun</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-gradient-to-b from-white to-[#f0f2f5] border-b border-[#e0e0e0]">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-3 bg-[#f0f2f5] rounded-lg">
                      <Icon className="w-6 h-6 text-[#00833e]" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[#00833e]">{stat.number}</div>
                  <div className="text-xs text-[#8f8f8f] mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12">
            {/* Mission Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#333] mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#00833e] rounded-full"></span>
                Misyonumuz
              </h2>
              <p className="text-[#404040] leading-relaxed text-lg">
                KomşuApp, mahalle sakinlerinin birbirleriyle bağlantı kurmasını, bilgi paylaşmasını ve güçlü topluluklar oluşturmasını sağlayan bir sosyal platformdur. Amacımız, dijital dünyada komşuluk ilişkilerini güçlendirmek ve daha güvenli, daha bağlantılı, daha dayanışmacı mahalleler yaratmaktır.
              </p>
            </section>

            {/* Vision Section */}
            <section className="mb-12 p-6 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0]">
              <h2 className="text-2xl font-bold text-[#333] mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#00833e] rounded-full"></span>
                Vizyonumuz
              </h2>
              <p className="text-[#404040] leading-relaxed text-lg">
                Her mahallede, yerel bağlantıların ve karşılıklı güvenin kuvvetli olduğu bir dünya yaratmak. Teknoloji aracılığıyla, insanların birbirlerini tanıması, yardımlaşması ve birlikte gelişmesi için bir platform sunmak.
              </p>
            </section>

            {/* Values Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#333] mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#00833e] rounded-full"></span>
                Değerlerimiz
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {values.map((v) => {
                  const Icon = v.icon;
                  return (
                    <div key={v.title} className="flex items-start gap-4 p-4 bg-[#f0f2f5] rounded-lg hover:border-[#00833e] border border-[#e0e0e0] transition-all duration-200">
                      <div className="p-3 bg-white rounded-lg flex-shrink-0 border border-[#e0e0e0]">
                        <Icon className="w-6 h-6 text-[#00833e]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#333]">{v.title}</h3>
                        <p className="text-sm text-[#8f8f8f] mt-1">{v.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Team Section */}
            <section className="mb-12 p-6 bg-gradient-to-br from-[#00833e]/5 to-[#006b32]/5 rounded-lg border border-[#00833e]/20">
              <h2 className="text-2xl font-bold text-[#333] mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#00833e] rounded-full"></span>
                Ekibimiz
              </h2>
              <p className="text-[#404040] leading-relaxed mb-4">
                KomşuApp, yazılım geliştirme, ürün tasarımı ve topluluk yönetiminde uzman bir ekip tarafından geliştirilir. Trendex Lojistik tarafından desteklenen projemiz, her gün mahalle sakinlerinin yaşamını daha iyi hale getirmek için çalışmaktadır.
              </p>
              <div className="text-sm text-[#8f8f8f] pt-4 border-t border-[#00833e]/20">
                Sorularınız veya önerileriniz için bize <Link href="/mesajlar" className="text-[#00833e] font-semibold hover:underline">ulaşabilirsiniz</Link>.
              </div>
            </section>

            {/* Contact Section */}
            <section className="p-6 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0]">
              <h2 className="text-xl font-bold text-[#333] mb-4">İletişime Geçin</h2>
              <div className="space-y-2 text-[#404040]">
                <p>Email: <span className="font-semibold">destek@komsuapp.com</span></p>
                <p>Web: <span className="font-semibold">www.komsuapp.com</span></p>
                <p>Sosyal Medya: Instagram, Twitter, Facebook @komsuapp</p>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="border-t border-[#e0e0e0] bg-[#f0f2f5] py-6 px-8 text-center">
            <p className="text-sm text-[#8f8f8f] mb-4">© 2026 KomşuApp — Trendex Lojistik tarafından geliştirilmiştir.</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/gizlilik" className="text-sm text-[#00833e] hover:text-[#006b32] font-medium transition-colors">Gizlilik Politikası</Link>
              <span className="text-[#e0e0e0]">•</span>
              <Link href="/kosullar" className="text-sm text-[#00833e] hover:text-[#006b32] font-medium transition-colors">Kullanım Koşulları</Link>
              <span className="text-[#e0e0e0]">•</span>
              <Link href="/yardim" className="text-sm text-[#00833e] hover:text-[#006b32] font-medium transition-colors">Yardım Merkezi</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
