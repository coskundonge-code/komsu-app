'use client';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-surface rounded-lg shadow-sm p-6 sm:p-8 md:p-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
            Çerez Politikası
          </h1>
          <p className="text-text-muted text-sm">
            Son güncelleme: Mart 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Section 1: Ne Çerezlerdir */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 pb-2 border-b border-border">
              Ne Çerezlerdir?
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Çerezler, web sitesini ziyaret ettiğinizde bilgisayarınız, tablet veya akıllı telefonunuzda depolanan küçük metin dosyalarıdır. Bu dosyalar, web sitesinin sizi tanıması, tercihlerinizi hatırlaması ve deneyiminizi kişiselleştirmesine yardımcı olur.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Çerezler, web tarayıcınız tarafından otomatik olarak saklanır ve her ziyaretinizde web sunucularına geri gönderilir.
            </p>
          </section>

          {/* Section 2: Hangi Çerezleri Kullanıyoruz */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 pb-2 border-b border-border">
              Hangi Çerezleri Kullanıyoruz?
            </h2>

            <div className="space-y-6">
              {/* Essential Cookies */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Gerekli Çerezler
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  Bu çerezler, Mahallemiz&apos;in düzgün şekilde işlemesi için gereklidir. Web sitesinin temel işlevlerini sağlarlar, örneğin:
                </p>
                <ul className="list-disc list-inside text-text-secondary mt-2 space-y-1">
                  <li>Kullanıcı oturum açma ve kimlik doğrulama</li>
                  <li>Şifre koruması</li>
                  <li>Ödeme güvenliği</li>
                  <li>Kullanıcı tercihleri (dil, tema vb.)</li>
                </ul>
              </div>

              {/* Performance Cookies */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Performans Çerezleri
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  Web sitesinin performansını iyileştirmek için kullanılır:
                </p>
                <ul className="list-disc list-inside text-text-secondary mt-2 space-y-1">
                  <li>Sayfaların yükleme hızını ölçme</li>
                  <li>Kullanıcı davranışı analizi</li>
                  <li>Hataların takip edilmesi</li>
                </ul>
              </div>

              {/* Functional Cookies */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  İşlevsel Çerezler
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  Deneyiminizi kişiselleştirmek ve geliştirmek için:
                </p>
                <ul className="list-disc list-inside text-text-secondary mt-2 space-y-1">
                  <li>Dil ve bölge ayarlarını hatırlama</li>
                  <li>Kişiselleştirilmiş içerik sunma</li>
                  <li>Filtreleme ve sıralama tercihlerini saklama</li>
                </ul>
              </div>

              {/* Analytics Cookies */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Analitik Çerezler
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  Web sitesinin nasıl kullanıldığını anlamak için:
                </p>
                <ul className="list-disc list-inside text-text-secondary mt-2 space-y-1">
                  <li>Sayfaları hangi sırayla ziyaret ettiklerini takip etme</li>
                  <li>Hata sayfalarına erişimi izleme</li>
                  <li>Kullanıcı sayısını ve davranışlarını ölçme</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Çerez Tercihleriniz */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 pb-2 border-b border-border">
              Çerez Tercihlerinizi Nasıl Yönetebilirsiniz?
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Tarayıcı Ayarlarından
                </h3>
                <p className="text-text-secondary leading-relaxed mb-3">
                  Çoğu web tarayıcısı çerezleri kontrol etme seçenekleri sunar. Tarayıcınızın yardım menüsünde nasıl yapılacağını öğrenebilirsiniz:
                </p>
                <ul className="list-disc list-inside text-text-secondary space-y-1">
                  <li><strong>Chrome:</strong> Ayarlar &gt; Gizlilik ve güvenlik &gt; Çerezler ve diğer site verileri</li>
                  <li><strong>Firefox:</strong> Tercihler &gt; Gizlilik &gt; Çerezler ve Site Verileri</li>
                  <li><strong>Safari:</strong> Tercihler &gt; Gizlilik &gt; Çerezleri yönet</li>
                  <li><strong>Edge:</strong> Ayarlar &gt; Gizlilik, arama ve hizmetler &gt; Çerezler ve diğer site verileri</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Mahallemiz Tercihlerinden
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  Hesap ayarlarınızdan çerez tercihlerinizi yönetebilirsiniz. Ancak, bazı çerezlerin devre dışı bırakılması web sitesinin düzgün şekilde çalışmasını etkileyebilir.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-background border border-border rounded-lg">
              <p className="text-sm text-text-secondary">
                <strong>Not:</strong> Çerezleri tamamen devre dışı bırakırsanız, Mahallemiz&apos;ın bazı özellikleri düzgün çalışmayabilir. Oturum açma, tercihler ve güvenlik ayarları etkilenebilir.
              </p>
            </div>
          </section>

          {/* Section 4: KVKK Uyumu */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 pb-2 border-b border-border">
              Veri Gizliliği
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Mahallemiz, Kişisel Verilerin Korunması Kanunu (KVKK) ve Avrupa Birliği&apos;nin Genel Veri Koruma Yönetmeliği (GDPR) ile uyumlu olarak çalışır.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              Çerezlerin ve web sitesi kullanımınızın analiz edilmesi sırasında toplanan kişisel veriler, işbu politika ve gizlilik politikamız uyarınca korunmaktadır.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Verileriniz üçüncü taraflara riza olmaksızın satılmaz, paylaşılmaz veya kiralanmaz. Sadece hizmet sağlayıcılarımız tarafından hizmet sunumunda kullanılabilir.
            </p>
          </section>

          {/* Section 5: İletişim */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 pb-2 border-b border-border">
              İletişim
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Çerez politikamız hakkında sorularınız veya endişeleriniz varsa, lütfen bize aşağıdaki yollarla ulaşın:
            </p>
            <div className="space-y-2 text-text-secondary">
              <p>
                <strong>E-posta:</strong>{' '}
                <a
                  href="mailto:privacy@mahallem.com"
                  className="text-primary hover:text-primary-hover transition-colors"
                >
                  privacy@mahallem.com
                </a>
              </p>
              <p>
                <strong>Web Sitesi:</strong>{' '}
                <a
                  href="https://komsu-app.vercel.app"
                  className="text-primary hover:text-primary-hover transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  mahallem.com
                </a>
              </p>
            </div>
          </section>

          {/* Section 6: Değişiklikler */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 pb-2 border-b border-border">
              Bu Politikada Değişiklikler
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Bu çerez politikası zaman zaman güncellenebilir. Önemli değişiklikler yapıldığında web sitesinde bildirim yapılacak veya belirli durumlarda e-posta yoluyla bildireceğiz. Bu sayfayı düzenli olarak kontrol etmeniz önerilir.
            </p>
          </section>
        </div>

        {/* Footer Button */}
        <div className="mt-10 pt-8 border-t border-border">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover font-medium transition-colors"
          >
            Geri Dön
          </button>
        </div>
      </div>
    </div>
  );
}
