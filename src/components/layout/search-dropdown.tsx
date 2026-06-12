'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Tag, Calendar, Store, Users, FileText, User, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// NOT (2026-06-07): Bu açılır arama kutusu eskiden 5 adet UYDURMA sonuç gösteriyordu
// ("Komşu toplantısı", "İkinci el bisiklet", "342 üye"lik sahte grup vb.) ve yanlış,
// var olmayan bağlantılara (/posts/1, /listings/2 ...) götürüyordu. Artık her tuş
// vuruşunda (300 ms debounce) canlı Supabase tablolarında `ilike` araması yapıp
// gerçek kayıtları doğru rotalarla (/gonderi, /isletmeler/{slug}, /profil,
// /etkinlikler, /gruplar/{slug}, /pazar/ilan) listeler. Bkz. TECH_DEBT #12.

type ResultType = 'post' | 'listing' | 'event' | 'business' | 'group' | 'person'

interface SearchResult {
  id: string
  title: string
  type: ResultType
  excerpt?: string
  href: string
}

interface SearchDropdownProps {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
}

const categories: { id: string; label: string; type: ResultType | null }[] = [
  { id: 'all', label: 'Tümü', type: null },
  { id: 'posts', label: 'Gönderi', type: 'post' },
  { id: 'listings', label: 'İlan', type: 'listing' },
  { id: 'events', label: 'Etkinlik', type: 'event' },
  { id: 'businesses', label: 'İşletme', type: 'business' },
  { id: 'people', label: 'Kişi', type: 'person' },
  { id: 'groups', label: 'Grup', type: 'group' },
]

const typeColors: Record<ResultType, string> = {
  post: 'bg-blue-100 text-blue-700',
  listing: 'bg-purple-100 text-purple-700',
  event: 'bg-orange-100 text-orange-700',
  business: 'bg-green-100 text-green-700',
  group: 'bg-pink-100 text-pink-700',
  person: 'bg-teal-100 text-teal-700',
}

const typeLabels: Record<ResultType, string> = {
  post: 'Gönderi',
  listing: 'İlan',
  event: 'Etkinlik',
  business: 'İşletme',
  group: 'Grup',
  person: 'Kişi',
}

const typeIcons: Record<ResultType, React.ReactNode> = {
  post: <FileText className="w-4 h-4" />,
  listing: <Tag className="w-4 h-4" />,
  event: <Calendar className="w-4 h-4" />,
  business: <Store className="w-4 h-4" />,
  group: <Users className="w-4 h-4" />,
  person: <User className="w-4 h-4" />,
}

// PostgREST `.or()` / `.ilike` filtrelerini bozan karakterleri ayıkla.
function sanitizeTerm(raw: string): string {
  return raw.trim().replace(/[%,()*:]/g, ' ').replace(/\s+/g, ' ').trim()
}

export function SearchDropdown({ isOpen, onClose, searchQuery }: SearchDropdownProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Canlı arama — her tuş vuruşunda 300 ms debounce ile Supabase'i sorgula.
  useEffect(() => {
    const term = sanitizeTerm(searchQuery)
    if (!isOpen || !term) {
      setResults([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    const supabase = createClient() as any
    // PostgREST .or() filtre enjeksiyonu: , ( ) karakterleri filtre ağacını
    // bölüyor (arama bozuluyor / filtre mantığı değişebiliyor). Ayıkla.
    // (E2E Son Kontrol denetimi 2026-06-12)
    const like = `%${term.replace(/[,()]/g, ' ').trim()}%`

    const timer = setTimeout(async () => {
      const [postsRes, bizRes, peopleRes, eventsRes, groupsRes, listingsRes] = await Promise.all([
        supabase
          .from('posts')
          .select('id, title, body, created_at')
          .or(`title.ilike.${like},body.ilike.${like}`)
          .order('created_at', { ascending: false })
          .limit(4),
        supabase
          .from('businesses')
          .select('id, slug, name, description')
          .or(`name.ilike.${like},description.ilike.${like}`)
          .limit(4),
        supabase
          .from('profiles')
          .select('id, full_name, bio')
          .ilike('full_name', like)
          .limit(4),
        supabase
          .from('events')
          .select('id, title, location, start_date')
          .or(`title.ilike.${like},location.ilike.${like}`)
          .order('start_date', { ascending: true })
          .limit(4),
        supabase
          .from('groups')
          .select('id, slug, name, description')
          .or(`name.ilike.${like},description.ilike.${like}`)
          .limit(4),
        supabase
          .from('listings')
          .select('id, title, price, status')
          .eq('status', 'active')
          .ilike('title', like)
          .order('created_at', { ascending: false })
          .limit(4),
      ])

      if (cancelled) return

      const combined: SearchResult[] = []

      for (const p of (postsRes.data as any[]) || []) {
        combined.push({
          id: `post-${p.id}`,
          title: p.title || (p.body ? String(p.body).slice(0, 60) : 'Gönderi'),
          type: 'post',
          excerpt: p.title ? p.body || undefined : undefined,
          href: `/gonderi/${p.id}`,
        })
      }
      for (const l of (listingsRes.data as any[]) || []) {
        const free = l.price === 0 || l.price === null
        combined.push({
          id: `listing-${l.id}`,
          title: l.title || 'Başlıksız İlan',
          type: 'listing',
          excerpt: free ? 'Ücretsiz' : `₺${Number(l.price).toLocaleString('tr-TR')}`,
          href: `/pazar/ilan/${l.id}`,
        })
      }
      for (const e of (eventsRes.data as any[]) || []) {
        combined.push({
          id: `event-${e.id}`,
          title: e.title || 'Etkinlik',
          type: 'event',
          excerpt: e.location || undefined,
          href: `/etkinlikler/${e.id}`,
        })
      }
      for (const b of (bizRes.data as any[]) || []) {
        combined.push({
          id: `business-${b.id}`,
          title: b.name || 'İşletme',
          type: 'business',
          excerpt: b.description || undefined,
          href: `/isletmeler/${b.slug || b.id}`,
        })
      }
      for (const u of (peopleRes.data as any[]) || []) {
        combined.push({
          id: `person-${u.id}`,
          title: u.full_name || 'İsimsiz Komşu',
          type: 'person',
          excerpt: u.bio || undefined,
          href: `/profil/${u.id}`,
        })
      }
      for (const g of (groupsRes.data as any[]) || []) {
        combined.push({
          id: `group-${g.id}`,
          title: g.name || 'Grup',
          type: 'group',
          excerpt: g.description || undefined,
          href: `/gruplar/${g.slug || g.id}`,
        })
      }

      setResults(combined)
      setLoading(false)
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [searchQuery, isOpen])

  // Kategori sekmesine göre filtrele
  const activeType = categories.find((c) => c.id === selectedCategory)?.type ?? null
  const filteredResults = activeType
    ? results.filter((r) => r.type === activeType)
    : results

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const trimmedQuery = searchQuery.trim()

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-lg shadow-lg z-40 w-full"
    >
      {/* Category Tabs */}
      <div className="flex items-center gap-1 px-4 pt-3 pb-3 border-b border-border overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary text-white'
                : 'bg-background text-gray-700 hover:bg-[#e4e6eb]'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Search Results */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : !trimmedQuery ? (
          <div className="px-4 py-8 text-center text-gray-500">
            <p className="text-sm">Aramak için bir kelime yazın</p>
          </div>
        ) : filteredResults.length > 0 ? (
          <div className="py-2">
            {filteredResults.map((result) => (
              <Link
                key={result.id}
                href={result.href}
                onClick={onClose}
                className="flex items-start gap-3 px-4 py-3 hover:bg-background transition-colors border-b border-[#f0f2f5] last:border-b-0"
              >
                {/* Icon */}
                <div className="mt-1 text-primary">{typeIcons[result.type]}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 truncate">{result.title}</h4>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${typeColors[result.type]}`}
                    >
                      {typeLabels[result.type]}
                    </span>
                  </div>
                  {result.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-2">{result.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-4 py-8 text-center text-gray-500">
            <p className="text-sm">Sonuç bulunamadı</p>
          </div>
        )}
      </div>

      {/* Footer with "View all results" link */}
      {trimmedQuery && (
        <Link
          href={`/ara?q=${encodeURIComponent(trimmedQuery)}`}
          onClick={onClose}
          className="block px-4 py-3 bg-background text-sm font-medium text-primary hover:bg-[#e4e6eb] border-t border-border rounded-b-lg transition-colors text-center"
        >
          Tüm sonuçları gör
        </Link>
      )}
    </div>
  )
}
