'use client'

import { createClient as createTypedClient } from '@/lib/supabase/client'
const createClient = () => createTypedClient() as any
import type { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export async function getProfile(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*, user_addresses(*, neighborhoods(name, city, district)), neighborhood_members(neighborhood_id, role)')
    .eq('id', userId)
    .single()
  return { data, error }
}

export async function updateProfile(userId: string, updates: ProfileUpdate) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() } as any)
    .eq('id', userId)
    .select()
    .single()
  return { data, error }
}

export async function getUserPosts(userId: string, limit = 10) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .eq('is_archived', false)
    .order('created_at', { ascending: false })
    .limit(limit)
  return { data, error }
}

export async function getUserListings(userId: string, limit = 10) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('listings')
    .select('*, listing_categories(name)')
    .eq('user_id', userId)
    .neq('listing_status', 'removed')
    .order('created_at', { ascending: false })
    .limit(limit)
  return { data, error }
}
