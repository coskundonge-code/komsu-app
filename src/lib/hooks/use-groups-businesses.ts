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

export async function getBusinesses(options?: { neighborhoodId?: string; categoryId?: string; limit?: number }) {
  const supabase = createClient()
  let query = supabase
    .from('businesses')
    .select('*, business_categories(name)')
    .eq('verified', true)
    .order('rating', { ascending: false, nullsFirst: false })

  if (options?.neighborhoodId) query = query.eq('neighborhood_id', options.neighborhoodId)
  if (options?.categoryId) query = query.eq('category_id', options.categoryId)
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
