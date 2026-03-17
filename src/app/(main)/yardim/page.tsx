'use client';

import { Search, ChevronDown, MessageCircle, FileText, Shield, Users, Settings, HelpCircle, Lightbulb, AlertCircle, Lock, Home, Book } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const categories = [
  { icon: Users, title: "Hesap ve Profil", slug: "hesap-profil", count: 12 },
  { icon: FileText, title: "Gönderi ve İçerik", slug: "gonderi-icerik", count: 10 },
  { icon: Home, title: "Pazar Yeri", slug: "pazar-yeri", count: 8 },
  { icon: Lock, title: "Güvenlik ve Gizlilik", slug: "guvenlik-gizlilik", count: 8 },
  { icon: AlertCircle, title: "Teknik Sorunlar", slug: "teknik-sorunlar", count: 7 },
  { icon: Book, title: "Topluluk Kuralları", slug: "topluluk-kurallari", count: 6 },
];

const popularArticles = [
  { title: "Profilimi Nasıl Düzenlerim?", category: "Hesap ve Profil", views: 2400 },
  { title: "Mahallemi Nasıl Değiştiririm?", category: "Hesap ve Profil", views: 1800 },
  { title: "İki Faktörlü Kimlik Doğrulama Nasıl Etkinleştirilir?", category: "Güvenlik ve Gizlilik", views: 1600 },
  { title: "Gönderi Nasıl Yayınlanır?", category: "Gönderi ve İçerik", views: 1400 },
  { title: "Uygunsuz İçeriği Nasıl Bildiririm?", category: "Güvenlik ve Gizlilik", views: 1200 },
  { title: "Pazar Yerinde Satış Nasıl Yapılır?", category: "Pazar Yeri", views: 1100 },
];

const faqs = {
  'Hesap ve Profil': [
    { q: 'Profilimi nasıl düzenlerim?', a: 'Ayarlar sayfasından "Profil Düzenle" seçeneğini kullanarak ad, fotoğraf, biyografi ve diğer bilgilerinizi güncelleyebilirsiniz.' },
    { q: 'Mahallemi nasıl değiştiririm?', a: 'Ayarlar > Mahallem bölümünden yeni adres bilgisi girerek mahallenizi güncelleyebilirsiniz. Adres doğrulaması gerekecektir.' },
    { q: 'Şifremi nasıl değiştirim?', a: 'Ayarlar > Güvenlik > Şifre Değiştir seçeneğini kullanarak eski şifrenizi girerek yeni şifreni ayarlayabilirsiniz.' },
    { q: 'Profilm gizli olabilir mi?', a: 'Evet, Ayarlar > Gizlilik ayarlarından profilinizi sadece komşularınıza görünür kılabilirsiniz.' },
  ],
  'Güvenlik ve Gizlilik': [
    { q: 'Verilerim güvenli mi?', a: 'Evet, tüm verileriniz 256-bit şifreleme ile korunmaktadır. Kişisel bilgileriniz asla üçüncü taraflarla paylaşılmaz.' },
    { q: 'Birini nasıl engellerim?', a: 'Kişinin profilini açarak "Engelle" düğmesine tıklayabilirsiniz. Engellenen kişi sizin içeriklerinizi göremez ve sizinle iletişime geçemez.' },
    { q: 'Hesabımı güvensiz hissediyorum, ne yapmalıyım?', a: 'Derhal şifrenizi değiştirin ve aktif oturumları kontrol edin. Şüpheli bir aktivite varsa destek ekibine bildirin.' },
    { q: 'İki faktörlü kimlik doğrulama var mı?', a: 'Evet, Ayarlar > Güvenlik > İki Faktörlü Kimlik Doğrulama seçeneğinden SMS veya authenticator uygulaması ile 2FA etkinleştirebilirsiniz.' },
    { q: 'Cihazımı kaybettim, hesabım güvenli mi?', a: 'Derhal başka bir cihazdan şifrenizi değiştirin. "Tüm cihazlarda çıkış yap" seçeneğini kullanarak aktif oturumları sonlandırabilirsiniz.' },
  ],
  'Gönderi ve İçerik': [
    { q: 'Gönderiyi nasıl silerim?', a: 'Yayınladığınız gönderi üzerine tıklayıp "Sil" seçeneğini seçebilirsiniz. Silinen gönderi kalıcı olarak kaldırılır.' },
    { q: 'Gönderiyi düzenleyebilir miyim?', a: 'Evet, gönderiyi açıp "Düzenle" seçeneğinden metnini ve fotoğraflarını değiştirebilirsiniz.' },
    { q: 'Uygunsuz içeriği nasıl bildiririm?', a: 'Gönderi veya profil üzerine tıklayıp "Raporla" seçeneğini kullanabilirsiniz. Ekibimiz raporu inceleyip gerekli işlemi alacaktır.' },
    { q: 'Yorum yapabilir miyim?', a: 'Evet, kimin yorum yapabileceğini Ayarlar > Gizlilik bölümünden kontrol edebilirsiniz.' },
  ],
  'Mesajlaşma': [
    { q: 'Mesaj gönderdim ama cevap almıyorum?', a: 'Alıcının bildirimleri kapalı olabilir. Sabrınız için bekleyin, genellikle 24 saatte yanıt alırsınız.' },
    { q: 'Sohbeti arşivleyebilir miyim?', a: 'Evet, sohbet listesinde konuşmaya sağ tıklayıp "Arşive Al" seçeneğini seçebilirsiniz.' },
    { q: 'Medya dosyasını nasıl gönderim?', a: 'Sohbet penceresinde "+" ikonuna tıklayıp fotoğraf veya video seçebilirsiniz.' },
    { q: 'Mesajı silebilir miyim?', a: 'Evet, mesaja uzun basarak veya tıklayarak "Sil" seçeneğini kullanabilirsiniz. Sadece sizin tarafınızdan silinir.' },
  ],
  'Bildirim Ayarları': [
    { q: 'Bildirimleri nasıl kapatırım?', a: 'Ayarlar > Bildirimler bölümünden istediğiniz bildirim türünü devre dışı bırakabilirsiniz.' },
    { q: 'Yalnızca önemli bildirimleri almak istiyorum?', a: 'Ayarlar > Bildirimler > Önemli Yalnızca seçeneğini açabilirsiniz.' },
    { q: 'E-posta bildirimleri almıyor musunuz?', a: 'Spam klasörünü kontrol edin veya Ayarlar > E-posta Bildirimleri seçeneğini yeniden etkinleştirin.' },
    { q: 'Sessiz saatleri ayarlayabilir miyim?', a: 'Evet, Ayarlar > Sessiz Saatler seçeneğinden bildirim almak istemediğiniz saatler belirleyebilirsiniz.' },
    { q: 'Push bildirimlerini kapatabilir miyim?', a: 'Telefonunuzun ayarlarından veya Mahallem ayarlarından Push bildirimlerini devre dışı bırakabilirsiniz.' },
  ],
  'Genel Sorular': [
    { q: 'Mahallem ne için kullanılır?', a: 'Mahallem, mahallenizdeki insanlarla bağlantı kurmanız, haberleri paylaşmanız, etkinlikler organize etmeniz ve yardımlaşmanız için tasarlanmıştır.' },
    { q: 'Mahallem ücretsiz mi?', a: 'Evet, temel özellikler tamamen ücretsizdir. İlerde bazı premium özellikler sunulabilir.' },
    { q: 'Başka mahallede arkadaşım var, bağlantı kurabilir miyiz?', a: 'Mahallem, yerel topluluklar oluşturmak için tasarlandığından, sadece kendi mahallenizle etkileşime girebilirsiniz.' },
    { q: 'Hesabımı nasıl silerim?', a: 'Ayarlar > Hesap > Hesabı Sil seçeneğini seçerek hesabınızı kalıcı olarak silebilirsiniz.' },
    { q: 'Mahallem hangi dillerde mevcut?', a: 'Şu anda Türkçe ve İngilizce dillerinde mevcuttur. Daha fazla dil desteği yakında eklenecektir.' },
    { q: 'Hata buldum, nasıl bildiririm?', a: 'Ayarlar > Hata Bildir seçeneğini kullanarak veya destek ekibine mesaj göndererek hatayı bildirebilirsiniz.' },
  ],
};

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const filteredFaqs = expandedCategory ? faqs[expandedCategory as keyof typeof faqs] || [] : [];
  const searchResults = searchQuery.length > 2
    ? Object.entries(faqs).flatMap(([cat, items]) =>
        items.filter(item =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(item => ({ ...item, category: cat }))
      )
    : [];

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#00833e] to-[#006b32] text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/3 rounded-full"></div>

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <HelpCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-3">Yardım Merkezi</h1>
          <p className="text-green-100 mb-10 text-lg max-w-2xl mx-auto">Soruların cevapını bul, mahallenizle iletişim kur ve her zaman yardım al</p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mb-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Sorunuzu arayın..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white text-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Search Results */}
        {searchQuery.length > 2 && searchResults.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#333] mb-6 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-[#00833e]" />
              Arama Sonuçları ({searchResults.length})
            </h2>
            <div className="space-y-3">
              {searchResults.map((result, i) => (
                <div key={i} className="bg-white border border-[#e0e0e0] rounded-lg p-5 hover:shadow-md transition-shadow">
                  <p className="text-xs text-[#00833e] font-semibold mb-2 uppercase">{result.category}</p>
                  <h3 className="font-bold text-[#333] mb-2">{result.q}</h3>
                  <p className="text-sm text-[#8f8f8f] line-clamp-2">{result.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchQuery.length <= 2 && (
          <>
            {/* Category Cards */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#333] mb-6">Yardım Kategorileri</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.slug}
                      href={`/yardim/kategori/${cat.slug}`}
                      className="group bg-white border-2 border-[#e0e0e0] rounded-lg p-5 hover:border-[#00833e] hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Icon className="w-8 h-8 text-[#00833e] mb-3 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold text-center text-[#333] leading-tight mb-2">{cat.title}</span>
                        <span className="text-xs text-[#8f8f8f]">{cat.count} makale</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Popular Articles Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#333] mb-6">Sık Aranan Makaleler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularArticles.map((article, idx) => (
                  <div key={idx} className="bg-white border border-[#e0e0e0] rounded-lg p-5 hover:shadow-md transition-shadow">
                    <p className="text-xs text-[#00833e] font-semibold mb-2 uppercase">{article.category}</p>
                    <h3 className="font-bold text-[#333] mb-3 line-clamp-2">{article.title}</h3>
                    <p className="text-xs text-[#8f8f8f]">👁 {article.views.toLocaleString("tr-TR")} kişi bunu okudu</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-4 mb-12">
              <div className="bg-white border border-[#e0e0e0] rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-[#00833e] mb-2">5,000+</div>
                <p className="text-sm text-[#8f8f8f]">Çözülen Sorun</p>
              </div>
              <div className="bg-white border border-[#e0e0e0] rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-[#00833e] mb-2">7/24</div>
                <p className="text-sm text-[#8f8f8f]">Destek Hizmeti</p>
              </div>
              <div className="bg-white border border-[#e0e0e0] rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-[#00833e] mb-2">2 dk</div>
                <p className="text-sm text-[#8f8f8f]">Ortalama Yanıt</p>
              </div>
            </div>
          </>
        )}

        {/* No Results */}
        {searchQuery.length > 2 && searchResults.length === 0 && (
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-[#8f8f8f] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#333] mb-2">Sonuç bulunamadı</h3>
            <p className="text-[#8f8f8f] mb-8">"{searchQuery}" için bir sonuç bulamadık.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-6 py-3 bg-[#00833e] text-white rounded-lg font-medium hover:bg-[#006b32] transition-colors"
            >
              Aramayı Temizle
            </button>
          </div>
        )}

        {/* Contact Support Section */}
        {!searchQuery && (
          <div className="bg-gradient-to-br from-[#00833e] to-[#006b32] border-0 rounded-lg p-8 md:p-12 text-center text-white">
            <MessageCircle className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">Hâlâ Yardıma İhtiyacınız Var mı?</h3>
            <p className="text-green-100 mb-8 max-w-lg mx-auto">Sorunuzu bulamadıysanız, destek ekibimiz size 2 dakika içinde yanıt vermeye hazırdır.</p>
            <Link
              href="/mesajlar"
              className="inline-block px-8 py-4 bg-white text-[#00833e] font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Destek ile İletişime Geç
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
