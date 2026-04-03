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
  let query = supabase
    .from('help_requests')
    .select('*, profiles(full_name, avatar_url)')
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

export async function offerHelp(requestId: string, helperId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('help_requests')
    .update({ status: 'in_progress', helper_id: helperId })
    .eq('id', requestId)
    .eq('status', 'open')
    .select()
    .single()
  return { data, error }
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
