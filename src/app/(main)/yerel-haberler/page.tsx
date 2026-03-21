"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Newspaper,
  Store,
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
import { createClient } from "@/lib/supabase/client";

interface NewsItem {
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

interface TrendingTopic {
  id: string;
  title: string;
  count: number;
}

const localNews: NewsItem[] = [
  {
    id: "1",
    title: "Mahallede Yeni Kanalizasyon Projesi Başladı",
    description: "Sokaklar altında yeni kanalizasyon sistemi kurulması için çalışmalar başlamıştır.",
    distance: "250m",
    category: "Mahalle Haberleri",
    categoryId: "local",
    type: "local",
    time: "2 saat önce",
    icon: "news",
  },
  {
    id: "2",
    title: "Belediye: Yol Onarım Çalışmaları Başlayacak",
    description: "Ana cadde yol onarım çalışmaları 20 Mart'ta başlayacak, 3 hafta sürecektir.",
    distance: "500m",
    category: "Belediye Haberleri",
    categoryId: "municipal",
    type: "municipal",
    time: "4 saat önce",
    icon: "news",
  },
  {
    id: "3",
    title: "Mahalle Muhtarı Yeni Sosyal Tesis Açılışını Yaptı",
    description: "Mahallede hizmet vermek üzere yeni sosyal tesis resmi olarak açılmıştır.",
    distance: "180m",
    category: "Mahalle Haberleri",
    categoryId: "local",
    type: "local",
    time: "1 saat önce",
    icon: "news",
  },
  {
    id: "4",
    title: "Su Kesintisi Duyurusu: Çarşamba günü",
    description: "İçme suyu ağını genişletme projesi kapsamında Çarşamba günü 08:00-16:00 arası su kesintisi olacaktır.",
    distance: "600m",
    category: "Duyurular",
    categoryId: "announcements",
    type: "announcement",
    time: "6 saat önce",
    icon: "news",
  },
  {
    id: "5",
    title: "Mahalle Spor Festivaline Katılmaya Davet",
    description: "Tüm mahalle sakinleri için düzenlenecek spor festivaline katılmaya davet edilmektedir. 25 Mart'ta başlayacak.",
    distance: "800m",
    category: "Etkinlikler",
    categoryId: "events",
    type: "event",
    time: "8 saat önce",
    icon: "news",
  },
  {
    id: "6",
    title: "Elektrik Kesintisi Uyarısı",
    description: "Elektrik şebekesi bakım çalışmaları nedeniyle Perşembe günü 09:00-15:00 arası kesinti yaşanabilir.",
    distance: "320m",
    category: "Uyarılar",
    categoryId: "alerts",
    type: "alert",
    time: "1 gün önce",
    icon: "news",
  },
  {
    id: "7",
    title: "Okul Açılış Tarihi Duyurusu",
    description: "Mahalle ilkokulu 17 Mart tarihinde eğitim öğretim faaliyetlerine başlayacaktır.",
    distance: "450m",
    category: "Belediye Haberleri",
    categoryId: "municipal",
    type: "municipal",
    time: "3 saat önce",
    icon: "news",
  },
  {
    id: "8",
    title: "Mahalle Temizlik Haftası Başlamıştır",
    description: "Bu hafta boyunca mahalle cadde ve sokakları temizlenecektir. Araçları uygun yerlere park etmeye özen gösterin.",
    distance: "750m",
    category: "Mahalle Haberleri",
    categoryId: "local",
    type: "local",
    time: "5 saat önce",
    icon: "news",
  },
  {
    id: "9",
    title: "İtfaiye Tatbikatı Yapılacak",
    description: "Mahalle çerçevesinde güvenlik altyapısının teste tabi tutulması amacıyla tatbikat yapılacaktır.",
    distance: "900m",
    category: "Duyurular",
    categoryId: "announcements",
    type: "announcement",
    time: "2 saat önce",
    icon: "news",
  },
  {
    id: "10",
    title: "Mahalle Park Yenileme Projesi Sona Erdi",
    description: "Uzun süredir devam eden park yenileme projesi tamamlanmış, park halkın kullanımına açılmıştır.",
    distance: "400m",
    category: "Mahalle Haberleri",
    categoryId: "local",
    type: "local",
    time: "7 saat önce",
    icon: "news",
  },
  {
    id: "11",
    title: "Sağlık Taraması Haftası Başlıyor",
    description: "Halk sağlığı merkezinde ücretsiz sağlık taraması hizmetleri verilecektir.",
    distance: "350m",
    category: "Belediye Haberleri",
    categoryId: "municipal",
    type: "municipal",
    time: "4 saat önce",
    icon: "news",
  },
  {
    id: "12",
    title: "Mahalle Bilgi Panosu Güncellendi",
    description: "Mahalle giriş kapısında bulunan bilgi panosu yeni haberler ve duyurularla güncellendi.",
    distance: "200m",
    category: "Mahalle Haberleri",
    categoryId: "local",
    type: "local",
    time: "6 saat önce",
    icon: "news",
  },
];

const recentActivityFeed = [
  { id: "1", user: "Muhtarlık", action: "Yol onarım duyurusu yaptı", time: "1 saat önce" },
  { id: "2", user: "Belediye", action: "Su kesintisi bildirimi gönderdi", time: "3 saat önce" },
  { id: "3", user: "Muhtarlık", action: "Spor festivali duyurusu yayınladı", time: "5 saat önce" },
  { id: "4", user: "İtfaiye", action: "Tatbikat duyurusu yayınladı", time: "2 saat önce" },
  { id: "5", user: "Belediye", action: "Sağlık taraması haftası bildirimi", time: "4 saat önce" },
];

const trendingTopics: TrendingTopic[] = [
  { id: "1", title: "Yol Onarımları", count: 234 },
  { id: "2", title: "Park Projesi", count: 189 },
  { id: "3", title: "Su Kesintileri", count: 156 },
  { id: "4", title: "Mahalle Etkinlikleri", count: 142 },
  { id: "5", title: "Güvenlik Uyarıları", count: 128 },
];

const categoryIcons: Record<string, React.ReactNode> = {
  local: <Building2 size={16} />,
  municipal: <Store size={16} />,
  announcements: <AlertTriangle size={16} />,
  events: <Calendar size={16} />,
  alerts: <AlertCircle size={16} />,
};

const getCategoryColor = (categoryId: string) => {
  switch (categoryId) {
    case "local":
      return "bg-green-100 text-green-700 border-green-200";
    case "municipal":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "announcements":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "events":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "alerts":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export default function YerelHaberlerPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");
  const [dbNews, setDbNews] = useState<NewsItem[]>(localNews);

  useEffect(() => {
    const fetchLocalNews = async () => {
      try {
        const supabase = createClient();

        const { data: posts } = await supabase
          .from("posts")
          .select("id, title, body, created_at, profiles(full_name)")
          .order("created_at", { ascending: false })
          .limit(5);

        if (posts) {
          const newsItems: NewsItem[] = posts.map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.body?.substring(0, 100) || "",
            distance: "Mahallede",
            category: "Paylaşım",
            categoryId: "local",
            type: "local",
            time: new Date(p.created_at).toLocaleDateString("tr-TR"),
            icon: "news",
          }));
          setDbNews([...newsItems, ...localNews.slice(newsItems.length)]);
        }
      } catch (error) {
        console.error("Error fetching local news:", error);
      }
    };

    fetchLocalNews();
  }, []);

  const filterCategories = [
    { id: "all", label: "Tümü" },
    { id: "local", label: "Mahalle Haberleri" },
    { id: "municipal", label: "Belediye" },
    { id: "announcements", label: "Duyurular" },
    { id: "events", label: "Etkinlikler" },
    { id: "alerts", label: "Uyarılar" },
  ];

  const filteredNews = dbNews.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || item.categoryId === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Yerel haberlerde ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-full text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-text-primary">Yerel Haberler</h1>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="grid grid-cols-3 gap-3 bg-surface rounded-lg border border-border p-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Newspaper size={20} className="text-primary" />
            </div>
            <p className="text-2xl font-bold text-text-primary">24</p>
            <p className="text-xs text-text-muted">Bu Aydaki Haber</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users size={20} className="text-primary" />
            </div>
            <p className="text-2xl font-bold text-text-primary">8</p>
            <p className="text-xs text-text-muted">Aktif Kaynak</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle size={20} className="text-primary" />
            </div>
            <p className="text-2xl font-bold text-text-primary">3</p>
            <p className="text-xs text-text-muted">Önemli Duyuru</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filter Chips */}
            <div className="bg-surface rounded-lg border border-border p-4">
              <p className="text-sm font-semibold text-text-primary mb-3">Filtrele:</p>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                {filterCategories.map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => setActiveTab(chip.id)}
                    className={`px-4 py-1.5 font-medium whitespace-nowrap rounded-full transition-all duration-200 border text-sm ${
                      activeTab === chip.id
                        ? "bg-primary text-white border-primary"
                        : "bg-surface text-text-primary border-border hover:border-primary"
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* News Feed */}
            {filteredNews.length === 0 ? (
              <div className="bg-surface rounded-lg border border-border p-12 text-center">
                <Newspaper size={48} className="mx-auto text-text-muted mb-3" />
                <p className="text-text-primary font-medium">Haber bulunamadı</p>
                <p className="text-text-muted text-sm mt-1">Arama kriterlerinize eşleşen haber yok</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNews.map((item) => (
                  <div
                    key={item.id}
                    className="block bg-surface border border-border rounded-lg p-4 transition-all duration-200 hover:shadow-lg hover:border-primary cursor-pointer"
                  >
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-background flex items-center justify-center text-primary">
                        {categoryIcons[item.categoryId] || <Newspaper size={16} />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-text-primary line-clamp-2">{item.title}</h3>
                          <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border whitespace-nowrap ${getCategoryColor(item.categoryId)}`}>
                            {item.category}
                          </span>
                        </div>

                        <p className="text-sm text-text-secondary line-clamp-1 mb-2">{item.description}</p>

                        <div className="flex items-center gap-4 text-xs text-text-muted">
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{item.distance}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{item.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0 flex items-center text-text-muted">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Recent Activity Sidebar */}
            <div className="bg-surface rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-4">
                <Flame size={20} className="text-primary" />
                <h2 className="font-bold text-text-primary">Son Haberler</h2>
              </div>

              <div className="space-y-2">
                {recentActivityFeed.map((activity) => (
                  <div key={activity.id} className="pb-2 border-b border-border last:border-0 cursor-pointer hover:bg-surface-hover p-2 -mx-2 rounded transition-colors">
                    <p className="text-xs text-text-primary">
                      <span className="font-semibold">{activity.user}</span>{" "}
                      <span className="text-text-muted">{activity.action}</span>
                    </p>
                    <p className="text-xs text-text-muted mt-1">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-surface rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-primary" />
                <h2 className="font-bold text-text-primary">Trend Konular</h2>
              </div>

              <div className="space-y-2">
                {trendingTopics.map((topic, index) => (
                  <div key={topic.id} className="cursor-pointer hover:bg-surface-hover p-2 -mx-2 rounded transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-primary min-w-6">{index + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{topic.title}</p>
                        <p className="text-xs text-text-muted">{topic.count} konuşma</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Announcements */}
            <div className="bg-surface rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle size={20} className="text-primary" />
                <h2 className="font-bold text-text-primary">Önemli Duyurular</h2>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-lg border border-yellow-200 bg-yellow-50">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={14} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-text-primary">Yol Onarımları</p>
                      <p className="text-xs text-text-secondary mt-1">Ana cadde çerçevesinde onarım başlayacak</p>
                      <p className="text-xs text-text-muted mt-1">20 Mart - 3 hafta</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-red-200 bg-red-50">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={14} className="text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-text-primary">Su Kesintisi</p>
                      <p className="text-xs text-text-secondary mt-1">Proje nedeniyle su kesintisi olacak</p>
                      <p className="text-xs text-text-muted mt-1">Çarşamba 08:00-16:00</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-blue-200 bg-blue-50">
                  <div className="flex items-start gap-2">
                    <Zap size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-text-primary">Elektrik Kesintisi</p>
                      <p className="text-xs text-text-secondary mt-1">Bakım çalışması nedeniyle kesinti</p>
                      <p className="text-xs text-text-muted mt-1">Perşembe 09:00-15:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Info */}
            <div className="bg-surface rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-4">
                <Users size={20} className="text-primary" />
                <h2 className="font-bold text-text-primary">Mahalle Bilgisi</h2>
              </div>

              <div className="space-y-3">
                <div className="pb-3 border-b border-border last:border-0">
                  <p className="text-xs text-text-muted">Muhtar</p>
                  <p className="text-sm font-semibold text-text-primary">Ali Yılmaz</p>
                </div>
                <div className="pb-3 border-b border-border last:border-0">
                  <p className="text-xs text-text-muted">Muhtarlık Saatleri</p>
                  <p className="text-sm font-semibold text-text-primary">Pzt-Cum 09:00-17:00</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">İletişim Numarası</p>
                  <p className="text-sm font-semibold text-text-primary">0212 555 1234</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
