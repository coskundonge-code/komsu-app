import { describe, it, expect } from 'vitest'
import {
  PaymentType,
  PaymentStatus,
  PaymentMethod,
  FEATURED_PRICING,
  LISTING_FEE_AMOUNT,
  CURRENCY,
} from '@/lib/services/payment'

/**
 * payment.ts saf sabitleri / enum sözleşmesi.
 * (DB'ye giden async fonksiyonlar bu dosyada test edilmez.)
 * Bu değerler PayTR akışı ve gelir raporu bucket'larıyla eşleşmeli;
 * sessiz bir fiyat değişikliğini yakalamak için sabitlenmiştir.
 */

describe('payment sabitleri', () => {
  it('ek ilan ücreti 250 TL', () => {
    expect(LISTING_FEE_AMOUNT).toBe(250)
  })
  it('para birimi TRY', () => {
    expect(CURRENCY).toBe('TRY')
  })
})

describe('PaymentType enum', () => {
  it('beklenen string değerlerini taşır', () => {
    expect(PaymentType.LISTING_FEE).toBe('listing_fee')
    expect(PaymentType.FEATURED_3DAYS).toBe('featured_3days')
    expect(PaymentType.FEATURED_7DAYS).toBe('featured_7days')
    expect(PaymentType.FEATURED_30DAYS).toBe('featured_30days')
    expect(PaymentType.BUSINESS_MONTHLY).toBe('business_monthly')
  })
})

describe('PaymentStatus enum', () => {
  it('yaşam döngüsü durumları', () => {
    expect(PaymentStatus.PENDING).toBe('pending')
    expect(PaymentStatus.PROCESSING).toBe('processing')
    expect(PaymentStatus.COMPLETED).toBe('completed')
    expect(PaymentStatus.FAILED).toBe('failed')
    expect(PaymentStatus.REFUNDED).toBe('refunded')
    expect(PaymentStatus.CANCELLED).toBe('cancelled')
  })
})

describe('PaymentMethod enum', () => {
  it('ödeme yöntemleri', () => {
    expect(PaymentMethod.CREDIT_CARD).toBe('credit_card')
    expect(PaymentMethod.DEBIT_CARD).toBe('debit_card')
    expect(PaymentMethod.BANK_TRANSFER).toBe('bank_transfer')
    expect(PaymentMethod.WALLET).toBe('wallet')
  })
})

describe('FEATURED_PRICING — öne çıkarma fiyat/süre eşlemesi', () => {
  it('3 gün = 50 TL', () => {
    expect(FEATURED_PRICING[PaymentType.FEATURED_3DAYS]).toEqual({
      amount: 50,
      days: 3,
      label: '3 Gün',
    })
  })
  it('7 gün = 100 TL', () => {
    expect(FEATURED_PRICING[PaymentType.FEATURED_7DAYS]).toEqual({
      amount: 100,
      days: 7,
      label: '7 Gün',
    })
  })
  it('30 gün = 200 TL', () => {
    expect(FEATURED_PRICING[PaymentType.FEATURED_30DAYS]).toEqual({
      amount: 200,
      days: 30,
      label: '30 Gün',
    })
  })

  it('fiyatlar süreyle birlikte monoton artar', () => {
    const p3 = FEATURED_PRICING[PaymentType.FEATURED_3DAYS]
    const p7 = FEATURED_PRICING[PaymentType.FEATURED_7DAYS]
    const p30 = FEATURED_PRICING[PaymentType.FEATURED_30DAYS]
    expect(p3.amount).toBeLessThan(p7.amount)
    expect(p7.amount).toBeLessThan(p30.amount)
    expect(p3.days).toBeLessThan(p7.days)
    expect(p7.days).toBeLessThan(p30.days)
  })

  it('tüm öne-çıkarma tutarları pozitif', () => {
    for (const key of [
      PaymentType.FEATURED_3DAYS,
      PaymentType.FEATURED_7DAYS,
      PaymentType.FEATURED_30DAYS,
    ] as const) {
      expect(FEATURED_PRICING[key].amount).toBeGreaterThan(0)
    }
  })
})
