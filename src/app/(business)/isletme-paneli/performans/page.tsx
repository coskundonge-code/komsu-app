'use client'

import Link from 'next/link'
import { ArrowLeft, TrendingUp, Users, QrCode, Percent, Calendar, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const MONTHLY_STATS = { totalScans: 147, totalDiscount: 2450, totalRevenue: 24500, uniqueCustomers: 89, repeatRate: 62, avgTicket: 167 }

const WEEKLY_DATA = [
  { day: 'Pzt', scans: 18, revenue: 3200 },
  { day: 'Sal', scans: 22, revenue: 3800 },
  { day: 'Çar', scans: 15, revenue: 2600 },
  { day: 'Per', scans: 28, revenue: 4500 },
  { day: 'Cum', scans: 35, revenue: 5200 },
  { day: 'Cmt', scans: 42, revenue: 6800 },
  { day: 'Paz', scans: 38, revenue: 5900 },
]

const TOP_CUSTOMERS = [
  { name: 'Ahmet K.', visits: 12, totalSpent: '₺2,450', lastVisit: '2 gün önce' },
  { name: 'Fatma D.', visits: 9, totalSpent: '₺1,890', lastVisit: '1 gün önce' },
  { name: 'Mehmet Y.', visits: 8, totalSpent: '₺1,560', lastVisit: '3 gün önce' },
  { name: 'Ayşe T.', visits: 7, totalSpent: '₺1,340', lastVisit: 'Bugün' },
  { name: 'Ali B.', visits: 6, totalSpent: '₺1,120', lastVisit: '5 gün önce' },
]

const maxScans = Math.max(...WEEKLY_DATA.map(d => d.scans))

export default function PerformansPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface border-b border-border px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/isletme-paneli" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></Link>
          <div><h1 className="text-xl font-bold text-text-primary">Performans Takibi</h1><p className="text-sm text-text-muted">QR kod taramaları ve indirim performansı</p></div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface rounded-xl border border-border p-4"><div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center"><QrCode className="w-4 h-4 text-primary" /></div><span className="text-xs text-text-muted">Toplam Tarama</span></div><p className="text-2xl font-bold">{MONTHLY_STATS.totalScans}</p><p className="text-xs text-green-600 flex items-center gap-1 mt-1"><ArrowUpRight className="w-3 h-3" /> +23% geçen aya göre</p></div>
          <div className="bg-surface rounded-xl border border-border p-4"><div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center"><Users className="w-4 h-4 text-blue-600" /></div><span className="text-xs text-text-muted">Tekil Müşteri</span></div><p className="text-2xl font-bold">{MONTHLY_STATS.uniqueCustomers}</p><p className="text-xs text-green-600 flex items-center gap-1 mt-1"><ArrowUpRight className="w-3 h-3" /> +15% geçen aya göre</p></div>
          <div className="bg-surface rounded-xl border border-border p-4"><div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center"><TrendingUp className="w-4 h-4 text-green-600" /></div><span className="text-xs text-text-muted">Toplam Ciro</span></div><p className="text-2xl font-bold">₺{MONTHLY_STATS.totalRevenue.toLocaleString('tr-TR')}</p><p className="text-xs text-green-600 flex items-center gap-1 mt-1"><ArrowUpRight className="w-3 h-3" /> +18% geçen aya göre</p></div>
          <div className="bg-surface rounded-xl border border-border p-4"><div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center"><Percent className="w-4 h-4 text-orange-600" /></div><span className="text-xs text-text-muted">Verilen İndirim</span></div><p className="text-2xl font-bold">₺{MONTHLY_STATS.totalDiscount.toLocaleString('tr-TR')}</p><p className="text-xs text-red-500 flex items-center gap-1 mt-1"><ArrowDownRight className="w-3 h-3" /> Toplam tasarruf</p></div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-4"><h3 className="font-semibold flex items-center gap-2"><BarChart3 className="w-4 h-4 text-text-muted" />Önemli Metrikler</h3></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center"><p className="text-2xl font-bold text-primary">%{MONTHLY_STATS.repeatRate}</p><p className="text-xs text-text-muted mt-1">Tekrar Müşteri Oranı</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-blue-600">₺{MONTHLY_STATS.avgTicket}</p><p className="text-xs text-text-muted mt-1">Ort. Sepet Tutarı</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-green-600">%10</p><p className="text-xs text-text-muted mt-1">İndirim Dönüşüm</p></div>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-text-muted" />Haftalık QR Tarama</h3>
          <div className="flex items-end justify-between gap-2 h-40">
            {WEEKLY_DATA.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium">{d.scans}</span>
                <div className="w-full bg-primary/80 rounded-t-md transition-all" style={{ height: `${(d.scans / maxScans) * 100}%` }} />
                <span className="text-xs text-text-muted">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border">
          <div className="px-4 py-3 border-b border-border"><h3 className="font-semibold flex items-center gap-2"><Users className="w-4 h-4 text-text-muted" />En Sadık Müşteriler</h3></div>
          <div className="divide-y divide-border">
            {TOP_CUSTOMERS.map((customer, i) => (
              <div key={customer.name} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">{i + 1}</div>
                  <div><p className="text-sm font-medium">{customer.name}</p><p className="text-xs text-text-muted">{customer.visits} ziyaret • {customer.lastVisit}</p></div>
                </div>
                <span className="text-sm font-semibold">{customer.totalSpent}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
