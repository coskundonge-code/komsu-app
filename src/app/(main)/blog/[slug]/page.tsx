'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  User,
  BookOpen,
  Share2,
  Facebook,
  Twitter,
  MessageCircle,
  Link as LinkIcon,
  Clock,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

// Mock blog data
const blogArticles: Record<string, any> = {
  'mahallede-guvenlik-nasil-artirabiliriz': {
    id: 1,
    slug: 'mahallede-guvenlik-nasil-artirabiliriz',
    title: 'Mahallede Güvenliği Nasıl Artırabiliriz?',
    excerpt:
      'Komşuluk bağlantılarını güçlendirerek mahallede güvenlik hissi oluşturmanın pratik yollarını öğrenin.',
    heroImage: 'https://picsum.photos/1200/600?random=1',
    category: 'Güvenlik İpuçları',
    author: {
      name: 'Ayşe Kaya',
      role: 'Güvenlik Danışmanı',
      avatar: 'https://picsum.photos/100/100?random=101',
      bio: 'Ayşe Kaya, 15 yıldan fazla mahalle güvenliği ve topluluk geliştirme alanında çalışmıştır. KomşuApp güvenlik inisiyatifinin kurucu üyesidir.',
    },
    publishDate: '2026-03-08',
    readTime: '5 dk',
    updatedDate: '2026-03-10',
    tableOfContents: [
      { id: 1, title: 'Komşuluk Bağlarını Güçlendirin', level: 2 },
      { id: 2, title: 'Acil Durum Planı Oluşturun', level: 2 },
      { id: 3, title: 'Mahalle İletişim Ağları', level: 2 },
      { id: 4, title: 'Mahallenizi Gözetim Altında Tutun', level: 2 },
      { id: 5, title: 'Pratik Güvenlik Araçları', level: 2 },
      { id: 6, title: 'Sonuç: Birlikte Daha Güvenli', level: 2 },
    ],
    content: [
      {
        type: 'paragraph',
        text: 'Mahallede güvenlik sadece fiziksel önlemlerle sağlanamaz. Gerçek güvenlik, komşuların birbirleriyle güvene dayalı ilişkiler kurmasından, iletişim halinde kalmasından ve birbirlerini desteklemesinden gelir. Bu yazıda, mahallede güvenliği artırmak için alabileceğiniz pratik adımları öğreneceksiniz.',
      },
      {
        type: 'heading',
        text: 'Komşuluk Bağlarını Güçlendirin',
        level: 2,
      },
      {
        type: 'paragraph',
        text: 'Mahallede bir güvenlik kültürü oluşturmanın ilk adımı, komşularınızı tanımaktır. Yapı sakinlerini tanıyan insanlar, anormal davranışları daha kolay fark edebilirler. Düzenli sosyal etkinlikler düzenleyin - kahvaltı, piknik veya basit bir cadde temizliği etkinliği bile yeterli olabilir.',
      },
      {
        type: 'paragraph',
        text: 'KomşuApp kullanarak, bulunduğunuz mahallede birbiriyle tanışan bir topluluk oluşturabilirsiniz. Platform aracılığıyla etkinlik planlamak, mesaj paylaşmak ve birbirlerinize yardım etmek çok daha kolaydır.',
      },
      {
        type: 'heading',
        text: 'Acil Durum Planı Oluşturun',
        level: 2,
      },
      {
        type: 'paragraph',
        text: 'Mahalle sakinleriyle birlikte acil durum planı hazırlayın. Bu plan, yangın, deprem, tıbbi acil durum veya diğer beklenmeyen olaylar için ne yapılması gerektiğini belirler. Planınızda şunlar olmalıdır:',
      },
      {
        type: 'paragraph',
        text: 'İletişim listesi - mahalle sakinlerinin telefon numaraları ve adresleri. Toplanma noktaları - deprem gibi olaylarda halka neresi güvenli olacağı. Kaynak yönetimi - su, gıda ve tıbbi yardım stokları. Rol atama - kimler çocuklara, yaşlılara veya hasta insanlara bakacak?',
      },
      {
        type: 'heading',
        text: 'Mahalle İletişim Ağları',
        level: 2,
      },
      {
        type: 'paragraph',
        text: 'Etkili bir iletişim ağı, mahalle güvenliğinin temel taşıdır. KomşuApp gibi dijital platformlar, bu ağları kurmanın en etkili yollarından biridir. Platform üzerinden şüpheli aktiviteler, güvenlik tehditleri veya acil durumlar hakkında uyarı yaymak çok hızlıdır.',
      },
      {
        type: 'paragraph',
        text: 'Ayrıca, geleneksel yöntemleri de göz ardı etmeyin. Afişler, e-posta grupları veya WhatsApp grupları da iletişimi sağlamaya yardımcı olabilir.',
      },
      {
        type: 'heading',
        text: 'Mahallenizi Gözetim Altında Tutun',
        level: 2,
      },
      {
        type: 'paragraph',
        text: 'Görünür gözetim, suçu caydırmada son derece etkilidir. Mahallenizde LED aydınlatma ekleme, güvenlik kamerası kurma veya mahalle sakinlerinin düzenli devriye turları yapması, potansiyel suçluları caydırır.',
      },
      {
        type: 'paragraph',
        text: 'Komşuların gece yürüyüşlerine katılması, işletmeler için güvenlik görevlileri istihdam etmesi veya yerel polisle işbirliği yapması da etkili yöntemlerdir.',
      },
      {
        type: 'heading',
        text: 'Pratik Güvenlik Araçları',
        level: 2,
      },
      {
        type: 'paragraph',
        text: 'Modern güvenlik araçları mahallede huzur ortamı yaratmada yardımcı olabilir. Güvenlik kameraları, acil durum uyarı sistemleri, ışık sensörleri ve diğer teknolojiler suç oranını düşürebilir.',
      },
      {
        type: 'paragraph',
        text: 'Ancak teknoloji tek başına yeterli değildir. İnsan faktörü - insanlar birbirlerine dikkat etme, anormal durumları fark etme ve bildir etme - asıl etkilidir.',
      },
      {
        type: 'heading',
        text: 'Sonuç: Birlikte Daha Güvenli',
        level: 2,
      },
      {
        type: 'paragraph',
        text: 'Mahalle güvenliği, tüm sakinlerin katılımı ve işbirliği ile oluşturulur. Komşularınızı tanıyın, iletişim halinde kalın, acil durum planları hazırlayın ve birbirlerinizi destekleyin. KomşuApp gibi araçlar bu süreci kolaylaştırır ve daha güvenli, daha samimi mahalleler oluşturmanıza yardımcı olur.',
      },
      {
        type: 'paragraph',
        text: 'Güvenlik, bir kişinin değil, bir topluluğun işidir. Başlayın ve fark yaratın!',
      },
    ],
    relatedArticles: [2, 5, 9],
  },
  'komsuapp-topluluk-yonetimi': {
    id: 2,
    slug: 'komsuapp-topluluk-yonetimi',
    title: 'KomşuApp Topluluk Yönetimi: En İyi Uygulamalar',
    excerpt:
      'Mahalle gruplarını etkili bir şekilde yönetmek ve aktif bir topluluk oluşturmak için ipuçları.',
    heroImage: 'https://picsum.photos/1200/600?random=2',
    category: 'Topluluk',
    author: {
      name: 'Mehmet Demir',
      role: 'Topluluk Yöneticisi',
      avatar: 'https://picsum.photos/100/100?random=102',
      bio: 'Mehmet Demir, 8 yıldan beri online topluluk yönetimi konusunda uzmanlaşmıştır. Türkiye\'nin en aktif KomşuApp topluluk yöneticilerinden biridir.',
    },
    publishDate: '2026-03-06',
    readTime: '7 dk',
    updatedDate: '2026-03-09',
    tableOfContents: [
      { id: 1, title: 'Topluluk Kuralları Belirleyin', level: 2 },
      { id: 2, title: 'Düzenli İçerik Planlaması', level: 2 },
      { id: 3, title: 'Üyeleri Aktif Tutun', level: 2 },
      { id: 4, title: 'Çatışma Çözme Stratejileri', level: 2 },
    ],
    content: [
      {
        type: 'paragraph',
        text: 'Bir mahalle topluluğu yönetmek, kişilik, sabır ve tutarlı stratejiye ihtiyaç duyar. KomşuApp üzerinde başarılı bir topluluk oluşturmak istiyorsanız, bu yazıdaki ipuçlarını uygulayabilirsiniz.',
      },
      {
        type: 'heading',
        text: 'Topluluk Kuralları Belirleyin',
        level: 2,
      },
      {
        type: 'paragraph',
        text: 'Bir topluluğun işlemesi için açık kurallar gereklidir. Neyin konuşulabileceğini, neyin yapılmayacağını ve saygılı iletişim kurallarını belirleyin. Örneğin: Politik tartışmalara izin verin ama kişisel saldırılara izin vermeyin.',
      },
      {
        type: 'heading',
        text: 'Düzenli İçerik Planlaması',
        level: 2,
      },
      {
        type: 'paragraph',
        text: 'Topluluğu canlı tutmak için düzenli içerik paylaşımı önemlidir. Haftalık etkinlikler, günlük sorular veya ayakkabılık bilgiler topluluğu aktif tutar.',
      },
      {
        type: 'heading',
        text: 'Üyeleri Aktif Tutun',
        level: 2,
      },
      {
        type: 'paragraph',
        text: 'Pasif üyeleri katılıma davet edin. Onlardan soru sorun, fikirlerini isteyin ve katkılarını takdir edin.',
      },
      {
        type: 'heading',
        text: 'Çatışma Çözme Stratejileri',
        level: 2,
      },
      {
        type: 'paragraph',
        text: 'Çatışmalar her topluluğun parçasıdır. Sessiz ve profesyonel bir şekilde ele alın. Gerekirse tartışmayı özel mesajlara taşıyın.',
      },
    ],
    relatedArticles: [1, 4, 7],
  },
  'yerel-isletmecilerin-basari-hikayeleri': {
    id: 3,
    slug: 'yerel-isletmecilerin-basari-hikayeleri',
    title: 'Yerel İşletmecilerin Başarı Hikayeleri',
    excerpt:
      'Cihangir Mahallesinde işletmesini KomşuApp sayesinde nasıl büyüttüğünü öğrenin.',
    heroImage: 'https://picsum.photos/1200/600?random=3',
    category: 'İşletme Hikayeleri',
    author: {
      name: 'Zeynep Aydın',
      role: 'İşletme Yazarı',
      avatar: 'https://picsum.photos/100/100?random=103',
      bio: 'Zeynep Aydın, yerel işletmelerin dijital dönüşümü hakkında yazıyor. Küçük işletmelerin başarısı onun tutkusudur.',
    },
    publishDate: '2026-03-04',
    readTime: '6 dk',
    updatedDate: '2026-03-08',
    tableOfContents: [
      { id: 1, title: 'Gül Bakkalı: Gelenekten Dijitale', level: 2 },
      { id: 2, title: 'Sonuçlar: Müşteri Memnuniyeti Arttı', level: 2 },
    ],
    content: [
      {
        type: 'paragraph',
        text: 'Cihangir Mahallesinin kalbinde 30 yıldır hizmet veren Gül Bakkalı\'nın sahibi Gül Hanım, KomşuApp sayesinde işletmesini tamamen değiştirdi.',
      },
      {
        type: 'heading',
        text: 'Gül Bakkalı: Gelenekten Dijitale',
        level: 2,
      },
      {
        type: 'paragraph',
        text: 'Başlangıçta dijital platformlara şüpheli olan Gül Hanım, torununun teşvikiyle KomşuApp\'ta bir sayfa açmaya karar verdi. Bulunduğu mahalledeki mahallelerini takip eden müşteriler kendisine mensaj göndererek sipariş vermek istediler.',
      },
      {
        type: 'paragraph',
        text: 'Gül Hanım hızlı bir şekilde öğrendi. Yeni ürünleri fotoğrafladı, günlük fiyatları paylaştı ve müşterilerin sorularına cevap verdi. Altı ay içinde online satışları toplamının %40\'ına ulaştı.',
      },
      {
        type: 'heading',
        text: 'Sonuçlar: Müşteri Memnuniyeti Arttı',
        level: 2,
      },
      {
        type: 'paragraph',
        text: 'Bugün Gül Bakkalı, mahallede en popüler bakkallarından biri. Müşterileri KomşuApp\'ta onu takip ediyor, yeni ürünleri merakla bekliyorlar ve ona tavsiye ediyorlar. Gül Hanım da mahallede daha iyi tanınıyor ve işletmesine daha çok müşteri kazanıyor.',
      },
      {
        type: 'paragraph',
        text: 'Başarının sırrı? Mahallede yaşayan insanları anlama ve onların ihtiyaçlarına hızlı cevap verme.',
      },
    ],
    relatedArticles: [1, 4, 8],
  },
};

// Related articles data
const allArticles = [
  {
    id: 1,
    slug: 'mahallede-guvenlik-nasil-artirabiliriz',
    title: 'Mahallede Güvenliği Nasıl Artırabiliriz?',
    excerpt: 'Komşuluk bağlantılarını güçlendirerek mahallede güvenlik hissi oluşturmanın pratik yollarını öğrenin.',
    image: 'https://picsum.photos/400/300?random=1',
    category: 'Güvenlik İpuçları',
    readTime: '5 dk',
  },
  {
    id: 2,
    slug: 'komsuapp-topluluk-yonetimi',
    title: 'KomşuApp Topluluk Yönetimi: En İyi Uygulamalar',
    excerpt: 'Mahalle gruplarını etkili bir şekilde yönetmek ve aktif bir topluluk oluşturmak için ipuçları.',
    image: 'https://picsum.photos/400/300?random=2',
    category: 'Topluluk',
    readTime: '7 dk',
  },
  {
    id: 3,
    slug: 'yerel-isletmecilerin-basari-hikayeleri',
    title: 'Yerel İşletmecilerin Başarı Hikayeleri',
    excerpt: 'Cihangir Mahallesinde işletmesini KomşuApp sayesinde nasıl büyüttüğünü öğrenin.',
    image: 'https://picsum.photos/400/300?random=3',
    category: 'İşletme Hikayeleri',
    readTime: '6 dk',
  },
  {
    id: 4,
    slug: 'yeni-ozellik-komsu-yardim-agi',
    title: 'Yeni Özellik: Komşu Yardım Ağı',
    excerpt: 'Mahalle sakinlerinin birbirlerine yardım etmesi için tasarlanmış yeni özelliği keşfet.',
    image: 'https://picsum.photos/400/300?random=4',
    category: 'Uygulama Güncellemeleri',
    readTime: '4 dk',
  },
  {
    id: 5,
    slug: 'beyoglu-mahallesi-guvenli-topluluk',
    title: 'Beyoğlu Mahallesi: Güvenli Bir Topluluk Hikayesi',
    excerpt: 'Nasıl bir mahalle "en güvenli mahalle" unvanını kazandığını gördük.',
    image: 'https://picsum.photos/400/300?random=5',
    category: 'Mahalle Haberleri',
    readTime: '8 dk',
  },
  {
    id: 6,
    slug: 'cevrimici-guvenlik-ipuclari',
    title: 'Çevrimiçi Güvenlik: Her Mahalle Sakininin Bilmesi Gerekenler',
    excerpt: 'Platformda güvenli kalmanın ve mahallenizdeki mevcut tehditleri tanımanın yolları.',
    image: 'https://picsum.photos/400/300?random=6',
    category: 'Güvenlik İpuçları',
    readTime: '6 dk',
  },
  {
    id: 7,
    slug: 'topluluk-etkinligi-mahalle-piknigi',
    title: 'Topluluk Etkinliği: İlk Mahalle Pikniği Başarılı Oldu',
    excerpt: 'Beşiktaş Mahallesi sakinleri ilk kez buluştu ve harika vakit geçirdi.',
    image: 'https://picsum.photos/400/300?random=7',
    category: 'Mahalle Haberleri',
    readTime: '5 dk',
  },
  {
    id: 8,
    slug: 'komsuapp-mobil-hizli-kullanma-ipuclari',
    title: 'KomşuApp Mobilini Hızlı Kullanma İpuçları',
    excerpt: 'Mobil uygulamayı en etkili şekilde kullanmak için hızlı rehberimiz.',
    image: 'https://picsum.photos/400/300?random=8',
    category: 'Uygulama Güncellemeleri',
    readTime: '3 dk',
  },
  {
    id: 9,
    slug: 'atil-alanlari-toplum-bahcelerine-donusturme',
    title: 'Mahallede Atıl Alanları Topluluk Bahçelerine Dönüştürme',
    excerpt:
      'Yeşil alanlar ve topluluk bahçeleri oluşturarak mahallenizi nasıl güzelleştirebilirsiniz?',
    image: 'https://picsum.photos/400/300?random=9',
    category: 'Topluluk',
    readTime: '7 dk',
  },
];

export default function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [copied, setCopied] = useState(false);
  const [activeTableOfContents, setActiveTableOfContents] = useState<number | null>(null);

  const article = blogArticles[params.slug];

  if (!article) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#333] mb-2">Yazı Bulunamadı</h1>
          <p className="text-[#8f8f8f] mb-6">Aradığınız blog yazısı mevcut değildir.</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00833e] text-white rounded-lg hover:bg-[#006b32] transition-colors font-medium"
          >
            <ArrowLeft size={18} />
            Tüm Yazılara Dön
          </Link>
        </div>
      </div>
    );
  }

  const relatedArticles = article.relatedArticles
    ?.map((id: number) => allArticles.find((a) => a.id === id))
    .filter(Boolean);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/blog/${params.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = `${window.location.origin}/blog/${params.slug}`;
    const title = article.title;

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header Navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#e0e0e0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[#00833e] hover:text-[#006b32] font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Tüm Yazılar
          </Link>
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleShare('twitter')}
              className="p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors"
              title="Twitter'da Paylaş"
            >
              <Twitter size={18} className="text-[#00833e]" />
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors"
              title="Facebook'ta Paylaş"
            >
              <Facebook size={18} className="text-[#00833e]" />
            </button>
            <button
              onClick={() => handleShare('whatsapp')}
              className="p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors"
              title="WhatsApp'ta Paylaş"
            >
              <MessageCircle size={18} className="text-[#00833e]" />
            </button>
            <button
              onClick={handleCopyLink}
              className="p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors"
              title="Linki Kopyala"
            >
              <LinkIcon size={18} className="text-[#00833e]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Table of Contents (Desktop Only) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 bg-white rounded-lg border border-[#e0e0e0] p-6 h-fit">
              <h3 className="text-sm font-bold text-[#333] mb-4 uppercase tracking-wide">
                İçindekiler
              </h3>
              <nav className="space-y-2">
                {article.tableOfContents?.map((item: any) => (
                  <a
                    key={item.id}
                    href={`#section-${item.id}`}
                    onClick={() => setActiveTableOfContents(item.id)}
                    className={`block text-sm transition-colors py-1 pl-2 border-l-2 ${
                      activeTableOfContents === item.id
                        ? 'border-[#00833e] text-[#00833e] font-semibold'
                        : 'border-transparent text-[#404040] hover:text-[#00833e]'
                    }`}
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Article Content */}
          <main className="lg:col-span-2">
            <article className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden shadow-sm">
              {/* Hero Image */}
              <div className="relative w-full h-64 md:h-96 overflow-hidden bg-gray-200">
                <Image
                  src={article.heroImage}
                  alt={article.title}
                  fill
                  unoptimized
                  className="object-cover"
                  priority
                />
              </div>

              {/* Article Header */}
              <div className="p-6 md:p-10">
                {/* Category Badge */}
                <div className="mb-4">
                  <span className="inline-block bg-[#00833e]/10 text-[#00833e] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                    {article.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-[#333] mb-6 leading-tight">
                  {article.title}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-[#e0e0e0] text-sm text-[#404040]">
                  <div className="flex items-center gap-3">
                    <Image
                      src={article.author.avatar}
                      alt={article.author.name}
                      width={40}
                      height={40}
                      unoptimized
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-semibold text-[#333]">{article.author.name}</div>
                      <div className="text-xs text-[#8f8f8f]">{article.author.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    {formatDate(article.publishDate)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    {article.readTime} okuma
                  </div>
                </div>

                {/* Article Body */}
                <div className="py-8 space-y-6 text-[#404040] leading-relaxed">
                  {article.content?.map((block: any, index: number) => {
                    if (block.type === 'heading') {
                      return (
                        <h2
                          key={index}
                          id={`section-${index}`}
                          className="text-2xl font-bold text-[#333] mt-8 mb-4 pt-4"
                        >
                          {block.text}
                        </h2>
                      );
                    }
                    return (
                      <p key={index} className="text-base leading-relaxed">
                        {block.text}
                      </p>
                    );
                  })}
                </div>

                {/* Share Section */}
                <div className="border-t border-[#e0e0e0] pt-8 mt-8">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-[#333] mb-4 flex items-center gap-2">
                      <Share2 size={18} />
                      Bu yazıyı paylaş
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center gap-2 px-4 py-2 bg-[#f0f2f5] hover:bg-[#00833e] text-[#333] hover:text-white rounded-lg transition-colors font-medium text-sm"
                    >
                      <Twitter size={16} />
                      Twitter
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center gap-2 px-4 py-2 bg-[#f0f2f5] hover:bg-[#00833e] text-[#333] hover:text-white rounded-lg transition-colors font-medium text-sm"
                    >
                      <Facebook size={16} />
                      Facebook
                    </button>
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="flex items-center gap-2 px-4 py-2 bg-[#f0f2f5] hover:bg-[#00833e] text-[#333] hover:text-white rounded-lg transition-colors font-medium text-sm"
                    >
                      <MessageCircle size={16} />
                      WhatsApp
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                        copied
                          ? 'bg-[#00833e] text-white'
                          : 'bg-[#f0f2f5] hover:bg-[#00833e] text-[#333] hover:text-white'
                      }`}
                    >
                      <LinkIcon size={16} />
                      {copied ? 'Kopyalandı!' : 'Linki Kopyala'}
                    </button>
                  </div>
                </div>

                {/* Author Bio Card */}
                <div className="mt-8 p-6 bg-gradient-to-br from-[#00833e]/5 to-[#006b32]/5 rounded-lg border border-[#00833e]/20">
                  <div className="flex gap-4">
                    <Image
                      src={article.author.avatar}
                      alt={article.author.name}
                      width={60}
                      height={60}
                      unoptimized
                      className="rounded-full flex-shrink-0"
                    />
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-[#333] mb-1">
                        {article.author.name}
                      </h3>
                      <p className="text-sm text-[#00833e] font-semibold mb-3">
                        {article.author.role}
                      </p>
                      <p className="text-sm text-[#404040] leading-relaxed">
                        {article.author.bio}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </main>

          {/* Right Sidebar - Related Articles */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-lg border border-[#e0e0e0] p-6 h-fit">
              <h3 className="text-lg font-bold text-[#333] mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#00833e] rounded-full"></span>
                Benzer Yazılar
              </h3>
              <div className="space-y-4">
                {relatedArticles?.map((relArticle: any) => (
                  <Link
                    key={relArticle.id}
                    href={`/blog/${relArticle.slug}`}
                    className="group block p-3 rounded-lg hover:bg-[#f0f2f5] transition-colors"
                  >
                    <h4 className="text-sm font-semibold text-[#333] group-hover:text-[#00833e] transition-colors line-clamp-2 mb-2">
                      {relArticle.title}
                    </h4>
                    <div className="text-xs text-[#8f8f8f]">{relArticle.category}</div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Related Articles Section */}
        {relatedArticles && relatedArticles.length > 0 && (
          <section className="mt-16">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#333] flex items-center gap-2">
                <span className="w-1 h-8 bg-[#00833e] rounded-full"></span>
                Benzer Yazılar
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relArticle: any) => (
                <Link
                  key={relArticle.id}
                  href={`/blog/${relArticle.slug}`}
                  className="group"
                >
                  <div className="h-full bg-white rounded-lg border border-[#e0e0e0] overflow-hidden hover:border-[#00833e] hover:shadow-lg transition-all duration-200">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-gray-200">
                      <Image
                        src={relArticle.image}
                        alt={relArticle.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col">
                      <span className="inline-block bg-[#00833e]/10 text-[#00833e] px-2 py-1 rounded-full text-xs font-semibold mb-3 w-fit">
                        {relArticle.category}
                      </span>
                      <h3 className="text-lg font-bold text-[#333] group-hover:text-[#00833e] transition-colors line-clamp-2 mb-3">
                        {relArticle.title}
                      </h3>
                      <p className="text-sm text-[#8f8f8f] line-clamp-2 mb-4 flex-grow">
                        {relArticle.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-[#00833e] font-semibold text-sm group-hover:gap-3 transition-all">
                        Yazıyı Oku
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="mt-16 p-8 md:p-12 bg-gradient-to-br from-[#00833e] to-[#006b32] rounded-lg text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            KomşuApp Topluluğuna Katılın
          </h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            Mahallenizdeki komşularınızla tanışın, bilgi paylaşın ve birlikte güçlü bir topluluk oluşturun.
          </p>
          <button className="px-8 py-3 bg-white text-[#00833e] rounded-lg font-bold hover:bg-green-50 transition-colors">
            Hemen Başla
          </button>
        </section>
      </div>

      {/* Comment Section */}
      <section className="bg-white border-t border-[#e0e0e0] mt-12">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-[#333] mb-8">Yorumlar</h2>
          <div className="max-w-2xl">
            <div className="mb-8 p-6 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0]">
              <textarea
                placeholder="Düşüncelerinizi paylaşın..."
                className="w-full p-4 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#00833e] resize-none"
                rows={4}
              />
              <button className="mt-4 px-6 py-2 bg-[#00833e] text-white rounded-lg hover:bg-[#006b32] transition-colors font-medium">
                Yorum Gönder
              </button>
            </div>
            <div className="space-y-6">
              <div className="pb-6 border-b border-[#e0e0e0]">
                <div className="flex gap-4 mb-3">
                  <Image
                    src="https://picsum.photos/40/40?random=201"
                    alt="Yorum Yazarı"
                    width={40}
                    height={40}
                    unoptimized
                    className="rounded-full"
                  />
                  <div className="flex-grow">
                    <h4 className="font-semibold text-[#333]">Merve Sarı</h4>
                    <p className="text-xs text-[#8f8f8f]">3 gün önce</p>
                  </div>
                </div>
                <p className="text-[#404040]">
                  Harika bir yazı! Mahallede uygulamaya koyacak çok pratik bilgiler var.
                </p>
              </div>
              <div className="pb-6 border-b border-[#e0e0e0]">
                <div className="flex gap-4 mb-3">
                  <Image
                    src="https://picsum.photos/40/40?random=202"
                    alt="Yorum Yazarı"
                    width={40}
                    height={40}
                    unoptimized
                    className="rounded-full"
                  />
                  <div className="flex-grow">
                    <h4 className="font-semibold text-[#333]">Oğuzhan Kılıç</h4>
                    <p className="text-xs text-[#8f8f8f]">1 hafta önce</p>
                  </div>
                </div>
                <p className="text-[#404040]">
                  Komşularımla bu yazıyı paylaştım ve çok olumlu tepkiler aldık. Teşekkürler!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
