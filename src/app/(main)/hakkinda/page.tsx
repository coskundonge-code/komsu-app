"use client";

import Link from "next/link";
import { ArrowLeft, Users, Shield, Heart, MapPin, Zap, Award, TrendingUp } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { number: "50,000+", label: "Aktif Kullanıcı", icon: Users },
    { number: "500+", label: "Mahalle", icon: MapPin },
    { number: "10,000+", label: "Günlük Paylaşım", icon: TrendingUp },
    { number: "4.8★", label: "App Puanı", icon: Award },
  ];

  const values = [
    { icon: Heart, title: "Güven", desc: "Mahallede her üyenin birbirine güvenmesi, açık ve dürüst iletişimin temeli." },
    { icon: Users, title: "Topluluk", desc: "Güçlü mahalle toplulukları oluşturarak, insanlar arasında köprü kurmak." },
    { icon: MapPin, title: "Yerellik", desc: "Yerel bağlantılar ve gerçek ilişkileri önceleyen bir platform." },
    { icon: Shield, title: "Güvenlik", desc: "Herkesin güvende hissettiği, korunan ve kontrol edilen bir ortam." },
  ];

  const teamMembers = [
    { name: "Coşkun Dönge", role: "Yazılım Geliştirici", initial: "C" },
    { name: "Onur Pekel", role: "Ürün Tasarımcısı", initial: "O" },
    { name: "Trendex Lojistik", role: "Sponsorluk & Destek", initial: "T" },
  ];

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#00833e] hover:text-[#006b32] font-medium mb-8 transition-colors">
          <ArrowLeft size={16} />
          Ana Sayfaya Dön
        </Link>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#00833e] to-[#006b32] text-white rounded-lg p-12 md:p-16 text-center relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>

          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Mahallem Hakkında</h1>
            <p className="text-green-100 text-lg md:text-xl max-w-2xl mx-auto">
              Mahalle sakinlerini birbirleriyle bağlayan, güvenli ve dayanışmacı topluluklara katkı sağlayan sosyal platform
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white border border-[#e0e0e0] rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-3">
                  <Icon className="w-8 h-8 text-[#00833e]" />
                </div>
                <div className="text-3xl font-bold text-[#00833e] mb-1">{stat.number}</div>
                <div className="text-sm text-[#8f8f8f]">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Story Section */}
        <div className="bg-white border border-[#e0e0e0] rounded-lg p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-[#333] mb-6 flex items-center gap-3">
            <span className="w-1 h-10 bg-[#00833e] rounded-full"></span>
            Hikayemiz
          </h2>
          <p className="text-[#404040] leading-relaxed text-lg mb-6">
            Mahallem, Türkiye'deki mahalleler arasında gittikçe zayıflayan bağlantıları yeniden güçlendirmek amacıyla kuruldu. Modern teknolojinin hızlı dünyasında, komşularımızı tanımanın ve birbirimize yardım etmenin ne kadar zor hale geldiğini gördük.
          </p>
          <p className="text-[#404040] leading-relaxed text-lg mb-6">
            Bu sorunun çözümü için Mahallem'i tasarladık: mahalle sakinlerinin birbirleriyle bağlantı kurması, bilgi paylaşması, etkinlikler düzenlemesi ve güçlü topluluklar oluşturmasını sağlayan bir platform.
          </p>
          <p className="text-[#404040] leading-relaxed text-lg">
            Bugün, 500+ mahallede 50.000+ kullanıcı Mahallem aracılığıyla bağlantıda, birbirlerine güveniyor ve birlikte gelişiyor. Amacımız, her mahallede bu güven ve dayanışma kültürünü yaygınlaştırmak.
          </p>
        </div>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#333] mb-8 flex items-center gap-3">
            <span className="w-1 h-10 bg-[#00833e] rounded-full"></span>
            Değerlerimiz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="bg-white border border-[#e0e0e0] rounded-lg p-8 hover:border-[#00833e] hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#f0f2f5] rounded-lg flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#00833e]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#333] mb-2">{value.title}</h3>
                      <p className="text-[#8f8f8f] leading-relaxed">{value.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-gradient-to-br from-[#00833e]/5 to-[#006b32]/5 border border-[#00833e]/20 rounded-lg p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-[#333] mb-8 flex items-center gap-3">
            <span className="w-1 h-10 bg-[#00833e] rounded-full"></span>
            Ekibimiz
          </h2>
          <p className="text-[#404040] leading-relaxed mb-8">
            Mahallem, yazılım geliştirme, ürün tasarımı ve topluluk yönetiminde uzman bir ekip tarafından geliştirilir. Trendex Lojistik tarafından desteklenen projemiz, her gün mahalle sakinlerinin yaşamını daha iyi hale getirmek için çalışmaktadır.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-white rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#00833e] to-[#006b32] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {member.initial}
                </div>
                <h3 className="font-bold text-[#333] mb-1">{member.name}</h3>
                <p className="text-sm text-[#8f8f8f]">{member.role}</p>
              </div>
            ))}
          </div>

          <div className="text-center text-sm text-[#8f8f8f]">
            Sorularınız veya önerileriniz için bize{" "}
            <Link href="/mesajlar" className="text-[#00833e] font-semibold hover:underline">
              ulaşabilirsiniz
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white border border-[#e0e0e0] rounded-lg p-8 md:p-12 text-center mb-12">
          <h2 className="text-3xl font-bold text-[#333] mb-4">Mahallene Katıl</h2>
          <p className="text-[#404040] mb-8 max-w-2xl mx-auto leading-relaxed">
            Mahallem'e katılarak mahallenizle bağlantı kurun, yeni arkadaşlar edinin ve güçlü bir topluluk oluşturun.
          </p>
          <Link
            href="/kaydol"
            className="inline-block px-8 py-4 bg-[#00833e] text-white font-bold rounded-lg hover:bg-[#006b32] transition-colors shadow-lg"
          >
            Hemen Başla
          </Link>
        </div>

        {/* Footer */}
        <div className="border-t border-[#e0e0e0] bg-[#f0f2f5] py-8 px-8 rounded-lg text-center">
          <p className="text-sm text-[#8f8f8f] mb-4">© 2026 Mahallem — Trendex Lojistik tarafından geliştirilmiştir.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/gizlilik" className="text-sm text-[#00833e] hover:text-[#006b32] font-medium transition-colors">
              Gizlilik Politikası
            </Link>
            <span className="text-[#e0e0e0]">•</span>
            <Link href="/kosullar" className="text-sm text-[#00833e] hover:text-[#006b32] font-medium transition-colors">
              Kullanım Koşulları
            </Link>
            <span className="text-[#e0e0e0]">•</span>
            <Link href="/yardim" className="text-sm text-[#00833e] hover:text-[#006b32] font-medium transition-colors">
              Yardım Merkezi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
