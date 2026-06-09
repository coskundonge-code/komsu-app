"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle, Users, MapPin, MessageCircle, ShoppingBag, Calendar, Bell, Lock } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      title: "Kayıt Ol",
      icon: Users,
      description: "Mahallemiz'e katılmak için hızlı ve kolay bir kayıt işlemi. Sadece e-posta ve şifreniz yeterli.",
      details: [
        "E-posta adresiniz ve güçlü bir şifre seçin",
        "Koşulları okuyup kabul edin",
        "Doğrulama e-postasını kontrol edin",
      ],
    },
    {
      number: 2,
      title: "Mahalleni Bul",
      icon: MapPin,
      description: "Güvenliği sağlamak için mahalle adresinizi doğrulayın. Sadece gerçek mahalle sakinleri erişebilir.",
      details: [
        "Şehir, ilçe ve mahalleni gir",
        "Doğrulama kodu almak için adres bilgilerini gir",
        "Gelen SMS veya e-postadaki kodu gir",
      ],
    },
    {
      number: 3,
      title: "Komşularınla Bağlan",
      icon: MessageCircle,
      description: "Profilini oluştur ve mahalledeki diğer sakinlerle tanışmaya başla. Güvenli bir ortamda iletişim kur.",
      details: [
        "Profil fotoğrafınızı ekleyin ve biyografi yazın",
        "İlgi alanlarınızı ve uzmanlıklarınızı belirtin",
        "Mahalle üyelerini keşfet ve bağlantı kurun",
      ],
    },
    {
      number: 4,
      title: "Mahalleni Keşfet",
      icon: ShoppingBag,
      description: "Mahallenizle bilgi, tavsiye ve yardım paylaşın. Etkinlikler, işletmeler, pazar yeri ve daha fazlasını kullanın.",
      details: [
        "Gönderiler paylaşın ve tartışmalara katılın",
        "Mahalle etkinliklerini keşfet ve oluştur",
        "Pazar yerinde ürün satıp alın",
        "Gruplar oluştur veya mevcut gruplara katıl",
      ],
    },
  ];

  const features = [
    { icon: MessageCircle, title: "Sosyal Ağ", description: "Mahalledeki insanlarla bağlantı kur, tartışmalara katıl ve deneyimlerini paylaş" },
    { icon: Calendar, title: "Etkinlikler", description: "Mahalle etkinliklerini keşfet, oluştur ve diğer sakinlerle eğlen" },
    { icon: MapPin, title: "Yerel İşletmeler", description: "Mahallendeki işletmeleri keşfet, inceleme yaz ve önerilerde bulun" },
    { icon: ShoppingBag, title: "Pazar Yeri", description: "Satın al ve satış yapmak için güvenli bir yerel pazar yeri" },
    { icon: Users, title: "Gruplar", description: "Ortak ilgi alanına sahip mahalle sakinleriyle grup oluştur" },
    { icon: Bell, title: "Bildirimler", description: "Mahallendeki önemli güncellemeleri ve etkinlikleri kaçırma" },
  ];

  const testimonials = [
    {
      name: "Ayşe Yılmaz",
      role: "Mahalle Sakinesi",
      quote: "Mahallemiz sayesinde komşularımı tanıdım ve çok yakın arkadaşlar yaptım. Mahalle çok daha güvenli hissettiriyor.",
    },
    {
      name: "Mehmet Kara",
      role: "Mahalle Sakinesi",
      quote: "Pazar yerinde eski bisikletimi sattım ve yangın anında mahalleli komşularımdan hemen yardım aldım.",
    },
    {
      name: "Zeynep Demir",
      role: "Mahalle Sakinesi",
      quote: "Mahalle etkinlikleri Mahallemiz'in en hoş tarafı. Herkes birbirini tanıyor ve yardımlaşıyor.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-hover font-medium mb-8 transition-colors">
          <ArrowLeft size={16} />
          Ana Sayfaya Dön
        </Link>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary to-primary-hover text-white rounded-lg p-12 md:p-16 text-center relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>

          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Mahallemiz Nasıl Çalışır?</h1>
            <p className="text-green-100 text-lg md:text-xl">4 basit adımda mahallenizle bağlantı kurun ve güçlü bir topluluk oluşturun</p>
          </div>
        </div>

        {/* Steps Section */}
        <div className="mb-12">
          <div className="space-y-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative">
                  {/* Connector Line */}
                  {idx < steps.length - 1 && (
                    <div className="absolute left-12 top-32 w-1 h-20 bg-gradient-to-b from-primary to-transparent hidden md:block"></div>
                  )}

                  {/* Step Card */}
                  <div className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center p-8 md:p-10">
                      {/* Step Icon */}
                      <div className="flex justify-center md:justify-start">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-hover text-white rounded-full flex items-center justify-center shadow-lg">
                          <Icon className="w-12 h-12" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="md:col-span-3">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-5xl font-bold text-primary opacity-30">0{step.number}</span>
                          <h2 className="text-2xl md:text-3xl font-bold text-text-primary">{step.title}</h2>
                        </div>
                        <p className="text-text-secondary leading-relaxed mb-4">{step.description}</p>

                        {/* Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {step.details.map((detail, didx) => (
                            <div key={didx} className="flex items-start gap-2 text-text-secondary text-sm">
                              <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-8 flex items-center gap-3">
            <span className="w-1 h-10 bg-primary rounded-full"></span>
            Mahallemiz&apos;in Özellikleri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const FeatureIcon = feature.icon;
              return (
                <div key={idx} className="bg-surface border border-border rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all duration-200">
                  <FeatureIcon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-lg font-bold text-text-primary mb-2">{feature.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-12 bg-gradient-to-br from-primary/5 to-primary-hover/5 border border-primary/20 rounded-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-text-primary mb-8 flex items-center gap-3">
            <span className="w-1 h-10 bg-primary rounded-full"></span>
            Kullanıcılar Ne Diyor?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-surface border border-border rounded-lg p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-primary">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-text-secondary italic mb-4">&quot;{testimonial.quote}&quot;</p>
                <div className="border-t border-border pt-4">
                  <p className="font-bold text-text-primary">{testimonial.name}</p>
                  <p className="text-sm text-text-muted">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Section */}
        <div className="mb-12 bg-surface border border-border rounded-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-text-primary mb-8 flex items-center gap-3">
            <Lock className="w-8 h-8 text-primary" />
            Güvenlik ve Gizlilik
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-text-primary mb-2 text-lg">Adres Doğrulaması</h3>
              <p className="text-sm text-text-muted leading-relaxed">Sadece gerçek mahalle sakinleri uygulamaya erişebilir. SMS ve adres doğrulaması ile güvenliği sağlarız.</p>
            </div>
            <div>
              <h3 className="font-bold text-text-primary mb-2 text-lg">Şifreli İletişim</h3>
              <p className="text-sm text-text-muted leading-relaxed">SSL/TLS şifreleme teknolojisi ile tüm iletişiminiz koruma altında tutulur.</p>
            </div>
            <div>
              <h3 className="font-bold text-text-primary mb-2 text-lg">Moderasyon</h3>
              <p className="text-sm text-text-muted leading-relaxed">24/7 moderasyon ekibi sorunlu içeriği kontrol eder ve topluluk kurallarını korur.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-8 flex items-center gap-3">
            <span className="w-1 h-10 bg-primary rounded-full"></span>
            Sıkça Sorulan Sorular
          </h2>

          <div className="space-y-4">
            {[
              { q: "Mahallemiz tamamen ücretsiz mi?", a: "Evet, Mahallemiz temel özellikler tamamen ücretsizdir. Bazı ek premium özellikleri ileride sunabiliriz, ancak sosyal ağ özellikleri her zaman ücretsiz kalacak." },
              { q: "Eğer taşırsam hesabımı taşıyabilir miyim?", a: "Evet. Yeni adresinizi doğruladığınızda hesabınız otomatik olarak yeni mahallele eşleştirilecektir. Eski mahalle verileriniz bu sebeple erişilemez hale gelir." },
              { q: "Mahalle dışındaki insanlarla iletişim kurabilirim?", a: "Hayır, Mahallemiz mahalle içi iletişime odaklanır. Alanın ve mahalle topluluğunun korunması için bilerek bu tasarımı seçtik." },
              { q: "Uygulamayı ne zaman başlayabilirim?", a: "Hemen! Aşağıdaki 'Hemen Başla' düğmesine tıklayarak kayıt olabilirsiniz. İşlem 5 dakikadan az sürer." },
            ].map((faq, idx) => (
              <details key={idx} className="group bg-surface border border-border rounded-lg overflow-hidden hover:border-primary transition-colors">
                <summary className="p-5 cursor-pointer font-semibold text-text-primary flex items-center justify-between hover:bg-background">
                  <span>{faq.q}</span>
                  <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-4 text-text-secondary text-sm leading-relaxed border-t border-border bg-background">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-primary to-primary-hover text-white rounded-lg p-8 md:p-12 text-center relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Mahallenin Parçası Olun</h2>
            <p className="text-green-100 mb-8 max-w-2xl mx-auto leading-relaxed">Mahallemiz ile mahallenizin yaşam kalitesini iyileştirin, yeni arkadaşlar edinin ve birlikte güçlü bir topluluk oluşturun.</p>
            <Link href="/kayit" className="inline-block px-8 py-4 bg-surface text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
              Hemen Başla
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-background py-8 px-8 rounded-lg text-center">
          <p className="text-sm text-text-muted mb-4">© 2026 Mahallemiz — Consulting Partners tarafından geliştirilmiştir.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/gizlilik" className="text-sm text-primary hover:text-primary-hover font-medium transition-colors">
              Gizlilik Politikası
            </Link>
            <span className="text-[#e0e0e0]">•</span>
            <Link href="/topluluk-kurallari" className="text-sm text-primary hover:text-primary-hover font-medium transition-colors">
              Topluluk Kuralları
            </Link>
            <span className="text-[#e0e0e0]">•</span>
            <Link href="/iletisim" className="text-sm text-primary hover:text-primary-hover font-medium transition-colors">
              İletişim
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
