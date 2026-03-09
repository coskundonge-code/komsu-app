'use client';

import React, { useState, useMemo } from 'react';
import { Search, MoreVertical, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'suspended';
  posts: number;
  reviews: number;
  lastSeen: string;
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
  },
];

const STATUS_CONFIG = {
  active: {
    label: 'Aktif',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  inactive: {
    label: 'Pasif',
    color: 'bg-gray-100 text-gray-800',
    icon: AlertCircle,
  },
  suspended: {
    label: 'Askıya Alındı',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
  },
};

export default function KullanicilarPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');

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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kullanıcılar</h1>
        <p className="text-gray-600">
          Toplam {MOCK_USERS.length} kullanıcı ({filteredUsers.length} görüntüleniyor)
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search
              size={20}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              type="text"
              placeholder="Ad veya e-posta ile ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'active', 'inactive', 'suspended'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-[#00833e] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Katılım Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Paylaşım / Yorum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Son Görülme
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const StatusIcon =
                  STATUS_CONFIG[user.status as keyof typeof STATUS_CONFIG]
                    .icon;
                const statusConfig =
                  STATUS_CONFIG[user.status as keyof typeof STATUS_CONFIG];

                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(user.joinDate).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}
                      >
                        <StatusIcon size={16} />
                        {statusConfig.label}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div>
                        <p className="font-medium">{user.posts}</p>
                        <p className="text-gray-500 text-xs">{user.reviews} yorum</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {user.lastSeen}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="inline-flex items-center justify-center p-2 hover:bg-gray-100 rounded transition-colors">
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
          Sayfa 1 / 5 ({filteredUsers.length} sonuç)
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Önceki
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Sonraki
          </button>
        </div>
      </div>
    </div>
  );
}
