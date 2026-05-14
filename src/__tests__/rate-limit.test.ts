import { describe, it, expect, vi, beforeEach } from 'vitest'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

describe('rate-limit (in-memory fallback)', () => {
  // Upstash env'lerinin tanımlı olmadığını sağla
  beforeEach(() => {
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN
  })

  it('limit altında istekleri kabul eder', async () => {
    const key = `test-${Date.now()}-allow`
    const r1 = await rateLimit(key, { limit: 3, windowMs: 1000 })
    expect(r1.success).toBe(true)
    expect(r1.remaining).toBe(2)
  })

  it('limit aşıldığında reddeder', async () => {
    const key = `test-${Date.now()}-deny`
    await rateLimit(key, { limit: 2, windowMs: 60000 })
    await rateLimit(key, { limit: 2, windowMs: 60000 })
    const r3 = await rateLimit(key, { limit: 2, windowMs: 60000 })
    expect(r3.success).toBe(false)
    expect(r3.remaining).toBe(0)
  })

  it('window süresi geçtikten sonra sayacı sıfırlar', async () => {
    const key = `test-${Date.now()}-reset`
    await rateLimit(key, { limit: 1, windowMs: 50 })
    await new Promise((r) => setTimeout(r, 60))
    const r2 = await rateLimit(key, { limit: 1, windowMs: 50 })
    expect(r2.success).toBe(true)
  })
})

describe('getClientIp', () => {
  it('x-forwarded-for header\'ından ilk IP\'yi alır', () => {
    const headers = new Headers({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' })
    expect(getClientIp({ headers })).toBe('1.2.3.4')
  })

  it('x-real-ip fallback', () => {
    const headers = new Headers({ 'x-real-ip': '9.9.9.9' })
    expect(getClientIp({ headers })).toBe('9.9.9.9')
  })

  it('hiç header yoksa 127.0.0.1 döner', () => {
    expect(getClientIp({ headers: new Headers() })).toBe('127.0.0.1')
  })
})
