import { describe, it, expect } from 'vitest'
import {
  calculateListingFee,
  requiresImmediateVerification,
  calculateVerificationDeadline,
  validateBusinessRegistration,
  LISTING_PRICING,
  ADDRESS_VERIFICATION,
} from '@/lib/pricing'

/**
 * Fiyatlandırma + iş kuralı saf-mantık testleri (para/doğrulama akışları).
 */
describe('calculateListingFee', () => {
  it('ücretsiz ilan türleri her zaman bedava (kota ne olursa olsun)', () => {
    for (const t of LISTING_PRICING.freeListingTypes) {
      const r = calculateListingFee(t, 99)
      expect(r.isFree).toBe(true)
      expect(r.amount).toBe(0)
    }
  })

  it('ilk ücretli ilan bedava (firstListingFree)', () => {
    const r = calculateListingFee('satis', 0)
    expect(r.isFree).toBe(true)
    expect(r.amount).toBe(0)
    expect(r.reason).toContain('İlk')
  })

  it('ilk ilandan sonra ücretli ilan paidListingAmount kadar', () => {
    const r = calculateListingFee('satis', 1)
    expect(r.isFree).toBe(false)
    expect(r.amount).toBe(LISTING_PRICING.paidListingAmount)
  })

  it('kiralama da ücretli (ilk değilse)', () => {
    expect(calculateListingFee('kiralama', 2).amount).toBe(LISTING_PRICING.paidListingAmount)
  })
})

describe('requiresImmediateVerification', () => {
  it('listelenen aksiyonlar doğrulama ister', () => {
    expect(requiresImmediateVerification('create_listing')).toBe(true)
    expect(requiresImmediateVerification('business_register')).toBe(true)
    expect(requiresImmediateVerification('sell_item')).toBe(true)
  })

  it('listede olmayan aksiyon doğrulama istemez', () => {
    expect(requiresImmediateVerification('browse')).toBe(false)
    expect(requiresImmediateVerification('')).toBe(false)
  })
})

describe('calculateVerificationDeadline', () => {
  it('bugünden deadlineDays gün sonrasını verir', () => {
    const now = Date.now()
    const deadline = calculateVerificationDeadline().getTime()
    const days = Math.round((deadline - now) / 86_400_000)
    expect(days).toBe(ADDRESS_VERIFICATION.deadlineDays)
  })
})

describe('validateBusinessRegistration', () => {
  it('tüm koşullar sağlanınca geçerli', () => {
    const r = validateBusinessRegistration({ addressVerified: true, hasDiscount: true, discountPercent: 10 })
    expect(r.valid).toBe(true)
    expect(r.errors).toHaveLength(0)
  })

  it('adres doğrulanmamışsa hata', () => {
    const r = validateBusinessRegistration({ addressVerified: false, hasDiscount: true })
    expect(r.valid).toBe(false)
    expect(r.errors.some((e) => e.includes('Adres'))).toBe(true)
  })

  it('indirim yoksa hata', () => {
    const r = validateBusinessRegistration({ addressVerified: true, hasDiscount: false })
    expect(r.valid).toBe(false)
    expect(r.errors.some((e) => e.includes('indirim'))).toBe(true)
  })

  it('minimum indirim yüzdesinin altındaysa hata', () => {
    const r = validateBusinessRegistration({ addressVerified: true, hasDiscount: true, discountPercent: 3 })
    expect(r.valid).toBe(false)
  })
})
