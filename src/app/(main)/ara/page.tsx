'use client'

import { useState, useMemo } from 'react'
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
  MessageCircle,
  MapPin,
  Star,
  Clock,
  Users2,
  Search as SearchIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images'

// Type definitions
interface Post {
  id: string
  author: string
  excerpt: string
  date: string
  reactions: number
  avatar: string
}

interface Business {
  id: string
  name: string
  category: string
  rating: number
  distance: string
  reviews: number
}

interface Person {
  id: string
  name: string
  neighborhood: string
  mutualConnections: number
  avatar: string
}

interface Event {
  id: string
  title: string
  date: string
  location: string
  attendees: number
}

interface Group {
  id: string
  name: string
  members: number
  description: string
  image: string
}

interface Listing {
  id: string
  title: string
  price: number
  image: string
  condition: string
  neighborhood: string
  isFree: boolean
}

// Mock Data
const mockPosts: Post[] = [
  {
    id: '1',
    author: 'Ayşe Yılmaz',
    excerpt: 'Apartman girişindeki depo tamamen boşaltıldı. Herkes lütfen eşyalarını kontrol etsin.',
    date: '2 saat önce',
    reactions: 12,
    avatar: getFeedImageUrl(1, 40, 40),
  },
  {
    id: '2',
    author: 'Mert Demir',
    excerpt: 'Bu hafta sonu mahalle temizliği yapılacak. İlgilenen arkadaşlar lütfen cevap versin.',
    date: '4 saat önce',
    reactions: 24,
    avatar: getFeedImageUrl(2, 40, 40),
  },
  {
    id: '3',
    author: 'Zeynep Kara',
    excerpt: 'Kütüphanemize yeni kitaplar eklendi. Kiminiz ilgilenir?',
    date: '1 gün önce',
    reactions: 8,
    avatar: getFeedImageUrl(3, 40, 40),
  },
  {
    id: '4',
    author: 'Can Özkan',
    excerpt: 'Blok halkının isteği üzerine tenis masası kurdum. Herkes rahat rahat kullanabilir.',
    date: '2 gün önce',
    reactions: 45,
    avatar: getFeedImageUrl(4, 40, 40),
  },
  {
    id: '5',
    author: 'Elif Arslan',
    excerpt: 'Çatıdaki antena sorunu için ustalar gelecek. Herkes evde olsun lütfen.',
    date: '3 gün önce',
    reactions: 19,
    avatar: getFeedImageUrl(5, 40, 40),
  },
]

const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'Ali Usta - Elektrikçi',
    category: 'Elektrik',
    rating: 4.8,
    distance: '0.5 km',
    reviews: 24,
  },
  {
    id: '2',
    name: 'İstanbul Temizlik Hizmetleri',
    category: 'Temizlik',
    rating: 4.6,
    distance: '1.2 km',
    reviews: 18,
  },
  {
    id: '3',
    name: 'Doktor Ahmet Koruma',
    category: 'Sağlık',
    rating: 4.9,
    distance: '2 km',
    reviews: 32,
  },
  {
    id: '4',
    name: 'Nur Güzellik Merkezi',
    category: 'Güzellik',
    rating: 4.7,
    distance: '0.8 km',
    reviews: 15,
  },
]

const mockPeople: Person[] = [
  {
    id: '1',
    name: 'Fatma Türk',
    neighborhood: 'Fenerbahçe',
    mutualConnections: 5,
    avatar: getFeedImageUrl(10, 40, 40),
  },
  {
    id: '2',
    name: 'Hasan Demir',
    neighborhood: 'Moda',
    mutualConnections: 3,
    avatar: getFeedImageUrl(11, 40, 40),
  },
  {
    id: '3',
    name: 'Gül Yıldız',
    neighborhood: 'Caferağa',
    mutualConnections: 7,
    avatar: getFeedImageUrl(12, 40, 40),
  },
  {
    id: '4',
    name: 'Kerem Çetin',
    neighborhood: 'Caddebostan',
    mutualConnections: 2,
    avatar: getFeedImageUrl(13, 40, 40),
  },
]

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Mahalle Pikniği',
    date: '15 Mart, Pazar 14:00',
    location: 'Mahalle Parkı',
    attendees: 24,
  },
  {
    id: '2',
    title: 'Komşu Çay Saati',
    date: '17 Mart, Salı 15:00',
    location: 'Müdür Boyu',
    attendees: 12,
  },
  {
    id: '3',
    title: 'Spor Turnuvası',
    date: '22 Mart, Pazar 10:00',
    location: 'Mahalle Sporları Sahasında',
    attendees: 38,
  },
]

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Mahalle Gönüllüleri',
    members: 342,
    description: 'Sosyal aktiviteler ve komşuluk yardımlaşması',
    image: getFeedImageUrl(20, 80, 80),
  },
  {
    id: '2',
    name: 'Ebeveynler Grubu',
    members: 156,
    description: 'Çocuk yetiştirme ve eğitim konuları hakkında tartışmalar',
    image: getFeedImageUrl(21, 80, 80),
  },
  {
    id: '3',
    name: 'Spor ve Fitness',
    members: 89,
    description: 'Spor aktiviteleri ve fitness tavsiyesi',
    image: getFeedImageUrl(22, 80, 80),
  },
]

const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Laptop Lenovo - Az Kullanılmış',
    price: 8500,
    image: getFeedImageUrl(30, 100, 100),
    condition: 'Çok İyi',
    neighborhood: 'Moda',
    isFree: false,
  },
  {
    id: '2',
    title: 'IKEA Kanepe - Açık Gri',
    price: 2200,
    image: getFeedImageUrl(31, 100, 100),
    condition: 'Çok İyi',
    neighborhood: 'Fenerbahçe',
    isFree: false,
  },
  {
    id: '3',
    title: 'Çocuk Kitapları Seti',
    price: 0,
    image: getFeedImageUrl(32, 100, 100),
    condition: 'İyi',
    neighborhood: 'Caferağa',
    isFree: true,
  },
  {
    id: '4',
    title: 'Dumbbell Seti 20kg',
    price: 1200,
    image: getFeedImageUrl(33, 100, 100),
    condition: 'Yeni',
    neighborhood: 'Moda',
    isFree: false,
  },
  {
    id: '5',
    title: 'PlayStation 5',
    price: 6500,
    image: getFeedImageUrl(34, 100, 100),
    condition: 'Çok İyi',
    neighborhood: 'Kadıköy',
    isFree: false,
  },
]

// Tab Types
type TabType = 'all' | 'posts' | 'businesses' | 'people' | 'events' | 'groups' | 'marketplace'

interface Tab {
  id: TabType
  label: string
  icon: React.ReactNode
  count: number
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [activeTab, setActiveTab] = useState<TabType>('all')

  // Filter results based on query
  const filteredPosts = useMemo(
    () =>
      mockPosts.filter(
        (post) =>
          post.author.toLowerCase().includes(query.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  )

  const filteredBusinesses = useMemo(
    () =>
      mockBusinesses.filter(
        (business) =>
          business.name.toLowerCase().includes(query.toLowerCase()) ||
          business.category.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  )

  const filteredPeople = useMemo(
    () =>
      mockPeople.filter(
        (person) =>
          person.name.toLowerCase().includes(query.toLowerCase()) ||
          person.neighborhood.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  )

  const filteredEvents = useMemo(
    () =>
      mockEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(query.toLowerCase()) ||
          event.location.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  )

  const filteredGroups = useMemo(
    () =>
      mockGroups.filter(
        (group) =>
          group.name.toLowerCase().includes(query.toLowerCase()) ||
          group.description.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  )

  const filteredListings = useMemo(
    () =>
      mockListings.filter(
        (listing) =>
          listing.title.toLowerCase().includes(query.toLowerCase()) ||
          listing.neighborhood.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  )

  // Create tabs with counts
  const tabs: Tab[] = [
    { id: 'all', label: 'Tümü', icon: <SearchIcon className="w-4 h-4" />, count: 0 },
    { id: 'posts', label: 'Gönderiler', icon: <FileText className="w-4 h-4" />, count: filteredPosts.length },
    {
      id: 'businesses',
      label: 'İşletmeler',
      icon: <Store className="w-4 h-4" />,
      count: filteredBusinesses.length,
    },
    { id: 'people', label: 'Kişiler', icon: <Users className="w-4 h-4" />, count: filteredPeople.length },
    { id: 'events', label: 'Etkinlikler', icon: <Calendar className="w-4 h-4" />, count: filteredEvents.length },
    { id: 'groups', label: 'Gruplar', icon: <Home className="w-4 h-4" />, count: filteredGroups.length },
    { id: 'marketplace', label: 'Pazar', icon: <Tag className="w-4 h-4" />, count: filteredListings.length },
  ]

  // Render functions for each result type
  const renderPostResult = (post: Post) => (
    <Link
      key={post.id}
      href={`/posts/${post.id}`}
      className="bg-surface border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex gap-3 mb-3">
        <Image
          src={post.avatar}
          alt={post.author}
          width={40}
          height={40}
          className="rounded-full"
          unoptimized
        />
        <div className="flex-1">
          <p className="font-semibold text-text-primary text-sm">{post.author}</p>
          <p className="text-xs text-text-muted">{post.date}</p>
        </div>
      </div>
      <p className="text-text-secondary text-sm mb-3">{post.excerpt}</p>
      <div className="flex items-center gap-4 text-xs text-text-muted pt-3 border-t border-border">
        <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
          <MessageCircle className="w-4 h-4" />
          Yorumla
        </button>
        <span>{post.reactions} tepki</span>
      </div>
    </Link>
  )

  const renderBusinessResult = (business: Business) => (
    <Link
      key={business.id}
      href={`/businesses/${business.id}`}
      className="bg-surface border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-text-primary">{business.name}</h3>
          <p className="text-xs text-text-muted">{business.category}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end">
            <Star className="w-4 h-4 fill-[#FFA500] text-[#FFA500]" />
            <span className="font-semibold text-sm text-text-primary">{business.rating}</span>
          </div>
          <p className="text-xs text-text-muted">({business.reviews} yorum)</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <MapPin className="w-4 h-4" />
        <span>{business.distance}</span>
      </div>
    </Link>
  )

  const renderPersonResult = (person: Person) => (
    <Link
      key={person.id}
      href={`/profil/${person.id}`}
      className="bg-surface border border-border rounded-lg p-4 hover:shadow-md transition-shadow flex items-center gap-3"
    >
      <Image
        src={person.avatar}
        alt={person.name}
        width={50}
        height={50}
        className="rounded-full"
        unoptimized
      />
      <div className="flex-1">
        <p className="font-semibold text-text-primary">{person.name}</p>
        <p className="text-sm text-text-muted">{person.neighborhood}</p>
        <p className="text-xs text-text-muted mt-1">
          {person.mutualConnections > 0 && `${person.mutualConnections} ortak bağlantı`}
        </p>
      </div>
      <button className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-hover transition-colors whitespace-nowrap">
        Bağlan
      </button>
    </Link>
  )

  const renderEventResult = (event: Event) => (
    <Link
      key={event.id}
      href={`/events/${event.id}`}
      className="bg-surface border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <h3 className="font-semibold text-text-primary mb-2">{event.title}</h3>
      <div className="space-y-2 text-sm text-text-muted">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{event.date}</span>
        </div>
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

  const renderGroupResult = (group: Group) => (
    <Link
      key={group.id}
      href={`/groups/${group.id}`}
      className="bg-surface border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex gap-3 mb-3">
        <Image
          src={group.image}
          alt={group.name}
          width={60}
          height={60}
          className="rounded-lg"
          unoptimized
        />
        <div className="flex-1">
          <h3 className="font-semibold text-text-primary">{group.name}</h3>
          <p className="text-sm text-text-muted">{group.description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted">{group.members} üye</span>
        <button className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-hover transition-colors">
          Katıl
        </button>
      </div>
    </Link>
  )

  const renderListingResult = (listing: Listing) => (
    <Link
      key={listing.id}
      href={`/pazar/ilan/${listing.id}`}
      className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="flex gap-3">
        <div className="relative w-24 h-24 flex-shrink-0 bg-background">
          <Image
            src={listing.image}
            alt={listing.title}
            fill
            className="object-cover"
            unoptimized
          />
          {listing.isFree && (
            <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
              ÜCRETSİZ
            </span>
          )}
        </div>
        <div className="flex-1 p-3">
          <h3 className="font-semibold text-text-primary text-sm mb-1 line-clamp-2">{listing.title}</h3>
          {!listing.isFree && (
            <p className="text-lg font-bold text-text-primary mb-2">₺{listing.price.toLocaleString('tr-TR')}</p>
          )}
          <div className="space-y-1 text-xs text-text-muted">
            <p>{listing.condition}</p>
            <p>{listing.neighborhood}</p>
          </div>
        </div>
      </div>
    </Link>
  )

  const renderNoResults = (tabLabel: string) => (
    <div className="bg-surface border border-border rounded-lg p-12 text-center">
      <SearchIcon className="w-12 h-12 text-[#e0e0e0] mx-auto mb-4" />
      <p className="text-text-muted font-medium">
        "{query}" için {tabLabel.toLowerCase()} sonuç bulunamadı
      </p>
    </div>
  )

  // Determine what to render based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'posts':
        return filteredPosts.length > 0 ? (
          <div className="space-y-4">
            {filteredPosts.map((post) => renderPostResult(post))}
          </div>
        ) : (
          renderNoResults('Gönderi')
        )

      case 'businesses':
        return filteredBusinesses.length > 0 ? (
          <div className="space-y-4">
            {filteredBusinesses.map((business) => renderBusinessResult(business))}
          </div>
        ) : (
          renderNoResults('İşletme')
        )

      case 'people':
        return filteredPeople.length > 0 ? (
          <div className="space-y-4">
            {filteredPeople.map((person) => renderPersonResult(person))}
          </div>
        ) : (
          renderNoResults('Kişi')
        )

      case 'events':
        return filteredEvents.length > 0 ? (
          <div className="space-y-4">
            {filteredEvents.map((event) => renderEventResult(event))}
          </div>
        ) : (
          renderNoResults('Etkinlik')
        )

      case 'groups':
        return filteredGroups.length > 0 ? (
          <div className="space-y-4">
            {filteredGroups.map((group) => renderGroupResult(group))}
          </div>
        ) : (
          renderNoResults('Grup')
        )

      case 'marketplace':
        return filteredListings.length > 0 ? (
          <div className="space-y-4">
            {filteredListings.map((listing) => renderListingResult(listing))}
          </div>
        ) : (
          renderNoResults('Pazar')
        )

      case 'all':
      default:
        const hasAnyResults =
          filteredPosts.length > 0 ||
          filteredBusinesses.length > 0 ||
          filteredPeople.length > 0 ||
          filteredEvents.length > 0 ||
          filteredGroups.length > 0 ||
          filteredListings.length > 0

        if (!hasAnyResults) {
          return (
            <div className="bg-surface border border-border rounded-lg p-12 text-center">
              <SearchIcon className="w-12 h-12 text-[#e0e0e0] mx-auto mb-4" />
              <p className="text-text-muted font-medium">
                "{query}" için hiçbir sonuç bulunamadı
              </p>
            </div>
          )
        }

        return (
          <div className="space-y-8">
            {filteredPosts.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Gönderiler
                  </h2>
                  {filteredPosts.length > 3 && (
                    <Link
                      href={`/ara?q=${encodeURIComponent(query)}&tab=posts`}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      Tümünü Gör →
                    </Link>
                  )}
                </div>
                <div className="space-y-4">
                  {filteredPosts.slice(0, 3).map((post) => renderPostResult(post))}
                </div>
              </section>
            )}

            {filteredBusinesses.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <Store className="w-5 h-5 text-primary" />
                    İşletmeler
                  </h2>
                  {filteredBusinesses.length > 3 && (
                    <Link
                      href={`/ara?q=${encodeURIComponent(query)}&tab=businesses`}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      Tümünü Gör →
                    </Link>
                  )}
                </div>
                <div className="space-y-4">
                  {filteredBusinesses.slice(0, 3).map((business) => renderBusinessResult(business))}
                </div>
              </section>
            )}

            {filteredPeople.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Kişiler
                  </h2>
                  {filteredPeople.length > 3 && (
                    <Link
                      href={`/ara?q=${encodeURIComponent(query)}&tab=people`}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      Tümünü Gör →
                    </Link>
                  )}
                </div>
                <div className="space-y-4">
                  {filteredPeople.slice(0, 3).map((person) => renderPersonResult(person))}
                </div>
              </section>
            )}

            {filteredEvents.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Etkinlikler
                  </h2>
                  {filteredEvents.length > 3 && (
                    <Link
                      href={`/ara?q=${encodeURIComponent(query)}&tab=events`}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      Tümünü Gör →
                    </Link>
                  )}
                </div>
                <div className="space-y-4">
                  {filteredEvents.slice(0, 3).map((event) => renderEventResult(event))}
                </div>
              </section>
            )}

            {filteredGroups.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <Home className="w-5 h-5 text-primary" />
                    Gruplar
                  </h2>
                  {filteredGroups.length > 3 && (
                    <Link
                      href={`/ara?q=${encodeURIComponent(query)}&tab=groups`}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      Tümünü Gör →
                    </Link>
                  )}
                </div>
                <div className="space-y-4">
                  {filteredGroups.slice(0, 3).map((group) => renderGroupResult(group))}
                </div>
              </section>
            )}

            {filteredListings.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary" />
                    Pazar
                  </h2>
                  {filteredListings.length > 3 && (
                    <Link
                      href={`/ara?q=${encodeURIComponent(query)}&tab=marketplace`}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      Tümünü Gör →
                    </Link>
                  )}
                </div>
                <div className="space-y-4">
                  {filteredListings.slice(0, 3).map((listing) => renderListingResult(listing))}
                </div>
              </section>
            )}
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Arama Sonuçları</h1>
          {query && (
            <p className="text-text-muted">
              "{query}" için sonuçlar
            </p>
          )}
        </div>

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
      </div>
    </div>
  )
}
