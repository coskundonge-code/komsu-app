'use client';

import { ThumbsUp, ThumbsDown, ChevronRight, FileText, AlertCircle, Share2, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getFeedImageUrl } from '@/lib/demo-images';

interface ArticleStep {
  title: string;
  description: string;
  image?: string;
}

interface ArticleContent {
  category: string;
  categorySlug: string;
  title: string;
  excerpt: string;
  readTime: number;
  updatedAt: string;
  introduction: string;
  steps: ArticleStep[];
  relatedArticles: { slug: string; title: string }[];
}

const articlesData: { [key: string]: ArticleContent } = {
  'profil-nasil-duzenlerim': {
    category: 'Hesap ve Profil',
    categorySlug: 'hesap',
    title: 'Profilimi Nasıl Düzenlerim?',
    excerpt: 'Adınızı, fotoğrafınızı, biyografinizi ve diğer profil bilgilerinizi güncellemek için adım adım kılavuz.',
    readTime: 5,
    updatedAt: '2024-01-15',
    introduction: 'Mahallemiz\'ta profiliniz, topluluğunuzda kimliğinizdir. Profilinizi düzenlemek, başkalarının sizi tanıması ve bağlantı kurması için önemlidir. Bu rehber, profil bilgilerinizi adım adım güncellemeyi anlatır.',
    steps: [
      {
        title: 'Ayarlar Sayfasına Gidin',
        description: 'Ana sayfada sağ altta bulunan profil ikonu veya menu simgesine tıklayın. Açılan menüden "Ayarlar" seçeneğini seçin.',
        image: getFeedImageUrl(1, 600, 300)
      },
      {
        title: 'Profil Düzenle\'ye Tıklayın',
        description: 'Ayarlar sayfasında "Profil Düzenle" düğmesine tıklayarak profil düzenleme paneline girin.',
        image: getFeedImageUrl(2, 600, 300)
      },
      {
        title: 'Fotoğrafınızı Güncelleyin',
        description: 'Mevcut profil fotoğrafına tıklayarak yeni bir fotoğraf yükleyin. Fotoğraf en az 200x200 piksel olmalıdır.',
        image: getFeedImageUrl(3, 600, 300)
      },
      {
        title: 'Temel Bilgiler',
        description: 'Adınız, soyadınız ve cinsiyetiniz gibi temel bilgileri düzenleyin. Bu alanlar zorunludur.',
        image: getFeedImageUrl(4, 600, 300)
      },
      {
        title: 'Biyografi Ekleyin',
        description: 'Kendinizi tanıtmak için 150 karaktere kadar biyografi yazın. Hobi, ilgi alanı veya kısaca kendinizi anlatabilirsiniz.',
        image: getFeedImageUrl(5, 600, 300)
      },
      {
        title: 'Değişiklikleri Kaydedin',
        description: 'Tüm değişiklikleri yaptıktan sonra sayfanın altında bulunan "Kaydet" düğmesine tıklayın. Değişiklikler anında uygulanır.',
        image: getFeedImageUrl(6, 600, 300)
      }
    ],
    relatedArticles: [
      { slug: 'profil-gizliligi', title: 'Profil Gizliliği Ayarları' },
      { slug: 'mahallemi-degistirme', title: 'Mahallemi Nasıl Değiştirebilirim?' }
    ]
  },
  'gonderi-nasil-paylasim': {
    category: 'Gönderi ve İçerik',
    categorySlug: 'gonderiler',
    title: 'Gönderi Nasıl Paylaşırım?',
    excerpt: 'Yeni bir gönderi oluşturma, metin ve fotoğraf ekleme, yayınlama adımları.',
    readTime: 4,
    updatedAt: '2024-01-10',
    introduction: 'Gönderiler, Mahallemiz\'ta topluluğunuzla iletişim kurmanın ana yoludur. Etkinlik duyurusu yapın, deneyim paylaşın veya yardım isteyin. Bu kılavuz, mükemmel bir gönderi oluşturmayı öğretir.',
    steps: [
      {
        title: 'Yeni Gönderi Oluşturmaya Başlayın',
        description: 'Ana sayfa veya akış sayfasında "Yeni Gönderi" düğmesine tıklayın veya "+" simgesine basın.',
        image: getFeedImageUrl(7, 600, 300)
      },
      {
        title: 'Metin Yazın',
        description: 'Gönderi penceresine istediğiniz metni yazın. Etiketler, sorular ve düşüncelerinizi paylaşabilirsiniz.',
        image: getFeedImageUrl(8, 600, 300)
      },
      {
        title: 'Fotoğraf veya Video Ekleyin',
        description: 'İsteğe bağlı olarak, metninizi desteklemek için bir veya daha fazla fotoğraf ekleyin. "Fotoğraf Ekle" düğmesini kullanın.',
        image: getFeedImageUrl(9, 600, 300)
      },
      {
        title: 'Kişileri Etiketleyin',
        description: 'Gönderideki kişileri etiketlemek için "@" sembolünü kullanın. Bu kişilere bildirim gönderir.',
        image: getFeedImageUrl(10, 600, 300)
      },
      {
        title: 'Gizlilik Ayarını Belirleyin',
        description: 'Gönderiyi kimlerin görebileceğini seçin: Herkese açık, sadece komşulara, veya özel grup.',
        image: getFeedImageUrl(11, 600, 300)
      },
      {
        title: 'Yayınlayın',
        description: 'Tüm hazır olduğunda "Yayınla" düğmesine tıklayın. Gönderi anında akışta görüntülenecektir.',
        image: getFeedImageUrl(12, 600, 300)
      }
    ],
    relatedArticles: [
      { slug: 'gonderi-duzenle', title: 'Gönderiyi Nasıl Düzenlerim?' },
      { slug: 'hashtag-ve-etiketler', title: 'Hashtag ve Etiket Kullanımı' }
    ]
  },
  'urun-nasil-satilir': {
    category: 'Pazar Yeri',
    categorySlug: 'pazar-yeri',
    title: 'Ürün Nasıl Satarım?',
    excerpt: 'Pazar Yeri\'ne ürün listeleme, fotoğraf ekleme ve fiyat belirleme adımları.',
    readTime: 6,
    updatedAt: '2024-01-12',
    introduction: 'Pazar Yeri, komşularınızla ürün satıp almak için mükemmel bir platform. Kullanılmayan eşyaları satın, ev yapımı ürünler sunun veya hizmet verin. Bu kılavuz, ürün nasıl satılacağını açıklar.',
    steps: [
      {
        title: 'Pazar Yeri Bölümüne Gidin',
        description: 'Ana menüde veya alt navigasyonda "Pazar Yeri" seçeneğine tıklayın.',
        image: getFeedImageUrl(13, 600, 300)
      },
      {
        title: 'Yeni Ürün Ekle\'ye Tıklayın',
        description: '"Yeni Ürün Ekle" veya "+" düğmesine tıklayarak ürün listeleme formunu açın.',
        image: getFeedImageUrl(14, 600, 300)
      },
      {
        title: 'Ürün Fotoğrafları Yükleyin',
        description: 'Ürünün en az 3 fotoğrafını farklı açılardan yükleyin. Kaliteli, net fotoğraflar satış şansını arttırır.',
        image: getFeedImageUrl(15, 600, 300)
      },
      {
        title: 'Ürün Başlığı ve Açıklaması',
        description: 'Kısa ve açıklayıcı bir başlık yazın. Açıklamada ürünün koşulu, rengi, boyutu ve özellikleri belirtin.',
        image: getFeedImageUrl(16, 600, 300)
      },
      {
        title: 'Kategori ve Fiyat Belirleyin',
        description: 'Ürünün kategorisini seçin (Elektronik, Mobilya, vb.). Makul ve pazar değeri ile uyumlu bir fiyat belirleyin.',
        image: getFeedImageUrl(17, 600, 300)
      },
      {
        title: 'Yayınlayın',
        description: 'Tüm bilgileri girdikten sonra "Yayınla" düğmesine tıklayın. Ürün anında Pazar Yeri\'nde görüntülenecektir.',
        image: getFeedImageUrl(18, 600, 300)
      }
    ],
    relatedArticles: [
      { slug: 'urun-fiyatini-degistir', title: 'Ürün Fiyatını Nasıl Değiştirebilirim?' },
      { slug: 'basari-tuyolari', title: 'Ürün Satışında Başarı İpuçları' }
    ]
  },
  'iki-faktorlu-auth': {
    category: 'Güvenlik ve Gizlilik',
    categorySlug: 'guvenlik',
    title: 'İki Faktörlü Kimlik Doğrulama Nedir?',
    excerpt: 'SMS ve authenticator uygulaması ile 2FA etkinleştirme ve kullanma.',
    readTime: 5,
    updatedAt: '2024-01-08',
    introduction: 'İki Faktörlü Kimlik Doğrulama (2FA), hesabınızı ek bir güvenlik katmanı ile korur. Şifreniz ele geçirilse bile, başkası oturum açamaz. Bu rehber, 2FA\'yi etkinleştirme ve kullanma yollarını gösterir.',
    steps: [
      {
        title: 'Ayarlar > Güvenlik Bölümüne Gidin',
        description: "Profil menüsünden Ayarlar'a gidin ve sol menüden Güvenlik seçeneğini seçin.",
        image: getFeedImageUrl(19, 600, 300)
      },
      {
        title: '2FA Seçeneğini Bulun',
        description: 'Güvenlik sayfasında "İki Faktörlü Kimlik Doğrulama" veya "2FA" bölümünü bulun.',
        image: getFeedImageUrl(20, 600, 300)
      },
      {
        title: '2FA Yöntemini Seçin',
        description: 'SMS (Kısa Mesaj) veya Authenticator Uygulaması arasında seçim yapın. Authenticator daha güvenlidir.',
        image: getFeedImageUrl(21, 600, 300)
      },
      {
        title: 'SMS İçin Doğrulama',
        description: 'SMS seçerseniz, telefon numaranız doğrulanır. Gönderilen kodu girin.',
        image: getFeedImageUrl(22, 600, 300)
      },
      {
        title: 'Authenticator Uygulaması Kurulumu',
        description: 'Google Authenticator gibi bir uygulama yükleyin. QR kodunu tarayın ve 6 haneli kodu girin.',
        image: getFeedImageUrl(23, 600, 300)
      },
      {
        title: '2FA\'yi Etkinleştirin',
        description: 'Doğrulama başarılı olduğunda, 2FA etkin hale gelir. Bundan sonra her oturum açışta kod girebilirsiniz.',
        image: getFeedImageUrl(24, 600, 300)
      }
    ],
    relatedArticles: [
      { slug: 'sifre-secme', title: 'Güvenli Şifre Seçme' },
      { slug: 'oturum-yonetim', title: 'Oturum ve Cihaz Yönetimi' }
    ]
  },
  'uygulama-cokuk': {
    category: 'Teknik Sorunlar',
    categorySlug: 'teknik',
    title: 'Uygulama Çöküyor veya Donuyor',
    excerpt: 'Uygulama hatalarını gidermek için temel sorun giderme adımları.',
    readTime: 4,
    updatedAt: '2024-01-18',
    introduction: 'Mahallemiz\'ta sorunla mı karşılaştınız? Uygulama çöküyor veya yanıt vermiyor mu? Bu rehber, sorunu hızlı bir şekilde çözmek için adımları gösterir.',
    steps: [
      {
        title: 'Uygulamayı Kapatın',
        description: 'Açık uygulamayı tamamen kapatın. Android\'de geri düğmesine, iOS\'ta yukarıdan aşağıya kaydırın.',
        image: getFeedImageUrl(25, 600, 300)
      },
      {
        title: 'Uygulamayı Yeniden Açın',
        description: 'Uygulamayı kapatıp 10 saniye bekleyin, sonra yeniden başlatın. Bu şekilde çoğu hata çözülür.',
        image: getFeedImageUrl(26, 600, 300)
      },
      {
        title: 'Cihazı Yeniden Başlatın',
        description: 'Sorun devam ederse, telefonunuzu kapatıp yeniden başlatın. Telefon kapalıyken 5-10 saniye bekleyin.',
        image: getFeedImageUrl(27, 600, 300)
      },
      {
        title: 'Uygulamayı Güncelleyin',
        description: 'Google Play Store veya Apple App Store\'da Mahallemiz\'ın en son sürümü yüklü olup olmadığını kontrol edin.',
        image: getFeedImageUrl(28, 600, 300)
      },
      {
        title: 'Uygulama Önbelleğini Temizleyin',
        description: 'Cihaz Ayarları > Uygulamalar > Mahallemiz > Depolama > Önbelleği Temizle seçeneğine gidin.',
        image: getFeedImageUrl(29, 600, 300)
      },
      {
        title: 'Destek ile İletişime Geçin',
        description: 'Sorun halen devam ederse, Yardım Merkezi\'nden destek ekibimize bildirin.',
        image: getFeedImageUrl(30, 600, 300)
      }
    ],
    relatedArticles: [
      { slug: 'versiyon-guncelleme', title: 'En Son Sürümü Nasıl Güncellerim?' },
      { slug: 'bildirimler-gelmiyor', title: 'Bildirimler Neden Gelmiyor?' }
    ]
  }
};

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [expandedTOC, setExpandedTOC] = useState(false);

  const article = articlesData[slug];

  const tableOfContents = useMemo(() => {
    if (!article) return [];
    return article.steps.map((step, idx) => ({
      id: `step-${idx}`,
      title: step.title,
      level: 0
    }));
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#f0f2f5]">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-12 h-12 text-[#8f8f8f] mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-[#333] mb-2">Makale Bulunamadı</h1>
          <p className="text-[#8f8f8f] mb-6">Aradığınız makale mevcut değil.</p>
          <Link
            href="/yardim"
            className="inline-block px-6 py-3 bg-[#00833e] hover:bg-[#006b32] text-white font-medium rounded-lg transition-colors"
          >
            Yardım Merkezi&apos;ne Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#00833e] to-[#006b32] text-white py-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-green-100 text-sm mb-4">
            <Link href="/yardim" className="hover:text-white transition-colors">
              Yardım Merkezi
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/yardim/kategori/${article.categorySlug}`}
              className="hover:text-white transition-colors"
            >
              {article.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>{article.title}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-green-100 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {article.readTime} dakika okuma
            </div>
            <div>Son güncelleme: {new Date(article.updatedAt).toLocaleDateString('tr-TR')}</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <article className="bg-white rounded-lg border border-[#e0e0e0] p-6 md:p-8">
              {/* Introduction */}
              <div className="mb-8 p-4 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0]">
                <p className="text-[#404040] leading-relaxed">{article.introduction}</p>
              </div>

              {/* Steps */}
              <div className="space-y-8 mb-8">
                {article.steps.map((step, idx) => (
                  <div key={idx} id={`step-${idx}`} className="scroll-mt-20">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#00833e] text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <h3 className="text-xl font-bold text-[#333] mt-0.5">{step.title}</h3>
                    </div>

                    <p className="text-[#404040] mb-4 ml-12">{step.description}</p>

                    {step.image && (
                      <div className="ml-12 mb-6">
                        <div className="relative w-full h-48 md:h-64 bg-gray-200 rounded-lg overflow-hidden">
                          <Image
                            src={step.image}
                            alt={step.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {idx < article.steps.length - 1 && (
                      <hr className="my-8 border-[#e0e0e0]" />
                    )}
                  </div>
                ))}
              </div>

              {/* Feedback Section */}
              <div className="mt-8 pt-8 border-t border-[#e0e0e0]">
                <p className="font-semibold text-[#333] mb-4">Bu makale faydalı oldu mu?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFeedback(true)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
                      feedback === true
                        ? 'bg-green-100 text-[#00833e]'
                        : 'bg-gray-100 text-[#333] hover:bg-gray-200'
                    )}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Evet, yardımcı oldu
                  </button>
                  <button
                    onClick={() => setFeedback(false)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
                      feedback === false
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-[#333] hover:bg-gray-200'
                    )}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    Hayır, yardım olmadı
                  </button>
                </div>
              </div>

              {/* Share Section */}
              <div className="mt-8 pt-8 border-t border-[#e0e0e0]">
                <p className="font-semibold text-[#333] mb-4 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#00833e]" />
                  Bu makaleleri paylaş
                </p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                    Facebook
                  </button>
                  <button className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm font-medium">
                    Twitter
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-[#333] rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium">
                    Kopyala
                  </button>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Table of Contents */}
            <div className="sticky top-4 bg-white rounded-lg border border-[#e0e0e0] p-5">
              <h3 className="font-bold text-[#333] mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00833e]" />
                İçindekiler
              </h3>

              <button
                onClick={() => setExpandedTOC(!expandedTOC)}
                className="w-full text-left text-sm text-[#00833e] font-medium mb-3 md:hidden"
              >
                {expandedTOC ? 'Gizle' : 'Göster'}
              </button>

              <nav className={cn('space-y-2', !expandedTOC && 'hidden md:block')}>
                {tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-sm text-[#8f8f8f] hover:text-[#00833e] transition-colors py-1 px-2 rounded hover:bg-[#f0f2f5]"
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Related Articles */}
            {article.relatedArticles.length > 0 && (
              <div className="bg-white rounded-lg border border-[#e0e0e0] p-5">
                <h3 className="font-bold text-[#333] mb-4">İlgili Makaleler</h3>

                <div className="space-y-3">
                  {article.relatedArticles.map((relatedArticle) => (
                    <Link
                      key={relatedArticle.slug}
                      href={`/yardim/makale/${relatedArticle.slug}`}
                      className="block text-sm text-[#00833e] hover:text-[#006b32] font-medium hover:underline"
                    >
                      {relatedArticle.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Help CTA */}
            <div className="bg-gradient-to-br from-[#00833e]/10 to-[#006b32]/10 border border-[#00833e]/20 rounded-lg p-5 text-center">
              <p className="text-sm text-[#333] font-medium mb-3">Hâlâ yardıma mı ihtiyacınız var?</p>
              <Link
                href="/iletisim"
                className="inline-block w-full px-4 py-2 bg-[#00833e] hover:bg-[#006b32] text-white font-medium rounded-lg transition-colors text-sm"
              >
                Destek ile İletişime Geç
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
