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
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'donate' | 'redeem'>('donate')

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

  // Filter businesses
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
      qrCode: '',
    })
  }

  const closeDonationModal = () => {
    setDonationModal({ ...donationModal, isOpen: false, isSuccess: false })
  }

  const handleDonationSubmit = () => {
    setDonationModal({ ...donationModal, isProcessing: true })
    setTimeout(() => {
      const qr = generateQRCode()
      setDonationModal({ ...donationModal, isProcessing: false, isSuccess: true, qrCode: qr })
    }, 1500)
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

  const handleRedeemConfirm = () => {
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
      <div className="relative bg-gradient-to-r from-[#00833e] via-[#009d4e] to-[#00833e] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-10 text-6xl animate-pulse">💚</div>
          <div className="absolute bottom-4 left-10 text-6xl animate-pulse" style={{ animationDelay: '0.5s' }}>❤️</div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-12 text-center">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full">
            <Gift className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Askıda Bağış</h1>
          <p className="text-lg opacity-90 mb-6">Komşuna bir iyilik bırak, mahalleni güzelleştir</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 max-w-xl mx-auto">
            <div className="bg-white bg-opacity-15 rounded-lg px-4 py-3 backdrop-blur">
              <div className="text-2xl font-bold">2,847</div>
              <div className="text-xs opacity-90">Askıda Ürün</div>
            </div>
            <div className="bg-white bg-opacity-15 rounded-lg px-4 py-3 backdrop-blur">
              <div className="text-2xl font-bold">₺42,350</div>
              <div className="text-xs opacity-90">Bu Ay Bağış</div>
            </div>
            <div className="bg-white bg-opacity-15 rounded-lg px-4 py-3 backdrop-blur">
              <div className="text-2xl font-bold">1,246</div>
              <div className="text-xs opacity-90">Faydalanan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Donate / Redeem Tabs */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab('donate')}
            className={cn(
              'flex-1 py-3 px-4 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2',
              activeTab === 'donate'
                ? 'bg-[#00833e] text-white shadow-lg'
                : 'bg-white text-[#333] border border-[#e0e0e0] hover:border-[#00833e]'
            )}
          >
            <Heart className="w-5 h-5" />
            Bağış Yap
          </button>
          <button
            onClick={() => setActiveTab('redeem')}
            className={cn(
              'flex-1 py-3 px-4 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2',
              activeTab === 'redeem'
                ? 'bg-[#00833e] text-white shadow-lg'
                : 'bg-white text-[#333] border border-[#e0e0e0] hover:border-[#00833e]'
            )}
          >
            <QrCode className="w-5 h-5" />
            Bağış Kullan
          </button>
        </div>

        {/* === DONATE TAB === */}
        {activeTab === 'donate' && (
          <>
            {/* How It Works - Compact */}
            <div className="bg-white rounded-xl border border-[#e0e0e0] p-5 mb-8">
              <h3 className="font-bold text-[#333] mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#00833e]" />
                Nasıl Çalışır?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00833e] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                  <div>
                    <p className="text-sm font-semibold text-[#333]">Esnaf Seç</p>
                    <p className="text-xs text-[#8f8f8f]">Bağış yapacağın esnafı seç</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00833e] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                  <div>
                    <p className="text-sm font-semibold text-[#333]">Bağışla</p>
                    <p className="text-xs text-[#8f8f8f]">Miktar belirle, gizli/açık seç</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00833e] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                  <div>
                    <p className="text-sm font-semibold text-[#333]">QR Kod Oluşur</p>
                    <p className="text-xs text-[#8f8f8f]">Bağış karekodu sisteme eklenir</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00833e] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
                  <div>
                    <p className="text-sm font-semibold text-[#333]">Komşun Kullanır</p>
                    <p className="text-xs text-[#8f8f8f]">QR okutup teşekkür gönderebilir</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filters */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap',
                      selectedCategory === category.id
                        ? 'bg-[#00833e] text-white'
                        : 'bg-white text-[#404040] border border-[#e0e0e0] hover:border-[#00833e]'
                    )}
                  >
                    <span>{category.emoji}</span>
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Business Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
              {filteredBusinesses.map((business) => (
                <div
                  key={business.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#e0e0e0] hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative h-40 w-full bg-[#f0f2f5] overflow-hidden">
                    <Image src={business.image} alt={business.name} fill unoptimized className="object-cover" />
                    {/* Suspended badge */}
                    <div className="absolute bottom-2 left-2 bg-[#00833e] text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {business.suspendedLabel}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-[#333]">{business.name}</h3>
                        <p className="text-xs text-[#8f8f8f]">{business.neighborhood}, {business.mahalle}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-[#333]">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        {business.rating}
                      </div>
                    </div>
                    <button
                      onClick={() => openDonationModal(business)}
                      className="w-full bg-[#00833e] hover:bg-[#006b31] text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
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
          <div className="max-w-lg mx-auto">
            {/* How to redeem */}
            <div className="bg-white rounded-xl border border-[#e0e0e0] p-6 mb-6 text-center">
              <div className="w-16 h-16 bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-4">
                <ScanLine className="w-8 h-8 text-[#00833e]" />
              </div>
              <h3 className="text-xl font-bold text-[#333] mb-2">Askıda Bağışı Kullan</h3>
              <p className="text-sm text-[#8f8f8f] mb-6">
                Esnaftaki karekodu telefonunla okut ve askıdaki ürünü al. Kimliğin gizli kalır.
              </p>

              {/* Privacy info */}
              <div className="bg-[#f0f2f5] rounded-lg p-4 mb-6 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-[#00833e]" />
                  <span className="text-sm font-bold text-[#333]">Gizliliğin Senin Elinde</span>
                </div>
                <p className="text-xs text-[#666]">
                  Hizmeti kullanırken kimliğini gösterebilir veya gizleyebilirsin. Bağışçıya anonim ya da açık
                  teşekkür mesajı gönderebilirsin.
                </p>
              </div>

              <button
                onClick={() => setRedeemModal({ isOpen: true, step: 'scan', qrCode: '', isAnonymous: true, donationInfo: null })}
                className="w-full bg-[#00833e] hover:bg-[#006b31] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <QrCode className="w-5 h-5" />
                Karekod Okut
              </button>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {[
                { step: '1', title: 'Esnafa Git', desc: 'Askıda bağışı olan bir esnafa git' },
                { step: '2', title: 'Karekod Okut', desc: 'Esnaftaki Mahallem karekodunu telefonunla tara' },
                { step: '3', title: 'Gizlilik Seç', desc: 'Kimliğini göster ya da gizle — senin tercihin' },
                { step: '4', title: 'Hizmeti Al', desc: 'Ürünü veya hizmeti teslim al' },
                { step: '5', title: 'Teşekkür Gönder', desc: 'İstersen bağışçıya gizli/açık teşekkür mesajı gönder' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-lg border border-[#e0e0e0] p-4">
                  <div className="w-8 h-8 rounded-full bg-[#00833e] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#333]">{item.title}</p>
                    <p className="text-xs text-[#8f8f8f]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Donation Wall */}
        <div className="mt-12 mb-8">
          <h2 className="text-xl font-bold text-[#333] mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#00833e]" />
            Bağış Duvarı & Teşekkürler
          </h2>
          <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
            <div className="max-h-[500px] overflow-y-auto">
              {mockDonations.map((donation, index) => (
                <div
                  key={donation.id}
                  className={cn(
                    'px-5 py-4',
                    index < mockDonations.length - 1 ? 'border-b border-[#f0f2f5]' : ''
                  )}
                >
                  {/* Donation info */}
                  <div className="flex items-start gap-3">
                    {donation.isAnonymous ? (
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#f0f2f5] flex items-center justify-center text-lg">
                        🙏
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
                        <Image src={donation.avatar || ''} alt={donation.donor} width={40} height={40} unoptimized />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#333]">
                        <span className="font-bold">{donation.donor}</span>{' '}
                        <span className="text-[#666]">{donation.items} bağışladı</span>
                      </p>
                      <p className="text-xs text-[#8f8f8f] mt-0.5">
                        {donation.business} · {donation.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openThankYouModal(donation)}
                        className="text-xs text-[#00833e] font-medium hover:underline flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        Teşekkür
                      </button>
                    </div>
                  </div>

                  {/* Thank you message if exists */}
                  {donation.hasThankYou && (
                    <div className="mt-3 ml-13 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-3 ml-[52px]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Heart className="w-3 h-3 text-[#00833e] fill-[#00833e]" />
                        <span className="text-xs font-semibold text-[#00833e]">
                          {donation.thankYouAnonymous ? 'Anonim Komşu' : donation.thankYouFrom} teşekkür etti
                        </span>
                        {donation.thankYouAnonymous && (
                          <EyeOff className="w-3 h-3 text-[#8f8f8f]" />
                        )}
                      </div>
                      <p className="text-xs text-[#333] italic">&ldquo;{donation.thankYouMessage}&rdquo;</p>
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
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-5 border-b border-[#e0e0e0] bg-white rounded-t-2xl">
              <h3 className="text-lg font-bold text-[#333]">Bağış Yap</h3>
              <button onClick={closeDonationModal} className="text-[#666] hover:text-[#333]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              {!donationModal.isSuccess ? (
                <>
                  {/* Business */}
                  <div className="flex items-center gap-3 mb-5 p-3 bg-[#f0f2f5] rounded-lg">
                    <Image src={donationModal.business.avatar} alt={donationModal.business.name} width={44} height={44} unoptimized className="rounded-full" />
                    <div>
                      <p className="font-bold text-sm text-[#333]">{donationModal.business.name}</p>
                      <p className="text-xs text-[#8f8f8f]">{donationModal.business.neighborhood}, {donationModal.business.mahalle}</p>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-[#333] mb-2">Miktar</label>
                    <div className="flex items-center gap-3 bg-[#f0f2f5] p-3 rounded-lg">
                      <button onClick={() => setDonationModal({ ...donationModal, quantity: Math.max(1, donationModal.quantity - 1) })} className="p-2 hover:bg-white rounded-lg">
                        <Minus className="w-5 h-5 text-[#00833e]" />
                      </button>
                      <input
                        type="number" min="1" value={donationModal.quantity}
                        onChange={(e) => setDonationModal({ ...donationModal, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                        className="flex-1 bg-white border border-[#e0e0e0] rounded-lg px-3 py-2 text-center font-bold"
                      />
                      <button onClick={() => setDonationModal({ ...donationModal, quantity: donationModal.quantity + 1 })} className="p-2 hover:bg-white rounded-lg">
                        <Plus className="w-5 h-5 text-[#00833e]" />
                      </button>
                    </div>
                  </div>

                  {/* Privacy Toggle */}
                  <div className="mb-5 bg-[#f0f2f5] rounded-lg p-4">
                    <p className="text-sm font-semibold text-[#333] mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#00833e]" />
                      Kimlik Gizliliği
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors">
                        <input
                          type="radio" name="privacy" checked={!donationModal.isAnonymous}
                          onChange={() => setDonationModal({ ...donationModal, isAnonymous: false })}
                          className="w-4 h-4 text-[#00833e]"
                        />
                        <Eye className="w-4 h-4 text-[#666]" />
                        <div>
                          <p className="text-sm font-medium text-[#333]">Açık Bağış</p>
                          <p className="text-xs text-[#8f8f8f]">Adınız bağış duvarında görünür</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors">
                        <input
                          type="radio" name="privacy" checked={donationModal.isAnonymous}
                          onChange={() => setDonationModal({ ...donationModal, isAnonymous: true })}
                          className="w-4 h-4 text-[#00833e]"
                        />
                        <EyeOff className="w-4 h-4 text-[#666]" />
                        <div>
                          <p className="text-sm font-medium text-[#333]">Anonim Bağış</p>
                          <p className="text-xs text-[#8f8f8f]">Kimliğiniz gizli kalır, &ldquo;Anonim&rdquo; olarak görünür</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-[#333] mb-2">Mesaj (isteğe bağlı)</label>
                    <textarea
                      value={donationModal.message}
                      onChange={(e) => setDonationModal({ ...donationModal, message: e.target.value })}
                      placeholder="Komşularına bir mesaj bırak..."
                      className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00833e] resize-none"
                      rows={2}
                    />
                  </div>

                  {/* Price */}
                  <div className="bg-[#f0f2f5] rounded-lg p-4 mb-5">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#666]">Birim fiyat</span>
                      <span className="text-[#333]">₺{getItemPrice(donationModal.business.category)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2 pb-2 border-b border-[#e0e0e0]">
                      <span className="text-[#666]">Adet</span>
                      <span className="text-[#333]">{donationModal.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-[#333]">Toplam</span>
                      <span className="text-xl font-bold text-[#00833e]">₺{getTotalPrice()}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleDonationSubmit}
                    disabled={donationModal.isProcessing}
                    className="w-full bg-[#00833e] hover:bg-[#006b31] disabled:opacity-70 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {donationModal.isProcessing ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />İşleniyor...</>
                    ) : (
                      <><Heart className="w-5 h-5" />Bağışı Tamamla</>
                    )}
                  </button>
                </>
              ) : (
                /* Success with QR Code */
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#e8f5e9] rounded-full mb-4">
                    <Check className="w-8 h-8 text-[#00833e]" />
                  </div>
                  <h4 className="text-xl font-bold text-[#333] mb-2">Bağışınız Tamamlandı!</h4>
                  <p className="text-sm text-[#666] mb-6">
                    {donationModal.quantity} adet bağış {donationModal.business.name} için askıya alındı.
                  </p>

                  {/* QR Code Display */}
                  <div className="bg-[#f0f2f5] rounded-xl p-6 mb-4 inline-block">
                    <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 border-2 border-dashed border-[#00833e]">
                      <div className="text-center">
                        <QrCode className="w-20 h-20 text-[#00833e] mx-auto mb-2" />
                        <p className="text-xs text-[#8f8f8f]">Bağış Karekodu</p>
                      </div>
                    </div>
                    <p className="text-sm font-mono font-bold text-[#333]">{donationModal.qrCode}</p>
                  </div>

                  <p className="text-xs text-[#8f8f8f] mb-4">
                    Bu karekod esnafa iletildi. İhtiyaç sahibi komşular bu kodu okutarak hizmetten yararlanacak.
                  </p>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 px-4 border border-[#e0e0e0] rounded-lg text-sm font-medium text-[#333] hover:bg-[#f0f2f5] flex items-center justify-center gap-1.5">
                      <Copy className="w-4 h-4" />
                      Kodu Kopyala
                    </button>
                    <button className="flex-1 py-2 px-4 border border-[#e0e0e0] rounded-lg text-sm font-medium text-[#333] hover:bg-[#f0f2f5] flex items-center justify-center gap-1.5">
                      <Share2 className="w-4 h-4" />
                      Paylaş
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
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-5 border-b border-[#e0e0e0]">
              <h3 className="text-lg font-bold text-[#333]">Bağış Kullan</h3>
              <button onClick={() => setRedeemModal({ ...redeemModal, isOpen: false })} className="text-[#666] hover:text-[#333]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              {/* Step: Scan */}
              {redeemModal.step === 'scan' && (
                <div className="text-center">
                  <div className="w-64 h-64 bg-[#f0f2f5] rounded-xl flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-[#00833e]">
                    <div className="text-center">
                      <ScanLine className="w-16 h-16 text-[#00833e] mx-auto mb-3 animate-pulse" />
                      <p className="text-sm text-[#8f8f8f]">Kamerayı karekoda tut</p>
                    </div>
                  </div>

                  {/* Privacy toggle for recipient */}
                  <div className="bg-[#f0f2f5] rounded-lg p-4 mb-4 text-left">
                    <p className="text-sm font-semibold text-[#333] mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#00833e]" />
                      Kimliğin
                    </p>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox" checked={redeemModal.isAnonymous}
                        onChange={(e) => setRedeemModal({ ...redeemModal, isAnonymous: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-[#333]">Kimliğimi gizle (anonim kullan)</span>
                    </label>
                  </div>

                  <button
                    onClick={handleRedeemScan}
                    className="w-full bg-[#00833e] hover:bg-[#006b31] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-5 h-5" />
                    Demo: Karekod Tara
                  </button>

                  <p className="text-xs text-[#8f8f8f] mt-3">
                    Veya kodu elle girin:
                  </p>
                  <input
                    type="text" placeholder="MHL-XXXX-XXXX-XXXX"
                    value={redeemModal.qrCode}
                    onChange={(e) => setRedeemModal({ ...redeemModal, qrCode: e.target.value })}
                    className="w-full mt-2 border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm text-center font-mono focus:outline-none focus:border-[#00833e]"
                  />
                </div>
              )}

              {/* Step: Confirm */}
              {redeemModal.step === 'confirm' && redeemModal.donationInfo && (
                <div>
                  <div className="bg-[#e8f5e9] rounded-xl p-5 mb-5 text-center">
                    <Check className="w-10 h-10 text-[#00833e] mx-auto mb-2" />
                    <p className="font-bold text-[#333]">Bağış Bulundu!</p>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between py-2 border-b border-[#f0f2f5]">
                      <span className="text-sm text-[#666]">Esnaf</span>
                      <span className="text-sm font-medium text-[#333]">{redeemModal.donationInfo.business}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#f0f2f5]">
                      <span className="text-sm text-[#666]">Ürün</span>
                      <span className="text-sm font-medium text-[#333]">{redeemModal.donationInfo.item}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#f0f2f5]">
                      <span className="text-sm text-[#666]">Miktar</span>
                      <span className="text-sm font-medium text-[#333]">{redeemModal.donationInfo.quantity} adet</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-[#666]">Bağışçı</span>
                      <span className="text-sm font-medium text-[#333] flex items-center gap-1">
                        {redeemModal.donationInfo.donorAnonymous && <EyeOff className="w-3 h-3" />}
                        {redeemModal.donationInfo.donor}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#8f8f8f] mb-5 bg-[#f0f2f5] p-3 rounded-lg">
                    <Shield className="w-4 h-4 flex-shrink-0" />
                    {redeemModal.isAnonymous
                      ? 'Kimliğiniz gizli kalacak. Esnaf sizi tanımayacak.'
                      : 'Kimliğiniz esnafa görünecek.'}
                  </div>

                  <button
                    onClick={handleRedeemConfirm}
                    className="w-full bg-[#00833e] hover:bg-[#006b31] text-white font-bold py-3 rounded-xl transition-colors"
                  >
                    Onayla ve Hizmeti Al
                  </button>
                </div>
              )}

              {/* Step: Success */}
              {redeemModal.step === 'success' && (
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#e8f5e9] rounded-full mb-4">
                    <Check className="w-8 h-8 text-[#00833e]" />
                  </div>
                  <h4 className="text-xl font-bold text-[#333] mb-2">Afiyet Olsun!</h4>
                  <p className="text-sm text-[#666] mb-6">Hizmeti esnaftan teslim alabilirsiniz.</p>

                  <div className="bg-[#f0f2f5] rounded-lg p-4 mb-4 text-left">
                    <p className="text-sm font-semibold text-[#333] mb-2">Bağışçıya teşekkür etmek ister misiniz?</p>
                    <p className="text-xs text-[#8f8f8f] mb-3">Kimliğinizi gizleyerek veya göstererek teşekkür mesajı gönderebilirsiniz.</p>
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
                      className="w-full bg-[#00833e] hover:bg-[#006b31] text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Teşekkür Gönder
                    </button>
                  </div>

                  <button
                    onClick={() => setRedeemModal({ ...redeemModal, isOpen: false })}
                    className="text-sm text-[#8f8f8f] hover:text-[#333]"
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
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-5 border-b border-[#e0e0e0]">
              <h3 className="text-lg font-bold text-[#333] flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#00833e]" />
                Teşekkür Gönder
              </h3>
              <button onClick={() => setThankYouModal({ ...thankYouModal, isOpen: false })} className="text-[#666] hover:text-[#333]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              {!thankYouModal.isSent ? (
                <>
                  <div className="bg-[#f0f2f5] rounded-lg p-4 mb-5">
                    <p className="text-sm text-[#333]">
                      <span className="font-bold">{thankYouModal.donorAnonymous ? 'Anonim Bağışçı' : thankYouModal.donorName}</span>
                      {' '}kişisine teşekkür gönderiyorsunuz
                    </p>
                  </div>

                  {/* Your privacy */}
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-[#333] mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#00833e]" />
                      Kimliğiniz
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 border border-[#e0e0e0] rounded-lg cursor-pointer hover:border-[#00833e] transition-colors">
                        <input
                          type="radio" name="ty-privacy" checked={!thankYouModal.isAnonymous}
                          onChange={() => setThankYouModal({ ...thankYouModal, isAnonymous: false })}
                          className="w-4 h-4"
                        />
                        <Eye className="w-4 h-4 text-[#666]" />
                        <div>
                          <p className="text-sm font-medium text-[#333]">Açık Teşekkür</p>
                          <p className="text-xs text-[#8f8f8f]">Bağışçı adınızı görecek</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-[#e0e0e0] rounded-lg cursor-pointer hover:border-[#00833e] transition-colors">
                        <input
                          type="radio" name="ty-privacy" checked={thankYouModal.isAnonymous}
                          onChange={() => setThankYouModal({ ...thankYouModal, isAnonymous: true })}
                          className="w-4 h-4"
                        />
                        <EyeOff className="w-4 h-4 text-[#666]" />
                        <div>
                          <p className="text-sm font-medium text-[#333]">Anonim Teşekkür</p>
                          <p className="text-xs text-[#8f8f8f]">Kimliğiniz gizli kalır</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-[#333] mb-2">Mesajınız</label>
                    <textarea
                      value={thankYouModal.message}
                      onChange={(e) => setThankYouModal({ ...thankYouModal, message: e.target.value })}
                      placeholder="Teşekkür mesajınızı yazın..."
                      className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00833e] resize-none"
                      rows={3}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['Allah razı olsun!', 'Çok teşekkürler!', 'Sağolasın komşum!', 'Hayırlı olsun!'].map((msg) => (
                        <button
                          key={msg}
                          onClick={() => setThankYouModal({ ...thankYouModal, message: msg })}
                          className="text-xs px-2.5 py-1 bg-[#f0f2f5] text-[#666] rounded-full hover:bg-[#e8f5e9] hover:text-[#00833e] transition-colors"
                        >
                          {msg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleThankYouSend}
                    disabled={!thankYouModal.message.trim()}
                    className="w-full bg-[#00833e] hover:bg-[#006b31] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Teşekkür Gönder
                  </button>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#e8f5e9] rounded-full mb-4">
                    <Heart className="w-8 h-8 text-[#00833e] fill-[#00833e]" />
                  </div>
                  <h4 className="text-xl font-bold text-[#333] mb-2">Teşekkürünüz Gönderildi!</h4>
                  <p className="text-sm text-[#8f8f8f]">
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
