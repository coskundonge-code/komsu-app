'use client'

import { createClient as createTypedClient } from '@/lib/supabase/client'
const createClient = () => createTypedClient() as any
import type { Database } from '@/lib/supabase/types'

type Post = Database['public']['Tables']['posts']['Row']
type PostInsert = Database['public']['Tables']['posts']['Insert']

export async function getPosts(options?: {
  neighborhoodId?: string
  postType?: string
  limit?: number
  offset?: number
}) {
  const supabase = createClient()
  let query = supabase
    .from('posts')
    .select('*, profiles!posts_user_id_fkey(full_name, avatar_url)')
    .eq('is_archived', false)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (options?.neighborhoodId) {
    query = query.eq('neighborhood_id', options.neighborhoodId)
  }
  if (options?.postType && options.postType !== 'general') {
    query = query.eq('post_type', options.postType)
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
    .select('*, profiles!posts_user_id_fkey(full_name, avatar_url), comments(*, profiles!comments_user_id_fkey(full_name, avatar_url))')
    .eq('id', id)
    .single()
  return { data, error }
}

export async function createPost(post: PostInsert) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('posts')
    .insert(post as any)
    .select()
    .single()
  return { data, error }
}

export async function deletePost(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('posts')
    .update({ is_archived: true } as any)
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
    .eq('reaction_type', reactionType)
    .single()

  if (existing) {
    const { error } = await supabase.from('reactions').delete().eq('id', existing.id)
    return { added: false, error }
  } else {
    const { error } = await supabase.from('reactions').insert({ post_id: postId, user_id: userId, reaction_type: reactionType } as any)
    return { added: true, error }
  }
}

export async function createComment(postId: string, userId: string, content: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id: postId, user_id: userId, content } as any)
    .select()
    .single()
  return { data, error }
}
