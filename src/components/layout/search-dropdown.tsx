'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { MessageCircle, Tag, Calendar, Store, Users, FileText, X } from 'lucide-react'

interface SearchResult {
  id: string
  title: string
  type: 'post' | 'listing' | 'event' | 'business' | 'group'
  excerpt?: string
  icon: React.ReactNode
  href: string
}

interface SearchDropdownProps {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
}

const mockResults: SearchResult[] = [
  {
    id: '1',
    title: 'Komşu toplantısı düzenliyoruz',
    type: 'post',
    excerpt: 'Bu hafta sonu apartman bahçesinde toplantı yapacağız',
    icon: <FileText className="w-4 h-4" />,
    href: '/posts/1'
  },
  {
    id: '2',
    title: 'İkinci el bisiklet',
    type: 'listing',
    excerpt: 'Kullanılmamış, müzayede fiyatı: 800 TL',
    icon: <Tag className="w-4 h-4" />,
    href: '/listings/2'
  },
  {
    id: '3',
    title: 'Mahalle pikniği',
    type: 'event',
    excerpt: '15 Mart, Pazar günü 14:00',
    icon: <Calendar className="w-4 h-4" />,
    href: '/events/3'
  },
  {
    id: '4',
    title: 'Ali Usta Elektrikçi',
    type: 'business',
    excerpt: 'İzoleli elektrik kurulum ve tamirat',
    icon: <Store className="w-4 h-4" />,
    href: '/businesses/4'
  },
  {
    id: '5',
    title: 'Mahalle Gönüllüleri Grubu',
    type: 'group',
    excerpt: '342 üye • Sosyal aktiviteler ve paylaşım',
    icon: <Users className="w-4 h-4" />,
    href: '/groups/5'
  },
]

const categories = [
  { id: 'all', label: 'Tümü', type: null },
  { id: 'posts', label: 'Gönderi', type: 'post' },
  { id: 'listings', label: 'İlan', type: 'listing' },
  { id: 'events', label: 'Etkinlik', type: 'event' },
  { id: 'businesses', label: 'İşletme', type: 'business' },
  { id: 'groups', label: 'Grup', type: 'group' },
]

const typeColors: Record<string, string> = {
  post: 'bg-blue-100 text-blue-700',
  listing: 'bg-purple-100 text-purple-700',
  event: 'bg-orange-100 text-orange-700',
  business: 'bg-green-100 text-green-700',
  group: 'bg-pink-100 text-pink-700',
}

const typeLabels: Record<string, string> = {
  post: 'Gönderi',
  listing: 'İlan',
  event: 'Etkinlik',
  business: 'İşletme',
  group: 'Grup',
}

export function SearchDropdown({ isOpen, onClose, searchQuery }: SearchDropdownProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter results based on selected category
  const filteredResults = selectedCategory === 'all'
    ? mockResults
    : mockResults.filter(result => result.type === categories.find(c => c.id === selectedCategory)?.type)

  // Filter by search query
  const searchedResults = searchQuery
    ? filteredResults.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredResults

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
      className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#e0e0e0] rounded-lg shadow-lg z-40 w-full"
    >
      {/* Category Tabs */}
      <div className="flex items-center gap-1 px-4 pt-3 pb-3 border-b border-[#e0e0e0] overflow-x-auto">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? 'bg-[#00833e] text-white'
                : 'bg-[#f0f2f5] text-gray-700 hover:bg-[#e4e6eb]'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Search Results */}
      <div className="max-h-96 overflow-y-auto">
        {searchedResults.length > 0 ? (
          <div className="py-2">
            {searchedResults.map(result => (
              <Link
                key={result.id}
                href={result.href}
                onClick={onClose}
                className="flex items-start gap-3 px-4 py-3 hover:bg-[#f0f2f5] transition-colors border-b border-[#f0f2f5] last:border-b-0"
              >
                {/* Icon */}
                <div className="mt-1 text-[#00833e]">
                  {result.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 truncate">
                      {result.title}
                    </h4>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${typeColors[result.type]}`}>
                      {typeLabels[result.type]}
                    </span>
                  </div>
                  {result.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {result.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-4 py-8 text-center text-gray-500">
            <p className="text-sm">Sonuç bulunamadı</p>
          </div>
        )}
      </div>

      {/* Footer with brand color hint */}
      <div className="px-4 py-2 bg-[#f0f2f5] text-xs text-gray-600 border-t border-[#e0e0e0] rounded-b-lg">
        Daha fazla sonuç görmek için tam arama yap
      </div>
    </div>
  )
}
