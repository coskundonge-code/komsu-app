'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileText,
} from 'lucide-react';

interface VerificationEntry {
  id: string;
  userName: string;
  nvi: string;
  submittedDate: string;
  status: 'onay bekleniyor' | 'doğrulanmış' | 'reddedildi';
  documentPreview: string;
  userEmail: string;
  address: string;
  phoneNumber: string;
}

const MOCK_VERIFICATIONS: VerificationEntry[] = [
  {
    id: '1',
    userName: 'Ahmet K.',
    nvi: 'NVI-2024-0001',
    submittedDate: '2024-03-10 14:30',
    status: 'onay bekleniyor',
    documentPreview: '[e-Devlet İD Belgesi Önizlemesi]',
    userEmail: 'ahmet@example.com',
    address: 'Beşiktaş, İstanbul',
    phoneNumber: '+90-5XX-XXX-XXXX',
  },
  {
    id: '2',
    userName: 'Fatma D.',
    nvi: 'NVI-2024-0002',
    submittedDate: '2024-03-10 12:15',
    status: 'doğrulanmış',
    documentPreview: '[e-Devlet İD Belgesi Önizlemesi]',
    userEmail: 'fatma@example.com',
    address: 'Kadıköy, İstanbul',
    phoneNumber: '+90-5XX-XXX-XXXX',
  },
  {
    id: '3',
    userName: 'Mustafa T.',
    nvi: 'NVI-2024-0003',
    submittedDate: '2024-03-10 10:45',
    status: 'onay bekleniyor',
    documentPreview: '[e-Devlet İD Belgesi Önizlemesi]',
    userEmail: 'mustafa@example.com',
    address: 'Şişli, İstanbul',
    phoneNumber: '+90-5XX-XXX-XXXX',
  },
  {
    id: '4',
    userName: 'Elif Y.',
    nvi: 'NVI-2024-0004',
    submittedDate: '2024-03-10 08:20',
    status: 'reddedildi',
    documentPreview: '[e-Devlet İD Belgesi Önizlemesi]',
    userEmail: 'elif@example.com',
    address: 'Cihangir, İstanbul',
    phoneNumber: '+90-5XX-XXX-XXXX',
  },
  {
    id: '5',
    userName: 'Hasan B.',
    nvi: 'NVI-2024-0005',
    submittedDate: '2024-03-09 16:00',
    status: 'doğrulanmış',
    documentPreview: '[e-Devlet İD Belgesi Önizlemesi]',
    userEmail: 'hasan@example.com',
    address: 'Levent, İstanbul',
    phoneNumber: '+90-5XX-XXX-XXXX',
  },
  {
    id: '6',
    userName: 'Ayşe S.',
    nvi: 'NVI-2024-0006',
    submittedDate: '2024-03-09 14:30',
    status: 'onay bekleniyor',
    documentPreview: '[e-Devlet İD Belgesi Önizlemesi]',
    userEmail: 'ayse@example.com',
    address: 'Fatih, İstanbul',
    phoneNumber: '+90-5XX-XXX-XXXX',
  },
  {
    id: '7',
    userName: 'İbrahim M.',
    nvi: 'NVI-2024-0007',
    submittedDate: '2024-03-09 12:00',
    status: 'doğrulanmış',
    documentPreview: '[e-Devlet İD Belgesi Önizlemesi]',
    userEmail: 'ibrahim@example.com',
    address: 'Moda, İstanbul',
    phoneNumber: '+90-5XX-XXX-XXXX',
  },
  {
    id: '8',
    userName: 'Zeynep A.',
    nvi: 'NVI-2024-0008',
    submittedDate: '2024-03-09 10:15',
    status: 'reddedildi',
    documentPreview: '[e-Devlet İD Belgesi Önizlemesi]',
    userEmail: 'zeynep@example.com',
    address: 'Caferağa, İstanbul',
    phoneNumber: '+90-5XX-XXX-XXXX',
  },
  {
    id: '9',
    userName: 'Cengiz K.',
    nvi: 'NVI-2024-0009',
    submittedDate: '2024-03-08 16:45',
    status: 'onay bekleniyor',
    documentPreview: '[e-Devlet İD Belgesi Önizlemesi]',
    userEmail: 'cengiz@example.com',
    address: 'Beyoğlu, İstanbul',
    phoneNumber: '+90-5XX-XXX-XXXX',
  },
  {
    id: '10',
    userName: 'Demet N.',
    nvi: 'NVI-2024-0010',
    submittedDate: '2024-03-08 14:20',
    status: 'doğrulanmış',
    documentPreview: '[e-Devlet İD Belgesi Önizlemesi]',
    userEmail: 'demet@example.com',
    address: 'Aksaray, İstanbul',
    phoneNumber: '+90-5XX-XXX-XXXX',
  },
  {
    id: '11',
    userName: 'Serkan H.',
    nvi: 'NVI-2024-0011',
    submittedDate: '2024-03-08 11:30',
    status: 'onay bekleniyor',
    documentPreview: '[e-Devlet İD Belgesi Önizlemesi]',
    userEmail: 'serkan@example.com',
    address: 'Sarıyer, İstanbul',
    phoneNumber: '+90-5XX-XXX-XXXX',
  },
  {
    id: '12',
    userName: 'Kemal A.',
    nvi: 'NVI-2024-0012',
    submittedDate: '2024-03-07 16:15',
    status: 'doğrulanmış',
    documentPreview: '[e-Devlet İD Belgesi Önizlemesi]',
    userEmail: 'kemal@example.com',
    address: 'Arnavutköy, İstanbul',
    phoneNumber: '+90-5XX-XXX-XXXX',
  },
  {
    id: '13',
    userName: 'Yusuf P.',
    nvi: 'NVI-2024-0013',
    submittedDate: '2024-03-07 13:45',
    status: 'reddedildi',
    documentPreview: '[e-Devlet İD Belgesi Önizlemesi]',
    userEmail: 'yusuf@example.com',
    address: 'Kâğıthane, İstanbul',
    phoneNumber: '+90-5XX-XXX-XXXX',
  },
  {
    id: '14',
    userName: 'Ali K.',
    nvi: 'NVI-2024-0014',
    submittedDate: '2024-03-07 10:00',
    status: 'onay bekleniyor',
    documentPreview: '[e-Devlet İD Belgesi Önizlemesi]',
    userEmail: 'ali@example.com',
    address: 'Eminönü, İstanbul',
    phoneNumber: '+90-5XX-XXX-XXXX',
  },
  {
    id: '15',
    userName: 'Mehmet G.',
    nvi: 'NVI-2024-0015',
    submittedDate: '2024-03-06 15:30',
    status: 'doğrulanmış',
    documentPreview: '[e-Devlet İD Belgesi Önizlemesi]',
    userEmail: 'mehmet@example.com',
    address: 'Gaziosmanpaşa, İstanbul',
    phoneNumber: '+90-5XX-XXX-XXXX',
  },
];

const STATUS_CONFIG = {
  'onay bekleniyor': {
    label: 'Onay Bekleniyor',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '⏳',
  },
  doğrulanmış: {
    label: 'Doğrulanmış',
    color: 'bg-green-100 text-green-800',
    icon: '✓',
  },
  reddedildi: { label: 'Reddedildi', color: 'bg-red-100 text-red-800', icon: '✕' },
};

export default function DogrulamaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEntry, setSelectedEntry] = useState<VerificationEntry | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionModal, setActionModal] = useState<{
    open: boolean;
    entry: VerificationEntry | null;
    action: 'approve' | 'reject' | null;
  }>({ open: false, entry: null, action: null });

  const itemsPerPage = 10;

  const filteredEntries = useMemo(() => {
    return MOCK_VERIFICATIONS.filter((entry) => {
      const matchesSearch =
        entry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.nvi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || entry.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const paginatedEntries = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredEntries.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredEntries, currentPage]);

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);

  const totalVerified = MOCK_VERIFICATIONS.filter((v) => v.status === 'doğrulanmış').length;
  const totalPending = MOCK_VERIFICATIONS.filter((v) => v.status === 'onay bekleniyor').length;
  const totalRejected = MOCK_VERIFICATIONS.filter((v) => v.status === 'reddedildi').length;
  const rejectionRate =
    ((totalRejected / MOCK_VERIFICATIONS.length) * 100).toFixed(1);

  const stats = [
    {
      title: 'Toplam Doğrulanmış',
      value: totalVerified,
      icon: '✓',
      color: '#00833e',
    },
    {
      title: 'Onay Bekleniyor',
      value: totalPending,
      icon: '⏳',
      color: '#FF9800',
    },
    {
      title: 'Reddedildi',
      value: totalRejected,
      icon: '✕',
      color: '#F44336',
    },
    {
      title: 'Red Oranı',
      value: `${rejectionRate}%`,
      icon: '📊',
      color: '#2196F3',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Adres Doğrulama Yönetimi</h1>
        <p className="text-gray-600">
          e-Devlet adres doğrulamalarını yönetin ve onaylayın
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-surface p-6 rounded-lg border border-border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold mt-2" style={{ color: stat.color }}>
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
                placeholder="Kullanıcı, NVI veya email ara..."
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

      {/* Verifications Table */}
      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  NVI
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Gönderilen
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Adres
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedEntries.map((entry) => {
                const statusConfig = STATUS_CONFIG[entry.status];
                return (
                  <tr
                    key={entry.id}
                    className="border-b border-border hover:bg-background"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{entry.userName}</p>
                        <p className="text-xs text-gray-500 mt-1">{entry.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono font-medium text-gray-900">{entry.nvi}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{entry.submittedDate}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                      >
                        {statusConfig.icon} {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{entry.address}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedEntry(entry)}
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
            {filteredEntries.length === 0 ? (
              'Sonuç bulunamadı'
            ) : (
              <>
                Sayfa {currentPage} / {totalPages} ({filteredEntries.length} doğrulama)
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
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900">Doğrulama Detayı</h2>
              <button
                onClick={() => {
                  setSelectedEntry(null);
                  setActionModal({ open: false, entry: null, action: null });
                }}
                className="text-gray-500 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 font-semibold">Belge Önizlemesi</p>
                <div className="mt-2 p-4 border-2 border-dashed border-border rounded-lg bg-background text-center text-gray-600">
                  {selectedEntry.documentPreview}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Kullanıcı</p>
                  <p className="text-gray-900 mt-1">{selectedEntry.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">NVI</p>
                  <p className="text-gray-900 mt-1 font-mono">{selectedEntry.nvi}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Email</p>
                  <p className="text-gray-900 mt-1 text-sm">{selectedEntry.userEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Telefon</p>
                  <p className="text-gray-900 mt-1">{selectedEntry.phoneNumber}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 font-semibold">Adres</p>
                  <p className="text-gray-900 mt-1">{selectedEntry.address}</p>
                </div>
              </div>

              {actionModal.open && actionModal.action === 'reject' && (
                <div className="mt-4 p-4 border border-border rounded-lg bg-background">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Red Nedeni
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Red nedenini açıklayın..."
                    className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-border flex gap-3">
              <button
                onClick={() => {
                  setSelectedEntry(null);
                  setActionModal({ open: false, entry: null, action: null });
                  setRejectReason('');
                }}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-gray-900 font-medium hover:bg-background"
              >
                {actionModal.open ? 'İptal' : 'Kapat'}
              </button>

              {!actionModal.open && selectedEntry.status === 'onay bekleniyor' && (
                <>
                  <button
                    onClick={() =>
                      setActionModal({
                        open: true,
                        entry: selectedEntry,
                        action: 'approve',
                      })
                    }
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover"
                  >
                    Onayla
                  </button>
                  <button
                    onClick={() =>
                      setActionModal({
                        open: true,
                        entry: selectedEntry,
                        action: 'reject',
                      })
                    }
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                  >
                    Reddet
                  </button>
                </>
              )}

              {actionModal.open && actionModal.action === 'approve' && (
                <button
                  onClick={() => {
                    setSelectedEntry(null);
                    setActionModal({ open: false, entry: null, action: null });
                  }}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover"
                >
                  Onayla
                </button>
              )}

              {actionModal.open && actionModal.action === 'reject' && (
                <button
                  onClick={() => {
                    setSelectedEntry(null);
                    setActionModal({ open: false, entry: null, action: null });
                    setRejectReason('');
                  }}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                >
                  Reddet
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
