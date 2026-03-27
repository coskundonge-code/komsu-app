'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export interface MapMarker {
    lat: number
    lng: number
    title?: string
    description?: string
    color?: 'green' | 'red' | 'blue' | 'orange'
    popup?: string
}

interface LeafletMapProps {
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

function createMarkerIcon(color: string = 'green') {
    const fill = MARKER_COLORS[color] || MARKER_COLORS.green
    return L.divIcon({
          html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${fill}" width="32" height="32" stroke="white" stroke-width="1">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>`,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
    })
}

export default function LeafletMap({
    center,
    zoom = 14,
    markers = [],
    className = 'w-full h-64',
    onClick,
    showUserLocation = false,
    interactive = true,
}: LeafletMapProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
        if (!containerRef.current || mapRef.current) return

                const map = L.map(containerRef.current, {
                        center,
                        zoom,
                        zoomControl: interactive,
                        dragging: interactive,
                        touchZoom: interactive,
                        scrollWheelZoom: interactive,
                        doubleClickZoom: interactive,
                })

                L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
                        maxZoom: 19,
                        subdomains: 'abcd',
                }).addTo(map)

                if (onClick) {
                        map.on('click', (e: L.LeafletMouseEvent) => {
                                  onClick(e.latlng.lat, e.latlng.lng)
                        })
                }

                if (showUserLocation) {
                        map.locate({ setView: false, maxZoom: 16 })
                        map.on('locationfound', (e: L.LocationEvent) => {
                                  L.circleMarker(e.latlng, {
                                              radius: 8,
                                              fillColor: '#4285f4',
                                              color: '#fff',
                                              weight: 2,
                                              opacity: 1,
                                              fillOpacity: 0.9,
                                  }).addTo(map).bindPopup('Konumunuz')

                                       L.circle(e.latlng, {
                                                   radius: e.accuracy / 2,
                                                   fillColor: '#4285f4',
                                                   fillOpacity: 0.1,
                                                   color: '#4285f4',
                                                   weight: 1,
                                       }).addTo(map)
                        })
                }

                mapRef.current = map

                // Small delay to ensure proper rendering
                setTimeout(() => map.invalidateSize(), 100)

                return () => {
                        map.remove()
                        mapRef.current = null
                }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update markers
  useEffect(() => {
        if (!mapRef.current) return

                // Clear existing markers
                mapRef.current.eachLayer((layer) => {
                        if (layer instanceof L.Marker) {
                                  layer.remove()
                        }
                })

                // Add new markers
                markers.forEach((m) => {
                        const icon = createMarkerIcon(m.color || 'green')
                        const marker = L.marker([m.lat, m.lng], { icon }).addTo(mapRef.current!)

                                      if (m.popup || m.title) {
                                                const popupContent = m.popup || `<strong>${m.title}</strong>${m.description ? `<br/><span style="color:#666;font-size:12px">${m.description}</span>` : ''}`
                                                marker.bindPopup(popupContent)
                                      }
                })
  }, [markers])

  // Update center
  useEffect(() => {
        if (mapRef.current) {
                mapRef.current.flyTo(center, zoom, { duration: 0.5 })
        }
  }, [center, zoom])

  return <div ref={containerRef} className={className} />
}
