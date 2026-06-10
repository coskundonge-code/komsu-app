'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  X, Home, ShoppingBag, Calendar, Users,
  Heart, LogOut, AlertTriangle, Newspaper, HandHeart
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { getDefaultAvatar } from '@/lib/demo-images'
import { useCurrentUser } from '@/lib/hooks/use-auth'

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

// Mirrors the new 8-item sidebar structure exactly
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

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname()
  const { user, profile, neighborhood } = useCurrentUser()
  const metadata = user?.user_metadata
  const userName = profile?.full_name || metadata?.full_name || 'Kullanıcı'
  // Konum: önce mahalle üyeliği, sonra profil konumu, sonra eski metadata.
  const userNeighborhood =
    neighborhood?.district && neighborhood?.name
      ? `${neighborhood.district}, ${neighborhood.name}`
      : profile?.location_district && profile?.location_province
        ? `${profile.location_district}, ${profile.location_province}`
        : metadata?.ilce && metadata?.il
          ? `${metadata.ilce}, ${metadata.il}`
          : 'Konum belirtilmemiş'
  // Gerçek avatar varsa onu kullan; yoksa baş harfli nötr placeholder (sahte foto değil)
  const userAvatar =
    (profile as any)?.avatar_url || metadata?.avatar_url || getDefaultAvatar(userName)

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch {
      // Ignore client-side errors
    }
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = '/auth/signout'
    document.body.appendChild(form)
    form.submit()
  }

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
          'fixed left-0 top-0 bottom-0 z-50 w-[280px] max-w-[85vw] bg-surface overflow-y-auto transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-surface border-b border-border px-4 py-3 flex items-center justify-between">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary" fill="currentColor">
            <path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z" />
          </svg>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-background rounded-full transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="px-4 py-5 border-b border-border">
          <Link
            href="/profil/me"
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors"
          >
            <div className="relative flex-shrink-0">
              <img
                src={userAvatar}
                alt={userName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">
                {userName}
              </p>
              <p className="text-xs text-text-muted truncate">
                {userNeighborhood}
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation — 8 items, same as sidebar */}
        <nav className="flex flex-col gap-1 px-2 py-4">
          {navItems.map((item) => {
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
                    ? 'bg-primary text-white shadow-md'
                    : 'text-text-primary hover:bg-background hover:text-primary'
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

        {/* Logout Button */}
        <div className="mt-auto pt-4 px-2 pb-6 border-t border-border">
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
