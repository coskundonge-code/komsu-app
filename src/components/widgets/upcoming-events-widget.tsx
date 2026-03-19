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
    <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <p className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          Yaklaşan Etkinlikler
        </p>
      </div>
      <div className="space-y-3 p-4">
        {upcomingEvents.map((event, idx) => (
          <Link
            key={idx}
            href="/etkinlikler"
            className="flex gap-3 p-2 rounded-lg hover:bg-background transition-colors group"
          >
            <div className="flex flex-col items-center justify-center w-10 h-10 bg-background rounded-lg flex-shrink-0 group-hover:bg-[#e0e0e0]">
              <p className="text-xs text-text-muted">{event.date.split(' ')[0]}</p>
              <p className="text-sm font-semibold text-primary">{event.date.split(' ')[1]}</p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate group-hover:text-primary">{event.title}</p>
              <p className="text-xs text-text-muted">{event.attendees} katılımcı</p>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/etkinlikler"
        className="px-4 py-3 bg-[#f9f9f9] hover:bg-background transition-colors text-center text-sm text-primary font-medium border-t border-border"
      >
        Tüm Etkinlikler
      </Link>
    </div>
  )
}
