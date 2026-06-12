import { test, expect } from '@playwright/test'

/**
 * E2E Son Kontrol (2026-06-12) — HTTP güvenlik başlıkları + erişim kapıları
 * regresyon testi. next.config.ts headers() veya middleware bozulursa kırılır.
 *
 * Lokal:  npx playwright test e2e/security-headers.spec.ts
 * Canlı:  PLAYWRIGHT_BASE_URL=https://komsu-app.vercel.app npx playwright test e2e/security-headers.spec.ts
 */

test('güvenlik başlıkları mevcut', async ({ request, baseURL }) => {
  const url = baseURL || 'http://localhost:3000'
  const res = await request.get(url)
  const h = res.headers()

  expect(h['x-frame-options']).toBe('SAMEORIGIN')
  expect(h['x-content-type-options']).toBe('nosniff')
  expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin')
  expect(h['permissions-policy'] || '').toContain('camera=()')
  expect(h['content-security-policy'] || '').toContain("default-src 'self'")
  expect(h['content-security-policy'] || '').toContain("frame-ancestors 'self'")

  // HSTS yalnızca HTTPS'te anlamlı (lokal dev'de olmayabilir)
  if (url.startsWith('https://')) {
    expect(h['strict-transport-security'] || '').toContain('max-age=')
  }
})

test('korumalı sayfa anonim kullanıcıyı girişe yönlendirir', async ({ request, baseURL }) => {
  const res = await request.get(`${baseURL}/mesajlar`, { maxRedirects: 0 })
  expect([301, 302, 303, 307, 308]).toContain(res.status())
  expect(res.headers()['location'] || '').toContain('/giris')
})

test('admin paneli anonim erişime kapalı', async ({ request, baseURL }) => {
  const res = await request.get(`${baseURL}/admin`, { maxRedirects: 0 })
  expect([301, 302, 303, 307, 308]).toContain(res.status())
})

test('api/health canlılık döner, ayrıntı sızdırmaz', async ({ request, baseURL }) => {
  const res = await request.get(`${baseURL}/api/health`)
  expect(res.ok()).toBeTruthy()
  const body = await res.json().catch(() => ({}))
  // Token'sız çağrıda DB gecikmesi / bellek / env ayrıntısı OLMAMALI
  expect(JSON.stringify(body)).not.toContain('memory')
})
