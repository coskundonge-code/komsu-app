'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Building2, Shield, AlertCircle, MapPin, Users } from 'lucide-react'
import { WeatherWidget } from '@/components/widgets/weather-widget'
import { TrendingWidget } from '@/components/widgets/trending-widget'
import { UpcomingEventsWidget } from '@/components/widgets/upcoming-events-widget'
import { NeighborhoodStatsWidget } from '@/components/widgets/neighborhood-stats-widget'
import { getFeedImageUrl } from '@/lib/demo-images'

export function RightSidebar() {
  return (
    <div className="w-[300px] flex-shrink-0 hidden xl:block py-4 px-2 space-y-3">
      <div className="bg-surface rounded-xl shadow-card border border-border overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">Kadikoy, Moda</p>
              <p className="text-xs text-text-muted flex items-center gap-1">
                <Users className="w-3 h-3" />
                1.247 uye
              </p>
            </div>
          </div>
        </div>
        <Link
          href="/uyarilar"
          className="flex items-center justify-between px-4 py-2.5 border-t border-border-light hover:bg-surface-hover transition-colors"
        >
          <span className="text-xs font-medium text-text-secondary">Tum uyarilari gor</span>
          <ChevronRight className="w-4 h-4 text-text-muted" />
        </Link>
      </div>

      <WeatherWidget />
      <TrendingWidget />
      <UpcomingEventsWidget />
      <NeighborhoodStatsWidget />

      <div className="bg-surface rounded-xl shadow-card border border-border overflow-hidden">
        <div className="p-4">
          <p className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-primary" />
            Guvenlik Durumu
          </p>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">Mahalle Guvenli</p>
              <p className="text-xs text-text-muted">Son uyari: 3 gun once</p>
            </div>
          </div>
          <Link
            href="/uyarilar"
            className="mt-3 text-xs text-primary font-medium hover:text-primary-hover flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            Tum uyarilari goruntule
          </Link>
        </div>
      </div>

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
          <p className="text-xs text-text-muted mt-0.5">Kahvalti ve brunch menusu</p>
          <Link
            href="/isletme/moda-kafe"
            className="mt-2 text-xs font-medium text-primary hover:text-primary-hover flex items-center gap-1"
          >
            Sayfayi ziyaret et
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-card border border-blue-100 overflow-hidden">
        <div className="p-4">
          <p className="text-sm font-bold text-text-primary mb-1">Komsularini Davet Et</p>
          <p className="text-xs text-text-muted mb-3">
            Referans kodunla en fazla 3 komsunu sisteme davet et.
          </p>
          <Link
            href="/davet"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors w-full shadow-sm"
          >
            Davet Kodunu Al
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="bg-surface rounded-xl shadow-card border border-border overflow-hidden">
        <div className="h-32 bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
          <Building2 className="w-12 h-12 text-white/30" />
        </div>
        <div className="p-4">
          <p className="text-sm font-bold text-text-primary">Isletme sahibi misiniz?</p>
          <p className="text-xs text-text-muted mt-1">
            Isletme sayfanizi olusturun, komsularinizla baglanti kurun.
          </p>
        </div>
        <Link
          href="/isletme-ekle"
          className="flex items-center justify-between px-4 py-2.5 border-t border-border-light hover:bg-surface-hover transition-colors"
        >
          <span className="text-xs font-medium text-primary">Sayfa olustur</span>
          <ChevronRight className="w-4 h-4 text-primary" />
        </Link>
      </div>

      <div className="px-2 pt-2 pb-4">
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-text-muted">
          <Link href="/gizlilik" className="hover:text-text-secondary">Gizlilik</Link>
          <span>·</span>
          <Link href="/kosullar" className="hover:text-text-secondary">Kosullar</Link>
          <span>·</span>
          <Link href="/hakkinda" className="hover:text-text-secondary">Hakkinda</Link>
          <span>·</span>
          <Link href="/yardim" className="hover:text-text-secondary">Yardim</Link>
        </div>
        <p className="text-[11px] text-text-muted mt-1">© 2026 Mahallem</p>
      </div>
    </div>
  )
}
