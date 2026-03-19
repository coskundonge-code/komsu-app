'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Mail, Lock, AlertCircle, Shield, Users, MapPin } from 'lucide-react'
import { loginSchema } from '@/lib/validations/auth'

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
    setEmailError('')
    setPasswordError('')

    const result = loginSchema.safeParse({ email, password })

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      if (errors.email?.[0]) setEmailError(errors.email[0])
      if (errors.password?.[0]) setPasswordError(errors.password[0])
      return false
    }
    return true
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

      if (authError) {
        setError(authError.message === 'Invalid login credentials' ? "E-posta veya şifre hatalı." : authError.message)
        return
      }

      if (rememberMe) {
        localStorage.setItem('mahallem_remember_email', email)
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
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) setError(error.message)
    } catch {
      setError("Google ile giriş başarısız oldu.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Üst Bar */}
      <div className="w-full bg-surface border-b border-border px-6 py-3">
        <div className="max-w-[480px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">K</span>
            </div>
            <span className="text-lg font-bold text-text-primary">Mahallem</span>
          </Link>
          <Link
            href="/kayit"
            className="text-sm font-semibold text-primary hover:text-primary-hover transition"
          >
            Kayıt Ol
          </Link>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[480px]">
          {/* Kart */}
          <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
            {/* Header */}
            <div className="px-8 pt-8 pb-4 text-center">
              <h1 className="text-2xl font-bold text-text-primary mb-1">Tekrar Hoş Geldiniz</h1>
              <p className="text-sm text-text-muted">Mahallenizle bağlantıda kalın</p>
            </div>

            <div className="px-8 pb-8">
              {/* Hata Mesajı */}
              {error && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Google ile Giriş */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 border border-border hover:bg-surface-hover text-text-primary font-medium py-3 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed bg-surface hover:border-[#d0d0d0] active:bg-[#f5f5f5] mb-5"
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

              {/* Ayırıcı */}
              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-surface text-text-muted">ya da e-posta ile</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSignIn} className="space-y-4" noValidate>
                {/* E-posta */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-2">
                    E-posta adresi
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError('') }}
                      placeholder="ornek@email.com"
                      disabled={isLoading}
                      aria-invalid={!!emailError}
                      aria-describedby={emailError ? 'email-error' : undefined}
                      className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm text-text-primary placeholder:text-text-muted bg-[#fafafa] focus:bg-surface focus:outline-none focus:ring-2 transition disabled:bg-background disabled:cursor-not-allowed ${
                        emailError
                          ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                          : 'border-border focus:border-primary focus:ring-primary/20'
                      }`}
                    />
                  </div>
                  {emailError && (
                    <p id="email-error" className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {emailError}
                    </p>
                  )}
                </div>

                {/* Şifre */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-text-primary">
                      Şifre
                    </label>
                    <Link
                      href="/sifre-sifirla"
                      className="text-xs text-primary hover:text-primary-hover font-semibold transition"
                    >
                      Şifremi unuttum
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError('') }}
                      placeholder="••••••••"
                      disabled={isLoading}
                      aria-invalid={!!passwordError}
                      aria-describedby={passwordError ? 'password-error' : undefined}
                      className={`w-full pl-11 pr-12 py-3 border rounded-xl text-sm text-text-primary placeholder:text-text-muted bg-[#fafafa] focus:bg-surface focus:outline-none focus:ring-2 transition disabled:bg-background disabled:cursor-not-allowed ${
                        passwordError
                          ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                          : 'border-border focus:border-primary focus:ring-primary/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition disabled:cursor-not-allowed"
                      aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                    >
                      {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p id="password-error" className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {passwordError}
                    </p>
                  )}
                </div>

                {/* Beni Hatırla */}
                <div className="flex items-center gap-2.5">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-[#00833e]"
                  />
                  <label htmlFor="rememberMe" className="text-sm text-text-muted cursor-pointer">
                    Beni hatırla
                  </label>
                </div>

                {/* Giriş Butonu */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:shadow-sm"
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

              {/* Kayıt linki */}
              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-sm text-text-muted">
                  Hesabınız yok mu?{' '}
                  <Link href="/kayit" className="text-primary hover:text-primary-hover font-semibold transition">
                    Kayıt olun
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Güvenlik rozetleri */}
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Güvenli bağlantı
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              50.000+ komşu
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              81 il
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
