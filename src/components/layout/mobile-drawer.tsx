'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  X, Home, Compass, ShoppingBag, Calendar, Users, Building2,
  MessageCircle, Bell, Heart, Settings, User, LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { getAvatarUrl } from '@/lib/demo-images'

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

// Mock user data - replace with actual user context in production
const mockUser = {
  name: 'Ahmet Yılmaz',
  neighborhood: 'Kadıköy, İstanbul',
  avatar: getAvatarUrl('Ahmet Yılmaz', 0),
}

// Primary navigation items
const primaryNavItems = [
  { icon: Home, label: 'Ana Sayfa', href: '/' },
  { icon: Compass, label: 'Keşfet', href: '/kesfet' },
  { icon: ShoppingBag, label: 'Pazar Yeri', href: '/pazar' },
  { icon: Calendar, label: 'Etkinlikler', href: '/etkinlikler' },
  { icon: Users, label: 'Gruplar', href: '/gruplar' },
  { icon: Building2, label: 'İşletmeler', href: '/isletmeler' },
  { icon: MessageCircle, label: 'Mesajlar', href: '/mesajlar' },
  { icon: Bell, label: 'Bildirimler', href: '/bildirimler' },
  { icon: Heart, label: 'Favoriler', href: '/favoriler' },
]

// Secondary navigation items
const secondaryNavItems = [
  { icon: User, label: 'Profil', href: '/profil/me' },
  { icon: Settings, label: 'Ayarlar', href: '/ayarlar' },
]

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/giris')
    router.refresh()
  }

  // Check if route is active
  const isActive = (href: string) => {
    return pathname === href || (href !== '/' && pathname?.startsWith(href))
  }

  return (
    <>
      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          'fixed left-0 top-0 bottom-0 z-50 w-[280px] bg-white overflow-y-auto transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-white border-b border-[#e0e0e0] px-4 py-3 flex items-center justify-between">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#00833e]" fill="currentColor">
            <path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z" />
          </svg>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#f0f2f5] rounded-full transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5 text-[#404040]" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="px-4 py-5 border-b border-[#e0e0e0]">
          <Link
            href="/profil/me"
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f0f2f5] transition-colors"
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={mockUser.avatar}
                alt={mockUser.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#333] truncate">
                {mockUser.name}
              </p>
              <p className="text-xs text-[#8f8f8f] truncate">
                {mockUser.neighborhood}
              </p>
            </div>
          </Link>
        </div>

        {/* Primary Navigation */}
        <nav className="flex flex-col gap-1 px-2 py-4">
          {primaryNavItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  'text-[15px] font-medium',
                  active
                    ? 'bg-[#00833e] text-white shadow-md'
                    : 'text-[#333] hover:bg-[#f0f2f5] hover:text-[#00833e]'
                )}
              >
                <Icon className={cn(
                  'w-5 h-5 flex-shrink-0 transition-colors duration-200',
                  active && 'text-white'
                )} />
                <span className="flex-1">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="mx-2 border-t border-[#e0e0e0]" />

        {/* Secondary Navigation */}
        <nav className="flex flex-col gap-1 px-2 py-4">
          {secondaryNavItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                  'text-sm',
                  active
                    ? 'text-[#00833e] font-semibold bg-green-50'
                    : 'text-[#8f8f8f] hover:text-[#333] hover:bg-[#f0f2f5]'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto pt-4 px-2 pb-6 border-t border-[#e0e0e0]">
          <button
            onClick={handleLogout}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200',
              'text-[15px] font-medium text-red-600 hover:bg-red-50'
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>
    </>
  )
}
