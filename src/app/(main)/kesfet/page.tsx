"use client";

import React from "react";
import {
  Search,
  MapPin,
  Newspaper,
  Store,
  Home,
  Building2,
  AlertTriangle,
  AlertCircle,
  Wind,
  Zap,
  Star,
  Clock,
  Navigation,
  Flame,
  TrendingUp,
  Users,
  Calendar,
  HeartHandshake,
} from "lucide-react";
import Link from "next/link";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  distance: string;
  category: string;
  categoryId: string;
  type: string;
  time: string;
  icon: string;
}

interface BusinessItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  distance: string;
  address: string;
}

interface SafetyAlert {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  severity: "low" | "medium" | "high";
}

interface LocationCard {
  id: string;
  title: string;
  category: string;
  distance: string;
  top: string;
  left: string;
  icon: React.ReactNode;
  color: string;
}

const nearbyActivities: ActivityItem[] = [
  {
    id: "1",
    title: "Mahallede Yeni Kahvehane Açılıyor",
    description: "Lokantanın yerine yeni bir kahvehane işletmesi açılıyor. Açılış 15 Mart'ta yapılacak.",
    distance: "250m",
    category: "İşletmeler",
    categoryId: "business",
    type: "business",
    time: "2 saat önce",
    icon: "store",
  },
  {
    id: "2",
    title: "Park Yenileme Projesi Tamamlandı",
    description: "Yazlık park yenileme projesi başarıyla tamamlanmıştır. Yeni oyun alanları ve banklar eklendi.",
    distance: "500m",
    category: "Etkinlikler",
    categoryId: "events",
    type: "event",
    time: "4 saat önce",
    icon: "event",
  },
  {
    id: "3",
    title: "Güvenlik: Sokak Aydınlatması Arızalandı",
    description: "Açı Sokak'taki aydınlatma arızası bildirilmiştir. Tamir çalışmaları başlamıştır.",
    distance: "180m",
    category: "Uyarılar",
    categoryId: "alerts",
    type: "alert",
    time: "1 saat önce",
    icon: "security",
  },
  {
    id: "4",
    title: "Satılık: Eviniz için Doğru Fiyat",
    description: "Mahallede gayrimenkul fiyatları hızla artıyor. Tavsiyelerimizi okuyun.",
    distance: "600m",
    category: "Satılık",
    categoryId: "forsale",
    type: "forsale",
    time: "6 saat önce",
    icon: "home",
  },
  {
    id: "5",
    title: "Komşu Mahallesi Spor Etkinliği",
    description: "Cumartesi günü merkez parkında futbol turnuvası yapılacaktır. Katılımcılar arıyor.",
    distance: "800m",
    category: "Etkinlikler",
    categoryId: "events",
    type: "event",
    time: "8 saat önce",
    icon: "event",
  },
  {
    id: "6",
    title: "Yerel Elektrikçi Hizmetlerinizi Anlatıyor",
    description: "Mahalle halkına yoğun ilgi gören elektrik ustası Serkan, hizmetleri hakkında konuşuyor.",
    distance: "320m",
    category: "İşletmeler",
    categoryId: "business",
    type: "business",
    time: "1 gün önce",
    icon: "store",
  },
  {
    id: "7",
    title: "Güvenlik: Trafik Kontrolü Yapılacak",
    description: "Pazar günü saat 10:00-14:00 arasında bölgede trafik kontrolü yapılacaktır.",
    distance: "450m",
    category: "Uyarılar",
    categoryId: "alerts",
    type: "alert",
    time: "3 saat önce",
    icon: "security",
  },
  {
    id: "8",
    title: "Yeni Fitness Merkezi Açılış Özel İndirimi",
    description: "Yeni açılan fitness merkezinde ilk 3 ay %30 indirim yapılmaktadır.",
    distance: "750m",
    category: "İşletmeler",
    categoryId: "business",
    type: "business",
    time: "5 saat önce",
    icon: "store",
  },
  {
    id: "9",
    title: "Satılık: Apartman Dairesi - 3+1",
    description: "Merkez lokasyonda, güneşli, yeni binada 3+1 daire satılmaktadır.",
    distance: "900m",
    category: "Satılık",
    categoryId: "forsale",
    type: "forsale",
    time: "2 saat önce",
    icon: "home",
  },
  {
    id: "10",
    title: "Etkinlik: Mahalle Temizlik Günü",
    description: "Çevre temizliği için gönüllü aranıyor. Cuma günü saat 14:00'te toplanacağız.",
    distance: "400m",
    category: "Etkinlikler",
    categoryId: "events",
    type: "event",
    time: "7 saat önce",
    icon: "event",
  },
  {
    id: "11",
    title: "Kayıp: Siyah Beyaz Kedi",
    description: "Merkez mahallede kaybolan sevimli kedimiz. İçinde çip bulunmaktadır.",
    distance: "350m",
    category: "Kayıp/Buluntu",
    categoryId: "lost",
    type: "lost",
    time: "4 saat önce",
    icon: "home",
  },
  {
    id: "12",
    title: "Uyarı: Elektrik Kesintisi",
    description: "Ağ bakım çalışmaları nedeniyle Çarşamba 09:00-17:00 arasında kesinti olabilir.",
    distance: "200m",
    category: "Uyarılar",
    categoryId: "alerts",
    type: "alert",
    time: "6 saat önce",
    icon: "security",
  },
];

const nearbyBusinesses: BusinessItem[] = [
  {
    id: 'b1',
    name: 'Kahvehane Express',
    category: 'Kahvehane',
    rating: 4.8,
    reviews: 124,
    distance: '250m',
    address: 'Merkez Cad. No: 45',
  },
  {
    id: 'b2',
    name: 'Berber Hasan',
    category: 'Berberlik',
    rating: 4.6,
    reviews: 89,
    distance: '180m',
    address: 'Açı Sokak No: 12',
  },
  {
    id: 'b3',
    name: 'Eczacı Plus Eczanesi',
    category: 'Eczane',
    rating: 4.9,
    reviews: 156,
    distance: '320m',
    address: 'İş Merkezi Kat: 2',
  },
  {
    id: 'b4',
    name: 'Fitness Plus Spor Salonu',
    category: 'Spor Salonu',
    rating: 4.7,
    reviews: 203,
    distance: '750m',
    address: 'Park Cad. No: 78',
  },
];

const safetyAlerts: SafetyAlert[] = [
  {
    id: "sa1",
    type: "weather",
    title: "Hava Durumu Uyarısı",
    description: "Cuma günü kuvvetli rüzgar beklenmektedir.",
    time: "2 saat önce",
    severity: "low",
  },
  {
    id: "sa2",
    type: "traffic",
    title: "Trafik Uyarısı",
    description: "Ana Caddede saat 17:00-19:00 arasında yoğunluk beklenmektedir.",
    time: "3 saat önce",
    severity: "medium",
  },
  {
    id: "sa3",
    type: "outage",
    title: "Elektrik Kesintisi",
    description: "Çarşamba 09:00-17:00 arası ağ bakım nedeniyle kesinti olabilir.",
    time: "6 saat önce",
    severity: "high",
  },
];

const trendingTopics = [
  { id: "1", title: "Mahalle Temizliği", count: 234 },
  { id: "2", title: "Yeni Bahçe Projesi", count: 189 },
  { id: "3", title: "Güvenlik Kameraları", count: 156 },
  { id: "4", title: "Spor Alanı Renovasyonu", count: 142 },
  { id: "5", title: "Komşu Ağı Etkinliği", count: 128 },
];

const recentActivityFeed = [
  { id: "1", user: "Ayşe K.", action: "yeni etkinlik oluşturdu", time: "5 dakika önce" },
  { id: "2", user: "Mehmet Y.", action: "Satılık: 2+1 Daire", time: "15 dakika önce" },
  { id: "3", user: "Fatih D.", action: "İşletmeler kategorisinde paylaştı", time: "23 dakika önce" },
  { id: "4", user: "Zeynep S.", action: "Güvenlik uyarısı gönderdi", time: "1 saat önce" },
  { id: "5", user: "Emre T.", action: "Etkinliğe katıldı", time: "2 saat önce" },
];

const categoryIcons: Record<string, React.ReactNode> = {
  business: <Store size={16} />,
  events: <Building2 size={16} />,
  alerts: <AlertTriangle size={16} />,
  forsale: <Home size={16} />,
  lost: <HeartHandshake size={16} />,
};

const getCategoryColor = (categoryId: string) => {
  switch (categoryId) {
    case "business":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "events":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "alerts":
      return "bg-red-100 text-red-700 border-red-200";
    case "forsale":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "lost":
      return "bg-pink-100 text-pink-700 border-pink-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export default function KesfetPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");
  const [distanceFilter, setDistanceFilter] = React.useState("all");

  const filterCategories = [
    { id: "all", label: "Tümü" },
    { id: "events", label: "Etkinlikler" },
    { id: "business", label: "İşletmeler" },
    { id: "alerts", label: "Uyarılar" },
    { id: "forsale", label: "Satılık" },
    { id: "lost", label: "Kayıp/Buluntu" },
  ];

  const distanceOptions = [
    { value: "all", label: "Tüm mesafeler" },
    { value: "500m", label: "500m" },
    { value: "1km", label: "1km" },
    { value: "2km", label: "2km" },
    { value: "5km", label: "5km" },
  ];

  const parseDistance = (distStr: string): number => {
    const num = parseInt(distStr);
    return distStr.includes("km") ? num * 1000 : num;
  };

  const isWithinDistance = (distance: string, filter: string): boolean => {
    if (filter === "all") return true;
    const filterDist = parseDistance(filter);
    const itemDist = parseDistance(distance);
    return itemDist <= filterDist;
  };

  const filteredActivities = nearbyActivities.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || item.categoryId === activeTab;
    const matchesDistance = isWithinDistance(item.distance, distanceFilter);
    return matchesSearch && matchesTab && matchesDistance;
  });

  const locationCards: LocationCard[] = [
    {
      id: "loc1",
      title: "Kahvehane Açılışı",
      category: "İşletmeler",
      distance: "250m",
      top: "25%",
      left: "20%",
      icon: <Store size={14} />,
      color: "bg-blue-500",
    },
    {
      id: "loc2",
      title: "Park Projesi",
      category: "Etkinlikler",
      distance: "500m",
      top: "45%",
      left: "60%",
      icon: <Building2 size={14} />,
      color: "bg-purple-500",
    },
    {
      id: "loc3",
      title: "Aydınlatma Arızası",
      category: "Uyarılar",
      distance: "180m",
      top: "35%",
      left: "75%",
      icon: <AlertTriangle size={14} />,
      color: "bg-red-500",
    },
    {
      id: "loc4",
      title: "Fitness Merkezi",
      category: "İşletmeler",
      distance: "750m",
      top: "65%",
      left: "85%",
      icon: <Store size={14} />,
      color: "bg-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header Section */}
      <div className="bg-white border-b border-[#e0e0e0] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8f8f8f]" />
            <input
              type="text"
              placeholder="Mahallende etkinlik ve işletmeler ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f0f2f5] border border-[#e0e0e0] rounded-full text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e]"
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-[#333]">Çevredekileri Keşfet</h1>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-3 gap-3 bg-white rounded-lg border border-[#e0e0e0] p-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users size={20} className="text-[#00833e]" />
            </div>
            <p className="text-2xl font-bold text-[#333]">1,247</p>
            <p className="text-xs text-[#8f8f8f]">Aktif Komşu</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Newspaper size={20} className="text-[#00833e]" />
            </div>
            <p className="text-2xl font-bold text-[#333]">34</p>
            <p className="text-xs text-[#8f8f8f]">Bugünkü Paylaşımlar</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar size={20} className="text-[#00833e]" />
            </div>
            <p className="text-2xl font-bold text-[#333]">8</p>
            <p className="text-xs text-[#8f8f8f]">Bu Haftaki Etkinlik</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Fullscreen Map Placeholder Section */}
        <div className="mb-6 rounded-lg overflow-hidden border border-[#e0e0e0] bg-white">
          <div className="relative h-80 md:h-96 bg-gradient-to-br from-[#00833e] to-[#004d23] overflow-hidden">
            {/* Grid pattern background */}
            <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>

            {/* Location Cards on Map */}
            {locationCards.map((card) => (
              <div
                key={card.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ top: card.top, left: card.left }}
              >
                <div className="relative">
                  {/* Pulsing ring */}
                  <div className={`absolute inset-0 ${card.color} rounded-full opacity-30 animate-pulse`} style={{ width: "32px", height: "32px", margin: "-16px 0 0 -16px" }} />
                  {/* Pin */}
                  <div className={`relative w-8 h-8 ${card.color} rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white`}>
                    {card.icon}
                  </div>
                </div>
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity z-20 pointer-events-none">
                  {card.title} • {card.distance}
                </div>
              </div>
            ))}

            {/* Center message */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <MapPin size={48} className="text-white mb-3 opacity-90" />
              <p className="text-white font-bold text-lg text-center px-4">Mahalleni Harita Üzerinde Keşfet</p>
              <p className="text-white text-sm opacity-80 mt-2">Yakındaki etkinlikleri ve işletmeleri görmek için tıklayın</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filter Chips */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] p-4">
              <p className="text-sm font-semibold text-[#333] mb-3">Filtrele:</p>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                {filterCategories.map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => setActiveTab(chip.id)}
                    className={`px-4 py-1.5 font-medium whitespace-nowrap rounded-full transition-all duration-200 border text-sm ${
                      activeTab === chip.id
                        ? "bg-[#00833e] text-white border-[#00833e]"
                        : "bg-white text-[#333] border-[#e0e0e0] hover:border-[#00833e]"
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Distance Filter */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] p-4">
              <p className="text-sm font-semibold text-[#333] mb-3">Mesafe Filtresi</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {distanceOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDistanceFilter(option.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border ${
                      distanceFilter === option.value
                        ? "bg-[#00833e] text-white border-[#00833e]"
                        : "bg-white text-[#333] border-[#e0e0e0] hover:border-[#00833e]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            {filteredActivities.length === 0 ? (
              <div className="bg-white rounded-lg border border-[#e0e0e0] p-12 text-center">
                <Newspaper size={48} className="mx-auto text-[#8f8f8f] mb-3" />
                <p className="text-[#333] font-medium">Etkinlik bulunamadı</p>
                <p className="text-[#8f8f8f] text-sm mt-1">Arama kriterlerinize eşleşen etkinlik yok</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredActivities.map((item) => (
                  <Link
                    key={item.id}
                    href={`/kesfet/${item.id}`}
                    className="block bg-white border border-[#e0e0e0] rounded-lg p-4 transition-all duration-200 hover:shadow-lg hover:border-[#00833e] cursor-pointer"
                  >
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#f0f2f5] flex items-center justify-center text-[#00833e]">
                        {categoryIcons[item.categoryId] || <MapPin size={16} />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-[#333] line-clamp-2">{item.title}</h3>
                          <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border whitespace-nowrap ${getCategoryColor(item.categoryId)}`}>
                            {item.category}
                          </span>
                        </div>

                        <p className="text-sm text-[#404040] line-clamp-1 mb-2">{item.description}</p>

                        <div className="flex items-center gap-4 text-xs text-[#8f8f8f]">
                          <div className="flex items-center gap-1">
                            <Navigation size={14} />
                            <span>{item.distance}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{item.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0 flex items-center text-[#8f8f8f]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Activity Feed Sidebar */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] p-4">
              <div className="flex items-center gap-2 mb-4">
                <Flame size={20} className="text-[#00833e]" />
                <h2 className="font-bold text-[#333]">Son Aktiviteler</h2>
              </div>

              <div className="space-y-2">
                {recentActivityFeed.map((activity) => (
                  <div key={activity.id} className="pb-2 border-b border-[#e0e0e0] last:border-0 cursor-pointer hover:bg-[#f0f2f5] p-2 -mx-2 rounded transition-colors">
                    <p className="text-xs text-[#333]">
                      <span className="font-semibold">{activity.user}</span>{" "}
                      <span className="text-[#8f8f8f]">{activity.action}</span>
                    </p>
                    <p className="text-xs text-[#8f8f8f] mt-1">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-[#00833e]" />
                <h2 className="font-bold text-[#333]">Trend Konular</h2>
              </div>

              <div className="space-y-2">
                {trendingTopics.map((topic, index) => (
                  <div key={topic.id} className="cursor-pointer hover:bg-[#f0f2f5] p-2 -mx-2 rounded transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#00833e] min-w-6">{index + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#333] truncate">{topic.title}</p>
                        <p className="text-xs text-[#8f8f8f]">{topic.count} konu</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Businesses Section */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] p-4">
              <div className="flex items-center gap-2 mb-4">
                <Store size={20} className="text-[#00833e]" />
                <h2 className="font-bold text-[#333]">Yakında İşletmeler</h2>
              </div>

              <div className="space-y-3">
                {nearbyBusinesses.map((business) => (
                  <div key={business.id} className="p-3 bg-[#f0f2f5] rounded-lg hover:bg-[#e0e0e0] transition-colors cursor-pointer">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-semibold text-sm text-[#333] line-clamp-1">{business.name}</h3>
                      <span className="flex-shrink-0 text-xs font-medium text-[#8f8f8f]">{business.distance}</span>
                    </div>
                    <p className="text-xs text-[#8f8f8f] mb-2">{business.category}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < Math.floor(business.rating) ? "fill-yellow-400 text-yellow-400" : "text-[#ccc]"}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-[#8f8f8f]">{business.rating}</span>
                      <span className="text-xs text-[#8f8f8f]">({business.reviews})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Alerts Section */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] p-4">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle size={20} className="text-[#00833e]" />
                <h2 className="font-bold text-[#333]">Mahallenin Durumu</h2>
              </div>

              <div className="space-y-2 mb-4 p-3 bg-[#f0f2f5] rounded-lg">
                <p className="text-xs font-semibold text-[#333]">Güvenlik Durumu</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#00833e] rounded-full" />
                  <span className="text-sm text-[#333] font-medium">Güvenli</span>
                </div>
              </div>

              <div className="space-y-2">
                {safetyAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${
                      alert.severity === "high"
                        ? "bg-red-50 border-red-200"
                        : alert.severity === "medium"
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-0.5">
                        {alert.type === "weather" && <Wind size={14} className="text-blue-600" />}
                        {alert.type === "traffic" && <AlertTriangle size={14} className="text-yellow-600" />}
                        {alert.type === "outage" && <Zap size={14} className="text-red-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#333]">{alert.title}</p>
                        <p className="text-xs text-[#404040] mt-1">{alert.description}</p>
                        <p className="text-xs text-[#8f8f8f] mt-1">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
