'use client'

import { useState } from 'react'
import { X, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (paymentId: string) => void
  paymentType: 'mahalle_card' | 'listing_fee' | 'business_membership' | 'business_yearly'
  amount: number
  title: string
  description: string
  userId: string
  userEmail: string
  userName: string
}

export default function PaymentModal({
  isOpen, onClose, onSuccess, paymentType, amount, title, description, userId, userEmail, userName,
}: PaymentModalProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [iframeUrl, setIframeUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const handlePayment = async () => {
    setStatus('loading')
    setErrorMessage('')
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentType, amount, userEmail, userName, userId }),
      })
      const data = await response.json()
      if (data.success) {
        if (data.mode === 'simulation') {
          setStatus('success')
          setTimeout(() => onSuccess(data.paymentId), 1500)
        } else if (data.iframeUrl) {
          setIframeUrl(data.iframeUrl)
        }
      } else {
        setStatus('error')
        setErrorMessage(data.error || 'Ödeme işlemi başarısız')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Bağlantı hatası. Lütfen tekrar deneyin.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100" aria-label="Kapat">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          {iframeUrl ? (
            <iframe src={iframeUrl} className="h-[450px] w-full rounded-lg border" title="Ödeme" />
          ) : status === 'success' ? (
            <div className="flex flex-col items-center py-8">
              <div className="mb-4 rounded-full bg-green-100 p-3"><CheckCircle className="h-10 w-10 text-green-600" /></div>
              <h3 className="mb-2 text-xl font-semibold text-green-700">Ödeme Başarılı!</h3>
              <p className="text-center text-sm text-gray-500">{description}</p>
            </div>
          ) : status === 'error' ? (
            <div className="flex flex-col items-center py-8">
              <div className="mb-4 rounded-full bg-red-100 p-3"><AlertCircle className="h-10 w-10 text-red-600" /></div>
              <h3 className="mb-2 text-xl font-semibold text-red-700">Ödeme Başarısız</h3>
              <p className="mb-4 text-center text-sm text-gray-500">{errorMessage}</p>
              <button onClick={() => { setStatus('idle'); setErrorMessage('') }} className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700">Tekrar Dene</button>
            </div>
          ) : (
            <div>
              <div className="mb-6 rounded-xl bg-gray-50 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2"><CreditCard className="h-5 w-5 text-primary" /></div>
                  <div><p className="font-medium text-gray-900">{title}</p><p className="text-sm text-gray-500">{description}</p></div>
                </div>
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Toplam Tutar</span>
                    <span className="text-2xl font-bold text-primary">{amount.toFixed(2)} ₺</span>
                  </div>
                </div>
              </div>
              <div className="mb-4 rounded-lg bg-blue-50 p-3">
                <p className="text-xs text-blue-700">Ödemeniz PayTR güvenli ödeme altyapısı ile işlenecektir. Kredi kartı bilgileriniz güvendedir.</p>
              </div>
              <button onClick={handlePayment} disabled={status === 'loading'} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-medium text-white hover:bg-primary/90 disabled:opacity-50">
                {status === 'loading' ? (<><Loader2 className="h-5 w-5 animate-spin" />İşleniyor...</>) : (<><CreditCard className="h-5 w-5" />{amount.toFixed(2)} ₺ Öde</>)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
