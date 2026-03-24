<<<<<<< HEAD
'use client'

import { useState, useEffect } from 'react'
import { Camera, MapPin, AlertTriangle, ArrowRight, Newspaper, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { PostFormModal } from '@/components/feed/post-form-modal'
import StoriesBar from '@/components/feed/stories-bar'
import { getFeedImageUrl } from '@/lib/demo-images'
import { AddressVerificationBanner } from '@/components/feed/address-verification-banner'
import { FeedPostCard, POST_CATEGORIES, type FeedPostData } from '@/components/feed/post-card'
import { useCurrentUser } from '@/lib/hooks/use-auth'
import { getPosts } from '@/lib/hooks/use-posts'

const feedTabs = [
  { id: 'foryou', label: 'Senin İçin' },
  { id: 'recent', label: 'Son Paylaşılanlar' },
  { id: 'nearby', label: 'Yakın Mahalleler' },
  { id: 'trending', label: 'Gündem' },
]

const mockPosts: FeedPostData[] = [
  { id: 'pinned-1', author: { name: 'Ibrahim M. (Muhtar)', initial: 'I', neighborhood: 'Kadıköy, Moda', profileId: 'ibrahim-muhtar' }, timeAgo: '3 sa', isSponsored: false, isPinned: true, category: 'guvenlik', title: 'Mahallede Şüpheli Faaliyet - Dikkat', body: 'Değerli mahalleli komşularımız, son iki haftada mahalle çeperinde bazı şüpheli hareketliler yaşanmistir. Lütfen çevre dikkat edin ve yetkililerine haber veriniz.', image: getFeedImageUrl(100), reactions: 156, comments: 42, feed: 'foryou' },
  { id: '1', author: { name: 'Ayse K.', initial: 'A', neighborhood: 'Kadıköy, Moda', profileId: 'ayse-k' }, timeAgo: '2 dk', isSponsored: false, isPinned: false, category: 'etkinlikler', title: 'Mahalle Pikniği Bu Akşam!', body: 'Merhaba komşular, bu akşam saat 20:00\'de mahalle parkında piknik yapıyoruz. Katılmak isteyen herkesi bekliyoruz! Yanınıza battaniye ve atıştırmalık getirmeniz yeterli.', image: getFeedImageUrl(58), reactions: 24, comments: 8, feed: 'foryou' },
  { id: '2', author: { name: 'Mehmet Y.', initial: 'M', neighborhood: 'Kadıköy, Caferağa', profileId: 'mehmet-y' }, timeAgo: '1 sa', isSponsored: false, isPinned: false, category: 'kayipbuluntu', title: 'Kayıp Kedi - Turuncu Tekir', body: 'Pazartesi günü turuncu renkli kedim mahallede kayboldu. Adı Mismis, çok uysal ve evcil. Görürseniz lütfen haber verin.', image: getFeedImageUrl(59), reactions: 42, comments: 15, feed: 'recent' },
  { id: '3', author: { name: 'Fatma C.', initial: 'F', neighborhood: 'Kadıköy, Moda', profileId: 'fatma-c' }, timeAgo: '3 sa', isSponsored: false, isPinned: false, category: 'oneriler', title: 'Yeni Kafede Harika Çilekli Cheesecake!', body: 'Yeni açılan Moda Kafe\'yi denediniz mi? Kahveleri harika ve fiyatlar gayet makul. Bir denemenizi tavsiye ederim!', reactions: 18, comments: 5, feed: 'foryou' },
  { id: '4', author: { name: 'Emre D.', initial: 'E', neighborhood: 'Kadıköy, Moda', profileId: 'emre-d' }, timeAgo: '5 sa', isSponsored: false, isPinned: false, category: 'guvenlik', title: 'Mahallede Şüpheli Araç', body: 'Dün gece saat 23:00 civarında Moda Caddesi üzerinde uzun süre park halinde bekleyen koyu renkli bir arac dikkatimi çekti.', image: getFeedImageUrl(61), reactions: 67, comments: 23, feed: 'trending' },
  { id: '5', author: { name: 'Ali R.', initial: 'A', neighborhood: 'Üsküdar, Çengelköy', profileId: 'ali-r' }, timeAgo: '6 sa', isSponsored: false, isPinned: false, category: 'oneriler', title: 'Çengelköy Sahilinde Yeni Yürüyüş Yolu', body: 'Belediye sahil boyunca harika bir yürüyüş yolu yaptı. Akşam saatlerinde çok güzel oluyor.', image: getFeedImageUrl(62), reactions: 31, comments: 9, feed: 'nearby' },
  { id: '6', author: { name: 'Zeynep A.', initial: 'Z', neighborhood: 'Kadıköy, Moda', profileId: 'zeynep-a' }, timeAgo: '10 sa', isSponsored: false, isPinned: false, category: 'sorular', title: 'Mahallede İyi Bir Elektrikçi Biliyor Musunuz?', body: 'Evimin elektrik sisteminde sorun var. Mahallede güvenilir bir elektrikçi biliyor musunuz?', reactions: 12, comments: 8, feed: 'foryou' },
  { id: '7', author: { name: 'Nur Y.', initial: 'N', neighborhood: 'Kadıköy, Moda', profileId: 'nur-y' }, timeAgo: '14 sa', isSponsored: false, isPinned: false, category: 'genel', title: 'Mahalle Temizlik Etkinliği', body: 'Cumartesi sabahı mahalle parkında ortak temizlik etkinliği yapıyoruz. Herkesi katılmaya davet ediyoruz.', image: getFeedImageUrl(65), reactions: 48, comments: 16, feed: 'foryou' },
]

function getTimeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'Az önce'
  if (diffMins < 60) return `${diffMins} dk`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} sa`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays} gun`
  return `${Math.floor(diffDays / 7)} hafta`
}

export default function FeedPage() {
  const { user, profile } = useCurrentUser()
  const [activeTab, setActiveTab] = useState('foryou')
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('tumu')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [postsToShow, setPostsToShow] = useState(6)
  const [posts, setPosts] = useState(mockPosts)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPosts() {
      const { data, error } = await getPosts({ limit: 20 })
      if (data && data.length > 0) {
        const mapped = data.map((p: any) => ({
          id: p.id,
          author: {
            name: p.profiles?.full_name || 'Anonim',
            initial: (p.profiles?.full_name || 'A')[0].toUpperCase(),
            neighborhood: 'Kadıköy, Moda',
            profileId: p.user_id,
          },
          timeAgo: getTimeAgo(p.created_at),
          isSponsored: false,
          isPinned: p.is_pinned || false,
          category: p.post_type || 'genel',
          title: p.title || '',
          body: p.content || '',
          image: p.image_urls?.[0] || undefined,
          reactions: p.reaction_count || 0,
          comments: p.comment_count || 0,
          feed: 'foryou',
        }))
        setPosts(mapped)
      }
      setLoading(false)
    }
    loadPosts()
  }, [])

  const filteredPosts = posts.filter((post) => {
    const tabMatch = activeTab === 'foryou' || post.feed === activeTab
    const categoryMatch = activeCategoryFilter === 'tumu' || post.category === activeCategoryFilter
    if (!searchQuery.trim()) return tabMatch && categoryMatch
    const q = searchQuery.toLowerCase()
    return tabMatch && categoryMatch && (post.title.toLowerCase().includes(q) || post.body.toLowerCase().includes(q))
  })

  const pinnedPosts = filteredPosts.filter(p => p.isPinned)
  const regularPosts = filteredPosts.filter(p => !p.isPinned)
  const displayedPosts = regularPosts.slice(0, postsToShow)

  return (
    <>
      <PostFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={(newPost: any) => setPosts([newPost, ...posts])} />

      <div className="max-w-[680px] mx-auto px-2 sm:px-4 py-3 sm:py-4 space-y-3">
        {pinnedPosts.length > 0 && (
          <div className="bg-surface rounded-xl shadow-card border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-light">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-error" />
                <h2 className="text-sm font-bold text-text-primary">Uyarilar</h2>
              </div>
              <Link href="/uyarilar" className="text-xs text-primary font-medium hover:text-primary-hover flex items-center gap-1">
                Tumu <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {posts.filter(p => p.category === 'guvenlik').slice(0, 2).map((alert) => (
              <div key={alert.id} className="px-4 py-3 border-b border-border-light last:border-b-0 hover:bg-surface-hover transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-error-light rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-error" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary">{alert.title}</p>
                    <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{alert.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <AddressVerificationBanner />
        <StoriesBar />

        <div onClick={() => setIsModalOpen(true)} className="bg-surface rounded-xl shadow-card border border-border p-4 hover:shadow-card-hover transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{profile?.full_name?.[0]?.toUpperCase() || 'K'}</div>
            <div className="flex-1 px-4 py-2.5 bg-background text-text-muted rounded-full text-sm">Mahallenize bir şeyler paylaşın...</div>
            <button className="p-2 hover:bg-surface-hover rounded-full transition-colors"><Camera className="w-5 h-5 text-text-muted" /></button>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted mt-2 ml-[52px]">
            <MapPin className="w-3.5 h-3.5" />
            <span>{profile?.full_name || 'Kadıköy, Moda'}</span>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text" placeholder="Gönderilerde ara..." value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPostsToShow(6) }}
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-full text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {feedTabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn('px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-all',
                activeTab === tab.id ? 'border-text-primary text-text-primary bg-surface shadow-sm' : 'border-border text-text-muted bg-surface hover:border-gray-300'
              )}>{tab.label}</button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {POST_CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategoryFilter(cat.id)}
              className={cn('px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all',
                activeCategoryFilter === cat.id ? `${cat.badgeColor} border-transparent` : 'border-border text-text-secondary bg-surface hover:border-primary'
              )}>{cat.label}</button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredPosts.length === 0 && (
            <div className="bg-surface rounded-xl border border-border p-12 text-center">
              <p className="text-text-primary font-medium">{searchQuery.trim() ? 'Arama sonucu bulunamadı' : 'Bu kategoride gönderi yok'}</p>
              <p className="text-text-muted text-sm mt-1">{searchQuery.trim() ? 'Farklı bir arama terimi deneyin' : 'Başka bir sekme deneyin'}</p>
            </div>
          )}
          {pinnedPosts.map((post) => <FeedPostCard key={post.id} post={post} />)}
          {displayedPosts.map((post) => <FeedPostCard key={post.id} post={post} />)}
        </div>

        {regularPosts.length > postsToShow && (
          <div className="text-center py-6">
            <button onClick={() => setPostsToShow(postsToShow + 4)} className="px-6 py-2.5 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-all shadow-sm hover:shadow-md">
              Daha Fazla Gönderi Yükle
            </button>
          </div>
        )}
      </div>
    </>
  )
}
=======
'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Camera, MapPin, AlertTriangle, ArrowRight, Newspaper, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const PostFormModal = dynamic(() => import('@/components/feed/post-form-modal').then(mod => ({ default: mod.PostFormModal })), { ssr: false })
import StoriesBar from '@/components/feed/stories-bar'
import { getFeedImageUrl } from '@/lib/demo-images'
import { AddressVerificationBanner } from '@/components/feed/address-verification-banner'
import { FeedPostCard, POST_CATEGORIES, type FeedPostData } from '@/components/feed/post-card'
import { useCurrentUser } from '@/lib/hooks/use-auth'
import { getPosts } from '@/lib/hooks/use-posts'
import { createClient } from '@/lib/supabase/client'

const feedTabs = [
  { id: 'foryou', label: 'Senin İçin' },
  { id: 'recent', label: 'Son Paylaşılanlar' },
  { id: 'nearby', label: 'Yakın Mahalleler' },
  { id: 'trending', label: 'Gündem' },
]

const mockPosts: FeedPostData[] = [
  { id: 'pinned-1', author: { name: 'Ibrahim M. (Muhtar)', initial: 'I', neighborhood: 'Kadıköy, Moda', profileId: 'ibrahim-muhtar' }, timeAgo: '3 sa', isSponsored: false, isPinned: true, category: 'safety', title: 'Mahallede Şüpheli Faaliyet - Dikkat', body: 'Değerli mahalleli komşularımız, son iki haftada mahalle çeperinde bazı şüpheli hareketliler yaşanmistir. Lütfen çevre dikkat edin ve yetkililerine haber veriniz.', image: getFeedImageUrl(100), reactions: 156, comments: 42, feed: 'foryou' },
  { id: '1', author: { name: 'Ayse K.', initial: 'A', neighborhood: 'Kadıköy, Moda', profileId: 'ayse-k' }, timeAgo: '2 dk', isSponsored: false, isPinned: false, category: 'event', title: 'Mahalle Pikniği Bu Akşam!', body: 'Merhaba komşular, bu akşam saat 20:00\'de mahalle parkında piknik yapıyoruz. Katılmak isteyen herkesi bekliyoruz! Yanınıza battaniye ve atıştırmalık getirmeniz yeterli.', image: getFeedImageUrl(58), reactions: 24, comments: 8, feed: 'foryou' },
  { id: '2', author: { name: 'Mehmet Y.', initial: 'M', neighborhood: 'Kadıköy, Caferağa', profileId: 'mehmet-y' }, timeAgo: '1 sa', isSponsored: false, isPinned: false, category: 'lost_found', title: 'Kayıp Kedi - Turuncu Tekir', body: 'Pazartesi günü turuncu renkli kedim mahallede kayboldu. Adı Mismis, çok uysal ve evcil. Görürseniz lütfen haber verin.', image: getFeedImageUrl(59), reactions: 42, comments: 15, feed: 'recent' },
  { id: '3', author: { name: 'Fatma C.', initial: 'F', neighborhood: 'Kadıköy, Moda', profileId: 'fatma-c' }, timeAgo: '3 sa', isSponsored: false, isPinned: false, category: 'recommendation', title: 'Yeni Kafede Harika Çilekli Cheesecake!', body: 'Yeni açılan Moda Kafe\'yi denediniz mi? Kahveleri harika ve fiyatlar gayet makul. Bir denemenizi tavsiye ederim!', reactions: 18, comments: 5, feed: 'foryou' },
  { id: '4', author: { name: 'Emre D.', initial: 'E', neighborhood: 'Kadıköy, Moda', profileId: 'emre-d' }, timeAgo: '5 sa', isSponsored: false, isPinned: false, category: 'safety', title: 'Mahallede Şüpheli Araç', body: 'Dün gece saat 23:00 civarında Moda Caddesi üzerinde uzun süre park halinde bekleyen koyu renkli bir arac dikkatimi çekti.', image: getFeedImageUrl(61), reactions: 67, comments: 23, feed: 'trending' },
  { id: '5', author: { name: 'Ali R.', initial: 'A', neighborhood: 'Üsküdar, Çengelköy', profileId: 'ali-r' }, timeAgo: '6 sa', isSponsored: false, isPinned: false, category: 'recommendation', title: 'Çengelköy Sahilinde Yeni Yürüyüş Yolu', body: 'Belediye sahil boyunca harika bir yürüyüş yolu yaptı. Akşam saatlerinde çok güzel oluyor.', image: getFeedImageUrl(62), reactions: 31, comments: 9, feed: 'nearby' },
  { id: '6', author: { name: 'Zeynep A.', initial: 'Z', neighborhood: 'Kadıköy, Moda', profileId: 'zeynep-a' }, timeAgo: '10 sa', isSponsored: false, isPinned: false, category: 'general', title: 'Mahallede İyi Bir Elektrikçi Biliyor Musunuz?', body: 'Evimin elektrik sisteminde sorun var. Mahallede güvenilir bir elektrikçi biliyor musunuz?', reactions: 12, comments: 8, feed: 'foryou' },
  { id: '7', author: { name: 'Nur Y.', initial: 'N', neighborhood: 'Kadıköy, Moda', profileId: 'nur-y' }, timeAgo: '14 sa', isSponsored: false, isPinned: false, category: 'general', title: 'Mahalle Temizlik Etkinliği', body: 'Cumartesi sabahı mahalle parkında ortak temizlik etkinliği yapıyoruz. Herkesi katılmaya davet ediyoruz.', image: getFeedImageUrl(65), reactions: 48, comments: 16, feed: 'foryou' },
]

function getTimeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'Az önce'
  if (diffMins < 60) return `${diffMins} dk`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} sa`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays} gun`
  return `${Math.floor(diffDays / 7)} hafta`
}

export default function FeedPage() {
  const { user, profile } = useCurrentUser()
  const [activeTab, setActiveTab] = useState('foryou')
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('tumu')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [postsToShow, setPostsToShow] = useState(6)
  const [posts, setPosts] = useState(mockPosts)
  const [loading, setLoading] = useState(true)
  const [userNeighborhood, setUserNeighborhood] = useState('Kadıköy, Moda')

  useEffect(() => {
    async function loadPosts() {
      // Fetch user's neighborhood first
      if (user?.id) {
        const supabase = createClient()
        try {
          const { data: neighborhoodData } = await supabase
            .from('neighborhood_members')
            .select('neighborhood_id, neighborhoods(name, district)')
            .eq('user_id', user.id)
            .single()

          if (neighborhoodData && neighborhoodData.neighborhoods) {
            const neighborhood = (neighborhoodData as any).neighborhoods
            if (neighborhood.district && neighborhood.name) {
              setUserNeighborhood(`${neighborhood.district}, ${neighborhood.name}`)
            }
          }
        } catch (err) {
          console.error('Failed to fetch user neighborhood:', err)
        }
      }

      const { data, error } = await getPosts({ limit: 20 })
      if (data && data.length > 0) {
        const mapped = data.map((p: any) => ({
          id: p.id,
          author: {
            name: p.profiles?.full_name || 'Anonim',
            initial: (p.profiles?.full_name || 'A')[0].toUpperCase(),
            neighborhood: p.neighborhoods ? `${p.neighborhoods.district}, ${p.neighborhoods.name}` : 'Mahalle',
            profileId: p.author_id,
          },
          timeAgo: getTimeAgo(p.created_at),
          isSponsored: false,
          isPinned: p.is_pinned || false,
          category: p.type || 'genel',
          title: p.title || '',
          body: p.body || '',
          image: p.media_urls?.[0] || undefined,
          reactions: p.reaction_count || 0,
          comments: p.comment_count || 0,
          feed: 'foryou',
        }))
        setPosts(mapped)
      }
      setLoading(false)
    }
    loadPosts()
  }, [user?.id])

  const filteredPosts = posts.filter((post) => {
    const tabMatch = activeTab === 'foryou' || post.feed === activeTab
    const categoryMatch = activeCategoryFilter === 'tumu' || post.category === activeCategoryFilter
    if (!searchQuery.trim()) return tabMatch && categoryMatch
    const q = searchQuery.toLowerCase()
    return tabMatch && categoryMatch && (post.title.toLowerCase().includes(q) || post.body.toLowerCase().includes(q))
  })

  const pinnedPosts = filteredPosts.filter(p => p.isPinned)
  const regularPosts = filteredPosts.filter(p => !p.isPinned)
  const displayedPosts = regularPosts.slice(0, postsToShow)

  return (
    <>
      <PostFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={(newPost: any) => setPosts([newPost, ...posts])} />

      <div className="max-w-[680px] mx-auto px-2 sm:px-4 py-3 sm:py-4 space-y-3">
        {pinnedPosts.length > 0 && (
          <div className="bg-surface rounded-xl shadow-card border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-light">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-error" />
                <h2 className="text-sm font-bold text-text-primary">Uyarilar</h2>
              </div>
              <Link href="/uyarilar" className="text-xs text-primary font-medium hover:text-primary-hover flex items-center gap-1">
                Tumu <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {posts.filter(p => p.category === 'safety').slice(0, 2).map((alert) => (
              <div key={alert.id} className="px-4 py-3 border-b border-border-light last:border-b-0 hover:bg-surface-hover transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-error-light rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-error" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary">{alert.title}</p>
                    <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{alert.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <AddressVerificationBanner />
        <StoriesBar />

        <div onClick={() => setIsModalOpen(true)} className="bg-surface rounded-xl shadow-card border border-border p-4 hover:shadow-card-hover transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{profile?.full_name?.[0]?.toUpperCase() || 'K'}</div>
            <div className="flex-1 px-4 py-2.5 bg-background text-text-muted rounded-full text-sm">Mahallenize bir şeyler paylaşın...</div>
            <button className="p-2 hover:bg-surface-hover rounded-full transition-colors"><Camera className="w-5 h-5 text-text-muted" /></button>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted mt-2 ml-[52px]">
            <MapPin className="w-3.5 h-3.5" />
            <span>{userNeighborhood}</span>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text" placeholder="Gönderilerde ara..." value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPostsToShow(6) }}
            aria-label="Gönderilerde ara"
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-full text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {feedTabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn('px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-all',
                activeTab === tab.id ? 'border-text-primary text-text-primary bg-surface shadow-sm' : 'border-border text-text-muted bg-surface hover:border-gray-300'
              )}>{tab.label}</button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {POST_CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategoryFilter(cat.id)}
              className={cn('px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all',
                activeCategoryFilter === cat.id ? `${cat.badgeColor} border-transparent` : 'border-border text-text-secondary bg-surface hover:border-primary'
              )}>{cat.label}</button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredPosts.length === 0 && (
            <div className="bg-surface rounded-xl border border-border p-12 text-center">
              <p className="text-text-primary font-medium">{searchQuery.trim() ? 'Arama sonucu bulunamadı' : 'Bu kategoride gönderi yok'}</p>
              <p className="text-text-muted text-sm mt-1">{searchQuery.trim() ? 'Farklı bir arama terimi deneyin' : 'Başka bir sekme deneyin'}</p>
            </div>
          )}
          {pinnedPosts.map((post) => <FeedPostCard key={post.id} post={post} />)}
          {displayedPosts.map((post) => <FeedPostCard key={post.id} post={post} />)}
        </div>

        {regularPosts.length > postsToShow && (
          <div className="text-center py-6">
            <button onClick={() => setPostsToShow(postsToShow + 4)} className="px-6 py-2.5 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-all shadow-sm hover:shadow-md">
              Daha Fazla Gönderi Yükle
            </button>
          </div>
        )}
      </div>
    </>
  )
}
>>>>>>> ab5629528fac6fe6996b018892fcc0642a0acd24
