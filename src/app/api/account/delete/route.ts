import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'

/**
 * KVKK Madde 11 — Hesap Silme
 * POST /api/account/delete
 *
 * Kullanıcı kendi hesabını siler. Yapılan işlemler:
 *  1. profiles satırını sil (cascade ile bağlı veriler de silinir)
 *  2. auth.users'dan sil (service role gerekli)
 *  3. Storage bucket'larında kullanıcının yüklediği dosyaları sil (en iyi gayret)
 *
 * Talep doğrulaması: kullanıcının oturum cookie'si.
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limit: IP başına 5 silme talebi / saat
    const ip = getClientIp(request)
    const rl = await rateLimit(`account-delete:${ip}`, { limit: 5, windowMs: 60 * 60_000 })
    if (!rl.success) return rateLimitResponse(rl) as any

    const supabase = await createServerClient()
    const { data: { user }, error: userErr } = await supabase.auth.getUser()
    if (userErr || !user) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    if (!SUPABASE_URL || !SERVICE_KEY) {
      return NextResponse.json(
        { error: 'Hesap silme şu anda kullanılamıyor (sunucu yapılandırması eksik). Lütfen iletişim kanallarından destek isteyiniz.' },
        { status: 503 },
      )
    }

    const admin = createAdminClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // 1. Profil verisini sil (FK CASCADE ile bağlı kayıtlar da silinir)
    const { error: profileErr } = await admin.from('profiles').delete().eq('id', user.id)
    if (profileErr) {
      console.error('[account/delete] profile delete error:', profileErr)
      return NextResponse.json({ error: 'Profil silinemedi' }, { status: 500 })
    }

    // 2. Auth user'ı sil
    const { error: authErr } = await admin.auth.admin.deleteUser(user.id)
    if (authErr) {
      console.error('[account/delete] auth delete error:', authErr)
      return NextResponse.json({ error: 'Hesap silinemedi (auth)' }, { status: 500 })
    }

    // 3. Storage temizliği (best-effort). Bucket adları ve yükleme önekleri
    //    GERÇEK yükleme akışlarıyla eşleştirildi (E2E Son Kontrol 2026-06-12):
    //      pazar/ilan-ver     -> listing-images/marketplace/{uid}
    //      odunc-kirala       -> listing-images/odunc-kirala/{uid}
    //      gönderi görseli    -> post-images/{uid}
    //      işletme logo/kapak -> business-images/logos|covers/{uid}
    //      'documents'        -> e-Devlet belge taramaları (KVKK + Apple 5.1.1(v))
    //    Eski liste 'listings' diye var olmayan bucket'a bakıyor; post-images,
    //    lending-images ve gerçek listing-images öneklerini hiç silmiyordu →
    //    KVKK Md.7 silme yükümlülüğü eksik kalıyordu.
    try {
      const cleanupTargets: Array<[string, string[]]> = [
        ['avatars', [user.id]],
        ['listing-images', [`marketplace/${user.id}`, `odunc-kirala/${user.id}`, user.id]],
        ['post-images', [user.id]],
        ['lending-images', [user.id]],
        ['business-images', [`logos/${user.id}`, `covers/${user.id}`]],
        ['documents', [user.id]],
      ]
      for (const [bucket, prefixes] of cleanupTargets) {
        for (const prefix of prefixes) {
          const { data: files } = await admin.storage.from(bucket).list(prefix, { limit: 1000 })
          if (files && files.length > 0) {
            await admin.storage
              .from(bucket)
              .remove(files.map((f) => `${prefix}/${f.name}`))
          }
        }
      }
    } catch (err) {
      console.warn('[account/delete] storage cleanup partial failure:', err)
    }

    // 4. Aktif oturumu kapat
    await supabase.auth.signOut()

    return NextResponse.json({
      success: true,
      message: 'Hesabınız ve verileriniz silindi.',
    })
  } catch (error) {
    console.error('[account/delete] unexpected error:', error)
    return NextResponse.json(
      { error: 'Hesap silme sırasında beklenmeyen bir hata oluştu' },
      { status: 500 },
    )
  }
}
