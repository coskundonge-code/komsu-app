"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronLeft,
  Mail,
  MessageSquare,
  Heart,
  AlertCircle,
  MapPin,
  Store,
  Smartphone,
  Check,
} from "lucide-react";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  email: boolean;
  inApp: boolean;
  push: boolean;
}

interface NotificationChannel {
  type: "email" | "inApp" | "push";
  label: string;
  description: string;
  icon: React.ReactNode;
}

export default function BildirimlerPage() {
  const [allNotificationsOn, setAllNotificationsOn] = useState(true);
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: "posts",
      label: "Gönderiler",
      description: "Mahallenizdeki yeni gönderilerle ilgili bildirim alın",
      icon: <MessageSquare className="w-5 h-5" />,
      email: true,
      inApp: true,
      push: true,
    },
    {
      id: "comments",
      label: "Yorumlar",
      description: "Gönderilerinizin altında yeni yorumlar olduğunda bildirim alın",
      icon: <MessageSquare className="w-5 h-5" />,
      email: true,
      inApp: true,
      push: false,
    },
    {
      id: "likes",
      label: "Beğeniler",
      description: "Gönderileriniz beğenildiğinde bildirim alın",
      icon: <Heart className="w-5 h-5" />,
      email: false,
      inApp: true,
      push: true,
    },
    {
      id: "events",
      label: "Etkinlikler",
      description: "Mahallenizdeki yeni etkinlikler hakkında bildir kalın",
      icon: <AlertCircle className="w-5 h-5" />,
      email: true,
      inApp: true,
      push: false,
    },
    {
      id: "marketplace",
      label: "Pazar Yeri",
      description: "Ilgi alanlarınızdaki yeni ürünler hakkında bilgilenin",
      icon: <Store className="w-5 h-5" />,
      email: false,
      inApp: true,
      push: false,
    },
    {
      id: "security",
      label: "Güvenlik Uyarıları",
      description: "Hesabınızla ilgili önemli güvenlik olayları",
      icon: <AlertCircle className="w-5 h-5" />,
      email: true,
      inApp: true,
      push: true,
    },
  ]);

  const notificationChannels: NotificationChannel[] = [
    {
      type: "email",
      label: "E-posta",
      description: "E-posta ile bildirim alın",
      icon: <Mail className="w-4 h-4" />,
    },
    {
      type: "inApp",
      label: "Uygulama İçi",
      description: "Uygulama içinde bildirim göster",
      icon: <Bell className="w-4 h-4" />,
    },
    {
      type: "push",
      label: "Push Bildirim",
      description: "Telefondaki push bildirimleri al",
      icon: <Smartphone className="w-4 h-4" />,
    },
  ];

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

  const toggleNotification = (id: string, type: "email" | "inApp" | "push") => {
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href="/ayarlar"
            className="p-2 hover:bg-background rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-text-primary" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-background rounded-lg">
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Bildirim Ayarları</h1>
              <p className="text-sm text-text-muted">
                Hangi bildirimleri almak istediğinizi seçin
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Master Toggle */}
        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Tüm Bildirimleri Aç/Kapat
              </h2>
              <p className="text-sm text-text-muted mt-1">
                Tüm bildirim türlerini bir kez ayarlayın
              </p>
            </div>
            <button
              onClick={toggleAllNotifications}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors flex-shrink-0 ${
                allNotificationsOn ? "bg-primary" : "bg-[#e0e0e0]"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-surface transition-transform ${
                  allNotificationsOn ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Notification Channels Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {notificationChannels.map((channel) => (
            <div
              key={channel.type}
              className="bg-surface rounded-lg border border-border p-4"
            >
              <div className="flex items-center gap-2 mb-2 text-primary">
                {channel.icon}
                <h3 className="font-semibold text-text-primary text-sm">
                  {channel.label}
                </h3>
              </div>
              <p className="text-xs text-text-muted">{channel.description}</p>
            </div>
          ))}
        </div>

        {/* Notification Categories */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-text-primary">Bildirim Türleri</h2>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-surface rounded-lg border border-border p-6"
            >
              {/* Category Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2.5 bg-background rounded-lg text-primary">
                  {notification.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">
                    {notification.label}
                  </h3>
                  <p className="text-sm text-text-muted mt-1">
                    {notification.description}
                  </p>
                </div>
              </div>

              {/* Channel Toggles */}
              <div className="space-y-3 pl-11">
                {/* Email Toggle */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-text-muted" />
                    <span className="text-sm text-text-secondary">E-posta</span>
                  </div>
                  <button
                    onClick={() => toggleNotification(notification.id, "email")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                      notification.email ? "bg-primary" : "bg-[#e0e0e0]"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-surface transition-transform ${
                        notification.email ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* In App Toggle */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-text-muted" />
                    <span className="text-sm text-text-secondary">Uygulama İçi</span>
                  </div>
                  <button
                    onClick={() => toggleNotification(notification.id, "inApp")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                      notification.inApp ? "bg-primary" : "bg-[#e0e0e0]"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-surface transition-transform ${
                        notification.inApp ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Push Toggle */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-text-muted" />
                    <span className="text-sm text-text-secondary">Push Bildirim</span>
                  </div>
                  <button
                    onClick={() => toggleNotification(notification.id, "push")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                      notification.push ? "bg-primary" : "bg-[#e0e0e0]"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-surface transition-transform ${
                        notification.push ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Advanced Options */}
        <div className="bg-surface rounded-lg border border-border p-6 mb-8">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            İleri Seçenekler
          </h2>
          <div className="space-y-4">
            {/* Quiet Hours */}
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div>
                <p className="text-sm font-medium text-text-primary">Sessiz Saatler</p>
                <p className="text-xs text-text-muted mt-1">
                  Bildirimleri belirli saatlerde engelle
                </p>
              </div>
              <button className="px-4 py-2 text-sm text-primary font-medium hover:bg-surface rounded-lg transition-colors">
                Ayarla
              </button>
            </div>

            {/* Digest Emails */}
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div>
                <p className="text-sm font-medium text-text-primary">Özet E-postalar</p>
                <p className="text-xs text-text-muted mt-1">
                  Haftada bir, önemli olayların özeti
                </p>
              </div>
              <button
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 bg-primary`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-surface transition-transform translate-x-6`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3 mb-12">
          <button
            onClick={handleSave}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              saved
                ? "bg-primary text-white"
                : "bg-primary text-white hover:bg-primary-hover"
            }`}
          >
            {saved ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5" /> Kaydedildi
              </span>
            ) : (
              "Kaydet"
            )}
          </button>
          <Link
            href="/ayarlar"
            className="py-3 px-4 rounded-lg font-semibold bg-surface border border-border text-text-primary hover:bg-background transition-colors"
          >
            İptal
          </Link>
        </div>
      </div>
    </div>
  );
}
