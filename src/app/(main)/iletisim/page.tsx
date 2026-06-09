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
      q: "Mahallemiz mobil uygulaması ne zaman çıkacak?",
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
      description: "Consulting Partners Yönetim Danışmanlığı A.Ş.",
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
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary via-[#00833e] to-primary-hover p-12 text-white">
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
              <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
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
                      className="p-6 bg-background border border-border rounded-lg hover:border-primary hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-surface rounded-lg border border-border group-hover:border-primary transition-colors">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-bold text-text-primary mb-1">{method.title}</h3>
                          <p className="text-primary font-semibold text-sm mb-1">{method.value}</p>
                          <p className="text-xs text-text-muted">{method.description}</p>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>

            {/* Contact Form */}
            <section className="border-t border-border pt-12">
              <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
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
                      <label htmlFor="ad" className="block text-sm font-semibold text-text-primary mb-2">
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
                            : "border-border focus:border-primary focus:ring-primary/20"
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
                      <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-2">
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
                            : "border-border focus:border-primary focus:ring-primary/20"
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
                    <label htmlFor="konu" className="block text-sm font-semibold text-text-primary mb-2">
                      Konu *
                    </label>
                    <select
                      id="konu"
                      name="konu"
                      value={formData.konu}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors bg-surface"
                    >
                      <option value="Genel">Genel Sorular</option>
                      <option value="Teknik Destek">Teknik Destek</option>
                      <option value="İş Birliği">İş Birliği</option>
                      <option value="Basın">Basın</option>
                      <option value="Şikayet">Şikayet</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="mesaj" className="block text-sm font-semibold text-text-primary mb-2">
                      Mesaj * <span className="text-xs text-text-muted">(En az 10 karakter)</span>
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
                          : "border-border focus:border-primary focus:ring-primary/20"
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
                      className="w-full px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      <Send size={18} />
                      {isLoading ? "Gönderiliyor..." : "Mesajı Gönder"}
                    </button>
                  </div>

                  <p className="text-xs text-text-muted text-center">
                    * Zorunlu alanları doldurunuz. İşlenmiş verileriniz KVKK&apos;ya uygun olarak güvence altında tutulacaktır.
                  </p>
                </form>
              )}
            </section>

            {/* Social Media */}
            <section className="border-t border-border pt-12">
              <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
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
                      className={`p-4 bg-background border border-border rounded-lg hover:bg-surface hover:shadow-md transition-all ${social.color}`}
                      title={social.name}
                    >
                      <Icon size={24} />
                    </a>
                  );
                })}
              </div>
            </section>

            {/* FAQ */}
            <section className="border-t border-border pt-12">
              <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full"></span>
                Sıkça Sorulan Sorular
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <details
                    key={idx}
                    className="group border border-border rounded-lg overflow-hidden hover:border-primary transition-colors"
                  >
                    <summary className="p-4 cursor-pointer bg-background hover:bg-surface font-semibold text-text-primary flex items-center justify-between">
                      <span>{faq.q}</span>
                      <span className="text-primary group-open:rotate-180 transition-transform text-lg">
                        ▼
                      </span>
                    </summary>
                    <div className="p-4 bg-surface text-text-secondary text-sm leading-relaxed border-t border-border">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>

            {/* Office Hours & Response Time */}
            <section className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
              <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                <Clock size={20} className="text-primary" />
                Çalışma Saatleri ve Yanıt Süresi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-text-primary mb-1">Çalışma Saatleri</p>
                  <p className="text-text-secondary">Pazartesi - Cuma: 09:00 - 18:00</p>
                  <p className="text-text-muted">Cumartesi ve Pazar: Kapalı</p>
                </div>
                <div>
                  <p className="font-semibold text-text-primary mb-1">Yanıt Süresi</p>
                  <p className="text-text-secondary">İş saatleri içinde: 24 saat içinde</p>
                  <p className="text-text-muted">Weekend: Pazartesi günü yanıtlanır</p>
                </div>
              </div>
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
                href="/kvkk"
                className="text-sm text-primary hover:text-primary-hover font-medium transition-colors"
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
