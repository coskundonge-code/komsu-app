import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, BookOpen, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'Mahallede Güvenliği Nasıl Artırabiliriz?',
    excerpt: 'Komşuluk bağlantılarını güçlendirerek mahallede güvenlik hissi oluşturmanın pratik yollarını öğrenin.',
    image: 'https://picsum.photos/600/400?random=1',
    author: 'Ayşe Kaya',
    date: '2026-03-08',
    category: 'Güvenlik İpuçları',
    readTime: '5 dk okuma',
  },
  {
    id: 2,
    title: 'KomşuApp Topluluk Yönetimi: En İyi Uygulamalar',
    excerpt: 'Mahalle gruplarını etkili bir şekilde yönetmek ve aktif bir topluluk oluşturmak için ipuçları.',
    image: 'https://picsum.photos/600/400?random=2',
    author: 'Mehmet Demir',
    date: '2026-03-06',
    category: 'Topluluk',
    readTime: '7 dk okuma',
  },
  {
    id: 3,
    title: 'Yerel İşletmecilerin Başarı Hikayeleri',
    excerpt: 'Cihangir Mahallesinde işletmesini KomşuApp sayesinde nasıl büyüttüğünü öğrenin.',
    image: 'https://picsum.photos/600/400?random=3',
    author: 'Zeynep Aydın',
    date: '2026-03-04',
    category: 'İşletme Hikayeleri',
    readTime: '6 dk okuma',
  },
  {
    id: 4,
    title: 'Yeni Özellik: Komşu Yardım Ağı',
    excerpt: 'Mahalle sakinlerinin birbirlerine yardım etmesi için tasarlanmış yeni özelliği keşfet.',
    image: 'https://picsum.photos/600/400?random=4',
    author: 'KomşuApp Ekibi',
    date: '2026-03-01',
    category: 'Uygulama Güncellemeleri',
    readTime: '4 dk okuma',
  },
  {
    id: 5,
    title: 'Beyoğlu Mahallesi: Güvenli Bir Topluluk Hikayesi',
    excerpt: 'Nasıl bir mahalle "en güvenli mahalle" unvanını kazandığını gördük.',
    image: 'https://picsum.photos/600/400?random=5',
    author: 'Ali Yılmaz',
    date: '2026-02-28',
    category: 'Mahalle Haberleri',
    readTime: '8 dk okuma',
  },
  {
    id: 6,
    title: 'Çevrimiçi Güvenlik: Her Mahalle Sakininin Bilmesi Gerekenler',
    excerpt: 'Platformda güvenli kalmanın ve mahallenizdeki mevcut tehditleri tanımanın yolları.',
    image: 'https://picsum.photos/600/400?random=6',
    author: 'Dr. Fatih Özer',
    date: '2026-02-25',
    category: 'Güvenlik İpuçları',
    readTime: '6 dk okuma',
  },
  {
    id: 7,
    title: 'Topluluk Etkinliği: İlk Mahalle Pikniği Başarılı Oldu',
    excerpt: 'Beşiktaş Mahallesi sakinleri ilk kez buluştu ve harika vakit geçirdi.',
    image: 'https://picsum.photos/600/400?random=7',
    author: 'Emine Şahin',
    date: '2026-02-22',
    category: 'Mahalle Haberleri',
    readTime: '5 dk okuma',
  },
  {
    id: 8,
    title: 'KomşuApp Mobilini Hızlı Kullanma İpuçları',
    excerpt: 'Mobil uygulamayı en etkili şekilde kullanmak için hızlı rehberimiz.',
    image: 'https://picsum.photos/600/400?random=8',
    author: 'Seren Tuna',
    date: '2026-02-20',
    category: 'Uygulama Güncellemeleri',
    readTime: '3 dk okuma',
  },
  {
    id: 9,
    title: 'Mahallede Atıl Alanları Topluluk Bahçelerine Dönüştürme',
    excerpt: 'Yeşil alanlar ve topluluk bahçeleri oluşturarak mahallenizi nasıl güzelleştirebilirsiniz?',
    image: 'https://picsum.photos/600/400?random=9',
    author: 'Canan Çelik',
    date: '2026-02-18',
    category: 'Topluluk',
    readTime: '7 dk okuma',
  },
];

const categories = [
  'Mahalle Haberleri',
  'Güvenlik İpuçları',
  'İşletme Hikayeleri',
  'Uygulama Güncellemeleri',
  'Topluluk',
];

const featuredPost = blogPosts[0];
const otherPosts = blogPosts.slice(1);

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#00833e] hover:text-[#006b32] font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Ana Sayfaya Dön
        </Link>

        <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden shadow-sm">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-[#00833e] via-[#00833e] to-[#006b32] p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>

            <div className="relative z-10">
              <BookOpen className="w-20 h-20 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-3">KomşuApp Blog</h1>
              <p className="text-green-100 text-lg">
                Mahalleler, güvenlik ve topluluk hakkında ilham verici hikayeler
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12">
            {/* Featured Post */}
            <section className="mb-12">
              <Link href={`#post-${featuredPost.id}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gradient-to-br from-white to-[#f0f2f5] rounded-lg border border-[#e0e0e0] p-6 hover:border-[#00833e] transition-all duration-200 group cursor-pointer">
                  {/* Image */}
                  <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
                    <Image
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-[#00833e] text-white px-3 py-1 rounded-full text-sm font-medium">
                        Öne Çıkan
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="inline-block bg-[#00833e]/10 text-[#00833e] px-3 py-1 rounded-full text-xs font-semibold mb-3">
                        {featuredPost.category}
                      </div>
                      <h2 className="text-3xl font-bold text-[#333] mb-4 group-hover:text-[#00833e] transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="text-[#404040] leading-relaxed mb-6 text-lg">
                        {featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-4 text-sm text-[#8f8f8f]">
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          {featuredPost.author}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          {new Date(featuredPost.date).toLocaleDateString('tr-TR')}
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen size={16} />
                          {featuredPost.readTime}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[#00833e] font-semibold group-hover:gap-3 transition-all">
                        Yazıyı Oku
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </section>

            {/* Blog Posts Grid */}
            <section>
              <h2 className="text-2xl font-bold text-[#333] mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#00833e] rounded-full"></span>
                Son Yazılar
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherPosts.map((post) => (
                  <Link key={post.id} href={`#post-${post.id}`}>
                    <div className="h-full bg-white rounded-lg border border-[#e0e0e0] overflow-hidden hover:border-[#00833e] transition-all duration-200 group hover:shadow-md">
                      {/* Image */}
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col h-64">
                        <div className="inline-block bg-[#00833e]/10 text-[#00833e] px-2 py-1 rounded-full text-xs font-semibold mb-3 w-fit">
                          {post.category}
                        </div>
                        <h3 className="text-lg font-bold text-[#333] mb-2 line-clamp-2 group-hover:text-[#00833e] transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-[#8f8f8f] mb-4 line-clamp-2 flex-grow">
                          {post.excerpt}
                        </p>

                        <div className="border-t border-[#e0e0e0] pt-3 space-y-2">
                          <div className="flex items-center gap-2 text-xs text-[#8f8f8f]">
                            <User size={14} />
                            {post.author}
                          </div>
                          <div className="flex items-center justify-between text-xs text-[#8f8f8f]">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(post.date).toLocaleDateString('tr-TR')}
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen size={14} />
                              {post.readTime}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Categories Section */}
            <section className="mt-12 p-6 bg-[#f0f2f5] rounded-lg border border-[#e0e0e0]">
              <h3 className="text-lg font-bold text-[#333] mb-4">Kategoriler</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className="px-4 py-2 bg-white border border-[#e0e0e0] rounded-full text-sm text-[#404040] hover:bg-[#00833e] hover:text-white hover:border-[#00833e] transition-colors duration-200"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </section>

            {/* Newsletter Section */}
            <section className="mt-12 p-8 bg-gradient-to-br from-[#00833e]/10 to-[#006b32]/10 rounded-lg border border-[#00833e]/20">
              <div className="max-w-2xl">
                <h3 className="text-2xl font-bold text-[#333] mb-3">
                  En Son Yazılarımızdan Haberdar Olun
                </h3>
                <p className="text-[#404040] mb-4">
                  E-postanızı bırakın ve her hafta yeni blog yazılarını doğrudan aldığınız kutuya alın.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="E-posta adresiniz..."
                    className="flex-1 px-4 py-3 rounded-lg border border-[#e0e0e0] focus:outline-none focus:border-[#00833e]"
                  />
                  <button className="px-6 py-3 bg-[#00833e] text-white rounded-lg font-semibold hover:bg-[#006b32] transition-colors">
                    Abone Ol
                  </button>
                </div>
              </div>
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
                href="/kosullar"
                className="text-sm text-[#00833e] hover:text-[#006b32] font-medium transition-colors"
              >
                Kullanım Koşulları
              </Link>
              <span className="text-[#e0e0e0]">•</span>
              <Link
                href="/yardim"
                className="text-sm text-[#00833e] hover:text-[#006b32] font-medium transition-colors"
              >
                Yardım Merkezi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
