'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, ChevronLeft, CheckCircle, AlertCircle, Upload, FileText, Clock, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'

export default function AdresDogrulamaPage() {
  const [status, setStatus] = useState<VerificationStatus>('unverified')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [documentType, setDocumentType] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data } = await supabase.from('neighborhood_members').select('is_verified').eq('user_id', user.id).single()
        if (data?.is_verified) setStatus('verified')
      } catch { /* not verified */ }
    }
    checkStatus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await new Promise(r => setTimeout(r, 1500))
      setStatus('pending')
    } catch { alert('Hata oluştu.') }
    finally { setIsLoading(false) }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/ayarlar" className="p-1 hover:bg-surface-hover rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-text-secondary" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Adres Doğrulama</h1>
              <p className="text-sm text-text-muted">Komşularınızla güvenli iletişim için adresinizi doğrulayın</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className={cn('rounded-xl border p-5', status === 'verified' && 'bg-green-50 border-green-200', status === 'pending' && 'bg-yellow-50 border-yellow-200', status === 'rejected' && 'bg-red-50 border-red-200', status === 'unverified' && 'bg-surface border-border')}>
          <div className="flex items-start gap-4">
            <div className={cn('p-3 rounded-full', status === 'verified' && 'bg-green-100', status === 'pending' && 'bg-yellow-100', status === 'rejected' && 'bg-red-100', status === 'unverified' && 'bg-background')}>
              {status === 'verified' && <CheckCircle className="w-6 h-6 text-green-600" />}
              {status === 'pending' && <Clock className="w-6 h-6 text-yellow-600" />}
              {status === 'rejected' && <AlertCircle className="w-6 h-6 text-red-600" />}
              {status === 'unverified' && <MapPin className="w-6 h-6 text-text-muted" />}
            </div>
            <div className="flex-1">
              {status === 'verified' && (<><h2 className="font-bold text-green-800">Adresiniz Doğrulandı</h2><p className="text-sm text-green-700 mt-1">Komşularınızla mesajlaşabilir ve tüm özelliklerden yararlanabilirsiniz.</p></>)}
              {status === 'pending' && (<><h2 className="font-bold text-yellow-800">Doğrulama Beklemede</h2><p className="text-sm text-yellow-700 mt-1">Başvurunuz inceleniyor. Genellikle 1-3 iş günü içinde sonuçlanır.</p></>)}
              {status === 'rejected' && (<><h2 className="font-bold text-red-800">Doğrulama Reddedildi</h2><p className="text-sm text-red-700 mt-1">Belgeniz geçersiz bulundu. Lütfen tekrar deneyin.</p></>)}
              {status === 'unverified' && (<><h2 className="font-bold text-text-primary">Adres Doğrulaması Gerekli</h2><p className="text-sm text-text-muted mt-1">Komşularınıza mesaj göndermek için adresinizi doğrulamanız gerekmektedir.</p></>)}
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-5">
          <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2"><Shield className="w-5 h-5 text-primary" />Neden Adres Doğrulama?</h3>
          <p className="text-sm text-text-secondary leading-relaxed">Mahallemiz platformunda güvenli bir topluluk oluşturmak için kullanıcılarımızın gerçek adreslerini doğruluyoruz. Doğrulanmış kullanıcılar diğer komşularıyla mesajlaşabilir, ilan verebilir ve tüm topluluk özelliklerinden faydalanabilir.</p>
        </div>
        {(status === 'unverified' || status === 'rejected') && (
          <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border p-6 space-y-5">
            <h3 className="font-semibold text-text-primary text-lg">Adres Bilgileri</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">İl</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="örn: İstanbul" required className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">İlçe</label>
                <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="örn: Kadıköy" required className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Mahalle</label>
              <input type="text" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="örn: Moda Mahallesi" required className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Açık Adres</label>
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Sokak adı, bina numarası, daire numarası..." required rows={3} className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Belge Türü</label>
              <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} required className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface appearance-none">
                <option value="">Belge türünü seçin</option>
                <option value="utility">Fatura (Elektrik, Su, Doğalgaz)</option>
                <option value="residence">İkametgah Belgesi</option>
                <option value="lease">Kira Sözleşmesi</option>
                <option value="title">Tapu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Belge Yükle</label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-text-muted mx-auto mb-3" />
                <p className="text-sm text-text-secondary font-medium">Belgenizi sürükleyip bırakın veya tıklayın</p>
                <p className="text-xs text-text-muted mt-1">PNG, JPG veya PDF (maks. 5MB)</p>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Gönderiliyor...' : 'Doğrulama Başvurusu Gönder'}
            </button>
          </form>
        )}
        <div className="bg-surface rounded-xl border border-border p-5">
          <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-primary" />Kabul Edilen Belgeler</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /><p className="text-sm text-text-secondary">Son 3 aya ait fatura (elektrik, su, doğalgaz, internet)</p></div>
            <div className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /><p className="text-sm text-text-secondary">E-Devlet&apos;ten alınmış ikametgah belgesi</p></div>
            <div className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /><p className="text-sm text-text-secondary">Geçerli kira sözleşmesi</p></div>
            <div className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /><p className="text-sm text-text-secondary">Tapu belgesi</p></div>
          </div>
        </div>
      </div>
    </div>
  )
}
