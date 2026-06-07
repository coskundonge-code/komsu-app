import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest'
import crypto from 'crypto'

/**
 * PayTR callback (PARA YOLU) güvenlik + yan-etki sözleşmesi.
 *
 * Üretim: src/app/api/payment/callback/route.ts — PayTR ödeme bildirimini alır,
 * HMAC-SHA256 hash'i doğrular, sonra (a) payments tablosuna completed/failed
 * yazar, (b) başarılı mahalle_card / business_membership ödemelerinde ilgili
 * profili AKTİVE eder. Buradaki bir gevşeklik = sahte bir POST ile bedava kart/
 * üyelik veya yanlış kullanıcıya aktivasyon demek. Bu yüzden reddetme kapılarını
 * (hash/durum/tutar) ve aktivasyon yan-etkilerini burada kilitliyoruz.
 *
 * Supabase mock'lanır: gerçek DB'ye yazmadan route'un DOĞRU tabloya/işleme
 * gittiğini (payments.upsert, profiles.update().eq()) doğrularız.
 */

// ── Supabase mock (hoisted) ──────────────────────────────────────────────────
const upsertMock = vi.fn().mockResolvedValue({ data: null, error: null })
const eqMock = vi.fn().mockResolvedValue({ data: null, error: null })
const updateMock = vi.fn((_data?: Record<string, unknown>) => ({ eq: eqMock }))
const fromMock = vi.fn(() => ({ upsert: upsertMock, update: updateMock }))

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ from: fromMock })),
}))

// Route, env'i MODÜL YÜKLENİRKEN okur → import'tan ÖNCE set edip dinamik import et.
const TEST_KEY = 'test_merchant_key'
const TEST_SALT = 'test_merchant_salt'
const UUID = '3fa85f64-5717-4562-b3fc-2c963f66afa6'

let POST: typeof import('@/app/api/payment/callback/route').POST

beforeAll(async () => {
  process.env.PAYTR_MERCHANT_KEY = TEST_KEY
  process.env.PAYTR_MERCHANT_SALT = TEST_SALT
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test_service_key'
  ;({ POST } = await import('@/app/api/payment/callback/route'))
})

beforeEach(() => {
  // Çağrı geçmişini temizle (implementasyonları korur → mockResolvedValue kalır).
  vi.clearAllMocks()
})

// route.ts:30-34 ile birebir aynı hash üretimi — geçerli imzayı testte yeniden kurar.
function validHash(merchantOid: string, status: string, totalAmount: string): string {
  const hashStr = [merchantOid, TEST_SALT, status, totalAmount].join('')
  return crypto.createHmac('sha256', TEST_KEY).update(hashStr).digest('base64')
}

// Route sadece request.formData() kullanır → yalnızca onu sunan minimal stub yeter.
function makeCall(fields: Record<string, string | undefined>) {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) {
    if (v !== undefined) fd.append(k, v)
  }
  const req = { formData: async () => fd } as unknown as Parameters<typeof POST>[0]
  return POST(req)
}

describe('PayTR callback — güvenlik kapıları (reddetme yolları)', () => {
  it('eksik parametre (hash yok) → 400, DB’ye dokunmaz', async () => {
    const oid = `mahalle_card_${UUID}_${Date.now()}`
    const res = await makeCall({ merchant_oid: oid, status: 'success', total_amount: '15000' })
    expect(res.status).toBe(400)
    expect(await res.text()).toContain('missing params')
    expect(fromMock).not.toHaveBeenCalled()
  })

  it('hash uyuşmazlığı → 400, DB’ye dokunmaz (sahte bildirim reddi)', async () => {
    const oid = `mahalle_card_${UUID}_${Date.now()}`
    const res = await makeCall({
      merchant_oid: oid,
      status: 'success',
      total_amount: '15000',
      hash: 'BERBAT_HASH',
    })
    expect(res.status).toBe(400)
    expect(await res.text()).toContain('hash mismatch')
    expect(fromMock).not.toHaveBeenCalled()
  })

  it('imzalı tutar değiştirilirse hash tutmaz → 400 (tutar bütünlüğü)', async () => {
    const oid = `mahalle_card_${UUID}_${Date.now()}`
    // Hash 100 TL (15000 kuruş) için üretildi; gönderilen tutar 1 kuruş.
    const signed = validHash(oid, 'success', '15000')
    const res = await makeCall({
      merchant_oid: oid,
      status: 'success',
      total_amount: '1',
      hash: signed,
    })
    expect(res.status).toBe(400)
    expect(await res.text()).toContain('hash mismatch')
    expect(fromMock).not.toHaveBeenCalled()
  })

  it('geçerli imza ama bilinmeyen durum → 400 (yalnız success|failed kabul)', async () => {
    const oid = `mahalle_card_${UUID}_${Date.now()}`
    const status = 'pending'
    const res = await makeCall({
      merchant_oid: oid,
      status,
      total_amount: '15000',
      hash: validHash(oid, status, '15000'),
    })
    expect(res.status).toBe(400)
    expect(await res.text()).toContain('invalid status')
    expect(fromMock).not.toHaveBeenCalled()
  })

  it('geçerli imza ama sayısal olmayan tutar → 400 (para olmadan yazmaz)', async () => {
    const oid = `mahalle_card_${UUID}_${Date.now()}`
    const amount = 'bedava' // parseInt → NaN
    const res = await makeCall({
      merchant_oid: oid,
      status: 'success',
      total_amount: amount,
      hash: validHash(oid, 'success', amount),
    })
    expect(res.status).toBe(400)
    expect(await res.text()).toContain('invalid total_amount')
    expect(fromMock).not.toHaveBeenCalled()
  })
})

describe('PayTR callback — başarılı ödeme yan etkileri', () => {
  it('mahalle_card success → 200, payments completed + profil kartı aktive', async () => {
    const oid = `mahalle_card_${UUID}_${Date.now()}`
    const amount = '15000' // kuruş
    const res = await makeCall({
      merchant_oid: oid,
      status: 'success',
      total_amount: amount,
      hash: validHash(oid, 'success', amount),
    })
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('OK')

    // payments.upsert: completed + doğru tür/kullanıcı + kuruş→TL
    expect(fromMock).toHaveBeenCalledWith('payments')
    const payment = upsertMock.mock.calls[0][0] as Record<string, unknown>
    expect(payment.status).toBe('completed')
    expect(payment.payment_type).toBe('mahalle_card')
    expect(payment.user_id).toBe(UUID)
    expect(payment.amount).toBe(150)

    // profiles.update(...).eq('id', UUID): kart aktivasyonu doğru kullanıcıya
    expect(fromMock).toHaveBeenCalledWith('profiles')
    const profile = updateMock.mock.calls[0][0] as Record<string, unknown>
    expect(profile.mahalle_card_active).toBe(true)
    expect(eqMock).toHaveBeenCalledWith('id', UUID)
  })

  it('business_membership success → 200, üyelik bayrağı doğru kullanıcıya aktive', async () => {
    const oid = `business_membership_${UUID}_${Date.now()}`
    const amount = '30000'
    const res = await makeCall({
      merchant_oid: oid,
      status: 'success',
      total_amount: amount,
      hash: validHash(oid, 'success', amount),
    })
    expect(res.status).toBe(200)
    const profile = updateMock.mock.calls[0][0] as Record<string, unknown>
    expect(profile.business_membership_active).toBe(true)
    expect(eqMock).toHaveBeenCalledWith('id', UUID)
  })

  it('listing_fee success → 200, payments yazılır ama profil AKTİVE EDİLMEZ', async () => {
    const oid = `listing_fee_${UUID}_${Date.now()}`
    const amount = '25000'
    const res = await makeCall({
      merchant_oid: oid,
      status: 'success',
      total_amount: amount,
      hash: validHash(oid, 'success', amount),
    })
    expect(res.status).toBe(200)
    expect(upsertMock).toHaveBeenCalledTimes(1)
    expect(fromMock).not.toHaveBeenCalledWith('profiles')
  })
})

describe('PayTR callback — başarısız ödeme', () => {
  it('mahalle_card failed → 200, payments failed + AKTİVASYON YOK', async () => {
    const oid = `mahalle_card_${UUID}_${Date.now()}`
    const amount = '15000'
    const res = await makeCall({
      merchant_oid: oid,
      status: 'failed',
      total_amount: amount,
      hash: validHash(oid, 'failed', amount),
    })
    expect(res.status).toBe(200)
    const payment = upsertMock.mock.calls[0][0] as Record<string, unknown>
    expect(payment.status).toBe('failed')
    // Başarısız ödeme mahalle_card olsa bile profil aktive EDİLMEMELİ.
    expect(fromMock).not.toHaveBeenCalledWith('profiles')
  })
})
