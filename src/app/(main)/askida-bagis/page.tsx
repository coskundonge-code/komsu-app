'use client'

import { useState, useEffect } from 'react'
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
  QrCode,
  Eye,
  EyeOff,
  Send,
  MessageCircle,
  ScanLine,
  Shield,
  Star,
  Copy,
  Share2,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images'
import { createClient } from '@/lib/supabase/client'
import { useCurrentUser } from '@/lib/hooks/use-auth'
import { getDonations, createDonation, claimDonation } from '@/lib/hooks/use-donations'

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
  id: string
  donor: string
  items: string
  business: string
  time: string
  isAnonymous: boolean
  avatar?: string
  hasThankYou?: boolean
  thankYouMessage?: string
  thankYouFrom?: string
  thankYouAnonymous?: boolean
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
  qrCode: string
}

interface RedeemModalState {
  isOpen: boolean
  step: 'scan' | 'confirm' | 'success'
  qrCode: string
  isAnonymous: boolean
  donationInfo: {
    business: string
    item: string
    quantity: number
    donor: string
    donorAnonymous: boolean
  } | null
}

interface ThankYouModalState {
  isOpen: boolean
  donationId: string
  donorName: string
  donorAnonymous: boolean
  message: string
  isAnonymous: boolean
  isSent: boolean
}

// Categories
const categories: Category[] = [
  { id: 'all', name: 'Tümü', emoji: '🛒', icon: <ShoppingCart className="w-5 h-5" />, label: 'Tümü' },
  { id: 'bread', name: 'Askıda Ekmek', emoji: '🍞', icon: <Wheat className="w-5 h-5" />, label: 'Ekmek' },
  { id: 'meat', name: 'Askıda Et', emoji: '🥩', icon: <Utensils className="w-5 h-5" />, label: 'Et' },
  { id: 'milk', name: 'Askıda Süt', emoji: '🥛', icon: <Droplet className="w-5 h-5" />, label: 'Süt' },
  { id: 'barber', name: 'Askıda Traş', emoji: '✂️', icon: <Scissors className="w-5 h-5" />, label: 'Traş' },
  { id: 'coffee', name: 'Askıda Kahve', emoji: '☕', icon: <Coffee className="w-5 h-5" />, label: 'Kahve' },
  { id: 'medicine', name: 'Askıda İlaç', emoji: '💊', icon: <Pill className="w-5 h-5" />, label: 'İlaç' },
  { id: 'book', name: 'Askıda Kitap', emoji: '📚', icon: <BookOpen className="w-5 h-5" />, label: 'Kitap' },
  { id: 'cleaning', name: 'Askıda Temizlik', emoji: '🧹', icon: <Trash2 className="w-5 h-5" />, label: 'Temizlik' },
]

// Mock businesses
const mockBusinesses: Business[] = [
  { id: '1', name: 'Sıcak Ekmek Fırını', neighborhood: 'Kadıköy', mahalle: 'Moda', category: 'bread', rating: 4.8, suspendedCount: 12, suspendedLabel: 'Askıda 12 ekmek', image: getFeedImageUrl(0, 300, 250), avatar: getAvatarUrl('Sıcak Ekmek', 0) },
  { id: '2', name: 'Güven Kasabı', neighborhood: 'Kadıköy', mahalle: 'Caferağa', category: 'meat', rating: 4.7, suspendedCount: 3, suspendedLabel: 'Askıda 3 kg et', image: getFeedImageUrl(1, 300, 250), avatar: getAvatarUrl('Güven Kasabı', 1) },
  { id: '3', name: 'Taze Mandıra', neighborhood: 'Kadıköy', mahalle: 'Moda', category: 'milk', rating: 4.9, suspendedCount: 8, suspendedLabel: 'Askıda 8 litre süt', image: getFeedImageUrl(2, 300, 250), avatar: getAvatarUrl('Taze Mandıra', 2) },
  { id: '4', name: 'Ali Usta Berber', neighborhood: 'Kadıköy', mahalle: 'Caferağa', category: 'barber', rating: 4.6, suspendedCount: 5, suspendedLabel: 'Askıda 5 traş', image: getFeedImageUrl(3, 300, 250), avatar: getAvatarUrl('Ali Usta Berber', 3) },
  { id: '5', name: 'Kahve Durağı', neighborhood: 'Kadıköy', mahalle: 'Moda', category: 'coffee', rating: 4.7, suspendedCount: 15, suspendedLabel: 'Askıda 15 kahve', image: getFeedImageUrl(4, 300, 250), avatar: getAvatarUrl('Kahve Durağı', 4) },
  { id: '6', name: 'Hayat Eczanesi', neighborhood: 'Kadıköy', mahalle: 'Osmanağa', category: 'medicine', rating: 4.8, suspendedCount: 2, suspendedLabel: 'Askıda 2 ilaç paketi', image: getFeedImageUrl(5, 300, 250), avatar: getAvatarUrl('Hayat Eczanesi', 5) },
  { id: '7', name: 'Kültür Kitapevi', neighborhood: 'Kadıköy', mahalle: 'Bahariye', category: 'book', rating: 4.7, suspendedCount: 20, suspendedLabel: 'Askıda 20 kitap', image: getFeedImageUrl(6, 300, 250), avatar: getAvatarUrl('Kültür Kitapevi', 6) },
  { id: '8', name: 'Temiz Market', neighborhood: 'Kadıköy', mahalle: 'Moda', category: 'cleaning', rating: 4.5, suspendedCount: 4, suspendedLabel: 'Askıda 4 temizlik paketi', image: getFeedImageUrl(7, 300, 250), avatar: getAvatarUrl('Temiz Market', 7) },
  { id: '9', name: 'Bereket Bakkal', neighborhood: 'Kadıköy', mahalle: 'Caferağa', category: 'bread', rating: 4.6, suspendedCount: 6, suspendedLabel: 'Askıda 6 erzak', image: getFeedImageUrl(8, 300, 250), avatar: getAvatarUrl('Bereket Bakkal', 8) },
  { id: '10', name: 'Lezzet Lokantası', neighborhood: 'Kadıköy', mahalle: 'Moda', category: 'bread', rating: 4.8, suspendedCount: 10, suspendedLabel: 'Askıda 10 yemek', image: getFeedImageUrl(9, 300, 250), avatar: getAvatarUrl('Lezzet Lokantası', 9) },
]

// Mock donation wall
const mockDonations: DonationItem[] = [
  { id: 'd1', donor: 'Anonim', items: '5 ekmek', business: 'Sıcak Ekmek Fırını', time: '2 saat önce', isAnonymous: true, hasThankYou: true, thankYouMessage: 'Allah razı olsun, çok teşekkürler!', thankYouFrom: 'Fatma T.', thankYouAnonymous: false },
  { id: 'd2', donor: 'Ayşe H.', items: '2 kg et', business: 'Güven Kasabı', time: '4 saat önce', isAnonymous: false, avatar: getAvatarUrl('Ayşe H.', 1), hasThankYou: true, thankYouMessage: 'Çok sağolun, aileme bayram ettirdiniz!', thankYouFrom: 'Anonim Komşu', thankYouAnonymous: true },
  { id: 'd3', donor: 'Anonim', items: '4 litre süt', business: 'Taze Mandıra', time: '6 saat önce', isAnonymous: true },
  { id: 'd4', donor: 'Mert D.', items: '3 traş hizmeti', business: 'Ali Usta Berber', time: '8 saat önce', isAnonymous: false, avatar: getAvatarUrl('Mert D.', 2), hasThankYou: true, thankYouMessage: 'Sağolasın kardeşim, benim için çok değerli!', thankYouFrom: 'Hasan A.', thankYouAnonymous: false },
  { id: 'd5', donor: 'Anonim', items: '10 kahve', business: 'Kahve Durağı', time: '1 gün önce', isAnonymous: true },
  { id: 'd6', donor: 'Zeynep K.', items: '1 ilaç paketi', business: 'Hayat Eczanesi', time: '1 gün önce', isAnonymous: false, avatar: getAvatarUrl('Zeynep K.', 3) },
  { id: 'd7', donor: 'Anonim', items: '5 kitap', business: 'Kültür Kitapevi', time: '2 gün önce', isAnonymous: true, hasThankYou: true, thankYouMessage: 'Kitaplar harika, çocuklarım çok sevindi!', thankYouFrom: 'Anonim Komşu', thankYouAnonymous: true },
  { id: 'd8', donor: 'Can B.', items: '2 temizlik paketi', business: 'Temiz Market', time: '2 gün önce', isAnonymous: false, avatar: getAvatarUrl('Can B.', 4) },
]

// Generate fake QR code ID
function generateQRCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'MHL-'
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    if (i < 2) code += '-'
  }
  return code
}

export default function AskidaBagisPage() {
  const { user, profile, neighborhood } = useCurrentUser()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'donate' | 'redeem'>('donate')
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [donations, setDonations] = useState<DonationItem[]>(mockDonations)
  const [donationStats, setDonationStats] = useState({ total: mockDonations.length, items: 47, businesses: 8 })

  const [donationModal, setDonationModal] = useState<DonationModalState>({
    isOpen: false,
    business: null,
    quantity: 1,
    selectedItem: 'standard',
    isAnonymous: false,
    message: '',
    isProcessing: false,
    isSuccess: false,
    qrCode: '',
  })

  const [redeemModal, setRedeemModal] = useState<RedeemModalState>({
    isOpen: false,
    step: 'scan',
    qrCode: '',
    isAnonymous: false,
    donationInfo: null,
  })

  const [thankYouModal, setThankYouModal] = useState<ThankYouModalState>({
    isOpen: false,
    donationId: '',
    donorName: '',
    donorAnonymous: false,
    message: '',
    isAnonymous: false,
    isSent: false,
  })

  // Fetch donations from Supabase
  useEffect(() => {
    async function fetchDonations() {
      const { data, error } = await getDonations({ status: 'available', limit: 20 })
      if (!error && data && data.length > 0) {
        const mapped: DonationItem[] = data.map((d: any, i: number) => ({
          id: d.id,
          donor: d.profiles?.full_name || 'Anonim',
          items: d.title,
          business: d.businesses?.name || 'İşletme',
          time: new Date(d.created_at).toLocaleDateString('tr-TR'),
          isAnonymous: false,
          avatar: d.profiles?.avatar_url || undefined,
        }))
        setDonations(mapped)
        setDonationStats({ total: mapped.length, items: data.reduce((s: number, d: any) => s + (d.quantity || 1), 0), businesses: new Set(data.map((d: any) => d.business_id).filter(Boolean)).size || 8 })
      }
    }
    fetchDonations()
  }, [])

  // Fetch businesses from Supabase
  useEffect(() => {
    async function fetchBusinesses() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .limit(10) as any

        if (error) {
          console.warn('Could not fetch businesses:', error)
          setBusinesses(mockBusinesses)
          return
        }

        if (data && data.length > 0) {
          const mappedBusinesses = data.map((business: any, index: number) => ({
            id: business.id,
            name: business.name,
            neighborhood: 'Kadıköy',
            mahalle: 'Moda',
            category: ['bread', 'meat', 'milk', 'barber', 'coffee', 'medicine', 'book', 'cleaning'][index % 8],
            rating: 4.5 + (index % 5) * 0.1,
            suspendedCount: 2 + (index % 10),
            suspendedLabel: `Askıda ${2 + (index % 10)} öğe`,
            image: getFeedImageUrl(index, 300, 250),
            avatar: getAvatarUrl(business.name, index),
          } as Business))
          setBusinesses(mappedBusinesses)
        } else {
          setBusinesses(mockBusinesses)
        }
      } catch (error) {
        console.warn('Error fetching businesses:', error)
        setBusinesses(mockBusinesses)
      }
    }

    fetchBusinesses()
  }, [])

  // Filter businesses
  const displayBusinesses = businesses.length > 0 ? businesses : mockBusinesses
  const filteredBusinesses =
    selectedCategory === 'all'
      ? displayBusinesses
      : displayBusinesses.filter((b) => b.category === selectedCategory)

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
      qrCode: '',
    })
  }

  const closeDonationModal = () => {
    setDonationModal({ ...donationModal, isOpen: false, isSuccess: false })
  }

  const handleDonationSubmit = async () => {
    if (!user) return
    setDonationModal({ ...donationModal, isProcessing: true })
    try {
      const qr = generateQRCode()
      const neighborhoodId = neighborhood?.id || '00000000-0000-0000-0000-000000000000'

      // Save to Supabase
      const { data: savedDonation, error } = await createDonation({
        user_id: user.id,
        neighborhood_id: neighborhoodId,
        donation_type: donationModal.business?.category || 'general',
        title: `Askıda ${donationModal.quantity} ${donationModal.selectedItem} - ${donationModal.business?.name}`,
        description: donationModal.message || undefined,
        quantity: donationModal.quantity,
        business_id: donationModal.business?.id,
      })

      if (error) console.warn('Donation save error:', error)

      // Also update local state for immediate UI feedback
      const newDonation: DonationItem = {
        id: savedDonation?.id || `d${Date.now()}`,
        donor: donationModal.isAnonymous ? 'Anonim' : (profile?.full_name || 'Komşu'),
        items: `${donationModal.quantity} ${donationModal.selectedItem}`,
        business: donationModal.business?.name || 'İşletme',
        time: 'az önce',
        isAnonymous: donationModal.isAnonymous,
        avatar: !donationModal.isAnonymous ? getAvatarUrl(profile?.full_name || 'User', 0) : undefined,
      }

      setDonations([newDonation, ...donations])
      setDonationStats(prev => ({
        ...prev,
        total: prev.total + 1,
        items: prev.items + donationModal.quantity,
      }))

      setDonationModal({
        ...donationModal,
        isProcessing: false,
        isSuccess: true,
        qrCode: qr
      })
    } catch (error) {
      console.warn('Error submitting donation:', error)
      setDonationModal({ ...donationModal, isProcessing: false })
    }
  }

  const handleRedeemScan = () => {
    // Simulate QR scan → found donation
    setTimeout(() => {
      setRedeemModal({
        ...redeemModal,
        step: 'confirm',
        donationInfo: {
          business: 'Sıcak Ekmek Fırını',
          item: 'Ekmek',
          quantity: 2,
          donor: 'Bir Komşu',
          donorAnonymous: true,
        },
      })
    }, 1200)
  }

  const handleRedeemConfirm = async () => {
    if (user && redeemModal.qrCode) {
      // Try to find and claim donation by QR code in Supabase
      try {
        const supabase = createClient() as any
        const { data: donation } = await supabase
          .from('donations')
          .select('id')
          .eq('qr_code', redeemModal.qrCode)
          .eq('status', 'available')
          .single()
        if (donation?.id) {
          await claimDonation(donation.id, user.id)
        }
      } catch (e) {
        console.warn('Claim error:', e)
      }
    }
    setRedeemModal({ ...redeemModal, step: 'success' })
  }

  const openThankYouModal = (donation: DonationItem) => {
    setThankYouModal({
      isOpen: true,
      donationId: donation.id,
      donorName: donation.donor,
      donorAnonymous: donation.isAnonymous,
      message: '',
      isAnonymous: false,
      isSent: false,
    })
  }

  const handleThankYouSend = () => {
    setThankYouModal({ ...thankYouModal, isSent: true })
    setTimeout(() => {
      setThankYouModal({ ...thankYouModal, isOpen: false, isSent: false })
    }, 2000)
  }

  const getItemPrice = (category: string): number => {
    const prices: Record<string, number> = { bread: 12, meat: 50, milk: 18, barber: 25, coffee: 8, medicine: 100, book: 35, cleaning: 45 }
    return prices[category] || 50
  }

  const getTotalPrice = () => {
    if (!donationModal.business) return 0
    return getItemPrice(donationModal.business.category) * donationModal.quantity
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary via-[#009d4e] to-[#00833e] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-10 text-6xl animate-pulse">💚</div>
          <div className="absolute bottom-4 left-10 text-6xl animate-pulse" style={{ animationDelay: '0.5s' }}>❤️</div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-8 sm:py-12 text-center">
          <div className="mb-4 inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-surface bg-opacity-20 rounded-full">
            <Gift className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">Askıda Bağış</h1>
          <p className="text-base sm:text-lg opacity-90 mb-4 sm:mb-6">Komşuna bir iyilik bırak, mahalleni güzelleştir</p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6 max-w-xl mx-auto">
            <div className="bg-surface bg-opacity-15 rounded-lg px-2 py-2 sm:px-4 sm:py-3 backdrop-blur">
              <div className="text-lg sm:text-2xl font-bold">{donationStats.items}</div>
              <div className="text-xs opacity-90">Askıda Ürün</div>
            </div>
            <div className="bg-surface bg-opacity-15 rounded-lg px-2 py-2 sm:px-4 sm:py-3 backdrop-blur">
              <div className="text-lg sm:text-2xl font-bold">{donationStats.total}</div>
              <div className="text-xs opacity-90">Toplam Bağış</div>
            </div>
            <div className="bg-surface bg-opacity-15 rounded-lg px-2 py-2 sm:px-4 sm:py-3 backdrop-blur">
              <div className="text-lg sm:text-2xl font-bold">{donationStats.businesses}</div>
              <div className="text-xs opacity-90">İşletme</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-5 sm:py-8">

        {/* Donate / Redeem Tabs */}
        <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('donate')}
            className={cn(
              'flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap text-sm sm:text-base',
              activeTab === 'donate'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-surface text-text-primary border border-border hover:border-primary'
            )}
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Bağış Yap</span>
            <span className="sm:hidden">Bağış</span>
          </button>
          <button
            onClick={() => setActiveTab('redeem')}
            className={cn(
              'flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap text-sm sm:text-base',
              activeTab === 'redeem'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-surface text-text-primary border border-border hover:border-primary'
            )}
          >
            <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Bağış Kullan</span>
            <span className="sm:hidden">Kullan</span>
          </button>
        </div>

        {/* === DONATE TAB === */}
        {activeTab === 'donate' && (
          <>
            {/* How It Works - Compact */}
            <div className="bg-surface rounded-xl border border-border p-4 sm:p-5 mb-6 sm:mb-8">
              <h3 className="font-bold text-text-primary mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg">
                <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Nasıl Çalışır?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Esnaf Seç</p>
                    <p className="text-xs text-text-muted">Bağış yapacağın esnafı seç</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Bağışla</p>
                    <p className="text-xs text-text-muted">Miktar belirle, gizli/açık seç</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">QR Kod Oluşur</p>
                    <p className="text-xs text-text-muted">Bağış karekodu sisteme eklenir</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Komşun Kullanır</p>
                    <p className="text-xs text-text-muted">QR okutup teşekkür gönderebilir</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filters */}
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-wrap gap-1.5 sm:gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      'flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0',
                      selectedCategory === category.id
                        ? 'bg-primary text-white'
                        : 'bg-surface text-text-secondary border border-border hover:border-primary'
                    )}
                  >
                    <span className="text-sm">{category.emoji}</span>
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Business Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-12">
              {filteredBusinesses.map((business) => (
                <div
                  key={business.id}
                  className="bg-surface rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative h-32 sm:h-40 w-full bg-background overflow-hidden">
                    <Image src={business.image} alt={business.name} fill unoptimized className="object-cover" />
                    {/* Suspended badge */}
                    <div className="absolute bottom-2 left-2 bg-primary text-white text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {business.suspendedLabel}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-text-primary">{business.name}</h3>
                        <p className="text-xs text-text-muted">{business.neighborhood}, {business.mahalle}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-text-primary">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        {business.rating}
                      </div>
                    </div>
                    <button
                      onClick={() => openDonationModal(business)}
                      className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto text-sm"
                    >
                      <Heart className="w-4 h-4" />
                      Bağış Yap
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* === REDEEM TAB === */}
        {activeTab === 'redeem' && (
          <div className="max-w-lg mx-auto px-4">
            {/* How to redeem */}
            <div className="bg-surface rounded-xl border border-border p-4 sm:p-6 mb-4 sm:mb-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <ScanLine className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-2">Askıda Bağışı Kullan</h3>
              <p className="text-sm text-text-muted mb-4 sm:mb-6">
                Esnaftaki karekodu telefonunla okut ve askıdaki ürünü al. Kimliğin gizli kalır.
              </p>

              {/* Privacy info */}
              <div className="bg-background rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold text-text-primary">Gizliliğin Senin Elinde</span>
                </div>
                <p className="text-xs text-[#666]">
                  Hizmeti kullanırken kimliğini gösterebilir veya gizleyebilirsin. Bağışçıya anonim ya da açık
                  teşekkür mesajı gönderebilirsin.
                </p>
              </div>

              <button
                onClick={() => setRedeemModal({ isOpen: true, step: 'scan', qrCode: '', isAnonymous: true, donationInfo: null })}
                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <QrCode className="w-5 h-5" />
                Karekod Okut
              </button>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {[
                { step: '1', title: 'Esnafa Git', desc: 'Askıda bağışı olan bir esnafa git' },
                { step: '2', title: 'Karekod Okut', desc: 'Esnaftaki Mahallemiz karekodunu telefonunla tara' },
                { step: '3', title: 'Gizlilik Seç', desc: 'Kimliğini göster ya da gizle — senin tercihin' },
                { step: '4', title: 'Hizmeti Al', desc: 'Ürünü veya hizmeti teslim al' },
                { step: '5', title: 'Teşekkür Gönder', desc: 'İstersen bağışçıya gizli/açık teşekkür mesajı gönder' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-surface rounded-lg border border-border p-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{item.title}</p>
                    <p className="text-xs text-text-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Donation Wall */}
        <div className="mt-8 sm:mt-12 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-text-primary mb-3 sm:mb-4 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Bağış Duvarı & Teşekkürler
          </h2>
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <div className="max-h-[400px] sm:max-h-[500px] overflow-y-auto">
              {donations.map((donation, index) => (
                <div
                  key={donation.id}
                  className={cn(
                    'px-3 sm:px-5 py-3 sm:py-4',
                    index < donations.length - 1 ? 'border-b border-[#f0f2f5]' : ''
                  )}
                >
                  {/* Donation info */}
                  <div className="flex items-start gap-2 sm:gap-3">
                    {donation.isAnonymous ? (
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-background flex items-center justify-center text-base sm:text-lg">
                        🙏
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
                        <Image src={donation.avatar || ''} alt={donation.donor} width={40} height={40} unoptimized />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-text-primary truncate">
                        <span className="font-bold">{donation.donor}</span>{' '}
                        <span className="text-[#666]">{donation.items} bağışladı</span>
                      </p>
                      <p className="text-xs text-text-muted mt-0.5 truncate">
                        {donation.business} · {donation.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => openThankYouModal(donation)}
                        className="text-xs text-primary font-medium hover:underline flex items-center gap-0.5 whitespace-nowrap"
                      >
                        <Send className="w-3 h-3" />
                        <span className="hidden sm:inline">Teşekkür</span>
                        <span className="sm:hidden">Teş.</span>
                      </button>
                    </div>
                  </div>

                  {/* Thank you message if exists */}
                  {donation.hasThankYou && (
                    <div className="mt-2 sm:mt-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-2 sm:p-3 ml-10 sm:ml-[52px]">
                      <div className="flex items-start gap-1 sm:gap-1.5 mb-1">
                        <Heart className="w-3 h-3 text-primary fill-[#00833e] mt-0.5 flex-shrink-0" />
                        <span className="text-xs font-semibold text-primary truncate">
                          {donation.thankYouAnonymous ? 'Anonim Komşu' : donation.thankYouFrom} teşekkür etti
                        </span>
                        {donation.thankYouAnonymous && (
                          <EyeOff className="w-3 h-3 text-text-muted flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-text-primary italic break-words">&ldquo;{donation.thankYouMessage}&rdquo;</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* === DONATION MODAL === */}
      {donationModal.isOpen && donationModal.business && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto mx-auto">
            <div className="sticky top-0 flex items-center justify-between p-4 sm:p-5 border-b border-border bg-surface rounded-t-2xl gap-2">
              <h3 className="text-base sm:text-lg font-bold text-text-primary">Bağış Yap</h3>
              <button onClick={closeDonationModal} className="text-[#666] hover:text-text-primary flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5">
              {!donationModal.isSuccess ? (
                <>
                  {/* Business */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 p-3 bg-background rounded-lg">
                    <Image src={donationModal.business.avatar} alt={donationModal.business.name} width={44} height={44} unoptimized className="rounded-full flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-text-primary truncate">{donationModal.business.name}</p>
                      <p className="text-xs text-text-muted truncate">{donationModal.business.neighborhood}, {donationModal.business.mahalle}</p>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="mb-4 sm:mb-5">
                    <label className="block text-sm font-semibold text-text-primary mb-2">Miktar</label>
                    <div className="flex items-center gap-2 sm:gap-3 bg-background p-3 rounded-lg">
                      <button onClick={() => setDonationModal({ ...donationModal, quantity: Math.max(1, donationModal.quantity - 1) })} className="p-1.5 hover:bg-surface rounded-lg flex-shrink-0">
                        <Minus className="w-5 h-5 text-primary" />
                      </button>
                      <input
                        type="number" min="1" value={donationModal.quantity}
                        onChange={(e) => setDonationModal({ ...donationModal, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                        className="flex-1 bg-surface border border-border rounded-lg px-2 sm:px-3 py-2 text-center font-bold text-sm"
                      />
                      <button onClick={() => setDonationModal({ ...donationModal, quantity: donationModal.quantity + 1 })} className="p-1.5 hover:bg-surface rounded-lg flex-shrink-0">
                        <Plus className="w-5 h-5 text-primary" />
                      </button>
                    </div>
                  </div>

                  {/* Privacy Toggle */}
                  <div className="mb-4 sm:mb-5 bg-background rounded-lg p-3 sm:p-4">
                    <p className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      Kimlik Gizliliği
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-start gap-2 sm:gap-3 p-2 rounded-lg hover:bg-surface cursor-pointer transition-colors">
                        <input
                          type="radio" name="privacy" checked={!donationModal.isAnonymous}
                          onChange={() => setDonationModal({ ...donationModal, isAnonymous: false })}
                          className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                        />
                        <Eye className="w-4 h-4 text-[#666] mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text-primary">Açık Bağış</p>
                          <p className="text-xs text-text-muted">Adınız bağış duvarında görünür</p>
                        </div>
                      </label>
                      <label className="flex items-start gap-2 sm:gap-3 p-2 rounded-lg hover:bg-surface cursor-pointer transition-colors">
                        <input
                          type="radio" name="privacy" checked={donationModal.isAnonymous}
                          onChange={() => setDonationModal({ ...donationModal, isAnonymous: true })}
                          className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                        />
                        <EyeOff className="w-4 h-4 text-[#666] mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text-primary">Anonim Bağış</p>
                          <p className="text-xs text-text-muted">Kimliğiniz gizli kalır, &ldquo;Anonim&rdquo; olarak görünür</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-4 sm:mb-5">
                    <label className="block text-sm font-semibold text-text-primary mb-2">Mesaj (isteğe bağlı)</label>
                    <textarea
                      value={donationModal.message}
                      onChange={(e) => setDonationModal({ ...donationModal, message: e.target.value })}
                      placeholder="Komşularına bir mesaj bırak..."
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                      rows={2}
                    />
                  </div>

                  {/* Price */}
                  <div className="bg-background rounded-lg p-3 sm:p-4 mb-4 sm:mb-5">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#666]">Birim fiyat</span>
                      <span className="text-text-primary">₺{getItemPrice(donationModal.business.category)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2 pb-2 border-b border-border">
                      <span className="text-[#666]">Adet</span>
                      <span className="text-text-primary">{donationModal.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-text-primary">Toplam</span>
                      <span className="text-lg sm:text-xl font-bold text-primary">₺{getTotalPrice()}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleDonationSubmit}
                    disabled={donationModal.isProcessing}
                    className="w-full bg-primary hover:bg-primary-hover disabled:opacity-70 text-white font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {donationModal.isProcessing ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />İşleniyor...</>
                    ) : (
                      <><Heart className="w-4 h-4 sm:w-5 sm:h-5" />Bağışı Tamamla</>
                    )}
                  </button>
                </>
              ) : (
                /* Success with QR Code */
                <div className="text-center py-3 sm:py-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-[#e8f5e9] rounded-full mb-3 sm:mb-4">
                    <Check className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-text-primary mb-2">Bağışınız Tamamlandı!</h4>
                  <p className="text-sm text-[#666] mb-4 sm:mb-6">
                    {donationModal.quantity} adet bağış {donationModal.business.name} için askıya alındı.
                  </p>

                  {/* QR Code Display */}
                  <div className="bg-background rounded-xl p-4 sm:p-6 mb-3 sm:mb-4 inline-block w-full sm:w-auto">
                    <div className="w-40 h-40 sm:w-48 sm:h-48 bg-surface rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 border-2 border-dashed border-primary">
                      <div className="text-center">
                        <QrCode className="w-16 h-16 sm:w-20 sm:h-20 text-primary mx-auto mb-1 sm:mb-2" />
                        <p className="text-xs text-text-muted">Bağış Karekodu</p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm font-mono font-bold text-text-primary break-all">{donationModal.qrCode}</p>
                  </div>

                  <p className="text-xs text-text-muted mb-3 sm:mb-4 px-2">
                    Bu karekod esnafa iletildi. İhtiyaç sahibi komşular bu kodu okutarak hizmetten yararlanacak.
                  </p>

                  <div className="flex gap-1.5 sm:gap-2">
                    <button className="flex-1 py-2 px-2 sm:px-4 border border-border rounded-lg text-xs sm:text-sm font-medium text-text-primary hover:bg-surface-hover flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap">
                      <Copy className="w-4 h-4 flex-shrink-0" />
                      <span className="hidden sm:inline">Kodu Kopyala</span>
                      <span className="sm:hidden">Kopyala</span>
                    </button>
                    <button className="flex-1 py-2 px-2 sm:px-4 border border-border rounded-lg text-xs sm:text-sm font-medium text-text-primary hover:bg-surface-hover flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap">
                      <Share2 className="w-4 h-4 flex-shrink-0" />
                      <span className="hidden sm:inline">Paylaş</span>
                      <span className="sm:hidden">Paylaş</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* === REDEEM MODAL === */}
      {redeemModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto mx-auto">
            <div className="sticky top-0 flex items-center justify-between p-4 sm:p-5 border-b border-border bg-surface rounded-t-2xl gap-2">
              <h3 className="text-base sm:text-lg font-bold text-text-primary">Bağış Kullan</h3>
              <button onClick={() => setRedeemModal({ ...redeemModal, isOpen: false })} className="text-[#666] hover:text-text-primary flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5">
              {/* Step: Scan */}
              {redeemModal.step === 'scan' && (
                <div className="text-center">
                  <div className="w-48 h-48 sm:w-64 sm:h-64 bg-background rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 border-2 border-dashed border-primary">
                    <div className="text-center">
                      <ScanLine className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-2 sm:mb-3 animate-pulse" />
                      <p className="text-xs sm:text-sm text-text-muted">Kamerayı karekoda tut</p>
                    </div>
                  </div>

                  {/* Privacy toggle for recipient */}
                  <div className="bg-background rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 text-left">
                    <p className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      Kimliğin
                    </p>
                    <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                      <input
                        type="checkbox" checked={redeemModal.isAnonymous}
                        onChange={(e) => setRedeemModal({ ...redeemModal, isAnonymous: e.target.checked })}
                        className="w-4 h-4 flex-shrink-0"
                      />
                      <span className="text-sm text-text-primary">Kimliğimi gizle (anonim kullan)</span>
                    </label>
                  </div>

                  <button
                    onClick={handleRedeemScan}
                    className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
                    Demo: Karekod Tara
                  </button>

                  <p className="text-xs text-text-muted mt-2 sm:mt-3">
                    Veya kodu elle girin:
                  </p>
                  <input
                    type="text" placeholder="MHL-XXXX-XXXX-XXXX"
                    value={redeemModal.qrCode}
                    onChange={(e) => setRedeemModal({ ...redeemModal, qrCode: e.target.value })}
                    className="w-full mt-2 border border-border rounded-lg px-2 sm:px-3 py-2 text-sm text-center font-mono focus:outline-none focus:border-primary"
                  />
                </div>
              )}

              {/* Step: Confirm */}
              {redeemModal.step === 'confirm' && redeemModal.donationInfo && (
                <div>
                  <div className="bg-[#e8f5e9] rounded-xl p-4 sm:p-5 mb-4 sm:mb-5 text-center">
                    <Check className="w-8 h-8 sm:w-10 sm:h-10 text-primary mx-auto mb-2" />
                    <p className="font-bold text-sm sm:text-base text-text-primary">Bağış Bulundu!</p>
                  </div>

                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5">
                    <div className="flex justify-between py-2 border-b border-[#f0f2f5]">
                      <span className="text-sm text-[#666]">Esnaf</span>
                      <span className="text-sm font-medium text-text-primary">{redeemModal.donationInfo.business}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#f0f2f5]">
                      <span className="text-sm text-[#666]">Ürün</span>
                      <span className="text-sm font-medium text-text-primary">{redeemModal.donationInfo.item}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#f0f2f5]">
                      <span className="text-sm text-[#666]">Miktar</span>
                      <span className="text-sm font-medium text-text-primary">{redeemModal.donationInfo.quantity} adet</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-[#666]">Bağışçı</span>
                      <span className="text-sm font-medium text-text-primary flex items-center gap-1">
                        {redeemModal.donationInfo.donorAnonymous && <EyeOff className="w-3 h-3" />}
                        {redeemModal.donationInfo.donor}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-text-muted mb-4 sm:mb-5 bg-background p-2 sm:p-3 rounded-lg">
                    <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{redeemModal.isAnonymous
                      ? 'Kimliğiniz gizli kalacak. Esnaf sizi tanımayacak.'
                      : 'Kimliğiniz esnafa görünecek.'}</span>
                  </div>

                  <button
                    onClick={handleRedeemConfirm}
                    className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-xl transition-colors text-sm sm:text-base"
                  >
                    Onayla ve Hizmeti Al
                  </button>
                </div>
              )}

              {/* Step: Success */}
              {redeemModal.step === 'success' && (
                <div className="text-center py-3 sm:py-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-[#e8f5e9] rounded-full mb-3 sm:mb-4">
                    <Check className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-text-primary mb-2">Afiyet Olsun!</h4>
                  <p className="text-sm text-[#666] mb-4 sm:mb-6">Hizmeti esnaftan teslim alabilirsiniz.</p>

                  <div className="bg-background rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 text-left">
                    <p className="text-sm font-semibold text-text-primary mb-2">Bağışçıya teşekkür etmek ister misiniz?</p>
                    <p className="text-xs text-text-muted mb-3">Kimliğinizi gizleyerek veya göstererek teşekkür mesajı gönderebilirsiniz.</p>
                    <button
                      onClick={() => {
                        setRedeemModal({ ...redeemModal, isOpen: false })
                        setThankYouModal({
                          isOpen: true,
                          donationId: 'demo',
                          donorName: redeemModal.donationInfo?.donor || 'Komşu',
                          donorAnonymous: redeemModal.donationInfo?.donorAnonymous || true,
                          message: '',
                          isAnonymous: false,
                          isSent: false,
                        })
                      }}
                      className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Send className="w-4 h-4" />
                      Teşekkür Gönder
                    </button>
                  </div>

                  <button
                    onClick={() => setRedeemModal({ ...redeemModal, isOpen: false })}
                    className="text-xs sm:text-sm text-text-muted hover:text-text-primary"
                  >
                    Şimdi değil
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* === THANK YOU MODAL === */}
      {thankYouModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto mx-auto">
            <div className="sticky top-0 flex items-center justify-between p-4 sm:p-5 border-b border-border bg-surface rounded-t-2xl gap-2">
              <h3 className="text-base sm:text-lg font-bold text-text-primary flex items-center gap-1 sm:gap-2 whitespace-nowrap overflow-hidden">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span className="truncate">Teşekkür Gönder</span>
              </h3>
              <button onClick={() => setThankYouModal({ ...thankYouModal, isOpen: false })} className="text-[#666] hover:text-text-primary flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5">
              {!thankYouModal.isSent ? (
                <>
                  <div className="bg-background rounded-lg p-3 sm:p-4 mb-4 sm:mb-5">
                    <p className="text-sm text-text-primary truncate">
                      <span className="font-bold">{thankYouModal.donorAnonymous ? 'Anonim Bağışçı' : thankYouModal.donorName}</span>
                      {' '}kişisine teşekkür gönderiyorsunuz
                    </p>
                  </div>

                  {/* Your privacy */}
                  <div className="mb-4 sm:mb-5">
                    <p className="text-sm font-semibold text-text-primary mb-2 sm:mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      Kimliğiniz
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 border border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                        <input
                          type="radio" name="ty-privacy" checked={!thankYouModal.isAnonymous}
                          onChange={() => setThankYouModal({ ...thankYouModal, isAnonymous: false })}
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                        />
                        <Eye className="w-4 h-4 text-[#666] mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text-primary">Açık Teşekkür</p>
                          <p className="text-xs text-text-muted">Bağışçı adınızı görecek</p>
                        </div>
                      </label>
                      <label className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 border border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                        <input
                          type="radio" name="ty-privacy" checked={thankYouModal.isAnonymous}
                          onChange={() => setThankYouModal({ ...thankYouModal, isAnonymous: true })}
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                        />
                        <EyeOff className="w-4 h-4 text-[#666] mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text-primary">Anonim Teşekkür</p>
                          <p className="text-xs text-text-muted">Kimliğiniz gizli kalır</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-4 sm:mb-5">
                    <label className="block text-sm font-semibold text-text-primary mb-2">Mesajınız</label>
                    <textarea
                      value={thankYouModal.message}
                      onChange={(e) => setThankYouModal({ ...thankYouModal, message: e.target.value })}
                      placeholder="Teşekkür mesajınızı yazın..."
                      className="w-full border border-border rounded-lg px-2 sm:px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                      rows={3}
                    />
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                      {['Allah razı olsun!', 'Çok teşekkürler!', 'Sağolasın komşum!', 'Hayırlı olsun!'].map((msg) => (
                        <button
                          key={msg}
                          onClick={() => setThankYouModal({ ...thankYouModal, message: msg })}
                          className="text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 bg-background text-[#666] rounded-full hover:bg-[#e8f5e9] hover:text-primary transition-colors whitespace-nowrap"
                        >
                          {msg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleThankYouSend}
                    disabled={!thankYouModal.message.trim()}
                    className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    Teşekkür Gönder
                  </button>
                </>
              ) : (
                <div className="text-center py-4 sm:py-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-[#e8f5e9] rounded-full mb-3 sm:mb-4">
                    <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary fill-[#00833e]" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-text-primary mb-2">Teşekkürünüz Gönderildi!</h4>
                  <p className="text-sm text-text-muted">
                    {thankYouModal.isAnonymous ? 'Anonim olarak' : 'Adınızla birlikte'} teşekkür mesajınız iletildi.
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
