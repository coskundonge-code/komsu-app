'use client'

// Doğrulama Kapısı (sahip kararı 2026-06-11): adres doğrulamadan ETKİLEŞİM yok.
// Görüntüleme serbest; gönderi/yorum/beğeni/etkinlik/ilan/askıda/yardım/mesaj
// gibi her yazma işlemi e-Devlet adres doğrulaması ister. Asıl zorlamayı sunucu
// (RLS + RPC) yapar; bu bileşen kullanıcıya kibar yolu gösterir.
//
// Kullanım:
//   const { checkVerified, gateModal } = useVerificationGate()
//   const handleX = async () => { if (!(await checkVerified())) return; ... }
//   return <>{...}{gateModal}</>

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { ShieldCheck, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

/** Sunucu kapısından dönen "doğrulama gerekli" hatasını tanır (RPC P0002 / RLS 42501). */
export function isVerificationError(error: unknown): boolean {
  const e = error as { message?: string; code?: string } | null
  if (!e) return false
  return (
    e.code === 'P0002' ||
    (e.message || '').includes('VERIFICATION_REQUIRED') ||
    // RLS ihlali (yeni satır politikaya takıldı) — doğrulanmamış kullanıcıda en
    // olası sebep kapıdır; kibar modala yönlendirmek ham hatadan iyidir.
    e.code === '42501'
  )
}

export function VerificationRequiredModal({
  open,
  onClose,
  action = 'Bu işlemi yapabilmek',
}: {
  open: boolean
  onClose: () => void
  action?: string
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-surface rounded-2xl shadow-lg max-w-sm w-full p-6 relative">
        <button
          onClick={onClose}
          aria-label="Kapat"
          className="absolute right-4 top-4 text-text-muted hover:text-text-primary transition-colors"
        >
          <X size={22} />
        </button>

        <div className="mb-5">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-text-primary mb-2">Adres Doğrulaması Gerekli</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            {action} için adresinizi e-Devlet belgesiyle doğrulamanız gerekiyor —
            yaklaşık 2 dakika sürer. Doğrulanmış komşular mahallenin tüm
            özelliklerini kullanabilir; gezinmeye doğrulamadan da devam edebilirsiniz.
          </p>
        </div>

        <div className="space-y-2">
          <Link
            href="/adres-dogrulama"
            className="w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors text-center block"
          >
            Şimdi Doğrula (~2 dk)
          </Link>
          <button
            onClick={onClose}
            className="w-full px-4 py-3 border-2 border-border text-text-secondary rounded-lg font-semibold hover:bg-surface-active transition-colors"
          >
            Daha Sonra
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Etkileşim kapısı hook'u. `checkVerified()` sunucudaki tek doğruluk kaynağını
 * (is_verified_neighbor RPC — SECURITY DEFINER) sorar; doğrulanmamışsa modalı
 * açar ve false döner. `openGate()` sunucu hatası sonrası modalı elle açar.
 */
export function useVerificationGate(action?: string) {
  const [open, setOpen] = useState(false)

  const checkVerified = useCallback(async (): Promise<boolean> => {
    try {
      const supabase = createClient() as any
      const { data, error } = await supabase.rpc('is_verified_neighbor')
      if (!error && data === true) return true
    } catch {
      // ağ hatasında da kapıyı göster — sunucu zaten reddedecektir
    }
    setOpen(true)
    return false
  }, [])

  const openGate = useCallback(() => setOpen(true), [])

  const gateModal = (
    <VerificationRequiredModal open={open} onClose={() => setOpen(false)} action={action} />
  )

  return { checkVerified, openGate, gateModal }
}
