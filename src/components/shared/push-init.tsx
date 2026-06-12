'use client'

// Native uygulamada push token kaydı (mağaza hazırlığı 2026-06-11).
// Web'de hiçbir şey yapmaz; Capacitor içinde giriş yapmış kullanıcı için
// cihaz token'ını push_tokens tablosuna upsert eder. Bildirim GÖNDERİMİ
// Firebase projesi açılınca eklenecek — bu bileşen token envanterini
// şimdiden biriktirir.

import { useEffect, useRef } from 'react'
import { isNativeApp, registerAndStorePushToken } from '@/lib/capacitor'
import { useCurrentUser } from '@/lib/hooks/use-auth'
import { createClient } from '@/lib/supabase/client'

export function PushInit() {
  const { user } = useCurrentUser()
  const registeredFor = useRef<string | null>(null)

  useEffect(() => {
    if (!user?.id || !isNativeApp() || registeredFor.current === user.id) return
    registeredFor.current = user.id

    registerAndStorePushToken(user.id, async (token, platform) => {
      const supabase = createClient() as any
      await supabase
        .from('push_tokens')
        .upsert({ user_id: user.id, token, platform, updated_at: new Date().toISOString() }, { onConflict: 'token' })
    })
  }, [user?.id])

  return null
}
