'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Search, ChevronLeft, ChevronRight, Users2, Lock, Globe, Trash2 } from 'lucide-react';

// AUDIT_REPORT.md K3 — gerçek groups tablosuna bağlı

type GroupRow = {
  id: string
  name: string
  slug: string
  description: string | null
  category: string | null
  is_private: boolean
  member_count: number
  created_at: string
  neighborhood_name: string
  creator_name: string
}

async function fetchGroups(): Promise<GroupRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('groups')
    .select(`id, name, slug, description, category, is_private, member_count, created_at,
             neighborhoods ( name ),
             profiles!groups_created_by_fkey ( full_name )`)
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) throw error
  return ((data as any[]) || []).map((g) => ({
    id: g.id, name: g.name, slug: g.slug, description: g.description,
    category: g.category, is_private: g.is_private || false,
    member_count: g.member_count || 0, created_at: g.created_at,
    neighborhood_name: g.neighborhoods?.name || '—',
    creator_name: g.profiles?.full_name || '—',
  }))
}

export default function GruplarPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [privacyFilter, setPrivacyFilter] = useState<'all' | 'public' | 'private'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const { data: groups = [], isLoading, error } = useQuery({
    queryKey: ['admin', 'groups'],
    queryFn: fetchGroups,
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('groups').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'groups'] }),
  })

  const filtered = useMemo(() => {
    return groups.filter((g) => {
      const q = searchTerm.toLowerCase()
      const matchesSearch = !q || g.name.toLowerCase().includes(q) || (g.description || '').toLowerCase().includes(q)
      const matchesPrivacy = privacyFilter === 'all' || (privacyFilter === 'private' ? g.is_private : !g.is_private)
      return matchesSearch && matchesPrivacy
    })
  }, [groups, searchTerm, privacyFilter])

  const paginated = useMemo(() => filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filtered, currentPage])
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3"><Users2 className="text-primary" /> Grup Yönetimi</h1>
        <p className="text-gray-600">Mahalle gruplarını yönetin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Toplam Grup</p>
          <p className="text-3xl font-bold mt-2 text-primary">{groups.length}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Açık Grup</p>
          <p className="text-3xl font-bold mt-2 text-green-600">{groups.filter(g => !g.is_private).length}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Özel Grup</p>
          <p className="text-3xl font-bold mt-2 text-yellow-600">{groups.filter(g => g.is_private).length}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Toplam Üye</p>
          <p className="text-3xl font-bold mt-2 text-blue-600">{groups.reduce((s, g) => s + g.member_count, 0)}</p>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-lg border border-border mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Grup adı veya açıklama ara..." value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg" />
        </div>
        <select value={privacyFilter} onChange={(e) => { setPrivacyFilter(e.target.value as any); setCurrentPage(1) }}
          className="px-4 py-2 border border-border rounded-lg">
          <option value="all">Tüm Gizlilik</option>
          <option value="public">Açık</option>
          <option value="private">Özel</option>
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
                  <th className="px-6 py-3 text-left text-sm font-semibold">Grup</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Mahalle</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Kategori</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Gizlilik</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Üye</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Oluşturan</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((g) => (
                  <tr key={g.id} className="border-b border-border hover:bg-background">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{g.name}</p>
                      {g.description && <p className="text-xs text-gray-500 truncate max-w-xs">{g.description}</p>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{g.neighborhood_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{g.category || '—'}</td>
                    <td className="px-6 py-4">
                      {g.is_private
                        ? <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full"><Lock size={12} /> Özel</span>
                        : <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full"><Globe size={12} /> Açık</span>}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono">{g.member_count}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{g.creator_name}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => { if (confirm(`"${g.name}" grubunu silmek istediğinizden emin misiniz?`)) deleteMutation.mutate(g.id) }}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:text-red-800 p-1 rounded disabled:opacity-50">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (<tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">Grup bulunamadı.</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <span className="text-sm text-gray-600">Sayfa {currentPage} / {totalPages} ({filtered.length} grup)</span>
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
