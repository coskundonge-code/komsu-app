'use client'

import React, { useState, useEffect } from 'react'
import {
  Search,
  Store,
  Calendar,
  Package,
  AlertCircle,
  AlertTriangle,
  Wind,
  Zap,
  Star,
  Clock,
  MapPin,
  Tag,
  Loader2,
  ChevronRight,
  Compass,
} from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { getEvents } from '@/lib/hooks/use-events'
import { getListings } from '@/lib/hooks/use-listings'
import { getAlerts } from '@/lib/hooks/use-notifications'
import { getBusinesses } from '@/lib/hooks/use-groups-businesses'

const KesfetMap = dynamic(() => import('./kesfet-map'), { ssr: false })

// NOT (2026-06-07): Bu sayfa eskiden BAŞTAN AŞAĞI uyduruktu — 12 sahte "etkinlik"
// (nearbyActivities), 4 sahte işletme (nearbyBusinesses, sabit mesafe/adres),
// 3 sabit güvenlik uyarısı (safetyAlerts), 5 sahte trend konu, 5 sahte "son
// aktivite" ve sabit istatistik bandı (1.247 komşu / 34 paylaşım / 8 etkinlik).
// Gerçek veri yalnızca kısmen üstüne yazılıyor, eksikler sahteyle dolduruluyordu.
// Artık her şey GERÇEK: akış gerçek etkinlik + ilanlardan, kenar çubuğu gerçek
// işletme ve uyarılardan beslenir; her kart kendi gerçek detay sayfasına gider.
// Veri yoksa dürüst boş durum gösterilir. Bkz. TECH_DEBT #12.

type FeedKind = 'event' | 'listing'

interface FeedItem {
  id: string
  kind: FeedKind
  title: string
  description: string
  meta: string
  timestamp: number
  timeLabel: string
  href: string
  categoryLabel: string
}

interface BusinessItem {
  id: string
  name: string
  slug: string
  category: string
  rating: number | null
  reviews: number
  address: string | null
}

interface AlertItem {
  id: string
  type: string
  title: string
  description: string
  timeLabel: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

function formatRelativeTime(iso: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'az önce'
  if (mins < 60) return `${mins} dk önce`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} saat önce`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} gün önce`
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
}

function formatEventDate(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatPrice(price: number | null, currency: string | null): string {
  if (price == null) return 'Fiyat belirtilmemiş'
  return `${Number(price).toLocaleString('tr-TR')} ${currency || '₺'}`
}

const filterCategories: { id: 'all' | FeedKind; label: string }[] = [
  { id: 'all', label: 'Tümü' },
  { id: 'event', label: 'Etkinlikler' },
  { id: 'listing', label: 'Pazar' },
]

const kindStyles: Record<FeedKind, { color: string; icon: React.ReactNode }> = {
  event: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: <Calendar size={18} /> },
  listing: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: <Package size={18} /> },
}

export default function KesfetPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | FeedKind>('all')
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [businesses, setBusinesses] = useState<BusinessItem[]>([])
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      const [eventsRes, listingsRes, businessesRes, alertsRes] = await Promise.all([
        getEvents({ upcoming: true, limit: 30 }),
        getListings({ status: 'active', limit: 30, sortBy: 'newest' }),
        getBusinesses({ limit: 6 }),
        getAlerts(undefined, { limit: 6 }),
      ])

      if (cancelled) return

      const eventItems: FeedItem[] = (eventsRes.data || []).map((e: any) => ({
        id: e.id,
        kind: 'event' as const,
        title: e.title,
        description: e.description || '',
        meta: [formatEventDate(e.start_date), e.location].filter(Boolean).join(' · '),
        timestamp: new Date(e.created_at || e.start_date || 0).getTime(),
        timeLabel: formatRelativeTime(e.created_at),
        href: `/etkinlikler/${e.id}`,
        categoryLabel: e.category || 'Etkinlik',
      }))

      const listingItems: FeedItem[] = (listingsRes.data || []).map((l: any) => ({
        id: l.id,
        kind: 'listing' as const,
        title: l.title,
        description: l.description || '',
        meta: formatPrice(l.price, l.currency),
        timestamp: new Date(l.created_at || 0).getTime(),
        timeLabel: formatRelativeTime(l.created_at),
        href: `/pazar/ilan/${l.id}`,
        categoryLabel: l.listing_categories?.name || 'Pazar',
      }))

      const merged = [...eventItems, ...listingItems].sort((a, b) => b.timestamp - a.timestamp)
      setFeed(merged)

      setBusinesses(
        (businessesRes.data || []).map((b: any) => ({
          id: b.id,
          name: b.name,
          slug: b.slug,
          category: b.business_categories?.name || 'İşletme',
          rating: b.rating_avg ?? null,
          reviews: b.review_count || 0,
          address: b.address || null,
        }))
      )

      setAlerts(
        (alertsRes.data || []).map((a: any) => ({
          id: a.id,
          type: a.type || 'general',
          title: a.title,
          description: a.body || '',
          timeLabel: formatRelativeTime(a.created_at),
          severity: (a.severity || 'low') as AlertItem['severity'],
        }))
      )

      setLoading(false)
    }

    load().catch(() => {
      if (!cancelled) setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [])

  const filteredFeed = feed.filter((item) => {
    const q = searchQuery.trim().toLowerCase()
    const matchesSearch =
      !q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
    const matchesTab = activeTab === 'all' || item.kind === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Mahallende etkinlik ve ilan ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-full text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Çevredekileri Keşfet</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Interactive Map Section */}
        <div className="mb-6 rounded-lg overflow-hidden border border-border bg-surface">
          <div className="relative h-80 md:h-[450px]">
            <KesfetMap />
          </div>
        </div>

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
                        ? 'bg-primary text-white border-primary'
                        : 'bg-surface text-text-primary border-border hover:border-primary'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            {loading ? (
              <div className="bg-surface rounded-lg border border-border p-12 text-center">
                <Loader2 size={32} className="mx-auto text-primary animate-spin mb-3" />
                <p className="text-text-muted text-sm">Çevrendekiler yükleniyor...</p>
              </div>
            ) : filteredFeed.length === 0 ? (
              <div className="bg-surface rounded-lg border border-border p-12 text-center">
                <Compass size={48} className="mx-auto text-text-muted mb-3" />
                <p className="text-text-primary font-medium">
                  {feed.length === 0 ? 'Henüz çevrende paylaşım yok' : 'Sonuç bulunamadı'}
                </p>
                <p className="text-text-muted text-sm mt-1">
                  {feed.length === 0
                    ? 'Mahallende yeni etkinlik ve ilanlar burada görünecek.'
                    : 'Arama veya filtre kriterlerine uyan içerik yok.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFeed.map((item) => (
                  <Link
                    key={`${item.kind}-${item.id}`}
                    href={item.href}
                    className="block bg-surface border border-border rounded-lg p-4 transition-all duration-200 hover:shadow-lg hover:border-primary cursor-pointer"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-background flex items-center justify-center text-primary">
                        {kindStyles[item.kind].icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-text-primary line-clamp-2">{item.title}</h3>
                          <span
                            className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border whitespace-nowrap ${kindStyles[item.kind].color}`}
                          >
                            {item.categoryLabel}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-sm text-text-secondary line-clamp-1 mb-2">{item.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-text-muted">
                          {item.meta && (
                            <div className="flex items-center gap-1">
                              {item.kind === 'event' ? <MapPin size={14} /> : <Tag size={14} />}
                              <span className="line-clamp-1">{item.meta}</span>
                            </div>
                          )}
                          {item.timeLabel && (
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Clock size={14} />
                              <span>{item.timeLabel}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex items-center text-text-muted">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Nearby Businesses Section */}
            <div className="bg-surface rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-4">
                <Store size={20} className="text-primary" />
                <h2 className="font-bold text-text-primary">Mahallenin İşletmeleri</h2>
              </div>

              {loading ? (
                <div className="py-6 flex justify-center">
                  <Loader2 size={20} className="text-primary animate-spin" />
                </div>
              ) : businesses.length === 0 ? (
                <p className="text-sm text-text-muted py-2">Henüz kayıtlı işletme yok.</p>
              ) : (
                <div className="space-y-3">
                  {businesses.map((business) => (
                    <Link
                      key={business.id}
                      href={`/isletmeler/${business.slug}`}
                      className="block p-3 bg-background rounded-lg hover:bg-surface-active transition-colors"
                    >
                      <h3 className="font-semibold text-sm text-text-primary line-clamp-1 mb-1">{business.name}</h3>
                      <p className="text-xs text-text-muted mb-2">{business.category}</p>
                      {business.address && (
                        <p className="text-xs text-text-muted flex items-center gap-1 mb-2 line-clamp-1">
                          <MapPin size={11} />
                          {business.address}
                        </p>
                      )}
                      {business.rating != null && business.rating > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={
                                  i < Math.floor(business.rating as number)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-[#ccc]'
                                }
                              />
                            ))}
                          </div>
                          <span className="text-xs text-text-muted">{Number(business.rating).toFixed(1)}</span>
                          <span className="text-xs text-text-muted">({business.reviews})</span>
                        </div>
                      ) : (
                        <span className="text-xs text-text-muted">Henüz değerlendirme yok</span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Safety Alerts Section */}
            <div className="bg-surface rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle size={20} className="text-primary" />
                <h2 className="font-bold text-text-primary">Mahallenin Durumu</h2>
              </div>

              {loading ? (
                <div className="py-6 flex justify-center">
                  <Loader2 size={20} className="text-primary animate-spin" />
                </div>
              ) : alerts.length === 0 ? (
                <div className="space-y-2 p-3 bg-background rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm text-text-primary font-medium">Aktif uyarı yok</span>
                  </div>
                  <p className="text-xs text-text-muted">Mahallende bildirilmiş güvenlik uyarısı bulunmuyor.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {alerts.map((alert) => (
                    <Link
                      key={alert.id}
                      href="/uyarilar"
                      className={`block p-3 rounded-lg border transition-colors ${
                        alert.severity === 'critical' || alert.severity === 'high'
                          ? 'bg-red-50 border-red-200 hover:bg-red-100'
                          : alert.severity === 'medium'
                            ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                            : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">
                          {alert.severity === 'critical' || alert.severity === 'high' ? (
                            <Zap size={14} className="text-red-600" />
                          ) : alert.severity === 'medium' ? (
                            <AlertTriangle size={14} className="text-yellow-600" />
                          ) : (
                            <Wind size={14} className="text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-text-primary">{alert.title}</p>
                          {alert.description && (
                            <p className="text-xs text-text-secondary mt-1 line-clamp-2">{alert.description}</p>
                          )}
                          {alert.timeLabel && <p className="text-xs text-text-muted mt-1">{alert.timeLabel}</p>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
