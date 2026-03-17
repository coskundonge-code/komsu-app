'use client'

import { useEffect, useRef, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapComponentProps {
  center: [number, number]
  zoom: number
  mapType: 'street' | 'satellite'
  pinLat: number | null
  pinLng: number | null
  onMapClick: (lat: number, lng: number) => void
}

// Fix Leaflet default icon issue in Next.js
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Custom green marker for selected location
const greenIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#00833e" width="36" height="36" stroke="white" stroke-width="1">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
})

const TILE_LAYERS = {
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, Earthstar Geographics',
  },
}

export default function MapComponent({ center, zoom, mapType, pinLat, pinLng, onMapClick }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const tileLayerRef = useRef<L.TileLayer | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: true,
    })

    const layer = TILE_LAYERS[mapType]
    tileLayerRef.current = L.tileLayer(layer.url, {
      attribution: layer.attribution,
      maxZoom: 19,
    }).addTo(map)

    map.on('click', (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng)
    })

    mapRef.current = map

    // Place initial pin if exists
    if (pinLat !== null && pinLng !== null) {
      markerRef.current = L.marker([pinLat, pinLng], { icon: greenIcon }).addTo(map)
    }

    return () => {
      map.remove()
      mapRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update center and zoom
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo(center, zoom, { duration: 0.8 })
    }
  }, [center, zoom])

  // Update tile layer when mapType changes
  useEffect(() => {
    if (!mapRef.current) return

    if (tileLayerRef.current) {
      tileLayerRef.current.remove()
    }

    const layer = TILE_LAYERS[mapType]
    tileLayerRef.current = L.tileLayer(layer.url, {
      attribution: layer.attribution,
      maxZoom: 19,
    }).addTo(mapRef.current)
  }, [mapType])

  // Update marker
  useEffect(() => {
    if (!mapRef.current) return

    if (markerRef.current) {
      markerRef.current.remove()
      markerRef.current = null
    }

    if (pinLat !== null && pinLng !== null) {
      markerRef.current = L.marker([pinLat, pinLng], { icon: greenIcon }).addTo(mapRef.current)
    }
  }, [pinLat, pinLng])

  // Update click handler
  useEffect(() => {
    if (!mapRef.current) return

    mapRef.current.off('click')
    mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng)
    })
  }, [onMapClick])

  return <div ref={containerRef} className="w-full h-full" />
}
