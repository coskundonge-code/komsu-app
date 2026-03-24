'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, X, MessageCircle, FileText, AlertTriangle, Heart } from 'lucide-react'
import { useRealtimeNotifications } from '@/lib/hooks/use-realtime'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useRealtimeNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const getIcon = (type: string) => {
    switch (type) {
      case 'new_message': return MessageCircle
      case 'new_post': return FileText
      case 'alert': return AlertTriangle
      case 'new_comment': return MessageCircle
      case 'new_reaction': return Heart
      default: return Bell
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000)
    if (diff < 1) return 'Az önce'
    if (diff < 60) return `${diff} dk`
    if (diff < 1440) return `${Math.floor(diff / 60)} sa`
    return `${Math.floor(diff / 1440)} gün`
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-surface-hover rounded-full transition-colors"
        aria-label={`Bildirimler${unreadCount > 0 ? ` (${unreadCount} okunmamış)` : ''}`}
      >
        <Bell className="w-5 h-5 text-text-secondary" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-surface border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-bold text-text-primary">Bildirimler</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-primary font-medium hover:underline">
                Tümünü okundu işaretle
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-text-muted mx-auto mb-2" />
                <p className="text-sm text-text-muted">Henüz bildirim yok</p>
              </div>
            ) : (
              notifications.slice(0, 20).map(notif => {
                const Icon = getIcon(notif.type)
                return (
                  <Link
                    key={notif.id}
                    href={notif.link || '#'}
                    onClick={() => { markAsRead(notif.id); setIsOpen(false) }}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 hover:bg-surface-hover transition-colors border-b border-border/50 last:border-b-0',
                      !notif.isRead && 'bg-primary-light/30'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                      notif.type === 'alert' ? 'bg-red-100 text-red-600' :
                      notif.type === 'new_message' ? 'bg-blue-100 text-blue-600' :
                      'bg-green-100 text-green-600'
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-text-primary">{notif.title}</p>
                      <p className="text-xs text-text-muted truncate">{notif.body}</p>
                      <p className="text-[10px] text-text-muted mt-0.5">{formatTime(notif.createdAt)}</p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                    )}
                  </Link>
                )
              })
            )}
          </div>

          <Link
            href="/bildirimler"
            onClick={() => setIsOpen(false)}
            className="block text-center py-3 text-xs text-primary font-medium hover:bg-surface-hover border-t border-border"
          >
            Tüm Bildirimleri Gör
          </Link>
        </div>
      )}
    </div>
  )
}
