'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Building2, MapPin } from 'lucide-react'
import { useCurrentUser } from '@/lib/hooks/use-auth'

// NOT (2026-06-07): Bu sağ kenar çubuğu eskiden gerçek kullanıcılara uydurma "1.247 üye"
// sayısı ve sahte bir "Sponsorlu" işletme (demo görselli "Moda Kafe & Bistro", var olmayan
// /isletmeler/moda-kafe bağlantısı) gösteriyordu. Doğrulanamayan üye sayısı ve sahte reklam
// kaldırıldı; gerçek reklam sunumu (ad_campaigns/ads) devreye girince sponsorlu alan yeniden
// eklenebilir. Bkz. TECH_DEBT #12.

// Pages where the right sidebar should be completely hidden (full-width content)
const hiddenOnRoutes = ['/pazar', '/odunc-kirala']

export function RightSidebar() {
  const pathname = usePathname()
  const { user, profile, neighborhood } = useCurrentUser()
  const metadata = user?.user_metadata

  // Hide right sidebar entirely on marketplace pages
  const shouldHide = hiddenOnRoutes.some(route => pathname?.startsWith(route))
  if (shouldHide) return null

  // Konum: önce mahalle üyeliği, sonra profil konumu, sonra eski metadata.
  const locationText =
    neighborhood?.district && neighborhood?.name
      ? `${neighborhood.district}, ${neighborhood.name}`
      : profile?.location_district && profile?.location_province
        ? `${profile.location_district}, ${profile.location_province}`
        : metadata?.ilce && metadata?.mahalle
          ? `${metadata.ilce}, ${metadata.mahalle}`
          : metadata?.ilce && metadata?.il
            ? `${metadata.ilce}, ${metadata.il}`
            : 'Konum belirtilmemiş'

  return (
    <div className="w-[320px] flex-shrink-0 hidden xl:block py-4 pl-2 pr-0 space-y-3">
      {/* 1. Mahalle Konum Kartı + Üye Sayısı */}
      <div className="bg-surface rounded-xl overflow-hidden border border-border">
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center shadow-sm">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[15px] font-bold text-text-primary">{locationText}</p>
              <p className="text-xs text-text-muted mt-0.5">Mahalleniz</p>
            </div>
          </div>
        </div>
        <Link
          href="/uyarilar"
          className="flex items-center justify-between px-4 py-2.5 hover:bg-surface-hover transition-colors"
        >
          <span className="text-xs font-medium text-primary">Tüm uyarıları gör</span>
          <ChevronRight className="w-4 h-4 text-primary" />
        </Link>
      </div>

      {/* 2. İşletme Sahibi CTA */}
      <div className="bg-surface rounded-xl overflow-hidden border border-border hover:shadow-md transition-shadow">
        <div className="h-32 bg-gradient-to-br from-primary via-primary-hover to-primary-700 flex items-center justify-center relative">
          <Building2 className="w-14 h-14 text-white/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
        </div>
        <div className="p-4">
          <p className="text-[15px] font-bold text-text-primary">İşletme sahibi misiniz?</p>
          <p className="text-[13px] text-text-secondary mt-1 leading-relaxed">
            İşletme sayfanızı oluşturun, komşularınızla bağlantı kurun.
          </p>
        </div>
        <Link
          href="/isletme-ekle"
          className="flex items-center justify-between px-4 py-3 border-t border-border-light hover:bg-surface-hover transition-colors"
        >
          <span className="text-sm font-semibold text-primary">Sayfa oluştur</span>
          <ChevronRight className="w-4 h-4 text-primary" />
        </Link>
      </div>
    </div>
  )
}
