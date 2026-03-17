'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, MapPin, Building2 } from 'lucide-react'

interface District {
  name: string
  neighborhoods: string[]
}

interface City {
  name: string
  districts: District[]
}

const CITIES: City[] = [
  {
    name: 'İstanbul',
    districts: [
      {
        name: 'Beşiktaş',
        neighborhoods: ['Akaretler', 'Bebek', 'Bezmiamen', 'Fulya', 'Levent', 'Ortaköy', 'Rumeli Hisar', 'Tarabya'],
      },
      {
        name: 'Kadıköy',
        neighborhoods: ['Acibadem', 'Bağdat Caddesi', 'Çiftehavuzlar', 'Göztepe', 'Hasanpaşa', 'Kozyatağı', 'Moda', 'Sahrayıcedit'],
      },
      {
        name: 'Maltepe',
        neighborhoods: ['Cevizli', 'Güzeltepe', 'Idealist Mah', 'Kumkapı', 'Maltepe', 'Merter', 'Ozanlar', 'Bahçelievler'],
      },
      {
        name: 'Üsküdar',
        neighborhoods: ['Baltalimani', 'Beylerbeyi', 'Bulgurlu', 'Çengelköy', 'Kuleli', 'Kuzguncuk', 'Levent', 'Salacak'],
      },
    ],
  },
  {
    name: 'Ankara',
    districts: [
      {
        name: 'Çankaya',
        neighborhoods: ['Bilkent', 'Gaziosmanpaşa', 'İncesu', 'Kavaklıdere', 'Maltepe', 'Turan', 'Yıldız'],
      },
      {
        name: 'Keçiören',
        neighborhoods: ['Arapça', 'Başkent', 'Demetevler', 'Elmalı', 'Kızılay', 'Menderes', 'Şeneş'],
      },
      {
        name: 'Cebeci',
        neighborhoods: ['Cebeci', 'Dikmen', 'Emek', 'Ergenekon', 'Kastamonu', 'Selamet'],
      },
    ],
  },
  {
    name: 'İzmir',
    districts: [
      {
        name: 'Alsancak',
        neighborhoods: ['Alsancak', 'Göztepe', 'Güzelyali', 'Hilal', 'Mithatpaşa', 'Yamanlar'],
      },
      {
        name: 'Konak',
        neighborhoods: ['Alsancak', 'Bayraklı', 'Caferağa', 'Çiğli', 'Gaziemir', 'İnciraltı'],
      },
      {
        name: 'Bornova',
        neighborhoods: ['Arnavutkoy', 'Bornova', 'Çiğli', 'Gaziemir', 'Güzelyali'],
      },
    ],
  },
  {
    name: 'Bursa',
    districts: [
      {
        name: 'Nilüfer',
        neighborhoods: ['Ataşehir', 'Cekirge', 'Gursu', 'Ihlasli', 'İnegöl', 'Kaymakamlar', 'Nilüfer', 'Uludag'],
      },
      {
        name: 'Osmangazi',
        neighborhoods: ['Alsancak', 'Çekirge', 'Gemlik', 'Harmancık', 'Osmangazi'],
      },
    ],
  },
  {
    name: 'Gaziantep',
    districts: [
      {
        name: 'Şahinbey',
        neighborhoods: ['Ahlilik', 'Işıktepe', 'Pinarbaşi', 'Sahinbey', 'Tatlisu'],
      },
      {
        name: 'Şehitkâmil',
        neighborhoods: ['Altintepe', 'Cumhuriyet', 'Demirtepe', 'Ismetiye', 'Sahinbey'],
      },
    ],
  },
]

export default function AddressVerificationPage() {
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('')
  const [addressDetail, setAddressDetail] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [error, setError] = useState('')

  const currentCity = CITIES.find((c) => c.name === selectedCity)
  const currentDistrict = currentCity?.districts.find((d) => d.name === selectedDistrict)

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!selectedCity || !selectedDistrict || !selectedNeighborhood || !addressDetail || !postalCode) {
      setError('Lütfen tüm alanları doldurun')
      return
    }

    if (postalCode.length !== 5 || !/^\d+$/.test(postalCode)) {
      setError('Posta kodu 5 haneli rakamdan oluşmalıdır')
      return
    }

    // TODO: Save address and proceed to next step
    console.log({
      city: selectedCity,
      district: selectedDistrict,
      neighborhood: selectedNeighborhood,
      addressDetail,
      postalCode,
    })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand Section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#00833e] to-[#006b32] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#00a84d] rounded-full opacity-10" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#004d1f] rounded-full opacity-10" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 py-12">
          {/* Logo and Brand Name */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
              <span className="text-3xl font-bold text-[#00833e]">K</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">Mahallem</h2>
            <p className="text-green-50 text-lg">Mahalle Bağlantısı</p>
          </div>

          {/* Feature bullets */}
          <div className="space-y-6 w-full max-w-sm">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Mahalle Seçimi</h3>
                <p className="text-green-50 text-sm mt-1">Bulunduğunuz yeri doğrulayın</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Doğru Komşular</h3>
                <p className="text-green-50 text-sm mt-1">Mahalleniz ile doğru eşleşmeyi sağlayın</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Güvenilir Ağ</h3>
                <p className="text-green-50 text-sm mt-1">Verileriniz tamamen korumalıdır</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Address Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center py-12 px-6 sm:px-8 lg:px-12 bg-[#f8fafb]">
        <div className="w-full max-w-sm mx-auto">
          {/* Logo on mobile */}
          <div className="md:hidden text-center mb-8">
            <div className="w-14 h-14 bg-[#00833e] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <span className="text-2xl font-bold text-white">K</span>
            </div>
            <h1 className="text-2xl font-bold text-[#333]">Mahallem</h1>
          </div>

          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between gap-2 mb-3">
              {/* Step 1 */}
              <div className="flex flex-col items-center flex-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#00833e] text-white text-sm font-semibold mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs text-[#8f8f8f] text-center">Kayıt</span>
              </div>

              {/* Connector */}
              <div className="flex-1 h-1 bg-[#00833e] mb-6" />

              {/* Step 2 */}
              <div className="flex flex-col items-center flex-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#00833e] text-white text-sm font-semibold mb-2">2</div>
                <span className="text-xs text-[#333] font-semibold text-center">Adres</span>
              </div>

              {/* Connector */}
              <div className="flex-1 h-1 bg-[#e0e0e0] mb-6" />

              {/* Step 3 */}
              <div className="flex flex-col items-center flex-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#e0e0e0] text-[#8f8f8f] text-sm font-semibold mb-2">3</div>
                <span className="text-xs text-[#8f8f8f] text-center">Profil</span>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#333]">Adresinizi Doğrulayın</h2>
            <p className="text-[#8f8f8f] text-sm mt-2">Doğru mahallede komşularınızla bağlanın</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleContinue} className="space-y-5">
            {/* City Selector */}
            <div>
              <label htmlFor="city" className="block text-sm font-semibold text-[#333] mb-2.5">
                Şehir
              </label>
              <select
                id="city"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value)
                  setSelectedDistrict('')
                  setSelectedNeighborhood('')
                }}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-xl text-sm text-[#333] bg-white focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e]/20 transition appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238f8f8f' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  paddingRight: '2.5rem',
                }}
              >
                <option value="">Şehir seçin</option>
                {CITIES.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* District Selector */}
            <div>
              <label htmlFor="district" className="block text-sm font-semibold text-[#333] mb-2.5">
                İçe Düşen İçerik
              </label>
              <select
                id="district"
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value)
                  setSelectedNeighborhood('')
                }}
                disabled={!selectedCity}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-xl text-sm text-[#333] bg-white focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e]/20 transition appearance-none cursor-pointer disabled:bg-[#f0f2f5] disabled:text-[#8f8f8f] disabled:cursor-not-allowed"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238f8f8f' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  paddingRight: '2.5rem',
                }}
              >
                <option value="">İçe düşen içerik seçin</option>
                {currentCity?.districts.map((district) => (
                  <option key={district.name} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Neighborhood Selector */}
            <div>
              <label htmlFor="neighborhood" className="block text-sm font-semibold text-[#333] mb-2.5">
                Mahalle
              </label>
              <select
                id="neighborhood"
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                disabled={!selectedDistrict}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-xl text-sm text-[#333] bg-white focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e]/20 transition appearance-none cursor-pointer disabled:bg-[#f0f2f5] disabled:text-[#8f8f8f] disabled:cursor-not-allowed"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238f8f8f' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  paddingRight: '2.5rem',
                }}
              >
                <option value="">Mahalle seçin</option>
                {currentDistrict?.neighborhoods.map((neighborhood) => (
                  <option key={neighborhood} value={neighborhood}>
                    {neighborhood}
                  </option>
                ))}
              </select>
            </div>

            {/* Address Detail Textarea */}
            <div>
              <label htmlFor="addressDetail" className="block text-sm font-semibold text-[#333] mb-2.5">
                Adres Detayı
              </label>
              <textarea
                id="addressDetail"
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                placeholder="Sokak adı, bina numarası, daire numarası vb."
                rows={4}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-xl text-sm text-[#333] placeholder-[#8f8f8f] bg-white focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e]/20 transition resize-none"
              />
            </div>

            {/* Postal Code Input */}
            <div>
              <label htmlFor="postalCode" className="block text-sm font-semibold text-[#333] mb-2.5">
                Posta Kodu
              </label>
              <input
                id="postalCode"
                type="text"
                maxLength={5}
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
                placeholder="34000"
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-xl text-sm text-[#333] placeholder-[#8f8f8f] bg-white focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e]/20 transition"
              />
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-48 bg-gray-200 rounded-xl flex items-center justify-center text-[#8f8f8f] font-medium">
              Harita yükleniyor...
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              className="w-full bg-[#00833e] hover:bg-[#006b32] text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed mt-8 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              Devam Et
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          {/* Back link */}
          <div className="mt-8 pt-6 border-t border-[#e0e0e0] text-center">
            <Link href="/kayit" className="text-sm text-[#00833e] hover:text-[#006b32] font-semibold transition inline-flex items-center gap-1">
              <span>← Geri dön</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
