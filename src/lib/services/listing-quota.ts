/**
 * Listing Quota Service
 * Manages user's free listing allowance (3 per year)
 * Tracks usage and determines if additional paid listings are needed
 */

import { createClient } from '@/lib/supabase/client';

// Constants
export const FREE_LISTING_LIMIT = 1; // Her kullanıcıya yılda 1 ücretsiz Satılık/Kiralık ilan hakkı
export const LISTING_FEE = 9.90; // TRY - Ücretsiz hak bittikten sonra ilan başına ücret
export const CURRENCY = 'TRY';
// Not: Ücretsiz kota sadece 'sale' ve 'rental' ilan türleri için geçerlidir.
// 'free' ve 'lend' türündeki ilanlar her zaman ücretsizdir.

export interface UserQuota {
  userId: string;
  year: number;
  freeUsed: number;
  freeLimit: number;
  canPostFree: boolean;
  resetDate?: string | null;
}

export interface QuotaCheckResult {
  canPostFree: boolean;
  freeUsed: number;
  freeLimit: number;
  remainingFree: number;
  year: number;
}

/**
 * Get user's current listing quota
 */
export async function getUserQuota(userId: string): Promise<UserQuota | null> {
  try {
    const supabase = createClient();
    const currentYear = new Date().getFullYear();

    const { data, error } = await supabase
      .from('user_listing_quotas')
      .select('*')
      .eq('user_id', userId)
      .eq('year', currentYear)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching quota:', error);
      return null;
    }

    // Kota satırı yoksa kullanıcı henüz hiç ücretsiz hak kullanmamış demektir.
    // Satır artık YALNIZCA sunucu tarafı RPC ile (ilk tüketimde) oluşturulur;
    // istemci kota satırı ekleyemez (ulq_insert_own politikası kaldırıldı).
    if (!data) {
      return {
        userId,
        year: currentYear,
        freeUsed: 0,
        freeLimit: FREE_LISTING_LIMIT,
        canPostFree: true,
        resetDate: null,
      };
    }

    return {
      userId: data.user_id,
      year: data.year,
      freeUsed: data.free_used || 0,
      freeLimit: FREE_LISTING_LIMIT,
      canPostFree: (data.free_used || 0) < FREE_LISTING_LIMIT,
      resetDate: data.reset_date,
    };
  } catch (error) {
    console.error('Error in getUserQuota:', error);
    return null;
  }
}

/**
 * Consume one free listing from user's quota
 * Returns the updated quota or null if quota is exhausted
 */
export async function consumeFreeQuota(userId: string): Promise<UserQuota | null> {
  try {
    const supabase = createClient();
    const currentYear = new Date().getFullYear();

    // Tüketim SUNUCU tarafında atomik yapılır: kontrol (limit < 1) + artırma tek
    // işlemde. İstemci free_used'ı doğrudan yazamaz (ulq_update_own kaldırıldı);
    // yalnızca bu SECURITY DEFINER RPC artırabilir → kota oynaması (self-reset) kapandı.
    const { data, error } = await (supabase.rpc as any)('consume_free_listing_quota');

    if (error) {
      console.error('Error consuming quota:', error);
      return null;
    }

    const row = Array.isArray(data) ? data[0] : data;
    if (!row || row.ok !== true) {
      console.warn('User has no free listings remaining');
      return null;
    }

    return {
      userId,
      year: row.yr ?? currentYear,
      freeUsed: row.used,
      freeLimit: FREE_LISTING_LIMIT,
      canPostFree: row.used < FREE_LISTING_LIMIT,
      resetDate: row.reset_at ?? null,
    };
  } catch (error) {
    console.error('Error in consumeFreeQuota:', error);
    return null;
  }
}

/**
 * Check if user can post a free listing
 * @param listingType - 'sale' | 'rental' | 'free' | 'lend'
 * For 'free' and 'lend' types, quota is not consumed (always free to post)
 * For 'sale' and 'rental' types, user gets 1 free per year then pays 9.90 TL
 */
export async function checkCanPost(userId: string, listingType?: string): Promise<QuotaCheckResult | null> {
  try {
    // 'free' and 'lend' type listings are always free to post - no quota consumed
    if (listingType === 'free' || listingType === 'lend') {
      return {
        canPostFree: true,
        freeUsed: 0,
        freeLimit: FREE_LISTING_LIMIT,
        remainingFree: FREE_LISTING_LIMIT,
        year: new Date().getFullYear(),
      };
    }

    const quota = await getUserQuota(userId);
    if (!quota) return null;

    return {
      canPostFree: quota.canPostFree,
      freeUsed: quota.freeUsed,
      freeLimit: quota.freeLimit,
      remainingFree: Math.max(0, quota.freeLimit - quota.freeUsed),
      year: quota.year,
    };
  } catch (error) {
    console.error('Error in checkCanPost:', error);
    return null;
  }
}

/**
 * Reset all yearly quotas at the start of a new year
 * This should be run as a scheduled task/cron job
 */
export async function resetYearlyQuotas(): Promise<{ updated: number; error?: string }> {
  try {
    const supabase = createClient();
    const currentYear = new Date().getFullYear();
    const nextResetDate = new Date(currentYear + 1, 0, 1).toISOString();

    const { data, error } = await supabase
      .from('user_listing_quotas')
      .update({
        free_used: 0,
        year: currentYear,
        reset_date: nextResetDate,
      })
      .eq('year', currentYear - 1)
      .select();

    if (error) {
      console.error('Error resetting quotas:', error);
      return { updated: 0, error: error.message };
    }

    return { updated: data?.length || 0 };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in resetYearlyQuotas:', error);
    return { updated: 0, error: errorMessage };
  }
}

/**
 * Get quota statistics for a user across multiple years
 */
export async function getUserQuotaHistory(userId: string): Promise<UserQuota[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('user_listing_quotas')
      .select('*')
      .eq('user_id', userId)
      .order('year', { ascending: false });

    if (error) {
      console.error('Error fetching quota history:', error);
      return [];
    }

    return data.map((item) => ({
      userId: item.user_id,
      year: item.year,
      freeUsed: item.free_used || 0,
      freeLimit: FREE_LISTING_LIMIT,
      canPostFree: (item.free_used || 0) < FREE_LISTING_LIMIT,
      resetDate: item.reset_date,
    }));
  } catch (error) {
    console.error('Error in getUserQuotaHistory:', error);
    return [];
  }
}
