'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar,
  Lock,
  Unlock,
  Trash2,
} from 'lucide-react';

interface Group {
  id: string;
  name: string;
  category: string;
  memberCount: number;
  privacy: 'açık' | 'kapalı';
  createdAt: string;
  moderators: number;
  posts: number;
  status: 'aktif' | 'beklemede' | 'askıya alındı';
  description: string;
}

const MOCK_GROUPS: Group[] = [
  {
    id: '1',
    name: 'Beşiktaş Komşular',
    category: 'Mahalle',
    memberCount: 234,
    privacy: 'açık',
    createdAt: '2023-06-15',
    moderators: 3,
    posts: 456,
    status: 'aktif',
    description: 'Beşiktaş mahallesinin resmi komşu grubu',
  },
  {
    id: '2',
    name: 'Kadıköy Satış Pazarı',
    category: 'Pazarlama',
    memberCount: 589,
    privacy: 'açık',
    createdAt: '2023-04-20',
    moderators: 5,
    posts: 1203,
    status: 'aktif',
    description: 'Satılık ve takas ürünleri paylaşma grubu',
  },
  {
    id: '3',
    name: 'Şişli Spor Kulübü',
    category: 'Spor',
    memberCount: 156,
    privacy: 'kapalı',
    createdAt: '2023-08-10',
    moderators: 2,
    posts: 234,
    status: 'aktif',
    description: 'Şişli bölgesinde spor aktiviteleri',
  },
  {
    id: '4',
    name: 'Cihangir Yemek Severler',
    category: 'Hobiler',
    memberCount: 423,
    privacy: 'açık',
    createdAt: '2023-03-25',
    moderators: 4,
    posts: 678,
    status: 'aktif',
    description: 'Yemek tarifleri ve resepte paylaşma',
  },
  {
    id: '5',
    name: 'Fatih Gönüllüler Ağı',
    category: 'Sosyal',
    memberCount: 312,
    privacy: 'açık',
    createdAt: '2023-09-12',
    moderators: 3,
    posts: 345,
    status: 'aktif',
    description: 'Sosyal yardım ve gönüllülük ağı',
  },
  {
    id: '6',
    name: 'Moda Sanat Topluluğu',
    category: 'Sanat',
    memberCount: 178,
    privacy: 'kapalı',
    createdAt: '2023-07-08',
    moderators: 2,
    posts: 267,
    status: 'aktif',
    description: 'Sanat ve tasarım projeleri',
  },
  {
    id: '7',
    name: 'Levent İş Ağı',
    category: 'İşletme',
    memberCount: 267,
    privacy: 'kapalı',
    createdAt: '2023-05-19',
    moderators: 3,
    posts: 412,
    status: 'aktif',
    description: 'Profesyonel ağ ve iş bağlantıları',
  },
  {
    id: '8',
    name: 'Caferağa Çocuk Oyunları',
    category: 'Aile',
    memberCount: 89,
    privacy: 'açık',
    createdAt: '2024-01-05',
    moderators: 1,
    posts: 45,
    status: 'beklemede',
    description: 'Çocuklar için oyun ve aktiviteler',
  },
  {
    id: '9',
    name: 'Merkez Bahçıvan Kültürü',
    category: 'Hobiler',
    memberCount: 145,
    privacy: 'açık',
    createdAt: '2023-11-22',
    moderators: 2,
    posts: 189,
    status: 'aktif',
    description: 'Bahçe ve bitki bakımı',
  },
  {
    id: '10',
    name: 'Yeni Mahalle Spor Vakfı',
    category: 'Spor',
    memberCount: 78,
    privacy: 'kapalı',
    createdAt: '2024-02-14',
    moderators: 2,
    posts: 67,
    status: 'askıya alındı',
    description: 'Spor etkinlikleri ve maçlar',
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Mahalle: 'bg-blue-100 text-blue-800',
  Pazarlama: 'bg-purple-100 text-purple-800',
  Spor: 'bg-red-100 text-red-800',
  Hobiler: 'bg-green-100 text-green-800',
  Sosyal: 'bg-yellow-100 text-yellow-800',
  Sanat: 'bg-pink-100 text-pink-800',
  İşletme: 'bg-indigo-100 text-indigo-800',
  Aile: 'bg-orange-100 text-orange-800',
};

const STATUS_CONFIG = {
  aktif: { label: 'Aktif', color: 'bg-green-100 text-green-800' },
  beklemede: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' },
  'askıya alındı': { label: 'Askıya Alındı', color: 'bg-red-100 text-red-800' },
};

export default function GruplarPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [privacyFilter, setPrivacyFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionModal, setActionModal] = useState<{
    open: boolean;
    group: Group | null;
    action: string;
  }>({ open: false, group: null, action: '' });

  const itemsPerPage = 10;

  const filteredGroups = useMemo(() => {
    return MOCK_GROUPS.filter((group) => {
      const matchesSearch =
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrivacy = !privacyFilter || group.privacy === privacyFilter;
      const matchesStatus = !statusFilter || group.status === statusFilter;
      return matchesSearch && matchesPrivacy && matchesStatus;
    });
  }, [searchTerm, privacyFilter, statusFilter]);

  const paginatedGroups = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredGroups.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredGroups, currentPage]);

  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);

  const stats = [
    {
      title: 'Toplam Grup',
      value: MOCK_GROUPS.length,
      icon: '👥',
      color: '#00833e',
    },
    {
      title: 'Bu Haftada Aktif',
      value: MOCK_GROUPS.filter((g) => g.status === 'aktif').length,
      icon: '✓',
      color: '#4CAF50',
    },
    {
      title: 'Onay Bekleniyor',
      value: MOCK_GROUPS.filter((g) => g.status === 'beklemede').length,
      icon: '⏳',
      color: '#FF9800',
    },
    {
      title: 'Toplam Üye',
      value: MOCK_GROUPS.reduce((sum, g) => sum + g.memberCount, 0),
      icon: '🧑',
      color: '#2196F3',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Grup Yönetimi</h1>
        <p className="text-gray-600">
          Tüm komşu gruplarını yönetin, onaylayın ve kontrol edin
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
                placeholder="Grup adı veya açıklamada ara..."
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
            value={privacyFilter}
            onChange={(e) => {
              setPrivacyFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Gizlilik Durumu</option>
            <option value="açık">Açık</option>
            <option value="kapalı">Kapalı</option>
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
            <option value="aktif">Aktif</option>
            <option value="beklemede">Beklemede</option>
            <option value="askıya alındı">Askıya Alındı</option>
          </select>
        </div>
      </div>

      {/* Groups Table */}
      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Grup Adı
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Üyeler
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Gönderiler
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Gizlilik
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedGroups.map((group) => {
                const statusConfig = STATUS_CONFIG[group.status];
                const categoryColor = CATEGORY_COLORS[group.category] || 'bg-gray-100 text-gray-800';
                return (
                  <tr
                    key={group.id}
                    className="border-b border-border hover:bg-background"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{group.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Oluşturma: {group.createdAt}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
                        {group.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-500" />
                        <span className="font-medium text-gray-900">{group.memberCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-medium">{group.posts}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {group.privacy === 'açık' ? (
                          <>
                            <Unlock size={16} className="text-green-600" />
                            <span className="text-gray-900">Açık</span>
                          </>
                        ) : (
                          <>
                            <Lock size={16} className="text-orange-600" />
                            <span className="text-gray-900">Kapalı</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                      >
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          setActionModal({
                            open: true,
                            group,
                            action: 'view',
                          })
                        }
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
            {filteredGroups.length === 0 ? (
              'Sonuç bulunamadı'
            ) : (
              <>
                Sayfa {currentPage} / {totalPages} ({filteredGroups.length} grup)
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
      {actionModal.open && actionModal.group && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900">Grup Detayı</h2>
              <button
                onClick={() => setActionModal({ open: false, group: null, action: '' })}
                className="text-gray-500 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 font-semibold">Grup Adı</p>
                <p className="text-gray-900 mt-1">{actionModal.group.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold">Açıklama</p>
                <p className="text-gray-900 mt-1">{actionModal.group.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Kategori</p>
                  <p className="text-gray-900 mt-1">{actionModal.group.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Gizlilik</p>
                  <p className="text-gray-900 mt-1">{actionModal.group.privacy === 'açık' ? 'Açık' : 'Kapalı'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Toplam Üye</p>
                  <p className="text-gray-900 mt-1">{actionModal.group.memberCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Moderatörler</p>
                  <p className="text-gray-900 mt-1">{actionModal.group.moderators}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Gönderiler</p>
                  <p className="text-gray-900 mt-1">{actionModal.group.posts}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Oluşturulma</p>
                  <p className="text-gray-900 mt-1">{actionModal.group.createdAt}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex gap-3">
              <button
                onClick={() => setActionModal({ open: false, group: null, action: '' })}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-gray-900 font-medium hover:bg-background"
              >
                Kapat
              </button>
              {actionModal.group.status === 'beklemede' && (
                <>
                  <button
                    onClick={() => setActionModal({ open: false, group: null, action: '' })}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover"
                  >
                    Onayla
                  </button>
                  <button
                    onClick={() => setActionModal({ open: false, group: null, action: '' })}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                  >
                    Reddet
                  </button>
                </>
              )}
              {actionModal.group.status === 'aktif' && (
                <button
                  onClick={() => setActionModal({ open: false, group: null, action: '' })}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
                >
                  Askıya Al
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
