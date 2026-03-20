'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Search,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  TrendingUp,
  Mail,
  Ban,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  X,
  Lock,
  Unlock,
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  neighborhood: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'suspended';
  posts: number;
  reviews: number;
  lastSeen: string;
  avatar: string;
  engagement: number;
}

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Ahmet K.',
    email: 'ahmet@example.com',
    neighborhood: 'Beşiktaş',
    joinDate: '2024-01-15',
    status: 'active',
    posts: 34,
    reviews: 12,
    lastSeen: '2 dakika önce',
    avatar: 'AK',
    engagement: 92,
  },
  {
    id: '2',
    name: 'Fatma D.',
    email: 'fatma@example.com',
    neighborhood: 'Kadıköy',
    joinDate: '2023-11-20',
    status: 'active',
    posts: 28,
    reviews: 8,
    lastSeen: '1 saat önce',
    avatar: 'FD',
    engagement: 78,
  },
  {
    id: '3',
    name: 'Mustafa T.',
    email: 'mustafa@example.com',
    neighborhood: 'Şişli',
    joinDate: '2023-09-10',
    status: 'active',
    posts: 56,
    reviews: 23,
    lastSeen: '3 dakika önce',
    avatar: 'MT',
    engagement: 95,
  },
  {
    id: '4',
    name: 'Elif Y.',
    email: 'elif@example.com',
    neighborhood: 'Cihangir',
    joinDate: '2023-08-05',
    status: 'suspended',
    posts: 12,
    reviews: 3,
    lastSeen: '5 gün önce',
    avatar: 'EY',
    engagement: 35,
  },
  {
    id: '5',
    name: 'Hasan B.',
    email: 'hasan@example.com',
    neighborhood: 'Levent',
    joinDate: '2024-02-01',
    status: 'inactive',
    posts: 5,
    reviews: 1,
    lastSeen: '2 hafta önce',
    avatar: 'HB',
    engagement: 15,
  },
  {
    id: '6',
    name: 'Ayşe S.',
    email: 'ayse@example.com',
    neighborhood: 'Fatih',
    joinDate: '2023-12-12',
    status: 'active',
    posts: 42,
    reviews: 15,
    lastSeen: '30 dakika önce',
    avatar: 'AS',
    engagement: 85,
  },
  {
    id: '7',
    name: 'İbrahim M.',
    email: 'ibrahim@example.com',
    neighborhood: 'Moda',
    joinDate: '2024-01-20',
    status: 'active',
    posts: 19,
    reviews: 6,
    lastSeen: '4 saat önce',
    avatar: 'IM',
    engagement: 68,
  },
  {
    id: '8',
    name: 'Zeynep A.',
    email: 'zeynep@example.com',
    neighborhood: 'Caferağa',
    joinDate: '2023-10-30',
    status: 'suspended',
    posts: 8,
    reviews: 2,
    lastSeen: '1 ay önce',
    avatar: 'ZA',
    engagement: 25,
  },
];

const STATUS_CONFIG = {
  active: {
    label: 'Aktif',
    color: 'bg-green-100 text-green-800',
    badgeBg: 'bg-primary-light',
    badgeText: 'text-primary-hover',
    icon: CheckCircle,
  },
  inactive: {
    label: 'Pasif',
    color: 'bg-gray-100 text-gray-800',
    badgeBg: 'bg-gray-100',
    badgeText: 'text-gray-700',
    icon: AlertCircle,
  },
  suspended: {
    label: 'Askıya Alındı',
    color: 'bg-red-100 text-red-800',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-700',
    icon: XCircle,
  },
};

interface ConfirmModal {
  isOpen: boolean;
  action: string;
  userId?: string;
  userName?: string;
}

export default function KullanicilarPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState<ConfirmModal>({
    isOpen: false,
    action: '',
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailsModal, setDetailsModal] = useState(false);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 8;

  // Fetch users from Supabase
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          // Map profile data to User structure - keep mock data as fallback
          // In a real scenario, you'd map profile data with posts/reviews counts
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.neighborhood.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    inactive: users.filter((u) => u.status === 'inactive').length,
    suspended: users.filter((u) => u.status === 'suspended').length,
  };

  const handleAction = (action: string, user: User) => {
    setConfirmModal({
      isOpen: true,
      action,
      userId: user.id,
      userName: user.name,
    });
  };

  const confirmAction = async () => {
    const supabase = createClient();
    try {
      if (confirmModal.action === 'suspend') {
        // Lock/suspend user in Supabase (would need status field in profiles table)
        await (supabase as any)
          .from('profiles')
          .update({ verified: false })
          .eq('id', confirmModal.userId);

        setUsers(prev => prev.map(u =>
          u.id === confirmModal.userId ? { ...u, status: 'suspended' } : u
        ));
      } else if (confirmModal.action === 'unsuspend') {
        // Unlock/unsuspend user
        await (supabase as any)
          .from('profiles')
          .update({ verified: true })
          .eq('id', confirmModal.userId);

        setUsers(prev => prev.map(u =>
          u.id === confirmModal.userId ? { ...u, status: 'active' } : u
        ));
      } else if (confirmModal.action === 'delete') {
        // Soft delete or archive user
        console.log(`User ${confirmModal.userId} deletion initiated`);
      }
    } catch (error) {
      console.error('Action failed:', error);
      alert('İşlem başarısız oldu');
    }
    setConfirmModal({ isOpen: false, action: '' });
  };

  const viewDetails = (user: User) => {
    setSelectedUser(user);
    setDetailsModal(true);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kullanıcı Yönetimi</h1>
        <p className="text-gray-600">
          Toplam {stats.total} kullanıcı yönetiliyor
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium">Toplam</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="text-primary" size={28} />
          </div>
        </div>
        <div className="bg-surface rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium">Aktif</p>
              <p className="text-2xl font-bold text-green-700">{stats.active}</p>
            </div>
            <UserCheck className="text-green-600" size={28} />
          </div>
        </div>
        <div className="bg-surface rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium">Pasif</p>
              <p className="text-2xl font-bold text-gray-700">{stats.inactive}</p>
            </div>
            <AlertCircle className="text-gray-600" size={28} />
          </div>
        </div>
        <div className="bg-surface rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium">Askıya</p>
              <p className="text-2xl font-bold text-red-700">{stats.suspended}</p>
            </div>
            <Ban className="text-red-600" size={28} />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-surface rounded-lg border border-border p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Ad, e-posta veya mahalle ile ara..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'active', 'inactive', 'suspended'] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-primary text-white'
                  : 'bg-background text-gray-700 hover:bg-gray-200 border border-border'
              }`}
            >
              {status === 'all'
                ? 'Tümü'
                : status === 'active'
                ? 'Aktif'
                : status === 'inactive'
                ? 'Pasif'
                : 'Askıya Alındı'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Mahalle
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Katılım Tarihi
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Katılım
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Paylaşım / Yorum
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e0e0]">
              {paginatedUsers.map((user) => {
                const StatusIcon =
                  STATUS_CONFIG[user.status as keyof typeof STATUS_CONFIG].icon;
                const statusConfig =
                  STATUS_CONFIG[user.status as keyof typeof STATUS_CONFIG];

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-surface-hover transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white"
                          style={{ backgroundColor: '#00833e' }}
                        >
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {user.neighborhood}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(user.joinDate).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.badgeBg} ${statusConfig.badgeText}`}
                      >
                        <StatusIcon size={14} />
                        {statusConfig.label}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <div className="w-full max-w-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-600">
                              {user.engagement}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${user.engagement}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div>
                        <p className="font-medium text-gray-900">{user.posts}</p>
                        <p className="text-xs text-gray-500">
                          {user.reviews} yorum
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => viewDetails(user)}
                          className="p-2 hover:bg-blue-50 rounded transition-colors text-blue-600"
                          title="Detayları Görüntüle"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleAction('edit', user)}
                          className="p-2 hover:bg-amber-50 rounded transition-colors text-amber-600"
                          title="Düzenle"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleAction(user.status === 'suspended' ? 'unsuspend' : 'suspend', user)}
                          className="p-2 hover:bg-orange-50 rounded transition-colors text-orange-600"
                          title={user.status === 'suspended' ? 'Askıyı Kaldır' : 'Askıya Al'}
                        >
                          {user.status === 'suspended' ? <Unlock size={16} /> : <Lock size={16} />}
                        </button>
                        <button
                          onClick={() => handleAction('delete', user)}
                          className="p-2 hover:bg-red-50 rounded transition-colors text-red-600"
                          title="Sil"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Sayfa {currentPage} / {totalPages} ({filteredUsers.length} sonuç)
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-gray-700 hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
            Önceki
          </button>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-gray-700 hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Sonraki
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {detailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Kullanıcı Detayları</h2>
              <button
                onClick={() => setDetailsModal(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-border">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-xl"
                  style={{ backgroundColor: '#00833e' }}
                >
                  {selectedUser.avatar}
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{selectedUser.name}</p>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Mahalle</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedUser.neighborhood}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Durum</p>
                  <p className={`text-sm font-semibold ${STATUS_CONFIG[selectedUser.status].color}`}>
                    {STATUS_CONFIG[selectedUser.status].label}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Katılım Tarihi</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(selectedUser.joinDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Son Görülme</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedUser.lastSeen}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Paylaşımlar</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedUser.posts}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Yorumlar</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedUser.reviews}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-600 uppercase mb-2">Katılım Oranı</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full"
                      style={{ width: `${selectedUser.engagement}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{selectedUser.engagement}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold text-gray-900 mb-2">İşlemi Onayla</h2>
            <p className="text-gray-600 mb-6">
              {confirmModal.action === 'delete'
                ? `${confirmModal.userName} kullanıcısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
                : confirmModal.action === 'suspend'
                ? `${confirmModal.userName} kullanıcısını askıya almak istediğinizden emin misiniz?`
                : confirmModal.action === 'unsuspend'
                ? `${confirmModal.userName} kullanıcısının askısını kaldırmak istediğinizden emin misiniz?`
                : `${confirmModal.action} işlemini gerçekleştirmek istediğinizden emin misiniz?`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal({ isOpen: false, action: '' })}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                İptal
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                  confirmModal.action === 'delete'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-primary hover:bg-primary-hover'
                }`}
              >
                Onayla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
