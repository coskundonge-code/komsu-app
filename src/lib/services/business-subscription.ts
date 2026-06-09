/**
 * İşletme Abonelik Sistemi
 * Tek plan: 99₺/ay veya 990₺/yıl (12 ay peşin)
 * İlk 3 ay ücretsiz deneme - kredi kartı gerekmez
 * Süre dolunca sayfa blur/kilitlenir, ilan çıkılamaz
 */

import { createClient } from '@/lib/supabase/client';
import { BUSINESS_MEMBERSHIP } from '@/lib/pricing';

// Sabitler — TEK DOĞRULUK KAYNAĞI pricing.ts (BUSINESS_MEMBERSHIP). Buraya
// elle fiyat yazma; ödeme tarafıyla (/api/payment, callback) çelişmesin diye
// fiyat tek yerden türetilir.
export const MONTHLY_PRICE = BUSINESS_MEMBERSHIP.monthlyFee; // 99 TL/ay
export const YEARLY_PRICE = BUSINESS_MEMBERSHIP.yearlyFee; // 990 TL/yıl (12 ay peşin)
export const FREE_TRIAL_MONTHS = 3; // Ücretsiz deneme süresi
export const CURRENCY = 'TRY';

export type BillingPeriod = 'monthly' | 'yearly';
export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'cancelled';

export interface BusinessSubscription {
  id: string;
  businessId: string;
  status: SubscriptionStatus;
  billingPeriod: BillingPeriod | null; // null during trial
  trialStartDate: string;
  trialEndDate: string;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  currentPrice: number;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionCheckResult {
  isActive: boolean; // true if trial or active paid
  status: SubscriptionStatus;
  isTrialPeriod: boolean;
  trialDaysRemaining: number;
  trialEndDate: string | null;
  canPostListings: boolean;
  shouldBlur: boolean; // true if expired - page should be blurred/locked
  subscription?: BusinessSubscription;
}

export interface PricingInfo {
  monthlyPrice: number;
  yearlyPrice: number;
  yearlySavings: number;
  freeTrialMonths: number;
  currency: string;
}

/**
 * Fiyat bilgilerini döndürür
 */
export function getPricingInfo(): PricingInfo {
  const yearlySavings = (MONTHLY_PRICE * 12) - YEARLY_PRICE;
  return {
    monthlyPrice: MONTHLY_PRICE,
    yearlyPrice: YEARLY_PRICE,
    yearlySavings,
    freeTrialMonths: FREE_TRIAL_MONTHS,
    currency: CURRENCY,
  };
}

/**
 * Yeni işletme oluştururken ücretsiz deneme başlatır
 * Kredi kartı gerekmez
 */
export async function startFreeTrial(businessId: string): Promise<BusinessSubscription | null> {
  try {
    const supabase = createClient();
    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setMonth(trialEnd.getMonth() + FREE_TRIAL_MONTHS);

    const { data, error } = await supabase
      .from('business_subscriptions')
      .insert({
        business_id: businessId,
        status: 'trial',
        billing_period: null,
        trial_start_date: now.toISOString(),
        trial_end_date: trialEnd.toISOString(),
        subscription_start_date: null,
        subscription_end_date: null,
        current_price: 0,
        auto_renew: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error starting free trial:', error);
      return null;
    }

    return mapSubscription(data);
  } catch (error) {
    console.error('Error in startFreeTrial:', error);
    return null;
  }
}

/**
 * İşletmenin abonelik durumunu kontrol eder
 * Bu fonksiyon sayfa görüntüleme ve ilan paylaşma öncesi çağrılmalı
 */
export async function checkSubscriptionStatus(businessId: string): Promise<SubscriptionCheckResult> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('business_subscriptions')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking subscription:', error);
      return getExpiredResult();
    }

    if (!data) {
      return getExpiredResult();
    }

    const subscription = mapSubscription(data);
    const now = new Date();

    // Deneme süresinde mi?
    if (subscription.status === 'trial') {
      const trialEnd = new Date(subscription.trialEndDate);
      if (now < trialEnd) {
        const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return {
          isActive: true,
          status: 'trial',
          isTrialPeriod: true,
          trialDaysRemaining: daysRemaining,
          trialEndDate: subscription.trialEndDate,
          canPostListings: true,
          shouldBlur: false,
          subscription,
        };
      } else {
        // Deneme süresi dolmuş
        await updateSubscriptionStatus(subscription.id, 'expired');
        return {
          isActive: false,
          status: 'expired',
          isTrialPeriod: false,
          trialDaysRemaining: 0,
          trialEndDate: subscription.trialEndDate,
          canPostListings: false,
          shouldBlur: true,
          subscription,
        };
      }
    }

    // Aktif abonelik mi?
    if (subscription.status === 'active' && subscription.subscriptionEndDate) {
      const subEnd = new Date(subscription.subscriptionEndDate);
      if (now < subEnd) {
        return {
          isActive: true,
          status: 'active',
          isTrialPeriod: false,
          trialDaysRemaining: 0,
          trialEndDate: null,
          canPostListings: true,
          shouldBlur: false,
          subscription,
        };
      } else {
        // Abonelik süresi dolmuş
        await updateSubscriptionStatus(subscription.id, 'expired');
        return {
          isActive: false,
          status: 'expired',
          isTrialPeriod: false,
          trialDaysRemaining: 0,
          trialEndDate: null,
          canPostListings: false,
          shouldBlur: true,
          subscription,
        };
      }
    }

    // İptal edilmiş veya süresi dolmuş
    return {
      isActive: false,
      status: subscription.status,
      isTrialPeriod: false,
      trialDaysRemaining: 0,
      trialEndDate: null,
      canPostListings: false,
      shouldBlur: true,
      subscription,
    };
  } catch (error) {
    console.error('Error in checkSubscriptionStatus:', error);
    return getExpiredResult();
  }
}

/**
 * Abonelik durumunu günceller
 */
async function updateSubscriptionStatus(subscriptionId: string, status: SubscriptionStatus): Promise<void> {
  try {
    const supabase = createClient();
    await supabase
      .from('business_subscriptions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', subscriptionId);
  } catch (error) {
    console.error('Error updating subscription status:', error);
  }
}

/**
 * Ücretli abonelik başlatır (deneme süresi sonrası).
 *
 * GÜVENLİK: Aktivasyon ARTIK istemciden doğrudan yapılamaz. DB'deki
 * guard_business_subscription_privileged trigger'ı istemcinin status='active'
 * ve ödeme alanlarını yazmasını engeller (ödeme yapmadan kendini aktive etme
 * açığı kapandı). Bu fonksiyon sunucu ucuna yönlendirir; orada oturum, sahiplik
 * ve ödeme/simülasyon kapısı doğrulanıp aktivasyon service_role ile yazılır.
 * `businessId` sunucuda session'dan türetilir (istemci değerine güvenilmez).
 */
export async function activateSubscription(
  _businessId: string,
  billingPeriod: BillingPeriod
): Promise<BusinessSubscription | null> {
  try {
    const res = await fetch('/api/business/subscription/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ billingPeriod }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.success || !json?.subscription) {
      console.error('Error activating subscription:', json?.error || res.status);
      return null;
    }
    return mapSubscription(json.subscription);
  } catch (error) {
    console.error('Error in activateSubscription:', error);
    return null;
  }
}

/**
 * Aboneliği iptal eder
 */
export async function cancelSubscription(businessId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('business_subscriptions')
      .update({
        status: 'cancelled',
        auto_renew: false,
        updated_at: new Date().toISOString(),
      })
      .eq('business_id', businessId);

    if (error) {
      console.error('Error cancelling subscription:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in cancelSubscription:', error);
    return false;
  }
}

// Helper: DB row → TypeScript interface
function mapSubscription(row: any): BusinessSubscription {
  return {
    id: row.id,
    businessId: row.business_id,
    status: row.status,
    billingPeriod: row.billing_period,
    trialStartDate: row.trial_start_date,
    trialEndDate: row.trial_end_date,
    subscriptionStartDate: row.subscription_start_date,
    subscriptionEndDate: row.subscription_end_date,
    currentPrice: row.current_price || 0,
    autoRenew: row.auto_renew || false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Helper: Expired default result
function getExpiredResult(): SubscriptionCheckResult {
  return {
    isActive: false,
    status: 'expired',
    isTrialPeriod: false,
    trialDaysRemaining: 0,
    trialEndDate: null,
    canPostListings: false,
    shouldBlur: true,
  };
}

// Legacy exports for backward compatibility
export type PackageType = 'temel' | 'profesyonel' | 'premium';
export interface BusinessPackage {
  id: PackageType;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyDiscount: number;
  maxPhotos: number;
  features: { id: string; name: string; included: boolean }[];
  popular?: boolean;
}
export const BUSINESS_PACKAGES: Record<PackageType, BusinessPackage> = {
  temel: { id: 'temel', name: 'Temel', description: '', monthlyPrice: MONTHLY_PRICE, yearlyPrice: YEARLY_PRICE, yearlyDiscount: 0, maxPhotos: 999, features: [], popular: false },
  profesyonel: { id: 'profesyonel', name: 'Profesyonel', description: '', monthlyPrice: MONTHLY_PRICE, yearlyPrice: YEARLY_PRICE, yearlyDiscount: 0, maxPhotos: 999, features: [], popular: true },
  premium: { id: 'premium', name: 'Premium', description: '', monthlyPrice: MONTHLY_PRICE, yearlyPrice: YEARLY_PRICE, yearlyDiscount: 0, maxPhotos: 999, features: [], popular: false },
};
