import { describe, it, expect } from 'vitest'
import {
  getPricingInfo,
  MONTHLY_PRICE,
  YEARLY_PRICE,
  FREE_TRIAL_MONTHS,
  CURRENCY,
  BUSINESS_PACKAGES,
} from '@/lib/services/business-subscription'

/**
 * İşletme abonelik fiyatlandırma saf-mantık testleri.
 * Para doğruluğu kritik: tek plan 1.900₺/ay, 19.900₺/yıl, 3 ay ücretsiz deneme.
 * (Supabase'e giden async fonksiyonlar burada test edilmez.)
 */
describe('business-subscription sabitleri', () => {
  it('aylık fiyat 1900 TL', () => {
    expect(MONTHLY_PRICE).toBe(1900)
  })
  it('yıllık fiyat 19900 TL', () => {
    expect(YEARLY_PRICE).toBe(19900)
  })
  it('ücretsiz deneme 3 ay', () => {
    expect(FREE_TRIAL_MONTHS).toBe(3)
  })
  it('para birimi TRY', () => {
    expect(CURRENCY).toBe('TRY')
  })
})

describe('getPricingInfo', () => {
  it('tam fiyat nesnesini döndürür (shape + değerler)', () => {
    const info = getPricingInfo()
    expect(info).toEqual({
      monthlyPrice: 1900,
      yearlyPrice: 19900,
      yearlySavings: 2900,
      freeTrialMonths: 3,
      currency: 'TRY',
    })
  })

  it('yıllık tasarruf = (aylık * 12) - yıllık', () => {
    const info = getPricingInfo()
    expect(info.yearlySavings).toBe(MONTHLY_PRICE * 12 - YEARLY_PRICE)
  })

  it('yıllık fiyat, 12 aylık toplamdan ucuzdur (tasarruf pozitif)', () => {
    const info = getPricingInfo()
    expect(info.yearlySavings).toBeGreaterThan(0)
    expect(info.yearlyPrice).toBeLessThan(info.monthlyPrice * 12)
  })

  it('sabitlerle tutarlı (drift koruması)', () => {
    const info = getPricingInfo()
    expect(info.monthlyPrice).toBe(MONTHLY_PRICE)
    expect(info.yearlyPrice).toBe(YEARLY_PRICE)
    expect(info.freeTrialMonths).toBe(FREE_TRIAL_MONTHS)
    expect(info.currency).toBe(CURRENCY)
  })

  it('her çağrıda aynı (saf) değeri üretir', () => {
    expect(getPricingInfo()).toEqual(getPricingInfo())
  })
})

describe('BUSINESS_PACKAGES (legacy uyumluluk)', () => {
  it('üç paket de aynı tek-plan fiyatını kullanır', () => {
    for (const key of ['temel', 'profesyonel', 'premium'] as const) {
      const pkg = BUSINESS_PACKAGES[key]
      expect(pkg.id).toBe(key)
      expect(pkg.monthlyPrice).toBe(MONTHLY_PRICE)
      expect(pkg.yearlyPrice).toBe(YEARLY_PRICE)
    }
  })

  it('yalnızca profesyonel "popular" işaretli', () => {
    expect(BUSINESS_PACKAGES.temel.popular).toBe(false)
    expect(BUSINESS_PACKAGES.profesyonel.popular).toBe(true)
    expect(BUSINESS_PACKAGES.premium.popular).toBe(false)
  })
})
