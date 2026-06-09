'use client';

import Link from 'next/link';
import { ArrowLeft, Lock, Eye, Shield, Check } from 'lucide-react';

/**
 * Gizlilik Politikası — KVKK Aydınlatma Metni (/kvkk) ile uyumlu, kullanıcı dostu
 * özet. Gerçek veri akışına göre yazılmıştır: TC Kimlik No saklanmaz, kart bilgisi
 * PayTR'de işlenir, barındırma sağlayıcısının sunucuları yurt dışında olabilir.
 */

const LAST_UPDATED = '7 Haziran 2026';

const sections = [
  { id: 'toplanan', title: '1. Toplanan Bilgiler' },
  { id: 'kullanim', title: '2. Bilgi Kullanımı' },
  { id: 'paylas', title: '3. Bilgi Paylaşımı' },
  { id: 'cerezler', title: '4. Çerezler' },
  { id: 'guvenlik', title: '5. Veri Güvenliği' },
  { id: 'haklariniz', title: '6. Haklarınız' },
  { id: 'saklama', title: '7. Veri Saklama' },
  { id: 'cocuklar', title: '8. Çocukların Gizliliği' },
  { id: 'iletisim', title: '9. İletişim' },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-hover font-medium mb-6 transition-colors">
          <ArrowLeft size={16} />
          Ana Sayfaya Dön
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Table of Contents */}
          <div className="lg:col-span-1">
            <div className="bg-surface rounded-lg border border-border overflow-hidden sticky top-6 shadow-sm">
              <div className="bg-gradient-to-br from-primary to-primary-hover p-4 text-white">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  İçindekiler
                </h3>
              </div>
              <nav className="p-4 space-y-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-sm text-text-muted hover:text-primary hover:font-medium transition-colors py-1.5 px-2 border-l-2 border-transparent hover:border-primary"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-surface rounded-lg border border-border overflow-hidden shadow-sm">
              {/* Header */}
              <div className="bg-gradient-to-br from-primary to-primary-hover p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Gizlilik Politikası</h1>
                <p className="text-green-100">Verileriniz nasıl kullanılır ve korunur</p>
              </div>

              <div className="p-8">
                {/* Last Updated */}
                <div className="mb-8 p-4 bg-background rounded-lg border border-border">
                  <p className="text-sm text-text-muted"><span className="font-semibold">Son güncelleme:</span> {LAST_UPDATED}</p>
                </div>

                {/* Intro */}
                <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-text-secondary">
                    Mahallemiz, verilerinizin gizliliğini ciddiye alır. Bu politika; verilerinizi nasıl topladığımızı, kullandığımızı, koruduğumuzu ve haklarınızı sade bir dille özetler. Hukuki ayrıntılar için{' '}
                    <Link href="/kvkk" className="text-primary hover:text-primary-hover underline font-medium">KVKK Aydınlatma Metni</Link>&apos;ni inceleyebilirsiniz.
                  </p>
                </div>

                <div className="prose prose-sm max-w-none text-text-secondary space-y-8">
                  {/* 1. Toplanan Bilgiler */}
                  <section id="toplanan" className="scroll-mt-20">
                    <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      Toplanan Bilgiler
                    </h2>
                    <p>Hizmetlerimizi sunmak ve iyileştirmek için aşağıdaki bilgileri toplarız:</p>
                    <div className="mt-4 space-y-3">
                      <div className="flex gap-3 p-3 bg-background rounded-lg">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-text-primary text-sm">Hesap Bilgileri</h4>
                          <p className="text-sm text-text-muted">Ad, soyad, e-posta, telefon numarası, cinsiyet.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 bg-background rounded-lg">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-text-primary text-sm">Profil Bilgileri</h4>
                          <p className="text-sm text-text-muted">Profil fotoğrafı, biyografi.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 bg-background rounded-lg">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-text-primary text-sm">Konum ve Adres</h4>
                          <p className="text-sm text-text-muted">İl, ilçe, mahalle, adres ve harita üzerinde seçilen konum.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 bg-background rounded-lg">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-text-primary text-sm">Adres Doğrulama</h4>
                          <p className="text-sm text-text-muted">e-Devlet adres belgesi barkodu ve doğrulama durumu.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 bg-background rounded-lg">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-text-primary text-sm">Aktivite ve Ödeme Verileri</h4>
                          <p className="text-sm text-text-muted">Gönderiler, yorumlar, ilanlar, etkinlik katılımı ve ödeme işlem kayıtları.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 bg-background rounded-lg">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-text-primary text-sm">Teknik Veriler</h4>
                          <p className="text-sm text-text-muted">IP adresi, cihaz/tarayıcı bilgileri, oturum kayıtları.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
                      <p className="text-sm text-text-secondary">
                        <strong>TC Kimlik Numaranız saklanmaz.</strong> Adres doğrulaması sırasında yalnızca turkiye.gov.tr sorgusu için kullanılır; sistemimizde tutulmaz.
                      </p>
                      <p className="text-sm text-text-secondary">
                        <strong>Kart bilgileriniz saklanmaz.</strong> Kart numarası, son kullanma tarihi ve CVV; ödeme altyapısı sağlayıcısı (PayTR) tarafından güvenli ortamda işlenir.
                      </p>
                    </div>
                  </section>

                  {/* 2. Bilgi Kullanımı */}
                  <section id="kullanim" className="scroll-mt-20">
                    <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      Bilgi Kullanımı
                    </h2>
                    <p>Topladığımız bilgileri aşağıdaki amaçlarla kullanırız:</p>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li>Hesabınızı oluşturmak ve yönetmek</li>
                      <li>Sizi doğru mahalleye atamak ve mahalle sakini olduğunuzu doğrulamak</li>
                      <li>Pazaryeri, etkinlik, grup ve mesajlaşma özelliklerini sunmak</li>
                      <li>Ücretli hizmetlere ilişkin ödemeleri almak</li>
                      <li>Güvenliği sağlamak ve sahtekârlığı önlemek</li>
                      <li>Müşteri desteği sağlamak</li>
                      <li>Platformu iyileştirmek ve yasal yükümlülükleri yerine getirmek</li>
                    </ul>
                  </section>

                  {/* 3. Bilgi Paylaşımı */}
                  <section id="paylas" className="scroll-mt-20">
                    <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      Bilgi Paylaşımı
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-text-primary text-sm mb-2">Üçüncü Taraflarla Paylaşım</h3>
                        <p className="text-text-secondary">
                          Kişisel bilgilerinizi satmaz veya pazarlama amacıyla üçüncü taraflara devretmeyiz. Yalnızca hizmetin sunulması için gerekli sağlayıcılar (ödeme için PayTR, barındırma için bulut altyapı sağlayıcıları) sınırlı verilere erişebilir.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary text-sm mb-2">Mahalle Sakinlerine Görünürlük</h3>
                        <p className="text-text-secondary">
                          Diğer kullanıcılar yalnızca profilinizde herkese açık paylaştığınız bilgileri (ad, profil fotoğrafı, biyografi ve paylaşımlarınız) görebilir. E-posta, telefon ve tam adresiniz diğer kullanıcılara gösterilmez.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary text-sm mb-2">Yurt Dışına Aktarım</h3>
                        <p className="text-text-secondary">
                          Kullandığımız bulut altyapı sağlayıcılarının sunucuları yurt dışında bulunabilir. Bu durumda verileriniz, KVKK Madde 9 uyarınca uygun güvenceler veya açık rızanız bulunması hâlinde yurt dışına aktarılır.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary text-sm mb-2">Yasal Gereklilikler</h3>
                        <p className="text-text-secondary">
                          Yürürlükteki mevzuat gereği zorunlu olduğunda; verileriniz yetkili kamu kurumları ve mahkemelerle, yalnızca talep edilen kapsamla sınırlı olarak paylaşılabilir.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* 4. Çerezler */}
                  <section id="cerezler" className="scroll-mt-20">
                    <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      Çerezler ve Takip Teknolojileri
                    </h2>
                    <p>
                      Oturumunuzu açık tutmak ve deneyiminizi geliştirmek için çerezler ve benzer teknolojiler kullanırız. Çerezleri tarayıcı ayarlarınızdan kontrol edebilir veya silebilirsiniz; ancak bazı çerezleri devre dışı bırakmanız, oturum açma gibi temel özellikleri kullanmanızı engelleyebilir.
                    </p>
                  </section>

                  {/* 5. Veri Güvenliği */}
                  <section id="guvenlik" className="scroll-mt-20">
                    <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      Veri Güvenliği
                    </h2>
                    <p>Verilerinizi korumak için teknik ve idari tedbirler uygularız:</p>
                    <div className="mt-4 space-y-2 pl-4 border-l-2 border-border">
                      <div className="flex gap-2">
                        <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Aktarımda SSL/TLS şifrelemesi</span>
                      </div>
                      <div className="flex gap-2">
                        <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Satır düzeyinde erişim denetimi (RLS) ile veritabanı koruması</span>
                      </div>
                      <div className="flex gap-2">
                        <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Yetkiye dayalı, sınırlı personel erişimi</span>
                      </div>
                      <div className="flex gap-2">
                        <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Düzenli yedekleme ve güvenlik güncellemeleri</span>
                      </div>
                    </div>
                    <p className="text-sm text-text-muted mt-4">
                      İnternet üzerinde hiçbir yöntem %100 güvenlik garantisi veremez. Bir güvenlik sorunu fark ederseniz lütfen derhal bize bildirin.
                    </p>
                  </section>

                  {/* 6. Haklarınız */}
                  <section id="haklariniz" className="scroll-mt-20">
                    <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      Haklarınız
                    </h2>
                    <p>KVKK Madde 11 kapsamında verilerinizle ilgili haklara sahipsiniz:</p>
                    <div className="mt-4 space-y-3">
                      <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <Eye className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-text-primary text-sm">Bilgi ve Erişim</h4>
                          <p className="text-sm text-text-muted">Verilerinizin işlenip işlenmediğini ve nasıl kullanıldığını öğrenme</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <Eye className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-text-primary text-sm">Düzeltme</h4>
                          <p className="text-sm text-text-muted">Yanlış veya eksik verilerinizin düzeltilmesini isteme</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <Eye className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-text-primary text-sm">Silme</h4>
                          <p className="text-sm text-text-muted">Şartların oluşması hâlinde verilerinizin silinmesini isteme</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <Eye className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-text-primary text-sm">İtiraz ve Zararın Giderilmesi</h4>
                          <p className="text-sm text-text-muted">Otomatik analiz sonuçlarına itiraz ve kanuna aykırı işlemeden doğan zararın giderilmesini talep etme</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-text-muted mt-4">
                      Bu hakları kullanmak için{' '}
                      <a href="mailto:kvkk@mahallem.com" className="text-primary hover:text-primary-hover underline">kvkk@mahallem.com</a>{' '}
                      adresine başvurabilirsiniz. Ayrıntılı başvuru usulü için{' '}
                      <Link href="/kvkk" className="text-primary hover:text-primary-hover underline">KVKK Aydınlatma Metni</Link>&apos;ne bakınız.
                    </p>
                  </section>

                  {/* 7. Veri Saklama */}
                  <section id="saklama" className="scroll-mt-20">
                    <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      Veri Saklama
                    </h2>
                    <p>
                      Verileriniz; hizmetin sunulması ve yasal yükümlülüklerin yerine getirilmesi için gerekli süre boyunca saklanır. Hesabınızı sildiğinizde, yasal saklama yükümlülükleri dışındaki verileriniz en geç 30 gün içinde silinir veya anonim hâle getirilir. Ödeme ve faturaya ilişkin kayıtlar, ilgili mali mevzuatın öngördüğü süre boyunca tutulur.
                    </p>
                  </section>

                  {/* 8. Çocukların Gizliliği */}
                  <section id="cocuklar" className="scroll-mt-20">
                    <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      Çocukların Gizliliği
                    </h2>
                    <p>
                      Platform 18 yaşından büyük kullanıcılara yöneliktir. 18 yaşından küçük kişilerin verilerini bilerek toplamayız. Böyle bir verinin işlendiğini fark edersek gerekli silme işlemini gerçekleştiririz.
                    </p>
                  </section>

                  {/* 9. İletişim */}
                  <section id="iletisim" className="scroll-mt-20">
                    <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      İletişim
                    </h2>
                    <p>
                      Gizlilik politikamız hakkında sorularınız için bize ulaşın:
                    </p>
                    <div className="mt-4 p-4 bg-background rounded-lg">
                      <p className="text-sm text-text-secondary"><span className="font-semibold">E-posta:</span> kvkk@mahallem.com</p>
                      <p className="text-sm text-text-secondary mt-2"><span className="font-semibold">Veri Sorumlusu:</span> Consulting Partners Yönetim Danışmanlığı A.Ş., İstanbul, Türkiye</p>
                    </div>
                  </section>

                  {/* Contact Button */}
                  <section className="mt-12 pt-8 border-t border-border">
                    <Link
                      href="/iletisim"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
                    >
                      <Lock className="w-4 h-4" />
                      Destek ile İletişime Geç
                    </Link>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
