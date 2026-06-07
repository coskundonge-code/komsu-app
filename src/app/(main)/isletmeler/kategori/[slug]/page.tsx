'use client'

import { useState, useEffect, useMemo, use } from 'react'
import { Search, ChevronLeft, ArrowUpDown, Loader2, Store, Zap } from 'lucide-react'
import Link from 'next/link'
import { BusinessCard } from '@/components/business/business-card'
import { getBusinesses } from '@/lib/hooks'

// NOT (2026-06-07): Bu sayfa eskiden ~1000 satırlık tamamen sahte
// MOCK_BUSINESSES_BY_CATEGORY (uydurma işletme/puan/mesafe) gösteriyordu ve
// DB'ye hiç sormuyordu; ayrıca slug'ları gerçek business_categories ile
// eşleşmiyordu. Artık gerçek `businesses` kayıtlarına (kategori slug filtresi
// ile) bağlı; sahte mesafe/favori yok; kartlar slug ile detaya gider. Bkz.
// TECH_DEBT #12.

// Canlı business_categories.slug ile birebir eşleşen kategori başlık bilgisi.
const CATEGORY_INFO: Record<string, { name: string; icon: string; description: string }> = {
  'restoran-kafe': { name: 'Restoran & Kafe', icon: '🍽️', description: 'Lezzetli yemekler ve keyifli molalar' },
  'market-bakkal': { name: 'Market & Bakkal', icon: '🛒', description: 'Günlük ihtiyaçlarınız' },
  saglik: { name: 'Sağlık', icon: '🩺', description: 'Sağlık hizmetleri' },
  egitim: { name: 'Eğitim', icon: '📚', description: 'Kurslar ve eğitim kurumları' },
  'guzellik-bakim': { name: 'Güzellik & Bakım', icon: '💇', description: 'Kişisel bakım hizmetleri' },
  'tamirci-servis': { name: 'Tamirci & Servis', icon: '🔧', description: 'Onarım ve teknik servis' },
  temizlik: { name: 'Temizlik', icon: '🧹', description: 'Temizlik hizmetleri' },
  nakliyat: { name: 'Nakliyat', icon: '🚚', description: 'Taşıma ve nakliye' },
  'hukuk-danismanlik': { name: 'Hukuk & Danışmanlık', icon: '⚖️', description: 'Hukuki ve profesyonel danışmanlık' },
  emlak: { name: 'Emlak', icon: '🏠', description: 'Alım, satım ve kiralama' },
  'evcil-hayvan': { name: 'Evcil Hayvan', icon: '🐾', description: 'Evcil hayvan bakımı ve ürünleri' },
  'diger-isletme': { name: 'Diğer', icon: '🏪', description: 'Diğer işletmeler' },
}

interface BusinessRow {
  id: string
  name: string
  slug: string
  address: string | null
  phone: string | null
  website: string | null
  logo_url: string | null
  rating_avg: number | null
  review_count: number | null
  created_at: string
  business_categories?: { name: string | null; slug: string | null } | null
}

type SortOption = 'rating' | 'reviews' | 'newest'

export default function BusinessCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const categoryInfo = CATEGORY_INFO[slug]

  const [businesses, setBusinesses] = useState<BusinessRow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('rating')

  useEffect(() => {
    if (!categoryInfo) {
      setLoading(false)
      return
    }
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const { data } = await getBusinesses({ categorySlug: slug })
      if (cancelled) return
      setBusinesses((data as BusinessRow[]) || [])
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [slug, categoryInfo])

  const filteredAndSortedBusinesses = useMemo(() => {
    const term = searchTerm.toLowerCase()
    const filtered = businesses.filter((b) => b.name.toLowerCase().includes(term))

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return Number(b.rating_avg || 0) - Number(a.rating_avg || 0)
        case 'reviews':
          return Number(b.review_count || 0) - Number(a.review_count || 0)
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

    return sorted
  }, [businesses, searchTerm, sortBy])

  // ----- Geçersiz kategori -----
  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#333] mb-4">Kategori Bulunamadı</h1>
          <Link href="/isletmeler" className="text-[#00833e] hover:text-[#006b32] font-semibold">
            ← İşletmelere Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00833e] to-[#006b32] text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/isletmeler"
            className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Geri Dön</span>
          </Link>

          <div className="flex items-start gap-4">
            <div className="text-5xl">{categoryInfo.icon}</div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{categoryInfo.name}</h1>
              <p className="text-green-50 text-lg">{categoryInfo.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="bg-white border-b border-[#e0e0e0] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8f8f8f] w-5 h-5" />
              <input
                type="text"
                placeholder="İşletme adı arayın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-[#e0e0e0] rounded-lg text-sm focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e]/20 transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5 text-[#8f8f8f] hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2.5 border border-[#e0e0e0] rounded-lg text-sm text-[#333] bg-white focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e]/20 transition appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238f8f8f' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  paddingRight: '2.5rem',
                }}
              >
                <option value="rating">Puan (Yüksek-Düşük)</option>
                <option value="reviews">En Çok Yorumlanan</option>
                <option value="newest">En Yeni</option>
              </select>
            </div>
          </div>

          {!loading && (
            <div className="mt-3 text-sm text-[#8f8f8f]">
              {filteredAndSortedBusinesses.length} sonuç bulundu
            </div>
          )}
        </div>
      </div>

      {/* Business Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={36} className="text-[#00833e] animate-spin" />
            <p className="text-[#8f8f8f] text-sm">İşletmeler yükleniyor…</p>
          </div>
        ) : businesses.length === 0 ? (
          // Bu kategoride hiç işletme yok — dürüst boş durum
          <div className="text-center py-16 bg-white rounded-xl border border-[#e0e0e0]">
            <div className="w-16 h-16 rounded-full bg-[#e6f4ec] flex items-center justify-center mx-auto mb-4">
              <Store size={32} className="text-[#00833e]" />
            </div>
            <h3 className="text-2xl font-bold text-[#333] mb-2">
              Bu kategoride henüz işletme yok
            </h3>
            <p className="text-[#8f8f8f] mb-6 max-w-md mx-auto">
              {categoryInfo.name} kategorisinde ilk işletmeyi siz ekleyebilirsiniz.
            </p>
            <Link
              href="/isletme-ekle"
              className="inline-flex items-center gap-2 bg-[#00833e] hover:bg-[#006b32] text-white font-bold py-3 px-8 rounded-lg transition-all"
            >
              <Zap size={20} />
              İşletme Ekle
            </Link>
          </div>
        ) : filteredAndSortedBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedBusinesses.map((business) => (
              <Link
                key={business.id}
                href={`/isletmeler/${business.slug}`}
                className="hover:no-underline"
              >
                <BusinessCard
                  id={business.id}
                  name={business.name}
                  category={business.business_categories?.name || categoryInfo.name}
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
        ) : (
          // İşletme var ama arama eşleşmedi
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-[#e0e0e0] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#333] mb-2">Sonuç Bulunamadı</h3>
            <p className="text-[#8f8f8f]">
              &quot;{searchTerm}&quot; ile ilişkili bir işletme bulunamadı.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
