'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, MessageSquare, Search, ChevronDown, Menu } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { SearchDropdown } from './search-dropdown'
import { UserDropdown } from './user-dropdown'
import { MobileDrawer } from './mobile-drawer'
import { NotificationDropdown } from './notification-dropdown'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const unreadNotificationCount = 2 // Mock data - would come from state/API

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/ara?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-[#e0e0e0] shadow-sm">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between h-[56px] px-4">
          {/* Left: Hamburger Menu (Mobile) + Logo */}
          <div className="flex items-center gap-2 min-w-fit lg:min-w-[180px]">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden p-2 hover:bg-[#f0f2f5] rounded-full transition-colors"
              aria-label="Menüyü aç"
            >
              <Menu className="w-5 h-5 text-[#404040]" />
            </button>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-10 pr-4 py-2 bg-[#f0f2f5] border border-[#e0e0e0] rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e] transition"
            />
            <SearchDropdown
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
              searchQuery={searchQuery}
            />
          </div>
        </div>

        {/* Right: Icons + Avatar */}
        <div className="flex items-center gap-1 min-w-[180px] justify-end">
          <div className="relative">
            <button
              onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
              className={cn(
                "relative p-2.5 rounded-full hover:bg-[#f0f2f5] transition-colors",
                isNotificationDropdownOpen && "bg-[#f0f2f5]"
              )}
              aria-label="Bildirimler"
            >
              <Bell className="w-5 h-5 text-[#404040]" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {unreadNotificationCount}
                </span>
              )}
            </button>
            <NotificationDropdown
              isOpen={isNotificationDropdownOpen}
              onClose={() => setIsNotificationDropdownOpen(false)}
              unreadCount={unreadNotificationCount}
            />
          </div>

          <Link
            href="/mesajlar"
            className={cn(
              "relative p-2.5 rounded-full hover:bg-[#f0f2f5] transition-colors",
              pathname?.startsWith('/mesajlar') && "bg-[#f0f2f5]"
            )}
          >
            <MessageSquare className="w-5 h-5 text-[#404040]" />
          </Link>

          <div className="relative ml-1">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-[#404040] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                C
              </div>
              <ChevronDown className={cn(
                "w-3 h-3 text-gray-500 ml-0.5 hidden lg:block transition-transform duration-200",
                isUserDropdownOpen && "rotate-180"
              )} />
            </button>
            <UserDropdown
              isOpen={isUserDropdownOpen}
              onClose={() => setIsUserDropdownOpen(false)}
            />
          </div>
        </div>
      </div>
    </nav>

    {/* Mobile Drawer */}
    <MobileDrawer
      isOpen={isMobileDrawerOpen}
      onClose={() => setIsMobileDrawerOpen(false)}
    />
    </>
  )
}
