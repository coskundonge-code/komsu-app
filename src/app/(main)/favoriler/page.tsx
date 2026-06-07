"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Star,
  TrendingUp,
  ThumbsUp,
  Filter,
  ArrowUpDown,
  Store,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { getBusinesses } from "@/lib/hooks/use-groups-businesses";

// NOT (2026-06-07): Bu sayfa eskiden 12 sahte işletme (BUSINESSES + getFeedImageUrl)
// gösteriyordu ve favori durumunu kasıtlı bozuk bir sorguyla (.limit(0)) mock'a
// düşürerek taklit ediyordu. `listing_favorites`/favori tablosu YOK; bu yüzden
// kalıcı "favori" işlevi taklit edilmez. Sayfa artık gerçek `businesses` tablosuna
// bağlı: en çok tavsiye edilen / puanı yüksek işletmeleri listeler. Bkz. TECH_DEBT #12.

interface Business {
  id: string;
  slug: string;
  name: string;
  category: string;
  rating: number;
  recommendations: number;
  reviewCount: number;
  coverImage: string | null;
  logo: string | null;
  isVerified: boolean;
}

const SORT_OPTIONS = [
  { id: "recommendations", label: "En Çok Tavsiye" },
  { id: "rating", label: "En Yüksek Puan" },
  { id: "newest", label: "En Yeni" },
];

function mapBusinessRow(b: any): Business {
  return {
    id: b.id,
    slug: b.slug,
    name: b.name,
    category: b.business_categories?.name || "Diğer",
    rating: Number(b.rating_avg) || 0,
    recommendations: b.recommendation_count || 0,
    reviewCount: b.review_count || 0,
    coverImage: b.cover_url || null,
    logo: b.logo_url || null,
    isVerified: !!b.is_verified,
  };
}

export default function FavorilerPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [sortBy, setSortBy] = useState("recommendations");
  const [searchQuery, setSearchQuery] = useState("");
  const [businessesData, setBusinessesData] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchBusinesses() {
      setLoading(true);
      const { data, error } = await getBusinesses({ limit: 100 });
      if (cancelled) return;
      if (data && !error) {
        setBusinessesData((data as any[]).map(mapBusinessRow));
      }
      setLoading(false);
    }
    fetchBusinesses();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = ["Tümü", ...Array.from(new Set(businessesData.map((b) => b.category)))];

  const filteredBusinesses = businessesData.filter((business) => {
    const categoryMatch =
      selectedCategory === "Tümü" || business.category === selectedCategory;
    const searchMatch =
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.category.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    if (sortBy === "recommendations") {
      return b.recommendations - a.recommendations;
    } else if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    return 0; // "newest": getBusinesses zaten created_at'e göre geliyor
  });

  const popularBusinesses = businessesData
    .filter((b) => b.recommendations > 0)
    .sort((a, b) => b.recommendations - a.recommendations)
    .slice(0, 4);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} size={16} className="fill-yellow-400 text-yellow-400" />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          size={16}
          className="text-yellow-400"
          style={{ background: "linear-gradient(90deg, #facc15 50%, #e5e7eb 50%)" }}
        />
      );
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} className="text-gray-300" />);
    }
    return stars;
  };

  const renderCard = (business: Business, badge?: "popular" | null) => (
    <Link
      key={business.id}
      href={`/isletmeler/${business.slug}`}
      className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-surface hover:border-primary border border-border h-full flex flex-col group"
    >
      {/* Cover Image */}
      <div className="relative h-44 overflow-hidden bg-gray-100">
        {business.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={business.coverImage}
            alt={business.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/15 to-primary/5">
            <Store size={40} className="text-primary/50" />
          </div>
        )}
        {badge === "popular" && (
          <div className="absolute top-3 left-3 bg-surface px-3 py-1 rounded-full flex items-center gap-1">
            <TrendingUp size={14} style={{ color: "#00833e" }} />
            <span className="text-xs font-bold text-primary">Popüler</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex gap-3 mb-4">
          <div className="flex-shrink-0">
            {business.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={business.logo}
                alt={business.name}
                className="w-14 h-14 rounded-lg object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-primary flex items-center justify-center text-white text-xl font-bold">
                {business.name?.[0]?.toUpperCase() || "?"}
              </div>
            )}
          </div>
          <div className="flex-grow min-w-0">
            <h3 className="font-bold text-base text-text-primary line-clamp-2 flex items-center gap-1">
              {business.name}
              {business.isVerified && (
                <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
              )}
            </h3>
            <p className="text-xs text-text-muted">{business.category}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-0.5">{renderStars(business.rating)}</div>
          <span className="font-bold text-sm text-text-primary">
            {business.rating > 0 ? business.rating.toFixed(1) : "—"}
          </span>
          {business.reviewCount > 0 && (
            <span className="text-xs text-text-muted">({business.reviewCount} değerlendirme)</span>
          )}
        </div>

        {/* Recommendations Count */}
        <div className="flex items-center gap-2 mb-4">
          <ThumbsUp size={16} className="text-primary flex-shrink-0" />
          <span className="text-sm font-semibold text-text-primary">
            {business.recommendations > 0
              ? `${business.recommendations} Komşu Tavsiye Etti`
              : "Henüz tavsiye yok"}
          </span>
        </div>

        {/* Button */}
        <span className="mt-auto w-full py-2 px-3 rounded-lg font-bold text-sm transition-all bg-primary text-white text-center group-hover:bg-primary-hover">
          İncele
        </span>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f0f2f5" }}>
      {/* Hero Section with Gradient */}
      <div
        style={{ background: `linear-gradient(135deg, #00833e 0%, #006b32 100%)` }}
        className="text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -ml-36 -mb-36"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={32} />
            <h1 className="text-5xl font-bold">Mahalle Favorileri</h1>
          </div>
          <p className="text-green-100 text-xl max-w-2xl">
            Komşularınız tarafından en çok tavsiye edilen işletmeler. Mahallenizdeki en güvenilir adresleri keşfedin.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-text-muted">İşletmeler yükleniyor…</p>
          </div>
        ) : businessesData.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-xl border border-border">
            <Store size={48} className="mx-auto text-text-muted mb-4" />
            <div className="text-text-primary text-lg font-semibold mb-2">Henüz işletme yok</div>
            <div className="text-text-muted text-sm">
              Mahallendeki işletmeler eklendikçe burada listelenecek.
            </div>
          </div>
        ) : (
          <>
            {/* Search and Sort Controls */}
            <div className="mb-12 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="İşletme adı veya kategori ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface text-text-primary font-medium"
                />
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-3 flex-wrap">
                <ArrowUpDown size={20} className="text-primary" />
                <span className="font-semibold text-text-primary">Sırala:</span>
                <div className="flex gap-2 flex-wrap">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSortBy(option.id)}
                      className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
                        sortBy === option.id
                          ? "bg-primary text-white border border-primary"
                          : "bg-surface text-text-secondary border border-border hover:border-primary hover:text-primary"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Popular/Featured Section */}
            {popularBusinesses.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <TrendingUp size={28} style={{ color: "#00833e" }} />
                  <h2 className="text-3xl font-bold text-text-primary">
                    En Çok Tavsiye Edilen İşletmeler
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {popularBusinesses.map((business) => renderCard(business, "popular"))}
                </div>
              </section>
            )}

            {/* Category Filter */}
            {categories.length > 1 && (
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
                      className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 border ${
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
            )}

            {/* Business Grid */}
            <section>
              <h2 className="text-3xl font-bold text-text-primary mb-8 flex items-center gap-3">
                <span className="w-1 h-10 bg-primary rounded-full"></span>
                {selectedCategory === "Tümü"
                  ? "Tüm Mahalle Favorileri"
                  : `${selectedCategory} İşletmeleri`}
              </h2>

              {sortedBusinesses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {sortedBusinesses.map((business) => renderCard(business, null))}
                </div>
              ) : (
                <div className="text-center py-16 bg-surface rounded-xl border border-border">
                  <div className="text-text-muted text-lg font-semibold mb-2">Sonuç bulunamadı</div>
                  <div className="text-[#b0b0b0] text-sm">
                    Lütfen kategori veya arama terimini değiştirerek deneyiniz.
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
