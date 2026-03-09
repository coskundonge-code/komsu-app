import Link from 'next/link';
import { ArrowLeft, Shield, Lock, AlertCircle, Users, Baby, Phone, Flag, Eye, Zap, CheckCircle2, MapPin } from 'lucide-react';

const securityTips = [
  {
    section: 'Profil Güvenliği',
    icon: Lock,
    tips: [
      {
        title: 'Güçlü Şifre Kullanın',
        desc: 'En az 8 karakter, büyük-küçük harfler, rakamlar ve sembol içeren şifreler kullanın.',
      },
      {
        title: 'Kişisel Bilgileri Sınırlı Paylaşın',
        desc: 'Ev adresiniz, telefon numaranız veya finansal bilgilerinizi asla paylaşmayın.',
      },
      {
        title: 'Profil Mahremiyetini Ayarlayın',
        desc: 'Kimin profilinizi görebileceğini, mesaj gönderebileceğini kontrol edin.',
      },
      {
        title: 'İki Faktörlü Kimlik Doğrulama Etkinleştirin',
        desc: 'Hesabınızı ekstra koruma katmanı ile güvenli tutun.',
      },
    ],
  },
  {
    section: 'Çevrimiçi Güvenlik',
    icon: Eye,
    tips: [
      {
        title: 'Şüpheli Mesajlara Dikkat Edin',
        desc: 'Tanımadığınız kişilerden gelen tuhaf mesajlar veya linkler için dikkatli olun.',
      },
      {
        title: 'Sahte Hesapları Bildirin',
        desc: 'Sahte veya şüpheli hesapları derhal raporlayın, moderatörlerimize iletişime geçin.',
      },
      {
        title: 'Ödeme Bilgilerinizi Koruyun',
        desc: 'Asla para göndermek veya ödemeleri KomşuApp aracılığıyla kabul etmeyin.',
      },
      {
        title: 'Sosyal Mühendislik Hilelerine Karşı Dikkat',
        desc: 'İnsanlar sizi bahane yaparak bilgi almaya çalışabilir. Şüphelendiğinizde moderatöre bildirin.',
      },
    ],
  },
  {
    section: 'Mahalle Güvenliği',
    icon: MapPin,
    tips: [
      {
        title: 'Komşularınızı Tanıyın',
        desc: 'KomşuApp aracılığıyla mahallenizdeki insanları tanıyın ve güven oluşturun.',
      },
      {
        title: 'Güvenlik Gözlemlerinizi Paylaşın',
        desc: 'Mahallede gözlediğiniz şüpheli faaliyetleri topluluyla paylaşın (kimseyi hedef almadan).',
      },
      {
        title: 'Komşu Ağlarını Güçlendirin',
        desc: 'Mahalle sakinleriyle yakın ilişkiler kurun ve karşılıklı yardımlaşmayı sağlayın.',
      },
      {
        title: 'Acil Durum İletişim Ağı Oluşturun',
        desc: 'Mahallenizdeki önemli acil durum numaralarını ve iletişim bilgilerini paylaşın.',
      },
    ],
  },
  {
    section: 'Çocuk Güvenliği',
    icon: Baby,
    tips: [
      {
        title: 'Çocukların Aktivitesini İzleyin',
        desc: 'Çocuklarınızın kimler tarafından mesaj aldığını ve neleri paylaştığını kontrol edin.',
      },
      {
        title: 'Çocuklara Çevrimiçi Güvenlik Eğitimi Verin',
        desc: 'Çocuklarınıza yaşlı insanlarla çevrimiçi iletişim konularında eğitim verin.',
      },
      {
        title: 'Kimlik Doğrulaması Gerektiren İşlemleri Kısıtlayın',
        desc: 'Belirli yaş altı kullanıcıların profil resmi veya konumu paylaşmasını sınırlayın.',
      },
      {
        title: 'Raporla ve Bildir',
        desc: 'Herhangi bir uygunsuz davranış veya içeriği derhal bildirin.',
      },
    ],
  },
];

const emergencyContacts = [
  { title: 'Polis', number: '155', desc: 'Acil durumda polis' },
  { title: 'İtfaiye', number: '110', desc: 'Yangın veya acil tıbbi durum' },
  { title: 'Ambulans', number: '112', desc: 'Tıbbi acil durum' },
  { title: 'Rehber', number: '118', desc: 'Şehir rehberi ve bilgi' },
];

export default function SecurityPage() {
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
              <Shield className="w-20 h-20 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-3">Güvenlik Merkezi</h1>
              <p className="text-green-100 text-lg">
                Kendini ve mahalleni güvende tut — İpuçları, kaynak ve acil bilgiler
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12">
            {/* Emergency Contacts */}
            <section className="mb-12 p-6 bg-red-50 border border-red-200 rounded-lg">
              <h2 className="text-2xl font-bold text-red-700 mb-4 flex items-center gap-2">
                <AlertCircle size={24} />
                Acil Durumda İletişim
              </h2>
              <p className="text-red-700 mb-4">
                Hayati bir tehlike varsa, lütfen bu numaraları arayın:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyContacts.map((contact) => (
                  <div
                    key={contact.number}
                    className="bg-white p-4 rounded-lg border border-red-200 flex items-start gap-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-[#333]">{contact.title}</h3>
                      <p className="text-sm text-[#8f8f8f] mb-2">{contact.desc}</p>
                      <a
                        href={`tel:${contact.number}`}
                        className="text-2xl font-bold text-red-600 hover:underline"
                      >
                        {contact.number}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#333] mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#00833e] rounded-full"></span>
                Güvenlik İpuçları
              </h2>
              <p className="text-[#404040] leading-relaxed text-lg mb-6">
                KomşuApp'ta güvenli olmak, hem çevrimiçi güvenlik hem de mahalle güvenliği hakkında
                bilinçli olmak demektir. Bu rehber, seni ve mahalleni daha güvenli hale getirmek için tasarlanmış ipuçları ve kaynaklarla dolu.
              </p>
            </section>

            {/* Security Tips by Category */}
            {securityTips.map((category) => {
              const Icon = category.icon;
              return (
                <section key={category.section} className="mb-12">
                  <h2 className="text-2xl font-bold text-[#333] mb-6 flex items-center gap-2">
                    <Icon className="w-6 h-6 text-[#00833e]" />
                    {category.section}
                  </h2>

                  <div className="space-y-4">
                    {category.tips.map((tip, idx) => (
                      <div
                        key={idx}
                        className="p-6 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0] hover:border-[#00833e] transition-all duration-200"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 pt-1">
                            <CheckCircle2 className="w-6 h-6 text-[#00833e]" />
                          </div>
                          <div>
                            <h3 className="font-bold text-[#333] mb-2">{tip.title}</h3>
                            <p className="text-[#404040]">{tip.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}

            {/* Report Safety Concerns */}
            <section className="mb-12 p-8 bg-gradient-to-br from-[#00833e]/10 to-[#006b32]/10 rounded-lg border border-[#00833e]/20">
              <h2 className="text-2xl font-bold text-[#333] mb-4 flex items-center gap-2">
                <Flag size={24} className="text-[#00833e]" />
                Güvenlik Endişelerinizi Bildirin
              </h2>

              <p className="text-[#404040] mb-6 leading-relaxed">
                Eğer KomşuApp'ta herhangi bir güvenlik sorunu veya tehlikeli davranış gördüysen, lütfen
                raporla. Tüm raporlar gizli tutulur ve derhal moderatörümüz tarafından incelenir.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-[#e0e0e0]">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#00833e]/10 text-[#00833e] font-bold text-sm">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#333]">Uygunsuz İçeriği Bildir</h3>
                    <p className="text-sm text-[#8f8f8f]">
                      Bir gönderi, yorum veya profil üzerinde "Bildir" butonuna tıklayın.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-[#e0e0e0]">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#00833e]/10 text-[#00833e] font-bold text-sm">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#333]">Sahte Hesabı Bildir</h3>
                    <p className="text-sm text-[#8f8f8f]">
                      Profil sayfasından "Daha Fazla Seçenek" → "Sahte Hesabı Bildir" seçin.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-[#e0e0e0]">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#00833e]/10 text-[#00833e] font-bold text-sm">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#333]">Destek Ekibiyle İletişime Geçin</h3>
                    <p className="text-sm text-[#8f8f8f]">
                      Başka herhangi bir güvenlik endişesi için bize destek@komsuapp.com'dan ulaşabilirsiniz.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/yardim"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00833e] text-white rounded-lg font-semibold hover:bg-[#006b32] transition-colors"
              >
                <Flag size={18} />
                Sorun Bildir
              </Link>
            </section>

            {/* Community Guidelines */}
            <section className="p-8 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0]">
              <h2 className="text-2xl font-bold text-[#333] mb-4 flex items-center gap-2">
                <Users size={24} />
                Topluluk Kuralları
              </h2>

              <p className="text-[#404040] leading-relaxed mb-6">
                KomşuApp, herkesin güvende hissetmesi için tasarlanmış. Topluluk kurallarımız, platformun
                ve mahallelerimizin güvenli ve saygılı kalmasını sağlamak için vardır.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-[#e0e0e0]">
                  <div className="flex-shrink-0 pt-1">
                    <Zap className="w-5 h-5 text-[#00833e]" />
                  </div>
                  <div>
                    <p className="text-[#404040]">
                      <strong>Saygılı İletişim:</strong> Herkese saygı gösterin, nefret söylemi veya hakarete
                      katılmayın.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-[#e0e0e0]">
                  <div className="flex-shrink-0 pt-1">
                    <Zap className="w-5 h-5 text-[#00833e]" />
                  </div>
                  <div>
                    <p className="text-[#404040]">
                      <strong>Kimseyi Hedef Almayın:</strong> Özel olarak herhangi bir kişiyi veya grubu
                      hakaretçi şekilde hedef almayın.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-[#e0e0e0]">
                  <div className="flex-shrink-0 pt-1">
                    <Zap className="w-5 h-5 text-[#00833e]" />
                  </div>
                  <div>
                    <p className="text-[#404040]">
                      <strong>Yasal İçerik:</strong> Yasadışı aktiviteleri tanıtmayın veya teşvik etmeyin.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-[#e0e0e0]">
                  <div className="flex-shrink-0 pt-1">
                    <Zap className="w-5 h-5 text-[#00833e]" />
                  </div>
                  <div>
                    <p className="text-[#404040]">
                      <strong>Mahrem Bilgiler:</strong> Başkalarının mahrem bilgilerini (ev adresi, telefon vb)
                      paylaşmayın.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-[#e0e0e0]">
                  <div className="flex-shrink-0 pt-1">
                    <Zap className="w-5 h-5 text-[#00833e]" />
                  </div>
                  <div>
                    <p className="text-[#404040]">
                      <strong>Spam & Dolandırıcılık:</strong> Spam görmüyü, ticari reklamları veya dolandırıcılık
                      girişimlerini bildirin.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/topluluk-kurallari"
                className="inline-flex items-center gap-2 text-[#00833e] hover:text-[#006b32] font-semibold transition-colors"
              >
                Tam Topluluk Kurallarını Oku
                <ArrowLeft size={18} className="rotate-180" />
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
