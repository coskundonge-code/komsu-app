'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, X, Keyboard } from 'lucide-react'

interface QRScannerProps {
  isOpen: boolean
  onClose: () => void
  onScan: (data: string) => void
  title?: string
}

export default function QRScanner({ isOpen, onClose, onScan, title = 'QR Kod Tara' }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [manualInput, setManualInput] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (isOpen && !manualInput) startCamera()
    return () => stopCamera()
  }, [isOpen, manualInput])

  const startCamera = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      // Simulate QR detection after 3 seconds for demo
      setTimeout(() => {
        if (streamRef.current) {
          onScan('MK-2026-0847')
          stopCamera()
        }
      }, 3000)
    } catch (err) {
      setError('Kamera erişimi sağlanamadı. Lütfen kamera izni verin veya manuel giriş kullanın.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const handleManualSubmit = () => {
    if (cardNumber.trim()) {
      onScan(cardNumber.trim())
      setCardNumber('')
      setManualInput(false)
    }
  }

  const handleClose = () => {
    stopCamera()
    setManualInput(false)
    setCardNumber('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="font-semibold">{title}</h2>
          <button onClick={handleClose} className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {manualInput ? (
          <div className="p-6">
            <p className="mb-4 text-sm text-gray-600">Mahalle kartı numarasını manuel olarak girin:</p>
            <input
              type="text"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              placeholder="Örn: MK-2026-0847"
              className="w-full rounded-lg border px-4 py-3 text-center text-lg font-mono"
              autoFocus
            />
            <div className="mt-4 flex gap-3">
              <button onClick={() => setManualInput(false)} className="flex-1 rounded-lg border py-2 text-sm font-medium hover:bg-gray-50">Kamera</button>
              <button onClick={handleManualSubmit} className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90">Onayla</button>
            </div>
          </div>
        ) : (
          <div>
            <div className="relative aspect-square bg-black">
              <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
              {/* Scan overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-48 w-48 rounded-2xl border-2 border-white/50" />
              </div>
              {/* Scanning indicator */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="rounded-full bg-black/50 px-4 py-1 text-sm text-white">QR kodu çerçeve içine hizalayın...</span>
              </div>
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 p-6">
                  <div className="text-center">
                    <Camera className="mx-auto mb-3 h-10 w-10 text-gray-400" />
                    <p className="text-sm text-gray-300">{error}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <button onClick={() => { stopCamera(); setManualInput(true) }} className="flex w-full items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium hover:bg-gray-50">
                <Keyboard className="h-4 w-4" /> Manuel Giriş
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
