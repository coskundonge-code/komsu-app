'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Camera, MapPin, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const PostFormModal = dynamic(() => import('@/components/feed/post-form-modal').then(mod => ({ default: mod.PostFormModal })), { ssr: false })

import { AddressVerificationBanner } from '@/components/feed/address-verification-banner'
import { FeedPostCard, type FeedPostData } from '@/components/feed/post-card'
import { useCurrentUser } from '@/lib/hooks/use-auth'
import { getPosts, getMyReactions } from '@/lib/hooks/use-posts'
import { createClient } from '@/lib/supabase/client'

// NOT (2026-06-07): Bu sayfa eskiden 8 sahte gönderi (mockPosts) + getFeedImageUrl
// demo görselleri gösteriyordu ve DB'ye yalnızca "veri varsa" bakıyordu (boşsa
// sahteyi bırakıyordu). Ayrıca sekmeler (Senin İçin / Son Paylaşılanlar / Yakın
// Mahalleler / Gündem) `post.feed` adında sahte bir alana göre filtreliyordu;
// gerçek gönderilerin böyle bir alanı yok, bu yüzden 3 sekme her zaman boştu.
// Artık yalnızca gerçek `posts` kayıtlarına bağlı; sekmeler gerçek `type`
// (kategori) filtrelerine çevrildi; görsel yoksa kart görselsiz; boşsa dürüst
// boş-durum. Bkz. TECH_DEBT #12.

// Sekmeler artık gerçek gönderi türüne (type) göre filtreler.
const feedFilters = [
  { id: 'all', label: 'Tümü' },
  { id: 'general', label: 'Genel' },
  { id: 'safety', label: 'Güvenlik' },
  { id: 'recommendation', label: 'Öneriler' },
  { id: 'event', label: 'Etkinlikler' },
  { id: 'lost_found', label: 'Kayıp/Buluntu' },
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
  if (diffDays < 7) return `${diffDays} gün`
  return `${Math.floor(diffDays / 7)} hafta`
}

export default function FeedPage() {
  const { user, profile } = useCurrentUser()
  const [activeTab, setActiveTab] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [postsToShow, setPostsToShow] = useState(6)
  const [posts, setPosts] = useState<FeedPostData[]>([])
  const [loading, setLoading] = useState(true)
  const [userNeighborhood, setUserNeighborhood] = useState('')

  useEffect(() => {
    let cancelled = false
    async function loadPosts() {
      setLoading(true)

      // Kullanıcının mahallesini getir (paylaşım kutusundaki bilgi için).
      if (user?.id) {
        const supabase = createClient()
        try {
          const { data: neighborhoodData } = await supabase
            .from('neighborhood_members')
            .select('neighborhood_id, neighborhoods(name, district)')
            .eq('user_id', user.id)
            .single()

          if (!cancelled && neighborhoodData && (neighborhoodData as any).neighborhoods) {
            const n = (neighborhoodData as any).neighborhoods
            if (n.district && n.name) setUserNeighborhood(`${n.district}, ${n.name}`)
          }
        } catch {
          // Mahalle bulunamazsa sessiz geç; sahte mahalle gösterme.
        }
      }

      const { data } = await getPosts({ limit: 20 })
      if (cancelled) return
      const rows = (data as any[]) || []
      // Mevcut kullanıcının bu gönderiler için kendi 'like' tepkilerini getir.
      const likedSet = user?.id ? await getMyReactions(rows.map((p) => p.id), user.id) : new Set<string>()
      if (cancelled) return
      const mapped: FeedPostData[] = rows.map((p: any) => ({
        id: p.id,
        author: {
          name: p.profiles?.full_name || 'Komşu',
          initial: (p.profiles?.full_name?.trim()?.[0] || 'K').toUpperCase(),
          neighborhood: p.neighborhoods ? `${p.neighborhoods.district}, ${p.neighborhoods.name}` : 'Mahalle',
          profileId: p.author_id,
        },
        timeAgo: getTimeAgo(p.created_at),
        isSponsored: false,
        isPinned: p.is_pinned || false,
        category: p.type || 'general',
        title: p.title || '',
        body: p.body || '',
        image: p.media_urls?.[0] || undefined,
        reactions: p.reaction_count || 0,
        likedByMe: likedSet.has(p.id),
        comments: p.comment_count || 0,
        feed: 'all',
      }))
      setPosts(mapped)
      setLoading(false)
    }
    loadPosts()
    return () => {
      cancelled = true
    }
  }, [user?.id])

  const filteredPosts = posts.filter((post) => activeTab === 'all' || post.category === activeTab)

  const pinnedPosts = filteredPosts.filter((p) => p.isPinned)
  const regularPosts = filteredPosts.filter((p) => !p.isPinned)
  const displayedPosts = regularPosts.slice(0, postsToShow)

  // Güvenlik uyarıları kutusu yalnızca gerçek "safety" gönderisi varsa görünür.
  const safetyAlerts = posts.filter((p) => p.category === 'safety').slice(0, 2)

  return (
    <>
      <PostFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={(newPost: any) => setPosts([newPost, ...posts])} />

      <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 space-y-3">
        <h1 className="sr-only">Mahallemiz - Mahalleni Keşfet, Komşularınla Bağlan</h1>

        {safetyAlerts.length > 0 && (
          <div className="bg-surface rounded-xl shadow-card border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-light">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-error" />
                <h2 className="text-sm font-bold text-text-primary">Uyarılar</h2>
              </div>
              <Link href="/uyarilar" className="text-xs text-primary font-medium hover:text-primary-hover flex items-center gap-1">
                Tümü <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {safetyAlerts.map((alert) => (
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
            <div className="flex-1 px-4 py-2.5 bg-background text-text-muted rounded-full text-sm">Mahallenize bir şeyler paylaşın...</div>
            <button className="p-2 hover:bg-surface-hover rounded-full transition-colors"><Camera className="w-5 h-5 text-text-muted" /></button>
          </div>
          {userNeighborhood && (
            <div className="flex items-center gap-2 text-xs text-text-muted mt-2 ml-[52px]">
              <MapPin className="w-3.5 h-3.5" />
              <span>{userNeighborhood}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {feedFilters.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn('px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-all',
                activeTab === tab.id ? 'border-text-primary text-text-primary bg-surface shadow-sm' : 'border-border text-text-muted bg-surface hover:border-gray-300'
              )}>{tab.label}</button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-9 h-9 text-primary animate-spin" />
            <p className="text-text-muted text-sm">Gönderiler yükleniyor…</p>
          </div>
        ) : posts.length === 0 ? (
          // Hiç gönderi yok — dürüst boş durum + paylaşım çağrısı
          <div className="bg-surface rounded-xl border border-border p-12 text-center">
            <p className="text-text-primary font-semibold text-lg mb-1">Mahallende henüz paylaşım yok</p>
            <p className="text-text-muted text-sm mb-5">İlk paylaşımı sen yap; komşuların görsün.</p>
            <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-all">
              <Camera className="w-4 h-4" />
              Paylaşım Yap
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {filteredPosts.length === 0 && (
                <div className="bg-surface rounded-xl border border-border p-12 text-center">
                  <p className="text-text-primary font-medium">Bu kategoride gönderi yok</p>
                  <p className="text-text-muted text-sm mt-1">Başka bir kategori deneyin</p>
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
          </>
        )}
      </div>
    </>
  )
}
