'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import {
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// =============================================================================
// AUDIT_REPORT.md K3 — Dogrulama paneli artık MOCK değil; address_verifications
// tablosuna bağlı. Yeni eDevlet manuel-review akışındaki pending kayıtları yönetir.
// =============================================================================

type VerificationStatus = 'pending' | 'verified' | 'rejected'

interface VerificationEntry {
  id: string
  user_id: string
  status: VerificationStatus
  created_at: string
  barcode_value: string | null
  address_text: string | null
  rejection_reason: string | null
  user_name: string
  user_email: string
}

const STATUS_CONFIG: Record<VerificationStatus, { label: string; color: string; icon: string }> = {
  pending:  { label: 'Onay Bekleniyor', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  verified: { label: 'Doğrulanmış',     color: 'bg-green-100 text-green-800',   icon: '✓' },
  rejected: { label: 'Reddedildi',      color: 'bg-red-100 text-red-800',       icon: '✕' },
};

async function fetchVerifications(): Promise<VerificationEntry[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('address_verifications')
    .select(`
      id, user_id, verification_status, created_at, barcode_value,
      address_text, rejection_reason,
      profiles ( full_name, email )
    `)
    .order('created_at', { ascending: false })

  if (error) throw error

  return ((data as any[]) || []).map((r) => ({
    id: r.id,
    user_id: r.user_id,
    status: (r.verification_status || 'pending') as VerificationStatus,
    created_at: r.created_at,
    barcode_value: r.barcode_value,
    address_text: r.address_text,
    rejection_reason: r.rejection_reason,
    user_name: r.profiles?.full_name || '—',
    user_email: r.profiles?.email || '—',
  }))
}

export default function DogrulamaPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedEntry, setSelectedEntry] = useState<VerificationEntry | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [actionMode, setActionMode] = useState<'approve' | 'reject' | null>(null)

  const itemsPerPage = 10

  const { data: verifications = [], isLoading, error } = useQuery({
    queryKey: ['admin', 'address_verifications'],
    queryFn: fetchVerifications,
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, reason }: { id: string; status: VerificationStatus; reason?: string }) => {
      const supabase = createClient()
      const update: any = {
        verification_status: status,
        updated_at: new Date().toISOString(),
      }
      if (status === 'verified') update.barcode_verified_at = new Date().toISOString()
      if (status === 'rejected') update.rejection_reason = reason || null
      const { error } = await supabase.from('address_verifications').update(update).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'address_verifications'] })
      setSelectedEntry(null)
      setActionMode(null)
      setRejectReason('')
    },
  })

  const filteredEntries = useMemo(() => {
    return verifications.filter((entry) => {
      const q = searchTerm.toLowerCase()
      const matchesSearch =
        !q ||
        entry.user_name.toLowerCase().includes(q) ||
        entry.user_email.toLowerCase().includes(q) ||
        (entry.barcode_value || '').toLowerCase().includes(q)
      const matchesStatus = !statusFilter || entry.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [verifications, searchTerm, statusFilter])

  const paginatedEntries = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage
    return filteredEntries.slice(startIdx, startIdx + itemsPerPage)
  }, [filteredEntries, currentPage])

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / itemsPerPage))

  const totalVerified = verifications.filter((v) => v.status === 'verified').length
  const totalPending = verifications.filter((v) => v.status === 'pending').length
  const totalRejected = verifications.filter((v) => v.status === 'rejected').length
  const rejectionRate = verifications.length === 0
    ? '0.0'
    : ((totalRejected / verifications.length) * 100).toFixed(1)

  const stats = [
    { title: 'Toplam Doğrulanmış', value: totalVerified,  icon: '✓',  color: '#00833e' },
    { title: 'Onay Bekleniyor',     value: totalPending,   icon: '⏳', color: '#FF9800' },
    { title: 'Reddedildi',          value: totalRejected,  icon: '✕',  color: '#F44336' },
    { title: 'Red Oranı',           value: `${rejectionRate}%`, icon: '📊', color: '#2196F3' },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Adres Doğrulama Yönetimi</h1>
        <p className="text-gray-600">
          eDevlet adres doğrulamalarını yönetin ve onaylayın
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-surface p-6 rounded-lg border border-border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold mt-2" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </div>
              <div className="text-2xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-surface p-6 rounded-lg border border-border mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Kullanıcı, e-posta veya barkod ara..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tüm Durumlar</option>
            {Object.entries(STATUS_CONFIG).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading / Error */}
      {isLoading && (
        <div className="bg-surface p-8 rounded-lg border border-border text-center text-gray-600">
          Yükleniyor…
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-4">
          Doğrulama kayıtları yüklenemedi: {(error as Error).message}
        </div>
      )}

      {/* Verifications Table */}
      {!isLoading && !error && (
        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Kullanıcı</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Barkod</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Gönderilen</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Durum</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Adres</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEntries.map((entry) => {
                  const statusConfig = STATUS_CONFIG[entry.status]
                  return (
                    <tr key={entry.id} className="border-b border-border hover:bg-background">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{entry.user_name}</p>
                          <p className="text-xs text-gray-500 mt-1">{entry.user_email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-gray-900">{entry.barcode_value || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{new Date(entry.created_at).toLocaleString('tr-TR')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          {statusConfig.icon} {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate">
                        <span className="text-sm text-gray-600">{entry.address_text || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => { setSelectedEntry(entry); setActionMode(null) }}
                          className="text-primary hover:text-primary-hover font-medium text-sm"
                        >
                          Detay
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {paginatedEntries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Filtre/aramayla eşleşen doğrulama yok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <span className="text-sm text-gray-600">
              {filteredEntries.length === 0
                ? 'Sonuç bulunamadı'
                : `Sayfa ${currentPage} / ${totalPages} (${filteredEntries.length} doğrulama)`}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 hover:bg-background rounded-lg disabled:opacity-50 transition"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 hover:bg-background rounded-lg disabled:opacity-50 transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900">Doğrulama Detayı</h2>
              <button
                onClick={() => { setSelectedEntry(null); setActionMode(null); setRejectReason('') }}
                className="text-gray-500 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Kullanıcı</p>
                  <p className="text-gray-900 mt-1">{selectedEntry.user_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Barkod</p>
                  <p className="text-gray-900 mt-1 font-mono">{selectedEntry.barcode_value || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">E-posta</p>
                  <p className="text-gray-900 mt-1 text-sm">{selectedEntry.user_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Durum</p>
                  <p className="text-gray-900 mt-1 text-sm">{STATUS_CONFIG[selectedEntry.status].label}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 font-semibold">Adres (kullanıcı beyanı)</p>
                  <p className="text-gray-900 mt-1">{selectedEntry.address_text || '—'}</p>
                </div>
                {selectedEntry.rejection_reason && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 font-semibold">Red Nedeni</p>
                    <p className="text-gray-900 mt-1">{selectedEntry.rejection_reason}</p>
                  </div>
                )}
              </div>

              {actionMode === 'reject' && (
                <div className="mt-4 p-4 border border-border rounded-lg bg-background">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Red Nedeni
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Red nedenini açıklayın..."
                    className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                </div>
              )}

              {updateMutation.isError && (
                <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-3 rounded-lg">
                  Güncelleme başarısız: {(updateMutation.error as Error)?.message}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-border flex gap-3">
              <button
                onClick={() => { setSelectedEntry(null); setActionMode(null); setRejectReason('') }}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-gray-900 font-medium hover:bg-background"
              >
                Kapat
              </button>

              {selectedEntry.status === 'pending' && actionMode === null && (
                <>
                  <button
                    onClick={() =>
                      updateMutation.mutate({ id: selectedEntry.id, status: 'verified' })
                    }
                    disabled={updateMutation.isPending}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover disabled:opacity-50"
                  >
                    {updateMutation.isPending ? 'Onaylanıyor…' : 'Onayla'}
                  </button>
                  <button
                    onClick={() => setActionMode('reject')}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                  >
                    Reddet
                  </button>
                </>
              )}

              {actionMode === 'reject' && (
                <button
                  onClick={() =>
                    updateMutation.mutate({
                      id: selectedEntry.id,
                      status: 'rejected',
                      reason: rejectReason.trim() || 'Reddedildi',
                    })
                  }
                  disabled={updateMutation.isPending || !rejectReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50"
                >
                  {updateMutation.isPending ? 'Reddediliyor…' : 'Reddet'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
