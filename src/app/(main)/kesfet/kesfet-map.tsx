'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { createClient } from '@/lib/supabase/client'

interface MapUser {
  id: string
  full_name: string | null
  location_lat: number
  location_lng: number
  gender: string | null
  avatar_url: string | null
}

interface MapBusiness {
  id: string
  name: string
  category_name: string | null
  lat: number
  lng: number
  address: string | null
  rating_avg: number | null
}

// Common Turkish female names for gender inference
const FEMALE_NAMES = new Set([
  'ayşe','fatma','emine','hatice','zeynep','elif','meryem','şerife','zehra','sultan',
  'hanife','merve','havva','zeliha','hacer','hürü','pakize','gülsüm','naciye','nuriye',
  'gül','esra','büşra','betül','seda','derya','dilek','özlem','pınar','hülya',
  'sevgi','selma','melek','leyla','münevver','cemile','serpil','sibel','filiz','songül',
  'aynur','nuray','serap','nebahat','gülten','hediye','yasemin','tülay','canan','aysel',
  'arzu','ebru','aysun','nur','nihal','nalan','burcu','deniz','berna','bahar','ilknur',
  'ece','sinem','gamze','irem','defne','cansu','dilara','beril','ada','nehir','su',
  'asya','nisa','hiranur','ecrin','azra','lina','asel','elisa',
])

const MALE_NAMES = new Set([
  'mehmet','mustafa','ahmet','ali','hüseyin','hasan','ibrahim','ismail','osman','yusuf',
  'murat','ömer','ramazan','halil','süleyman','bekir','kemal','recep','cemal','kadir',
  'fatih','emre','burak','serkan','cem','baran','onur','enes','eren','can',
  'mert','yusuf','kaan','arda','emir','yiğit','kerem','berat','alperen','eymen',
  'ömerfaruk','muhammet','furkan','oğuz','umut','taha','yasin','hamza','bilal','adem',
  'coskun','coşkun','selim','erkan','volkan','tolga','sinan','barış','uğur','gökhan',
])

function inferGender(name: string | null): 'male' | 'female' | 'unknown' {
  if (!name) return 'unknown'
  const firstName = name.trim().toLowerCase().split(/\s+/)[0]
  if (FEMALE_NAMES.has(firstName)) return 'female'
  if (MALE_NAMES.has(firstName)) return 'male'
  return 'unknown'
}

// SVG icons for markers
function createMaleIcon() {
  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24C32 7.16 24.84 0 16 0z" fill="#3B82F6" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="12" r="4" fill="white"/>
      <path d="M10 22c0-3.31 2.69-6 6-6s6 2.69 6 6" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    className: '',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  })
}

function createFemaleIcon() {
  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24C32 7.16 24.84 0 16 0z" fill="#EC4899" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="12" r="4" fill="white"/>
      <path d="M10 22c0-3.31 2.69-6 6-6s6 2.69 6 6" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    className: '',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  })
}

function createUnknownUserIcon() {
  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24C32 7.16 24.84 0 16 0z" fill="#8B5CF6" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="12" r="4" fill="white"/>
      <path d="M10 22c0-3.31 2.69-6 6-6s6 2.69 6 6" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    className: '',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  })
}

function createBusinessIcon() {
  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24C32 7.16 24.84 0 16 0z" fill="#F59E0B" stroke="white" stroke-width="2"/>
      <rect x="9" y="10" width="14" height="12" rx="1" fill="none" stroke="white" stroke-width="1.5"/>
      <path d="M9 14h14" stroke="white" stroke-width="1.5"/>
      <rect x="14" y="17" width="4" height="5" fill="white" rx="0.5"/>
    </svg>`,
    className: '',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  })
}

function createMyLocationIcon() {
  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <path d="M18 0C9.16 0 2 7.16 2 16c0 12 16 26 16 26s16-14 16-26C34 7.16 26.84 0 18 0z" fill="#00833e" stroke="white" stroke-width="2.5"/>
      <circle cx="18" cy="14" r="6" fill="white"/>
      <circle cx="18" cy="14" r="3" fill="#00833e"/>
    </svg>`,
    className: '',
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
  })
}

const maleIcon = createMaleIcon()
const femaleIcon = createFemaleIcon()
const unknownIcon = createUnknownUserIcon()
const businessIcon = createBusinessIcon()
const myLocationIcon = createMyLocationIcon()

export default function KesfetMap() {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const supabase = createClient()

    const initMap = async () => {
      // Get current user's location
      const { data: { session } } = await supabase.auth.getSession()
      let myLat = 41.0035
      let myLng = 28.8817

      if (session?.user) {
        const { data: myProfile } = await supabase
          .from('profiles')
          .select('location_lat, location_lng')
          .eq('id', session.user.id)
          .single()

        if (myProfile?.location_lat && myProfile?.location_lng) {
          myLat = myProfile.location_lat
          myLng = myProfile.location_lng
        }
      }

      // Create map
      if (!containerRef.current) return
      const map = L.map(containerRef.current, {
        center: [myLat, myLng],
        zoom: 15,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      }).addTo(map)

      mapRef.current = map

      // Add "my location" marker
      const myMarker = L.marker([myLat, myLng], { icon: myLocationIcon, zIndexOffset: 1000 }).addTo(map)
      myMarker.bindPopup('<div style="text-align:center;font-weight:600;color:#00833e;">Benim Konumum</div>')

      // Fetch all users with location
      const { data: users } = await supabase
        .from('profiles')
        .select('id, full_name, location_lat, location_lng, gender, avatar_url')
        .not('location_lat', 'is', null)
        .not('location_lng', 'is', null)

      const mapUsers: MapUser[] = (users || []).filter(
        (u: any) => u.id !== session?.user?.id && u.location_lat && u.location_lng
      )

      // Fetch businesses
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id, name, lat, lng, address, rating_avg, business_categories(name)')
        .not('lat', 'is', null)
        .not('lng', 'is', null)

      const mapBusinesses: MapBusiness[] = (businesses || []).map((b: any) => ({
        id: b.id,
        name: b.name,
        lat: b.lat,
        lng: b.lng,
        address: b.address,
        rating_avg: b.rating_avg,
        category_name: b.business_categories?.name || null,
      }))

      // Add user markers
      mapUsers.forEach((u) => {
        const gender = u.gender || inferGender(u.full_name)
        const icon = gender === 'female' ? femaleIcon : gender === 'male' ? maleIcon : unknownIcon
        const displayName = u.full_name || 'Komşu'
        const genderLabel = gender === 'female' ? 'Bayan' : gender === 'male' ? 'Bay' : 'Komşu'

        const marker = L.marker([u.location_lat, u.location_lng], { icon }).addTo(map)
        marker.bindPopup(`
          <div style="min-width:140px;">
            <div style="font-weight:600;font-size:14px;margin-bottom:4px;">${displayName}</div>
            <div style="color:#6B7280;font-size:12px;">${genderLabel}</div>
          </div>
        `)
      })

      // Add business markers
      mapBusinesses.forEach((b) => {
        const marker = L.marker([b.lat, b.lng], { icon: businessIcon }).addTo(map)
        const stars = b.rating_avg ? `<div style="color:#F59E0B;font-size:12px;">★ ${Number(b.rating_avg).toFixed(1)}</div>` : ''
        marker.bindPopup(`
          <div style="min-width:160px;">
            <div style="font-weight:600;font-size:14px;margin-bottom:2px;">${b.name}</div>
            ${b.category_name ? `<div style="color:#6B7280;font-size:12px;margin-bottom:2px;">${b.category_name}</div>` : ''}
            ${b.address ? `<div style="color:#9CA3AF;font-size:11px;margin-bottom:2px;">${b.address}</div>` : ''}
            ${stars}
          </div>
        `)
      })

      // NOT (2026-06-07): Burada eskiden gerçek komşu sayısı 5'in, işletme sayısı
      // 3'ün altındaysa haritaya rastgele koordinatlı SAHTE komşular (demoNeighbors)
      // ve SAHTE işletmeler (demoBusinesses) ekleniyor, sayaçlar da 10/5'e
      // yuvarlanıyordu. Gerçek kullanıcıya uydurma kişi/işletme göstermek dürüstlük
      // ihlaliydi; tamamı kaldırıldı. Harita yalnızca gerçek profilleri ve gerçek
      // işletmeleri gösterir; veri yoksa yalnızca "Benim Konumum" görünür.
      // Bkz. TECH_DEBT #12.
      setLoading(false)
    }

    initMap()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-500">Harita yükleniyor...</p>
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full rounded-lg" style={{ minHeight: '380px' }} />
      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 text-xs space-y-1.5">
        <div className="font-semibold text-gray-700 mb-1">Harita</div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-[#3B82F6]" />
          <span className="text-gray-600">Bay Komşu</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-[#EC4899]" />
          <span className="text-gray-600">Bayan Komşu</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-[#F59E0B]" />
          <span className="text-gray-600">İşletme</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-[#00833e]" />
          <span className="text-gray-600">Benim Konumum</span>
        </div>
      </div>
    </div>
  )
}
