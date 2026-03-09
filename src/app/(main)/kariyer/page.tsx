import Link from 'next/link';
import { ArrowLeft, Briefcase, MapPin, Clock, Users, Heart, Award, GraduationCap, Utensils, Navigation, BarChart3, Send } from 'lucide-react';

const positions = [
  {
    id: 1,
    title: 'Frontend Geliştirici',
    department: 'Teknik Ekip',
    location: 'İstanbul',
    type: 'Tam Zamanlı',
    description:
      'React ve Next.js kullanarak modern, kullanıcı dostu arayüzler geliştirin. Performans ve erişilebilirlik konularında tutkulu bir geliştirici arıyoruz.',
    icon: Briefcase,
  },
  {
    id: 2,
    title: 'Backend Geliştirici',
    department: 'Teknik Ekip',
    location: 'İstanbul',
    type: 'Tam Zamanlı',
    description:
      'Node.js ile ölçeklenebilir backend sistemler tasarlayın ve geliştirin. API tasarımı, veritabanı yönetimi ve sistem mimarisi konularında deneyim arıyoruz.',
    icon: Briefcase,
  },
  {
    id: 3,
    title: 'Mobil Geliştirici',
    department: 'Teknik Ekip',
    location: 'Uzaktan',
    type: 'Tam Zamanlı',
    description:
      'React Native ile iOS ve Android uygulamaları geliştirin. Mobil UX/UI best practices hakkında bilgili ve problem çözmede başarılı bir geliştirici arıyoruz.',
    icon: Briefcase,
  },
  {
    id: 4,
    title: 'Ürün Tasarımcısı (UI/UX)',
    department: 'Tasarım',
    location: 'İstanbul',
    type: 'Tam Zamanlı',
    description:
      'Kullanıcı odaklı, intuitif arayüzler tasarlayın. Figma veya benzeri araçlarda yetkiniz ve user research geçmişiniz varsa, sizleri merak ediyoruz.',
    icon: Briefcase,
  },
  {
    id: 5,
    title: 'Topluluk Yöneticisi',
    department: 'Operasyonlar',
    location: 'İstanbul',
    type: 'Yarı Zamanlı',
    description:
      'KomşuApp topluluğunu yönetin, kullanıcı etkileşimini teşvik edin ve mahalle sakinlerinin bağlantıda kalmasını sağlayın. İletişim ve liderlik becerileriniz ön planda olmalı.',
    icon: Briefcase,
  },
  {
    id: 6,
    title: 'Veri Analisti',
    department: 'Ürün & Analytics',
    location: 'İstanbul',
    type: 'Tam Zamanlı',
    description:
      'Kullanıcı davranışı analiz edin, veri görselleştirmesi yapın ve ürün geliştirme kararlarını veri ile destekleyin. SQL, Python/R ve BI araçları konusunda deneyim gereklidir.',
    icon: Briefcase,
  },
];

const benefits = [
  { icon: Clock, title: 'Esnek Çalışma', desc: 'Kendi hızında çalışın, iş-yaşam dengesini sağlayın.' },
  { icon: Heart, title: 'Sağlık Sigortası', desc: 'Kapsamlı sağlık sigortası paketi.' },
  { icon: GraduationCap, title: 'Eğitim Bütçesi', desc: 'Yıllık 3000₺ eğitim ve profesyonel gelişim bütçesi.' },
  { icon: Utensils, title: 'Yemek Kartı', desc: 'Aylık 500₺ yemek kartı desteği.' },
  { icon: Navigation, title: 'Ulaşım Desteği', desc: 'Aylık ulaşım masraflarında %50 destek.' },
  { icon: Users, title: 'Takım Kullanı', desc: 'Aylık takım aktiviteleri ve sosyal etkinlikler.' },
];

const values = [
  { title: 'İnovasyon', desc: 'Sorunlara yaratıcı çözümler bulun.' },
  { title: 'Dayanışma', desc: 'Takımla birlikte başarılı olun.' },
  { title: 'Sürekli Öğrenme', desc: 'Profesyonel büyümeyi destekleriz.' },
  { title: 'Dürüstlük', desc: 'Açık ve şeffaf iletişim.' },
];

export default function CareersPage() {
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
          <div className="bg-gradient-to-br from-[#00833e] via-[#00833e] to-[#006b32] p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>

            <div className="relative z-10">
              <Briefcase className="w-20 h-20 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-3">KomşuApp'ta Kariyer</h1>
              <p className="text-green-100 text-lg">
                Mahalleler ve topluluklar yönetmek için bizimle bir ekibin parçası olun
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12">
            {/* Company Culture */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#333] mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#00833e] rounded-full"></span>
                Şirket Kültürü
              </h2>

              {/* Mission & Vision */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0]">
                  <h3 className="text-lg font-bold text-[#00833e] mb-2 flex items-center gap-2">
                    <Award size={20} />
                    Misyonumuz
                  </h3>
                  <p className="text-[#404040] leading-relaxed">
                    Mahalle sakinlerinin birbirleriyle bağlantı kurmasını, bilgi paylaşmasını ve güçlü,
                    güvenli topluluklar oluşturmasını sağlamak. Teknoloji aracılığıyla komşuluk ilişkilerini
                    güçlendirmektir.
                  </p>
                </div>

                <div className="p-6 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0]">
                  <h3 className="text-lg font-bold text-[#00833e] mb-2 flex items-center gap-2">
                    <Award size={20} />
                    Vizyonumuz
                  </h3>
                  <p className="text-[#404040] leading-relaxed">
                    Her mahallede yerel bağlantıların ve karşılıklı güvenin kuvvetli olduğu bir dünya
                    yaratmak. İnsanların birbirlerini tanıması, yardımlaşması ve birlikte gelişmesi için
                    platform sunmak.
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
                      className="p-4 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0] hover:border-[#00833e] transition-all"
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

              <div className="space-y-4">
                {positions.map((position) => (
                  <div
                    key={position.id}
                    className="p-6 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0] hover:border-[#00833e] hover:bg-white transition-all duration-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-grow">
                        <h3 className="text-lg font-bold text-[#333] mb-2">{position.title}</h3>
                        <p className="text-[#404040] text-sm mb-3">{position.description}</p>

                        <div className="flex flex-wrap gap-3 text-sm text-[#8f8f8f]">
                          <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-[#e0e0e0]">
                            <Briefcase size={14} />
                            {position.department}
                          </div>
                          <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-[#e0e0e0]">
                            <MapPin size={14} />
                            {position.location}
                          </div>
                          <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-[#e0e0e0]">
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
                ))}
              </div>
            </section>

            {/* Benefits */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#333] mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#00833e] rounded-full"></span>
                Avantajlar & Fırsatlar
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div
                      key={benefit.title}
                      className="p-6 bg-gradient-to-br from-white to-[#f0f2f5] rounded-lg border border-[#e0e0e0] hover:border-[#00833e] transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-[#00833e]/10 rounded-lg flex-shrink-0">
                          <Icon className="w-6 h-6 text-[#00833e]" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#333] mb-1">{benefit.title}</h3>
                          <p className="text-sm text-[#8f8f8f]">{benefit.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Why Join Us */}
            <section className="mb-12 p-8 bg-gradient-to-br from-[#00833e]/10 to-[#006b32]/10 rounded-lg border border-[#00833e]/20">
              <h2 className="text-2xl font-bold text-[#333] mb-4 flex items-center gap-2">
                <Users size={24} />
                Neden KomşuApp'a Katılmalısınız?
              </h2>
              <ul className="space-y-3 text-[#404040]">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#00833e] rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    <strong>Anlamlı İş:</strong> Mahalleler ve topluluklar üzerine gerçek etkisi olan bir
                    projede çalışın.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#00833e] rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    <strong>Dinamik Takım:</strong> Farklı beceri ve perspektiflerle çeşitli bir ekipte
                    çalışın.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#00833e] rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    <strong>Profesyonel Gelişim:</strong> Mentoring, eğitim fırsatları ve kariyer patikası
                    desteği.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#00833e] rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    <strong>Esnek Ortam:</strong> Uzaktan çalışma, esnek saatler ve iş-yaşam dengesi
                    önceliği.
                  </span>
                </li>
              </ul>
            </section>

            {/* Application CTA */}
            <section className="p-8 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0] text-center">
              <h3 className="text-2xl font-bold text-[#333] mb-3">Başvurunuzu Gönderin</h3>
              <p className="text-[#404040] mb-6 max-w-2xl mx-auto">
                Siz de KomşuApp ekibinin bir parçası olmak istiyorsanız, bize bir e-posta gönderin. CV'nizi,
                portföyünüzü ve neden KomşuApp'ta çalışmak istediğinizi bize anlatın.
              </p>
              <Link
                href="mailto:kariyer@komsuapp.com"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#00833e] text-white rounded-lg font-bold hover:bg-[#006b32] transition-colors"
              >
                <Send size={20} />
                kariyer@komsuapp.com
              </Link>
              <p className="text-sm text-[#8f8f8f] mt-4">
                Soruların mı var? Lütfen bize yazın, hemen cevap vereceğiz.
              </p>
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
