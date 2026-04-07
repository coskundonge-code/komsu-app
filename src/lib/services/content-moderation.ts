// @ts-nocheck
// İçerik Moderasyon Sistemi - AI Filtresi + Admin Onay

import { createClient } from '@/lib/supabase/client';

// ============ TYPES ============

export type ContentType = 'post' | 'listing' | 'group' | 'event' | 'alert' | 'comment' | 'business_review' | 'story';

export type ModerationStatus =
  | 'pending_ai'
  | 'ai_approved'
  | 'ai_rejected'
  | 'pending_admin'
  | 'admin_approved'
  | 'admin_rejected'
  | 'published'
  | 'removed';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type AICategory =
  | 'spam'
  | 'profanity'
  | 'hate_speech'
  | 'harassment'
  | 'scam'
  | 'adult_content'
  | 'violence'
  | 'misinformation'
  | 'personal_info'
  | 'advertising'
  | 'clean';

export interface ModerationResult {
  score: number; // 0-100 (100 = tamamen güvenli)
  categories: AICategory[];
  reasoning: string;
  autoAction: 'approve' | 'reject' | 'review';
  priority: Priority;
}

export interface ModerationQueueItem {
  id: string;
  contentType: ContentType;
  contentId: string;
  authorId: string;
  authorName?: string;
  authorAvatar?: string;
  status: ModerationStatus;
  aiScore: number | null;
  aiCategories: AICategory[];
  aiReasoning: string | null;
  contentSnapshot: string;
  titleSnapshot: string | null;
  imageUrls: string[] | null;
  priority: Priority;
  autoApproved: boolean;
  createdAt: string;
  adminNote?: string;
}

export interface ModerationStats {
  totalPending: number;
  pendingAI: number;
  pendingAdmin: number;
  approvedToday: number;
  rejectedToday: number;
  autoApprovedToday: number;
  avgResponseTime: string;
}

// ============ TURKISH PROFANITY & SPAM DETECTION ============

const TURKISH_PROFANITY_LIST = [
  'amk', 'aq', 'orospu', 'piç', 'siktir', 'yavşak', 'götveren',
  'pezevenk', 'kaltak', 'ibne', 'dangalak', 'gerizekalı', 'mal',
  'salak', 'aptal', 'hıyar', 'kahpe', 'şerefsiz', 'namussuz',
  'it oğlu', 'köpek', 'hayvan', 'puşt', 'gavat', 'döl', 'yarrak',
  'am', 'taşak', 'meme', 'sik', 'götü', 'bok', 's2m', 'mk',
];

const SCAM_KEYWORDS = [
  'kolay para', 'hemen kazan', 'garantili gelir', 'yatırım fırsatı',
  'kripto', 'bitcoin', 'forex', 'çok kazandım', 'link tıkla',
  'bedava iphone', 'hediye kazan', 'whatsapp grup', 'telegram',
  'banka hesap', 'tc kimlik', 'şifre', 'kredi kartı',
  'evden para kazan', 'ek gelir', 'network marketing', 'mlm',
  'sadece bugün', 'son fırsat', 'kaçırma', 'sınırlı süre',
];

const SPAM_PATTERNS = [
  /(.)\1{5,}/g,                    // Aynı karakter 5+ tekrar: "aaaaaa"
  /(https?:\/\/[^\s]+){3,}/g,     // 3+ URL
  /\b\d{10,}\b/g,                 // 10+ haneli numara (telefon hariç)
  /[A-Z\s]{20,}/g,                // 20+ karakter büyük harf
  /(.{10,})\1{2,}/g,              // Aynı cümle tekrarı
  /[!?]{4,}/g,                     // 4+ ünlem/soru işareti
  /₺\d+.*₺\d+.*₺\d+/g,          // Çoklu fiyat spam
];

const PERSONAL_INFO_PATTERNS = [
  /\b\d{11}\b/g,                  // TC Kimlik No (11 haneli)
  /\b\d{16}\b/g,                  // Kredi kartı numarası
  /\bTR\d{24}\b/gi,              // IBAN
  /\b[A-Z]\d{2}[A-Z]{3}\d{4}\b/g, // Pasaport
];

// ============ AI CONTENT FILTER ============

/**
 * Ana AI filtreleme fonksiyonu
 * İçeriği analiz eder ve moderasyon sonucu döner
 */
export function analyzeContent(
  text: string,
  title?: string,
  contentType?: ContentType,
  imageUrls?: string[]
): ModerationResult {
  const fullText = [title, text].filter(Boolean).join(' ').toLowerCase();
  const categories: AICategory[] = [];
  let score = 100; // Başlangıç: tamamen güvenli
  const reasons: string[] = [];

  // 1. Küfür / Uygunsuz Dil Kontrolü
  const profanityCheck = checkProfanity(fullText);
  if (profanityCheck.found) {
    categories.push('profanity');
    score -= profanityCheck.severity;
    reasons.push(`Uygunsuz dil tespit edildi: ${profanityCheck.count} kelime`);
  }

  // 2. Dolandırıcılık / Scam Kontrolü
  const scamCheck = checkScam(fullText);
  if (scamCheck.found) {
    categories.push('scam');
    score -= scamCheck.severity;
    reasons.push(`Olası dolandırıcılık içeriği: ${scamCheck.matches.join(', ')}`);
  }

  // 3. Spam Kontrolü
  const spamCheck = checkSpam(fullText);
  if (spamCheck.found) {
    categories.push('spam');
    score -= spamCheck.severity;
    reasons.push(`Spam belirtileri: ${spamCheck.details}`);
  }

  // 4. Kişisel Bilgi Kontrolü
  const personalInfoCheck = checkPersonalInfo(fullText);
  if (personalInfoCheck.found) {
    categories.push('personal_info');
    score -= personalInfoCheck.severity;
    reasons.push(`Kişisel bilgi tespit edildi: ${personalInfoCheck.type}`);
  }

  // 5. Nefret Söylemi Kontrolü
  const hateCheck = checkHateSpeech(fullText);
  if (hateCheck.found) {
    categories.push('hate_speech');
    score -= hateCheck.severity;
    reasons.push('Nefret söylemi içeriği tespit edildi');
  }

  // 6. Reklam Kontrolü
  const adCheck = checkAdvertising(fullText, contentType);
  if (adCheck.found) {
    categories.push('advertising');
    score -= adCheck.severity;
    reasons.push('İzinsiz reklam içeriği');
  }

  // 7. İçerik uzunluğu ve kalite kontrolü
  const qualityCheck = checkContentQuality(text, title, contentType);
  if (!qualityCheck.passed) {
    score -= qualityCheck.penalty;
    reasons.push(qualityCheck.reason);
  }

  // 8. İçerik tipine göre ek kurallar
  if (contentType === 'alert') {
    // Acil durum paylaşımları daha sıkı denetlenmeli
    score = Math.max(score - 10, 0);
    reasons.push('Acil durum içeriği - ek denetim gerekli');
  }

  // Skor sınırla
  score = Math.max(0, Math.min(100, score));

  // Kategoriler boşsa temiz
  if (categories.length === 0) {
    categories.push('clean');
  }

  // Otomatik karar
  const autoAction = determineAction(score, categories, contentType);
  const priority = determinePriority(score, categories, contentType);

  return {
    score,
    categories,
    reasoning: reasons.length > 0 ? reasons.join('; ') : 'İçerik temiz görünüyor',
    autoAction,
    priority,
  };
}

// ============ CHECK FUNCTIONS ============

function checkProfanity(text: string): { found: boolean; severity: number; count: number } {
  let count = 0;
  for (const word of TURKISH_PROFANITY_LIST) {
    const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) count += matches.length;
  }
  // Leetspeak varyasyonları da kontrol et
  const leetText = text
    .replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e')
    .replace(/4/g, 'a').replace(/5/g, 's').replace(/7/g, 't')
    .replace(/@/g, 'a').replace(/\$/g, 's');
  for (const word of TURKISH_PROFANITY_LIST) {
    const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'gi');
    const matches = leetText.match(regex);
    if (matches) count += matches.length;
  }

  return {
    found: count > 0,
    severity: Math.min(count * 15, 60),
    count,
  };
}

function checkScam(text: string): { found: boolean; severity: number; matches: string[] } {
  const matches: string[] = [];
  for (const keyword of SCAM_KEYWORDS) {
    if (text.includes(keyword.toLowerCase())) {
      matches.push(keyword);
    }
  }
  return {
    found: matches.length > 0,
    severity: Math.min(matches.length * 20, 80),
    matches,
  };
}

function checkSpam(text: string): { found: boolean; severity: number; details: string } {
  const issues: string[] = [];
  let severity = 0;

  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(text)) {
      issues.push('Tekrarlayan kalıp');
      severity += 15;
    }
    pattern.lastIndex = 0;
  }

  // Emoji spam
  const emojiCount = (text.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || []).length;
  if (emojiCount > 10) {
    issues.push(`Aşırı emoji (${emojiCount})`);
    severity += 10;
  }

  // Çok kısa + link
  const hasUrl = /https?:\/\//.test(text);
  if (text.length < 20 && hasUrl) {
    issues.push('Kısa metin + link');
    severity += 25;
  }

  return {
    found: issues.length > 0,
    severity: Math.min(severity, 60),
    details: issues.join(', '),
  };
}

function checkPersonalInfo(text: string): { found: boolean; severity: number; type: string } {
  const types: string[] = [];

  if (/\b\d{11}\b/.test(text)) types.push('TC Kimlik No');
  if (/\b\d{16}\b/.test(text)) types.push('Kart Numarası');
  if (/\bTR\d{24}\b/i.test(text)) types.push('IBAN');
  if (/\b[A-Z]\d{2}[A-Z]{3}\d{4}\b/.test(text)) types.push('Pasaport');

  return {
    found: types.length > 0,
    severity: types.length * 30,
    type: types.join(', '),
  };
}

function checkHateSpeech(text: string): { found: boolean; severity: number } {
  const hatePatterns = [
    /ırk\w*\s*(aşağı|kötü|pis|lanet)/i,
    /mülteci\w*\s*(defol|git|istemiyoruz)/i,
    /(suriyeli|afganlı|pakistanlı)\w*\s*(defol|git|istemiyoruz|pis)/i,
    /kadınlar?\s*(aptal|mal|salak|yer)/i,
    /(eşcinsel|gay|lezbiyen)\w*\s*(hasta|sapık|iğrenç)/i,
    /din\w*\s*(yıkılsın|lanet|sahte)/i,
    /hepsi\s*(aynı|kötü|hırsız|yalancı)/i,
  ];

  let found = false;
  for (const pattern of hatePatterns) {
    if (pattern.test(text)) {
      found = true;
      break;
    }
  }

  return { found, severity: found ? 50 : 0 };
}

function checkAdvertising(text: string, contentType?: ContentType): { found: boolean; severity: number } {
  if (contentType === 'listing' || contentType === 'business_review') return { found: false, severity: 0 };

  const adPatterns = [
    /indirim\w*.*%\d+/i,
    /kampanya\w*.*fiyat/i,
    /satış\w*.*sipariş/i,
    /www\.\w+\.com/i,
    /@\w+\s*(instagram|youtube|tiktok)/i,
    /takip\w*.*kazan/i,
    /dm\s*(at|yaz|gel)/i,
  ];

  let count = 0;
  for (const pattern of adPatterns) {
    if (pattern.test(text)) count++;
  }

  return {
    found: count >= 2,
    severity: count * 10,
  };
}

function checkContentQuality(text: string, title?: string, contentType?: ContentType): { passed: boolean; penalty: number; reason: string } {
  if (contentType === 'comment') {
    if (text.length < 3) return { passed: false, penalty: 20, reason: 'Çok kısa yorum' };
    return { passed: true, penalty: 0, reason: '' };
  }

  if (text.length < 10) {
    return { passed: false, penalty: 15, reason: 'İçerik çok kısa' };
  }

  if (contentType === 'listing' && !title) {
    return { passed: false, penalty: 10, reason: 'İlan başlığı eksik' };
  }

  if (contentType === 'alert' && text.length < 30) {
    return { passed: false, penalty: 20, reason: 'Acil durum bildirimi yetersiz açıklama' };
  }

  return { passed: true, penalty: 0, reason: '' };
}

// ============ DECISION FUNCTIONS ============

function determineAction(score: number, categories: AICategory[], contentType?: ContentType): 'approve' | 'reject' | 'review' {
  // Kritik kategoriler → otomatik red
  if (categories.includes('scam') || categories.includes('hate_speech')) {
    return 'reject';
  }

  // Kişisel bilgi → her zaman inceleme
  if (categories.includes('personal_info')) {
    return 'review';
  }

  // Acil durum → her zaman admin onayı
  if (contentType === 'alert') {
    return 'review';
  }

  // Skor bazlı karar
  if (score >= 85) return 'approve';
  if (score >= 50) return 'review';
  return 'reject';
}

function determinePriority(score: number, categories: AICategory[], contentType?: ContentType): Priority {
  if (categories.includes('scam') || categories.includes('hate_speech')) return 'critical';
  if (contentType === 'alert') return 'high';
  if (categories.includes('personal_info')) return 'high';
  if (score < 50) return 'high';
  if (score < 70) return 'medium';
  return 'low';
}

// ============ MODERATION QUEUE FUNCTIONS ============

/**
 * Yeni içerik moderasyon kuyruğuna ekle
 */
export async function submitForModeration(
  contentType: ContentType,
  contentId: string,
  authorId: string,
  content: string,
  title?: string,
  imageUrls?: string[]
): Promise<{ success: boolean; status: ModerationStatus; moderationId?: string }> {
  try {
    // AI analiz
    const aiResult = analyzeContent(content, title, contentType, imageUrls);

    // Durumu belirle
    let status: ModerationStatus;
    if (aiResult.autoAction === 'approve' && aiResult.score >= 90) {
      status = 'published'; // Otomatik onay (yüksek güvenli içerik)
    } else if (aiResult.autoAction === 'reject') {
      status = 'ai_rejected';
    } else {
      status = 'pending_admin'; // Admin incelemesi gerekli
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('content_moderation')
      .insert({
        content_type: contentType,
        content_id: contentId,
        author_id: authorId,
        status,
        ai_score: aiResult.score,
        ai_categories: aiResult.categories,
        ai_reasoning: aiResult.reasoning,
        ai_reviewed_at: new Date().toISOString(),
        content_snapshot: content,
        title_snapshot: title || null,
        image_urls_snapshot: imageUrls || null,
        priority: aiResult.priority,
        auto_approved: status === 'published',
      })
      .select('id')
      .single();

    if (error) throw error;

    return { success: true, status, moderationId: data?.id };
  } catch (error) {
    console.error('Moderasyon hatası:', error);
    return { success: false, status: 'pending_ai' };
  }
}

/**
 * Admin: Moderasyon kuyruğunu getir
 */
export async function getModerationQueue(
  filters?: {
    status?: ModerationStatus;
    contentType?: ContentType;
    priority?: Priority;
    page?: number;
    limit?: number;
  }
): Promise<{ items: ModerationQueueItem[]; total: number }> {
  try {
    const supabase = createClient();
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('content_moderation')
      .select('*, profiles:author_id(full_name, avatar_url)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.contentType) query = query.eq('content_type', filters.contentType);
    if (filters?.priority) query = query.eq('priority', filters.priority);

    const { data, error, count } = await query;
    if (error) throw error;

    const items: ModerationQueueItem[] = (data || []).map((item: any) => ({
      id: item.id,
      contentType: item.content_type,
      contentId: item.content_id,
      authorId: item.author_id,
      authorName: item.profiles?.full_name || 'Bilinmeyen',
      authorAvatar: item.profiles?.avatar_url,
      status: item.status,
      aiScore: item.ai_score,
      aiCategories: item.ai_categories || [],
      aiReasoning: item.ai_reasoning,
      contentSnapshot: item.content_snapshot,
      titleSnapshot: item.title_snapshot,
      imageUrls: item.image_urls_snapshot,
      priority: item.priority,
      autoApproved: item.auto_approved,
      createdAt: item.created_at,
      adminNote: item.admin_note,
    }));

    return { items, total: count || 0 };
  } catch (error) {
    console.error('Kuyruk getirme hatası:', error);
    return { items: [], total: 0 };
  }
}

/**
 * Admin: İçeriği onayla
 */
export async function approveContent(
  moderationId: string,
  adminId: string,
  note?: string
): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('content_moderation')
      .update({
        status: 'published',
        admin_id: adminId,
        admin_note: note || null,
        admin_reviewed_at: new Date().toISOString(),
      })
      .eq('id', moderationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Onay hatası:', error);
    return false;
  }
}

/**
 * Admin: İçeriği reddet
 */
export async function rejectContent(
  moderationId: string,
  adminId: string,
  note: string
): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('content_moderation')
      .update({
        status: 'admin_rejected',
        admin_id: adminId,
        admin_note: note,
        admin_reviewed_at: new Date().toISOString(),
      })
      .eq('id', moderationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Red hatası:', error);
    return false;
  }
}

/**
 * Moderasyon istatistikleri
 */
export async function getModerationStats(): Promise<ModerationStats> {
  try {
    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];

    const [pending, approvedToday, rejectedToday, autoApproved] = await Promise.all([
      supabase.from('content_moderation').select('status', { count: 'exact', head: true })
        .in('status', ['pending_ai', 'pending_admin']),
      supabase.from('content_moderation').select('*', { count: 'exact', head: true })
        .in('status', ['published', 'admin_approved'])
        .gte('admin_reviewed_at', today),
      supabase.from('content_moderation').select('*', { count: 'exact', head: true })
        .in('status', ['admin_rejected', 'ai_rejected'])
        .gte('created_at', today),
      supabase.from('content_moderation').select('*', { count: 'exact', head: true })
        .eq('auto_approved', true)
        .gte('created_at', today),
    ]);

    return {
      totalPending: pending.count || 0,
      pendingAI: 0,
      pendingAdmin: pending.count || 0,
      approvedToday: approvedToday.count || 0,
      rejectedToday: rejectedToday.count || 0,
      autoApprovedToday: autoApproved.count || 0,
      avgResponseTime: '< 5 dk',
    };
  } catch (error) {
    console.error('İstatistik hatası:', error);
    return {
      totalPending: 0, pendingAI: 0, pendingAdmin: 0,
      approvedToday: 0, rejectedToday: 0, autoApprovedToday: 0,
      avgResponseTime: '-',
    };
  }
}

// ============ MEDIA CONTENT MODERATION ============

/**
 * Medya dosyalar\u0131n\u0131 (foto\u011fraf/video) moderasyondan ge\u00e7ir
 * M\u00fcstehcenlik, vah\u015fet, \u015fiddet, nefret sembolleri vb. kontrol eder
 */
export async function moderateMediaFiles(
  files: File[]
): Promise<{
  approved: File[];
  rejected: { file: File; reason: string }[];
  hasRejected: boolean;
}> {
  const approved: File[] = [];
  const rejected: { file: File; reason: string }[] = [];

  for (const file of files) {
    const result = await moderateSingleMedia(file);
    if (result.isApproved) {
      approved.push(file);
    } else {
      rejected.push({ file, reason: result.reason });
    }
  }

  return { approved, rejected, hasRejected: rejected.length > 0 };
}

async function moderateSingleMedia(
  file: File
): Promise<{ isApproved: boolean; reason: string }> {
  // 1. Dosya ad\u0131 kontrol\u00fc
  const suspiciousNames = /\b(nsfw|xxx|porn|nude|naked|gore|blood|kill|weapon|sex|erotic)\b/i;
  if (suspiciousNames.test(file.name)) {
    return { isApproved: false, reason: 'Dosya ad\u0131 uygunsuz i\u00e7erik bar\u0131nd\u0131r\u0131yor.' };
  }

  // 2. Dosya tipi kontrol\u00fc
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
  const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
  const isImage = allowedImageTypes.includes(file.type);
  const isVideo = allowedVideoTypes.includes(file.type);

  if (!isImage && !isVideo) {
    return { isApproved: false, reason: 'Desteklenmeyen dosya format\u0131.' };
  }

  // 3. Dosya boyutu kontrol\u00fc
  const maxSize = isVideo ? 100 * 1024 * 1024 : 20 * 1024 * 1024;
  if (file.size > maxSize) {
    return { isApproved: false, reason: `Dosya boyutu \u00e7ok b\u00fcy\u00fck. Maksimum ${isVideo ? '100MB' : '20MB'} olmal\u0131.` };
  }

  // 4. Server-side AI g\u00f6rsel moderasyonu
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', isVideo ? 'video' : 'image');

    const response = await fetch('/api/moderate-media', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      if (!result.approved) {
        const categoryLabels: Record<string, string> = {
          nudity: 'm\u00fcstehcen i\u00e7erik',
          violence: '\u015fiddet i\u00e7eri\u011fi',
          gore: 'vah\u015fet/kanl\u0131 i\u00e7erik',
          hate: 'nefret s\u00f6ylemi/sembolleri',
          drugs: 'uyu\u015fturucu i\u00e7eri\u011fi',
          weapons: 'silah i\u00e7eri\u011fi',
          self_harm: 'kendine zarar verme',
          child_abuse: '\u00e7ocuk istismar\u0131',
        };
        const flagNames = (result.flags || [])
          .map((f: string) => categoryLabels[f] || f)
          .join(', ');
        return {
          isApproved: false,
          reason: `Bu dosyada uygunsuz i\u00e7erik tespit edildi: ${flagNames}.`,
        };
      }
    }
  } catch {
    console.warn('Media moderation API unavailable, using basic checks only');
  }

  return { isApproved: true, reason: '' };
}

// ============ UTILITIES ============

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * İçerik tipinin Türkçe adı
 */
export function getContentTypeLabel(type: ContentType): string {
  const labels: Record<ContentType, string> = {
    post: 'Paylaşım',
    listing: 'İlan',
    group: 'Grup',
    event: 'Etkinlik',
    alert: 'Acil Durum',
    comment: 'Yorum',
    business_review: 'İşletme Yorumu',
    story: 'Hikaye',
  };
  return labels[type] || type;
}

/**
 * Öncelik rengini döndür
 */
export function getPriorityColor(priority: Priority): string {
  const colors: Record<Priority, string> = {
    low: '#22c55e',
    medium: '#f59e0b',
    high: '#ef4444',
    critical: '#dc2626',
  };
  return colors[priority];
}

/**
 * Durum rengini döndür
 */
export function getStatusColor(status: ModerationStatus): string {
  const colors: Record<ModerationStatus, string> = {
    pending_ai: '#6b7280',
    ai_approved: '#22c55e',
    ai_rejected: '#ef4444',
    pending_admin: '#f59e0b',
    admin_approved: '#22c55e',
    admin_rejected: '#ef4444',
    published: '#00833e',
    removed: '#991b1b',
  };
  return colors[status];
}

/**
 * Durum Türkçe etiketi
 */
export function getStatusLabel(status: ModerationStatus): string {
  const labels: Record<ModerationStatus, string> = {
    pending_ai: 'AI İncelemede',
    ai_approved: 'AI Onayladı',
    ai_rejected: 'AI Reddetti',
    pending_admin: 'Admin Bekliyor',
    admin_approved: 'Admin Onayladı',
    admin_rejected: 'Admin Reddetti',
    published: 'Yayında',
    removed: 'Kaldırıldı',
  };
  return labels[status];
}
