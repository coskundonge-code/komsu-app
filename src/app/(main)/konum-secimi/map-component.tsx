'use client'

import { useEffect, useRef, useState } from 'react'

const GOOGLE_MAPS_API_KEY = 'AIzaSyChvjDjaC6DH14E1swB3dAKP2AObo5rCT8'

interface GoogleMapProps {
  center: { lat: number; lng: number }
  zoom: number
  markerPosition?: { lat: number; lng: number } | null
  circleRadius?: number
}

declare global {
  interface Window {
    google: any
    initGoogleMap: () => void
  }
}

export default function MapComponent({ center, zoom, markerPosition, circleRadius }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const circleRef = useRef<any>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (window.google?.maps) {
      setLoaded(true)
      return
    }

    window.initGoogleMap = () => setLoaded(true)

    const existing = document.querySelector('script[src*="maps.googleapis.com"]')
    if (!existing) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&language=tr&callback=initGoogleMap`
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }
  }, [])

  useEffect(() => {
    if (!loaded || !mapRef.current) return

    if (!googleMapRef.current) {
      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeId: 'hybrid',
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
      })
    }
  }, [loaded])

  useEffect(() => {
    if (!googleMapRef.current) return
    googleMapRef.current.panTo(center)
    googleMapRef.current.setZoom(zoom)
  }, [center, zoom])

  useEffect(() => {
    if (!googleMapRef.current) return

    if (markerRef.current) {
      markerRef.current.setMap(null)
      markerRef.current = null
    }
    if (circleRef.current) {
      circleRef.current.setMap(null)
      circleRef.current = null
    }

    if (markerPosition) {
      markerRef.current = new window.google.maps.Marker({
        position: markerPosition,
        map: googleMapRef.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#00833e',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 3,
        },
      })

      if (circleRadius) {
        circleRef.current = new window.google.maps.Circle({
          center: markerPosition,
          radius: circleRadius,
          map: googleMapRef.current,
          fillColor: '#00833e',
          fillOpacity: 0.08,
          strokeColor: '#00833e',
          strokeOpacity: 0.6,
          strokeWeight: 2,
        })
      }
    }
  }, [markerPosition, circleRadius, loaded])

  return (
    <div ref={mapRef} className="w-full h-full rounded-xl" style={{ minHeight: '300px' }}>
      {!loaded && (
        <div className="w-full h-full flex items-center justify-center bg-[#1a1a2e] rounded-xl">
          <div className="text-white/60 text-sm">Harita y\u00FCkleniyor...</div>
        </div>
      )}
    </div>
  )
}
