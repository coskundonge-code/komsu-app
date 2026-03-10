'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface Business {
  id: string;
  name: string;
  owner: string;
  category: string;
  package: 'Ücretsiz' | 'Temel' | 'Profesyonel' | 'Premium';
  verificationStatus: 'doğrulanmış' | 'beklemede' | 'reddedildi';
  rating: number;
  reviews: number;
  listingCount: number;
  joinDate: string;
  revenue: number;
  phone: string;
  status: 'aktif' | 'askıya alındı';
}

const MOCK_BUSINESSES: Business[] = [
  {
    id: '1',
    name: 'Özgür Elektrik',
    owner: 'Özgür Y.',
    category: 'Elektrik',
    package: 'Premium',
    verificationStatus: 'doğrulanmış',
    rating: 4.8,
    reviews: 47,
    listingCount: 156,
    joinDate: '2023-01-15',
    revenue: 25000,
    phone: '+90-5XX-XXX-XXXX',
    status: 'aktif',
  },
  {
    id: '2',
    name: 'Ayakkabı Tamircisi Ali',
    owner: 'Ali K.',
    category: 'Tamirci',
    package: 'Temel',
    verificationStatus: 'doğrulanmış',
    rating: 4.6,
    reviews: 28,
    listingCount: 45,
    joinDate: '2023-03-20',
    revenue: 8500,
    phone: '+90-5XX-XXX-XXXX',
    status: 'aktif',
  },
  {
    id: '3',
    name: 'Bahçe Tasarımı Pro',
    owner: 'Mehmet G.',
    category: 'Bahçe',
    package: 'Profesyonel',
    verificationStatus: 'doğrulanmış',
    rating: 4.7,
    reviews: 32,
    listingCount: 89,
    joinDate: '2023-05-10',
    revenue: 16200,
    phone: '+90-5XX-XXX-XXXX',
    status: 'aktif',
  },
  {
    id: '4',
    name: 'Temizlik Şirketi Temizim',
    owner: 'Fatma D.',
    category: 'Temizlik',
    package: 'Premium',
    verificationStatus: 'doğrulanmış',
    rating: 4.5,
    reviews: 54,
    listingCount: 234,
    joinDate: '2023-02-08',
    revenue: 31500,
    phone: '+90-5XX-XXX-XXXX',
    status: 'aktif',
  },
  {
    id: '5',
    name: 'Kuaför Şiddet',
    owner: 'Şiddet K.',
    category: 'Kuaför',
    package: 'Temel',
    verificationStatus: 'beklemede',
    rating: 4.4,
    reviews: 18,
    listingCount: 34,
    joinDate: '2024-01-30',
    revenue: 5200,
    phone: '+90-5XX-XXX-XXXX',
    status: 'aktif',
  },
  {
    id: '6',
    name: 'Çatı Onarımı Servis',
    owner: 'İbrahim M.',
    category: 'İnşaat',
    package: 'Profesyonel',
    verificationStatus: 'doğrulanmış',
    rating: 4.3,
    reviews: 21,
    listingCount: 67,
    joinDate: '2023-07-22',
    revenue: 12800,
    phone: '+90-5XX-XXX-XXXX',
    status: 'aktif',
  },
  {
    id: '7',
    name: 'Fotoğrafçı Düşle',
    owner: 'Elif S.',
    category: 'Fotoğrafçı',
    package: 'Ücretsiz',
    verificationStatus: 'doğrulanmış',
    rating: 4.9,
    reviews: 63,
    listingCount: 12,
    joinDate: '2023-04-12',
    revenue: 0,
    phone: '+90-5XX-XXX-XXXX',
    status: 'aktif',
  },
  {
    id: '8',
    name: 'Oto Elektrikçi Hasan',
    owner: 'Hasan B.',
    category: 'Otomotiv',
    package: 'Temel',
    verificationStatus: 'reddedildi',
    rating: 3.8,
    reviews: 12,
    listingCount: 23,
    joinDate: '2024-02-15',
    revenue: 3400,
    phone: '+90-5XX-XXX-XXXX',
    status: 'askıya alındı',
  },
  {
    id: '9',
    name: 'Pasta Şefi Aylin',
    owner: 'Aylin T.',
    category: 'Gıda',
    package: 'Profesyonel',
    verificationStatus: 'doğrulanmış',
    rating: 4.7,
    reviews: 44,
    listingCount: 78,
    joinDate: '2023-08-18',
    revenue: 19400,
    phone: '+90-5XX-XXX-XXXX',
    status: 'aktif',
  },
  {
    id: '10',
    name: 'Kuru Temizleme Yıldız',
    owner: 'Yıldız K.',
    category: 'Temizlik',
    package: 'Temel',
    verificationStatus: 'doğrulanmış',
    rating: 4.2,
    reviews: 35,
    listingCount: 56,
    joinDate: '2023-06-05',
    revenue: 6800,
    phone: '+90-5XX-XXX-XXXX',
    status: 'aktif',
  },
  {
    id: '11',
    name: 'Pet Bakımı Fluffy',
    owner: 'Zeynep A.',
    category: 'Hayvan Bakımı',
    package: 'Premium',
    verificationStatus: 'doğrulanmış',
    rating: 4.8,
    reviews: 51,
    listingCount: 145,
    joinDate: '2023-09-10',
    revenue: 27600,
    phone: '+90-5XX-XXX-XXXX',
    status: 'aktif',
  },
  {
    id: '12',
    name: 'İngilizce Öğretimi Deniz',
    owner: 'Deniz Y.',
    category: 'Eğitim',
    package: 'Temel',
    verificationStatus: 'beklemede',
    rating: 4.6,
    reviews: 22,
    listingCount: 38,
    joinDate: '2024-01-20',
    revenue: 4900,
    phone: '+90-5XX-XXX-XXXX',
    status: 'aktif',
  },
];

const PACKAGE_CONFIG = {
  'Ücretsiz': {
    label: 'Ücretsiz',
    color: 'bg-gray-100 text-gray-800',
    price: 0,
  },
  'Temel': {
    label: 'Temel',
    color: 'bg-blue-100 text-blue-800',
    price: 99,
  },
  'Profesyonel': {
    label: 'Profesyonel',
    color: 'bg-green-100 text-green-800',
    price: 249,
  },
  'Premium': {
    label: 'Premium',
    color: 'bg-purple-100 text-purple-800',
    price: 499,
  },
};

const VERIFICATION_CONFIG = {
  doğrulanmış: { label: 'Doğrulanmış', color: 'bg-green-100 text-green-800', icon: '✓' },
  beklemede: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  reddedildi: { label: 'Reddedildi', color: 'bg-red-100 text-red-800', icon: '✕' },
};

export default function IsletmelerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [packageFilter, setPackageFilter] = useState<string>('');
  const [verificationFilter, setVerificationFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionModal, setActionModal] = useState<{
    open: boolean;
    business: Business | null;
    action: string;
  }>({ open: false, business: null, action: '' });

  const itemsPerPage = 10;

  const filteredBusinesses = useMemo(() => {
    return MOCK_BUSINESSES.filter((business) => {
      const matchesSearch =
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.owner.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPackage = !packageFilter || business.package === packageFilter;
      const matchesVerification =
        !verificationFilter || business.verificationStatus === verificationFilter;
      return matchesSearch && matchesPackage && matchesVerification;
    });
  }, [searchTerm, packageFilter, verificationFilter]);

  const paginatedBusinesses = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredBusinesses.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredBusinesses, currentPage]);

  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);

  const totalRevenue = MOCK_BUSINESSES.reduce((sum, b) => sum + b.revenue, 0);
  const monthlyRevenue = totalRevenue * 0.8;
  const weeklyRevenue = monthlyRevenue * 0.25;

  const stats = [
    {
      title: 'Aylık Gelir',
      value: `₺${(monthlyRevenue / 1000).toFixed(1)}K`,
      icon: '💰',
      color: '#00833e',
    },
    {
      title: 'Haftalık Gelir',
      value: `₺${(weeklyRevenue / 1000).toFixed(1)}K`,
      icon: '📈',
      color: '#4CAF50',
    },
    {
      title: 'Toplam İşletme',
      value: MOCK_BUSINESSES.length,
      icon: '🏪',
      color: '#2196F3',
    },
    {
      title: 'Doğrulanmış',
      value: MOCK_BUSINESSES.filter((b) => b.verificationStatus === 'doğrulanmış').length,
      icon: '✓',
      color: '#FF9800',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">İşletme Yönetimi</h1>
        <p className="text-gray-600">
          İşletme aboneliklerini, doğrulamalarını ve gelirlerini yönetin
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg border border-[#e0e0e0]">
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
      <div className="bg-white p-6 rounded-lg border border-[#e0e0e0] mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="İşletme adı veya sahibi ara..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
              />
            </div>
          </div>
          <select
            value={packageFilter}
            onChange={(e) => {
              setPackageFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
          >
            <option value="">Tüm Paketler</option>
            {Object.entries(PACKAGE_CONFIG).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
          <select
            value={verificationFilter}
            onChange={(e) => {
              setVerificationFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
          >
            <option value="">Tüm Doğrulamalar</option>
            {Object.entries(VERIFICATION_CONFIG).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Businesses Table */}
      <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e0e0e0] bg-[#f0f2f5]">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  İşletme
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Paket
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Doğrulama
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  İlanlar
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Gelir
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedBusinesses.map((business) => {
                const packageConfig = PACKAGE_CONFIG[business.package];
                const verificationConfig = VERIFICATION_CONFIG[business.verificationStatus];
                return (
                  <tr
                    key={business.id}
                    className="border-b border-[#e0e0e0] hover:bg-[#f0f2f5]"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{business.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{business.owner}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${packageConfig.color}`}
                      >
                        {packageConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${verificationConfig.color}`}
                      >
                        {verificationConfig.icon} {verificationConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star size={16} className="fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-gray-900">{business.rating}</span>
                        <span className="text-xs text-gray-500">({business.reviews})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-medium">{business.listingCount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-medium">₺{business.revenue.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          setActionModal({
                            open: true,
                            business,
                            action: 'view',
                          })
                        }
                        className="text-[#00833e] hover:text-[#006b32] font-medium text-sm"
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#e0e0e0]">
          <span className="text-sm text-gray-600">
            {filteredBusinesses.length === 0 ? (
              'Sonuç bulunamadı'
            ) : (
              <>
                Sayfa {currentPage} / {totalPages} ({filteredBusinesses.length} işletme)
              </>
            )}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-[#f0f2f5] rounded-lg disabled:opacity-50 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-[#f0f2f5] rounded-lg disabled:opacity-50 transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {actionModal.open && actionModal.business && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-[#e0e0e0] flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900">İşletme Detayı</h2>
              <button
                onClick={() => setActionModal({ open: false, business: null, action: '' })}
                className="text-gray-500 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 font-semibold">İşletme Adı</p>
                <p className="text-gray-900 mt-1">{actionModal.business.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Sahibi</p>
                  <p className="text-gray-900 mt-1">{actionModal.business.owner}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Kategori</p>
                  <p className="text-gray-900 mt-1">{actionModal.business.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Paket</p>
                  <p className="text-gray-900 mt-1">{actionModal.business.package}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Doğrulama</p>
                  <p className="text-gray-900 mt-1">{actionModal.business.verificationStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Rating</p>
                  <p className="text-gray-900 mt-1">{actionModal.business.rating} ⭐</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Katılım Tarihi</p>
                  <p className="text-gray-900 mt-1">{actionModal.business.joinDate}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[#e0e0e0] flex gap-3">
              <button
                onClick={() => setActionModal({ open: false, business: null, action: '' })}
                className="flex-1 px-4 py-2 border border-[#e0e0e0] rounded-lg text-gray-900 font-medium hover:bg-[#f0f2f5]"
              >
                Kapat
              </button>
              {actionModal.business.verificationStatus === 'beklemede' && (
                <>
                  <button
                    onClick={() => setActionModal({ open: false, business: null, action: '' })}
                    className="flex-1 px-4 py-2 bg-[#00833e] text-white rounded-lg font-medium hover:bg-[#006b32]"
                  >
                    Onayla
                  </button>
                  <button
                    onClick={() => setActionModal({ open: false, business: null, action: '' })}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                  >
                    Reddet
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
