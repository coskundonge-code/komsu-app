'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, User, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

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

  const validatePassword = (pwd: string) => {
    return pwd.length >= 8
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!fullName.trim()) {
      setError('Lütfen adınızı girin')
      return
    }

    if (!validatePassword(password)) {
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
      // Sign up
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('Bu e-mail adresi zaten kayıtlı')
        } else {
          setError(signUpError.message)
        }
        return
      }

      if (!data.user) {
        setError('Kayıt başarısız oldu')
        return
      }

      // Profile is auto-created by database trigger (on_auth_user_created)

      setSuccess('Kayıt başarılı! Lütfen e-mail adresinizi doğrulayın.')
      setTimeout(() => {
        router.push('/giris')
      }, 2000)
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
      console.error('Sign up error:', err)
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
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError('Google ile kayıt başarısız oldu.')
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
        <h1 className="text-2xl font-bold text-gray-900">Kaydolun</h1>
        <p className="text-gray-600 text-sm">Mahallenizin parçası olun</p>
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

      {/* Form */}
      <form onSubmit={handleSignUp} className="space-y-4">
        {/* Full Name Input */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Ad ve Soyad
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Adınız Soyadınız"
              required
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Email Input */}
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
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Şifre
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

        {/* Confirm Password Input */}
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

        {/* Terms Checkbox */}
        <div className="flex items-start gap-2">
          <input
            id="terms"
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            disabled={isLoading}
            className="w-4 h-4 mt-1 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer disabled:cursor-not-allowed"
          />
          <label htmlFor="terms" className="text-xs text-gray-600 cursor-pointer">
            <span className="text-gray-700 font-medium">Kullanım Koşullarını</span> ve{' '}
            <span className="text-gray-700 font-medium">Gizlilik Politikasını</span> okudum ve kabul ediyorum
          </label>
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={isLoading || !agreeTerms}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Kaydolunuyor...' : 'Kaydol'}
        </button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">veya</span>
        </div>
      </div>

      {/* Google Sign Up */}
      <button
        onClick={handleGoogleSignUp}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Google ile Kaydol
      </button>

      {/* Login Link */}
      <p className="text-center text-sm text-gray-600">
        Zaten hesabınız var mı?{' '}
        <Link href="/giris" className="text-emerald-600 hover:text-emerald-700 font-medium">
          Giriş yapın
        </Link>
      </p>
    </div>
  )
}
