"use client";

import { useState, useEffect } from "react";
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images'
import {
  Search,
  Star,
  Heart,
  MapPin,
  TrendingUp,
  ThumbsUp,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Business {
  id: string;
  name: string;
  category: string;
  rating: number;
  recommendations: number;
  distance: string;
  coverImage: string;
  logo: string;
  isFavorite?: boolean;
  isPopular?: boolean;
}

const CATEGORIES = [
  "Tümü",
  "Restoranlar",
  "Tamirciler",
  "Temizlik",
  "Sağlık",
  "Eğitim",
];

const SORT_OPTIONS = [
  { id: "recommendations", label: "En Çok Tavsiye" },
  { id: "distance", label: "En Yakın" },
  { id: "newest", label: "En Yeni" },
];

const BUSINESSES: Business[] = [
  {
    id: "1",
    name: "Anadolu Tandır Evi",
    category: "Restoranlar",
    rating: 4.8,
    recommendations: 243,
    distance: "0.5 km",
    coverImage: getFeedImageUrl(1, 400, 250),
    logo: getFeedImageUrl(11, 80, 80),
    isFavorite: true,
    isPopular: true,
  },
  {
    id: "2",
    name: "Yeşil Market Süpermarket",
    category: "Restoranlar",
    rating: 4.6,
    recommendations: 187,
    distance: "0.3 km",
    coverImage: getFeedImageUrl(2, 400, 250),
    logo: getFeedImageUrl(12, 80, 80),
    isFavorite: true,
    isPopular: true,
  },
  {
    id: "3",
    name: "Sultan Berber & Kuaför",
    category: "Temizlik",
    rating: 4.7,
    recommendations: 156,
    distance: "0.8 km",
    coverImage: getFeedImageUrl(3, 400, 250),
    logo: getFeedImageUrl(13, 80, 80),
    isFavorite: true,
    isPopular: true,
  },
  {
    id: "4",
    name: "Hızlı Elektrik Tamirciliği",
    category: "Tamirciler",
    rating: 4.5,
    recommendations: 89,
    distance: "1.2 km",
    coverImage: getFeedImageUrl(4, 400, 250),
    logo: getFeedImageUrl(14, 80, 80),
    isFavorite: false,
  },
  {
    id: "5",
    name: "Işık Veteriner Kliniği",
    category: "Sağlık",
    rating: 4.9,
    recommendations: 124,
    distance: "1.5 km",
    coverImage: getFeedImageUrl(5, 400, 250),
    logo: getFeedImageUrl(15, 80, 80),
    isFavorite: true,
  },
  {
    id: "6",
    name: "Kahve Dünyası Kafe",
    category: "Restoranlar",
    rating: 4.4,
    recommendations: 198,
    distance: "0.6 km",
    coverImage: getFeedImageUrl(6, 400, 250),
    logo: getFeedImageUrl(16, 80, 80),
    isFavorite: false,
  },
  {
    id: "7",
    name: "Aslan Pizza & Pasta",
    category: "Restoranlar",
    rating: 4.7,
    recommendations: 412,
    distance: "0.9 km",
    coverImage: getFeedImageUrl(7, 400, 250),
    logo: getFeedImageUrl(17, 80, 80),
    isFavorite: true,
    isPopular: true,
  },
  {
    id: "8",
    name: "Yüksek Eğitim Merkezi",
    category: "Eğitim",
    rating: 4.8,
    recommendations: 267,
    distance: "0.4 km",
    coverImage: getFeedImageUrl(8, 400, 250),
    logo: getFeedImageUrl(18, 80, 80),
    isFavorite: true,
    isPopular: true,
  },
  {
    id: "9",
    name: "Çankırı Temizlik Hizmetleri",
    category: "Temizlik",
    rating: 4.6,
    recommendations: 92,
    distance: "2.0 km",
    coverImage: getFeedImageUrl(9, 400, 250),
    logo: getFeedImageUrl(19, 80, 80),
    isFavorite: false,
  },
  {
    id: "10",
    name: "Dr. Ahmet Sağlık Merkezi",
    category: "Sağlık",
    rating: 4.5,
    recommendations: 203,
    distance: "1.1 km",
    coverImage: getFeedImageUrl(10, 400, 250),
    logo: getFeedImageUrl(20, 80, 80),
    isFavorite: true,
  },
  {
    id: "11",
    name: "Özdemir Gıda Pazarı",
    category: "Restoranlar",
    rating: 4.4,
    recommendations: 145,
    distance: "0.7 km",
    coverImage: getFeedImageUrl(11, 400, 250),
    logo: getFeedImageUrl(21, 80, 80),
    isFavorite: false,
  },
  {
    id: "12",
    name: "Osman Dönerci",
    category: "Restoranlar",
    rating: 4.8,
    recommendations: 567,
    distance: "1.3 km",
    coverImage: getFeedImageUrl(12, 400, 250),
    logo: getFeedImageUrl(22, 80, 80),
    isFavorite: true,
    isPopular: true,
  },
];

export default function FavorilerPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [sortBy, setSortBy] = useState("recommendations");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [businessesData, setBusinessesData] = useState(BUSINESSES);
  const [loading, setLoading] = useState(true);

  // Fetch user's favorited listings from Supabase
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const supabase = createClient() as any;
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        // Fetch user's favorites from listing_favorites table
        const { data: favoriteData, error } = await (supabase as any)
          .from('listing_favorites')
          .select('listing_id')
          .eq('user_id', user.id);

        if (error) {
          console.warn('Error fetching favorites:', error);
          // Fallback to mock data
          const mockFavorites = BUSINESSES.reduce(
            (acc, business) => {
              if (business.isFavorite) {
                acc[business.id] = true;
              }
              return acc;
            },
            {} as Record<string, boolean>
          );
          setFavorites(mockFavorites);
        } else if (favoriteData) {
          // Convert favorite listings to favorites map
          const favMap: Record<string, boolean> = {};
          (favoriteData as any[]).forEach((fav: any) => {
            favMap[fav.listing_id] = true;
          });
          setFavorites(favMap);
        }
      } catch (err) {
        console.error('Error:', err);
        // Fallback to mock data
        const mockFavorites = BUSINESSES.reduce(
          (acc, business) => {
            if (business.isFavorite) {
              acc[business.id] = true;
            }
            return acc;
          },
          {} as Record<string, boolean>
        );
        setFavorites(mockFavorites);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

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
    } else if (sortBy === "distance") {
      return parseFloat(a.distance) - parseFloat(b.distance);
    }
    return 0;
  });

  const popularBusinesses = businessesData.filter((b) => b.isPopular).sort(
    (a, b) => b.recommendations - a.recommendations
  );

  const toggleFavorite = async (id: string) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    // Update in Supabase
    try {
      const supabase = createClient() as any;
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      if (favorites[id]) {
        // Remove from favorites
        await (supabase as any)
          .from('listing_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', id);
      } else {
        // Add to favorites
        await (supabase as any)
          .from('listing_favorites')
          .insert({
            user_id: user.id,
            listing_id: id,
          });
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          size={16}
          className="fill-yellow-400 text-yellow-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          size={16}
          className="text-yellow-400"
          style={{
            background: "linear-gradient(90deg, #facc15 50%, #e5e7eb 50%)",
          }}
        />
      );
    }

    for (let i = stars.length; i < 5; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          size={16}
          className="text-gray-300"
        />
      );
    }

    return stars;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f0f2f5" }}>
      {/* Hero Section with Gradient */}
      <div
        style={{
          background: `linear-gradient(135deg, #00833e 0%, #006b32 100%)`,
        }}
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
            Komşularınız tarafından en çok tavsiye edilen restoranlar, temizlik hizmetleri, tamirciler ve daha fazlası. Mahallenizdeki en güvenilir işletmeleri keşfedin.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Sort Controls */}
        <div className="mb-12 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
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
              {popularBusinesses.map((business) => (
                <div
                  key={business.id}
                  className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-surface hover:border-primary border border-border h-full flex flex-col"
                >
                  {/* Cover Image */}
                  <div className="relative h-44 overflow-hidden bg-gray-100">
                    <img
                      src={business.coverImage}
                      alt={business.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => toggleFavorite(business.id)}
                      className="absolute top-3 right-3 p-2 rounded-full transition-colors duration-200"
                      style={{
                        backgroundColor: favorites[business.id]
                          ? "#00833e"
                          : "rgba(255, 255, 255, 0.95)",
                      }}
                    >
                      <Heart
                        size={20}
                        className={
                          favorites[business.id]
                            ? "text-white fill-white"
                            : "text-gray-600"
                        }
                      />
                    </button>
                    <div className="absolute top-3 left-3 bg-surface px-3 py-1 rounded-full flex items-center gap-1">
                      <TrendingUp size={14} style={{ color: "#00833e" }} />
                      <span className="text-xs font-bold text-primary">
                        Popüler
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex gap-3 mb-4">
                      <div className="flex-shrink-0">
                        <img
                          src={business.logo}
                          alt={business.name}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="font-bold text-base text-text-primary line-clamp-2">
                          {business.name}
                        </h3>
                        <p className="text-xs text-text-muted">
                          {business.category}
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-0.5">
                        {renderStars(business.rating)}
                      </div>
                      <span className="font-bold text-sm text-text-primary">
                        {business.rating}
                      </span>
                    </div>

                    {/* Recommendations Count */}
                    <div className="flex items-center gap-2 mb-3">
                      <ThumbsUp
                        size={16}
                        className="text-primary flex-shrink-0"
                      />
                      <span className="text-sm font-semibold text-text-primary">
                        {business.recommendations} Komşu Tavsiye Etti
                      </span>
                    </div>

                    {/* Distance */}
                    <div className="flex items-center gap-1 mb-4">
                      <MapPin size={16} className="text-primary flex-shrink-0" />
                      <span className="text-xs text-text-muted">
                        {business.distance}
                      </span>
                    </div>

                    {/* Button */}
                    <button
                      style={{
                        backgroundColor: "#00833e",
                        color: "#ffffff",
                      }}
                      className="w-full py-2 px-3 rounded-lg font-bold text-sm transition-all hover:bg-primary-hover"
                    >
                      Tavsiye Et
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Filter size={24} className="text-primary" />
            <h3 className="text-xl font-bold text-text-primary">Kategorilere Göre Filtrele</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((category) => (
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

        {/* Business Grid - 8+ Items */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary mb-8 flex items-center gap-3">
            <span className="w-1 h-10 bg-primary rounded-full"></span>
            {selectedCategory === "Tümü"
              ? "Tüm Mahalle Favorileri"
              : `${selectedCategory} İşletmeleri`}
          </h2>

          {sortedBusinesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedBusinesses.map((business) => (
                <div
                  key={business.id}
                  className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-surface hover:border-primary border border-border h-full flex flex-col"
                >
                  {/* Cover Image */}
                  <div className="relative h-44 overflow-hidden bg-gray-100">
                    <img
                      src={business.coverImage}
                      alt={business.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => toggleFavorite(business.id)}
                      className="absolute top-3 right-3 p-2 rounded-full transition-colors duration-200"
                      style={{
                        backgroundColor: favorites[business.id]
                          ? "#00833e"
                          : "rgba(255, 255, 255, 0.95)",
                      }}
                    >
                      <Heart
                        size={20}
                        className={
                          favorites[business.id]
                            ? "text-white fill-white"
                            : "text-gray-600"
                        }
                      />
                    </button>
                    {favorites[business.id] && (
                      <div className="absolute top-3 left-3 bg-surface px-3 py-1 rounded-full">
                        <span className="text-xs font-bold text-primary">
                          Favori
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex gap-3 mb-4">
                      <div className="flex-shrink-0">
                        <img
                          src={business.logo}
                          alt={business.name}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="font-bold text-base text-text-primary line-clamp-2">
                          {business.name}
                        </h3>
                        <p className="text-xs text-text-muted">
                          {business.category}
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-0.5">
                        {renderStars(business.rating)}
                      </div>
                      <span className="font-bold text-sm text-text-primary">
                        {business.rating}
                      </span>
                    </div>

                    {/* Recommendations Count */}
                    <div className="flex items-center gap-2 mb-3">
                      <ThumbsUp
                        size={16}
                        className="text-primary flex-shrink-0"
                      />
                      <span className="text-sm font-semibold text-text-primary">
                        {business.recommendations} Komşu Tavsiye Etti
                      </span>
                    </div>

                    {/* Distance */}
                    <div className="flex items-center gap-1 mb-4">
                      <MapPin size={16} className="text-primary flex-shrink-0" />
                      <span className="text-xs text-text-muted">
                        {business.distance}
                      </span>
                    </div>

                    {/* Button */}
                    <button
                      style={{
                        backgroundColor: "#00833e",
                        color: "#ffffff",
                      }}
                      className="w-full py-2 px-3 rounded-lg font-bold text-sm transition-all hover:bg-primary-hover"
                    >
                      Tavsiye Et
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface rounded-xl border border-border">
              <div className="text-text-muted text-lg font-semibold mb-2">
                Sonuç bulunamadı
              </div>
              <div className="text-[#b0b0b0] text-sm">
                Lütfen kategori veya arama terimini değiştirerek deneyiniz.
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
