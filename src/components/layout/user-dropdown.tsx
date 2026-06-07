'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { User, Store, Heart, Settings, HelpCircle, LogOut, Shield, UserPlus, MessageCircle, CreditCard } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCurrentUser } from '@/lib/hooks/use-auth'

interface UserDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export function UserDropdown({ isOpen, onClose }: UserDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { profile, neighborhood } = useCurrentUser()

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 bg-surface border border-border rounded-lg shadow-lg z-50 w-64 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* User Info Header */}
      <Link href="/profil/me" onClick={onClose}>
        <div className="px-4 py-4 border-b border-border hover:bg-background transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-text-secondary rounded-full flex items-center justify-center text-white text-lg font-semibold flex-shrink-0">
              {profile?.full_name?.[0]?.toUpperCase() || 'K'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-text-primary truncate">{profile?.full_name || 'Kullanıcı'}</p>
              <p className="text-xs text-text-muted truncate">{neighborhood?.name || 'Mahalle'}</p>
            </div>
          </div>
        </div>
      </Link>

      {/* Menu Items */}
      <div className="py-2">
        {/* Profilim */}
        <Link
          href="/profil/me"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-text-primary hover:bg-background transition-colors"
        >
          <User className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">Profilim</span>
        </Link>

        {/* Mesajlar — sidebar'dan taşındı */}
        <Link
          href="/mesajlar"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-text-primary hover:bg-background transition-colors"
        >
          <MessageCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">Mesajlar</span>
        </Link>

        {/* İşletmem */}
        <Link
          href="/isletme-paneli"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-text-primary hover:bg-background transition-colors"
        >
          <Store className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">İşletmem</span>
        </Link>

        {/* Mahallemiz Kart — sidebar'dan taşındı */}
        <Link
          href="/mahallem-kart"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-text-primary hover:bg-background transition-colors"
        >
          <CreditCard className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">Mahallemiz Kart</span>
        </Link>

        {/* Favorilerim */}
        <Link
          href="/favoriler"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-text-primary hover:bg-background transition-colors"
        >
          <Heart className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">Favorilerim</span>
        </Link>

        {/* Komşularını Davet Et */}
        <Link
          href="/davet"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-text-primary hover:bg-background transition-colors"
        >
          <UserPlus className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">Komşularını Davet Et</span>
        </Link>

        <div className="my-1 border-t border-border" />

        {/* Ayarlar — sidebar'dan taşındı */}
        <Link
          href="/ayarlar"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-text-primary hover:bg-background transition-colors"
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">Ayarlar</span>
        </Link>

        {/* Yardım — sidebar'dan taşındı */}
        <Link
          href="/yardim"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-text-primary hover:bg-background transition-colors"
        >
          <HelpCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">Yardım</span>
        </Link>

        {/* Admin Paneli */}
        {profile?.is_admin === true && (
          <Link
            href="/admin"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 text-primary hover:bg-background transition-colors"
          >
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">Yönetici Paneli</span>
          </Link>
        )}

        <div className="my-1 border-t border-border" />

        {/* Çıkış Yap */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-background transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">Çıkış Yap</span>
        </button>
      </div>
    </div>
  )
}
