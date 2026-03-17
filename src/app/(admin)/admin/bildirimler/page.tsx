'use client';

import React, { useState, useMemo } from 'react';
import {
  Send,
  Mail,
  MessageCircle,
  Bell,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  deliveryMethod: 'Push' | 'Email' | 'SMS';
  targetAudience: 'Tüm Kullanıcılar' | 'Mahalle Bazlı' | 'Doğrulanmış Kullanıcılar';
  sentDate: string;
  sentCount: number;
  openedCount: number;
  clickedCount: number;
  status: 'tamamlandı' | 'planlandı' | 'gönderiliyor';
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Yeni Güvenlik Özelliği',
    message: 'Hesabınızı iki aşamalı doğrulama ile koruyun',
    deliveryMethod: 'Push',
    targetAudience: 'Tüm Kullanıcılar',
    sentDate: '2024-03-09 14:30',
    sentCount: 2845,
    openedCount: 1923,
    clickedCount: 456,
    status: 'tamamlandı',
  },
  {
    id: '2',
    title: 'Mahalle Etkinliği Bilgisi',
    message: 'Beşiktaş mahallesinde pazar günü piknik düzenleniyor',
    deliveryMethod: 'Email',
    targetAudience: 'Mahalle Bazlı',
    sentDate: '2024-03-08 10:00',
    sentCount: 312,
    openedCount: 187,
    clickedCount: 89,
    status: 'tamamlandı',
  },
  {
    id: '3',
    title: 'Yeni Özellikler Erişim İzni',
    message: 'Premium özelliklerine erişim izni aldığınız mahalleye katılın',
    deliveryMethod: 'Push',
    targetAudience: 'Doğrulanmış Kullanıcılar',
    sentDate: '2024-03-07 16:45',
    sentCount: 1234,
    openedCount: 892,
    clickedCount: 234,
    status: 'tamamlandı',
  },
  {
    id: '4',
    title: 'Hesap Güvenliği Uyarısı',
    message: 'Bilginiz yeni bir cihazdan erişildi',
    deliveryMethod: 'SMS',
    targetAudience: 'Tüm Kullanıcılar',
    sentDate: '2024-03-06 12:15',
    sentCount: 3456,
    openedCount: 2987,
    clickedCount: 123,
    status: 'tamamlandı',
  },
  {
    id: '5',
    title: 'Mahalle Uzlaşması',
    message: 'Komşularınızla ortak çiçek satın almaya katılın',
    deliveryMethod: 'Email',
    targetAudience: 'Mahalle Bazlı',
    sentDate: '2024-03-05 09:30',
    sentCount: 456,
    openedCount: 289,
    clickedCount: 67,
    status: 'tamamlandı',
  },
  {
    id: '6',
    title: 'Platform Güncellemesi',
    message: 'Yeni sürüm yayınlandı. Lütfen güncelleyin',
    deliveryMethod: 'Push',
    targetAudience: 'Tüm Kullanıcılar',
    sentDate: '2024-03-04 08:00',
    sentCount: 4567,
    openedCount: 3234,
    clickedCount: 789,
    status: 'tamamlandı',
  },
  {
    id: '7',
    title: 'İşletme Kaydolması',
    message: 'Yerel işletme önerisi - Saç ve güzellik hizmetleri',
    deliveryMethod: 'Email',
    targetAudience: 'Mahalle Bazlı',
    sentDate: '2024-03-03 14:20',
    sentCount: 234,
    openedCount: 145,
    clickedCount: 34,
    status: 'tamamlandı',
  },
  {
    id: '8',
    title: 'Kampanya Başladı',
    message: 'Mahalle temizliği kampanyasına katılın',
    deliveryMethod: 'Push',
    targetAudience: 'Doğrulanmış Kullanıcılar',
    sentDate: '2024-03-02 11:00',
    sentCount: 678,
    openedCount: 512,
    clickedCount: 145,
    status: 'tamamlandı',
  },
  {
    id: '9',
    title: 'Haftalık Özet',
    message: 'Bu haftanın en popüler gönderileri görmek için tıklayın',
    deliveryMethod: 'Email',
    targetAudience: 'Tüm Kullanıcılar',
    sentDate: '2024-03-01 20:00',
    sentCount: 5234,
    openedCount: 3456,
    clickedCount: 890,
    status: 'tamamlandı',
  },
  {
    id: '10',
    title: 'Yeni Güvenlik Sertifikası',
    message: 'Mahallede bulunan işletmeler yeni sertifika aldı',
    deliveryMethod: 'Push',
    targetAudience: 'Mahalle Bazlı',
    sentDate: '2024-02-28 13:30',
    sentCount: 189,
    openedCount: 134,
    clickedCount: 23,
    status: 'tamamlandı',
  },
];

const DELIVERY_METHOD_ICONS: Record<string, React.ReactNode> = {
  Push: <Bell size={16} />,
  Email: <Mail size={16} />,
  SMS: <MessageCircle size={16} />,
};

const DELIVERY_METHOD_COLORS: Record<string, string> = {
  Push: 'bg-blue-100 text-blue-800',
  Email: 'bg-purple-100 text-purple-800',
  SMS: 'bg-orange-100 text-orange-800',
};

export default function BildirimlerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    deliveryMethod: 'Push',
    targetAudience: 'Tüm Kullanıcılar',
    scheduleDate: '',
  });

  const itemsPerPage = 8;

  const filteredNotifications = useMemo(() => {
    return MOCK_NOTIFICATIONS.filter((notif) => {
      const matchesSearch =
        notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notif.message.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [searchTerm]);

  const paginatedNotifications = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredNotifications.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredNotifications, currentPage]);

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

  const calculateOpenRate = (opened: number, sent: number) => {
    if (sent === 0) return 0;
    return ((opened / sent) * 100).toFixed(1);
  };

  const totalSent = MOCK_NOTIFICATIONS.reduce((sum, n) => sum + n.sentCount, 0);
  const totalOpened = MOCK_NOTIFICATIONS.reduce((sum, n) => sum + n.openedCount, 0);
  const totalClicked = MOCK_NOTIFICATIONS.reduce((sum, n) => sum + n.clickedCount, 0);

  const stats = [
    {
      title: 'Toplam Gönderilen',
      value: totalSent.toLocaleString(),
      icon: '📤',
      color: '#00833e',
    },
    {
      title: 'Toplam Açılanmış',
      value: totalOpened.toLocaleString(),
      icon: '👁️',
      color: '#4CAF50',
    },
    {
      title: 'Toplam Tıklamalar',
      value: totalClicked.toLocaleString(),
      icon: '👆',
      color: '#2196F3',
    },
    {
      title: 'Açılma Oranı',
      value: `${((totalOpened / totalSent) * 100).toFixed(1)}%`,
      icon: '📊',
      color: '#FF9800',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bildirim Yönetimi</h1>
          <p className="text-gray-600">
            Push, email ve SMS bildirimlerini gönderin ve istatistikleri takip edin
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-[#00833e] text-white rounded-lg hover:bg-[#006b32] font-medium flex items-center gap-2"
        >
          <Send size={18} />
          Bildirim Gönder
        </button>
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

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg border border-[#e0e0e0] mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Yeni Bildirim Oluştur</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Başlık
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Bildirim başlığı..."
                className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Mesaj
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Bildirim mesajı..."
                rows={4}
                className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Gönderim Yöntemi
                </label>
                <select
                  value={formData.deliveryMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, deliveryMethod: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
                >
                  <option>Push</option>
                  <option>Email</option>
                  <option>SMS</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Hedef Kitle
                </label>
                <select
                  value={formData.targetAudience}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAudience: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
                >
                  <option>Tüm Kullanıcılar</option>
                  <option>Mahalle Bazlı</option>
                  <option>Doğrulanmış Kullanıcılar</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Planlanan Tarih (Boş bırakılırsa hemen gönderilir)
              </label>
              <input
                type="datetime-local"
                value={formData.scheduleDate}
                onChange={(e) =>
                  setFormData({ ...formData, scheduleDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({
                    title: '',
                    message: '',
                    deliveryMethod: 'Push',
                    targetAudience: 'Tüm Kullanıcılar',
                    scheduleDate: '',
                  });
                }}
                className="flex-1 px-4 py-2 border border-[#e0e0e0] rounded-lg text-gray-900 font-medium hover:bg-[#f0f2f5]"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({
                    title: '',
                    message: '',
                    deliveryMethod: 'Push',
                    targetAudience: 'Tüm Kullanıcılar',
                    scheduleDate: '',
                  });
                }}
                className="flex-1 px-4 py-2 bg-[#00833e] text-white rounded-lg font-medium hover:bg-[#006b32]"
              >
                Gönder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-lg border border-[#e0e0e0] mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Bildirim başlığı veya mesajda ara..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00833e]"
          />
        </div>
      </div>

      {/* Notifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {paginatedNotifications.map((notif) => (
          <div
            key={notif.id}
            className="bg-white p-6 rounded-lg border border-[#e0e0e0] hover:shadow-lg transition cursor-pointer"
            onClick={() => setSelectedNotif(notif)}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900 flex-1">{notif.title}</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                  DELIVERY_METHOD_COLORS[notif.deliveryMethod]
                }`}
              >
                {DELIVERY_METHOD_ICONS[notif.deliveryMethod]}
                {notif.deliveryMethod}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{notif.message}</p>
            <div className="flex gap-2 mb-3 flex-wrap">
              <span className="text-xs px-2 py-1 bg-[#f0f2f5] text-gray-700 rounded">
                {notif.targetAudience}
              </span>
              <span className="text-xs px-2 py-1 bg-[#f0f2f5] text-gray-700 rounded">
                {notif.sentDate}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#e0e0e0]">
              <div>
                <p className="text-xs text-gray-500">Gönderilen</p>
                <p className="font-bold text-gray-900">{notif.sentCount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Açılma</p>
                <p className="font-bold text-gray-900">
                  {calculateOpenRate(notif.openedCount, notif.sentCount)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Tıklamalar</p>
                <p className="font-bold text-gray-900">{notif.clickedCount}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {filteredNotifications.length === 0 ? (
            'Sonuç bulunamadı'
          ) : (
            <>
              Sayfa {currentPage} / {totalPages} ({filteredNotifications.length} bildirim)
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

      {/* Detail Modal */}
      {selectedNotif && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-[#e0e0e0] flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900">Bildirim Detayı</h2>
              <button
                onClick={() => setSelectedNotif(null)}
                className="text-gray-500 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 font-semibold">Başlık</p>
                <p className="text-gray-900 mt-1 font-semibold">{selectedNotif.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold">Mesaj</p>
                <p className="text-gray-900 mt-1">{selectedNotif.message}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Gönderim Yöntemi</p>
                  <p className="text-gray-900 mt-1">{selectedNotif.deliveryMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Hedef Kitle</p>
                  <p className="text-gray-900 mt-1">{selectedNotif.targetAudience}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Gönderilen</p>
                  <p className="text-gray-900 mt-1 font-bold">
                    {selectedNotif.sentCount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Açılma Oranı</p>
                  <p className="text-gray-900 mt-1 font-bold">
                    {calculateOpenRate(selectedNotif.openedCount, selectedNotif.sentCount)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[#e0e0e0]">
              <button
                onClick={() => setSelectedNotif(null)}
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
