import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'
import { createClient as createServerClient } from '@/lib/supabase/server'

/**
 * İşletme Aboneliği Aktivasyon API
 * POST /api/business/subscription/activate
 *
 * GÜVENLİK: Abonelik aktivasyonu (status='active' + ödeme alanları) ARTIK
 * istemciden yapılamaz — DB'deki guard_business_subscription_privileged trigger'ı
 * istemci rollerinin bunu yazmasını engeller. Aktivasyon yalnızca burada,
 * sunucuda gerçekleşir:
 *   1) Oturum zorunlu (kimlik session'dan; istemciye güvenilmez).
 *   2) Sahiplik: yalnızca kendi işletmesini aktive edebilir.
 *   3) Ödeme kapısı: PayTR yapılandırılmışsa (canlı), TAMAMLANMIŞ bir
 *      business_membership ödemesi şarttır. Yapılandırılmamışsa (simülasyon /
 *      pazara hazırlık) gerçek para akmadığından aktivasyona izin verilir.
 *   4) Yazma service_role ile yapılır → guard trigger'ı baypas eder.
 *
 * NOT (pazara-hazırlık): Canlıda üretim-seviyesi sağlamlaştırma için ödeme
 * kapısı, AKTİVASYONA özel tek bir ödeme kaydını eşleştirip "tüketmeli"
 * (merchant_oid bazlı), böylece tek ödeme tekrar tekrar aktivasyona kullanılamaz.
 * Şimdilik (PayTR simülasyon modunda, tablolar boşken) bu sade kapı yeterli.
 */

// business-subscription.ts ile senkron tutulmalı (MONTHLY_PRICE / YEARLY_PRICE).
const MONTHLY_PRICE = 1900
const YEARLY_PRICE = 19900

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const PAYTR_CONFIGURED = !!(
  process.env.PAYTR_MERCHANT_ID &&
  process.env.PAYTR_MERCHANT_KEY &&
  process.env.PAYTR_MERCHANT_SALT
)

export async function POST(request: NextRequest) {
  try {
    // Rate limit: IP başına 10 istek / dakika
    const ip = getClientIp(request)
    const rl = await rateLimit(`sub-activate:${ip}`, { limit: 10, windowMs: 60_000 })
    if (!rl.success) return rateLimitResponse(rl) as unknown as NextResponse

    // 1) Oturum zorunlu — kimlik session'dan türetilir.
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Bu işlem için giriş yapmalısınız.' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({} as Record<string, unknown>))
    const billingPeriod: 'monthly' | 'yearly' =
      (body as Record<string, unknown>)?.billingPeriod === 'yearly' ? 'yearly' : 'monthly'

    // 2) Sahiplik: kullanıcının işletmesini bul (başka işletme aktive edilemez).
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', user.id)
      .single()
    if (!business?.id) {
      return NextResponse.json({ error: 'Bu hesaba ait işletme bulunamadı.' }, { status: 403 })
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return NextResponse.json({ error: 'Sunucu yapılandırması eksik.' }, { status: 503 })
    }
    const admin = createServiceClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    // 3) Ödeme kapısı (yalnızca canlı PayTR yapılandırmasında zorunlu).
    if (PAYTR_CONFIGURED) {
      const { data: paid } = await admin
        .from('payments')
        .select('id')
        .eq('user_id', user.id)
        .eq('payment_type', 'business_membership')
        .eq('status', 'completed')
        .limit(1)
        .maybeSingle()
      if (!paid) {
        return NextResponse.json(
          { error: 'Onaylı bir ödeme bulunamadı. Lütfen ödemeyi tamamlayın.' },
          { status: 402 },
        )
      }
    }

    // 4) Aktivasyonu service_role ile yaz (guard trigger baypas edilir).
    const now = new Date()
    const endDate = new Date(now)
    if (billingPeriod === 'monthly') endDate.setMonth(endDate.getMonth() + 1)
    else endDate.setFullYear(endDate.getFullYear() + 1)
    const price = billingPeriod === 'monthly' ? MONTHLY_PRICE : YEARLY_PRICE

    const activeRow = {
      status: 'active' as const,
      billing_period: billingPeriod,
      subscription_start_date: now.toISOString(),
      subscription_end_date: endDate.toISOString(),
      current_price: price,
      auto_renew: true,
      updated_at: now.toISOString(),
    }

    const { data: updated, error: updErr } = await admin
      .from('business_subscriptions')
      .update(activeRow)
      .eq('business_id', business.id)
      .select()
      .maybeSingle()

    if (updErr) {
      console.error('Subscription activate update error:', updErr)
      return NextResponse.json({ error: 'Abonelik güncellenemedi.' }, { status: 500 })
    }

    // Trial satırı henüz yoksa aktif satırı oluştur.
    if (!updated) {
      const { data: inserted, error: insErr } = await admin
        .from('business_subscriptions')
        .insert({
          business_id: business.id,
          trial_start_date: now.toISOString(),
          trial_end_date: now.toISOString(),
          ...activeRow,
        })
        .select()
        .single()
      if (insErr) {
        console.error('Subscription activate insert error:', insErr)
        return NextResponse.json({ error: 'Abonelik oluşturulamadı.' }, { status: 500 })
      }
      return NextResponse.json({ success: true, subscription: inserted })
    }

    return NextResponse.json({ success: true, subscription: updated })
  } catch (error) {
    console.error('Subscription activate route error:', error)
    return NextResponse.json({ error: 'Abonelik işlemi başarısız' }, { status: 500 })
  }
}
