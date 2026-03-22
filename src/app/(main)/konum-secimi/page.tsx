'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { provinces, type Province, type District } from '@/data/turkey-locations'
import {
  MapPin, Check, AlertCircle, Loader2, Search, ChevronDown, Shield, Clock, Navigation
} from 'lucide-react'

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
  const [mapEmbedUrl, setMapEmbedUrl] = useState('')
  const [mapCenter, setMapCenter] = useState({ lat: 39.9334, lng: 32.8597 })
  const [mapZoom, setMapZoom] = useState(6)

  // Refs for click-outside
  const ilDropdownRef = useRef<HTMLDivElement>(null)
  const ilceDropdownRef = useRef<HTMLDivElement>(null)
  const mahalleDropdownRef = useRef<HTMLDivElement>(null)
  const caddeDropdownRef = useRef<HTMLDivElement>(null)

  // Debounce timer ref for cadde search
  const caddeTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Filter provinces (sorted alphabetically with Turkish locale)
  const sortedProvinces = [...provinces].sort((a, b) => a.name.localeCompare(b.name, 'tr'))
  const filteredProvinces = ilSearch
    ? sortedProvinces.filter(p => p.name.toLocaleLowerCase('tr').includes(ilSearch.toLocaleLowerCase('tr')))
    : sortedProvinces

  // Filter districts (sorted alphabetically with Turkish locale)
  const sortedDistricts = formData.il
    ? [...formData.il.districts].sort((a, b) => a.name.localeCompare(b.name, 'tr'))
    : []
  const filteredDistricts = ilceSearch
    ? sortedDistricts.filter(d => d.name.toLocaleLowerCase('tr').includes(ilceSearch.toLocaleLowerCase('tr')))
    : sortedDistricts

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

  // Fetch mahalle when ilçe changes
  useEffect(() => {
    if (!formData.il || !formData.ilce) {
      setMahalleler([])
      return
    }

    const fetchMahalleler = async () => {
      setMahalleLoading(true)
      try {
        // Strategy 1: Try turkiyeapi.dev provinces endpoint to find IDs, then neighborhoods
        let neighborhoods: Neighborhood[] = []

        try {
          // First get all provinces to find our province ID
          const provRes = await fetch('https://turkiyeapi.dev/api/v1/provinces')
          if (provRes.ok) {
            const provJson = await provRes.json()
            const provData = provJson.data || provJson
            if (Array.isArray(provData)) {
              const prov = provData.find((p: any) =>
                p.name?.toLocaleLowerCase('tr') === formData.il!.name.toLocaleLowerCase('tr')
              )
              if (prov && prov.districts) {
                const dist = prov.districts.find((d: any) =>
                  d.name?.toLocaleLowerCase('tr') === formData.ilce!.name.toLocaleLowerCase('tr')
                )
                if (dist && dist.neighborhoods && Array.isArray(dist.neighborhoods)) {
                  neighborhoods = dist.neighborhoods.map((n: any, idx: number) => ({
                    id: n.id || idx,
                    name: n.name,
                    population: n.population
                  }))
                }
              }
            }
          }
        } catch {}

        // Strategy 2: Try with direct neighborhoods endpoint if Strategy 1 failed
        if (neighborhoods.length === 0) {
          try {
            const res = await fetch(
              `https://turkiyeapi.dev/api/v1/neighborhoods?province=${encodeURIComponent(formData.il!.name)}&district=${encodeURIComponent(formData.ilce!.name)}&limit=500`
            )
            if (res.ok) {
              const json = await res.json()
              const data = json.data || json
              if (Array.isArray(data)) {
                neighborhoods = data.map((n: any, idx: number) => ({
                  id: n.id || idx,
                  name: n.name,
                  population: n.population
                }))
              }
            }
          } catch {}
        }

        // Strategy 3: Try Nominatim suburb search as last resort
        if (neighborhoods.length === 0) {
          try {
            const query = `${formData.ilce!.name}, ${formData.il!.name}, Türkiye`
            const res = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=tr&limit=50&accept-language=tr&featuretype=suburb`,
              { headers: { 'User-Agent': 'Mahallemiz/1.0' } }
            )
            if (res.ok) {
              const data = await res.json()
              if (Array.isArray(data)) {
                const seen = new Set<string>()
                neighborhoods = data
                  .filter((r: any) => {
                    const name = r.display_name?.split(',')[0]?.trim()
                    if (!name || seen.has(name)) return false
                    seen.add(name)
                    return true
                  })
                  .map((r: any, idx: number) => ({
                    id: idx,
                    name: r.display_name?.split(',')[0]?.trim() || r.name || ''
                  }))
              }
            }
          } catch {}
        }

        // Sort alphabetically with Turkish locale
        const sorted = neighborhoods.sort((a, b) => a.name.localeCompare(b.name, 'tr'))
        setMahalleler(sorted)
      } catch (err) {
        console.error('Mahalle verisi alınamadı:', err)
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
      console.error('Cadde araması başarısız:', err)
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

  const handleCaddeSelect = (cadde: string) => {
    setFormData(prev => ({ ...prev, cadde }))
    setCaddeSearch('')
    setShowCaddeDropdown(false)
    if (confirmed) { setConfirmed(false) }
  }

  // Build Google Maps embed URL (protobuf format with satellite view !5e1)
  const buildMapUrl = useCallback((lat: number, lng: number, zoom: number) => {
    // Calculate scale from zoom level (approximate meters per pixel * viewport)
    const scale = 591657550.5 / Math.pow(2, zoom)
    // !5e1 = satellite/earth view, !3m2!1str!2str = Turkish locale
    return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d${scale.toFixed(1)}!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e1!3m2!1str!2str`
  }, [])

  // Update map when il/ilce changes
  useEffect(() => {
    if (confirmed) return // Don't change map when address is confirmed
    if (formData.ilce) {
      setMapCenter({ lat: formData.ilce.lat, lng: formData.ilce.lng })
      setMapZoom(13)
      setMapEmbedUrl(buildMapUrl(formData.ilce.lat, formData.ilce.lng, 13))
    } else if (formData.il) {
      setMapCenter({ lat: formData.il.lat, lng: formData.il.lng })
      setMapZoom(10)
      setMapEmbedUrl(buildMapUrl(formData.il.lat, formData.il.lng, 10))
    } else {
      setMapCenter({ lat: 39.9334, lng: 32.8597 })
      setMapZoom(6)
      setMapEmbedUrl(buildMapUrl(39.9334, 32.8597, 6))
    }
  }, [formData.il, formData.ilce, confirmed, buildMapUrl])

  // Initialize map
  useEffect(() => {
    setMapEmbedUrl(buildMapUrl(39.9334, 32.8597, 6))
  }, [buildMapUrl])

  const geocodeAddress = useCallback(async () => {
    if (!formData.il || !formData.ilce || !formData.mahalle || !formData.cadde || !formData.binaNo) {
      setError('Lütfen tüm zorunlu alanları doldurun.')
      return
    }

    if (formData.postaKodu && (formData.postaKodu.length !== 5 || !/^\d{5}$/.test(formData.postaKodu))) {
      setError('Lütfen geçerli bir 5 haneli posta kodu girin.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const fullAddress = `${formData.mahalle} Mahallesi, ${formData.cadde}, ${formData.binaNo}, ${formData.ilce.name}, ${formData.il.name}`

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&countrycodes=tr&limit=1&accept-language=tr`,
        { headers: { 'User-Agent': 'Mahallemiz/1.0' } }
      )

      let lat: number, lng: number, displayAddress: string

      if (response.ok) {
        const data = await response.json()
        if (data && data.length > 0) {
          lat = parseFloat(data[0].lat)
          lng = parseFloat(data[0].lon)
          displayAddress = data[0].display_name
        } else {
          // Fallback: try with just mahalle + ilçe + il
          const fallbackAddress = `${formData.mahalle}, ${formData.ilce.name}, ${formData.il.name}, Türkiye`
          const fallbackRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fallbackAddress)}&countrycodes=tr&limit=1&accept-language=tr`,
            { headers: { 'User-Agent': 'Mahallemiz/1.0' } }
          )

          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json()
            if (fallbackData && fallbackData.length > 0) {
              lat = parseFloat(fallbackData[0].lat)
              lng = parseFloat(fallbackData[0].lon)
              displayAddress = fallbackData[0].display_name
            } else {
              // Last fallback: use ilçe coordinates
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
        // Network error fallback: use ilçe coordinates
        lat = formData.ilce.lat
        lng = formData.ilce.lng
        displayAddress = `${formData.mahalle} Mah. ${formData.cadde} ${formData.binaNo}, ${formData.ilce.name}, ${formData.il.name}`
      }

      setMapCenter({ lat, lng })
      setMapZoom(18)
      setMapEmbedUrl(buildMapUrl(lat, lng, 18))
      setConfirmed(true)
    } catch (err) {
      // Even on network error, use ilçe coordinates as fallback
      const lat = formData.ilce.lat
      const lng = formData.ilce.lng
      setMapCenter({ lat, lng })
      setMapZoom(18)
      setMapEmbedUrl(buildMapUrl(lat, lng, 18))
      setConfirmed(true)
    } finally {
      setIsLoading(false)
    }
  }, [formData, buildMapUrl])

  const saveLocation = async () => {
    setIsSaving(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Oturumunuz sona ermiş. Lütfen tekrar giriş yapın.')
        router.push('/giris')
        return
      }

      const edevletDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      const locationData = {
        location_lat: mapCenter.lat,
        location_lng: mapCenter.lng,
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
          latitude: mapCenter.lat,
          longitude: mapCenter.lng,
        })
      } catch {}

      window.location.href = '/'
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
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
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Yükleniyor...
              </div>
            ) : items.length === 0 ? (
              <div className="px-3.5 py-3 text-sm text-text-muted text-center">Sonuç bulunamadı</div>
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
            <span>Konum Doğrulama</span>
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
              <p className="text-text-muted text-sm mb-6">Mahalle topluluğunuza katılmak için adresinizi girin</p>

              <div className="space-y-4">
                {/* İl */}
                <DropdownField
                  label="İl" required dropdownRef={ilDropdownRef}
                  showDropdown={showIlDropdown} setShowDropdown={setShowIlDropdown}
                  selectedValue={formData.il?.name || ''} placeholder="İl seçin"
                  searchValue={ilSearch} setSearchValue={setIlSearch} searchPlaceholder="İl ara..."
                  items={filteredProvinces.map(p => ({ key: p.name, label: p.name }))}
                  onSelect={key => { const p = provinces.find(x => x.name === key); if (p) handleIlSelect(p) }}
                  closeOthers={() => { setShowIlceDropdown(false); setShowMahalleDropdown(false); setShowCaddeDropdown(false) }}
                />

                {/* İlçe */}
                <DropdownField
                  label="İlçe" required dropdownRef={ilceDropdownRef}
                  showDropdown={showIlceDropdown} setShowDropdown={setShowIlceDropdown}
                  selectedValue={formData.ilce?.name || ''} placeholder="İlçe seçin"
                  searchValue={ilceSearch} setSearchValue={setIlceSearch} searchPlaceholder="İlçe ara..."
                  items={filteredDistricts.map(d => ({ key: d.name, label: d.name }))}
                  onSelect={key => { const d = formData.il?.districts.find(x => x.name === key); if (d) handleIlceSelect(d) }}
                  disabled={!formData.il}
                  closeOthers={() => { setShowIlDropdown(false); setShowMahalleDropdown(false); setShowCaddeDropdown(false) }}
                />

                {/* Mahalle */}
                <DropdownField
                  label="Mahalle" required dropdownRef={mahalleDropdownRef}
                  showDropdown={showMahalleDropdown} setShowDropdown={setShowMahalleDropdown}
                  selectedValue={formData.mahalle} placeholder="Mahalle seçin"
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
                    placeholder={formData.mahalle ? 'Cadde veya sokak adını yazın...' : 'Önce mahalle seçin'}
                    disabled={!formData.mahalle}
                    className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-[#fafafa] focus:outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {showCaddeDropdown && caddeler.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto">
                      {caddeLoading ? (
                        <div className="flex items-center justify-center py-3 text-sm text-text-muted">
                          <Loader2 className="w-4 h-4 animate-spin mr-2" /> Aranıyor...
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

                {/* Bina Numarası */}
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">Bina Numarası *</label>
                  <input type="text" value={formData.binaNo} onChange={e => handleInputChange('binaNo', e.target.value)}
                    placeholder="Bina numarasını girin" className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-[#fafafa] focus:outline-none focus:border-primary" />
                </div>

                {/* Bina Adı */}
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">Bina Adı</label>
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
                <span>Adres bilgileriniz mahalle topluluğuna katılmak için kullanılacaktır. e-Devlet doğrulaması daha sonra yapılacaktır.</span>
              </div>

              {/* Submit / Confirm buttons */}
              {!confirmed ? (
                <button onClick={geocodeAddress} disabled={isLoading}
                  className="w-full mt-6 bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 rounded-xl text-sm transition disabled:opacity-50 flex items-center justify-center gap-2">
                  {isLoading ? (<><Loader2 className="w-5 h-5 animate-spin" />Adres doğrulanıyor...</>) : (<><Navigation className="w-5 h-5" />Adresi Haritada Göster</>)}
                </button>
              ) : (
                <div className="mt-6 space-y-3">
                  <div className="p-3.5 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800 flex items-start gap-2.5">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Adres haritada görüntülendi</p>
                      <p className="text-xs mt-1">{formData.mahalle} Mah. {formData.cadde} No:{formData.binaNo}, {formData.ilce?.name}, {formData.il?.name}</p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-start gap-2.5">
                    <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">7 Gün İçinde Doğrulama Gerekli</p>
                      <p className="text-xs">e-Devlet ile adres doğrulaması yapmanız gerekmektedir.</p>
                    </div>
                  </div>

                  <button onClick={saveLocation} disabled={isSaving}
                    className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 rounded-xl text-sm transition disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSaving ? (<><Loader2 className="w-5 h-5 animate-spin" />Kaydediliyor...</>) : (<><Check className="w-5 h-5" />Adresi Kaydet</>)}
                  </button>

                  <button onClick={() => { setConfirmed(false); setError('') }}
                    disabled={isSaving} className="w-full border border-primary text-primary hover:bg-primary/5 font-semibold py-3 rounded-xl text-sm transition">
                    Adresi Düzenle
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Google Maps Satellite View */}
          <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Harita Görünümü
              </h2>
              <p className="text-xs text-text-muted mt-1">Uydu görüntüsü ile adresinizi doğrulayın</p>
            </div>
            <div className="h-[500px] lg:h-[calc(100%-72px)]">
              {mapEmbedUrl ? (
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps Satellite"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-text-muted text-sm">
                  <MapPin className="w-6 h-6 mr-2" /> Harita yükleniyor...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
