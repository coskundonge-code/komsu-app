'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertCircle, Eye, Shield, Ban, Trash2 } from 'lucide-react';

const sections = [
  { id: 'hizmet', title: '1. Hizmet Tanımı' },
  { id: 'hesap', title: '2. Hesap Oluşturma ve Yükümlülükler' },
  { id: 'kurallar', title: '3. Kullanım Kuralları' },
  { id: 'icerik', title: '4. İçerik Politikası' },
  { id: 'mülkiyet', title: '5. Fikri Mülkiyet' },
  { id: 'sorumluluk', title: '6. Sorumluluk Sınırlaması' },
  { id: 'feshi', title: '7. Hesap Feshi' },
  { id: 'degisiklikler', title: '8. Koşul Değişiklikleri' },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#00833e] hover:text-[#006b32] font-medium mb-6 transition-colors">
          <ArrowLeft size={16} />
          Ana Sayfaya Dön
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Table of Contents */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden sticky top-6 shadow-sm">
              <div className="bg-gradient-to-br from-[#00833e] to-[#006b32] p-4 text-white">
                <h3 className="font-bold text-sm">İçindekiler</h3>
              </div>
              <nav className="p-4 space-y-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-sm text-[#8f8f8f] hover:text-[#00833e] hover:font-medium transition-colors py-1.5 px-2 border-l-2 border-transparent hover:border-[#00833e]"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden shadow-sm">
              {/* Header */}
              <div className="bg-gradient-to-br from-[#00833e] to-[#006b32] p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Kullanım Koşulları</h1>
                <p className="text-green-100">KomşuApp Platformunun Hukuki Anlaşması</p>
              </div>

              <div className="p-8">
                {/* Last Updated */}
                <div className="mb-8 p-4 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0]">
                  <p className="text-sm text-[#8f8f8f]"><span className="font-semibold">Son güncelleme:</span> 10 Mart 2026</p>
                  <p className="text-sm text-[#8f8f8f] mt-1"><span className="font-semibold">Yürürlük tarihi:</span> 10 Mart 2026</p>
                </div>

                <div className="prose prose-sm max-w-none text-[#404040] space-y-8">
                  {/* 1. Hizmet Tanımı */}
                  <section id="hizmet" className="scroll-mt-20">
                    <h2 className="text-xl font-bold text-[#333] mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-[#00833e] rounded-full"></span>
                      Hizmet Tanımı
                    </h2>
                    <p>
                      KomşuApp ("Platform"), komşuların birbirleriyle bağlantı kurmasını, bilgi paylaşmasını, etkinlikler organize etmesini ve yerel toplulukları güçlendirmesini sağlayan bir sosyal ağ platformudur. Platform, Trendex Lojistik tarafından işletilir.
                    </p>
                  </section>

                  {/* 2. Hesap Oluşturma ve Yükümlülükler */}
                  <section id="hesap" className="scroll-mt-20">
                    <h2 className="text-xl font-bold text-[#333] mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-[#00833e] rounded-full"></span>
                      Hesap Oluşturma ve Yükümlülükler
                    </h2>
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-[#333] text-sm mb-2">Hesap Oluşturma Koşulları</h3>
                        <p>Hizmetlerimizi kullanmak için gerçek kimliğinizle bir hesap oluşturmanız gerekmektedir. 18 yaşından büyük olmanız ve yasal olarak yetkin olmanız gerekir.</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#333] text-sm mb-2">Adres Doğrulaması</h3>
                        <p>Adres doğrulaması zorunludur. Yalnızca doğrulanmış kullanıcılar mahalleleriyle etkileşime girebilir. Yanlış veya yanıltıcı bilgi sağlamanız hesap kapatılmasına neden olabilir.</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#333] text-sm mb-2">Şifre Sorumluluğu</h3>
                        <p>Hesap şifrenizi gizli tutmak sizin sorumluluğunuzdur. Şifrenizle yapılan tüm aktivitelerden siz sorumlusunuz.</p>
                      </div>
                    </div>
                  </section>

                  {/* 3. Kullanım Kuralları */}
                  <section id="kurallar" className="scroll-mt-20">
                    <h2 className="text-xl font-bold text-[#333] mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-[#00833e] rounded-full"></span>
                      Kullanım Kuralları
                    </h2>
                    <p>Platform üzerinde aşağıdaki davranışlar kesinlikle yasaktır:</p>
                    <div className="mt-4 space-y-2 pl-4 border-l-2 border-[#e0e0e0]">
                      <p className="flex gap-2"><Ban className="w-4 h-4 text-[#00833e] flex-shrink-0 mt-0.5" /> Nefret söylemi, taciz, intimidasyon veya şiddet tehdidi</p>
                      <p className="flex gap-2"><Ban className="w-4 h-4 text-[#00833e] flex-shrink-0 mt-0.5" /> Spam, scam veya yanıltıcı bilgi paylaşımı</p>
                      <p className="flex gap-2"><Ban className="w-4 h-4 text-[#00833e] flex-shrink-0 mt-0.5" /> Kişiye ait bilgilerin izinsiz paylaşılması</p>
                      <p className="flex gap-2"><Ban className="w-4 h-4 text-[#00833e] flex-shrink-0 mt-0.5" /> Ticari amaçlı reklam veya pazarlama</p>
                      <p className="flex gap-2"><Ban className="w-4 h-4 text-[#00833e] flex-shrink-0 mt-0.5" /> Platformun teknik altyapısına müdahale girişimi</p>
                      <p className="flex gap-2"><Ban className="w-4 h-4 text-[#00833e] flex-shrink-0 mt-0.5" /> Başka hesaplar oluşturmak veya hesap satışı</p>
                    </div>
                  </section>

                  {/* 4. İçerik Politikası */}
                  <section id="icerik" className="scroll-mt-20">
                    <h2 className="text-xl font-bold text-[#333] mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-[#00833e] rounded-full"></span>
                      İçerik Politikası
                    </h2>
                    <div className="space-y-3">
                      <p>Paylaştığınız içeriklerden (metinler, fotoğraflar, videolar vb.) siz sorumlusunuz. Aşağıdaki içerikler kaldırılacaktır:</p>
                      <ul className="list-disc list-inside space-y-1 text-[#404040]">
                        <li>Telif hakkı ihlali içeren içerikler</li>
                        <li>Yasadışı mal veya hizmetler hakkında içerik</li>
                        <li>Şiddet veya zararlı davranış içeren içerikler</li>
                        <li>Cinsel veya sağlığa zararlı içerikler</li>
                        <li>Kötü niyetli yazılım veya virüsler</li>
                      </ul>
                      <p className="text-sm text-[#8f8f8f] pt-2">Platformda paylaştığınız içeriklerin fikri mülkiyeti size ait olmaya devam eder, ancak Platform bu içerikleri kullanma hakkına sahiptir.</p>
                    </div>
                  </section>

                  {/* 5. Fikri Mülkiyet */}
                  <section id="mülkiyet" className="scroll-mt-20">
                    <h2 className="text-xl font-bold text-[#333] mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-[#00833e] rounded-full"></span>
                      Fikri Mülkiyet
                    </h2>
                    <p>
                      KomşuApp platformu, tasarımı, logosu, yazılımı ve diğer tüm unsurları Trendex Lojistik'e aittir. Bu öğelerin hiçbir bölümünü izinsiz kullanamazsınız. İzinsiz kullanım yasal işlem başlatılmasına neden olabilir.
                    </p>
                  </section>

                  {/* 6. Sorumluluk Sınırlaması */}
                  <section id="sorumluluk" className="scroll-mt-20">
                    <h2 className="text-xl font-bold text-[#333] mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-[#00833e] rounded-full"></span>
                      Sorumluluk Sınırlaması
                    </h2>
                    <p>
                      Platform "olduğu gibi" sunulmaktadır. Trendex Lojistik, platformun kesintisiz veya hatasız çalışacağını garanti etmemektedir. Platform üzerinde paylaşılan içeriklerden kaynaklanabilecek zararlardan sorumlu değildir.
                    </p>
                  </section>

                  {/* 7. Hesap Feshi */}
                  <section id="feshi" className="scroll-mt-20">
                    <h2 className="text-xl font-bold text-[#333] mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-[#00833e] rounded-full"></span>
                      Hesap Feshi
                    </h2>
                    <div className="space-y-3">
                      <p>Kullanım koşullarını ihlal eden hesaplar aşağıdaki şekilde ele alınabilir:</p>
                      <div className="space-y-2">
                        <div className="flex gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-sm text-[#333]">Uyarı</h4>
                            <p className="text-sm text-[#8f8f8f]">İlk ihlal durumunda yazılı uyarı alırsınız.</p>
                          </div>
                        </div>
                        <div className="flex gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-sm text-[#333]">Askıya Alma</h4>
                            <p className="text-sm text-[#8f8f8f]">Tekrarlanan ihlallerde hesap geçici olarak askıya alınabilir.</p>
                          </div>
                        </div>
                        <div className="flex gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                          <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-sm text-[#333]">Kalıcı Kapatma</h4>
                            <p className="text-sm text-[#8f8f8f]">Ciddi veya tekrarlanan ihlallerde hesap kalıcı olarak kapatılabilir.</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-[#8f8f8f] pt-2">İstediğiniz zaman ayarlardan hesabınızı silebilirsiniz.</p>
                    </div>
                  </section>

                  {/* 8. Koşul Değişiklikleri */}
                  <section id="degisiklikler" className="scroll-mt-20">
                    <h2 className="text-xl font-bold text-[#333] mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-[#00833e] rounded-full"></span>
                      Koşul Değişiklikleri
                    </h2>
                    <p>
                      Bu koşullar herhangi bir zaman değiştirebilir. Önemli değişiklikler varsa size bildirim göndereceğiz. Değişikliklerden sonra platformu kullanmaya devam etmek, yeni koşulları kabul ettiğiniz anlamına gelir.
                    </p>
                  </section>

                  {/* Contact Section */}
                  <section className="mt-12 pt-8 border-t border-[#e0e0e0]">
                    <h3 className="font-bold text-[#333] mb-3">Sorularınız mı var?</h3>
                    <p className="text-sm text-[#8f8f8f] mb-4">Bu koşullarla ilgili sorularınız için lütfen destek ekibimize ulaşın.</p>
                    <Link
                      href="/mesajlar"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#00833e] hover:bg-[#006b32] text-white rounded-lg font-medium transition-colors"
                    >
                      <Shield className="w-4 h-4" />
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
