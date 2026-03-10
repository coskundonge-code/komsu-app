'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Store, Heart, Settings, HelpCircle, LogOut, Shield, UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface UserDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export function UserDropdown({ isOpen, onClose }: UserDropdownProps) {
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/giris')
    router.refresh()
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
      className="absolute top-full right-0 mt-2 bg-white border border-[#e0e0e0] rounded-lg shadow-lg z-50 w-64 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* User Info Header */}
      <Link href="/profil/me" onClick={onClose}>
        <div className="px-4 py-4 border-b border-[#e0e0e0] hover:bg-[#f0f2f5] transition-colors">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 bg-[#404040] rounded-full flex items-center justify-center text-white text-lg font-semibold flex-shrink-0">
              C
            </div>

            {/* User Details */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#333] truncate">Coşkun Dönge</p>
              <p className="text-xs text-[#8f8f8f] truncate">Akaretler Mahallesi</p>
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
          className="flex items-center gap-3 px-4 py-2.5 text-[#333] hover:bg-[#f0f2f5] transition-colors"
        >
          <User className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">Profilim</span>
        </Link>

        {/* İşletmem */}
        <Link
          href="/isletme-paneli"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-[#333] hover:bg-[#f0f2f5] transition-colors"
        >
          <Store className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">İşletmem</span>
        </Link>

        {/* Favorilerim */}
        <Link
          href="/favoriler"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-[#333] hover:bg-[#f0f2f5] transition-colors"
        >
          <Heart className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">Favorilerim</span>
        </Link>

        {/* Ayarlar */}
        <Link
          href="/ayarlar"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-[#333] hover:bg-[#f0f2f5] transition-colors"
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">Ayarlar</span>
        </Link>

        {/* Komşularını Davet Et */}
        <Link
          href="/davet"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-[#333] hover:bg-[#f0f2f5] transition-colors"
        >
          <UserPlus className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">Komşularını Davet Et</span>
        </Link>

        {/* Yardım */}
        <Link
          href="/yardim"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-[#333] hover:bg-[#f0f2f5] transition-colors"
        >
          <HelpCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">Yardım</span>
        </Link>

        {/* Admin Paneli */}
        <Link
          href="/admin"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-[#00833e] hover:bg-[#f0f2f5] transition-colors"
        >
          <Shield className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">Yönetici Paneli</span>
        </Link>

        {/* Divider */}
        <div className="my-2 border-t border-[#e0e0e0]" />

        {/* Çıkış Yap */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-[#f0f2f5] transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">Çıkış Yap</span>
        </button>
      </div>
    </div>
  )
}
