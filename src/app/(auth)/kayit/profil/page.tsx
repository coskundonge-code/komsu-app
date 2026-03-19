'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Camera, ChevronLeft, CheckCircle2 } from 'lucide-react'

const INTERESTS = ['Yemek', 'Spor', 'Bahçe', 'Evcil Hayvan', 'Teknoloji', 'Müzik', 'Kitap', 'Seyahat']
const MAX_BIO_LENGTH = 200

export default function ProfileSetupPage() {
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [avatar, setAvatar] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Dosya boyutu 5MB\'dan küçük olmalıdır')
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Lütfen bir resim dosyası seçin')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatar(event.target?.result as string)
        setError('')
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    )
  }

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!displayName.trim()) {
      setError('Lütfen görünen adınızı girin')
      return
    }

    if (displayName.length < 2) {
      setError('Görünen ad en az 2 karakter olmalıdır')
      return
    }

    if (selectedInterests.length === 0) {
      setError('Lütfen en az bir ilgi alanı seçin')
      return
    }

    setIsLoading(true)

    try {
      // TODO: Save profile data
      console.log({
        displayName,
        bio,
        selectedInterests,
        avatar,
      })

      setSuccess('Profiliniz başarıyla oluşturuldu!')
      setTimeout(() => {
        // TODO: Redirect to home or dashboard
        // router.push('/anasayfa')
      }, 2000)
    } catch (err) {
      setError('Profil oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand Section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-primary-hover relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#00a84d] rounded-full opacity-10" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#004d1f] rounded-full opacity-10" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 py-12">
          {/* Logo and Brand Name */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
              <span className="text-3xl font-bold text-primary">K</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">Mahallem</h2>
            <p className="text-green-50 text-lg">Mahalle Bağlantısı</p>
          </div>

          {/* Feature bullets */}
          <div className="space-y-6 w-full max-w-sm">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Kişisel Profil</h3>
                <p className="text-green-50 text-sm mt-1">Kendinizi tanıtın komşularınıza</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h-2m0 0H10m2 0h2m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">İlgi Alanları</h3>
                <p className="text-green-50 text-sm mt-1">Ortak ilgi sahibi insanları bulun</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Bağlantı Kurma</h3>
                <p className="text-green-50 text-sm mt-1">Canlı bir topluluk oluşturun</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Profile Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center py-12 px-6 sm:px-8 lg:px-12 bg-[#f8fafb] overflow-y-auto">
        <div className="w-full max-w-sm mx-auto">
          {/* Logo on mobile */}
          <div className="md:hidden text-center mb-8">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <span className="text-2xl font-bold text-white">K</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Mahallem</h1>
          </div>

          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between gap-2 mb-3">
              {/* Step 1 */}
              <div className="flex flex-col items-center flex-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white text-sm font-semibold mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs text-text-muted text-center">Kayıt</span>
              </div>

              {/* Connector */}
              <div className="flex-1 h-1 bg-primary mb-6" />

              {/* Step 2 */}
              <div className="flex flex-col items-center flex-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white text-sm font-semibold mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs text-text-muted text-center">Adres</span>
              </div>

              {/* Connector */}
              <div className="flex-1 h-1 bg-primary mb-6" />

              {/* Step 3 */}
              <div className="flex flex-col items-center flex-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white text-sm font-semibold mb-2">3</div>
                <span className="text-xs text-text-primary font-semibold text-center">Profil</span>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text-primary">Profilinizi Oluşturun</h2>
            <p className="text-text-muted text-sm mt-2">Komşularınızla tanışmak için son adım</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleCreateProfile} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#e0f2f1] to-[#b2dfdb] flex items-center justify-center cursor-pointer hover:shadow-lg transition group overflow-hidden"
              >
                {avatar ? (
                  <>
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </>
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-primary" />
                    <div className="absolute -bottom-0 -right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-white">
                      <span className="text-white text-xs font-bold">+</span>
                    </div>
                  </>
                )}
              </div>
              <p className="text-xs text-text-muted mt-3 text-center">Profil fotoğrafınızı seçin</p>
            </div>

            {/* Display Name Input */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-semibold text-text-primary mb-2.5">
                Görünen Ad
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Adınız"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted bg-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition disabled:bg-background"
              />
              <p className="text-xs text-text-muted mt-1.5">Bu ad komşularınız tarafından görülecek</p>
            </div>

            {/* Bio Textarea */}
            <div>
              <label htmlFor="bio" className="block text-sm font-semibold text-text-primary mb-2.5">
                Hakkımda
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_BIO_LENGTH) {
                    setBio(e.target.value)
                  }
                }}
                placeholder="Kendinizi kısaca tanıtın... (opsiyonel)"
                rows={3}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted bg-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition resize-none disabled:bg-background"
              />
              <div className="flex justify-between items-center mt-1.5">
                <p className="text-xs text-text-muted">Kişisel bilgileri paylaşmayın</p>
                <span className="text-xs text-text-muted">
                  {bio.length}/{MAX_BIO_LENGTH}
                </span>
              </div>
            </div>

            {/* Interests Section */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-3.5">
                İlgi Alanlarınız
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    disabled={isLoading}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                      selectedInterests.includes(interest)
                        ? 'bg-primary text-white border border-primary'
                        : 'bg-surface text-text-primary border border-border hover:border-primary'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              <p className="text-xs text-text-muted mt-2.5">Ortak ilgi sahibi komşularınızı keşfedin</p>
            </div>

            {/* Create Profile Button */}
            <button
              type="submit"
              disabled={isLoading || !displayName.trim() || selectedInterests.length === 0}
              className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed mt-8 shadow-sm hover:shadow-md"
            >
              {isLoading ? 'Profil Oluşturuluyor...' : 'Profilimi Oluştur'}
            </button>
          </form>

          {/* Back link */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <Link
              href="/kayit/adres-dogrulama"
              className="text-sm text-primary hover:text-primary-hover font-semibold transition inline-flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Geri dön</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
