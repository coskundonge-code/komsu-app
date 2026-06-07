'use client'

import { toast } from '@/lib/utils/show-toast'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Percent, Plus, Pencil, Trash2, Calendar, CheckCircle, Loader2, Store } from 'lucide-react'
import { useCurrentUser } from '@/lib/hooks/use-auth'
import { createClient } from '@/lib/supabase/client'

// NOT (2026-06-07): Bu sayfa eskiden MOCK_DISCOUNTS ile (2 sahte indirim + uydurma
// "147 kullanım" sayaçları) çalışıyordu; CRUD yalnızca yerel state'i değiştiriyor,
// hiçbir şey veritabanına kaydetmiyordu. Artık giriş yapan işletme sahibinin GERÇEK
// `business_discounts` kayıtlarına bağlı: ekleme/düzenleme/silme doğrudan tabloya
// yazıyor (RLS: business_owners_can_manage_discounts). "Kullanım" sayısı gerçek
// current_uses kolonundan gelir. Sahte "indirim zorunluluğu" kuralı kaldırıldı
// (arka uçta böyle bir zorunluluk yok). Bkz. TECH_DEBT #12.

interface Discount {
  id: string
  title: string
  discountType: string
  discountValue: number
  description: string
  expiresAt: string | null
  isActive: boolean
  currentUses: number
}

const emptyForm = { title: '', discountValue: 10, description: '', expiresAt: '' }

export default function IndirimlerPage() {
  const { user } = useCurrentUser()
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(true)
  const [hasNoBusiness, setHasNoBusiness] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)

  const fetchDiscounts = useCallback(async (bizId: string) => {
    const supabase = createClient() as any
    const { data } = await supabase
      .from('business_discounts')
      .select('id, title, discount_type, discount_value, description, expires_at, is_active, current_uses')
      .eq('business_id', bizId)
      .order('created_at', { ascending: false })
    const mapped: Discount[] = ((data as any[]) || []).map((d) => ({
      id: d.id,
      title: d.title || 'İsimsiz indirim',
      discountType: d.discount_type || 'percentage',
      discountValue: d.discount_value || 0,
      description: d.description || '',
      expiresAt: d.expires_at || null,
      isActive: d.is_active ?? true,
      currentUses: d.current_uses || 0,
    }))
    setDiscounts(mapped)
  }, [])

  useEffect(() => {
    if (!user?.id) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const supabase = createClient() as any
      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .maybeSingle()
      if (cancelled) return
      if (!business) {
        setHasNoBusiness(true)
        setLoading(false)
        return
      }
      setBusinessId(business.id)
      await fetchDiscounts(business.id)
      if (!cancelled) setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [user?.id, fetchDiscounts])

  const openCreate = () => {
    setEditingId(null)
    setFormData(emptyForm)
    setShowForm(true)
  }

  const handleEdit = (discount: Discount) => {
    setFormData({
      title: discount.title,
      discountValue: discount.discountValue,
      description: discount.description,
      expiresAt: discount.expiresAt ? discount.expiresAt.slice(0, 10) : '',
    })
    setEditingId(discount.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessId) return
    if (formData.discountValue < 5) {
      toast.warning('Minimum %5 indirim tanımlanmalıdır')
      return
    }
    setSaving(true)
    const supabase = createClient() as any
    const payload: Record<string, any> = {
      title: formData.title.trim(),
      discount_type: 'percentage',
      discount_value: formData.discountValue,
      description: formData.description.trim() || null,
    }
    if (formData.expiresAt) payload.expires_at = new Date(formData.expiresAt).toISOString()

    let error
    if (editingId) {
      ;({ error } = await supabase.from('business_discounts').update(payload).eq('id', editingId))
    } else {
      ;({ error } = await supabase
        .from('business_discounts')
        .insert({ ...payload, business_id: businessId, is_active: true }))
    }
    setSaving(false)
    if (error) {
      toast.error('İndirim kaydedilemedi. Lütfen tekrar deneyin.')
      return
    }
    toast.success(editingId ? 'İndirim güncellendi' : 'İndirim eklendi')
    setShowForm(false)
    setEditingId(null)
    setFormData(emptyForm)
    await fetchDiscounts(businessId)
  }

  const handleDelete = async (id: string) => {
    if (!businessId) return
    if (!confirm('Bu indirimi silmek istediğinize emin misiniz?')) return
    const supabase = createClient() as any
    const { error } = await supabase.from('business_discounts').delete().eq('id', id)
    if (error) {
      toast.error('İndirim silinemedi.')
      return
    }
    setDiscounts((prev) => prev.filter((d) => d.id !== id))
    toast.success('İndirim silindi')
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (hasNoBusiness) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Henüz bir işletmeniz yok</h1>
          <p className="text-text-muted mb-6">İndirim tanımlamak için önce bir işletme eklemeniz gerekir.</p>
          <Link
            href="/isletme-ekle"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors"
          >
            İşletme Ekle
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/isletme-paneli" className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-text-primary">İndirim Yönetimi</h1>
            <p className="text-sm text-text-muted">Mahalleli müşterilerinize özel indirimler</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Yeni İndirim
        </button>
      </div>

      {discounts.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Percent className="w-8 h-8 text-primary" />
          </div>
          <p className="text-lg font-bold text-text-primary">Henüz indirim yok</p>
          <p className="text-text-muted mt-2 mb-4">
            Mahalleli müşterilerinize özel ilk indiriminizi tanımlayarak daha fazla kişiye ulaşın.
          </p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            İlk İndirimi Ekle
          </button>
        </div>
      ) : (
        discounts.map((discount) => (
          <div key={discount.id} className="bg-surface rounded-xl border border-border overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Percent className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{discount.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {discount.discountType === 'percentage'
                          ? `%${discount.discountValue} indirim`
                          : `₺${discount.discountValue} indirim`}
                      </span>
                      {!discount.isActive && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          Pasif
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(discount)} className="p-2 rounded-lg hover:bg-gray-100">
                    <Pencil className="w-4 h-4 text-gray-500" />
                  </button>
                  <button onClick={() => handleDelete(discount.id)} className="p-2 rounded-lg hover:bg-red-50">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
              {discount.description && <p className="text-sm text-text-muted mb-3">{discount.description}</p>}
              <div className="flex items-center justify-between text-xs text-text-muted">
                {discount.expiresAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Geçerlilik: {new Date(discount.expiresAt).toLocaleDateString('tr-TR')}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {discount.currentUses} kullanım
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">{editingId ? 'İndirimi Düzenle' : 'Yeni İndirim Ekle'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">İndirim Adı</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="Örn: Mahalleli İndirimi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">İndirim Oranı (%)</label>
                <input
                  type="number"
                  min="5"
                  max="90"
                  value={formData.discountValue}
                  onChange={(e) => setFormData((prev) => ({ ...prev, discountValue: parseInt(e.target.value) || 5 }))}
                  required
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
                <p className="text-xs text-text-muted mt-1">Minimum %5 indirim gereklidir</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  rows={2}
                  placeholder="İndirim detayları..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Geçerlilik Tarihi</label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, expiresAt: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                  className="flex-1 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
