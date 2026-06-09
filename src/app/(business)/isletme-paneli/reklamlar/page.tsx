'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { toast } from '@/lib/utils/show-toast';
import { useCurrentUser } from '@/lib/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import {
  Plus,
  Megaphone,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  Calendar,
  Loader2,
  Store,
} from 'lucide-react';

// NOT (2026-06-07): Bu sayfa eskiden MOCK_CAMPAIGNS ile (3 sahte kampanya + uydurma
// bütçe/harcama/gösterim/CTR ve "dönüşüm" sayıları) çalışıyordu; form ve tüm düğmeler
// işlevsizdi. Artık giriş yapan işletme sahibinin GERÇEK `ad_campaigns` kayıtlarına
// bağlı (RLS: "Owners can manage campaigns"). Gösterim/tıklama metrikleri gerçek
// `ads.impression_count`/`click_count` toplamından gelir; harcama gerçek `spent`
// kolonundandır. Şemada karşılığı olmayan "dönüşüm" metriği kaldırıldı. Reklam
// sunumu/faturalama arka ucu devreye girene kadar yeni kampanyaların metrikleri
// dürüst biçimde 0 görünür. Bkz. TECH_DEBT #12.

interface AdCampaign {
  id: string;
  name: string;
  status: string;
  startDate: string | null;
  budget: number;
  spent: number;
  views: number;
  clicks: number;
  ctr: number;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active: { label: 'Aktif', color: 'bg-green-100 text-green-800' },
  paused: { label: 'Duraklatılmış', color: 'bg-yellow-100 text-yellow-800' },
  ended: { label: 'Sona Erdi', color: 'bg-gray-100 text-gray-800' },
};

const emptyForm = { name: '', budget: '', startDate: '', endDate: '' };

export default function ReklamlarPage() {
  const { user } = useCurrentUser();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasNoBusiness, setHasNoBusiness] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'ended'>('all');

  const fetchCampaigns = useCallback(async (bizId: string) => {
    const supabase = createClient() as any;
    const { data: campaignData } = await supabase
      .from('ad_campaigns')
      .select('id, name, budget, spent, start_date, status')
      .eq('business_id', bizId)
      .order('created_at', { ascending: false });

    const list = (campaignData as any[]) || [];
    const ids = list.map((c) => c.id);

    // Gerçek metrikler: kampanyaya ait reklamların gösterim/tıklama toplamı
    const metrics: Record<string, { views: number; clicks: number }> = {};
    if (ids.length > 0) {
      const { data: adData } = await supabase
        .from('ads')
        .select('campaign_id, impression_count, click_count')
        .in('campaign_id', ids);
      for (const ad of (adData as any[]) || []) {
        const m = metrics[ad.campaign_id] || { views: 0, clicks: 0 };
        m.views += ad.impression_count || 0;
        m.clicks += ad.click_count || 0;
        metrics[ad.campaign_id] = m;
      }
    }

    const mapped: AdCampaign[] = list.map((c) => {
      const m = metrics[c.id] || { views: 0, clicks: 0 };
      const ctr = m.views > 0 ? (m.clicks / m.views) * 100 : 0;
      return {
        id: c.id,
        name: c.name || 'İsimsiz kampanya',
        status: c.status || 'active',
        startDate: c.start_date || null,
        budget: c.budget || 0,
        spent: c.spent || 0,
        views: m.views,
        clicks: m.clicks,
        ctr: Math.round(ctr * 10) / 10,
      };
    });
    setCampaigns(mapped);
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const supabase = createClient() as any;
      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .maybeSingle();
      if (cancelled) return;
      if (!business) {
        setHasNoBusiness(true);
        setLoading(false);
        return;
      }
      setBusinessId(business.id);
      await fetchCampaigns(business.id);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, fetchCampaigns]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) return;
    const budgetNum = parseFloat(form.budget);
    if (!form.name.trim() || isNaN(budgetNum) || budgetNum <= 0) {
      toast.warning('Lütfen kampanya adı ve geçerli bir bütçe girin.');
      return;
    }
    setSaving(true);
    const supabase = createClient() as any;
    const payload: Record<string, any> = {
      business_id: businessId,
      name: form.name.trim(),
      budget: budgetNum,
      status: 'active',
    };
    if (form.startDate) payload.start_date = form.startDate;
    if (form.endDate) payload.end_date = form.endDate;
    const { error } = await supabase.from('ad_campaigns').insert(payload);
    setSaving(false);
    if (error) {
      toast.error('Kampanya oluşturulamadı. Lütfen tekrar deneyin.');
      return;
    }
    toast.success('Kampanya oluşturuldu');
    setShowAddForm(false);
    setForm(emptyForm);
    await fetchCampaigns(businessId);
  };

  const updateStatus = async (id: string, status: string) => {
    if (!businessId) return;
    const supabase = createClient() as any;
    const { error } = await supabase.from('ad_campaigns').update({ status }).eq('id', id);
    if (error) {
      toast.error('Durum güncellenemedi.');
      return;
    }
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const handleDelete = async (id: string) => {
    if (!businessId) return;
    if (!confirm('Bu kampanyayı silmek istediğinize emin misiniz?')) return;
    const supabase = createClient() as any;
    const { error } = await supabase.from('ad_campaigns').delete().eq('id', id);
    if (error) {
      toast.error('Kampanya silinemedi.');
      return;
    }
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    toast.success('Kampanya silindi');
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (filterStatus === 'all') return true;
    return campaign.status === filterStatus;
  });

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (hasNoBusiness) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Henüz bir işletmeniz yok</h1>
          <p className="text-text-muted mb-6">Reklam kampanyası oluşturmak için önce bir işletme eklemeniz gerekir.</p>
          <Link
            href="/isletme-ekle"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors"
          >
            İşletme Ekle
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">Reklam Kampanyaları Yönetimi</h1>
          <p className="text-text-muted">
            Kampanyalarınızı yönetin, performansı izleyin ve bütçe kullanımını kontrol edin
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-md"
        >
          <Plus size={20} />
          Yeni Kampanya
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#e6f4ec] to-[#d1fae5] rounded-lg border border-[#a7dbb8] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary text-sm font-medium mb-1">Aktif Kampanyalar</p>
              <p className="text-3xl font-bold text-primary">{activeCampaigns}</p>
              <p className="text-xs text-primary mt-2">Canlı çalışıyor</p>
            </div>
            <Megaphone size={40} color="#00833e" className="opacity-15" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#fef3c7] to-[#fde68a] rounded-lg border border-[#fcd34d] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#92400e] text-sm font-medium mb-1">Toplam Bütçe</p>
              <p className="text-3xl font-bold text-[#b45309]">₺{totalBudget.toLocaleString('tr-TR')}</p>
              <p className="text-xs text-[#92400e] mt-2">Tüm kampanyalar</p>
            </div>
            <DollarSign size={40} color="#b45309" className="opacity-15" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#dbeafe] to-[#bfdbfe] rounded-lg border border-[#93c5fd] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#1e40af] text-sm font-medium mb-1">Harcanan</p>
              <p className="text-3xl font-bold text-[#1e40af]">₺{totalSpent.toLocaleString('tr-TR')}</p>
              <p className="text-xs text-[#1e40af] mt-2">
                {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% kullanıldı
              </p>
            </div>
            <TrendingUp size={40} color="#1e40af" className="opacity-15" />
          </div>
        </div>
      </div>

      {/* Add Campaign Form */}
      {showAddForm && (
        <div className="bg-surface rounded-lg border border-[#a7dbb8] p-6 mb-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary">Yeni Kampanya Oluştur</h2>
            <button onClick={() => setShowAddForm(false)} className="text-text-muted hover:text-text-primary">
              ✕
            </button>
          </div>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Kampanya Adı</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Örn: Yaz Promosyonu"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Bütçe (₺)</label>
                <input
                  type="number"
                  min="1"
                  value={form.budget}
                  onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))}
                  placeholder="5000"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Başlangıç Tarihi</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Bitiş Tarihi</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary hover:bg-primary-hover text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Kampanyayı Başlat
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-[#e0e0e0] hover:bg-[#d0d0d0] text-text-primary font-medium py-2 px-6 rounded-lg transition-colors"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter */}
      <div className="bg-surface rounded-lg border border-border p-4 mb-6 flex gap-2 flex-wrap">
        {(['all', 'active', 'paused', 'ended'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === status
                ? 'bg-primary text-white'
                : 'bg-background text-text-primary hover:bg-[#e0e0e0]'
            }`}
          >
            {status === 'all'
              ? 'Tümü'
              : status === 'active'
              ? 'Aktif'
              : status === 'paused'
              ? 'Duraklatılmış'
              : 'Sona Erdi'}
          </button>
        ))}
      </div>

      {/* Campaigns List */}
      <div className="space-y-4 mb-8">
        {filteredCampaigns.map((campaign) => {
          const statusConfig = STATUS_CONFIG[campaign.status] || STATUS_CONFIG.ended;
          const progress = campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0;

          return (
            <div
              key={campaign.id}
              className="bg-surface rounded-lg border border-border p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-light rounded-lg text-primary">
                      <Megaphone size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">{campaign.name}</h3>
                      {campaign.startDate && (
                        <p className="text-sm text-text-muted flex items-center gap-1 mt-1">
                          <Calendar size={14} />
                          {new Date(campaign.startDate).toLocaleDateString('tr-TR')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>

              {/* Budget Progress */}
              <div className="mb-6 bg-background rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-primary" />
                    <span className="text-sm font-medium text-text-primary">Bütçe Kullanımı</span>
                  </div>
                  <span className="text-sm font-bold text-text-primary">
                    ₺{campaign.spent.toLocaleString('tr-TR')} / ₺{campaign.budget.toLocaleString('tr-TR')}
                  </span>
                </div>
                <div className="w-full bg-[#e0e0e0] rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      progress < 50 ? 'bg-primary' : progress < 80 ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-text-muted mt-2">{progress.toFixed(1)}% kullanıldı</p>
              </div>

              {/* Stats Grid — gerçek gösterim/tıklama/CTR */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-3 bg-[#dbeafe] rounded-lg border border-[#bfdbfe]">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye size={16} className="text-[#3b82f6]" />
                    <p className="text-xs text-text-muted">Gösterim</p>
                  </div>
                  <p className="text-lg font-bold text-text-primary">{campaign.views.toLocaleString('tr-TR')}</p>
                </div>

                <div className="p-3 bg-[#f3e8ff] rounded-lg border border-[#e9d5ff]">
                  <div className="flex items-center gap-2 mb-1">
                    <Users size={16} className="text-[#a855f7]" />
                    <p className="text-xs text-text-muted">Tıklama</p>
                  </div>
                  <p className="text-lg font-bold text-text-primary">{campaign.clicks.toLocaleString('tr-TR')}</p>
                </div>

                <div className="p-3 bg-[#fee2e2] rounded-lg border border-[#fecaca]">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={16} className="text-[#ef4444]" />
                    <p className="text-xs text-text-muted">CTR</p>
                  </div>
                  <p className="text-lg font-bold text-text-primary">{campaign.ctr}%</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 border-t border-border pt-4">
                {campaign.status === 'active' && (
                  <button
                    onClick={() => updateStatus(campaign.id, 'paused')}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#fef3c7] hover:bg-[#fde68a] text-[#92400e] font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    Duraklat
                  </button>
                )}
                {campaign.status === 'paused' && (
                  <button
                    onClick={() => updateStatus(campaign.id, 'active')}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary-light hover:bg-primary-light text-primary-hover font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    Sürdür
                  </button>
                )}
                {campaign.status !== 'ended' && (
                  <button
                    onClick={() => updateStatus(campaign.id, 'ended')}
                    className="flex-1 flex items-center justify-center gap-2 bg-background hover:bg-[#e0e0e0] text-text-primary font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    Sonlandır
                  </button>
                )}
                <button
                  onClick={() => handleDelete(campaign.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#fee2e2] hover:bg-[#fecaca] text-[#b91c1c] font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  Sil
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="bg-surface rounded-lg border border-border p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-background rounded-full">
              <Megaphone size={48} className="text-primary" />
            </div>
          </div>
          <p className="text-lg font-bold text-text-primary">Henüz kampanya yok</p>
          <p className="text-text-muted mt-2 mb-4">
            Yeni bir reklam kampanyası başlatarak işletmenizi daha fazla kişiye ulaştırın
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            <Plus size={18} />
            İlk Kampanyayı Oluştur
          </button>
        </div>
      )}
    </div>
  );
}
