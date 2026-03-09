'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Edit3, ChevronUp, Building2, Shield, AlertCircle } from 'lucide-react'
import { WeatherWidget } from '@/components/widgets/weather-widget'
import { TrendingWidget } from '@/components/widgets/trending-widget'
import { UpcomingEventsWidget } from '@/components/widgets/upcoming-events-widget'
import { NeighborhoodStatsWidget } from '@/components/widgets/neighborhood-stats-widget'

export function RightSidebar() {
  return (
    <div className="w-[300px] flex-shrink-0 hidden xl:block py-4 px-2 space-y-4">
      {/* Neighborhood Card */}
      <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#00833e] rounded-full" />
            <div>
              <p className="text-[15px] font-bold text-[#333]">Kadıköy, Moda</p>
              <p className="text-xs text-[#8f8f8f]">İstanbul</p>
            </div>
          </div>
        </div>
        <Link
          href="/uyarilar"
          className="flex items-center justify-between px-4 py-3 border-t border-[#e0e0e0] hover:bg-[#f9f9f9] transition-colors"
        >
          <span className="text-sm font-medium text-[#404040]">Tüm uyarıları gör</span>
          <ChevronRight className="w-4 h-4 text-[#8f8f8f]" />
        </Link>
      </div>

      {/* Weather Widget */}
      <WeatherWidget />

      {/* Trending Topics Widget */}
      <TrendingWidget />

      {/* Upcoming Events Widget */}
      <UpcomingEventsWidget />

      {/* Neighborhood Stats Widget */}
      <NeighborhoodStatsWidget />

      {/* Safety Status */}
      <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden">
        <div className="p-4">
          <p className="text-sm font-semibold text-[#333] flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-[#00833e]" />
            Güvenlik Durumu
          </p>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#00833e] rounded-full animate-pulse" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[#333]">Mahalle Güvenli</p>
              <p className="text-xs text-[#8f8f8f]">Son uyarı: 3 gün önce</p>
            </div>
          </div>
          <Link
            href="/uyarilar"
            className="mt-3 text-xs text-[#00833e] font-medium hover:text-[#006b32] flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            Tüm uyarıları görüntüle
          </Link>
        </div>
      </div>

      {/* Sponsored Business */}
      <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-32 bg-gradient-to-br from-[#00833e] to-[#006b32] overflow-hidden">
          <Image
            src="https://picsum.photos/300/128?random=1"
            alt="Moda Kafe & Bistro"
            fill
            unoptimized
            className="object-cover opacity-40"
          />
        </div>
        <div className="p-4">
          <p className="text-xs text-[#8f8f8f] font-semibold mb-2 uppercase">Sponsorlu</p>
          <p className="text-sm font-semibold text-[#333]">Moda Kafe & Bistro</p>
          <p className="text-xs text-[#8f8f8f] mt-1 mb-3">Kahvaltı ve brunch menüsü</p>
          <Link
            href="/isletme/moda-kafe"
            className="text-xs font-medium text-[#00833e] hover:text-[#006b32] flex items-center gap-1"
          >
            Sayfayı ziyaret et
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Business Promo Card */}
      <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden">
        <div className="h-[160px] bg-gradient-to-br from-[#00833e] to-[#006b32] flex items-center justify-center">
          <Building2 className="w-16 h-16 text-white/40" />
        </div>
        <div className="p-4">
          <p className="text-[15px] font-bold text-[#333]">İşletme sahibi misiniz?</p>
          <p className="text-sm text-[#8f8f8f] mt-1">
            İşletme sayfanızı oluşturun, komşularınızla bağlantı kurun ve yeni müşteriler kazanın.
          </p>
        </div>
        <Link
          href="/isletme-ekle"
          className="flex items-center justify-between px-4 py-3 border-t border-[#e0e0e0] hover:bg-[#f9f9f9] transition-colors"
        >
          <span className="text-sm font-medium text-[#00833e]">Sayfa oluştur</span>
          <ChevronRight className="w-4 h-4 text-[#00833e]" />
        </Link>
      </div>

      {/* Footer links */}
      <div className="px-2 pt-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-[#8f8f8f]">
          <Link href="/gizlilik" className="hover:text-[#404040]">
            Gizlilik
          </Link>
          <span>·</span>
          <Link href="/kosullar" className="hover:text-[#404040]">
            Koşullar
          </Link>
          <span>·</span>
          <Link href="/hakkinda" className="hover:text-[#404040]">
            Hakkında
          </Link>
        </div>
        <p className="text-[11px] text-[#8f8f8f] mt-1">© 2026 KomşuApp</p>
      </div>

      {/* Chats Widget - Bottom Right */}
      <div className="fixed bottom-0 right-4 w-[300px] z-40">
        <button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-[#e0e0e0] border-b-0 rounded-t-lg shadow-lg hover:bg-[#f9f9f9] transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-[#333]">Sohbetler</span>
          </div>
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#404040]" />
            <ChevronUp className="w-4 h-4 text-[#404040]" />
          </div>
        </button>
      </div>
    </div>
  )
}
