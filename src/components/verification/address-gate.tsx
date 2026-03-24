'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldAlert, MapPin, X } from 'lucide-react'

interface AddressGateProps {
  isVerified: boolean
  children: React.ReactNode
  action?: string
}

export default function AddressGate({ isVerified, children, action }: AddressGateProps) {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  if (isVerified) {
    return <>{children}</>
  }

  return (
    <>
      <div onClick={() => setShowModal(true)} className="cursor-pointer">
        {children}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-red-600">Adres Doğrulama Gerekli</h2>
              <button onClick={() => setShowModal(false)} className="rounded-full p-1 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-red-100 p-4">
                  <ShieldAlert className="h-10 w-10 text-red-500" />
                </div>
              </div>
              <p className="mb-2 text-center text-sm text-gray-700">
                {action ? `"${action}" işlemi` : 'Bu işlem'} için adres doğrulamanızı tamamlamanız gerekiyor.
              </p>
              <p className="mb-6 text-center text-xs text-gray-500">
                e-Devlet üzerinden adres doğrulaması yaparak 7 gün içinde hesabınızı aktifleştirin.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border py-2 text-sm font-medium hover:bg-gray-50"
                >
                  Kapat
                </button>
                <button
                  onClick={() => router.push('/kayit/adres-dogrulama')}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                  <MapPin className="h-4 w-4" />
                  Doğrula
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
