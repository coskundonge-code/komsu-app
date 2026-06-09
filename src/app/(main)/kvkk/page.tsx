import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/**
 * KVKK Aydınlatma Metni — 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)
 * Madde 10 (aydınlatma yükümlülüğü) kapsamında hazırlanmıştır.
 *
 * NOT: Metin, uygulamanın GERÇEK veri akışına göre yazılmıştır (profiles /
 * address_verifications / payments tabloları + verify-document akışı esas alındı):
 *  - TC Kimlik No saklanmaz; yalnızca doğrulama anında e-Devlet'e iletilir.
 *  - Kart bilgisi saklanmaz; ödeme altyapısı (PayTR) tarafından işlenir.
 * Yayına almadan önce şirket sicil bilgileri (açık adres, MERSİS, VERBİS kayıt
 * no, KEP adresi) yetkili tarafından tamamlanmalı ve bir hukukçu onaylamalıdır.
 */

// Sabit yürürlük tarihi — hukuki metinde her render'da değişen tarih OLMAMALI.
const EFFECTIVE_DATE = '7 Haziran 2026';

const PURPOSES = [
  'Üyelik kaydının oluşturulması, hesabın yönetilmesi ve hizmetlerin sunulması',
  'Mahalle/adres doğrulaması yapılması ve yalnızca gerçek mahalle sakinlerinin topluluğa katılmasının sağlanması',
  'Topluluk güvenliğinin sağlanması, sahtecilik ve kötüye kullanımın önlenmesi',
  'Pazaryeri ilanları, etkinlikler, gruplar ve mesajlaşma gibi platform özelliklerinin işletilmesi',
  'Ücretli hizmetlere (Mahalle Kart, işletme üyeliği, ilan öne çıkarma) ilişkin ödemelerin alınması ve takibi',
  'Talep, şikâyet ve başvuruların karşılanması; kullanıcı desteği sağlanması',
  'Yasal yükümlülüklerin yerine getirilmesi ve yetkili mercilere bilgi verilmesi',
  'Hizmet kalitesinin ölçülmesi, iyileştirilmesi ve anonim istatistiksel analiz',
];

const DATA_CATEGORIES: { category: string; items: string; note?: string }[] = [
  {
    category: 'Kimlik Bilgileri',
    items: 'Ad, soyad, cinsiyet.',
  },
  {
    category: 'İletişim Bilgileri',
    items: 'E-posta adresi, telefon numarası.',
  },
  {
    category: 'Konum ve Adres Bilgileri',
    items:
      'İl, ilçe, mahalle, açık adres metni ve harita üzerinde seçilen konum (enlem/boylam).',
  },
  {
    category: 'Kimlik/Adres Doğrulama Bilgileri',
    items:
      'e-Devlet "Yerleşim Yeri ve Diğer Adres Belgesi" doğrulama barkodu, doğrulama durumu ve tarihi, varsa yüklenen belge görseli.',
    note:
      'TC Kimlik Numaranız yalnızca doğrulama anında turkiye.gov.tr sorgusu için kullanılır; sistemimizde SAKLANMAZ. Yalnızca belge barkodu ve doğrulama sonucu kaydedilir.',
  },
  {
    category: 'Müşteri İşlem ve Finansal Bilgiler',
    items:
      'Ödeme tutarı, para birimi, ödeme türü/durumu, sipariş referansı, fatura/işlem tarihçesi.',
    note:
      'Kart numarası, son kullanma tarihi ve CVV gibi kart bilgileri tarafımızca SAKLANMAZ; ödeme altyapısı sağlayıcısı (PayTR) tarafından güvenli ortamda işlenir.',
  },
  {
    category: 'Platform İçeriği',
    items:
      'Profil fotoğrafı, biyografi, paylaşılan gönderi/yorum/ilan/etkinlik içerikleri ve özel mesajlar.',
  },
  {
    category: 'İşlem Güvenliği ve Teknik Veriler',
    items:
      'IP adresi, oturum ve giriş kayıtları, cihaz/tarayıcı bilgileri, log kayıtları ve çerez verileri.',
  },
];

const LEGAL_GROUNDS = [
  {
    title: 'Sözleşmenin kurulması veya ifası (Md. 5/2-c)',
    desc: 'Üyelik sözleşmesinin kurulması, hesabın yönetilmesi, ücretli hizmetlerin sunulması ve ödemelerin alınması.',
  },
  {
    title: 'Hukuki yükümlülük (Md. 5/2-ç)',
    desc: 'Vergi, ticaret ve diğer mevzuattan doğan saklama ve bilgilendirme yükümlülüklerinin yerine getirilmesi.',
  },
  {
    title: 'Bir hakkın tesisi, kullanılması veya korunması (Md. 5/2-e)',
    desc: 'Uyuşmazlıklarda ve hukuki taleplerde delil olarak kullanılması.',
  },
  {
    title: 'Meşru menfaat (Md. 5/2-f)',
    desc: 'Temel hak ve özgürlüklerinize zarar vermemek kaydıyla; topluluk güvenliği, sahtecilik önleme, hizmet güvenliği ve iyileştirme.',
  },
  {
    title: 'Açık rıza (Md. 5/1)',
    desc: 'Yukarıdaki sebeplerin bulunmadığı hâllerde; özellikle e-Devlet üzerinden adres doğrulaması, ticari elektronik ileti gönderimi ve verilerin yurt dışındaki sunuculara aktarımı için açık rızanız alınır.',
  },
];

const RIGHTS_MADDE_11 = [
  'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
  'İşlenmişse buna ilişkin bilgi talep etme',
  'İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme',
  'Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme',
  'Eksik veya yanlış işlenmişse düzeltilmesini isteme',
  'KVKK Madde 7’deki şartlar çerçevesinde silinmesini veya yok edilmesini isteme',
  'Düzeltme/silme işlemlerinin, verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme',
  'Münhasıran otomatik sistemlerle analiz sonucu aleyhinize bir sonuç çıkmasına itiraz etme',
  'Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme',
];

export default function KVKKPage() {
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
            <p className="text-green-100">
              6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) Madde 10 kapsamında bilgilendirme
            </p>
            <p className="text-green-100 text-sm mt-4">Son güncelleme: {EFFECTIVE_DATE}</p>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12 space-y-8">
            {/* Giriş */}
            <section>
              <p className="text-text-secondary leading-relaxed">
                Mahallemiz (&quot;Uygulama&quot; veya &quot;Platform&quot;) olarak, kişisel
                verilerinizin güvenliğine önem veriyoruz. Bu aydınlatma metni; veri sorumlusu
                sıfatıyla, kişisel verilerinizi hangi amaçlarla ve hukuki sebeplerle işlediğimiz,
                kimlere aktarabileceğimiz, hangi yöntemle topladığımız ve KVKK kapsamındaki
                haklarınız hakkında sizi bilgilendirmek amacıyla hazırlanmıştır.
              </p>
            </section>

            {/* 1. Veri Sorumlusu */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                1. Veri Sorumlusunun Kimliği
              </h2>
              <div className="bg-background p-6 rounded-lg border border-border space-y-2 text-text-secondary">
                <p>
                  <strong>Veri Sorumlusu:</strong> Consulting Partners Yönetim Danışmanlığı A.Ş.
                </p>
                <p>
                  <strong>Adres:</strong> İstanbul, Türkiye
                </p>
                <p>
                  <strong>E-posta:</strong>{' '}
                  <a href="mailto:kvkk@mahallem.com" className="text-primary hover:text-primary-hover underline">
                    kvkk@mahallem.com
                  </a>
                </p>
                <p>
                  <strong>Web:</strong> www.mahallem.com
                </p>
              </div>
            </section>

            {/* 2. İşlenen Kişisel Veriler */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                2. İşlenen Kişisel Veriler ve Kategorileri
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Hizmetin niteliğine ve kullanımınıza bağlı olarak aşağıdaki kategorilerde kişisel
                veri işlenmektedir:
              </p>
              <div className="grid gap-4">
                {DATA_CATEGORIES.map((item) => (
                  <div key={item.category} className="border border-border rounded-lg p-4 bg-surface">
                    <h3 className="font-bold text-text-primary mb-2">{item.category}</h3>
                    <p className="text-text-secondary text-sm">{item.items}</p>
                    {item.note && (
                      <p className="text-sm text-text-secondary mt-3 p-3 bg-green-50 border border-green-200 rounded">
                        <strong>Önemli:</strong> {item.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 3. İşleme Amaçları */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                3. Kişisel Verilerin İşlenme Amaçları
              </h2>
              <div className="space-y-3">
                {PURPOSES.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      ✓
                    </span>
                    <span className="text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Hukuki Sebepler */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                4. İşlemenin Hukuki Sebepleri (KVKK Madde 5)
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Kişisel verileriniz, KVKK Madde 5&apos;te düzenlenen aşağıdaki hukuki sebeplere
                dayanılarak işlenmektedir:
              </p>
              <div className="space-y-3">
                {LEGAL_GROUNDS.map((g, idx) => (
                  <div key={idx} className="border border-border rounded-lg p-4 bg-surface">
                    <h3 className="font-bold text-text-primary text-sm">{g.title}</h3>
                    <p className="text-text-secondary text-sm mt-2">{g.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Toplama Yöntemi */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                5. Kişisel Verilerin Toplanma Yöntemi
              </h2>
              <div className="bg-background p-6 rounded-lg border border-border text-text-secondary leading-relaxed">
                <p>
                  Kişisel verileriniz; üyelik ve kayıt formları, profil ve ilan oluşturma ekranları,
                  adres doğrulama akışı (turkiye.gov.tr/e-Devlet sorgusu), ödeme işlemleri, destek
                  kanalları ve uygulamayı kullanımınız sırasında otomatik yollarla (çerezler, log
                  kayıtları) elektronik ortamda toplanır.
                </p>
              </div>
            </section>

            {/* 6. Aktarım */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                6. Kişisel Verilerin Aktarılması
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Kişisel verileriniz, yukarıdaki amaçlarla sınırlı olarak ve KVKK Madde 8 ve 9&apos;a
                uygun şekilde aşağıdaki taraflara aktarılabilir:
              </p>
              <ul className="space-y-3 text-text-secondary">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>
                    <strong>Ödeme hizmeti sağlayıcısı (PayTR):</strong> ödemelerin güvenli şekilde
                    alınması amacıyla.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>
                    <strong>Bulut altyapı ve barındırma sağlayıcıları:</strong> verilerin
                    depolanması ve uygulamanın çalıştırılması amacıyla.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>
                    <strong>Yetkili kamu kurum ve kuruluşları ile mahkemeler:</strong> yasal
                    yükümlülükler ve talepler kapsamında.
                  </span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-text-secondary">
                  <strong>Yurt dışına aktarım:</strong> Kullanılan bulut altyapı sağlayıcılarının
                  sunucuları yurt dışında bulunabilir. Bu durumda kişisel verileriniz, KVKK Madde
                  9 uyarınca yeterlilik kararı, uygun güvenceler (standart sözleşme vb.) veya açık
                  rızanız bulunması hâlinde yurt dışına aktarılır.
                </p>
              </div>
            </section>

            {/* 7. Saklama Süresi */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                7. Kişisel Verilerin Saklanma Süresi
              </h2>
              <div className="bg-background p-6 rounded-lg border border-border text-text-secondary leading-relaxed space-y-3">
                <p>
                  Kişisel verileriniz, işlenme amacının gerektirdiği ve ilgili mevzuatın öngördüğü
                  süreler boyunca saklanır:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">▪</span>
                    <span>Hesap ve profil verileri: üyeliğiniz aktif olduğu sürece.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">▪</span>
                    <span>
                      Hesap silindiğinde: yasal saklama yükümlülükleri dışındaki veriler en geç 30
                      gün içinde silinir veya anonim hâle getirilir.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">▪</span>
                    <span>
                      Ödeme ve faturaya ilişkin kayıtlar: ilgili mali mevzuat (örn. 10 yıllık
                      saklama) gereği zorunlu süre boyunca.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">▪</span>
                    <span>Adres doğrulama kayıtları: doğrulamanın geçerlilik süresi ve makul ek süre boyunca.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* 8. Haklarınız (Madde 11) */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                8. İlgili Kişi Olarak Haklarınız (KVKK Madde 11)
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                KVKK Madde 11 uyarınca veri sorumlusuna başvurarak aşağıdaki haklarınızı
                kullanabilirsiniz:
              </p>
              <div className="space-y-3">
                {RIGHTS_MADDE_11.map((right, idx) => (
                  <div
                    key={idx}
                    className="border border-border rounded-lg p-4 bg-surface hover:border-primary transition-colors"
                  >
                    <p className="text-text-secondary text-sm flex items-start gap-2">
                      <span className="text-primary font-bold">{idx + 1}.</span>
                      <span>{right}</span>
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 9. Başvuru */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                9. Başvuru Usulü
              </h2>
              <div className="bg-surface border border-border rounded-lg p-6 space-y-3 text-text-secondary">
                <p>
                  Haklarınıza ilişkin taleplerinizi, &quot;Veri Sorumlusuna Başvuru Usul ve Esasları
                  Hakkında Tebliğ&quot;e uygun olarak; kimliğinizi tevsik edici bilgilerle birlikte{' '}
                  <a href="mailto:kvkk@mahallem.com" className="text-primary hover:text-primary-hover underline">
                    kvkk@mahallem.com
                  </a>{' '}
                  adresine veya yazılı olarak veri sorumlusu adresine iletebilirsiniz.
                </p>
                <p>
                  <strong>Yanıt süresi:</strong> Başvurularınız, talebin niteliğine göre en kısa
                  sürede ve en geç 30 gün içinde sonuçlandırılır. İşlemin ayrıca bir maliyet
                  gerektirmesi hâlinde Kurul tarifesindeki ücret alınabilir.
                </p>
              </div>
            </section>

            {/* 10. Şikayet */}
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                10. Kurula Şikâyet Hakkı
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-text-secondary">
                <p className="leading-relaxed mb-3">
                  Başvurunuzun reddedilmesi, verilen yanıtı yetersiz bulmanız veya süresinde yanıt
                  verilmemesi hâlinde; Kişisel Verileri Koruma Kurulu&apos;na şikâyette
                  bulunabilirsiniz.
                </p>
                <p className="text-sm">
                  <strong>Kişisel Verileri Koruma Kurumu:</strong>{' '}
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

            {/* Taslak / hukukçu incelemesi uyarısı */}
            <section>
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-5 text-sm text-text-secondary">
                <p className="font-semibold text-text-primary mb-1">Yayın öncesi not</p>
                <p>
                  Bu metin, uygulamanın güncel veri akışına ve 6698 sayılı Kanun&apos;a göre
                  hazırlanmış bir taslaktır. Yayına alınmadan önce şirket sicil bilgileri (açık
                  adres, MERSİS ve VERBİS kayıt numarası, KEP adresi) tamamlanmalı ve metin yetkili
                  bir hukuk danışmanı tarafından gözden geçirilmelidir.
                </p>
              </div>
            </section>

            {/* Son Not */}
            <section className="border-t border-border pt-8">
              <p className="text-text-muted text-sm leading-relaxed">
                Bu KVKK Aydınlatma Metni gerektiğinde güncellenebilir. Değişiklikler bu sayfada
                yayınlandığı tarihten itibaren geçerlidir.
              </p>
            </section>
          </div>

          {/* Footer */}
          <div className="border-t border-border bg-background py-6 px-8 text-center">
            <p className="text-sm text-text-muted mb-4">
              © 2026 Mahallemiz — Consulting Partners tarafından geliştirilmiştir.
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
