/**
 * Mahallemiz - Fiyatlandırma ve İş Kuralları
 * Tüm uygulama genelindeki fiyatlar ve iş mantığı kuralları burada tanımlanır.
 */

// ==========================================
// MAHALLE KARTI
// ==========================================
export const MAHALLE_CARD_PRICE = {
  amount: 4.99,
  currency: 'TRY',
  period: 'yearly' as const,
  label: 'Mahalle Kartı - Yıllık Üyelik',
  description: 'Mahalle kartınızla yerel esnaftan indirim kazanın',
}

// ==========================================
// İLAN FİYATLANDIRMA
// ==========================================
export const LISTING_PRICING = {
  firstListingFree: true,
  paidListingAmount: 99,
  currency: 'TRY',
  freeListingTypes: ['hibe', 'ucretsiz_odunc', 'bagis'] as const,
  paidListingTypes: ['satis', 'kiralama'] as const,
}

// ==========================================
// ESNAF ÜYELİK
// ==========================================
export const BUSINESS_MEMBERSHIP = {
  monthlyFee: 99,
  currency: 'TRY',
  period: 'monthly' as const,
  label: 'Esnaf Üyeliği - Aylık',
  description: 'Mahalle esnafı olarak işletmenizi tanıtın',
  requirements: {
    addressVerification: true,
    discountRequired: true,
    minDiscountPercent: 5,
  },
}

// ==========================================
// ADRES DOĞRULAMA
// ==========================================
export const ADDRESS_VERIFICATION = {
  deadlineDays: 7,
  lockOnExpiry: true,
  immediateVerificationRequired: [
    'create_listing',
    'create_post',
    'rent_item',
    'sell_item',
    'donate_item',
    'lend_item',
    'business_register',
  ] as const,
}

// ==========================================
// ASKIDA BAĞIŞ
// ==========================================
export const ASKIDA_BAGIS = {
  isFree: true,
  donationFee: 0,
  redemptionFee: 0,
  description: 'Askıda bağış sistemi tamamen ücretsizdir',
}

// ==========================================
// ÖDEME AYARLARI (PayTR)
// ==========================================
export const PAYMENT_CONFIG = {
  provider: 'paytr' as const,
  currency: 'TRY',
  locale: 'tr',
  testMode: process.env.PAYTR_TEST_MODE === 'true',
  endpoints: {
    token: 'https://www.paytr.com/odeme/api/get-token',
    callback: '/api/payment/callback',
  },
}

// ==========================================
// YARDIMCI FONKSİYONLAR
// ==========================================

export function calculateListingFee(
  listingType: string,
  userPaidListingCount: number
): { amount: number; isFree: boolean; reason: string } {
  if (LISTING_PRICING.freeListingTypes.includes(listingType as any)) {
    return { amount: 0, isFree: true, reason: 'Bu ilan türü ücretsizdir' }
  }
  if (LISTING_PRICING.firstListingFree && userPaidListingCount === 0) {
    return { amount: 0, isFree: true, reason: 'İlk ilanınız ücretsizdir' }
  }
  return {
    amount: LISTING_PRICING.paidListingAmount,
    isFree: false,
    reason: `İlan ücreti: ${LISTING_PRICING.paidListingAmount} TL`,
  }
}

export function calculateVerificationDeadline(): Date {
  const deadline = new Date()
  deadline.setDate(deadline.getDate() + ADDRESS_VERIFICATION.deadlineDays)
  return deadline
}

export function requiresImmediateVerification(action: string): boolean {
  return ADDRESS_VERIFICATION.immediateVerificationRequired.includes(action as any)
}

export function validateBusinessRegistration(data: {
  addressVerified: boolean
  hasDiscount: boolean
  discountPercent?: number
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  if (!data.addressVerified) errors.push('Adres doğrulaması yapılmalıdır')
  if (!data.hasDiscount) errors.push('En az bir indirim tanımlanmalıdır')
  if (data.discountPercent && data.discountPercent < BUSINESS_MEMBERSHIP.requirements.minDiscountPercent) {
    errors.push(`Minimum %${BUSINESS_MEMBERSHIP.requirements.minDiscountPercent} indirim tanımlanmalıdır`)
  }
  return { valid: errors.length === 0, errors }
}
