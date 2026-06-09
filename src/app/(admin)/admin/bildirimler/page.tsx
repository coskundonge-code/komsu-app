'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Search, ChevronLeft, ChevronRight, Bell } from 'lucide-react';

// AUDIT_REPORT.md K3 — gerçek notifications tablosuna bağlı

type NotificationRow = {
  id: string
  user_id: string
  type: string
  title: string
  body: string | null
  is_read: boolean
  created_at: string
  user_name: string
  user_email: string
}

async function fetchNotifications(): Promise<NotificationRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('notifications')
    .select(`id, user_id, type, title, body, is_read, created_at,
             profiles ( full_name, email )`)
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) throw error
  return ((data as any[]) || []).map((r) => ({
    id: r.id, user_id: r.user_id, type: r.type, title: r.title,
    body: r.body, is_read: r.is_read, created_at: r.created_at,
    user_name: r.profiles?.full_name || '—',
    user_email: r.profiles?.email || '—',
  }))
}

export default function BildirimlerPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [readFilter, setReadFilter] = useState<'all' | 'read' | 'unread'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const { data: notifications = [], isLoading, error }: { data?: NotificationRow[]; isLoading: boolean; error: Error | null } = useQuery({
    queryKey: ['admin', 'notifications'],
    queryFn: fetchNotifications,
  })

  const types = useMemo(() => Array.from(new Set(notifications.map((n) => n.type))).sort(), [notifications])

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      const q = searchTerm.toLowerCase()
      const matchesSearch = !q ||
        n.title.toLowerCase().includes(q) ||
        (n.body || '').toLowerCase().includes(q) ||
        n.user_name.toLowerCase().includes(q)
      const matchesType = !typeFilter || n.type === typeFilter
      const matchesRead = readFilter === 'all' || (readFilter === 'read' ? n.is_read : !n.is_read)
      return matchesSearch && matchesType && matchesRead
    })
  }, [notifications, searchTerm, typeFilter, readFilter])

  const paginated = useMemo(() => filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filtered, currentPage])
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const totalUnread = notifications.filter((n) => !n.is_read).length

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3"><Bell className="text-primary" /> Bildirim Yönetimi</h1>
        <p className="text-gray-600">Sistem ve kullanıcı bildirimlerini izleyin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Toplam Bildirim</p>
          <p className="text-3xl font-bold mt-2 text-primary">{notifications.length}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Okunmamış</p>
          <p className="text-3xl font-bold mt-2 text-yellow-600">{totalUnread}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Bildirim Türü</p>
          <p className="text-3xl font-bold mt-2 text-blue-600">{types.length}</p>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-lg border border-border mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Başlık, içerik veya kullanıcı ara..." value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1) }} className="px-4 py-2 border border-border rounded-lg">
          <option value="">Tüm Türler</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={readFilter} onChange={(e) => { setReadFilter(e.target.value as any); setCurrentPage(1) }} className="px-4 py-2 border border-border rounded-lg">
          <option value="all">Tümü</option>
          <option value="unread">Okunmamış</option>
          <option value="read">Okunmuş</option>
        </select>
      </div>

      {isLoading && <div className="bg-surface p-8 rounded-lg text-center text-gray-600">Yükleniyor…</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">Hata: {(error as Error).message}</div>}

      {!isLoading && !error && (
        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Kullanıcı</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tür</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Başlık</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Durum</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((n) => (
                  <tr key={n.id} className="border-b border-border hover:bg-background">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{n.user_name}</p>
                      <p className="text-xs text-gray-500">{n.user_email}</p>
                    </td>
                    <td className="px-6 py-4"><span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{n.type}</span></td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{n.title}</p>
                      {n.body && <p className="text-xs text-gray-500 mt-1 truncate max-w-md">{n.body}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${n.is_read ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-800'}`}>
                        {n.is_read ? 'Okundu' : 'Okunmadı'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(n.created_at).toLocaleString('tr-TR')}</td>
                  </tr>
                ))}
                {paginated.length === 0 && (<tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Bildirim bulunamadı.</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <span className="text-sm text-gray-600">Sayfa {currentPage} / {totalPages} ({filtered.length} bildirim)</span>
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
