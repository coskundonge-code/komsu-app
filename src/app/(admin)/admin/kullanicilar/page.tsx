'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Search, ChevronLeft, ChevronRight, Users, Shield, ShieldOff, Lock, Unlock, CheckCircle } from 'lucide-react';

// AUDIT_REPORT.md K3 — gerçek profiles tablosuna bağlı

type UserRow = {
  id: string
  email: string
  full_name: string
  phone: string | null
  is_verified: boolean
  is_admin: boolean
  account_locked: boolean
  edevlet_verified_at: string | null
  location_district: string | null
  location_province: string | null
  created_at: string
}

async function fetchUsers(): Promise<UserRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, phone, is_verified, is_admin, account_locked, edevlet_verified_at, location_district, location_province, created_at')
    .order('created_at', { ascending: false })
    .limit(1000)
  if (error) throw error
  return ((data as any[]) || []).map((u) => ({
    id: u.id, email: u.email || '', full_name: u.full_name || '',
    phone: u.phone, is_verified: u.is_verified || false,
    is_admin: u.is_admin || false, account_locked: u.account_locked || false,
    edevlet_verified_at: u.edevlet_verified_at,
    location_district: u.location_district, location_province: u.location_province,
    created_at: u.created_at,
  }))
}

export default function KullanicilarPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'locked' | 'admin'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const { data: users = [], isLoading, error }: { data?: UserRow[]; isLoading: boolean; error: Error | null } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: fetchUsers,
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<UserRow> }) => {
      const supabase = createClient()
      const { error } = await supabase.from('profiles').update(patch).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = searchTerm.toLowerCase()
      const matchesSearch = !q ||
        u.full_name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone || '').toLowerCase().includes(q)
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'verified' && u.is_verified) ||
        (statusFilter === 'locked' && u.account_locked) ||
        (statusFilter === 'admin' && u.is_admin)
      return matchesSearch && matchesStatus
    })
  }, [users, searchTerm, statusFilter])

  const paginated = useMemo(() => filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filtered, currentPage])
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))

  const counts = {
    total: users.length,
    verified: users.filter(u => u.is_verified).length,
    edevletVerified: users.filter(u => u.edevlet_verified_at).length,
    locked: users.filter(u => u.account_locked).length,
    admin: users.filter(u => u.is_admin).length,
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3"><Users className="text-primary" /> Kullanıcı Yönetimi</h1>
        <p className="text-gray-600">Kullanıcı hesaplarını yönetin, doğrulayın, kilitleyin</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-surface p-4 rounded-lg border border-border">
          <p className="text-gray-600 text-xs">Toplam</p>
          <p className="text-2xl font-bold mt-1 text-primary">{counts.total}</p>
        </div>
        <div className="bg-surface p-4 rounded-lg border border-border">
          <p className="text-gray-600 text-xs">Doğrulanmış</p>
          <p className="text-2xl font-bold mt-1 text-green-600">{counts.verified}</p>
        </div>
        <div className="bg-surface p-4 rounded-lg border border-border">
          <p className="text-gray-600 text-xs">eDevlet</p>
          <p className="text-2xl font-bold mt-1 text-blue-600">{counts.edevletVerified}</p>
        </div>
        <div className="bg-surface p-4 rounded-lg border border-border">
          <p className="text-gray-600 text-xs">Kilitli</p>
          <p className="text-2xl font-bold mt-1 text-red-600">{counts.locked}</p>
        </div>
        <div className="bg-surface p-4 rounded-lg border border-border">
          <p className="text-gray-600 text-xs">Admin</p>
          <p className="text-2xl font-bold mt-1 text-yellow-600">{counts.admin}</p>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-lg border border-border mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Ad, e-posta veya telefon ara..." value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(1) }}
          className="px-4 py-2 border border-border rounded-lg">
          <option value="all">Tüm Kullanıcılar</option>
          <option value="verified">Doğrulanmış</option>
          <option value="locked">Kilitli</option>
          <option value="admin">Admin</option>
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
                  <th className="px-6 py-3 text-left text-sm font-semibold">İletişim</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Konum</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Durum</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Kayıt</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((u) => (
                  <tr key={u.id} className="border-b border-border hover:bg-background">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{u.full_name || '—'}</p>
                        {u.is_admin && <Shield size={14} className="text-yellow-600" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <p className="text-gray-700">{u.email}</p>
                      {u.phone && <p className="text-xs text-gray-500">{u.phone}</p>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {u.location_district ? `${u.location_district}${u.location_province ? ', ' + u.location_province : ''}` : '—'}
                    </td>
                    <td className="px-6 py-4 flex flex-wrap gap-1">
                      {u.is_verified && <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full inline-flex items-center gap-1"><CheckCircle size={12} /> Doğrulandı</span>}
                      {u.edevlet_verified_at && <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">eDevlet</span>}
                      {u.account_locked && <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full inline-flex items-center gap-1"><Lock size={12} /> Kilitli</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(u.created_at).toLocaleDateString('tr-TR')}</td>
                    <td className="px-6 py-4 flex gap-1">
                      <button onClick={() => updateMutation.mutate({ id: u.id, patch: { account_locked: !u.account_locked } as any })}
                        disabled={updateMutation.isPending}
                        className={`p-1 rounded disabled:opacity-50 ${u.account_locked ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}
                        title={u.account_locked ? 'Kilidi aç' : 'Hesabı kilitle'}>
                        {u.account_locked ? <Unlock size={16} /> : <Lock size={16} />}
                      </button>
                      <button onClick={() => updateMutation.mutate({ id: u.id, patch: { is_admin: !u.is_admin } as any })}
                        disabled={updateMutation.isPending}
                        className={`p-1 rounded disabled:opacity-50 ${u.is_admin ? 'text-gray-600' : 'text-yellow-600 hover:bg-yellow-50'}`}
                        title={u.is_admin ? 'Admin yetkisini kaldır' : 'Admin yap'}>
                        {u.is_admin ? <ShieldOff size={16} /> : <Shield size={16} />}
                      </button>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (<tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">Kullanıcı bulunamadı.</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <span className="text-sm text-gray-600">Sayfa {currentPage} / {totalPages} ({filtered.length} kullanıcı)</span>
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
