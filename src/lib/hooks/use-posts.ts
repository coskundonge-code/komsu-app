'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient as createTypedClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

const createClient = () => createTypedClient()

type PostInsert = Database['public']['Tables']['posts']['Insert']

// --- React Query hooks (use these in components) ---

export type PostsOptions = {
  neighborhoodId?: string
  postType?: string
  limit?: number
  offset?: number
}

export function usePosts(options?: PostsOptions) {
  return useQuery({
    queryKey: ['posts', options],
    queryFn: () => getPosts(options),
  })
}

export function usePostById(id: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostById(id),
    enabled: !!id,
  })
}

// --- Async query utilities (use these in mutations / server-side logic) ---

export async function getPosts(options?: {
  neighborhoodId?: string
  postType?: string
  limit?: number
  offset?: number
}) {
  const supabase = createClient()
  let query = supabase
    .from('posts')
    .select('*, profiles!posts_author_id_fkey(full_name, avatar_url), neighborhoods(name, district)')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (options?.neighborhoodId) {
    query = query.eq('neighborhood_id', options.neighborhoodId)
  }
  if (options?.postType && options.postType !== 'general') {
    query = query.eq('type', options.postType as 'general' | 'safety' | 'recommendation' | 'lost_found' | 'classified' | 'event' | 'poll')
  }
  // Çağıran limit vermezse bile sınırsız çekme yok (DoS/perf koruması).
  const limit = options?.limit ?? 100
  query = query.limit(limit)
  if (options?.offset) {
    query = query.range(options.offset, options.offset + limit - 1)
  }

  const { data, error } = await query
  return { data, error }
}

export async function getPostById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles!posts_author_id_fkey(full_name, avatar_url), neighborhoods(name, district), comments(*, profiles!comments_author_id_fkey(full_name, avatar_url))')
    .eq('id', id)
    .single()
  return { data, error }
}

export async function createPost(post: PostInsert) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single()
  return { data, error }
}

export async function deletePost(id: string) {
  const supabase = createClient()
  // Soft delete by removing from view - update visibility
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)
  return { error }
}

export async function toggleReaction(postId: string, userId: string, reactionType: string) {
  const supabase = createClient()
  const { data: existing } = await supabase
    .from('reactions')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .eq('type', reactionType)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase.from('reactions').delete().eq('id', existing.id)
    return { added: false, liked: false, error }
  } else {
    const { error } = await supabase.from('reactions').insert({ post_id: postId, user_id: userId, type: reactionType })
    return { added: true, liked: true, error }
  }
}

// Verilen gönderi id'leri için mevcut kullanıcının kendi 'like' tepkilerini getirir.
// Beğeni butonunu doğru başlatmak için kullanılır (yoksa hep "beğenilmemiş" görünürdü).
export async function getMyReactions(postIds: string[], userId: string, reactionType = 'like') {
  if (!postIds.length || !userId) return new Set<string>()
  const supabase = createClient()
  const { data } = await supabase
    .from('reactions')
    .select('post_id')
    .eq('user_id', userId)
    .eq('type', reactionType)
    .in('post_id', postIds)
  return new Set<string>(((data as any[]) || []).map((r) => r.post_id))
}

export async function createComment(postId: string, userId: string, content: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id: postId, author_id: userId, body: content })
    .select()
    .single()
  return { data, error }
}
