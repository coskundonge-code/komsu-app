'use client'



import { useState, useEffect } from 'react'

import Link from 'next/link'

import Image from 'next/image'

import { ArrowLeft, Globe, Heart, MessageCircle, Share2, MoreHorizontal, Send } from 'lucide-react'

import { cn } from '@/lib/utils'

import { getFeedImageUrl } from '@/lib/demo-images'

import { useParams } from 'next/navigation'

import { getPostById, createComment, toggleReaction } from '@/lib/hooks/use-posts'

import { useCurrentUser } from '@/lib/hooks/use-auth'



const mockPost = {

  id: '1',

  author: { name: 'Ayse K.', initial: 'A', neighborhood: 'Kadıköy, Moda', profileId: 'ayse-k' },

  timeAgo: '2 saat önce',

  category: 'Etkinlikler',

  categoryColor: 'bg-cat-event-light text-cat-event',

  title: 'Mahalle Pikniği Bu Akşam!',

  body: 'Merhaba komşular, bu akşam saat 20:00\'de mahalle parkında piknik yapıyoruz. Katılmak isteyen herkesi bekliyoruz! Yanınıza battaniye ve atıştırmalık getirmeniz yeterli.\n\nBuluşma noktası: Moda Parkı ana giriş\nSaat: 20:00\n\nHerkesi bekliyoruz!',

  image: getFeedImageUrl(58),

  reactions: 24,

  comments: 3,

}



const mockComments = [

  { id: '1', author: 'Mehmet Y.', initial: 'M', text: 'Harika bir fikir! Kesinlikle geliriz.', timeAgo: '1 saat önce', likes: 3 },

  { id: '2', author: 'Fatma C.', initial: 'F', text: 'Çocuklar çok sevinecek, biz de geliyoruz!', timeAgo: '45 dk önce', likes: 5 },

  { id: '3', author: 'Ali R.', initial: 'A', text: 'Ben de salata hazırlayıp getireyim.', timeAgo: '30 dk önce', likes: 2 },

]



export default function PostDetailPage() {

  const params = useParams()

  const postId = params.id as string

  const { user, profile } = useCurrentUser()



  const [liked, setLiked] = useState(false)

  const [commentText, setCommentText] = useState('')

  const [post, setPost] = useState(mockPost)

  const [comments, setComments] = useState(mockComments)

  const [loading, setLoading] = useState(true)

  const [submittingComment, setSubmittingComment] = useState(false)



  useEffect(() => {

    async function loadPost() {

      const { data, error } = await getPostById(postId)

      const postData = data as any

      if (postData && !error) {

        setPost({

          id: postData.id,

          author: {

            name: postData.profiles?.full_name || 'Anonim',

            initial: (postData.profiles?.full_name || 'A')[0].toUpperCase(),

            neighborhood: 'Kadıköy, Moda',

            profileId: postData.user_id,

          },

          timeAgo: new Date(postData.created_at).toLocaleDateString('tr-TR'),

          category: postData.post_type || 'Genel',

          categoryColor: 'bg-cat-event-light text-cat-event',

          title: postData.title || '',

          body: postData.body || '',

          image: postData.media_urls?.[0] || undefined,

          reactions: postData.reaction_count || 0,

          comments: postData.comment_count || 0,

        })

        if (postData.comments && Array.isArray(postData.comments)) {

          setComments(

            postData.comments.map((c: any) => ({

              id: c.id,

              author: c.profiles?.full_name || 'Anonim',

              initial: (c.profiles?.full_name || 'A')[0].toUpperCase(),

              text: c.body,

              timeAgo: new Date(c.created_at).toLocaleDateString('tr-TR'),

              likes: 0,

            }))

          )

        }

      }

      setLoading(false)

    }

    if (postId) {

      loadPost()

    }

  }, [postId])



  const handleCommentSubmit = async () => {

    if (!commentText.trim() || !user) return

    setSubmittingComment(true)

    try {

      const { data, error } = await createComment(postId, user.id, commentText)

      if (data && !error) {

        const commentData = data as any

        setComments([

          ...comments,

          {

            id: commentData.id,

            author: profile?.full_name || 'Siz',

            initial: profile?.full_name?.[0]?.toUpperCase() || 'S',

            text: commentData.body,

            timeAgo: 'Az önce',

            likes: 0,

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

    const { error } = await toggleReaction(postId, user.id, 'like')

    if (!error) {

      setLiked(!liked)

    }

  }



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

          <span>{mockPost.reactions + (liked ? 1 : 0)} beğeni</span>

          <span>{mockPost.comments} yorum</span>

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

            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{profile?.full_name?.[0]?.toUpperCase() || 'K'}</div>

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

