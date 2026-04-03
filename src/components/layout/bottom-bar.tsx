'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingBag, Plus, Bell, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomBar() {
  const pathname = usePathname()
  const unreadCount = 3

  // Keşfet removed — replaced with Satılık & Ücretsiz (Pazar)
  const items = [
    { icon: Home, label: 'Ana Sayfa', href: '/' },
    { icon: ShoppingBag, label: 'Pazar', href: '/pazar' },
    { icon: Bell, label: 'Bildirimler', href: '/bildirimler' },
    { icon: User, label: 'Profil', href: '/profil/me' },
  ]

  const isActive = (href: string): boolean => {
    if (href === '/') return pathname === '/'
    return pathname?.startsWith(href) || false
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-surface/95 backdrop-blur-lg border-t border-border"
      role="navigation"
      aria-label="Mobil Navigasyon"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around px-1 py-1.5">
        {items.slice(0, 2).map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 px-4 py-1.5 min-w-[60px] rounded-xl transition-all duration-200 active:scale-95',
                active ? 'text-primary' : 'text-text-muted'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <div className="relative">
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
                {active && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />}
              </div>
              <span className={cn('text-[10px] mt-0.5', active ? 'font-bold text-primary' : 'font-medium')}>
                {item.label}
              </span>
            </Link>
          )
        })}

        {/* FAB — Create Post */}
        <Link
          href="/?post=new"
          className="flex flex-col items-center justify-center -mt-5 active:scale-95 transition-transform"
          aria-label="Yeni gönderi oluştur"
        >
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all">
            <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-bold text-primary mt-1">Oluştur</span>
        </Link>

        {items.slice(2).map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          const isNotifications = item.href === '/bildirimler'
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 px-4 py-1.5 min-w-[60px] rounded-xl transition-all duration-200 active:scale-95',
                active ? 'text-primary' : 'text-text-muted'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <div className="relative">
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
                {active && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />}
                {isNotifications && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-error text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-surface">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className={cn('text-[10px] mt-0.5', active ? 'font-bold text-primary' : 'font-medium')}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
