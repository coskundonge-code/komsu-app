"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  ShoppingBag,
  Calendar,
  CheckCircle,
  AlertCircle,
  Trash2,
  AtSign,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images'

type NotificationType = "like" | "comment" | "mention" | "event" | "marketplace" | "alert";

interface Notification {
  id: string;
  type: NotificationType;
  category: "likes" | "comments" | "mentions" | "events" | "marketplace" | "alerts";
  userName: string;
  action: string;
  timestamp: string;
  read: boolean;
  avatar: string;
  href: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "like",
    category: "likes",
    userName: "Ahmet Yılmaz",
    action: "Mahalle Temizlik Günü gönderinizi beğendi",
    timestamp: "2 dakika",
    read: false,
    avatar: getFeedImageUrl(51, 96, 96),
    href: "/post/1",
  },
  {
    id: "2",
    type: "comment",
    category: "comments",
    userName: "Fatma Şahin",
    action: "Yeni açılan kafe gönderinize yorum yaptı: Harika yer!",
    timestamp: "5 dakika",
    read: false,
    avatar: getFeedImageUrl(52, 96, 96),
    href: "/post/2",
  },
  {
    id: "3",
    type: "mention",
    category: "mentions",
    userName: "Zeynep Kaya",
    action: "Sizi bir gönderide bahsetti: Komşu buluşmaları hakkında",
    timestamp: "12 dakika",
    read: false,
    avatar: getFeedImageUrl(54, 96, 96),
    href: "/post/3",
  },
  {
    id: "4",
    type: "event",
    category: "events",
    userName: "Komşu Derneği",
    action: "Komşu Kahvaltısı etkinliğine katılımınızı bekliyoruz",
    timestamp: "1 saat",
    read: false,
    avatar: getFeedImageUrl(55, 96, 96),
    href: "/etkinlikler/1",
  },
  {
    id: "5",
    type: "like",
    category: "likes",
    userName: "Mehmet Demir",
    action: "Bahçe ekim zamanı gönderinizi beğendi",
    timestamp: "3 saat",
    read: false,
    avatar: getFeedImageUrl(53, 96, 96),
    href: "/post/5",
  },
  {
    id: "6",
    type: "comment",
    category: "comments",
    userName: "Seyit Bayram",
    action: "Yardım talepleri gönderinize yorum yaptı: Bana da lazım",
    timestamp: "5 saat",
    read: false,
    avatar: getFeedImageUrl(58, 96, 96),
    href: "/post/4",
  },
  {
    id: "7",
    type: "marketplace",
    category: "marketplace",
    userName: "Ayşe Kılıç",
    action: "Satış için koyduğunuz bisikleti satın almak istiyor",
    timestamp: "6 saat",
    read: false,
    avatar: getFeedImageUrl(59, 96, 96),
    href: "/market/1",
  },
  {
    id: "8",
    type: "alert",
    category: "alerts",
    userName: "KomşuApp",
    action: "Mahallede yeni güvenlik bildirimi: Caddede bakım çalışması başlıyor",
    timestamp: "8 saat",
    read: false,
    avatar: getFeedImageUrl(60, 96, 96),
    href: "/bildirimler",
  },
  {
    id: "9",
    type: "like",
    category: "likes",
    userName: "Elif Demir",
    action: "Komşu etkinlikleri gönderinizi beğendi",
    timestamp: "1 gün",
    read: true,
    avatar: getFeedImageUrl(57, 96, 96),
    href: "/post/8",
  },
  {
    id: "10",
    type: "mention",
    category: "mentions",
    userName: "Osman Arslan",
    action: "Sizi bir yorumda bahsetti: Bahçeyle ilgili ipuçları",
    timestamp: "1 gün",
    read: true,
    avatar: getFeedImageUrl(56, 96, 96),
    href: "/post/9",
  },
  {
    id: "11",
    type: "event",
    category: "events",
    userName: "Mahalle Spor Kulübü",
    action: "Futsal turnuvası etkinliği - Cumartesi saat 15:00",
    timestamp: "2 gün",
    read: true,
    avatar: getFeedImageUrl(63, 96, 96),
    href: "/etkinlikler/2",
  },
  {
    id: "12",
    type: "comment",
    category: "comments",
    userName: "Hasan Köse",
    action: "Komşu Kahvaltısı etkinliğinin gönderiyle ilgili yorum yaptı",
    timestamp: "2 gün",
    read: true,
    avatar: getFeedImageUrl(61, 96, 96),
    href: "/post/10",
  },
  {
    id: "13",
    type: "marketplace",
    category: "marketplace",
    userName: "İbrahim Yurdu",
    action: "Bulduğunuz ürün benzerine sahip - ilgi gösterebilir",
    timestamp: "3 gün",
    read: true,
    avatar: getFeedImageUrl(64, 96, 96),
    href: "/market/2",
  },
  {
    id: "14",
    type: "alert",
    category: "alerts",
    userName: "KomşuApp",
    action: "Haftalık mahalle özeti: 12 yeni gönderi, 45 yorumlar",
    timestamp: "4 gün",
    read: true,
    avatar: getFeedImageUrl(65, 96, 96),
    href: "/bildirimler",
  },
  {
    id: "15",
    type: "like",
    category: "likes",
    userName: "Cemile Aydın",
    action: "Yerel restaurant tavsiye gönderinizi beğendi",
    timestamp: "1 hafta",
    read: true,
    avatar: getFeedImageUrl(66, 96, 96),
    href: "/post/11",
  },
  {
    id: "16",
    type: "mention",
    category: "mentions",
    userName: "Meryem Tuğrul",
    action: "Sizi bir etkinlik paylaşımında bahsetti: Komşu pikniği",
    timestamp: "1 hafta",
    read: true,
    avatar: getFeedImageUrl(62, 96, 96),
    href: "/post/12",
  },
];

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "like":
      return <Heart className="w-5 h-5 text-red-500 fill-current" />;
    case "comment":
      return <MessageCircle className="w-5 h-5 text-blue-500" />;
    case "mention":
      return <AtSign className="w-5 h-5 text-purple-500" />;
    case "alert":
      return <AlertCircle className="w-5 h-5 text-orange-500" />;
    case "marketplace":
      return <ShoppingBag className="w-5 h-5 text-[#00833e]" />;
    case "event":
      return <Calendar className="w-5 h-5 text-amber-600" />;
    default:
      return <Bell className="w-5 h-5 text-[#00833e]" />;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case "like":
      return "bg-red-50 border-l-red-500";
    case "comment":
      return "bg-blue-50 border-l-blue-500";
    case "mention":
      return "bg-purple-50 border-l-purple-500";
    case "alert":
      return "bg-orange-50 border-l-orange-500";
    case "marketplace":
      return "bg-green-50 border-l-[#00833e]";
    case "event":
      return "bg-amber-50 border-l-amber-600";
    default:
      return "bg-white border-l-transparent";
  }
};

const tabs = [
  { id: "all", label: "Tümü" },
  { id: "unread", label: "Okunmamış" },
  { id: "mentions", label: "Bahsetmeler" },
  { id: "events", label: "Etkinlikler" },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") {
      return notifications;
    } else if (activeTab === "unread") {
      return notifications.filter((n) => !n.read);
    } else {
      return notifications.filter((n) => n.category === activeTab);
    }
  }, [notifications, activeTab]);

  const grouped = useMemo(() => {
    const groups: Record<string, Notification[]> = {};
    const dateOrder = ["Bugün", "Dün", "Bu Hafta", "Daha Eski"];

    filteredNotifications.forEach((n) => {
      let key: string;

      if (n.timestamp.includes("dakika") || n.timestamp.includes("saat")) {
        key = "Bugün";
      } else if (n.timestamp === "1 gün") {
        key = "Dün";
      } else if (
        n.timestamp === "2 gün" ||
        n.timestamp === "3 gün" ||
        n.timestamp === "4 gün" ||
        n.timestamp === "5 gün" ||
        n.timestamp === "6 gün"
      ) {
        key = "Bu Hafta";
      } else {
        key = "Daha Eski";
      }

      if (!groups[key]) groups[key] = [];
      groups[key].push(n);
    });

    const sortedGroups: Record<string, Notification[]> = {};
    dateOrder.forEach((date) => {
      if (groups[date]) {
        sortedGroups[date] = groups[date];
      }
    });

    return sortedGroups;
  }, [filteredNotifications]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="bg-white border-b border-[#e0e0e0] sticky top-0 z-10 mb-4 rounded-lg">
          <div className="py-4 px-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e6f4ec] flex items-center justify-center">
                  <Bell size={20} className="text-[#00833e]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#333]">Bildirimler</h1>
                </div>
                {unreadCount > 0 && (
                  <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full ml-2">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm font-medium text-[#00833e] hover:text-[#006b32] transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle size={16} />
                  <span className="hidden sm:inline">Tümünü Okundu İşaretle</span>
                  <span className="sm:hidden">Tümü Okundu</span>
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-0 border-b border-[#e0e0e0] -mx-4 px-4 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-3 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    activeTab === tab.id
                      ? "border-[#00833e] text-[#00833e]"
                      : "border-transparent text-[#8f8f8f] hover:text-[#333]"
                  )}
                >
                  {tab.label}
                  {tab.id === "unread" && unreadCount > 0 && (
                    <span className="ml-1.5 text-xs font-bold text-red-500">
                      ({unreadCount})
                    </span>
                  )}
                  {tab.id === "mentions" && (
                    <span className="ml-1.5 text-xs font-medium text-[#8f8f8f]">
                      ({notifications.filter((n) => n.category === "mentions").length})
                    </span>
                  )}
                  {tab.id === "events" && (
                    <span className="ml-1.5 text-xs font-medium text-[#8f8f8f]">
                      ({notifications.filter((n) => n.category === "events").length})
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
            <div className="w-16 h-16 rounded-full bg-[#f0f2f5] flex items-center justify-center mx-auto mb-4">
              <Bell size={32} className="text-[#8f8f8f]" />
            </div>
            <p className="text-[#333] font-medium text-lg">Bildirim yok</p>
            <p className="text-[#8f8f8f] text-sm mt-2">
              {activeTab === "unread"
                ? "Okunmamış bildiriminiz bulunmuyor"
                : activeTab === "mentions"
                ? "Bahsetme bildirimleri görünecek"
                : activeTab === "events"
                ? "Etkinlik bildirimleri görünecek"
                : "Yeni bildirimleriniz burada görünecek"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([dateKey, items]) => (
              <div key={dateKey}>
                <h2 className="text-xs font-semibold text-[#8f8f8f] uppercase tracking-wider px-3 py-2 sticky top-20 bg-[#f0f2f5] rounded-lg">
                  {dateKey}
                </h2>
                <div className="space-y-2">
                  {items.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-lg transition-all border-l-4 group relative",
                        !notification.read
                          ? "bg-[#e6f4ec] border-l-[#00833e] hover:bg-[#d1fae5] shadow-sm"
                          : getNotificationColor(notification.type),
                        "border"
                      )}
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0 z-10">
                        <Image
                          src={notification.avatar}
                          alt={notification.userName}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                          unoptimized
                        />
                        {/* Icon Badge */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 flex items-center justify-center shadow-sm"
                          style={{
                            borderColor: notification.type === "like" ? "#ef4444" :
                                       notification.type === "comment" ? "#3b82f6" :
                                       notification.type === "mention" ? "#a855f7" :
                                       notification.type === "alert" ? "#f97316" :
                                       notification.type === "marketplace" ? "#00833e" :
                                       notification.type === "event" ? "#b45309" : "#00833e"
                          }}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>

                      {/* Content */}
                      <Link
                        href={notification.href}
                        onClick={() => markAsRead(notification.id)}
                        className="flex-1 min-w-0 text-left pt-0.5 z-10 hover:opacity-80 transition-opacity"
                      >
                        <p className="text-sm leading-snug">
                          <span className={cn(
                            "font-bold",
                            !notification.read ? "text-[#333]" : "text-[#404040]"
                          )}>
                            {notification.userName}
                          </span>
                          <span className={cn(
                            !notification.read ? "text-[#333] font-medium" : "text-[#8f8f8f]"
                          )}>
                            {" "}{notification.action}
                          </span>
                        </p>
                        <p className="text-xs text-[#8f8f8f] mt-1">{notification.timestamp}</p>
                      </Link>

                      {/* Action Buttons */}
                      <div className="flex-shrink-0 z-10 flex items-center gap-2">
                        {!notification.read && (
                          <>
                            <span className="w-2.5 h-2.5 bg-[#00833e] rounded-full block shadow-sm" />
                          </>
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            markAsRead(notification.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-white/50 text-[#8f8f8f] hover:text-[#333]"
                          title={notification.read ? "Mark as unread" : "Mark as read"}
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            deleteNotification(notification.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-white/50 text-[#8f8f8f] hover:text-red-500"
                          title="Delete notification"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
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
