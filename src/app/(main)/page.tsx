'use client'

import { useState } from 'react'
import { Camera, MapPin, AlertTriangle, ArrowRight, Newspaper, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { PostFormModal } from '@/components/feed/post-form-modal'
import StoriesBar from '@/components/feed/stories-bar'
import { getFeedImageUrl } from '@/lib/demo-images'
import { AddressVerificationBanner } from '@/components/feed/address-verification-banner'
import { FeedPostCard, POST_CATEGORIES, type FeedPostData } from '@/components/feed/post-card'

const feedTabs = [
  { id: 'foryou', label: 'Senin Icin' },
  { id: 'recent', label: 'Son Paylaslanlar' },
  { id: 'nearby', label: 'Yakin Mahalleler' },
  { id: 'trending', label: 'Gundem' },
]

const mockPosts: FeedPostData[] = [
  { id: 'pinned-1', author: { name: 'Ibrahim M. (Muhtar)', initial: 'I', neighborhood: 'Kadikoy, Moda', profileId: 'ibrahim-muhtar' }, timeAgo: '3 sa', isSponsored: false, isPinned: true, category: 'guvenlik', title: 'Mahallede Supheli Faaliyet - Dikkat', body: 'Degerli mahalleli komsularimiz, son iki haftada mahalle ceperinde bazi supheli hareketliler yaşanmistir. Lutfen cevre dikkat edin ve yetkililerine haber veriniz.', image: getFeedImageUrl(100), reactions: 156, comments: 42, feed: 'foryou' },
  { id: '1', author: { name: 'Ayse K.', initial: 'A', neighborhood: 'Kadikoy, Moda', profileId: 'ayse-k' }, timeAgo: '2 dk', isSponsored: false, isPinned: false, category: 'etkinlikler', title: 'Mahalle Piknigi Bu Aksam!', body: 'Merhaba komsular, bu aksam saat 20:00\'de mahalle parkinda piknik yapiyoruz. Katilmak isteyen herkesi bekliyoruz! Yaniniza battaniye ve atistirmalik getirmeniz yeterli.', image: getFeedImageUrl(58), reactions: 24, comments: 8, feed: 'foryou' },
  { id: '2', author: { name: 'Mehmet Y.', initial: 'M', neighborhood: 'Kadikoy, Caferaga', profileId: 'mehmet-y' }, timeAgo: '1 sa', isSponsored: false, isPinned: false, category: 'kayipbuluntu', title: 'Kayip Kedi - Turuncu Tekir', body: 'Pazartesi gunu turuncu renkli kedim mahallede kayboldu. Adi Mismis, cok uysal ve evcil. Gorurseniz lutfen haber verin.', image: getFeedImageUrl(59), reactions: 42, comments: 15, feed: 'recent' },
  { id: '3', author: { name: 'Fatma C.', initial: 'F', neighborhood: 'Kadikoy, Moda', profileId: 'fatma-c' }, timeAgo: '3 sa', isSponsored: false, isPinned: false, category: 'oneriler', title: 'Yeni Kafede Harika Cilekli Cheesecake!', body: 'Yeni acilan Moda Kafe\'yi denediniz mi? Kahveleri harika ve fiyatlar gayet makul. Bir denemenizi tavsiye ederim!', reactions: 18, comments: 5, feed: 'foryou' },
  { id: '4', author: { name: 'Emre D.', initial: 'E', neighborhood: 'Kadikoy, Moda', profileId: 'emre-d' }, timeAgo: '5 sa', isSponsored: false, isPinned: false, category: 'guvenlik', title: 'Mahallede Supheli Arac', body: 'Dun gece saat 23:00 civarinda Moda Caddesi uzerinde uzun sure park halinde bekleyen koyu renkli bir arac dikkatimi cekti.', image: getFeedImageUrl(61), reactions: 67, comments: 23, feed: 'trending' },
  { id: '5', author: { name: 'Ali R.', initial: 'A', neighborhood: 'Uskudar, Cengelkoy', profileId: 'ali-r' }, timeAgo: '6 sa', isSponsored: false, isPinned: false, category: 'oneriler', title: 'Cengelkoy Sahilinde Yeni Yuruyus Yolu', body: 'Belediye sahil boyunca harika bir yuruyus yolu yapti. Aksam saatlerinde cok guzel oluyor.', image: getFeedImageUrl(62), reactions: 31, comments: 9, feed: 'nearby' },
  { id: '6', author: { name: 'Zeynep A.', initial: 'Z', neighborhood: 'Kadikoy, Moda', profileId: 'zeynep-a' }, timeAgo: '10 sa', isSponsored: false, isPinned: false, category: 'sorular', title: 'Mahallede Iyi Bir Elektrikci Biliyor Musunuz?', body: 'Evimin elektrik sisteminde sorun var. Mahallede guvenilir bir elektrikci biliyor musunuz?', reactions: 12, comments: 8, feed: 'foryou' },
  { id: '7', author: { name: 'Nur Y.', initial: 'N', neighborhood: 'Kadikoy, Moda', profileId: 'nur-y' }, timeAgo: '14 sa', isSponsored: false, isPinned: false, category: 'genel', title: 'Mahalle Temizlik Etkinligi', body: 'Cumartesi sabahi mahalle parkinda ortak temizlik etkinligi yapiyoruz. Herkesi katilmaya davet ediyoruz.', image: getFeedImageUrl(65), reactions: 48, comments: 16, feed: 'foryou' },
]

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState('foryou')
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('tumu')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [postsToShow, setPostsToShow] = useState(6)
  const [posts, setPosts] = useState(mockPosts)

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

      <div className="max-w-[680px] mx-auto px-4 py-4 space-y-3">
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

        <AddressVerificationBanner status="unverified" daysRemaining={27} />
        <StoriesBar />

        <div onClick={() => setIsModalOpen(true)} className="bg-surface rounded-xl shadow-card border border-border p-4 hover:shadow-card-hover transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">C</div>
            <div className="flex-1 px-4 py-2.5 bg-background text-text-muted rounded-full text-sm">Mahallenize bir seyler paylasin...</div>
            <button className="p-2 hover:bg-surface-hover rounded-full transition-colors"><Camera className="w-5 h-5 text-text-muted" /></button>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted mt-2 ml-[52px]">
            <MapPin className="w-3.5 h-3.5" />
            <span>Kadikoy, Moda</span>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text" placeholder="Gonderilerde ara..." value={searchQuery}
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
              <p className="text-text-primary font-medium">{searchQuery.trim() ? 'Arama sonucu bulunamadi' : 'Bu kategoride gonderi yok'}</p>
              <p className="text-text-muted text-sm mt-1">{searchQuery.trim() ? 'Farkli bir arama terimi deneyin' : 'Baska bir sekme deneyin'}</p>
            </div>
          )}
          {pinnedPosts.map((post) => <FeedPostCard key={post.id} post={post} />)}
          {displayedPosts.map((post) => <FeedPostCard key={post.id} post={post} />)}
        </div>

        {regularPosts.length > postsToShow && (
          <div className="text-center py-6">
            <button onClick={() => setPostsToShow(postsToShow + 4)} className="px-6 py-2.5 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-all shadow-sm hover:shadow-md">
              Daha Fazla Gonderi Yukle
            </button>
          </div>
        )}
      </div>
    </>
  )
}
