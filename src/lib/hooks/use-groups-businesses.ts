'use client'

import { createClient as createTypedClient } from '@/lib/supabase/client'
const createClient = () => createTypedClient() as any
import type { Database } from '@/lib/supabase/types'

export async function getGroups(options?: { neighborhoodId?: string; limit?: number }) {
  const supabase = createClient()
  let query = supabase
    .from('groups')
    .select('*, group_members(count)')
    .order('member_count', { ascending: false })

  if (options?.neighborhoodId) query = query.eq('neighborhood_id', options.neighborhoodId)
  if (options?.limit) query = query.limit(options.limit)

  const { data, error } = await query
  return { data, error }
}

export async function joinGroup(groupId: string, userId: string) {
  const supabase = createClient()
  const { error } = await supabase.from('group_members').insert({ group_id: groupId, user_id: userId, role: 'member' } as any)
  return { error }
}

export async function leaveGroup(groupId: string, userId: string) {
  const supabase = createClient()
  const { error } = await supabase.from('group_members').delete().eq('group_id', groupId).eq('user_id', userId)
  return { error }
}

// Tek bir grubu slug ile getirir (detay sayfası).
export async function getGroupBySlug(slug: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  return { data, error }
}

// Grubun gerçek üyeleri (group_members → profiles). Sahte üye yok.
export async function getGroupMembers(groupId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('group_members')
    .select('user_id, role, joined_at, profiles:user_id(id, full_name, avatar_url)')
    .eq('group_id', groupId)
    .order('joined_at', { ascending: true })
  return { data, error }
}

// Grubun gerçek gönderileri (group_posts → posts → profiles). RLS gereği
// yalnızca üyelere görünür; sıralama istemci tarafında posts.created_at'e göre.
export async function getGroupPosts(groupId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('group_posts')
    .select('post_id, posts:post_id(*, profiles:author_id(id, full_name, avatar_url))')
    .eq('group_id', groupId)
  return { data, error }
}

// Kullanıcının üye olduğu grup id'leri ("Gruplarım" + katıldın durumu).
export async function getUserGroupIds(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('group_members')
    .select('group_id')
    .eq('user_id', userId)
  return { data, error }
}

// Kullanıcının üye olduğu gruplar (profil "Gruplar" sekmesi). group_members → groups.
export async function getUserGroups(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('group_members')
    .select('group_id, groups:group_id(id, slug, name, category, member_count, cover_image)')
    .eq('user_id', userId)
  return { data, error }
}

export async function getBusinesses(options?: {
  categoryId?: string
  categorySlug?: string
  limit?: number
}) {
  const supabase = createClient()
  // NOT: businesses tablosunda `neighborhood_id`, `verified` veya `rating`
  // kolonu YOK. Gerçek kolonlar: is_verified, rating_avg, review_count,
  // created_at, category_id. Doğrulama filtresi uygulanmıyor (tüm kayıtlar);
  // sıralama önce puana, sonra yeniye göre.
  const joinSpec = options?.categorySlug
    ? 'business_categories!inner(name, slug)'
    : 'business_categories(name, slug)'
  let query = supabase
    .from('businesses')
    .select(`*, ${joinSpec}`)
    .order('rating_avg', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (options?.categoryId) query = query.eq('category_id', options.categoryId)
  if (options?.categorySlug) query = query.eq('business_categories.slug', options.categorySlug)
  if (options?.limit) query = query.limit(options.limit)

  const { data, error } = await query
  return { data, error }
}

export async function createGroup(group: {
  name: string
  slug: string
  description?: string
  category?: string
  is_private?: boolean
  neighborhood_id?: string
  created_by: string
}) {
  const supabase = createClient()
  const { data, error } = await supabase.from('groups').insert(group as any).select().single()
  return { data, error }
}

export async function createBusinessReview(review: Database['public']['Tables']['business_reviews']['Insert']) {
  const supabase = createClient()
  const { data, error } = await supabase.from('business_reviews').insert(review as any).select().single()
  return { data, error }
}
