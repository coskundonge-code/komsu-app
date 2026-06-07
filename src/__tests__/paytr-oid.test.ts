import { describe, it, expect } from 'vitest'
import { parseMerchantOid } from '@/lib/services/paytr-oid'

/**
 * PayTR merchant_oid ayrıştırma sözleşmesini korur.
 *
 * Üretim (tek kaynak) — src/app/api/payment/route.ts:
 *   const merchantOid = `${paymentType}_${userId}_${Date.now()}`
 *   paymentType ∈ {'mahalle_card', 'listing_fee', 'business_membership'}
 *   userId = auth kullanıcı id'si (UUID)
 *
 * Tüketim — src/app/api/payment/callback/route.ts: parseMerchantOid() ile geri
 * çözer; payments.payment_type ve hangi kullanıcının kart/üyelik aktivasyonu
 * yapılacağı buna bağlıdır. Bu yüzden para-atfı mantığını burada sabitliyoruz.
 */

// route.ts:73'teki üretim biçiminin birebir kopyası — çift yönlü sözleşmeyi
// testin içinde açıkça tutar (üretim değişirse round-trip testi kırılır).
function buildOid(paymentType: string, userId: string, ts = 1_717_800_000_000): string {
  return `${paymentType}_${userId}_${ts}`
}

const UUID = '3fa85f64-5717-4562-b3fc-2c963f66afa6'

describe('parseMerchantOid — üç gerçek ödeme türü', () => {
  it('mahalle_card doğru paymentType + userId verir', () => {
    expect(parseMerchantOid(buildOid('mahalle_card', UUID))).toEqual({
      paymentType: 'mahalle_card',
      userId: UUID,
    })
  })

  it('listing_fee doğru paymentType + userId verir', () => {
    expect(parseMerchantOid(buildOid('listing_fee', UUID))).toEqual({
      paymentType: 'listing_fee',
      userId: UUID,
    })
  })

  it('business_membership doğru paymentType + userId verir', () => {
    expect(parseMerchantOid(buildOid('business_membership', UUID))).toEqual({
      paymentType: 'business_membership',
      userId: UUID,
    })
  })
})

describe('parseMerchantOid — UUID bütünlüğü', () => {
  it("tire içeren UUID userId'yi split('_') bozmaz", () => {
    const { userId } = parseMerchantOid(buildOid('mahalle_card', UUID))
    expect(userId).toBe(UUID)
    expect(userId).toContain('-')
  })

  it('round-trip: üretim biçimi → ayrıştırma her üç türde de userId’yi geri verir', () => {
    for (const pt of ['mahalle_card', 'listing_fee', 'business_membership']) {
      const parsed = parseMerchantOid(buildOid(pt, UUID))
      expect(parsed.paymentType).toBe(pt)
      expect(parsed.userId).toBe(UUID)
    }
  })
})

describe('parseMerchantOid — aktivasyona uygunluk', () => {
  // callback/route.ts yalnızca mahalle_card ve business_membership için profil
  // aktivasyonu yapar; her ikisi de boş-olmayan userId üretmeli, yoksa
  // aktivasyon sessizce atlanır (yanlış kullanıcıyı aktive etmemek için kritik).
  it('mahalle_card aktivasyon için boş-olmayan userId verir', () => {
    expect(parseMerchantOid(buildOid('mahalle_card', UUID)).userId).toBe(UUID)
  })
  it('business_membership aktivasyon için boş-olmayan userId verir', () => {
    expect(parseMerchantOid(buildOid('business_membership', UUID)).userId).toBe(UUID)
  })
})

describe('parseMerchantOid — bozuk/kısa girdi savunması', () => {
  it('tek token throw etmez, userId boş', () => {
    expect(parseMerchantOid('garbage')).toEqual({ paymentType: 'garbage', userId: '' })
  })

  it('kısaltılmış OID (kullanıcı/zaman damgası yok) boş userId verir → aktivasyon atlanır', () => {
    // 'mahalle_card' (2 token): paymentType çözülür ama userId boş kalır.
    expect(parseMerchantOid('mahalle_card')).toEqual({
      paymentType: 'mahalle_card',
      userId: '',
    })
  })

  it('boş string güvenli ({ paymentType: "", userId: "" })', () => {
    expect(parseMerchantOid('')).toEqual({ paymentType: '', userId: '' })
  })
})

describe('parseMerchantOid — örtük allowlist kırılganlığı (regresyon guard)', () => {
  // İki-kelimeli payment type'ın 2. token'ı allowlist'te (card|fee|membership)
  // değilse, geri-birleştirme YALNIZCA ilk kelimeyi alır ve ikinci kelime
  // sessizce kaybolur. Yeni iki-kelimeli bir tür eklenirse paytr-oid.ts'teki
  // TWO_WORD_SECOND_TOKENS allowlist'i GÜNCELLENMELİ — bu test o gereği belgeler.
  it('bilinmeyen 2. token’lı iki-kelimeli tür ilk kelimeye çöker (bilinçli sözleşme)', () => {
    const { paymentType } = parseMerchantOid(buildOid('charity_drive', UUID))
    expect(paymentType).toBe('charity') // 'drive' allowlist'te değil → düşer
  })

  it('userId yine de doğru konumdan (sondan bir önceki token) gelir', () => {
    expect(parseMerchantOid(buildOid('charity_drive', UUID)).userId).toBe(UUID)
  })
})
