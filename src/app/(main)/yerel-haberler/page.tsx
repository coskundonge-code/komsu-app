"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Newspaper, Building2, Clock } from "lucide-react";
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
  source: string;
}

const localNews: NewsItem[] = [
  {
    id: "1",
    title: "Mahallede Yeni Kanalizasyon Projesi Başladı",
    description: "Sokaklar altında yeni kanalizasyon sistemi kurulması için çalışmalar başlamıştır.",
    distance: "250m",
    category: "Mahalle",
    categoryId: "local",
    type: "local",
    time: "2 saat önce",
    icon: "news",
    source: "Muhtarlık",
  },
  {
    id: "2",
    title: "Belediye: Yol Onarım Çalışmaları Başlayacak",
    description: "Ana cadde yol onarım çalışmaları 20 Mart'ta başlayacak, 3 hafta sürecektir.",
    distance: "500m",
    category: "Belediye",
    categoryId: "municipal",
    type: "municipal",
    time: "4 saat önce",
    icon: "news",
    source: "Belediye",
  },
  {
    id: "3",
    title: "Mahalle Muhtarı Yeni Sosyal Tesis Açılışını Yaptı",
    description: "Mahallede hizmet vermek üzere yeni sosyal tesis resmi olarak açılmıştır.",
    distance: "180m",
    category: "Mahalle",
    categoryId: "local",
    type: "local",
    time: "1 saat önce",
    icon: "news",
    source: "Muhtarlık",
  },
  {
    id: "4",
    title: "Su Kesintisi Duyurusu: Çarşamba günü",
    description: "İçme suyu ağını genişletme projesi kapsamında Çarşamba günü 08:00-16:00 arası su kesintisi olacaktır.",
    distance: "600m",
    category: "Mahalle",
    categoryId: "local",
    type: "announcement",
    time: "6 saat önce",
    icon: "news",
    source: "Belediye",
  },
  {
    id: "5",
    title: "Okul Açılış Tarihi Duyurusu",
    description: "Mahalle ilkokulu 17 Mart tarihinde eğitim öğretim faaliyetlerine başlayacaktır.",
    distance: "450m",
    category: "Belediye",
    categoryId: "municipal",
    type: "municipal",
    time: "3 saat önce",
    icon: "news",
    source: "Belediye",
  },
  {
    id: "6",
    title: "Mahalle Temizlik Haftası Başlamıştır",
    description: "Bu hafta boyunca mahalle cadde ve sokakları temizlenecektir. Araçları uygun yerlere park etmeye özen gösterin.",
    distance: "750m",
    category: "Mahalle",
    categoryId: "local",
    type: "local",
    time: "5 saat önce",
    icon: "news",
    source: "Muhtarlık",
  },
  {
    id: "7",
    title: "İtfaiye Tatbikatı Yapılacak",
    description: "Mahalle çerçevesinde güvenlik altyapısının teste tabi tutulması amacıyla tatbikat yapılacaktır.",
    distance: "900m",
    category: "Mahalle",
    categoryId: "local",
    type: "announcement",
    time: "2 saat önce",
    icon: "news",
    source: "Belediye",
  },
  {
    id: "8",
    title: "Mahalle Park Yenileme Projesi Sona Erdi",
    description: "Uzun süredir devam eden park yenileme projesi tamamlanmış, park halkın kullanımına açılmıştır.",
    distance: "400m",
    category: "Mahalle",
    categoryId: "local",
    type: "local",
    time: "7 saat önce",
    icon: "news",
    source: "Muhtarlık",
  },
  {
    id: "9",
    title: "Sağlık Taraması Haftası Başlıyor",
    description: "Halk sağlığı merkezinde ücretsiz sağlık taraması hizmetleri verilecektir.",
    distance: "350m",
    category: "Belediye",
    categoryId: "municipal",
    type: "municipal",
    time: "4 saat önce",
    icon: "news",
    source: "Belediye",
  },
  {
    id: "10",
    title: "Mahalle Bilgi Panosu Güncellendi",
    description: "Mahalle giriş kapısında bulunan bilgi panosu yeni haberler ve duyurularla güncellendi.",
    distance: "200m",
    category: "Mahalle",
    categoryId: "local",
    type: "local",
    time: "6 saat önce",
    icon: "news",
    source: "Muhtarlık",
  },
];


const getCategoryColor = (categoryId: string) => {
  switch (categoryId) {
    case "local":
      return "bg-green-100 text-green-700 border-green-200";
    case "municipal":
      return "bg-blue-100 text-blue-700 border-blue-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getSourceColor = (source: string) => {
  switch (source) {
    case "Muhtarlık":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Belediye":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export default function YerelHaberlerPage() {
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
            category: "Mahalle",
            categoryId: "local",
            type: "local",
            time: new Date(p.created_at).toLocaleDateString("tr-TR"),
            icon: "news",
            source: "Muhtarlık",
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
    { id: "municipal", label: "Belediye" },
    { id: "local", label: "Mahalle" },
  ];

  const filteredNews = dbNews.filter((item) => {
    const matchesTab = activeTab === "all" || item.categoryId === activeTab;
    return matchesTab;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section - Sticky */}
      <div className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-[680px] mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Yerel Haberler</h1>

          {/* Filter Chips */}
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
      </div>

      {/* Main Content - Single Column */}
      <div className="max-w-[680px] mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* News Feed */}
        {filteredNews.length === 0 ? (
          <div className="bg-surface rounded-lg border border-border p-12 text-center">
            <Newspaper size={48} className="mx-auto text-text-muted mb-3" />
            <p className="text-text-primary font-medium">Haber bulunamadı</p>
            <p className="text-text-muted text-sm mt-1">Seçilen kategoride haber yok</p>
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
                    <Newspaper size={16} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-text-primary line-clamp-2">{item.title}</h3>
                    </div>

                    <div className="flex gap-2 mb-2">
                      <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border whitespace-nowrap ${getCategoryColor(item.categoryId)}`}>
                        {item.category}
                      </span>
                      <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border whitespace-nowrap ${getSourceColor(item.source)}`}>
                        {item.source}
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
    </div>
  );
}
