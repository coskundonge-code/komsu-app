import { describe, it, expect, beforeEach, vi } from 'vitest'

/**
 * İlan kotası (PARA-BİTİŞİĞİ) iş kuralı sözleşmesi.
 *
 * Üretim: src/lib/services/listing-quota.ts — kullanıcının yılda kaç ÜCRETSİZ
 * Satılık/Kiralık ilan verebileceğini yönetir. Buradaki bir regresyon doğrudan
 * gelir hatasıdır:
 *   - 'sale'/'rental' yanlışlıkla hep ücretsiz olursa → para kaybı.
 *   - 'free'/'lend' yanlışlıkla kota tüketirse → kullanıcı ücretsiz ilan veremez.
 *   - LISTING_FEE/limit sessizce değişirse → yanlış fiyatlandırma.
 * Bu yüzden (a) tür-muafiyeti kapısını, (b) kota tükenme eşiğini ve (c) fiyat
 * sabitlerini burada kilitliyoruz.
 *
 * Supabase mock'lanır: getUserQuota'nın DB zincirini taklit ederiz; 'free'/'lend'
 * dalının DB'ye HİÇ dokunmadığını da doğrularız (erken-dönüş sözleşmesi).
 */

// ── Supabase client mock (hoisted) ───────────────────────────────────────────
// getUserQuota zinciri: from().select().eq().eq().single()
// Hepsi aynı builder'ı döndürür; single() ayarlanabilir sonucu resolve eder.
let singleResult: { data: unknown; error: unknown } = { data: null, error: null }
const builder = {
  select: vi.fn(() => builder),
  eq: vi.fn(() => builder),
  insert: vi.fn(() => builder),
  update: vi.fn(() => builder),
  order: vi.fn(() => builder),
  single: vi.fn(() => Promise.resolve(singleResult)),
}
const fromMock = vi.fn(() => builder)

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({ from: fromMock })),
}))

import {
  checkCanPost,
  FREE_LISTING_LIMIT,
  LISTING_FEE,
  CURRENCY,
} from '@/lib/services/listing-quota'

const UUID = '3fa85f64-5717-4562-b3fc-2c963f66afa6'
const THIS_YEAR = new Date().getFullYear()

beforeEach(() => {
  vi.clearAllMocks()
  singleResult = { data: null, error: null }
})

describe('listing-quota — fiyat/limit sabitleri (sessiz değişim guard)', () => {
  it('ücretsiz hak yılda 1 (Satılık/Kiralık)', () => {
    expect(FREE_LISTING_LIMIT).toBe(1)
  })
  it('ilan ücreti 9.90 TRY', () => {
    expect(LISTING_FEE).toBe(9.9)
    expect(CURRENCY).toBe('TRY')
  })
})

describe("checkCanPost — 'free'/'lend' her zaman ücretsiz (DB'ye dokunmaz)", () => {
  it("'free' → canPostFree:true, kota tüketmeden, DB çağrısı YOK", async () => {
    const res = await checkCanPost(UUID, 'free')
    expect(res).toEqual({
      canPostFree: true,
      freeUsed: 0,
      freeLimit: FREE_LISTING_LIMIT,
      remainingFree: FREE_LISTING_LIMIT,
      year: THIS_YEAR,
    })
    // Erken-dönüş sözleşmesi: bağış/ödünç ilanı asla DB kotasına bakmamalı.
    expect(fromMock).not.toHaveBeenCalled()
  })

  it("'lend' → canPostFree:true, DB çağrısı YOK", async () => {
    const res = await checkCanPost(UUID, 'lend')
    expect(res?.canPostFree).toBe(true)
    expect(res?.remainingFree).toBe(FREE_LISTING_LIMIT)
    expect(fromMock).not.toHaveBeenCalled()
  })
})

describe("checkCanPost — 'sale'/'rental' yıllık kotaya tabi (DB'ye bakar)", () => {
  it('kotası boş kullanıcı (free_used=0) → canPostFree:true, kalan 1', async () => {
    singleResult = {
      data: { user_id: UUID, year: THIS_YEAR, free_used: 0, reset_date: null },
      error: null,
    }
    const res = await checkCanPost(UUID, 'sale')
    expect(fromMock).toHaveBeenCalledWith('user_listing_quotas')
    expect(res).toEqual({
      canPostFree: true,
      freeUsed: 0,
      freeLimit: 1,
      remainingFree: 1,
      year: THIS_YEAR,
    })
  })

  it('kotası dolu kullanıcı (free_used=1) → canPostFree:false, kalan 0 (artık ücretli)', async () => {
    singleResult = {
      data: { user_id: UUID, year: THIS_YEAR, free_used: 1, reset_date: null },
      error: null,
    }
    const res = await checkCanPost(UUID, 'rental')
    expect(res?.canPostFree).toBe(false)
    expect(res?.remainingFree).toBe(0)
  })

  it('aşırı kullanım (free_used=5) → remainingFree negatife düşmez (0’a kenetli)', async () => {
    singleResult = {
      data: { user_id: UUID, year: THIS_YEAR, free_used: 5, reset_date: null },
      error: null,
    }
    const res = await checkCanPost(UUID, 'sale')
    expect(res?.canPostFree).toBe(false)
    expect(res?.remainingFree).toBe(0) // Math.max(0, 1-5) = 0, asla -4
  })

  it('tür belirtilmezse Satılık/Kiralık gibi kotaya tabidir (varsayılan ücretli yol)', async () => {
    singleResult = {
      data: { user_id: UUID, year: THIS_YEAR, free_used: 1, reset_date: null },
      error: null,
    }
    const res = await checkCanPost(UUID) // listingType yok
    expect(fromMock).toHaveBeenCalled() // DB'ye baktı → muaf değil
    expect(res?.canPostFree).toBe(false)
  })
})
