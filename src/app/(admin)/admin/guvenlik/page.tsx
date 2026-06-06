'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Search, ChevronLeft, ChevronRight, Lock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

// AUDIT_REPORT.md K3 — gerçek audit_log tablosuna bağlı

type AuditRow = {
  id: string
  action: string
  result: string
  ip_address: string | null
  user_agent: string | null
  created_at: string
  user_name: string
  user_email: string
}

async function fetchAuditLog(): Promise<AuditRow[]> {
  const supabase = createClient() as any
  const { data, error } = await supabase
    .from('audit_log')
    .select(`id, action, result, ip_address, user_agent, created_at,
             profiles ( full_name, email )`)
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) throw error
  return ((data as any[]) || []).map((r) => ({
    id: r.id, action: r.action, result: r.result || 'success',
    ip_address: r.ip_address, user_agent: r.user_agent, created_at: r.created_at,
    user_name: r.profiles?.full_name || '—',
    user_email: r.profiles?.email || '—',
  }))
}

const RESULT_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  success: { label: 'Başarılı',  color: 'bg-green-100 text-green-800',  icon: CheckCircle },
  failed:  { label: 'Başarısız', color: 'bg-red-100 text-red-800',      icon: XCircle },
  blocked: { label: 'Engellendi',color: 'bg-yellow-100 text-yellow-800',icon: AlertTriangle },
}

export default function GuvenlikPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [resultFilter, setResultFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const { data: logs = [], isLoading, error }: { data?: AuditRow[]; isLoading: boolean; error: Error | null } = useQuery({
    queryKey: ['admin', 'audit_log'],
    queryFn: fetchAuditLog,
  })

  const actions = useMemo(() => Array.from(new Set(logs.map((l) => l.action))).sort(), [logs])

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      const q = searchTerm.toLowerCase()
      const matchesSearch = !q ||
        l.user_name.toLowerCase().includes(q) ||
        l.user_email.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        (l.ip_address || '').includes(q)
      const matchesAction = !actionFilter || l.action === actionFilter
      const matchesResult = !resultFilter || l.result === resultFilter
      return matchesSearch && matchesAction && matchesResult
    })
  }, [logs, searchTerm, actionFilter, resultFilter])

  const paginated = useMemo(() => filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filtered, currentPage])
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))

  const counts = {
    success: logs.filter(l => l.result === 'success').length,
    failed: logs.filter(l => l.result === 'failed').length,
    blocked: logs.filter(l => l.result === 'blocked').length,
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3"><Lock className="text-primary" /> Güvenlik Logları</h1>
        <p className="text-gray-600">Sistem etkinlikleri ve güvenlik olaylarını izleyin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Toplam Olay</p>
          <p className="text-3xl font-bold mt-2 text-primary">{logs.length}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Başarılı</p>
          <p className="text-3xl font-bold mt-2 text-green-600">{counts.success}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Başarısız</p>
          <p className="text-3xl font-bold mt-2 text-red-600">{counts.failed}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Engellendi</p>
          <p className="text-3xl font-bold mt-2 text-yellow-600">{counts.blocked}</p>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-lg border border-border mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Kullanıcı, eylem veya IP ara..." value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg" />
        </div>
        <select value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setCurrentPage(1) }}
          className="px-4 py-2 border border-border rounded-lg">
          <option value="">Tüm Eylemler</option>
          {actions.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={resultFilter} onChange={(e) => { setResultFilter(e.target.value); setCurrentPage(1) }}
          className="px-4 py-2 border border-border rounded-lg">
          <option value="">Tüm Sonuçlar</option>
          {Object.entries(RESULT_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {isLoading && <div className="bg-surface p-8 rounded-lg text-center text-gray-600">Yükleniyor…</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">Hata: {(error as Error).message}</div>}

      {!isLoading && !error && logs.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg text-blue-900">
          <p className="font-semibold mb-1">Henüz audit kaydı yok</p>
          <p className="text-sm">Kullanıcı oturum açma/çıkma, profil güncelleme ve admin işlemleri burada listelenecek. Audit yazımı için sunucu tarafında <code className="bg-blue-100 px-1 rounded">audit_log</code> insert&apos;i tetikleyin (service role ile).</p>
        </div>
      )}

      {!isLoading && !error && logs.length > 0 && (
        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Kullanıcı</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Eylem</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Sonuç</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">IP</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((l) => {
                  const rc = RESULT_CONFIG[l.result] || RESULT_CONFIG.success
                  const Icon = rc.icon
                  return (
                    <tr key={l.id} className="border-b border-border hover:bg-background">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{l.user_name}</p>
                        <p className="text-xs text-gray-500">{l.user_email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-700">{l.action}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${rc.color}`}>
                          <Icon size={12} /> {rc.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">{l.ip_address || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(l.created_at).toLocaleString('tr-TR')}</td>
                    </tr>
                  )
                })}
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
