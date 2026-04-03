'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ChevronRight, Building2, MapPin, Users } from 'lucide-react'
import { getFeedImageUrl } from '@/lib/demo-images'
import { useCurrentUser } from '@/lib/hooks/use-auth'

// Pages where the right sidebar should be completely hidden (full-width content)
const hiddenOnRoutes = ['/pazar', '/odunc-kirala']

export function RightSidebar() {
  const pathname = usePathname()
  const { user } = useCurrentUser()
  const metadata = user?.user_metadata

  // Hide right sidebar entirely on marketplace pages
  const shouldHide = hiddenOnRoutes.some(route => pathname?.startsWith(route))
  if (shouldHide) return null

  const locationText = metadata?.ilce && metadata?.mahalle
    ? `${metadata.ilce}, ${metadata.mahalle}`
    : metadata?.ilce && metadata?.il
    ? `${metadata.ilce}, ${metadata.il}`
    : 'Konum belirtilmemiş'

  return (
    <div className="w-[300px] flex-shrink-0 hidden xl:block py-4 px-2 space-y-3">
      {/* 1. Mahalle Konum Kartı + Üye Sayısı */}
      <div className="bg-surface rounded-xl shadow-card border border-border overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">{locationText}</p>
              <p className="text-xs text-text-muted flex items-center gap-1">
                <Users className="w-3 h-3" />
                1.247 üye
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. İşletme Sahibi CTA */}
      <div className="bg-surface rounded-xl shadow-card border border-border overflow-hidden hover:shadow-card-hover transition-shadow">
        <div className="h-28 bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
          <Building2 className="w-12 h-12 text-white/30" />
        </div>
        <div className="p-4">
          <p className="text-sm font-bold text-text-primary">İşletme sahibi misiniz?</p>
          <p className="text-xs text-text-muted mt-1">
            İşletme sayfanızı oluşturun, komşularınızla bağlantı kurun.
          </p>
        </div>
        <Link
          href="/isletme-ekle"
          className="flex items-center justify-between px-4 py-2.5 border-t border-border-light hover:bg-surface-hover transition-colors"
        >
          <span className="text-xs font-medium text-primary">Sayfa oluştur</span>
          <ChevronRight className="w-4 h-4 text-primary" />
        </Link>
      </div>

      {/* 3. Sponsorlu Alan */}
      <div className="bg-surface rounded-xl shadow-card border border-border overflow-hidden hover:shadow-card-hover transition-shadow">
        <div className="relative h-28 bg-gradient-to-br from-primary to-primary-hover overflow-hidden">
          <Image
            src={getFeedImageUrl(1, 300, 128)}
            alt="Moda Kafe & Bistro"
            fill
            unoptimized
            className="object-cover opacity-40"
          />
        </div>
        <div className="p-3">
          <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">Sponsorlu</p>
          <p className="text-sm font-semibold text-text-primary mt-1">Moda Kafe & Bistro</p>
          <p className="text-xs text-text-muted mt-0.5">Kahvaltı ve brunch menüsü</p>
          <Link
            href="/isletmeler/moda-kafe"
            className="mt-2 text-xs font-medium text-primary hover:text-primary-hover flex items-center gap-1"
          >
            Sayfayı ziyaret et
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
