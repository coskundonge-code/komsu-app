'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Star, Heart, MessageCircle, MapPin, TrendingUp } from 'lucide-react';

interface Business {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  distance: string;
  coverImage: string;
  logo: string;
  isFavorite?: boolean;
  isTopRecommended?: boolean;
}

const CATEGORIES = ['Tümü', 'Restoran', 'Market', 'Kuaför', 'Tamirci', 'Veteriner', 'Kafe', 'Berber', 'Pizza', 'Bakkal'];

const BUSINESSES: Business[] = [
  {
    id: '1',
    name: 'Anadolu Tandır Evi',
    category: 'Restoran',
    rating: 4.8,
    reviews: 342,
    distance: '0.5 km',
    coverImage: 'https://picsum.photos/400/250?random=1',
    logo: 'https://picsum.photos/80/80?random=11',
    isFavorite: true,
    isTopRecommended: true,
  },
  {
    id: '2',
    name: 'Yeşil Market Süpermarket',
    category: 'Market',
    rating: 4.6,
    reviews: 287,
    distance: '0.3 km',
    coverImage: 'https://picsum.photos/400/250?random=2',
    logo: 'https://picsum.photos/80/80?random=12',
    isFavorite: true,
    isTopRecommended: true,
  },
  {
    id: '3',
    name: 'Sultan Berber & Kuaför',
    category: 'Kuaför',
    rating: 4.7,
    reviews: 156,
    distance: '0.8 km',
    coverImage: 'https://picsum.photos/400/250?random=3',
    logo: 'https://picsum.photos/80/80?random=13',
    isFavorite: true,
    isTopRecommended: true,
  },
  {
    id: '4',
    name: 'Hızlı Elektrik Tamirciliği',
    category: 'Tamirci',
    rating: 4.5,
    reviews: 89,
    distance: '1.2 km',
    coverImage: 'https://picsum.photos/400/250?random=4',
    logo: 'https://picsum.photos/80/80?random=14',
    isFavorite: false,
  },
  {
    id: '5',
    name: 'Işık Veteriner Kliniği',
    category: 'Veteriner',
    rating: 4.9,
    reviews: 124,
    distance: '1.5 km',
    coverImage: 'https://picsum.photos/400/250?random=5',
    logo: 'https://picsum.photos/80/80?random=15',
    isFavorite: true,
  },
  {
    id: '6',
    name: 'Kahve Dünyası Kafe',
    category: 'Kafe',
    rating: 4.4,
    reviews: 198,
    distance: '0.6 km',
    coverImage: 'https://picsum.photos/400/250?random=6',
    logo: 'https://picsum.photos/80/80?random=16',
    isFavorite: false,
  },
  {
    id: '7',
    name: 'Aslan Pizza & Pasta',
    category: 'Pizza',
    rating: 4.7,
    reviews: 412,
    distance: '0.9 km',
    coverImage: 'https://picsum.photos/400/250?random=7',
    logo: 'https://picsum.photos/80/80?random=17',
    isFavorite: true,
  },
  {
    id: '8',
    name: 'Köşe Bakkal',
    category: 'Bakkal',
    rating: 4.3,
    reviews: 67,
    distance: '0.4 km',
    coverImage: 'https://picsum.photos/400/250?random=8',
    logo: 'https://picsum.photos/80/80?random=18',
    isFavorite: false,
  },
  {
    id: '9',
    name: 'Çankırı Temizlik Hizmetleri',
    category: 'Hizmet',
    rating: 4.6,
    reviews: 92,
    distance: '2.0 km',
    coverImage: 'https://picsum.photos/400/250?random=9',
    logo: 'https://picsum.photos/80/80?random=19',
    isFavorite: false,
  },
  {
    id: '10',
    name: 'Modern Kuaför Salonu',
    category: 'Kuaför',
    rating: 4.5,
    reviews: 203,
    distance: '1.1 km',
    coverImage: 'https://picsum.photos/400/250?random=10',
    logo: 'https://picsum.photos/80/80?random=20',
    isFavorite: true,
  },
  {
    id: '11',
    name: 'Özdemir Gıda Pazarı',
    category: 'Market',
    rating: 4.4,
    reviews: 145,
    distance: '0.7 km',
    coverImage: 'https://picsum.photos/400/250?random=11',
    logo: 'https://picsum.photos/80/80?random=21',
    isFavorite: false,
  },
  {
    id: '12',
    name: 'Osman Dönerci',
    category: 'Restoran',
    rating: 4.8,
    reviews: 567,
    distance: '1.3 km',
    coverImage: 'https://picsum.photos/400/250?random=12',
    logo: 'https://picsum.photos/80/80?random=22',
    isFavorite: true,
  },
];

export default function FavorilerPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(
    BUSINESSES.reduce((acc, business) => {
      if (business.isFavorite) {
        acc[business.id] = true;
      }
      return acc;
    }, {} as Record<string, boolean>)
  );

  const filteredBusinesses = BUSINESSES.filter((business) => {
    const categoryMatch = selectedCategory === 'Tümü' || business.category === selectedCategory;
    const searchMatch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.category.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const topRecommendedBusinesses = BUSINESSES.filter((b) => b.isTopRecommended).sort(
    (a, b) => b.reviews - a.reviews
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
            background: 'linear-gradient(90deg, #facc15 50%, #e5e7eb 50%)',
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
    <div className="min-h-screen" style={{ backgroundColor: '#f0f2f5' }}>
      {/* Header with Gradient */}
      <div
        style={{
          background: `linear-gradient(135deg, #00833e 0%, #006b32 100%)`,
        }}
        className="text-white py-6 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Mahalle Favorileri</h1>
          <p className="text-green-100">En çok sevilen işletmeleri keşfet</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="İşletme veya kategori ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border"
              style={{
                borderColor: '#e0e0e0',
                backgroundColor: '#ffffff',
                color: '#333',
              }}
            />
          </div>
        </div>

        {/* Top Recommended Section */}
        {topRecommendedBusinesses.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={24} style={{ color: '#00833e' }} />
              <h2 className="text-2xl font-bold" style={{ color: '#333' }}>
                Bu Ay En Çok Önerilen
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topRecommendedBusinesses.map((business) => (
                <div
                  key={business.id}
                  className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
                  style={{ borderColor: '#e0e0e0' }}
                >
                  {/* Cover Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={business.coverImage}
                      alt={business.name}
                      width={400}
                      height={250}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => toggleFavorite(business.id)}
                        className="p-2 rounded-full transition-colors duration-200"
                        style={{
                          backgroundColor: favorites[business.id] ? '#00833e' : 'rgba(255, 255, 255, 0.9)',
                        }}
                      >
                        <Heart
                          size={20}
                          className={favorites[business.id] ? 'text-white fill-white' : 'text-gray-600'}
                        />
                      </button>
                    </div>
                    <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full flex items-center gap-1">
                      <TrendingUp size={14} style={{ color: '#00833e' }} />
                      <span className="text-xs font-semibold" style={{ color: '#00833e' }}>
                        Öne Çıkan
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex gap-3 mb-3">
                      <div className="flex-shrink-0">
                        <Image
                          src={business.logo}
                          alt={business.name}
                          width={64}
                          height={64}
                          unoptimized
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold text-lg" style={{ color: '#333' }}>
                          {business.name}
                        </h3>
                        <p className="text-sm" style={{ color: '#8f8f8f' }}>
                          {business.category}
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-1">{renderStars(business.rating)}</div>
                      <span className="font-semibold text-sm" style={{ color: '#333' }}>
                        {business.rating}
                      </span>
                      <span className="text-xs" style={{ color: '#8f8f8f' }}>
                        ({business.reviews})
                      </span>
                    </div>

                    {/* Distance */}
                    <div className="flex items-center gap-1 mb-4">
                      <MapPin size={16} style={{ color: '#00833e' }} />
                      <span className="text-sm" style={{ color: '#8f8f8f' }}>
                        {business.distance}
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        style={{
                          backgroundColor: '#00833e',
                          color: '#ffffff',
                        }}
                        className="py-2 px-3 rounded-lg font-semibold text-sm transition-colors hover:bg-opacity-90"
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = '#006b32')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = '#00833e')
                        }
                      >
                        Öner
                      </button>
                      <button
                        style={{
                          borderColor: '#00833e',
                          color: '#00833e',
                          backgroundColor: '#ffffff',
                        }}
                        className="py-2 px-3 rounded-lg font-semibold text-sm border-2 transition-colors"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#00833e';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                          e.currentTarget.style.color = '#00833e';
                        }}
                      >
                        <MessageCircle size={16} className="inline mr-1" />
                        Mesaj
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter Tabs */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 whitespace-nowrap"
                style={{
                  backgroundColor: selectedCategory === category ? '#00833e' : '#ffffff',
                  color: selectedCategory === category ? '#ffffff' : '#404040',
                  borderColor: selectedCategory === category ? '#00833e' : '#e0e0e0',
                  border: '1px solid',
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category) {
                    e.currentTarget.style.borderColor = '#00833e';
                    e.currentTarget.style.color = '#00833e';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category) {
                    e.currentTarget.style.borderColor = '#e0e0e0';
                    e.currentTarget.style.color = '#404040';
                  }
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Business Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <div
              key={business.id}
              className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
              style={{ borderColor: '#e0e0e0' }}
            >
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={business.coverImage}
                  alt={business.name}
                  width={400}
                  height={250}
                  unoptimized
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => toggleFavorite(business.id)}
                    className="p-2 rounded-full transition-colors duration-200"
                    style={{
                      backgroundColor: favorites[business.id] ? '#00833e' : 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    <Heart
                      size={20}
                      className={favorites[business.id] ? 'text-white fill-white' : 'text-gray-600'}
                    />
                  </button>
                </div>
                {favorites[business.id] && (
                  <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full">
                    <span className="text-xs font-bold" style={{ color: '#00833e' }}>
                      Favori
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex gap-3 mb-3">
                  <div className="flex-shrink-0">
                    <Image
                      src={business.logo}
                      alt={business.name}
                      width={64}
                      height={64}
                      unoptimized
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg" style={{ color: '#333' }}>
                      {business.name}
                    </h3>
                    <p className="text-sm" style={{ color: '#8f8f8f' }}>
                      {business.category}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1">{renderStars(business.rating)}</div>
                  <span className="font-semibold text-sm" style={{ color: '#333' }}>
                    {business.rating}
                  </span>
                  <span className="text-xs" style={{ color: '#8f8f8f' }}>
                    ({business.reviews})
                  </span>
                </div>

                {/* Distance */}
                <div className="flex items-center gap-1 mb-4">
                  <MapPin size={16} style={{ color: '#00833e' }} />
                  <span className="text-sm" style={{ color: '#8f8f8f' }}>
                    {business.distance}
                  </span>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    style={{
                      backgroundColor: '#00833e',
                      color: '#ffffff',
                    }}
                    className="py-2 px-3 rounded-lg font-semibold text-sm transition-colors hover:bg-opacity-90"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = '#006b32')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = '#00833e')
                    }
                  >
                    Öner
                  </button>
                  <button
                    style={{
                      borderColor: '#00833e',
                      color: '#00833e',
                      backgroundColor: '#ffffff',
                    }}
                    className="py-2 px-3 rounded-lg font-semibold text-sm border-2 transition-colors"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#00833e';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.color = '#00833e';
                    }}
                  >
                    <MessageCircle size={16} className="inline mr-1" />
                    Mesaj
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBusinesses.length === 0 && (
          <div className="text-center py-16">
            <div style={{ color: '#8f8f8f' }} className="text-lg mb-2">
              Sonuç bulunamadı
            </div>
            <div style={{ color: '#b0b0b0' }} className="text-sm">
              Lütfen kategori veya arama terimini değiştirerek deneyiniz.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
