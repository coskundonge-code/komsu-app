'use client';

import React from 'react';
import { CheckCheck, Filter } from 'lucide-react';
import {
  NotificationItem,
  type Notification,
} from '@/components/notifications/notification-item';

// Mock data
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Ahmet Yılmaz',
    body: 'Sizin paylaştığınız "Temizlik ipuçları" gönderisini beğendi',
    timestamp: '2 dakika',
    read: false,
    type: 'like',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    actionLink: '/komsu/ahmet-yilmaz',
  },
  {
    id: '2',
    title: 'Fatma Şahin',
    body: 'Size mesaj gönderdi: "Tükenmez kalem ve defter bölüştürebiliriz"',
    timestamp: '1 saat',
    read: false,
    type: 'message',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    actionLink: '/mesajlar/2',
  },
  {
    id: '3',
    title: 'Komşu Yardım Grubu',
    body: 'Yeni üye eklendi: Zeynep Kaya',
    timestamp: '3 saat',
    read: true,
    type: 'alert',
    actionLink: '/gruplar/komsu-yardim',
  },
  {
    id: '4',
    title: 'Mehmet Demir',
    body: 'Sizi takip etmeye başladı',
    timestamp: '5 saat',
    read: true,
    type: 'follow',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    actionLink: '/komsu/mehmet-demir',
  },
  {
    id: '5',
    title: 'Zeynep Kaya',
    body: '"Elektrik tamir hizmetleri" yazısına yorum yaptı',
    timestamp: '1 gün',
    read: true,
    type: 'comment',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    actionLink: '/yazılar/elektrik-tamir',
  },
  {
    id: '6',
    title: 'Komşu Pazarı',
    body: 'Yeni ürünler eklendi: Organik meyve ve sebzeler',
    timestamp: '1 gün',
    read: true,
    type: 'alert',
    actionLink: '/pazar',
  },
  {
    id: '7',
    title: 'Ali Köseoğlu',
    body: 'Sizin paylaştığınız "Bisiklet tamirim" gönderisini paylaştı',
    timestamp: '2 gün',
    read: true,
    type: 'share',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    actionLink: '/komsu/ali-koseoglu',
  },
  {
    id: '8',
    title: 'Sinem Yıldız',
    body: 'Sizi takip etmeye başladı',
    timestamp: '2 gün',
    read: true,
    type: 'follow',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    actionLink: '/komsu/sinem-yildiz',
  },
  {
    id: '9',
    title: 'Komşu Etkinlikleri',
    body: 'Yarın saat 15:00\'de komşu pikniği düzenlenecek',
    timestamp: '3 gün',
    read: true,
    type: 'alert',
    actionLink: '/etkinlikler/komsu-piknigi',
  },
  {
    id: '10',
    title: 'Osman Arslan',
    body: '"Bahçe ekim zamanı" yazısına yorum yaptı',
    timestamp: '3 gün',
    read: true,
    type: 'comment',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    actionLink: '/yazılar/bahce-ekim',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState(mockNotifications);
  const [filterType, setFilterType] = React.useState<'all' | 'unread'>('all');

  const filteredNotifications =
    filterType === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  // Group by date
  const groupedByDate = React.useMemo(() => {
    const groups: Record<string, Notification[]> = {};

    filteredNotifications.forEach((notification) => {
      let dateKey = notification.timestamp;

      // Categorize by time
      if (
        notification.timestamp.includes('dakika') ||
        notification.timestamp.includes('saat')
      ) {
        dateKey = 'Bugün';
      } else if (notification.timestamp.includes('gün')) {
        dateKey = 'Dün';
      } else {
        dateKey = 'Eski';
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(notification);
    });

    return groups;
  }, [filteredNotifications]);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id: string, link?: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    if (link) {
      // In a real app, navigate to the link
      console.log('Navigate to:', link);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg">
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 border-b border-emerald-100 bg-white flex items-center justify-between">
        <h1 className="text-2xl font-bold text-emerald-900">Bildirimler</h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Tümünü okunmuş olarak işaretle"
          >
            <CheckCheck size={18} />
            Tümünü Oku
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 px-4 py-3 border-b border-emerald-100 sticky top-16 z-9 bg-white">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterType === 'all'
              ? 'bg-emerald-500 text-white'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
        >
          Tümü ({notifications.length})
        </button>
        <button
          onClick={() => setFilterType('unread')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterType === 'unread'
              ? 'bg-emerald-500 text-white'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
        >
          Okunmamış ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {Object.entries(groupedByDate).length === 0 ? (
        <div className="flex items-center justify-center py-16 text-emerald-600">
          <p>Bildirim bulunamadı</p>
        </div>
      ) : (
        <div>
          {Object.entries(groupedByDate).map(([dateKey, items]) => (
            <div key={dateKey}>
              {/* Date Section Header */}
              <div className="sticky top-32 z-8 bg-emerald-50 px-4 py-2 border-b border-emerald-100">
                <h2 className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                  {dateKey}
                </h2>
              </div>

              {/* Notifications in this date */}
              {items.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onActionClick={handleNotificationClick}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
