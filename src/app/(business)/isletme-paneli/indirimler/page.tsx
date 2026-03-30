'use client'

import { toast } from '@/lib/utils/show-toast'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Percent, Plus, Pencil, Trash2, Tag, Calendar, CheckCircle, AlertTriangle } from 'lucide-react'

interface Discount {
  id: number
  name: string
  percentage: number
  category: string
  description: string
  validUntil: string
  isActive: boolean
  usageCount: number
}

const MOCK_DISCOUNTS: Discount[] = [
  { id: 1, name: 'Mahalleli İndirimi', percentage: 10, category: 'Genel', description: 'Tüm mahalle kartı sahiplerine geçerli genel indirim', validUntil: '2027-01-01', isActive: true, usageCount: 147 },
  { id: 2, name: 'İlk Alışveriş', percentage: 15, category: 'Hoş Geldin', description: 'İlk kez gelen mahalleli müşteriye özel', validUntil: '2026-12-31', isActive: true, usageCount: 34 },
]

export default function IndirimlerPage() {
  const [discounts, setDiscounts] = useState<Discount[]>(MOCK_DISCOUNTS)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', percentage: 10, category: 'Genel', description: '', validUntil: '2027-01-01' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.percentage < 5) { toast.warning('Minimum %5 indirim tanımlanmalıdır'); return }
    if (editingId) {
      setDiscounts(prev => prev.map(d => d.id === editingId ? { ...d, ...formData, isActive: true } : d))
    } else {
      setDiscounts(prev => [...prev, { id: Date.now(), ...formData, isActive: true, usageCount: 0 }])
    }
    setShowForm(false); setEditingId(null); setFormData({ name: '', percentage: 10, category: 'Genel', description: '', validUntil: '2027-01-01' })
  }

  const handleEdit = (discount: Discount) => {
    setFormData({ name: discount.name, percentage: discount.percentage, category: discount.category, description: discount.description, validUntil: discount.validUntil })
    setEditingId(discount.id); setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (discounts.length <= 1) { toast.warning('En az bir aktif indirim tanımlı olmalıdır. İndirim silinemez.'); return }
    setDiscounts(prev => prev.filter(d => d.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface border-b border-border px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/isletme-paneli" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></Link>
            <div><h1 className="text-xl font-bold text-text-primary">İndirim Yönetimi</h1><p className="text-sm text-text-muted">Mahalleli müşterilerinize özel indirimler</p></div>
          </div>
          <button onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', percentage: 10, category: 'Genel', description: '', validUntil: '2027-01-01' }) }} className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"><Plus className="w-4 h-4" />Yeni İndirim</button>
        </div>
      </div>
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div><p className="text-sm font-medium text-amber-800">İndirim Zorunluluğu</p><p className="text-xs text-amber-700 mt-1">Esnaf olarak en az bir aktif indirim tanımlamanız zorunludur. Minimum %5 indirim gereklidir.</p></div>
        </div>
        {discounts.map(discount => (
          <div key={discount.id} className="bg-surface rounded-xl border border-border overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><Percent className="w-6 h-6 text-green-600" /></div>
                  <div><h3 className="font-semibold">{discount.name}</h3><div className="flex items-center gap-2 mt-1"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">%{discount.percentage} indirim</span><span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"><Tag className="w-3 h-3 mr-1" />{discount.category}</span></div></div>
                </div>
                <div className="flex gap-1"><button onClick={() => handleEdit(discount)} className="p-2 rounded-lg hover:bg-gray-100"><Pencil className="w-4 h-4 text-gray-500" /></button><button onClick={() => handleDelete(discount.id)} className="p-2 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-400" /></button></div>
              </div>
              <p className="text-sm text-text-muted mb-3">{discount.description}</p>
              <div className="flex items-center justify-between text-xs text-text-muted"><div className="flex items-center gap-1"><Calendar className="w-3 h-3" />Geçerlilik: {new Date(discount.validUntil).toLocaleDateString('tr-TR')}</div><div className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />{discount.usageCount} kullanım</div></div>
            </div>
          </div>
        ))}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
              <div className="px-6 py-4 border-b"><h2 className="text-lg font-semibold">{editingId ? 'İndirimi Düzenle' : 'Yeni İndirim Ekle'}</h2></div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div><label className="block text-sm font-medium mb-1">İndirim Adı</label><input type="text" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} required className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Örn: Mahalleli İndirimi" /></div>
                <div><label className="block text-sm font-medium mb-1">İndirim Oranı (%)</label><input type="number" min="5" max="50" value={formData.percentage} onChange={e => setFormData(prev => ({ ...prev, percentage: parseInt(e.target.value) || 5 }))} required className="w-full px-3 py-2 border rounded-lg text-sm" /><p className="text-xs text-text-muted mt-1">Minimum %5 indirim zorunludur</p></div>
                <div><label className="block text-sm font-medium mb-1">Kategori</label><select value={formData.category} onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm"><option>Genel</option><option>Hoş Geldin</option><option>Sadakat</option><option>Özel Gün</option><option>Sezon</option></select></div>
                <div><label className="block text-sm font-medium mb-1">Açıklama</label><textarea value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} placeholder="İndirim detayları..." /></div>
                <div><label className="block text-sm font-medium mb-1">Geçerlilik Tarihi</label><input type="date" value={formData.validUntil} onChange={e => setFormData(prev => ({ ...prev, validUntil: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { setShowForm(false); setEditingId(null) }} className="flex-1 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">İptal</button>
                  <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">{editingId ? 'Güncelle' : 'Ekle'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
