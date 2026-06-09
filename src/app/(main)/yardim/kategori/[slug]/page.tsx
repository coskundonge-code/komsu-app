'use client';

import { Search, ChevronRight, FileText, Lightbulb, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  readTime?: number;
}

const categoryData: { [key: string]: { name: string; description: string; articles: Article[] } } = {
  'hesap': {
    name: 'Hesap ve Profil',
    description: 'Hesap yönetimi, profil düzenleme ve kişisel bilgilendirme hakkında makaleler',
    articles: [
      {
        slug: 'profil-nasil-duzenlerim',
        title: 'Profilimi Nasıl Düzenlerim?',
        excerpt: 'Adınızı, fotoğrafınızı, biyografinizi ve diğer profil bilgilerinizi güncellemek için adım adım kılavuz.'
      },
      {
        slug: 'mahallemi-degistirme',
        title: 'Mahallemi Nasıl Değiştirebilirim?',
        excerpt: 'Yaşadığınız mahallei değiştirmek ve adres doğrulaması yapma sürecini öğrenin.'
      },
      {
        slug: 'sifre-degistirme',
        title: 'Şifremi Nasıl Değiştirim?',
        excerpt: 'Güvenli bir şifre seçme ve mevcut şifrenizi değiştirme rehberi.'
      },
      {
        slug: 'profil-gizliligi',
        title: 'Profil Gizliliği Ayarları',
        excerpt: 'Profilinizi kim tarafından görebileceğini kontrol edin ve gizlilik ayarlarınızı yönetin.'
      },
      {
        slug: 'hesap-silme',
        title: 'Hesabımı Nasıl Silerim?',
        excerpt: 'Hesabınızı kalıcı olarak silme ve verilerin silinmesi hakkında bilgi edinin.'
      },
    ]
  },
  'gonderiler': {
    name: 'Gönderi ve İçerik',
    description: 'Gönderi oluşturma, düzenleme ve yönetimi hakkında bilgiler',
    articles: [
      {
        slug: 'gonderi-nasil-paylasim',
        title: 'Gönderi Nasıl Paylaşırım?',
        excerpt: 'Yeni bir gönderi oluşturma, metin ve fotoğraf ekleme, yayınlama adımları.'
      },
      {
        slug: 'gonderi-duzenle',
        title: 'Gonderiyi Nasıl Düzenlerim?',
        excerpt: 'Yayınlanmış bir gönderiyi düzenleme, metin ve fotoğraf güncelleme talimatları.'
      },
      {
        slug: 'gonderi-sil',
        title: 'Gönderiyi Nasıl Silerim?',
        excerpt: 'Paylaştığınız gönderiyi tamamen kaldırma ve geri dönüş hakkında.'
      },
      {
        slug: 'uygunsuz-icerigi-bildir',
        title: 'Uygunsuz İçeriği Nasıl Bildiririm?',
        excerpt: 'Kuralları ihlal eden gönderi ve profilleri raporlama süreci.'
      },
      {
        slug: 'yorum-ve-begeniler',
        title: 'Yorumlar ve Beğeniler Nedir?',
        excerpt: 'Başkalarının gönderilerine yorum yapma ve beğenme, yanıt alma hakkında bilgi.'
      },
      {
        slug: 'hashtag-ve-etiketler',
        title: 'Hashtag ve Etiket Kullanımı',
        excerpt: 'Gönderilerinizi daha görünür hale getirmek için hashtag ve etiket ekleme yöntemleri.'
      },
    ]
  },
  'pazar-yeri': {
    name: 'Pazar Yeri',
    description: 'Ürün satışı, alımı ve işlemler hakkında rehberler',
    articles: [
      {
        slug: 'urun-nasil-satilir',
        title: 'Ürün Nasıl Satarım?',
        excerpt: 'Pazar Yeri\'ne ürün listeleme, fotoğraf ekleme ve fiyat belirleme adımları.'
      },
      {
        slug: 'urun-fiyatini-degistir',
        title: 'Ürün Fiyatını Nasıl Değiştirebilirim?',
        excerpt: 'Satış fiyatınızı güncellemek ve indirim uygulamak hakkında talimatlar.'
      },
      {
        slug: 'urun-satisi-tamamla',
        title: 'Ürün Satışını Nasıl Tamamlarım?',
        excerpt: 'Alıcıyla anlaşma, ödeme alma ve satışı bitirme adımları.'
      },
      {
        slug: 'guvenli-islem',
        title: 'Güvenli Bir İşlem Nasıl Yapılır?',
        excerpt: 'Dolandırıcılıktan korunma ve güvenli ürün satışı için ipuçları.'
      },
      {
        slug: 'iade-sureci',
        title: 'İade ve Şikayet Süreci',
        excerpt: 'Ürün iadesi ve anlaşmazlık durumunda yapılması gerekenler.'
      },
      {
        slug: 'basari-tuyolari',
        title: 'Ürün Satışında Başarı İpuçları',
        excerpt: 'Daha fazla satış yapmak için iyi fotoğraf, açıklama ve tanıtım stratejileri.'
      },
    ]
  },
  'guvenlik': {
    name: 'Güvenlik ve Gizlilik',
    description: 'Hesap güvenliği, gizlilik ayarları ve kişisel veri koruması',
    articles: [
      {
        slug: 'iki-faktorlu-auth',
        title: 'İki Faktörlü Kimlik Doğrulama Nedir?',
        excerpt: 'SMS ve authenticator uygulaması ile 2FA etkinleştirme ve kullanma.'
      },
      {
        slug: 'guvensiz-aktivite',
        title: 'Hesabımda Şüpheli Aktivite Gördüm',
        excerpt: 'Hesapınızın ele geçirilmesi durumunda acil eylem adımları.'
      },
      {
        slug: 'kisi-engelleme',
        title: 'Birini Nasıl Engellerim?',
        excerpt: 'Rahatsız edici kullanıcıları engelleme ve engel listesini yönetme.'
      },
      {
        slug: 'veri-guvenligi',
        title: 'Kişisel Verilerim Nasıl Korunuyor?',
        excerpt: 'Veri şifreleme, depolama ve gizlilik politikamız hakkında ayrıntılı bilgi.'
      },
      {
        slug: 'sifre-secme',
        title: 'Güvenli Şifre Seçme',
        excerpt: 'Kırılması zor, güçlü bir şifre oluşturmak için en iyi uygulamalar.'
      },
      {
        slug: 'oturum-yonetim',
        title: 'Oturum ve Cihaz Yönetimi',
        excerpt: 'Açık oturumlarınızı kontrol edin ve güvenilmeyen cihazlardan çıkış yapın.'
      },
    ]
  },
  'teknik': {
    name: 'Teknik Sorunlar',
    description: 'Uygulamada yaşadığınız sorunları çözmek için kılavuzlar',
    articles: [
      {
        slug: 'uygulama-cokuk',
        title: 'Uygulama Çöküyor veya Donuyor',
        excerpt: 'Uygulama hatalarını gidermek için temel sorun giderme adımları.'
      },
      {
        slug: 'bildirimler-gelmiyor',
        title: 'Bildirimler Neden Gelmiyor?',
        excerpt: 'Bildirimleri etkinleştirme ve doğru ayarlara sahip olduğunuzdan emin olma.'
      },
      {
        slug: 'sayfa-yuklenmesi',
        title: 'Sayfalar Yüklenmiyor veya Yavaş Yükleniyor',
        excerpt: 'Bağlantı sorunlarını teşhis etme ve performansı iyileştirme yöntemleri.'
      },
      {
        slug: 'oturum-sorunu',
        title: 'Giriş Yapamıyorum',
        excerpt: 'Oturum açma sorunlarını çözmek ve hesabınıza erişim sağlamak.'
      },
      {
        slug: 'fotograf-yukleme',
        title: 'Fotoğraf Yüklenmiyor',
        excerpt: 'Resim yükleme hatalarını çözmek ve dosya formatı gereksinimleri.'
      },
      {
        slug: 'versiyon-guncelleme',
        title: 'En Son Sürümü Nasıl Güncellerim?',
        excerpt: 'Uygulamayı güncelleme ve yeni özelliklere erişim.'
      },
    ]
  }
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [searchQuery, setSearchQuery] = useState('');

  const category = categoryData[slug];

  const filteredArticles = useMemo(() => {
    if (!category) return [];
    return category.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [category, searchQuery]);

  if (!category) {
    return (
      <div className="min-h-screen bg-[#f0f2f5]">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-12 h-12 text-[#8f8f8f] mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-[#333] mb-2">Kategori Bulunamadı</h1>
          <p className="text-[#8f8f8f] mb-6">Aradığınız yardım kategorisi mevcut değil.</p>
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
      <div className="bg-gradient-to-br from-[#00833e] to-[#006b32] text-white py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 text-green-100 text-sm mb-4">
            <Link href="/yardim" className="hover:text-white transition-colors">
              Yardım Merkezi
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>{category.name}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
          <p className="text-green-100 text-lg mb-8">{category.description}</p>

          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Bu kategoride arayın..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white text-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Results Count */}
        {searchQuery && (
          <p className="text-sm text-[#8f8f8f] mb-6">
            <span className="font-semibold text-[#00833e]">{filteredArticles.length}</span> makale bulundu
          </p>
        )}

        {/* Articles Grid */}
        <div className="space-y-3 mb-8">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/yardim/makale/${article.slug}`}
                className="block bg-white border border-[#e0e0e0] rounded-lg p-5 hover:border-[#00833e] hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 bg-[#f0f2f5] rounded-lg flex items-center justify-center group-hover:bg-[#00833e] transition-colors">
                      <FileText className="w-5 h-5 text-[#00833e] group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-[#333] mb-1 group-hover:text-[#00833e] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-[#8f8f8f] mb-2">{article.excerpt}</p>
                    <p className="text-xs text-[#00833e] font-medium">
                      {article.readTime} dakika okuma
                    </p>
                  </div>

                  <ChevronRight className="w-5 h-5 text-[#8f8f8f] group-hover:text-[#00833e] group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-[#e0e0e0]">
              <AlertCircle className="w-12 h-12 text-[#8f8f8f] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#333] mb-2">Makale Bulunamadı</h3>
              <p className="text-[#8f8f8f] mb-6">
                {searchQuery
                  ? `"${searchQuery}" için makale bulamadık.`
                  : 'Bu kategoride makale mevcut değil.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-[#00833e] text-white rounded-lg font-medium hover:bg-[#006b32] transition-colors"
                >
                  Aramayı Temizle
                </button>
              )}
            </div>
          )}
        </div>

        {/* Related Categories */}
        <div className="mt-12 p-6 bg-gradient-to-br from-[#00833e]/10 to-[#006b32]/10 border border-[#00833e]/20 rounded-lg">
          <h3 className="text-lg font-bold text-[#333] mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#00833e]" />
            Diğer Kategoriler
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(categoryData).map(([categorySlug, categoryInfo]) => (
              categorySlug !== slug && (
                <Link
                  key={categorySlug}
                  href={`/yardim/kategori/${categorySlug}`}
                  className="p-3 bg-white border border-[#e0e0e0] rounded-lg hover:border-[#00833e] hover:bg-[#f0f2f5] transition-all text-center"
                >
                  <p className="font-semibold text-[#333] text-sm">{categoryInfo.name}</p>
                  <p className="text-xs text-[#8f8f8f] mt-1">{categoryInfo.articles.length} makale</p>
                </Link>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
