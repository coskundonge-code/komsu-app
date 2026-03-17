'use client'

import Link from 'next/link'
import { Calendar } from 'lucide-react'

const upcomingEvents = [
  { date: '14 Mar', title: 'Mahalle Piknik', attendees: 24 },
  { date: '18 Mar', title: 'Yoga Sınıfı', attendees: 12 },
  { date: '21 Mar', title: 'Sosyal Buluşma', attendees: 18 },
]

export function UpcomingEventsWidget() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden">
      <div className="p-4 border-b border-[#e0e0e0]">
        <p className="text-sm font-semibold text-[#333] flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#00833e]" />
          Yaklaşan Etkinlikler
        </p>
      </div>
      <div className="space-y-3 p-4">
        {upcomingEvents.map((event, idx) => (
          <Link
            key={idx}
            href="/etkinlikler"
            className="flex gap-3 p-2 rounded-lg hover:bg-[#f0f2f5] transition-colors group"
          >
            <div className="flex flex-col items-center justify-center w-10 h-10 bg-[#f0f2f5] rounded-lg flex-shrink-0 group-hover:bg-[#e0e0e0]">
              <p className="text-xs text-[#8f8f8f]">{event.date.split(' ')[0]}</p>
              <p className="text-sm font-semibold text-[#00833e]">{event.date.split(' ')[1]}</p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#333] truncate group-hover:text-[#00833e]">{event.title}</p>
              <p className="text-xs text-[#8f8f8f]">{event.attendees} katılımcı</p>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/etkinlikler"
        className="px-4 py-3 bg-[#f9f9f9] hover:bg-[#f0f2f5] transition-colors text-center text-sm text-[#00833e] font-medium border-t border-[#e0e0e0]"
      >
        Tüm Etkinlikler
      </Link>
    </div>
  )
}
