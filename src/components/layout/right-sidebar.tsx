'use client'

import Link from 'next/link'
import { ChevronRight, Edit3, ChevronUp, Building2 } from 'lucide-react'

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

      {/* Sponsored */}
      <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-4">
        <p className="text-xs text-[#8f8f8f] mb-2">Sponsorlu</p>
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-[#f0f2f5] rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-[#8f8f8f]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#333]">Moda Kafe & Bistro</p>
            <p className="text-xs text-[#8f8f8f]">Kahvaltı ve brunch menüsü</p>
          </div>
        </div>
      </div>

      {/* Footer links */}
      <div className="px-2 pt-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-[#8f8f8f]">
          <a href="#" className="hover:text-[#404040]">Gizlilik</a>
          <span>·</span>
          <a href="#" className="hover:text-[#404040]">Koşullar</a>
          <span>·</span>
          <a href="#" className="hover:text-[#404040]">Hakkında</a>
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
