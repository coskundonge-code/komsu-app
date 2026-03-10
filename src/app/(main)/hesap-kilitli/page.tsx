'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Lock, Shield, FileText, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function HesapKilitli() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/giris')
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-[#e0e0e0] overflow-hidden">
          <div className="px-6 py-8 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Lock className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-[#333] mb-2">Hesabınız Kilitlendi</h1>
            <p className="text-[#8f8f8f] text-sm mb-6">
              30 günlük süre içinde e-Devlet üzerinden adres doğrulaması yapılmadığı için hesabınız geçici olarak kilitlenmiştir.
            </p>

            <div className="bg-[#f0f2f5] rounded-xl p-4 text-left space-y-3 mb-6">
              <div className="flex items-start gap-3 text-sm">
                <FileText className="w-5 h-5 text-[#00833e] flex-shrink-0 mt-0.5" />
                <span className="text-[#555]">
                  Hesabınızı açmak için e-Devlet üzerinden adres doğrulama belgenizi yükleyin.
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Shield className="w-5 h-5 text-[#00833e] flex-shrink-0 mt-0.5" />
                <span className="text-[#555]">
                  Doğrulama tamamlandığında hesabınız otomatik olarak aktifleştirilecektir.
                </span>
              </div>
            </div>

            <Link
              href="/adres-dogrulama"
              className="w-full bg-[#00833e] hover:bg-[#006b32] text-white font-semibold py-3.5 rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              e-Devlet ile Doğrula
            </Link>

            <button
              onClick={handleSignOut}
              className="mt-3 w-full border border-[#e0e0e0] hover:bg-[#f9f9f9] text-[#555] font-semibold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
