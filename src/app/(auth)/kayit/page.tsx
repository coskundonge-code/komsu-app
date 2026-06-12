'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, User, Mail, Lock, Phone, AlertCircle, CreditCard, ArrowRight } from 'lucide-react'
import { validateRegisterStep1, validateRegisterStep2 } from '@/lib/validations/auth'
import { RegisterLegalModal, type LegalModalType } from '@/components/auth/register-legal-modal'
import { AuthField } from '@/components/auth/auth-field'

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

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<LegalModalType>('terms')

  // İki aşamalı form
  const [step, setStep] = useState<1 | 2>(1)

  const supabase = createClient()

  const validateStep1 = () => {
    const { valid, errors } = validateRegisterStep1({ tcKimlikNo, fullName, email, phone })
    setTcKimlikNoError(errors.tcKimlikNo || '')
    setFullNameError(errors.fullName || '')
    setEmailError(errors.email || '')
    return valid
  }

  const validateForm = () => {
    const { valid, errors } = validateRegisterStep2({ tcKimlikNo, fullName, email, phone, password, confirmPassword })
    setPasswordError(errors.password || '')
    setConfirmPasswordError(errors.confirmPassword || '')
    setPhoneError(errors.phone || '')
    return valid
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

  // NOT (2026-06-11, mağaza hazırlığı): Google ile kayıt butonu kaldırıldı —
  // OAuth yapılandırılmamıştı (kırık buton = Apple 2.1) ve 3. taraf giriş
  // sunulursa Sign in with Apple zorunlu olur (4.8). İleride ikisi birlikte.

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7f2] to-[#f8fafb] flex flex-col">
      {/* Top bar */}
      <div className="w-full px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="text-lg font-bold text-text-primary">Mahallemiz</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[480px]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Hesap Oluşturun</h1>
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
          <div className="bg-surface rounded-2xl shadow-sm border border-[#e8eaed] p-6 sm:p-8">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`flex-1 h-1 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-[#e0e0e0]'}`} />
              <div className={`flex-1 h-1 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-[#e0e0e0]'}`} />
            </div>

            <form onSubmit={handleSignUp} noValidate>
              {/* ===== STEP 1: Kişisel Bilgiler ===== */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-text-primary mb-1">Adım 1: Kişisel Bilgiler</p>

                  <AuthField
                    id="tcKimlikNo"
                    label="TC Kimlik No"
                    Icon={CreditCard}
                    type="text"
                    inputMode="numeric"
                    maxLength={11}
                    value={tcKimlikNo}
                    onChange={(v) => {
                      setTcKimlikNo(v.replace(/\D/g, ''))
                      if (tcKimlikNoError) setTcKimlikNoError('')
                    }}
                    placeholder="11 haneli TC Kimlik Numaranız"
                    disabled={isLoading}
                    error={tcKimlikNoError}
                  />

                  <AuthField
                    id="fullName"
                    label="Ad ve Soyad"
                    Icon={User}
                    value={fullName}
                    onChange={(v) => {
                      setFullName(v)
                      if (fullNameError) setFullNameError('')
                    }}
                    placeholder="Adınız Soyadınız"
                    disabled={isLoading}
                    error={fullNameError}
                  />

                  <AuthField
                    id="email"
                    label="E-posta adresi"
                    Icon={Mail}
                    type="email"
                    value={email}
                    onChange={(v) => {
                      setEmail(v)
                      if (emailError) setEmailError('')
                    }}
                    placeholder="ornek@email.com"
                    disabled={isLoading}
                    error={emailError}
                  />

                  {/* Devam butonu */}
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-xl text-sm transition mt-2 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
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
                    <p className="text-sm font-semibold text-text-primary">Adım 2: Güvenlik Bilgileri</p>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-primary hover:text-primary-hover font-medium"
                    >
                      ← Geri
                    </button>
                  </div>

                  {/* Kullanıcı özeti */}
                  <div className="bg-[#f0f7f2] rounded-lg px-4 py-3 flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {fullName.charAt(0).toUpperCase() || 'K'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{fullName}</p>
                      <p className="text-xs text-[#666] truncate">{email}</p>
                    </div>
                  </div>

                  <AuthField
                    id="password"
                    label="Şifre"
                    Icon={Lock}
                    value={password}
                    onChange={(v) => {
                      setPassword(v)
                      if (passwordError) setPasswordError('')
                    }}
                    placeholder="En az 8 karakter"
                    disabled={isLoading}
                    error={passwordError}
                    showToggle
                    shown={showPassword}
                    onToggleShown={() => setShowPassword(!showPassword)}
                  />

                  <AuthField
                    id="confirmPassword"
                    label="Şifre Tekrar"
                    Icon={Lock}
                    value={confirmPassword}
                    onChange={(v) => {
                      setConfirmPassword(v)
                      if (confirmPasswordError) setConfirmPasswordError('')
                    }}
                    placeholder="Şifrenizi tekrar girin"
                    disabled={isLoading}
                    error={confirmPasswordError}
                    showToggle
                    shown={showConfirmPassword}
                    onToggleShown={() => setShowConfirmPassword(!showConfirmPassword)}
                  />

                  <AuthField
                    id="phone"
                    label={<>Telefon <span className="text-[#aaa] font-normal">(isteğe bağlı)</span></>}
                    Icon={Phone}
                    type="tel"
                    value={phone}
                    onChange={(v) => {
                      setPhone(v)
                      if (phoneError) setPhoneError('')
                    }}
                    placeholder="+90 5XX XXX XXXX"
                    disabled={isLoading}
                    error={phoneError}
                  />

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
                      className="w-4 h-4 mt-0.5 rounded border-border text-primary focus:ring-primary cursor-pointer accent-[#00833e]"
                    />
                    <label htmlFor="terms" className="text-xs text-[#666] cursor-pointer leading-relaxed">
                      <button type="button" onClick={() => { setModalType('terms'); setModalOpen(true) }} className="text-primary font-medium hover:underline">Kullanım Koşullarını</button> ve{' '}
                      <button type="button" onClick={() => { setModalType('privacy'); setModalOpen(true) }} className="text-primary font-medium hover:underline">Gizlilik Politikasını</button> okudum ve kabul ediyorum
                    </label>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading || !agreeTerms}
                    className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-sm hover:shadow-md"
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
              <Link href="/giris" className="text-primary hover:text-primary-hover font-semibold transition">
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

      {/* Terms / Privacy Modal */}
      <RegisterLegalModal open={modalOpen} type={modalType} onClose={() => setModalOpen(false)} />
    </div>
  )
}
