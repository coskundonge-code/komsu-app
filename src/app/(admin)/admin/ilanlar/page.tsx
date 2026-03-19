'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Star,
} from 'lucide-react';

interface Listing {
  id: string;
  itemName: string;
  seller: string;
  category: string;
  price: number;
  listingDate: string;
  status: 'aktif' | 'satılmış' | 'süresi geçmiş' | 'onay bekleniyor';
  photos: number;
  views: number;
  favorites: number;
  isFeatured: boolean;
}

const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    itemName: 'Tasarımcı Mobilya Takımı',
    seller: 'Ahmet K.',
    category: 'Mobilya',
    price: 2500,
    listingDate: '2024-03-08',
    status: 'aktif',
    photos: 5,
    views: 234,
    favorites: 12,
    isFeatured: true,
  },
  {
    id: '2',
    itemName: 'Mountain Bike MTB',
    seller: 'Fatma D.',
    category: 'Spor & Outdoor',
    price: 3200,
    listingDate: '2024-03-07',
    status: 'aktif',
    photos: 4,
    views: 167,
    favorites: 8,
    isFeatured: false,
  },
  {
    id: '3',
    itemName: 'Laptop HP Pavillion',
    seller: 'Mustafa T.',
    category: 'Elektronik',
    price: 7500,
    listingDate: '2024-03-06',
    status: 'aktif',
    photos: 6,
    views: 456,
    favorites: 23,
    isFeatured: false,
  },
  {
    id: '4',
    itemName: 'İkinci El Çamaşır Makinesi',
    seller: 'Elif Y.',
    category: 'Beyaz Eşya',
    price: 1200,
    listingDate: '2024-03-05',
    status: 'satılmış',
    photos: 3,
    views: 89,
    favorites: 2,
    isFeatured: false,
  },
  {
    id: '5',
    itemName: 'Kitap Koleksiyonu (50 adet)',
    seller: 'Hasan B.',
    category: 'Kitaplar',
    price: 500,
    listingDate: '2024-03-04',
    status: 'aktif',
    photos: 2,
    views: 45,
    favorites: 1,
    isFeatured: false,
  },
  {
    id: '6',
    itemName: 'Bebek Arabasıve Aksesuar',
    seller: 'Ayşe S.',
    category: 'Bebek & Çocuk',
    price: 1800,
    listingDate: '2024-03-03',
    status: 'süresi geçmiş',
    photos: 4,
    views: 123,
    favorites: 5,
    isFeatured: false,
  },
  {
    id: '7',
    itemName: 'Kamera DSLR Canon',
    seller: 'İbrahim M.',
    category: 'Elektronik',
    price: 4500,
    listingDate: '2024-03-02',
    status: 'aktif',
    photos: 7,
    views: 345,
    favorites: 18,
    isFeatured: true,
  },
  {
    id: '8',
    itemName: 'Masaj Koltuğu',
    seller: 'Zeynep A.',
    category: 'Mobilya',
    price: 3500,
    listingDate: '2024-03-01',
    status: 'onay bekleniyor',
    photos: 3,
    views: 0,
    favorites: 0,
    isFeatured: false,
  },
  {
    id: '9',
    itemName: 'Dişi Kazak Koleksiyonu',
    seller: 'Cengiz K.',
    category: 'Giyim & Aksesuar',
    price: 600,
    listingDate: '2024-02-29',
    status: 'aktif',
    photos: 8,
    views: 234,
    favorites: 14,
    isFeatured: false,
  },
  {
    id: '10',
    itemName: 'Oyun Konsolu PS5',
    seller: 'Demet N.',
    category: 'Elektronik',
    price: 5500,
    listingDate: '2024-02-28',
    status: 'satılmış',
    photos: 4,
    views: 567,
    favorites: 34,
    isFeatured: true,
  },
  {
    id: '11',
    itemName: 'Eski Ahşap Dolap',
    seller: 'Serkan H.',
    category: 'Mobilya',
    price: 800,
    listingDate: '2024-02-27',
    status: 'aktif',
    photos: 2,
    views: 56,
    favorites: 3,
    isFeatured: false,
  },
  {
    id: '12',
    itemName: 'Elektrikli Scooter',
    seller: 'Kemal A.',
    category: 'Taşıt & Parçaları',
    price: 2800,
    listingDate: '2024-02-26',
    status: 'aktif',
    photos: 5,
    views: 412,
    favorites: 21,
    isFeatured: false,
  },
  {
    id: '13',
    itemName: 'Dönüştürülebilir Sofa',
    seller: 'Yusuf P.',
    category: 'Mobilya',
    price: 4200,
    listingDate: '2024-02-25',
    status: 'süresi geçmiş',
    photos: 6,
    views: 289,
    favorites: 16,
    isFeatured: false,
  },
  {
    id: '14',
    itemName: 'Vintage Gramofon',
    seller: 'Ali K.',
    category: 'Koleksiyon',
    price: 1500,
    listingDate: '2024-02-24',
    status: 'aktif',
    photos: 3,
    views: 178,
    favorites: 12,
    isFeatured: false,
  },
  {
    id: '15',
    itemName: 'Havlı Yatağı Seti',
    seller: 'Mehmet G.',
    category: 'Ev & Dekorasyon',
    price: 450,
    listingDate: '2024-02-23',
    status: 'aktif',
    photos: 4,
    views: 92,
    favorites: 4,
    isFeatured: false,
  },
];

const STATUS_CONFIG = {
  aktif: { label: 'Aktif', color: 'bg-green-100 text-green-800' },
  satılmış: { label: 'Satılmış', color: 'bg-blue-100 text-blue-800' },
  'süresi geçmiş': { label: 'Süresi Geçmiş', color: 'bg-gray-100 text-gray-800' },
  'onay bekleniyor': { label: 'Onay Bekleniyor', color: 'bg-yellow-100 text-yellow-800' },
};

const CATEGORIES = [
  'Mobilya',
  'Elektronik',
  'Spor & Outdoor',
  'Beyaz Eşya',
  'Kitaplar',
  'Bebek & Çocuk',
  'Giyim & Aksesuar',
  'Taşıt & Parçaları',
  'Koleksiyon',
  'Ev & Dekorasyon',
];

export default function IlanlarPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const itemsPerPage = 10;

  const filteredListings = useMemo(() => {
    return MOCK_LISTINGS.filter((listing) => {
      const matchesSearch =
        listing.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.seller.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || listing.category === categoryFilter;
      const matchesStatus = !statusFilter || listing.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchTerm, categoryFilter, statusFilter]);

  const paginatedListings = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredListings.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredListings, currentPage]);

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);

  const activeListings = MOCK_LISTINGS.filter((l) => l.status === 'aktif').length;
  const totalViews = MOCK_LISTINGS.reduce((sum, l) => sum + l.views, 0);
  const totalFavorites = MOCK_LISTINGS.reduce((sum, l) => sum + l.favorites, 0);
  const avgPrice = Math.round(MOCK_LISTINGS.reduce((sum, l) => sum + l.price, 0) / MOCK_LISTINGS.length);

  const stats = [
    {
      title: 'Aktif İlanlar',
      value: activeListings,
      icon: '📋',
      color: '#00833e',
    },
    {
      title: 'Toplam Görüntülenme',
      value: totalViews.toLocaleString(),
      icon: '👁️',
      color: '#4CAF50',
    },
    {
      title: 'Toplam Favoriler',
      value: totalFavorites.toLocaleString(),
      icon: '❤️',
      color: '#F44336',
    },
    {
      title: 'Ortalama Fiyat',
      value: `₺${avgPrice.toLocaleString()}`,
      icon: '💰',
      color: '#2196F3',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pazar İlan Yönetimi</h1>
        <p className="text-gray-600">
          Satılık, kiralık ve hibe ilanlarını yönetin, onaylayın ve öne çıkarın
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-surface p-6 rounded-lg border border-border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-2" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </div>
              <div className="text-2xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-surface p-6 rounded-lg border border-border mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="İlan adı veya satıcı ara..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tüm Kategoriler</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tüm Durumlar</option>
            {Object.entries(STATUS_CONFIG).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  İlan
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Fiyat
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  İstatistik
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedListings.map((listing) => {
                const statusConfig = STATUS_CONFIG[listing.status];
                return (
                  <tr
                    key={listing.id}
                    className="border-b border-border hover:bg-background"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          {listing.isFeatured && (
                            <Star
                              size={16}
                              className="fill-yellow-400 text-yellow-400"
                            />
                          )}
                          <p className="font-semibold text-gray-900">
                            {listing.itemName}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {listing.seller} • {listing.listingDate}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{listing.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">₺{listing.price.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                      >
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-3 text-gray-600">
                        <span>📸 {listing.photos}</span>
                        <span>👁️ {listing.views}</span>
                        <span>❤️ {listing.favorites}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedListing(listing)}
                        className="text-primary hover:text-primary-hover font-medium text-sm"
                      >
                        Detay
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <span className="text-sm text-gray-600">
            {filteredListings.length === 0 ? (
              'Sonuç bulunamadı'
            ) : (
              <>
                Sayfa {currentPage} / {totalPages} ({filteredListings.length} ilan)
              </>
            )}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-background rounded-lg disabled:opacity-50 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-background rounded-lg disabled:opacity-50 transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900">İlan Detayı</h2>
              <button
                onClick={() => setSelectedListing(null)}
                className="text-gray-500 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 font-semibold">İlan Adı</p>
                <p className="text-gray-900 mt-1 font-semibold">{selectedListing.itemName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Satıcı</p>
                  <p className="text-gray-900 mt-1">{selectedListing.seller}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Kategori</p>
                  <p className="text-gray-900 mt-1">{selectedListing.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Fiyat</p>
                  <p className="text-gray-900 mt-1 font-bold">₺{selectedListing.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Durum</p>
                  <p className="text-gray-900 mt-1">{STATUS_CONFIG[selectedListing.status].label}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Fotoğraf Sayısı</p>
                  <p className="text-gray-900 mt-1">{selectedListing.photos}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Görüntülenme</p>
                  <p className="text-gray-900 mt-1">{selectedListing.views}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex gap-3">
              <button
                onClick={() => setSelectedListing(null)}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-gray-900 font-medium hover:bg-background"
              >
                Kapat
              </button>
              {selectedListing.status === 'onay bekleniyor' && (
                <>
                  <button
                    onClick={() => setSelectedListing(null)}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover"
                  >
                    Onayla
                  </button>
                  <button
                    onClick={() => setSelectedListing(null)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                  >
                    Reddet
                  </button>
                </>
              )}
              {selectedListing.status === 'aktif' && (
                <button
                  onClick={() => setSelectedListing(null)}
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600"
                >
                  Öne Çıkar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
