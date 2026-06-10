'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  FileText,
  Store,
  Users,
  Calendar,
  Tag,
  Home,
  MapPin,
  Star,
  Clock,
  Users2,
  Package,
  Loader2,
  Search as SearchIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

// NOT (2026-06-07): Bu sayfa eskiden tamamen sahte (mock) verilerle çalışıyordu;
// gönderi/işletme/kişi/etkinlik/grup/ilan listeleri uydurmaydı ve demo-images
// görselleri kullanıyordu. Artık tüm sonuçlar canlı Supabase tablolarına `ilike`
// metin araması ile bağlıdır. Görsel yoksa baş harf/ikon yer tutucu gösterilir,
// uydurma fotoğraf/sayı yoktur. Bkz. TECH_DEBT #12.

// Veri tipleri (yalnızca gerçek kolonlardan türetilir)
interface PostResult {
  id: string
  author: string
  authorAvatar: string | null
  excerpt: string
  date: string
  reactions: number
  comments: number
}

interface BusinessResult {
  id: string
  slug: string
  name: string
  category: string
  rating: number
  reviews: number
  isVerified: boolean
  logo: string | null
}

interface PersonResult {
  id: string
  name: string
  bio: string
  avatar: string | null
}

interface EventResult {
  id: string
  title: string
  date: string
  location: string
  attendees: number
}

interface GroupResult {
  id: string
  slug: string
  name: string
  members: number
  description: string
  image: string | null
}

interface ListingResult {
  id: string
  title: string
  price: number
  image: string | null
  condition: string
  neighborhood: string
  isFree: boolean
}

interface SearchResults {
  posts: PostResult[]
  businesses: BusinessResult[]
  people: PersonResult[]
  events: EventResult[]
  groups: GroupResult[]
  listings: ListingResult[]
}

const EMPTY_RESULTS: SearchResults = {
  posts: [],
  businesses: [],
  people: [],
  events: [],
  groups: [],
  listings: [],
}

// Tab Types
type TabType = 'all' | 'posts' | 'businesses' | 'people' | 'events' | 'groups' | 'marketplace'

interface Tab {
  id: TabType
  label: string
  icon: React.ReactNode
  count: number
}

// Göreli zaman: "az önce" / "N saat önce" / yerel tarih
function formatRelativeTime(iso?: string | null): string {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const diffMin = Math.floor((Date.now() - then) / 60000)
  if (diffMin < 1) return 'az önce'
  if (diffMin < 60) return `${diffMin} dakika önce`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour} saat önce`
  const diffDay = Math.floor(diffHour / 24)
  if (diffDay === 1) return 'dün'
  if (diffDay < 7) return `${diffDay} gün önce`
  return new Date(iso).toLocaleDateString('tr-TR')
}

// PostgREST `.or()` / `.ilike` filtrelerini bozan karakterleri ayıkla.
function sanitizeTerm(raw: string): string {
  return raw.trim().replace(/[%,()*:]/g, ' ').replace(/\s+/g, ' ').trim()
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const tabParam = searchParams.get('tab') as TabType | null
  const validTabs: TabType[] = ['all', 'posts', 'businesses', 'people', 'events', 'groups', 'marketplace']
  const [activeTab, setActiveTab] = useState<TabType>(
    tabParam && validTabs.includes(tabParam) ? tabParam : 'all'
  )
  const [results, setResults] = useState<SearchResults>(EMPTY_RESULTS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const term = sanitizeTerm(query)
    if (!term) {
      setResults(EMPTY_RESULTS)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    const supabase = createClient() as any
    const like = `%${term}%`

    ;(async () => {
      try {
      const [postsRes, bizRes, peopleRes, eventsRes, groupsRes, listingsRes] = await Promise.all([
        supabase
          .from('posts')
          .select('id, title, body, created_at, reaction_count, comment_count, profiles!posts_author_id_fkey(full_name, avatar_url)')
          .or(`title.ilike.${like},body.ilike.${like}`)
          .order('created_at', { ascending: false })
          .limit(20),
        supabase
          .from('businesses')
          .select('id, slug, name, description, rating_avg, review_count, is_verified, logo_url, business_categories(name)')
          .or(`name.ilike.${like},description.ilike.${like}`)
          .limit(20),
        supabase
          .from('profiles')
          .select('id, full_name, avatar_url, bio')
          .ilike('full_name', like)
          .limit(20),
        supabase
          .from('events')
          .select('id, title, location, start_date, attendee_count')
          .or(`title.ilike.${like},location.ilike.${like}`)
          .order('start_date', { ascending: true })
          .limit(20),
        supabase
          .from('groups')
          .select('id, slug, name, description, member_count, cover_image')
          .or(`name.ilike.${like},description.ilike.${like}`)
          .limit(20),
        supabase
          .from('listings')
          .select('id, title, price, media_urls, condition, created_at, neighborhoods(name)')
          .eq('status', 'active')
          .ilike('title', like)
          .order('created_at', { ascending: false })
          .limit(20),
      ])

      if (cancelled) return

      const posts: PostResult[] = ((postsRes.data as any[]) || []).map((p) => ({
        id: p.id,
        author: p.profiles?.full_name || 'Komşu',
        authorAvatar: p.profiles?.avatar_url || null,
        excerpt: p.title || p.body || '',
        date: formatRelativeTime(p.created_at),
        reactions: p.reaction_count || 0,
        comments: p.comment_count || 0,
      }))

      const businesses: BusinessResult[] = ((bizRes.data as any[]) || []).map((b) => ({
        id: b.id,
        slug: b.slug || b.id,
        name: b.name,
        category: b.business_categories?.name || 'Diğer',
        rating: Number(b.rating_avg) || 0,
        reviews: b.review_count || 0,
        isVerified: !!b.is_verified,
        logo: b.logo_url || null,
      }))

      const people: PersonResult[] = ((peopleRes.data as any[]) || []).map((u) => ({
        id: u.id,
        name: u.full_name || 'İsimsiz Komşu',
        bio: u.bio || '',
        avatar: u.avatar_url || null,
      }))

      const events: EventResult[] = ((eventsRes.data as any[]) || []).map((e) => ({
        id: e.id,
        title: e.title,
        date: e.start_date
          ? new Date(e.start_date).toLocaleString('tr-TR', {
              day: 'numeric',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '',
        location: e.location || 'Mahalle',
        attendees: e.attendee_count || 0,
      }))

      const groups: GroupResult[] = ((groupsRes.data as any[]) || []).map((g) => ({
        id: g.id,
        slug: g.slug || g.id,
        name: g.name,
        members: g.member_count || 0,
        description: g.description || '',
        image: g.cover_image || null,
      }))

      const listings: ListingResult[] = ((listingsRes.data as any[]) || []).map((l) => ({
        id: l.id,
        title: l.title || 'Başlıksız İlan',
        price: l.price || 0,
        image: l.media_urls?.[0] || null,
        condition: l.condition || '',
        neighborhood: l.neighborhoods?.name || '',
        isFree: l.price === 0 || l.price === null,
      }))

      setResults({ posts, businesses, people, events, groups, listings })
      } catch (err) {
        // Sorgulardan biri reddedilirse spinner sonsuza dek dönmesin: logla + boş sonuç.
        console.error('[ara] arama başarısız:', err)
        if (!cancelled) setResults(EMPTY_RESULTS)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [query])

  const { posts, businesses, people, events, groups, listings } = results

  // Create tabs with counts
  const tabs: Tab[] = [
    { id: 'all', label: 'Tümü', icon: <SearchIcon className="w-4 h-4" />, count: 0 },
    { id: 'posts', label: 'Gönderiler', icon: <FileText className="w-4 h-4" />, count: posts.length },
    { id: 'businesses', label: 'İşletmeler', icon: <Store className="w-4 h-4" />, count: businesses.length },
    { id: 'people', label: 'Kişiler', icon: <Users className="w-4 h-4" />, count: people.length },
    { id: 'events', label: 'Etkinlikler', icon: <Calendar className="w-4 h-4" />, count: events.length },
    { id: 'groups', label: 'Gruplar', icon: <Home className="w-4 h-4" />, count: groups.length },
    { id: 'marketplace', label: 'Pazar', icon: <Tag className="w-4 h-4" />, count: listings.length },
  ]

  // Render functions for each result type
  const renderPostResult = (post: PostResult) => (
    <Link
      key={post.id}
      href={`/gonderi/${post.id}`}
      className="block bg-surface border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex gap-3 mb-3 items-center">
        {post.authorAvatar ? (
          <Image src={post.authorAvatar} alt={post.author} width={40} height={40} className="rounded-full" unoptimized />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
            {post.author[0]?.toUpperCase() || 'K'}
          </div>
        )}
        <div className="flex-1">
          <p className="font-semibold text-text-primary text-sm">{post.author}</p>
          {post.date && <p className="text-xs text-text-muted">{post.date}</p>}
        </div>
      </div>
      <p className="text-text-secondary text-sm mb-3 line-clamp-3">{post.excerpt}</p>
      <div className="flex items-center gap-4 text-xs text-text-muted pt-3 border-t border-border">
        <span>{post.reactions} tepki</span>
        <span>{post.comments} yorum</span>
      </div>
    </Link>
  )

  const renderBusinessResult = (business: BusinessResult) => (
    <Link
      key={business.id}
      href={`/isletmeler/${business.slug}`}
      className="block bg-surface border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        {business.logo ? (
          <Image src={business.logo} alt={business.name} width={48} height={48} className="rounded-lg object-cover" unoptimized />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <Store className="w-6 h-6" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-text-primary truncate">{business.name}</h3>
              <p className="text-xs text-text-muted">{business.category}</p>
            </div>
            {business.rating > 0 && (
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1 justify-end">
                  <Star className="w-4 h-4 fill-[#FFA500] text-[#FFA500]" />
                  <span className="font-semibold text-sm text-text-primary">{business.rating.toFixed(1)}</span>
                </div>
                <p className="text-xs text-text-muted">({business.reviews} yorum)</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )

  const renderPersonResult = (person: PersonResult) => (
    <Link
      key={person.id}
      href={`/profil/${person.id}`}
      className="bg-surface border border-border rounded-lg p-4 hover:shadow-md transition-shadow flex items-center gap-3"
    >
      {person.avatar ? (
        <Image src={person.avatar} alt={person.name} width={50} height={50} className="rounded-full" unoptimized />
      ) : (
        <div className="w-[50px] h-[50px] rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-lg flex-shrink-0">
          {person.name[0]?.toUpperCase() || 'K'}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-text-primary">{person.name}</p>
        {person.bio && <p className="text-sm text-text-muted line-clamp-1">{person.bio}</p>}
      </div>
    </Link>
  )

  const renderEventResult = (event: EventResult) => (
    <Link
      key={event.id}
      href={`/etkinlikler/${event.id}`}
      className="block bg-surface border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <h3 className="font-semibold text-text-primary mb-2">{event.title}</h3>
      <div className="space-y-2 text-sm text-text-muted">
        {event.date && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{event.date}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users2 className="w-4 h-4" />
          <span>{event.attendees} katılımcı</span>
        </div>
      </div>
    </Link>
  )

  const renderGroupResult = (group: GroupResult) => (
    <Link
      key={group.id}
      href={`/gruplar/${group.slug}`}
      className="block bg-surface border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex gap-3">
        {group.image ? (
          <Image src={group.image} alt={group.name} width={60} height={60} className="rounded-lg object-cover" unoptimized />
        ) : (
          <div className="w-[60px] h-[60px] rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <Users className="w-7 h-7" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary">{group.name}</h3>
          {group.description && <p className="text-sm text-text-muted line-clamp-2">{group.description}</p>}
          <span className="text-xs text-text-muted">{group.members} üye</span>
        </div>
      </div>
    </Link>
  )

  const renderListingResult = (listing: ListingResult) => (
    <Link
      key={listing.id}
      href={`/pazar/ilan/${listing.id}`}
      className="block bg-surface border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="flex gap-3">
        <div className="relative w-24 h-24 flex-shrink-0 bg-background flex items-center justify-center">
          {listing.image ? (
            <Image src={listing.image} alt={listing.title} fill className="object-cover" unoptimized />
          ) : (
            <Package className="w-8 h-8 text-text-muted" />
          )}
          {listing.isFree && (
            <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
              ÜCRETSİZ
            </span>
          )}
        </div>
        <div className="flex-1 p-3 min-w-0">
          <h3 className="font-semibold text-text-primary text-sm mb-1 line-clamp-2">{listing.title}</h3>
          {!listing.isFree && (
            <p className="text-lg font-bold text-text-primary mb-2">₺{listing.price.toLocaleString('tr-TR')}</p>
          )}
          <div className="space-y-1 text-xs text-text-muted">
            {listing.condition && <p>{listing.condition}</p>}
            {listing.neighborhood && <p>{listing.neighborhood}</p>}
          </div>
        </div>
      </div>
    </Link>
  )

  const renderNoResults = (tabLabel: string) => (
    <div className="bg-surface border border-border rounded-lg p-12 text-center">
      <SearchIcon className="w-12 h-12 text-[#e0e0e0] mx-auto mb-4" />
      <p className="text-text-muted font-medium">
        &quot;{query}&quot; için {tabLabel.toLowerCase()} sonucu bulunamadı
      </p>
    </div>
  )

  const renderSectionHeader = (icon: React.ReactNode, label: string, count: number, tab: TabType) => (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
        {icon}
        {label}
      </h2>
      {count > 3 && (
        <Link
          href={`/ara?q=${encodeURIComponent(query)}&tab=${tab}`}
          className="text-primary text-sm font-medium hover:underline"
        >
          Tümünü Gör →
        </Link>
      )}
    </div>
  )

  // Determine what to render based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'posts':
        return posts.length > 0 ? (
          <div className="space-y-4">{posts.map(renderPostResult)}</div>
        ) : (
          renderNoResults('Gönderi')
        )
      case 'businesses':
        return businesses.length > 0 ? (
          <div className="space-y-4">{businesses.map(renderBusinessResult)}</div>
        ) : (
          renderNoResults('İşletme')
        )
      case 'people':
        return people.length > 0 ? (
          <div className="space-y-4">{people.map(renderPersonResult)}</div>
        ) : (
          renderNoResults('Kişi')
        )
      case 'events':
        return events.length > 0 ? (
          <div className="space-y-4">{events.map(renderEventResult)}</div>
        ) : (
          renderNoResults('Etkinlik')
        )
      case 'groups':
        return groups.length > 0 ? (
          <div className="space-y-4">{groups.map(renderGroupResult)}</div>
        ) : (
          renderNoResults('Grup')
        )
      case 'marketplace':
        return listings.length > 0 ? (
          <div className="space-y-4">{listings.map(renderListingResult)}</div>
        ) : (
          renderNoResults('Pazar')
        )
      case 'all':
      default: {
        const hasAnyResults =
          posts.length > 0 ||
          businesses.length > 0 ||
          people.length > 0 ||
          events.length > 0 ||
          groups.length > 0 ||
          listings.length > 0

        if (!hasAnyResults) {
          return (
            <div className="bg-surface border border-border rounded-lg p-12 text-center">
              <SearchIcon className="w-12 h-12 text-[#e0e0e0] mx-auto mb-4" />
              <p className="text-text-muted font-medium">&quot;{query}&quot; için hiçbir sonuç bulunamadı</p>
            </div>
          )
        }

        return (
          <div className="space-y-8">
            {posts.length > 0 && (
              <section>
                {renderSectionHeader(<FileText className="w-5 h-5 text-primary" />, 'Gönderiler', posts.length, 'posts')}
                <div className="space-y-4">{posts.slice(0, 3).map(renderPostResult)}</div>
              </section>
            )}
            {businesses.length > 0 && (
              <section>
                {renderSectionHeader(<Store className="w-5 h-5 text-primary" />, 'İşletmeler', businesses.length, 'businesses')}
                <div className="space-y-4">{businesses.slice(0, 3).map(renderBusinessResult)}</div>
              </section>
            )}
            {people.length > 0 && (
              <section>
                {renderSectionHeader(<Users className="w-5 h-5 text-primary" />, 'Kişiler', people.length, 'people')}
                <div className="space-y-4">{people.slice(0, 3).map(renderPersonResult)}</div>
              </section>
            )}
            {events.length > 0 && (
              <section>
                {renderSectionHeader(<Calendar className="w-5 h-5 text-primary" />, 'Etkinlikler', events.length, 'events')}
                <div className="space-y-4">{events.slice(0, 3).map(renderEventResult)}</div>
              </section>
            )}
            {groups.length > 0 && (
              <section>
                {renderSectionHeader(<Home className="w-5 h-5 text-primary" />, 'Gruplar', groups.length, 'groups')}
                <div className="space-y-4">{groups.slice(0, 3).map(renderGroupResult)}</div>
              </section>
            )}
            {listings.length > 0 && (
              <section>
                {renderSectionHeader(<Tag className="w-5 h-5 text-primary" />, 'Pazar', listings.length, 'marketplace')}
                <div className="space-y-4">{listings.slice(0, 3).map(renderListingResult)}</div>
              </section>
            )}
          </div>
        )
      }
    }
  }

  return (
    <div className="min-h-screen bg-background py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Arama Sonuçları</h1>
          {query && (
            <p className="text-text-muted">&quot;{query}&quot; için sonuçlar</p>
          )}
        </div>

        {!query ? (
          <div className="bg-surface border border-border rounded-lg p-12 text-center">
            <SearchIcon className="w-12 h-12 text-[#e0e0e0] mx-auto mb-4" />
            <p className="text-text-muted font-medium">Aramak için bir kelime yazın</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="bg-surface rounded-lg shadow-sm border border-border mb-6 overflow-hidden">
              <div className="flex gap-0 border-b border-border overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-[3px] whitespace-nowrap transition-colors',
                      activeTab === tab.id
                        ? 'text-primary border-primary'
                        : 'text-text-muted border-transparent hover:text-text-secondary'
                    )}
                  >
                    {tab.icon}
                    {tab.label}
                    {tab.count > 0 && (
                      <span className="ml-1 px-2 py-0.5 bg-background rounded-full text-xs font-semibold text-text-primary">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Content */}
            {renderContent()}
          </>
        )}
      </div>
    </div>
  )
}
