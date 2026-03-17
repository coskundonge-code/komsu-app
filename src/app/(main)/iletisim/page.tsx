"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Send, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    ad: "",
    email: "",
    konu: "Genel",
    mesaj: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.ad.trim()) {
      newErrors.ad = "Ad soyad alanı boş olamaz";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-posta alanı boş olamaz";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi giriniz";
    }

    if (!formData.mesaj.trim()) {
      newErrors.mesaj = "Mesaj alanı boş olamaz";
    } else if (formData.mesaj.trim().length < 10) {
      newErrors.mesaj = "Mesaj en az 10 karakter olmalıdır";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Form submitted:", formData);

      setSubmitted(true);
      setFormData({
        ad: "",
        email: "",
        konu: "Genel",
        mesaj: "",
      });

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const faqs = [
    {
      q: "Hesabımı nasıl silebilirim?",
      a: "Hesap silme işlemi için Ayarlar > Güvenlik > Hesabı Sil seçeneğini kullanabilirsiniz. Hesap silme işlemi 30 gün içinde tamamlanır.",
    },
    {
      q: "Şifremi unuttum, ne yapmalıyım?",
      a: "Giriş sayfasında \"Şifremi Unuttum\" bağlantısını tıklayın. E-posta adresinize gelen linki takip ederek yeni şifre belirleyebilirsiniz.",
    },
    {
      q: "Sorunlu bir gönderiyi nasıl bildiririm?",
      a: "Gönderi altındaki \"⋮\" menüsünü açıp \"İhbar Et\" seçeneğini tıklayın. Sorunun türünü ve detaylı açıklamasını belirtin.",
    },
    {
      q: "Mahallem mobil uygulaması ne zaman çıkacak?",
      a: "Mobil uygulamalar (iOS ve Android) 2026 Q2 içinde yayınlanacak. Bildirim almak için bize abone olabilirsiniz.",
    },
    {
      q: "Mahalle doğrulaması neden gerekli?",
      a: "Mahalle doğrulaması, platformun güvenliğini sağlamak ve gerçek mahalle sakinlerine hizmet sunmak için gereklidir. Bu, dolandırıcılık ve spam önlemeye yardımcı olur.",
    },
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "E-posta",
      value: "destek@mahallem.com",
      description: "Genel sorular ve destek için",
    },
    {
      icon: Mail,
      title: "KVKK Soruları",
      value: "kvkk@mahallem.com",
      description: "Veri koruması ile ilgili başvurular",
    },
    {
      icon: MapPin,
      title: "Adres",
      value: "İstanbul, Türkiye",
      description: "Trendex Lojistik A.Ş.",
    },
    {
      icon: Phone,
      title: "Telefon",
      value: "+90 (212) 555-1234",
      description: "Pazartesi-Cuma, 09:00-18:00",
    },
  ];

  const socialLinks = [
    { icon: Instagram, name: "Instagram", url: "https://instagram.com/mahallem", color: "hover:text-pink-600" },
    { icon: Twitter, name: "Twitter", url: "https://twitter.com/mahallem", color: "hover:text-blue-400" },
    { icon: Linkedin, name: "LinkedIn", url: "https://linkedin.com/company/mahallem", color: "hover:text-blue-700" },
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
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#00833e] via-[#00833e] to-[#006b32] p-12 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-3">Bize Ulaşın</h1>
              <p className="text-lg text-green-100">Sorularınız, önerileriniz ve şikayetleriniz için biz buradayız. Hızlı yanıt verilir.</p>
            </div>
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
                <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg text-center">
                  <div className="flex justify-center mb-4">
                    <CheckCircle className="w-16 h-16 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Mesajınız başarıyla gönderildi!</h3>
                  <p className="text-green-700">
                    Biz tarafından en kısa sürede incelenecek ve yanıtlanacaktır. Teşekkürler!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          errors.ad
                            ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50"
                            : "border-[#e0e0e0] focus:border-[#00833e] focus:ring-[#00833e]/20"
                        }`}
                        placeholder="Adınız ve soyadınız"
                      />
                      {errors.ad && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.ad}
                        </p>
                      )}
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
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          errors.email
                            ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50"
                            : "border-[#e0e0e0] focus:border-[#00833e] focus:ring-[#00833e]/20"
                        }`}
                        placeholder="ornek@email.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.email}
                        </p>
                      )}
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
                      className="w-full px-4 py-2.5 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e]/20 transition-colors bg-white"
                    >
                      <option value="Genel">Genel Sorular</option>
                      <option value="Teknik Destek">Teknik Destek</option>
                      <option value="İş Birliği">İş Birliği</option>
                      <option value="Basın">Basın</option>
                      <option value="Şikayet">Şikayet</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="mesaj" className="block text-sm font-semibold text-[#333] mb-2">
                      Mesaj * <span className="text-xs text-[#8f8f8f]">(En az 10 karakter)</span>
                    </label>
                    <textarea
                      id="mesaj"
                      name="mesaj"
                      value={formData.mesaj}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none ${
                        errors.mesaj
                          ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50"
                          : "border-[#e0e0e0] focus:border-[#00833e] focus:ring-[#00833e]/20"
                      }`}
                      placeholder="Lütfen detaylı bir şekilde açıklayınız..."
                    ></textarea>
                    {errors.mesaj && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.mesaj}
                      </p>
                    )}
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full px-6 py-3 bg-[#00833e] text-white font-bold rounded-lg hover:bg-[#006b32] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      <Send size={18} />
                      {isLoading ? "Gönderiliyor..." : "Mesajı Gönder"}
                    </button>
                  </div>

                  <p className="text-xs text-[#8f8f8f] text-center">
                    * Zorunlu alanları doldurunuz. İşlenmiş verileriniz KVKK'ya uygun olarak güvence altında tutulacaktır.
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

            {/* Office Hours & Response Time */}
            <section className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
              <h3 className="font-bold text-[#333] mb-4 flex items-center gap-2">
                <Clock size={20} className="text-[#00833e]" />
                Çalışma Saatleri ve Yanıt Süresi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-[#333] mb-1">Çalışma Saatleri</p>
                  <p className="text-[#404040]">Pazartesi - Cuma: 09:00 - 18:00</p>
                  <p className="text-[#8f8f8f]">Cumartesi ve Pazar: Kapalı</p>
                </div>
                <div>
                  <p className="font-semibold text-[#333] mb-1">Yanıt Süresi</p>
                  <p className="text-[#404040]">İş saatleri içinde: 24 saat içinde</p>
                  <p className="text-[#8f8f8f]">Weekend: Pazartesi günü yanıtlanır</p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="border-t border-[#e0e0e0] bg-[#f0f2f5] py-6 px-8 text-center">
            <p className="text-sm text-[#8f8f8f] mb-4">
              © 2026 Mahallem — Trendex Lojistik tarafından geliştirilmiştir.
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
