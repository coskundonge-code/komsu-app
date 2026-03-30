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
  onMarkerDragEnd?: (lat: number, lng: number) => void
  circleRadius?: number
}

const greenIcon = L.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#00833e" width="36" height="36" stroke="white" stroke-width="1"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
})

export default function MapComponent({ center, zoom, mapType, pinLat, pinLng, onMapClick, onMarkerDragEnd, circleRadius }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const circleRef = useRef<L.Circle | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const tileLayerRef = useRef<L.TileLayer | null>(null)

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const safeCenter: [number, number] = (center && !isNaN(center[0]) && !isNaN(center[1])) ? center : [39.9334, 32.8597]
    const safeZoom = (!isNaN(zoom) && isFinite(zoom)) ? zoom : 6

    const map = L.map(containerRef.current, {
      center: safeCenter,
      zoom: safeZoom,
      zoomControl: true,
    })

    // Add tile layer based on mapType
    const tileUrl = mapType === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'

    const attribution = mapType === 'satellite'
      ? '&copy; Esri'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'

    tileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution,
    }).addTo(map)

    // Handle map clicks
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

  // Update center and zoom
  useEffect(() => {
    if (mapRef.current && center && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1]) && isFinite(center[0]) && isFinite(center[1])) {
      const safeZoom = (!isNaN(zoom) && isFinite(zoom) && zoom > 0) ? zoom : 6
      try {
        // Check if container is visible (has dimensions) before flyTo
        const container = mapRef.current.getContainer()
        if (container && container.offsetWidth > 0 && container.offsetHeight > 0) {
          mapRef.current.invalidateSize()
          mapRef.current.flyTo(center, safeZoom, { duration: 0.8 })
        } else {
          // Container hidden - just setView without animation
          mapRef.current.setView(center, safeZoom, { animate: false })
        }
      } catch (e) {
        // Fallback: silently set view without animation
        try {
          mapRef.current.setView(center, safeZoom, { animate: false })
        } catch (_) {
          // ignore
        }
      }
    }
  }, [center, zoom])

  // Update tile layer when mapType changes
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return

    const tileUrl = mapType === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'

    tileLayerRef.current.setUrl(tileUrl)
  }, [mapType])

  // Update marker and circle when pin changes
  useEffect(() => {
    if (!mapRef.current) return

    // Remove old marker
    if (markerRef.current) {
      markerRef.current.remove()
      markerRef.current = null
    }
    // Remove old circle
    if (circleRef.current) {
      circleRef.current.remove()
      circleRef.current = null
    }

    if (pinLat !== null && pinLng !== null && !isNaN(pinLat) && !isNaN(pinLng) && isFinite(pinLat) && isFinite(pinLng)) {
      try {
        markerRef.current = L.marker([pinLat, pinLng], { icon: greenIcon, draggable: true }).addTo(mapRef.current)

        // Fire callback when marker drag ends
        markerRef.current.on('dragend', () => {
          const pos = markerRef.current?.getLatLng()
          if (pos && onMarkerDragEnd) {
            onMarkerDragEnd(pos.lat, pos.lng)
          }
        })

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
      } catch (e) {
        console.warn('Marker error:', e)
      }
    }
  }, [pinLat, pinLng, circleRadius])

  return <div ref={containerRef} className="w-full h-full rounded-xl" style={{ minHeight: '300px' }} />
}
