'use client';

import React, { useState, useMemo } from 'react';
import {
  Bell,
  CheckCheck,
  Heart,
  MessageCircle,
  UserPlus,
  AlertTriangle,
  Share2,
  ShoppingBag,
  Calendar,
  Users,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NotificationType = 'like' | 'comment' | 'message' | 'follow' | 'alert' | 'share' | 'event' | 'group' | 'marketplace';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  avatar?: string;
  actionLink?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    title: 'Ahmet Yılmaz',
    body: '"Mahalle Temizlik Günü Organizasyonu" gönderinizi beğendi.',
    timestamp: '2 dk',
    read: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop',
  },
  {
    id: '2',
    type: 'comment',
    title: 'Fatma Şahin',
    body: '"Yeni açılan kafe" gönderinize yorum yaptı: "Kesinlikle denenmeli!"',
    timestamp: '15 dk',
    read: false,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop',
  },
  {
    id: '3',
    type: 'message',
    title: 'Mehmet Demir',
    body: 'Size mesaj gönderdi: "Elektrik ustası önerebilir misiniz?"',
    timestamp: '1 sa',
    read: false,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop',
  },
  {
    id: '4',
    type: 'alert',
    title: 'Güvenlik Uyarısı',
    body: 'Kadıköy, Moda bölgesinde şüpheli araç ihbarı yapıldı.',
    timestamp: '2 sa',
    read: false,
  },
  {
    id: '5',
    type: 'follow',
    title: 'Zeynep Kaya',
    body: 'Sizi komşu olarak ekledi.',
    timestamp: '3 sa',
    read: true,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop',
  },
  {
    id: '6',
    type: 'event',
    title: 'Komşu Kahvaltısı',
    body: 'Yarın saat 10:00\'da başlıyor. 24 kişi katılıyor.',
    timestamp: '5 sa',
    read: true,
  },
  {
    id: '7',
    type: 'group',
    title: 'Mahalle Spor Kulübü',
    body: 'Yeni bir gönderi paylaşıldı: "Haftalık antrenman programı"',
    timestamp: '8 sa',
    read: true,
  },
  {
    id: '8',
    type: 'marketplace',
    title: 'İlanınıza İlgi',
    body: 'Ali Köseoğlu "Bisiklet" ilanınızla ilgileniyor.',
    timestamp: '1 gün',
    read: true,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&fit=crop',
  },
  {
    id: '9',
    type: 'like',
    title: 'Sinem Yıldız',
    body: '"Kayıp kedi" gönderinize teşekkür etti.',
    timestamp: '1 gün',
    read: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53a8c7b1e899?w=96&h=96&fit=crop',
  },
  {
    id: '10',
    type: 'share',
    title: 'Osman Arslan',
    body: '"Bahçe ekim zamanı" gönderinizi paylaştı.',
    timestamp: '2 gün',
    read: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop',
  },
  {
    id: '11',
    type: 'comment',
    title: 'Elif Demir',
    body: '"Yoga Dersi" etkinliğine yorum yaptı: "Harika bir girişim!"',
    timestamp: '3 gün',
    read: true,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop',
  },
];

const notificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'like': return <Heart className="w-4 h-4 text-red-500" />;
    case 'comment': return <MessageCircle className="w-4 h-4 text-blue-500" />;
    case 'message': return <MessageCircle className="w-4 h-4 text-emerald-500" />;
    case 'follow': return <UserPlus className="w-4 h-4 text-purple-500" />;
    case 'alert': return <AlertTriangle className="w-4 h-4 text-red-600" />;
    case 'share': return <Share2 className="w-4 h-4 text-blue-500" />;
    case 'event': return <Calendar className="w-4 h-4 text-orange-500" />;
    case 'group': return <Users className="w-4 h-4 text-emerald-600" />;
    case 'marketplace': return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
  }
};

const notificationBgIcon = (type: NotificationType) => {
  switch (type) {
    case 'like': return 'bg-red-100';
    case 'comment': return 'bg-blue-100';
    case 'message': return 'bg-emerald-100';
    case 'follow': return 'bg-purple-100';
    case 'alert': return 'bg-red-100';
    case 'share': return 'bg-blue-100';
    case 'event': return 'bg-orange-100';
    case 'group': return 'bg-emerald-100';
    case 'marketplace': return 'bg-emerald-100';
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

  const filteredNotifications = activeTab === 'unread'
    ? notifications.filter((n) => !n.read)
    : notifications;

  const grouped = useMemo(() => {
    const groups: Record<string, Notification[]> = {};
    filteredNotifications.forEach((n) => {
      let key: string;
      if (n.timestamp.includes('dk') || n.timestamp.includes('sa')) {
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

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[680px] mx-auto px-4 py-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">Bildirimler</h1>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  Tümünü Oku
                </button>
              )}
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Settings className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-t border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'text-emerald-700 border-emerald-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                )}
              >
                {tab.label}
                {tab.id === 'unread' && unreadCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notification List */}
        {Object.entries(grouped).length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium mb-1">Bildirim yok</p>
            <p className="text-gray-400 text-sm">Yeni bildirimleriniz burada görünecek.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([dateKey, items]) => (
              <div key={dateKey}>
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1 mb-2">
                  {dateKey}
                </h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden divide-y divide-gray-100">
                  {items.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={cn(
                        'w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition-colors',
                        !n.read && 'bg-emerald-50/50'
                      )}
                    >
                      {/* Avatar or Icon */}
                      <div className="relative flex-shrink-0">
                        {n.avatar ? (
                          <img
                            src={n.avatar}
                            alt={n.title}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className={cn('w-12 h-12 rounded-full flex items-center justify-center', notificationBgIcon(n.type))}>
                            {notificationIcon(n.type)}
                          </div>
                        )}
                        {/* Type icon badge */}
                        {n.avatar && (
                          <span className={cn(
                            'absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white',
                            notificationBgIcon(n.type)
                          )}>
                            {React.cloneElement(notificationIcon(n.type) as React.ReactElement<{ className?: string }>, { className: 'w-2.5 h-2.5' })}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-sm', !n.read ? 'font-semibold text-gray-900' : 'text-gray-800')}>
                          <span className="font-semibold">{n.title}</span>{' '}
                          <span className={cn(!n.read ? 'font-normal' : 'font-normal text-gray-600')}>
                            {n.body}
                          </span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{n.timestamp}</p>
                      </div>

                      {/* Unread dot */}
                      {!n.read && (
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </button>
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
