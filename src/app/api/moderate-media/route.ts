import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { decideSafeSearch, type SafeSearchAnnotation } from '@/lib/services/image-moderation'

/**
 * POST /api/moderate-media
 *
 * Kullanıcının yüklediği görseli Google Cloud Vision SafeSearch ile tarar ve
 * uygunsuz içeriği (müstehcen / şiddet) YAYINLANMADAN önce eler. Frontend
 * (src/lib/services/content-moderation.ts > moderateSingleMedia) bu uca
 * multipart/form-data ile {file, type} gönderir ve {approved, flags} bekler.
 *
 * Karar mantığı (eşikler) src/lib/services/image-moderation.ts'te (test edilebilir).
 * Bu route ince: kimlik/limit + sağlayıcı çağrısı + eşleme.
 *
 * Tasarım — FAIL-OPEN: anahtar yoksa, sağlayıcı hata verirse veya görsel taranamazsa
 * yükleme BLOKLANMAZ (approved:true döner), çünkü fail-closed tüm yüklemeyi kırardı.
 * Bu durumda insan şikâyet + moderasyon akışı yedek hattır. bkz. TECH_DEBT #11.
 */

export const runtime = 'nodejs'

const VISION_ENDPOINT = 'https://vision.googleapis.com/v1/images:annotate'
// Vision inline (base64) içerik için pratik sınır. Daha büyük görseller AI'sız geçer
// (insan moderasyonu yedek) — dosya tipi/boyut/ad kontrolleri zaten frontend'de yapılıyor.
const MAX_INLINE_BYTES = 8 * 1024 * 1024

export async function POST(request: NextRequest) {
  // Kötüye kullanım + sağlayıcı maliyeti koruması: IP başına 40 tarama / dakika.
  // (Bir ilan birden çok görsel yükleyebildiği için cömert tutuldu.)
  const ip = getClientIp(request)
  const rl = await rateLimit(`moderate-media:${ip}`, { limit: 40, windowMs: 60_000 })
  if (!rl.success) return rateLimitResponse(rl) as unknown as NextResponse

  // Oturum zorunlu: bu uç yalnızca uygulama içi yüklemelerde çağrılır. Anonim
  // erişim, Vision API maliyetini (40 tarama/dk × IP) kötüye kullanmaya açıktı
  // (E2E Son Kontrol denetimi 2026-06-12).
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json(
      { approved: false, flags: [], note: 'auth_required' },
      { status: 401 }
    )
  }

  const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY
  if (!apiKey) {
    console.warn(
      '[moderate-media] GOOGLE_CLOUD_VISION_API_KEY tanımlı değil — görsel AI moderasyonu devre dışı (fail-open).'
    )
    return NextResponse.json({ approved: true, flags: [], note: 'moderation_disabled' })
  }

  let file: File | null = null
  let type = 'image'
  try {
    const form = await request.formData()
    file = form.get('file') as File | null
    type = (form.get('type') as string) || 'image'
  } catch {
    return NextResponse.json({ approved: true, flags: [], note: 'bad_request' })
  }

  if (!file) {
    return NextResponse.json({ approved: true, flags: [], note: 'no_file' })
  }

  // Video: SafeSearch yalnız görsel tarar. Video Intelligence ayrı + pahalı bir API;
  // şimdilik videolar AI'sız geçer (insan moderasyonu yedek). bkz. TECH_DEBT #11.
  if (type === 'video' || file.type?.startsWith('video/')) {
    return NextResponse.json({ approved: true, flags: [], note: 'video_unscanned' })
  }

  if (file.size > MAX_INLINE_BYTES) {
    console.warn('[moderate-media] Görsel inline sınırından büyük, AI taraması atlandı:', file.size)
    return NextResponse.json({ approved: true, flags: [], note: 'too_large_for_inline' })
  }

  let base64: string
  try {
    base64 = Buffer.from(await file.arrayBuffer()).toString('base64')
  } catch {
    return NextResponse.json({ approved: true, flags: [], note: 'read_error' })
  }

  try {
    const visionRes = await fetch(`${VISION_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [
          {
            image: { content: base64 },
            features: [{ type: 'SAFE_SEARCH_DETECTION' }],
          },
        ],
      }),
    })

    if (!visionRes.ok) {
      console.warn('[moderate-media] Vision API hata kodu:', visionRes.status)
      return NextResponse.json({ approved: true, flags: [], note: 'provider_error' })
    }

    const data = await visionRes.json()
    const annotation: SafeSearchAnnotation | undefined =
      data?.responses?.[0]?.safeSearchAnnotation

    if (!annotation) {
      return NextResponse.json({ approved: true, flags: [], note: 'no_annotation' })
    }

    return NextResponse.json(decideSafeSearch(annotation))
  } catch (err) {
    console.warn('[moderate-media] Vision çağrısı başarısız:', err)
    return NextResponse.json({ approved: true, flags: [], note: 'provider_unavailable' })
  }
}
