'use client'

import { useState, useEffect, Suspense } from 'react'
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
  CreditCard,
  ExternalLink,
  Loader2,
  Package,
  Edit3,
  Settings,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images'
import { createClient } from '@/lib/supabase/client'
import { useCurrentUser } from '@/lib/hooks/use-auth'
import { getDonations, createDonation, claimDonation } from '@/lib/hooks/use-donations'
import {
  getDonationProducts,
  getBusinessProducts,
  createDonationProduct,
  updateDonationProduct,
  deleteDonationProduct,
  getBusinessesWithProducts,
  incrementProductDonationCount,
  type DonationProduct,
} from '@/lib/hooks/use-donation-products'
import { useSearchParams } from 'next/navigation'

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
  products?: DonationProduct[]
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
  selectedProduct: DonationProduct | null
  quantity: number
  selectedItem: string
  isAnonymous: boolean
  message: string
  isProcessing: boolean
  isSuccess: boolean
  qrCode: string
  step: 'form' | 'payment' | 'success'
  paymentUrl: string
  donationId: string
}

interface PaymentFormState {
  cardNumber: string
  cardName: string
  expiry: string
  cvv: string
  errors: Record<string, string>
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

interface ProductManageModalState {
  isOpen: boolean
  businessId: string
  businessName: string
  products: DonationProduct[]
  editingProduct: Partial<DonationProduct> | null
  isLoading: boolean
  isSaving: boolean
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

// Mock businesses (fallback)
const mockBusinesses: Business[] = [
  { id: '1', name: 'Sıcak Ekmek Fırını', neighborhood: 'Kadıköy', mahalle: 'Moda', category: 'bread', rating: 4.8, suspendedCount: 12, suspendedLabel: 'Askıda 12 ekmek', image: getFeedImageUrl(0, 300, 250), avatar: getAvatarUrl('Sıcak Ekmek', 0), products: [
    { id: 'mp1', business_id: '1', name: 'Ekmek', description: 'Taze günlük ekmek', price: 12, is_active: true, sort_order: 0, total_donated: 45, created_at: '', updated_at: '' },
    { id: 'mp2', business_id: '1', name: 'Simit', description: 'Taze simit', price: 15, is_active: true, sort_order: 1, total_donated: 23, created_at: '', updated_at: '' },
    { id: 'mp3', business_id: '1', name: 'Poğaça', description: 'Peynirli poğaça', price: 20, is_active: true, sort_order: 2, total_donated: 12, created_at: '', updated_at: '' },
  ]},
  { id: '2', name: 'Güven Kasabı', neighborhood: 'Kadıköy', mahalle: 'Caferağa', category: 'meat', rating: 4.7, suspendedCount: 3, suspendedLabel: 'Askıda 3 kg et', image: getFeedImageUrl(1, 300, 250), avatar: getAvatarUrl('Güven Kasabı', 1), products: [
    { id: 'mp4', business_id: '2', name: '1 kg Kıyma', description: 'Taze dana kıyma', price: 350, is_active: true, sort_order: 0, total_donated: 8, created_at: '', updated_at: '' },
    { id: 'mp5', business_id: '2', name: '1 kg Kuşbaşı', description: 'Dana kuşbaşı', price: 400, is_active: true, sort_order: 1, total_donated: 5, created_at: '', updated_at: '' },
  ]},
  { id: '3', name: 'Taze Mandıra', neighborhood: 'Kadıköy', mahalle: 'Moda', category: 'milk', rating: 4.9, suspendedCount: 8, suspendedLabel: 'Askıda 8 litre süt', image: getFeedImageUrl(2, 300, 250), avatar: getAvatarUrl('Taze Mandıra', 2), products: [
    { id: 'mp6', business_id: '3', name: '1 Lt Süt', description: 'Günlük taze süt', price: 35, is_active: true, sort_order: 0, total_donated: 30, created_at: '', updated_at: '' },
    { id: 'mp7', business_id: '3', name: 'Peynir Paketi', description: 'Beyaz peynir 500g', price: 120, is_active: true, sort_order: 1, total_donated: 10, created_at: '', updated_at: '' },
    { id: 'mp8', business_id: '3', name: 'Yoğurt (1 kg)', description: 'Ev yapımı yoğurt', price: 60, is_active: true, sort_order: 2, total_donated: 18, created_at: '', updated_at: '' },
  ]},
  { id: '4', name: 'Ali Usta Berber', neighborhood: 'Kadıköy', mahalle: 'Caferağa', category: 'barber', rating: 4.6, suspendedCount: 5, suspendedLabel: 'Askıda 5 traş', image: getFeedImageUrl(3, 300, 250), avatar: getAvatarUrl('Ali Usta Berber', 3), products: [
    { id: 'mp9', business_id: '4', name: 'Saç Traşı', description: 'Erkek saç traşı', price: 150, is_active: true, sort_order: 0, total_donated: 15, created_at: '', updated_at: '' },
    { id: 'mp10', business_id: '4', name: 'Sakal Traşı', description: 'Klasik ustura ile', price: 100, is_active: true, sort_order: 1, total_donated: 8, created_at: '', updated_at: '' },
  ]},
  { id: '5', name: 'Kahve Durağı', neighborhood: 'Kadıköy', mahalle: 'Moda', category: 'coffee', rating: 4.7, suspendedCount: 15, suspendedLabel: 'Askıda 15 kahve', image: getFeedImageUrl(4, 300, 250), avatar: getAvatarUrl('Kahve Durağı', 4), products: [
    { id: 'mp11', business_id: '5', name: 'Türk Kahvesi', description: 'Geleneksel Türk kahvesi', price: 40, is_active: true, sort_order: 0, total_donated: 50, created_at: '', updated_at: '' },
    { id: 'mp12', business_id: '5', name: 'Çay', description: 'Demli çay', price: 15, is_active: true, sort_order: 1, total_donated: 80, created_at: '', updated_at: '' },
    { id: 'mp13', business_id: '5', name: 'Latte', description: 'Sütlü kahve', price: 65, is_active: true, sort_order: 2, total_donated: 20, created_at: '', updated_at: '' },
  ]},
  { id: '6', name: 'Hayat Eczanesi', neighborhood: 'Kadıköy', mahalle: 'Osmanağa', category: 'medicine', rating: 4.8, suspendedCount: 2, suspendedLabel: 'Askıda 2 ilaç paketi', image: getFeedImageUrl(5, 300, 250), avatar: getAvatarUrl('Hayat Eczanesi', 5), products: [
    { id: 'mp14', business_id: '6', name: 'İlaç Paketi', description: 'Temel ilaç seti', price: 200, is_active: true, sort_order: 0, total_donated: 5, created_at: '', updated_at: '' },
  ]},
  { id: '7', name: 'Kültür Kitapevi', neighborhood: 'Kadıköy', mahalle: 'Bahariye', category: 'book', rating: 4.7, suspendedCount: 20, suspendedLabel: 'Askıda 20 kitap', image: getFeedImageUrl(6, 300, 250), avatar: getAvatarUrl('Kültür Kitapevi', 6), products: [
    { id: 'mp15', business_id: '7', name: 'Roman', description: 'Seçili romanlardan biri', price: 80, is_active: true, sort_order: 0, total_donated: 25, created_at: '', updated_at: '' },
    { id: 'mp16', business_id: '7', name: 'Çocuk Kitabı', description: 'Resimli çocuk kitabı', price: 60, is_active: true, sort_order: 1, total_donated: 35, created_at: '', updated_at: '' },
  ]},
  { id: '8', name: 'Temiz Market', neighborhood: 'Kadıköy', mahalle: 'Moda', category: 'cleaning', rating: 4.5, suspendedCount: 4, suspendedLabel: 'Askıda 4 temizlik paketi', image: getFeedImageUrl(7, 300, 250), avatar: getAvatarUrl('Temiz Market', 7), products: [
    { id: 'mp17', business_id: '8', name: 'Temizlik Paketi', description: 'Deterjan + yumuşatıcı', price: 150, is_active: true, sort_order: 0, total_donated: 10, created_at: '', updated_at: '' },
    { id: 'mp18', business_id: '8', name: 'Hijyen Paketi', description: 'Sabun, şampuan, diş macunu', price: 120, is_active: true, sort_order: 1, total_donated: 8, created_at: '', updated_at: '' },
  ]},
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

// Format card number with spaces
function formatCardNumber(value: string): string {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  const matches = v.match(/\d{4,16}/g)
  const match = (matches && matches[0]) || ''
  const parts = []
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }
  return parts.length ? parts.join(' ') : v
}

// Format expiry MM/YY
function formatExpiry(value: string): string {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  if (v.length >= 2) return v.substring(0, 2) + '/' + v.substring(2, 4)
  return v
}

function AskidaBagisPageContent() {
  const { user, profile, neighborhood } = useCurrentUser()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'donate' | 'available' | 'redeem' | 'manage'>('donate')
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [donations, setDonations] = useState<DonationItem[]>(mockDonations)
  const [availableDonations, setAvailableDonations] = useState<any[]>([])
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const [donationStats, setDonationStats] = useState({ total: mockDonations.length, items: 47, businesses: 8 })
  const [userBusiness, setUserBusiness] = useState<any>(null)

  const searchParams = useSearchParams()
  const paymentStatus = searchParams.get('payment')
  const paymentDonationId = searchParams.get('donationId')

  const [donationModal, setDonationModal] = useState<DonationModalState>({
    isOpen: false,
    business: null,
    selectedProduct: null,
    quantity: 1,
    selectedItem: 'standard',
    isAnonymous: false,
    message: '',
    isProcessing: false,
    isSuccess: false,
    qrCode: '',
    step: 'form',
    paymentUrl: '',
    donationId: '',
  })

  const [paymentForm, setPaymentForm] = useState<PaymentFormState>({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    errors: {},
  })

  // iyzico odeme callback sonrasi
  useEffect(() => {
    if (paymentStatus === 'success' && paymentDonationId) {
      setDonationModal(prev => ({
        ...prev,
        isOpen: true,
        step: 'success',
        isSuccess: true,
        donationId: paymentDonationId,
      }))
    }
  }, [paymentStatus, paymentDonationId])

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

  const [productManageModal, setProductManageModal] = useState<ProductManageModalState>({
    isOpen: false,
    businessId: '',
    businessName: '',
    products: [],
    editingProduct: null,
    isLoading: false,
    isSaving: false,
  })

  // Fetch donations from Supabase
  useEffect(() => {
    async function fetchDonations() {
      const { data, error } = await getDonations({ status: 'available', limit: 50 })
      if (!error && data && data.length > 0) {
        setAvailableDonations(data)
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

  // Fetch businesses with their donation products from Supabase
  useEffect(() => {
    async function fetchBusinesses() {
      try {
        // Try to fetch businesses with donation products
        const { data: bwp, error: bwpError } = await getBusinessesWithProducts()

        if (!bwpError && bwp && bwp.length > 0) {
          const mappedBusinesses = bwp.map((b: any, index: number) => ({
            id: b.id,
            name: b.name,
            neighborhood: 'Kadıköy',
            mahalle: 'Moda',
            category: b.donation_products?.[0]?.category || 'general',
            rating: b.rating || 4.5 + (index % 5) * 0.1,
            suspendedCount: b.donation_products?.reduce((s: number, p: any) => s + (p.total_donated || 0), 0) || 0,
            suspendedLabel: `${b.donation_products?.length || 0} ürün`,
            image: b.image_urls?.[0] || getFeedImageUrl(index, 300, 250),
            avatar: b.logo_url || getAvatarUrl(b.name, index),
            products: b.donation_products || [],
          } as Business))
          setBusinesses(mappedBusinesses)
          return
        }

        // Fallback: fetch businesses without products
        const supabase = createClient() as any
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .limit(10)

        if (!error && data && data.length > 0) {
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
            products: [],
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

  // Fetch user's business (for management tab)
  useEffect(() => {
    if (!user) return
    async function fetchUserBusiness() {
      try {
        const supabase = createClient() as any
        const { data } = await supabase
          .from('businesses')
          .select('*')
          .eq('owner_id', user?.id)
          .single()
        setUserBusiness(data)
      } catch (e) {
        // User may not have a business
      }
    }
    fetchUserBusiness()
  }, [user])

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
      selectedProduct: business.products?.[0] || null,
      quantity: 1,
      selectedItem: 'standard',
      isAnonymous: false,
      message: '',
      isProcessing: false,
      isSuccess: false,
      qrCode: '',
      step: 'form',
      paymentUrl: '',
      donationId: '',
    })
    setPaymentForm({ cardNumber: '', cardName: '', expiry: '', cvv: '', errors: {} })
  }

  const closeDonationModal = () => {
    setDonationModal({ ...donationModal, isOpen: false, isSuccess: false })
  }

  const validatePaymentForm = (): boolean => {
    const errors: Record<string, string> = {}
    const cardNum = paymentForm.cardNumber.replace(/\s/g, '')
    if (cardNum.length < 16) errors.cardNumber = 'Geçerli bir kart numarası girin'
    if (!paymentForm.cardName.trim()) errors.cardName = 'Kart üzerindeki isim gerekli'
    if (paymentForm.expiry.length < 5) errors.expiry = 'GG/AA formatında girin'
    if (paymentForm.cvv.length < 3) errors.cvv = 'CVV gerekli'
    setPaymentForm(prev => ({ ...prev, errors }))
    return Object.keys(errors).length === 0
  }

  const getTotalPrice = () => {
    if (!donationModal.selectedProduct) return 0
    return donationModal.selectedProduct.price * donationModal.quantity
  }

  const handleDonationSubmit = async () => {
    if (!user) return
    if (!validatePaymentForm()) return

    setDonationModal({ ...donationModal, isProcessing: true })
    try {
      const qr = generateQRCode()
      const neighborhoodId = neighborhood?.id || null

      const isValidUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
      const businessId = donationModal.business?.id && isValidUUID(donationModal.business.id)
        ? donationModal.business.id
        : null

      const totalPrice = getTotalPrice()
      const productName = donationModal.selectedProduct?.name || 'Ürün'
      const itemName = `${donationModal.quantity} ${productName}`

      // 1. Save donation as 'pending_payment'
      const { data: savedDonation, error } = await createDonation({
        user_id: user.id,
        neighborhood_id: neighborhoodId as any,
        donation_type: donationModal.selectedProduct?.category || donationModal.business?.category || 'general',
        title: `Askıda ${itemName} - ${donationModal.business?.name}`,
        description: donationModal.message || undefined,
        quantity: donationModal.quantity,
        business_id: businessId,
        qr_code: qr,
        amount: totalPrice,
        status: 'pending_payment',
        payment_status: 'pending',
      } as any)

      if (error) {
        console.warn('Donation save error:', error)
        setDonationModal({ ...donationModal, isProcessing: false })
        return
      }

      const donationId = savedDonation?.id || `d${Date.now()}`

      // 2. Call iyzico payment API
      const nameParts = (profile?.full_name || 'Anonim Bagisci').split(' ')
      const buyerName = nameParts[0] || 'Anonim'
      const buyerSurname = nameParts.slice(1).join(' ') || 'Bagisci'

      const paymentResponse = await fetch('/api/payment/iyzico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donationId,
          amount: totalPrice,
          buyerName,
          buyerSurname,
          buyerEmail: user.email || 'donor@mahallemiz.app',
          buyerPhone: profile?.phone || '+905000000000',
          buyerId: user.id,
          businessName: donationModal.business?.name || 'Isletme',
          itemName,
        }),
      })

      const paymentData = await paymentResponse.json()

      if (paymentData.success) {
        if (paymentData.mode === 'simulation') {
          // Simulation mode: show success directly
          const supabase = createClient() as any
          await supabase
            .from('donations')
            .update({ status: 'available', payment_status: 'completed' })
            .eq('id', donationId)

          // Update product donation count
          if (donationModal.selectedProduct?.id && isValidUUID(donationModal.selectedProduct.id)) {
            await incrementProductDonationCount(donationModal.selectedProduct.id, donationModal.quantity)
          }

          const newDonation: DonationItem = {
            id: donationId,
            donor: donationModal.isAnonymous ? 'Anonim' : (profile?.full_name || 'Komsu'),
            items: itemName,
            business: donationModal.business?.name || 'Isletme',
            time: 'az once',
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
            step: 'success',
            qrCode: qr,
            donationId,
          })
        } else {
          // Real iyzico: redirect to payment page
          setDonationModal({
            ...donationModal,
            isProcessing: false,
            step: 'payment',
            paymentUrl: paymentData.paymentPageUrl || '',
            donationId,
            qrCode: qr,
          })

          if (paymentData.paymentPageUrl) {
            window.open(paymentData.paymentPageUrl, '_blank')
          }
        }
      } else {
        console.warn('Payment initiation failed:', paymentData)
        const supabase = createClient() as any
        await supabase.from('donations').delete().eq('id', donationId)
        setDonationModal({ ...donationModal, isProcessing: false })
      }
    } catch (error) {
      console.warn('Error submitting donation:', error)
      setDonationModal({ ...donationModal, isProcessing: false })
    }
  }

  const handleRedeemScan = () => {
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

  const handleClaimDonation = async (donationId: string) => {
    if (!user) return
    setClaimingId(donationId)
    try {
      const { data, error } = await claimDonation(donationId, user.id)
      if (!error) {
        setAvailableDonations(prev => prev.filter(d => d.id !== donationId))
        setDonationStats(prev => ({ ...prev, items: Math.max(0, prev.items - 1) }))
      } else {
        console.warn('Claim error:', error)
      }
    } catch (e) {
      console.warn('Claim exception:', e)
    } finally {
      setClaimingId(null)
    }
  }

  // === Product Management ===
  const openProductManageModal = async (businessId: string, businessName: string) => {
    setProductManageModal({
      isOpen: true,
      businessId,
      businessName,
      products: [],
      editingProduct: null,
      isLoading: true,
      isSaving: false,
    })

    const { data, error } = await getBusinessProducts(businessId)
    setProductManageModal(prev => ({
      ...prev,
      products: data || [],
      isLoading: false,
    }))
  }

  const handleSaveProduct = async () => {
    const ep = productManageModal.editingProduct
    if (!ep || !ep.name || !ep.price) return

    setProductManageModal(prev => ({ ...prev, isSaving: true }))

    if (ep.id) {
      // Update existing
      const { data, error } = await updateDonationProduct(ep.id, {
        name: ep.name,
        description: ep.description || '',
        price: ep.price,
        category: ep.category || '',
      })
      if (!error && data) {
        setProductManageModal(prev => ({
          ...prev,
          products: prev.products.map(p => p.id === data.id ? data : p),
          editingProduct: null,
          isSaving: false,
        }))
      } else {
        setProductManageModal(prev => ({ ...prev, isSaving: false }))
      }
    } else {
      // Create new
      const { data, error } = await createDonationProduct({
        business_id: productManageModal.businessId,
        name: ep.name,
        description: ep.description || '',
        price: ep.price,
        category: ep.category || '',
        sort_order: productManageModal.products.length,
      })
      if (!error && data) {
        setProductManageModal(prev => ({
          ...prev,
          products: [...prev.products, data],
          editingProduct: null,
          isSaving: false,
        }))
      } else {
        console.warn('Create product error:', error)
        setProductManageModal(prev => ({ ...prev, isSaving: false }))
      }
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    const { error } = await deleteDonationProduct(productId)
    if (!error) {
      setProductManageModal(prev => ({
        ...prev,
        products: prev.products.filter(p => p.id !== productId),
      }))
    }
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

        {/* Tabs */}
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
            onClick={() => setActiveTab('available')}
            className={cn(
              'flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap text-sm sm:text-base',
              activeTab === 'available'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-surface text-text-primary border border-border hover:border-primary'
            )}
          >
            <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Askıda Ne Var?</span>
            <span className="sm:hidden">Ne Var?</span>
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
          {userBusiness && (
            <button
              onClick={() => setActiveTab('manage')}
              className={cn(
                'flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap text-sm sm:text-base',
                activeTab === 'manage'
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-surface text-text-primary border border-border hover:border-primary'
              )}
            >
              <Store className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Ürünlerim</span>
              <span className="sm:hidden">Ürünler</span>
            </button>
          )}
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
                    <p className="text-sm font-semibold text-text-primary">Esnaf & Ürün Seç</p>
                    <p className="text-xs text-text-muted">İşletmenin bağış ürünlerinden birini seç</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Öde & Bağışla</p>
                    <p className="text-xs text-text-muted">Kredi kartı ile güvenli ödeme yap</p>
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

            {/* Business Cards Grid - Now shows products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-12">
              {filteredBusinesses.map((business) => (
                <div
                  key={business.id}
                  className="bg-surface rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative h-32 sm:h-40 w-full bg-background overflow-hidden">
                    <Image src={business.image} alt={business.name} fill unoptimized className="object-cover" />
                    <div className="absolute bottom-2 left-2 bg-primary text-white text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {business.products?.length || 0} ürün
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

                    {/* Product list preview */}
                    {business.products && business.products.length > 0 && (
                      <div className="mb-3 space-y-1.5">
                        {business.products.slice(0, 3).map((product) => (
                          <div key={product.id} className="flex items-center justify-between bg-background rounded-lg px-2.5 py-1.5">
                            <span className="text-xs text-text-primary font-medium truncate">{product.name}</span>
                            <span className="text-xs font-bold text-primary whitespace-nowrap ml-2">{product.price} TL</span>
                          </div>
                        ))}
                      </div>
                    )}

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

        {/* === AVAILABLE DONATIONS TAB === */}
        {activeTab === 'available' && (
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-text-primary flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                Askıda Bekleyen Bağışlar
              </h2>
              <span className="text-sm text-text-muted bg-surface border border-border rounded-full px-3 py-1">
                {availableDonations.length} bağış
              </span>
            </div>

            {availableDonations.length === 0 ? (
              <div className="text-center py-16 bg-surface rounded-xl border border-border">
                <div className="text-5xl mb-4">🙏</div>
                <p className="text-text-primary font-semibold mb-1">Şu an askıda bağış yok</p>
                <p className="text-text-muted text-sm mb-6">İlk bağışı sen yap, komşularını mutlu et!</p>
                <button
                  onClick={() => setActiveTab('donate')}
                  className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary-hover transition-colors"
                >
                  Bağış Yap
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableDonations.map((d: any) => {
                  const typeEmojis: Record<string, string> = {
                    Ekmek: '🍞', Kahve: '☕', Kitap: '📚', Et: '🥩', Süt: '🥛',
                    Traş: '✂️', İlaç: '💊', Temizlik: '🧹', standard: '🎁',
                  }
                  const emoji = typeEmojis[d.donation_type] || '🎁'
                  const isExpired = d.expires_at && new Date(d.expires_at) < new Date()
                  const daysLeft = d.expires_at
                    ? Math.max(0, Math.ceil((new Date(d.expires_at).getTime() - Date.now()) / 86400000))
                    : null

                  return (
                    <div key={d.id} className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                      <div className="bg-gradient-to-r from-[#e8f5e9] to-[#f0fdf4] px-4 py-3 flex items-center gap-3 border-b border-border">
                        <span className="text-3xl">{emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-text-primary text-sm truncate">{d.title}</p>
                          <p className="text-xs text-text-muted truncate">
                            {d.businesses?.name || 'İşletme'}
                          </p>
                        </div>
                        <div className="flex-shrink-0 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                          x{d.quantity || 1}
                        </div>
                      </div>

                      <div className="p-4 flex flex-col flex-grow gap-3">
                        {d.description && (
                          <p className="text-xs text-text-muted italic">&ldquo;{d.description}&rdquo;</p>
                        )}
                        <div className="flex items-center justify-between text-xs text-text-muted">
                          <span>
                            {new Date(d.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                          </span>
                          {daysLeft !== null && (
                            <span className={daysLeft <= 3 ? 'text-red-500 font-semibold' : 'text-text-muted'}>
                              {daysLeft > 0 ? `${daysLeft} gün kaldı` : 'Bugün son gün'}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleClaimDonation(d.id)}
                          disabled={!!claimingId || isExpired}
                          className={cn(
                            'w-full font-bold py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto text-sm',
                            isExpired
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : claimingId === d.id
                              ? 'bg-primary/60 text-white cursor-not-allowed'
                              : 'bg-primary hover:bg-primary-hover text-white'
                          )}
                        >
                          {claimingId === d.id ? (
                            <><span className="animate-spin text-base">⏳</span>Alınıyor...</>
                          ) : isExpired ? (
                            'Süresi Doldu'
                          ) : (
                            <><Check className="w-4 h-4" />Bağışı Al</>
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* === REDEEM TAB === */}
        {activeTab === 'redeem' && (
          <div className="max-w-lg mx-auto px-4">
            <div className="bg-surface rounded-xl border border-border p-4 sm:p-6 mb-4 sm:mb-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <ScanLine className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-2">Askıda Bağışı Kullan</h3>
              <p className="text-sm text-text-muted mb-4 sm:mb-6">
                Esnaftaki karekodu telefonunla okut ve askıdaki ürünü al. Kimliğin gizli kalır.
              </p>

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

        {/* === MANAGE (Business Products) TAB === */}
        {activeTab === 'manage' && userBusiness && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-text-primary flex items-center gap-2">
                <Store className="w-5 h-5 text-primary" />
                Bağış Ürünlerim
              </h2>
              <span className="text-xs text-text-muted bg-surface border border-border rounded-full px-3 py-1">
                En fazla 3 ürün
              </span>
            </div>

            <div className="bg-surface rounded-xl border border-border p-4 sm:p-5 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center overflow-hidden">
                  {userBusiness.logo_url ? (
                    <Image src={userBusiness.logo_url} alt={userBusiness.name} width={48} height={48} unoptimized className="rounded-full" />
                  ) : (
                    <Store className="w-6 h-6 text-text-muted" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-text-primary">{userBusiness.name}</p>
                  <p className="text-xs text-text-muted">{userBusiness.address}</p>
                </div>
              </div>

              <p className="text-sm text-text-muted mb-4">
                Aşağıda bağış ürünlerinizi yönetebilirsiniz. Her işletme en fazla 3 aktif bağış ürünü tanımlayabilir.
                Müşteriler bu ürünlerden satın alarak ihtiyaç sahiplerine bağışta bulunabilir.
              </p>

              <button
                onClick={() => openProductManageModal(userBusiness.id, userBusiness.name)}
                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Settings className="w-4 h-4" />
                Ürünleri Yönet
              </button>
            </div>

            <div className="bg-[#fffbe6] border border-[#ffe58f] rounded-xl p-4 text-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-[#d48806] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#d48806] mb-1">Nasıl Çalışır?</p>
                  <p className="text-[#8c6d1f] text-xs">
                    Tanımladığınız ürünler bağış sayfasında görünecektir. Bağışçılar bu ürünleri satın alarak komşulara bağışta bulunur.
                    Ödeme tamamlandığında QR kod oluşturulur ve ihtiyaç sahibi bu kodu sizde okutarak ürünü teslim alır.
                  </p>
                </div>
              </div>
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
                  <div className="flex items-start gap-2 sm:gap-3">
                    {donation.isAnonymous ? (
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-background flex items-center justify-center text-base sm:text-lg">
                        🙏
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden">
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

      {/* === DONATION MODAL (with product selection + credit card form) === */}
      {donationModal.isOpen && donationModal.business && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto mx-auto">
            <div className="sticky top-0 flex items-center justify-between p-4 sm:p-5 border-b border-border bg-surface rounded-t-2xl gap-2 z-10">
              <h3 className="text-base sm:text-lg font-bold text-text-primary">Bağış Yap</h3>
              <button onClick={closeDonationModal} className="text-[#666] hover:text-text-primary flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5">
              {donationModal.step === 'form' && (
                <>
                  {/* Business */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 p-3 bg-background rounded-lg">
                    <Image src={donationModal.business.avatar} alt={donationModal.business.name} width={44} height={44} unoptimized className="rounded-full flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-text-primary truncate">{donationModal.business.name}</p>
                      <p className="text-xs text-text-muted truncate">{donationModal.business.neighborhood}, {donationModal.business.mahalle}</p>
                    </div>
                  </div>

                  {/* Product Selection */}
                  {donationModal.business.products && donationModal.business.products.length > 0 && (
                    <div className="mb-4 sm:mb-5">
                      <label className="block text-sm font-semibold text-text-primary mb-2">Ürün Seç</label>
                      <div className="space-y-2">
                        {donationModal.business.products.map((product) => (
                          <label
                            key={product.id}
                            className={cn(
                              'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                              donationModal.selectedProduct?.id === product.id
                                ? 'border-primary bg-[#e8f5e9]'
                                : 'border-border hover:border-primary'
                            )}
                          >
                            <input
                              type="radio"
                              name="product"
                              checked={donationModal.selectedProduct?.id === product.id}
                              onChange={() => setDonationModal({ ...donationModal, selectedProduct: product })}
                              className="w-4 h-4 text-primary flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-text-primary">{product.name}</p>
                              {product.description && (
                                <p className="text-xs text-text-muted">{product.description}</p>
                              )}
                            </div>
                            <span className="text-sm font-bold text-primary whitespace-nowrap">{product.price} TL</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

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

                  {/* Price Summary */}
                  <div className="bg-background rounded-lg p-3 sm:p-4 mb-4 sm:mb-5">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#666]">Ürün</span>
                      <span className="text-text-primary">{donationModal.selectedProduct?.name || 'Seçiniz'}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#666]">Birim fiyat</span>
                      <span className="text-text-primary">{donationModal.selectedProduct?.price || 0} TL</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2 pb-2 border-b border-border">
                      <span className="text-[#666]">Adet</span>
                      <span className="text-text-primary">{donationModal.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-text-primary">Toplam</span>
                      <span className="text-lg sm:text-xl font-bold text-primary">{getTotalPrice()} TL</span>
                    </div>
                  </div>

                  {/* Credit Card Form (Fake iyzico) */}
                  <div className="mb-4 sm:mb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <CreditCard className="w-4 h-4 text-[#1a1f71]" />
                      <span className="text-sm font-semibold text-text-primary">Kart Bilgileri</span>
                      <span className="text-xs text-text-muted ml-auto flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        iyzico ile güvenli
                      </span>
                    </div>

                    <div className="space-y-3">
                      {/* Card Number */}
                      <div>
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          value={paymentForm.cardNumber}
                          onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: formatCardNumber(e.target.value), errors: { ...paymentForm.errors, cardNumber: '' } })}
                          maxLength={19}
                          className={cn(
                            'w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none font-mono tracking-wider',
                            paymentForm.errors.cardNumber ? 'border-red-400 focus:border-red-500' : 'border-border focus:border-primary'
                          )}
                        />
                        {paymentForm.errors.cardNumber && (
                          <p className="text-xs text-red-500 mt-1">{paymentForm.errors.cardNumber}</p>
                        )}
                      </div>

                      {/* Card Name */}
                      <div>
                        <input
                          type="text"
                          placeholder="Kart Üzerindeki İsim"
                          value={paymentForm.cardName}
                          onChange={(e) => setPaymentForm({ ...paymentForm, cardName: e.target.value.toUpperCase(), errors: { ...paymentForm.errors, cardName: '' } })}
                          className={cn(
                            'w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none uppercase',
                            paymentForm.errors.cardName ? 'border-red-400 focus:border-red-500' : 'border-border focus:border-primary'
                          )}
                        />
                        {paymentForm.errors.cardName && (
                          <p className="text-xs text-red-500 mt-1">{paymentForm.errors.cardName}</p>
                        )}
                      </div>

                      {/* Expiry + CVV */}
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="AA/YY"
                            value={paymentForm.expiry}
                            onChange={(e) => setPaymentForm({ ...paymentForm, expiry: formatExpiry(e.target.value), errors: { ...paymentForm.errors, expiry: '' } })}
                            maxLength={5}
                            className={cn(
                              'w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none font-mono text-center',
                              paymentForm.errors.expiry ? 'border-red-400 focus:border-red-500' : 'border-border focus:border-primary'
                            )}
                          />
                          {paymentForm.errors.expiry && (
                            <p className="text-xs text-red-500 mt-1">{paymentForm.errors.expiry}</p>
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="CVV"
                            value={paymentForm.cvv}
                            onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value.replace(/\D/g, '').slice(0, 4), errors: { ...paymentForm.errors, cvv: '' } })}
                            maxLength={4}
                            className={cn(
                              'w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none font-mono text-center',
                              paymentForm.errors.cvv ? 'border-red-400 focus:border-red-500' : 'border-border focus:border-primary'
                            )}
                          />
                          {paymentForm.errors.cvv && (
                            <p className="text-xs text-red-500 mt-1">{paymentForm.errors.cvv}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleDonationSubmit}
                    disabled={donationModal.isProcessing || !donationModal.selectedProduct}
                    className="w-full bg-primary hover:bg-primary-hover disabled:opacity-70 text-white font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {donationModal.isProcessing ? (
                      <><Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />Ödeme işleniyor...</>
                    ) : (
                      <><CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />{getTotalPrice()} TL Öde ve Bağışla</>
                    )}
                  </button>

                  <p className="text-xs text-text-muted text-center mt-2">
                    Test modunda gerçek ödeme alınmaz
                  </p>
                </>
              )}

              {donationModal.step === 'payment' && (
                <div className="text-center py-6 sm:py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                    <CreditCard className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-text-primary mb-2">Ödeme Bekleniyor</h4>
                  <p className="text-sm text-[#666] mb-6">
                    iyzico ödeme sayfası yeni bir sekmede açıldı. Ödemenizi tamamladıktan sonra bu sayfa otomatik güncellenecektir.
                  </p>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                      <span className="text-sm font-medium text-blue-800">Ödeme tamamlanmayı bekliyor...</span>
                    </div>
                    <p className="text-xs text-blue-600">
                      Toplam: {getTotalPrice()} TL
                    </p>
                  </div>

                  {donationModal.paymentUrl && (
                    <a
                      href={donationModal.paymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-4"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Ödeme sayfasını tekrar aç
                    </a>
                  )}

                  <div className="mt-4">
                    <button
                      onClick={closeDonationModal}
                      className="text-sm text-text-muted hover:text-text-primary"
                    >
                      İptal et
                    </button>
                  </div>
                </div>
              )}

              {donationModal.step === 'success' && (
                <div className="text-center py-3 sm:py-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-[#e8f5e9] rounded-full mb-3 sm:mb-4">
                    <Check className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-text-primary mb-2">Ödeme Başarılı, Bağışınız Tamamlandı!</h4>
                  <p className="text-sm text-[#666] mb-4 sm:mb-6">
                    {donationModal.business ? `${donationModal.quantity} adet ${donationModal.selectedProduct?.name || 'ürün'} ${donationModal.business.name} için askıya alındı.` : 'Bağışınız askıya alındı ve komşularınız tarafından görülebilir.'}
                  </p>

                  {donationModal.qrCode && (
                    <div className="bg-background rounded-xl p-4 sm:p-6 mb-3 sm:mb-4 inline-block w-full sm:w-auto">
                      <div className="w-40 h-40 sm:w-48 sm:h-48 bg-surface rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 border-2 border-dashed border-primary">
                        <div className="text-center">
                          <QrCode className="w-16 h-16 sm:w-20 sm:h-20 text-primary mx-auto mb-1 sm:mb-2" />
                          <p className="text-xs text-text-muted">Bağış Karekodu</p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm font-mono font-bold text-text-primary break-all">{donationModal.qrCode}</p>
                    </div>
                  )}

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
              {redeemModal.step === 'scan' && (
                <div className="text-center">
                  <div className="w-48 h-48 sm:w-64 sm:h-64 bg-background rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 border-2 border-dashed border-primary">
                    <div className="text-center">
                      <ScanLine className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-2 sm:mb-3 animate-pulse" />
                      <p className="text-xs sm:text-sm text-text-muted">Kamerayı karekoda tut</p>
                    </div>
                  </div>

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

      {/* === PRODUCT MANAGEMENT MODAL === */}
      {productManageModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto mx-auto">
            <div className="sticky top-0 flex items-center justify-between p-4 sm:p-5 border-b border-border bg-surface rounded-t-2xl gap-2 z-10">
              <h3 className="text-base sm:text-lg font-bold text-text-primary flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Bağış Ürünleri - {productManageModal.businessName}
              </h3>
              <button onClick={() => setProductManageModal({ ...productManageModal, isOpen: false })} className="text-[#666] hover:text-text-primary flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5">
              {productManageModal.isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
                  <p className="text-sm text-text-muted">Ürünler yükleniyor...</p>
                </div>
              ) : (
                <>
                  {/* Existing Products */}
                  <div className="space-y-3 mb-4">
                    {productManageModal.products.map((product) => (
                      <div key={product.id} className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-text-primary">{product.name}</p>
                          {product.description && (
                            <p className="text-xs text-text-muted truncate">{product.description}</p>
                          )}
                          <p className="text-xs text-primary font-semibold mt-1">{product.price} TL · {product.total_donated || 0} kez bağışlandı</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => setProductManageModal(prev => ({ ...prev, editingProduct: { ...product } }))}
                            className="p-1.5 text-text-muted hover:text-primary rounded-lg hover:bg-surface transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-1.5 text-text-muted hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {productManageModal.products.length === 0 && !productManageModal.editingProduct && (
                      <div className="text-center py-6">
                        <Package className="w-10 h-10 text-text-muted mx-auto mb-2" />
                        <p className="text-sm text-text-muted">Henüz bağış ürünü eklenmemiş</p>
                      </div>
                    )}
                  </div>

                  {/* Add/Edit Product Form */}
                  {productManageModal.editingProduct ? (
                    <div className="bg-[#e8f5e9] rounded-lg p-4 border border-[#bbf7d0]">
                      <h4 className="text-sm font-bold text-text-primary mb-3">
                        {productManageModal.editingProduct.id ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
                      </h4>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Ürün adı (ör: Ekmek, Kahve, Saç Traşı)"
                          value={productManageModal.editingProduct.name || ''}
                          onChange={(e) => setProductManageModal(prev => ({
                            ...prev,
                            editingProduct: { ...prev.editingProduct!, name: e.target.value }
                          }))}
                          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        />
                        <input
                          type="text"
                          placeholder="Açıklama (isteğe bağlı)"
                          value={productManageModal.editingProduct.description || ''}
                          onChange={(e) => setProductManageModal(prev => ({
                            ...prev,
                            editingProduct: { ...prev.editingProduct!, description: e.target.value }
                          }))}
                          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        />
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <label className="block text-xs text-text-muted mb-1">Fiyat (TL)</label>
                            <input
                              type="number"
                              placeholder="0"
                              min="1"
                              value={productManageModal.editingProduct.price || ''}
                              onChange={(e) => setProductManageModal(prev => ({
                                ...prev,
                                editingProduct: { ...prev.editingProduct!, price: parseFloat(e.target.value) || 0 }
                              }))}
                              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-text-muted mb-1">Kategori</label>
                            <select
                              value={productManageModal.editingProduct.category || ''}
                              onChange={(e) => setProductManageModal(prev => ({
                                ...prev,
                                editingProduct: { ...prev.editingProduct!, category: e.target.value }
                              }))}
                              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white"
                            >
                              <option value="">Seçiniz</option>
                              {categories.filter(c => c.id !== 'all').map(c => (
                                <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveProduct}
                            disabled={productManageModal.isSaving || !productManageModal.editingProduct.name || !productManageModal.editingProduct.price}
                            className="flex-1 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                          >
                            {productManageModal.isSaving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            Kaydet
                          </button>
                          <button
                            onClick={() => setProductManageModal(prev => ({ ...prev, editingProduct: null }))}
                            className="px-4 py-2 border border-border rounded-lg text-sm text-text-muted hover:bg-surface"
                          >
                            İptal
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : productManageModal.products.length < 3 ? (
                    <button
                      onClick={() => setProductManageModal(prev => ({
                        ...prev,
                        editingProduct: { name: '', description: '', price: 0, category: '' }
                      }))}
                      className="w-full border-2 border-dashed border-primary text-primary font-medium py-3 rounded-lg hover:bg-[#e8f5e9] transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Yeni Ürün Ekle ({productManageModal.products.length}/3)
                    </button>
                  ) : (
                    <p className="text-center text-xs text-text-muted py-2">
                      Maksimum 3 ürün sınırına ulaşıldı
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// NOT (2026-06-07 / pazara-hazırlık denetimi):
// "Askıda Bağış" özelliği henüz tamamlanmadı. Ödeme adımı SAHTE bir kart formu
// (bkz. ~satır 1382 "Fake iyzico") olup var olmayan /api/payment/iyzico ucuna
// POST atıyordu (404) ve gerçek kart numarası topluyordu — bu bir PCI/uyumluluk
// riski ve Apple/Google mağaza ret sebebidir. Ayrıca DB boşken kullanıcıya sahte
// istatistik (47 ürün / 8 işletme) gösteriyordu.
// Gerçek kullanıcılar bozuk/sahte ödeme akışına ulaşmasın diye özellik geçici
// olarak "yakında" ekranıyla kapatıldı. TÜM çalışma kodu (AskidaBagisPageContent)
// aşağıda KORUNUYOR; ödeme PayTR'a bağlanıp test edildikten sonra tek satırla
// (return <AskidaBagisPageContent />) geri açılabilir.
export default function AskidaBagisPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Heart className="h-10 w-10 text-primary" />
      </div>
      <h1 className="mb-2 text-2xl font-bold">Askıda Bağış çok yakında</h1>
      <p className="mb-6 text-text-muted">
        Mahalle esnafıyla dayanışma özelliğimizi güvenli ödeme altyapısıyla
        birlikte hazırlıyoruz. Çok yakında burada olacak.
      </p>
      <a
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-white transition hover:opacity-90"
      >
        <ArrowRight className="h-4 w-4" />
        Ana sayfaya dön
      </a>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- özellik tamamlanınca geri açılacak
function _AskidaBagisPageGatedContent() {
  return (
    <Suspense fallback={<div className="w-full py-12 text-center text-text-muted">Yükleniyor...</div>}>
      <AskidaBagisPageContent />
    </Suspense>
  )
}
