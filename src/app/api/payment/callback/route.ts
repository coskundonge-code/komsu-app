import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

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

    // Hash doğrulama
    const hashStr = [merchantOid, PAYTR_MERCHANT_SALT, status, totalAmount].join('')
    const expectedHash = crypto
      .createHmac('sha256', PAYTR_MERCHANT_KEY)
      .update(hashStr)
      .digest('base64')

    if (hash !== expectedHash) {
      return new NextResponse('PAYTR notification error: hash mismatch', { status: 400 })
    }

    const parts = merchantOid.split('_')
    const paymentType = parts[0] + (parts[1] === 'card' || parts[1] === 'fee' || parts[1] === 'membership' ? '_' + parts[1] : '')
    const userId = parts.length >= 3 ? parts[parts.length - 2] : ''

    if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

      if (status === 'success') {
        await supabase.from('payments').upsert({
          merchant_oid: merchantOid,
          user_id: userId || null,
          payment_type: paymentType,
          amount: parseInt(totalAmount) / 100,
          status: 'completed',
          provider: 'paytr',
          completed_at: new Date().toISOString(),
        })

        if (paymentType === 'mahalle_card' && userId) {
          const expiryDate = new Date()
          expiryDate.setFullYear(expiryDate.getFullYear() + 1)
          await supabase.from('profiles').update({
            mahalle_card_active: true,
            mahalle_card_expiry: expiryDate.toISOString(),
          }).eq('id', userId)
        } else if (paymentType === 'business_membership' && userId) {
          const expiryDate = new Date()
          expiryDate.setMonth(expiryDate.getMonth() + 1)
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
          amount: parseInt(totalAmount) / 100,
          status: 'failed',
          provider: 'paytr',
        })
      }
    }

    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('PayTR callback error:', error)
    return new NextResponse('PAYTR notification error', { status: 500 })
  }
}
