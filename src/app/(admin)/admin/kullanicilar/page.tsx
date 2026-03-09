'use client';

import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
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
    badgeBg: 'bg-[#e6f4ec]',
    badgeText: 'text-[#006b32]',
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

export default function KullanicilarPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: MOCK_USERS.length,
    active: MOCK_USERS.filter((u) => u.status === 'active').length,
    inactive: MOCK_USERS.filter((u) => u.status === 'inactive').length,
    suspended: MOCK_USERS.filter((u) => u.status === 'suspended').length,
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
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium">Toplam</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="text-[#00833e]" size={28} />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium">Aktif</p>
              <p className="text-2xl font-bold text-green-700">{stats.active}</p>
            </div>
            <UserCheck className="text-green-600" size={28} />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium">Pasif</p>
              <p className="text-2xl font-bold text-gray-700">{stats.inactive}</p>
            </div>
            <AlertCircle className="text-gray-600" size={28} />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-4">
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
      <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Ad veya e-posta ile ara..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
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
                  ? 'bg-[#00833e] text-white'
                  : 'bg-[#f0f2f5] text-gray-700 hover:bg-gray-200 border border-[#e0e0e0]'
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
      <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f0f2f5] border-b border-[#e0e0e0]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Kullanıcı
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Son Görülme
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
                    className="hover:bg-[#f0f2f5] transition-colors"
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
                              className="bg-[#00833e] h-2 rounded-full"
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
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.lastSeen}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="inline-flex items-center justify-center p-2 hover:bg-[#f0f2f5] rounded transition-colors">
                        <MoreVertical size={18} className="text-gray-600" />
                      </button>
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
            className="flex items-center gap-2 px-3 py-2 border border-[#e0e0e0] rounded-lg text-gray-700 hover:bg-[#f0f2f5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
            Önceki
          </button>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-3 py-2 border border-[#e0e0e0] rounded-lg text-gray-700 hover:bg-[#f0f2f5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Sonraki
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
