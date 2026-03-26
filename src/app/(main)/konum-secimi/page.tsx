'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import { provinces, type Province, type District } from '@/data/turkey-locations'
import {
  MapPin, Check, AlertCircle, Loader2, Search, ChevronDown, Navigation, MousePointerClick
} from 'lucide-react'

// Dynamic import for Leaflet map (no SSR)
const MapComponent = dynamic(() => import('./map-component'), { ssr: false })

interface FormData {
  il: Province | null
  ilce: District | null
  mahalle: string
  cadde: string
  binaNo: string
  binaAdi: string
  postaKodu: string
}

interface MahalleData {
  name: string
}

// Helper function to normalize Turkish province names for GitHub JSON
function normalizeTurkishName(name: string): string {
  const turkishMap: Record<string, string> = {
    'İ': 'i',
    'ı': 'i',
    'Ş': 's',
    'ş': 's',
    'Ç': 'c',
    'ç': 'c',
    'Ğ': 'g',
    'ğ': 'g',
    'Ö': 'o',
    'ö': 'o',
    'Ü': 'u',
    'ü': 'u',
  }

  let normalized = name
  for (const [turkish, english] of Object.entries(turkishMap)) {
    normalized = normalized.replaceAll(turkish, english)
  }

  return normalized.toLowerCase().replace(/\s+/g, '')
}

// Helper function to fetch mahalle data from GitHub
async function fetchMahalleler(ilName: string, ilceName: string): Promise<MahalleData[]> {
  try {
    const normalized = normalizeTurkishName(ilName)
    const response = await fetch(
      `https://raw.githubusercontent.com/adilmustafayilmaz/turkiye-il-ilce-mahalle-verileri/main/data/${normalized}.json`
    )
    if (!response.ok) throw new Error('Mahalle verileri bulunamadı')

    const data = await response.json() as Record<string, Record<string, string[]>>
    const mahalleler = data[ilceName] || []
    return mahalleler.map(name => ({ name }))
  } catch (error) {
    console.error('Mahalle fetch error:', error)
    return []
  }
}

// Helper function to geocode address using Nominatim
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number; postalCode: string } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
    )
    const results = await response.json() as Array<any>

    if (results.length === 0) return null

    const result = results[0]
    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)

    // Get detailed address info for postal code
    const detailResponse = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    )
    const detailResult = await detailResponse.json() as any
    const postalCode = detailResult.address?.postcode || ''

    return { lat, lng, postalCode }
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

export default function KonumSecimi() {
  const router = useRouter()
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const [formData, setFormData] = useState<FormData>({
    il: null,
    ilce: null,
    mahalle: '',
    cadde: '',
    binaNo: '',
    binaAdi: '',
    postaKodu: '',
  })

  // Dropdown states
  const [showIlDropdown, setShowIlDropdown] = useState(false)
  const [showIlceDropdown, setShowIlceDropdown] = useState(false)
  const [showMahalleDropdown, setShowMahalleDropdown] = useState(false)
  const [showCaddeDropdown, setShowCaddeDropdown] = useState(false)

  // Search states
  const [ilSearch, setIlSearch] = useState('')
  const [ilceSearch, setIlceSearch] = useState('')
  const [mahalleSearch, setMahalleSearch] = useState('')
  const [caddeSearch, setCaddeSearch] = useState('')

  // Data states
  const [mahalleler, setMahalleler] = useState<MahalleData[]>([])
  const [mahalleLoading, setMahalleLoading] = useState(false)
  const [caddeler, setCaddeler] = useState<string[]>([])
  const [caddeLoading, setCaddeLoading] = useState(false)

  // Map state
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.9334, 32.8597])
  const [mapZoom, setMapZoom] = useState(6)
  const [pinLat, setPinLat] = useState<number | null>(null)
  const [pinLng, setPinLng] = useState<number | null>(null)
  const [mapType, setMapType] = useState<'street' | 'satellite'>('satellite')

  // Refs for click-outside
  const ilDropdownRef = useRef<HTMLDivElement>(null)
  const ilceDropdownRef = useRef<HTMLDivElement>(null)
  const mahalleDropdownRef = useRef<HTMLDivElement>(null)
  const caddeDropdownRef = useRef<HTMLDivElement>(null)

  // Debounce timer ref for cadde search
  const caddeTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Filter provinces
  const filteredProvinces = ilSearch
    ? provinces.filter(p => p.name.toLowerCase().includes(ilSearch.toLowerCase()))
    : provinces

  // Filter districts
  const filteredDistricts = formData.il
    ? (ilceSearch
      ? formData.il.districts.filter(d => d.name.toLowerCase().includes(ilceSearch.toLowerCase()))
      : formData.il.districts)
    : []

  // Filter neighborhoods
  const filteredMahalleler = mahalleSearch
    ? mahalleler.filter(m => m.name.toLowerCase().includes(mahalleSearch.toLowerCase()))
    : mahalleler

  // Click outside handler
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ilDropdownRef.current && !ilDropdownRef.current.contains(e.target as Node)) {
        setShowIlDropdown(false)
      }
      if (ilceDropdownRef.current && !ilceDropdownRef.current.contains(e.target as Node)) {
        setShowIlceDropdown(false)
      }
      if (mahalleDropdownRef.current && !mahalleDropdownRef.current.contains(e.target as Node)) {
        setShowMahalleDropdown(false)
      }
      if (caddeDropdownRef.current && !caddeDropdownRef.current.contains(e.target as Node)) {
        setShowCaddeDropdown(false)
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Load mahalleler when ilce changes
  useEffect(() => {
    if (formData.il && formData.ilce) {
      setMahalleLoading(true)
      fetchMahalleler(formData.il.name, formData.ilce.name)
        .then(data => {
          setMahalleler(data)
          setFormData(prev => ({ ...prev, mahalle: '' }))
        })
        .finally(() => setMahalleLoading(false))
    } else {
      setMahalleler([])
    }
  }, [formData.il, formData.ilce])

  // Update map when ilce is selected
  useEffect(() => {
    if (formData.ilce) {
      setMapCenter([formData.ilce.lat, formData.ilce.lng])
      setMapZoom(11)
    }
  }, [formData.ilce])

  // Debounced cadde search
  const handleCaddeSearch = useCallback((value: string) => {
    setCaddeSearch(value)
    setFormData(prev => ({ ...prev, cadde: value }))

    if (caddeTimerRef.current) {
      clearTimeout(caddeTimerRef.current)
    }

    if (!value.trim() || !formData.mahalle) {
      setCaddeler([])
      return
    }

    setCaddeLoading(true)
    caddeTimerRef.current = setTimeout(async () => {
      const address = `${formData.mahalle}, ${formData.ilce?.name}, ${formData.il?.name}, Türkiye`
      const searchAddress = `${value}, ${address}`

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchAddress)}&format=json&limit=10`
        )
        const results = await response.json() as Array<any>

        if (results.length > 0) {
          const streets = results
            .map(r => r.display_name?.split(',')[0] || '')
            .filter(Boolean)
            .filter((v, i, a) => a.indexOf(v) === i)
          setCaddeler(streets)
        } else {
          setCaddeler([])
        }
      } catch (error) {
        console.error('Cadde search error:', error)
        setCaddeler([])
      } finally {
        setCaddeLoading(false)
      }
    }, 500)
  }, [formData.mahalle, formData.ilce, formData.il])

  // Handle il selection
  const handleIlSelect = (il: Province) => {
    setFormData(prev => ({
      ...prev,
      il,
      ilce: null,
      mahalle: '',
      cadde: '',
      binaNo: '',
      binaAdi: '',
      postaKodu: '',
    }))
    setIlSearch('')
    setShowIlDropdown(false)
    setMapCenter([il.lat, il.lng])
    setMapZoom(7)
    setPinLat(null)
    setPinLng(null)
  }

  // Handle ilce selection
  const handleIlceSelect = (ilce: District) => {
    setFormData(prev => ({
      ...prev,
      ilce,
      mahalle: '',
      cadde: '',
      binaNo: '',
      binaAdi: '',
      postaKodu: '',
    }))
    setIlceSearch('')
    setShowIlceDropdown(false)
    setMapCenter([ilce.lat, ilce.lng])
    setMapZoom(11)
    setPinLat(null)
    setPinLng(null)
  }

  // Handle mahalle selection
  const handleMahalleSelect = (mahalle: string) => {
    setFormData(prev => ({
      ...prev,
      mahalle,
      cadde: '',
      postaKodu: '',
    }))
    setMahalleSearch('')
    setShowMahalleDropdown(false)
    setPinLat(null)
    setPinLng(null)
  }

  // Handle cadde selection
  const handleCaddeSelect = (cadde: string) => {
    setFormData(prev => ({ ...prev, cadde }))
    setCaddeSearch('')
    setShowCaddeDropdown(false)
  }

  // Handle map click
  const handleMapClick = (lat: number, lng: number) => {
    setPinLat(lat)
    setPinLng(lng)
  }

  // Handle address confirmation (geocode full address)
  const handleConfirmAddress = async () => {
    if (!formData.cadde || !formData.mahalle || !formData.ilce || !formData.il) {
      setError('Lütfen İl, İlçe, Mahalle ve Cadde/Sokak seçiniz')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const fullAddress = `${formData.binaNo ? `${formData.binaNo}, ` : ''}${formData.cadde}, ${formData.mahalle}, ${formData.ilce.name}, ${formData.il.name}, Türkiye`
      const result = await geocodeAddress(fullAddress)

      if (result) {
        setPinLat(result.lat)
        setPinLng(result.lng)
        setMapCenter([result.lat, result.lng])
        setMapZoom(18)
        setFormData(prev => ({ ...prev, postaKodu: result.postalCode }))
        setConfirmed(true)
      } else {
        setError('Adres bulunamadı. Lütfen kontrolü yapınız.')
      }
    } catch (error) {
      setError('Adres doğrulama hatası')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle save to database
  const handleSave = async () => {
    if (!formData.il || !formData.ilce || !formData.mahalle || !formData.cadde || !pinLat || !pinLng) {
      setError('Lütfen tüm gerekli alanları doldurunuz')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Kullanıcı oturumu bulunamadı')
        return
      }

      // Update user_profiles
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          il: formData.il.name,
          ilce: formData.ilce.name,
          mahalle: formData.mahalle,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)

      if (profileError) throw profileError

      // Insert into user_addresses
      const { error: addressError } = await supabase
        .from('user_addresses')
        .insert({
          user_id: user.id,
          il: formData.il.name,
          ilce: formData.ilce.name,
          mahalle: formData.mahalle,
          cadde: formData.cadde,
          bina_no: formData.binaNo || null,
          bina_adi: formData.binaAdi || null,
          posta_kodu: formData.postaKodu || null,
          latitude: pinLat,
          longitude: pinLng,
          created_at: new Date().toISOString(),
        })

      if (addressError) throw addressError

      // Update user metadata so middleware no longer redirects to /konum-secimi
      const { error: metaError } = await supabase.auth.updateUser({
        data: {
          location_confirmed_at: new Date().toISOString(),
          il: formData.il.name,
          ilce: formData.ilce.name,
          mahalle: formData.mahalle,
        }
      })

      if (metaError) throw metaError

      setSuccessMessage('Adres başarıyla kaydedildi!')
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Kaydetme hatası')
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold text-text-primary">Konum Seçimi</h1>
          </div>
          <p className="text-text-muted">Mahallemiz için adresinizi belirtiniz</p>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - Form */}
          <div className="space-y-4">
            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Success message */}
            {successMessage && (
              <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-600">{successMessage}</p>
              </div>
            )}

            {/* İl Selection */}
            <div ref={ilDropdownRef} className="relative">
              <label className="block text-sm font-medium text-text-primary mb-2">İl *</label>
              <button
                onClick={() => setShowIlDropdown(!showIlDropdown)}
                className="w-full flex items-center justify-between px-4 py-2 bg-surface border border-border rounded-lg text-text-primary hover:border-primary/50 transition"
              >
                <span>{formData.il?.name || 'İl seçiniz'}</span>
                <ChevronDown className={`w-4 h-4 transition ${showIlDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showIlDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-50">
                  <input
                    type="text"
                    placeholder="Ara..."
                    value={ilSearch}
                    onChange={(e) => setIlSearch(e.target.value)}
                    className="w-full px-4 py-2 border-b border-border bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <div className="max-h-48 overflow-y-auto">
                    {filteredProvinces.map((il) => (
                      <button
                        key={il.name}
                        onClick={() => handleIlSelect(il)}
                        className="w-full text-left px-4 py-2 hover:bg-primary/10 text-text-primary transition"
                      >
                        {il.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* İlçe Selection */}
            <div ref={ilceDropdownRef} className="relative">
              <label className="block text-sm font-medium text-text-primary mb-2">İlçe *</label>
              <button
                onClick={() => setShowIlceDropdown(!showIlceDropdown)}
                disabled={!formData.il}
                className="w-full flex items-center justify-between px-4 py-2 bg-surface border border-border rounded-lg text-text-primary hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <span>{formData.ilce?.name || 'İlçe seçiniz'}</span>
                <ChevronDown className={`w-4 h-4 transition ${showIlceDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showIlceDropdown && formData.il && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-50">
                  <input
                    type="text"
                    placeholder="Ara..."
                    value={ilceSearch}
                    onChange={(e) => setIlceSearch(e.target.value)}
                    className="w-full px-4 py-2 border-b border-border bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <div className="max-h-48 overflow-y-auto">
                    {filteredDistricts.map((ilce) => (
                      <button
                        key={ilce.name}
                        onClick={() => handleIlceSelect(ilce)}
                        className="w-full text-left px-4 py-2 hover:bg-primary/10 text-text-primary transition"
                      >
                        {ilce.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mahalle Selection */}
            <div ref={mahalleDropdownRef} className="relative">
              <label className="block text-sm font-medium text-text-primary mb-2">Mahalle *</label>
              <button
                onClick={() => setShowMahalleDropdown(!showMahalleDropdown)}
                disabled={!formData.ilce || mahalleLoading}
                className="w-full flex items-center justify-between px-4 py-2 bg-surface border border-border rounded-lg text-text-primary hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <span className="flex items-center gap-2">
                  {mahalleLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {formData.mahalle || 'Mahalle seçiniz'}
                </span>
                <ChevronDown className={`w-4 h-4 transition ${showMahalleDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showMahalleDropdown && formData.ilce && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-50">
                  <input
                    type="text"
                    placeholder="Ara..."
                    value={mahalleSearch}
                    onChange={(e) => setMahalleSearch(e.target.value)}
                    className="w-full px-4 py-2 border-b border-border bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <div className="max-h-48 overflow-y-auto">
                    {filteredMahalleler.length > 0 ? (
                      filteredMahalleler.map((mahalle) => (
                        <button
                          key={mahalle.name}
                          onClick={() => handleMahalleSelect(mahalle.name)}
                          className="w-full text-left px-4 py-2 hover:bg-primary/10 text-text-primary transition"
                        >
                          {mahalle.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-text-muted">Mahalle bulunamadı</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cadde/Sokak Selection */}
            <div ref={caddeDropdownRef} className="relative">
              <label className="block text-sm font-medium text-text-primary mb-2">Cadde/Sokak *</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Cadde/Sokak adını yazınız"
                  value={caddeSearch}
                  onChange={(e) => handleCaddeSearch(e.target.value)}
                  disabled={!formData.mahalle}
                  onClick={() => setShowCaddeDropdown(true)}
                  className="w-full px-4 py-2 pr-10 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {caddeLoading && <Loader2 className="absolute right-3 w-4 h-4 animate-spin text-primary" />}
              </div>

              {showCaddeDropdown && caddeler.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-50">
                  <div className="max-h-48 overflow-y-auto">
                    {caddeler.map((cadde) => (
                      <button
                        key={cadde}
                        onClick={() => handleCaddeSelect(cadde)}
                        className="w-full text-left px-4 py-2 hover:bg-primary/10 text-text-primary transition"
                      >
                        {cadde}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bina No */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Bina No</label>
              <input
                type="text"
                placeholder="Bina numarası"
                value={formData.binaNo}
                onChange={(e) => setFormData(prev => ({ ...prev, binaNo: e.target.value }))}
                className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Bina Adı */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Bina Adı</label>
              <input
                type="text"
                placeholder="Bina adı (ör: Gül Sitesi)"
                value={formData.binaAdi}
                onChange={(e) => setFormData(prev => ({ ...prev, binaAdi: e.target.value }))}
                className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Posta Kodu */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Posta Kodu</label>
              <input
                type="text"
                placeholder="Posta kodu (otomatik doldurulur)"
                value={formData.postaKodu}
                readOnly
                className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted opacity-75 cursor-not-allowed focus:outline-none"
              />
            </div>

            {/* Address confirmation and save buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleConfirmAddress}
                disabled={isLoading || !formData.cadde || !formData.mahalle || !formData.ilce || !formData.il}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Doğrulanıyor...
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    Adresimi Onayla
                  </>
                )}
              </button>

              {confirmed && (
                <button
                  onClick={handleSave}
                  disabled={isSaving || !confirmed}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Kaydet
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Map instruction for mobile */}
            <div className="lg:hidden p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <MousePointerClick className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-600">Harita üzerinde binanızı işaretlemek için tıklayınız</p>
              </div>
            </div>
          </div>

          {/* Right side - Map */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <div className="bg-surface border border-border rounded-lg overflow-hidden">
                <div className="relative h-96 lg:h-[600px]">
                  <MapComponent
                    center={mapCenter}
                    zoom={mapZoom}
                    mapType={mapType}
                    pinLat={pinLat}
                    pinLng={pinLng}
                    onMapClick={handleMapClick}
                  />

                  {/* Map controls */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button
                      onClick={() => setMapType(mapType === 'satellite' ? 'street' : 'satellite')}
                      className="p-2 bg-surface border border-border rounded-lg hover:bg-primary hover:text-white transition shadow-md"
                      title={mapType === 'satellite' ? 'Harita görünümüne geç' : 'Uydu görünümüne geç'}
                    >
                      <span className="text-xs font-bold">{mapType === 'satellite' ? '🗺️' : '🛰️'}</span>
                    </button>
                  </div>

                  {/* Pin indicator */}
                  {pinLat && pinLng && (
                    <div className="absolute bottom-4 left-4 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium shadow-md">
                      ✓ Konum işaretlendi
                    </div>
                  )}
                </div>

                {/* Map info */}
                <div className="p-4 bg-surface border-t border-border">
                  <p className="text-xs text-text-muted">
                    {confirmed ? (
                      <span className="text-green-600 font-medium">✓ Adres doğrulandı ve harita'da konumlandırıldı</span>
                    ) : (
                      <span>Adresinizi doğruladıktan sonra harita'da otomatik konumlandırılacaktır</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile map - below form */}
        <div className="lg:hidden mt-6">
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <div className="relative h-96">
              <MapComponent
                center={mapCenter}
                zoom={mapZoom}
                mapType={mapType}
                pinLat={pinLat}
                pinLng={pinLng}
                onMapClick={handleMapClick}
              />

              {/* Map controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => setMapType(mapType === 'satellite' ? 'street' : 'satellite')}
                  className="p-2 bg-surface border border-border rounded-lg hover:bg-primary hover:text-white transition shadow-md"
                  title={mapType === 'satellite' ? 'Harita görünümüne geç' : 'Uydu görünümüne geç'}
                >
                  <span className="text-xs font-bold">{mapType === 'satellite' ? '🗺️' : '🛰️'}</span>
                </button>
              </div>

              {/* Pin indicator */}
              {pinLat && pinLng && (
                <div className="absolute bottom-4 left-4 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium shadow-md">
                  ✓ Konum işaretlendi
                </div>
              )}
            </div>

            {/* Map info */}
            <div className="p-4 bg-surface border-t border-border">
              <p className="text-xs text-text-muted">
                {confirmed ? (
                  <span className="text-green-600 font-medium">✓ Adres doğrulandı ve harita'da konumlandırıldı</span>
                ) : (
                  <span>Adresinizi doğruladıktan sonra harita'da otomatik konumlandırılacaktır</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
