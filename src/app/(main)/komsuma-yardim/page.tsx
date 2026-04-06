'use client';

import { useState, useEffect } from 'react';
import { Heart, MapPin, Clock, AlertCircle, Plus, X, Users, HandHeart, ArrowRight } from 'lucide-react';
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
  { id: 'all', label: 'TÃ¼mÃ¼', icon: 'ð ' },
  { id: 'elderly', label: 'YaÅlÄ± BakÄ±m', icon: 'ð´' },
  { id: 'shopping', label: 'AlÄ±ÅveriÅ', icon: 'ð' },
  { id: 'health', label: 'SaÄlÄ±k', icon: 'ð¥' },
  { id: 'household', label: 'Ev Ä°Åleri', icon: 'ð¡' },
  { id: 'transport', label: 'UlaÅÄ±m', icon: 'ð' },
] as const;

const CATEGORY_COLORS: Record<Category, { bg: string; text: string; border: string }> = {
  all: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  elderly: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  shopping: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  health: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  household: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  transport: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
};

const CATEGORY_LABELS: Record<Category, string> = {
  all: 'TÃ¼mÃ¼',
  elderly: 'YaÅlÄ± BakÄ±m',
  shopping: 'AlÄ±ÅveriÅ',
  health: 'SaÄlÄ±k',
  household: 'Ev Ä°Åleri',
  transport: 'UlaÅÄ±m',
};

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return 'az Ã¶nce';
  if (diffH < 24) return `${diffH} saat Ã¶nce`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD} gÃ¼n Ã¶nce`;
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
    if (!user) { setCreateForm(f => ({ ...f, error: 'GiriÅ yapmalÄ±sÄ±nÄ±z.' })); return; }
    if (!createForm.title.trim() || !createForm.description.trim()) {
      setCreateForm(f => ({ ...f, error: 'BaÅlÄ±k ve aÃ§Ä±klama zorunludur.' }));
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
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="bg-surface border-b border-border">
        <div className="px-4 sm:px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <HandHeart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary">KomÅuma YardÄ±m</h1>
                <p className="text-[13px] text-text-muted mt-0.5">KomÅularÄ±nÄ±za yardÄ±m edin veya yardÄ±m isteyin</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover transition-all shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Yeni Talep</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-background rounded-xl">
            <button
              onClick={() => { setActiveTab('requests'); setSelectedCategory('all'); }}
              className={cn(
                'flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all',
                activeTab === 'requests'
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              )}
            >
              YardÄ±m Talepleri
            </button>
            <button
              onClick={() => { setActiveTab('offers'); setSelectedCategory('all'); }}
              className={cn(
                'flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all',
                activeTab === 'offers'
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              )}
            >
              YardÄ±m Teklifleri
            </button>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-surface border-b border-border">
        <div className="px-4 sm:px-6 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as Category)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border',
                  selectedCategory === category.id
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-surface text-text-secondary border-border hover:border-gray-300 hover:bg-surface-hover'
                )}
              >
                <span className="text-base">{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-4 sm:px-6 py-5">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-surface border border-border rounded-xl p-5 animate-pulse">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-6 bg-gray-100 rounded-full w-24" />
                  <div className="h-6 bg-gray-100 rounded-full w-16" />
                </div>
                <div className="h-5 bg-gray-100 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                <div className="h-4 bg-gray-100 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="space-y-3">
            {filteredItems.map((request) => (
              <RequestCard key={request.id} request={request} onHelp={() => handleOfferHelp(request.id)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface rounded-2xl border border-border">
            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-primary/40" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              {activeTab === 'requests' ? 'HenÃ¼z yardÄ±m talebi yok' : 'HenÃ¼z yardÄ±m teklifi yok'}
            </h3>
            <p className="text-sm text-text-muted mb-6 max-w-sm mx-auto">
              {activeTab === 'requests'
                ? 'Ä°lk yardÄ±m talebini oluÅturarak komÅularÄ±nÄ±zdan destek isteyin.'
                : 'KomÅularÄ±nÄ±za yardÄ±m teklif ederek topluluÄunuza katkÄ±da bulunun.'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-all shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              {activeTab === 'requests' ? 'YardÄ±m Talep Et' : 'YardÄ±m Teklif Et'}
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-surface rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg p-0 max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-bold text-text-primary">
                {activeTab === 'requests' ? 'YardÄ±m Talep Et' : 'YardÄ±m Teklif Et'}
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-surface-hover rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Kategori</label>
                <select
                  value={createForm.category}
                  onChange={e => setCreateForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="general">Genel</option>
                  <option value="elderly">YaÅlÄ± BakÄ±m</option>
                  <option value="shopping">AlÄ±ÅveriÅ</option>
                  <option value="health">SaÄlÄ±k</option>
                  <option value="household">Ev Ä°Åleri</option>
                  <option value="transport">UlaÅÄ±m</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">BaÅlÄ±k</label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={e => setCreateForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="KÄ±sa bir baÅlÄ±k girin..."
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">AÃ§Ä±klama</label>
                <textarea
                  value={createForm.description}
                  onChange={e => setCreateForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="DetaylarÄ± aÃ§Ä±klayÄ±n..."
                  rows={4}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </div>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-surface-hover cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={createForm.is_urgent}
                  onChange={e => setCreateForm(f => ({ ...f, is_urgent: e.target.checked }))}
                  className="w-4 h-4 accent-primary rounded"
                />
                <span className="flex items-center gap-2 text-sm text-text-primary">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  Acil yardÄ±m gerekiyor
                </span>
              </label>

              {createForm.error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{createForm.error}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-border bg-surface-hover/50">
              <button
                onClick={handleCreate}
                disabled={createForm.submitting}
                className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-all disabled:opacity-50 shadow-sm"
              >
                {createForm.submitting ? 'Kaydediliyor...' : 'GÃ¶nder'}
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
    <div className="bg-surface border border-border rounded-xl p-5 hover:shadow-md transition-all group">
      {/* Top row: category + urgency */}
      <div className="flex items-center gap-2 mb-3">
        <span className={cn('px-3 py-1 rounded-full text-xs font-semibold border', colors.bg, colors.text, colors.border)}>
          {CATEGORY_LABELS[request.category]}
        </span>
        {request.urgency === 'acil' && (
          <span className="flex items-center gap-1 px-3 py-1 bg-red-50 border border-red-200 rounded-full">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            <span className="text-xs font-semibold text-red-600">Acil</span>
          </span>
        )}
      </div>

      {/* Title & description */}
      <h3 className="text-[16px] font-bold text-text-primary mb-1.5 group-hover:text-primary transition-colors">
        {request.title}
      </h3>
      <p className="text-text-secondary text-[14px] leading-relaxed mb-4 line-clamp-2">{request.description}</p>

      {/* Meta info */}
      <div className="flex items-center gap-4 mb-4 text-[13px] text-text-muted">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          <span>{request.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>{request.postedTime}</span>
        </div>
        {request.helpers && request.helpers > 0 ? (
          <div className="flex items-center gap-1.5 text-primary">
            <Users className="w-3.5 h-3.5" />
            <span className="font-medium">{request.helpers} yardÄ±mcÄ±</span>
          </div>
        ) : null}
      </div>

      {/* Action */}
      <button
        onClick={onHelp}
        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary/5 text-primary font-semibold text-sm rounded-xl hover:bg-primary hover:text-white transition-all border border-primary/20 hover:border-primary"
      >
        <HandHeart className="w-4 h-4" />
        YardÄ±m Et
        <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
      </button>
    </div>
  );
}
