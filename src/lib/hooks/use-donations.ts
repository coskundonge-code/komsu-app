'use client'

import { createClient as createTypedClient } from '@/lib/supabase/client'
const createClient = () => createTypedClient() as any

export interface Donation {
  id: string
  user_id: string
  neighborhood_id: string
  donation_type: string
  title: string
  description?: string
  amount?: number
  quantity?: number
  status: 'available' | 'claimed' | 'expired'
  claimed_by?: string
  claimed_at?: string
  qr_code?: string
  business_id?: string
  expires_at: string
  created_at: string
  updated_at: string
  // Joined fields
  profiles?: { full_name: string; avatar_url?: string }
  businesses?: { name: string }
}

export async function getDonations(options?: {
  neighborhoodId?: string
  status?: string
  limit?: number
}) {
  const supabase = createClient()
  let query = supabase
    .from('donations')
    .select('*, profiles(full_name, avatar_url), businesses(name)')
    .order('created_at', { ascending: false })

  if (options?.neighborhoodId) query = query.eq('neighborhood_id', options.neighborhoodId)
  if (options?.status) query = query.eq('status', options.status)
  if (options?.limit) query = query.limit(options.limit)

  const { data, error } = await query
  return { data, error }
}

export async function createDonation(donation: {
  user_id: string
  neighborhood_id: string
  donation_type: string
  title: string
  description?: string
  amount?: number
  quantity?: number
  business_id?: string
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('donations')
    .insert(donation)
    .select()
    .single()
  return { data, error }
}

export async function claimDonation(donationId: string, userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('donations')
    .update({
      status: 'claimed',
      claimed_by: userId,
      claimed_at: new Date().toISOString(),
    })
    .eq('id', donationId)
    .eq('status', 'available')
    .select()
    .single()
  return { data, error }
}

export async function deleteDonation(donationId: string, userId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('donations')
    .delete()
    .eq('id', donationId)
    .eq('user_id', userId)
  return { error }
}
