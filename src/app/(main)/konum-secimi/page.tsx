'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'
import { provinces, type Province, type District } from '@/data/turkey-locations'
import {
  MapPin, Check, AlertCircle, Loader2, Search, ChevronDown, Shield, Clock, Navigation
} from 'lucide-react'

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

interface GeocodedLocation {
  lat: number
  lng: number
  address: string
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

  const [showIlDropdown, setShowIlDropdown] = useState(false)
  const [showIlceDropdown, setShowIlceDropdown] = useState(false)
  const [ilSearch, setIlSearch] = useState('')
  const [ilceSearch, setIlceSearch] = useState('')

  const [location, setLocation] = useState<GeocodedLocation | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 39.9334, lng: 32.8597 })
  const [mapZoom, setMapZoom] = useState(6)

  const filteredProvinces = ilSearch
    ? provinces.filter(p => p.name.toLowerCase().includes(ilSearch.toLowerCase()))
    : provinces

  const filteredDistricts = formData.il
    ? (ilceSearch
      ? formData.il.districts.filter(d => d.name.toLowerCase().includes(ilceSearch.toLowerCase()))
      : formData.il.districts)
    : []

  useEffect(() => {
    const handler = () => { setShowIlDropdown(false); setShowIlceDropdown(false) }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (confirmed) { setConfirmed(false); setLocation(null) }
  }

  const handleIlSelect = (province: Province) => {
    setFormData(prev => ({ ...prev, il: province, ilce: null }))
    setIlSearch('')
    setShowIlDropdown(false)
    if (confirmed) { setConfirmed(false); setLocation(null) }
  }

  const handleIlceSelect = (district: District) => {
    setFormData(prev => ({ ...prev, ilce: district }))
    setIlceSearch('')
    setShowIlceDropdown(false)
    if (confirmed) { setConfirmed(false); setLocation(null) }
  }

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
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&countrycodes=tr&limit=1&accept-language=tr`,
        { headers: { 'User-Agent': 'Mahallemiz/1.0' } }
      )

      if (!response.ok) throw new Error('Geocoding request failed')

      const data = await response.json()

      if (data && data.length > 0) {
        const result = data[0]
        const loc = {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          address: result.display_name
        }
        setLocation(loc)
        setMapCenter({ lat: loc.lat, lng: loc.lng })
        setMapZoom(17)
        setConfirmed(true)
      } else {
        setError('Adres bulunamadı. Lütfen adres bilgilerinizi kontrol edin.')
      }
    } catch (err) {
      setError('Adres doğrulaması sırasında bir hata oluştu.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [formData])

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

      const { error: metaError } = await supabase.auth.updateUser({ data: locationData })
      if (metaError) { setError('Konum kaydedilemedi: ' + metaError.message); setIsSaving(false); return }

      try {
        const fullAddress = `${formData.mahalle} Mah. ${formData.cadde} ${formData.binaNo}${formData.binaAdi ? ', ' + formData.binaAdi : ''}, ${formData.ilce!.name}, ${formData.il!.name}`
        await (supabase as any).from('user_profiles').upsert({ id: user.id, location_address: fullAddress, ...locationData }, { onConflict: 'id' })
      } catch {}

      try {
        await (supabase as any).from('user_addresses').insert({
          user_id: user.id,
          address: `${formData.mahalle} Mah. ${formData.cadde} ${formData.binaNo}${formData.binaAdi ? ', ' + formData.binaAdi : ''}`,
          neighborhood: formData.mahalle,
          city: formData.il!.name,
          district: formData.ilce!.name,
          postal_code: formData.postaKodu,
          latitude: location.lat,
          longitude: location.lng,
        })
      } catch {}

      window.location.href = '/'
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsSaving(false)
    }
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
                <div className="relative" onClick={e => e.stopPropagation()}>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">İl *</label>
                  <button onClick={() => { setShowIlDropdown(!showIlDropdown); setShowIlceDropdown(false) }}
                    className="w-full flex items-center justify-between border border-border rounded-xl px-3.5 py-2.5 text-sm bg-[#fafafa] hover:bg-surface transition">
                    <span className={formData.il ? 'text-text-primary' : 'text-text-muted'}>{formData.il?.name || 'İl seçin'}</span>
                    <ChevronDown className="w-4 h-4 text-text-muted" />
                  </button>
                  {showIlDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-xl shadow-lg z-30 max-h-64 overflow-hidden">
                      <div className="p-2 border-b border-border">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                          <input type="text" value={ilSearch} onChange={e => setIlSearch(e.target.value)} placeholder="İl ara..."
                            className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-primary" autoFocus />
                        </div>
                      </div>
                      <div className="overflow-y-auto max-h-48">
                        {filteredProvinces.map(p => (
                          <button key={p.name} onClick={() => handleIlSelect(p)}
                            className={`w-full text-left px-3.5 py-2.5 text-sm hover:bg-background transition ${formData.il?.name === p.name ? 'bg-primary/5 text-primary font-semibold' : 'text-text-primary'}`}>
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* İlçe */}
                <div className="relative" onClick={e => e.stopPropagation()}>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">İlçe *</label>
                  <button onClick={() => { if (formData.il) { setShowIlceDropdown(!showIlceDropdown); setShowIlDropdown(false) } }}
                    disabled={!formData.il}
                    className="w-full flex items-center justify-between border border-border rounded-xl px-3.5 py-2.5 text-sm bg-[#fafafa] hover:bg-surface transition disabled:opacity-50 disabled:cursor-not-allowed">
                    <span className={formData.ilce ? 'text-text-primary' : 'text-text-muted'}>{formData.ilce?.name || 'İlçe seçin'}</span>
                    <ChevronDown className="w-4 h-4 text-text-muted" />
                  </button>
                  {showIlceDropdown && formData.il && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-xl shadow-lg z-30 max-h-64 overflow-hidden">
                      <div className="p-2 border-b border-border">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                          <input type="text" value={ilceSearch} onChange={e => setIlceSearch(e.target.value)} placeholder="İlçe ara..."
                            className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-primary" autoFocus />
                        </div>
                      </div>
                      <div className="overflow-y-auto max-h-48">
                        {filteredDistricts.map(d => (
                          <button key={d.name} onClick={() => handleIlceSelect(d)}
                            className={`w-full text-left px-3.5 py-2.5 text-sm hover:bg-background transition ${formData.ilce?.name === d.name ? 'bg-primary/5 text-primary font-semibold' : 'text-text-primary'}`}>
                            {d.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Mahalle */}
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">Mahalle *</label>
                  <input type="text" value={formData.mahalle} onChange={e => handleInputChange('mahalle', e.target.value)}
                    placeholder="Mahalle adını girin" className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-[#fafafa] focus:outline-none focus:border-primary" />
                </div>

                {/* Cadde / Sokak */}
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">Cadde / Sokak *</label>
                  <input type="text" value={formData.cadde} onChange={e => handleInputChange('cadde', e.target.value)}
                    placeholder="Cadde veya sokak adını girin" className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-[#fafafa] focus:outline-none focus:border-primary" />
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
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">Posta Kodu *</label>
                  <input type="text" value={formData.postaKodu}
                    onChange={e => { const val = e.target.value.replace(/\D/g, '').slice(0, 5); handleInputChange('postaKodu', val) }}
                    maxLength={5} placeholder="5 haneli posta kodu"
                    className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-[#fafafa] focus:outline-none focus:border-primary" />
                </div>
              </div>

              {/* Info box */}
              <div className="mt-6 p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800 flex items-start gap-2.5">
                <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Adres bilgileriniz mahalle topluluğuna katılmak için kullanılacaktır.</span>
              </div>

              {/* Submit / Confirm buttons */}
              {!confirmed ? (
                <button onClick={geocodeAddress} disabled={isLoading}
                  className="w-full mt-6 bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 rounded-xl text-sm transition disabled:opacity-50 flex items-center justify-center gap-2">
                  {isLoading ? (<><Loader2 className="w-5 h-5 animate-spin" />Adres doğrulanıyor...</>) : (<><Navigation className="w-5 h-5" />Adresi Haritada Göster</>)}
                </button>
              ) : (
                <div className="mt-6 space-y-3">
                  {/* Address confirmation */}
                  <div className="p-3.5 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800 flex items-start gap-2.5">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Adres haritada görüntülendi</p>
                      <p className="text-xs mt-1">{location?.address}</p>
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
                    {isSaving ? (<><Loader2 className="w-5 h-5 animate-spin" />Kaydediliyor...</>) : (<><Check className="w-5 h-5" />Konumu Onayla</>)}
                  </button>

                  <button onClick={() => { setConfirmed(false); setLocation(null); setMapCenter({ lat: 39.9334, lng: 32.8597 }); setMapZoom(6) }}
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
              <MapComponent
                center={mapCenter}
                zoom={mapZoom}
                markerPosition={location ? { lat: location.lat, lng: location.lng } : null}
                circleRadius={confirmed ? 2000 : undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
