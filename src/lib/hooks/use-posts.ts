'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient as createTypedClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

const createClient = () => createTypedClient()

type Post = Database['public']['Tables']['posts']['Row']
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
    query = query.eq('type', options.postType)
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query
  return { data, error }
}

export async function getPostById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles!posts_author_id_fkey(full_name, avatar_url), comments(*, profiles!comments_author_id_fkey(full_name, avatar_url))')
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
    .single()

  if (existing) {
    const { error } = await supabase.from('reactions').delete().eq('id', existing.id)
    return { added: false, error }
  } else {
    const { error } = await supabase.from('reactions').insert({ post_id: postId, user_id: userId, type: reactionType })
    return { added: true, error }
  }
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
