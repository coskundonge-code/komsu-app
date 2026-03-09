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
    <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden">
      <div className="p-4 border-b border-[#e0e0e0]">
        <p className="text-sm font-semibold text-[#333] flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#00833e]" />
          Mahallede Gündem
        </p>
      </div>
      <div className="divide-y divide-[#e0e0e0]">
        {trendingTopics.map((topic, idx) => (
          <Link
            key={idx}
            href={`/arama?q=${encodeURIComponent(topic.title)}`}
            className="px-4 py-3 hover:bg-[#f9f9f9] transition-colors flex justify-between items-center group"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {topic.trending && (
                <Flame className="w-3 h-3 text-orange-500 flex-shrink-0" />
              )}
              <span className="text-sm text-[#333] truncate group-hover:text-[#00833e]">{topic.title}</span>
            </div>
            <span className="text-xs text-[#8f8f8f] bg-[#f0f2f5] px-2 py-1 rounded flex-shrink-0 ml-2">
              {topic.posts}
            </span>
          </Link>
        ))}
      </div>
      <Link
        href="/gundem"
        className="px-4 py-3 bg-[#f9f9f9] hover:bg-[#f0f2f5] transition-colors text-center text-sm text-[#00833e] font-medium"
      >
        Tümünü gör
      </Link>
    </div>
  )
}
