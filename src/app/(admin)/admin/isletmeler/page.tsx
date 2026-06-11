'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Search, ChevronLeft, ChevronRight, Store, CheckCircle, XCircle, Star, Clock, FileCheck } from 'lucide-react';

// İşletme doğrulama yönetimi (2026-06-11): bekleyen başvurular (business_verifications)
// burada onaylanır/reddedilir. Onay → review_business_verification RPC'si işletmeyi
// 'verified' yapar VE 3 aylık ücretsiz denemeyi onay anında başlatır (sunucuda).
// Doğrulanmamış işletme halka görünmez (businesses_select RLS politikası).

type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'

type PendingVerification = {
  id: string
  document_type: string
  vkn: string | null
  document_barcode: string | null
}

type BusinessRow = {
  id: string
  name: string
  slug: string
  description: string | null
  address: string | null
  phone: string | null
  verification_status: VerificationStatus
  vkn: string | null
  rating_avg: number
  review_count: number
  created_at: string
  owner_name: string
  category_name: string
  pending: PendingVerification | null
}

const DOC_LABELS: Record<string, string> = {
  vergi_levhasi: 'Vergi Levhası',
  faaliyet_belgesi: 'Faaliyet Belgesi',
  esnaf_sicil: 'Esnaf Sicil',
  diger: 'Diğer',
}

async function fetchBusinesses(): Promise<BusinessRow[]> {
  const supabase = createClient() as any
  const [{ data, error }, { data: pendings, error: pendErr }] = await Promise.all([
    supabase
      .from('businesses')
      .select(`id, name, slug, description, address, phone, verification_status, vkn, rating_avg, review_count, created_at,
               profiles!businesses_owner_id_fkey ( full_name ),
               business_categories ( name )`)
      .order('created_at', { ascending: false })
      .limit(500),
    supabase
      .from('business_verifications')
      .select('id, business_id, document_type, vkn, document_barcode')
      .eq('status', 'pending'),
  ])
  if (error) throw error
  if (pendErr) throw pendErr
  const pendingByBiz = new Map<string, PendingVerification>(
    ((pendings as any[]) || []).map((p) => [p.business_id, { id: p.id, document_type: p.document_type, vkn: p.vkn, document_barcode: p.document_barcode }])
  )
  return ((data as any[]) || []).map((b) => ({
    id: b.id, name: b.name, slug: b.slug, description: b.description,
    address: b.address, phone: b.phone,
    verification_status: (b.verification_status || 'unverified') as VerificationStatus,
    vkn: b.vkn,
    rating_avg: parseFloat(b.rating_avg) || 0, review_count: b.review_count || 0,
    created_at: b.created_at,
    owner_name: b.profiles?.full_name || '—',
    category_name: b.business_categories?.name || '—',
    pending: pendingByBiz.get(b.id) || null,
  }))
}

function StatusBadge({ status }: { status: VerificationStatus }) {
  if (status === 'verified')
    return <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full"><CheckCircle size={12} /> Doğrulandı</span>
  if (status === 'pending')
    return <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full"><Clock size={12} /> Onay Bekliyor</span>
  if (status === 'rejected')
    return <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full"><XCircle size={12} /> Reddedildi</span>
  return <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full"><XCircle size={12} /> Başvuru Yok</span>
}

export default function IsletmelerPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'pending' | 'unverified' | 'rejected'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const { data: businesses = [], isLoading, error }: { data?: BusinessRow[]; isLoading: boolean; error: Error | null } = useQuery({
    queryKey: ['admin', 'businesses'],
    queryFn: fetchBusinesses,
  })

  // Karar: bekleyen başvurusu olan işletmede RPC (başvuruyu da kapatır + onayda
  // trial'ı sunucuda başlatır); başvurusuz eski kayıtlarda doğrudan durum yazılır
  // (admin UPDATE politikası + guard trigger admin'e izin verir).
  const decideMutation = useMutation({
    mutationFn: async ({ biz, approve, reason }: { biz: BusinessRow; approve: boolean; reason?: string }) => {
      const supabase = createClient() as any
      if (biz.pending) {
        const { error } = await supabase.rpc('review_business_verification', {
          p_verification_id: biz.pending.id,
          p_approve: approve,
          p_rejected_reason: reason ?? null,
        })
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('businesses')
          .update({
            verification_status: approve ? 'verified' : 'unverified',
            verified_at: approve ? new Date().toISOString() : null,
          })
          .eq('id', biz.id)
        if (error) throw error
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'businesses'] }),
  })

  const filtered = useMemo(() => {
    return businesses.filter((b) => {
      const q = searchTerm.toLowerCase()
      const matchesSearch = !q ||
        b.name.toLowerCase().includes(q) ||
        (b.description || '').toLowerCase().includes(q) ||
        b.owner_name.toLowerCase().includes(q) ||
        (b.vkn || '').includes(q)
      const matchesVerified = verifiedFilter === 'all' || b.verification_status === verifiedFilter
      return matchesSearch && matchesVerified
    })
  }, [businesses, searchTerm, verifiedFilter])

  const paginated = useMemo(() => filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filtered, currentPage])
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const pendingCount = businesses.filter(b => b.verification_status === 'pending').length

  const handleReject = (biz: BusinessRow) => {
    const reason = window.prompt('Ret sebebi (işletme sahibine gösterilir):')
    if (reason === null) return // vazgeçti
    decideMutation.mutate({ biz, approve: false, reason: reason.trim() || 'Belirtilmedi' })
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3"><Store className="text-primary" /> İşletme Yönetimi</h1>
        <p className="text-gray-600">Doğrulama başvurularını inceleyin — doğrulanmamış işletme komşulara görünmez</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Toplam İşletme</p>
          <p className="text-3xl font-bold mt-2 text-primary">{businesses.length}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Onay Bekleyen</p>
          <p className="text-3xl font-bold mt-2 text-amber-600">{pendingCount}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Doğrulanmış</p>
          <p className="text-3xl font-bold mt-2 text-green-600">{businesses.filter(b => b.verification_status === 'verified').length}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Toplam Yorum</p>
          <p className="text-3xl font-bold mt-2 text-blue-600">{businesses.reduce((s, b) => s + b.review_count, 0)}</p>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-lg border border-border mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="İşletme adı, sahip, VKN veya açıklama ara..." value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg" />
        </div>
        <select value={verifiedFilter} onChange={(e) => { setVerifiedFilter(e.target.value as any); setCurrentPage(1) }}
          className="px-4 py-2 border border-border rounded-lg">
          <option value="all">Tüm İşletmeler</option>
          <option value="pending">Onay Bekleyen</option>
          <option value="verified">Doğrulanmış</option>
          <option value="unverified">Başvurusuz</option>
          <option value="rejected">Reddedilmiş</option>
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
                  <th className="px-6 py-3 text-left text-sm font-semibold">Belge / VKN</th>
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
                      {b.address && <p className="text-xs text-gray-500 truncate max-w-xs">{b.address}</p>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{b.owner_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{b.category_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {b.pending ? (
                        <div className="text-xs">
                          <p className="inline-flex items-center gap-1 font-medium text-gray-900"><FileCheck size={12} /> {DOC_LABELS[b.pending.document_type] || b.pending.document_type}</p>
                          <p>VKN: {b.pending.vkn || '—'}</p>
                          {b.pending.document_barcode && <p>Barkod: {b.pending.document_barcode}</p>}
                        </div>
                      ) : (
                        <span className="text-xs">{b.vkn ? `VKN: ${b.vkn}` : '—'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-sm">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        {b.rating_avg.toFixed(1)} <span className="text-xs text-gray-500">({b.review_count})</span>
                      </span>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={b.verification_status} /></td>
                    <td className="px-6 py-4">
                      {b.verification_status === 'verified' ? (
                        <button onClick={() => decideMutation.mutate({ biz: b, approve: false, reason: 'Doğrulama yönetici tarafından kaldırıldı' })}
                          disabled={decideMutation.isPending}
                          className="text-sm px-3 py-1 rounded-lg font-medium disabled:opacity-50 text-red-600 hover:bg-red-50">
                          Doğrulamayı Kaldır
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => decideMutation.mutate({ biz: b, approve: true })}
                            disabled={decideMutation.isPending}
                            className="text-sm px-3 py-1 rounded-lg font-medium disabled:opacity-50 text-primary hover:bg-primary hover:text-white">
                            Onayla
                          </button>
                          {b.pending && (
                            <button onClick={() => handleReject(b)}
                              disabled={decideMutation.isPending}
                              className="text-sm px-3 py-1 rounded-lg font-medium disabled:opacity-50 text-red-600 hover:bg-red-50">
                              Reddet
                            </button>
                          )}
                        </div>
                      )}
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
