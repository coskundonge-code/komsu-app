'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/lib/utils/show-toast';
import {
  Shield, CheckCircle, XCircle, Clock, AlertTriangle, Search,
  ChevronLeft, ChevronRight, MessageSquare, ShoppingBag, Users, Calendar, Bell, Star,
} from 'lucide-react';

// AUDIT_REPORT.md K3 — gerçek content_moderation + reports tablolarına bağlı

type ModRow = {
  id: string
  source: 'moderation' | 'report'
  content_type: string
  content_id: string | null
  status: string
  reason: string | null
  ai_score: number | null
  reporter_name: string
  created_at: string
}

async function fetchModerationQueue(): Promise<ModRow[]> {
  const supabase = createClient()
  const [moderation, reports] = await Promise.all([
    supabase
      .from('content_moderation')
      .select(`id, content_type, content_id, status, reason, ai_score, created_at,
               profiles!content_moderation_reported_by_fkey ( full_name )`)
      .order('created_at', { ascending: false })
      .limit(250),
    supabase
      .from('reports')
      .select(`id, post_id, comment_id, reported_user_id, reason, description, status, created_at,
               profiles!reports_reporter_id_fkey ( full_name )`)
      .order('created_at', { ascending: false })
      .limit(250),
  ])

  if (moderation.error) throw moderation.error
  if (reports.error) throw reports.error

  const modRows: ModRow[] = ((moderation.data as any[]) || []).map((m) => ({
    id: m.id, source: 'moderation',
    content_type: m.content_type || 'unknown',
    content_id: m.content_id,
    status: m.status || 'pending',
    reason: m.reason,
    ai_score: m.ai_score,
    reporter_name: m.profiles?.full_name || '—',
    created_at: m.created_at,
  }))
  const reportRows: ModRow[] = ((reports.data as any[]) || []).map((r) => ({
    id: r.id, source: 'report',
    content_type: r.post_id ? 'post' : r.comment_id ? 'comment' : r.reported_user_id ? 'user' : 'other',
    content_id: r.post_id || r.comment_id || r.reported_user_id,
    status: r.status || 'pending',
    reason: r.reason || r.description,
    ai_score: null,
    reporter_name: r.profiles?.full_name || '—',
    created_at: r.created_at,
  }))

  return [...modRows, ...reportRows].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending:        { label: 'Beklemede',      color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  pending_admin:  { label: 'Admin Bekliyor', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  pending_ai:     { label: 'AI Bekliyor',    color: 'bg-blue-100 text-blue-800',     icon: Clock },
  approved:       { label: 'Onaylandı',      color: 'bg-green-100 text-green-800',   icon: CheckCircle },
  ai_approved:    { label: 'AI Onayladı',    color: 'bg-green-100 text-green-800',   icon: CheckCircle },
  admin_approved: { label: 'Admin Onayladı', color: 'bg-green-100 text-green-800',   icon: CheckCircle },
  rejected:       { label: 'Reddedildi',     color: 'bg-red-100 text-red-800',       icon: XCircle },
  ai_rejected:    { label: 'AI Reddetti',    color: 'bg-red-100 text-red-800',       icon: XCircle },
  admin_rejected: { label: 'Admin Reddetti', color: 'bg-red-100 text-red-800',       icon: XCircle },
  resolved:       { label: 'Çözüldü',        color: 'bg-gray-100 text-gray-800',     icon: CheckCircle },
}

const TYPE_ICONS: Record<string, any> = {
  post: MessageSquare,
  comment: MessageSquare,
  listing: ShoppingBag,
  group: Users,
  event: Calendar,
  alert: Bell,
  business_review: Star,
  user: Users,
}

export default function ModerasyonPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['admin', 'moderation-queue'],
    queryFn: fetchModerationQueue,
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, source, status }: { id: string; source: ModRow['source']; status: string }) => {
      const supabase = createClient()
      const table = source === 'moderation' ? 'content_moderation' : 'reports'
      const update: any = { status }
      if (source === 'moderation') {
        update.resolved_at = new Date().toISOString()
      }
      const { error } = await supabase.from(table).update(update).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'moderation-queue'] })
      toast.success('İşlem tamamlandı')
    },
    onError: (err) => toast.error('Hata: ' + (err as Error).message),
  })

  const filtered = useMemo(() => {
    return items.filter((m) => {
      const q = searchTerm.toLowerCase()
      const matchesSearch = !q ||
        (m.reason || '').toLowerCase().includes(q) ||
        m.reporter_name.toLowerCase().includes(q)
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'pending' && (m.status.includes('pending'))) ||
        (statusFilter === 'approved' && (m.status.includes('approved') || m.status === 'resolved')) ||
        (statusFilter === 'rejected' && m.status.includes('rejected'))
      return matchesSearch && matchesStatus
    })
  }, [items, searchTerm, statusFilter])

  const paginated = useMemo(() => filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filtered, currentPage])
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))

  const counts = {
    pending: items.filter(i => i.status.includes('pending')).length,
    approved: items.filter(i => i.status.includes('approved') || i.status === 'resolved').length,
    rejected: items.filter(i => i.status.includes('rejected')).length,
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3"><Shield className="text-primary" /> Moderasyon Kuyruğu</h1>
        <p className="text-gray-600">Bildirilen içerikler ve moderasyon kayıtları</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Toplam</p>
          <p className="text-3xl font-bold mt-2 text-primary">{items.length}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Beklemede</p>
          <p className="text-3xl font-bold mt-2 text-yellow-600">{counts.pending}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Onaylandı</p>
          <p className="text-3xl font-bold mt-2 text-green-600">{counts.approved}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Reddedildi</p>
          <p className="text-3xl font-bold mt-2 text-red-600">{counts.rejected}</p>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-lg border border-border mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Sebep veya raporlayan ara..." value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(1) }}
          className="px-4 py-2 border border-border rounded-lg">
          <option value="all">Tümü</option>
          <option value="pending">Beklemede</option>
          <option value="approved">Onaylananlar</option>
          <option value="rejected">Reddedilenler</option>
        </select>
      </div>

      {isLoading && <div className="bg-surface p-8 rounded-lg text-center text-gray-600">Yükleniyor…</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">Hata: {(error as Error).message}</div>}

      {!isLoading && !error && items.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg text-blue-900">
          <p className="font-semibold">Moderasyon kuyruğu boş</p>
          <p className="text-sm mt-1">Kullanıcı şikâyetleri ve AI moderasyon kayıtları burada listelenecek.</p>
        </div>
      )}

      {!isLoading && !error && items.length > 0 && (
        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Kaynak</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">İçerik Türü</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Sebep</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Raporlayan</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">AI Skoru</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Durum</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tarih</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((m) => {
                  const sc = STATUS_CONFIG[m.status] || { label: m.status, color: 'bg-gray-100 text-gray-800', icon: Clock }
                  const Icon = sc.icon
                  const TypeIcon = TYPE_ICONS[m.content_type] || AlertTriangle
                  const isPending = m.status.includes('pending')
                  return (
                    <tr key={`${m.source}-${m.id}`} className="border-b border-border hover:bg-background">
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${m.source === 'report' ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800'}`}>
                          {m.source === 'report' ? 'Şikâyet' : 'AI/Mod'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                          <TypeIcon size={14} /> {m.content_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{m.reason || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{m.reporter_name}</td>
                      <td className="px-6 py-4 text-sm font-mono">
                        {m.ai_score !== null ? `${m.ai_score}` : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${sc.color}`}>
                          <Icon size={12} /> {sc.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(m.created_at).toLocaleDateString('tr-TR')}</td>
                      <td className="px-6 py-4">
                        {isPending && (
                          <div className="flex gap-1">
                            <button onClick={() => updateMutation.mutate({ id: m.id, source: m.source, status: m.source === 'moderation' ? 'admin_approved' : 'resolved' })}
                              disabled={updateMutation.isPending}
                              className="text-green-600 hover:bg-green-50 p-1 rounded disabled:opacity-50" title="Onayla">
                              <CheckCircle size={16} />
                            </button>
                            <button onClick={() => updateMutation.mutate({ id: m.id, source: m.source, status: m.source === 'moderation' ? 'admin_rejected' : 'rejected' })}
                              disabled={updateMutation.isPending}
                              className="text-red-600 hover:bg-red-50 p-1 rounded disabled:opacity-50" title="Reddet">
                              <XCircle size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <span className="text-sm text-gray-600">Sayfa {currentPage} / {totalPages} ({filtered.length} kayıt)</span>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 hover:bg-background rounded-lg disabled:opacity-50"><ChevronLeft size={20} /></button>
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 hover:bg-background rounded-lg disabled:opacity-50"><ChevronRight size={20} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
