'use client'

import { createClient as createTypedClient } from '@/lib/supabase/client'
const createClient = () => createTypedClient() as any

export interface HelpRequest {
  id: string
  user_id: string
  neighborhood_id?: string
  type: 'request' | 'offer'
  category: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  helper_id?: string
  is_urgent: boolean
  image_urls?: string[]
  created_at: string
  updated_at: string
  // Joined fields
  profiles?: { full_name: string; avatar_url?: string }
}

export async function getHelpRequests(options?: {
  neighborhoodId?: string
  type?: 'request' | 'offer'
  category?: string
  status?: string
  limit?: number
}) {
  const supabase = createClient()
  // Talep sahibinin profilini açık FK ipucuyla embed et. help_requests'te hem
  // user_id hem helper_id artık profiles'a FK'lı; ipuçsuz `profiles(...)` iki
  // ilişkiyle eşleşip PostgREST'te 300 (PGRST201 ambiguous) üretir. Talep
  // sahibi = user_id. (Konvansiyon: posts da `profiles!posts_author_id_fkey`.)
  let query = supabase
    .from('help_requests')
    .select('*, profiles!help_requests_user_id_fkey(full_name, avatar_url)')
    .order('created_at', { ascending: false })

  if (options?.neighborhoodId) query = query.eq('neighborhood_id', options.neighborhoodId)
  if (options?.type) query = query.eq('type', options.type)
  if (options?.category && options.category !== 'all') query = query.eq('category', options.category)
  if (options?.status) query = query.eq('status', options.status)
  if (options?.limit) query = query.limit(options.limit)

  const { data, error } = await query
  return { data, error }
}

export async function createHelpRequest(request: {
  user_id: string
  neighborhood_id?: string
  type: 'request' | 'offer'
  category: string
  title: string
  description: string
  is_urgent?: boolean
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('help_requests')
    .insert({ ...request, is_urgent: request.is_urgent ?? false })
    .select()
    .single()
  return { data, error }
}

/**
 * Yardım teklifi — SECURITY DEFINER `offer_help` RPC'si ile atomik.
 * (Eski istemci-update yolu RLS'te her zaman 0 satır etkiliyordu: UPDATE
 * politikası user_id/helper_id istiyor, yardım etmek isteyen henüz ikisi de
 * değil — donations'taki claim bug'ının aynısı. RPC ayrıca adres doğrulaması
 * ister ve aynı talebi yalnızca tek kişinin üstlenmesini garanti eder.)
 */
export async function offerHelp(requestId: string) {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('offer_help', {
    p_request_id: requestId,
  })
  const row = Array.isArray(data) ? data[0] : data
  return { data: row as { request_id: string; requester_id: string } | undefined, error }
}

export async function completeHelpRequest(requestId: string, userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('help_requests')
    .update({ status: 'completed' })
    .eq('id', requestId)
    .or(`user_id.eq.${userId},helper_id.eq.${userId}`)
    .select()
    .single()
  return { data, error }
}

export async function deleteHelpRequest(requestId: string, userId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('help_requests')
    .delete()
    .eq('id', requestId)
    .eq('user_id', userId)
  return { error }
}
