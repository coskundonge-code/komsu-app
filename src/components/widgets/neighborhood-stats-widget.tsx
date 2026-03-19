'use client'

import { Users, MessageSquare, UserPlus, Shield } from 'lucide-react'

const stats = [
  {
    label: 'Aktif Üyeler',
    value: 1248,
    icon: Users,
    color: 'text-primary',
    percentage: 92,
  },
  {
    label: 'Bugün Gönderi',
    value: 34,
    icon: MessageSquare,
    color: 'text-blue-500',
    percentage: 65,
  },
  {
    label: 'Bu Hafta Yeni',
    value: 12,
    icon: UserPlus,
    color: 'text-green-500',
    percentage: 45,
  },
  {
    label: 'Güvenlik Puanı',
    value: '8.7/10',
    icon: Shield,
    color: 'text-primary',
    percentage: 87,
  },
]

export function NeighborhoodStatsWidget() {
  return (
    <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <p className="text-sm font-semibold text-text-primary">Mahalle İstatistikleri</p>
      </div>
      <div className="divide-y divide-[#e0e0e0]">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                  <p className="text-xs text-text-muted font-medium">{stat.label}</p>
                </div>
                <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    stat.color === 'text-primary'
                      ? 'bg-primary'
                      : stat.color === 'text-blue-500'
                        ? 'bg-blue-500'
                        : stat.color === 'text-green-500'
                          ? 'bg-green-500'
                          : 'bg-primary'
                  }`}
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="p-4 bg-[#f9f9f9] text-[11px] text-text-muted">
        <p>Son güncelleme: Bugün 14:32</p>
      </div>
    </div>
  )
}
