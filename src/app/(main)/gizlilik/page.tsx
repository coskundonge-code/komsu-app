'use client';

import Link from 'next/link';
import { ArrowLeft, Lock, Eye, Share2, Shield, Check, AlertCircle } from 'lucide-react';

const sections = [
  { id: 'toplanan', title: '1. Toplanan Bilgiler' },
  { id: 'kullanim', title: '2. Bilgi Kullanımı' },
  { id: 'paylas', title: '3. Bilgi Paylaşımı' },
  { id: 'cerezler', title: '4. Çerezler' },
  { id: 'guvenlık', title: '5. Veri Güvenliği' },
  { id: 'haklarınız', title: '6. Haklarınız' },
  { id: 'saklama', title: '7. Veri Saklama' },
  { id: 'iletisim', title: '8. İletişim' },
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
                  <p className="text-sm text-text-muted"><span className="font-semibold">Son güncelleme:</span> 10 Mart 2026</p>
                  <p className="text-sm text-text-muted mt-1"><span className="font-semibold">Yürürlük tarihi:</span> 10 Mart 2026</p>
                </div>

                {/* Intro */}
                <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-text-secondary">
                    Mahallem, verilerinizin gizliliğini çok ciddiye almaktadır. Bu politika, verilerinizi nasıl topladığımız, kullandığımız, korumadığımız ve haklarınız hakkında tam bilgi sağlamak için hazırlanmıştır.
                  </p>
                </div>

                <div className="prose prose-sm max-w-none text-text-secondary space-y-8">
                  {/* 1. Toplanan Bilgiler */}
                  <section id="toplanan" className="scroll-mt-20">
                    <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      Toplanan Bilgiler
                    </h2>
                    <p>Mahallem, hizmetlerimizi sunmak ve iyileştirmek amacıyla belirli kişisel bilgilerinizi toplar:</p>
                    <div className="mt-4 space-y-3">
                      <div className="flex gap-3 p-3 bg-background rounded-lg">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-text-primary text-sm">Hesap Bilgileri</h4>
                          <p className="text-sm text-text-muted">Ad, e-posta, telefon numarası, adres, doğum tarihi</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 bg-background rounded-lg">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-text-primary text-sm">Profil Bilgileri</h4>
                          <p className="text-sm text-text-muted">Profil fotoğrafı, biyografi, ilgi alanları</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 bg-background rounded-lg">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-text-primary text-sm">Aktivite Verileri</h4>
                          <p className="text-sm text-text-muted">Gönderiler, yorum ve beğeniler, etkinlik katılımı</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 bg-background rounded-lg">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-text-primary text-sm">Teknik Veriler</h4>
                          <p className="text-sm text-text-muted">IP adresi, cihaz türü, tarayıcı bilgileri, konum verisi</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* 2. Bilgi Kullanımı */}
                  <section id="kullanim" className="scroll-mt-20">
                    <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      Bilgi Kullanımı
                    </h2>
                    <p>Topladığımız bilgileri aşağıdaki amaçlarla kullanıyoruz:</p>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li>Hesabınızı oluşturmak ve yönetmek</li>
                      <li>Sizi doğru mahalleye atamak</li>
                      <li>Kişiselleştirilmiş içerik sunmak</li>
                      <li>Güvenliği sağlamak ve sahtekarlığı önlemek</li>
                      <li>Müşteri desteği sağlamak</li>
                      <li>Platformu iyileştirmek ve geliştirmek</li>
                      <li>Yasal yükümlülüklerimizi yerine getirmek</li>
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
                          Kişisel bilgilerinizi üçüncü taraflarla satmayız, değiş tokuş etmeyiz veya vermeyiz. Sadece hizmet sağlayıcılarımız (ödeme işlemi, sunucu barındırma vb.) sınırlı bilgilere erişebilir.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary text-sm mb-2">Mahalle Sakinlerine Görünürlük</h3>
                        <p className="text-text-secondary">
                          Mahalle sakinleri yalnızca profilinizde herkese açık olarak belirlediğiniz bilgileri görebilir (ad, profil fotoğrafı, biyografi). Özel bilgileriniz (e-posta, telefon, tam adres) asla görüntülenmez.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary text-sm mb-2">Yasal Gereklilikler</h3>
                        <p className="text-text-secondary">
                          Yasal zorunluluk varsa, gizlilik taleplerini yoksayarak verilerinizi mahkeme ve hukuk güçlerine verebiliriz.
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
                      Mahallem, çerezler ve benzer takip teknolojileri kullanarak deneyiminizi geliştirmektedir. Tarayıcı ayarlarından çerezleri kontrol edebilirsiniz. Çerezleri devre dışı bırakmanız bazı özelikleri kullanmanızı engelliyebilir.
                    </p>
                  </section>

                  {/* 5. Veri Güvenliği */}
                  <section id="guvenlık" className="scroll-mt-20">
                    <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      Veri Güvenliği
                    </h2>
                    <p>Verilerinizi korumak için kapsamlı güvenlik önlemleri kullanıyoruz:</p>
                    <div className="mt-4 space-y-2 pl-4 border-l-2 border-border">
                      <div className="flex gap-2">
                        <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>256-bit SSL/TLS şifrelemesi</span>
                      </div>
                      <div className="flex gap-2">
                        <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Veritabanı şifreleme</span>
                      </div>
                      <div className="flex gap-2">
                        <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Düzenli güvenlik denetimleri</span>
                      </div>
                      <div className="flex gap-2">
                        <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Sınırlı personel erişimi</span>
                      </div>
                    </div>
                    <p className="text-sm text-text-muted mt-4">
                      Ancak internet üzerinde %100 güvenlik garantisi yoktur. Herhangi bir güvenlik sorunu fark ederseniz derhal bize bildirin.
                    </p>
                  </section>

                  {/* 6. Haklarınız */}
                  <section id="haklarınız" className="scroll-mt-20">
                    <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      Haklarınız
                    </h2>
                    <p>Verilerinizle ilgili aşağıdaki haklara sahipsiniz:</p>
                    <div className="mt-4 space-y-3">
                      <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <Eye className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-text-primary text-sm">Erişim Hakkı</h4>
                          <p className="text-sm text-text-muted">Hangi verilerinizin toplandığını öğrenme hakkı</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <Eye className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-text-primary text-sm">Düzeltme Hakkı</h4>
                          <p className="text-sm text-text-muted">Yanlış veya eksik verilerinizi düzeltme hakkı</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <Eye className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-text-primary text-sm">Silme Hakkı</h4>
                          <p className="text-sm text-text-muted">Verilerinizin silinmesini talep etme hakkı</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <Eye className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-text-primary text-sm">Taşınabilirlik Hakkı</h4>
                          <p className="text-sm text-text-muted">Verilerinizi taşınabilir bir formatta alma hakkı</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-text-muted mt-4">
                      Bu haklarını kullanmak için destek ekibimize başvurabilirsiniz.
                    </p>
                  </section>

                  {/* 7. Veri Saklama */}
                  <section id="saklama" className="scroll-mt-20">
                    <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      Veri Saklama
                    </h2>
                    <p>
                      Verileriniz, hizmet sağlamak ve yasal gereklilikler yerine getirmek için gerekli olduğu sürece saklanır. Hesabınızı sildikten sonra verileriniz 30 gün içerisinde kalıcı olarak silinir.
                    </p>
                  </section>

                  {/* 8. İletişim */}
                  <section id="iletisim" className="scroll-mt-20">
                    <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      İletişim
                    </h2>
                    <p>
                      Gizlilik politikamız hakkında sorularınız veya endişeleriniz varsa, lütfen bize ulaşın:
                    </p>
                    <div className="mt-4 p-4 bg-background rounded-lg">
                      <p className="text-sm text-text-secondary"><span className="font-semibold">Email:</span> gizlilik@mahallem.com</p>
                      <p className="text-sm text-text-secondary mt-2"><span className="font-semibold">Adres:</span> Trendex Lojistik, İstanbul, Türkiye</p>
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
