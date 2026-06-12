'use client'

// Kullanıcı engelleme (Apple Guideline 1.2(b) — mağaza zorunluluğu, 2026-06-11).
// Engelleme çift yönlü etki eder: sunucu tarafında yeni sohbet açılamaz
// (get_or_create_direct_conversation → BLOCKED) ve mevcut sohbete mesaj
// yazılamaz (messages INSERT politikası). İçerik gizleme istemci tarafında
// yapılır (getPosts engellenen yazarları filtreler).

import { createClient as createTypedClient } from '@/lib/supabase/client'
const createClient = () => createTypedClient() as any

export interface BlockedUserRow {
  blocked_id: string
  created_at: string
  profiles?: { full_name: string; avatar_url?: string | null }
}

export async function getBlockedUsers() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('blocked_users')
    .select('blocked_id, created_at, profiles!blocked_users_blocked_id_fkey(full_name, avatar_url)')
    .order('created_at', { ascending: false })
  return { data: (data || []) as BlockedUserRow[], error }
}

/** Yalnızca id listesi — feed/yorum filtreleri için hafif çağrı. */
export async function getBlockedIds(): Promise<string[]> {
  const supabase = createClient()
  const { data } = await supabase.from('blocked_users').select('blocked_id')
  return ((data || []) as { blocked_id: string }[]).map(r => r.blocked_id)
}

export async function blockUser(blockedId: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: { message: 'Oturum bulunamadı' } }
  const { error } = await supabase
    .from('blocked_users')
    .insert({ blocker_id: user.id, blocked_id: blockedId })
  return { error }
}

export async function unblockUser(blockedId: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: { message: 'Oturum bulunamadı' } }
  const { error } = await supabase
    .from('blocked_users')
    .delete()
    .eq('blocker_id', user.id)
    .eq('blocked_id', blockedId)
  return { error }
}

export async function isUserBlocked(otherId: string): Promise<boolean> {
  const supabase = createClient()
  const { data } = await supabase
    .from('blocked_users')
    .select('blocked_id')
    .eq('blocked_id', otherId)
    .limit(1)
  return !!(data && data.length > 0)
}
