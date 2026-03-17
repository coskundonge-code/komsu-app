'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, CheckCircle2, User, Mail, Lock, Phone, AlertCircle, CreditCard, ArrowRight } from 'lucide-react'
import { registerSchema } from '@/lib/validations/auth'

export default function KayitPage() {
  const router = useRouter()
  const [tcKimlikNo, setTcKimlikNo] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [tcKimlikNoError, setTcKimlikNoError] = useState('')
  const [fullNameError, setFullNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  // İki aşamalı form
  const [step, setStep] = useState<1 | 2>(1)

  const supabase = createClient()

  const validateStep1 = () => {
    setTcKimlikNoError('')
    setFullNameError('')
    setEmailError('')

    const result = registerSchema.safeParse({
      tcKimlikNo,
      fullName,
      email,
      phone: phone || undefined,
      password: 'temppass1',  // Step 1'de şifre kontrol etmiyoruz
      confirmPassword: 'temppass1',
    })

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      let hasError = false
      if (errors.tcKimlikNo?.[0]) { setTcKimlikNoError(errors.tcKimlikNo[0]); hasError = true }
      if (errors.fullName?.[0]) { setFullNameError(errors.fullName[0]); hasError = true }
      if (errors.email?.[0]) { setEmailError(errors.email[0]); hasError = true }
      return !hasError
    }

    // Basit doğrulamalar
    if (!tcKimlikNo || tcKimlikNo.length !== 11) {
      setTcKimlikNoError('TC Kimlik No 11 haneli olmalıdır')
      return false
    }
    if (!fullName || fullName.trim().length < 3) {
      setFullNameError('Ad ve soyad gereklidir')
      return false
    }
    if (!email || !email.includes('@')) {
      setEmailError('Geçerli bir e-posta adresi girin')
      return false
    }

    return true
  }

  const validateForm = () => {
    setPasswordError('')
    setConfirmPasswordError('')
    setPhoneError('')

    const result = registerSchema.safeParse({
      tcKimlikNo,
      fullName,
      email,
      phone,
      password,
      confirmPassword,
    })

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      if (errors.password?.[0]) setPasswordError(errors.password[0])
      if (errors.confirmPassword?.[0]) setConfirmPasswordError(errors.confirmPassword[0])
      if (errors.phone?.[0]) setPhoneError(errors.phone[0])
      return false
    }

    return true
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) return

    if (!agreeTerms) {
      setError("Kullanım koşullarını kabul etmeniz gerekiyor")
      return
    }

    setIsLoading(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            tc_kimlik_no: tcKimlikNo,
            phone: phone || null,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        setError(signUpError.message.includes('already registered') ? "Bu e-posta adresi zaten kayıtlı." : signUpError.message)
        return
      }

      if (!data.user) {
        setError("Kayıt başarısız oldu")
        return
      }

      setSuccess("Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.")
      setTimeout(() => router.push('/giris'), 2000)
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.")
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
      setError("Google ile kayıt başarısız oldu.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7f2] to-[#f8fafb] flex flex-col">
      {/* Top bar */}
      <div className="w-full px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 bg-[#00833e] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="text-lg font-bold text-[#333]">Mahallem</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[480px]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#333] mb-2">Hesap Oluşturun</h1>
            <p className="text-[#666]">
              Mahallenizin dijital topluluğuna katılın
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#e8eaed] p-6 sm:p-8">
            {/* Google Sign Up */}
            <button
              onClick={handleGoogleSignUp}
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
                  <span>Google ile kaydol</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e0e0e0]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-[#8f8f8f]">ya da e-posta ile</span>
              </div>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`flex-1 h-1 rounded-full transition-colors ${step >= 1 ? 'bg-[#00833e]' : 'bg-[#e0e0e0]'}`} />
              <div className={`flex-1 h-1 rounded-full transition-colors ${step >= 2 ? 'bg-[#00833e]' : 'bg-[#e0e0e0]'}`} />
            </div>

            <form onSubmit={handleSignUp} noValidate>
              {/* ===== STEP 1: Kişisel Bilgiler ===== */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-[#333] mb-1">Adım 1: Kişisel Bilgiler</p>

                  {/* TC Kimlik No */}
                  <div>
                    <label htmlFor="tcKimlikNo" className="block text-sm font-medium text-[#555] mb-1.5">
                      TC Kimlik No
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#999]" />
                      <input
                        id="tcKimlikNo"
                        type="text"
                        inputMode="numeric"
                        maxLength={11}
                        value={tcKimlikNo}
                        onChange={(e) => {
                          setTcKimlikNo(e.target.value.replace(/\D/g, ''))
                          if (tcKimlikNoError) setTcKimlikNoError('')
                        }}
                        placeholder="11 haneli TC Kimlik Numaranız"
                        disabled={isLoading}
                        className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm text-[#333] placeholder-[#aaa] bg-[#fafafa] focus:bg-white focus:outline-none focus:ring-2 transition ${
                          tcKimlikNoError
                            ? 'border-red-300 focus:ring-red-200'
                            : 'border-[#e0e0e0] focus:border-[#00833e] focus:ring-[#00833e]/20'
                        }`}
                      />
                    </div>
                    {tcKimlikNoError && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {tcKimlikNoError}
                      </p>
                    )}
                  </div>

                  {/* Ad Soyad */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-[#555] mb-1.5">
                      Ad ve Soyad
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#999]" />
                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value)
                          if (fullNameError) setFullNameError('')
                        }}
                        placeholder="Adınız Soyadınız"
                        disabled={isLoading}
                        className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm text-[#333] placeholder-[#aaa] bg-[#fafafa] focus:bg-white focus:outline-none focus:ring-2 transition ${
                          fullNameError
                            ? 'border-red-300 focus:ring-red-200'
                            : 'border-[#e0e0e0] focus:border-[#00833e] focus:ring-[#00833e]/20'
                        }`}
                      />
                    </div>
                    {fullNameError && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {fullNameError}
                      </p>
                    )}
                  </div>

                  {/* E-posta */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#555] mb-1.5">
                      E-posta adresi
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#999]" />
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
                        className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm text-[#333] placeholder-[#aaa] bg-[#fafafa] focus:bg-white focus:outline-none focus:ring-2 transition ${
                          emailError
                            ? 'border-red-300 focus:ring-red-200'
                            : 'border-[#e0e0e0] focus:border-[#00833e] focus:ring-[#00833e]/20'
                        }`}
                      />
                    </div>
                    {emailError && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {emailError}
                      </p>
                    )}
                  </div>

                  {/* Devam butonu */}
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full bg-[#00833e] hover:bg-[#006b32] text-white font-semibold py-3 rounded-xl text-sm transition mt-2 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                  >
                    Devam Et
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* ===== STEP 2: Güvenlik Bilgileri ===== */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-[#333]">Adım 2: Güvenlik Bilgileri</p>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-[#00833e] hover:text-[#006b32] font-medium"
                    >
                      ← Geri
                    </button>
                  </div>

                  {/* Kullanıcı özeti */}
                  <div className="bg-[#f0f7f2] rounded-lg px-4 py-3 flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#00833e] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {fullName.charAt(0).toUpperCase() || 'K'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#333] truncate">{fullName}</p>
                      <p className="text-xs text-[#666] truncate">{email}</p>
                    </div>
                  </div>

                  {/* Şifre */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-[#555] mb-1.5">
                      Şifre
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#999]" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (passwordError) setPasswordError('')
                        }}
                        placeholder="En az 8 karakter"
                        disabled={isLoading}
                        className={`w-full pl-11 pr-11 py-3 border rounded-xl text-sm text-[#333] placeholder-[#aaa] bg-[#fafafa] focus:bg-white focus:outline-none focus:ring-2 transition ${
                          passwordError
                            ? 'border-red-300 focus:ring-red-200'
                            : 'border-[#e0e0e0] focus:border-[#00833e] focus:ring-[#00833e]/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#555] transition"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {passwordError}
                      </p>
                    )}
                  </div>

                  {/* Şifre Tekrar */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#555] mb-1.5">
                      Şifre Tekrar
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#999]" />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          if (confirmPasswordError) setConfirmPasswordError('')
                        }}
                        placeholder="Şifrenizi tekrar girin"
                        disabled={isLoading}
                        className={`w-full pl-11 pr-11 py-3 border rounded-xl text-sm text-[#333] placeholder-[#aaa] bg-[#fafafa] focus:bg-white focus:outline-none focus:ring-2 transition ${
                          confirmPasswordError
                            ? 'border-red-300 focus:ring-red-200'
                            : 'border-[#e0e0e0] focus:border-[#00833e] focus:ring-[#00833e]/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#555] transition"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPasswordError && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {confirmPasswordError}
                      </p>
                    )}
                  </div>

                  {/* Telefon (opsiyonel) */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[#555] mb-1.5">
                      Telefon <span className="text-[#aaa] font-normal">(isteğe bağlı)</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#999]" />
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value)
                          if (phoneError) setPhoneError('')
                        }}
                        placeholder="+90 5XX XXX XXXX"
                        disabled={isLoading}
                        className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm text-[#333] placeholder-[#aaa] bg-[#fafafa] focus:bg-white focus:outline-none focus:ring-2 transition ${
                          phoneError
                            ? 'border-red-300 focus:ring-red-200'
                            : 'border-[#e0e0e0] focus:border-[#00833e] focus:ring-[#00833e]/20'
                        }`}
                      />
                    </div>
                    {phoneError && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {phoneError}
                      </p>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-2.5 pt-1">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => {
                        setAgreeTerms(e.target.checked)
                        if (error && error.includes("koşulları")) setError('')
                      }}
                      disabled={isLoading}
                      className="w-4 h-4 mt-0.5 rounded border-[#e0e0e0] text-[#00833e] focus:ring-[#00833e] cursor-pointer accent-[#00833e]"
                    />
                    <label htmlFor="terms" className="text-xs text-[#666] cursor-pointer leading-relaxed">
                      <Link href="/kosullar" className="text-[#00833e] font-medium hover:underline">Kullanım Koşullarını</Link> ve{' '}
                      <Link href="/gizlilik" className="text-[#00833e] font-medium hover:underline">Gizlilik Politikasını</Link> okudum ve kabul ediyorum
                    </label>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading || !agreeTerms}
                    className="w-full bg-[#00833e] hover:bg-[#006b32] text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-sm hover:shadow-md"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Kaydolunuyor...
                      </span>
                    ) : (
                      "Hesap Oluştur"
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#666]">
              Zaten hesabınız var mı?{' '}
              <Link href="/giris" className="text-[#00833e] hover:text-[#006b32] font-semibold transition">
                Giriş yapın
              </Link>
            </p>
          </div>

          {/* Footer trust badges */}
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-[#999]">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              SSL ile korunuyor
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              KVKK uyumlu
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
