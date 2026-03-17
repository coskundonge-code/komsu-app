"use client";

import Link from "next/link";
import { ArrowLeft, Briefcase, MapPin, Clock, Users, Heart, Award, GraduationCap, Utensils, Navigation, BarChart3, Send, Code2, Palette, MessageSquare, TrendingUp } from "lucide-react";
import { useState } from "react";

const positions = [
  {
    id: 1,
    title: "Frontend Geliştirici",
    department: "Teknik Ekip",
    location: "İstanbul",
    type: "Tam Zamanlı",
    description:
      "React ve Next.js kullanarak modern, kullanıcı dostu arayüzler geliştirin. Performans ve erişilebilirlik konularında tutkulu bir geliştirici arıyoruz.",
    icon: Code2,
  },
  {
    id: 2,
    title: "Backend Geliştirici",
    department: "Teknik Ekip",
    location: "İstanbul",
    type: "Tam Zamanlı",
    description:
      "Node.js ile ölçeklenebilir backend sistemler tasarlayın ve geliştirin. API tasarımı, veritabanı yönetimi ve sistem mimarisi konularında deneyim arıyoruz.",
    icon: Code2,
  },
  {
    id: 3,
    title: "Ürün Tasarımcısı",
    department: "Tasarım",
    location: "İstanbul",
    type: "Tam Zamanlı",
    description:
      "Kullanıcı odaklı, intuitif arayüzler tasarlayın. Figma veya benzeri araçlarda yetkiniz ve user research geçmişiniz varsa, sizleri merak ediyoruz.",
    icon: Palette,
  },
  {
    id: 4,
    title: "Topluluk Yöneticisi",
    department: "Operasyonlar",
    location: "İstanbul",
    type: "Tam Zamanlı",
    description:
      "KomşuApp topluluğunu yönetin, kullanıcı etkileşimini teşvik edin ve mahalle sakinlerinin bağlantıda kalmasını sağlayın. İletişim ve liderlik becerileriniz ön planda olmalı.",
    icon: MessageSquare,
  },
  {
    id: 5,
    title: "Pazarlama Uzmanı",
    department: "Pazarlama",
    location: "İstanbul",
    type: "Tam Zamanlı",
    description:
      "KomşuApp'ın markasını güçlendirin ve hedef kitleye ulaşın. Dijital pazarlama, sosyal medya ve reklam kampanyaları konusunda deneyimli bir profesyonel arıyoruz.",
    icon: TrendingUp,
  },
  {
    id: 6,
    title: "Veri Analisti",
    department: "Ürün & Analytics",
    location: "İstanbul",
    type: "Tam Zamanlı",
    description:
      "Kullanıcı davranışı analiz edin, veri görselleştirmesi yapın ve ürün geliştirme kararlarını veri ile destekleyin. SQL, Python/R ve BI araçları konusunda deneyim gereklidir.",
    icon: BarChart3,
  },
];

const benefits = [
  { icon: Clock, title: "Esnek Çalışma", desc: "Kendi hızında çalışın, iş-yaşam dengesini sağlayın." },
  { icon: Heart, title: "Sağlık Sigortası", desc: "Kapsamlı sağlık sigortası paketi." },
  { icon: GraduationCap, title: "Eğitim Bütçesi", desc: "Yıllık 3000₺ eğitim ve profesyonel gelişim bütçesi." },
  { icon: Utensils, title: "Yemek Kartı", desc: "Aylık 500₺ yemek kartı desteği." },
];

const values = [
  { title: "İnovasyon", desc: "Sorunlara yaratıcı çözümler bulun." },
  { title: "Dayanışma", desc: "Takımla birlikte başarılı olun." },
  { title: "Sürekli Öğrenme", desc: "Profesyonel büyümeyi destekleriz." },
  { title: "Dürüstlük", desc: "Açık ve şeffaf iletişim." },
];

export default function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  const departments = Array.from(new Set(positions.map((p) => p.department)));
  const filteredPositions = selectedDepartment ? positions.filter((p) => p.department === selectedDepartment) : positions;

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#00833e] hover:text-[#006b32] font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Ana Sayfaya Dön
        </Link>

        <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden shadow-sm">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#00833e] via-[#00833e] to-[#006b32] p-12 text-center text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-3">KomşuApp Ailesi'ne Katıl</h1>
              <p className="text-lg text-green-100 max-w-2xl mx-auto">
                Mahalleler ve topluluklar yönetmek için bizimle bir ekibin parçası olun. Anlamlı işler yapan, tutkulu bir takımda kendi potansiyelini keşfet.
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12">
            {/* Company Culture */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#333] mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#00833e] rounded-full"></span>
                Şirket Kültürü
              </h2>

              {/* Mission & Vision */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0] hover:border-[#00833e] transition-all">
                  <h3 className="text-lg font-bold text-[#00833e] mb-2 flex items-center gap-2">
                    <Award size={20} />
                    Misyonumuz
                  </h3>
                  <p className="text-[#404040] leading-relaxed">
                    Mahalle sakinlerinin birbirleriyle bağlantı kurmasını, bilgi paylaşmasını ve güçlü, güvenli topluluklar oluşturmasını sağlamak. Teknoloji aracılığıyla komşuluk ilişkilerini güçlendirmektir.
                  </p>
                </div>

                <div className="p-6 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0] hover:border-[#00833e] transition-all">
                  <h3 className="text-lg font-bold text-[#00833e] mb-2 flex items-center gap-2">
                    <Award size={20} />
                    Vizyonumuz
                  </h3>
                  <p className="text-[#404040] leading-relaxed">
                    Her mahallede yerel bağlantıların ve karşılıklı güvenin kuvvetli olduğu bir dünya yaratmak. İnsanların birbirlerini tanıması, yardımlaşması ve birlikte gelişmesi için platform sunmak.
                  </p>
                </div>
              </div>

              {/* Values */}
              <div>
                <h3 className="text-lg font-bold text-[#333] mb-4">Değerlerimiz</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {values.map((value) => (
                    <div
                      key={value.title}
                      className="p-4 bg-gradient-to-br from-white to-[#f0f2f5] rounded-lg border border-[#e0e0e0] hover:border-[#00833e] transition-all"
                    >
                      <h4 className="font-bold text-[#00833e] mb-1">{value.title}</h4>
                      <p className="text-sm text-[#8f8f8f]">{value.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Open Positions */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#333] mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#00833e] rounded-full"></span>
                Açık Pozisyonlar
              </h2>

              {/* Department Filter */}
              <div className="mb-6 flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedDepartment(null)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedDepartment === null
                      ? "bg-[#00833e] text-white"
                      : "bg-[#f0f2f5] text-[#333] border border-[#e0e0e0] hover:border-[#00833e]"
                  }`}
                >
                  Tüm Pozisyonlar
                </button>
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      selectedDepartment === dept
                        ? "bg-[#00833e] text-white"
                        : "bg-[#f0f2f5] text-[#333] border border-[#e0e0e0] hover:border-[#00833e]"
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>

              {/* Positions List */}
              <div className="space-y-4">
                {filteredPositions.map((position) => {
                  const Icon = position.icon;
                  return (
                    <div
                      key={position.id}
                      className="p-6 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0] hover:border-[#00833e] hover:bg-white transition-all duration-200"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-grow">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="p-2 bg-[#00833e]/10 rounded-lg flex-shrink-0">
                              <Icon className="w-5 h-5 text-[#00833e]" />
                            </div>
                            <h3 className="text-lg font-bold text-[#333]">{position.title}</h3>
                          </div>
                          <p className="text-[#404040] text-sm mb-4">{position.description}</p>

                          <div className="flex flex-wrap gap-3 text-sm text-[#8f8f8f]">
                            <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-[#e0e0e0]">
                              <Briefcase size={14} />
                              {position.department}
                            </div>
                            <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-[#e0e0e0]">
                              <MapPin size={14} />
                              {position.location}
                            </div>
                            <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-[#e0e0e0]">
                              <Clock size={14} />
                              {position.type}
                            </div>
                          </div>
                        </div>

                        <Link
                          href={`mailto:kariyer@komsuapp.com?subject=Başvuru: ${position.title}`}
                          className="px-6 py-2 bg-[#00833e] text-white rounded-lg font-semibold hover:bg-[#006b32] transition-colors whitespace-nowrap text-center"
                        >
                          Başvur
                        </Link>
                      </div>
                    </div>
                  );
                })}

                {filteredPositions.length === 0 && (
                  <div className="p-8 text-center bg-[#f0f2f5] rounded-lg border border-[#e0e0e0]">
                    <p className="text-[#8f8f8f]">Bu departmanda açık pozisyon bulunmamaktadır.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Benefits */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#333] mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#00833e] rounded-full"></span>
                Fayda ve Olanaklar
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div
                      key={benefit.title}
                      className="p-6 bg-gradient-to-br from-white to-[#f0f2f5] rounded-lg border border-[#e0e0e0] hover:border-[#00833e] hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="p-3 bg-[#00833e]/10 rounded-lg flex-shrink-0 mb-3">
                          <Icon className="w-6 h-6 text-[#00833e]" />
                        </div>
                        <h3 className="font-bold text-[#333] mb-1">{benefit.title}</h3>
                        <p className="text-sm text-[#8f8f8f]">{benefit.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Why Join Us */}
            <section className="mb-12 p-8 bg-gradient-to-br from-[#00833e]/10 to-[#006b32]/10 rounded-lg border border-[#00833e]/20">
              <h2 className="text-2xl font-bold text-[#333] mb-6 flex items-center gap-2">
                <Users size={24} />
                Neden KomşuApp'a Katılmalısınız?
              </h2>
              <ul className="space-y-4 text-[#404040]">
                <li className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 bg-[#00833e] rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    <strong>Anlamlı İş:</strong> Mahalleler ve topluluklar üzerine gerçek etkisi olan bir projede çalışın.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 bg-[#00833e] rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    <strong>Dinamik Takım:</strong> Farklı beceri ve perspektiflerle çeşitli bir ekipte çalışın.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 bg-[#00833e] rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    <strong>Profesyonel Gelişim:</strong> Mentoring, eğitim fırsatları ve kariyer patikası desteği.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 bg-[#00833e] rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    <strong>Esnek Ortam:</strong> Uzaktan çalışma, esnek saatler ve iş-yaşam dengesi önceliği.
                  </span>
                </li>
              </ul>
            </section>

            {/* General Application CTA */}
            <section className="mb-12 p-8 bg-gradient-to-br from-[#00833e]/5 to-[#006b32]/5 rounded-lg border border-[#e0e0e0]">
              <h3 className="text-xl font-bold text-[#333] mb-3">Açık pozisyon bulamadın mı?</h3>
              <p className="text-[#404040] mb-4">
                Eğer diğer pozisyonlar arasında uygun bir fırsat bulamadıysan, yine de bize CV'nizi ve motivasyon mektubunuzu gönderebilirsin. Gelen başvuruları düzenli olarak inceliyor ve uygun fırsatlar için seni işe almayı düşünüyoruz.
              </p>
              <Link
                href="mailto:kariyer@komsuapp.com?subject=Genel Başvuru"
                className="inline-flex items-center gap-2 px-6 py-2 bg-[#00833e]/20 text-[#00833e] rounded-lg font-semibold hover:bg-[#00833e]/30 transition-colors"
              >
                <Send size={16} />
                Genel Başvuru Yap
              </Link>
            </section>

            {/* Contact CTA */}
            <section className="p-10 bg-gradient-to-br from-[#00833e] to-[#006b32] rounded-lg text-center text-white">
              <h3 className="text-2xl font-bold mb-3">Sorularınız mı var?</h3>
              <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                Kariyer fırsatları hakkında daha fazla bilgi almak veya sorularınız varsa, bize doğrudan iletişime geçin. Takımımız seninle konuşmak için hevesli!
              </p>
              <Link
                href="mailto:kariyer@komsuapp.com"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#00833e] rounded-lg font-bold hover:bg-green-50 transition-colors"
              >
                <Send size={20} />
                kariyer@komsuapp.com
              </Link>
            </section>
          </div>

          {/* Footer */}
          <div className="border-t border-[#e0e0e0] bg-[#f0f2f5] py-6 px-8 text-center">
            <p className="text-sm text-[#8f8f8f] mb-4">
              © 2026 KomşuApp — Trendex Lojistik tarafından geliştirilmiştir.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/gizlilik"
                className="text-sm text-[#00833e] hover:text-[#006b32] font-medium transition-colors"
              >
                Gizlilik Politikası
              </Link>
              <span className="text-[#e0e0e0]">•</span>
              <Link
                href="/kosullar"
                className="text-sm text-[#00833e] hover:text-[#006b32] font-medium transition-colors"
              >
                Kullanım Koşulları
              </Link>
              <span className="text-[#e0e0e0]">•</span>
              <Link
                href="/yardim"
                className="text-sm text-[#00833e] hover:text-[#006b32] font-medium transition-colors"
              >
                Yardım Merkezi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
