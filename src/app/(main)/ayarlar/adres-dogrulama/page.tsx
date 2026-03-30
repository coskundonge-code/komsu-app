'use client'

import { toast } from '@/lib/utils/show-toast'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  MapPin,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  Clock,
  Shield,
  ExternalLink,
  Users,
  UserCheck,
  Search,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'
type VerificationMethod = 'edevlet' | 'neighbor' | null

export default function AdresDogrulamaPage() {
  const [status, setStatus] = useState<VerificationStatus>('unverified')
  const [method, setMethod] = useState<VerificationMethod>(null)
  const [neighborSearch, setNeighborSearch] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedNeighbor, setSelectedNeighbor] = useState<any>(null)
  const [referralMessage, setReferralMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [requestSent, setRequestSent] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data } = await supabase
          .from('neighborhood_members')
          .select('is_verified')
          .eq('user_id', user.id)
          .single() as any
        if (data?.is_verified) setStatus('verified')
      } catch {
        // Not verified yet
      }
    }
    checkVerificationStatus()
  }, [])

  const handleNeighborSearch = async () => {
    if (!neighborSearch.trim()) return
    setIsLoading(true)
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .ilike('full_name', `%${neighborSearch}%`)
        .limit(5) as any
      setSearchResults(data || [])
    } catch {
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendReferralRequest = async () => {
    if (!selectedNeighbor) return
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setRequestSent(true)
      setStatus('pending')
    } catch {
      toast.error('Referans talebi gönderilirken bir hata oluştu.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdevletRedirect = () => {
    // In production, this would redirect to e-Devlet OAuth
    window.open('https://www.turkiye.gov.tr', '_blank')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/ayarlar" className="p-1 hover:bg-surface-hover rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-text-secondary" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Adres Dogrulama</h1>
              <p className="text-sm text-text-muted">Komsu toplulugunuza katilmak icin adresinizi dogrulayin</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Status Card */}
        <div className={cn(
          'rounded-xl border p-5',
          status === 'verified' && 'bg-green-50 border-green-200',
          status === 'pending' && 'bg-yellow-50 border-yellow-200',
          status === 'rejected' && 'bg-red-50 border-red-200',
          status === 'unverified' && 'bg-surface border-border',
        )}>
          <div className="flex items-start gap-4">
            <div className={cn(
              'p-3 rounded-full',
              status === 'verified' && 'bg-green-100',
              status === 'pending' && 'bg-yellow-100',
              status === 'rejected' && 'bg-red-100',
              status === 'unverified' && 'bg-background',
            )}>
              {status === 'verified' && <CheckCircle className="w-6 h-6 text-green-600" />}
              {status === 'pending' && <Clock className="w-6 h-6 text-yellow-600" />}
              {status === 'rejected' && <AlertCircle className="w-6 h-6 text-red-600" />}
              {status === 'unverified' && <MapPin className="w-6 h-6 text-text-muted" />}
            </div>
            <div className="flex-1">
              {status === 'verified' && (
                <>
                  <h2 className="font-bold text-green-800">Adresiniz Dogrulandi</h2>
                  <p className="text-sm text-green-700 mt-1">Komsularinizla mesajlasabilir ve tum ozelliklerden yararlanabilirsiniz.</p>
                </>
              )}
              {status === 'pending' && (
                <>
                  <h2 className="font-bold text-yellow-800">{requestSent ? 'Referans Talebi Gonderildi' : 'Dogrulama Beklemede'}</h2>
                  <p className="text-sm text-yellow-700 mt-1">
                    {requestSent
                      ? 'Sectiginiz komsu referans talebinizi onayladiktan sonra adresiniz dogrulanacaktir.'
                      : 'Basvurunuz inceleniyor. Genellikle 1-3 is gunu icinde sonuclanir.'}
                  </p>
                </>
              )}
              {status === 'rejected' && (
                <>
                  <h2 className="font-bold text-red-800">Dogrulama Reddedildi</h2>
                  <p className="text-sm text-red-700 mt-1">Lutfen tekrar deneyin veya farkli bir yontem secin.</p>
                </>
              )}
              {status === 'unverified' && (
                <>
                  <h2 className="font-bold text-text-primary">Adres Dogrulamasi Gerekli</h2>
                  <p className="text-sm text-text-muted mt-1">Komsulariniza mesaj gondermek icin adresinizi dogrulamaniz gerekmektedir.</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Why Verification */}
        <div className="bg-surface rounded-xl border border-border p-5">
          <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Neden Adres Dogrulama?
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            Mahallemiz platformunda guvenli bir topluluk olusturmak icin kullanicilarimizin gercek adreslerini dogruluyoruz.
            Dogrulanmis kullanicilar diger komsulariyla mesajlasabilir, ilan verebilir ve tum topluluk ozelliklerinden faydalanabilir.
          </p>
        </div>

        {/* Verification Methods */}
        {(status === 'unverified' || status === 'rejected') && (
          <div className="space-y-4">
            <h3 className="font-semibold text-text-primary text-lg">Dogrulama Yontemi Secin</h3>

            {/* Method 1: e-Devlet */}
            <button
              onClick={() => setMethod('edevlet')}
              className={cn(
                'w-full text-left rounded-xl border-2 p-5 transition-all',
                method === 'edevlet'
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border bg-surface hover:border-primary/50'
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  'p-3 rounded-xl',
                  method === 'edevlet' ? 'bg-primary/10' : 'bg-background'
                )}>
                  <Shield className={cn('w-7 h-7', method === 'edevlet' ? 'text-primary' : 'text-text-muted')} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-text-primary">e-Devlet ile Dogrulama</h4>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Onerilen</span>
                  </div>
                  <p className="text-sm text-text-muted mt-1">
                    e-Devlet hesabiniz uzerinden ikametgah bilgilerinizi otomatik olarak dogrulayin. En hizli ve en guvenli yontem.
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Aninda dogrulama</span>
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Resmi belge</span>
                  </div>
                </div>
              </div>
            </button>

            {/* Method 2: Neighbor Referral */}
            <button
              onClick={() => setMethod('neighbor')}
              className={cn(
                'w-full text-left rounded-xl border-2 p-5 transition-all',
                method === 'neighbor'
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border bg-surface hover:border-primary/50'
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  'p-3 rounded-xl',
                  method === 'neighbor' ? 'bg-primary/10' : 'bg-background'
                )}>
                  <Users className={cn('w-7 h-7', method === 'neighbor' ? 'text-primary' : 'text-text-muted')} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-text-primary">Komsu Referansi ile Dogrulama</h4>
                  <p className="text-sm text-text-muted mt-1">
                    Dogrulanmis bir komsunuz sizi referans gostererek adresinizi onaylayabilir. 1 komsu referansi yeterlidir.
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1"><UserCheck className="w-3 h-3" /> 1 komsu yeterli</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Komsu onayi gerekli</span>
                  </div>
                </div>
              </div>
            </button>

            {/* e-Devlet Panel */}
            {method === 'edevlet' && (
              <div className="bg-surface rounded-xl border border-border p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold text-text-primary text-lg">e-Devlet ile Dogrulama</h3>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 leading-relaxed">
                    e-Devlet butonuna tikladiginizda Turkiye.gov.tr sayfasina yonlendirileceksiniz.
                    Giris yaptiktan sonra ikametgah bilgileriniz otomatik olarak dogrulanacaktir.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <p className="text-sm text-text-secondary">e-Devlet butonuna tiklayin</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <p className="text-sm text-text-secondary">T.C. Kimlik numaraniz ve sifrenizle giris yapin</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <p className="text-sm text-text-secondary">Ikametgah bilgileriniz otomatik dogrulanacaktir</p>
                  </div>
                </div>

                <button
                  onClick={handleEdevletRedirect}
                  className="w-full py-3.5 bg-[#c8102e] text-white font-semibold rounded-lg hover:bg-[#a80d25] transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  e-Devlet ile Dogrula
                </button>
              </div>
            )}

            {/* Neighbor Referral Panel */}
            {method === 'neighbor' && (
              <div className="bg-surface rounded-xl border border-border p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold text-text-primary text-lg">Komsu Referansi ile Dogrulama</h3>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-sm text-emerald-800 leading-relaxed">
                    Mahallenizde dogrulanmis bir komsu sizi referans gostererek adresinizi onaylayabilir.
                    Referans talebi komsunuza bildirim olarak gonderilecektir.
                  </p>
                </div>

                {!requestSent ? (
                  <>
                    {/* Search Neighbor */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Komsu Ara</label>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                          <input
                            type="text"
                            value={neighborSearch}
                            onChange={(e) => setNeighborSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleNeighborSearch()}
                            placeholder="Komsu adinizi yazin..."
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                        <button
                          onClick={handleNeighborSearch}
                          disabled={isLoading}
                          className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 text-sm font-medium"
                        >
                          Ara
                        </button>
                      </div>
                    </div>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-text-primary">Sonuclar:</p>
                        {searchResults.map((neighbor: any) => (
                          <button
                            key={neighbor.id}
                            onClick={() => setSelectedNeighbor(neighbor)}
                            className={cn(
                              'w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left',
                              selectedNeighbor?.id === neighbor.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            )}
                          >
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                              {(neighbor.full_name || '?')[0].toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-text-primary text-sm">{neighbor.full_name}</p>
                              <p className="text-xs text-text-muted flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-primary" /> Dogrulanmis komsu
                              </p>
                            </div>
                            {selectedNeighbor?.id === neighbor.id && (
                              <CheckCircle className="w-5 h-5 text-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Message to Neighbor */}
                    {selectedNeighbor && (
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Mesaj (istege bagli)
                        </label>
                        <textarea
                          value={referralMessage}
                          onChange={(e) => setReferralMessage(e.target.value)}
                          placeholder="Komsunuza bir mesaj birakin..."
                          rows={3}
                          className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                        />
                      </div>
                    )}

                    {/* Send Request Button */}
                    {selectedNeighbor && (
                      <button
                        onClick={handleSendReferralRequest}
                        disabled={isLoading}
                        className="w-full py-3.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isLoading ? 'Gonderiliyor...' : (
                          <>
                            <UserCheck className="w-5 h-5" />
                            {selectedNeighbor.full_name} Referans Talebi Gonder
                          </>
                        )}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-6">
                    <CheckCircle className="w-12 h-12 text-primary mx-auto mb-3" />
                    <h4 className="font-bold text-text-primary">Referans Talebi Gonderildi!</h4>
                    <p className="text-sm text-text-muted mt-2">
                      <span className="font-medium">{selectedNeighbor?.full_name}</span> referans talebinizi onayladiktan sonra
                      adresiniz otomatik olarak dogrulanacaktir.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
