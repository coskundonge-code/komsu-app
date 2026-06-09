/**
 * Rate limiting helper.
 *
 * Production (UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN env'leri set ise)
 * Upstash sliding-window rate limiter kullanır.
 *
 * Local/development (env yok ise) basit in-memory token bucket kullanır.
 * Bu serverless'te güvenilir DEĞİLDİR — sadece tek instance/local geliştirme içindir.
 *
 * Kullanım:
 *   const result = await rateLimit(`payment:${ip}`, { limit: 10, windowMs: 60_000 })
 *   if (!result.success) return new Response('Too many requests', { status: 429 })
 */

type RateLimitResult = {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

type RateLimitOptions = {
  limit: number
  windowMs: number
}

// ----- In-memory fallback (local dev) -----
const memoryStore = new Map<string, { count: number; reset: number }>()

function memoryRateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  const entry = memoryStore.get(key)

  if (!entry || entry.reset < now) {
    const reset = now + opts.windowMs
    memoryStore.set(key, { count: 1, reset })
    return { success: true, limit: opts.limit, remaining: opts.limit - 1, reset }
  }

  if (entry.count >= opts.limit) {
    return { success: false, limit: opts.limit, remaining: 0, reset: entry.reset }
  }

  entry.count += 1
  memoryStore.set(key, entry)
  return {
    success: true,
    limit: opts.limit,
    remaining: opts.limit - entry.count,
    reset: entry.reset,
  }
}

// ----- Upstash sliding window (production) -----
let upstashLimiter: any = null
let upstashInitTried = false

async function getUpstashLimiter(opts: RateLimitOptions) {
  if (upstashInitTried) return upstashLimiter

  upstashInitTried = true
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  try {
    const { Ratelimit } = await import('@upstash/ratelimit')
    const { Redis } = await import('@upstash/redis')
    const redis = new Redis({ url, token })
    upstashLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(opts.limit, `${Math.ceil(opts.windowMs / 1000)} s`),
      analytics: true,
      prefix: 'mahallemiz:rl',
    })
    return upstashLimiter
  } catch (err) {
    console.warn('[rate-limit] Upstash not available, falling back to memory:', err)
    return null
  }
}

export async function rateLimit(
  key: string,
  opts: RateLimitOptions,
): Promise<RateLimitResult> {
  const limiter = await getUpstashLimiter(opts)

  if (limiter) {
    const r = await limiter.limit(key)
    return {
      success: r.success,
      limit: r.limit,
      remaining: r.remaining,
      reset: r.reset,
    }
  }

  return memoryRateLimit(key, opts)
}

/**
 * NextRequest'ten IP adresini çıkar (Vercel/Cloudflare uyumlu).
 */
export function getClientIp(request: { headers: Headers }): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp
  return '127.0.0.1'
}

/**
 * Rate limit aşıldığında dönülecek standart response.
 */
export function rateLimitResponse(result: RateLimitResult) {
  return new Response(
    JSON.stringify({
      error: 'Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin.',
      retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(result.reset),
        'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000)),
      },
    },
  )
}
