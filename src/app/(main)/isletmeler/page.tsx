'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Search, Map, List, Zap, ChevronRight, Loader2, Store } from 'lucide-react';
import { BusinessCard } from '@/components/business/business-card';
import { getBusinesses } from '@/lib/hooks';

// NOT (2026-06-07): Bu sayfa eskiden 10 sahte işletme (MOCK_BUSINESSES) +
// uydurma puan/mesafe/öne-çıkan/açık-kapalı verisi gösteriyordu ve DB'ye hiç
// sormuyordu. Artık yalnızca gerçek `businesses` kayıtlarına bağlı. Veride
// bulunmayan alanlar (mesafe, öne çıkan, açık/kapalı) sahte doldurulmaz.
// Kartlar slug ile detay sayfasına gider. Bkz. TECH_DEBT #12.

const LeafletMap = dynamic(() => import('@/components/map/google-map'), { ssr: false });

interface BusinessRow {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  logo_url: string | null;
  lat: number | null;
  lng: number | null;
  rating_avg: number | null;
  review_count: number | null;
  category_id: string | null;
  created_at: string;
  business_categories?: { name: string | null; slug: string | null } | null;
}

type SortOption = 'recommended' | 'rating' | 'reviews' | 'newest';

export default function IsletmelerPage() {
  const [businesses, setBusinesses] = useState<BusinessRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await getBusinesses();
      if (cancelled) return;
      setBusinesses((data as BusinessRow[]) || []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Kategori çipleri yalnızca gerçekten veride bulunan kategorilerden türetilir.
  const categories = useMemo(() => {
    const names = new Set<string>();
    businesses.forEach((b) => {
      const n = b.business_categories?.name;
      if (n) names.add(n);
    });
    return ['Tümü', ...Array.from(names).sort((a, b) => a.localeCompare(b, 'tr'))];
  }, [businesses]);

  const filteredAndSortedBusinesses = useMemo(() => {
    const term = search.toLowerCase();
    const filtered = businesses.filter((business) => {
      const matchesSearch =
        business.name.toLowerCase().includes(term) ||
        (business.address || '').toLowerCase().includes(term);
      const matchesCategory =
        selectedCategory === 'Tümü' ||
        business.business_categories?.name === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return Number(b.rating_avg || 0) - Number(a.rating_avg || 0);
        case 'reviews':
          return Number(b.review_count || 0) - Number(a.review_count || 0);
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'recommended':
        default:
          // getBusinesses zaten puan→tarih sırasıyla döndürür; sırayı koru.
          return 0;
      }
    });

    return sorted;
  }, [businesses, search, selectedCategory, sortBy]);

  const mapMarkers = useMemo(
    () =>
      filteredAndSortedBusinesses
        .filter((b) => b.lat != null && b.lng != null)
        .map((b) => ({
          lat: b.lat as number,
          lng: b.lng as number,
          title: b.name,
          description: b.address || '',
          color: 'green' as const,
          popup: `<strong>${b.name}</strong>${
            b.business_categories?.name
              ? `<br/><span style="color:#666">${b.business_categories.name}</span>`
              : ''
          }${b.address ? `<br/><span style="color:#888;font-size:11px">${b.address}</span>` : ''}`,
        })),
    [filteredAndSortedBusinesses]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-hover text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Mahallenizdeki İşletmeler</h1>
          <p className="text-[#d1fae5] mb-6">
            Komşularınızın tercih ettiği en iyi işletmeleri keşfedin
          </p>

          {/* Hero Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-4 text-primary" size={20} />
            <input
              type="text"
              placeholder="İşletme adı, kategori veya konum ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-transparent focus:border-primary focus:outline-none bg-surface text-text-primary placeholder:text-text-muted"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Category Filter - yalnızca veride var olan kategoriler */}
        {categories.length > 1 && (
          <div className="mb-8 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-2 whitespace-nowrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all flex-shrink-0 ${
                    selectedCategory === category
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-surface text-text-primary border border-border hover:border-primary'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Header and Controls */}
        {!loading && businesses.length > 0 && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-text-primary font-bold text-lg">
                {filteredAndSortedBusinesses.length} işletme bulundu
              </p>
            </div>

            {/* Sort and View Options */}
            <div className="flex gap-3 items-center flex-wrap">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 rounded-lg border-2 border-border bg-surface text-text-primary font-medium text-sm focus:border-primary focus:outline-none hover:border-primary transition-colors cursor-pointer"
              >
                <option value="recommended">Önerilen</option>
                <option value="rating">En İyi Puan</option>
                <option value="reviews">En Çok Yorum</option>
                <option value="newest">En Yeni</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex gap-1 border-2 border-border rounded-lg p-1 bg-surface">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary text-white'
                      : 'text-text-muted hover:text-primary'
                  }`}
                  title="Liste Görünümü"
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'map'
                      ? 'bg-primary text-white'
                      : 'text-text-muted hover:text-primary'
                  }`}
                  title="Harita Görünümü"
                >
                  <Map size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* İçerik */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={36} className="text-primary animate-spin" />
            <p className="text-text-muted text-sm">İşletmeler yükleniyor…</p>
          </div>
        ) : businesses.length === 0 ? (
          // Hiç işletme yok — dürüst boş durum + ekleme çağrısı
          <div className="text-center py-16 bg-surface rounded-lg border-2 border-border mb-8">
            <div className="w-16 h-16 rounded-full bg-[#e6f4ec] flex items-center justify-center mx-auto mb-4">
              <Store size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Henüz işletme eklenmemiş
            </h3>
            <p className="text-text-muted mb-6 max-w-md mx-auto">
              Mahallenizdeki ilk işletmeyi siz ekleyin; komşularınız keşfetsin.
            </p>
            <Link
              href="/isletme-ekle"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-lg transition-all hover:shadow-lg"
            >
              <Zap size={20} />
              İşletme Ekle
              <ChevronRight size={20} />
            </Link>
          </div>
        ) : filteredAndSortedBusinesses.length > 0 ? (
          viewMode === 'list' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredAndSortedBusinesses.map((business) => (
                <Link
                  key={business.id}
                  href={`/isletmeler/${business.slug}`}
                  className="hover:no-underline group"
                >
                  <BusinessCard
                    id={business.id}
                    name={business.name}
                    category={business.business_categories?.name || 'İşletme'}
                    rating={Number(business.rating_avg || 0)}
                    reviewCount={business.review_count || 0}
                    address={business.address || ''}
                    logo={business.logo_url || undefined}
                    phone={business.phone || undefined}
                    website={business.website || undefined}
                  />
                </Link>
              ))}
            </div>
          ) : mapMarkers.length > 0 ? (
            <div className="mb-12 bg-surface rounded-lg border-2 border-border overflow-hidden">
              <LeafletMap
                center={[41.0370, 28.9850]}
                zoom={13}
                className="w-full h-96"
                markers={mapMarkers}
              />
            </div>
          ) : (
            <div className="text-center py-12 bg-surface rounded-lg border-2 border-border mb-12">
              <Map size={40} className="text-text-muted mx-auto mb-3" />
              <p className="text-text-muted">
                Bu işletmeler için henüz konum bilgisi girilmemiş.
              </p>
            </div>
          )
        ) : (
          // İşletme var ama filtre eşleşmedi
          <div className="text-center py-12 bg-surface rounded-lg border-2 border-border">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              İşletme bulunamadı
            </h3>
            <p className="text-text-muted">
              Farklı arama terimlerini veya filtreleri deneyebilirsiniz
            </p>
          </div>
        )}

        {/* Add Business CTA — yalnızca liste doluyken (boş durumda zaten üstte var) */}
        {!loading && businesses.length > 0 && (
          <div className="bg-gradient-to-r from-[#e6f4ec] to-[#f0f2f5] rounded-lg border-2 border-primary p-8 text-center mb-8">
            <h3 className="text-2xl font-bold text-text-primary mb-2">
              Kendi İşletmenizi Ekleyin
            </h3>
            <p className="text-text-muted mb-6 max-w-2xl mx-auto">
              Mahallenizdeki müşterilerinize ulaşın, işletmenizi tanıtın ve büyütün
            </p>
            <Link
              href="/isletme-ekle"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-lg transition-all hover:shadow-lg"
            >
              <Zap size={20} />
              İşletme Ekle
              <ChevronRight size={20} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
