'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Search, ChevronLeft, ChevronRight, MessageSquare, Trash2, Pin, AlertCircle, Eye } from 'lucide-react';

// AUDIT_REPORT.md K3 — gerçek posts tablosuna bağlı

type PostRow = {
  id: string
  title: string | null
  body: string | null
  type: string
  category: string | null
  is_pinned: boolean
  is_urgent: boolean
  visibility: string
  comment_count: number
  reaction_count: number
  created_at: string
  author_name: string
  neighborhood_name: string
}

async function fetchPosts(): Promise<PostRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('posts')
    .select(`id, title, body, type, category, is_pinned, is_urgent, visibility, comment_count, reaction_count, created_at,
             profiles!posts_author_id_fkey ( full_name ),
             neighborhoods ( name )`)
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) throw error
  return ((data as any[]) || []).map((p) => ({
    id: p.id, title: p.title, body: p.body, type: p.type,
    category: p.category, is_pinned: p.is_pinned || false,
    is_urgent: p.is_urgent || false, visibility: p.visibility || 'public',
    comment_count: p.comment_count || 0, reaction_count: p.reaction_count || 0,
    created_at: p.created_at,
    author_name: p.profiles?.full_name || '—',
    neighborhood_name: p.neighborhoods?.name || '—',
  }))
}

export default function GonderilerPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['admin', 'posts'],
    queryFn: fetchPosts,
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('posts').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] }),
  })

  const pinMutation = useMutation({
    mutationFn: async ({ id, pinned }: { id: string; pinned: boolean }) => {
      const supabase = createClient()
      const { error } = await supabase.from('posts').update({ is_pinned: pinned }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] }),
  })

  const types = useMemo(() => Array.from(new Set(posts.map((p) => p.type))).sort(), [posts])

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const q = searchTerm.toLowerCase()
      const matchesSearch = !q ||
        (p.title || '').toLowerCase().includes(q) ||
        (p.body || '').toLowerCase().includes(q) ||
        p.author_name.toLowerCase().includes(q)
      const matchesType = !typeFilter || p.type === typeFilter
      return matchesSearch && matchesType
    })
  }, [posts, searchTerm, typeFilter])

  const paginated = useMemo(() => filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filtered, currentPage])
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))

  const totalComments = posts.reduce((s, p) => s + p.comment_count, 0)
  const totalReactions = posts.reduce((s, p) => s + p.reaction_count, 0)
  const urgentCount = posts.filter(p => p.is_urgent).length

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3"><MessageSquare className="text-primary" /> Gönderi Yönetimi</h1>
        <p className="text-gray-600">Mahalle gönderilerini yönetin ve moderasyon yapın</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Toplam</p>
          <p className="text-3xl font-bold mt-2 text-primary">{posts.length}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Acil</p>
          <p className="text-3xl font-bold mt-2 text-red-600">{urgentCount}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Toplam Yorum</p>
          <p className="text-3xl font-bold mt-2 text-blue-600">{totalComments}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Toplam Reaksiyon</p>
          <p className="text-3xl font-bold mt-2 text-yellow-600">{totalReactions}</p>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-lg border border-border mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Başlık, içerik veya yazar ara..." value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg" />
        </div>
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1) }}
          className="px-4 py-2 border border-border rounded-lg">
          <option value="">Tüm Türler</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
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
                  <th className="px-6 py-3 text-left text-sm font-semibold">Başlık</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Yazar</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Mahalle</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tür</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Etkileşim</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tarih</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => (
                  <tr key={p.id} className="border-b border-border hover:bg-background">
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex items-center gap-2">
                        {p.is_pinned && <Pin size={14} className="text-blue-600 flex-shrink-0" />}
                        {p.is_urgent && <AlertCircle size={14} className="text-red-600 flex-shrink-0" />}
                        <p className="font-medium text-gray-900 truncate">{p.title || (p.body || '').slice(0, 60) + '…'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.author_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.neighborhood_name}</td>
                    <td className="px-6 py-4"><span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{p.type}</span></td>
                    <td className="px-6 py-4 text-sm">
                      <span className="text-blue-600">💬 {p.comment_count}</span>
                      <span className="ml-2 text-yellow-600">❤️ {p.reaction_count}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(p.created_at).toLocaleDateString('tr-TR')}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => pinMutation.mutate({ id: p.id, pinned: !p.is_pinned })}
                        disabled={pinMutation.isPending}
                        className={`p-1 rounded disabled:opacity-50 ${p.is_pinned ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}
                        title={p.is_pinned ? 'Sabitlemeyi kaldır' : 'Sabitle'}>
                        <Pin size={16} />
                      </button>
                      <button onClick={() => { if (confirm('Bu gönderiyi silmek istiyor musunuz?')) deleteMutation.mutate(p.id) }}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:text-red-800 p-1 rounded disabled:opacity-50">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (<tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">Gönderi bulunamadı.</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <span className="text-sm text-gray-600">Sayfa {currentPage} / {totalPages} ({filtered.length} gönderi)</span>
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
