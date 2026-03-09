'use client';

import { Search, ChevronDown, MessageCircle, FileText, Shield, Users, Settings, HelpCircle, Lightbulb, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const categories = [
  { icon: Users, title: 'Hesap ve Profil', count: 12 },
  { icon: Shield, title: 'Güvenlik ve Gizlilik', count: 8 },
  { icon: MessageCircle, title: 'Mesajlaşma', count: 6 },
  { icon: FileText, title: 'Gönderi ve İçerik', count: 10 },
  { icon: Settings, title: 'Bildirim Ayarları', count: 5 },
  { icon: HelpCircle, title: 'Genel Sorular', count: 15 },
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
    { q: 'Push bildirimlerini kapatabilir miyim?', a: 'Telefonunuzun ayarlarından veya KomşuApp ayarlarından Push bildirimlerini devre dışı bırakabilirsiniz.' },
  ],
  'Genel Sorular': [
    { q: 'KomşuApp ne için kullanılır?', a: 'KomşuApp, mahallenizdeki insanlarla bağlantı kurmanız, haberleri paylaşmanız, etkinlikler organize etmeniz ve yardımlaşmanız için tasarlanmıştır.' },
    { q: 'KomşuApp ücretsiz mi?', a: 'Evet, temel özellikler tamamen ücretsizdir. İlerde bazı premium özellikler sunulabilir.' },
    { q: 'Başka mahallede arkadaşım var, bağlantı kurabilir miyiz?', a: 'KomşuApp, yerel topluluklar oluşturmak için tasarlandığından, sadece kendi mahallenizle etkileşime girebilirsiniz.' },
    { q: 'Hesabımı nasıl silerim?', a: 'Ayarlar > Hesap > Hesabı Sil seçeneğini seçerek hesabınızı kalıcı olarak silebilirsiniz.' },
    { q: 'KomşuApp hangi dillerde mevcut?', a: 'Şu anda Türkçe ve İngilizce dillerinde mevcuttur. Daha fazla dil desteği yakında eklenecektir.' },
    { q: 'Hata buldum, nasıl bildiririm?', a: 'Ayarlar > Hata Bildir seçeneğini kullanarak veya destek ekibine mesaj göndererek hatayı bildirebilirsiniz.' },
  ],
};

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Genel Sorular');

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
      {/* Header */}
      <div className="bg-gradient-to-br from-[#00833e] to-[#006b32] text-white py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <HelpCircle className="w-12 h-12 mx-auto mb-3" />
          <h1 className="text-4xl font-bold mb-2">Yardım Merkezi</h1>
          <p className="text-green-100 mb-8 text-lg">Size nasıl yardımcı olabiliriz?</p>

          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Sorunuzu arayın..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white text-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {searchQuery.length > 2 && searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#333] mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#00833e]" />
              Arama Sonuçları ({searchResults.length})
            </h2>
            <div className="space-y-3">
              {searchResults.map((result, i) => (
                <div key={i} className="bg-white border border-[#e0e0e0] rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <p className="text-xs text-[#00833e] font-semibold mb-1">{result.category}</p>
                  <h3 className="font-bold text-[#333] mb-2">{result.q}</h3>
                  <p className="text-sm text-[#8f8f8f] line-clamp-2">{result.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchQuery.length <= 2 && (
          <>
            {/* Categories */}
            <h2 className="text-xl font-bold text-[#333] mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#00833e]" />
              Kategoriler
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.title}
                    onClick={() => setExpandedCategory(cat.title)}
                    className={cn(
                      'flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200',
                      expandedCategory === cat.title
                        ? 'bg-[#00833e] border-[#00833e] text-white'
                        : 'bg-white border-[#e0e0e0] text-[#333] hover:border-[#00833e]'
                    )}
                  >
                    <Icon className={cn('w-6 h-6 mb-2', expandedCategory === cat.title ? 'text-white' : 'text-[#00833e]')} />
                    <span className="text-xs font-bold text-center leading-tight">{cat.title}</span>
                    <span className={cn('text-xs mt-1', expandedCategory === cat.title ? 'text-green-100' : 'text-[#8f8f8f]')}>{cat.count} soru</span>
                  </button>
                );
              })}
            </div>

            {/* FAQ Accordion */}
            <h2 className="text-xl font-bold text-[#333] mb-4">
              {expandedCategory ? `${expandedCategory} SSS` : 'Sık Sorulan Sorular'}
            </h2>
            <div className="space-y-3 mb-8">
              {filteredFaqs.map((faq, i) => (
                <details
                  key={i}
                  className="group bg-white border border-[#e0e0e0] rounded-lg overflow-hidden hover:border-[#00833e] transition-all"
                >
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer select-none">
                    <h3 className="font-bold text-[#333] text-sm pr-4">{faq.q}</h3>
                    <ChevronDown className="w-5 h-5 text-[#8f8f8f] group-open:rotate-180 transition-transform flex-shrink-0" />
                  </summary>
                  <div className="px-5 pb-4 text-sm text-[#404040] border-t border-[#e0e0e0] bg-[#f0f2f5]">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </>
        )}

        {searchQuery.length > 2 && searchResults.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-[#8f8f8f] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#333] mb-2">Sonuç bulunamadı</h3>
            <p className="text-[#8f8f8f] mb-6">"<span className="font-semibold">{searchQuery}</span>" için bir sonuç bulamadık.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-[#00833e] text-white rounded-lg font-medium hover:bg-[#006b32] transition-colors"
            >
              Aramayı Temizle
            </button>
          </div>
        )}

        {/* Contact Section */}
        {!searchQuery && (
          <div className="mt-12 p-6 bg-gradient-to-br from-[#00833e]/10 to-[#006b32]/10 border border-[#00833e]/20 rounded-lg text-center">
            <MessageCircle className="w-10 h-10 text-[#00833e] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#333] mb-2">Hâlâ yardıma mı ihtiyacınız var?</h3>
            <p className="text-sm text-[#8f8f8f] mb-6">Sorunuzu bulamadıysanız destek ekibimize doğrudan ulaşabilirsiniz.</p>
            <Link
              href="/mesajlar"
              className="inline-block px-6 py-3 bg-[#00833e] hover:bg-[#006b32] text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              Destek ile İletişime Geç
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
