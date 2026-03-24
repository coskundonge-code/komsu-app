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
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-hover font-medium mb-8 transition-colors">
          <ArrowLeft size={16} />
          Ana Sayfaya Dön
        </Link>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary to-primary-hover text-white rounded-lg p-12 md:p-16 text-center relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>

          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Mahallemiz Hakkında</h1>
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
              <div key={stat.label} className="bg-surface border border-border rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-3">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="text-sm text-text-muted">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Story Section */}
        <div className="bg-surface border border-border rounded-lg p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-6 flex items-center gap-3">
            <span className="w-1 h-10 bg-primary rounded-full"></span>
            Hikayemiz
          </h2>
          <p className="text-text-secondary leading-relaxed text-lg mb-6">
            Mahallemiz, Türkiye'deki mahalleler arasında gittikçe zayıflayan bağlantıları yeniden güçlendirmek amacıyla kuruldu. Modern teknolojinin hızlı dünyasında, komşularımızı tanımanın ve birbirimize yardım etmenin ne kadar zor hale geldiğini gördük.
          </p>
          <p className="text-text-secondary leading-relaxed text-lg mb-6">
            Bu sorunun çözümü için Mahallemiz'i tasarladık: mahalle sakinlerinin birbirleriyle bağlantı kurması, bilgi paylaşması, etkinlikler düzenlemesi ve güçlü topluluklar oluşturmasını sağlayan bir platform.
          </p>
          <p className="text-text-secondary leading-relaxed text-lg">
            Bugün, 500+ mahallede 50.000+ kullanıcı Mahallemiz aracılığıyla bağlantıda, birbirlerine güveniyor ve birlikte gelişiyor. Amacımız, her mahallede bu güven ve dayanışma kültürünü yaygınlaştırmak.
          </p>
        </div>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-8 flex items-center gap-3">
            <span className="w-1 h-10 bg-primary rounded-full"></span>
            Değerlerimiz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="bg-surface border border-border rounded-lg p-8 hover:border-primary hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-background rounded-lg flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text-primary mb-2">{value.title}</h3>
                      <p className="text-text-muted leading-relaxed">{value.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-gradient-to-br from-primary/5 to-primary-hover/5 border border-primary/20 rounded-lg p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-8 flex items-center gap-3">
            <span className="w-1 h-10 bg-primary rounded-full"></span>
            Ekibimiz
          </h2>
          <p className="text-text-secondary leading-relaxed mb-8">
            Mahallemiz, yazılım geliştirme, ürün tasarımı ve topluluk yönetiminde uzman bir ekip tarafından geliştirilir. Trendex Lojistik tarafından desteklenen projemiz, her gün mahalle sakinlerinin yaşamını daha iyi hale getirmek için çalışmaktadır.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-surface rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-hover text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {member.initial}
                </div>
                <h3 className="font-bold text-text-primary mb-1">{member.name}</h3>
                <p className="text-sm text-text-muted">{member.role}</p>
              </div>
            ))}
          </div>

          <div className="text-center text-sm text-text-muted">
            Sorularınız veya önerileriniz için bize{" "}
            <Link href="/iletisim" className="text-primary font-semibold hover:underline">
              ulaşabilirsiniz
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-surface border border-border rounded-lg p-8 md:p-12 text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-4">Mahallene Katıl</h2>
          <p className="text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
            Mahallemiz'e katılarak mahallenizle bağlantı kurun, yeni arkadaşlar edinin ve güçlü bir topluluk oluşturun.
          </p>
          <Link
            href="/kaydol"
            className="inline-block px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors shadow-lg"
          >
            Hemen Başla
          </Link>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-background py-8 px-8 rounded-lg text-center">
          <p className="text-sm text-text-muted mb-4">© 2026 Mahallemiz — Trendex Lojistik tarafından geliştirilmiştir.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/gizlilik" className="text-sm text-primary hover:text-primary-hover font-medium transition-colors">
              Gizlilik Politikası
            </Link>
            <span className="text-[#e0e0e0]">•</span>
            <Link href="/kosullar" className="text-sm text-primary hover:text-primary-hover font-medium transition-colors">
              Kullanım Koşulları
            </Link>
            <span className="text-[#e0e0e0]">•</span>
            <Link href="/yardim" className="text-sm text-primary hover:text-primary-hover font-medium transition-colors">
              Yardım Merkezi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
