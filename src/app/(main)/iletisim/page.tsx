'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Instagram, Twitter, Facebook, Send } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    ad: '',
    email: '',
    konu: 'Genel',
    mesaj: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would send this data to a backend
      console.log('Form submitted:', formData);

      setSubmitted(true);
      setFormData({
        ad: '',
        email: '',
        konu: 'Genel',
        mesaj: '',
      });

      // Reset the success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const faqs = [
    {
      q: 'Hesabımı nasıl silebilirim?',
      a: 'Hesap silme işlemi için Ayarlar > Güvenlik > Hesabı Sil seçeneğini kullanabilirsiniz. Hesap silme işlemi 30 gün içinde tamamlanır.',
    },
    {
      q: 'Şifremi unuttum, ne yapmalıyım?',
      a: 'Giriş sayfasında "Şifremi Unuttum" bağlantısını tıklayın. E-posta adresinize gelen linki takip ederek yeni şifre belirleyebilirsiniz.',
    },
    {
      q: 'Sorunlu bir gönderiyi nasıl bildiririm?',
      a: 'Gönderi altındaki "⋮" menüsünü açıp "İhbar Et" seçeneğini tıklayın. Sorunun türünü ve detaylı açıklamasını belirtin.',
    },
    {
      q: 'KomşuApp mobil uygulaması ne zaman çıkacak?',
      a: 'Mobil uygulamalar (iOS ve Android) 2026 Q2 içinde yayınlanacak. Bildirim almak için bize abone olabilirsiniz.',
    },
    {
      q: 'Mahalle doğrulaması neden gerekli?',
      a: 'Mahalle doğrulaması, platformun güvenliğini sağlamak ve gerçek mahalle sakinlerine hizmet sunmak için gereklidir. Bu, dolandırıcılık ve spam önlemeye yardımcı olur.',
    },
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: 'E-posta',
      value: 'destek@komsuapp.com',
      description: 'Genel sorular ve destek için',
    },
    {
      icon: Mail,
      title: 'KVKK Soruları',
      value: 'kvkk@komsuapp.com',
      description: 'Veri koruması ile ilgili başvurular',
    },
    {
      icon: MapPin,
      title: 'Adres',
      value: 'İstanbul, Türkiye',
      description: 'Trendex Lojistik A.Ş.',
    },
    {
      icon: Phone,
      title: 'Telefon',
      value: '+90 (212) 555-1234',
      description: 'Pazartesi-Cuma, 09:00-18:00',
    },
  ];

  const socialLinks = [
    { icon: Instagram, name: 'Instagram', url: 'https://instagram.com/komsuapp', color: 'hover:text-pink-600' },
    { icon: Twitter, name: 'Twitter', url: 'https://twitter.com/komsuapp', color: 'hover:text-blue-400' },
    { icon: Facebook, name: 'Facebook', url: 'https://facebook.com/komsuapp', color: 'hover:text-blue-600' },
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
            <h1 className="text-3xl font-bold mb-2">İletişim</h1>
            <p className="text-green-100">Bize soruların, önerilerin ve şikayetlerin için ulaş</p>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12 space-y-12">
            {/* Contact Methods */}
            <section>
              <h2 className="text-2xl font-bold text-[#333] mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#00833e] rounded-full"></span>
                Bize Nasıl Ulaşabilirsiniz
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contactMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <a
                      key={method.title}
                      href={
                        method.title === 'E-posta'
                          ? `mailto:${method.value}`
                          : method.title === 'KVKK Soruları'
                          ? `mailto:${method.value}`
                          : '#'
                      }
                      className="p-6 bg-[#f0f2f5] border border-[#e0e0e0] rounded-lg hover:border-[#00833e] hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white rounded-lg border border-[#e0e0e0] group-hover:border-[#00833e] transition-colors">
                          <Icon className="w-6 h-6 text-[#00833e]" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-bold text-[#333] mb-1">{method.title}</h3>
                          <p className="text-[#00833e] font-semibold text-sm mb-1">{method.value}</p>
                          <p className="text-xs text-[#8f8f8f]">{method.description}</p>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>

            {/* Contact Form */}
            <section className="border-t border-[#e0e0e0] pt-12">
              <h2 className="text-2xl font-bold text-[#333] mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#00833e] rounded-full"></span>
                İletişim Formu
              </h2>

              {submitted ? (
                <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                  <div className="text-4xl mb-3">✓</div>
                  <h3 className="text-lg font-bold text-green-800 mb-2">Mesajınız başarıyla gönderildi!</h3>
                  <p className="text-green-700">
                    Biz tarafından en kısa sürede incelenecek ve yanıtlanacaktır. Teşekkürler!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ad" className="block text-sm font-semibold text-[#333] mb-2">
                        Ad Soyad *
                      </label>
                      <input
                        type="text"
                        id="ad"
                        name="ad"
                        value={formData.ad}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e]/20 transition-colors"
                        placeholder="Adınız ve soyadınız"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-[#333] mb-2">
                        E-posta *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e]/20 transition-colors"
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="konu" className="block text-sm font-semibold text-[#333] mb-2">
                      Konu *
                    </label>
                    <select
                      id="konu"
                      name="konu"
                      value={formData.konu}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e]/20 transition-colors bg-white"
                    >
                      <option value="Genel">Genel Sorular</option>
                      <option value="Teknik Destek">Teknik Destek</option>
                      <option value="İşletme">İşletme İçin</option>
                      <option value="Şikayet">Şikayet</option>
                      <option value="Öneri">Öneri ve Geri Bildirim</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="mesaj" className="block text-sm font-semibold text-[#333] mb-2">
                      Mesaj *
                    </label>
                    <textarea
                      id="mesaj"
                      name="mesaj"
                      value={formData.mesaj}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e]/20 transition-colors resize-none"
                      placeholder="Lütfen detaylı bir şekilde açıklayınız..."
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full px-6 py-3 bg-[#00833e] text-white font-bold rounded-lg hover:bg-[#006b32] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      <Send size={18} />
                      {isLoading ? 'Gönderiliyor...' : 'Mesajı Gönder'}
                    </button>
                  </div>

                  <p className="text-xs text-[#8f8f8f] text-center">
                    * Zorunlu alanları doldurunuz. İşlenmiş verileriniz KVKK'ya uygun olarak güvence
                    altında tutulacaktır.
                  </p>
                </form>
              )}
            </section>

            {/* Social Media */}
            <section className="border-t border-[#e0e0e0] pt-12">
              <h2 className="text-2xl font-bold text-[#333] mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#00833e] rounded-full"></span>
                Sosyal Medyada Bizi Takip Edin
              </h2>
              <div className="flex gap-4 flex-wrap">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-4 bg-[#f0f2f5] border border-[#e0e0e0] rounded-lg hover:bg-white hover:shadow-md transition-all ${social.color}`}
                      title={social.name}
                    >
                      <Icon size={24} />
                    </a>
                  );
                })}
              </div>
            </section>

            {/* FAQ */}
            <section className="border-t border-[#e0e0e0] pt-12">
              <h2 className="text-2xl font-bold text-[#333] mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#00833e] rounded-full"></span>
                Sıkça Sorulan Sorular
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <details
                    key={idx}
                    className="group border border-[#e0e0e0] rounded-lg overflow-hidden hover:border-[#00833e] transition-colors"
                  >
                    <summary className="p-4 cursor-pointer bg-[#f0f2f5] hover:bg-white font-semibold text-[#333] flex items-center justify-between">
                      <span>{faq.q}</span>
                      <span className="text-[#00833e] group-open:rotate-180 transition-transform text-lg">
                        ▼
                      </span>
                    </summary>
                    <div className="p-4 bg-white text-[#404040] text-sm leading-relaxed border-t border-[#e0e0e0]">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>

            {/* Response Time */}
            <section className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-bold text-[#333] mb-2">⏱ Yanıt Süresi</h3>
              <p className="text-[#404040] text-sm">
                Pazartesi-Cuma saat 09:00-18:00 arasında gönderilen mesajlara 24 saat içinde cevap
                verilir. Weekend mesajları Pazartesi günü sırasıyla yanıtlanır.
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
                href="/topluluk-kurallari"
                className="text-sm text-[#00833e] hover:text-[#006b32] font-medium transition-colors"
              >
                Topluluk Kuralları
              </Link>
              <span className="text-[#e0e0e0]">•</span>
              <Link
                href="/kvkk"
                className="text-sm text-[#00833e] hover:text-[#006b32] font-medium transition-colors"
              >
                KVKK Aydınlatma
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
