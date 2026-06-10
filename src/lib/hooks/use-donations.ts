'use client'

import { createClient as createTypedClient } from '@/lib/supabase/client'
const createClient = () => createTypedClient() as any

export interface Donation {
  id: string
  user_id: string
  neighborhood_id?: string | null
  donation_type: string
  title: string
  description?: string
  amount?: number
  quantity?: number
  status: 'available' | 'claimed' | 'completed' | 'expired'
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
  neighborhoods?: { name: string }
}

// NOT: donations'ta profiles'a İKİ FK var (user_id = bağışçı, claimed_by = alan).
// İpuçsuz `profiles(...)` PostgREST'te belirsizlik (PGRST201 → 300) üretir —
// Komşuma Yardım'daki bug'ın aynısı. Bağışçı profili açık FK ipucuyla embed edilir.
const DONATION_SELECT =
  '*, profiles!donations_user_id_fkey(full_name, avatar_url), businesses(name), neighborhoods(name)'

export async function getDonations(options?: {
  neighborhoodId?: string
  status?: string
  limit?: number
  userId?: string
  claimedBy?: string
  /** true → süresi geçmiş bağışları da getir (varsayılan: yalnızca süresi geçmemişler) */
  includeExpired?: boolean
}) {
  const supabase = createClient()
  let query = supabase
    .from('donations')
    .select(DONATION_SELECT)
    .order('created_at', { ascending: false })

  if (options?.neighborhoodId) query = query.eq('neighborhood_id', options.neighborhoodId)
  if (options?.status) query = query.eq('status', options.status)
  if (options?.userId) query = query.eq('user_id', options.userId)
  if (options?.claimedBy) query = query.eq('claimed_by', options.claimedBy)
  if (!options?.includeExpired) query = query.gt('expires_at', new Date().toISOString())
  query = query.limit(options?.limit ?? 50)

  const { data, error } = await query
  return { data, error }
}

export async function createDonation(donation: {
  user_id: string
  neighborhood_id?: string | null
  donation_type: string
  title: string
  description?: string
  amount?: number
  quantity?: number
  business_id?: string | null
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('donations')
    // Eşya askısında uygulama üzerinden para akmaz; 'pending' ödeme durumu
    // yanıltıcı olurdu. Para bağışı PayTR canlıya bağlanınca ayrı akış olacak.
    .insert({ ...donation, payment_status: 'completed' })
    .select()
    .single()
  return { data, error }
}

/**
 * Askıdan alma — SECURITY DEFINER `claim_donation` RPC'si ile atomik.
 * (Eski istemci-update yolu RLS'te her zaman 0 satır etkiliyordu: UPDATE
 * politikası user_id/claimed_by istiyor, alan kişi henüz ikisi de değil.)
 * Dönüş: { conversationReady: donor_id } — teslimatı konuşmak için bağışçıyla
 * mesajlaşma başlatmakta kullanılır.
 */
export async function claimDonation(donationId: string) {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('claim_donation', {
    p_donation_id: donationId,
  })
  const row = Array.isArray(data) ? data[0] : data
  return { data: row as { donation_id: string; donor_id: string } | undefined, error }
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
