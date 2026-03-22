'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'
import { provinces, type Province, type District } from '@/data/turkey-locations'
import {
  MapPin, Check, AlertCircle, Loader2, Search, ChevronDown, Shield, Clock, Navigation, Building2, Home
} from 'lucide-react'

// Leaflet must be loaded client-side only
const MapComponent = dynamic(() => import('./map-component'), { ssr: false })

type Step = 'form' | 'confirm'

interface FormData {
  il: Province | null
  ilce: District | null
  mahalle: string
  cadde: string
  binaNo: string
  binaAdi: string
  postaKodu: string
}

interface GeocodedLocation {
  lat: number
  lng: number
  address: string
}

export default function KonumSecimi() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<Step>('form')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Form state
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
  const [ilSearch, setIlSearch] = useState('')
  const [ilceSearch, setIlceSearch] = useState('')

  // Map state for confirmation
  const [location, setLocation] = useState<GeocodedLocation | null>(null)

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

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = () => {
      setShowIlDropdown(false)
      setShowIlceDropdown(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  // Handle form input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle province selection
  const handleIlSelect = (province: Province) => {
    setFormData(prev => ({
      ...prev,
      il: province,
      ilce: null,
    }))
    setIlSearch('')
    setShowIlDropdown(false)
  }

  // Handle district selection
  const handleIlceSelect = (district: District) => {
    setFormData(prev => ({
      ...prev,
      ilce: district,
    }))
    setIlceSearch('')
    setShowIlceDropdown(false)
  }

  // Geocode address via Google Geocoding API
  const geocodeAddress = useCallback(async () => {
    if (!formData.il || !formData.ilce || !formData.mahalle || !formData.cadde || !formData.binaNo) {
      setError('Lütfen tüm zorunlu alanları doldurun.')
      return
    }

    if (formData.postaKodu.length !== 5 || !/^\d{5}$/.test(formData.postaKodu)) {
      setError('Lütfen geçerli bir 5 haneli posta kodu girin.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const fullAddress = `${formData.mahalle} Mah. ${formData.cadde} ${formData.binaNo}, ${formData.ilce.name}, ${formData.il.name}, Türkiye`

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=AIzaSyChvjDjaC6DH14E1swB3dAKP2AObo5rCT8&components=country:TR&language=tr`
      )

      if (!response.ok) {
        throw new Error('Geocoding request failed')
      }

      const data = await response.json()

      if (data.results && data.results.length > 0) {
        const result = data.results[0]
        setLocation({
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          address: result.formatted_address,
        })
        setStep('confirm')
      } else {
        setError('Adres bulunamadı. Lütfen adres bilgilerinizi kontrol edin ve tekrar deneyin.')
      }
    } catch (err) {
      setError('Adres doğrulaması sırasında bir hata oluştu. Lütfen tekrar deneyin.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [formData])

  // Save location to Supabase
  const saveLocation = async () => {
    if (!location) return
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
        location_lat: location.lat,
        location_lng: location.lng,
        location_province: formData.il!.name,
        location_district: formData.ilce!.name,
        location_confirmed_at: new Date().toISOString(),
        edevlet_verification_deadline: edevletDeadline,
      }

      // Save to user metadata
      const { error: metaError } = await supabase.auth.updateUser({
        data: locationData
      })
      if (metaError) {
        setError('Konum kaydedilemedi: ' + metaError.message)
        setIsSaving(false)
        return
      }

      // Save full address to user_profiles
      try {
        const fullAddress = `${formData.mahalle} Mah. ${formData.cadde} ${formData.binaNo}${formData.binaAdi ? ', ' + formData.binaAdi : ''}, ${formData.ilce!.name}, ${formData.il!.name}`

        await (supabase as any).from('user_profiles').upsert({
          id: user.id,
          location_address: fullAddress,
          ...locationData,
        }, { onConflict: 'id' ('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border px-4 py-3 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
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

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {(['form', 'confirm'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === s ? 'bg-primary text-white' :
                (['form', 'confirm'].indexOf(step) > i) ? 'bg-primary/20 text-primary' :
                'bg-[#e0e0e0] text-text-muted'
              }`}>
                {(['form', 'confirm'].indexOf(step) > i) ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < 1 && <div className={`w-12 h-0.5 ${(['form', 'confirm'].indexOf(step) > i) ? 'bg-primary/40' : 'bg-[#e0e0e0]'}`} />}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Address Form */}
        {step === 'form' && (
          <div className="space-y-4">
            {/* Form card */}
            <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="px-6 py-8">
                <h1 className="text-2xl font-bold text-text-primary mb-2">Adresinizi Girin</h1>
                <p className="text-text-muted text-sm mb-6">
                  Mahalle topluluğunuza katılmak için adresinizi girin
                </p>

                <div className="space-y-4">
                  {/* İl (Province) */}
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <label className="block text-xs font-semibold text-text-muted mb-1.5">İl *</label>
                    <button
                      onClick={() => { setShowIlDropdown(!showIlDropdown); setShowIlceDropdown(false) }}
                      className="w-full flex items-center justify-between border border-border rounded-xl px-3.5 py-2.5 text-sm bg-[#fafafa] hover:bg-surface transition"
                    >
                      <span className={formData.il ? 'text-text-primary' : 'text-text-muted'}>
                        {formData.il?.name || 'İl seçin'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-text-muted" />
                    </button>
                    {showIlDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-xl shadow-lg z-30 max-h-64 overflow-hidden">
                        <div className="p-2 border-b border-border">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                              type="text"
                              value={ilSearch}
                              onChange={e => setIlSearch(e.target.value)}
                              placeholder="İl ara..."
                              className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-primary"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="overflow-y-auto max-h-48">
                          {filteredProvinces.map(p => (
                            <button
                              key={p.name}
                              onClick={() => handleIlSelect(p)}
                              className={`w-full text-left px-3.5 py-2.5 text-sm hover:bg-background transition ${
                                formData.il?.name === p.name ? 'bg-primary/5 text-primary font-semibold' : 'text-text-primary'
                              }`}
                            >
                              {p.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* İlçe (District) */}
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <label className="block text-xs font-semibold text-text-muted mb-1.5">İlçe *</label>
                    <button
                      onClick={() => { if (formData.il) { setShowIlceDropdown(!showIlceDropdown); setShowIlDropdown(false) } }}
                      disabled={!formData.il}
                      className="w-full flex items-center justify-between border border-border rounded-xl px-3.5 py-2.5 text-sm bg-[#fafafa] hover:bg-surface transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className={formData.ilce ? 'text-text-primary' : 'text-text-muted'}>
                        {formData.ilce?.name || 'İlçe seçin'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-text-muted" />
                    </button>
                    {showIlceDropdown && formData.il && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-xl shadow-lg z-30 max-h-64 overflow-hidden">
                        <div className="p-2 border-b border-border">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                              type="text"
                              value={ilceSearch}
                              onChange={e => setIlceSearch(e.target.value)}
                              placeholder="İlçe ara..."
                              className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-primary"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="overflow-y-auto max-h-48">
                          {filteredDistricts.map(d => (
                            <button
                              key={d.name}
                              onClick={() => handleIlceSelect(d)}
                              className={`w-full text-left px-3.5 py-2.5 text-sm hover:bg-background transition ${
                                formData.ilce?.name === d.name ? 'bg-primary/5 text-primary font-semibold' : 'text-text-primary'
                              }`}
                            >
                              {d.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mahalle (Neighborhood) */}
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1.5">Mahalle *</label>
                    <input
                      type="text"
                      value={formData.mahalle}
                      onChange={e => handleInputChange('mahalle', e.target.value)}
                      placeholder="Mahalle adını girin"
                      className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-[#fafafa] focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Cadde / Sokak (Street) */}
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1.5">Cadde / Sokak *</label>
                    <input
                      type="text"
                      value={formData.cadde}
                      onChange={e => handleInputChange('cadde', e.target.value)}
                      placeholder="Cadde veya sokak adını girin"
                      className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-[#fafafa] focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Bina Numarası (Building Number) */}
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1.5">Bina Numarası *</label>
                    <input
                      type="text"
                      value={formData.binaNo}
                      onChange={e => handleInputChange('binaNo', e.target.value)}
                      placeholder="Bina numarasını girin"
                      className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-[#fafafa] focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Bina Adı (Building Name) */}
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1.5">Bina Adı</label>
                    <input
                      type="text"
                      value={formData.binaAdi}
                      onChange={e => handleInputChange('binaAdi', e.target.value)}
                      placeholder="Opsiyonel"
                      className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-[#fafafa] focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Posta Kodu (Postal Code) */}
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1.5">Posta Kodu *</label>
                    <input
                      type="text"
                      value={formData.postaKodu}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 5)
                        handleInputChange('postaKodu', val)
                      }}
                      maxLength={5}
                      placeholder="5 haneli posta kodu"
                      className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-[#fafafa] focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Info box */}
                <div className="mt-6 p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800 flex items-start gap-2.5">
                  <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Adres bilgileriniz mahalle topluluğuna katılmak için kullanılacaktır.</span>
                </div>

                {/* Submit button */}
                <button
                  onClick={geocodeAddress}
                  disabled={isLoading}
                  className="w-full mt-6 bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 rounded-xl text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Adres doğrulanıyor...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-5 h-5" />
                      Devam Et
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Map Confirmation */}
        {step === 'confirm' && location && (
          <div className="space-y-4">
            {/* Map card */}
            <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="px-6 py-6">
                <h1 className="text-2xl font-bold text-text-primary mb-2">Konumunuz Onaylayın</h1>
                <p className="text-text-muted text-sm mb-6">
                  Haritada konumunuzu görebilir ve 2km etrafındaki mahalle topluluğunu görüntüleyebilirsiniz.
                </p>

                {/* Address summary */}
                <div className="bg-background rounded-xl p-4 mb-4 space-y-2">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-text-primary">{formData.mahalle} Mah.</p>
                      <p className="text-text-muted">{formData.cadde} {formData.binaNo}</p>
                      <p className="text-text-muted">{formData.ilce?.name}, {formData.il?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-muted pl-8">
                    <span>{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</span>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="h-[400px] sm:h-[500px] border-t border-border">
                <MapComponent
                  center={[location.lat, location.lng]}
                  zoom={15}
                  mapType="street"
                  pinLat={location.lat}
                  pinLng={location.lng}
                  onMapClick={() => {}}
                  circleRadius={2000}
                />
              </div>

              {/* Info box */}
              <div className="px-6 py-4 bg-[#fafafa] border-t border-border">
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-start gap-2.5">
                  <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">7 Gün İçinde Doğrulama Gerekli</p>
                    <p className="text-xs text-amber-700">
                      7 gün içinde e-Devlet ile adres doğrulaması yapmanız gerekmektedir.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="px-6 py-6 border-t border-border space-y-3">
                <button
                  onClick={saveLocation}
                  disabled={isSaving}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 rounded-xl text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Konumu Onayla
                    </>
                  )}
                </button>
                <button
                  onClick={() => setStep('form')}
                  disabled={isSaving}
                  className="w-full border border-primary text-primary hover:bg-primary/5 font-semibold py-3 rounded-xl text-sm transition"
                >
                  Geri Dön
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
