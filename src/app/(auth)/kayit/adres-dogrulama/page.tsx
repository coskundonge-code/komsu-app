'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ChevronRight, MapPin, Building2, Search, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const GoogleMap = dynamic(() => import('@/components/map/google-map'), { ssr: false })

interface NeighborhoodRow {
  id: string
  name: string
  city: string
  district: string
  slug: string
}

export default function AddressVerificationPage() {
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('')
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState('')
  const [addressDetail, setAddressDetail] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [error, setError] = useState('')

  // Data from Supabase
  const [cities, setCities] = useState<string[]>([])
  const [districts, setDistricts] = useState<string[]>([])
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodRow[]>([])
  const [allNeighborhoods, setAllNeighborhoods] = useState<NeighborhoodRow[]>([])
  const [loading, setLoading] = useState(true)

  // Autocomplete state
  const [neighborhoodSearch, setNeighborhoodSearch] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [manualEntry, setManualEntry] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Load all neighborhoods on mount
  useEffect(() => {
    async function loadNeighborhoods() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('neighborhoods')
        .select('id, name, city, district, slug')
        .order('city')
        .order('district')
        .order('name')

      if (data && !error) {
        setAllNeighborhoods(data)
        // Extract unique cities
        const uniqueCities = [...new Set(data.map((n: NeighborhoodRow) => n.city))].sort()
        setCities(uniqueCities)
      }
      setLoading(false)
    }
    loadNeighborhoods()
  }, [])

  // Update districts when city changes
  useEffect(() => {
    if (selectedCity) {
      const cityNeighborhoods = allNeighborhoods.filter(n => n.city === selectedCity)
      const uniqueDistricts = [...new Set(cityNeighborhoods.map(n => n.district))].sort()
      setDistricts(uniqueDistricts)
    } else {
      setDistricts([])
    }
    setSelectedDistrict('')
    setSelectedNeighborhood('')
    setSelectedNeighborhoodId('')
    setNeighborhoodSearch('')
  }, [selectedCity, allNeighborhoods])

  // Update neighborhoods when district changes
  useEffect(() => {
    if (selectedCity && selectedDistrict) {
      const filtered = allNeighborhoods.filter(
        n => n.city === selectedCity && n.district === selectedDistrict
      )
      setNeighborhoods(filtered)
    } else {
      setNeighborhoods([])
    }
    setSelectedNeighborhood('')
    setSelectedNeighborhoodId('')
    setNeighborhoodSearch('')
  }, [selectedDistrict, selectedCity, allNeighborhoods])

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter suggestions based on search
  const filteredSuggestions = neighborhoods.filter(n =>
    n.name.toLowerCase().includes(neighborhoodSearch.toLowerCase())
  )

  // Also search across ALL neighborhoods if user is typing and no city/district selected
  const globalSuggestions = neighborhoodSearch.length >= 2 && !selectedDistrict
    ? allNeighborhoods.filter(n =>
        n.name.toLowerCase().includes(neighborhoodSearch.toLowerCase())
      ).slice(0, 10)
    : []

  const handleSelectNeighborhood = (n: NeighborhoodRow) => {
    setSelectedNeighborhood(n.name)
    setSelectedNeighborhoodId(n.id)
    setNeighborhoodSearch(n.name)
    setShowSuggestions(false)
    // Auto-set city and district if not already set
    if (!selectedCity || selectedCity !== n.city) {
      setSelectedCity(n.city)
    }
    if (!selectedDistrict || selectedDistrict !== n.district) {
      // Need to wait for districts to populate
      setTimeout(() => setSelectedDistrict(n.district), 100)
    }
  }

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!selectedCity || !selectedDistrict || (!selectedNeighborhood && !manualEntry) || !addressDetail || !postalCode) {
      setError('Lütfen tüm alanları doldurun')
      return
    }

    if (manualEntry && !neighborhoodSearch.trim()) {
      setError('Lütfen mahalle adını girin')
      return
    }

    if (postalCode.length !== 5 || !/^\d+$/.test(postalCode)) {
      setError('Posta kodu 5 haneli rakamdan oluşmalıdır')
      return
    }

    const neighborhoodName = manualEntry ? neighborhoodSearch.trim() : selectedNeighborhood

    // TODO: Save address and proceed to next step
    console.log({
      city: selectedCity,
      district: selectedDistrict,
      neighborhood: neighborhoodName,
      neighborhoodId: selectedNeighborhoodId || null,
      addressDetail,
      postalCode,
    })
  }

  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238f8f8f' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat' as const,
    backgroundPosition: 'right 1rem center',
    paddingRight: '2.5rem',
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
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white text-sm font-semibold mb-2">2</div>
                <span className="text-xs text-text-primary font-semibold text-center">Adres</span>
              </div>

              {/* Connector */}
              <div className="flex-1 h-1 bg-[#e0e0e0] mb-6" />

              {/* Step 3 */}
              <div className="flex flex-col items-center flex-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#e0e0e0] text-text-muted text-sm font-semibold mb-2">3</div>
                <span className="text-xs text-text-muted text-center">Profil</span>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text-primary">Adresinizi Doğrulayın</h2>
            <p className="text-text-muted text-sm mt-2">Doğru mahallede komşularınızla bağlanın</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-text-muted text-sm">Mahalle verileri yükleniyor...</p>
            </div>
          ) : (
            <form onSubmit={handleContinue} className="space-y-5">
              {/* City Selector */}
              <div>
                <label htmlFor="city" className="block text-sm font-semibold text-text-primary mb-2.5">
                  Şehir
                </label>
                <select
                  id="city"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm text-text-primary bg-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition appearance-none cursor-pointer"
                  style={selectStyle}
                >
                  <option value="">Şehir seçin</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Selector */}
              <div>
                <label htmlFor="district" className="block text-sm font-semibold text-text-primary mb-2.5">
                  İlçe
                </label>
                <select
                  id="district"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedCity}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm text-text-primary bg-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition appearance-none cursor-pointer disabled:bg-background disabled:text-text-muted disabled:cursor-not-allowed"
                  style={selectStyle}
                >
                  <option value="">İlçe seçin</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              {/* Neighborhood Autocomplete */}
              <div>
                <label htmlFor="neighborhood" className="block text-sm font-semibold text-text-primary mb-2.5">
                  Mahalle
                </label>
                <div ref={searchRef} className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    <input
                      id="neighborhood"
                      type="text"
                      value={neighborhoodSearch}
                      onChange={(e) => {
                        setNeighborhoodSearch(e.target.value)
                        setShowSuggestions(true)
                        setManualEntry(false)
                        if (!e.target.value) {
                          setSelectedNeighborhood('')
                          setSelectedNeighborhoodId('')
                        }
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder={selectedDistrict ? 'Mahalle adı yazın...' : 'Önce şehir ve ilçe seçin veya mahalle adı yazın'}
                      className="w-full pl-9 pr-9 py-3 border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted bg-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                    />
                    {neighborhoodSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setNeighborhoodSearch('')
                          setSelectedNeighborhood('')
                          setSelectedNeighborhoodId('')
                          setManualEntry(false)
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Suggestions dropdown */}
                  {showSuggestions && neighborhoodSearch.length >= 1 && (
                    <div className="absolute z-50 w-full mt-1 bg-surface border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {(selectedDistrict ? filteredSuggestions : globalSuggestions).length > 0 ? (
                        <>
                          {(selectedDistrict ? filteredSuggestions : globalSuggestions).map((n) => (
                            <button
                              key={n.id}
                              type="button"
                              onClick={() => handleSelectNeighborhood(n)}
                              className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary/5 transition flex items-center justify-between"
                            >
                              <span className="font-medium text-text-primary">{n.name}</span>
                              {!selectedDistrict && (
                                <span className="text-xs text-text-muted">{n.district}, {n.city}</span>
                              )}
                            </button>
                          ))}
                        </>
                      ) : (
                        <div className="px-4 py-3">
                          <p className="text-sm text-text-muted mb-2">Mahalle bulunamadı</p>
                          <button
                            type="button"
                            onClick={() => {
                              setManualEntry(true)
                              setSelectedNeighborhood(neighborhoodSearch)
                              setShowSuggestions(false)
                            }}
                            className="text-sm text-primary font-medium hover:text-primary-hover"
                          >
                            &quot;{neighborhoodSearch}&quot; olarak elle gir
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {selectedNeighborhood && !manualEntry && (
                  <p className="text-xs text-primary mt-1.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {selectedNeighborhood} seçildi
                  </p>
                )}
                {manualEntry && (
                  <p className="text-xs text-amber-600 mt-1.5">Elle girilen mahalle: {neighborhoodSearch}</p>
                )}
              </div>

              {/* Address Detail Textarea */}
              <div>
                <label htmlFor="addressDetail" className="block text-sm font-semibold text-text-primary mb-2.5">
                  Adres Detayı
                </label>
                <textarea
                  id="addressDetail"
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  placeholder="Sokak adı, bina numarası, daire numarası vb."
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted bg-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition resize-none"
                />
              </div>

              {/* Postal Code Input */}
              <div>
                <label htmlFor="postalCode" className="block text-sm font-semibold text-text-primary mb-2.5">
                  Posta Kodu
                </label>
                <input
                  id="postalCode"
                  type="text"
                  maxLength={5}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="34000"
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted bg-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                />
              </div>

              {/* Map */}
              <div className="w-full h-48 rounded-xl overflow-hidden border border-border">
                <GoogleMap
                  center={[41.0370, 28.9850]}
                  zoom={13}
                  className="w-full h-full"
                  showUserLocation={true}
                  onClick={(lat, lng) => console.log('Seçilen konum:', lat, lng)}
                />
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed mt-8 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                Devam Et
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Back link */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <Link href="/kayit" className="text-sm text-primary hover:text-primary-hover font-semibold transition inline-flex items-center gap-1">
              <span>← Geri dön</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
