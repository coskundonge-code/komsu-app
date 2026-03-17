import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CommunityGuidelinesPage() {
  const guidelines = [
    {
      number: 1,
      title: 'Saygılı Olun',
      emoji: '🤝',
      description:
        'Diğer kullanıcılara saygıyla davranın. Farklı görüşlere saygı gösterin, kin ve düşmanlığa asla yer vermeyin.',
      details: [
        'Hitabet dilini nezaketli ve yapıcı tutun',
        'Ad sataşmaları, aşağılamalara ve nefrete karşı sıfır tolerans',
        'Muhalefet etse de kişilere değil fikirlere karşı çıkın',
      ],
    },
    {
      number: 2,
      title: 'Güvenli Paylaşım',
      emoji: '🔐',
      description:
        'Sizin ve diğer insanların gizliliğine saygı gösterin. Özel bilgileri asla paylaşmayın.',
      details: [
        'Başkalarının fotoğraflarını izinsiz paylaşmayın',
        'Telefon numarası, ev adresi, kimlik bilgisi gibi veriler paylaşmayın',
        'Çocukların resimleri paylaşırken ayrıca dikkat edin',
      ],
    },
    {
      number: 3,
      title: 'Doğruluk',
      emoji: '✓',
      description:
        'Yayınladığınız bilgilerin doğru olduğundan emin olun. Yanlış veya yanıltıcı bilgileri yaymayın.',
      details: [
        'Haberleri paylaşmadan önce doğru kaynağından kontrol edin',
        'Sahte profil oluşturmayın veya başkasının kimliğini taklit etmeyin',
        'İddialarınız için dayanak gösterin',
      ],
    },
    {
      number: 4,
      title: 'Ticari İçerik Kuralları',
      emoji: '🏪',
      description:
        'Ticari faaliyetlere izin verilmektedir, ancak belirli kurallar vardır.',
      details: [
        'İşletme ve ticari faaliyetler özel bölümlerde yapılmalıdır',
        'Yanıltıcı reklamlar yapmayın veya ürünleri abartmayın',
        'Spam mesajlar göndermek kesinlikle yasaktır',
      ],
    },
    {
      number: 5,
      title: 'Yasak İçerikler',
      emoji: '🚫',
      description:
        'Aşağıdaki içerikler kesinlikle yasaktır ve cezalandırılır.',
      details: [
        'Uyuşturucu, silah, hırsızlık, şiddet gibi yasa dışı içerikler',
        'Cinsel ve istismar amaçlı içerikler',
        'Ayrımcılık, ırkçılık, din düşmanlığı içeriği',
        'Virüs, kötü amaçlı yazılım ve hack girişimleri',
      ],
    },
    {
      number: 6,
      title: 'İhbar ve Moderasyon',
      emoji: '⚠️',
      description:
        'Kuralları ihlal eden içeriği görmek mi? Hemen bize bildirebilirsiniz.',
      details: [
        'Sorunlu içeriğin altında "İhbar Et" düğmesini kullanın',
        'Detaylı açıklama sağlayarak özellikle faydalı olabilirsiniz',
        'Moderasyon ekibimiz şikayetleri inceleyip gerekli işlemleri alacaktır',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#00833e] hover:text-[#006b32] font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Ana Sayfaya Dön
        </Link>

        <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#00833e] to-[#006b32] p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Topluluk Kuralları</h1>
            <p className="text-green-100">KomşuApp'te herkese saygılı, güvenli ve aydınlık bir ortam</p>
          </div>

          {/* Giriş */}
          <div className="p-8 md:p-12 bg-blue-50 border-b border-[#e0e0e0]">
            <p className="text-[#404040] leading-relaxed">
              KomşuApp, komşularımızın birbirine güvenle bağlanabileceği, bilgi paylaşabileceği ve
              yardımlaşabileceği bir topluluktur. Bu kurallar, platforma katılan herkesi saygılı
              bir ortam oluşturmaya çağırır. Kuralları ihlal eden kullanıcılar uyarı, hesap askıya
              alma veya kalıcı silme cezasına tabi tutulabilirler.
            </p>
          </div>

          {/* Guidelines */}
          <div className="p-8 md:p-12 space-y-6">
            {guidelines.map((guideline) => (
              <div
                key={guideline.number}
                className="border border-[#e0e0e0] rounded-lg overflow-hidden hover:border-[#00833e] transition-all duration-200"
              >
                {/* Title Bar */}
                <div className="bg-gradient-to-r from-[#f0f2f5] to-white p-6 border-b border-[#e0e0e0]">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">{guideline.emoji}</div>
                    <div className="flex-grow">
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-[#00833e] text-white font-bold rounded-full text-sm">
                          {guideline.number}
                        </span>
                        <h2 className="text-xl font-bold text-[#333]">{guideline.title}</h2>
                      </div>
                      <p className="text-[#404040] text-base">{guideline.description}</p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 bg-white space-y-2">
                  {guideline.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-[#404040] text-sm">
                      <span className="text-[#00833e] font-bold text-lg leading-none mt-0.5">
                        ◆
                      </span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* İlgili Politikalar */}
          <div className="p-8 md:p-12 border-t border-[#e0e0e0] bg-[#f0f2f5]">
            <h2 className="text-xl font-bold text-[#333] mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#00833e] rounded-full"></span>
              İlgili Belgeler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/gizlilik"
                className="p-4 bg-white border border-[#e0e0e0] rounded-lg hover:border-[#00833e] hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-[#333] mb-2">Gizlilik Politikası</h3>
                <p className="text-sm text-[#8f8f8f]">Verilerinizin nasıl korunduğunu öğrenin</p>
              </Link>
              <Link
                href="/kvkk"
                className="p-4 bg-white border border-[#e0e0e0] rounded-lg hover:border-[#00833e] hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-[#333] mb-2">KVKK Aydınlatma</h3>
                <p className="text-sm text-[#8f8f8f]">Kişisel veri işleme hakkında detaylar</p>
              </Link>
              <Link
                href="/kosullar"
                className="p-4 bg-white border border-[#e0e0e0] rounded-lg hover:border-[#00833e] hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-[#333] mb-2">Kullanım Koşulları</h3>
                <p className="text-sm text-[#8f8f8f]">Hizmet koşullarını ve sorumluluklarını görün</p>
              </Link>
              <Link
                href="/iletisim"
                className="p-4 bg-white border border-[#e0e0e0] rounded-lg hover:border-[#00833e] hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-[#333] mb-2">İletişim</h3>
                <p className="text-sm text-[#8f8f8f]">Bize ulaşın ve sorunları bildirebilirsiniz</p>
              </Link>
            </div>
          </div>

          {/* CTA Section */}
          <div className="p-8 md:p-12 bg-gradient-to-r from-[#00833e]/5 to-[#006b32]/5 border-t border-[#00833e]/20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#333] mb-3">Kuralları İhlal Gördünüz mü?</h2>
              <p className="text-[#404040] mb-6 max-w-2xl mx-auto">
                KomşuApp topluluğunun güvenliğini sağlamak bizim ortak sorumluluğumuz. Sorunlu içeriği
                gördüğünüzde lütfen bildirin.
              </p>
              <Link
                href="/iletisim"
                className="inline-block px-8 py-3 bg-[#00833e] text-white font-bold rounded-lg hover:bg-[#006b32] transition-colors"
              >
                Sorun Bildir
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="p-8 md:p-12 border-t border-[#e0e0e0] bg-white">
            <h2 className="text-2xl font-bold text-[#333] mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-[#00833e] rounded-full"></span>
              Sıkça Sorulan Sorular
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Kuralları ihlal edersem ne olur?',
                  a: 'Kurallara aykırı davranış, uyarı, hesap askıya alınması veya kalıcı silme cezasına sebep olabilir. Ciddiyete göre ceza seviyesi belirlenir.',
                },
                {
                  q: 'Hesabımı silebilir miyim?',
                  a: 'Evet. Ayarlar menüsünden "Hesabı Sil" seçeneğine tıklayabilirsiniz. Hesap silinmesi 30 gün içinde tamamlanır.',
                },
                {
                  q: 'Yanılış bir ihbar yaparsam ne olur?',
                  a: 'Kasıtlı olarak yanlış ihbar yapılması cezalandırılabilir. Moderation ekibi her ihbarı dikkatle inceleyecektir.',
                },
                {
                  q: 'Hesabım yanlış bloklansa ne yapmalıyım?',
                  a: 'Destek sekmesinden itiraz başvurusu yapabilirsiniz. 48 saat içinde incelenmek üzere moderasyon ekibine gönderilecektir.',
                },
              ].map((faq, idx) => (
                <details
                  key={idx}
                  className="group border border-[#e0e0e0] rounded-lg overflow-hidden hover:border-[#00833e] transition-colors"
                >
                  <summary className="p-4 cursor-pointer bg-[#f0f2f5] hover:bg-white font-bold text-[#333] flex items-center justify-between">
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
                href="/kvkk"
                className="text-sm text-[#00833e] hover:text-[#006b32] font-medium transition-colors"
              >
                KVKK Aydınlatma
              </Link>
              <span className="text-[#e0e0e0]">•</span>
              <Link
                href="/kosullar"
                className="text-sm text-[#00833e] hover:text-[#006b32] font-medium transition-colors"
              >
                Kullanım Koşulları
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
