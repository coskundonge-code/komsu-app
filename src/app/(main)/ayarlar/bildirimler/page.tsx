"use client";

import { toast } from '@/lib/utils/show-toast';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCurrentUser } from '@/lib/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
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
  const { user } = useCurrentUser();
  const [allNotificationsOn, setAllNotificationsOn] = useState(true);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  // Load notification preferences from Supabase on mount
  useEffect(() => {
    const loadNotificationPreferences = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data: prefsData, error } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', user.id);

        if (prefsData && !error) {
          // Map multi-row database preferences to UI state
          const prefsMap: Record<string, Record<string, boolean>> = {};
          (prefsData as Record<string, unknown>[]).forEach((pref) => {
            const prefType = pref.type as string;
            if (!prefsMap[prefType]) prefsMap[prefType] = {};
            const enabled = pref[`${prefType}_enabled` as string];
            prefsMap[prefType][prefType] = Boolean(enabled);
          });

          const updated = notifications.map((notif) => ({
            ...notif,
            email: Boolean(prefsMap['email']?.email_enabled ?? notif.email),
            inApp: Boolean(prefsMap['in_app']?.in_app_enabled ?? notif.inApp),
            push: Boolean(prefsMap['push']?.push_enabled ?? notif.push),
          }));
          setNotifications(updated);
          setAllNotificationsOn(updated.every((n) => n.email && n.inApp && n.push));
        }
      } catch (err) {
        console.error('Failed to load notification preferences:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotificationPreferences();
  }, [user?.id]);

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

  const handleSave = async () => {
    if (!user?.id) {
      toast.error('Giriş yapmanız gerekir');
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();

      // Build multi-row preferences array
      const prefsToUpsert = [
        {
          user_id: user.id,
          type: 'email',
          email_enabled: notifications.some((n) => n.email),
          push_enabled: false,
          in_app_enabled: false,
        },
        {
          user_id: user.id,
          type: 'push',
          email_enabled: false,
          push_enabled: notifications.some((n) => n.push),
          in_app_enabled: false,
        },
        {
          user_id: user.id,
          type: 'in_app',
          email_enabled: false,
          push_enabled: false,
          in_app_enabled: notifications.some((n) => n.inApp),
        },
      ];

      const { error } = await supabase
        .from('notification_preferences')
        .upsert(prefsToUpsert as any, { onConflict: 'user_id,type' });

      if (!error) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        console.error('Failed to save preferences:', error);
        toast.error('Bildirim ayarları kaydedilirken bir hata oluştu.');
      }
    } catch (err) {
      console.error('Error saving preferences:', err);
      toast.error('Bildirim ayarları kaydedilirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-2 sm:px-4 py-3 sm:py-4 flex items-center gap-3">
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
      <div className="max-w-2xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
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
            disabled={isLoading}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              saved
                ? "bg-primary text-white"
                : "bg-primary text-white hover:bg-primary-hover"
            }`}
          >
            {saved ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5" /> Kaydedildi
              </span>
            ) : isLoading ? (
              "Kaydediliyor..."
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
