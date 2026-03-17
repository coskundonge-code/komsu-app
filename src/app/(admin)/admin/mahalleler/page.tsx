'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  MapPin,
  Users,
  Edit2,
  Trash2,
  MoreVertical,
  Search,
  MessageSquare,
  TrendingUp,
  Layers,
  X,
} from 'lucide-react';

interface Neighborhood {
  id: string;
  name: string;
  district: string;
  members: number;
  posts: number;
  createdAt: string;
  lead?: string;
}

const MOCK_NEIGHBORHOODS: Neighborhood[] = [
  {
    id: '1',
    name: 'Beşiktaş',
    district: 'İstanbul',
    members: 1234,
    posts: 567,
    createdAt: '2023-06-15',
    lead: 'Ahmet K.',
  },
  {
    id: '2',
    name: 'Kadıköy',
    district: 'İstanbul',
    members: 2156,
    posts: 892,
    createdAt: '2023-06-20',
    lead: 'Fatma D.',
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
    lead: 'Mustafa T.',
  },
  {
    id: '5',
    name: 'Şişli',
    district: 'İstanbul',
    members: 2342,
    posts: 1023,
    createdAt: '2023-08-05',
    lead: 'Elif Y.',
  },
  {
    id: '6',
    name: 'Fatih',
    district: 'İstanbul',
    members: 1678,
    posts: 734,
    createdAt: '2023-08-18',
    lead: 'Ayşe S.',
  },
];

interface FormModalState {
  isOpen: boolean;
  mode: 'add' | 'edit';
  neighborhood?: Neighborhood;
}

interface ConfirmModal {
  isOpen: boolean;
  action: string;
  neighborhoodId?: string;
  neighborhoodName?: string;
}

interface DetailsModal {
  isOpen: boolean;
  neighborhood?: Neighborhood;
}

export default function MahalleleriPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'members' | 'posts' | 'name'>('members');
  const [formModal, setFormModal] = useState<FormModalState>({ isOpen: false, mode: 'add' });
  const [confirmModal, setConfirmModal] = useState<ConfirmModal>({ isOpen: false, action: '' });
  const [detailsModal, setDetailsModal] = useState<DetailsModal>({ isOpen: false });
  const [newNeighborhood, setNewNeighborhood] = useState({
    name: '',
    district: '',
  });

  const handleAddNeighborhood = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding neighborhood:', newNeighborhood);
    setNewNeighborhood({ name: '', district: '' });
    setFormModal({ isOpen: false, mode: 'add' });
  };

  const handleDelete = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      action: 'delete',
      neighborhoodId: id,
      neighborhoodName: name,
    });
  };

  const confirmAction = () => {
    console.log(`Confirmed: ${confirmModal.action} for neighborhood ${confirmModal.neighborhoodId}`);
    setConfirmModal({ isOpen: false, action: '' });
  };

  const filteredAndSorted = useMemo(() => {
    let filtered = MOCK_NEIGHBORHOODS.filter(
      (n) =>
        n.name.toLowerCase().includes(search.toLowerCase()) ||
        n.district.toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy === 'members') {
      filtered.sort((a, b) => b.members - a.members);
    } else if (sortBy === 'posts') {
      filtered.sort((a, b) => b.posts - a.posts);
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [search, sortBy]);

  const totalMembers = MOCK_NEIGHBORHOODS.reduce((sum, n) => sum + n.members, 0);
  const totalPosts = MOCK_NEIGHBORHOODS.reduce((sum, n) => sum + n.posts, 0);
  const avgMembers = Math.round(totalMembers / MOCK_NEIGHBORHOODS.length);
  const avgPosts = Math.round(totalPosts / MOCK_NEIGHBORHOODS.length);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mahalle Yönetimi
          </h1>
          <p className="text-gray-600">
            {MOCK_NEIGHBORHOODS.length} mahalle, {totalMembers.toLocaleString('tr-TR')}{' '}
            üye
          </p>
        </div>
        <button
          onClick={() => setFormModal({ isOpen: true, mode: 'add' })}
          className="flex items-center gap-2 bg-[#00833e] hover:bg-[#006b32] text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Mahalle Ekle
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium">Toplam Mahalle</p>
              <p className="text-2xl font-bold text-gray-900">
                {MOCK_NEIGHBORHOODS.length}
              </p>
            </div>
            <Layers className="text-[#00833e]" size={28} />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium">Toplam Üye</p>
              <p className="text-2xl font-bold text-blue-700">
                {totalMembers.toLocaleString('tr-TR')}
              </p>
            </div>
            <Users className="text-blue-600" size={28} />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium">Toplam Paylaşım</p>
              <p className="text-2xl font-bold text-purple-700">
                {totalPosts.toLocaleString('tr-TR')}
              </p>
            </div>
            <MessageSquare className="text-purple-600" size={28} />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium">Ort. Aktiflik</p>
              <p className="text-2xl font-bold text-green-700">{avgPosts}</p>
            </div>
            <TrendingUp className="text-green-600" size={28} />
          </div>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Mahalle veya ilçe ile ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e] bg-white"
          >
            <option value="members">En Çok Üye</option>
            <option value="posts">En Çok Paylaşım</option>
            <option value="name">Alfabetik</option>
          </select>
        </div>
      </div>

      {/* Neighborhoods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSorted.map((neighborhood) => {
          const memberPercentage = (neighborhood.members / totalMembers) * 100;
          const postPercentage = (neighborhood.posts / totalPosts) * 100;

          return (
            <div
              key={neighborhood.id}
              className="bg-white rounded-lg border border-[#e0e0e0] p-6 hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-[#e6f4ec] rounded-lg text-[#00833e]">
                  <MapPin size={24} />
                </div>
                <button
                  onClick={() => setDetailsModal({ isOpen: true, neighborhood })}
                  className="p-2 hover:bg-[#f0f2f5] rounded transition-colors"
                  title="Detayları Görüntüle"
                >
                  <MoreVertical size={18} className="text-gray-600" />
                </button>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {neighborhood.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {neighborhood.district}
              </p>

              {neighborhood.lead && (
                <p className="text-xs text-gray-500 mb-2">
                  <span className="font-medium">Sorumlular</span> {neighborhood.lead}
                </p>
              )}

              {/* Stats */}
              <div className="space-y-3 py-4 border-t border-b border-[#e0e0e0] flex-1">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users size={16} className="text-[#00833e]" />
                      <span className="text-sm font-medium">Üyeler</span>
                    </div>
                    <span className="font-bold text-gray-900">
                      {neighborhood.members.toLocaleString('tr-TR')}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#00833e] h-2 rounded-full"
                      style={{ width: `${memberPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    %{memberPercentage.toFixed(1)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MessageSquare size={16} className="text-blue-600" />
                      <span className="text-sm font-medium">Paylaşım</span>
                    </div>
                    <span className="font-bold text-gray-900">
                      {neighborhood.posts.toLocaleString('tr-TR')}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${postPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    %{postPercentage.toFixed(1)}
                  </p>
                </div>
              </div>

              {/* Created Date */}
              <p className="text-xs text-gray-500 mt-4">
                Oluşturuldu:{' '}
                {new Date(neighborhood.createdAt).toLocaleDateString('tr-TR')}
              </p>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setFormModal({ isOpen: true, mode: 'edit', neighborhood })}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#e6f4ec] hover:bg-[#d1fae5] text-[#006b32] font-medium py-2 px-3 rounded-lg transition-colors text-sm border border-[#00833e]/20"
                >
                  <Edit2 size={16} />
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(neighborhood.id, neighborhood.name)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-3 rounded-lg transition-colors text-sm border border-red-200"
                >
                  <Trash2 size={16} />
                  Sil
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-[#00833e] to-[#006b32] rounded-lg text-white p-8 mt-8">
        <h2 className="text-lg font-bold mb-6">Genel İstatistikler</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div>
            <p className="text-[#d1fae5] text-xs font-semibold uppercase mb-2">
              Toplam Mahalle
            </p>
            <p className="text-3xl font-bold">{MOCK_NEIGHBORHOODS.length}</p>
          </div>
          <div>
            <p className="text-[#d1fae5] text-xs font-semibold uppercase mb-2">
              Toplam Üye
            </p>
            <p className="text-3xl font-bold">
              {totalMembers.toLocaleString('tr-TR')}
            </p>
          </div>
          <div>
            <p className="text-[#d1fae5] text-xs font-semibold uppercase mb-2">
              Toplam Paylaşım
            </p>
            <p className="text-3xl font-bold">
              {totalPosts.toLocaleString('tr-TR')}
            </p>
          </div>
          <div>
            <p className="text-[#d1fae5] text-xs font-semibold uppercase mb-2">
              Ort. Üye/Mahalle
            </p>
            <p className="text-3xl font-bold">{avgMembers.toLocaleString('tr-TR')}</p>
          </div>
          <div>
            <p className="text-[#d1fae5] text-xs font-semibold uppercase mb-2">
              Ort. Paylaşım/Mahalle
            </p>
            <p className="text-3xl font-bold">{avgPosts.toLocaleString('tr-TR')}</p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredAndSorted.length === 0 && (
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-12 text-center mt-8">
          <MapPin size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-bold text-gray-900">
            Mahalle Bulunamadı
          </p>
          <p className="text-gray-600 mt-2">
            Lütfen arama kriterlerinizi kontrol edin
          </p>
        </div>
      )}

      {/* Form Modal */}
      {formModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {formModal.mode === 'add' ? 'Yeni Mahalle Ekle' : 'Mahalle Düzenle'}
              </h2>
              <button
                onClick={() => setFormModal({ isOpen: false, mode: 'add' })}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleAddNeighborhood} className="space-y-4">
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
                  className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
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
                  className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#00833e] hover:bg-[#006b32] text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  {formModal.mode === 'add' ? 'Ekle' : 'Kaydet'}
                </button>
                <button
                  type="button"
                  onClick={() => setFormModal({ isOpen: false, mode: 'add' })}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsModal.isOpen && detailsModal.neighborhood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Mahalle Detayları</h2>
              <button
                onClick={() => setDetailsModal({ isOpen: false })}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-[#e0e0e0]">
                <div className="p-3 bg-[#e6f4ec] rounded-lg text-[#00833e]">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {detailsModal.neighborhood.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {detailsModal.neighborhood.district}
                  </p>
                </div>
              </div>

              {detailsModal.neighborhood.lead && (
                <div className="pb-4 border-b border-[#e0e0e0]">
                  <p className="text-xs font-medium text-gray-600 uppercase mb-1">
                    Sorumlu Kişi
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {detailsModal.neighborhood.lead}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase mb-1">
                    Toplam Üye
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {detailsModal.neighborhood.members.toLocaleString('tr-TR')}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase mb-1">
                    Toplam Paylaşım
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {detailsModal.neighborhood.posts.toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#e0e0e0]">
                <p className="text-xs text-gray-600">
                  Oluşturuldu:{' '}
                  {new Date(detailsModal.neighborhood.createdAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold text-gray-900 mb-2">İşlemi Onayla</h2>
            <p className="text-gray-600 mb-6">
              {confirmModal.action === 'delete'
                ? `"${confirmModal.neighborhoodName}" mahallesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
                : 'Bu işlemi gerçekleştirmek istediğinizden emin misiniz?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal({ isOpen: false, action: '' })}
                className="flex-1 px-4 py-2 border border-[#e0e0e0] rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                İptal
              </button>
              <button
                onClick={confirmAction}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
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
