'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Search, ChevronLeft, ChevronRight, MapPin, Users } from 'lucide-react';

// AUDIT_REPORT.md K3 — gerçek neighborhoods tablosuna bağlı

type NeighborhoodRow = {
  id: string
  name: string
  slug: string
  city: string
  district: string
  member_count: number
  created_at: string
}

async function fetchNeighborhoods(): Promise<NeighborhoodRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('neighborhoods')
    .select('id, name, slug, city, district, member_count, created_at')
    .order('member_count', { ascending: false })
    .limit(1000)
  if (error) throw error
  return (data as NeighborhoodRow[]) || []
}

export default function MahallelerPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const { data: neighborhoods = [], isLoading, error } = useQuery({
    queryKey: ['admin', 'neighborhoods'],
    queryFn: fetchNeighborhoods,
  })

  const cities = useMemo(() => Array.from(new Set(neighborhoods.map((n) => n.city))).sort(), [neighborhoods])

  const filtered = useMemo(() => {
    return neighborhoods.filter((n) => {
      const q = searchTerm.toLowerCase()
      const matchesSearch = !q ||
        n.name.toLowerCase().includes(q) ||
        n.district.toLowerCase().includes(q) ||
        n.city.toLowerCase().includes(q)
      const matchesCity = !cityFilter || n.city === cityFilter
      return matchesSearch && matchesCity
    })
  }, [neighborhoods, searchTerm, cityFilter])

  const paginated = useMemo(() => filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filtered, currentPage])
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const totalMembers = neighborhoods.reduce((s, n) => s + (n.member_count || 0), 0)

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3"><MapPin className="text-primary" /> Mahalle Yönetimi</h1>
        <p className="text-gray-600">Mahalle kayıtlarını ve üye dağılımını izleyin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Toplam Mahalle</p>
          <p className="text-3xl font-bold mt-2 text-primary">{neighborhoods.length}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Toplam Üye</p>
          <p className="text-3xl font-bold mt-2 text-blue-600">{totalMembers.toLocaleString('tr-TR')}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-gray-600 text-sm">Şehir Sayısı</p>
          <p className="text-3xl font-bold mt-2 text-green-600">{cities.length}</p>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-lg border border-border mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Mahalle, ilçe veya şehir ara..." value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg" />
        </div>
        <select value={cityFilter} onChange={(e) => { setCityFilter(e.target.value); setCurrentPage(1) }}
          className="px-4 py-2 border border-border rounded-lg">
          <option value="">Tüm Şehirler</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
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
                  <th className="px-6 py-3 text-left text-sm font-semibold">Mahalle</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">İlçe</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Şehir</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Üye Sayısı</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Oluşturulma</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((n) => (
                  <tr key={n.id} className="border-b border-border hover:bg-background">
                    <td className="px-6 py-4 font-semibold text-gray-900">{n.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{n.district}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{n.city}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-sm font-mono">
                        <Users size={14} className="text-blue-600" /> {n.member_count || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(n.created_at).toLocaleDateString('tr-TR')}</td>
                  </tr>
                ))}
                {paginated.length === 0 && (<tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Mahalle bulunamadı.</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <span className="text-sm text-gray-600">Sayfa {currentPage} / {totalPages} ({filtered.length} mahalle)</span>
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
