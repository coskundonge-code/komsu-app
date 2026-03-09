'use client';

import { useState } from 'react';
import { Bell, Mail, MessageSquare, Heart, AlertCircle, MapPin, Store } from 'lucide-react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface NotificationSetting {
  id: string;
  label: string;
  icon: React.ReactNode;
  email: boolean;
  inApp: boolean;
  push: boolean;
}

export default function BildirimlerPage() {
  const [allNotificationsOn, setAllNotificationsOn] = useState(true);
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'posts',
      label: 'Gönderiler',
      icon: <MessageSquare className="w-5 h-5" />,
      email: true,
      inApp: true,
      push: true,
    },
    {
      id: 'comments',
      label: 'Yorumlar',
      icon: <MessageSquare className="w-5 h-5" />,
      email: true,
      inApp: true,
      push: false,
    },
    {
      id: 'likes',
      label: 'Beğeniler',
      icon: <Heart className="w-5 h-5" />,
      email: false,
      inApp: true,
      push: true,
    },
    {
      id: 'messages',
      label: 'Mesajlar',
      icon: <Mail className="w-5 h-5" />,
      email: true,
      inApp: true,
      push: true,
    },
    {
      id: 'events',
      label: 'Etkinlikler',
      icon: <AlertCircle className="w-5 h-5" />,
      email: true,
      inApp: true,
      push: false,
    },
    {
      id: 'security',
      label: 'Güvenlik Uyarıları',
      icon: <AlertCircle className="w-5 h-5" />,
      email: true,
      inApp: true,
      push: true,
    },
    {
      id: 'marketplace',
      label: 'Pazar Yeri',
      icon: <Store className="w-5 h-5" />,
      email: false,
      inApp: true,
      push: false,
    },
  ]);

  const toggleAllNotifications = () => {
    const newState = !allNotificationsOn;
    setAllNotificationsOn(newState);
    setNotifications(
      notifications.map((notif) => ({
        ...notif,
        email: newState,
        inApp: newState,
        push: newState,
      }))
    );
  };

  const toggleNotification = (id: string, type: 'email' | 'inApp' | 'push') => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, [type]: !notif[type] } : notif
      )
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <div className="bg-white border-b border-[#e0e0e0] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href="/ayarlar"
            className="p-2 hover:bg-[#f0f2f5] rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-[#333]" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f0f2f5] rounded-lg">
              <Bell className="w-6 h-6 text-[#00833e]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#333]">Bildirim Ayarları</h1>
              <p className="text-sm text-[#8f8f8f]">Hangi bildirimleri almak istediğinizi seçin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Master Toggle */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#333]">Tüm Bildirimleri Kapat</h2>
              <p className="text-sm text-[#8f8f8f] mt-1">
                Tüm bildirim türlerini bir kez kapatın
              </p>
            </div>
            <button
              onClick={toggleAllNotifications}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                allNotificationsOn ? 'bg-[#00833e]' : 'bg-[#e0e0e0]'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  allNotificationsOn ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Notification Categories */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white rounded-lg border border-[#e0e0e0] p-6"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#f0f2f5] rounded-lg text-[#00833e]">
                  {notification.icon}
                </div>
                <h3 className="font-semibold text-[#333]">{notification.label}</h3>
              </div>

              {/* Sub Toggles */}
              <div className="space-y-3">
                {/* Email Toggle */}
                <div className="flex items-center justify-between pl-11">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#8f8f8f]" />
                    <span className="text-sm text-[#404040]">E-posta</span>
                  </div>
                  <button
                    onClick={() => toggleNotification(notification.id, 'email')}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                      notification.email ? 'bg-[#00833e]' : 'bg-[#e0e0e0]'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        notification.email ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* In App Toggle */}
                <div className="flex items-center justify-between pl-11">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#8f8f8f]" />
                    <span className="text-sm text-[#404040]">Uygulama İçi</span>
                  </div>
                  <button
                    onClick={() => toggleNotification(notification.id, 'inApp')}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                      notification.inApp ? 'bg-[#00833e]' : 'bg-[#e0e0e0]'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        notification.inApp ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Push Toggle */}
                <div className="flex items-center justify-between pl-11">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#8f8f8f]" />
                    <span className="text-sm text-[#404040]">Push Bildirim</span>
                  </div>
                  <button
                    onClick={() => toggleNotification(notification.id, 'push')}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                      notification.push ? 'bg-[#00833e]' : 'bg-[#e0e0e0]'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        notification.push ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={handleSave}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              saved
                ? 'bg-[#00833e] text-white'
                : 'bg-[#00833e] text-white hover:bg-[#006b32]'
            }`}
          >
            {saved ? '✓ Kaydedildi' : 'Kaydet'}
          </button>
          <Link
            href="/ayarlar"
            className="py-3 px-4 rounded-lg font-semibold bg-white border border-[#e0e0e0] text-[#333] hover:bg-[#f0f2f5] transition-colors"
          >
            İptal
          </Link>
        </div>
      </div>
    </div>
  );
}
