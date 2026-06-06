'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, MapPin, Users, MessageSquare, Home } from 'lucide-react'
import Image from 'next/image'
import { getFeedImageUrl } from '@/lib/demo-images'

interface NeighborhoodData {
  name: string
  city: string
  district: string
  memberCount: number
  activePosts: number
  nearbyBusinesses: number
  mapImageUrl: string
}

const MOCK_NEIGHBORHOODS: Record<string, NeighborhoodData> = {
  'Akaretler': {
    name: 'Akaretler',
    city: 'İstanbul',
    district: 'Beşiktaş',
    memberCount: 2341,
    activePosts: 156,
    nearbyBusinesses: 45,
    mapImageUrl: getFeedImageUrl(100, 600, 300),
  },
  'Moda': {
    name: 'Moda',
    city: 'İstanbul',
    district: 'Kadıköy',
    memberCount: 3456,
    activePosts: 289,
    nearbyBusinesses: 67,
    mapImageUrl: getFeedImageUrl(101, 600, 300),
  },
  'Ortaköy': {
    name: 'Ortaköy',
    city: 'İstanbul',
    district: 'Beşiktaş',
    memberCount: 1823,
    activePosts: 112,
    nearbyBusinesses: 38,
    mapImageUrl: getFeedImageUrl(102, 600, 300),
  },
  'Göztepe': {
    name: 'Göztepe',
    city: 'İstanbul',
    district: 'Kadıköy',
    memberCount: 2789,
    activePosts: 201,
    nearbyBusinesses: 52,
    mapImageUrl: getFeedImageUrl(103, 600, 300),
  },
}

export default function NeighborhoodConfirmationPage() {
  const [confirmed, setConfirmed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // In a real app, this would come from the previous step (address-verification)
  // For now, we'll use a mock neighborhood
  const selectedNeighborhood = MOCK_NEIGHBORHOODS['Akaretler']

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Save neighborhood confirmation and create account
      console.log('Neighborhood confirmed:', selectedNeighborhood)
      // TODO: Redirect to home/dashboard
      // router.push('/anasayfa')
    } catch (err) {
      console.error('Error confirming neighborhood:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeNeighborhood = () => {
    // TODO: Navigate back to address verification step
    // router.back()
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand Section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-primary-hover relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#00a84d] rounded-full opacity-10" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#004d1f] rounded-full opacity-10" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 py-12">
          {/* Logo and Brand Name */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
              <span className="text-3xl font-bold text-primary">K</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">Mahallemiz</h2>
            <p className="text-green-50 text-lg">Mahalle Bağlantısı</p>
          </div>

          {/* Feature bullets */}
          <div className="space-y-6 w-full max-w-sm">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Mahallenize Katılın</h3>
                <p className="text-green-50 text-sm mt-1">Komşularınızla anında bağlanın</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Komşu Ağı</h3>
                <p className="text-green-50 text-sm mt-1">Binlerce komşunuzla iletişim kurun</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Güvenli Ortam</h3>
                <p className="text-green-50 text-sm mt-1">Doğrulanmış komşularla etkileşim</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Confirmation Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center py-12 px-6 sm:px-8 lg:px-12 bg-[#f8fafb] overflow-y-auto">
        <div className="w-full max-w-sm mx-auto">
          {/* Logo on mobile */}
          <div className="md:hidden text-center mb-8">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <span className="text-2xl font-bold text-white">K</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Mahallemiz</h1>
          </div>

          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between gap-2 mb-3">
              {/* Step 1 */}
              <div className="flex flex-col items-center flex-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white text-sm font-semibold mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs text-text-muted text-center">Kayıt</span>
              </div>

              {/* Connector */}
              <div className="flex-1 h-1 bg-primary mb-6" />

              {/* Step 2 */}
              <div className="flex flex-col items-center flex-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white text-sm font-semibold mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs text-text-muted text-center">Adres</span>
              </div>

              {/* Connector */}
              <div className="flex-1 h-1 bg-primary mb-6" />

              {/* Step 3 */}
              <div className="flex flex-col items-center flex-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white text-sm font-semibold mb-2">3</div>
                <span className="text-xs text-text-primary font-semibold text-center">Mahalle</span>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text-primary mb-2">Mahalleyi Onaylayın</h2>
            <p className="text-text-muted text-sm">Bulunduğunuz mahalle bu mu?</p>
          </div>

          {/* Neighborhood Card */}
          <div className="bg-surface border border-border rounded-xl overflow-hidden mb-6">
            {/* Map Placeholder */}
            <div className="w-full h-40 bg-gray-300 relative overflow-hidden">
              <Image
                src={selectedNeighborhood.mapImageUrl}
                alt={selectedNeighborhood.name}
                width={600}
                height={300}
                unoptimized
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Neighborhood Info */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-text-primary mb-1">{selectedNeighborhood.name}</h3>
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {selectedNeighborhood.district}, {selectedNeighborhood.city}
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-border">
                {/* Members */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-lg font-bold text-text-primary">
                      {(selectedNeighborhood.memberCount / 1000).toFixed(1)}K
                    </span>
                  </div>
                  <p className="text-xs text-text-muted">Mahalle Üyesi</p>
                </div>

                {/* Active Posts */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span className="text-lg font-bold text-text-primary">{selectedNeighborhood.activePosts}</span>
                  </div>
                  <p className="text-xs text-text-muted">Aktif Konu</p>
                </div>

                {/* Nearby Businesses */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-lg font-bold text-text-primary">{selectedNeighborhood.nearbyBusinesses}</span>
                  </div>
                  <p className="text-xs text-text-muted">Yakın İşletme</p>
                </div>
              </div>

              {/* Welcome Message */}
              <div className="mt-4 p-4 bg-primary-light rounded-lg border border-[#a7dbb8]">
                <p className="text-sm text-primary font-medium">
                  Hoş geldiniz! {selectedNeighborhood.name}&apos;a katıldığınızda {selectedNeighborhood.memberCount.toLocaleString('tr-TR')} komşunuzla iletişim kurabileceğiniz bir ağa erişeceksiniz.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleConfirm} className="space-y-4">
            {/* Confirmation Checkbox */}
            <div className="flex items-start gap-3 p-4 bg-background rounded-lg">
              <input
                type="checkbox"
                id="confirm"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded border-border text-primary focus:ring-primary cursor-pointer"
              />
              <label htmlFor="confirm" className="text-sm text-text-primary cursor-pointer flex-1">
                Evet, {selectedNeighborhood.name}&apos;da ikamet ediyorum ve mahalleye katılmak istiyorum
              </label>
            </div>

            {/* Join Button */}
            <button
              type="submit"
              disabled={!confirmed || isLoading}
              className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center justify-center gap-2 mb-3"
            >
              {isLoading ? 'Yükleniyor...' : 'Mahalleye Katıl'}
              {!isLoading && <ChevronRight className="w-4 h-4" />}
            </button>

            {/* Change Neighborhood Button */}
            <button
              type="button"
              onClick={handleChangeNeighborhood}
              className="w-full bg-surface border border-border text-text-primary font-semibold py-3 rounded-xl text-sm hover:bg-background transition flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Farklı Mahalle Seç
            </button>
          </form>

          {/* Back link */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <Link href="/kayit/adres-dogrulama" className="text-sm text-primary hover:text-primary-hover font-semibold transition inline-flex items-center gap-1">
              <span>← Geri dön</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
