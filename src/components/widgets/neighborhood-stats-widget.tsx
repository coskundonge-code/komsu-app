'use client'

import { Users, MessageSquare, UserPlus, Shield } from 'lucide-react'

const stats = [
  {
    label: 'Aktif Üyeler',
    value: 1248,
    icon: Users,
    color: 'text-[#00833e]',
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
    color: 'text-[#00833e]',
    percentage: 87,
  },
]

export function NeighborhoodStatsWidget() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden">
      <div className="p-4 border-b border-[#e0e0e0]">
        <p className="text-sm font-semibold text-[#333]">Mahalle İstatistikleri</p>
      </div>
      <div className="divide-y divide-[#e0e0e0]">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                  <p className="text-xs text-[#8f8f8f] font-medium">{stat.label}</p>
                </div>
                <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-[#f0f2f5] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    stat.color === 'text-[#00833e]'
                      ? 'bg-[#00833e]'
                      : stat.color === 'text-blue-500'
                        ? 'bg-blue-500'
                        : stat.color === 'text-green-500'
                          ? 'bg-green-500'
                          : 'bg-[#00833e]'
                  }`}
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="p-4 bg-[#f9f9f9] text-[11px] text-[#8f8f8f]">
        <p>Son güncelleme: Bugün 14:32</p>
      </div>
    </div>
  )
}
