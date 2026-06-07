'use client'

import { createClient as createTypedClient } from '@/lib/supabase/client'
const createClient = () => createTypedClient() as any
import type { Database } from '@/lib/supabase/types'

export async function getEvents(options?: {
  neighborhoodId?: string
  limit?: number
  upcoming?: boolean
}) {
  const supabase = createClient()
  let query = supabase
    .from('events')
    .select('*, profiles!events_organizer_id_fkey(full_name, avatar_url), event_attendees(count)')
    .order('start_date', { ascending: true })

  if (options?.neighborhoodId) query = query.eq('neighborhood_id', options.neighborhoodId)
  if (options?.upcoming) query = query.gte('start_date', new Date().toISOString())
  if (options?.limit) query = query.limit(options.limit)

  const { data, error } = await query
  return { data, error }
}

export async function getEventById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*, profiles!events_organizer_id_fkey(full_name, avatar_url), event_attendees(*, profiles(full_name, avatar_url))')
    .eq('id', id)
    .single()
  return { data, error }
}

export async function createEvent(event: Database['public']['Tables']['events']['Insert']) {
  const supabase = createClient()
  const { data, error } = await supabase.from('events').insert(event as any).select().single()
  return { data, error }
}

export async function rsvpEvent(eventId: string, userId: string, status: 'attending' | 'interested' | 'not_attending') {
  const supabase = createClient()
  // event_attendees birincil anahtarı (event_id, user_id) bileşiğidir; ayrı bir `id`
  // kolonu YOK. Var olan kaydı bu ikili ile bul, yine bu ikili ile güncelle.
  const { data: existing } = await supabase
    .from('event_attendees')
    .select('event_id')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('event_attendees')
      .update({ status } as any)
      .eq('event_id', eventId)
      .eq('user_id', userId)
    return { error }
  } else {
    const { error } = await supabase.from('event_attendees').insert({ event_id: eventId, user_id: userId, status } as any)
    return { error }
  }
}
