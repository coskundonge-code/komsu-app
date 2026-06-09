import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { getPaymentAmount } from '@/lib/pricing'

/**
 * PayTR Ödeme Token Oluşturma API
 * POST /api/payment
 *
 * Body: {
 *   paymentType: 'mahalle_card' | 'listing_fee' | 'business_membership'
 *   amount: number (kuruş cinsinden)
 *   userEmail: string
 *   userName: string
 *   userId: string
 *   metadata?: Record<string, string>
 * }
 */

const PAYTR_MERCHANT_ID = process.env.PAYTR_MERCHANT_ID || ''
const PAYTR_MERCHANT_KEY = process.env.PAYTR_MERCHANT_KEY || ''
const PAYTR_MERCHANT_SALT = process.env.PAYTR_MERCHANT_SALT || ''
const PAYTR_TEST_MODE = process.env.PAYTR_TEST_MODE === 'true' ? '1' : '0'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://komsu-app.vercel.app'

interface PaymentRequest {
  paymentType: 'mahalle_card' | 'listing_fee' | 'business_membership'
  amount: number
  userEmail: string
  userName: string
  userId: string
  metadata?: Record<string, string>
}

const PAYMENT_DESCRIPTIONS: Record<string, string> = {
  mahalle_card: 'Mahalle Kartı - Yıllık Üyelik',
  listing_fee: 'İlan Yayınlama Ücreti',
  business_membership: 'Esnaf Üyeliği - Aylık',
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit: IP başına 10 ödeme isteği / dakika
    const ip = getClientIp(request)
    const rl = await rateLimit(`payment:${ip}`, { limit: 10, windowMs: 60_000 })
    if (!rl.success) return rateLimitResponse(rl) as any

    // Oturum zorunlu. KİMLİK ve TUTAR İSTEMCİDEN ALINMAZ:
    // - userId/email session'dan türetilir → başkası adına ödeme/merchant_oid
    //   üretilemez (impersonation kapatıldı).
    // - tutar sunucudaki fiyat tablosundan (pricing.ts) hesaplanır → kullanıcı
    //   99 TL'lik ürünü 1 TL'ye geçiremez (fiyat oynaması kapatıldı).
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Bu işlem için giriş yapmalısınız.' }, { status: 401 })
    }

    const body: PaymentRequest = await request.json()
    const { paymentType } = body

    const ALLOWED_PAYMENT_TYPES: string[] = ['mahalle_card', 'listing_fee', 'business_membership']
    if (!ALLOWED_PAYMENT_TYPES.includes(paymentType)) {
      return NextResponse.json({ error: 'Geçersiz ödeme tipi' }, { status: 400 })
    }

    const amount = getPaymentAmount(paymentType)
    if (amount == null) {
      return NextResponse.json({ error: 'Geçersiz ödeme tipi' }, { status: 400 })
    }

    const userId = user.id
    const userEmail = user.email || ''
    // İsim yalnızca PayTR formunda görüntü amaçlı; profil adını kullan, yoksa
    // e-posta yerel kısmına düş. İstemciden gelen isme güvenmiyoruz.
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single()
    const userName = profile?.full_name || userEmail.split('@')[0] || 'Kullanıcı'

    if (!userEmail) {
      return NextResponse.json({ error: 'Hesabınızda e-posta tanımlı değil.' }, { status: 400 })
    }

    if (!PAYTR_MERCHANT_ID || !PAYTR_MERCHANT_KEY || !PAYTR_MERCHANT_SALT) {
      return NextResponse.json({
        success: true,
        mode: 'simulation',
        message: 'Ödeme simülasyon modunda. PayTR API anahtarları yapılandırılmamış.',
        paymentId: `sim_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        amount,
        paymentType,
      })
    }

    const merchantOid = `${paymentType}_${userId}_${Date.now()}`
    const paymentAmount = Math.round(amount * 100)
    const userIp = (request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()) || '127.0.0.1'
    const noInstallment = '1'
    const maxInstallment = '0'
    const currencyType = 'TL'
    const testMode = PAYTR_TEST_MODE

    const basketItem = [
      PAYMENT_DESCRIPTIONS[paymentType] || paymentType,
      (amount).toFixed(2),
      '1',
    ]
    const userBasket = Buffer.from(JSON.stringify([basketItem])).toString('base64')

    const hashStr = [
      PAYTR_MERCHANT_ID, userIp, merchantOid, userEmail,
      paymentAmount.toString(), userBasket, noInstallment,
      maxInstallment, currencyType, testMode, PAYTR_MERCHANT_SALT,
    ].join('')

    const token = crypto
      .createHmac('sha256', PAYTR_MERCHANT_KEY)
      .update(hashStr)
      .digest('base64')

    const formData = new URLSearchParams({
      merchant_id: PAYTR_MERCHANT_ID,
      user_ip: userIp,
      merchant_oid: merchantOid,
      email: userEmail,
      payment_amount: paymentAmount.toString(),
      paytr_token: token,
      user_basket: userBasket,
      debug_on: testMode,
      no_installment: noInstallment,
      max_installment: maxInstallment,
      user_name: userName,
      user_phone: '',
      merchant_ok_url: `${BASE_URL}/odeme/basarili?oid=${merchantOid}`,
      merchant_fail_url: `${BASE_URL}/odeme/basarisiz?oid=${merchantOid}`,
      timeout_limit: '30',
      currency: currencyType,
      test_mode: testMode,
      lang: 'tr',
    })

    const paytrResponse = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    })

    const paytrResult = await paytrResponse.json()

    if (paytrResult.status === 'success') {
      return NextResponse.json({
        success: true,
        token: paytrResult.token,
        merchantOid,
        iframeUrl: `https://www.paytr.com/odeme/guvenli/${paytrResult.token}`,
      })
    } else {
      return NextResponse.json(
        { error: 'Ödeme token oluşturulamadı', reason: paytrResult.reason },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Payment API error:', error)
    return NextResponse.json(
      { error: 'Ödeme işlemi başarısız' },
      { status: 500 }
    )
  }
}
