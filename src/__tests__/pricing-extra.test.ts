import { describe, it, expect } from 'vitest'
import {
  calculateListingFee,
  requiresImmediateVerification,
  validateBusinessRegistration,
  MAHALLE_CARD_PRICE,
  LISTING_PRICING,
  BUSINESS_MEMBERSHIP,
  ADDRESS_VERIFICATION,
  ASKIDA_BAGIS,
} from '@/lib/pricing'

/**
 * pricing.ts — pricing.test.ts'te kapsanmayan dal/sınır durumları + sabit doğrulaması.
 */

describe('calculateListingFee — ek dallar', () => {
  it('her ücretsiz tür tek tek bedavadır', () => {
    expect(calculateListingFee('hibe', 5).reason).toBe('Bu ilan türü ücretsizdir')
    expect(calculateListingFee('ucretsiz_odunc', 5).isFree).toBe(true)
    expect(calculateListingFee('bagis', 5).amount).toBe(0)
  })

  it('bilinmeyen tür ücretli kabul edilir (ilk değilse)', () => {
    const r = calculateListingFee('garip_tur', 3)
    expect(r.isFree).toBe(false)
    expect(r.amount).toBe(LISTING_PRICING.paidListingAmount)
  })

  it('ücretli türde reason ücreti içerir', () => {
    const r = calculateListingFee('satis', 2)
    expect(r.reason).toContain(String(LISTING_PRICING.paidListingAmount))
  })

  it('ücretsiz tür, count=0 olsa da "tür" gerekçesiyle bedava (ilk-ilan değil)', () => {
    const r = calculateListingFee('hibe', 0)
    expect(r.isFree).toBe(true)
    expect(r.reason).toBe('Bu ilan türü ücretsizdir')
  })
})

describe('requiresImmediateVerification — tüm liste', () => {
  it('listedeki her aksiyon doğrulama ister', () => {
    for (const action of ADDRESS_VERIFICATION.immediateVerificationRequired) {
      expect(requiresImmediateVerification(action)).toBe(true)
    }
  })
  it('create_post ve donate_item de dahil', () => {
    expect(requiresImmediateVerification('create_post')).toBe(true)
    expect(requiresImmediateVerification('donate_item')).toBe(true)
  })
})

describe('validateBusinessRegistration — sınır durumları', () => {
  it('indirim yüzdesi tam minimuma eşitse geçerli', () => {
    const r = validateBusinessRegistration({
      addressVerified: true,
      hasDiscount: true,
      discountPercent: BUSINESS_MEMBERSHIP.requirements.minDiscountPercent,
    })
    expect(r.valid).toBe(true)
    expect(r.errors).toHaveLength(0)
  })

  it('indirim yüzdesi minimumun 1 altındaysa geçersiz', () => {
    const r = validateBusinessRegistration({
      addressVerified: true,
      hasDiscount: true,
      discountPercent: BUSINESS_MEMBERSHIP.requirements.minDiscountPercent - 1,
    })
    expect(r.valid).toBe(false)
    expect(r.errors.some((e) => e.includes('Minimum'))).toBe(true)
  })

  it('discountPercent verilmezse yüzde kontrolü atlanır (hasDiscount true ise geçerli)', () => {
    const r = validateBusinessRegistration({ addressVerified: true, hasDiscount: true })
    expect(r.valid).toBe(true)
  })

  it('birden çok ihlal tüm hataları biriktirir', () => {
    const r = validateBusinessRegistration({
      addressVerified: false,
      hasDiscount: false,
      discountPercent: 1,
    })
    expect(r.valid).toBe(false)
    // adres + indirim yok + minimum altı → 3 hata
    expect(r.errors.length).toBeGreaterThanOrEqual(2)
    expect(r.errors.some((e) => e.includes('Adres'))).toBe(true)
  })
})

describe('pricing sabitleri (drift koruması)', () => {
  it('Mahalle Kartı 4.99 TRY yıllık', () => {
    expect(MAHALLE_CARD_PRICE.amount).toBe(4.99)
    expect(MAHALLE_CARD_PRICE.currency).toBe('TRY')
    expect(MAHALLE_CARD_PRICE.period).toBe('yearly')
  })

  it('ilan: ilk ücretsiz, ücretli 99 TL', () => {
    expect(LISTING_PRICING.firstListingFree).toBe(true)
    expect(LISTING_PRICING.paidListingAmount).toBe(99)
  })

  it('esnaf üyeliği: 99 TL/ay, min %5 indirim şartı', () => {
    expect(BUSINESS_MEMBERSHIP.monthlyFee).toBe(99)
    expect(BUSINESS_MEMBERSHIP.requirements.minDiscountPercent).toBe(5)
    expect(BUSINESS_MEMBERSHIP.requirements.addressVerification).toBe(true)
  })

  it('adres doğrulama süresi 7 gün', () => {
    expect(ADDRESS_VERIFICATION.deadlineDays).toBe(7)
    expect(ADDRESS_VERIFICATION.lockOnExpiry).toBe(true)
  })

  it('askıda bağış tamamen ücretsiz', () => {
    expect(ASKIDA_BAGIS.isFree).toBe(true)
    expect(ASKIDA_BAGIS.donationFee).toBe(0)
    expect(ASKIDA_BAGIS.redemptionFee).toBe(0)
  })
})
