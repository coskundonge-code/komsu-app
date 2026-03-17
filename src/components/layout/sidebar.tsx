'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, ShoppingBag, Calendar, Users,
  MessageCircle, Bell, AlertTriangle, Settings, HelpCircle, User,
  ChevronRight, UserPlus, PlusCircle, Repeat, CreditCard, Heart, Newspaper
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAvatarUrl } from '@/lib/demo-images'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

// Primary navigation items - clean Nextdoor-like structure
const primaryNavItems = [
  { icon: Home, label: 'Ana Sayfa', href: '/' },
  { icon: Newspaper, label: 'Yerel Haberler', href: '/kesfet' },
  { icon: AlertTriangle, label: 'Uyarılar', href: '/uyarilar' },
  { icon: ShoppingBag, label: 'Satılık & Ücretsiz', href: '/pazar' },
  { icon: Repeat, label: 'Kirala & Ödünç Ver', href: '/odunc-kirala' },
  { icon: Users, label: 'Gruplar', href: '/gruplar' },
  { icon: Calendar, label: 'Etkinlikler', href: '/etkinlikler' },
  { icon: CreditCard, label: 'Mahallem Kart', href: '/mahallem-kart' },
  { icon: Heart, label: 'Askıda Bağış', href: '/askida-bagis' },
]

// Secondary navigation items
const secondaryNavItems = [
  { icon: User, label: 'Profilim', href: '/profil/me' },
  { icon: MessageCircle, label: 'Mesajlar', href: '/mesajlar' },
  { icon: Bell, label: 'Bildirimler', href: '/bildirimler' },
  { icon: Settings, label: 'Ayarlar', href: '/ayarlar' },
]

// Mock user data - replace with actual user context in production
const mockUser = {
  name: 'Ahmet Yılmaz',
  neighborhood: 'Kadıköy, İstanbul',
  avatar: getAvatarUrl('Ahmet Yılmaz', 0),
  unreadMessages: 3,
  unreadNotifications: 5,
}

export function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Check if route is active
  const isActive = (href: string) => {
    return pathname === href || (href !== '/' && pathname?.startsWith(href))
  }

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col bg-white border-r border-[#e0e0e0] transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-[260px]',
        'flex-shrink-0 py-4',
        className
      )}
      aria-label="Ana navigasyon"
      {...props}
    >
      {/* User Profile Section */}
      <div className="px-4 mb-6">
        <div className={cn(
          'flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-[#e0e0e0] transition-all duration-300',
          isCollapsed && 'justify-center'
        )}>
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={mockUser.avatar}
              alt={mockUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border 2 border-white"></div>
          </div>

          {/* User Info */}
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#333] truncate">
                {mockUser.name}
              </p>
              <p className="text-xs text-[#8f8f8f] truncate">
                {mockUser.neighborhood}
              </p>
            </div>
          )}

          {/* Collapse Toggle */}
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="flex-shrink-0 p-1 hover:bg-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#00833e]"
              title="Daralt"
              aria-label="Kenar çubuğunu daralt"
            >
              <ChevronRight className="w-4 h-4 text-[#8f8f8f]" />
            </button>
          )}
        </div>

        {/* Expand button when collapsed - click avatar area */}
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="mt-2 w-full flex items-center justify-center p-1.5 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#00833e]"
            title="Genişlet"
            aria-label="Kenar çubuğunu genişlet"
          >
            <ChevronRight className="w-4 h-4 text-[#8f8f8f] rotate-180" />
          </button>
        )}
      </div>

      {/* Primary Navigation */}
      <nav className={cn(
        'flex flex-col gap-1 px-2 mb-4',
        isCollapsed && 'px-1'
      )} aria-label="Ana sayfalar">
        {primaryNavItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative group focus:outline-none focus:ring-2 focus:ring-[#00833e] focus:ring-offset-0',
                'text-[15px] font-medium',
                active
                  ? 'bg-[#00833e] text-white shadow-md'
                  : 'text-[#333] hover:bg-gray-50 hover:text-[#00833e]',
                isCollapsed && 'justify-center px-2'
              )}
              title={isCollapsed ? item.label : undefined}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className={cn(
                'w-5 h-5 flex-shrink-0 transition-colors duration-200',
                active && 'text-white'
              )} />

              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <span className="absolute left-full ml-2 px-2 py-1 bg-[#333] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Divider */}
      <div className={cn(
        'my-2 border-t border-[#e0e0e0]',
        isCollapsed && 'mx-2'
      )}></div>

      {/* Secondary Navigation */}
      <nav className={cn(
        'flex flex-col gap-1 px-2 mb-4',
        isCollapsed && 'px-1'
      )} aria-label="Ayarlar ve destek">
        {secondaryNavItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative group focus:outline-none focus:ring-2 focus:ring-[#00833e] focus:ring-offset-0',
                'text-sm',
                active
                  ? 'text-[#00833e] font-semibold bg-green-50'
                  : 'text-[#8f8f8f] hover:text-[#333] hover:bg-gray-50',
                isCollapsed && 'justify-center px-2 py-2.5'
              )}
              title={isCollapsed ? item.label : undefined}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />

              {!isCollapsed && (
                <span className="flex-1">{item.label}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Post/Share Button */}
      <div className={cn(
        'mt-auto pt-4 px-2',
        isCollapsed && 'px-1'
      )}>
        <Link
          href="/?post=new"
          className={cn(
            'flex items-center justify-center gap-2 w-full py-2.5 bg-[#00833e] hover:bg-[#006b32] text-white font-semibold text-[15px] rounded-lg transition-all duration-200 shadow-md hover:shadow-lg',
            isCollapsed && 'px-2 py-2.5'
          )}
          title={isCollapsed ? 'Paylaş' : undefined}
        >
          {isCollapsed ? (
            <span className="w-5 h-5 flex items-center justify-center font-bold">+</span>
          ) : (
            <>
              <span>Paylaş</span>
            </>
          )}
        </Link>
      </div>

      {/* Collapse Button (Desktop View) */}
      {!isCollapsed && (
        <div className="mt-2 px-3">
          <button
            onClick={() => setIsCollapsed(true)}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs text-[#8f8f8f] hover:text-[#333] transition-colors group"
            title="Kenar çubuğunu daralt"
          >
            <ChevronRight className="w-4 h-4 group-hover:text-[#00833e]" />
            <span className="group-hover:text-[#00833e]">Daralt</span>
          </button>
        </div>
      )}
    </aside>
  )
}
