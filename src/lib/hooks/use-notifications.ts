'use client'

import { createClient as createTypedClient } from '@/lib/supabase/client'
const createClient = () => createTypedClient() as any
import type { Database } from '@/lib/supabase/types'

export async function getNotifications(userId: string, options?: { limit?: number; unreadOnly?: boolean }) {
  const supabase = createClient()
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (options?.unreadOnly) query = query.eq('is_read', false)
  query = query.limit(options?.limit ?? 50) // sınırsız çekme yok (perf)

  const { data, error } = await query
  return { data, error }
}

export async function markNotificationAsRead(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('notifications').update({ is_read: true } as any).eq('id', id)
  return { error }
}

export async function markAllNotificationsAsRead(userId: string) {
  const supabase = createClient()
  const { error } = await supabase.from('notifications').update({ is_read: true } as any).eq('user_id', userId).eq('is_read', false)
  return { error }
}

// NOT (2026-06-07): Gerçek kolon adları author_id ve severity'dir (eskiden
// hatalı `alerts_created_by_fkey` / `alert_severity` kullanılıyordu). neighborhoodId
// opsiyonel: verilmezse tüm uyarılar döner.
export async function getAlerts(neighborhoodId?: string, options?: { limit?: number; severity?: string }) {
  const supabase = createClient()
  let query = supabase
    .from('alerts')
    .select('*, profiles!alerts_author_id_fkey(full_name)')
    .order('created_at', { ascending: false })

  if (neighborhoodId) query = query.eq('neighborhood_id', neighborhoodId)
  if (options?.severity) query = query.eq('severity', options.severity)
  query = query.limit(options?.limit ?? 50) // sınırsız çekme yok (perf)

  const { data, error } = await query
  return { data, error }
}

export async function createAlert(alert: Database['public']['Tables']['alerts']['Insert']) {
  const supabase = createClient()
  const { data, error } = await supabase.from('alerts').insert(alert as any).select().single()
  return { data, error }
}
