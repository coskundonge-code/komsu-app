'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, MessageCircle, Search, Home, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavbarProps {
  onMenuToggle?: (open: boolean) => void
}

export function Navbar({ onMenuToggle }: NavbarProps) {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-[1100px] mx-auto flex items-center justify-between h-14 px-4">
        {/* Left: Logo + Neighborhood */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
          </Link>
          <span className="hidden sm:inline text-sm font-semibold text-gray-800">Kadıköy, Moda</span>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink href="/" icon={<Home className="w-5 h-5" />} label="Ana Sayfa" active={pathname === '/'} />
          <NavLink href="/kesfet" icon={<Search className="w-5 h-5" />} label="Keşfet" active={pathname === '/kesfet'} />
          <NavLink href="/pazar" icon={<ShoppingBag className="w-5 h-5" />} label="Pazar" active={pathname?.startsWith('/pazar')} />
        </div>

        {/* Right: Notifications, Messages, Profile */}
        <div className="flex items-center gap-1">
          <Link href="/bildirimler" className={cn(
            "relative p-2 rounded-full hover:bg-gray-100 transition-colors",
            pathname === '/bildirimler' && "bg-gray-100"
          )}>
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Link>
          <Link href="/mesajlar" className={cn(
            "relative p-2 rounded-full hover:bg-gray-100 transition-colors",
            pathname?.startsWith('/mesajlar') && "bg-gray-100"
          )}>
            <MessageCircle className="w-5 h-5 text-gray-700" />
          </Link>
          <Link href="/profil/me" className="ml-1">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
              C
            </div>
          </Link>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link href={href} className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
      active ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-100"
    )}>
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </Link>
  )
}
