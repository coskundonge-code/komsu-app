import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      title: 'Kayıt Ol',
      emoji: '📝',
      description: 'KomşuApp\'e katılmak için hızlı ve kolay bir kayıt işlemi. Sadece adınız, e-posta ve şifreniz yeterli.',
      details: [
        'E-posta adresiniz ve güçlü bir şifre seçin',
        'Koşulları okuyup kabul edin',
        'Verify e-postasını kontrol edin ve tıklayın',
      ],
      color: 'from-blue-500 to-blue-600',
    },
    {
      number: 2,
      title: 'Adresini Doğrula',
      emoji: '📍',
      description: 'Güvenliği sağlamak için mahalle adresinizi doğrulayın. Sadece gerçek mahalle sakinleri uygulamaya erişebilir.',
      details: [
        'Şehir, ilçe ve mahalleni gir',
        'Doğrulama kodu almak için posta kutusu adresini gir',
        'Gelen SMS veya e-postadaki kodu gir',
      ],
      color: 'from-green-500 to-green-600',
    },
    {
      number: 3,
      title: 'Mahallenle Tanış',
      emoji: '👥',
      description: 'Profilini oluştur ve mahalledeki diğer sakinlerle tanışmaya başla. Güvenli ve kontrollü bir ortamda iletişim kur.',
      details: [
        'Profil fotoğrafınızı ekleyin ve biyografi yazın',
        'Ilgi alanlarınızı ve uzmanlıklarınızı belirtin',
        'Mahalle üyelerini keşfet ve merhaba deyin',
      ],
      color: 'from-purple-500 to-purple-600',
    },
    {
      number: 4,
      title: 'Paylaş ve Keşfet',
      emoji: '🌟',
      description: 'Mahallenizle bilgi, tavsiye ve yardım paylaşın. Etkinliklere katılın, ürün satın/satın al ve topluluk kurguluyor özelliklerini kullan.',
      details: [
        'Gönderiler paylaşın ve tartışmalara katılın',
        'Etkinlikleri ve işletmeleri keşfet',
        'Pazar yerinde ürün satıp alabileceğin',
        'Gruplar oluştur veya mevcut gruplara katıl',
      ],
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const features = [
    {
      icon: '💬',
      title: 'Sosyal Ağ',
      description: 'Mahalledeki insanlarla bağlantı kur, tartışmalara katıl ve deneyimlerini paylaş',
    },
    {
      icon: '📅',
      title: 'Etkinlikler',
      description: 'Mahalle etkinliklerini keşfet, oluştur ve diğer sakinlerle eğlen',
    },
    {
      icon: '🏪',
      title: 'Yerel İşletmeler',
      description: 'Mahallendeki işletmeleri keşfet, inceleme yaz ve önerilerde bulun',
    },
    {
      icon: '🛒',
      title: 'Pazar Yeri',
      description: 'Satın al ve satış yapmak için güvenli bir yerel pazar yeri',
    },
    {
      icon: '👥',
      title: 'Gruplar',
      description: 'Ortak ilgi alanına sahip mahalle sakinleriyle grup oluştur',
    },
    {
      icon: '🔔',
      title: 'Bildirimleri',
      description: 'Mahallendeki önemli güncellemeleri ve etkinlikleri kaçırma',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#00833e] hover:text-[#006b32] font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Ana Sayfaya Dön
        </Link>

        <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#00833e] to-[#006b32] p-8 md:p-12 text-white">
            <h1 className="text-4xl font-bold mb-3">KomşuApp Nasıl Çalışır?</h1>
            <p className="text-green-100 text-lg">
              4 basit adımda mahallenizle bağlantı kurun ve güçlü bir topluluk oluşturun
            </p>
          </div>

          {/* Steps */}
          <div className="p-8 md:p-12">
            {/* Timeline */}
            <div className="space-y-8">
              {steps.map((step, idx) => (
                <div key={step.number} className="relative">
                  {/* Connector Line */}
                  {idx < steps.length - 1 && (
                    <div className="absolute left-12 top-24 w-1 h-16 bg-gradient-to-b from-[#00833e] to-transparent hidden md:block"></div>
                  )}

                  {/* Step Card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Step Number and Icon */}
                    <div className="flex items-center gap-6 md:justify-end">
                      <div className={`flex-shrink-0 w-24 h-24 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-4xl text-white font-bold shadow-lg`}>
                        {step.emoji}
                      </div>
                      <div className="md:hidden">
                        <div className="text-5xl font-bold text-[#00833e] opacity-20">{step.number}</div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-2">
                      <div className="hidden md:block absolute left-0 text-6xl font-bold text-[#00833e] opacity-10 -ml-8">
                        {step.number}
                      </div>

                      <div className="relative">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#333] mb-2">{step.title}</h2>
                        <p className="text-[#404040] leading-relaxed mb-4 text-lg">{step.description}</p>

                        {/* Details */}
                        <div className="space-y-2">
                          {step.details.map((detail, didx) => (
                            <div key={didx} className="flex items-start gap-3 text-[#404040]">
                              <CheckCircle size={18} className="text-[#00833e] mt-1 flex-shrink-0" />
                              <span className="text-sm">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="border-t border-[#e0e0e0] p-8 md:p-12 bg-[#f0f2f5]">
            <h2 className="text-3xl font-bold text-[#333] mb-10 flex items-center gap-2">
              <span className="w-1 h-10 bg-[#00833e] rounded-full"></span>
              KomşuApp'in Özellikleri
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-white border border-[#e0e0e0] rounded-lg hover:border-[#00833e] hover:shadow-lg transition-all duration-200"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-[#333] mb-2">{feature.title}</h3>
                  <p className="text-[#404040] text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Safety & Security */}
          <div className="border-t border-[#e0e0e0] p-8 md:p-12 bg-blue-50 border-l-4 border-l-blue-500">
            <h2 className="text-2xl font-bold text-[#333] mb-4 flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              Güvenlik ve Gizlilik
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <h3 className="font-bold text-[#333] mb-2">Adres Doğrulaması</h3>
                <p className="text-sm text-[#404040]">
                  Sadece gerçek mahalle sakinleri uygulamaya erişebilir. SMS ve adres doğrulaması ile
                  güvenliği sağlarız.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-[#333] mb-2">Şifreli İletişim</h3>
                <p className="text-sm text-[#404040]">
                  SSL/TLS şifreleme teknolojisi ile tüm iletişiminiz koruma altında tutulur.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-[#333] mb-2">Moderasyon</h3>
                <p className="text-sm text-[#404040]">
                  24/7 moderasyon ekibi sorunlu içeriği kontrol eder ve topluluk kural çizgisini
                  korur.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="border-t border-[#e0e0e0] p-8 md:p-12">
            <h2 className="text-2xl font-bold text-[#333] mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-[#00833e] rounded-full"></span>
              Sıkça Sorulan Sorular
            </h2>

            <div className="space-y-4">
              {[
                {
                  q: 'KomşuApp tamamen ücretsiz mi?',
                  a: 'Evet, KomşuApp temel özellikler tamamen ücretsizdir. Bazı ek premium özellikleri ileride sunabiliriz, ancak sosyal ağ özellikleri her zaman ücretsiz kalacak.',
                },
                {
                  q: 'Eğer taşırsam hesabımı taşıyabilir miyim?',
                  a: 'Evet. Yeni adresinizi doğruladığınızda hesabınız otomatik olarak yeni mahallele eşleştirilecektir. Eski mahalle verileriniz bu sebeple erişilemez hale gelir.',
                },
                {
                  q: 'Mahalle dışındaki insanlarla iletişim kurabilirim?',
                  a: 'Hayır, KomşuApp mahalle içi iletişime odaklanır. Alanın ve mahalle topluluğunun korunması için bilerek bu tasarımı seçtik.',
                },
                {
                  q: 'Uygulamayı ne zaman başlayabilirim?',
                  a: 'Hemen! Yukarıdaki "Hemen Başla" düğmesine tıklayarak kayıt olabilirsiniz. İşlem 5 dakikadan az sürer.',
                },
              ].map((faq, idx) => (
                <details
                  key={idx}
                  className="group border border-[#e0e0e0] rounded-lg overflow-hidden hover:border-[#00833e] transition-colors"
                >
                  <summary className="p-4 cursor-pointer bg-[#f0f2f5] hover:bg-white font-semibold text-[#333] flex items-center justify-between">
                    <span>{faq.q}</span>
                    <span className="text-[#00833e] group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 bg-white text-[#404040] text-sm leading-relaxed border-t border-[#e0e0e0]">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="border-t border-[#e0e0e0] bg-gradient-to-br from-[#00833e]/5 to-[#006b32]/5 p-8 md:p-12">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-[#333] mb-4">Mahallenin Parçası Olun</h2>
              <p className="text-[#404040] mb-8 leading-relaxed">
                KomşuApp ile mahallenizin yaşam kalitesini iyileştirin, yeni arkadaşlar edinin ve
                birlikte güçlü bir topluluk oluşturun. Şimdi başlamak için aşağıdaki butona tıklayın.
              </p>
              <Link
                href="/ayarlar"
                className="inline-block px-8 py-4 bg-[#00833e] text-white font-bold text-lg rounded-lg hover:bg-[#006b32] transition-colors shadow-lg hover:shadow-xl"
              >
                Hemen Başla
              </Link>
            </div>
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
                href="/topluluk-kurallari"
                className="text-sm text-[#00833e] hover:text-[#006b32] font-medium transition-colors"
              >
                Topluluk Kuralları
              </Link>
              <span className="text-[#e0e0e0]">•</span>
              <Link
                href="/iletisim"
                className="text-sm text-[#00833e] hover:text-[#006b32] font-medium transition-colors"
              >
                İletişim
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
