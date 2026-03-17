'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Calendar,
  DollarSign,
} from 'lucide-react';

interface Payment {
  id: string;
  transactionId: string;
  user: string;
  amount: number;
  type: 'İlan Ücreti' | 'İlan Öne Çıkar' | 'İşletme Aboneliği' | 'Premium Hizmet';
  status: 'tamamlandı' | 'bekleniyor' | 'iade edildi' | 'başarısız';
  date: string;
  paymentMethod: string;
  description: string;
}

const MOCK_PAYMENTS: Payment[] = [
  {
    id: '1',
    transactionId: 'TXN-2024-0001',
    user: 'Ahmet K.',
    amount: 250,
    type: 'İlan Ücreti',
    status: 'tamamlandı',
    date: '2024-03-10 14:30',
    paymentMethod: 'Kredi Kartı',
    description: '3 ay satılık ilan',
  },
  {
    id: '2',
    transactionId: 'TXN-2024-0002',
    user: 'Fatma D.',
    amount: 150,
    type: 'İlan Öne Çıkar',
    status: 'tamamlandı',
    date: '2024-03-10 12:15',
    paymentMethod: 'Kredi Kartı',
    description: 'İlan öne çıkar (7 gün)',
  },
  {
    id: '3',
    transactionId: 'TXN-2024-0003',
    user: 'Özgür Elektrik',
    amount: 249,
    type: 'İşletme Aboneliği',
    status: 'tamamlandı',
    date: '2024-03-10 10:45',
    paymentMethod: 'Banka Transferi',
    description: 'Profesyonel paket aylık',
  },
  {
    id: '4',
    transactionId: 'TXN-2024-0004',
    user: 'Zeynep A.',
    amount: 250,
    type: 'İlan Ücreti',
    status: 'bekleniyor',
    date: '2024-03-10 08:20',
    paymentMethod: 'Kredi Kartı',
    description: '3 ay kiralık ilan',
  },
  {
    id: '5',
    transactionId: 'TXN-2024-0005',
    user: 'İbrahim M.',
    amount: 499,
    type: 'İşletme Aboneliği',
    status: 'tamamlandı',
    date: '2024-03-09 16:00',
    paymentMethod: 'Kredi Kartı',
    description: 'Premium paket aylık',
  },
  {
    id: '6',
    transactionId: 'TXN-2024-0006',
    user: 'Elif Y.',
    amount: 250,
    type: 'İlan Ücreti',
    status: 'iade edildi',
    date: '2024-03-09 14:30',
    paymentMethod: 'Kredi Kartı',
    description: 'İlan iptal iadesi',
  },
  {
    id: '7',
    transactionId: 'TXN-2024-0007',
    user: 'Mustafa T.',
    amount: 100,
    type: 'Premium Hizmet',
    status: 'tamamlandı',
    date: '2024-03-09 12:00',
    paymentMethod: 'Kredi Kartı',
    description: 'AI yardımcı paketi',
  },
  {
    id: '8',
    transactionId: 'TXN-2024-0008',
    user: 'Ayşe S.',
    amount: 150,
    type: 'İlan Öne Çıkar',
    status: 'başarısız',
    date: '2024-03-09 10:15',
    paymentMethod: 'Kredi Kartı',
    description: 'Kart reddedildi',
  },
  {
    id: '9',
    transactionId: 'TXN-2024-0009',
    user: 'Hasan B.',
    amount: 99,
    type: 'İşletme Aboneliği',
    status: 'tamamlandı',
    date: '2024-03-08 16:45',
    paymentMethod: 'Banka Transferi',
    description: 'Temel paket aylık',
  },
  {
    id: '10',
    transactionId: 'TXN-2024-0010',
    user: 'Cengiz K.',
    amount: 250,
    type: 'İlan Ücreti',
    status: 'tamamlandı',
    date: '2024-03-08 14:20',
    paymentMethod: 'Kredi Kartı',
    description: '3 ay hibe ilan',
  },
  {
    id: '11',
    transactionId: 'TXN-2024-0011',
    user: 'Demet N.',
    amount: 150,
    type: 'İlan Öne Çıkar',
    status: 'tamamlandı',
    date: '2024-03-08 11:30',
    paymentMethod: 'Kredi Kartı',
    description: 'İlan öne çıkar (7 gün)',
  },
  {
    id: '12',
    transactionId: 'TXN-2024-0012',
    user: 'Serkan H.',
    amount: 250,
    type: 'İlan Ücreti',
    status: 'tamamlandı',
    date: '2024-03-07 16:15',
    paymentMethod: 'Kredi Kartı',
    description: '3 ay satılık ilan',
  },
  {
    id: '13',
    transactionId: 'TXN-2024-0013',
    user: 'Kemal A.',
    amount: 249,
    type: 'İşletme Aboneliği',
    status: 'bekleniyor',
    date: '2024-03-07 13:45',
    paymentMethod: 'Kredi Kartı',
    description: 'Profesyonel paket aylık',
  },
  {
    id: '14',
    transactionId: 'TXN-2024-0014',
    user: 'Yusuf P.',
    amount: 100,
    type: 'Premium Hizmet',
    status: 'tamamlandı',
    date: '2024-03-07 10:00',
    paymentMethod: 'Kredi Kartı',
    description: 'AI yardımcı paketi',
  },
  {
    id: '15',
    transactionId: 'TXN-2024-0015',
    user: 'Ali K.',
    amount: 499,
    type: 'İşletme Aboneliği',
    status: 'tamamlandı',
    date: '2024-03-06 15:30',
    paymentMethod: 'Banka Transferi',
    description: 'Premium paket aylık',
  },
  {
    id: '16',
    transactionId: 'TXN-2024-0016',
    user: 'Mehmet G.',
    amount: 250,
    type: 'İlan Ücreti',
    status: 'iade edildi',
    date: '2024-03-06 12:00',
    paymentMethod: 'Kredi Kartı',
    description: 'Müşteri talebi iadesi',
  },
  {
    id: '17',
    transactionId: 'TXN-2024-0017',
    user: 'Temizim Şirketi',
    amount: 150,
    type: 'İlan Öne Çıkar',
    status: 'tamamlandı',
    date: '2024-03-06 09:30',
    paymentMethod: 'Kredi Kartı',
    description: 'İlan öne çıkar (7 gün)',
  },
  {
    id: '18',
    transactionId: 'TXN-2024-0018',
    user: 'Şiddet K.',
    amount: 99,
    type: 'İşletme Aboneliği',
    status: 'başarısız',
    date: '2024-03-05 16:00',
    paymentMethod: 'Kredi Kartı',
    description: 'Kart sınırı aşıldı',
  },
  {
    id: '19',
    transactionId: 'TXN-2024-0019',
    user: 'Fotoğrafçı Düşle',
    amount: 250,
    type: 'İlan Ücreti',
    status: 'tamamlandı',
    date: '2024-03-05 13:15',
    paymentMethod: 'Kredi Kartı',
    description: '3 ay hizmet ilan',
  },
  {
    id: '20',
    transactionId: 'TXN-2024-0020',
    user: 'Pasta Şefi Aylin',
    amount: 249,
    type: 'İşletme Aboneliği',
    status: 'tamamlandı',
    date: '2024-03-05 10:45',
    paymentMethod: 'Kredi Kartı',
    description: 'Profesyonel paket aylık',
  },
];

const STATUS_CONFIG = {
  tamamlandı: { label: 'Tamamlandı', color: 'bg-green-100 text-green-800', icon: '✓' },
  bekleniyor: { label: 'Bekleniyor', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  'iade edildi': { label: 'İade Edildi', color: 'bg-blue-100 text-blue-800', icon: '↩️' },
  başarısız: { label: 'Başarısız', color: 'bg-red-100 text-red-800', icon: '✕' },
};

const TYPE_COLORS: Record<string, string> = {
  'İlan Ücreti': 'bg-purple-100 text-purple-800',
  'İlan Öne Çıkar': 'bg-blue-100 text-blue-800',
  'İşletme Aboneliği': 'bg-green-100 text-green-800',
  'Premium Hizmet': 'bg-orange-100 text-orange-800',
};

export default function OdemelerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const itemsPerPage = 10;

  const filteredPayments = useMemo(() => {
    return MOCK_PAYMENTS.filter((payment) => {
      const matchesSearch =
        payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !typeFilter || payment.type === typeFilter;
      const matchesStatus = !statusFilter || payment.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, typeFilter, statusFilter]);

  const paginatedPayments = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredPayments.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredPayments, currentPage]);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const completedPayments = MOCK_PAYMENTS.filter((p) => p.status === 'tamamlandı');
  const dailyRevenue = completedPayments.filter((p) => p.date.startsWith('2024-03-10')).reduce((sum, p) => sum + p.amount, 0);
  const weeklyRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const monthlyRevenue = weeklyRevenue * 2.5;

  const stats = [
    {
      title: 'Günlük Gelir',
      value: `₺${dailyRevenue.toLocaleString()}`,
      icon: '📊',
      color: '#00833e',
    },
    {
      title: 'Haftalık Gelir',
      value: `₺${weeklyRevenue.toLocaleString()}`,
      icon: '📈',
      color: '#4CAF50',
    },
    {
      title: 'Aylık Gelir',
      value: `₺${monthlyRevenue.toLocaleString()}`,
      icon: '💰',
      color: '#2196F3',
    },
    {
      title: 'Toplam İşlem',
      value: MOCK_PAYMENTS.length,
      icon: '🔄',
      color: '#FF9800',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ödeme Yönetimi</h1>
        <p className="text-gray-600">
          Tüm ödeme işlemlerini takip edin ve gelir istatistiklerini görüntüleyin
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
                placeholder="Kullanıcı veya işlem ID ara..."
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
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
          >
            <option value="">Tüm Türler</option>
            <option value="İlan Ücreti">İlan Ücreti</option>
            <option value="İlan Öne Çıkar">İlan Öne Çıkar</option>
            <option value="İşletme Aboneliği">İşletme Aboneliği</option>
            <option value="Premium Hizmet">Premium Hizmet</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
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

      {/* Payments Table */}
      <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e0e0e0] bg-[#f0f2f5]">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  İşlem ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Miktar
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Tür
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.map((payment) => {
                const statusConfig = STATUS_CONFIG[payment.status];
                const typeColor = TYPE_COLORS[payment.type] || 'bg-gray-100 text-gray-800';
                return (
                  <tr
                    key={payment.id}
                    className="border-b border-[#e0e0e0] hover:bg-[#f0f2f5]"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono font-medium text-gray-900">
                        {payment.transactionId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{payment.user}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">₺{payment.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColor}`}>
                        {payment.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                      >
                        {statusConfig.icon} {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{payment.date}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedPayment(payment)}
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
            {filteredPayments.length === 0 ? (
              'Sonuç bulunamadı'
            ) : (
              <>
                Sayfa {currentPage} / {totalPages} ({filteredPayments.length} ödeme)
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
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-[#e0e0e0] flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900">Ödeme Detayı</h2>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-gray-500 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-semibold">İşlem ID</p>
                  <p className="text-gray-900 mt-1 font-mono">{selectedPayment.transactionId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Miktar</p>
                  <p className="text-gray-900 mt-1 font-bold">₺{selectedPayment.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Kullanıcı</p>
                  <p className="text-gray-900 mt-1">{selectedPayment.user}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Tür</p>
                  <p className="text-gray-900 mt-1">{selectedPayment.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Durum</p>
                  <p className="text-gray-900 mt-1">{STATUS_CONFIG[selectedPayment.status].label}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Ödeme Yöntemi</p>
                  <p className="text-gray-900 mt-1">{selectedPayment.paymentMethod}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 font-semibold">Açıklama</p>
                  <p className="text-gray-900 mt-1">{selectedPayment.description}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 font-semibold">Tarih</p>
                  <p className="text-gray-900 mt-1">{selectedPayment.date}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[#e0e0e0]">
              <button
                onClick={() => setSelectedPayment(null)}
                className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg text-gray-900 font-medium hover:bg-[#f0f2f5]"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
