import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function KVKKPage() {
  const currentDate = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-hover font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Ana Sayfaya Dön
        </Link>

        <div className="bg-surface rounded-lg border border-border overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary to-primary-hover p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">KVKK Aydınlatma Metni</h1>
            <p className="text-green-100">Kişisel Verilerin Korunması Hakkında Bilgilendirme</p>
            <p className="text-green-100 text-sm mt-4">Yürürlük Tarihi: {currentDate}</p>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12 space-y-8">
            {/* Giriş */}
            <section>
              <p className="text-text-secondary leading-relaxed">
                Mahallemiz ("Uygulama"), kullanıcılarının kişisel verilerinin korunmasına büyük önem
                vermektedir. Bu aydınlatma metni, uygulamayı kullanan tüm kişileri, Kişisel
                Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verilerinin nasıl
                işlendiği, korunduğu ve kullanıldığı hakkında bilgilendirmektedir.
              </p>
            </section>

            {/* Veri Sorumlusu */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                Veri Sorumlusu
              </h2>
              <div className="bg-background p-6 rounded-lg border border-border space-y-2 text-text-secondary">
                <p>
                  <strong>Şirket Adı:</strong> Trendex Lojistik ve Teknoloji A.Ş.
                </p>
                <p>
                  <strong>Adres:</strong> İstanbul, Türkiye
                </p>
                <p>
                  <strong>Email:</strong> destek@mahallem.com
                </p>
                <p>
                  <strong>Web:</strong> www.mahallem.com
                </p>
              </div>
            </section>

            {/* Kişisel Verilerin İşlenme Amacı */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                Kişisel Verilerin İşlenme Amacı
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Mahallemiz, kullanıcılardan toplanan kişisel verileri aşağıda belirtilen meşru
                amaçlarla işlemektedir:
              </p>
              <div className="space-y-3">
                {[
                  'Kullanıcı hesabı oluşturma ve yönetimi',
                  'Mahalle doğrulaması ve güvenlik sağlama',
                  'Uygulama içi iletişim ve bildirimler',
                  'Hizmet kalitesini iyileştirme ve geliştirme',
                  'Yasal yükümlülükleri yerine getirme',
                  'Bilgisayar güvenliği ve kötüye kullanımı önleme',
                  'Müşteri desteği ve sorun giderme',
                  'Anonim istatistiksel analiz ve raporlama',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      ✓
                    </span>
                    <span className="text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Toplanan Kişisel Veriler */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                Toplanan Kişisel Veriler
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Mahallemiz aşağıdaki kategorilerde kişisel veri toplamaktadır:
              </p>
              <div className="grid gap-4">
                {[
                  {
                    category: 'Kimlik Bilgileri',
                    items: 'Ad, soyad, e-posta adresi, telefon numarası',
                  },
                  {
                    category: 'Konum Bilgileri',
                    items: 'Mahalle, ilçe, şehir, posta kodu (doğrulama amacıyla)',
                  },
                  {
                    category: 'Kullanım Verileri',
                    items: 'Oturum açma bilgileri, IP adresi, cihaz bilgileri, kullanım alışkanlıkları',
                  },
                  {
                    category: 'İletişim Verileri',
                    items: 'Gönderilen mesajlar, yorum ve gönderiler (sadece gerekli durumlarda)',
                  },
                  {
                    category: 'Teknik Veriler',
                    items: 'Tarayıcı türü, işletim sistemi, çerez ve benzeri teknolojiler',
                  },
                ].map((item) => (
                  <div key={item.category} className="border border-border rounded-lg p-4 bg-surface">
                    <h3 className="font-bold text-text-primary mb-2">{item.category}</h3>
                    <p className="text-text-secondary text-sm">{item.items}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Kişisel Verilerin Aktarılması */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                Kişisel Verilerin Aktarılması
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Kişisel verileriniz aşağıdaki durumlar haricinde üçüncü kişilere aktarılmaz:
              </p>
              <ul className="space-y-3 text-text-secondary">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Yasal zorunluluklar ve mahkeme kararları</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Ödeme işlemi için ödeme sağlayıcıları</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Teknik altyapı ve barındırma hizmet sağlayıcıları</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Bilgisayar güvenliği ve dolandırıcılık önleme hizmetleri</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Analitik ve raporlama hizmetleri (anonim veri olarak)</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-text-secondary">
                  <strong>Not:</strong> Tüm veri işleme anlaşmaları KVKK uyarınca yürütülmektedir ve
                  veri sorumlusu olarak sorumlulukları devam etmektedir.
                </p>
              </div>
            </section>

            {/* Veri Saklama Süresi */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                Veri Saklama Süresi
              </h2>
              <div className="bg-background p-6 rounded-lg border border-border text-text-secondary leading-relaxed">
                <p className="mb-3">
                  Kişisel veriler, toplandığı amacın gerçekleştirilmesi için gerekli olan süre kadar
                  saklanmaktadır. Hesap silme işleminden sonra veriler, yasal yükümlülükler dışında
                  30 gün içerisinde silinecektir.
                </p>
                <p>
                  Yasal yükümlülükleri yerine getirmek için gerekli veriler, ilgili kanunların
                  gerektirdiği süreler kadar saklanacaktır.
                </p>
              </div>
            </section>

            {/* Haklarınız */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                Haklarınız (KVKK Madde 12)
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                KVKK uyarınca, aşağıdaki haklara sahipsiniz:
              </p>
              <div className="space-y-3">
                {[
                  {
                    title: 'Bilgi Alma Hakkı',
                    desc: 'Kişisel verilerinizin işlenip işlenmediği hakkında bilgi talep etme',
                  },
                  {
                    title: 'Erişim Hakkı',
                    desc: 'İşlenen kişisel verilerinize erişme',
                  },
                  {
                    title: 'Düzeltme Hakkı',
                    desc: 'Yanlış veya eksik kişisel verilerinizi düzelttirebilme',
                  },
                  {
                    title: 'Silme Hakkı',
                    desc: 'Kişisel verilerinizin silinmesini talep etme',
                  },
                  {
                    title: 'İşlenmesini Kısıtlama Hakkı',
                    desc: 'Kişisel verilerinizin işlenmesinin sınırlandırılmasını isteme',
                  },
                  {
                    title: 'Taşıma Hakkı',
                    desc: 'Kişisel verilerinizi yapılandırılmış, yaygın kullanılan, makine tarafından okunabilir formatta almak',
                  },
                  {
                    title: 'İtiraz Hakkı',
                    desc: 'Kişisel verilerinizin işlenmesine itiraz etme',
                  },
                  {
                    title: 'Otomatik Karar Alma Hakkı',
                    desc: 'Yalnızca otomatik sistemlerce alınan kararlar karşısında koruma talep etme',
                  },
                ].map((right, idx) => (
                  <div
                    key={idx}
                    className="border border-border rounded-lg p-4 bg-surface hover:border-primary transition-colors"
                  >
                    <h3 className="font-bold text-text-primary text-sm">{right.title}</h3>
                    <p className="text-text-secondary text-sm mt-2">{right.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Güvenlik Önlemleri */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                Güvenlik Önlemleri
              </h2>
              <div className="bg-background p-6 rounded-lg border border-border text-text-secondary leading-relaxed space-y-3">
                <p>
                  Mahallemiz, kişisel verilerinizin korunması için aşağıdaki önlemleri almaktadır:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">▪</span>
                    <span>SSL/TLS şifreleme teknolojisi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">▪</span>
                    <span>Güvenli sunucu altyapısı ve düzenli yedekleme</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">▪</span>
                    <span>Erişim kontrolleri ve kimlik doğrulama mekanizmaları</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">▪</span>
                    <span>Düzenli güvenlik denetimleri ve güncellemeler</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">▪</span>
                    <span>Personel eğitimi ve gizlilik politikaları</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* İletişim */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                İletişim
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                KVKK kapsamında haklarınızı kullanmak için aşağıdaki yollarla bize ulaşabilirsiniz:
              </p>
              <div className="bg-surface border border-border rounded-lg p-6 space-y-3 text-text-secondary">
                <p>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:kvkk@mahallem.com" className="text-primary hover:text-primary-hover underline">
                    kvkk@mahallem.com
                  </a>
                </p>
                <p>
                  <strong>Talep Formu:</strong> Başvurularınız, adınız, soyadınız ve kimlik numaranız ile
                  gönderilmelidir.
                </p>
                <p>
                  <strong>Değerlendirme Süresi:</strong> Başvurularınız 30 gün içerisinde
                  yanıtlanacaktır.
                </p>
              </div>
            </section>

            {/* Şikayetler */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                Şikayetler
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-text-secondary">
                <p className="leading-relaxed mb-3">
                  Kişisel verilerinizin işlenmesiyle ilgili şikayetleriniz için, haklarınızın ihlal
                  edildiğini düşünüyorsanız Kişisel Verileri Koruma Kurulu'na başvuru yapabilirsiniz.
                </p>
                <p className="text-sm">
                  <strong>KVKK Başvuru Portalı:</strong>{' '}
                  <a
                    href="https://www.kvkk.gov.tr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-hover underline"
                  >
                    www.kvkk.gov.tr
                  </a>
                </p>
              </div>
            </section>

            {/* Son Not */}
            <section className="border-t border-border pt-8">
              <p className="text-text-muted text-sm leading-relaxed">
                Bu KVKK Aydınlatma Metni, Trendex Lojistik tarafından hazırlanmış ve gerektiğinde
                güncellenebilir. Değişiklikler, bu sayfada yayınlandığı tarihten itibaren
                geçerlidir. Sizin tarafınızdan uygulamaya erişim devam ettirilmesi, güncellenmiş
                metni kabul ettiğiniz anlamına gelmektedir.
              </p>
            </section>
          </div>

          {/* Footer */}
          <div className="border-t border-border bg-background py-6 px-8 text-center">
            <p className="text-sm text-text-muted mb-4">
              © 2026 Mahallemiz — Trendex Lojistik tarafından geliştirilmiştir.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/gizlilik"
                className="text-sm text-primary hover:text-primary-hover font-medium transition-colors"
              >
                Gizlilik Politikası
              </Link>
              <span className="text-[#e0e0e0]">•</span>
              <Link
                href="/topluluk-kurallari"
                className="text-sm text-primary hover:text-primary-hover font-medium transition-colors"
              >
                Topluluk Kuralları
              </Link>
              <span className="text-[#e0e0e0]">•</span>
              <Link
                href="/kosullar"
                className="text-sm text-primary hover:text-primary-hover font-medium transition-colors"
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
