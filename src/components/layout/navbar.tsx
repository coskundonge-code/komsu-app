'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, Search, ChevronDown, Menu, Plus } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { SearchDropdown } from './search-dropdown'
import { UserDropdown } from './user-dropdown'
import { MobileDrawer } from './mobile-drawer'
import { NotificationDropdown } from './notification-dropdown'

export function Navbar() {
  const router = useRouter()
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const unreadNotificationCount = 2

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/ara?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setIsSearchFocused(false)
    }
    if (e.key === 'Escape') {
      setIsSearchOpen(false)
      setIsSearchFocused(false)
    }
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false)
        setIsSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <nav className="sticky top-0 z-50 bg-surface border-b border-border shadow-xs">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2 min-w-fit lg:min-w-[200px]">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden p-2 hover:bg-surface-hover rounded-full transition-colors"
              aria-label="Menüyü aç"
            >
              <Menu className="w-5 h-5 text-text-secondary" />
            </button>
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:bg-primary-hover transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                  <path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z" />
                </svg>
              </div>
              <span className="hidden lg:inline text-xl font-bold text-primary">Mahallem</span>
            </Link>
          </div>

          <div ref={searchRef} className={cn("flex-1 mx-4 transition-all duration-300", isSearchFocused ? "max-w-[640px]" : "max-w-[520px]")}>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              <input
                type="text"
                placeholder="Mahallende ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { setIsSearchOpen(true); setIsSearchFocused(true) }}
                onKeyDown={handleSearchKeyDown}
                className={cn(
                  "w-full pl-10 pr-4 py-2 bg-background border rounded-full text-sm text-text-primary placeholder:text-text-muted focus:outline-none transition-all duration-200",
                  isSearchFocused
                    ? "border-primary ring-2 ring-primary-light bg-surface"
                    : "border-border hover:border-gray-300"
                )}
              />
              <SearchDropdown
                isOpen={isSearchOpen}
                onClose={() => { setIsSearchOpen(false); setIsSearchFocused(false) }}
                searchQuery={searchQuery}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 min-w-fit lg:min-w-[200px] justify-end">
            <Link
              href="/?post=new"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-hover transition-colors shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Paylas</span>
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                className={cn(
                  "relative p-2.5 rounded-full hover:bg-surface-hover transition-colors",
                  isNotificationDropdownOpen && "bg-surface-active"
                )}
                aria-label="Bildirimler"
              >
                <Bell className="w-5 h-5 text-text-secondary" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-error rounded-full flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-surface">
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

            <div className="relative ml-0.5">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-1 p-1 rounded-full hover:bg-surface-hover transition-colors"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold ring-2 ring-transparent hover:ring-primary-light transition-all">
                  C
                </div>
                <ChevronDown className={cn(
                  "w-3.5 h-3.5 text-text-muted hidden lg:block transition-transform duration-200",
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

      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />
    </>
  )
}
