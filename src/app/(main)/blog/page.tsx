"use client";

import Link from "next/link";
import { useState } from "react";
import { getFeedImageUrl } from '@/lib/demo-images'
import {
  ArrowLeft,
  Calendar,
  User,
  BookOpen,
  ArrowRight,
  Filter,
} from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Mahallede Güvenliği Nasıl Artırabiliriz?",
    excerpt:
      "Komşuluk bağlantılarını güçlendirerek mahallede güvenlik hissi oluşturmanın pratik yollarını öğrenin.",
    image: getFeedImageUrl(1, 600, 400),
    author: "Ayşe Kaya",
    date: "2026-03-08",
    category: "Güvenlik",
    readTime: "5 dk okuma",
  },
  {
    id: 2,
    title: "Mahallemiz Yeni Topluluk Özellikleri: Daha İyi Bağlantılar",
    excerpt:
      "Mahalle gruplarını etkili bir şekilde yönetmek ve aktif bir topluluk oluşturmak için yeni araçlarımızı keşfedin.",
    image: getFeedImageUrl(2, 600, 400),
    author: "Mehmet Demir",
    date: "2026-03-06",
    category: "Topluluk",
    readTime: "7 dk okuma",
  },
  {
    id: 3,
    title: "Mahallede Komşu Yardım Ağını Etkin Kullanma",
    excerpt:
      "Komşularınızla yardımlaşmak ve birbirini desteklemek için Mahallemiz'in yardım ağı özelliğini nasıl kullanacağınızı öğrenin.",
    image: getFeedImageUrl(3, 600, 400),
    author: "Zeynep Aydın",
    date: "2026-03-04",
    category: "İpuçları",
    readTime: "6 dk okuma",
  },
  {
    id: 4,
    title: "Günceleme: Geliştirilmiş Mahalle İçeriği Paylaşımı",
    excerpt:
      "Mahalle sakinlerinin birbirlerine yardım etmesi için tasarlanmış yeni güvenlik ve gizlilik özelliklerini keşfet.",
    image: getFeedImageUrl(4, 600, 400),
    author: "Mahallemiz Ekibi",
    date: "2026-03-01",
    category: "Güncellemeler",
    readTime: "4 dk okuma",
  },
  {
    id: 5,
    title: "Cihangir Mahallesi: Topluluk Birliği Başarı Hikayesi",
    excerpt:
      "Nasıl bir mahalle Mahallemiz sayesinde daha güvenli ve bağlı bir topluluk haline geldiğini gördük.",
    image: getFeedImageUrl(5, 600, 400),
    author: "Ali Yılmaz",
    date: "2026-02-28",
    category: "Topluluk",
    readTime: "8 dk okuma",
  },
  {
    id: 6,
    title: "Mahallemiz'de Çevrimiçi Güvenlik ve Gizlilik Rehberi",
    excerpt:
      "Platformda güvenli kalmanın ve mahallenizdeki mevcut tehditleri tanımanın pratik yolları.",
    image: getFeedImageUrl(6, 600, 400),
    author: "Dr. Fatih Özer",
    date: "2026-02-25",
    category: "Güvenlik",
    readTime: "6 dk okuma",
  },
  {
    id: 7,
    title: "Beşiktaş İlk Mahalle Pikniği: Komşuları Bir Araya Getirdi",
    excerpt:
      "Mahalle sakinlerinin ilk kez buluştuğu etkinlikle daha güçlü topluluk bağları oluştu.",
    image: getFeedImageUrl(7, 600, 400),
    author: "Emine Şahin",
    date: "2026-02-22",
    category: "Topluluk",
    readTime: "5 dk okuma",
  },
  {
    id: 8,
    title: "Mahallemiz Mobilini Verimli Kullanma: Pro İpuçları",
    excerpt:
      "Mobil uygulamayı en etkili şekilde kullanarak mahalle bağlantılarınızı yoğunlaştırın.",
    image: getFeedImageUrl(8, 600, 400),
    author: "Seren Tuna",
    date: "2026-02-20",
    category: "İpuçları",
    readTime: "3 dk okuma",
  },
  {
    id: 9,
    title: "Mahallede Yeşil Alan Projesi: Topluluk Bahçesi Kurma Rehberi",
    excerpt:
      "Atıl alanları yeşil bahçelere dönüştürerek mahalle halkını bir araya getirin.",
    image: getFeedImageUrl(9, 600, 400),
    author: "Canan Çelik",
    date: "2026-02-18",
    category: "İpuçları",
    readTime: "7 dk okuma",
  },
  {
    id: 10,
    title: "Mahallede Yeni Komşuları Tanıma: Sosyal Rehberi",
    excerpt:
      "Mahalle topluluğunu genişletmek ve yeni komşularla sağlıklı ilişkiler kurmak için stratejiler.",
    image: getFeedImageUrl(10, 600, 400),
    author: "Hakan Özdemir",
    date: "2026-02-15",
    category: "Topluluk",
    readTime: "5 dk okuma",
  },
  {
    id: 11,
    title: "Mahallede Güvenlik Gözetim Sistemi Kurma Tartışması",
    excerpt:
      "Mahallenin güvenliğini artırmak için yapılacak ortak çalışmalar ve hukuki çerçeve.",
    image: getFeedImageUrl(11, 600, 400),
    author: "Murat Kaplan",
    date: "2026-02-12",
    category: "Güvenlik",
    readTime: "8 dk okuma",
  },
  {
    id: 12,
    title: "Mahallemiz İpuçları: Daha Etkili İçerik Paylaşımı",
    excerpt:
      "Mahalle haberlerinizi nasıl daha geniş bir kitleye ulaştıracağınızı ve katılımı nasıl artıracağınızı öğrenin.",
    image: getFeedImageUrl(12, 600, 400),
    author: "Leyla Şener",
    date: "2026-02-10",
    category: "İpuçları",
    readTime: "4 dk okuma",
  },
];

const categories = ["Tümü", "Güncellemeler", "Topluluk", "İpuçları", "Güvenlik"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  const featuredPost = blogPosts[0];

  const filteredPosts =
    selectedCategory === "Tümü"
      ? blogPosts.slice(1)
      : blogPosts.slice(1).filter((post) => post.category === selectedCategory);

  const displayedPosts = filteredPosts.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Gradient */}
      <div className="bg-gradient-to-br from-primary via-[#00833e] to-primary-hover text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -ml-36 -mb-36"></div>

        <div className="max-w-6xl mx-auto px-4 py-20 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-green-100 hover:text-white font-medium mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            Ana Sayfaya Dön
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <BookOpen size={32} />
            <h1 className="text-5xl font-bold">Mahallemiz Blog</h1>
          </div>
          <p className="text-green-100 text-lg max-w-2xl">
            Mahalleler, güvenlik ve topluluk hakkında ilham verici hikayeler, ipuçları ve güncellemeler
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Featured Post - Large Card */}
        <section className="mb-16">
          <Link href={`#post-${featuredPost.id}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface rounded-xl border border-border p-8 hover:border-primary hover:shadow-lg transition-all duration-300 group cursor-pointer">
              {/* Image */}
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold">
                    Öne Çıkan
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between">
                <div>
                  <span className="inline-block bg-primary/15 text-primary px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
                    {featuredPost.category}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 group-hover:text-primary transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-text-secondary leading-relaxed mb-6 text-lg">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-6 text-sm text-text-muted">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-primary" />
                      <span className="font-medium">{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-primary" />
                      {new Date(featuredPost.date).toLocaleDateString("tr-TR")}
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-primary" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all text-lg">
                    Yazıyı Oku
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* Category Filter Chips */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Filter size={24} className="text-primary" />
            <h3 className="text-xl font-bold text-text-primary">Kategorilere Göre Filtrele</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-200 border ${
                  selectedCategory === category
                    ? "bg-primary text-white border-primary"
                    : "bg-surface text-text-secondary border-border hover:border-primary hover:text-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Blog Posts Grid - 6 Posts */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-text-primary mb-8 flex items-center gap-3">
            <span className="w-1 h-10 bg-primary rounded-full"></span>
            {selectedCategory === "Tümü" ? "Son Yazılar" : `${selectedCategory} Yazıları`}
          </h2>

          {displayedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPosts.map((post) => (
                <Link key={post.id} href={`#post-${post.id}`}>
                  <div className="h-full bg-surface rounded-xl border border-border overflow-hidden hover:border-primary hover:shadow-lg transition-all duration-200 group">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="bg-surface text-primary px-3 py-1 rounded-full text-xs font-bold">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col h-auto">
                      <h3 className="text-lg font-bold text-text-primary mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-text-muted mb-5 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="border-t border-border pt-4 space-y-3 mt-auto">
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <User size={14} className="flex-shrink-0" />
                          <span className="font-medium truncate">{post.author}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-text-muted">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(post.date).toLocaleDateString("tr-TR")}
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
          ) : (
            <div className="text-center py-12 bg-surface rounded-lg border border-border">
              <p className="text-text-muted text-lg">Bu kategoride yazı bulunamadı.</p>
            </div>
          )}
        </section>

        {/* Newsletter Section */}
        <section className="mb-16 p-10 bg-gradient-to-br from-primary/10 to-primary-hover/10 rounded-xl border border-primary/20">
          <div className="max-w-2xl">
            <h3 className="text-3xl font-bold text-text-primary mb-3">
              En Son Yazılarımızdan Haberdar Olun
            </h3>
            <p className="text-text-secondary mb-6 text-lg">
              E-postanızı bırakın ve her hafta yeni blog yazılarını doğrudan aldığınız kutuya alın.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="E-posta adresiniz..."
                className="flex-1 px-4 py-3 rounded-lg border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface"
              />
              <button className="px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition-colors whitespace-nowrap">
                Abone Ol
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="border-t border-border bg-surface rounded-t-lg py-8 px-8 text-center">
          <p className="text-sm text-text-muted mb-6">
            © 2026 Mahallemiz — Consulting Partners tarafından geliştirilmiştir.
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <Link
              href="/gizlilik"
              className="text-sm text-primary hover:text-primary-hover font-medium transition-colors"
            >
              Gizlilik Politikası
            </Link>
            <span className="text-[#e0e0e0]">•</span>
            <Link
              href="/kosullar"
              className="text-sm text-primary hover:text-primary-hover font-medium transition-colors"
            >
              Kullanım Koşulları
            </Link>
            <span className="text-[#e0e0e0]">•</span>
            <Link
              href="/yardim"
              className="text-sm text-primary hover:text-primary-hover font-medium transition-colors"
            >
              Yardım Merkezi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
