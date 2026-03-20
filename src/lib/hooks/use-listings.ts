'use client'

import { createClient as createTypedClient } from '@/lib/supabase/client'
const createClient = () => createTypedClient() as any
import type { Database } from '@/lib/supabase/types'

type Listing = Database['public']['Tables']['listings']['Row']
type ListingInsert = Database['public']['Tables']['listings']['Insert']

export async function getListings(options?: {
  neighborhoodId?: string
  categoryId?: string
  status?: string
  limit?: number
  offset?: number
  sortBy?: 'newest' | 'price-low' | 'price-high'
}) {
  const supabase = createClient()
  let query = supabase
    .from('listings')
    .select('*, profiles!listings_seller_id_fkey(full_name, avatar_url), listing_categories(name)')
    .eq('status', options?.status || 'active')

  if (options?.neighborhoodId) query = query.eq('neighborhood_id', options.neighborhoodId)
  if (options?.categoryId) query = query.eq('category_id', options.categoryId)

  switch (options?.sortBy) {
    case 'price-low': query = query.order('price', { ascending: true }); break
    case 'price-high': query = query.order('price', { ascending: false }); break
    default: query = query.order('created_at', { ascending: false })
  }

  if (options?.limit) query = query.limit(options.limit)
  if (options?.offset) query = query.range(options.offset, options.offset + (options.limit || 10) - 1)

  const { data, error } = await query
  return { data, error }
}

export async function getListingById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('listings')
    .select('*, profiles!listings_seller_id_fkey(full_name, avatar_url, phone), listing_categories(name)')
    .eq('id', id)
    .single()
  return { data, error }
}

export async function createListing(listing: ListingInsert) {
  const supabase = createClient()
  const { data, error } = await supabase.from('listings').insert(listing as any).select().single()
  return { data, error }
}

export async function updateListing(id: string, updates: Database['public']['Tables']['listings']['Update']) {
  const supabase = createClient()
  const { data, error } = await supabase.from('listings').update(updates as any).eq('id', id).select().single()
  return { data, error }
}

export async function deleteListing(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('listings').update({ status: 'expired' } as any).eq('id', id)
  return { error }
}
