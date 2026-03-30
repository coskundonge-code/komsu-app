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
    .eq('author_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return { data, error }
}

export async function getUserListings(userId: string, limit = 10) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('listings')
    .select('*, listing_categories(name)')
    .eq('seller_id', userId)
    .neq('status', 'removed')
    .order('created_at', { ascending: false })
    .limit(limit)
  return { data, error }
}

export async function getUserBadges(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_badges')
    .select('*, badges(*)')
    .eq('user_id', userId)
  return { data, error }
}

export async function getUserAddress(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_addresses')
    .select('*, neighborhoods(name, city, district)')
    .eq('user_id', userId)
    .eq('is_primary', true)
    .single()
  return { data, error }
}

export async function getFullProfile(userId: string) {
  const [profileRes, addressRes, badgesRes, postsRes] = await Promise.all([
    getProfile(userId),
    getUserAddress(userId),
    getUserBadges(userId),
    getUserPosts(userId),
  ])
  return {
    profile: profileRes.data,
    address: addressRes.data,
    badges: badgesRes.data,
    posts: postsRes.data,
    errors: {
      profile: profileRes.error,
      address: addressRes.error,
      badges: badgesRes.error,
      posts: postsRes.error,
    },
  }
    }'use client'

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
    .eq('author_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return { data, error }
}

export async function getUserListings(userId: string, limit = 10) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('listings')
    .select('*, listing_categories(name)')
    .eq('seller_id', userId)
    .neq('status', 'removed')
    .order('created_at', { ascending: false })
    .limit(limit)
  return { data, error }
}
