'use client'

import { useState } from 'react'
import { QrCode, CheckCircle, XCircle, User, Percent, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const QRScanner = dynamic(() => import('@/components/qr/qr-scanner'), { ssr: false })

interface ScanResult {
  userId: string
  userName: string
  cardNumber: string
  isValid: boolean
  memberSince: string
  totalVisits: number
}

const RECENT_SCANS = [
  { id: 1, name: 'Ahmet K.', time: '14:30', discount: '%10', amount: '₺45.00', saved: '₺4.50' },
  { id: 2, name: 'Fatma D.', time: '13:15', discount: '%10', amount: '₺120.00', saved: '₺12.00' },
  { id: 3, name: 'Mehmet Y.', time: '11:45', discount: '%10', amount: '₺28.00', saved: '₺2.80' },
  { id: 4, name: 'Ayşe T.', time: '10:20', discount: '%10', amount: '₺67.00', saved: '₺6.70' },
]

export default function QRTaraPage() {
  const [scannerOpen, setScannerOpen] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [discountApplied, setDiscountApplied] = useState(false)

  const handleScan = (data: string) => {
    setScanResult({ userId: 'user_123', userName: 'Ahmet Kaya', cardNumber: 'MK-2026-0847', isValid: true, memberSince: '2026-01-15', totalVisits: 12 })
    setScannerOpen(false)
  }

  const handleApplyDiscount = () => {
    setDiscountApplied(true)
    setTimeout(() => { setScanResult(null); setDiscountApplied(false) }, 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface border-b border-border px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/isletme-paneli" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></Link>
          <div><h1 className="text-xl font-bold text-text-primary">QR Kod Tara</h1><p className="text-sm text-text-muted">Müşteri mahalle kartını okutun</p></div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {!scanResult && (
          <div className="bg-surface rounded-2xl border border-border p-8 text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"><QrCode className="w-12 h-12 text-primary" /></div>
            <h2 className="text-lg font-semibold mb-2">Müşteri Kartını Okutun</h2>
            <p className="text-sm text-text-muted mb-6">Müşterinizin Mahalle Kartı QR kodunu taratarak indirim uygulayın</p>
            <button onClick={() => setScannerOpen(true)} className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"><QrCode className="w-5 h-5" />QR Kod Tara</button>
          </div>
        )}
        {scanResult && (
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <div className={`p-4 ${scanResult.isValid ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center gap-3">
                {scanResult.isValid ? <CheckCircle className="w-8 h-8 text-green-600" /> : <XCircle className="w-8 h-8 text-red-600" />}
                <div><h3 className="font-semibold text-lg">{scanResult.isValid ? 'Geçerli Kart' : 'Geçersiz Kart'}</h3><p className="text-sm text-gray-600">Kart No: {scanResult.cardNumber}</p></div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"><User className="w-6 h-6 text-primary" /></div>
                <div><p className="font-medium">{scanResult.userName}</p><p className="text-sm text-text-muted">Üye: {new Date(scanResult.memberSince).toLocaleDateString('tr-TR')} • {scanResult.totalVisits} ziyaret</p></div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2"><Percent className="w-5 h-5 text-green-600" /><span className="font-medium text-green-700">Uygulanacak İndirim</span></div>
                <span className="text-2xl font-bold text-green-600">%10</span>
              </div>
              {discountApplied ? (
                <div className="bg-green-100 rounded-xl p-4 text-center"><CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" /><p className="font-medium text-green-700">İndirim Uygulandı!</p></div>
              ) : (
                <button onClick={handleApplyDiscount} className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90">İndirimi Uygula</button>
              )}
            </div>
          </div>
        )}
        <div className="bg-surface rounded-2xl border border-border">
          <div className="px-4 py-3 border-b border-border"><h3 className="font-semibold flex items-center gap-2"><Clock className="w-4 h-4 text-text-muted" />Bugünkü Taramalar</h3></div>
          <div className="divide-y divide-border">
            {RECENT_SCANS.map(scan => (
              <div key={scan.id} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3"><div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center"><User className="w-4 h-4 text-primary" /></div><div><p className="text-sm font-medium">{scan.name}</p><p className="text-xs text-text-muted">{scan.time} • {scan.discount} indirim</p></div></div>
                <div className="text-right"><p className="text-sm font-medium">{scan.amount}</p><p className="text-xs text-green-600">-{scan.saved} kazandı</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface rounded-xl border border-border p-4 text-center"><p className="text-2xl font-bold text-primary">4</p><p className="text-xs text-text-muted">Tarama</p></div>
          <div className="bg-surface rounded-xl border border-border p-4 text-center"><p className="text-2xl font-bold text-green-600">₺260</p><p className="text-xs text-text-muted">Toplam Satış</p></div>
          <div className="bg-surface rounded-xl border border-border p-4 text-center"><p className="text-2xl font-bold text-orange-500">₺26</p><p className="text-xs text-text-muted">Toplam İndirim</p></div>
        </div>
      </div>
      <QRScanner isOpen={scannerOpen} onClose={() => setScannerOpen(false)} onScan={handleScan} title="Mahalle Kartı Tara" />
    </div>
  )
}
