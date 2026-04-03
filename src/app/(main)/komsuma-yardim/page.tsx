'use client';

import { useState, useEffect } from 'react';
import { Heart, MapPin, Clock, AlertCircle, Plus, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getHelpRequests, createHelpRequest, offerHelp, type HelpRequest as HelpRequestType } from '@/lib/hooks/use-help-requests';
import { useCurrentUser } from '@/lib/hooks/use-auth';

type Tab = 'requests' | 'offers';
type Category = 'all' | 'elderly' | 'shopping' | 'health' | 'household' | 'transport';

interface HelpRequest {
  id: string;
  category: Category;
  title: string;
  description: string;
  location: string;
  postedTime: string;
  urgency: 'acil' | 'normal';
  anonymous: boolean;
  helpers?: number;
}

const CATEGORIES = [
  { id: 'all', label: 'Tümü' },
  { id: 'elderly', label: 'Yaşlı Bakım' },
  { id: 'shopping', label: 'Alışveriş' },
  { id: 'health', label: 'Sağlık' },
  { id: 'household', label: 'Ev İşleri' },
  { id: 'transport', label: 'Ulaşım' },
] as const;

const CATEGORY_COLORS: Record<Category, { bg: string; text: string }> = {
  all: { bg: 'bg-gray-100', text: 'text-gray-700' },
  elderly: { bg: 'bg-purple-100', text: 'text-purple-700' },
  shopping: { bg: 'bg-blue-100', text: 'text-blue-700' },
  health: { bg: 'bg-red-100', text: 'text-red-700' },
  household: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  transport: { bg: 'bg-green-100', text: 'text-green-700' },
};

const CATEGORY_LABELS: Record<Category, string> = {
  all: 'Tümü',
  elderly: 'Yaşlı Bakım',
  shopping: 'Alışveriş',
  health: 'Sağlık',
  household: 'Ev İşleri',
  transport: 'Ulaşım',
};

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return 'az önce';
  if (diffH < 24) return `${diffH} saat önce`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD} gün önce`;
}

function mapDbToLocal(r: HelpRequestType): HelpRequest {
  const categoryMap: Record<string, Category> = {
    elderly: 'elderly', shopping: 'shopping', health: 'health',
    household: 'household', transport: 'transport', general: 'health',
  };
  return {
    id: r.id,
    category: categoryMap[r.category] || 'health',
    title: r.title,
    description: r.description,
    location: 'Mahalleniz',
    postedTime: timeAgo(r.created_at),
    urgency: r.is_urgent ? 'acil' : 'normal',
    anonymous: false,
    helpers: 0,
  };
}

export default function KomsumaYardim() {
  const { user, neighborhood } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<Tab>('requests');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [items, setItems] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create form state
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    category: 'general',
    is_urgent: false,
    submitting: false,
    error: '',
  });

  useEffect(() => {
    fetchItems();
  }, [activeTab, selectedCategory]);

  async function fetchItems() {
    setLoading(true);
    const { data, error } = await getHelpRequests({
      type: activeTab === 'requests' ? 'request' : 'offer',
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      limit: 30,
    });
    if (!error && data && data.length > 0) {
      setItems(data.map(mapDbToLocal));
    } else {
      setItems([]);
    }
    setLoading(false);
  }

  async function handleCreate() {
    if (!user) { setCreateForm(f => ({ ...f, error: 'Giriş yapmalısınız.' })); return; }
    if (!createForm.title.trim() || !createForm.description.trim()) {
      setCreateForm(f => ({ ...f, error: 'Başlık ve açıklama zorunludur.' }));
      return;
    }
    setCreateForm(f => ({ ...f, submitting: true, error: '' }));
    const { data, error } = await createHelpRequest({
      user_id: user.id,
      neighborhood_id: neighborhood?.id,
      type: activeTab === 'requests' ? 'request' : 'offer',
      category: createForm.category,
      title: createForm.title,
      description: createForm.description,
      is_urgent: createForm.is_urgent,
    });
    if (error) {
      setCreateForm(f => ({ ...f, submitting: false, error: 'Kaydedilemedi: ' + error.message }));
      return;
    }
    if (data) {
      const newItem = mapDbToLocal(data as HelpRequestType);
      setItems(prev => [newItem, ...prev]);
    }
    setCreateForm({ title: '', description: '', category: 'general', is_urgent: false, submitting: false, error: '' });
    setShowCreateModal(false);
  }

  async function handleOfferHelp(id: string) {
    if (!user) return;
    await offerHelp(id, user.id);
    setItems(prev => prev.map(r => r.id === id ? { ...r, helpers: (r.helpers || 0) + 1 } : r));
  }

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(r => r.category === selectedCategory);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="border-b border-border bg-surface sticky top-0 z-10">
        <div className="max-w-[680px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-text-primary">Komşuma Yardım</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Plus className="w-6 h-6 text-primary" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => { setActiveTab('requests'); setSelectedCategory('all'); }}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                activeTab === 'requests' ? 'bg-primary text-white' : 'bg-gray-100 text-text-primary hover:bg-gray-200'
              )}
            >
              Yardım Talepleri
            </button>
            <button
              onClick={() => { setActiveTab('offers'); setSelectedCategory('all'); }}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                activeTab === 'offers' ? 'bg-primary text-white' : 'bg-gray-100 text-text-primary hover:bg-gray-200'
              )}
            >
              Yardım Teklifleri
            </button>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="border-b border-border bg-surface">
        <div className="max-w-[680px] mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as Category)}
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[680px] mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-surface border border-border rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full mb-1" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((request) => (
              <RequestCard key={request.id} request={request} onHelp={() => handleOfferHelp(request.id)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-text-secondary mb-4">
              {activeTab === 'requests' ? 'Henüz yardım talebi yok' : 'Henüz yardım teklifi yok'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              {activeTab === 'requests' ? 'Yardım Talep Et' : 'Yardım Teklif Et'}
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-text-primary">
                {activeTab === 'requests' ? 'Yardım Talep Et' : 'Yardım Teklif Et'}
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Kategori</label>
                <select
                  value={createForm.category}
                  onChange={e => setCreateForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="general">Genel</option>
                  <option value="elderly">Yaşlı Bakım</option>
                  <option value="shopping">Alışveriş</option>
                  <option value="health">Sağlık</option>
                  <option value="household">Ev İşleri</option>
                  <option value="transport">Ulaşım</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Başlık</label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={e => setCreateForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Kısa bir başlık girin..."
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Açıklama</label>
                <textarea
                  value={createForm.description}
                  onChange={e => setCreateForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Detayları açıklayın..."
                  rows={4}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={createForm.is_urgent}
                  onChange={e => setCreateForm(f => ({ ...f, is_urgent: e.target.checked }))}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm text-text-primary flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  Acil
                </span>
              </label>

              {createForm.error && (
                <p className="text-sm text-red-600">{createForm.error}</p>
              )}

              <button
                onClick={handleCreate}
                disabled={createForm.submitting}
                className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {createForm.submitting ? 'Kaydediliyor...' : 'Gönder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface RequestCardProps {
  request: HelpRequest;
  onHelp: () => void;
}

function RequestCard({ request, onHelp }: RequestCardProps) {
  const colors = CATEGORY_COLORS[request.category];

  return (
    <div className="bg-surface border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <span className={cn('px-2 py-1 rounded-full text-xs font-semibold', colors.bg, colors.text)}>
          {CATEGORY_LABELS[request.category]}
        </span>
        {request.urgency === 'acil' && (
          <div className="flex items-center gap-1 px-2 py-1 bg-red-50 rounded-full">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-xs font-semibold text-red-600">Acil</span>
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold text-text-primary mb-2">{request.title}</h3>
      <p className="text-text-secondary text-sm mb-3">{request.description}</p>

      <div className="flex items-center gap-4 mb-4 text-xs text-text-secondary">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{request.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{request.postedTime}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 pb-4 border-t border-border">
        <div className="flex items-center gap-2 mt-3">
          {request.helpers && request.helpers > 0 && (
            <div className="flex items-center gap-1 text-xs text-primary">
              <Heart className="w-4 h-4 fill-current" />
              <span className="font-medium">{request.helpers} kişi yardım etmeyi teklif etti</span>
            </div>
          )}
          {request.anonymous && (
            <span className="text-xs text-text-secondary bg-gray-100 px-2 py-1 rounded">Anonim</span>
          )}
        </div>
      </div>

      <button
        onClick={onHelp}
        className="w-full px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors"
      >
        Yardım Et
      </button>
    </div>
  );
}
