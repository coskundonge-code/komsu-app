'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, ShoppingBag, Edit3 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomBar() {
  const pathname = usePathname()

  const items = [
    { icon: Home, label: 'Ana Sayfa', href: '/' },
    { icon: Search, label: 'Ara', href: '/kesfet' },
    { icon: ShoppingBag, label: 'Satılık', href: '/pazar' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-[#e0e0e0]">
      <div className="flex items-center justify-around px-2 py-1">
        {items.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-2 min-w-[64px]',
                active ? 'text-[#00833e]' : 'text-[#8f8f8f]'
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}

        {/* Post button - green circle */}
        <Link
          href="/?post=new"
          className="flex flex-col items-center gap-0.5 px-3 py-1"
        >
          <div className="w-10 h-10 bg-[#00833e] rounded-full flex items-center justify-center shadow-md">
            <Edit3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-medium text-[#00833e]">Paylaş</span>
        </Link>
      </div>
    </div>
  )
}
