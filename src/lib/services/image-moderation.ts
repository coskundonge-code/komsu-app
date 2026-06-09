/**
 * Google Cloud Vision SafeSearch → uygulama moderasyon kararı.
 *
 * Üretim: src/app/api/moderate-media/route.ts kullanıcının yüklediği görseli
 * Vision SafeSearch'e gönderir; bu modül dönen olasılıkları (likelihood) bizim
 * blok kararımıza çevirir. SAF (yan etkisiz) — route ince kalır, mantık burada
 * test edilebilir (K1, edevlet-match.ts ile aynı kalıp).
 *
 * Eşikler bilinçli seçildi (aşağıda kilitli, image-moderation.test.ts):
 * - adult / violence: LIKELY veya üzeri → blokla.
 * - racy (müstehcen-ima, çıplaklık değil): yalnız VERY_LIKELY → blokla
 *   (mayo/plaj/spor gibi normal fotoğrafları yanlışlıkla engellememek için).
 * - medical / spoof: bloklanmaz (yanlış-pozitif kaynağı, güvenlik riski değil).
 */

export type SafeSearchLikelihood =
  | 'UNKNOWN'
  | 'VERY_UNLIKELY'
  | 'UNLIKELY'
  | 'POSSIBLE'
  | 'LIKELY'
  | 'VERY_LIKELY'

export interface SafeSearchAnnotation {
  adult?: SafeSearchLikelihood
  violence?: SafeSearchLikelihood
  racy?: SafeSearchLikelihood
  medical?: SafeSearchLikelihood
  spoof?: SafeSearchLikelihood
}

export interface ModerationDecision {
  approved: boolean
  /** Frontend'in (content-moderation.ts) Türkçe etikete çevirdiği kategori anahtarları. */
  flags: string[]
}

const LIKELIHOOD_RANK: Record<SafeSearchLikelihood, number> = {
  UNKNOWN: 0,
  VERY_UNLIKELY: 1,
  UNLIKELY: 2,
  POSSIBLE: 3,
  LIKELY: 4,
  VERY_LIKELY: 5,
}

function atLeast(
  value: SafeSearchLikelihood | undefined,
  threshold: SafeSearchLikelihood
): boolean {
  if (!value) return false
  return LIKELIHOOD_RANK[value] >= LIKELIHOOD_RANK[threshold]
}

/**
 * SafeSearch sonucunu blok kararına çevirir.
 * flags, content-moderation.ts'teki categoryLabels anahtarlarıyla uyumludur
 * (nudity / violence). Hiçbir eşik aşılmazsa approved=true, flags=[].
 */
export function decideSafeSearch(annotation: SafeSearchAnnotation): ModerationDecision {
  const flags: string[] = []

  if (atLeast(annotation.adult, 'LIKELY')) {
    flags.push('nudity')
  }
  if (atLeast(annotation.violence, 'LIKELY')) {
    flags.push('violence')
  }
  // racy çıplaklık değil "müstehcen ima"dır; yalnız çok güçlü sinyalde ve nudity
  // zaten işaretlenmediyse ekle (mükerrer 'nudity' olmasın).
  if (atLeast(annotation.racy, 'VERY_LIKELY') && !flags.includes('nudity')) {
    flags.push('nudity')
  }

  return { approved: flags.length === 0, flags }
}
