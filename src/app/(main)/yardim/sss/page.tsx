'use client';

import { Search, ChevronDown, ThumbsUp, ThumbsDown, HelpCircle, Lightbulb, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FAQ {
  q: string;
  a: string;
  category: string;
}

const faqData: FAQ[] = [
  // Hesap ve Profil (4 questions)
  {
    category: 'Hesap ve Profil',
    q: 'Profilimi nasıl düzenlerim?',
    a: 'Ayarlar sayfasından "Profil Düzenle" seçeneğini kullanarak ad, fotoğraf, biyografi ve diğer bilgilerinizi güncelleyebilirsiniz. Profil fotoğrafını değiştirmek için mevcut fotoğrafa tıklayıp yeni bir görüntü yükleyebilirsiniz.'
  },
  {
    category: 'Hesap ve Profil',
    q: 'Mahallemi nasıl değiştiririm?',
    a: 'Ayarlar > Mahallem bölümünden yeni adres bilgisi girerek mahallenizi güncelleyebilirsiniz. Adres doğrulaması gerekecektir ve başarıyla onaylandıktan sonra değişiklik uygulanacaktır.'
  },
  {
    category: 'Hesap ve Profil',
    q: 'Şifremi nasıl değiştirim?',
    a: 'Ayarlar > Güvenlik > Şifre Değiştir seçeneğini kullanarak eski şifrenizi girerek yeni şifrenizi ayarlayabilirsiniz. Yeni şifreniz en az 8 karakter ve bir büyük harf içermelidir.'
  },
  {
    category: 'Hesap ve Profil',
    q: 'Profilm gizli olabilir mi?',
    a: 'Evet, Ayarlar > Gizlilik ayarlarından profilinizi sadece komşularınıza görünür kılabilirsiniz. Ayrıca spesifik kişileri profilinizi görmekten engelleyebilirsiniz.'
  },

  // Gönderi ve İçerik (3 questions)
  {
    category: 'Gönderi ve İçerik',
    q: 'Gönderiyi nasıl silerim?',
    a: 'Yayınladığınız gönderi üzerine tıklayıp "Sil" seçeneğini seçebilirsiniz. Silinen gönderi kalıcı olarak kaldırılır ve hiç kimse tarafından görülemez.'
  },
  {
    category: 'Gönderi ve İçerik',
    q: 'Gönderiyi düzenleyebilir miyim?',
    a: 'Evet, gönderiyi açıp "Düzenle" seçeneğinden metnini ve fotoğraflarını değiştirebilirsiniz. Düzenleme geçmişi korunur ve diğer kullanıcılar gönderin düzenlendiğini görebilir.'
  },
  {
    category: 'Gönderi ve İçerik',
    q: 'Uygunsuz içeriği nasıl bildiririm?',
    a: 'Gönderi veya profil üzerine tıklayıp "Raporla" seçeneğini kullanabilirsiniz. İçeriğin uygunsuz olma sebebini belirtin ve ekibimiz raporu inceleyip gerekli işlemi alacaktır.'
  },

  // Pazar Yeri (3 questions)
  {
    category: 'Pazar Yeri',
    q: 'Ürün nasıl satarım?',
    a: 'Pazar Yeri bölümünde "Yeni Ürün Ekle" seçeneğini kullanabilirsiniz. Ürünün fotoğraflarını, açıklamasını, fiyatını belirterek listeleme oluşturabilirsiniz.'
  },
  {
    category: 'Pazar Yeri',
    q: 'Satış fiyatını nasıl değiştirebilirim?',
    a: 'Ürün listelemenize giderek "Düzenle" seçeneğini kullanarak fiyatı güncelleyebilirsiniz. Fiyat değişiklikleri hemen canlı hale gelir.'
  },
  {
    category: 'Pazar Yeri',
    q: 'Ürünü nasıl kaldırırım?',
    a: 'Ürün sayfanıza giderek satış için listeledikten sonra "Kaldır" seçeneğini kullanabilirsiniz. Kaldırılan ürün başka kimse tarafından görülemez ancak tarihçe kaydedilir.'
  },

  // Güvenlik ve Gizlilik (3 questions)
  {
    category: 'Güvenlik ve Gizlilik',
    q: 'Verilerim güvenli mi?',
    a: 'Evet, tüm verileriniz 256-bit şifreleme ile korunmaktadır. Kişisel bilgileriniz asla üçüncü taraflarla paylaşılmaz ve yalnızca hizmet sağlama amacıyla kullanılır.'
  },
  {
    category: 'Güvenlik ve Gizlilik',
    q: 'Birini nasıl engellerim?',
    a: 'Kişinin profilini açarak "Engelle" düğmesine tıklayabilirsiniz. Engellenen kişi sizin içeriklerinizi göremez, size mesaj gönderemez ve sizi takip edemez.'
  },
  {
    category: 'Güvenlik ve Gizlilik',
    q: 'İki faktörlü kimlik doğrulama var mı?',
    a: 'Evet, Ayarlar > Güvenlik > İki Faktörlü Kimlik Doğrulama seçeneğinden SMS veya authenticator uygulaması ile 2FA etkinleştirebilirsiniz.'
  },

  // Teknik Sorunlar (3 questions)
  {
    category: 'Teknik Sorunlar',
    q: 'Uygulama çöküyor, ne yapmalıyım?',
    a: 'Uygulamayı kapatıp yeniden açmayı deneyin. Sorun devam ederse cihazınızı yeniden başlatın. Halen sorun varsa uygulama mağazasından en son sürümü indirdiğinizden emin olun.'
  },
  {
    category: 'Teknik Sorunlar',
    q: 'Bildirimler neden gelmiyorum?',
    a: 'Ayarlar > Bildirimler bölümünde bildirimlerin etkinleştirildiğini kontrol edin. Ayrıca cihazınızın ayarlarından Mahallem için bildirimleri etkinleştirmeniz gerekebilir.'
  },
  {
    category: 'Teknik Sorunlar',
    q: 'Sayfalar yüklenmiyor?',
    a: 'İnternet bağlantınızı kontrol edin. WiFi veya mobil veri kullanmayı değiştirmeyi deneyin. Sorun devam ederse uygulamayı kapatıp yeniden açın.'
  },
];

const categories = [...new Set(faqData.map(faq => faq.category))];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<{ [key: number]: boolean | null }>({});

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = searchQuery.length === 0 ||
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === null || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleFeedback = (index: number, helpful: boolean) => {
    setFeedbacks(prev => ({
      ...prev,
      [index]: feedbacks[index] === helpful ? null : helpful
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-hover text-white py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <HelpCircle className="w-12 h-12 mx-auto mb-3" />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Sıkça Sorulan Sorular</h1>
          <p className="text-green-100 mb-8 text-lg">En çok sorulan soruların cevaplarını bulun</p>

          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="SSS'de arayın..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
          <Link href="/yardim" className="hover:text-primary transition-colors">
            Yardım Merkezi
          </Link>
          <span>/</span>
          <span className="text-primary font-medium">Sıkça Sorulan Sorular</span>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-text-primary mb-3">Kategorilere göre filtrele:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                selectedCategory === null
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-text-primary hover:border-primary'
              )}
            >
              Tümü ({faqData.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  selectedCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-surface border border-border text-text-primary hover:border-primary'
                )}
              >
                {cat} ({faqData.filter(f => f.category === cat).length})
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {searchQuery && (
          <p className="text-sm text-text-muted mb-4">
            <span className="font-semibold text-primary">{filteredFAQs.length}</span> sonuç bulundu
          </p>
        )}

        {/* FAQ List */}
        <div className="space-y-3 mb-8">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, idx) => {
              const globalIdx = faqData.indexOf(faq);
              const isExpanded = expandedItems.includes(globalIdx);

              return (
                <div
                  key={globalIdx}
                  className="bg-surface border border-border rounded-lg overflow-hidden hover:border-primary transition-all"
                >
                  <button
                    onClick={() => toggleExpanded(globalIdx)}
                    className="w-full flex items-center justify-between px-5 py-4 cursor-pointer select-none hover:bg-background transition-colors"
                  >
                    <div className="flex-1 text-left">
                      <p className="text-xs text-primary font-semibold mb-1">{faq.category}</p>
                      <h3 className="font-bold text-text-primary text-sm">{faq.q}</h3>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 text-text-muted flex-shrink-0 ml-3 transition-transform',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-4 border-t border-border bg-background">
                      <p className="text-sm text-text-secondary mb-4">{faq.a}</p>

                      {/* Feedback */}
                      <div className="flex items-center gap-3 pt-3 border-t border-border">
                        <span className="text-xs text-text-muted">Bu yanıt faydalı oldu mu?</span>
                        <button
                          onClick={() => handleFeedback(globalIdx, true)}
                          className={cn(
                            'flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors',
                            feedbacks[globalIdx] === true
                              ? 'bg-green-100 text-primary'
                              : 'bg-gray-100 text-text-muted hover:bg-gray-200'
                          )}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          Evet
                        </button>
                        <button
                          onClick={() => handleFeedback(globalIdx, false)}
                          className={cn(
                            'flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors',
                            feedbacks[globalIdx] === false
                              ? 'bg-red-100 text-red-600'
                              : 'bg-gray-100 text-text-muted hover:bg-gray-200'
                          )}
                        >
                          <ThumbsDown className="w-4 h-4" />
                          Hayır
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-surface rounded-lg border border-border">
              <AlertCircle className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <h3 className="text-lg font-bold text-text-primary mb-2">Sonuç bulunamadı</h3>
              <p className="text-text-muted mb-6">
                {searchQuery
                  ? `"${searchQuery}" için bir sonuç bulamadık.`
                  : 'Bu kategoride soru bulunamadı.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors"
                >
                  Aramayı Temizle
                </button>
              )}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-12 p-6 bg-gradient-to-br from-primary/10 to-primary-hover/10 border border-primary/20 rounded-lg text-center">
          <Lightbulb className="w-10 h-10 text-primary mx-auto mb-3" />
          <h3 className="text-lg font-bold text-text-primary mb-2">Sorunuzu bulamadınız mı?</h3>
          <p className="text-sm text-text-muted mb-4">Diğer yardım kategorilerimizi keşfedin veya destek ekibimize ulaşın.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/yardim"
              className="px-6 py-2 bg-surface border border-primary text-primary font-medium rounded-lg hover:bg-background transition-colors"
            >
              Yardım Merkezi'ne Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
