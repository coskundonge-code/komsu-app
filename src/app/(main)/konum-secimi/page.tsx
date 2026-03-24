'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import { provinces, type Province, type District } from '@/data/turkey-locations'
import {
  MapPin, Check, AlertCircle, Loader2, Search, ChevronDown, Shield, Clock, Navigation, MousePointerClick
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

interface Neighborhood {
  id: number
  name: string
  population?: number
}

export default function KonumSecimi() {
  const router = useRouter()
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    il: null, ilce: null, mahalle: '', cadde: '', binaNo: '', binaAdi: '', postaKodu: '',
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
  const [mahalleler, setMahalleler] = useState<Neighborhood[]>([])
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
    ? provinces.filter(p => p.name.toLocaleLowerCase('tr').includes(ilSearch.toLocaleLowerCase('tr')))
    : provinces

  // Filter districts
  const filteredDistricts = formData.il
    ? (ilceSearch
      ? formData.il.districts.filter(d => d.name.toLocaleLowerCase('tr').includes(ilceSearch.toLocaleLowerCase('tr')))
      : formData.il.districts)
    : []

  // Filter neighborhoods
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

  // Fetch mahalle when ilÃ§e changes
  useEffect(() => {
    if (!formData.il || !formData.ilce) {
      setMahalleler([])
      return
    }

    const fetchMahalleler = async () => {
      setMahalleLoading(true)
      try {
        const res = await fetch(
          `https://api.turkiyeapi.dev/v1/neighborhoods?province=${encodeURIComponent(formData.il!.name)}&district=${encodeURIComponent(formData.ilce!.name)}&limit=500`
        )
        if (res.ok) {
          const json = await res.json()
          if (json.data && Array.isArray(json.data)) {
            const sorted = json.data
              .map((n: any) => ({ id: n.id, name: n.name, population: n.population }))
              .sort((a: Neighborhood, b: Neighborhood) => a.name.localeCompare(b.name, 'tr'))
            setMahalleler(sorted)
          }
        }
      } catch (err) {
        console.error('Mahalle verisi alÄ±namadÄ±:', err)
      } finally {
        setMahalleLoading(false)
      }
    }

    fetchMahalleler()
  }, [formData.il, formData.ilce])

  // Fetch cadde/sokak suggestions via Nominatim when user types
  const searchCaddeler = useCallback(async (query: string) => {
    if (!formData.il || !formData.ilce || !formData.mahalle || query.length < 2) {
      setCaddeler([])
      return
    }

    setCaddeLoading(true)
    try {
      const searchQuery = `${query}, ${formData.mahalle}, ${formData.ilce.name}, ${formData.il.name}`
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=tr&limit=8&accept-language=tr&addressdetails=1`,
        { headers: { 'User-Agent': 'Mahallemiz/1.0' } }
      )
      if (res.ok) {
        const data = await res.json()
        const streets = data
          .map((r: any) => r.address?.road || r.address?.pedestrian || r.address?.residential || '')
          .filter((s: string) => s.length > 0)
        // Deduplicate
        const unique = [...new Set(streets)] as string[]
        setCaddeler(unique)
      }
    } catch (err) {
      console.error('Cadde aramasÄ± baÅarÄ±sÄ±z:', err)
    } finally {
      setCaddeLoading(false)
    }
  }, [formData.il, formData.ilce, formData.mahalle])

  // Handle cadde input with debounce
  const handleCaddeInput = (value: string) => {
    setFormData(prev => ({ ...prev, cadde: value }))
    setCaddeSearch(value)
    if (confirmed) { setConfirmed(false) }

    if (caddeTimerRef.current) clearTimeout(caddeTimerRef.current)
    caddeTimerRef.current = setTimeout(() => {
      searchCaddeler(value)
    }, 400)
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (confirmed) { setConfirmed(false) }
  }

  const handleIlSelect = (province: Province) => {
    setFormData(prev => ({ ...prev, il: province, ilce: null, mahalle: '', cadde: '' }))
    setIlSearch('')
    setShowIlDropdown(false)
    setMahalleler([])
    setCaddeler([])
    if (confirmed) { setConfirmed(false) }
  }

  const handleIlceSelect = (district: District) => {
    setFormData(prev => ({ ...prev, ilce: district, mahalle: '', cadde: '' }))
    setIlceSearch('')
    setShowIlceDropdown(false)
    setCaddeler([])
    if (confirmed) { setConfirmed(false) }
  }

  const handleMahalleSelect = (mahalle: Neighborhood) => {
    setFormData(prev => ({ ...prev, mahalle: mahalle.name, cadde: '' }))
    setMahalleSearch('')
    setShowMahalleDropdown(false)
    setCaddeler([])
    if (confirmed) { setConfirmed(false) }
  }

  const handleCaddeSelect = async (cadde: string) => {
    setFormData(prev => ({ ...prev, cadde }))
    setCaddeSearch('')
    setShowCaddeDropdown(false)
    if (confirmed) { setConfirmed(false) }

    // Geocode the street to zoom map to it
    if (formData.il && formData.ilce && formData.mahalle) {
      try {
        const streetQuery = `${cadde}, ${formData.mahalle} Mahallesi, ${formData.ilce.name}, ${formData.il.name}`
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(streetQuery)}&countrycodes=tr&limit=1&accept-language=tr&addressdetails=1`,
          { headers: { 'User-Agent': 'Mahallemiz/1.0' } }
        )
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat)
            const lng = parseFloat(data[0].lon)
            setMapCenter([lat, lng])
            setMapZoom(18) // Building-level zoom
            // Auto-fill postal code if available
            if (data[0].address?.postcode && !formData.postaKodu) {
              const cleanPostcode = data[0].address.postcode.replace(/\D/g, '').slice(0, 5)
              if (cleanPostcode.length === 5) {
                setFormData(prev => ({ ...prev, cadde, postaKodu: cleanPostcode }))
              }
            }
          }
        }
      } catch (err) {
        console.error('Cadde geocoding baÅarÄ±sÄ±z:', err)
      }
    }
  }

  // Handle map click - user selects their building
  const handleMapClick = useCallback((lat: number, lng: number) => {
    setPinLat(lat)
    setPinLng(lng)
    setMapCenter([lat, lng])
    if (confirmed) { setConfirmed(false) }
  }, [confirmed])

  // Update map when il/ilce changes
  useEffect(() => {
    if (confirmed) return // Don't change map when address is confirmed
    if (formData.ilce) {
      setMapCenter([formData.ilce.lat, formData.ilce.lng])
      setMapZoom(13)
      setPinLat(null)
      setPinLng(null)
    } else if (formData.il) {
      setMapCenter([formData.il.lat, formData.il.lng])
      setMapZoom(10)
      setPinLat(null)
      setPinLng(null)
    } else {
      setMapCenter([39.9334, 32.8597])
      setMapZoom(6)
      setPinLat(null)
      setPinLng(null)
    }
  }, [formData.il, formData.ilce, confirmed])

  const geocodeAddress = useCallback(async () => {
    if (!formData.il || !formData.ilce || !formData.mahalle || !formData.cadde || !formData.binaNo) {
      setError('LÃ¼tfen tÃ¼m zorunlu alanlarÄ± doldurun.')
      return
    }

    if (formData.postaKodu && (formData.postaKodu.length !== 5 || !/^\d{5}$/.test(formData.postaKodu))) {
      setError('LÃ¼tfen geÃ§erli bir 5 haneli posta kodu girin.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const fullAddress = `${formData.mahalle} Mahallesi, ${formData.cadde}, ${formData.binaNo}, ${formData.ilce.name}, ${formData.il.name}`

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&countrycodes=tr&limit=1&accept-language=tr&addressdetails=1`,
        { headers: { 'User-Agent': 'Mahallemiz/1.0' } }
      )

      let lat: number, lng: number, displayAddress: string
      let postcode: string | null = null

      if (response.ok) {
        const data = await response.json()
        if (data && data.length > 0) {
          lat = parseFloat(data[0].lat)
          lng = parseFloat(data[0].lon)
          displayAddress = data[0].display_name
          // Extract postal code from address details
          if (data[0].address?.postcode) {
            postcode = data[0].address.postcode
          }
        } else {
          // Fallback: try with just mahalle + ilÃ§e + il
          const fallbackAddress = `${formData.mahalle}, ${formData.ilce.name}, ${formData.il.name}, TÃ¼rkiye`
          const fallbackRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fallbackAddress)}&countrycodes=tr&limit=1&accept-language=tr&addressdetails=1`,
            { headers: { 'User-Agent': 'Mahallemiz/1.0' } }
          )

          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json()
            if (fallbackData && fallbackData.length > 0) {
              lat = parseFloat(fallbackData[0].lat)
              lng = parseFloat(fallbackData[0].lon)
              displayAddress = fallbackData[0].display_name
              if (fallbackData[0].address?.postcode) {
                postcode = fallbackData[0].address.postcode
              }
            } else {
              // Last fallback: use ilÃ§e coordinates
              lat = formData.ilce.lat
              lng = formData.ilce.lng
              displayAddress = `${formData.mahalle} Mah. ${formData.cadde} ${formData.binaNo}, ${formData.ilce.name}, ${formData.il.name}`
            }
          } else {
            lat = formData.ilce.lat
            lng = formData.ilce.lng
            displayAddress = `${formData.mahalle} Mah. ${formData.cadde} ${formData.binaNo}, ${formData.ilce.name}, ${formData.il.name}`
          }
        }
      } else {
        // Network error fallback: use ilÃ§e coordinates
        lat = formData.ilce.lat
        lng = formData.ilce.lng
        displayAddress = `${formData.mahalle} Mah. ${formData.cadde} ${formData.binaNo}, ${formData.ilce.name}, ${formData.il.name}`
      }

      // Auto-fill postal code if found and not already filled
      if (postcode && !formData.postaKodu) {
        const cleanPostcode = postcode.replace(/\D/g, '').slice(0, 5)
        if (cleanPostcode.length === 5) {
          setFormData(prev => ({ ...prev, postaKodu: cleanPostcode }))
        }
      }

      // If user already placed a pin on map, use that location instead
      if (pinLat !== null && pinLng !== null) {
        lat = pinLat
        lng = pinLng
      }

      setMapCenter([lat, lng])
      setPinLat(lat)
      setPinLng(lng)
      setMapZoom(19)
      setConfirmed(true)
    } catch (err) {
      // Even on network error, use pin or ilÃ§e coordinates as fallback
      const lat = pinLat ?? formData.ilce.lat
      const lng = pinLng ?? formData.ilce.lng
      setMapCenter([lat, lng])
      setPinLat(lat)
      setPinLng(lng)
      setMapZoom(19)
      setConfirmed(true)
    } finally {
      setIsLoading(false)
    }
  }, [formData, pinLat, pinLng])

  const saveLocation = async () => {
    setIsSaving(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Oturumunuz sona ermiÅ. LÃ¼tfen tekrar giriÅ yapÄ±n.')
        router.push('/giris')
        return
      }

      const edevletDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      const locationData = {
        location_lat: pinLat ?? mapCenter[0],
        location_lng: pinLng ?? mapCenter[1],
        location_province: formData.il!.name,
        location_district: formData.ilce!.name,
        location_neighborhood: formData.mahalle,
        location_confirmed_at: new Date().toISOString(),
        edevlet_verification_deadline: edevletDeadline,
      }

      const { error: metaError } = await supabase.auth.updateUser({ data: locationData })
      if (metaError) { setError('Konum kaydedilemedi: ' + metaError.message); setIsSaving(false); return }

      const fullAddress = `${formData.mahalle} Mah. ${formData.cadde} No:${formData.binaNo}${formData.binaAdi ? ' ' + formData.binaAdi : ''}, ${formData.ilce!.name}, ${formData.il!.name}${formData.postaKodu ? ' ' + formData.postaKodu : ''}`

      try {
        await (supabase as any).from('user_profiles').upsert({
          id: user.id,
          location_address: fullAddress,
          ...locationData
        }, { onConflict: 'id' })
      } catch {}

      try {
        await (supabase as any).from('user_addresses').insert({
          user_id: user.id,
          address: fullAddress,
          neighborhood: formData.mahalle,
          city: formData.il!.name,
          district: formData.ilce!.name,
          postal_code: formData.postaKodu || null,
          latitude: pinLat ?? mapCenter[0],
          longitude: pinLng ?? mapCenter[1],
        })
      } catch {}

      window.location.href = '/'
    } catch {
      setError('Bir hata oluÅtu. LÃ¼tfen tekrar deneyin.')
    } finally {
      setIsSaving(false)
    }
  }

  // Dropdown component helper
  const DropdownField = ({
    label, required, dropdownRef, showDropdown, setShowDropdown, selectedValue, placeholder,
    searchValue, setSearchValue, searchPlaceholder, items, onSelect, loading, disabled, closeOthers
  }: {
    label: string; required?: boolean; dropdownRef: React.RefObject<HTMLDivElement | null>;
    showDropdown: boolean; setShowDropdown: (v: boolean) => void;
    selectedValue: string; placeholder: string; searchValue: string;
    setSearchValue: (v: string) => void; searchPlaceholder: string;
    items: { key: string; label: string }[]; onSelect: (key: string) => void;
    loading?: boolean; disabled?: boolean; closeOthers: () => void;
  }) => (
    <div ref={dropdownRef} className="relative">
      <label className="block text-xs font-semibold text-text-muted mb-1.5">{label}{required && ' *'}</label>
      <button
        onClick={() => { if (!disabled) { closeOthers(); setShowDropdown(!showDropdown) } }}
        disabled={disabled}
        className="w-full flex items-center justify-between border border-border rounded-xl px-3.5 py-2.5 text-sm bg-[#fafafa] hover:bg-surface transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={selectedValue ? 'text-text-primary' : 'text-text-muted'}>
          {selectedValue || placeholder}
        </span>
        {loading ? <Loader2 className="w-4 h-4 text-text-muted animate-spin" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
      </button>
      {showDropdown && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-xl shadow-lg z-30 max-h-64 overflow-hidden">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-primary" autoFocus />
            </div>
          </div>
          <div className="overflow-y-auto max-h-48">
            {loading ? (
              <div className="flex items-center justify-center py-4 text-sm text-text-muted">
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> YÃ¼kleniyor...
              </div>
            ) : items.length === 0 ? (
              <div className="px-3.5 py-3 text-sm text-text-muted text-center">SonuÃ§ bulunamadÄ±</div>
            ) : (
              items.map(item => (
                <button key={item.key} onClick={() => onSelect(item.key)}
                  className={`w-full text-left px-3.5 py-2.5 text-sm hover:bg-background transition ${
                    selectedValue === item.label ? 'bg-primary/5 text-primary font-semibold' : 'text-text-primary'
                  }`}>
                  {item.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )

  const closeAllDropdowns = () => {
    setShowIlDropdown(false)
    setShowIlceDropdown(false)
    setShowMahalleDropdown(false)
    setShowCaddeDropdown(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border px-4 py-3 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">K</span>
            </div>
            <span className="text-lg font-bold text-text-primary">Mahallemiz</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <MapPin className="w-3.5 h-3.5" />
            <span>Konum DoÄrulama</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Error */}
        {error && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Address Form */}
          <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-6">
              <h1 className="text-2xl font-bold text-text-primary mb-2">Adresinizi Girin</h1>
              <p className="text-text-muted text-sm mb-6">Mahalle topluluÄunuza katÄ±lmak iÃ§in adresinizi girin</p>

              <div className="space-y-4">
                {/* Ä°l */}
                <DropdownField
                  label="Ä°l" required dropdownRef={ilDropdownRef}
                  showDropdown={showIlDropdown} setShowDropdown={setShowIlDropdown}
                  selectedValue={formData.il?.name || ''} placeholder="Ä°l seÃ§in"
                  searchValue={ilSearch} setSearchValue={setIlSearch} searchPlaceholder="Ä°l ara..."
                  items={filteredProvinces.map(p => ({ key: p.name, label: p.name }))}
                  onSelect={key => { const p = provinces.find(x => x.name === key); if (p) handleIlSelect(p) }}
                  closeOthers={() => { setShowIlceDropdown(false); setShowMahalleDropdown(false); setShowCaddeDropdown(false) }}
                />

                {/* Ä°lÃ§e */}
                <DropdownField
                  label="Ä°lÃ§e" required dropdownRef={ilceDropdownRef}
                  showDropdown={showIlceDropdown} setShowDropdown={setShowIlceDropdown}
                  selectedValue={formData.ilce?.name || ''} placeholder="Ä°lÃ§e seÃ§in"
                  searchValue={ilceSearch} setSearchValue={setIlceSearch} searchPlaceholder="Ä°lÃ§e ara..."
                  items={filteredDistricts.map(d => ({ key: d.name, label: d.name }))}
                  onSelect={key => { const d = formData.il?.districts.find(x => x.name === key); if (d) handleIlceSelect(d) }}
                  disabled={!formData.il}
                  closeOthers={() => { setShowIlDropdown(false); setShowMahalleDropdown(false); setShowCaddeDropdown(false) }}
                />

                {/* Mahalle */}
                <DropdownField
                  label="Mahalle" required dropdownRef={mahalleDropdownRef}
                  showDropdown={showMahalleDropdown} setShowDropdown={setShowMahalleDropdown}
                  selectedValue={formData.mahalle} placeholder="Mahalle seÃ§in"
                  searchValue={mahalleSearch} setSearchValue={setMahalleSearch} searchPlaceholder="Mahalle ara..."
                  items={filteredMahalleler.map(m => ({ key: String(m.id), label: m.name }))}
                  onSelect={key => { const m = mahalleler.find(x => String(x.id) === key); if (m) handleMahalleSelect(m) }}
                  loading={mahalleLoading}
                  disabled={!formData.ilce}
                  closeOthers={() => { setShowIlDropdown(false); setShowIlceDropdown(false); setShowCaddeDropdown(false) }}
                />

                {/* Cadde / Sokak - text input with autocomplete */}
                <div ref={caddeDropdownRef} className="relative">
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">Cadde / Sokak *</label>
                  <input
                    type="text"
                    value={formData.cadde}
                    onChange={e => handleCaddeInput(e.target.value)}
                    onFocus={() => { if (caddeler.length > 0) setShowCaddeDropdown(true) }}
                    placeholder={formData.mahalle ? 'Cadde veya sokak adÄ±nÄ± yazÄ±n...' : 'Ãnce mahalle seÃ§in'}
                    disabled={!formData.mahalle}
                    className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-[#fafafa] focus:outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {showCaddeDropdown && caddeler.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto">
                      {caddeLoading ? (
                        <div className="flex items-center justify-center py-3 text-sm text-text-muted">
                          <Loader2 className="w-4 h-4 animate-spin mr-2" /> AranÄ±yor...
                        </div>
                      ) : (
                        caddeler.map((c, i) => (
                          <button key={i} onClick={() => handleCaddeSelect(c)}
                            className="w-full text-left px-3.5 py-2.5 text-sm hover:bg-background transition text-text-primary">
                            {c}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Bina NumarasÄ± */}
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">Bina NumarasÄ± *</label>
                  <input type="text" value={formData.binaNo} onChange={e => handleInputChange('binaNo', e.target.value)}
                    placeholder="Bina numarasÄ±nÄ± girin" className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-[#fafafa] focus:outline-none focus:border-primary" />
                </div>

                {/* Bina AdÄ± */}
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">Bina AdÄ±</label>
                  <input type="text" value={formData.binaAdi} onChange={e => handleInputChange('binaAdi', e.target.value)}
                    placeholder="Opsiyonel" className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-[#fafafa] focus:outline-none focus:border-primary" />
                </div>

                {/* Posta Kodu */}
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">Posta Kodu</label>
                  <input type="text" value={formData.postaKodu}
                    onChange={e => { const val = e.target.value.replace(/\D/g, '').slice(0, 5); handleInputChange('postaKodu', val) }}
                    maxLength={5} placeholder="5 haneli posta kodu (opsiyonel)"
                    className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-[#fafafa] focus:outline-none focus:border-primary" />
                </div>
              </div>

              {/* Info box */}
              <div className="mt-6 p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800 flex items-start gap-2.5">
                <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Adres bilgileriniz mahalle topluluÄuna katÄ±lmak iÃ§in kullanÄ±lacaktÄ±r. e-Devlet doÄrulamasÄ± daha sonra yapÄ±lacaktÄ±r.</span>
              </div>

              {/* Submit / Confirm buttons */}
              {!confirmed ? (
                <button onClick={geocodeAddress} disabled={isLoading}
                  className="w-full mt-6 bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 rounded-xl text-sm transition disabled:opacity-50 flex items-center justify-center gap-2">
                  {isLoading ? (<><Loader2 className="w-5 h-5 animate-spin" />Adres doÄrulanÄ±yor...</>) : (<><Navigation className="w-5 h-5" />Adresi Haritada GÃ¶ster</>)}
                </button>
              ) : (
                <div className="mt-6 space-y-3">
                  <div className="p-3.5 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800 flex items-start gap-2.5">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Adres haritada gÃ¶rÃ¼ntÃ¼lendi</p>
                      <p className="text-xs mt-1">{formData.mahalle} Mah. {formData.cadde} No:{formData.binaNo}, {formData.ilce?.name}, {formData.il?.name}</p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-start gap-2.5">
                    <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">7 GÃ¼n Ä°Ã§inde DoÄrulama Gerekli</p>
                      <p className="text-xs">e-Devlet ile adres doÄrulamasÄ± yapmanÄ±z gerekmektedir.</p>
                    </div>
                  </div>

                  <button onClick={saveLocation} disabled={isSaving}
                    className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 rounded-xl text-sm transition disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSaving ? (<><Loader2 className="w-5 h-5 animate-spin" />Kaydediliyor...</>) : (<><Check className="w-5 h-5" />Adresi Kaydet</>)}
                  </button>

                  <button onClick={() => { setConfirmed(false); setError('') }}
                    disabled={isSaving} className="w-full border border-primary text-primary hover:bg-primary/5 font-semibold py-3 rounded-xl text-sm transition">
                    Adresi DÃ¼zenle
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Interactive Satellite Map */}
          <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Harita GÃ¶rÃ¼nÃ¼mÃ¼
                  </h2>
                  <p className="text-xs text-text-muted mt-1">
                    {confirmed && formData.mahalle && formData.cadde
                      ? `${formData.cadde} No:${formData.binaNo}, ${formData.mahalle}, ${formData.ilce?.name}, ${formData.il?.name}`
                      : pinLat !== null
                        ? 'BinanÄ±z seÃ§ildi. Formu doldurup onaylayÄ±n.'
                        : 'Haritaya tÄ±klayarak binanÄ±zÄ± seÃ§in'}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setMapType('satellite')}
                    className={`px-2.5 py-1 text-xs rounded-lg transition ${mapType === 'satellite' ? 'bg-primary text-white' : 'bg-gray-100 text-text-muted hover:bg-gray-200'}`}
                  >Uydu</button>
                  <button
                    onClick={() => setMapType('street')}
                    className={`px-2.5 py-1 text-xs rounded-lg transition ${mapType === 'street' ? 'bg-primary text-white' : 'bg-gray-100 text-text-muted hover:bg-gray-200'}`}
                  >Harita</button>
                </div>
              </div>
              {!pinLat && !confirmed && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg">
                  <MousePointerClick className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Haritada binanÄ±zÄ±nÄ±n bulunduÄu yere tÄ±klayÄ±n</span>
                </div>
              )}
            </div>
            <div className="h-[500px] lg:h-[calc(100%-100px)]">
              <MapComponent
                center={mapCenter}
                zoom={mapZoom}
                mapType={mapType}
                pinLat={pinLat}
                pinLng={pinLng}
                onMapClick={handleMapClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
