'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { BarChart3, Users, MapPin, MessageSquare, ShoppingBag, Calendar, Store, Heart } from 'lucide-react';

// AUDIT_REPORT.md K3 — gerçek DB istatistiklerine bağlı

type Stats = {
  totalUsers: number
  verifiedUsers: number
  edevletVerifiedUsers: number
  totalNeighborhoods: number
  totalPosts: number
  totalListings: number
  activeListings: number
  totalEvents: number
  totalBusinesses: number
  verifiedBusinesses: number
  totalDonations: number
  totalHelpRequests: number
  totalMessages: number
  newUsers7d: number
  newPosts7d: number
}

async function fetchStats(): Promise<Stats> {
  const supabase = createClient()
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const queries = [
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_verified', true),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).not('edevlet_verified_at', 'is', null),
    supabase.from('neighborhoods').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('listings').select('*', { count: 'exact', head: true }),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('businesses').select('*', { count: 'exact', head: true }),
    supabase.from('businesses').select('*', { count: 'exact', head: true }).eq('is_verified', true),
    supabase.from('donations').select('*', { count: 'exact', head: true }),
    supabase.from('help_requests').select('*', { count: 'exact', head: true }),
    supabase.from('messages').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', since7d),
    supabase.from('posts').select('*', { count: 'exact', head: true }).gte('created_at', since7d),
  ]

  const results = await Promise.all(queries)

  return {
    totalUsers: results[0].count || 0,
    verifiedUsers: results[1].count || 0,
    edevletVerifiedUsers: results[2].count || 0,
    totalNeighborhoods: results[3].count || 0,
    totalPosts: results[4].count || 0,
    totalListings: results[5].count || 0,
    activeListings: results[6].count || 0,
    totalEvents: results[7].count || 0,
    totalBusinesses: results[8].count || 0,
    verifiedBusinesses: results[9].count || 0,
    totalDonations: results[10].count || 0,
    totalHelpRequests: results[11].count || 0,
    totalMessages: results[12].count || 0,
    newUsers7d: results[13].count || 0,
    newPosts7d: results[14].count || 0,
  }
}

export default function RaporlarPage() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin', 'reports-stats'],
    queryFn: fetchStats,
  })

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <BarChart3 className="text-primary" /> Raporlar ve Analiz
        </h1>
        <div className="bg-surface p-8 rounded-lg text-center text-gray-600">Yükleniyor…</div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Raporlar</h1>
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          Hata: {(error as Error).message}
        </div>
      </div>
    )
  }
  if (!stats) return null

  const cards = [
    { label: 'Toplam Kullanıcı', value: stats.totalUsers, icon: Users, color: '#00833e', sub: `Son 7 gün: +${stats.newUsers7d}` },
    { label: 'Doğrulanmış',       value: stats.verifiedUsers, icon: Users, color: '#22c55e', sub: `eDevlet: ${stats.edevletVerifiedUsers}` },
    { label: 'Mahalle',            value: stats.totalNeighborhoods, icon: MapPin, color: '#3b82f6', sub: '' },
    { label: 'Gönderi',            value: stats.totalPosts, icon: MessageSquare, color: '#8b5cf6', sub: `Son 7 gün: +${stats.newPosts7d}` },
    { label: 'İlan',               value: stats.totalListings, icon: ShoppingBag, color: '#f59e0b', sub: `Aktif: ${stats.activeListings}` },
    { label: 'İşletme',            value: stats.totalBusinesses, icon: Store, color: '#ec4899', sub: `Doğrulu: ${stats.verifiedBusinesses}` },
    { label: 'Etkinlik',           value: stats.totalEvents, icon: Calendar, color: '#06b6d4', sub: '' },
    { label: 'Bağış',              value: stats.totalDonations, icon: Heart, color: '#ef4444', sub: `Yardım talebi: ${stats.totalHelpRequests}` },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <BarChart3 className="text-primary" /> Raporlar ve Analiz
        </h1>
        <p className="text-gray-600">Anlık platform istatistikleri (canlı veri)</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((card, idx) => {
          const Icon = card.icon
          return (
            <div key={idx} className="bg-surface p-6 rounded-lg border border-border">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${card.color}20` }}>
                  <Icon size={20} style={{ color: card.color }} />
                </div>
              </div>
              <p className="text-gray-600 text-sm">{card.label}</p>
              <p className="text-3xl font-bold mt-1" style={{ color: card.color }}>{card.value.toLocaleString('tr-TR')}</p>
              {card.sub && <p className="text-xs text-gray-500 mt-1">{card.sub}</p>}
            </div>
          )
        })}
      </div>

      <div className="bg-surface p-6 rounded-lg border border-border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Son 7 Gün Özeti</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Yeni Kullanıcı</p>
              <p className="text-2xl font-bold text-primary mt-1">+{stats.newUsers7d}</p>
            </div>
            <Users className="text-primary opacity-30" size={32} />
          </div>
          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Yeni Gönderi</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">+{stats.newPosts7d}</p>
            </div>
            <MessageSquare className="text-purple-600 opacity-30" size={32} />
          </div>
        </div>
      </div>

      <div className="mt-6 bg-surface p-6 rounded-lg border border-border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">İletişim</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Toplam Mesaj</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.totalMessages.toLocaleString('tr-TR')}</p>
            </div>
            <MessageSquare className="text-blue-600 opacity-30" size={32} />
          </div>
          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Yardım Talepleri</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.totalHelpRequests}</p>
            </div>
            <Heart className="text-red-600 opacity-30" size={32} />
          </div>
        </div>
      </div>
    </div>
  )
}
