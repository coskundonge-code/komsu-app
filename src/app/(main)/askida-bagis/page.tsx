'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Heart,
  Gift,
  Store,
  Wheat,
  Utensils,
  Droplet,
  Scissors,
  Coffee,
  Pill,
  BookOpen,
  ShoppingCart,
  Trash2,
  X,
  Check,
  Plus,
  Minus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images'

// Type definitions
interface Category {
  id: string
  name: string
  emoji: string
  icon: React.ReactNode
  label: string
}

interface Business {
  id: string
  name: string
  neighborhood: string
  mahalle: string
  category: string
  rating: number
  suspendedCount: number
  suspendedLabel: string
  image: string
  avatar: string
}

interface DonationItem {
  donor: string
  items: string
  business: string
  time: string
  isAnonymous: boolean
  avatar?: string
}

interface DonationModalState {
  isOpen: boolean
  business: Business | null
  quantity: number
  selectedItem: string
  isAnonymous: boolean
  message: string
  isProcessing: boolean
  isSuccess: boolean
}

// Categories
const categories: Category[] = [
  {
    id: 'all',
    name: 'Tümü',
    emoji: '🛒',
    icon: <ShoppingCart className="w-5 h-5" />,
    label: 'Tümü',
  },
  {
    id: 'bread',
    name: 'Askıda Ekmek',
    emoji: '🍞',
    icon: <Wheat className="w-5 h-5" />,
    label: 'Ekmek',
  },
  {
    id: 'meat',
    name: 'Askıda Et',
    emoji: '🥩',
    icon: <Utensils className="w-5 h-5" />,
    label: 'Et',
  },
  {
    id: 'milk',
    name: 'Askıda Süt',
    emoji: '🥛',
    icon: <Droplet className="w-5 h-5" />,
    label: 'Süt',
  },
  {
    id: 'barber',
    name: 'Askıda Traş',
    emoji: '✂️',
    icon: <Scissors className="w-5 h-5" />,
    label: 'Traş',
  },
  {
    id: 'coffee',
    name: 'Askıda Kahve',
    emoji: '☕',
    icon: <Coffee className="w-5 h-5" />,
    label: 'Kahve',
  },
  {
    id: 'medicine',
    name: 'Askıda İlaç',
    emoji: '💊',
    icon: <Pill className="w-5 h-5" />,
    label: 'İlaç',
  },
  {
    id: 'book',
    name: 'Askıda Kitap',
    emoji: '📚',
    icon: <BookOpen className="w-5 h-5" />,
    label: 'Kitap',
  },
  {
    id: 'cleaning',
    name: 'Askıda Temizlik',
    emoji: '🧹',
    icon: <Trash2 className="w-5 h-5" />,
    label: 'Temizlik',
  },
]

// Mock businesses data
const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'Sıcak Ekmek Fırını',
    neighborhood: 'Kadıköy',
    mahalle: 'Moda',
    category: 'bread',
    rating: 4.8,
    suspendedCount: 12,
    suspendedLabel: 'Askıda 12 ekmek var',
    image: getFeedImageUrl(0, 300, 250),
    avatar: getAvatarUrl('Sıcak Ekmek', 0),
  },
  {
    id: '2',
    name: 'Güven Kasabı',
    neighborhood: 'Kadıköy',
    mahalle: 'Caferağa',
    category: 'meat',
    rating: 4.7,
    suspendedCount: 3,
    suspendedLabel: 'Askıda 3 kg et var',
    image: getFeedImageUrl(1, 300, 250),
    avatar: getAvatarUrl('Güven Kasabı', 1),
  },
  {
    id: '3',
    name: 'Taze Mandıra',
    neighborhood: 'Kadıköy',
    mahalle: 'Moda',
    category: 'milk',
    rating: 4.9,
    suspendedCount: 8,
    suspendedLabel: 'Askıda 8 litre süt var',
    image: getFeedImageUrl(2, 300, 250),
    avatar: getAvatarUrl('Taze Mandıra', 2),
  },
  {
    id: '4',
    name: 'Ali Usta Berber',
    neighborhood: 'Kadıköy',
    mahalle: 'Caferağa',
    category: 'barber',
    rating: 4.6,
    suspendedCount: 5,
    suspendedLabel: 'Askıda 5 traş var',
    image: getFeedImageUrl(3, 300, 250),
    avatar: getAvatarUrl('Ali Usta Berber', 3),
  },
  {
    id: '5',
    name: 'Kahve Durağı',
    neighborhood: 'Kadıköy',
    mahalle: 'Moda',
    category: 'coffee',
    rating: 4.7,
    suspendedCount: 15,
    suspendedLabel: 'Askıda 15 kahve var',
    image: getFeedImageUrl(4, 300, 250),
    avatar: getAvatarUrl('Kahve Durağı', 4),
  },
  {
    id: '6',
    name: 'Hayat Eczanesi',
    neighborhood: 'Kadıköy',
    mahalle: 'Osmanağa',
    category: 'medicine',
    rating: 4.8,
    suspendedCount: 2,
    suspendedLabel: 'Askıda 2 ilaç paketi var',
    image: getFeedImageUrl(5, 300, 250),
    avatar: getAvatarUrl('Hayat Eczanesi', 5),
  },
  {
    id: '7',
    name: 'Kültür Kitapevi',
    neighborhood: 'Kadıköy',
    mahalle: 'Bahariye',
    category: 'book',
    rating: 4.7,
    suspendedCount: 20,
    suspendedLabel: 'Askıda 20 kitap var',
    image: getFeedImageUrl(6, 300, 250),
    avatar: getAvatarUrl('Kültür Kitapevi', 6),
  },
  {
    id: '8',
    name: 'Temiz Market',
    neighborhood: 'Kadıköy',
    mahalle: 'Moda',
    category: 'cleaning',
    rating: 4.5,
    suspendedCount: 4,
    suspendedLabel: 'Askıda 4 temizlik paketi var',
    image: getFeedImageUrl(7, 300, 250),
    avatar: getAvatarUrl('Temiz Market', 7),
  },
  {
    id: '9',
    name: 'Bereket Bakkal',
    neighborhood: 'Kadıköy',
    mahalle: 'Caferağa',
    category: 'bread',
    rating: 4.6,
    suspendedCount: 6,
    suspendedLabel: 'Askıda 6 erzak var',
    image: getFeedImageUrl(8, 300, 250),
    avatar: getAvatarUrl('Bereket Bakkal', 8),
  },
  {
    id: '10',
    name: 'Lezzet Lokantası',
    neighborhood: 'Kadıköy',
    mahalle: 'Moda',
    category: 'bread',
    rating: 4.8,
    suspendedCount: 10,
    suspendedLabel: 'Askıda 10 yemek var',
    image: getFeedImageUrl(9, 300, 250),
    avatar: getAvatarUrl('Lezzet Lokantası', 9),
  },
]

// Mock donation wall data
const mockDonations: DonationItem[] = [
  {
    donor: 'Anonim',
    items: '5 ekmek',
    business: 'Sıcak Ekmek Fırını',
    time: '2 saat önce',
    isAnonymous: true,
  },
  {
    donor: 'Ayşe H.',
    items: '2 kg et',
    business: 'Güven Kasabı',
    time: '4 saat önce',
    isAnonymous: false,
    avatar: getAvatarUrl('Ayşe H.', 1),
  },
  {
    donor: 'Anonim',
    items: '4 litre süt',
    business: 'Taze Mandıra',
    time: '6 saat önce',
    isAnonymous: true,
  },
  {
    donor: 'Mert D.',
    items: '3 traş hizmeti',
    business: 'Ali Usta Berber',
    time: '8 saat önce',
    isAnonymous: false,
    avatar: getAvatarUrl('Mert D.', 2),
  },
  {
    donor: 'Anonim',
    items: '10 kahve',
    business: 'Kahve Durağı',
    time: '1 gün önce',
    isAnonymous: true,
  },
  {
    donor: 'Zeynep K.',
    items: '1 ilaç paketi',
    business: 'Hayat Eczanesi',
    time: '1 gün önce',
    isAnonymous: false,
    avatar: getAvatarUrl('Zeynep K.', 3),
  },
  {
    donor: 'Anonim',
    items: '5 kitap',
    business: 'Kültür Kitapevi',
    time: '2 gün önce',
    isAnonymous: true,
  },
  {
    donor: 'Can B.',
    items: '2 temizlik paketi',
    business: 'Temiz Market',
    time: '2 gün önce',
    isAnonymous: false,
    avatar: getAvatarUrl('Can B.', 4),
  },
]

export default function AskidaBagisPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [donationModal, setDonationModal] = useState<DonationModalState>({
    isOpen: false,
    business: null,
    quantity: 1,
    selectedItem: 'standard',
    isAnonymous: false,
    message: '',
    isProcessing: false,
    isSuccess: false,
  })

  // Filter businesses by selected category
  const filteredBusinesses =
    selectedCategory === 'all'
      ? mockBusinesses
      : mockBusinesses.filter((b) => b.category === selectedCategory)

  const openDonationModal = (business: Business) => {
    setDonationModal({
      isOpen: true,
      business,
      quantity: 1,
      selectedItem: 'standard',
      isAnonymous: false,
      message: '',
      isProcessing: false,
      isSuccess: false,
    })
  }

  const closeDonationModal = () => {
    setDonationModal({
      ...donationModal,
      isOpen: false,
      isSuccess: false,
    })
  }

  const handleDonationSubmit = () => {
    setDonationModal({ ...donationModal, isProcessing: true })
    // Simulate payment processing
    setTimeout(() => {
      setDonationModal({ ...donationModal, isProcessing: false, isSuccess: true })
      // Auto-close after 2 seconds
      setTimeout(() => closeDonationModal(), 2000)
    }, 1500)
  }

  const getItemPrice = (category: string): number => {
    const prices: Record<string, number> = {
      bread: 12,
      meat: 50,
      milk: 18,
      barber: 25,
      coffee: 8,
      medicine: 100,
      book: 35,
      cleaning: 45,
    }
    return prices[category] || 50
  }

  const getTotalPrice = () => {
    if (!donationModal.business) return 0
    const basePrice = getItemPrice(donationModal.business.category)
    return basePrice * donationModal.quantity
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#00833e] via-[#009d4e] to-[#00833e] text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-10 text-6xl animate-pulse">💚</div>
          <div className="absolute bottom-4 left-10 text-6xl animate-pulse" style={{ animationDelay: '0.5s' }}>
            ❤️
          </div>
          <div className="absolute top-1/2 right-1/4 text-5xl animate-pulse" style={{ animationDelay: '1s' }}>
            🤝
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full">
            <Gift className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-bold mb-4">Askıda Bağış</h1>
          <p className="text-xl opacity-90 mb-8">Komşuna bir iyilik bırak, mahalleni güzelleştir</p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white bg-opacity-15 rounded-lg px-6 py-4 backdrop-blur">
              <div className="text-3xl font-bold mb-2">2,847</div>
              <div className="text-sm opacity-90">Toplam Askıda Ürün</div>
            </div>
            <div className="bg-white bg-opacity-15 rounded-lg px-6 py-4 backdrop-blur">
              <div className="text-3xl font-bold mb-2">₺42,350</div>
              <div className="text-sm opacity-90">Bu Ay Bağışlanan</div>
            </div>
            <div className="bg-white bg-opacity-15 rounded-lg px-6 py-4 backdrop-blur">
              <div className="text-3xl font-bold mb-2">1,246</div>
              <div className="text-sm opacity-90">Faydalanan Komşu</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Category Filters */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#333]">Kategori Seç</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap',
                  selectedCategory === category.id
                    ? 'bg-[#00833e] text-white shadow-md'
                    : 'bg-white text-[#404040] border border-[#e0e0e0] hover:border-[#00833e] hover:text-[#00833e]'
                )}
              >
                <span className="text-lg">{category.emoji}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Business Cards Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#333] mb-6">
            {selectedCategory === 'all' ? 'Tüm İşletmeler' : categories.find((c) => c.id === selectedCategory)?.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <div
                key={business.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-[#e0e0e0] hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Business Image */}
                <div className="relative h-48 w-full bg-[#f0f2f5] overflow-hidden">
                  <Image
                    src={business.image}
                    alt={business.name}
                    fill
                    unoptimized
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Business Info */}
                <div className="p-4 flex flex-col flex-grow">
                  {/* Name and Rating */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-[#333] text-lg">{business.name}</h3>
                      <p className="text-sm text-[#666]">
                        {business.neighborhood}, {business.mahalle}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-[#f0f2f5] px-2 py-1 rounded text-sm font-medium text-[#333]">
                      ⭐ {business.rating}
                    </div>
                  </div>

                  {/* Suspended Items */}
                  <div className="bg-[#e8f5e9] border-l-4 border-[#00833e] px-3 py-2 rounded mb-4">
                    <p className="text-sm font-medium text-[#00833e]">{business.suspendedLabel}</p>
                  </div>

                  {/* Donate Button */}
                  <button
                    onClick={() => openDonationModal(business)}
                    className="w-full bg-[#00833e] hover:bg-[#006b31] text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
                  >
                    <Heart className="w-4 h-4" />
                    Bağış Yap
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* How It Works */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#333] mb-6">Nasıl Çalışır?</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#00833e] text-white font-bold text-lg">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-[#333] mb-1">İşletme Seç</h3>
                  <p className="text-[#666]">Bağış yapmak istediğin esnafı ve kategorisini seç</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#00833e] text-white font-bold text-lg">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-[#333] mb-1">Ürün & Miktar Belirle</h3>
                  <p className="text-[#666]">Ne kadar bağışlamak istediğini seç ve öde</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#00833e] text-white font-bold text-lg">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-[#333] mb-1">Komşun Faydalansın</h3>
                  <p className="text-[#666]">İhtiyaç sahibi komşular ürünü esnaftan alır</p>
                </div>
              </div>
            </div>
          </div>

          {/* Community Stats */}
          <div>
            <h2 className="text-2xl font-bold text-[#333] mb-6">Topluluk İstatistikleri</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-[#e0e0e0]">
                <p className="text-sm text-[#666] mb-1">Bu Ay Toplam Bağış</p>
                <p className="text-2xl font-bold text-[#00833e]">₺42,350</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-[#e0e0e0]">
                <p className="text-sm text-[#666] mb-1">Faydalanan Aile</p>
                <p className="text-2xl font-bold text-[#00833e]">1,246</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-[#e0e0e0]">
                <p className="text-sm text-[#666] mb-1">En Çok Bağış Alan</p>
                <p className="text-lg font-bold text-[#333]">🍞 Askıda Ekmek</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-[#e0e0e0]">
                <p className="text-sm text-[#666] mb-1">Aktif İşletme</p>
                <p className="text-2xl font-bold text-[#00833e]">47</p>
              </div>
            </div>
          </div>
        </div>

        {/* Donation Wall */}
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-bold text-[#333] mb-6">Bağış Duvarı</h2>
          <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              {mockDonations.map((donation, index) => (
                <div
                  key={index}
                  className={cn(
                    'px-6 py-4 flex items-start gap-4',
                    index < mockDonations.length - 1 ? 'border-b border-[#e0e0e0]' : ''
                  )}
                >
                  {/* Avatar */}
                  {donation.isAnonymous ? (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#f0f2f5] flex items-center justify-center text-lg">
                      🙏
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={donation.avatar || ''}
                        alt={donation.donor}
                        width={40}
                        height={40}
                        unoptimized
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#333]">
                      <span className="font-bold">{donation.donor}</span>{' '}
                      <span className="text-[#666]">{donation.items} bağışladı</span>
                    </p>
                    <p className="text-xs text-[#8f8f8f] mt-1">
                      {donation.business} • {donation.time}
                    </p>
                  </div>

                  {/* Heart reaction */}
                  <button className="flex-shrink-0 text-[#00833e] hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      {donationModal.isOpen && donationModal.business && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-[#e0e0e0] bg-white">
              <h3 className="text-xl font-bold text-[#333]">Bağış Yap</h3>
              <button
                onClick={closeDonationModal}
                className="text-[#666] hover:text-[#333] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {!donationModal.isSuccess ? (
                <>
                  {/* Business Info */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Image
                        src={donationModal.business.avatar}
                        alt={donationModal.business.name}
                        width={48}
                        height={48}
                        unoptimized
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-bold text-[#333]">{donationModal.business.name}</p>
                        <p className="text-sm text-[#666]">
                          {donationModal.business.neighborhood}, {donationModal.business.mahalle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[#333] mb-3">Miktar</label>
                    <div className="flex items-center gap-4 bg-[#f0f2f5] p-4 rounded-lg">
                      <button
                        onClick={() =>
                          setDonationModal({
                            ...donationModal,
                            quantity: Math.max(1, donationModal.quantity - 1),
                          })
                        }
                        className="p-2 hover:bg-white rounded transition-colors"
                      >
                        <Minus className="w-5 h-5 text-[#00833e]" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={donationModal.quantity}
                        onChange={(e) =>
                          setDonationModal({
                            ...donationModal,
                            quantity: Math.max(1, parseInt(e.target.value) || 1),
                          })
                        }
                        className="flex-1 bg-white border border-[#e0e0e0] rounded px-3 py-2 text-center font-bold"
                      />
                      <button
                        onClick={() =>
                          setDonationModal({
                            ...donationModal,
                            quantity: donationModal.quantity + 1,
                          })
                        }
                        className="p-2 hover:bg-white rounded transition-colors"
                      >
                        <Plus className="w-5 h-5 text-[#00833e]" />
                      </button>
                    </div>
                    <p className="text-xs text-[#8f8f8f] mt-2">
                      {donationModal.business.category === 'bread' && '1 ekmek = 12₺'}
                      {donationModal.business.category === 'meat' && '1 kg et = 50₺'}
                      {donationModal.business.category === 'milk' && '1 litre süt = 18₺'}
                      {donationModal.business.category === 'barber' && '1 traş = 25₺'}
                      {donationModal.business.category === 'coffee' && '1 kahve = 8₺'}
                      {donationModal.business.category === 'medicine' && '1 paket ilaç = 100₺'}
                      {donationModal.business.category === 'book' && '1 kitap = 35₺'}
                      {donationModal.business.category === 'cleaning' && '1 paket temizlik = 45₺'}
                    </p>
                  </div>

                  {/* Anonymous Toggle */}
                  <div className="mb-6 flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={donationModal.isAnonymous}
                      onChange={(e) =>
                        setDonationModal({ ...donationModal, isAnonymous: e.target.checked })
                      }
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="anonymous" className="text-sm text-[#404040] cursor-pointer">
                      Anonim bağış yap
                    </label>
                  </div>

                  {/* Message */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[#333] mb-2">
                      Mesaj (İsteğe bağlı)
                    </label>
                    <textarea
                      value={donationModal.message}
                      onChange={(e) =>
                        setDonationModal({ ...donationModal, message: e.target.value })
                      }
                      placeholder="Komşulara bir mesaj bırak..."
                      className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00833e] resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Price Summary */}
                  <div className="bg-[#f0f2f5] rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#666]">Birim Fiyatı:</span>
                      <span className="font-medium text-[#333]">
                        ₺{getItemPrice(donationModal.business.category)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-3 pb-3 border-b border-[#e0e0e0]">
                      <span className="text-[#666]">Miktar:</span>
                      <span className="font-medium text-[#333]">{donationModal.quantity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#333]">Toplam:</span>
                      <span className="text-2xl font-bold text-[#00833e]">₺{getTotalPrice()}</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleDonationSubmit}
                    disabled={donationModal.isProcessing}
                    className="w-full bg-[#00833e] hover:bg-[#006b31] disabled:opacity-70 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {donationModal.isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        İşleniyor...
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5" />
                        Bağışı Tamamla
                      </>
                    )}
                  </button>
                </>
              ) : (
                // Success State
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#e8f5e9] rounded-full mb-4">
                    <Check className="w-8 h-8 text-[#00833e]" />
                  </div>
                  <h4 className="text-xl font-bold text-[#333] mb-2">Bağışınız Alındı!</h4>
                  <p className="text-[#666] mb-6">
                    {donationModal.isAnonymous ? 'Anonim bir komşu' : 'Siz'} {donationModal.quantity} adet{' '}
                    {donationModal.business.name} tarafından bağışlandı.
                  </p>
                  <p className="text-sm text-[#8f8f8f]">
                    İhtiyaç sahibi komşularımız kısa sürede bu bağıştan yararlanacaklar. Çok teşekkürler!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
