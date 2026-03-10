'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, Plus, MessageCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export function BottomBar() {
  const pathname = usePathname()
  const [activeLink, setActiveLink] = useState<string | null>(null)

  // Mock unread messages count
  const unreadCount = 3

  const items = [
    { icon: Home, label: 'Ana Sayfa', href: '/' },
    { icon: Compass, label: 'Keşfet', href: '/kesfet' },
    { icon: MessageCircle, label: 'Mesajlar', href: '/mesajlar' },
    { icon: User, label: 'Profil', href: '/profil' },
  ]

  const isActive = (href: string): boolean => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(href) || false
  }

  const handleLinkClick = (href: string) => {
    setActiveLink(href)
    setTimeout(() => setActiveLink(null), 200)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-[#e0e0e0]" role="navigation" aria-label="Mobil Navigasyon" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around px-2 py-2">
        {/* First two items */}
        {items.slice(0, 2).map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          const isPressed = activeLink === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handleLinkClick(item.href)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-4 py-2 min-w-[64px] rounded-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-[#00833e]',
                'active:scale-95',
                active
                  ? 'text-[#00833e]'
                  : 'text-[#8f8f8f]',
                isPressed && 'scale-95'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className={cn('transition-all duration-150', active ? 'w-6 h-6' : 'w-5 h-5')} strokeWidth={active ? 2.5 : 2} />
              <span className={cn('text-[10px] font-semibold', active ? 'text-[#00833e]' : 'text-[#8f8f8f]')}>
                {item.label}
              </span>
            </Link>
          )
        })}

        {/* Center Plus button */}
        <Link
          href="/?post=new"
          onClick={() => handleLinkClick('create')}
          className={cn(
            'flex flex-col items-center justify-center gap-1 px-3 py-2 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00833e] rounded-lg',
            'active:scale-95',
            activeLink === 'create' && 'scale-95'
          )}
          aria-label="Yeni gönderi oluştur"
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[#00833e] rounded-full blur-lg opacity-30"></div>
            <div className="relative w-12 h-12 bg-[#00833e] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200">
              <Plus className="w-6 h-6 text-white" strokeWidth={3} />
            </div>
          </div>
          <span className="text-[10px] font-semibold text-[#00833e]">Oluştur</span>
        </Link>

        {/* Last two items with message badge */}
        {items.slice(2).map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          const isPressed = activeLink === item.href
          const isMessages = item.href === '/mesajlar'

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handleLinkClick(item.href)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-4 py-2 min-w-[64px] rounded-lg transition-all duration-200 ease-out relative focus:outline-none focus:ring-2 focus:ring-[#00833e]',
                'active:scale-95',
                active
                  ? 'text-[#00833e]'
                  : 'text-[#8f8f8f]',
                isPressed && 'scale-95'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <div className="relative">
                <Icon className={cn('transition-all duration-150', active ? 'w-6 h-6' : 'w-5 h-5')} strokeWidth={active ? 2.5 : 2} />
                {/* Notification badge for messages */}
                {isMessages && unreadCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                    {unreadCount}
                  </div>
                )}
              </div>
              <span className={cn('text-[10px] font-semibold', active ? 'text-[#00833e]' : 'text-[#8f8f8f]')}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
