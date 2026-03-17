"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Shield,
  Lock,
  AlertCircle,
  Users,
  Baby,
  Phone,
  Flag,
  Eye,
  Zap,
  CheckCircle2,
  MapPin,
  ChevronDown,
  Heart,
  Lightbulb,
  BarChart3,
} from "lucide-react";

const securityTips = [
  {
    section: "Profil Güvenliği",
    icon: Lock,
    tips: [
      {
        title: "Güçlü Şifre Kullanın",
        desc: "En az 8 karakter, büyük-küçük harfler, rakamlar ve sembol içeren şifreler kullanın.",
      },
      {
        title: "Kişisel Bilgileri Sınırlı Paylaşın",
        desc: "Ev adresiniz, telefon numaranız veya finansal bilgilerinizi asla paylaşmayın.",
      },
      {
        title: "Profil Mahremiyetini Ayarlayın",
        desc: "Kimin profilinizi görebileceğini, mesaj gönderebileceğini kontrol edin.",
      },
      {
        title: "İki Faktörlü Kimlik Doğrulama Etkinleştirin",
        desc: "Hesabınızı ekstra koruma katmanı ile güvenli tutun.",
      },
    ],
  },
  {
    section: "Çevrimiçi Güvenlik",
    icon: Eye,
    tips: [
      {
        title: "Şüpheli Mesajlara Dikkat Edin",
        desc: "Tanımadığınız kişilerden gelen tuhaf mesajlar veya linkler için dikkatli olun.",
      },
      {
        title: "Sahte Hesapları Bildirin",
        desc: "Sahte veya şüpheli hesapları derhal raporlayın, moderatörlerimize iletişime geçin.",
      },
      {
        title: "Ödeme Bilgilerinizi Koruyun",
        desc: "Asla para göndermek veya ödemeleri KomşuApp aracılığıyla kabul etmeyin.",
      },
      {
        title: "Sosyal Mühendislik Hilelerine Karşı Dikkat",
        desc: "İnsanlar sizi bahane yaparak bilgi almaya çalışabilir. Şüphelendiğinizde moderatöre bildirin.",
      },
    ],
  },
  {
    section: "Mahalle Güvenliği",
    icon: MapPin,
    tips: [
      {
        title: "Komşularınızı Tanıyın",
        desc: "KomşuApp aracılığıyla mahallenizdeki insanları tanıyın ve güven oluşturun.",
      },
      {
        title: "Güvenlik Gözlemlerinizi Paylaşın",
        desc: "Mahallede gözlediğiniz şüpheli faaliyetleri topluluyla paylaşın (kimseyi hedef almadan).",
      },
      {
        title: "Komşu Ağlarını Güçlendirin",
        desc: "Mahalle sakinleriyle yakın ilişkiler kurun ve karşılıklı yardımlaşmayı sağlayın.",
      },
      {
        title: "Acil Durum İletişim Ağı Oluşturun",
        desc: "Mahallenizdeki önemli acil durum numaralarını ve iletişim bilgilerini paylaşın.",
      },
    ],
  },
  {
    section: "Çocuk Güvenliği",
    icon: Baby,
    tips: [
      {
        title: "Çocukların Aktivitesini İzleyin",
        desc: "Çocuklarınızın kimler tarafından mesaj aldığını ve neleri paylaştığını kontrol edin.",
      },
      {
        title: "Çocuklara Çevrimiçi Güvenlik Eğitimi Verin",
        desc: "Çocuklarınıza yaşlı insanlarla çevrimiçi iletişim konularında eğitim verin.",
      },
      {
        title: "Kimlik Doğrulaması Gerektiren İşlemleri Kısıtlayın",
        desc: "Belirli yaş altı kullanıcıların profil resmi veya konumu paylaşmasını sınırlayın.",
      },
      {
        title: "Raporla ve Bildir",
        desc: "Herhangi bir uygunsuz davranış veya içeriği derhal bildirin.",
      },
    ],
  },
];

const emergencyContacts = [
  { title: "Polis", number: "155", desc: "Acil durumda polis" },
  { title: "İtfaiye", number: "110", desc: "Yangın veya acil tıbbi durum" },
  { title: "Ambulans", number: "112", desc: "Tıbbi acil durum" },
  { title: "Rehber", number: "118", desc: "Şehir rehberi ve bilgi" },
];

interface TrustScoreInfo {
  level: string;
  score: number;
  factors: string[];
  color: string;
}

const trustScoreInfo: TrustScoreInfo = {
  level: "Yüksek",
  score: 85,
  factors: [
    "Profil tamamlığı",
    "İyi davranış geçmişi",
    "Mahalle katılımı",
    "Doğrulanmış kimlik",
  ],
  color: "#00833e",
};

export default function SecurityPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#f0f2f5] py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#00833e] hover:text-[#006b32] font-semibold mb-8 transition-colors hover:gap-3"
        >
          <ArrowLeft size={18} />
          Ana Sayfaya Dön
        </Link>

        <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden shadow-lg">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-[#00833e] via-[#00833e] to-[#006b32] p-12 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full -mr-24 -mt-24"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-20 -mb-20"></div>

            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                  <Shield className="w-24 h-24 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-4">Güvenlik Merkezi</h1>
              <p className="text-green-100 text-xl max-w-2xl mx-auto leading-relaxed">
                Kendini ve mahalleni güvende tut — İpuçları, kaynaklar ve acil iletişim bilgileri
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12">
            {/* Trust Score Section */}
            <section className="mb-12 p-8 bg-gradient-to-br from-[#00833e]/10 to-[#006b32]/5 rounded-lg border border-[#00833e]/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#333] mb-2 flex items-center gap-2">
                    <BarChart3 size={24} className="text-[#00833e]" />
                    Güven Puanı
                  </h2>
                  <p className="text-[#8f8f8f]">
                    Profilinizin topluluk tarafından ne kadar güvenilir olduğunu gösteren bir puandır
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-end gap-4 mb-6">
                    <div>
                      <div className="text-5xl font-bold text-[#00833e]">{trustScoreInfo.score}</div>
                      <div className="text-sm text-[#8f8f8f]">/ 100</div>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-[#e0e0e0] rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-[#00833e]"
                          style={{ width: `${trustScoreInfo.score}%` }}
                        />
                      </div>
                      <div className="text-sm font-semibold text-[#00833e]">
                        {trustScoreInfo.level} Güven
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#333] mb-4">Güven Faktörleri:</h3>
                  <ul className="space-y-2">
                    {trustScoreInfo.factors.map((factor, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 text-sm text-[#404040]"
                      >
                        <CheckCircle2 size={18} className="text-[#00833e] flex-shrink-0" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg border border-[#e0e0e0]">
                <p className="text-sm text-[#8f8f8f]">
                  💡 <strong>İpucu:</strong> Profilinizi tamamlayarak, mahallede aktif katılım göstererek ve güvenilir davranışlar sergileyerek güven puanınızı artırabilirsiniz.
                </p>
              </div>
            </section>

            {/* Emergency Contacts */}
            <section className="mb-12 p-8 bg-red-50 border-2 border-red-200 rounded-lg">
              <h2 className="text-2xl font-bold text-red-700 mb-2 flex items-center gap-2">
                <AlertCircle size={28} className="flex-shrink-0" />
                Acil Durumda İletişim
              </h2>
              <p className="text-red-700 mb-6 text-base leading-relaxed">
                Hayati tehlike varsa veya hızlı yardım gerekiyorsa, lütfen bu numaraları arayın:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {emergencyContacts.map((contact) => (
                  <a
                    key={contact.number}
                    href={`tel:${contact.number}`}
                    className="bg-white p-5 rounded-lg border-2 border-red-200 hover:border-red-400 hover:shadow-lg transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-[#333] text-lg mb-1">{contact.title}</h3>
                        <p className="text-sm text-[#8f8f8f] mb-3">{contact.desc}</p>
                        <div className="text-3xl font-black text-red-600 group-hover:scale-105 transition-transform">
                          {contact.number}
                        </div>
                      </div>
                      <Phone size={24} className="text-red-600 opacity-50 mt-1" />
                    </div>
                  </a>
                ))}
              </div>
            </section>

            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-[#333] mb-4 flex items-center gap-3">
                <Lightbulb size={32} className="text-[#00833e]" />
                Güvenlik İpuçları
              </h2>
              <div className="bg-[#f0f2f5] p-6 rounded-lg border border-[#e0e0e0]">
                <p className="text-[#404040] leading-relaxed text-base">
                  KomşuApp'ta güvenli olmak, hem çevrimiçi güvenlik hem de mahalle güvenliği hakkında
                  bilinçli olmak demektir. Bu rehber, seni ve mahalleni daha güvenli hale getirmek için tasarlanmış pratik ipuçları ve kaynaklarla dolu.
                </p>
              </div>
            </section>

            {/* Security Tips by Category */}
            {securityTips.map((category) => {
              const Icon = category.icon;
              const isExpanded = expandedSection === category.section;
              return (
                <section key={category.section} className="mb-10">
                  <button
                    onClick={() =>
                      setExpandedSection(
                        isExpanded ? null : category.section
                      )
                    }
                    className="w-full text-left p-6 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0] hover:border-[#00833e] hover:bg-[#f9fbf9] transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#00833e]/10 rounded-lg group-hover:bg-[#00833e]/20 transition-colors">
                          <Icon className="w-6 h-6 text-[#00833e]" />
                        </div>
                        <div className="text-left">
                          <h2 className="text-xl font-bold text-[#333]">
                            {category.section}
                          </h2>
                          <p className="text-sm text-[#8f8f8f]">
                            {category.tips.length} tavsiye
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-6 h-6 text-[#00833e] transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                      {category.tips.map((tip, idx) => (
                        <div
                          key={idx}
                          className="p-6 bg-white border-2 border-[#e0e0e0] rounded-lg hover:border-[#00833e]/50 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-8 h-8 bg-[#00833e]/10 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-[#00833e]">
                                  ✓
                                </span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-[#333] mb-2 text-lg">
                                {tip.title}
                              </h3>
                              <p className="text-[#404040] leading-relaxed">
                                {tip.desc}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}

            {/* Report Safety Concerns */}
            <section className="mb-12 p-10 bg-gradient-to-br from-[#00833e]/10 via-transparent to-[#006b32]/5 rounded-lg border-2 border-[#00833e]/30">
              <h2 className="text-3xl font-bold text-[#333] mb-2 flex items-center gap-3">
                <div className="p-2 bg-[#00833e]/20 rounded-lg">
                  <Flag size={28} className="text-[#00833e]" />
                </div>
                Dolandırıcılık & Güvenlik Endişeleri
              </h2>
              <p className="text-[#8f8f8f] mb-6">Kötüye kullanımları bildirin, moderatörler derhal inceleyecektir</p>

              <div className="space-y-4 mb-8">
                <div className="flex gap-4 p-5 bg-white rounded-lg border border-[#e0e0e0] hover:shadow-md transition-all">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#00833e]/10 text-[#00833e] font-bold text-base">
                      1
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#333] text-base mb-1">Uygunsuz İçeriği Bildir</h3>
                    <p className="text-sm text-[#8f8f8f]">
                      Bir gönderi, yorum veya profil üzerindeki "Bildir" butonuna tıklayarak uygunsuz içeriği bildirin.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-5 bg-white rounded-lg border border-[#e0e0e0] hover:shadow-md transition-all">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#00833e]/10 text-[#00833e] font-bold text-base">
                      2
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#333] text-base mb-1">Sahte Hesabı Raporla</h3>
                    <p className="text-sm text-[#8f8f8f]">
                      Profil sayfasından Menü → "Sahte Hesabı Bildir" seçeneğini kullanın.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-5 bg-white rounded-lg border border-[#e0e0e0] hover:shadow-md transition-all">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#00833e]/10 text-[#00833e] font-bold text-base">
                      3
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#333] text-base mb-1">Destek Ekibiyle İletişime Geçin</h3>
                    <p className="text-sm text-[#8f8f8f]">
                      Ciddi güvenlik sorunu için: destek@komsuapp.com veya Yardım Merkezi'nden ticket açın.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 flex-col sm:flex-row">
                <Link
                  href="/yardim"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00833e] text-white rounded-lg font-semibold hover:bg-[#006b32] transition-all duration-200 hover:shadow-lg"
                >
                  <Flag size={20} />
                  Sorun Bildir
                </Link>
                <Link
                  href="/gizlilik"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#00833e] text-[#00833e] rounded-lg font-semibold hover:bg-[#00833e]/5 transition-all duration-200"
                >
                  Gizlilik Politikası
                </Link>
              </div>
            </section>

            {/* Community Guidelines */}
            <section className="p-10 bg-gradient-to-br from-[#f0f2f5] to-white rounded-lg border-2 border-[#e0e0e0]">
              <h2 className="text-3xl font-bold text-[#333] mb-3 flex items-center gap-3">
                <div className="p-2 bg-[#00833e]/10 rounded-lg">
                  <Users size={28} className="text-[#00833e]" />
                </div>
                Topluluk Kuralları
              </h2>

              <p className="text-[#404040] leading-relaxed mb-8">
                KomşuApp, herkesin güvende ve saygılı hissetmesi için tasarlanmıştır. Bu kurallar platformumuzun
                ve mahallelerimizin güvenli, saygılı ve faydalı kalmasını sağlar.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex gap-4 p-4 bg-white rounded-lg border border-[#e0e0e0] hover:border-[#00833e]/50 hover:shadow-md transition-all">
                  <div className="flex-shrink-0 pt-1">
                    <Zap className="w-6 h-6 text-[#00833e]" />
                  </div>
                  <div>
                    <p className="text-[#404040]">
                      <strong className="text-[#333]">Saygılı İletişim:</strong> Herkese saygı gösterin, nefret söylemi veya hakarete katılmayın. Farklı görüşlere hoşgörü gösterin.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-white rounded-lg border border-[#e0e0e0] hover:border-[#00833e]/50 hover:shadow-md transition-all">
                  <div className="flex-shrink-0 pt-1">
                    <Zap className="w-6 h-6 text-[#00833e]" />
                  </div>
                  <div>
                    <p className="text-[#404040]">
                      <strong className="text-[#333]">Kimseyi Hedef Almayın:</strong> Belirli kişileri veya grupları hedef alan saldırgan veya aşağılayıcı mesajlar göndermeyiniz.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-white rounded-lg border border-[#e0e0e0] hover:border-[#00833e]/50 hover:shadow-md transition-all">
                  <div className="flex-shrink-0 pt-1">
                    <Zap className="w-6 h-6 text-[#00833e]" />
                  </div>
                  <div>
                    <p className="text-[#404040]">
                      <strong className="text-[#333]">Yasal İçerik:</strong> Yasadışı aktiviteleri tanıtmayın, teşvik etmeyin veya ayrıntılı şekilde anlatmayın.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-white rounded-lg border border-[#e0e0e0] hover:border-[#00833e]/50 hover:shadow-md transition-all">
                  <div className="flex-shrink-0 pt-1">
                    <Zap className="w-6 h-6 text-[#00833e]" />
                  </div>
                  <div>
                    <p className="text-[#404040]">
                      <strong className="text-[#333]">Mahrem Bilgiler:</strong> Kimseye, hatta muhataplarınıza bile ev adresi, telefon numarası veya finansal bilgilerini paylaşmayınız.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-white rounded-lg border border-[#e0e0e0] hover:border-[#00833e]/50 hover:shadow-md transition-all">
                  <div className="flex-shrink-0 pt-1">
                    <Zap className="w-6 h-6 text-[#00833e]" />
                  </div>
                  <div>
                    <p className="text-[#404040]">
                      <strong className="text-[#333]">Spam & Dolandırıcılık:</strong> Spam, ticari reklamlar veya dolandırıcılık girişimlerini görmüyü bildirin.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/topluluk-kurallari"
                className="inline-flex items-center gap-2 px-6 py-3 text-[#00833e] hover:text-[#006b32] hover:bg-[#00833e]/5 font-semibold transition-all duration-200 rounded-lg border border-[#00833e]/20 hover:border-[#00833e]/50"
              >
                Tam Topluluk Kurallarını Oku
                <ArrowLeft size={20} className="rotate-180" />
              </Link>
            </section>
          </div>

          {/* Footer */}
          <div className="border-t border-[#e0e0e0] bg-[#f0f2f5] py-8 px-8 text-center">
            <p className="text-sm text-[#8f8f8f] mb-6">
              © 2026 KomşuApp — Trendex Lojistik tarafından geliştirilmiştir.
            </p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <Link
                href="/gizlilik"
                className="text-sm text-[#00833e] hover:text-[#006b32] font-semibold transition-colors hover:underline"
              >
                Gizlilik Politikası
              </Link>
              <span className="text-[#e0e0e0]">•</span>
              <Link
                href="/kosullar"
                className="text-sm text-[#00833e] hover:text-[#006b32] font-semibold transition-colors hover:underline"
              >
                Kullanım Koşulları
              </Link>
              <span className="text-[#e0e0e0]">•</span>
              <Link
                href="/yardim"
                className="text-sm text-[#00833e] hover:text-[#006b32] font-semibold transition-colors hover:underline"
              >
                Yardım Merkezi
              </Link>
            </div>
            <p className="text-xs text-[#8f8f8f] mt-6">
              Sorularınız veya endişeleriniz varsa lütfen destek@komsuapp.com ile iletişime geçin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
