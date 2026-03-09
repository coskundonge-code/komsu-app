'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, ShoppingBag, Calendar, Users, AlertTriangle,
  Newspaper, Settings, HelpCircle, UserPlus
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const navItems = [
  { icon: Home, label: 'Ana Sayfa', href: '/' },
  { icon: ShoppingBag, label: 'Satılık ve Ücretsiz', href: '/pazar' },
  { icon: Newspaper, label: 'Yerel Haberler', href: '/kesfet' },
  { icon: AlertTriangle, label: 'Güvenlik Uyarıları', href: '/uyarilar' },
  { icon: Users, label: 'Gruplar', href: '/gruplar' },
  { icon: Calendar, label: 'Etkinlikler', href: '/etkinlikler' },
]

export function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'w-[220px] flex-shrink-0 hidden lg:flex flex-col py-4 px-2',
        className
      )}
      {...props}
    >
      {/* Navigation */}
      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium transition-colors',
                active
                  ? 'text-[#00833e] font-semibold'
                  : 'text-[#404040] hover:bg-white hover:shadow-sm'
              )}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", active && "text-[#00833e]")} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Post Button */}
      <div className="px-2 mt-4">
        <Link
          href="/?post=new"
          className="flex items-center justify-center w-full py-2.5 bg-[#00833e] hover:bg-[#006b32] text-white font-semibold text-[15px] rounded-full transition-colors"
        >
          Paylaş
        </Link>
      </div>

      {/* Footer links */}
      <div className="mt-auto pt-6 px-3 flex flex-col gap-2">
        <Link href="/ayarlar" className="flex items-center gap-2 text-sm text-[#8f8f8f] hover:text-[#404040] transition-colors">
          <Settings className="w-4 h-4" />
          Ayarlar
        </Link>
        <Link href="/yardim" className="flex items-center gap-2 text-sm text-[#8f8f8f] hover:text-[#404040] transition-colors">
          <HelpCircle className="w-4 h-4" />
          Yardım Merkezi
        </Link>
        <Link href="/mesajlar" className="flex items-center gap-2 text-sm text-[#8f8f8f] hover:text-[#404040] transition-colors">
          <UserPlus className="w-4 h-4" />
          Komşularını Davet Et
        </Link>
      </div>
    </aside>
  )
}
