'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapComponentProps {
  center: [number, number]
  zoom: number
  mapType?: 'street' | 'satellite'
  pinLat: number | null
  pinLng: number | null
  onMapClick?: (lat: number, lng: number) => void
  circleRadius?: number
}

const greenIcon = L.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#00833e" width="36" height="36" stroke="white" stroke-width="1"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
})

export default function MapComponent({ center, zoom, mapType, pinLat, pinLng, onMapClick, circleRadius }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const circleRef = useRef<L.Circle | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const tileLayerRef = useRef<L.TileLayer | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: true,
    })

    const tileUrl = mapType === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

    const attribution = mapType === 'satellite'
      ? '\u00a9 Esri'
      : '\u00a9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

    tileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution,
    }).addTo(map)

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng)
      }
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      tileLayerRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo(center, zoom, { duration: 0.8 })
    }
  }, [center, zoom])

  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return

    const tileUrl = mapType === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

    tileLayerRef.current.setUrl(tileUrl)
  }, [mapType])

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

    if (pinLat !== null && pinLng !== null) {
      markerRef.current = L.marker([pinLat, pinLng], { icon: greenIcon }).addTo(mapRef.current)

      if (circleRadius) {
        circleRef.current = L.circle([pinLat, pinLng], {
          radius: circleRadius,
          fillColor: '#00833e',
          fillOpacity: 0.08,
          color: '#00833e',
          opacity: 0.6,
          weight: 2,
        }).addTo(mapRef.current)
      }
    }
  }, [pinLat, pinLng, circleRadius])

  return <div ref={containerRef} className="w-full h-full rounded-xl" style={{ minHeight: '300px' }} />
}
