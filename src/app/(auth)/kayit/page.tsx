'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'

export default function KayitPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!fullName.trim()) {
      setError('Lütfen adınızı girin')
      return
    }
    if (password.length < 8) {
      setError('Şifre en az 8 karakterden oluşmalıdır')
      return
    }
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return
    }
    if (!agreeTerms) {
      setError('Lütfen kullanım koşullarını kabul edin')
      return
    }

    setIsLoading(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        setError(signUpError.message.includes('already registered') ? 'Bu e-posta adresi zaten kayıtlı' : signUpError.message)
        return
      }

      if (!data.user) {
        setError('Kayıt başarısız oldu')
        return
      }

      setSuccess('Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.')
      setTimeout(() => router.push('/giris'), 2000)
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setError('')
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) setError(error.message)
    } catch {
      setError('Google ile kayıt başarısız oldu.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-[22px] font-bold text-[#333]">Hesap Oluşturun</h1>
            <p className="text-sm text-[#8f8f8f] mt-1">Mahallenizin parçası olun</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 border border-[#e0e0e0] hover:bg-[#f0f2f5] text-[#333] font-medium py-2.5 rounded-full text-sm transition disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google ile devam et
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e0e0e0]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-[#8f8f8f]">veya</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-[#333] mb-1.5">
                Ad ve Soyad
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Adınız Soyadınız"
                required
                disabled={isLoading}
                className="w-full px-4 py-2.5 border border-[#e0e0e0] rounded-lg text-sm text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e] transition disabled:bg-[#f0f2f5]"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#333] mb-1.5">
                E-posta adresi
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                required
                disabled={isLoading}
                className="w-full px-4 py-2.5 border border-[#e0e0e0] rounded-lg text-sm text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e] transition disabled:bg-[#f0f2f5]"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#333] mb-1.5">
                Şifre
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 8 karakter"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 pr-10 border border-[#e0e0e0] rounded-lg text-sm text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e] transition disabled:bg-[#f0f2f5]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f8f8f] hover:text-[#404040]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#333] mb-1.5">
                Şifre tekrar
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Şifrenizi tekrar girin"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 pr-10 border border-[#e0e0e0] rounded-lg text-sm text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e] transition disabled:bg-[#f0f2f5]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f8f8f] hover:text-[#404040]"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 mt-0.5 rounded border-[#e0e0e0] text-[#00833e] focus:ring-[#00833e] cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-[#8f8f8f] cursor-pointer">
                <span className="text-[#404040] font-medium">Kullanım Koşullarını</span> ve{' '}
                <span className="text-[#404040] font-medium">Gizlilik Politikasını</span> okudum ve kabul ediyorum
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !agreeTerms}
              className="w-full bg-[#00833e] hover:bg-[#006b32] text-white font-semibold py-2.5 rounded-full text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Kaydolunuyor...' : 'Kaydol'}
            </button>
          </form>
        </div>
      </div>

      {/* Login link */}
      <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-4 text-center">
        <p className="text-sm text-[#404040]">
          Zaten hesabınız var mı?{' '}
          <Link href="/giris" className="text-[#00833e] hover:text-[#006b32] font-semibold">
            Giriş yapın
          </Link>
        </p>
      </div>
    </div>
  )
}
