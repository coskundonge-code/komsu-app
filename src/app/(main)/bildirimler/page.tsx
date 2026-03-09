'use client';

import React, { useState, useMemo } from 'react';
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  AlertTriangle,
  Share2,
  ShoppingBag,
  Calendar,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type NotificationType = 'like' | 'comment' | 'message' | 'follow' | 'alert' | 'share' | 'event' | 'group' | 'marketplace';

interface Notification {
  id: string;
  type: NotificationType;
  userName: string;
  action: string;
  timestamp: string;
  read: boolean;
  avatar: string;
  href: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    userName: 'Ahmet Yılmaz',
    action: 'Mahalle Temizlik Günü gönderinizi beğendi',
    timestamp: '2 dakika',
    read: false,
    avatar: 'https://picsum.photos/96/96?random=51',
    href: '/',
  },
  {
    id: '2',
    type: 'comment',
    userName: 'Fatma Şahin',
    action: 'Yeni açılan kafe gönderinize yorum yaptı',
    timestamp: '15 dakika',
    read: false,
    avatar: 'https://picsum.photos/96/96?random=52',
    href: '/',
  },
  {
    id: '3',
    type: 'message',
    userName: 'Mehmet Demir',
    action: 'Size mesaj gönderdi',
    timestamp: '1 saat',
    read: false,
    avatar: 'https://picsum.photos/96/96?random=53',
    href: '/mesajlar',
  },
  {
    id: '4',
    type: 'follow',
    userName: 'Zeynep Kaya',
    action: 'Sizi komşu olarak ekledi',
    timestamp: '3 saat',
    read: true,
    avatar: 'https://picsum.photos/96/96?random=54',
    href: '/profil/4',
  },
  {
    id: '5',
    type: 'event',
    userName: 'Komşu Derneği',
    action: 'Komşu Kahvaltısı etkinliğine katılımınızı bekliyoruz',
    timestamp: '5 saat',
    read: true,
    avatar: 'https://picsum.photos/96/96?random=55',
    href: '/etkinlikler/1',
  },
  {
    id: '6',
    type: 'follow',
    userName: 'Osman Arslan',
    action: 'Sizi komşu olarak ekledi',
    timestamp: '1 gün',
    read: true,
    avatar: 'https://picsum.photos/96/96?random=56',
    href: '/profil/6',
  },
  {
    id: '7',
    type: 'share',
    userName: 'Elif Demir',
    action: 'Bahçe ekim zamanı gönderinizi paylaştı',
    timestamp: '2 gün',
    read: true,
    avatar: 'https://picsum.photos/96/96?random=57',
    href: '/',
  },
  {
    id: '8',
    type: 'like',
    userName: 'Sinem Yıldız',
    action: 'Kayıp kedi gönderinizi beğendi',
    timestamp: '2 gün',
    read: true,
    avatar: 'https://picsum.photos/96/96?random=54',
    href: '/',
  },
];

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'like':
      return <Heart className="w-5 h-5 text-red-500" />;
    case 'comment':
      return <MessageCircle className="w-5 h-5 text-blue-500" />;
    case 'message':
      return <MessageCircle className="w-5 h-5 text-[#00833e]" />;
    case 'follow':
      return <UserPlus className="w-5 h-5 text-purple-500" />;
    case 'alert':
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    case 'share':
      return <Share2 className="w-5 h-5 text-blue-500" />;
    case 'event':
      return <Calendar className="w-5 h-5 text-orange-500" />;
    case 'group':
      return <Users className="w-5 h-5 text-[#00833e]" />;
    case 'marketplace':
      return <ShoppingBag className="w-5 h-5 text-[#00833e]" />;
  }
};

const tabs = [
  { id: 'all', label: 'Tümü' },
  { id: 'unread', label: 'Okunmamış' },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications =
    activeTab === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  const grouped = useMemo(() => {
    const groups: Record<string, Notification[]> = {};
    filteredNotifications.forEach((n) => {
      let key: string;
      if (n.timestamp.includes('dakika') || n.timestamp.includes('saat')) {
        key = 'Bugün';
      } else if (n.timestamp === '1 gün') {
        key = 'Dün';
      } else {
        key = 'Bu Hafta';
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(n);
    });
    return groups;
  }, [filteredNotifications]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="bg-white border-b border-[#e0e0e0] sticky top-0 z-10 mb-4">
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-[#333]">Bildirimler</h1>
                {unreadCount > 0 && (
                  <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm font-medium text-[#00833e] hover:text-[#006b32] transition-colors"
                >
                  Tümünü Okundu İşaretle
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-[#e0e0e0] -mx-4 px-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-0 py-3 text-sm font-medium border-b-2 transition-colors',
                    activeTab === tab.id
                      ? 'border-[#00833e] text-[#00833e]'
                      : 'border-transparent text-[#8f8f8f] hover:text-[#333]'
                  )}
                >
                  {tab.label}
                  {tab.id === 'unread' && unreadCount > 0 && (
                    <span className="ml-1.5 text-xs font-bold text-red-500">
                      ({unreadCount})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notification List */}
        {Object.entries(grouped).length === 0 ? (
          <div className="bg-white rounded-lg border border-[#e0e0e0] p-12 text-center">
            <Bell size={48} className="mx-auto text-[#8f8f8f] mb-3" />
            <p className="text-[#333] font-medium">Bildirim yok</p>
            <p className="text-[#8f8f8f] text-sm mt-1">Yeni bildirimleriniz burada görünecek</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([dateKey, items]) => (
              <div key={dateKey}>
                <h2 className="text-xs font-semibold text-[#8f8f8f] uppercase tracking-wider px-2 mb-2">
                  {dateKey}
                </h2>
                <div className="space-y-1">
                  {items.map((notification) => (
                    <Link
                      key={notification.id}
                      href={notification.href}
                      onClick={() => markAsRead(notification.id)}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg transition-colors border border-transparent hover:border-[#e0e0e0]',
                        !notification.read
                          ? 'bg-[#e6f4ec] hover:bg-[#d1fae5]'
                          : 'bg-white hover:bg-[#f0f2f5]'
                      )}
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={notification.avatar}
                          alt={notification.userName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {/* Icon Badge */}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border border-[#e0e0e0] flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm">
                          <span className={cn(
                            'font-bold',
                            !notification.read ? 'text-[#333]' : 'text-[#404040]'
                          )}>
                            {notification.userName}
                          </span>
                          <span className={cn(
                            !notification.read ? 'text-[#333] font-medium' : 'text-[#8f8f8f]'
                          )}>
                            {' '}{notification.action}
                          </span>
                        </p>
                        <p className="text-xs text-[#8f8f8f] mt-0.5">{notification.timestamp}</p>
                      </div>

                      {/* Unread Indicator */}
                      {!notification.read && (
                        <span className="w-2 h-2 bg-[#00833e] rounded-full flex-shrink-0" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
