'use client'
// @ts-nocheck

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { provinces, type Province, type District } from '@/data/turkey-locations'
import {
  MapPin, Check, AlertCircle, Loader2, Search, ChevronDown, Navigation
} from 'lucide-react'

// GitHub raw JSON for mahalle data - 81 il, 973 ilce, 32K mahalle (~375KB)
const MAHALLE_JSON_URL = 'https://raw.githubusercontent.com/adilmustafayilmaz/turkiye-il-ilce-mahalle-verileri/main/turkiye_ilce_mahalle.json'

interface FormData {
  il: Province | null
  ilce: District | null
  mahalle: string
  cadde: string
  binaNo: string
  binaAdi: string
  postaKodu: string
}

// Cache for mahalle data so we only fetch once
let mahalleDataCache: Record<string, { plaka: number; koordinatlar: { latitude: number; longitude: number }; ilceler: Record<string, string[]> }> | null = null

export default function KonumSecimi() {
  const router = useRouter()
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    il: null, ilce: null, mahalle: '', cadde: '', binaNo: '', binaAdi: '', postaKodu: ''
  })

  const [mahalleler, setMahalleler] = useState<string[]>([])
  const [mahalleLoading, setMahalleLoading] = useState(false)
  const [caddeSuggestions, setCaddeSuggestions] = useState<string[]>([])
  const [caddeLoading, setCaddeLoading] = useState(false)
  const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [mapZoom, setMapZoom] = useState(6)

  // Dropdown open states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [ilSearch, setIlSearch] = useState('')
  const [ilceSearch, setIlceSearch] = useState('')
  const [mahalleSearch, setMahalleSearch] = useState('')

  const dropdownRef = useRef<HTMLDivElement>(null)
  const caddeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Load mahalle data from GitHub JSON
  const loadMahalleData = useCallback(async () => {
    if (mahalleDataCache) return mahalleDataCache
    try {
      const res = await fetch(MAHALLE_JSON_URL)
      if (!res.ok) throw new Error('Mahalle verisi yuklenemedi')
      const data = await res.json()
      mahalleDataCache = data
      return data
    } catch (err) {
      console.error('Mahalle data load error:', err)
      return null
    }
  }, [])

  // Fetch mahalleler when ilce changes
  useEffect(() => {
    if (!formData.il || !formData.ilce) {
      setMahalleler([])
      return
    }
    const fetchMahalleler = async () => {
      setMahalleLoading(true)
      setMahalleler([])
      try {
        const data = await loadMahalleData()
        if (!data) throw new Error('Veri yuklenemedi')

        // Find the province in the JSON - match by name (uppercase in JSON)
        const provinceName = formData.il!.name.toLocaleUpperCase('tr')
        const provinceData = data[provinceName]

        if (!provinceData || !provinceData.ilceler) {
          // Try fuzzy match
          const allProvinces = Object.keys(data)
          const match = allProvinces.find(p =>
            p.toLocaleUpperCase('tr') === provinceName ||
            p.toLocaleLowerCase('tr') === formData.il!.name.toLocaleLowerCase('tr')
          )
          if (match && data[match].ilceler) {
            const districtName = formData.ilce!.name
            const districts = data[match].ilceler
            const districtKey = Object.keys(districts).find(d =>
              d.toLocaleLowerCase('tr') === districtName.toLocaleLowerCase('tr')
            )
            if (districtKey) {
              const mahList = districts[districtKey] as string[]
              setMahalleler(mahList.sort((a: string, b: string) => a.localeCompare(b, 'tr')))
            }
          }
        } else {
          const districtName = formData.ilce!.name
          const districts = provinceData.ilceler
          // Find district - try exact match first, then case-insensitive
          let districtKey = Object.keys(districts).find(d => d === districtName)
          if (!districtKey) {
            districtKey = Object.keys(districts).find(d =>
              d.toLocaleLowerCase('tr') === districtName.toLocaleLowerCase('tr')
            )
          }
          if (districtKey) {
            const mahList = districts[districtKey] as string[]
            setMahalleler(mahList.sort((a: string, b: string) => a.localeCompare(b, 'tr')))
          } else {
            console.warn('District not found:', districtName, 'in', Object.keys(districts).slice(0, 5))
          }
        }
      } catch (err) {
        console.error('Mahalle fetch error:', err)
      } finally {
        setMahalleLoading(false)
      }
    }
    fetchMahalleler()
  }, [formData.il, formData.ilce, loadMahalleData])

  // Update map when location changes
  useEffect(() => {
    if (formData.il) {
      const coords = { lat: formData.il.lat, lng: formData.il.lng }
      setMapCoords({ lat: coords.lat, lng: coords.lng })
      setMapZoom(formData.ilce ? 14 : 10)

      if (formData.ilce) {
        // Geocode the district for better coordinates
        const query = `${formData.ilce.name}, ${formData.il.name}, Turkey`
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&accept-language=tr`)
          .then(r => r.json())
          .then(results => {
            if (results && results.length > 0) {
              setMapCoords({ lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) })
              setMapZoom(formData.mahalle ? 16 : 14)
            }
          })
          .catch(() => {})
      }
    }
  }, [formData.il, formData.ilce, formData.mahalle])

  // Geocode when mahalle is selected
  useEffect(() => {
    if (formData.il && formData.ilce && formData.mahalle) {
      const query = `${formData.mahalle}, ${formData.ilce.name}, ${formData.il.name}, Turkey`
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&accept-language=tr`)
        .then(r => r.json())
        .then(results => {
          if (results && results.length > 0) {
            setMapCoords({ lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) })
            setMapZoom(16)
          }
        })
        .catch(() => {})
    }
  }, [formData.mahalle, formData.il, formData.ilce])

  // Cadde/Sokak autocomplete with Nominatim
  const handleCaddeInput = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, cadde: value }))
    if (caddeTimeoutRef.current) clearTimeout(caddeTimeoutRef.current)

    if (value.length < 2 || !formData.il || !formData.ilce) {
      setCaddeSuggestions([])
      return
    }

    caddeTimeoutRef.current = setTimeout(async () => {
      setCaddeLoading(true)
      try {
        const query = `${value}, ${formData.mahalle || ''} ${formData.ilce!.name}, ${formData.il!.name}`
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8&accept-language=tr&addressdetails=1`
        )
        const results = await res.json()
        if (results && results.length > 0) {
          const streets = results
            .map((r: { address?: { road?: string; pedestrian?: string; residential?: string } }) =>
              r.address?.road || r.address?.pedestrian || r.address?.residential
            )
            .filter((s: string | undefined): s is string => !!s)
            .filter((s: string, i: number, arr: string[]) => arr.indexOf(s) === i) // unique
          setCaddeSuggestions(streets)
        } else {
          setCaddeSuggestions([])
        }
      } catch {
        setCaddeSuggestions([])
      } finally {
        setCaddeLoading(false)
      }
    }, 400)
  }, [formData.il, formData.ilce, formData.mahalle])

  // Selection handlers
  const handleIlSelect = (province: Province) => {
    setFormData({ il: province, ilce: null, mahalle: '', cadde: '', binaNo: '', binaAdi: '', postaKodu: '' })
    setMahalleler([])
    setCaddeSuggestions([])
    setOpenDropdown(null)
    setIlSearch('')
  }

  const handleIlceSelect = (district: District) => {
    setFormData(prev => ({ ...prev, ilce: district, mahalle: '', cadde: '' }))
    setMahalleler([])
    setCaddeSuggestions([])
    setOpenDropdown(null)
    setIlceSearch('')
  }

  const handleMahalleSelect = (mahalle: string) => {
    setFormData(prev => ({ ...prev, mahalle, cadde: '' }))
    setCaddeSuggestions([])
    setOpenDropdown(null)
    setMahalleSearch('')
  }

  const handleCaddeSelect = (cadde: string) => {
    setFormData(prev => ({ ...prev, cadde }))
    setCaddeSuggestions([])
  }

  // Save location
  const saveLocation = async () => {
    if (!formData.il || !formData.ilce || !formData.mahalle) {
      setError('Lutfen il, ilce ve mahalle seciniz')
      return
    }
    setIsSaving(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError('Oturum bulunamadi'); setIsSaving(false); return }

      const locationData = {
        il: formData.il.name,
        ilce: formData.ilce.name,
        mahalle: formData.mahalle,
        cadde_sokak: formData.cadde,
        bina_no: formData.binaNo,
        bina_adi: formData.binaAdi,
        posta_kodu: formData.postaKodu,
        latitude: mapCoords?.lat || formData.il.lat,
        longitude: mapCoords?.lng || formData.il.lng
      }

      // Update user_profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          il: locationData.il,
          ilce: locationData.ilce,
          mahalle: locationData.mahalle,
          address: `${locationData.cadde_sokak} ${locationData.bina_no} ${locationData.bina_adi}`.trim(),
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          location_verified: false
        })
        .eq('user_id', user.id)

      if (profileError) throw profileError

      // Also upsert user_metadata
      const { error: metaError } = await supabase
        .from('user_addresses')
        .upsert({
          user_id: user.id,
          il: locationData.il,
          ilce: locationData.ilce,
          mahalle: locationData.mahalle,
          cadde_sokak: locationData.cadde_sokak,
          bina_no: locationData.bina_no,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })

      if (metaError) { setError('Konum kaydedilemedi: ' + metaError.message); setIsSaving(false); return }

      setConfirmed(true)
      setTimeout(() => router.push('/'), 1500)
    } catch (err) {
      setError('Konum kaydedilemedi: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'))
    } finally {
      setIsSaving(false)
    }
  }

  // Google Maps embed URL using protobuf format
  const getMapUrl = () => {
    if (!mapCoords) return ''
    const { lat, lng } = mapCoords
    const scale = 591657550.5 / Math.pow(2, mapZoom)
    return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d${scale.toFixed(1)}!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1str!2str`
  }

  // Sorted lists
  const sortedProvinces = [...provinces].sort((a, b) => a.name.localeCompare(b.name, 'tr'))
  const sortedDistricts = formData.il
    ? [...formData.il.districts].sort((a, b) => a.name.localeCompare(b.name, 'tr'))
    : []

  // Filter helpers
  const filteredProvinces = ilSearch
    ? sortedProvinces.filter(p => p.name.toLocaleLowerCase('tr').includes(ilSearch.toLocaleLowerCase('tr')))
    : sortedProvinces
  const filteredDistricts = ilceSearch
    ? sortedDistricts.filter(d => d.name.toLocaleLowerCase('tr').includes(ilceSearch.toLocaleLowerCase('tr')))
    : sortedDistricts
  const filteredMahalleler = mahalleSearch
    ? mahalleler.filter(m => m.toLocaleLowerCase('tr').includes(mahalleSearch.toLocaleLowerCase('tr')))
    : mahalleler

  // Dropdown component
  const DropdownField = ({
    label, value, placeholder, isOpen, onToggle, children, disabled = false, loading = false
  }: {
    label: string; value: string; placeholder: string; isOpen: boolean; onToggle: () => void;
    children: React.ReactNode; disabled?: boolean; loading?: boolean
  }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-text-secondary mb-1.5">{label}</label>
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-left transition-all
          ${disabled ? 'bg-bg-tertiary text-text-muted cursor-not-allowed border-border-primary' :
            isOpen ? 'border-brand-primary bg-white ring-2 ring-brand-primary/20' :
            'border-border-primary bg-white hover:border-brand-primary/50'}
        `}
      >
        <span className={value ? 'text-text-primary' : 'text-text-muted'}>
          {loading ? 'Yukleniyor...' : (value || placeholder)}
        </span>
        {loading ? <Loader2 className="w-4 h-4 animate-spin text-text-muted" /> : <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-border-primary rounded-xl shadow-lg max-h-60 overflow-auto">
          {children}
        </div>
      )}
    </div>
  )

  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-status-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-status-success" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Adres Kaydedildi</h2>
          <p className="text-text-muted">Anasayfaya yonlendiriliyorsunuz...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Left panel - Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-border-primary p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-text-primary">Adresinizi Girin</h1>
                  <p className="text-text-muted text-sm">Mahalle topluluguna katilmak icin adresinizi girin</p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-status-error/10 border border-status-error/20 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-status-error flex-shrink-0" />
                  <span className="text-sm text-status-error">{error}</span>
                </div>
              )}

              <div ref={dropdownRef} className="space-y-4">
                {/* Il (Province) */}
                <DropdownField
                  label="Il"
                  value={formData.il?.name || ''}
                  placeholder="Il seciniz"
                  isOpen={openDropdown === 'il'}
                  onToggle={() => setOpenDropdown(openDropdown === 'il' ? null : 'il')}
                >
                  <div className="p-2 sticky top-0 bg-white border-b border-border-primary">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-text-muted" />
                      <input
                        type="text"
                        value={ilSearch}
                        onChange={e => setIlSearch(e.target.value)}
                        placeholder="Il ara..."
                        className="w-full pl-8 pr-3 py-2 text-sm border border-border-primary rounded-lg focus:outline-none focus:border-brand-primary"
                        autoFocus
                      />
                    </div>
                  </div>
                  {filteredProvinces.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleIlSelect(p)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-brand-primary/5 transition-colors flex items-center justify-between"
                    >
                      <span>{p.name}</span>
                      {formData.il?.id === p.id && <Check className="w-4 h-4 text-brand-primary" />}
                    </button>
                  ))}
                </DropdownField>

                {/* Ilce (District) */}
                <DropdownField
                  label="Ilce"
                  value={formData.ilce?.name || ''}
                  placeholder="Ilce seciniz"
                  isOpen={openDropdown === 'ilce'}
                  onToggle={() => setOpenDropdown(openDropdown === 'ilce' ? null : 'ilce')}
                  disabled={!formData.il}
                >
                  <div className="p-2 sticky top-0 bg-white border-b border-border-primary">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-text-muted" />
                      <input
                        type="text"
                        value={ilceSearch}
                        onChange={e => setIlceSearch(e.target.value)}
                        placeholder="Ilce ara..."
                        className="w-full pl-8 pr-3 py-2 text-sm border border-border-primary rounded-lg focus:outline-none focus:border-brand-primary"
                        autoFocus
                      />
                    </div>
                  </div>
                  {filteredDistricts.map(d => (
                    <button
                      key={d.id}
                      onClick={() => handleIlceSelect(d)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-brand-primary/5 transition-colors flex items-center justify-between"
                    >
                      <span>{d.name}</span>
                      {formData.ilce?.id === d.id && <Check className="w-4 h-4 text-brand-primary" />}
                    </button>
                  ))}
                  {filteredDistricts.length === 0 && (
                    <div className="px-3 py-4 text-sm text-text-muted text-center">Sonuc bulunamadi</div>
                  )}
                </DropdownField>

                {/* Mahalle */}
                <DropdownField
                  label="Mahalle"
                  value={formData.mahalle}
                  placeholder="Mahalle seciniz"
                  isOpen={openDropdown === 'mahalle'}
                  onToggle={() => setOpenDropdown(openDropdown === 'mahalle' ? null : 'mahalle')}
                  disabled={!formData.ilce}
                  loading={mahalleLoading}
                >
                  <div className="p-2 sticky top-0 bg-white border-b border-border-primary">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-text-muted" />
                      <input
                        type="text"
                        value={mahalleSearch}
                        onChange={e => setMahalleSearch(e.target.value)}
                        placeholder="Mahalle ara..."
                        className="w-full pl-8 pr-3 py-2 text-sm border border-border-primary rounded-lg focus:outline-none focus:border-brand-primary"
                        autoFocus
                      />
                    </div>
                  </div>
                  {mahalleLoading ? (
                    <div className="px-3 py-4 text-sm text-text-muted text-center flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Mahalleler yukleniyor...
                    </div>
                  ) : filteredMahalleler.length > 0 ? (
                    filteredMahalleler.map((m, i) => (
                      <button
                        key={i}
                        onClick={() => handleMahalleSelect(m)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-brand-primary/5 transition-colors flex items-center justify-between"
                      >
                        <span>{m}</span>
                        {formData.mahalle === m && <Check className="w-4 h-4 text-brand-primary" />}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-sm text-text-muted text-center">
                      {formData.ilce ? 'Mahalle bulunamadi' : 'Once ilce seciniz'}
                    </div>
                  )}
                </DropdownField>

                {/* Cadde/Sokak */}
                <div className="relative">
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Cadde / Sokak</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.cadde}
                      onChange={e => handleCaddeInput(e.target.value)}
                      placeholder={formData.mahalle ? 'Cadde veya sokak yazin...' : 'Once mahalle seciniz'}
                      disabled={!formData.mahalle}
                      className={`w-full px-3 py-2.5 rounded-xl border text-sm transition-all
                        ${!formData.mahalle ? 'bg-bg-tertiary text-text-muted cursor-not-allowed border-border-primary' :
                          'border-border-primary bg-white hover:border-brand-primary/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'}
                      `}
                    />
                    {caddeLoading && <Loader2 className="absolute right-3 top-2.5 w-4 h-4 animate-spin text-text-muted" />}
                  </div>
                  {caddeSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-border-primary rounded-xl shadow-lg max-h-48 overflow-auto">
                      {caddeSuggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleCaddeSelect(s)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-brand-primary/5 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bina No / Bina Adi / Posta Kodu */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Bina No</label>
                    <input
                      type="text"
                      value={formData.binaNo}
                      onChange={e => setFormData(prev => ({ ...prev, binaNo: e.target.value }))}
                      placeholder="No"
                      className="w-full px-3 py-2.5 rounded-xl border border-border-primary bg-white text-sm hover:border-brand-primary/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Bina Adi</label>
                    <input
                      type="text"
                      value={formData.binaAdi}
                      onChange={e => setFormData(prev => ({ ...prev, binaAdi: e.target.value }))}
                      placeholder="Adi"
                      className="w-full px-3 py-2.5 rounded-xl border border-border-primary bg-white text-sm hover:border-brand-primary/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Posta Kodu</label>
                    <input
                      type="text"
                      value={formData.postaKodu}
                      onChange={e => setFormData(prev => ({ ...prev, postaKodu: e.target.value }))}
                      placeholder="34000"
                      className="w-full px-3 py-2.5 rounded-xl border border-border-primary bg-white text-sm hover:border-brand-primary/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={saveLocation}
                  disabled={!formData.il || !formData.ilce || !formData.mahalle || isSaving}
                  className={`w-full py-3 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2
                    ${!formData.il || !formData.ilce || !formData.mahalle || isSaving
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-brand-primary hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/25'}
                  `}
                >
                  {isSaving ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Kaydediliyor...</>
                  ) : (
                    <><Navigation className="w-5 h-5" /> Adresi Kaydet</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right panel - Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-border-primary overflow-hidden sticky top-6">
              <div className="p-4 border-b border-border-primary">
                <h3 className="font-semibold text-text-primary flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-primary" />
                  Harita Gorunumu
                </h3>
                {formData.il && (
                  <p className="text-xs text-text-muted mt-1">
                    {[formData.mahalle, formData.ilce?.name, formData.il.name].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
              <div className="aspect-square w-full bg-bg-secondary">
                {mapCoords ? (
                  <iframe
                    key={`${mapCoords.lat}-${mapCoords.lng}-${mapZoom}`}
                    src={getMapUrl()}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Konum Haritasi"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Il secerek haritayi goruntuleyebilirsiniz</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
