'use client'

import Link from 'next/link'
import { X, Bell } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  type: 'new_comment' | 'new_reaction' | 'new_follower' | 'event_reminder' | 'safety_alert' | 'marketplace_message'
  userAvatar: string
  userName: string
  text: string
  timestamp: Date
  isRead: boolean
}

// Mock notifications data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'new_comment',
    userAvatar: 'A',
    userName: 'Ayşe Kaya',
    text: 'Postunuza yorum yaptı: "Çok güzel bir fikir!"',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 saat önce
    isRead: false,
  },
  {
    id: '2',
    type: 'new_reaction',
    userAvatar: 'M',
    userName: 'Mehmet Çetin',
    text: 'Paylaşımınıza ❤️ tepki verdi',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 saat önce
    isRead: false,
  },
  {
    id: '3',
    type: 'new_follower',
    userAvatar: 'F',
    userName: 'Fatma Demir',
    text: 'Sizi takip etmeye başladı',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 gün önce
    isRead: true,
  },
  {
    id: '4',
    type: 'marketplace_message',
    userAvatar: 'O',
    userName: 'Osman Yıldız',
    text: 'Market ilanınız hakkında soru sordu',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 gün önce
    isRead: true,
  },
  {
    id: '5',
    type: 'event_reminder',
    userAvatar: 'K',
    userName: 'Komşu Etkinliği',
    text: 'Yarın saat 14:00\'de mahalle pikniği başlayacak',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 gün önce
    isRead: true,
  },
  {
    id: '6',
    type: 'safety_alert',
    userAvatar: 'G',
    userName: 'Güvenlik Uyarısı',
    text: 'Mahallenizde kayıp bir çocuk raporu verildi',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 gün önce
    isRead: true,
  },
  {
    id: '7',
    type: 'new_comment',
    userAvatar: 'S',
    userName: 'Selim Kara',
    text: 'Etkinlik ilanına yorum yaptı: "Çok iyi olur!"',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 gün önce
    isRead: true,
  },
  {
    id: '8',
    type: 'marketplace_message',
    userAvatar: 'Z',
    userName: 'Zeynep Aydın',
    text: 'Sattığınız ürün hakkında mesaj gönderdi',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 gün önce
    isRead: true,
  },
  {
    id: '9',
    type: 'new_follower',
    userAvatar: 'H',
    userName: 'Hakan Ünal',
    text: 'Sizi takip etmeye başladı',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 gün önce
    isRead: true,
  },
  {
    id: '10',
    type: 'new_reaction',
    userAvatar: 'E',
    userName: 'Elif Doğan',
    text: 'Fotoğrafınıza 👍 tepki verdi',
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 gün önce
    isRead: true,
  },
]

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'az önce'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} dakika önce`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} saat önce`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} gün önce`
  } else {
    return date.toLocaleDateString('tr-TR')
  }
}

function getNotificationIcon(type: string): string {
  switch (type) {
    case 'new_comment':
      return '💬'
    case 'new_reaction':
      return '❤️'
    case 'new_follower':
      return '👥'
    case 'event_reminder':
      return '📅'
    case 'safety_alert':
      return '⚠️'
    case 'marketplace_message':
      return '🛒'
    default:
      return '🔔'
  }
}

interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
  unreadCount: number
}

export function NotificationDropdown({
  isOpen,
  onClose,
  unreadCount,
}: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [allRead, setAllRead] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-notification-dropdown]')) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    setAllRead(true)
  }

  if (!isOpen) return null

  return (
    <div
      data-notification-dropdown
      className="absolute top-full right-0 mt-2 w-[360px] bg-white rounded-lg shadow-lg border border-[#e0e0e0] z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#e0e0e0]">
        <h3 className="text-lg font-semibold text-[#404040]">Bildirimler</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-[#f0f2f5] rounded-full transition-colors"
          aria-label="Kapat"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-[500px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Bell className="w-10 h-10 text-gray-300 mb-2" />
            <p className="text-gray-500 text-sm">Bildiriminiz yok</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                'px-4 py-3 border-b border-[#f0f2f5] hover:bg-[#f0f2f5] transition-colors cursor-pointer',
                !notification.isRead && 'bg-blue-50'
              )}
            >
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white',
                      !notification.isRead ? 'bg-[#00833e]' : 'bg-gray-400'
                    )}
                  >
                    {notification.userAvatar}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#404040] break-words">
                    <span className="font-semibold">{notification.userName}</span>{' '}
                    {notification.text}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {getTimeAgo(notification.timestamp)}
                  </p>
                </div>

                {/* Unread Indicator */}
                {!notification.isRead && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-[#00833e] rounded-full mt-1" />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[#e0e0e0] flex flex-col gap-2">
        {!allRead && unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="w-full px-4 py-2 text-sm font-medium text-[#00833e] hover:bg-[#f0f2f5] rounded transition-colors"
          >
            Tümünü Okundu İşaretle
          </button>
        )}
        <Link
          href="/bildirimler"
          onClick={onClose}
          className="w-full px-4 py-2 text-sm font-medium text-center text-[#00833e] hover:bg-[#f0f2f5] rounded transition-colors"
        >
          Tüm Bildirimler
        </Link>
      </div>
    </div>
  )
}
