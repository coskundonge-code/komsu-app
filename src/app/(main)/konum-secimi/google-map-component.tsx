'use client'

import { useEffect, useRef, useState } from 'react'

interface GoogleMapComponentProps {
  center: [number, number]
  zoom: number
  mapType: 'street' | 'satellite'
  pinLat: number | null
  pinLng: number | null
  onMapClick: (lat: number, lng: number) => void
}

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

function loadGoogleMapsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && (window as any).google?.maps) {
      resolve()
      return
    }
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      const check = setInterval(() => {
        if ((window as any).google?.maps) { clearInterval(check); resolve() }
      }, 100)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + MAPS_API_KEY + '&libraries=places&language=tr&region=TR'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Google Maps yuklenemedi'))
    document.head.appendChild(script)
  })
}

const GREEN_MARKER_ICON = {
  path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  fillColor: '#00833e',
  fillOpacity: 1,
  strokeColor: '#fff',
  strokeWeight: 1,
  scale: 1.8,
  anchor: null as any,
}

export default function GoogleMapComponent({ center, zoom, mapType, pinLat, pinLng, onMapClick }: GoogleMapComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!MAPS_API_KEY) return
    loadGoogleMapsScript().then(() => setLoaded(true)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!loaded || !containerRef.current || mapRef.current) return

    GREEN_MARKER_ICON.anchor = new google.maps.Point(12, 22)

    const map = new google.maps.Map(containerRef.current, {
      center: { lat: center[0], lng: center[1] },
      zoom,
      mapTypeId: mapType === 'satellite' ? 'satellite' : 'roadmap',
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })

    map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) onMapClick(e.latLng.lat(), e.latLng.lng())
    })

    if (pinLat !== null && pinLng !== null) {
      markerRef.current = new google.maps.Marker({
        position: { lat: pinLat, lng: pinLng },
        map,
        icon: GREEN_MARKER_ICON,
      })
    }

    mapRef.current = map
  }, [loaded])

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat: center[0], lng: center[1] })
      mapRef.current.setZoom(zoom)
    }
  }, [center, zoom])

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setMapTypeId(mapType === 'satellite' ? 'satellite' : 'roadmap')
    }
  }, [mapType])

  useEffect(() => {
    if (!mapRef.current) return
    if (markerRef.current) {
      markerRef.current.setMap(null)
      markerRef.current = null
    }
    if (pinLat !== null && pinLng !== null) {
      markerRef.current = new google.maps.Marker({
        position: { lat: pinLat, lng: pinLng },
        map: mapRef.current,
        icon: GREEN_MARKER_ICON,
      })
    }
  }, [pinLat, pinLng])

  useEffect(() => {
    if (!mapRef.current) return
    google.maps.event.clearListeners(mapRef.current, 'click')
    mapRef.current.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) onMapClick(e.latLng.lat(), e.latLng.lng())
    })
  }, [onMapClick])

  if (!loaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 animate-pulse">
        <p className="text-sm text-gray-400">Harita yukleniyor...</p>
      </div>
    )
  }

  return <div ref={containerRef} className="w-full h-full" />
}
