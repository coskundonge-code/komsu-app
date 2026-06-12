import { test, expect } from '@playwright/test'

/**
 * E2E Son Kontrol (2026-06-12) — Rol bazlı erişim (RBAC) duman testi.
 *
 * Test hesabı env ile verilir (yoksa testler SKIP edilir, CI kırılmaz):
 *   E2E_USER_EMAIL / E2E_USER_PASSWORD   → normal (admin OLMAYAN) test kullanıcısı
 *
 * Çalıştırma:
 *   E2E_USER_EMAIL=test@ornek.com E2E_USER_PASSWORD=... npx playwright test e2e/admin-rbac.spec.ts
 */

const USER_EMAIL = process.env.E2E_USER_EMAIL
const USER_PASSWORD = process.env.E2E_USER_PASSWORD

async function login(page: import('@playwright/test').Page, email: string, password: string) {
  await page.goto('/giris')
  await page.locator('input[type="email"]').first().fill(email)
  await page.locator('input[type="password"]').first().fill(password)
  await page.getByRole('button', { name: /giriş yap/i }).click()
  // Giriş sonrası /giris dışına çıkmasını bekle (konum-secimi veya feed olabilir)
  await page.waitForURL((u) => !u.pathname.startsWith('/giris'), { timeout: 15_000 })
}

test('normal kullanıcı /admin paneline giremez (middleware is_admin kapısı)', async ({ page }) => {
  test.skip(!USER_EMAIL || !USER_PASSWORD, 'E2E_USER_EMAIL / E2E_USER_PASSWORD tanımlı değil')

  await login(page, USER_EMAIL!, USER_PASSWORD!)
  await page.goto('/admin')
  // is_admin=false → middleware "/" köke yönlendirir; /admin'de KALMAMALI
  await page.waitForURL((u) => !u.pathname.startsWith('/admin'), { timeout: 15_000 })
  expect(page.url()).not.toContain('/admin')
})

test('anonim kullanıcı korunan sayfadan girişe düşer', async ({ page }) => {
  await page.goto('/pazar/ilan-ver')
  await page.waitForURL(/\/giris/, { timeout: 15_000 })
  expect(page.url()).toContain('/giris')
})
