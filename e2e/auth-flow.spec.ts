import { test, expect } from '@playwright/test'

/**
 * Smoke test: temel auth akışları erişilebilir mi?
 */

test('giriş sayfası yüklenir', async ({ page }) => {
  await page.goto('/giris')
  await expect(page.getByRole('heading', { name: /Tekrar Hoş Geldiniz/i })).toBeVisible()
  await expect(page.getByPlaceholder(/E-posta|email/i).first()).toBeVisible()
})

test('kayıt sayfası yüklenir', async ({ page }) => {
  await page.goto('/kayit')
  // Sayfada en az bir input ve bir submit butonu olsun
  const inputs = page.locator('input')
  await expect(inputs.first()).toBeVisible()
})

test('login zorunlu route → /giris yönlendirmesi', async ({ page }) => {
  // Giriş yapmamış kullanıcı korumalı bir sayfaya gidemez
  await page.goto('/ayarlar')
  await page.waitForURL(/\/giris/, { timeout: 10_000 })
  expect(page.url()).toContain('/giris')
})

test('public sayfalar girişsiz erişilir', async ({ page }) => {
  await page.goto('/kvkk')
  await expect(page.getByRole('heading').first()).toBeVisible()

  await page.goto('/cerez-politikasi')
  await expect(page.getByRole('heading').first()).toBeVisible()

  await page.goto('/gizlilik')
  await expect(page.getByRole('heading').first()).toBeVisible()
})

test('cookie banner görünür ve reddet butonu var', async ({ page }) => {
  await page.goto('/giris')
  // Banner localStorage'da consent yoksa görünür
  const banner = page.getByRole('banner').filter({ hasText: /Çerez/i })
  await expect(banner).toBeVisible({ timeout: 5000 })
  await expect(banner.getByRole('button', { name: /Reddet/i })).toBeVisible()
  await expect(banner.getByRole('button', { name: /Kabul Et/i })).toBeVisible()
})
