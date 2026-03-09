'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

function SifreSifirlaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<'request' | 'reset'>('request')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  // Check if user is coming from reset email link
  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'recovery' && step === 'request') {
      setStep('reset')
    }
  }, [searchParams, step])

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/sifre-sifirla?type=recovery`,
      })

      if (resetError) {
        setError(resetError.message)
        return
      }

      setSuccess('Şifre sıfırlama bağlantısı e-mail adresinize gönderilmiştir.')
      setEmail('')
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password.length < 8) {
      setError('Şifre en az 8 karakterden oluşmalıdır')
      return
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return
    }

    setIsLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        setError(updateError.message)
        return
      }

      setSuccess('Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...')
      setTimeout(() => {
        router.push('/giris')
      }, 2000)
    } catch (err) {
      setError('Şifre güncelleme başarısız oldu.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">K</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {step === 'request' ? 'Şifre Sıfırla' : 'Yeni Şifre Belirle'}
        </h1>
        <p className="text-gray-600 text-sm">
          {step === 'request'
            ? 'E-mail adresinizi girin'
            : 'Yeni şifrenizi oluşturun'}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* Step 1: Request Reset */}
      {step === 'request' && (
        <form onSubmit={handleRequestReset} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-mail Adresi
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                required
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              E-mail adresinize şifre sıfırlama bağlantısı göndereceğiz.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
          </button>
        </form>
      )}

      {/* Step 2: Reset Password */}
      {step === 'reset' && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Yeni Şifre
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">En az 8 karakter olmalıdır</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Şifre Tekrar
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Güncelleniyor...' : 'Şifre Güncelle'}
          </button>
        </form>
      )}

      {/* Back to Login */}
      <Link
        href="/giris"
        className="flex items-center justify-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Giriş Sayfasına Dön
      </Link>
    </div>
  )
}

export default function SifreSifirlaPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    }>
      <SifreSifirlaContent />
    </Suspense>
  )
}
