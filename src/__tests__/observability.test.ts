import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { logError, logWarn, logInfo } from '@/lib/logger'
import { reportClientError } from '@/lib/utils/report-client-error'

type MockedConsole = { mock: { calls: unknown[][] } }

// ── logger.ts ────────────────────────────────────────────────────────────────
describe('logger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('logInfo → console.log, logWarn → console.warn, logError → console.error', () => {
    logInfo('bilgi')
    logWarn('uyarı')
    logError('hata')
    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledTimes(1)
  })

  it('logError bir Error nesnesini ad/mesaj/stack olarak açar', () => {
    logError('patladı', new Error('boom'))
    const call = (console.error as unknown as MockedConsole).mock.calls[0]
    expect(call[0]).toBe('[error] patladı')
    const ctx = call[1] as Record<string, unknown>
    expect(ctx.errorName).toBe('Error')
    expect(ctx.errorMessage).toBe('boom')
    expect(typeof ctx.stack).toBe('string')
  })

  it('üretimde tek satır JSON basar (level/message/timestamp ve context alanları)', () => {
    vi.stubEnv('NODE_ENV', 'production')
    logInfo('canlı', { userId: 42 })
    const arg = (console.log as unknown as MockedConsole).mock.calls[0][0]
    expect(typeof arg).toBe('string')
    const parsed = JSON.parse(arg as string)
    expect(parsed.level).toBe('info')
    expect(parsed.message).toBe('canlı')
    expect(parsed.userId).toBe(42)
    expect(typeof parsed.timestamp).toBe('string')
  })

  it('undefined context alanlarını JSON çıktısından ayıklar', () => {
    vi.stubEnv('NODE_ENV', 'production')
    logError('x', undefined, { kept: 'y', dropped: undefined })
    const arg = (console.error as unknown as MockedConsole).mock.calls[0][0]
    const parsed = JSON.parse(arg as string)
    expect(parsed.kept).toBe('y')
    expect('dropped' in parsed).toBe(false)
  })
})

// ── report-client-error.ts ───────────────────────────────────────────────────
type MutableNav = { sendBeacon?: (url: string, data?: BodyInit | null) => boolean }

function setSendBeacon(fn: ((url: string, data?: BodyInit | null) => boolean) | undefined) {
  ;(navigator as unknown as MutableNav).sendBeacon = fn
}

describe('reportClientError', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    setSendBeacon(undefined)
  })

  it('sendBeacon varsa onu kullanır, fetch çağırmaz', () => {
    const beacon = vi.fn().mockReturnValue(true)
    setSendBeacon(beacon)
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    reportClientError(new Error('boom'))

    expect(beacon).toHaveBeenCalledTimes(1)
    expect(beacon.mock.calls[0][0]).toBe('/api/client-error')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('sendBeacon yoksa keepalive fetch ile gönderir ve payload doğru kurulur', () => {
    setSendBeacon(undefined)
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}'))
    vi.stubGlobal('fetch', fetchMock)

    reportClientError(new Error('boom'), { boundary: 'test' })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('/api/client-error')
    expect(init.method).toBe('POST')
    expect(init.keepalive).toBe(true)
    const body = JSON.parse(init.body as string)
    expect(body.message).toBe('boom')
    expect(typeof body.stack).toBe('string')
    expect(body.path).toBe('/')
    expect(body.context).toEqual({ boundary: 'test' })
  })

  it('fetch fırlatsa bile asla zincirleme hata üretmez', () => {
    setSendBeacon(undefined)
    vi.stubGlobal('fetch', vi.fn(() => {
      throw new Error('network down')
    }))
    expect(() => reportClientError('düz metin hata')).not.toThrow()
  })
})

// ── /api/client-error route ───────────────────────────────────────────────────
describe('POST /api/client-error', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  async function post(body: string, contentType = 'application/json') {
    const { POST } = await import('@/app/api/client-error/route')
    const req = new Request('http://localhost/api/client-error', {
      method: 'POST',
      headers: { 'content-type': contentType, 'user-agent': 'vitest-UA' },
      body,
    })
    return POST(req)
  }

  it('geçerli gövdede 200 + {ok:true} döner ve logError çağırır', async () => {
    const res = await post(JSON.stringify({ message: 'istemci patladı', path: '/pazar' }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.ok).toBe(true)
    expect(console.error).toHaveBeenCalledTimes(1)
    const call = (console.error as unknown as MockedConsole).mock.calls[0]
    expect(call[0]).toBe('[error] İstemci hatası')
    const ctx = call[1] as Record<string, unknown>
    expect(ctx.clientMessage).toBe('istemci patladı')
    expect(ctx.path).toBe('/pazar')
    expect(ctx.userAgent).toBe('vitest-UA')
  })

  it('bozuk JSON gövdesinde bile 200 döner (asla patlamaz)', async () => {
    const res = await post('{bozuk-json')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.ok).toBe(true)
  })
})
