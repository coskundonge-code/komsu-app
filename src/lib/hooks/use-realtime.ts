'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCurrentUser } from './use-auth'

interface Notification {
  id: string
  type: 'new_post' | 'new_message' | 'new_comment' | 'new_reaction' | 'alert'
  title: string
  body: string
  createdAt: string
  isRead: boolean
  link?: string
}

export function useRealtimeNotifications() {
  const { user } = useCurrentUser()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    setUnreadCount(0)
  }, [])

  useEffect(() => {
    if (!user) return

    const supabase = createClient()

    // Listen for new posts in user's neighborhoods
    const postsChannel = supabase.channel('realtime_posts')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'posts'
      }, (payload: any) => {
        if (payload.new.author_id !== user.id) {
          const newNotif: Notification = {
            id: `post-${payload.new.id}`,
            type: 'new_post',
            title: 'Yeni Gönderi',
            body: payload.new.title || payload.new.body?.substring(0, 60) + '...' || 'Yeni bir gönderi paylaşıldı',
            createdAt: payload.new.created_at,
            isRead: false,
            link: `/gonderi/${payload.new.id}`
          }
          setNotifications(prev => [newNotif, ...prev].slice(0, 50))
          setUnreadCount(prev => prev + 1)
        }
      })
      .subscribe()

    // Listen for new messages to this user
    const messagesChannel = supabase.channel('realtime_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload: any) => {
        if (payload.new.sender_id !== user.id) {
          const newNotif: Notification = {
            id: `msg-${payload.new.id}`,
            type: 'new_message',
            title: 'Yeni Mesaj',
            body: payload.new.body?.substring(0, 60) || 'Yeni bir mesaj aldınız',
            createdAt: payload.new.created_at,
            isRead: false,
            link: '/mesajlar'
          }
          setNotifications(prev => [newNotif, ...prev].slice(0, 50))
          setUnreadCount(prev => prev + 1)
        }
      })
      .subscribe()

    // Listen for new comments on user's posts
    const commentsChannel = supabase.channel('realtime_comments')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'comments'
      }, (payload: any) => {
        if (payload.new.author_id !== user.id) {
          const newNotif: Notification = {
            id: `comment-${payload.new.id}`,
            type: 'new_comment',
            title: 'Yeni Yorum',
            body: payload.new.body?.substring(0, 60) || 'Gönderinize yeni bir yorum yapıldı',
            createdAt: payload.new.created_at,
            isRead: false,
            link: `/gonderi/${payload.new.post_id}`
          }
          setNotifications(prev => [newNotif, ...prev].slice(0, 50))
          setUnreadCount(prev => prev + 1)
        }
      })
      .subscribe()

    // Listen for alerts
    const alertsChannel = supabase.channel('realtime_alerts')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'alerts'
      }, (payload: any) => {
        const newNotif: Notification = {
          id: `alert-${payload.new.id}`,
          type: 'alert',
          title: 'Yeni Uyarı',
          body: payload.new.title || 'Yeni bir mahalle uyarısı',
          createdAt: payload.new.created_at,
          isRead: false,
          link: '/uyarilar'
        }
        setNotifications(prev => [newNotif, ...prev].slice(0, 50))
        setUnreadCount(prev => prev + 1)
      })
      .subscribe()

    return () => {
      postsChannel.unsubscribe()
      messagesChannel.unsubscribe()
      commentsChannel.unsubscribe()
      alertsChannel.unsubscribe()
    }
  }, [user])

  return { notifications, unreadCount, markAsRead, markAllAsRead }
}
