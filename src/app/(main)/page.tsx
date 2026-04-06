'use client'



import { useState, useEffect } from 'react'

import dynamic from 'next/dynamic'

import { Camera, MapPin, AlertTriangle, ArrowRight, Newspaper } from 'lucide-react'

import { cn } from '@/lib/utils'

import Link from 'next/link'



const PostFormModal = dynamic(() => import('@/components/feed/post-form-modal').then(mod => ({ default: mod.PostFormModal })), { ssr: false })

import { getFeedImageUrl } from '@/lib/demo-images'

import { AddressVerificationBanner } from '@/components/feed/address-verification-banner'

import { FeedPostCard, type FeedPostData } from '@/components/feed/post-card'

import { useCurrentUser } from '@/lib/hooks/use-auth'

import { getPosts } from '@/lib/hooks/use-posts'

import { createClient } from '@/lib/supabase/client'



const feedTabs = [

  { id: 'foryou', label: 'Senin Ä°Ã§in' },

  { id: 'recent', label: 'Son PaylaÅÄ±lanlar' },

  { id: 'nearby', label: 'YakÄ±n Mahalleler' },

  { id: 'trending', label: 'GÃ¼ndem' },

]



const mockPosts: FeedPostData[] = [

  { id: 'pinned-1', author: { name: 'Ibrahim M. (Muhtar)', initial: 'I', neighborhood: 'KadÄ±kÃ¶y, Moda', profileId: 'ibrahim-muhtar' }, timeAgo: '3 sa', isSponsored: false, isPinned: true, category: 'safety', title: 'Mahallede ÅÃ¼pheli Faaliyet - Dikkat', body: 'DeÄerli mahalleli komÅularÄ±mÄ±z, son iki haftada mahalle Ã§eperinde bazÄ± ÅÃ¼pheli hareketliler yaÅanmistir. LÃ¼tfen Ã§evre dikkat edin ve yetkililerine haber veriniz.', image: getFeedImageUrl(100), reactions: 156, comments: 42, feed: 'foryou' },

  { id: '1', author: { name: 'Ayse K.', initial: 'A', neighborhood: 'KadÄ±kÃ¶y, Moda', profileId: 'ayse-k' }, timeAgo: '2 dk', isSponsored: false, isPinned: false, category: 'event', title: 'Mahalle PikniÄi Bu AkÅam!', body: 'Merhaba komÅular, bu akÅam saat 20:00\'de mahalle parkÄ±nda piknik yapÄ±yoruz. KatÄ±lmak isteyen herkesi bekliyoruz! YanÄ±nÄ±za battaniye ve atÄ±ÅtÄ±rmalÄ±k getirmeniz yeterli.', image: getFeedImageUrl(58), reactions: 24, comments: 8, feed: 'foryou' },

  { id: '2', author: { name: 'Mehmet Y.', initial: 'M', neighborhood: 'KadÄ±kÃ¶y, CaferaÄa', profileId: 'mehmet-y' }, timeAgo: '1 sa', isSponsored: false, isPinned: false, category: 'lost_found', title: 'KayÄ±p Kedi - Turuncu Tekir', body: 'Pazartesi gÃ¼nÃ¼ turuncu renkli kedim mahallede kayboldu. AdÄ± Mismis, Ã§ok uysal ve evcil. GÃ¶rÃ¼rseniz lÃ¼tfen haber verin.', image: getFeedImageUrl(59), reactions: 42, comments: 15, feed: 'recent' },

  { id: '3', author: { name: 'Fatma C.', initial: 'F', neighborhood: 'KadÄ±kÃ¶y, Moda', profileId: 'fatma-c' }, timeAgo: '3 sa', isSponsored: false, isPinned: false, category: 'recommendation', title: 'Yeni Kafede Harika Ãilekli Cheesecake!', body: 'Yeni aÃ§Ä±lan Moda Kafe\'yi denediniz mi? Kahveleri harika ve fiyatlar gayet makul. Bir denemenizi tavsiye ederim!', reactions: 18, comments: 5, feed: 'foryou' },

  { id: '4', author: { name: 'Emre D.', initial: 'E', neighborhood: 'KadÄ±kÃ¶y, Moda', profileId: 'emre-d' }, timeAgo: '5 sa', isSponsored: false, isPinned: false, category: 'safety', title: 'Mahallede ÅÃ¼pheli AraÃ§', body: 'DÃ¼n gece saat 23:00 civarÄ±nda Moda Caddesi Ã¼zerinde uzun sÃ¼re park halinde bekleyen koyu renkli bir arac dikkatimi Ã§ekti.', image: getFeedImageUrl(61), reactions: 67, comments: 23, feed: 'trending' },

  { id: '5', author: { name: 'Ali R.', initial: 'A', neighborhood: 'ÃskÃ¼dar, ÃengelkÃ¶y', profileId: 'ali-r' }, timeAgo: '6 sa', isSponsored: false, isPinned: false, category: 'recommendation', title: 'ÃengelkÃ¶y Sahilinde Yeni YÃ¼rÃ¼yÃ¼Å Yolu', body: 'Belediye sahil boyunca harika bir yÃ¼rÃ¼yÃ¼Å yolu yaptÄ±. AkÅam saatlerinde Ã§ok gÃ¼zel oluyor.', image: getFeedImageUrl(62), reactions: 31, comments: 9, feed: 'nearby' },

  { id: '6', author: { name: 'Zeynep A.', initial: 'Z', neighborhood: 'KadÄ±kÃ¶y, Moda', profileId: 'zeynep-a' }, timeAgo: '10 sa', isSponsored: false, isPinned: false, category: 'general', title: 'Mahallede Ä°yi Bir ElektrikÃ§i Biliyor Musunuz?', body: 'Evimin elektrik sisteminde sorun var. Mahallede gÃ¼venilir bir elektrikÃ§i biliyor musunuz?', reactions: 12, comments: 8, feed: 'foryou' },

  { id: '7', author: { name: 'Nur Y.', initial: 'N', neighborhood: 'KadÄ±kÃ¶y, Moda', profileId: 'nur-y' }, timeAgo: '14 sa', isSponsored: false, isPinned: false, category: 'general', title: 'Mahalle Temizlik EtkinliÄi', body: 'Cumartesi sabahÄ± mahalle parkÄ±nda ortak temizlik etkinliÄi yapÄ±yoruz. Herkesi katÄ±lmaya davet ediyoruz.', image: getFeedImageUrl(65), reactions: 48, comments: 16, feed: 'foryou' },

]



function getTimeAgo(dateStr: string): string {

  const now = new Date()

  const date = new Date(dateStr)

  const diffMs = now.getTime() - date.getTime()

  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Az Ã¶nce'

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

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [postsToShow, setPostsToShow] = useState(6)

  const [posts, setPosts] = useState(mockPosts)

  const [loading, setLoading] = useState(true)

  const [userNeighborhood, setUserNeighborhood] = useState('KadÄ±kÃ¶y, Moda')



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

    return activeTab === 'foryou' || post.feed === activeTab

  })



  const pinnedPosts = filteredPosts.filter(p => p.isPinned)

  const regularPosts = filteredPosts.filter(p => !p.isPinned)

  const displayedPosts = regularPosts.slice(0, postsToShow)



  return (

    <>

      <PostFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={(newPost: any) => setPosts([newPost, ...posts])} />



      <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 space-y-3">

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



        <div onClick={() => setIsModalOpen(true)} className="bg-surface rounded-xl shadow-card border border-border p-4 hover:shadow-card-hover transition-all cursor-pointer">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{profile?.full_name?.[0]?.toUpperCase() || 'K'}</div>

            <div className="flex-1 px-4 py-2.5 bg-background text-text-muted rounded-full text-sm">Mahallenize bir Åeyler paylaÅÄ±n...</div>

            <button className="p-2 hover:bg-surface-hover rounded-full transition-colors"><Camera className="w-5 h-5 text-text-muted" /></button>

          </div>

          <div className="flex items-center gap-2 text-xs text-text-muted mt-2 ml-[52px]">

            <MapPin className="w-3.5 h-3.5" />

            <span>{userNeighborhood}</span>

          </div>

        </div>



        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">

          {feedTabs.map((tab) => (

            <button key={tab.id} onClick={() => setActiveTab(tab.id)}

              className={cn('px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-all',

                activeTab === tab.id ? 'border-text-primary text-text-primary bg-surface shadow-sm' : 'border-border text-text-muted bg-surface hover:border-gray-300'

              )}>{tab.label}</button>

          ))}

        </div>



        <div className="space-y-3">

          {filteredPosts.length === 0 && (

            <div className="bg-surface rounded-xl border border-border p-12 text-center">

              <p className="text-text-primary font-medium">Bu sekmede gÃ¶nderi yok</p>

              <p className="text-text-muted text-sm mt-1">BaÅka bir sekme deneyin</p>

            </div>

          )}

          {pinnedPosts.map((post) => <FeedPostCard key={post.id} post={post} />)}

          {displayedPosts.map((post) => <FeedPostCard key={post.id} post={post} />)}

        </div>



        {regularPosts.length > postsToShow && (

          <div className="text-center py-6">

            <button onClick={() => setPostsToShow(postsToShow + 4)} className="px-6 py-2.5 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-all shadow-sm hover:shadow-md">

              Daha Fazla GÃ¶nderi YÃ¼kle

            </button>

          </div>

        )}

      </div>

    </>

  )

}

