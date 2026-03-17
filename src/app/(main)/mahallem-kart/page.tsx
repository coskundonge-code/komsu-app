'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  CreditCard,
  Gift,
  Star,
  MapPin,
  QrCode,
  CheckCircle,
  Search,
  Sparkles,
  Clock,
  Percent,
  ShoppingCart,
  Heart,
  Filter,
  ChevronRight,
  Users,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images'

interface Discount {
  id: string
  name: string
  category: string
  discount: number
  description: string
  validUntil: string
  logo?: string
}

interface Transaction {
  id: string
  date: string
  business: string
  discount: number
  pointsEarned: number
}

interface EarnMethod {
  id: string
  title: string
  description: string
  points: number
  icon: React.ReactNode
}

const DISCOUNTS: Discount[] = [
  {
    id: '1',
    name: 'Moda Fırını',
    category: 'Fırın',
    discount: 10,
    description: 'Taze ekmek ve pastaneler',
    validUntil: '31 Aralık 2024',
    logo: '🍞',
  },
  {
    id: '2',
    name: 'Kadıköy Kasabı',
    category: 'Kasap',
    discount: 15,
    description: 'Kıyma ve kuşbaşı',
    validUntil: '28 Şubat 2024',
    logo: '🥩',
  },
  {
    id: '3',
    name: 'Yeşil Manav',
    category: 'Manav',
    discount: 10,
    description: 'Mevsim meyveleri ve sebzeleri',
    validUntil: '30 Aralık 2024',
    logo: '🥬',
  },
  {
    id: '4',
    name: 'Ali Usta Berber',
    category: 'Berber/Kuaför',
    discount: 20,
    description: 'Saç traşı ve saç bakımı',
    validUntil: '15 Ocak 2025',
    logo: '✂️',
  },
  {
    id: '5',
    name: 'Semt Kafe',
    category: 'Kafe',
    discount: 15,
    description: 'Tüm içecekler ve kahveler',
    validUntil: '31 Aralık 2024',
    logo: '☕',
  },
  {
    id: '6',
    name: 'Lezzet Lokantası',
    category: 'Restaurant',
    discount: 10,
    description: 'Öğle menüsü ve spesyal yemekler',
    validUntil: '28 Şubat 2024',
    logo: '🍽️',
  },
  {
    id: '7',
    name: 'Komşu Market',
    category: 'Market',
    discount: 5,
    description: 'Tüm ürünler ve gıda maddeler',
    validUntil: '31 Aralık 2024',
    logo: '🛒',
  },
  {
    id: '8',
    name: 'Hayat Eczanesi',
    category: 'Eczane',
    discount: 10,
    description: 'Dermokozmetik ve vitamin ürünleri',
    validUntil: '31 Ocak 2025',
    logo: '💊',
  },
  {
    id: '9',
    name: 'Deniz Balık Pazarı',
    category: 'Kasap',
    discount: 12,
    description: 'Taze balık ve deniz ürünleri',
    validUntil: '20 Aralık 2024',
    logo: '🐟',
  },
  {
    id: '10',
    name: 'Saray Pastanesi',
    category: 'Fırın',
    discount: 8,
    description: 'Özel pasta ve kurabiye',
    validUntil: '25 Ocak 2025',
    logo: '🎂',
  },
]

const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    date: '14 Aralık 2024',
    business: 'Semt Kafe',
    discount: 15,
    pointsEarned: 75,
  },
  {
    id: '2',
    date: '12 Aralık 2024',
    business: 'Yeşil Manav',
    discount: 10,
    pointsEarned: 60,
  },
  {
    id: '3',
    date: '10 Aralık 2024',
    business: 'Moda Fırını',
    discount: 10,
    pointsEarned: 50,
  },
  {
    id: '4',
    date: '8 Aralık 2024',
    business: 'Ali Usta Berber',
    discount: 20,
    pointsEarned: 100,
  },
  {
    id: '5',
    date: '5 Aralık 2024',
    business: 'Kadıköy Kasabı',
    discount: 15,
    pointsEarned: 85,
  },
  {
    id: '6',
    date: '2 Aralık 2024',
    business: 'Komşu Market',
    discount: 5,
    pointsEarned: 30,
  },
]

const EARN_METHODS: EarnMethod[] = [
  {
    id: '1',
    title: 'Alışveriş Yap',
    description: 'Mahalle esnaflarında harcama yap ve ödemen için puan kazan',
    points: 50,
    icon: <ShoppingCart className="w-6 h-6" />,
  },
  {
    id: '2',
    title: 'Askıda Bağış Yap',
    description: 'İhtiyaç sahibi komşularımız için bağış yap ve puan kazan',
    points: 100,
    icon: <Gift className="w-6 h-6" />,
  },
  {
    id: '3',
    title: 'Etkinliğe Katıl',
    description: 'Mahalle etkinliklerine ve buluşmalara katıl',
    points: 75,
    icon: <Users className="w-6 h-6" />,
  },
  {
    id: '4',
    title: 'Komşu Davet Et',
    description: 'Arkadaşlarını Mahallem uygulamasına davet et',
    points: 150,
    icon: <Zap className="w-6 h-6" />,
  },
]

const CATEGORIES = [
  'Tümü',
  'Fırın',
  'Kasap',
  'Manav',
  'Berber/Kuaför',
  'Kafe',
  'Restaurant',
  'Market',
  'Eczane',
]

export default function MahallemKartPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDiscounts = DISCOUNTS.filter((discount) => {
    const matchesCategory =
      selectedCategory === 'Tümü' || discount.category === selectedCategory
    const matchesSearch =
      discount.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discount.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Hero Section - Digital Card */}
      <section className="relative pt-6 pb-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Card with animated glow */}
          <div className="relative">
            {/* Glow effect background */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00833e] to-[#006b32] rounded-3xl blur-xl opacity-30 animate-pulse"></div>

            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-[#00833e] to-[#006b32] rounded-3xl p-5 sm:p-8 text-white shadow-2xl overflow-hidden">
              {/* Card background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16"></div>
              </div>

              {/* Card content */}
              <div className="relative z-10">
                {/* Header with card number and badge */}
                <div className="flex justify-between items-start mb-6 sm:mb-8">
                  <div>
                    <p className="text-sm font-semibold opacity-90">Mahallem Kartı</p>
                    <p className="text-xs opacity-75 mt-1">MK-2024-00847</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    Doğrulanmış
                  </div>
                </div>

                {/* User Info and QR Code */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                  <div className="col-span-1 sm:col-span-2">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-16 h-16 rounded-full border-2 border-white overflow-hidden">
                        <Image
                          src={getAvatarUrl('Ayşe Kaya', 0)}
                          alt="User Avatar"
                          width={64}
                          height={64}
                          unoptimized
                          className="w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="text-lg font-bold">Ayşe Kaya</p>
                        <p className="text-sm opacity-90">Kadıköy, İstanbul</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm opacity-90">
                      <Calendar className="w-4 h-4" />
                      <span>Üye olunca: 14 Ağustos 2022</span>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center shadow-lg">
                      <QrCode className="w-16 h-16 text-[#00833e]" />
                    </div>
                    <p className="text-xs opacity-75 mt-2 text-center">QR Kodunuz</p>
                  </div>
                </div>

                {/* Card chip and numbers */}
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs opacity-75 mb-1">KART SAHİBİ</p>
                    <p className="font-semibold">AYŞE KAYA</p>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-1 justify-end mb-2">
                      <div className="w-3 h-3 bg-yellow-300 rounded-full"></div>
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    </div>
                    <p className="text-xs opacity-75">GEÇERLI</p>
                    <p className="font-semibold">12/26</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 md:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-[#333] mb-6">İstatistiklerim</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#e0e0e0]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#8f8f8f] text-sm font-medium mb-2">
                    Toplam Puan
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#333]">1.250</p>
                </div>
                <Star className="w-8 h-8 text-[#00833e]" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#e0e0e0]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#8f8f8f] text-sm font-medium mb-2">
                    Kullanılan İndirimler
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#333]">23</p>
                </div>
                <Percent className="w-8 h-8 text-[#00833e]" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#e0e0e0]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#8f8f8f] text-sm font-medium mb-2">
                    Askıda Bağışlar
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#333]">8</p>
                </div>
                <Gift className="w-8 h-8 text-[#00833e]" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#e0e0e0]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#8f8f8f] text-sm font-medium mb-2">
                    Üye Süresi
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#333]">2 yıl</p>
                </div>
                <Clock className="w-8 h-8 text-[#00833e]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Discounts Section */}
      <section className="px-4 md:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#333]">Yakındaki İndirimler</h2>
            <button className="flex items-center gap-2 text-[#00833e] hover:text-[#006b32] font-semibold">
              Tümünü Gör
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8f8f8f]" />
              <input
                type="text"
                placeholder="İşletme ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#e0e0e0] bg-white text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e]/20"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 -webkit-overflow-scrolling: touch">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all',
                    selectedCategory === category
                      ? 'bg-[#00833e] text-white'
                      : 'bg-white text-[#333] border border-[#e0e0e0] hover:border-[#00833e]'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Discounts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredDiscounts.map((discount) => (
              <div
                key={discount.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e0e0e0] hover:shadow-md hover:border-[#00833e] transition-all"
              >
                {/* Logo/Image */}
                <div className="w-full h-32 bg-gradient-to-br from-[#00833e]/10 to-[#00833e]/5 flex items-center justify-center text-4xl">
                  {discount.logo}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-[#333] text-lg mb-1">
                    {discount.name}
                  </h3>
                  <p className="text-xs text-[#8f8f8f] mb-2">{discount.category}</p>
                  <p className="text-sm text-[#404040] mb-3">{discount.description}</p>

                  {/* Discount badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="inline-flex items-center gap-1 bg-[#00833e]/10 px-2 py-1 rounded-lg">
                      <Percent className="w-4 h-4 text-[#00833e]" />
                      <span className="font-bold text-[#00833e]">%{discount.discount}</span>
                    </div>
                    <span className="text-xs text-[#8f8f8f] ml-auto">
                      İndirim
                    </span>
                  </div>

                  {/* Valid until */}
                  <div className="flex items-center gap-2 text-xs text-[#8f8f8f] mb-4">
                    <Calendar className="w-3 h-3" />
                    <span>{discount.validUntil}</span>
                  </div>

                  {/* Use button */}
                  <button className="w-full py-2 rounded-lg bg-[#00833e] hover:bg-[#006b32] text-white font-semibold transition-colors">
                    Kullan
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredDiscounts.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-[#e0e0e0] mx-auto mb-4" />
              <p className="text-[#8f8f8f]">İndirim bulunamadı</p>
            </div>
          )}
        </div>
      </section>

      {/* Transaction History Section */}
      <section className="px-4 md:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#333]">Kart Geçmişi</h2>
            <button className="flex items-center gap-2 text-[#00833e] hover:text-[#006b32] font-semibold">
              Tümünü Gör
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-[#e0e0e0] overflow-hidden">
            <div className="divide-y divide-[#e0e0e0]">
              {TRANSACTIONS.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-4 hover:bg-[#f0f2f5] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-[#333]">
                        {transaction.business}
                      </p>
                      <p className="text-sm text-[#8f8f8f]">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#00833e]">
                        -%{transaction.discount}
                      </p>
                      <p className="text-sm text-[#8f8f8f]">
                        +{transaction.pointsEarned} puan
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Earn Points Section */}
      <section className="px-4 md:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-[#333] mb-6">Puan Kazan</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {EARN_METHODS.map((method) => (
              <div
                key={method.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0e0e0] hover:shadow-md hover:border-[#00833e] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#00833e]/10 flex items-center justify-center text-[#00833e]">
                    {method.icon}
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-[#00833e]/10 text-[#00833e] font-bold text-sm">
                    +{method.points}
                  </div>
                </div>

                <h3 className="font-bold text-[#333] mb-2">{method.title}</h3>
                <p className="text-sm text-[#8f8f8f]">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-6 py-12">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-[#00833e] to-[#006b32] rounded-3xl p-6 sm:p-8 md:p-12 text-white text-center">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Daha Fazla Indirim Kazan
          </h2>
          <p className="text-base sm:text-lg opacity-90 mb-8">
            Mahalle esnaflarında harcama yap ve puan biriktir, ödünü al!
          </p>
          <button className="bg-white hover:bg-gray-100 text-[#00833e] font-bold py-3 px-8 rounded-xl transition-colors">
            Komşuları Davet Et
          </button>
        </div>
      </section>
    </div>
  )
}

function Calendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  )
}
