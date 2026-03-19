'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MoreHorizontal, Globe, Heart, MessageCircle, Share2, Pin, Send, X, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export const POST_CATEGORIES = [
  { id: 'tumu', label: 'Tumu', badgeColor: 'bg-surface-active text-text-secondary' },
  { id: 'genel', label: 'Genel', badgeColor: 'bg-info-light text-info' },
  { id: 'guvenlik', label: 'Guvenlik', badgeColor: 'bg-error-light text-error' },
  { id: 'satilik', label: 'Satilik', badgeColor: 'bg-warning-light text-amber-700' },
  { id: 'etkinlikler', label: 'Etkinlikler', badgeColor: 'bg-purple-100 text-purple-700' },
  { id: 'oneriler', label: 'Oneriler', badgeColor: 'bg-success-light text-success' },
  { id: 'sorular', label: 'Sorular', badgeColor: 'bg-cyan-100 text-cyan-700' },
  { id: 'kayipbuluntu', label: 'Kayip/Buluntu', badgeColor: 'bg-orange-100 text-orange-700' },
]

export function getCategoryInfo(categoryId: string) {
  return POST_CATEGORIES.find(cat => cat.id === categoryId) || POST_CATEGORIES[0]
}

export interface FeedPostData {
  id: string
  author: { name: string; initial: string; neighborhood: string; profileId: string }
  timeAgo: string
  isSponsored: boolean
  isPinned: boolean
  category: string
  title: string
  body: string
  image?: string
  reactions: number
  comments: number
  feed: string
}

interface FeedPostCardProps {
  post: FeedPostData
}

export function FeedPostCard({ post }: FeedPostCardProps) {
  const [liked, setLiked] = useState(false)
  const [showComment, setShowComment] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [expanded, setExpanded] = useState(false)
  const categoryInfo = getCategoryInfo(post.category)
  const isLongText = post.body.length > 200

  return (
    <article className={cn(
      'bg-surface rounded-xl shadow-card border transition-all duration-200 animate-fadeIn overflow-hidden',
      post.isPinned ? 'border-orange-200' : 'border-border'
    )}>
      {post.isPinned && (
        <div className="bg-orange-50 text-orange-600 px-4 py-2 flex items-center gap-2 text-xs font-semibold border-b border-orange-100">
          <Pin className="w-3.5 h-3.5" />
          Sabitlenmis Gonderi
        </div>
      )}

      <div className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Link href={`/profil/${post.author.profileId}`} className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ring-2 ring-transparent hover:ring-primary-light transition-all">
              {post.author.initial}
            </Link>
            <div>
              <Link href={`/profil/${post.author.profileId}`} className="text-sm font-bold text-text-primary hover:text-primary transition-colors">
                {post.author.name}
              </Link>
              <p className="text-xs text-text-muted flex items-center gap-1">
                {post.author.neighborhood} · {post.timeAgo} · <Globe className="w-3 h-3" />
              </p>
            </div>
          </div>
          <button className="p-1.5 hover:bg-surface-hover rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5 text-text-muted" />
          </button>
        </div>
      </div>

      <div className="px-4 py-3">
        {post.title && <h3 className="text-[15px] font-bold text-text-primary mb-1.5">{post.title}</h3>}
        <p className="text-[15px] text-text-secondary leading-relaxed">
          {isLongText && !expanded ? post.body.slice(0, 200) + '...' : post.body}
        </p>
        {isLongText && !expanded && (
          <button onClick={() => setExpanded(true)} className="text-sm font-medium text-primary hover:text-primary-hover mt-1">
            daha fazla goster
          </button>
        )}
      </div>

      <div className="px-4 pb-2">
        <span className={cn('inline-block px-2.5 py-1 rounded-full text-xs font-semibold', categoryInfo.badgeColor)}>
          {categoryInfo.label}
        </span>
      </div>

      {post.image && (
        <div className="relative w-full max-h-[400px] overflow-hidden">
          <Image src={post.image} alt={post.title || ''} width={800} height={400} unoptimized className="w-full object-cover" />
        </div>
      )}

      {post.isSponsored && (
        <Link href="/isletmeler" className="flex items-center justify-between px-4 py-3 border-t border-border-light hover:bg-surface-hover transition-colors">
          <span className="text-sm font-medium text-text-secondary">Daha fazla bilgi</span>
          <ChevronRight className="w-4 h-4 text-text-muted" />
        </Link>
      )}

      {!post.isSponsored && (
        <>
          <div className="px-4 py-2 flex items-center justify-between text-xs text-text-muted">
            <div className="flex items-center gap-1.5">
              <span className="flex -space-x-1">
                <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[10px]">👍</span>
                <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px]">❤️</span>
              </span>
              <span className="text-[13px]">{post.reactions + (liked ? 1 : 0)}</span>
            </div>
            <span className="text-[13px]">{post.comments} yorum</span>
          </div>

          <div className="px-3 py-1 border-t border-border-light">
            <div className="flex items-center">
              <button
                onClick={() => setLiked(!liked)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                  liked ? 'text-error' : 'text-text-secondary hover:bg-surface-hover'
                )}
              >
                <Heart className={cn('w-5 h-5', liked && 'fill-current')} />
                {liked ? 'Begendin' : 'Begen'}
              </button>
              <button
                onClick={() => setShowComment(!showComment)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-hover rounded-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Yorum
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-hover rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
                Paylas
              </button>
            </div>
          </div>

          {showComment && (
            <div className="px-4 py-3 border-t border-border-light bg-surface-hover/30">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">C</div>
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Bir yorum yaz..."
                    className="w-full p-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light resize-none"
                    rows={2}
                  />
                  <div className="flex gap-2 mt-2 justify-end">
                    <button onClick={() => { setShowComment(false); setCommentText('') }} className="p-1.5 text-text-muted hover:bg-surface-active rounded-lg">
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setCommentText(''); setShowComment(false) }}
                      disabled={!commentText.trim()}
                      className={cn(
                        'px-4 py-1.5 text-sm font-semibold rounded-lg flex items-center gap-2 transition-all',
                        commentText.trim() ? 'bg-primary text-white hover:bg-primary-hover' : 'bg-surface-active text-text-muted cursor-not-allowed'
                      )}
                    >
                      <Send className="w-4 h-4" />
                      Gonder
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </article>
  )
}
