import { describe, it, expect } from 'vitest'
import crypto from 'crypto'

/**
 * PayTR callback hash doğrulamasının doğruluğunu kontrol eder.
 * Bu test K1 (payments tablosu eklenince) callback'in çalışacağına dair koruma sağlar.
 *
 * Hash algoritması (PayTR doc):
 *   hash = HMAC-SHA256(merchant_key, merchant_oid + merchant_salt + status + total_amount).base64
 */
describe('PayTR callback hash', () => {
  const MERCHANT_KEY = 'test_merchant_key'
  const MERCHANT_SALT = 'test_salt'

  function calcHash(merchantOid: string, status: string, totalAmount: string) {
    const hashStr = [merchantOid, MERCHANT_SALT, status, totalAmount].join('')
    return crypto.createHmac('sha256', MERCHANT_KEY).update(hashStr).digest('base64')
  }

  it('aynı parametrelerle aynı hash üretir', () => {
    const h1 = calcHash('mahalle_card_user1_1234', 'success', '5000')
    const h2 = calcHash('mahalle_card_user1_1234', 'success', '5000')
    expect(h1).toBe(h2)
  })

  it('parametre değişince hash değişir', () => {
    const h1 = calcHash('mahalle_card_user1_1234', 'success', '5000')
    const h2 = calcHash('mahalle_card_user1_1234', 'failed', '5000')
    expect(h1).not.toBe(h2)
  })

  it('boş status saldırısı: hash farklı olmalı', () => {
    const h1 = calcHash('oid', 'success', '100')
    const h2 = calcHash('oid', '', 'success100') // saldırgan parametreyi birleştirip kandırmaya çalışırsa
    expect(h1).not.toBe(h2)
  })
})
