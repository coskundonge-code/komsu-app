'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, ShoppingBag, Calendar, Users, AlertTriangle,
  Newspaper, Building2, MapPin, Bookmark
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
}

const navItems = [
  { icon: Home, label: 'Ana Sayfa', href: '/' },
  { icon: ShoppingBag, label: 'Satılık ve Ücretsiz', href: '/pazar' },
  { icon: Newspaper, label: 'Yerel Haberler', href: '/kesfet' },
  { icon: AlertTriangle, label: 'Güvenlik Uyarıları', href: '/uyarilar' },
  { icon: Users, label: 'Gruplar', href: '/gruplar' },
  { icon: Calendar, label: 'Etkinlikler', href: '/etkinlikler' },
  { icon: Building2, label: 'İşletmeler', href: '/isletmeler' },
  { icon: Bookmark, label: 'Kaydedilenler', href: '/kaydedilenler' },
]

export function Sidebar({ className, isOpen = true, ...props }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'w-[220px] flex-shrink-0 border-r border-gray-200 bg-white p-3 hidden md:block overflow-y-auto',
        !isOpen && 'hidden',
        className
      )}
      {...props}
    >
      {/* Navigation */}
      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Neighborhood Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-start gap-2 px-3">
          <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Kadıköy, Moda</p>
            <p className="text-xs text-gray-500">İstanbul, Türkiye</p>
            <p className="text-xs text-gray-500 mt-1">
              <span className="font-semibold text-gray-700">5,234</span> Komşu
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 px-3">
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-gray-400">
          <a href="#" className="hover:text-gray-600">Gizlilik</a>
          <span>·</span>
          <a href="#" className="hover:text-gray-600">Koşullar</a>
          <span>·</span>
          <a href="#" className="hover:text-gray-600">İletişim</a>
        </div>
        <p className="text-[11px] text-gray-400 mt-2">© 2026 KomşuApp</p>
      </div>
    </aside>
  )
}
