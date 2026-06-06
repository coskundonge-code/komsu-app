'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Search, ChevronLeft, ChevronRight, Store, CheckCircle, XCircle, Star } from 'lucide-react';

// AUDIT_REPORT.md K3 — gerçek businesses tablosuna bağlı

type BusinessRow = {
  id: string
  name: string
  slug: string
  description: string | null
  address: string | null
  phone: string | null
  is_verified: boolean
  rating_avg: number
  review_count: number
  created_at: string
  owner_name: string
  category_name: string
}

async function fetchBusinesses(): Promise<BusinessRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('businesses')
    .select(`id, name, slug, description, address, phone, is_verified, rating_avg, review_count, created_at,
             profiles!businesses_owner_id_fkey ( full_name ),
             business_categories ( name )`)
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) throw error
  return ((data as any[]) || []).map((b) => ({
    id: b.id, name: b.name, slug: b.slug, description: b.description,
    address: b.address, phone: b.phone, is_verified: b.is_verified || false,
    rating_avg: parseFloat(b.rating_avg) || 0, review_count: b.review_count || 0,
    created_at: b.created_at,
    owner_name: b.profiles?.full_name || '—',
    category_name: b.business_categories?.name || '—',
  }))
}

export default function IsletmelerPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const { data: businesses = [], isLoading, error }: { data?: BusinessRow[]; isLoading: boolean; error: Error | null } = useQuery({
    queryKey: ['admin', 'businesses'],
    queryFn: fetchBusinesses,
  })

  const verifyMutation = useMutation({
    mutationFn: async ({ id, verified }: { id: string; verified: boolean }) => {
      const supabase = createClient()
      const { error } = await supabase.from('businesses').update({ is_verified: verified }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'businesses'] }),
  })

  const filtered = useMemo(() => {
    return businesses.filter((b) => {
      const q = searchTerm.toLowerCase()
      const matchesSearch = !q ||
        b.name.toLowerCase().includes(q) ||
        (b.description || '').toLowerCase().includes(q) ||
        b.owner_name.toLowerCase().includes(q)
      const matchesVerified = verifiedFilter === 'all' ||
        (verifiedFilter === 'verified' ? b.is_verified : !b.is_verified)
      return matchesSearch && matchesVerified
    })
  }, [businesses, searchTerm, verifiedFilter])

  const paginated = useMemo(() => filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filtered, currentPage])
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3"><Store className="text-primary" /> İşletme Yönetimi</h1>
        <p className="text-gray-600">Esnaf ve işletme kayıtlarını yönetin, doğrulayın</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Toplam İşletme</p>
          <p className="text-3xl font-bold mt-2 text-primary">{businesses.length}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Doğrulanmış</p>
          <p className="text-3xl font-bold mt-2 text-green-600">{businesses.filter(b => b.is_verified).length}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Toplam Yorum</p>
          <p className="text-3xl font-bold mt-2 text-blue-600">{businesses.reduce((s, b) => s + b.review_count, 0)}</p>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-lg border border-border mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="İşletme adı, sahip veya açıklama ara..." value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg" />
        </div>
        <select value={verifiedFilter} onChange={(e) => { setVerifiedFilter(e.target.value as any); setCurrentPage(1) }}
          className="px-4 py-2 border border-border rounded-lg">
          <option value="all">Tüm İşletmeler</option>
          <option value="verified">Doğrulanmış</option>
          <option value="unverified">Doğrulanmamış</option>
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
                  <th className="px-6 py-3 text-left text-sm font-semibold">İşletme</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Sahip</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Kategori</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Adres</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Puan</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Doğrulama</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((b) => (
                  <tr key={b.id} className="border-b border-border hover:bg-background">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{b.name}</p>
                      {b.phone && <p className="text-xs text-gray-500">{b.phone}</p>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{b.owner_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{b.category_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{b.address || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-sm">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        {b.rating_avg.toFixed(1)} <span className="text-xs text-gray-500">({b.review_count})</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {b.is_verified
                        ? <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full"><CheckCircle size={12} /> Doğrulandı</span>
                        : <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full"><XCircle size={12} /> Bekliyor</span>}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => verifyMutation.mutate({ id: b.id, verified: !b.is_verified })}
                        disabled={verifyMutation.isPending}
                        className={`text-sm px-3 py-1 rounded-lg font-medium disabled:opacity-50 ${b.is_verified ? 'text-red-600 hover:bg-red-50' : 'text-primary hover:bg-primary hover:text-white'}`}>
                        {b.is_verified ? 'Doğrulamayı Kaldır' : 'Doğrula'}
                      </button>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (<tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">İşletme bulunamadı.</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <span className="text-sm text-gray-600">Sayfa {currentPage} / {totalPages} ({filtered.length} işletme)</span>
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
