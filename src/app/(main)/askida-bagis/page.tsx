'use client'

// Askıda Bağış — parasız "eşya askısı" modeli (2026-06-10).
//
// Eski prototip (git: cf5cc7f) SAHTE bir kart formuyla gerçek kart numarası
// topluyor (PCI riski + mağaza ret sebebi) ve var olmayan /api/payment/iyzico
// ucuna POST atıyordu; bu yüzden "yakında" ekranıyla kapatılmıştı (20b0193).
// Bu sürüm parayı tamamen devre dışı bırakır: uygulama yalnızca İLAN + EŞLEŞME
// katmanıdır — bağışçı eşyayı/ürünü askıya bırakır (ödemesini esnafta kendisi
// yapar ya da elindeki eşyayı verir), komşu askıdan alır, teslimat uygulama içi
// mesajlaşmayla koordine edilir. Para bağışı / QR'lı esnaf askısı, PayTR canlı
// anahtarları girilince ayrı bir turda eklenecek (dürüst bilgi kutusu aşağıda).

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Heart,
  Gift,
  HandHeart,
  Plus,
  Minus,
  Check,
  Trash2,
  MessageCircle,
  Loader2,
  Info,
  Store,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useCurrentUser } from '@/lib/hooks/use-auth'
import {
  getDonations,
  createDonation,
  claimDonation,
  deleteDonation,
  type Donation,
} from '@/lib/hooks/use-donations'
import { toast } from '@/lib/utils/show-toast'

// Kategoriler — donation_type olarak kategori id'si yazılır.
const CATEGORIES = [
  { id: 'bread', label: 'Ekmek', emoji: '🍞' },
  { id: 'food', label: 'Gıda', emoji: '🍲' },
  { id: 'milk', label: 'Süt', emoji: '🥛' },
  { id: 'coffee', label: 'Kahve', emoji: '☕' },
  { id: 'book', label: 'Kitap', emoji: '📚' },
  { id: 'clothes', label: 'Giysi', emoji: '🧥' },
  { id: 'medicine', label: 'İlaç', emoji: '💊' },
  { id: 'cleaning', label: 'Temizlik', emoji: '🧹' },
  { id: 'other', label: 'Diğer', emoji: '🎁' },
] as const

// Eski kayıtlardaki serbest değerleri de kapsayan emoji eşlemesi.
const TYPE_EMOJI: Record<string, string> = {
  bread: '🍞', food: '🍲', milk: '🥛', coffee: '☕', book: '📚',
  clothes: '🧥', medicine: '💊', cleaning: '🧹', other: '🎁',
  Ekmek: '🍞', Kitap: '📚', Kahve: '☕', Süt: '🥛', Et: '🥩',
  Traş: '✂️', İlaç: '💊', Temizlik: '🧹', standard: '🎁',
}

function emojiFor(type: string): string {
  return TYPE_EMOJI[type] || '🎁'
}

function daysLeft(expiresAt?: string): number | null {
  if (!expiresAt) return null
  return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86_400_000))
}

type BusinessOption = { id: string; name: string }

// ---------------------------------------------------------------------------
// Bağış kartı (Askıda Ne Var? listesi)
// ---------------------------------------------------------------------------
function DonationCard({
  donation,
  isMine,
  isClaimedByMe,
  claiming,
  messaging,
  onClaim,
  onDelete,
  onMessageDonor,
}: {
  donation: Donation
  isMine: boolean
  isClaimedByMe: boolean
  claiming: boolean
  messaging: boolean
  onClaim: () => void
  onDelete: () => void
  onMessageDonor: () => void
}) {
  const left = daysLeft(donation.expires_at)
  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
      <div className="bg-gradient-to-r from-[#e8f5e9] to-[#f0fdf4] px-4 py-3 flex items-center gap-3 border-b border-border">
        <span className="text-3xl">{emojiFor(donation.donation_type)}</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-text-primary text-sm truncate">{donation.title}</p>
          <p className="text-xs text-text-muted truncate">
            {donation.profiles?.full_name || 'Komşu'}
            {donation.businesses?.name ? ` · ${donation.businesses.name}` : ''}
          </p>
        </div>
        <div className="flex-shrink-0 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
          x{donation.quantity || 1}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow gap-3">
        {donation.description && (
          <p className="text-xs text-text-muted italic">&ldquo;{donation.description}&rdquo;</p>
        )}
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>
            {donation.neighborhoods?.name || 'Genel'} ·{' '}
            {new Date(donation.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
          </span>
          {left !== null && (
            <span className={left <= 3 ? 'text-red-500 font-semibold' : ''}>
              {left > 0 ? `${left} gün kaldı` : 'Bugün son gün'}
            </span>
          )}
        </div>

        {isMine ? (
          <div className="flex items-center gap-2 mt-auto">
            <span className="flex-1 text-center text-xs font-semibold text-text-muted bg-background rounded-lg py-2.5">
              Sizin bağışınız
            </span>
            <button
              onClick={onDelete}
              aria-label="Bağışı geri çek"
              className="p-2.5 rounded-lg border border-border text-text-muted hover:text-red-600 hover:border-red-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : isClaimedByMe ? (
          <button
            onClick={onMessageDonor}
            disabled={messaging}
            className="w-full mt-auto bg-surface border-2 border-primary text-primary font-bold py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm hover:bg-[#e8f5e9] disabled:opacity-60"
          >
            {messaging ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
            Aldın ✓ — Bağışçıyla Mesajlaş
          </button>
        ) : (
          <button
            onClick={onClaim}
            disabled={claiming}
            className={cn(
              'w-full font-bold py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto text-sm',
              claiming ? 'bg-primary/60 text-white cursor-not-allowed' : 'bg-primary hover:bg-primary-hover text-white'
            )}
          >
            {claiming ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Alınıyor...</>
            ) : (
              <><Check className="w-4 h-4" />Askıdan Al</>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sayfa
// ---------------------------------------------------------------------------
export default function AskidaBagisPage() {
  const router = useRouter()
  const { user, neighborhood } = useCurrentUser()
  const [activeTab, setActiveTab] = useState<'available' | 'give' | 'mine'>('available')

  // Askıda Ne Var?
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const [messagingId, setMessagingId] = useState<string | null>(null)
  // Bu oturumda aldıklarım: id → bağışçı id (claim sonrası mesajlaş butonu için)
  const [justClaimed, setJustClaimed] = useState<Record<string, string>>({})

  // Askıya Bırak formu
  const [form, setForm] = useState({
    category: 'bread' as string,
    itemName: '',
    quantity: 1,
    description: '',
    businessId: '',
    submitting: false,
  })
  const [businesses, setBusinesses] = useState<BusinessOption[]>([])

  // Bağışlarım
  const [myGiven, setMyGiven] = useState<Donation[]>([])
  const [myReceived, setMyReceived] = useState<Donation[]>([])
  const [mineLoading, setMineLoading] = useState(false)

  const loadAvailable = useCallback(async () => {
    setLoading(true)
    const { data, error } = await getDonations({ status: 'available', limit: 50 })
    if (!error && Array.isArray(data)) setDonations(data as Donation[])
    else if (error) toast.error('Bağışlar yüklenemedi, tekrar deneyin')
    setLoading(false)
  }, [])

  useEffect(() => { loadAvailable() }, [loadAvailable])

  // Teslim noktası seçimi için işletmeler (opsiyonel alan).
  useEffect(() => {
    const supabase = createClient() as any
    supabase
      .from('businesses')
      .select('id, name')
      .order('name')
      .limit(50)
      .then(({ data }: { data: BusinessOption[] | null }) => setBusinesses(data || []))
  }, [])

  const loadMine = useCallback(async () => {
    if (!user?.id) return
    setMineLoading(true)
    const [given, received] = await Promise.all([
      getDonations({ userId: user.id, includeExpired: true, limit: 50 }),
      getDonations({ claimedBy: user.id, includeExpired: true, limit: 50 }),
    ])
    if (!given.error && Array.isArray(given.data)) setMyGiven(given.data as Donation[])
    if (!received.error && Array.isArray(received.data)) setMyReceived(received.data as Donation[])
    setMineLoading(false)
  }, [user?.id])

  useEffect(() => {
    if (activeTab === 'mine') loadMine()
  }, [activeTab, loadMine])

  // --- Askıdan al (atomik RPC; yarış güvenli) ---
  const handleClaim = async (donation: Donation) => {
    if (!user) { router.push('/giris'); return }
    setClaimingId(donation.id)
    const { data, error } = await claimDonation(donation.id)
    setClaimingId(null)
    if (error || !data) {
      toast.error('Bağış alınamadı — başka bir komşu sizden önce almış olabilir')
      loadAvailable()
      return
    }
    toast.success('Bağış askıdan alındı! Teslimat için bağışçıyla mesajlaşabilirsiniz.')
    setJustClaimed(prev => ({ ...prev, [donation.id]: data.donor_id }))
  }

  // --- Bağışçıyla mesajlaş (mevcut güvenli sohbet RPC'si) ---
  const handleMessageDonor = async (donation: Donation, donorId: string) => {
    if (!user) { router.push('/giris'); return }
    setMessagingId(donation.id)
    try {
      const supabase = createClient() as any
      const donorName = donation.profiles?.full_name || 'Komşu'
      const { data: convRows, error } = await supabase.rpc('get_or_create_direct_conversation', {
        p_other_user: donorId,
        p_listing_id: null,
        p_title: `Askıda Bağış - ${donorName}`,
        p_type: 'direct',
      })
      const row = Array.isArray(convRows) ? convRows[0] : convRows
      if (error || !row?.conversation_id) {
        toast.error('Sohbet açılamadı, tekrar deneyin')
        return
      }
      if (row.created) {
        await supabase.from('messages').insert({
          conversation_id: row.conversation_id,
          sender_id: user.id,
          body: `Merhaba, "${donation.title}" bağışınızı askıdan aldım. Teslimat için ne zaman uygun olursunuz?`,
        })
      }
      router.push(`/mesajlar?selected=${row.conversation_id}`)
    } finally {
      setMessagingId(null)
    }
  }

  // --- Bağışı geri çek (yalnızca kendi + henüz alınmamış; RLS de zorluyor) ---
  const handleDelete = async (donation: Donation) => {
    if (!user) return
    if (!window.confirm(`"${donation.title}" bağışını askıdan geri çekmek istiyor musunuz?`)) return
    const { error } = await deleteDonation(donation.id, user.id)
    if (error) {
      toast.error('Bağış geri çekilemedi')
      return
    }
    toast.success('Bağış askıdan geri çekildi')
    setDonations(prev => prev.filter(d => d.id !== donation.id))
    setMyGiven(prev => prev.filter(d => d.id !== donation.id))
  }

  // --- Askıya bırak ---
  const handleCreate = async () => {
    if (!user) { router.push('/giris'); return }
    const itemName = form.itemName.trim()
    if (!itemName) { toast.error('Ne bıraktığınızı yazın (örn. Ekmek, Çocuk montu)'); return }
    if (form.quantity < 1) { toast.error('Adet en az 1 olmalı'); return }

    setForm(f => ({ ...f, submitting: true }))
    const { data, error } = await createDonation({
      user_id: user.id,
      neighborhood_id: neighborhood?.id ?? null,
      donation_type: form.category,
      title: `Askıda ${form.quantity} ${itemName}`,
      description: form.description.trim() || undefined,
      quantity: form.quantity,
      business_id: form.businessId || null,
    })
    setForm(f => ({ ...f, submitting: false }))

    if (error || !data) {
      toast.error('Bağış kaydedilemedi, tekrar deneyin')
      return
    }
    toast.success('Bağışınız askıya bırakıldı — teşekkürler! 💚')
    setForm({ category: 'bread', itemName: '', quantity: 1, description: '', businessId: '', submitting: false })
    await loadAvailable()
    setActiveTab('available')
  }

  // Gerçek istatistikler (görünen listeden türetilir; sahte sayı yok).
  const stats = {
    items: donations.reduce((s, d) => s + (d.quantity || 1), 0),
    total: donations.length,
    businesses: new Set(donations.map(d => d.business_id).filter(Boolean)).size,
  }

  const tabBtn = (key: typeof activeTab, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setActiveTab(key)}
      className={cn(
        'flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap text-sm sm:text-base',
        activeTab === key
          ? 'bg-primary text-white shadow-lg'
          : 'bg-surface text-text-primary border border-border hover:border-primary'
      )}
    >
      {icon}
      {label}
    </button>
  )

  return (
    <div className="w-full">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-primary via-[#009d4e] to-[#00833e] text-white overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-4 py-8 sm:py-10 text-center">
          <div className="mb-4 inline-flex items-center justify-center w-14 h-14 bg-surface bg-opacity-20 rounded-full">
            <Gift className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Askıda Bağış</h1>
          <p className="text-base sm:text-lg opacity-90 mb-4">Komşuna bir iyilik bırak, mahalleni güzelleştir</p>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 max-w-xl mx-auto">
            <div className="bg-surface bg-opacity-15 rounded-lg px-2 py-2 sm:px-4 sm:py-3 backdrop-blur">
              <div className="text-lg sm:text-2xl font-bold">{stats.items}</div>
              <div className="text-xs opacity-90">Askıda Ürün</div>
            </div>
            <div className="bg-surface bg-opacity-15 rounded-lg px-2 py-2 sm:px-4 sm:py-3 backdrop-blur">
              <div className="text-lg sm:text-2xl font-bold">{stats.total}</div>
              <div className="text-xs opacity-90">Açık Bağış</div>
            </div>
            <div className="bg-surface bg-opacity-15 rounded-lg px-2 py-2 sm:px-4 sm:py-3 backdrop-blur">
              <div className="text-lg sm:text-2xl font-bold">{stats.businesses}</div>
              <div className="text-xs opacity-90">Teslim Noktası</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 sm:py-8">
        {/* Sekmeler */}
        <div className="flex gap-2 sm:gap-3 mb-5 sm:mb-6 overflow-x-auto">
          {tabBtn('available', <Gift className="w-4 h-4 sm:w-5 sm:h-5" />, 'Askıda Ne Var?')}
          {tabBtn('give', <Heart className="w-4 h-4 sm:w-5 sm:h-5" />, 'Askıya Bırak')}
          {tabBtn('mine', <HandHeart className="w-4 h-4 sm:w-5 sm:h-5" />, 'Bağışlarım')}
        </div>

        {/* Dürüst bilgi: para bağışı henüz yok */}
        <div className="mb-6 flex items-start gap-2.5 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800 leading-relaxed">
            Askıda Bağış şu an <strong>eşya/ürün askısı</strong> olarak çalışır: bağışınızı kendiniz
            temin edip askıya bırakırsınız, alan komşuyla uygulama içinden mesajlaşarak teslim
            edersiniz. Uygulama üzerinden <strong>para alınmaz</strong> — kartla bağış ve esnafta
            QR ile kullanım, güvenli ödeme altyapısı devreye alınınca eklenecek.
          </p>
        </div>

        {/* === ASKIDA NE VAR? === */}
        {activeTab === 'available' && (
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-text-primary flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                Askıda Bekleyen Bağışlar
              </h2>
              <span className="text-sm text-text-muted bg-surface border border-border rounded-full px-3 py-1">
                {donations.length} bağış
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-text-muted text-sm">Bağışlar yükleniyor…</p>
              </div>
            ) : donations.length === 0 ? (
              <div className="text-center py-16 bg-surface rounded-xl border border-border">
                <div className="text-5xl mb-4">🙏</div>
                <p className="text-text-primary font-semibold mb-1">Şu an askıda bağış yok</p>
                <p className="text-text-muted text-sm mb-6">İlk bağışı sen bırak, komşularını mutlu et!</p>
                <button
                  onClick={() => setActiveTab('give')}
                  className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary-hover transition-colors"
                >
                  Askıya Bırak
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {donations.map(d => (
                  <DonationCard
                    key={d.id}
                    donation={d}
                    isMine={d.user_id === user?.id}
                    isClaimedByMe={!!justClaimed[d.id]}
                    claiming={claimingId === d.id}
                    messaging={messagingId === d.id}
                    onClaim={() => handleClaim(d)}
                    onDelete={() => handleDelete(d)}
                    onMessageDonor={() => handleMessageDonor(d, justClaimed[d.id])}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* === ASKIYA BIRAK === */}
        {activeTab === 'give' && (
          <div className="max-w-xl mx-auto">
            <div className="bg-surface rounded-xl border border-border p-5 sm:p-6">
              <h2 className="text-lg font-bold text-text-primary mb-1 flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Askıya Bırak
              </h2>
              <p className="text-xs text-text-muted mb-5">
                Bıraktığınız bağış mahalledeki komşularınıza görünür; alan komşu sizinle
                mesajlaşarak teslim alır. Bağışlar 30 gün askıda kalır.
              </p>

              {/* Kategori */}
              <label className="block text-sm font-semibold text-text-primary mb-2">Kategori</label>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, category: c.id }))}
                    className={cn(
                      'flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all',
                      form.category === c.id
                        ? 'bg-primary text-white'
                        : 'bg-background text-text-secondary border border-border hover:border-primary'
                    )}
                  >
                    <span>{c.emoji}</span>
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Ürün adı */}
              <label htmlFor="askida-item" className="block text-sm font-semibold text-text-primary mb-2">
                Ne bırakıyorsunuz?
              </label>
              <input
                id="askida-item"
                type="text"
                value={form.itemName}
                onChange={e => setForm(f => ({ ...f, itemName: e.target.value }))}
                placeholder="Örn: Ekmek, Çocuk montu, Hikâye kitabı"
                maxLength={80}
                className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-background focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition mb-4"
              />

              {/* Adet */}
              <label className="block text-sm font-semibold text-text-primary mb-2">Adet</label>
              <div className="flex items-center gap-3 mb-4">
                <button
                  type="button"
                  aria-label="Azalt"
                  onClick={() => setForm(f => ({ ...f, quantity: Math.max(1, f.quantity - 1) }))}
                  className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:border-primary transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-lg text-text-primary">{form.quantity}</span>
                <button
                  type="button"
                  aria-label="Artır"
                  onClick={() => setForm(f => ({ ...f, quantity: Math.min(99, f.quantity + 1) }))}
                  className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:border-primary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Teslim noktası (opsiyonel) */}
              <label htmlFor="askida-biz" className="block text-sm font-semibold text-text-primary mb-2">
                Teslim noktası <span className="font-normal text-text-muted">(isteğe bağlı — bir esnafa bıraktıysanız)</span>
              </label>
              <div className="relative mb-4">
                <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                <select
                  id="askida-biz"
                  value={form.businessId}
                  onChange={e => setForm(f => ({ ...f, businessId: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm bg-background focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition appearance-none"
                >
                  <option value="">Elden teslim (mesajlaşarak)</option>
                  {businesses.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              {/* Açıklama */}
              <label htmlFor="askida-desc" className="block text-sm font-semibold text-text-primary mb-2">
                Not <span className="font-normal text-text-muted">(isteğe bağlı)</span>
              </label>
              <textarea
                id="askida-desc"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Örn: Mont 7-8 yaş, az kullanılmış. Hafta içi akşamları teslim edebilirim."
                rows={3}
                maxLength={300}
                className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-background focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none mb-5"
              />

              <button
                onClick={handleCreate}
                disabled={form.submitting}
                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {form.submitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" />Bırakılıyor...</>
                ) : (
                  <><Heart className="w-5 h-5" />Askıya Bırak</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* === BAĞIŞLARIM === */}
        {activeTab === 'mine' && (
          <div className="space-y-8">
            {mineLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-text-muted text-sm">Bağışlarınız yükleniyor…</p>
              </div>
            ) : (
              <>
                <section>
                  <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    Bıraktıklarım ({myGiven.length})
                  </h2>
                  {myGiven.length === 0 ? (
                    <p className="text-sm text-text-muted bg-surface border border-border rounded-xl p-6 text-center">
                      Henüz askıya bağış bırakmadınız.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {myGiven.map(d => (
                        <div key={d.id} className="flex items-center gap-3 bg-surface border border-border rounded-xl px-4 py-3">
                          <span className="text-2xl">{emojiFor(d.donation_type)}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text-primary truncate">{d.title}</p>
                            <p className="text-xs text-text-muted">
                              {new Date(d.created_at).toLocaleDateString('tr-TR')}
                              {d.businesses?.name ? ` · ${d.businesses.name}` : ''}
                            </p>
                          </div>
                          {d.status === 'available' ? (
                            <>
                              <span className="text-xs font-semibold text-primary bg-[#e8f5e9] px-2.5 py-1 rounded-full">Askıda</span>
                              <button
                                onClick={() => handleDelete(d)}
                                aria-label="Bağışı geri çek"
                                className="p-2 rounded-lg border border-border text-text-muted hover:text-red-600 hover:border-red-300 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <span className="text-xs font-semibold text-text-muted bg-background px-2.5 py-1 rounded-full">
                              {d.status === 'claimed' ? 'Alındı 💚' : d.status === 'expired' ? 'Süresi doldu' : d.status}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <section>
                  <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                    <HandHeart className="w-5 h-5 text-primary" />
                    Aldıklarım ({myReceived.length})
                  </h2>
                  {myReceived.length === 0 ? (
                    <p className="text-sm text-text-muted bg-surface border border-border rounded-xl p-6 text-center">
                      Henüz askıdan bağış almadınız.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {myReceived.map(d => (
                        <div key={d.id} className="flex items-center gap-3 bg-surface border border-border rounded-xl px-4 py-3">
                          <span className="text-2xl">{emojiFor(d.donation_type)}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text-primary truncate">{d.title}</p>
                            <p className="text-xs text-text-muted truncate">
                              Bağışçı: {d.profiles?.full_name || 'Komşu'}
                              {d.claimed_at ? ` · ${new Date(d.claimed_at).toLocaleDateString('tr-TR')}` : ''}
                            </p>
                          </div>
                          <button
                            onClick={() => handleMessageDonor(d, d.user_id)}
                            disabled={messagingId === d.id}
                            className="flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary rounded-lg px-3 py-2 hover:bg-[#e8f5e9] transition-colors disabled:opacity-60"
                          >
                            {messagingId === d.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageCircle className="w-3.5 h-3.5" />}
                            Mesajlaş
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
