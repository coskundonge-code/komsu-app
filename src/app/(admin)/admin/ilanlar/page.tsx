'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Search, ChevronLeft, ChevronRight, ShoppingBag, Eye, Trash2 } from 'lucide-react';

// AUDIT_REPORT.md K3 — gerçek listings tablosuna bağlı

type ListingRow = {
  id: string
  title: string
  price: number | null
  currency: string | null
  status: string
  view_count: number
  created_at: string
  seller_name: string
  neighborhood_name: string
  category_name: string
  listing_type: string | null
}

async function fetchListings(): Promise<ListingRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('listings')
    .select(`id, title, price, currency, status, view_count, created_at, listing_type,
             profiles!listings_seller_id_fkey ( full_name ),
             neighborhoods ( name ),
             listing_categories ( name )`)
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) throw error
  return ((data as any[]) || []).map((l) => ({
    id: l.id, title: l.title, price: l.price, currency: l.currency || 'TRY',
    status: l.status || 'unknown', view_count: l.view_count || 0,
    created_at: l.created_at, listing_type: l.listing_type,
    seller_name: l.profiles?.full_name || '—',
    neighborhood_name: l.neighborhoods?.name || '—',
    category_name: l.listing_categories?.name || '—',
  }))
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active:    { label: 'Aktif',     color: 'bg-green-100 text-green-800' },
  sold:      { label: 'Satıldı',   color: 'bg-blue-100 text-blue-800' },
  expired:   { label: 'Süresi Doldu', color: 'bg-gray-100 text-gray-800' },
  removed:   { label: 'Kaldırıldı', color: 'bg-red-100 text-red-800' },
  pending:   { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' },
}

export default function IlanlarPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const { data: listings = [], isLoading, error }: { data?: ListingRow[]; isLoading: boolean; error: Error | null } = useQuery({
    queryKey: ['admin', 'listings'],
    queryFn: fetchListings,
  })

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await (supabase as any).from('listings').update({ status: 'removed' }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'listings'] }),
  })

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const q = searchTerm.toLowerCase()
      const matchesSearch = !q || l.title.toLowerCase().includes(q) || l.seller_name.toLowerCase().includes(q)
      const matchesStatus = !statusFilter || l.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [listings, searchTerm, statusFilter])

  const paginated = useMemo(() => filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filtered, currentPage])
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))

  const totalActive = listings.filter(l => l.status === 'active').length
  const totalViews = listings.reduce((s, l) => s + l.view_count, 0)

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3"><ShoppingBag className="text-primary" /> İlan Yönetimi</h1>
        <p className="text-gray-600">Pazar yeri ilanlarını yönetin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Toplam İlan</p>
          <p className="text-3xl font-bold mt-2 text-primary">{listings.length}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Aktif</p>
          <p className="text-3xl font-bold mt-2 text-green-600">{totalActive}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Toplam Görüntülenme</p>
          <p className="text-3xl font-bold mt-2 text-blue-600">{totalViews.toLocaleString('tr-TR')}</p>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-lg border border-border mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="İlan başlığı veya satıcı ara..." value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
          className="px-4 py-2 border border-border rounded-lg">
          <option value="">Tüm Durumlar</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
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
                  <th className="px-6 py-3 text-left text-sm font-semibold">İlan</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Satıcı</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Kategori</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Fiyat</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Durum</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Görüntülenme</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((l) => {
                  const sc = STATUS_CONFIG[l.status] || { label: l.status, color: 'bg-gray-100 text-gray-800' }
                  return (
                    <tr key={l.id} className="border-b border-border hover:bg-background">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 truncate max-w-xs">{l.title}</p>
                        <p className="text-xs text-gray-500">{l.neighborhood_name}{l.listing_type ? ` · ${l.listing_type}` : ''}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{l.seller_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{l.category_name}</td>
                      <td className="px-6 py-4 text-sm font-mono">
                        {l.price !== null ? `${l.price.toLocaleString('tr-TR')} ${l.currency}` : '—'}
                      </td>
                      <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded-full ${sc.color}`}>{sc.label}</span></td>
                      <td className="px-6 py-4 text-sm font-mono inline-flex items-center gap-1"><Eye size={14} /> {l.view_count}</td>
                      <td className="px-6 py-4">
                        {l.status !== 'removed' && (
                          <button onClick={() => { if (confirm(`"${l.title}" ilanını kaldırmak istiyor musunuz?`)) removeMutation.mutate(l.id) }}
                            disabled={removeMutation.isPending}
                            className="text-red-600 hover:text-red-800 p-1 rounded disabled:opacity-50" title="Kaldır">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {paginated.length === 0 && (<tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">İlan bulunamadı.</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <span className="text-sm text-gray-600">Sayfa {currentPage} / {totalPages} ({filtered.length} ilan)</span>
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
