'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Globe, Heart, MessageCircle, Share2, MoreHorizontal, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getFeedImageUrl } from '@/lib/demo-images'

const mockPost = {
  id: '1',
  author: { name: 'Ayse K.', initial: 'A', neighborhood: 'Kadikoy, Moda', profileId: 'ayse-k' },
  timeAgo: '2 saat once',
  category: 'Etkinlikler',
  categoryColor: 'bg-purple-100 text-purple-700',
  title: 'Mahalle Piknigi Bu Aksam!',
  body: 'Merhaba komsular, bu aksam saat 20:00\'de mahalle parkinda piknik yapiyoruz. Katilmak isteyen herkesi bekliyoruz! Yaniniza battaniye ve atistirmalik getirmeniz yeterli.\n\nBulusma noktasi: Moda Parki ana giris\nSaat: 20:00\n\nHerkesi bekliyoruz!',
  image: getFeedImageUrl(58),
  reactions: 24,
  comments: 3,
}

const mockComments = [
  { id: '1', author: 'Mehmet Y.', initial: 'M', text: 'Harika bir fikir! Kesinlikle geliriz.', timeAgo: '1 saat once', likes: 3 },
  { id: '2', author: 'Fatma C.', initial: 'F', text: 'Cocuklar cok sevinecek, biz de geliyoruz!', timeAgo: '45 dk once', likes: 5 },
  { id: '3', author: 'Ali R.', initial: 'A', text: 'Ben de salata hazirlayip getireyim.', timeAgo: '30 dk once', likes: 2 },
]

export default function PostDetailPage() {
  const [liked, setLiked] = useState(false)
  const [commentText, setCommentText] = useState('')

  return (
    <div className="max-w-[680px] mx-auto px-4 py-4 space-y-4">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-hover font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Geri Don
      </Link>

      <article className="bg-surface rounded-xl shadow-card border border-border overflow-hidden">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                {mockPost.author.initial}
              </div>
              <div>
                <Link href={`/profil/${mockPost.author.profileId}`} className="text-base font-bold text-text-primary hover:text-primary transition-colors">
                  {mockPost.author.name}
                </Link>
                <p className="text-xs text-text-muted flex items-center gap-1">
                  {mockPost.author.neighborhood} · {mockPost.timeAgo} · <Globe className="w-3 h-3" />
                </p>
              </div>
            </div>
            <button className="p-2 hover:bg-surface-hover rounded-full transition-colors">
              <MoreHorizontal className="w-5 h-5 text-text-muted" />
            </button>
          </div>
        </div>

        <div className="px-4 pb-3">
          <span className={cn('inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-3', mockPost.categoryColor)}>
            {mockPost.category}
          </span>
          <h1 className="text-xl font-bold text-text-primary mb-3">{mockPost.title}</h1>
          <p className="text-[15px] text-text-secondary leading-relaxed whitespace-pre-line">{mockPost.body}</p>
        </div>

        {mockPost.image && (
          <Image src={mockPost.image} alt={mockPost.title} width={800} height={450} unoptimized className="w-full object-cover" />
        )}

        <div className="px-4 py-2 flex items-center justify-between text-xs text-text-muted border-t border-border-light">
          <span>{mockPost.reactions + (liked ? 1 : 0)} begeni</span>
          <span>{mockPost.comments} yorum</span>
        </div>

        <div className="px-3 py-1 border-t border-border-light">
          <div className="flex items-center">
            <button
              onClick={() => setLiked(!liked)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all',
                liked ? 'text-error' : 'text-text-secondary hover:bg-surface-hover'
              )}
            >
              <Heart className={cn('w-5 h-5', liked && 'fill-current')} />
              {liked ? 'Begendin' : 'Begen'}
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-hover rounded-lg transition-colors">
              <MessageCircle className="w-5 h-5" />
              Yorum
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-hover rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
              Paylas
            </button>
          </div>
        </div>
      </article>

      <div className="bg-surface rounded-xl shadow-card border border-border overflow-hidden">
        <div className="p-4 border-b border-border-light">
          <h2 className="text-sm font-bold text-text-primary">Yorumlar ({mockComments.length})</h2>
        </div>

        <div className="p-4 border-b border-border-light">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">C</div>
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Bir yorum yaz..."
                className="w-full p-2.5 bg-background border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light resize-none"
                rows={2}
              />
              <div className="flex justify-end mt-2">
                <button
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

        {mockComments.map((c) => (
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
                <button className="text-xs text-text-muted hover:text-primary mt-1.5 flex items-center gap-1 transition-colors">
                  <Heart className="w-3 h-3" /> {c.likes}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
