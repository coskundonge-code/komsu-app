'use client'

import { useState, useMemo } from 'react'
import { Search, Star, MapPin, ChevronLeft, ArrowUpDown } from 'lucide-react'
import Link from 'next/link'
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images'

interface Business {
  id: string
  name: string
  category: string
  rating: number
  reviewCount: number
  distance: string
  logo: string
  isFavorite?: boolean
}

const CATEGORY_MAP = {
  restoran: { name: 'Restoran', icon: '🍽️', description: 'Lezzetli yemeklerin keşfedilmesi' },
  kafe: { name: 'Kafe', icon: '☕', description: 'Keyifli kahve molası' },
  market: { name: 'Market', icon: '🛒', description: 'Günlük ihtiyaçlar' },
  kuafor: { name: 'Kuaför', icon: '💇', description: 'Saç bakım hizmetleri' },
  eczane: { name: 'Eczane', icon: '💊', description: 'İlaç ve sağlık ürünleri' },
  veteriner: { name: 'Veteriner', icon: '🐾', description: 'Evcil hayvan bakımı' },
  'spor-salonu': { name: 'Spor Salonu', icon: '💪', description: 'Fitness ve egzersiz' },
  'oto-servis': { name: 'Oto Servis', icon: '🚗', description: 'Araç bakım ve onarım' },
  temizlik: { name: 'Temizlik', icon: '🧹', description: 'Temizlik hizmetleri' },
  egitim: { name: 'Eğitim', icon: '📚', description: 'Eğitim kurumları' },
}

const MOCK_BUSINESSES_BY_CATEGORY: Record<string, Business[]> = {
  restoran: [
    {
      id: '1',
      name: 'Medeniyetler Sofası',
      category: 'Restoran',
      rating: 4.8,
      reviewCount: 245,
      distance: '0.5 km',
      logo: getFeedImageUrl(1, 200, 200),
    },
    {
      id: '2',
      name: 'Anadolu Lezzetleri',
      category: 'Restoran',
      rating: 4.6,
      reviewCount: 189,
      distance: '1.2 km',
      logo: getFeedImageUrl(2, 200, 200),
    },
    {
      id: '3',
      name: 'Deniz Peşinde',
      category: 'Restoran',
      rating: 4.7,
      reviewCount: 312,
      distance: '0.8 km',
      logo: getFeedImageUrl(3, 200, 200),
    },
    {
      id: '4',
      name: 'Mangal Evi',
      category: 'Restoran',
      rating: 4.5,
      reviewCount: 156,
      distance: '1.5 km',
      logo: getFeedImageUrl(4, 200, 200),
    },
    {
      id: '5',
      name: 'Pide Ustası Ahmet',
      category: 'Restoran',
      rating: 4.9,
      reviewCount: 423,
      distance: '0.3 km',
      logo: getFeedImageUrl(5, 200, 200),
    },
    {
      id: '6',
      name: 'Kebap Dukkanı',
      category: 'Restoran',
      rating: 4.4,
      reviewCount: 134,
      distance: '2 km',
      logo: getFeedImageUrl(6, 200, 200),
    },
    {
      id: '7',
      name: 'Evin Mutfağı',
      category: 'Restoran',
      rating: 4.7,
      reviewCount: 267,
      distance: '1.1 km',
      logo: getFeedImageUrl(7, 200, 200),
    },
    {
      id: '8',
      name: 'Suşi Sanatı',
      category: 'Restoran',
      rating: 4.6,
      reviewCount: 198,
      distance: '1.8 km',
      logo: getFeedImageUrl(8, 200, 200),
    },
  ],
  kafe: [
    {
      id: '1',
      name: 'Kahvehane Keyif',
      category: 'Kafe',
      rating: 4.8,
      reviewCount: 345,
      distance: '0.4 km',
      logo: getFeedImageUrl(10, 200, 200),
    },
    {
      id: '2',
      name: 'Espresso Köşesi',
      category: 'Kafe',
      rating: 4.7,
      reviewCount: 267,
      distance: '1 km',
      logo: getFeedImageUrl(11, 200, 200),
    },
    {
      id: '3',
      name: 'Kuğu Kafe',
      category: 'Kafe',
      rating: 4.5,
      reviewCount: 189,
      distance: '1.3 km',
      logo: getFeedImageUrl(12, 200, 200),
    },
    {
      id: '4',
      name: 'Çay Bahçesi',
      category: 'Kafe',
      rating: 4.6,
      reviewCount: 212,
      distance: '0.7 km',
      logo: getFeedImageUrl(13, 200, 200),
    },
    {
      id: '5',
      name: 'Mocha Mocha',
      category: 'Kafe',
      rating: 4.9,
      reviewCount: 456,
      distance: '0.2 km',
      logo: getFeedImageUrl(14, 200, 200),
    },
    {
      id: '6',
      name: 'Türk Kahvesi Ustası',
      category: 'Kafe',
      rating: 4.4,
      reviewCount: 128,
      distance: '2.1 km',
      logo: getFeedImageUrl(15, 200, 200),
    },
    {
      id: '7',
      name: 'Sosyal Mekan',
      category: 'Kafe',
      rating: 4.6,
      reviewCount: 289,
      distance: '0.9 km',
      logo: getFeedImageUrl(16, 200, 200),
    },
    {
      id: '8',
      name: 'Vintage Kafe',
      category: 'Kafe',
      rating: 4.7,
      reviewCount: 334,
      distance: '1.4 km',
      logo: getFeedImageUrl(17, 200, 200),
    },
  ],
  market: [
    {
      id: '1',
      name: 'Mahalle Marketi',
      category: 'Market',
      rating: 4.5,
      reviewCount: 198,
      distance: '0.6 km',
      logo: getFeedImageUrl(20, 200, 200),
    },
    {
      id: '2',
      name: 'Taze Pazarı',
      category: 'Market',
      rating: 4.7,
      reviewCount: 267,
      distance: '1.2 km',
      logo: getFeedImageUrl(21, 200, 200),
    },
    {
      id: '3',
      name: 'Organik Ürünler',
      category: 'Market',
      rating: 4.8,
      reviewCount: 345,
      distance: '1.8 km',
      logo: getFeedImageUrl(22, 200, 200),
    },
    {
      id: '4',
      name: 'Zincir Market',
      category: 'Market',
      rating: 4.3,
      reviewCount: 156,
      distance: '2.5 km',
      logo: getFeedImageUrl(23, 200, 200),
    },
    {
      id: '5',
      name: 'Ev Ürünleri Dükkanı',
      category: 'Market',
      rating: 4.6,
      reviewCount: 234,
      distance: '0.8 km',
      logo: getFeedImageUrl(24, 200, 200),
    },
    {
      id: '6',
      name: 'Esans Ürünleri',
      category: 'Market',
      rating: 4.4,
      reviewCount: 167,
      distance: '1.5 km',
      logo: getFeedImageUrl(25, 200, 200),
    },
    {
      id: '7',
      name: 'Attar Pazarı',
      category: 'Market',
      rating: 4.7,
      reviewCount: 289,
      distance: '0.5 km',
      logo: getFeedImageUrl(26, 200, 200),
    },
    {
      id: '8',
      name: 'Gıda Deposu',
      category: 'Market',
      rating: 4.5,
      reviewCount: 201,
      distance: '1.9 km',
      logo: getFeedImageUrl(27, 200, 200),
    },
  ],
  kuafor: [
    {
      id: '1',
      name: 'Usta Berber',
      category: 'Kuaför',
      rating: 4.9,
      reviewCount: 512,
      distance: '0.3 km',
      logo: getFeedImageUrl(30, 200, 200),
    },
    {
      id: '2',
      name: 'Saç Tasarımı Nuri',
      category: 'Kuaför',
      rating: 4.7,
      reviewCount: 289,
      distance: '1.1 km',
      logo: getFeedImageUrl(31, 200, 200),
    },
    {
      id: '3',
      name: 'Güzellik Salonu Ayşe',
      category: 'Kuaför',
      rating: 4.6,
      reviewCount: 234,
      distance: '1.7 km',
      logo: getFeedImageUrl(32, 200, 200),
    },
    {
      id: '4',
      name: 'Modern Kuaför',
      category: 'Kuaför',
      rating: 4.8,
      reviewCount: 401,
      distance: '0.9 km',
      logo: getFeedImageUrl(33, 200, 200),
    },
    {
      id: '5',
      name: 'Trend Saç',
      category: 'Kuaför',
      rating: 4.5,
      reviewCount: 167,
      distance: '2 km',
      logo: getFeedImageUrl(34, 200, 200),
    },
    {
      id: '6',
      name: 'Klasik Berber',
      category: 'Kuaför',
      rating: 4.4,
      reviewCount: 145,
      distance: '1.3 km',
      logo: getFeedImageUrl(35, 200, 200),
    },
    {
      id: '7',
      name: 'Cilt Bakımı Dermatolog',
      category: 'Kuaför',
      rating: 4.8,
      reviewCount: 367,
      distance: '0.6 km',
      logo: getFeedImageUrl(36, 200, 200),
    },
    {
      id: '8',
      name: 'Organik Kozmetik',
      category: 'Kuaför',
      rating: 4.6,
      reviewCount: 203,
      distance: '1.5 km',
      logo: getFeedImageUrl(37, 200, 200),
    },
  ],
  eczane: [
    {
      id: '1',
      name: 'Sağlık Eczanesi',
      category: 'Eczane',
      rating: 4.8,
      reviewCount: 289,
      distance: '0.4 km',
      logo: getFeedImageUrl(40, 200, 200),
    },
    {
      id: '2',
      name: 'Eczane Demiroğlu',
      category: 'Eczane',
      rating: 4.7,
      reviewCount: 245,
      distance: '1.2 km',
      logo: getFeedImageUrl(41, 200, 200),
    },
    {
      id: '3',
      name: '24 Saat Eczanesi',
      category: 'Eczane',
      rating: 4.9,
      reviewCount: 334,
      distance: '0.8 km',
      logo: getFeedImageUrl(42, 200, 200),
    },
    {
      id: '4',
      name: 'Merkez Eczanesi',
      category: 'Eczane',
      rating: 4.5,
      reviewCount: 156,
      distance: '1.8 km',
      logo: getFeedImageUrl(43, 200, 200),
    },
    {
      id: '5',
      name: 'Tıbbi Eczane',
      category: 'Eczane',
      rating: 4.6,
      reviewCount: 198,
      distance: '0.9 km',
      logo: getFeedImageUrl(44, 200, 200),
    },
    {
      id: '6',
      name: 'Doktor Tavsiyesi',
      category: 'Eczane',
      rating: 4.7,
      reviewCount: 267,
      distance: '1.4 km',
      logo: getFeedImageUrl(45, 200, 200),
    },
    {
      id: '7',
      name: 'Kozmetik Eczanesi',
      category: 'Eczane',
      rating: 4.8,
      reviewCount: 312,
      distance: '0.6 km',
      logo: getFeedImageUrl(46, 200, 200),
    },
    {
      id: '8',
      name: 'Homeopati Merkezi',
      category: 'Eczane',
      rating: 4.4,
      reviewCount: 128,
      distance: '2.2 km',
      logo: getFeedImageUrl(47, 200, 200),
    },
  ],
  veteriner: [
    {
      id: '1',
      name: 'Evcil Dostlar Klinigi',
      category: 'Veteriner',
      rating: 4.9,
      reviewCount: 267,
      distance: '0.7 km',
      logo: getFeedImageUrl(50, 200, 200),
    },
    {
      id: '2',
      name: 'Pet Veteriner Dr. Ahmet',
      category: 'Veteriner',
      rating: 4.7,
      reviewCount: 189,
      distance: '1.3 km',
      logo: getFeedImageUrl(51, 200, 200),
    },
    {
      id: '3',
      name: 'Çiftlik Hayvan Klinigi',
      category: 'Veteriner',
      rating: 4.6,
      reviewCount: 145,
      distance: '2.1 km',
      logo: getFeedImageUrl(52, 200, 200),
    },
    {
      id: '4',
      name: 'Modern Veteriner Hastanesi',
      category: 'Veteriner',
      rating: 4.8,
      reviewCount: 301,
      distance: '1.1 km',
      logo: getFeedImageUrl(53, 200, 200),
    },
    {
      id: '5',
      name: 'Köpek Bakım Merkezi',
      category: 'Veteriner',
      rating: 4.5,
      reviewCount: 167,
      distance: '1.8 km',
      logo: getFeedImageUrl(54, 200, 200),
    },
    {
      id: '6',
      name: 'Kuş Veteriner',
      category: 'Veteriner',
      rating: 4.7,
      reviewCount: 123,
      distance: '2.3 km',
      logo: getFeedImageUrl(55, 200, 200),
    },
    {
      id: '7',
      name: 'Acil Veteriner Servisi',
      category: 'Veteriner',
      rating: 4.9,
      reviewCount: 234,
      distance: '0.5 km',
      logo: getFeedImageUrl(56, 200, 200),
    },
    {
      id: '8',
      name: 'Grooming Sarayı',
      category: 'Veteriner',
      rating: 4.6,
      reviewCount: 198,
      distance: '1.4 km',
      logo: getFeedImageUrl(57, 200, 200),
    },
  ],
  'spor-salonu': [
    {
      id: '1',
      name: 'Fitness Plus',
      category: 'Spor Salonu',
      rating: 4.7,
      reviewCount: 289,
      distance: '0.8 km',
      logo: getFeedImageUrl(60, 200, 200),
    },
    {
      id: '2',
      name: 'Yazlık Spor Kompleksi',
      category: 'Spor Salonu',
      rating: 4.8,
      reviewCount: 345,
      distance: '1.5 km',
      logo: getFeedImageUrl(61, 200, 200),
    },
    {
      id: '3',
      name: 'Pilates Akademisi',
      category: 'Spor Salonu',
      rating: 4.6,
      reviewCount: 201,
      distance: '0.6 km',
      logo: getFeedImageUrl(62, 200, 200),
    },
    {
      id: '4',
      name: 'CrossFit Merkezi',
      category: 'Spor Salonu',
      rating: 4.9,
      reviewCount: 234,
      distance: '1.9 km',
      logo: getFeedImageUrl(63, 200, 200),
    },
    {
      id: '5',
      name: 'Yüzme Merkezi',
      category: 'Spor Salonu',
      rating: 4.5,
      reviewCount: 167,
      distance: '2.2 km',
      logo: getFeedImageUrl(64, 200, 200),
    },
    {
      id: '6',
      name: 'Yoga Stüdyosu',
      category: 'Spor Salonu',
      rating: 4.8,
      reviewCount: 267,
      distance: '0.4 km',
      logo: getFeedImageUrl(65, 200, 200),
    },
    {
      id: '7',
      name: 'Dansır Merkezi',
      category: 'Spor Salonu',
      rating: 4.6,
      reviewCount: 189,
      distance: '1.1 km',
      logo: getFeedImageUrl(66, 200, 200),
    },
    {
      id: '8',
      name: 'Tenis Akademi',
      category: 'Spor Salonu',
      rating: 4.7,
      reviewCount: 156,
      distance: '2 km',
      logo: getFeedImageUrl(67, 200, 200),
    },
  ],
  'oto-servis': [
    {
      id: '1',
      name: 'Ayhan Oto Elektrik',
      category: 'Oto Servis',
      rating: 4.8,
      reviewCount: 234,
      distance: '1.2 km',
      logo: getFeedImageUrl(70, 200, 200),
    },
    {
      id: '2',
      name: 'Orjinal Yedek Parça',
      category: 'Oto Servis',
      rating: 4.6,
      reviewCount: 189,
      distance: '0.9 km',
      logo: getFeedImageUrl(71, 200, 200),
    },
    {
      id: '3',
      name: 'Araç Bakım Merkezi',
      category: 'Oto Servis',
      rating: 4.7,
      reviewCount: 267,
      distance: '1.5 km',
      logo: getFeedImageUrl(72, 200, 200),
    },
    {
      id: '4',
      name: 'Çilingir Oto Tornacı',
      category: 'Oto Servis',
      rating: 4.5,
      reviewCount: 145,
      distance: '2.1 km',
      logo: getFeedImageUrl(73, 200, 200),
    },
    {
      id: '5',
      name: 'İnşallah Oto Tamircisi',
      category: 'Oto Servis',
      rating: 4.9,
      reviewCount: 301,
      distance: '0.7 km',
      logo: getFeedImageUrl(74, 200, 200),
    },
    {
      id: '6',
      name: 'Lastik Merkezi',
      category: 'Oto Servis',
      rating: 4.4,
      reviewCount: 123,
      distance: '2.3 km',
      logo: getFeedImageUrl(75, 200, 200),
    },
    {
      id: '7',
      name: 'Cam Tamircisi',
      category: 'Oto Servis',
      rating: 4.6,
      reviewCount: 178,
      distance: '1.1 km',
      logo: getFeedImageUrl(76, 200, 200),
    },
    {
      id: '8',
      name: 'Oto Yıkamacısı',
      category: 'Oto Servis',
      rating: 4.7,
      reviewCount: 212,
      distance: '0.5 km',
      logo: getFeedImageUrl(77, 200, 200),
    },
  ],
  temizlik: [
    {
      id: '1',
      name: 'Profesyonel Temizlik',
      category: 'Temizlik',
      rating: 4.8,
      reviewCount: 289,
      distance: '1.1 km',
      logo: getFeedImageUrl(80, 200, 200),
    },
    {
      id: '2',
      name: 'Kuru Temizlemeci Aydın',
      category: 'Temizlik',
      rating: 4.7,
      reviewCount: 234,
      distance: '0.7 km',
      logo: getFeedImageUrl(81, 200, 200),
    },
    {
      id: '3',
      name: 'Pencere Temizliği Uzmanları',
      category: 'Temizlik',
      rating: 4.6,
      reviewCount: 167,
      distance: '1.8 km',
      logo: getFeedImageUrl(82, 200, 200),
    },
    {
      id: '4',
      name: 'Ev Temizlik Hizmetleri',
      category: 'Temizlik',
      rating: 4.9,
      reviewCount: 312,
      distance: '0.5 km',
      logo: getFeedImageUrl(83, 200, 200),
    },
    {
      id: '5',
      name: 'Halı Yıkama Merkezi',
      category: 'Temizlik',
      rating: 4.5,
      reviewCount: 145,
      distance: '2 km',
      logo: getFeedImageUrl(84, 200, 200),
    },
    {
      id: '6',
      name: 'Ofis Temizliği',
      category: 'Temizlik',
      rating: 4.7,
      reviewCount: 198,
      distance: '1.5 km',
      logo: getFeedImageUrl(85, 200, 200),
    },
    {
      id: '7',
      name: 'Buzlu Cam Temizliği',
      category: 'Temizlik',
      rating: 4.6,
      reviewCount: 156,
      distance: '1.2 km',
      logo: getFeedImageUrl(86, 200, 200),
    },
    {
      id: '8',
      name: 'Oto Detaylandırması',
      category: 'Temizlik',
      rating: 4.8,
      reviewCount: 267,
      distance: '0.9 km',
      logo: getFeedImageUrl(87, 200, 200),
    },
  ],
  egitim: [
    {
      id: '1',
      name: 'İngilizce Akademi',
      category: 'Eğitim',
      rating: 4.8,
      reviewCount: 267,
      distance: '0.6 km',
      logo: getFeedImageUrl(90, 200, 200),
    },
    {
      id: '2',
      name: 'Matematik Özel Ders',
      category: 'Eğitim',
      rating: 4.7,
      reviewCount: 189,
      distance: '1.3 km',
      logo: getFeedImageUrl(91, 200, 200),
    },
    {
      id: '3',
      name: 'Müzik Okulu',
      category: 'Eğitim',
      rating: 4.9,
      reviewCount: 234,
      distance: '1.1 km',
      logo: getFeedImageUrl(92, 200, 200),
    },
    {
      id: '4',
      name: 'Programlama Kursu',
      category: 'Eğitim',
      rating: 4.6,
      reviewCount: 156,
      distance: '1.9 km',
      logo: getFeedImageUrl(93, 200, 200),
    },
    {
      id: '5',
      name: 'Sanat Atelyesi',
      category: 'Eğitim',
      rating: 4.8,
      reviewCount: 201,
      distance: '0.8 km',
      logo: getFeedImageUrl(94, 200, 200),
    },
    {
      id: '6',
      name: 'Fen Bilimleri Merkezi',
      category: 'Eğitim',
      rating: 4.7,
      reviewCount: 178,
      distance: '1.5 km',
      logo: getFeedImageUrl(95, 200, 200),
    },
    {
      id: '7',
      name: 'Dil Okulu',
      category: 'Eğitim',
      rating: 4.6,
      reviewCount: 145,
      distance: '2 km',
      logo: getFeedImageUrl(96, 200, 200),
    },
    {
      id: '8',
      name: 'Kişisel Gelişim Kursu',
      category: 'Eğitim',
      rating: 4.9,
      reviewCount: 289,
      distance: '0.4 km',
      logo: getFeedImageUrl(97, 200, 200),
    },
  ],
}

type SortOption = 'rating' | 'distance' | 'reviews' | 'newest'

export default function BusinessCategoryPage({ params }: { params: { slug: string } }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('rating')
  const [favorites, setFavorites] = useState<string[]>([])

  const categoryInfo = CATEGORY_MAP[params.slug as keyof typeof CATEGORY_MAP]
  const businesses = MOCK_BUSINESSES_BY_CATEGORY[params.slug] || []

  const filteredAndSortedBusinesses = useMemo(() => {
    let filtered = businesses.filter((business) =>
      business.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance)
        case 'reviews':
          return b.reviewCount - a.reviewCount
        case 'newest':
          return 0
        default:
          return 0
      }
    })

    return sorted
  }, [businesses, searchTerm, sortBy])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#333] mb-4">Kategori Bulunamadı</h1>
          <Link href="/isletmeler" className="text-[#00833e] hover:text-[#006b32] font-semibold">
            ← İşletmelere Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00833e] to-[#006b32] text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/isletmeler"
            className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Geri Dön</span>
          </Link>

          <div className="flex items-start gap-4">
            <div className="text-5xl">{categoryInfo.icon}</div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{categoryInfo.name}</h1>
              <p className="text-green-50 text-lg">{categoryInfo.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="bg-white border-b border-[#e0e0e0] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8f8f8f] w-5 h-5" />
              <input
                type="text"
                placeholder="İşletme adı arayın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-[#e0e0e0] rounded-lg text-sm focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e]/20 transition"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5 text-[#8f8f8f] hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2.5 border border-[#e0e0e0] rounded-lg text-sm text-[#333] bg-white focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e]/20 transition appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238f8f8f' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  paddingRight: '2.5rem',
                }}
              >
                <option value="rating">Puan (Yüksek-Düşük)</option>
                <option value="distance">En Yakın</option>
                <option value="reviews">En Çok Yorumlanan</option>
                <option value="newest">En Yeni</option>
              </select>
            </div>
          </div>

          <div className="mt-3 text-sm text-[#8f8f8f]">
            {filteredAndSortedBusinesses.length} sonuç bulundu
          </div>
        </div>
      </div>

      {/* Business Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredAndSortedBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedBusinesses.map((business) => (
              <div
                key={business.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-[#e0e0e0] hover:border-[#00833e]"
              >
                {/* Logo Area */}
                <div className="h-40 bg-gradient-to-r from-[#e6f4ec] to-[#f0f2f5] flex items-center justify-center overflow-hidden">
                  <img
                    src={business.logo}
                    alt={business.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Name and Favorite Button */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-bold text-lg text-[#333] line-clamp-2 flex-1">{business.name}</h3>
                    <button
                      onClick={() => toggleFavorite(business.id)}
                      className={`flex-shrink-0 transition ${
                        favorites.includes(business.id)
                          ? 'text-[#00833e]'
                          : 'text-[#8f8f8f] hover:text-[#00833e]'
                      }`}
                      title="Favorilere Ekle"
                    >
                      <svg
                        className="w-6 h-6"
                        fill={favorites.includes(business.id) ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Category Badge */}
                  <div className="inline-block bg-[#e6f4ec] text-[#00833e] text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {business.category}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.floor(business.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : i < business.rating
                              ? 'fill-yellow-400 text-yellow-400 opacity-50'
                              : 'text-[#e0e0e0]'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-[#333]">
                      {business.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-[#8f8f8f]">({business.reviewCount})</span>
                  </div>

                  {/* Distance */}
                  <div className="flex items-center gap-2 text-sm text-[#8f8f8f] mb-4">
                    <MapPin className="w-4 h-4 text-[#00833e]" />
                    <span>{business.distance}</span>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(business.id)}
                    className={`w-full py-2.5 rounded-lg font-semibold text-sm transition ${
                      favorites.includes(business.id)
                        ? 'bg-[#e6f4ec] text-[#00833e] hover:bg-[#d4f0e0]'
                        : 'bg-[#f0f2f5] text-[#333] hover:bg-[#e0e0e0]'
                    }`}
                  >
                    {favorites.includes(business.id) ? '♥ Favoride' : 'Favorilere Ekle'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-[#e0e0e0] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#333] mb-2">Sonuç Bulunamadı</h3>
            <p className="text-[#8f8f8f]">"{searchTerm}" ile ilişkili bir işletme bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  )
}
