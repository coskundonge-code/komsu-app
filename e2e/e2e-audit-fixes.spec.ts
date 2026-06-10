import { test, expect } from '@playwright/test'

/**
 * E2E Son Kontrol (2026-06-10) — bu oturumdaki düzeltmeler için regresyon testleri.
 *
 * Kapsam: public yüzey + auth-redirect davranışı. Kimlik-korumalı akışlar
 * (mesajlaşma, beğeni, ilan paylaşımı) test hesabı gerektirdiği için burada
 * kapsanmaz; mesajlaşma P0'ı veritabanı seviyesinde SQL ile doğrulanmıştır.
 */

test.describe('SEO / PWA yüzeyleri artık auth duvarının arkasında değil', () => {
  for (const path of ['/robots.txt', '/sitemap.xml', '/manifest.webmanifest']) {
    test(`${path} → 200 (giriş'e yönlendirmiyor)`, async ({ request }) => {
      const res = await request.get(path, { maxRedirects: 0 })
      expect(res.status()).toBe(200)
    })
  }

  test("robots.txt dinamik üreticiden geliyor (User-Agent + Sitemap)", async ({ request }) => {
    const res = await request.get('/robots.txt', { maxRedirects: 0 })
    expect(res.status()).toBe(200)
    const body = await res.text()
    expect(body).toMatch(/User-Agent/i)
    expect(body).toMatch(/Sitemap:/i)
  })

  test('/blog girişsiz erişilir', async ({ page }) => {
    await page.goto('/blog')
    expect(page.url()).toContain('/blog')
    await expect(page.getByRole('heading', { name: /Blog/i }).first()).toBeVisible()
  })
})

test.describe('Kırık "Hemen Başla" CTA düzeltildi (/kaydol → /kayit)', () => {
  for (const path of ['/hakkinda', '/nasil-calisir']) {
    test(`${path}: CTA /kayit'e gidiyor, /kaydol linki yok`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('a[href="/kaydol"]')).toHaveCount(0)
      await expect(page.locator('a[href="/kayit"]').first()).toBeVisible()
    })
  }
})
