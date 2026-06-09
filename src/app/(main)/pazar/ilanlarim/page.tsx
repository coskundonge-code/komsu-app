'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trash2, Plus, Eye, MapPin, TrendingUp, MessageCircle, Package, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useCurrentUser } from '@/lib/hooks/use-auth';
import { deleteListing } from '@/lib/hooks/use-listings';

// NOT (2026-06-07): Bu sayfa eskiden 8 sahte ilan (mockListings + demo-images + uydurma
// görüntülenme/mesaj/favori sayıları) gösteriyor, "Sil" düğmesi de hiçbir şey yapmıyordu
// (// Simulate deletion). Artık giriş yapan kullanıcının GERÇEK ilanlarını (seller_id)
// çekiyor, istatistikler gerçek view_count + statülerden hesaplanıyor ve "Sil" gerçek
// soft-delete (status → expired) yapıyor. Bkz. TECH_DEBT #12.

const tabs = [
  { id: 'all', label: 'Tümü' },
  { id: 'active', label: 'Aktif' },
  { id: 'sold', label: 'Satıldı' },
  { id: 'expired', label: 'Süresi Doldu' },
];

interface MyListing {
  id: string;
  title: string;
  price: number;
  image: string | null;
  status: string;
  createdAt: string | null;
  views: number;
}

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { label: string; color: string }> = {
    active: { label: 'Aktif', color: 'bg-green-100 text-primary' },
    sold: { label: 'Satıldı', color: 'bg-blue-100 text-blue-700' },
    reserved: { label: 'Rezerve', color: 'bg-amber-100 text-amber-700' },
    expired: { label: 'Süresi Doldu', color: 'bg-gray-100 text-text-muted' },
  };
  const badge = statusMap[status] || statusMap.active;
  return { label: badge.label, color: badge.color };
};

export default function MyListingsPage() {
  const { user } = useCurrentUser();
  const [activeTab, setActiveTab] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [listings, setListings] = useState<MyListing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyListings = useCallback(async () => {
    if (!user?.id) {
      setListings([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const supabase = createClient() as any;
    const { data } = await supabase
      .from('listings')
      .select('id, title, price, media_urls, status, created_at, view_count')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    setListings(
      (data || []).map((l: any) => ({
        id: l.id,
        title: l.title || 'Başlıksız İlan',
        price: l.price || 0,
        image: l.media_urls && l.media_urls.length > 0 ? l.media_urls[0] : null,
        status: l.status || 'active',
        createdAt: l.created_at,
        views: l.view_count || 0,
      }))
    );
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cancelled) await fetchMyListings();
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchMyListings]);

  const filtered = listings.filter((listing) => {
    if (activeTab === 'all') return true;
    return listing.status === activeTab;
  });

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    const { error } = await deleteListing(id);
    if (!error) {
      // Soft-delete: status → expired. Listeyi tazele.
      setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'expired' } : l)));
    }
    setIsDeleting(false);
    setDeletingId(null);
  };

  const totalCount = listings.length;
  const activeCount = listings.filter((l) => l.status === 'active').length;
  const soldCount = listings.filter((l) => l.status === 'sold').length;
  const totalViews = listings.reduce((sum, l) => sum + l.views, 0);

  const emptyState = !loading && filtered.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface rounded-lg border border-border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted mb-1">Toplam İlan</p>
                <p className="text-2xl font-bold text-text-primary">{totalCount}</p>
              </div>
              <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-lg border border-border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted mb-1">Aktif İlanlar</p>
                <p className="text-2xl font-bold text-text-primary">{activeCount}</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-lg border border-border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted mb-1">Satılan</p>
                <p className="text-2xl font-bold text-text-primary">{soldCount}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-lg border border-border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted mb-1">Toplam Görüntülenme</p>
                <p className="text-2xl font-bold text-text-primary">{totalViews}</p>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="p-6">
            {/* Title and Action Button */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-text-primary">İlanlarım</h1>
                <p className="text-text-muted text-sm mt-1">Yayınladığınız tüm ilanları buradan yönetebilirsiniz</p>
              </div>
              <Link
                href="/pazar/ilan-ver"
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors text-sm font-semibold shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Yeni İlan Ver
              </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 border-b border-border -mx-6 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-5 py-4 text-sm font-medium border-b-[3px] transition-colors whitespace-nowrap',
                    activeTab === tab.id
                      ? 'text-primary border-primary'
                      : 'text-text-muted border-transparent hover:text-text-secondary'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading / Empty / Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : emptyState ? (
          <div className="bg-surface rounded-lg shadow-sm border border-border p-12 text-center">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-text-muted" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Henüz ilan yok</h3>
            <p className="text-text-muted mb-6">
              {activeTab === 'all'
                ? 'Henüz hiç ilan yayınlamadınız.'
                : 'Bu kategoride ilan bulunmamaktadır.'}
            </p>
            <Link
              href="/pazar/ilan-ver"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              İlk İlanınızı Oluşturun
            </Link>
          </div>
        ) : (
          /* Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((listing) => {
              const statusBadge = getStatusBadge(listing.status);

              return (
                <div
                  key={listing.id}
                  className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow group"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-background">
                    {listing.image ? (
                      <Image
                        src={listing.image}
                        alt={listing.title}
                        fill
                        unoptimized
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted">
                        <Package className="w-10 h-10" />
                      </div>
                    )}
                    {/* Status Badge */}
                    <span className={cn('absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold', statusBadge.color)}>
                      {statusBadge.label}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Price */}
                    <div className="mb-2">
                      <span className="text-xl font-bold text-text-primary">
                        {listing.price > 0 ? `₺${listing.price.toLocaleString('tr-TR')}` : 'Ücretsiz'}
                      </span>
                    </div>

                    {/* Title */}
                    <p className="text-sm text-text-secondary line-clamp-2 mb-3 leading-snug">{listing.title}</p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs text-text-muted mb-4 pb-4 border-b border-border">
                      <div className="flex items-center gap-1 bg-background px-2 py-1 rounded">
                        <Eye className="w-3.5 h-3.5" />
                        <span className="font-medium">{listing.views}</span>
                      </div>
                      {listing.createdAt && (
                        <div className="ml-auto">
                          {new Date(listing.createdAt).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/pazar/ilan/${listing.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-primary-light text-primary rounded-lg hover:bg-primary-light transition-colors text-sm font-medium border border-[#b8e6d5]"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Görüntüle</span>
                      </Link>
                      {listing.status === 'active' && (
                        <button
                          onClick={() => setDeletingId(listing.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium border border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Kaldır</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-surface rounded-lg p-6 max-w-sm w-full shadow-xl border border-border animate-in fade-in duration-200">
              <h3 className="text-lg font-bold text-text-primary mb-2">İlanı Kaldır</h3>
              <p className="text-text-muted mb-6">İlanınız yayından kaldırılacak ve artık görünmeyecek. Devam etmek istiyor musunuz?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingId(null)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 border border-border text-text-primary rounded-lg hover:bg-background transition-colors font-medium disabled:opacity-50"
                >
                  İptal
                </button>
                <button
                  onClick={() => handleDelete(deletingId)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Evet, Kaldır
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
