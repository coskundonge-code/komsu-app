/**
 * İlan oluşturma formu — SAF (I/O'suz, React'siz) domain mantığı.
 *
 * Pazar ilan formunun sabitleri, alan doğrulaması ve medya seçim kuralları burada
 * toplanır. Sayfa (src/app/(main)/pazar/ilan-ver/page.tsx) yalnızca durumu (state)
 * tutar ve bu saf fonksiyonları çağırır (K1: ince sayfa + test edilebilir domain).
 *
 * Neden ayrıldı: doğrulama gevşerse eksik/hatalı ilan yayınlanır; medya kuralı
 * (10 dosya / 2 video / 100MB) gevşerse depolama ve moderasyon yükü patlar. Bu
 * yüzden eşikler ve kurallar burada testle kilitlenir — refactor sessizce
 * davranışı değiştirmesin.
 */

export type ListingType = 'sale' | 'free' | 'rental' | 'lend'

export const LISTING_TYPES: { value: ListingType; label: string; icon: string; desc: string }[] = [
  { value: 'sale', label: 'Satılık', icon: '🏷️', desc: 'Ürünü sat' },
  { value: 'free', label: 'Ücretsiz', icon: '🎁', desc: 'Ücretsiz ver' },
  { value: 'rental', label: 'Kiralık', icon: '🔑', desc: 'Kiraya ver' },
  { value: 'lend', label: 'Ödünç Ver', icon: '🤝', desc: 'Ödünç ver' },
]

export const CATEGORIES = [
  'Elektronik',
  'Mobilya',
  'Giyim',
  'Ev & Bahçe',
  'Spor & Hobi',
  'Kitap & Kırtasiye',
  'Bebek & Çocuk',
  'Araç',
  'Diğer',
]

export const CONDITIONS: { value: string; label: string }[] = [
  { value: 'new', label: 'Sıfır' },
  { value: 'like_new', label: 'Az Kullanılmış' },
  { value: 'good', label: 'İyi' },
  { value: 'fair', label: 'Orta' },
]

export const CATEGORY_ID_MAP: Record<string, string> = {
  'Elektronik': 'fcea98f1-d3e8-4b84-82b2-ae36994f809d',
  'Mobilya': '836be50c-4d0d-4186-8808-df634fe8da56',
  'Giyim': '90e53ece-6792-4d12-82d4-6c2c27fb2ce9',
  'Ev & Bahçe': '418789ca-ca21-49f5-a473-2c8cea7f72be',
  'Spor & Hobi': '65848553-fb70-4ba4-b20a-4514a0262843',
  'Kitap & Kırtasiye': '24865efd-a9f5-4e4e-964b-68d681c1be56',
  'Bebek & Çocuk': '648771ed-800e-4688-84c2-1baceba31741',
  'Araç': 'd8fc0ab3-cac4-4f2f-a622-75efa1f59435',
  'Diğer': 'cfbe68e2-dcee-4524-a1c6-7586fe3059bc',
}

/** Yalnız 'sale' ilanlarında fiyat zorunludur. */
export function needsPrice(listingType: ListingType): boolean {
  return listingType === 'sale'
}

/** Ücretsiz kota yalnız 'sale' ve 'rental' için tüketilir (bkz. listing-quota). */
export function needsQuota(listingType: ListingType): boolean {
  return listingType === 'sale' || listingType === 'rental'
}

/** validateListingForm girdisi — yalnız doğrulamaya giren skaler alanlar (fotoğraflar opsiyonel, kontrol edilmez). */
export interface ListingValidationInput {
  listingType: ListingType
  title: string
  category: string
  condition: string
  price: string
  description: string
  deliveryOptions: { pickup: boolean; shipping: boolean }
}

/**
 * Alan doğrulaması: hata-haritası döner (boş harita = geçerli). Mesajlar UI'daki
 * alanlara (title/category/condition/price/description/delivery) anahtarlanır.
 */
export function validateListingForm(input: ListingValidationInput): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!input.title.trim()) {
    errors.title = 'İlan başlığı gereklidir'
  }
  if (!input.category) {
    errors.category = 'Kategori seçilmelidir'
  }
  if (!input.condition) {
    errors.condition = 'Durum seçilmelidir'
  }
  if (needsPrice(input.listingType) && !input.price.trim()) {
    errors.price = 'Fiyat belirtilmelidir'
  }
  if (!input.description.trim()) {
    errors.description = 'Açıklama gereklidir'
  }
  if (!input.deliveryOptions.pickup && !input.deliveryOptions.shipping) {
    errors.delivery = 'En az bir teslimat yöntemi seçin'
  }

  return errors
}

/**
 * Gönder düğmesi kapısı (yan etkisiz — render sırasında güvenli).
 * Satılık/Kiralık'ta kota bittiyse VEYA herhangi bir alan hatası varsa gönderilemez.
 */
export function canSubmitListing(input: ListingValidationInput, quotaBlocked: boolean): boolean {
  if (quotaBlocked && needsQuota(input.listingType)) return false
  return Object.keys(validateListingForm(input)).length === 0
}

// ——— Medya seçim kuralları ———

export const MAX_LISTING_MEDIA = 10
export const MAX_LISTING_VIDEOS = 2
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100MB
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm']

export interface MediaSelectionResult {
  /** Kabul edilen dosyalar — çağıran bunları AI moderasyonuna gönderip ekler. */
  accepted: File[]
  /** Kullanıcıya gösterilecek hata mesajları (toast). */
  errors: string[]
}

/**
 * Medya kapısı (saf): tür + boyut süzgeci, ardından slot (max 10) ve video adedi
 * (max 2) sınırı. Orijinal iki-geçişli davranış birebir korunur:
 *   1) Desteklenmeyen tür sessizce atılır; boyutu aşan video bildirilir.
 *   2) Kalan slot ve video kotasına göre kabul edilir.
 * Çağıran `errors`'ı toast olarak gösterir ve `accepted` üzerinde AI moderasyonu çalıştırır.
 */
export function selectListingMedia(
  incoming: File[],
  currentCount: number,
  currentVideoCount: number
): MediaSelectionResult {
  const errors: string[] = []

  // 1) Tür + boyut süzgeci.
  const mediaFiles = incoming.filter((file) => {
    if (file.type.startsWith('image/')) return true
    if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
      if (file.size > MAX_VIDEO_SIZE) {
        errors.push('Video dosyası çok büyük. Maksimum 100MB olmalı.')
        return false
      }
      return true
    }
    return false
  })

  // 2) Slot + video adedi sınırı.
  const availableSlots = MAX_LISTING_MEDIA - currentCount
  const accepted: File[] = []
  let videoAddCount = 0
  for (const file of mediaFiles) {
    if (accepted.length >= availableSlots) break
    if (file.type.startsWith('video/')) {
      if (currentVideoCount + videoAddCount >= MAX_LISTING_VIDEOS) {
        errors.push('En fazla 2 video yükleyebilirsiniz.')
        continue
      }
      videoAddCount++
    }
    accepted.push(file)
  }

  return { accepted, errors }
}
