'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapComponentProps {
  center: { lat: number; lng: number }
  zoom: number
  markerPosition?: { lat: number; lng: number } | null
  circleRadius?: number
}

const greenIcon = L.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#00833e" width="36" height="36" stroke="white" stroke-width="1"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
})

export default function MapComponent({ center, zoom, markerPosition, circleRadius }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const circleRef = useRef<L.Circle | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: [center.lat, center.lng],
      zoom: zoom,
      zoomControl: true,
    })

    // Google hybrid satellite tiles (satellite + labels)
    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      attribution: 'Map data &copy; Google',
    }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update center and zoom
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo([center.lat, center.lng], zoom, { duration: 0.8 })
    }
  }, [center, zoom])

  // Update marker and circle
  useEffect(() => {
    if (!mapRef.current) return

    if (markerRef.current) {
      markerRef.current.remove()
      markerRef.current = null
    }
    if (circleRef.current) {
      circleRef.current.remove()
      circleRef.current = null
    }

    if (markerPosition) {
      markerRef.current = L.marker([markerPosition.lat, markerPosition.lng], { icon: greenIcon }).addTo(mapRef.current)

      if (circleRadius) {
        circleRef.current = L.circle([markerPosition.lat, markerPosition.lng], {
          radius: circleRadius,
          fillColor: '#00833e',
          fillOpacity: 0.08,
          color: '#00833e',
          opacity: 0.6,
          weight: 2,
        }).addTo(mapRef.current)
      }
    }
  }, [markerPosition, circleRadius])

  return <div ref={containerRef} className="w-full h-full rounded-xl" style={{ minHeight: '300px' }} />
}
