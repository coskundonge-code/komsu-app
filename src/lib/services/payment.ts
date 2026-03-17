// @ts-nocheck
/**
 * Payment Service
 * Manages payment intents, processing, and revenue tracking
 * Supports listing fees and featured listing purchases
 */

import { createClient } from '@/lib/supabase/client';

// Payment Types
export enum PaymentType {
  LISTING_FEE = 'listing_fee', // Additional paid listing (250 TL)
  FEATURED_3DAYS = 'featured_3days', // Feature for 3 days (50 TL)
  FEATURED_7DAYS = 'featured_7days', // Feature for 7 days (100 TL)
  FEATURED_30DAYS = 'featured_30days', // Feature for 30 days (200 TL)
  BUSINESS_MONTHLY = 'business_monthly', // Business listing monthly package
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  WALLET = 'wallet',
}

// Featured listing pricing (in TRY)
export const FEATURED_PRICING = {
  [PaymentType.FEATURED_3DAYS]: {
    amount: 50,
    days: 3,
    label: '3 Gün',
  },
  [PaymentType.FEATURED_7DAYS]: {
    amount: 100,
    days: 7,
    label: '7 Gün',
  },
  [PaymentType.FEATURED_30DAYS]: {
    amount: 200,
    days: 30,
    label: '30 Gün',
  },
} as const;

export const LISTING_FEE_AMOUNT = 250; // TRY
export const CURRENCY = 'TRY';

export interface PaymentIntent {
  id: string;
  userId: string;
  type: PaymentType;
  amount: number;
  currency: string;
  status: PaymentStatus;
  listingId?: string;
  description: string;
  paymentReference?: string;
  method?: PaymentMethod;
  createdAt: string;
  completedAt?: string;
  refundedAt?: string;
  expiresAt?: string;
}

export interface PaymentHistory {
  id: string;
  userId: string;
  type: PaymentType;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  description: string;
  completedAt: string;
  listingId?: string;
}

export interface RevenueReport {
  totalAmount: number;
  totalTransactions: number;
  byType: Record<PaymentType, { amount: number; count: number }>;
  byStatus: Record<PaymentStatus, { amount: number; count: number }>;
  byMethod: Record<PaymentMethod, { amount: number; count: number }>;
  date?: { from: string; to: string };
}

/**
 * Create a new payment intent
 */
export async function createPaymentIntent(
  userId: string,
  type: PaymentType,
  amount: number,
  listingId?: string,
  method?: PaymentMethod
): Promise<PaymentIntent | null> {
  try {
    const supabase = createClient();

    // Generate description based on payment type
    let description = '';
    switch (type) {
      case PaymentType.LISTING_FEE:
        description = 'Ek İlan Ücreti';
        break;
      case PaymentType.FEATURED_3DAYS:
        description = 'Ön Plana Çıkart (3 Gün)';
        break;
      case PaymentType.FEATURED_7DAYS:
        description = 'Ön Plana Çıkart (7 Gün)';
        break;
      case PaymentType.FEATURED_30DAYS:
        description = 'Ön Plana Çıkart (30 Gün)';
        break;
      case PaymentType.BUSINESS_MONTHLY:
        description = 'İşletme İlanı Aylık Paket';
        break;
    }

    // Set expiration for pending payments (24 hours)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        type,
        amount,
        currency: CURRENCY,
        status: PaymentStatus.PENDING,
        listing_id: listingId || null,
        description,
        method: method || null,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating payment intent:', error);
      return null;
    }

    return mapPaymentRow(data);
  } catch (error) {
    console.error('Error in createPaymentIntent:', error);
    return null;
  }
}

/**
 * Process a payment (mark as completed)
 */
export async function processPayment(
  paymentId: string,
  paymentReference: string,
  method?: PaymentMethod
): Promise<PaymentIntent | null> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('payments')
      .update({
        status: PaymentStatus.COMPLETED,
        payment_reference: paymentReference,
        method: method || null,
        completed_at: new Date().toISOString(),
      })
      .eq('id', paymentId)
      .select()
      .single();

    if (error) {
      console.error('Error processing payment:', error);
      return null;
    }

    return mapPaymentRow(data);
  } catch (error) {
    console.error('Error in processPayment:', error);
    return null;
  }
}

/**
 * Refund a payment
 */
export async function refundPayment(paymentId: string): Promise<PaymentIntent | null> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('payments')
      .update({
        status: PaymentStatus.REFUNDED,
        refunded_at: new Date().toISOString(),
      })
      .eq('id', paymentId)
      .select()
      .single();

    if (error) {
      console.error('Error refunding payment:', error);
      return null;
    }

    return mapPaymentRow(data);
  } catch (error) {
    console.error('Error in refundPayment:', error);
    return null;
  }
}

/**
 * Mark a payment as failed
 */
export async function failPayment(paymentId: string, reason?: string): Promise<PaymentIntent | null> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('payments')
      .update({
        status: PaymentStatus.FAILED,
        description: reason ? `${reason}` : undefined,
      })
      .eq('id', paymentId)
      .select()
      .single();

    if (error) {
      console.error('Error failing payment:', error);
      return null;
    }

    return mapPaymentRow(data);
  } catch (error) {
    console.error('Error in failPayment:', error);
    return null;
  }
}

/**
 * Get user's payment history
 */
export async function getPaymentHistory(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<PaymentHistory[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .eq('status', PaymentStatus.COMPLETED)
      .order('completed_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching payment history:', error);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      userId: row.user_id,
      type: row.type as PaymentType,
      amount: row.amount,
      status: row.status as PaymentStatus,
      method: row.method as PaymentMethod,
      description: row.description,
      completedAt: row.completed_at,
      listingId: row.listing_id,
    }));
  } catch (error) {
    console.error('Error in getPaymentHistory:', error);
    return [];
  }
}

/**
 * Get admin revenue report
 */
export async function getRevenueReport(
  startDate: string,
  endDate: string
): Promise<RevenueReport | null> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('status', PaymentStatus.COMPLETED)
      .gte('completed_at', startDate)
      .lte('completed_at', endDate);

    if (error) {
      console.error('Error fetching revenue report:', error);
      return null;
    }

    const report: RevenueReport = {
      totalAmount: 0,
      totalTransactions: data.length,
      byType: {} as Record<PaymentType, { amount: number; count: number }>,
      byStatus: {} as Record<PaymentStatus, { amount: number; count: number }>,
      byMethod: {} as Record<PaymentMethod, { amount: number; count: number }>,
      date: { from: startDate, to: endDate },
    };

    // Initialize empty objects
    Object.values(PaymentType).forEach((type) => {
      report.byType[type] = { amount: 0, count: 0 };
    });
    Object.values(PaymentStatus).forEach((status) => {
      report.byStatus[status] = { amount: 0, count: 0 };
    });
    Object.values(PaymentMethod).forEach((method) => {
      report.byMethod[method] = { amount: 0, count: 0 };
    });

    // Aggregate data
    data.forEach((row) => {
      if (row.status === PaymentStatus.COMPLETED) {
        report.totalAmount += row.amount;
        report.byType[row.type].amount += row.amount;
        report.byType[row.type].count += 1;
        report.byStatus[row.status].amount += row.amount;
        report.byStatus[row.status].count += 1;
        if (row.method) {
          report.byMethod[row.method].amount += row.amount;
          report.byMethod[row.method].count += 1;
        }
      }
    });

    return report;
  } catch (error) {
    console.error('Error in getRevenueReport:', error);
    return null;
  }
}

/**
 * Get pending payments that have expired
 * These should be automatically cancelled/cleaned up
 */
export async function getExpiredPendingPayments(): Promise<PaymentIntent[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('status', PaymentStatus.PENDING)
      .lt('expires_at', new Date().toISOString())
      .order('expires_at', { ascending: true });

    if (error) {
      console.error('Error fetching expired payments:', error);
      return [];
    }

    return data.map(mapPaymentRow).filter((p): p is PaymentIntent => p !== null);
  } catch (error) {
    console.error('Error in getExpiredPendingPayments:', error);
    return [];
  }
}

/**
 * Get a single payment by ID
 */
export async function getPaymentById(paymentId: string): Promise<PaymentIntent | null> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (error) {
      console.error('Error fetching payment:', error);
      return null;
    }

    return mapPaymentRow(data);
  } catch (error) {
    console.error('Error in getPaymentById:', error);
    return null;
  }
}

/**
 * Helper function to map database row to PaymentIntent
 */
function mapPaymentRow(row: any): PaymentIntent | null {
  if (!row) return null;

  return {
    id: row.id,
    userId: row.user_id,
    type: row.type as PaymentType,
    amount: row.amount,
    currency: row.currency,
    status: row.status as PaymentStatus,
    listingId: row.listing_id,
    description: row.description,
    paymentReference: row.payment_reference,
    method: row.method as PaymentMethod,
    createdAt: row.created_at,
    completedAt: row.completed_at,
    refundedAt: row.refunded_at,
    expiresAt: row.expires_at,
  };
}
