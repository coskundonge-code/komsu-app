'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'
import { provinces, type Province, type District } from '@/data/turkey-locations'
import {
  MapPin, Navigation, ChevronDown, Check, AlertCircle, Loader2,
  Map as MapIcon, Satellite, Search, LocateFixed, Shield, Clock, Info
} from 'lucide-react'

// Leaflet must be loaded client-side only
const GoogleMapComponent = dynamic(() => import('./google-map-component'), { ssr: false })

type Step = 'permission' | 'select' | 'confirm'

interface SelectedLocation {
  lat: number
  lng: number
  province: string
  district: string
  address?: string
}

export default function KonumSecimi() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<Step>('permission')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [permissionDenied, setPermissionDenied] = useState(false)

  // GPS location
  const [gpsLat, setGpsLat] = useState<number | null>(null)
  const [gpsLng, setGpsLng] = useState<number | null>(null)

  // Map state
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.0, 35.0]) // Turkey center
  const [mapZoom, setMapZoom] = useState(6)
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street')
  const [pinLat, setPinLat] = useState<number | null>(null)
  const [pinLng, setPinLng] = useState<number | null>(null)

  // Dropdown state
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)
  const [provinceSearch, setProvinceSearch] = useState('')
  const [districtSearch, setDistrictSearch] = useState('')
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false)
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false)

  // Confirmed location
  const [confirmedLocation, setConfirmedLocation] = useState<SelectedLocation | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Reverse geocode to find province/district from coordinates
  const reverseGeocode = useCallback((lat: number, lng: number) => {
    let closestProvince: Province | null = null
    let closestDistrict: District | null = null
    let minDist = Infinity

    for (const prov of provinces) {
      for (const dist of prov.districts) {
        const d = Math.sqrt(Math.pow(dist.lat - lat, 2) + Math.pow(dist.lng - lng, 2))
        if (d < minDist) {
          minDist = d
          closestProvince = prov
          closestDistrict = dist
        }
      }
      // Also check province center
      const d = Math.sqrt(Math.pow(prov.lat - lat, 2) + Math.pow(prov.lng - lng, 2))
      if (d < minDist) {
        minDist = d
        closestProvince = prov
        closestDistrict = prov.districts[0] || null
      }
    }

    if (closestProvince) {
      setSelectedProvince(closestProvince)
      setSelectedDistrict(closestDistrict)
    }
  }, [])

  // Request GPS permission
  const requestLocation = useCallback(() => {
    setIsLoading(true)
    setError('')
    setPermissionDenied(false)

    if (!navigator.geolocation) {
      setError('Tarayıcınız konum özelliğini desteklemiyor. Lütfen il/ilçe seçerek devam edin.')
      setIsLoading(false)
      setStep('select')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setGpsLat(latitude)
        setGpsLng(longitude)
        setPinLat(latitude)
        setPinLng(longitude)
        setMapCenter([latitude, longitude])
        setMapZoom(15)
        reverseGeocode(latitude, longitude)
        setIsLoading(false)
        setStep('select')
      },
      (err) => {
        setIsLoading(false)
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionDenied(true)
          setError('Konum izni reddedildi. Mahallemiz\'i kullanabilmek için konum izni vermeniz gerekmektedir.')
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError('Konumunuz belirlenemedi. Lütfen il/ilçe seçerek devam edin.')
          setStep('select')
        } else {
          setError('Konum alınamadı. Lütfen tekrar deneyin veya il/ilçe seçerek devam edin.')
          setStep('select')
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    )
  }, [reverseGeocode])

  // Handle map click - place pin
  const handleMapClick = useCallback((lat: number, lng: number) => {
    setPinLat(lat)
    setPinLng(lng)
    reverseGeocode(lat, lng)
  }, [reverseGeocode])

  // Navigate to my GPS location
  const goToMyLocation = useCallback(() => {
    if (gpsLat && gpsLng) {
      setMapCenter([gpsLat, gpsLng])
      setMapZoom(15)
      setPinLat(gpsLat)
      setPinLng(gpsLng)
      reverseGeocode(gpsLat, gpsLng)
    }
  }, [gpsLat, gpsLng, reverseGeocode])

  // Province selection
  const handleProvinceSelect = useCallback((province: Province) => {
    setSelectedProvince(province)
    setSelectedDistrict(null)
    setProvinceSearch('')
    setShowProvinceDropdown(false)
    setMapCenter([province.lat, province.lng])
    setMapZoom(11)
    setPinLat(province.lat)
    setPinLng(province.lng)
  }, [])

  // District selection
  const handleDistrictSelect = useCallback((district: District) => {
    setSelectedDistrict(district)
    setDistrictSearch('')
    setShowDistrictDropdown(false)
    setMapCenter([district.lat, district.lng])
    setMapZoom(14)
    setPinLat(district.lat)
    setPinLng(district.lng)
  }, [])

  // Confirm location
  const handleConfirm = useCallback(() => {
    if (!pinLat || !pinLng || !selectedProvince) {
      setError('Lütfen haritada konumunuzu seçin veya il/ilçe belirleyin.')
      return
    }
    setConfirmedLocation({
      lat: pinLat,
      lng: pinLng,
      province: selectedProvince.name,
      district: selectedDistrict?.name || '',
    })
    setStep('confirm')
  }, [pinLat, pinLng, selectedProvince, selectedDistrict])

  // Save to Supabase
  const saveLocation = async () => {
    if (!confirmedLocation) return
    setIsSaving(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Oturumunuz sona ermiş. Lütfen tekrar giriş yapın.')
        router.push('/giris')
        return
      }

      const locationData = {
        location_lat: confirmedLocation.lat,
        location_lng: confirmedLocation.lng,
        location_province: confirmedLocation.province,
        location_district: confirmedLocation.district,
        location_confirmed_at: new Date().toISOString(),
        edevlet_verification_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }

      // Save to user metadata (used by middleware for enforcement)
      const { error: metaError } = await supabase.auth.updateUser({
        data: locationData
      })
      if (metaError) {
        setError('Konum kaydedilemedi: ' + metaError.message)
        setIsSaving(false)
        return
      }

      // Also save to user_profiles table if it exists
      try {
        await (supabase as any).from('user_profiles').upsert({
          id: user.id,
          ...locationData,
        }, { onConflict: 'id' })
      } catch {
        // Table might not exist yet, that's ok - metadata is the source of truth
      }

      // Navigate to home
      router.push('/')
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsSaving(false)
    }
  }

  // Filter provinces
  const filteredProvinces = provinceSearch
    ? provinces.filter(p => p.name.toLowerCase().includes(provinceSearch.toLowerCase()))
    : provinces

  // Filter districts
  const filteredDistricts = selectedProvince
    ? (districtSearch
      ? selectedProvince.districts.filter(d => d.name.toLowerCase().includes(districtSearch.toLowerCase()))
      : selectedProvince.districts)
    : []

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = () => {
      setShowProvinceDropdown(false)
      setShowDistrictDropdown(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

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

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {(['permission', 'select', 'confirm'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === s ? 'bg-primary text-white' :
                (['permission', 'select', 'confirm'].indexOf(step) > i) ? 'bg-primary/20 text-primary' :
                'bg-[#e0e0e0] text-text-muted'
              }`}>
                {(['permission', 'select', 'confirm'].indexOf(step) > i) ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < 2 && <div className={`w-12 h-0.5 ${(['permission', 'select', 'confirm'].indexOf(step) > i) ? 'bg-primary/40' : 'bg-[#e0e0e0]'}`} />}
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

        {/* STEP 1: Permission */}
        {step === 'permission' && (
          <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-8 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <Navigation className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">Konum İzni Gerekli</h1>
              <p className="text-text-muted text-sm mb-6 max-w-md mx-auto">
                Mahallemiz, size en yakın mahalle topluluğunu gösterebilmek için konum bilginize ihtiyaç duyar.
                Konum izni vermeden üyelik işleminizi tamamlayamazsınız.
              </p>

              <div className="space-y-3 text-left max-w-sm mx-auto mb-8">
                <div className="flex items-start gap-3 text-sm">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-[#555]">Konum bilginiz sadece mahalle eşleştirmesi için kullanılır</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-[#555]">Haritada konumunuzu doğrulayabilirsiniz</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-[#555]">30 gün içinde e-Devlet ile adres doğrulaması yapmanız gerekir</span>
                </div>
              </div>

              <button
                onClick={requestLocation}
                disabled={isLoading}
                className="w-full max-w-sm mx-auto bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 rounded-xl text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Konum alınıyor...
                  </>
                ) : (
                  <>
                    <LocateFixed className="w-5 h-5" />
                    Konum İzni Ver
                  </>
                )}
              </button>

              {permissionDenied && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-left">
                  <div className="flex items-start gap-2.5 text-sm text-amber-800">
                    <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Konum izni reddedildi</p>
                      <p className="text-amber-700">
                        Tarayıcınızın adres çubuğundaki kilit/konum simgesine tıklayarak konum iznini etkinleştirin ve sayfayı yenileyin.
                        Mahallemiz, konum izni olmadan kullanılamaz.
                      </p>
                      <button
                        onClick={requestLocation}
                        className="mt-3 text-sm font-semibold text-primary hover:text-primary-hover transition"
                      >
                        Tekrar Dene
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Location selection */}
        {step === 'select' && (
          <div className="space-y-4">
            {/* Dropdown row */}
            <div className="bg-surface rounded-2xl shadow-sm border border-border p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Province dropdown */}
                <div className="flex-1 relative" onClick={e => e.stopPropagation()}>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">İl</label>
                  <button
                    onClick={() => { setShowProvinceDropdown(!showProvinceDropdown); setShowDistrictDropdown(false) }}
                    className="w-full flex items-center justify-between border border-border rounded-xl px-3.5 py-2.5 text-sm bg-[#fafafa] hover:bg-surface transition"
                  >
                    <span className={selectedProvince ? 'text-text-primary' : 'text-text-muted'}>
                      {selectedProvince?.name || 'İl seçin'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-text-muted" />
                  </button>
                  {showProvinceDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-xl shadow-lg z-30 max-h-64 overflow-hidden">
                      <div className="p-2 border-b border-border">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                          <input
                            type="text"
                            value={provinceSearch}
                            onChange={e => setProvinceSearch(e.target.value)}
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
                            onClick={() => handleProvinceSelect(p)}
                            className={`w-full text-left px-3.5 py-2.5 text-sm hover:bg-background transition ${
                              selectedProvince?.name === p.name ? 'bg-primary/5 text-primary font-semibold' : 'text-text-primary'
                            }`}
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* District dropdown */}
                <div className="flex-1 relative" onClick={e => e.stopPropagation()}>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">İlçe</label>
                  <button
                    onClick={() => { if (selectedProvince) { setShowDistrictDropdown(!showDistrictDropdown); setShowProvinceDropdown(false) } }}
                    disabled={!selectedProvince}
                    className="w-full flex items-center justify-between border border-border rounded-xl px-3.5 py-2.5 text-sm bg-[#fafafa] hover:bg-surface transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className={selectedDistrict ? 'text-text-primary' : 'text-text-muted'}>
                      {selectedDistrict?.name || 'İlçe seçin'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-text-muted" />
                  </button>
                  {showDistrictDropdown && selectedProvince && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-xl shadow-lg z-30 max-h-64 overflow-hidden">
                      <div className="p-2 border-b border-border">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                          <input
                            type="text"
                            value={districtSearch}
                            onChange={e => setDistrictSearch(e.target.value)}
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
                            onClick={() => handleDistrictSelect(d)}
                            className={`w-full text-left px-3.5 py-2.5 text-sm hover:bg-background transition ${
                              selectedDistrict?.name === d.name ? 'bg-primary/5 text-primary font-semibold' : 'text-text-primary'
                            }`}
                          >
                            {d.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* My location button */}
                {gpsLat && gpsLng && (
                  <div className="flex items-end">
                    <button
                      onClick={goToMyLocation}
                      className="flex items-center gap-1.5 border border-primary text-primary hover:bg-primary/5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition whitespace-nowrap"
                      title="Konumuma git"
                    >
                      <LocateFixed className="w-4 h-4" />
                      <span className="hidden sm:inline">Konumum</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Map */}
            <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden relative">
              {/* Map type toggle */}
              <div className="absolute top-3 right-3 z-20 flex bg-surface rounded-lg shadow border border-border overflow-hidden">
                <button
                  onClick={() => setMapType('street')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition ${
                    mapType === 'street' ? 'bg-primary text-white' : 'text-[#555] hover:bg-background'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  Harita
                </button>
                <button
                  onClick={() => setMapType('satellite')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition ${
                    mapType === 'satellite' ? 'bg-primary text-white' : 'text-[#555] hover:bg-background'
                  }`}
                >
                  <Satellite className="w-3.5 h-3.5" />
                  Uydu
                </button>
              </div>

              <div className="h-[400px] sm:h-[500px]">
                <GoogleMapComponent
                  center={mapCenter}
                  zoom={mapZoom}
                  mapType={mapType}
                  pinLat={pinLat}
                  pinLng={pinLng}
                  onMapClick={handleMapClick}
                />
              </div>

              {/* Info bar */}
              <div className="px-4 py-3 bg-[#fafafa] border-t border-border flex items-center justify-between">
                <div className="text-xs text-text-muted">
                  {pinLat && pinLng ? (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {selectedProvince?.name || ''}{selectedDistrict ? ` / ${selectedDistrict.name}` : ''}
                      <span className="text-[#b0b0b0] ml-1">({pinLat.toFixed(5)}, {pinLng.toFixed(5)})</span>
                    </span>
                  ) : (
                    <span>Haritada bir nokta seçin</span>
                  )}
                </div>
              </div>
            </div>

            {/* Confirm button */}
            <button
              onClick={handleConfirm}
              disabled={!pinLat || !pinLng || !selectedProvince}
              className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              <Check className="w-5 h-5" />
              Konumu Onayla
            </button>
          </div>
        )}

        {/* STEP 3: Confirmation */}
        {step === 'confirm' && confirmedLocation && (
          <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-8 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <Check className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">Konum Onayı</h1>
              <p className="text-text-muted text-sm mb-6">
                Seçtiğiniz konum bilgileri aşağıdadır. Doğru olduğunu onaylayın.
              </p>

              <div className="bg-background rounded-xl p-4 max-w-sm mx-auto mb-6 text-left space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-text-primary">{confirmedLocation.province}</span>
                  {confirmedLocation.district && (
                    <span className="text-[#555]">/ {confirmedLocation.district}</span>
                  )}
                </div>
                <div className="text-xs text-text-muted pl-6">
                  Koordinatlar: {confirmedLocation.lat.toFixed(5)}, {confirmedLocation.lng.toFixed(5)}
                </div>
              </div>

              {/* 30-day notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-sm mx-auto mb-6 text-left">
                <div className="flex items-start gap-2.5 text-sm text-amber-800">
                  <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">30 Gün İçinde Doğrulama Gerekli</p>
                    <p className="text-xs text-amber-700">
                      Bu konum bilgisi ile 30 gün boyunca üyeliğiniz aktif kalır. Bu süre içinde
                      e-Devlet üzerinden adres doğrulaması yapmanız gerekmektedir. Doğrulama yapılmazsa
                      hesabınız doğrulama yapılana kadar kilitlenecektir.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 max-w-sm mx-auto">
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
                      Onayla ve Devam Et
                    </>
                  )}
                </button>
                <button
                  onClick={() => setStep('select')}
                  disabled={isSaving}
                  className="w-full border border-border hover:bg-surface-hover text-[#555] font-semibold py-3 rounded-xl text-sm transition"
                >
                  Konumu Değiştir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
