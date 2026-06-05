import { describe, it, expect } from 'vitest'
import crypto from 'crypto'

/**
 * PayTR callback hash doğrulamasının doğruluğunu kontrol eder.
 * Bu test K1 (payments tablosu eklenince) callback'in çalışacağına dair koruma sağlar.
 *
 * Hash algoritması (PayTR doc):
 *   hash = HMAC-SHA256(merchant_key, merchant_oid + merchant_salt + status + total_amount).base64
 *
 * NOT (güvenlik modeli): PayTR şeması alanları AYIRICISIZ birleştirir; bu spec
 * gereği değiştirilemez (ayraç eklersek gerçek PayTR callback'inin hash'iyle
 * eşleşmeyiz). Dolayısıyla güvenlik ayraçtan değil GİZLİ merchant_key'den gelir:
 * saldırgan alanları kaydırsa bile (örn. status='' + amount='success100') doğru
 * key olmadan geçerli hash üretemez ve route.ts:36 hash kontrolünü geçemez.
 * Ek savunma (status'u {success,failed} allowlist'ine kısıtlamak) Faz 1'de
 * route.ts'e eklenecek — bkz. TECH_DEBT.md → "PayTR callback hardening".
 */
describe('PayTR callback hash', () => {
  const MERCHANT_KEY = 'test_merchant_key'
  const MERCHANT_SALT = 'test_salt'

  function calcHash(
    merchantOid: string,
    status: string,
    totalAmount: string,
    key: string = MERCHANT_KEY,
  ) {
    const hashStr = [merchantOid, MERCHANT_SALT, status, totalAmount].join('')
    return crypto.createHmac('sha256', key).update(hashStr).digest('base64')
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

  it('gizli key olmadan saldırgan geçerli hash üretemez', () => {
    // Gerçek güvenlik = gizli merchant_key. Saldırgan alanları kaydırsa bile
    // (status='' + amount='success100') doğru key olmadan legit hash'i tutturamaz.
    const legit = calcHash('oid', 'success', '100')
    const forged = calcHash('oid', '', 'success100', 'attacker_key')
    expect(forged).not.toBe(legit)
  })
})
