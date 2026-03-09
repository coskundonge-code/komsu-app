'use client';

import React, { useState } from 'react';
import { Plus, MapPin, Users, Edit2, Trash2, MoreVertical } from 'lucide-react';

interface Neighborhood {
  id: string;
  name: string;
  district: string;
  members: number;
  posts: number;
  createdAt: string;
}

const MOCK_NEIGHBORHOODS: Neighborhood[] = [
  {
    id: '1',
    name: 'Beşiktaş',
    district: 'İstanbul',
    members: 1234,
    posts: 567,
    createdAt: '2023-06-15',
  },
  {
    id: '2',
    name: 'Kadıköy',
    district: 'İstanbul',
    members: 2156,
    posts: 892,
    createdAt: '2023-06-20',
  },
  {
    id: '3',
    name: 'Cihangir',
    district: 'İstanbul',
    members: 876,
    posts: 345,
    createdAt: '2023-07-10',
  },
  {
    id: '4',
    name: 'Levent',
    district: 'İstanbul',
    members: 1543,
    posts: 678,
    createdAt: '2023-07-25',
  },
  {
    id: '5',
    name: 'Şişli',
    district: 'İstanbul',
    members: 2342,
    posts: 1023,
    createdAt: '2023-08-05',
  },
  {
    id: '6',
    name: 'Fatih',
    district: 'İstanbul',
    members: 1678,
    posts: 734,
    createdAt: '2023-08-18',
  },
];

export default function MahalleleriPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNeighborhood, setNewNeighborhood] = useState({
    name: '',
    district: '',
  });

  const handleAddNeighborhood = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle add logic
    setNewNeighborhood({ name: '', district: '' });
    setShowAddForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mahalleler</h1>
          <p className="text-gray-600">
            Toplam {MOCK_NEIGHBORHOODS.length} mahalle yönetiliyor
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-[#00833e] hover:bg-[#006b32] text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Mahalle Ekle
        </button>
      </div>

      {/* Add Neighborhood Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg border border-[#a7dbb8] p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Yeni Mahalle Ekle</h2>
          <form onSubmit={handleAddNeighborhood} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mahalle Adı
                </label>
                <input
                  type="text"
                  value={newNeighborhood.name}
                  onChange={(e) =>
                    setNewNeighborhood({
                      ...newNeighborhood,
                      name: e.target.value,
                    })
                  }
                  placeholder="Örn: Beşiktaş"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İlçe/Şehir
                </label>
                <input
                  type="text"
                  value={newNeighborhood.district}
                  onChange={(e) =>
                    setNewNeighborhood({
                      ...newNeighborhood,
                      district: e.target.value,
                    })
                  }
                  placeholder="Örn: İstanbul"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-[#00833e] hover:bg-[#006b32] text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Ekle
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Neighborhoods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_NEIGHBORHOODS.map((neighborhood) => (
          <div
            key={neighborhood.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-[#d1fae5] rounded-lg text-[#00833e]">
                <MapPin size={24} />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                <MoreVertical size={18} className="text-gray-600" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {neighborhood.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{neighborhood.district}</p>

            {/* Stats */}
            <div className="space-y-3 py-4 border-t border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <Users size={16} className="text-[#00833e]" />
                  <span className="text-sm">Üyeler</span>
                </div>
                <span className="font-bold text-gray-900">
                  {neighborhood.members.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin size={16} className="text-[#00833e]" />
                  <span className="text-sm">Paylaşım</span>
                </div>
                <span className="font-bold text-gray-900">
                  {neighborhood.posts.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Created Date */}
            <p className="text-xs text-gray-500 mt-4">
              Oluşturuldu: {new Date(neighborhood.createdAt).toLocaleDateString('tr-TR')}
            </p>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button className="flex-1 flex items-center justify-center gap-2 bg-[#e6f4ec] hover:bg-[#d1fae5] text-[#006b32] font-medium py-2 px-3 rounded-lg transition-colors text-sm">
                <Edit2 size={16} />
                Düzenle
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-3 rounded-lg transition-colors text-sm">
                <Trash2 size={16} />
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="bg-gradient-to-r from-[#00833e] to-green-600 rounded-lg text-white p-6 mt-8">
        <h2 className="text-lg font-bold mb-4">Genel İstatistikler</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-[#d1fae5] text-sm">Toplam Mahalle</p>
            <p className="text-3xl font-bold">{MOCK_NEIGHBORHOODS.length}</p>
          </div>
          <div>
            <p className="text-[#d1fae5] text-sm">Toplam Üye</p>
            <p className="text-3xl font-bold">
              {MOCK_NEIGHBORHOODS.reduce((sum, n) => sum + n.members, 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[#d1fae5] text-sm">Toplam Paylaşım</p>
            <p className="text-3xl font-bold">
              {MOCK_NEIGHBORHOODS.reduce((sum, n) => sum + n.posts, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
