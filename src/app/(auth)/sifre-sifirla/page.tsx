'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, ArrowLeft, Eye, EyeOff, CheckCircle2, Home } from 'lucide-react'

function SifreSifirlaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

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
    setIsLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/sifre-sifirla?type=recovery`,
      })

      if (resetError) {
        setError(resetError.message)
        return
      }

      setStep('success')
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

      setStep('success')
    } catch (err) {
      setError('Şifre güncelleme başarısız oldu.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    setError('')
    setIsLoading(true)

    try {
      if (!email) {
        setStep('request')
        return
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/sifre-sifirla?type=recovery`,
      })

      if (resetError) {
        setError(resetError.message)
        return
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand Section (Desktop Only) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#00833e] to-[#005a28] text-white flex-col justify-center items-center p-8 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Home className="w-8 h-8" />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-3">KomşuApp</h2>
            <p className="text-lg text-green-100">Komşuluğu Keşfedin</p>
          </div>
          <p className="text-sm text-green-50 max-w-xs leading-relaxed">
            Mahallenizdeki komşularınızla bağlantı kurun, deneyim paylaşın ve bir topluluk oluşturun.
          </p>
        </div>
      </div>

      {/* Right Panel - Form Section */}
      <div className="w-full md:w-1/2 bg-[#f0f2f5] flex flex-col justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="md:hidden text-center mb-4">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00833e] to-[#005a28] rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">K</span>
              </div>
            </div>
          </div>

          {/* Step 1: Request Reset */}
          {step === 'request' && (
            <div className="animate-fadeIn space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-[#333]">Şifre Sıfırla</h1>
                <p className="text-[#8f8f8f]">
                  Şifrenizi sıfırlamak için e-posta adresinizi girin
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3 animate-slideDown">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleRequestReset} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#333] mb-2.5">
                    E-posta Adresi
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8f8f8f]" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ornek@email.com"
                      required
                      disabled={isLoading}
                      className="w-full pl-12 pr-4 py-3 border border-[#e0e0e0] rounded-xl text-sm text-[#333] placeholder-[#8f8f8f] bg-white focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e]/20 transition disabled:bg-[#f0f2f5] disabled:cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-[#8f8f8f] mt-2">
                    E-posta adresinize şifre sıfırlama bağlantısı göndereceğiz.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#00833e] hover:bg-[#006b32] text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:shadow-sm"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Gönderiliyor...</span>
                    </span>
                  ) : (
                    "Şifre Sıfırlama Bağlantısı Gönder"
                  )}
                </button>
              </form>

              {/* Login Link */}
              <div className="text-center">
                <Link
                  href="/giris"
                  className="inline-flex items-center gap-2 text-[#00833e] hover:text-[#006b32] font-semibold transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Giriş Sayfasına Dön
                </Link>
              </div>
            </div>
          )}

          {/* Step 2: Reset Password */}
          {step === 'reset' && (
            <div className="animate-fadeIn space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-[#333]">Yeni Şifre Belirle</h1>
                <p className="text-[#8f8f8f]">
                  Lütfen güçlü bir şifre oluşturun
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3 animate-slideDown">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-[#333] mb-2.5">
                    Yeni Şifre
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8f8f8f]" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                      className="w-full pl-12 pr-12 py-3 border border-[#e0e0e0] rounded-xl text-sm text-[#333] placeholder-[#8f8f8f] bg-white focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e]/20 transition disabled:bg-[#f0f2f5] disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8f8f8f] hover:text-[#404040] transition disabled:cursor-not-allowed"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-[#8f8f8f] mt-2">En az 8 karakter olmalıdır</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#333] mb-2.5">
                    Şifre Tekrar
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8f8f8f]" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                      className="w-full pl-12 pr-12 py-3 border border-[#e0e0e0] rounded-xl text-sm text-[#333] placeholder-[#8f8f8f] bg-white focus:outline-none focus:border-[#00833e] focus:ring-2 focus:ring-[#00833e]/20 transition disabled:bg-[#f0f2f5] disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8f8f8f] hover:text-[#404040] transition disabled:cursor-not-allowed"
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
                  className="w-full bg-[#00833e] hover:bg-[#006b32] text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:shadow-sm mt-6"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Güncelleniyor...</span>
                    </span>
                  ) : (
                    "Şifre Güncelle"
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <div className="text-center">
                <Link
                  href="/giris"
                  className="inline-flex items-center gap-2 text-[#00833e] hover:text-[#006b32] font-semibold transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Giriş Sayfasına Dön
                </Link>
              </div>
            </div>
          )}

          {/* Step 3: Success Message */}
          {step === 'success' && (
            <div className="animate-fadeIn space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#00833e]/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-[#00833e] to-[#006b32] rounded-full flex items-center justify-center animate-scaleIn">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>

              <div className="text-center space-y-3">
                <h1 className="text-3xl font-bold text-[#333]">E-posta Gönderildi!</h1>
                <p className="text-[#8f8f8f] text-base">
                  Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.
                </p>
                <p className="text-[#8f8f8f] text-sm">
                  Lütfen e-postanızı kontrol edin ve bağlantıyı tıklayın.
                </p>
              </div>

              {/* Success Actions */}
              <div className="space-y-3 pt-4">
                <button
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border-2 border-[#00833e] text-[#00833e] font-semibold rounded-xl hover:bg-[#e6f4ec] transition disabled:opacity-50 disabled:cursor-not-allowed active:bg-[#e0ece7]"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Gönderiliyor...</span>
                    </span>
                  ) : (
                    "Tekrar Gönder"
                  )}
                </button>

                <Link
                  href="/giris"
                  className="w-full flex items-center justify-center gap-2 bg-[#00833e] hover:bg-[#006b32] text-white font-semibold py-3 rounded-xl transition shadow-sm hover:shadow-md active:shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Giriş Sayfasına Dön
                </Link>
              </div>

              <p className="text-xs text-[#8f8f8f] text-center pt-4 border-t border-[#e0e0e0]">
                Bağlantı 24 saat geçerliliğine sahiptir.
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}

export default function SifreSifirlaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#e0e0e0] border-t-[#00833e]"></div>
          <p className="text-gray-600 font-medium">Yükleniyor...</p>
        </div>
      </div>
    }>
      <SifreSifirlaContent />
    </Suspense>
  )
}
