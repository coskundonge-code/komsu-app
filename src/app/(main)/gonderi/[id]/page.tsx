'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Globe, Heart, MessageCircle, Share2, MoreHorizontal, Send, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getPostById, createComment, toggleReaction, getMyReactions } from '@/lib/hooks/use-posts'
import { getCategoryInfo } from '@/components/feed/post-card'
import { useCurrentUser } from '@/lib/hooks/use-auth'
import { toast } from '@/lib/utils/show-toast'

// NOT (2026-06-07): Bu sayfa eskiden TAMAMEN sahteydi. mockPost/mockComments
// state'e konuyordu ve JSX doğrudan `mockPost`/`mockComments` sabitlerini
// basıyordu (yüklenen gerçek veriyi DEĞİL) — yani URL ne olursa olsun hep aynı
// uydurma "piknik" gönderisi görünüyordu. Ayrıca eşlemede yanlış kolonlar vardı
// (user_id/post_type → doğrusu author_id/type). Artık yalnızca gerçek `posts` +
// `comments` kaydına bağlı; yoksa dürüst "bulunamadı". Bkz. TECH_DEBT #12.

interface PostView {
  id: string
  authorName: string
  authorInitial: string
  authorId: string | null
  neighborhood: string
  timeAgo: string
  category: string
  title: string
  body: string
  image?: string
  reactions: number
  comments: number
}

interface CommentView {
  id: string
  author: string
  initial: string
  text: string
  timeAgo: string
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: postId } = use(params)
  const { user, profile } = useCurrentUser()

  const [liked, setLiked] = useState(false)
  const [likedByMe, setLikedByMe] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [post, setPost] = useState<PostView | null>(null)
  const [comments, setComments] = useState<CommentView[]>([])
  const [loading, setLoading] = useState(true)
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function loadPost() {
      setLoading(true)
      const { data, error } = await getPostById(postId)
      if (cancelled) return
      const p = data as any
      if (p && !error) {
        const n = p.neighborhoods
        // Mevcut kullanıcının bu gönderi için kendi 'like' tepkisini getir.
        if (user?.id) {
          const likedSet = await getMyReactions([p.id], user.id)
          if (cancelled) return
          const mine = likedSet.has(p.id)
          setLikedByMe(mine)
          setLiked(mine)
        }
        setPost({
          id: p.id,
          authorName: p.profiles?.full_name || 'Komşu',
          authorInitial: (p.profiles?.full_name?.trim()?.[0] || 'K').toUpperCase(),
          authorId: p.author_id || null,
          neighborhood: n ? `${n.district}, ${n.name}` : '',
          timeAgo: formatDate(p.created_at),
          category: p.type || 'general',
          title: p.title || '',
          body: p.body || '',
          image: p.media_urls?.[0] || undefined,
          reactions: p.reaction_count || 0,
          comments: p.comment_count || 0,
        })
        if (Array.isArray(p.comments)) {
          const mapped: CommentView[] = p.comments
            .map((c: any) => ({
              id: c.id,
              author: c.profiles?.full_name || 'Komşu',
              initial: (c.profiles?.full_name?.trim()?.[0] || 'K').toUpperCase(),
              text: c.body,
              timeAgo: formatDate(c.created_at),
              _ts: c.created_at ? new Date(c.created_at).getTime() : 0,
            }))
            .sort((a: any, b: any) => a._ts - b._ts)
            .map(({ _ts, ...rest }: any) => rest)
          setComments(mapped)
        }
      }
      setLoading(false)
    }
    if (postId) loadPost()
    return () => {
      cancelled = true
    }
  }, [postId, user?.id])

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !user) return
    setSubmittingComment(true)
    try {
      const { data, error } = await createComment(postId, user.id, commentText)
      if (data && !error) {
        const c = data as any
        setComments((prev) => [
          ...prev,
          {
            id: c.id,
            author: profile?.full_name || 'Siz',
            initial: profile?.full_name?.[0]?.toUpperCase() || 'S',
            text: c.body,
            timeAgo: 'Az önce',
          },
        ])
        setCommentText('')
      }
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleLike = async () => {
    if (!user) return
    const next = !liked
    setLiked(next) // iyimser güncelle
    const { error } = await toggleReaction(postId, user.id, 'like')
    if (error) {
      setLiked(!next) // hata: geri al
      toast.error('Beğeni kaydedilemedi, tekrar deneyin')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-9 h-9 text-primary animate-spin" />
        <p className="text-text-muted text-sm">Gönderi yükleniyor…</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="px-2 sm:px-4 lg:px-6 py-12 text-center">
        <p className="text-text-primary font-semibold text-lg mb-2">Gönderi bulunamadı</p>
        <p className="text-text-muted text-sm mb-6">Bu gönderi kaldırılmış veya hiç var olmamış olabilir.</p>
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-medium">
          <ArrowLeft className="w-4 h-4" />
          Akışa dön
        </Link>
      </div>
    )
  }

  const categoryInfo = getCategoryInfo(post.category)

  return (
    <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 space-y-4">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-hover font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Geri Dön
      </Link>

      <article className="bg-surface rounded-xl shadow-card border border-border overflow-hidden">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Link href={post.authorId ? `/profil/${post.authorId}` : '#'} className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                {post.authorInitial}
              </Link>
              <div>
                <Link href={post.authorId ? `/profil/${post.authorId}` : '#'} className="text-base font-bold text-text-primary hover:text-primary transition-colors">
                  {post.authorName}
                </Link>
                <p className="text-xs text-text-muted flex items-center gap-1">
                  {post.neighborhood && <>{post.neighborhood} · </>}{post.timeAgo} · <Globe className="w-3 h-3" />
                </p>
              </div>
            </div>
            <button className="p-2 hover:bg-surface-hover rounded-full transition-colors">
              <MoreHorizontal className="w-5 h-5 text-text-muted" />
            </button>
          </div>
        </div>

        <div className="px-4 pb-3">
          <span className={cn('inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-3', categoryInfo.badgeColor)}>
            {categoryInfo.label}
          </span>
          {post.title && <h1 className="text-xl font-bold text-text-primary mb-3">{post.title}</h1>}
          <p className="text-[15px] text-text-secondary leading-relaxed whitespace-pre-line">{post.body}</p>
        </div>

        {post.image && (
          <Image src={post.image} alt={post.title || ''} width={800} height={450} unoptimized className="w-full object-cover" />
        )}

        <div className="px-4 py-2 flex items-center justify-between text-xs text-text-muted border-t border-border-light">
          <span>{Math.max(0, post.reactions - (likedByMe ? 1 : 0)) + (liked ? 1 : 0)} beğeni</span>
          <span>{post.comments} yorum</span>
        </div>

        <div className="px-3 py-1 border-t border-border-light">
          <div className="flex items-center">
            <button
              onClick={handleLike}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all',
                liked ? 'text-error' : 'text-text-secondary hover:bg-surface-hover'
              )}
            >
              <Heart className={cn('w-5 h-5', liked && 'fill-current')} />
              {liked ? 'Beğendin' : 'Beğen'}
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-hover rounded-lg transition-colors">
              <MessageCircle className="w-5 h-5" />
              Yorum
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-hover rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
              Paylaş
            </button>
          </div>
        </div>
      </article>

      <div className="bg-surface rounded-xl shadow-card border border-border overflow-hidden">
        <div className="p-4 border-b border-border-light">
          <h2 className="text-sm font-bold text-text-primary">Yorumlar ({comments.length})</h2>
        </div>

        <div className="p-4 border-b border-border-light">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{profile?.full_name?.[0]?.toUpperCase() || 'K'}</div>
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={user ? 'Bir yorum yaz...' : 'Yorum yapmak için giriş yapın'}
                disabled={!user}
                className="w-full p-2.5 bg-background border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light resize-none disabled:opacity-60"
                rows={2}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim() || !user || submittingComment}
                  className={cn(
                    'px-4 py-1.5 text-sm font-semibold rounded-lg flex items-center gap-2 transition-all',
                    commentText.trim() && user && !submittingComment ? 'bg-primary text-white hover:bg-primary-hover' : 'bg-surface-active text-text-muted cursor-not-allowed'
                  )}
                >
                  <Send className="w-4 h-4" />
                  {submittingComment ? 'Gönderiliyor...' : 'Gönder'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {comments.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-text-muted text-sm">Henüz yorum yok. İlk yorumu sen yaz.</p>
          </div>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="p-4 border-b border-border-light last:border-b-0 hover:bg-surface-hover/30 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-text-muted rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {c.initial}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary">{c.author}</span>
                    <span className="text-xs text-text-muted">{c.timeAgo}</span>
                  </div>
                  <p className="text-sm text-text-secondary mt-1">{c.text}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
