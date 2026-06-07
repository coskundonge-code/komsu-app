'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, ChevronLeft, Loader2 } from 'lucide-react'

const CONFIRM_TEXT = 'HESABIMI SİL'

export default function HesabiSilPage() {
  const router = useRouter()
  const [confirmInput, setConfirmInput] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canDelete = confirmInput.trim() === CONFIRM_TEXT && acceptedTerms && !isDeleting

  const handleDelete = async () => {
    if (!canDelete) return
    setIsDeleting(true)
    setError(null)
    try {
      const res = await fetch('/api/account/delete', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Hesap silinemedi.')
        return
      }
      // Başarılı: ana sayfaya yönlendir (signed out durumda)
      window.location.href = '/giris?deleted=1'
    } catch {
      setError('Beklenmeyen bir hata oluştu.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/ayarlar"
          className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary mb-6 transition"
        >
          <ChevronLeft size={20} />
          Ayarlara Dön
        </Link>

        <div className="bg-surface border border-red-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-red-50 border-b border-red-200 px-6 py-4 flex items-start gap-3">
            <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h1 className="text-lg font-bold text-red-900">Hesabı Sil</h1>
              <p className="text-sm text-red-700 mt-1">
                Bu işlem <strong>geri alınamaz</strong>. KVKK Madde 11 kapsamında verileriniz tamamen silinir.
              </p>
            </div>
          </div>

          <div className="px-6 py-6 space-y-5">
            <div>
              <h2 className="font-semibold text-text-primary mb-2">Silinecek veriler:</h2>
              <ul className="text-sm text-text-muted list-disc list-inside space-y-1">
                <li>Profil bilgileriniz (ad, e-posta, telefon, adres)</li>
                <li>Tüm gönderileriniz, yorumlarınız ve reaksiyonlarınız</li>
                <li>İlanlarınız, etkinlikleriniz, mesajlarınız</li>
                <li>Yüklediğiniz fotoğraflar ve belgeler</li>
                <li>eDevlet doğrulama kayıtları</li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-900">
              <strong>Not:</strong> Yasal yükümlülükler (ödeme kayıtları, vergi belgeleri) saklanmaya devam eder ve KVKK Madde 7/2 kapsamında öngörülen süre boyunca tutulur.
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-red-600"
                />
                <span className="text-sm text-text-primary">
                  Verilerimin geri alınamaz biçimde silineceğini ve bu işlemden sonra hesabıma erişemeyeceğimi anlıyorum.
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Onaylamak için <code className="px-1.5 py-0.5 bg-gray-100 rounded text-red-700 font-mono">{CONFIRM_TEXT}</code> yazınız:
              </label>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder={CONFIRM_TEXT}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 transition"
                autoComplete="off"
                disabled={isDeleting}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => router.push('/ayarlar')}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-text-primary rounded-lg hover:bg-gray-50 font-medium transition disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                disabled={!canDelete}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition disabled:bg-gray-300 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Siliniyor…
                  </>
                ) : (
                  'Hesabımı Kalıcı Olarak Sil'
                )}
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-text-muted text-center mt-6">
          Silmeden önce bir sorunuz mu var?{' '}
          <Link href="/iletisim" className="text-primary hover:underline">
            Bize ulaşın
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
