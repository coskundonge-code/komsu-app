'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, ShoppingBag, Calendar, Users,
  AlertTriangle, Heart, Newspaper,
  ChevronLeft, ChevronRight, HandHeart, MapPin
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCurrentUser } from '@/lib/hooks/use-auth'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const navItems = [
  { icon: Home, label: 'Ana Sayfa', href: '/' },
  { icon: ShoppingBag, label: 'Satılık & Ücretsiz', href: '/pazar' },
  { icon: Newspaper, label: 'Yerel Haberler', href: '/yerel-haberler' },
  { icon: AlertTriangle, label: 'Uyarılar', href: '/uyarilar' },
  { icon: Users, label: 'Gruplar', href: '/gruplar' },
  { icon: Calendar, label: 'Etkinlikler', href: '/etkinlikler' },
  { icon: Heart, label: 'Askıda Bağış', href: '/askida-bagis' },
  { icon: HandHeart, label: 'Komşuma Yardım', href: '/komsuma-yardim' },
]

export function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user } = useCurrentUser()
  const metadata = user?.user_metadata
  const fullName = metadata?.full_name || 'Kullanıcı'
  const nameInitial = fullName.charAt(0).toUpperCase()
  const locationText = metadata?.ilce && metadata?.il
    ? `${metadata.ilce}, ${metadata.il}`
    : 'Konum belirtilmemiş'

  const isActive = (href: string) => {
    return pathname === href || (href !== '/' && pathname?.startsWith(href))
  }

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col bg-surface border-r border-border transition-all duration-300 overflow-y-auto overflow-x-hidden',
        isCollapsed ? 'w-[72px]' : 'w-[240px]',
        'flex-shrink-0',
        className
      )}
      aria-label="Ana navigasyon"
      {...props}
    >
      {/* User Profile Card */}
      <div className={cn('px-3 pt-4 pb-2', isCollapsed && 'px-2')}>
        <Link href="/profil/me">
          <div className={cn(
            'flex items-center gap-3 p-2.5 rounded-xl bg-primary-light/50 border border-primary-light transition-all hover:bg-primary-light/70',
            isCollapsed && 'justify-center p-2'
          )}>
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                {nameInitial}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">{fullName}</p>
                <p className="text-xs text-text-muted truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {locationText}
                </p>
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* Main Navigation - 8 items */}
      <nav className={cn('flex flex-col gap-0.5 px-2 py-2', isCollapsed && 'px-1.5')} aria-label="Ana sayfalar">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative group',
                'text-[14px] font-medium',
                active
                  ? 'text-primary bg-primary-light font-semibold'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
                isCollapsed && 'justify-center px-2'
              )}
              title={isCollapsed ? item.label : undefined}
              aria-current={active ? 'page' : undefined}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-r-full" />
              )}
              <Icon className={cn(
                'w-5 h-5 flex-shrink-0',
                active ? 'text-primary' : 'text-text-muted group-hover:text-text-secondary'
              )} />
              {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-2 px-2.5 py-1 bg-text-primary text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="mt-auto pt-2 pb-4 px-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2 text-xs text-text-muted hover:text-text-secondary hover:bg-surface-hover rounded-lg transition-all',
            isCollapsed && 'px-0'
          )}
          title={isCollapsed ? 'Genişlet' : 'Daralt'}
          aria-label={isCollapsed ? 'Kenar çubuğunu genişlet' : 'Kenar çubuğunu daralt'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Daralt</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
