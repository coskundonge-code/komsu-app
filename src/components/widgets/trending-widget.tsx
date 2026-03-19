'use client'

import Link from 'next/link'
import { TrendingUp, Flame } from 'lucide-react'

const trendingTopics = [
  { title: 'Park Yenileme Projesi', posts: 24, trending: true },
  { title: 'Hafta Sonu Pazarı', posts: 18, trending: true },
  { title: 'Yeni Kafe Açılışı', posts: 12, trending: false },
  { title: 'Komşu Sosyal Etkinliği', posts: 9, trending: false },
  { title: 'Kat Sahipleri Toplantısı', posts: 7, trending: false },
]

export function TrendingWidget() {
  return (
    <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <p className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Mahallede Gündem
        </p>
      </div>
      <div className="divide-y divide-[#e0e0e0]">
        {trendingTopics.map((topic, idx) => (
          <Link
            key={idx}
            href={`/arama?q=${encodeURIComponent(topic.title)}`}
            className="px-4 py-3 hover:bg-surface-hover transition-colors flex justify-between items-center group"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {topic.trending && (
                <Flame className="w-3 h-3 text-orange-500 flex-shrink-0" />
              )}
              <span className="text-sm text-text-primary truncate group-hover:text-primary">{topic.title}</span>
            </div>
            <span className="text-xs text-text-muted bg-background px-2 py-1 rounded flex-shrink-0 ml-2">
              {topic.posts}
            </span>
          </Link>
        ))}
      </div>
      <Link
        href="/gundem"
        className="px-4 py-3 bg-[#f9f9f9] hover:bg-background transition-colors text-center text-sm text-primary font-medium"
      >
        Tümünü gör
      </Link>
    </div>
  )
}
