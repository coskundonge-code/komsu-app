'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Search, ChevronLeft, ChevronRight, Star, MessageSquare, Trash2 } from 'lucide-react';

// AUDIT_REPORT.md K3 — gerçek comments + business_reviews tablolarına bağlı

type CommentRow = {
  id: string
  source: 'post_comment' | 'business_review'
  body: string | null
  rating: number | null
  created_at: string
  author_name: string
  context: string  // post title or business name
}

async function fetchComments(): Promise<CommentRow[]> {
  const supabase = createClient()

  const [postComments, bizReviews] = await Promise.all([
    supabase
      .from('comments')
      .select(`id, body, created_at,
               profiles!comments_author_id_fkey ( full_name ),
               posts ( title )`)
      .order('created_at', { ascending: false })
      .limit(250),
    supabase
      .from('business_reviews')
      .select(`id, body, rating, created_at,
               profiles ( full_name ),
               businesses ( name )`)
      .order('created_at', { ascending: false })
      .limit(250),
  ])

  if (postComments.error) throw postComments.error
  if (bizReviews.error) throw bizReviews.error

  const comments: CommentRow[] = ((postComments.data as any[]) || []).map((c) => ({
    id: c.id, source: 'post_comment', body: c.body, rating: null,
    created_at: c.created_at,
    author_name: c.profiles?.full_name || '—',
    context: c.posts?.title || 'Gönderi',
  }))
  const reviews: CommentRow[] = ((bizReviews.data as any[]) || []).map((r) => ({
    id: r.id, source: 'business_review', body: r.body, rating: r.rating,
    created_at: r.created_at,
    author_name: r.profiles?.full_name || '—',
    context: r.businesses?.name || 'İşletme',
  }))

  return [...comments, ...reviews].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export default function YorumlarPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [sourceFilter, setSourceFilter] = useState<'all' | 'post_comment' | 'business_review'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const { data: comments = [], isLoading, error } = useQuery({
    queryKey: ['admin', 'comments-and-reviews'],
    queryFn: fetchComments,
  })

  const deleteMutation = useMutation({
    mutationFn: async ({ id, source }: { id: string; source: CommentRow['source'] }) => {
      const supabase = createClient()
      const table = source === 'post_comment' ? 'comments' : 'business_reviews'
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'comments-and-reviews'] }),
  })

  const filtered = useMemo(() => {
    return comments.filter((c) => {
      const q = searchTerm.toLowerCase()
      const matchesSearch = !q || (c.body || '').toLowerCase().includes(q) || c.author_name.toLowerCase().includes(q)
      const matchesSource = sourceFilter === 'all' || c.source === sourceFilter
      return matchesSearch && matchesSource
    })
  }, [comments, searchTerm, sourceFilter])

  const paginated = useMemo(() => filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filtered, currentPage])
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3"><MessageSquare className="text-primary" /> Yorum Yönetimi</h1>
        <p className="text-gray-600">Gönderi yorumları ve işletme değerlendirmeleri</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Toplam</p>
          <p className="text-3xl font-bold mt-2 text-primary">{comments.length}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Gönderi Yorumu</p>
          <p className="text-3xl font-bold mt-2 text-blue-600">{comments.filter(c => c.source === 'post_comment').length}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">İşletme Değerlendirmesi</p>
          <p className="text-3xl font-bold mt-2 text-yellow-600">{comments.filter(c => c.source === 'business_review').length}</p>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-lg border border-border mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="İçerik veya yazar ara..." value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg" />
        </div>
        <select value={sourceFilter} onChange={(e) => { setSourceFilter(e.target.value as any); setCurrentPage(1) }}
          className="px-4 py-2 border border-border rounded-lg">
          <option value="all">Tümü</option>
          <option value="post_comment">Gönderi Yorumları</option>
          <option value="business_review">İşletme Değerlendirmeleri</option>
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
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tür</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Yazar</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">İçerik</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Bağlam</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Puan</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tarih</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((c) => (
                  <tr key={`${c.source}-${c.id}`} className="border-b border-border hover:bg-background">
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${c.source === 'post_comment' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {c.source === 'post_comment' ? 'Yorum' : 'Değerlendirme'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{c.author_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-md truncate">{c.body || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{c.context}</td>
                    <td className="px-6 py-4">
                      {c.rating !== null && (
                        <span className="inline-flex items-center gap-1 text-sm">
                          <Star size={14} className="text-yellow-500 fill-yellow-500" /> {c.rating}/5
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(c.created_at).toLocaleDateString('tr-TR')}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => { if (confirm('Bu yorumu silmek istiyor musunuz?')) deleteMutation.mutate({ id: c.id, source: c.source }) }}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:text-red-800 p-1 rounded disabled:opacity-50">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (<tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">Yorum bulunamadı.</td></tr>)}
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
