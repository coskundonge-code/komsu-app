'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function GirisPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const supabase = createClient()

  const validateForm = () => {
    let isValid = true
    setEmailError('')
    setPasswordError('')

    if (!email.trim()) {
      setEmailError("E-posta adresinizi girin")
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Geçerli bir e-posta adresi girin")
      isValid = false
    }

    if (!password) {
      setPasswordError("Şifrenizi girin")
      isValid = false
    } else if (password.length < 6) {
      setPasswordError("Şifre en az 6 karakter olmalıdır")
      isValid = false
    }

    return isValid
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message === 'Invalid login credentials' ? "E-posta veya şifre hatalı." : authError.message)
        return
      }

      if (rememberMe) {
        localStorage.setItem('komsuapp_remember_email', email)
      }

      router.push('/')
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      }
    } catch {
      setError("Google ile giriş başarısız oldu.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand Section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#00833e] to-[#006b32] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#00a84d] rounded-full opacity-10" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#004d1f] rounded-full opacity-10" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 py-12">
          {/* Logo and Brand Name */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
              <span className="text-3xl font-bold text-[#00833e]">K</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">KomşuApp</h2>
            <p className="text-green-50 text-lg">Mahalle Bağlantısı</p>
          </div>

          {/* Feature bullets */}
          <div className="space-y-6 w-full max-w-sm">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Komşularınızla Bağlanın</h3>
                <p className="text-green-50 text-sm mt-1">Mahallenizi keşfedin ve bağlantı kurun</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Hızlı Yardımlaşma</h3>
                <p className="text-green-50 text-sm mt-1">İhtiyaçlarınızda anında destek alın</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Güvenli & Özel</h3>
                <p className="text-green-50 text-sm mt-1">Verileriniz tamamen korumalıdır</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center py-12 px-6 sm:px-8 lg:px-12 bg-[#f8fafb]">
        <div className="w-full max-w-sm mx-auto">
          {/* Logo on mobile */}
          <div className="md:hidden text-center mb-8">
            <div className="w-14 h-14 bg-[#00833e] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <span className="text-2xl font-bold text-white">K</span>
            </div>
            <h1 className="text-2xl font-bold text-[#333]">KomşuApp</h1>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#333]">Giriş Yap</h2>
            <p className="text-[#8f8f8f] text-sm mt-2">Mahallenizle bağlantıda kalın</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3 animate-pulse">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4 mb-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#333] mb-2.5">
                E-posta adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8f8f8f]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (emailError) setEmailError('')
                  }}
                  placeholder="ornek@email.com"
                  disabled={isLoading}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl text-sm text-[#333] placeholder-[#8f8f8f] bg-white focus:outline-none focus:ring-2 transition disabled:bg-[#f0f2f5] disabled:cursor-not-allowed ${
                    emailError
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                      : 'border-[#e0e0e0] focus:border-[#00833e] focus:ring-[#00833e]/20'
                  }`}
                />
              </div>
              {emailError && (
                <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label htmlFor="password" className="block text-sm font-semibold text-[#333]">
                  Şifre
                </label>
                <Link
                  href="/sifre-sifirla"
                  className="text-xs text-[#00833e] hover:text-[#006b32] font-semibold transition"
                >
                  Şifremi unuttum
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8f8f8f]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (passwordError) setPasswordError('')
                  }}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className={`w-full pl-12 pr-12 py-3 border rounded-xl text-sm text-[#333] placeholder-[#8f8f8f] bg-white focus:outline-none focus:ring-2 transition disabled:bg-[#f0f2f5] disabled:cursor-not-allowed ${
                    passwordError
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                      : 'border-[#e0e0e0] focus:border-[#00833e] focus:ring-[#00833e]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8f8f8f] hover:text-[#404040] transition disabled:cursor-not-allowed"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {passwordError}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2.5 pt-1">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 rounded border-[#e0e0e0] text-[#00833e] focus:ring-[#00833e] cursor-pointer accent-[#00833e]"
              />
              <label htmlFor="rememberMe" className="text-sm text-[#8f8f8f] cursor-pointer">
                Beni hatırla
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00833e] hover:bg-[#006b32] text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-sm hover:shadow-md active:shadow-sm"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Giriş yapılıyor...
                </span>
              ) : (
                "Giriş Yap"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e0e0e0]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[#f8fafb] text-[#8f8f8f]">ya da</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 border border-[#e0e0e0] hover:bg-[#f9f9f9] text-[#333] font-medium py-3 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:border-[#d0d0d0] active:bg-[#f5f5f5]"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Bağlanıyor...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Google ile giriş yap</span>
              </>
            )}
          </button>

          {/* Sign up link */}
          <div className="mt-8 pt-8 border-t border-[#e0e0e0] text-center">
            <p className="text-sm text-[#8f8f8f]">
              Hesabınız yok mu?{' '}
              <Link href="/kayit" className="text-[#00833e] hover:text-[#006b32] font-semibold transition">
                Kayıt olun
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>

  )
}
