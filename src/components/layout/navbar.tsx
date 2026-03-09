'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, MessageSquare, Search, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#e0e0e0] shadow-sm">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between h-[56px] px-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 min-w-[180px]">
          <Link href="/" className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#00833e]" fill="currentColor">
              <path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z" />
            </svg>
            <span className="hidden lg:inline text-xl font-bold text-[#00833e]">KomşuApp</span>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-[600px] mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Mahallende ara..."
              className="w-full pl-10 pr-4 py-2 bg-[#f0f2f5] border border-[#e0e0e0] rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e] transition"
            />
          </div>
        </div>

        {/* Right: Icons + Avatar */}
        <div className="flex items-center gap-1 min-w-[180px] justify-end">
          <Link
            href="/bildirimler"
            className={cn(
              "relative p-2.5 rounded-full hover:bg-[#f0f2f5] transition-colors",
              pathname === '/bildirimler' && "bg-[#f0f2f5]"
            )}
          >
            <Bell className="w-5 h-5 text-[#404040]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </Link>

          <Link
            href="/mesajlar"
            className={cn(
              "relative p-2.5 rounded-full hover:bg-[#f0f2f5] transition-colors",
              pathname?.startsWith('/mesajlar') && "bg-[#f0f2f5]"
            )}
          >
            <MessageSquare className="w-5 h-5 text-[#404040]" />
          </Link>

          <Link href="/profil/me" className="ml-1 flex items-center">
            <div className="w-8 h-8 bg-[#404040] rounded-full flex items-center justify-center text-white text-sm font-semibold">
              C
            </div>
            <ChevronDown className="w-3 h-3 text-gray-500 ml-0.5 hidden lg:block" />
          </Link>
        </div>
      </div>
    </nav>
  )
}
