'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Search, ChevronLeft, ChevronRight, Megaphone, Pause, Play, BarChart3 } from 'lucide-react';

// AUDIT_REPORT.md K3 — gerçek ad_campaigns tablosuna bağlı

type CampaignRow = {
  id: string
  name: string
  status: string
  budget: number
  spent: number
  start_date: string | null
  end_date: string | null
  created_at: string
  business_name: string
}

async function fetchCampaigns(): Promise<CampaignRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ad_campaigns')
    .select(`id, name, status, budget, spent, start_date, end_date, created_at,
             businesses ( name )`)
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) throw error
  return ((data as any[]) || []).map((c) => ({
    id: c.id, name: c.name, status: c.status || 'pending',
    budget: parseFloat(c.budget) || 0, spent: parseFloat(c.spent) || 0,
    start_date: c.start_date, end_date: c.end_date, created_at: c.created_at,
    business_name: c.businesses?.name || '—',
  }))
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active:    { label: 'Aktif',       color: 'bg-green-100 text-green-800' },
  paused:    { label: 'Duraklatıldı', color: 'bg-yellow-100 text-yellow-800' },
  completed: { label: 'Tamamlandı',   color: 'bg-blue-100 text-blue-800' },
  pending:   { label: 'Beklemede',    color: 'bg-gray-100 text-gray-800' },
  rejected:  { label: 'Reddedildi',   color: 'bg-red-100 text-red-800' },
}

export default function ReklamlarPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const { data: campaigns = [], isLoading, error }: { data?: CampaignRow[]; isLoading: boolean; error: Error | null } = useQuery({
    queryKey: ['admin', 'ad_campaigns'],
    queryFn: fetchCampaigns,
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const supabase = createClient()
      const { error } = await supabase.from('ad_campaigns').update({ status }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'ad_campaigns'] }),
  })

  const filtered = useMemo(() => {
    return campaigns.filter((c) => {
      const q = searchTerm.toLowerCase()
      const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.business_name.toLowerCase().includes(q)
      const matchesStatus = !statusFilter || c.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [campaigns, searchTerm, statusFilter])

  const paginated = useMemo(() => filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filtered, currentPage])
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))

  const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0)
  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0)
  const activeCount = campaigns.filter(c => c.status === 'active').length

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3"><Megaphone className="text-primary" /> Reklam Yönetimi</h1>
        <p className="text-gray-600">İşletme reklam kampanyalarını yönetin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Toplam Kampanya</p>
          <p className="text-3xl font-bold mt-2 text-primary">{campaigns.length}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Aktif</p>
          <p className="text-3xl font-bold mt-2 text-green-600">{activeCount}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Toplam Bütçe</p>
          <p className="text-3xl font-bold mt-2 text-blue-600">{totalBudget.toLocaleString('tr-TR')} ₺</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Toplam Harcama</p>
          <p className="text-3xl font-bold mt-2 text-yellow-600">{totalSpent.toLocaleString('tr-TR')} ₺</p>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-lg border border-border mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Kampanya adı veya işletme ara..." value={searchTerm}
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
                  <th className="px-6 py-3 text-left text-sm font-semibold">Kampanya</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">İşletme</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Bütçe / Harcama</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Durum</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tarih</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((c) => {
                  const sc = STATUS_CONFIG[c.status] || { label: c.status, color: 'bg-gray-100 text-gray-800' }
                  const progress = c.budget > 0 ? Math.min(100, (c.spent / c.budget) * 100) : 0
                  return (
                    <tr key={c.id} className="border-b border-border hover:bg-background">
                      <td className="px-6 py-4 font-semibold text-gray-900">{c.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{c.business_name}</td>
                      <td className="px-6 py-4 text-sm">
                        <p className="font-mono">{c.spent.toLocaleString('tr-TR')} / {c.budget.toLocaleString('tr-TR')} ₺</p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded-full ${sc.color}`}>{sc.label}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {c.start_date ? new Date(c.start_date).toLocaleDateString('tr-TR') : '—'}
                        {c.end_date ? ` - ${new Date(c.end_date).toLocaleDateString('tr-TR')}` : ''}
                      </td>
                      <td className="px-6 py-4">
                        {c.status === 'active' ? (
                          <button onClick={() => updateMutation.mutate({ id: c.id, status: 'paused' })}
                            disabled={updateMutation.isPending}
                            className="text-yellow-600 hover:bg-yellow-50 p-1 rounded disabled:opacity-50" title="Duraklat">
                            <Pause size={16} />
                          </button>
                        ) : c.status === 'paused' ? (
                          <button onClick={() => updateMutation.mutate({ id: c.id, status: 'active' })}
                            disabled={updateMutation.isPending}
                            className="text-green-600 hover:bg-green-50 p-1 rounded disabled:opacity-50" title="Devam ettir">
                            <Play size={16} />
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  )
                })}
                {paginated.length === 0 && (<tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">Kampanya bulunamadı.</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <span className="text-sm text-gray-600">Sayfa {currentPage} / {totalPages} ({filtered.length} kampanya)</span>
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
