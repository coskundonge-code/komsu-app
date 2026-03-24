<<<<<<< HEAD
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, ShoppingBag, Calendar, Users,
  Bell, AlertTriangle, Settings, HelpCircle, User,
  ChevronLeft, ChevronRight, Repeat, Heart, Newspaper,
  Compass, CreditCard, MapPin
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const primaryNavItems = [
  { icon: Home, label: 'Ana Sayfa', href: '/' },
  { icon: Compass, label: 'Keşfet', href: '/kesfet' },
  { icon: Newspaper, label: 'Yerel Haberler', href: '/yerel-haberler' },
  { icon: AlertTriangle, label: 'Uyarılar', href: '/uyarilar' },
  { icon: ShoppingBag, label: 'Satılık & Ücretsiz', href: '/pazar' },
  { icon: Repeat, label: 'Kirala & Ödünç Ver', href: '/odunc-kirala' },
  { icon: Users, label: 'Gruplar', href: '/gruplar' },
  { icon: Calendar, label: 'Etkinlikler', href: '/etkinlikler' },
  { icon: CreditCard, label: 'Mahallemiz Kart', href: '/mahallem-kart' },
  { icon: Heart, label: 'Askıda Bağış', href: '/askida-bagis' },
]

const secondaryNavItems = [
  { icon: User, label: 'Profilim', href: '/profil/me' },
  { icon: Bell, label: 'Bildirimler', href: '/bildirimler' },
  { icon: Settings, label: 'Ayarlar', href: '/ayarlar' },
  { icon: HelpCircle, label: 'Yardım', href: '/yardim' },
]

export function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

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
      <div className={cn('px-3 pt-4 pb-2', isCollapsed && 'px-2')}>
        <div className={cn(
          'flex items-center gap-3 p-2.5 rounded-xl bg-primary-light/50 border border-primary-light transition-all',
          isCollapsed && 'justify-center p-2'
        )}>
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">Ahmet Yılmaz</p>
              <p className="text-xs text-text-muted truncate flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Kadıköy, İstanbul
              </p>
            </div>
          )}
        </div>
      </div>

      <nav className={cn('flex flex-col gap-0.5 px-2 py-2', isCollapsed && 'px-1.5')} aria-label="Ana sayfalar">
        {primaryNavItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href + item.label}
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

      <div className="mx-3 my-1 h-px bg-border" />

      <nav className={cn('flex flex-col gap-0.5 px-2 py-2', isCollapsed && 'px-1.5')} aria-label="Ayarlar ve destek">
        {secondaryNavItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative group',
                'text-[13px]',
                active
                  ? 'text-primary font-semibold bg-primary-light/50'
                  : 'text-text-muted hover:text-text-secondary hover:bg-surface-hover',
                isCollapsed && 'justify-center px-2 py-2.5'
              )}
              title={isCollapsed ? item.label : undefined}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
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
=======
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, ShoppingBag, Calendar, Users,
  Bell, AlertTriangle, Settings, HelpCircle, User,
  ChevronLeft, ChevronRight, Repeat, Heart, Newspaper,
  Compass, CreditCard, MapPin
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCurrentUser } from '@/lib/hooks/use-auth'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const primaryNavItems = [
  { icon: Home, label: 'Ana Sayfa', href: '/' },
  { icon: Compass, label: 'Keşfet', href: '/kesfet' },
  { icon: Newspaper, label: 'Yerel Haberler', href: '/yerel-haberler' },
  { icon: AlertTriangle, label: 'Uyarılar', href: '/uyarilar' },
  { icon: ShoppingBag, label: 'Satılık & Ücretsiz', href: '/pazar' },
  { icon: Repeat, label: 'Kirala & Ödünç Ver', href: '/odunc-kirala' },
  { icon: Users, label: 'Gruplar', href: '/gruplar' },
  { icon: Calendar, label: 'Etkinlikler', href: '/etkinlikler' },
  { icon: CreditCard, label: 'Mahallemiz Kart', href: '/mahallem-kart' },
  { icon: Heart, label: 'Askıda Bağış', href: '/askida-bagis' },
]

const secondaryNavItems = [
  { icon: User, label: 'Profilim', href: '/profil/me' },
  { icon: Bell, label: 'Bildirimler', href: '/bildirimler' },
  { icon: Settings, label: 'Ayarlar', href: '/ayarlar' },
  { icon: HelpCircle, label: 'Yardım', href: '/yardim' },
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
      <div className={cn('px-3 pt-4 pb-2', isCollapsed && 'px-2')}>
        <div className={cn(
          'flex items-center gap-3 p-2.5 rounded-xl bg-primary-light/50 border border-primary-light transition-all',
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
      </div>

      <nav className={cn('flex flex-col gap-0.5 px-2 py-2', isCollapsed && 'px-1.5')} aria-label="Ana sayfalar">
        {primaryNavItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href + item.label}
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

      <div className="mx-3 my-1 h-px bg-border" />

      <nav className={cn('flex flex-col gap-0.5 px-2 py-2', isCollapsed && 'px-1.5')} aria-label="Ayarlar ve destek">
        {secondaryNavItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative group',
                'text-[13px]',
                active
                  ? 'text-primary font-semibold bg-primary-light/50'
                  : 'text-text-muted hover:text-text-secondary hover:bg-surface-hover',
                isCollapsed && 'justify-center px-2 py-2.5'
              )}
              title={isCollapsed ? item.label : undefined}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
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
>>>>>>> ab5629528fac6fe6996b018892fcc0642a0acd24
