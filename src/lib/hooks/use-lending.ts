'use client'

import { createClient as createTypedClient } from '@/lib/supabase/client'
const createClient = () => createTypedClient() as any

export async function getLendingItems(options?: {
  neighborhoodId?: string
  category?: string
  status?: string
  limit?: number
  offset?: number
}) {
  const supabase = createClient()
  let query = supabase
    .from('lending_items')
    .select('*, profiles!lending_items_user_id_fkey(full_name, avatar_url)')
    .eq('status', options?.status || 'available')
    .order('created_at', { ascending: false })

  if (options?.neighborhoodId) query = query.eq('neighborhood_id', options.neighborhoodId)
  if (options?.category) query = query.eq('category', options.category)
  if (options?.limit) query = query.limit(options.limit)
  if (options?.offset) query = query.range(options.offset, options.offset + (options.limit || 10) - 1)

  const { data, error } = await query
  return { data, error }
}

export async function getLendingItemById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('lending_items')
    .select('*, profiles!lending_items_user_id_fkey(full_name, avatar_url, phone)')
    .eq('id', id)
    .single()
  return { data, error }
}
