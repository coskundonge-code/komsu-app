// Bkz. AUDIT_REPORT.md K1 maddesi
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { parseMerchantOid } from '@/lib/services/paytr-oid'
import { getPaymentAmount } from '@/lib/pricing'

/**
 * PayTR Callback (Bildirim) API
 * POST /api/payment/callback
 */

const PAYTR_MERCHANT_KEY = process.env.PAYTR_MERCHANT_KEY || ''
const PAYTR_MERCHANT_SALT = process.env.PAYTR_MERCHANT_SALT || ''
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const merchantOid = formData.get('merchant_oid') as string
    const status = formData.get('status') as string
    const totalAmount = formData.get('total_amount') as string
    const hash = formData.get('hash') as string

    if (!merchantOid || !status || !totalAmount || !hash) {
      return new NextResponse('PAYTR notification error: missing params', { status: 400 })
    }

    // PayTR anahtarları yoksa boş anahtarla HMAC üretiyorduk; merchantOid+status+
    // total_amount bilen biri bu hash'i taklit edip SAHTE "başarılı ödeme"
    // gönderebilir ve bedava üyelik açabilirdi. Anahtar yoksa callback'i hiç
    // işleme — gerçek PayTR entegrasyonu da yoksa zaten meşru çağrı gelmez.
    if (!PAYTR_MERCHANT_KEY || !PAYTR_MERCHANT_SALT) {
      return new NextResponse('PAYTR notification error: provider not configured', { status: 503 })
    }

    // Hash doğrulama
    const hashStr = [merchantOid, PAYTR_MERCHANT_SALT, status, totalAmount].join('')
    const expectedHash = crypto
      .createHmac('sha256', PAYTR_MERCHANT_KEY)
      .update(hashStr)
      .digest('base64')

    if (hash !== expectedHash) {
      return new NextResponse('PAYTR notification error: hash mismatch', { status: 400 })
    }

    // Defense-in-depth: only accept the two statuses PayTR sends, and require a
    // numeric total_amount before we trust it as money.
    if (status !== 'success' && status !== 'failed') {
      return new NextResponse('PAYTR notification error: invalid status', { status: 400 })
    }
    const amountKurus = parseInt(totalAmount, 10)
    if (Number.isNaN(amountKurus)) {
      return new NextResponse('PAYTR notification error: invalid total_amount', { status: 400 })
    }
    const amountTl = amountKurus / 100

    const { paymentType, userId } = parseMerchantOid(merchantOid)

    // Tutar doğrulaması (ikinci bağımsız kapı): ödenen tutar, sunucudaki fiyat
    // tablosuyla BİREBİR uyuşmalı. Token üreten /api/payment tutarı zaten sunucuda
    // hesaplıyor; uyuşmazsa bu bir oynamadır → ÜYELİK AKTİVASYONU YAPILMAZ.
    const expectedAmount = getPaymentAmount(paymentType)
    if (expectedAmount == null) {
      return new NextResponse('PAYTR notification error: unknown payment type', { status: 400 })
    }
    const expectedKurus = Math.round(expectedAmount * 100)
    if (status === 'success' && amountKurus !== expectedKurus) {
      console.error('PayTR amount mismatch', { merchantOid, amountKurus, expectedKurus })
      return new NextResponse('PAYTR notification error: amount mismatch', { status: 400 })
    }

    if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

      // Idempotency: PayTR aynı bildirimi birden çok kez gönderebilir. Ödeme zaten
      // 'completed' ise üyeliği/kartı TEKRAR aktive etme (çift aktivasyon + mükerrer
      // kayıt yok; merchant_oid artık UNIQUE).
      const { data: existing } = await supabase
        .from('payments')
        .select('status')
        .eq('merchant_oid', merchantOid)
        .maybeSingle()
      if (existing?.status === 'completed') {
        return new NextResponse('OK', { status: 200 })
      }

      if (status === 'success') {
        await supabase.from('payments').upsert({
          merchant_oid: merchantOid,
          user_id: userId || null,
          payment_type: paymentType,
          amount: amountTl,
          status: 'completed',
          provider: 'paytr',
          completed_at: new Date().toISOString(),
        }, { onConflict: 'merchant_oid' })

        if (paymentType === 'mahalle_card' && userId) {
          const expiryDate = new Date()
          expiryDate.setFullYear(expiryDate.getFullYear() + 1)
          await supabase.from('profiles').update({
            mahalle_card_active: true,
            mahalle_card_expiry: expiryDate.toISOString(),
          }).eq('id', userId)
        } else if ((paymentType === 'business_membership' || paymentType === 'business_yearly') && userId) {
          // Aylık (business_membership) → +1 ay; Yıllık (business_yearly) → +1 yıl.
          // Her ikisi de aynı bayrağı (business_membership_active) açar, yalnız
          // bitiş tarihi döneme göre değişir.
          const expiryDate = new Date()
          if (paymentType === 'business_yearly') {
            expiryDate.setFullYear(expiryDate.getFullYear() + 1)
          } else {
            expiryDate.setMonth(expiryDate.getMonth() + 1)
          }
          await supabase.from('profiles').update({
            business_membership_active: true,
            business_membership_expiry: expiryDate.toISOString(),
          }).eq('id', userId)
        }
      } else {
        await supabase.from('payments').upsert({
          merchant_oid: merchantOid,
          user_id: userId || null,
          payment_type: paymentType,
          amount: amountTl,
          status: 'failed',
          provider: 'paytr',
        }, { onConflict: 'merchant_oid' })
      }
    }

    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('PayTR callback error:', error)
    return new NextResponse('PAYTR notification error', { status: 500 })
  }
}
