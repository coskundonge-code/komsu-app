"use client";

import { useState } from "react";
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
    coverImage: "https://picsum.photos/400/250?random=1",
    logo: "https://picsum.photos/80/80?random=11",
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
    coverImage: "https://picsum.photos/400/250?random=2",
    logo: "https://picsum.photos/80/80?random=12",
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
    coverImage: "https://picsum.photos/400/250?random=3",
    logo: "https://picsum.photos/80/80?random=13",
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
    coverImage: "https://picsum.photos/400/250?random=4",
    logo: "https://picsum.photos/80/80?random=14",
    isFavorite: false,
  },
  {
    id: "5",
    name: "Işık Veteriner Kliniği",
    category: "Sağlık",
    rating: 4.9,
    recommendations: 124,
    distance: "1.5 km",
    coverImage: "https://picsum.photos/400/250?random=5",
    logo: "https://picsum.photos/80/80?random=15",
    isFavorite: true,
  },
  {
    id: "6",
    name: "Kahve Dünyası Kafe",
    category: "Restoranlar",
    rating: 4.4,
    recommendations: 198,
    distance: "0.6 km",
    coverImage: "https://picsum.photos/400/250?random=6",
    logo: "https://picsum.photos/80/80?random=16",
    isFavorite: false,
  },
  {
    id: "7",
    name: "Aslan Pizza & Pasta",
    category: "Restoranlar",
    rating: 4.7,
    recommendations: 412,
    distance: "0.9 km",
    coverImage: "https://picsum.photos/400/250?random=7",
    logo: "https://picsum.photos/80/80?random=17",
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
    coverImage: "https://picsum.photos/400/250?random=8",
    logo: "https://picsum.photos/80/80?random=18",
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
    coverImage: "https://picsum.photos/400/250?random=9",
    logo: "https://picsum.photos/80/80?random=19",
    isFavorite: false,
  },
  {
    id: "10",
    name: "Dr. Ahmet Sağlık Merkezi",
    category: "Sağlık",
    rating: 4.5,
    recommendations: 203,
    distance: "1.1 km",
    coverImage: "https://picsum.photos/400/250?random=10",
    logo: "https://picsum.photos/80/80?random=20",
    isFavorite: true,
  },
  {
    id: "11",
    name: "Özdemir Gıda Pazarı",
    category: "Restoranlar",
    rating: 4.4,
    recommendations: 145,
    distance: "0.7 km",
    coverImage: "https://picsum.photos/400/250?random=11",
    logo: "https://picsum.photos/80/80?random=21",
    isFavorite: false,
  },
  {
    id: "12",
    name: "Osman Dönerci",
    category: "Restoranlar",
    rating: 4.8,
    recommendations: 567,
    distance: "1.3 km",
    coverImage: "https://picsum.photos/400/250?random=12",
    logo: "https://picsum.photos/80/80?random=22",
    isFavorite: true,
    isPopular: true,
  },
];

export default function FavorilerPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [sortBy, setSortBy] = useState("recommendations");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState(
    BUSINESSES.reduce(
      (acc, business) => {
        if (business.isFavorite) {
          acc[business.id] = true;
        }
        return acc;
      },
      {} as Record<string, boolean>
    )
  );

  const filteredBusinesses = BUSINESSES.filter((business) => {
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

  const popularBusinesses = BUSINESSES.filter((b) => b.isPopular).sort(
    (a, b) => b.recommendations - a.recommendations
  );

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-[#e0e0e0] focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e]/20 bg-white text-[#333] font-medium"
            />
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-3 flex-wrap">
            <ArrowUpDown size={20} className="text-[#00833e]" />
            <span className="font-semibold text-[#333]">Sırala:</span>
            <div className="flex gap-2 flex-wrap">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
                    sortBy === option.id
                      ? "bg-[#00833e] text-white border border-[#00833e]"
                      : "bg-white text-[#404040] border border-[#e0e0e0] hover:border-[#00833e] hover:text-[#00833e]"
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
              <h2 className="text-3xl font-bold text-[#333]">
                En Çok Tavsiye Edilen İşletmeler
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularBusinesses.map((business) => (
                <div
                  key={business.id}
                  className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white hover:border-[#00833e] border border-[#e0e0e0] h-full flex flex-col"
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
                    <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full flex items-center gap-1">
                      <TrendingUp size={14} style={{ color: "#00833e" }} />
                      <span className="text-xs font-bold text-[#00833e]">
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
                        <h3 className="font-bold text-base text-[#333] line-clamp-2">
                          {business.name}
                        </h3>
                        <p className="text-xs text-[#8f8f8f]">
                          {business.category}
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-0.5">
                        {renderStars(business.rating)}
                      </div>
                      <span className="font-bold text-sm text-[#333]">
                        {business.rating}
                      </span>
                    </div>

                    {/* Recommendations Count */}
                    <div className="flex items-center gap-2 mb-3">
                      <ThumbsUp
                        size={16}
                        className="text-[#00833e] flex-shrink-0"
                      />
                      <span className="text-sm font-semibold text-[#333]">
                        {business.recommendations} Komşu Tavsiye Etti
                      </span>
                    </div>

                    {/* Distance */}
                    <div className="flex items-center gap-1 mb-4">
                      <MapPin size={16} className="text-[#00833e] flex-shrink-0" />
                      <span className="text-xs text-[#8f8f8f]">
                        {business.distance}
                      </span>
                    </div>

                    {/* Button */}
                    <button
                      style={{
                        backgroundColor: "#00833e",
                        color: "#ffffff",
                      }}
                      className="w-full py-2 px-3 rounded-lg font-bold text-sm transition-all hover:bg-[#006b32]"
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
            <Filter size={24} className="text-[#00833e]" />
            <h3 className="text-xl font-bold text-[#333]">Kategorilere Göre Filtrele</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 border ${
                  selectedCategory === category
                    ? "bg-[#00833e] text-white border-[#00833e]"
                    : "bg-white text-[#404040] border-[#e0e0e0] hover:border-[#00833e] hover:text-[#00833e]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Business Grid - 8+ Items */}
        <section>
          <h2 className="text-3xl font-bold text-[#333] mb-8 flex items-center gap-3">
            <span className="w-1 h-10 bg-[#00833e] rounded-full"></span>
            {selectedCategory === "Tümü"
              ? "Tüm Mahalle Favorileri"
              : `${selectedCategory} İşletmeleri`}
          </h2>

          {sortedBusinesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedBusinesses.map((business) => (
                <div
                  key={business.id}
                  className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white hover:border-[#00833e] border border-[#e0e0e0] h-full flex flex-col"
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
                      <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full">
                        <span className="text-xs font-bold text-[#00833e]">
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
                        <h3 className="font-bold text-base text-[#333] line-clamp-2">
                          {business.name}
                        </h3>
                        <p className="text-xs text-[#8f8f8f]">
                          {business.category}
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-0.5">
                        {renderStars(business.rating)}
                      </div>
                      <span className="font-bold text-sm text-[#333]">
                        {business.rating}
                      </span>
                    </div>

                    {/* Recommendations Count */}
                    <div className="flex items-center gap-2 mb-3">
                      <ThumbsUp
                        size={16}
                        className="text-[#00833e] flex-shrink-0"
                      />
                      <span className="text-sm font-semibold text-[#333]">
                        {business.recommendations} Komşu Tavsiye Etti
                      </span>
                    </div>

                    {/* Distance */}
                    <div className="flex items-center gap-1 mb-4">
                      <MapPin size={16} className="text-[#00833e] flex-shrink-0" />
                      <span className="text-xs text-[#8f8f8f]">
                        {business.distance}
                      </span>
                    </div>

                    {/* Button */}
                    <button
                      style={{
                        backgroundColor: "#00833e",
                        color: "#ffffff",
                      }}
                      className="w-full py-2 px-3 rounded-lg font-bold text-sm transition-all hover:bg-[#006b32]"
                    >
                      Tavsiye Et
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-[#e0e0e0]">
              <div className="text-[#8f8f8f] text-lg font-semibold mb-2">
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
