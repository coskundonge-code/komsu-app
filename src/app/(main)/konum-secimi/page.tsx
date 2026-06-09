'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import { provinces, type Province, type District } from '@/data/turkey-locations'
import {
  MapPin, Check, AlertCircle, Loader2, ChevronDown, Navigation, MousePointerClick
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

// Turkish locale collator for alphabetical sorting
const turkishCollator = new Intl.Collator('tr', { sensitivity: 'base' })
function sortTurkish<T>(arr: T[], key?: (item: T) => string): T[] {
  return [...arr].sort((a, b) => {
    const aVal = key ? key(a) : String(a)
    const bVal = key ? key(b) : String(b)
    return turkishCollator.compare(aVal, bVal)
  })
}

// Module-level cache for the full JSON data
let cachedData: Record<string, {
  plaka: number
  koordinatlar: { latitude: number; longitude: number }
  ilceler: Record<string, string[]>
}> | null = null

const GITHUB_JSON_URL = 'https://raw.githubusercontent.com/adilmustafayilmaz/turkiye-il-ilce-mahalle-verileri/main/turkiye_ilce_mahalle.json'

async function loadAllData() {
  if (cachedData) return cachedData
  const response = await fetch(GITHUB_JSON_URL)
  if (!response.ok) throw new Error('Veri kaynağına ulaşılamadı')
  cachedData = await response.json()
  return cachedData!
}

// Helper function to fetch mahalle data from GitHub
async function fetchMahalleler(ilName: string, ilceName: string): Promise<MahalleData[]> {
  try {
    const data = await loadAllData()

    // Find province key: JSON uses UPPERCASE ("İSTANBUL"), our data uses mixed case ("İstanbul")
    const ilUpper = ilName.toLocaleUpperCase('tr')
    const provinceData = data[ilUpper] || data[ilName]
    if (!provinceData) {
      console.error('Province not found in data:', ilName, '/ tried:', ilUpper)
      return []
    }

    // Find district: JSON uses mixed case, try exact match first then case-insensitive
    let mahalleler = provinceData.ilceler[ilceName]
    if (!mahalleler) {
      const ilceLower = ilceName.toLocaleLowerCase('tr')
      const matchingKey = Object.keys(provinceData.ilceler).find(
        k => k.toLocaleLowerCase('tr') === ilceLower
      )
      mahalleler = matchingKey ? provinceData.ilceler[matchingKey] : []
    }

    if (!mahalleler || mahalleler.length === 0) return []

    // Sort alphabetically with Turkish locale
    const sorted = sortTurkish(mahalleler)
    return sorted.map(name => ({ name }))
  } catch (error) {
    console.error('Mahalle fetch error:', error)
    return []
  }
}

// Helper function to geocode address using Nominatim with fallback strategies
async function geocodeAddress(address: string, components?: { il?: string; ilce?: string; mahalle?: string; cadde?: string; binaNo?: string }): Promise<{ lat: number; lng: number; postalCode: string } | null> {
  const headers = { 'Accept-Language': 'tr' }

  // Try multiple search strategies from most specific to least
  const queries: string[] = [address]

  if (components) {
    const { il, ilce, mahalle, cadde } = components
    // Strategy 2: Without building number
    if (cadde && mahalle && ilce && il) {
      queries.push(`${cadde}, ${mahalle}, ${ilce}, ${il}, Türkiye`)
    }
    // Strategy 3: With "Mah." suffix for mahalle
    if (cadde && mahalle && ilce && il) {
      queries.push(`${cadde}, ${mahalle} Mah., ${ilce}, ${il}, Türkiye`)
    }
    // Strategy 4: Just street + district + province
    if (cadde && ilce && il) {
      queries.push(`${cadde}, ${ilce}, ${il}, Türkiye`)
    }
    // Strategy 5: Just neighborhood + district (will at least center on the area)
    if (mahalle && ilce && il) {
      queries.push(`${mahalle}, ${ilce}, ${il}, Türkiye`)
    }
    // Strategy 6: Just district + province
    if (ilce && il) {
      queries.push(`${ilce}, ${il}, Türkiye`)
    }
  }

  // Remove duplicate queries
  const uniqueQueries = [...new Set(queries)]

  for (const query of uniqueQueries) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=tr`,
        { headers }
      )
      const results = await response.json() as Array<any>

      if (results.length > 0) {
        const result = results[0]
        const lat = parseFloat(result.lat)
        const lng = parseFloat(result.lon)

        if (isNaN(lat) || isNaN(lng)) continue

        // Get detailed address info for postal code
        let postalCode = ''
        try {
          const detailResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers }
          )
          const detailResult = await detailResponse.json() as any
          postalCode = detailResult.address?.postcode || ''
        } catch {
          // postal code is optional, continue
        }

        return { lat, lng, postalCode }
      }
    } catch (error) {
      console.error('Geocoding error for query:', query, error)
      continue
    }
  }

  return null
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
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street')

  // Refs for click-outside
  const ilDropdownRef = useRef<HTMLDivElement>(null)
  const ilceDropdownRef = useRef<HTMLDivElement>(null)
  const mahalleDropdownRef = useRef<HTMLDivElement>(null)
  const caddeDropdownRef = useRef<HTMLDivElement>(null)

  // Debounce timer ref for cadde search
  const caddeTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Filter and sort provinces (Turkish alphabetical)
  const sortedProvinces = sortTurkish(provinces, p => p.name)
  const filteredProvinces = ilSearch
    ? sortedProvinces.filter(p => p.name.toLocaleLowerCase('tr').includes(ilSearch.toLocaleLowerCase('tr')))
    : sortedProvinces

  // Filter and sort districts (Turkish alphabetical)
  const sortedDistricts = formData.il ? sortTurkish(formData.il.districts, d => d.name) : []
  const filteredDistricts = ilceSearch
    ? sortedDistricts.filter(d => d.name.toLocaleLowerCase('tr').includes(ilceSearch.toLocaleLowerCase('tr')))
    : sortedDistricts

  // Filter neighborhoods (already sorted from fetch)
  const filteredMahalleler = mahalleSearch
    ? mahalleler.filter(m => m.name.toLocaleLowerCase('tr').includes(mahalleSearch.toLocaleLowerCase('tr')))
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
          const streets = sortTurkish(
            results
              .map(r => r.display_name?.split(',')[0] || '')
              .filter(Boolean)
              .filter((v, i, a) => a.indexOf(v) === i)
          )
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
      const result = await geocodeAddress(fullAddress, {
        il: formData.il.name,
        ilce: formData.ilce.name,
        mahalle: formData.mahalle,
        cadde: formData.cadde,
        binaNo: formData.binaNo,
      })

      if (result) {
        setPinLat(result.lat)
        setPinLng(result.lng)
        setMapCenter([result.lat, result.lng])
        setMapZoom(18)
        setFormData(prev => ({ ...prev, postaKodu: result.postalCode }))
        setConfirmed(true)
      } else {
        setError('Adres bulunamadı. Lütfen bilgileri kontrol ediniz veya harita üzerinden konumunuzu işaretleyiniz.')
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

      // Update profiles (extended fields: il/ilçe/mahalle)
      // location_confirmed_at artık tek doğruluk kaynağı: middleware doğrulama
      // kapısını profiles'tan okuyor (forge edilebilir user_metadata'dan değil).
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          location_province: formData.il.name,
          location_district: formData.ilce.name,
          location_neighborhood: formData.mahalle,
          location_confirmed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      // Insert into user_addresses
      // Canli sema gercek kolonlari: address_line, city, district, lat, lng, is_primary
      const { error: addressError } = await supabase
        .from('user_addresses')
        .insert({
          user_id: user.id,
          address_line: [formData.mahalle, formData.cadde, formData.binaNo ? 'No: ' + formData.binaNo : '', formData.binaAdi, formData.postaKodu]
            .filter(Boolean).join(' ').trim(),
          city: formData.il.name,
          district: formData.ilce.name,
          lat: pinLat,
          lng: pinLng,
          is_primary: true,
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
                      <span className="text-green-600 font-medium">✓ Adres doğrulandı ve harita&apos;da konumlandırıldı</span>
                    ) : (
                      <span>Adresinizi doğruladıktan sonra harita&apos;da otomatik konumlandırılacaktır</span>
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
                  <span className="text-green-600 font-medium">✓ Adres doğrulandı ve harita&apos;da konumlandırıldı</span>
                ) : (
                  <span>Adresinizi doğruladıktan sonra harita&apos;da otomatik konumlandırılacaktır</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
