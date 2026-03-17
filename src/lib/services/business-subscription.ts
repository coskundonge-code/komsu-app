// @ts-nocheck
// İşletme Abonelik Sistemi

export type PackageType = 'temel' | 'profesyonel' | 'premium';
export type BillingPeriod = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'expired' | 'trial' | 'cancelled' | 'pending';

export interface Feature {
  id: string;
  name: string;
  included: boolean;
}

export interface BusinessPackage {
  id: PackageType;
  name: string;
  description: string;
  monthlyPrice: number; // TL cinsinden
  yearlyPrice: number; // TL cinsinden
  yearlyDiscount: number; // % olarak
  maxPhotos: number;
  features: Feature[];
  popular?: boolean;
}

export interface Subscription {
  id: string;
  businessId: string;
  packageId: PackageType;
  status: SubscriptionStatus;
  billingPeriod: BillingPeriod;
  currentPrice: number;
  startDate: Date;
  endDate: Date;
  renewalDate?: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
  paymentMethodId?: string;
}

export interface SubscriptionHistoryEntry {
  id: string;
  subscriptionId: string;
  action: 'created' | 'renewed' | 'upgraded' | 'downgraded' | 'cancelled';
  fromPackage?: PackageType;
  toPackage?: PackageType;
  amount: number;
  timestamp: Date;
}

export const BUSINESS_PACKAGES: Record<PackageType, BusinessPackage> = {
  temel: {
    id: 'temel',
    name: 'Temel',
    description: 'Yeni işletmeler için ideal',
    monthlyPrice: 299,
    yearlyPrice: 3588, // 299 * 12 * 0.8 (20% indirim)
    yearlyDiscount: 20,
    maxPhotos: 5,
    features: [
      { id: 'profile', name: 'Temel profil', included: true },
      { id: 'photos', name: 'En fazla 5 fotoğraf', included: true },
      { id: 'category', name: 'Kategori listeleme', included: true },
      { id: 'reviews', name: 'Yorum sistemi', included: true },
      { id: 'badge', name: 'Premium rozet', included: false },
      { id: 'analytics', name: 'Analitik', included: false },
      { id: 'campaigns', name: 'Kampanya oluşturma', included: false },
      { id: 'priority', name: 'Öncelikli destek', included: false },
      { id: 'ads', name: 'Reklam kredisi', included: false },
    ],
  },
  profesyonel: {
    id: 'profesyonel',
    name: 'Profesyonel',
    description: 'Büyüyen işletmeler için',
    monthlyPrice: 599,
    yearlyPrice: 7190, // 599 * 12 * 0.8 (20% indirim)
    yearlyDiscount: 20,
    maxPhotos: 20,
    popular: true,
    features: [
      { id: 'profile', name: 'Öne çıkan profil', included: true },
      { id: 'photos', name: 'En fazla 20 fotoğraf', included: true },
      { id: 'category', name: 'Kategori listeleme', included: true },
      { id: 'reviews', name: 'Yorum sistemi', included: true },
      { id: 'badge', name: 'Premium rozet', included: false },
      { id: 'analytics', name: 'Temel analitik', included: true },
      { id: 'campaigns', name: 'Kampanya oluşturma', included: true },
      { id: 'priority', name: 'Öncelikli destek', included: false },
      { id: 'ads', name: 'Reklam kredisi', included: false },
    ],
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    description: 'Kurumlararası işletmeler için',
    monthlyPrice: 999,
    yearlyPrice: 11990, // 999 * 12 * 0.8 (20% indirim)
    yearlyDiscount: 20,
    maxPhotos: 999, // Sınırsız
    features: [
      { id: 'profile', name: 'Premium profil (öne çıkan)', included: true },
      { id: 'photos', name: 'Sınırsız fotoğraf', included: true },
      { id: 'category', name: 'Kategori listeleme', included: true },
      { id: 'reviews', name: 'Yorum sistemi', included: true },
      { id: 'badge', name: 'Premium rozet', included: true },
      { id: 'analytics', name: 'Gelişmiş analitik', included: true },
      { id: 'campaigns', name: 'Kampanya oluşturma', included: true },
      { id: 'priority', name: 'Öncelikli 24/7 destek', included: true },
      { id: 'ads', name: 'Aylık reklam kredisi', included: true },
    ],
  },
};

/**
 * Tüm paket bilgilerini döndürür
 * @returns Paket listesi
 */
export function getAvailablePackages(): BusinessPackage[] {
  return Object.values(BUSINESS_PACKAGES);
}

/**
 * Belirli bir paketi ID ile alır
 * @param packageId - Paket ID'si
 * @returns Paket bilgileri
 */
export function getPackageById(packageId: PackageType): BusinessPackage {
  return BUSINESS_PACKAGES[packageId];
}

/**
 * Yeni abonelik oluşturur
 * @param businessId - İşletme ID'si
 * @param packageId - Paket ID'si
 * @param billingPeriod - Faturalama dönemi (aylık/yıllık)
 * @returns Yeni abonelik
 */
export async function createSubscription(
  businessId: string,
  packageId: PackageType,
  billingPeriod: BillingPeriod = 'monthly'
): Promise<Subscription> {
  const pkg = getPackageById(packageId);
  const now = new Date();

  // Fiyat hesapla
  const currentPrice = billingPeriod === 'monthly' ? pkg.monthlyPrice : pkg.yearlyPrice;

  // Bitiş tarihi hesapla
  const endDate = new Date(now);
  if (billingPeriod === 'monthly') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  const subscription: Subscription = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    businessId,
    packageId,
    status: 'pending', // Ödeme sonrası 'active' olacak
    billingPeriod,
    currentPrice,
    startDate: now,
    endDate,
    autoRenew: true,
    createdAt: now,
    updatedAt: now,
  };

  // TODO: Veritabanına kaydet
  console.log('Abonelik oluşturuldu:', subscription);

  return subscription;
}

/**
 * Aboneliği iptal eder
 * @param subscriptionId - Abonelik ID'si
 * @returns İptal sonucu
 */
export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  // TODO: Veritabanında abonelik durumunu 'cancelled' olarak güncelle
  console.log('Abonelik iptal edildi:', subscriptionId);

  return true;
}

/**
 * Abone yükseltme işlemi
 * @param subscriptionId - Abonelik ID'si
 * @param newPackageId - Yeni paket ID'si
 * @returns Güncellenmiş abonelik
 */
export async function upgradeSubscription(
  subscriptionId: string,
  newPackageId: PackageType
): Promise<Subscription | null> {
  // TODO: Mevcut aboneliği getir
  // TODO: Yeni paket fiyatı ile ödeme yap
  // TODO: Aboneliği güncelle
  console.log('Abonelik yükseltildi:', { subscriptionId, newPackageId });

  return null;
}

/**
 * İşletmenin abonelik durumunu kontrol eder
 * @param businessId - İşletme ID'si
 * @returns Abonelik durumu ve bilgileri
 */
export async function checkSubscriptionStatus(
  businessId: string
): Promise<{ status: SubscriptionStatus; subscription?: Subscription }> {
  // TODO: Veritabanından abonelik bilgilerini getir
  const now = new Date();

  // Mock veri - gerçek uygulamada veritabanından gelir
  const mockSubscription: Subscription = {
    id: `sub_mock_${businessId}`,
    businessId,
    packageId: 'profesyonel',
    status: 'active',
    billingPeriod: 'monthly',
    currentPrice: 599,
    startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
    autoRenew: true,
    createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: now,
  };

  if (mockSubscription.endDate < now) {
    return { status: 'expired', subscription: mockSubscription };
  }

  return { status: 'active', subscription: mockSubscription };
}

/**
 * Abonelik geçmişini alır
 * @param subscriptionId - Abonelik ID'si
 * @returns Geçmiş kayıtları
 */
export async function getSubscriptionHistory(
  subscriptionId: string
): Promise<SubscriptionHistoryEntry[]> {
  // TODO: Veritabanından geçmiş kayıtlarını getir
  console.log('Abonelik geçmişi getiriliyor:', subscriptionId);

  return [];
}

/**
 * Belirli bir paketteki maximum fotoğraf sayısını alır
 * @param packageId - Paket ID'si
 * @returns Maximum fotoğraf sayısı
 */
export function getMaxPhotosForPackage(packageId: PackageType): number {
  return getPackageById(packageId).maxPhotos;
}

/**
 * Paketi yenileme tarihini hesaplar
 * @param startDate - Başlangıç tarihi
 * @param billingPeriod - Faturalama dönemi
 * @returns Yenileme tarihi
 */
export function calculateRenewalDate(startDate: Date, billingPeriod: BillingPeriod): Date {
  const renewalDate = new Date(startDate);

  if (billingPeriod === 'monthly') {
    renewalDate.setMonth(renewalDate.getMonth() + 1);
  } else {
    renewalDate.setFullYear(renewalDate.getFullYear() + 1);
  }

  return renewalDate;
}

/**
 * Yıllık fiyat indirimini hesaplar
 * @param monthlyPrice - Aylık fiyat
 * @param discount - İndirim yüzdesi
 * @returns Yıllık fiyat
 */
export function calculateYearlyPrice(monthlyPrice: number, discount: number): number {
  return Math.round(monthlyPrice * 12 * (1 - discount / 100));
}
