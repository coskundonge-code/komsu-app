// @ts-nocheck
// Geliştirilmiş Yorum Sistemi - Sahte Yorum Koruma

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'flagged';
export type FlagReason =
  | 'sahte'
  | 'uygunsuz'
  | 'spam'
  | 'cikarcatismasi'
  | 'diger';

export interface ReviewData {
  id: string;
  userId: string;
  businessId: string;
  rating: number; // 1-5
  title: string;
  content: string;
  imageUrls?: string[];
  status: ReviewStatus;
  qualityScore: number; // 0-100
  helpfulCount: number;
  reportCount: number;
  createdAt: Date;
  updatedAt: Date;
  isVerifiedUser: boolean;
  userAccountAge: number; // gün cinsinden
  ipAddress?: string;
  deviceFingerprint?: string;
}

export interface ReviewFlag {
  id: string;
  reviewId: string;
  reporterUserId: string;
  reason: FlagReason;
  description?: string;
  status: 'pending' | 'resolved';
  createdAt: Date;
  resolvedAt?: Date;
  moderatorId?: string;
  moderatorNote?: string;
}

export interface BusinessRating {
  businessId: string;
  averageRating: number;
  totalReviews: number;
  verifiedReviews: number;
  ratingDistribution: {
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };
  lastUpdated: Date;
}

export interface FakeReviewDetection {
  isSuspicious: boolean;
  score: number; // 0-100, yüksek = sahte olma ihtimali yüksek
  reasons: string[];
}

export interface ReviewFilters {
  rating?: number;
  verifiedOnly?: boolean;
  withPhotos?: boolean;
  sortBy?: 'newest' | 'highest' | 'lowest' | 'helpful';
  page?: number;
  limit?: number;
}

/**
 * Kullanıcının bir işletme hakkında yorum yapabilip yapamayacağını kontrol eder
 * @param userId - Kullanıcı ID'si
 * @param businessId - İşletme ID'si
 * @returns Yorum yapabilir mi
 */
export async function canUserReview(
  userId: string,
  businessId: string
): Promise<{ canReview: boolean; reason?: string }> {
  // TODO: Veritabanında kontroller yap

  // 1. Kullanıcı "Onaylanmış Komşu" mu?
  // const isVerified = await checkIfUserVerified(userId);
  // if (!isVerified) {
  //   return { canReview: false, reason: 'Sadece onaylanmış komşular yorum yapabilirler' };
  // }

  // 2. Kullanıcı bu işletme hakkında daha önce yorum yapmış mı?
  // const hasReviewed = await checkIfUserReviewedBusiness(userId, businessId);
  // if (hasReviewed) {
  //   return { canReview: false, reason: 'Bu işletme için zaten bir yorum yaptınız' };
  // }

  // 3. Kullanıcı bu işletmenin sahibi mi?
  // const isOwner = await checkIfUserOwnsBusinesss(userId, businessId);
  // if (isOwner) {
  //   return { canReview: false, reason: 'Kendi işletmeniz hakkında yorum yapamazsınız' };
  // }

  // 4. Hesap 7 günden eski mi?
  // const accountAge = await getUserAccountAge(userId);
  // if (accountAge < 7) {
  //   return { canReview: false, reason: 'Hesabınız 7 günden daha yeni, lütfen bekleyin' };
  // }

  // Mock: Her kullanıcı yapabilir
  return { canReview: true };
}

/**
 * Yeni yorum ekler (sahte yorum kontrolü ile)
 * @param userId - Kullanıcı ID'si
 * @param businessId - İşletme ID'si
 * @param rating - Yıldız puanı (1-5)
 * @param title - Yorum başlığı
 * @param content - Yorum metni
 * @param imageUrls - Fotoğraf URL'leri (opsiyonel)
 * @returns Oluşturulan yorum veya hata
 */
export async function submitReview(
  userId: string,
  businessId: string,
  rating: number,
  title: string,
  content: string,
  imageUrls?: string[]
): Promise<{ success: boolean; review?: ReviewData; error?: string }> {
  // Temel doğrulamalar
  if (rating < 1 || rating > 5) {
    return { success: false, error: 'Puan 1-5 arasında olmalıdır' };
  }

  if (!title || title.trim().length === 0) {
    return { success: false, error: 'Yorum başlığı gereklidir' };
  }

  if (content.length < 50) {
    return { success: false, error: 'Yorum en az 50 karakter olmalıdır' };
  }

  // Kullanıcı yorum yapabilir mi?
  const { canReview, reason } = await canUserReview(userId, businessId);
  if (!canReview) {
    return { success: false, error: reason };
  }

  // Sahte yorum kontrolü
  const reviewData = {
    userId,
    businessId,
    rating,
    title,
    content,
    imageUrls,
  };

  const fakeCheck = await detectFakeReview(reviewData as any);
  const initialStatus: ReviewStatus = fakeCheck.score > 70 ? 'flagged' : 'pending';

  const now = new Date();
  const review: ReviewData = {
    id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    businessId,
    rating,
    title,
    content,
    imageUrls: imageUrls || [],
    status: initialStatus,
    qualityScore: calculateReviewQuality(title, content, imageUrls),
    helpfulCount: 0,
    reportCount: 0,
    createdAt: now,
    updatedAt: now,
    isVerifiedUser: true, // TODO: Gerçek doğrulama
    userAccountAge: 30, // TODO: Gerçek hesap yaşını bul
  };

  // TODO: Veritabanına kaydet
  console.log('Yorum gönderildi:', review);

  // İşletmenin ortalamasını güncelle
  await calculateBusinessRating(businessId);

  return { success: true, review };
}

/**
 * Yorumu işaretler (sahte/uygunsuz olarak raporla)
 * @param reviewId - Yorum ID'si
 * @param reporterUserId - Rapor yapan kullanıcı ID'si
 * @param reason - Rapor nedeni
 * @param description - Detaylı açıklama (opsiyonel)
 * @returns İşaretleme sonucu
 */
export async function flagReview(
  reviewId: string,
  reporterUserId: string,
  reason: FlagReason,
  description?: string
): Promise<{ success: boolean; flag?: ReviewFlag; error?: string }> {
  if (!reason) {
    return { success: false, error: 'Rapor nedeni gereklidir' };
  }

  const now = new Date();
  const flag: ReviewFlag = {
    id: `flag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    reviewId,
    reporterUserId,
    reason,
    description,
    status: 'pending',
    createdAt: now,
  };

  // TODO: Veritabanına kaydet
  console.log('Yorum işaretlendi:', flag);

  // Yorumun report sayısını güncelle
  // TODO: reviewId'nin reportCount'ını +1 yap

  return { success: true, flag };
}

/**
 * Yorumu moderatör olarak onaylar/reddeder
 * @param reviewId - Yorum ID'si
 * @param moderatorId - Moderatör ID'si
 * @param action - İşlem (approve/reject)
 * @param note - Moderatör notu (opsiyonel)
 * @returns İşlem sonucu
 */
export async function moderateReview(
  reviewId: string,
  moderatorId: string,
  action: 'approve' | 'reject',
  note?: string
): Promise<{ success: boolean; error?: string }> {
  const newStatus: ReviewStatus = action === 'approve' ? 'approved' : 'rejected';

  // TODO: Veritabanında yorumun status'unu güncelle
  console.log('Yorum modere edildi:', {
    reviewId,
    moderatorId,
    action,
    note,
    newStatus,
    timestamp: new Date(),
  });

  return { success: true };
}

/**
 * İşletmenin ortalama puanını ve dağılımını hesaplar
 * @param businessId - İşletme ID'si
 * @returns İşletme puanı bilgileri
 */
export async function calculateBusinessRating(businessId: string): Promise<BusinessRating> {
  // TODO: Veritabanından onaylı yorumları getir

  // Mock veri
  const rating: BusinessRating = {
    businessId,
    averageRating: 4.5,
    totalReviews: 42,
    verifiedReviews: 35,
    ratingDistribution: {
      '5': 20,
      '4': 15,
      '3': 5,
      '2': 1,
      '1': 1,
    },
    lastUpdated: new Date(),
  };

  // Onaylı komşuların yorumlarına 1.5x ağırlık ver
  // const weightedAverage = ...

  // TODO: Veritabanında güncelle

  return rating;
}

/**
 * Sahte yorum olup olmadığını algılar
 * @param reviewData - Yorum verileri
 * @returns Sahte yorum algılama sonucu
 */
export async function detectFakeReview(reviewData: any): Promise<FakeReviewDetection> {
  const reasons: string[] = [];
  let suspiciousScore = 0;

  // 1. Çok kısa yorum metni (50 karakterden az)
  if (reviewData.content.length < 50) {
    reasons.push('Yorum metni çok kısa');
    suspiciousScore += 15;
  }

  // 2. Sadece 5 yıldız (yeni hesaplar için)
  if (reviewData.rating === 5 && reviewData.userAccountAge < 7) {
    reasons.push('Yeni hesaptan 5 yıldız');
    suspiciousScore += 20;
  }

  // 3. Çok kısa başlık
  if (reviewData.title.length < 5) {
    reasons.push('Başlık çok kısa');
    suspiciousScore += 10;
  }

  // 4. Spam benzeri içerik (bağlantılar, telefon numaraları)
  if (detectSpamContent(reviewData.content)) {
    reasons.push('Spam şüphesi (bağlantı veya telefon)');
    suspiciousScore += 25;
  }

  // 5. Aynı IP adresinden çok fazla yorum (TODO: IP kontrolü)
  // if (await checkDuplicateIP(reviewData.ipAddress)) {
  //   reasons.push('Aynı IP adresinden birden fazla yorum');
  //   suspiciousScore += 30;
  // }

  // 6. Yazım hatası olmayan mükemmel yazı (bot şüphesi)
  const hasTypos = detectTypos(reviewData.content);
  if (!hasTypos) {
    suspiciousScore += 5;
  }

  // 7. Başlık ve içerik uyumsuz
  if (!contentCoherence(reviewData.title, reviewData.content)) {
    reasons.push('Başlık ve içerik uyumsuz');
    suspiciousScore += 15;
  }

  // 8. Hiç fotoğraf yok (bazı durumlarda şüpheli)
  if (!reviewData.imageUrls || reviewData.imageUrls.length === 0) {
    suspiciousScore += 5;
  }

  // Sınırı sınırla
  suspiciousScore = Math.min(100, suspiciousScore);

  return {
    isSuspicious: suspiciousScore > 50,
    score: suspiciousScore,
    reasons: reasons.length > 0 ? reasons : [],
  };
}

/**
 * Yorum kalitesini puanlandırır (0-100)
 * @param title - Başlık
 * @param content - İçerik
 * @param imageUrls - Fotoğraf URL'leri
 * @returns Kalite puanı
 */
export function calculateReviewQuality(
  title: string,
  content: string,
  imageUrls?: string[]
): number {
  let score = 30; // Temel puan

  // Başlık kalitesi
  if (title.length >= 10) score += 15;
  if (title.length >= 20) score += 10;

  // İçerik kalitesi
  if (content.length >= 100) score += 15;
  if (content.length >= 200) score += 10;
  if (content.length >= 300) score += 5;

  // Fotoğraf
  if (imageUrls && imageUrls.length > 0) {
    score += 10;
    if (imageUrls.length >= 2) score += 5;
  }

  return Math.min(100, score);
}

/**
 * Yorum listesini alır (filtreleme ve sıralama ile)
 * @param businessId - İşletme ID'si
 * @param filters - Filtre seçenekleri
 * @returns Yorum listesi
 */
export async function getReviewsForBusiness(
  businessId: string,
  filters?: ReviewFilters
): Promise<ReviewData[]> {
  // TODO: Veritabanından yorumları getir

  // Filtreleme ve sıralama

  // Mock veri
  const reviews: ReviewData[] = [
    {
      id: 'review_1',
      userId: 'user_1',
      businessId,
      rating: 5,
      title: 'Harika hizmet!',
      content:
        'Çok iyi bir deneyim yaşadım. Personel çok ilgili ve ürün kalitesi harika. Kesinlikle tekrar geleceğim!',
      imageUrls: ['image1.jpg', 'image2.jpg'],
      status: 'approved',
      qualityScore: 85,
      helpfulCount: 24,
      reportCount: 0,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      isVerifiedUser: true,
      userAccountAge: 180,
    },
    {
      id: 'review_2',
      userId: 'user_2',
      businessId,
      rating: 4,
      title: 'İyi fiyat ve kalite',
      content:
        'Fiyatı uygun ve hizmet kalitesi de iyi. Sadece bekçi süresi biraz uzun olabilir ama genel olarak memnunum.',
      status: 'approved',
      qualityScore: 72,
      helpfulCount: 12,
      reportCount: 0,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      isVerifiedUser: true,
      userAccountAge: 120,
    },
  ];

  return reviews;
}

/**
 * Spam içeriğini algılar
 * @param content - İçerik
 * @returns Spam mi?
 */
function detectSpamContent(content: string): boolean {
  const spamPatterns =
    /(\+90\d{10}|http[s]?:\/\/|www\.|@|#.*\d+|whatsapp|telegram)/gi;
  return spamPatterns.test(content);
}

/**
 * Yazım hatası algılar
 * @param content - İçerik
 * @returns Yazım hatası var mı?
 */
function detectTypos(content: string): boolean {
  // Basit kontrol: Türkçe yazı
  const turkishLetter = /[çğıöşüÇĞİÖŞÜ]/;
  const hasTyposPatterns = /([a-zA-Z])\1{2,}/g; // Tekrarlı harfler
  return turkishLetter.test(content) || hasTyposPatterns.test(content);
}

/**
 * Başlık ve içerik uyumunu kontrol eder
 * @param title - Başlık
 * @param content - İçerik
 * @returns Uyumlu mu?
 */
function contentCoherence(title: string, content: string): boolean {
  // Başlıkta geçen kelimelerin içerikte olup olmadığını kontrol et
  const titleWords = title.toLowerCase().split(/\s+/);
  const contentLower = content.toLowerCase();

  const matchingWords = titleWords.filter(
    (word) => word.length > 3 && contentLower.includes(word)
  );

  return matchingWords.length >= Math.ceil(titleWords.length / 2);
}
