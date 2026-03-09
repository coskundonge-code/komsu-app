'use client';

import { useState } from 'react';
import { Trash2, Edit, Plus, Eye, MessageCircle, MapPin, Heart, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

const tabs = [
  { id: 'all', label: 'Tümü' },
  { id: 'active', label: 'Aktif' },
  { id: 'sold', label: 'Satıldı' },
  { id: 'expired', label: 'Süresi Doldu' },
];

const mockListings = [
  {
    id: '1',
    title: 'MacBook Pro 14" M3 - Açılmamış',
    price: 45000,
    image: 'https://picsum.photos/400/400?random=1',
    status: 'active',
    createdAt: '2026-03-08',
    views: 245,
    messages: 12,
    favorites: 34,
  },
  {
    id: '2',
    title: 'IKEA Kallax Raf - Beyaz, Orta Boy',
    price: 800,
    image: 'https://picsum.photos/400/400?random=2',
    status: 'active',
    createdAt: '2026-03-07',
    views: 156,
    messages: 5,
    favorites: 12,
  },
  {
    id: '3',
    title: 'Dyson V15 Detect Süpürge - Siyah',
    price: 22000,
    image: 'https://picsum.photos/400/400?random=3',
    status: 'sold',
    createdAt: '2026-03-05',
    views: 423,
    messages: 34,
    favorites: 78,
  },
  {
    id: '4',
    title: 'Herman Miller Aeron Sandalye',
    price: 8500,
    image: 'https://picsum.photos/400/400?random=4',
    status: 'active',
    createdAt: '2026-03-06',
    views: 289,
    messages: 18,
    favorites: 45,
  },
  {
    id: '5',
    title: 'Sony WH-1000XM5 Kulaklık - Gümüş',
    price: 3500,
    image: 'https://picsum.photos/400/400?random=5',
    status: 'expired',
    createdAt: '2026-02-20',
    views: 612,
    messages: 42,
    favorites: 89,
  },
  {
    id: '6',
    title: 'Vintage Türk Halısı - 2x3m',
    price: 5200,
    image: 'https://picsum.photos/400/400?random=6',
    status: 'active',
    createdAt: '2026-03-09',
    views: 89,
    messages: 3,
    favorites: 8,
  },
  {
    id: '7',
    title: 'iPhone 14 Pro Max - 256GB, Mor',
    price: 18000,
    image: 'https://picsum.photos/400/400?random=7',
    status: 'sold',
    createdAt: '2026-03-04',
    views: 567,
    messages: 28,
    favorites: 92,
  },
  {
    id: '8',
    title: 'Studio Yoğun Isıtıcı - Metal, Siyah',
    price: 1200,
    image: 'https://picsum.photos/400/400?random=8',
    status: 'active',
    createdAt: '2026-03-09',
    views: 34,
    messages: 1,
    favorites: 3,
  },
];

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { label: string; color: string }> = {
    active: { label: 'Aktif', color: 'bg-green-100 text-[#00833e]' },
    sold: { label: 'Satıldı', color: 'bg-blue-100 text-blue-700' },
    expired: { label: 'Süresi Doldu', color: 'bg-gray-100 text-[#8f8f8f]' },
  };
  const badge = statusMap[status] || statusMap.active;
  return { label: badge.label, color: badge.color };
};

export default function MyListingsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = mockListings.filter((listing) => {
    if (activeTab === 'all') return true;
    return listing.status === activeTab;
  });

  const handleDelete = (id: string) => {
    setDeletingId(null);
    // Simulate deletion
  };

  const emptyState = filtered.length === 0;

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#8f8f8f] mb-1">Toplam İlan</p>
                <p className="text-2xl font-bold text-[#333]">{mockListings.length}</p>
              </div>
              <div className="w-10 h-10 bg-[#f0f2f5] rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#00833e]" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#8f8f8f] mb-1">Aktif İlanlar</p>
                <p className="text-2xl font-bold text-[#333]">{mockListings.filter(l => l.status === 'active').length}</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#00833e]" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#8f8f8f] mb-1">Satılan</p>
                <p className="text-2xl font-bold text-[#333]">{mockListings.filter(l => l.status === 'sold').length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#8f8f8f] mb-1">Toplam Görüntülenme</p>
                <p className="text-2xl font-bold text-[#333]">{mockListings.reduce((sum, l) => sum + l.views, 0)}</p>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden">
          <div className="p-6">
            {/* Title and Action Button */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-[#333]">İlanlarım</h1>
                <p className="text-[#8f8f8f] text-sm mt-1">Yayınladığınız tüm ilanları buradan yönetebilirsiniz</p>
              </div>
              <Link
                href="/pazar/ilan-ver"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#00833e] text-white rounded-full hover:bg-[#006b32] transition-colors text-sm font-semibold shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Yeni İlan Ver
              </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 border-b border-[#e0e0e0] -mx-6 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-5 py-4 text-sm font-medium border-b-[3px] transition-colors',
                    activeTab === tab.id
                      ? 'text-[#00833e] border-[#00833e]'
                      : 'text-[#8f8f8f] border-transparent hover:text-[#404040]'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {emptyState ? (
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-12 text-center">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 bg-[#f0f2f5] rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-[#8f8f8f]" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-[#333] mb-2">Henüz ilan yok</h3>
            <p className="text-[#8f8f8f] mb-6">
              {activeTab === 'all'
                ? 'Henüz hiç ilan yayınlamadınız.'
                : `Bu kategoride ilan bulunmamaktadır.`}
            </p>
            <Link
              href="/pazar/ilan-ver"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00833e] text-white rounded-full hover:bg-[#006b32] transition-colors font-medium"
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
                  className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden hover:shadow-md transition-shadow group"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-[#f0f2f5]">
                    <Image
                      src={listing.image}
                      alt={listing.title}
                      fill
                      unoptimized
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {/* Status Badge */}
                    <span className={cn('absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold', statusBadge.color)}>
                      {statusBadge.label}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Price */}
                    <div className="mb-2">
                      <span className="text-xl font-bold text-[#333]">₺{listing.price.toLocaleString('tr-TR')}</span>
                    </div>

                    {/* Title */}
                    <p className="text-sm text-[#404040] line-clamp-2 mb-3 leading-snug">{listing.title}</p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs text-[#8f8f8f] mb-4 pb-4 border-b border-[#e0e0e0]">
                      <div className="flex items-center gap-1 bg-[#f0f2f5] px-2 py-1 rounded">
                        <Eye className="w-3.5 h-3.5" />
                        <span className="font-medium">{listing.views}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-[#f0f2f5] px-2 py-1 rounded">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="font-medium">{listing.messages}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-[#f0f2f5] px-2 py-1 rounded">
                        <Heart className="w-3.5 h-3.5" />
                        <span className="font-medium">{listing.favorites}</span>
                      </div>
                      <div className="ml-auto">
                        {new Date(listing.createdAt).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/pazar/ilan/${listing.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#e6f4ec] text-[#00833e] rounded-lg hover:bg-[#d1fae5] transition-colors text-sm font-medium border border-[#b8e6d5]"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Düzenle</span>
                      </Link>
                      {listing.status === 'active' && (
                        <button
                          onClick={() => setDeletingId(listing.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium border border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Sil</span>
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
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl border border-[#e0e0e0] animate-in fade-in duration-200">
              <h3 className="text-lg font-bold text-[#333] mb-2">İlanı Sil</h3>
              <p className="text-[#8f8f8f] mb-6">Bu işlem geri alınamaz. İlanı silmek istediğinizden emin misiniz?</p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-red-700">
                  <span className="font-semibold">Uyarı:</span> Bu ilanla ilgili tüm mesajlar ve kaydedilen veriler silinecektir.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 px-4 py-2.5 border border-[#e0e0e0] text-[#333] rounded-lg hover:bg-[#f0f2f5] transition-colors font-medium"
                >
                  İptal
                </button>
                <button
                  onClick={() => handleDelete(deletingId)}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Evet, Sil
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
