'use client'

import { useEffect, useRef, useState } from 'react'

export interface MapMarker {
  lat: number
  lng: number
  title?: string
  description?: string
  color?: 'green' | 'red' | 'blue' | 'orange'
  popup?: string
}

interface GoogleMapProps {
  center: [number, number]
  zoom?: number
  markers?: MapMarker[]
  className?: string
  onClick?: (lat: number, lng: number) => void
  showUserLocation?: boolean
  interactive?: boolean
}

const MARKER_COLORS: Record<string, string> = {
  green: '#00833e',
  red: '#e74c3c',
  blue: '#3498db',
  orange: '#f39c12',
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
        if ((window as any).google?.maps) {
          clearInterval(check)
          resolve()
        }
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

export default function GoogleMap({
  center,
  zoom = 14,
  markers = [],
  className = 'w-full h-64',
  onClick,
  showUserLocation = false,
  interactive = true,
}: GoogleMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!MAPS_API_KEY) {
      setError('Google Maps API anahtari bulunamadi. Lutfen NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ayarlayin.')
      return
    }
    loadGoogleMapsScript()
      .then(() => setLoaded(true))
      .catch(() => setError('Google Maps yuklenemedi'))
  }, [])

  useEffect(() => {
    if (!loaded || !containerRef.current || mapRef.current) return

    const map = new google.maps.Map(containerRef.current, {
      center: { lat: center[0], lng: center[1] },
      zoom,
      disableDefaultUI: !interactive,
      zoomControl: interactive,
      scrollwheel: interactive,
      draggable: interactive,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
      ],
    })

    infoWindowRef.current = new google.maps.InfoWindow()

    if (onClick) {
      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) onClick(e.latLng.lat(), e.latLng.lng())
      })
    }

    if (showUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        new google.maps.Marker({
          position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#4285f4',
            fillOpacity: 0.9,
            strokeColor: '#fff',
            strokeWeight: 2,
          },
          title: 'Konumunuz',
        })
      })
    }

    mapRef.current = map
  }, [loaded])

  useEffect(() => {
    if (!mapRef.current || !loaded) return
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []

    markers.forEach((m) => {
      const color = MARKER_COLORS[m.color || 'green']
      const marker = new google.maps.Marker({
        position: { lat: m.lat, lng: m.lng },
        map: mapRef.current!,
        title: m.title,
        icon: {
          path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
          fillColor: color,
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 1,
          scale: 1.5,
          anchor: new google.maps.Point(12, 22),
        },
      })

      if (m.popup || m.title) {
        const content = m.popup || '<strong>' + (m.title || '') + '</strong>' + (m.description ? '<br/><span style="color:#666;font-size:12px">' + m.description + '</span>' : '')
        marker.addListener('click', () => {
          infoWindowRef.current?.setContent(content)
          infoWindowRef.current?.open(mapRef.current!, marker)
        })
      }

      markersRef.current.push(marker)
    })
  }, [markers, loaded])

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat: center[0], lng: center[1] })
      if (zoom) mapRef.current.setZoom(zoom)
    }
  }, [center, zoom])

  if (error) {
    return (
      <div className={className + ' flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200'}>
        <p className="text-sm text-red-500 text-center px-4">{error}</p>
      </div>
    )
  }

  if (!loaded) {
    return (
      <div className={className + ' flex items-center justify-center bg-gray-100 rounded-lg animate-pulse'}>
        <p className="text-sm text-gray-400">Harita yukleniyor...</p>
      </div>
    )
  }

  return <div ref={containerRef} className={className} />
}
