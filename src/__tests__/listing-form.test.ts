import { describe, it, expect } from 'vitest'
import {
  LISTING_TYPES,
  CATEGORIES,
  CONDITIONS,
  CATEGORY_ID_MAP,
  needsPrice,
  needsQuota,
  validateListingForm,
  canSubmitListing,
  selectListingMedia,
  MAX_LISTING_MEDIA,
  MAX_LISTING_VIDEOS,
  MAX_VIDEO_SIZE,
  type ListingValidationInput,
  type ListingType,
} from '@/lib/services/listing-form'

/**
 * İlan formu domain mantığı — SÖZLEŞME testleri.
 *
 * Üretim: src/app/(main)/pazar/ilan-ver/page.tsx bu saf fonksiyonları çağırır.
 * Doğrulama gevşerse eksik ilan yayınlanır; medya kuralı gevşerse depolama/moderasyon
 * yükü artar. Eşikleri burada kilitliyoruz — refactor sessizce davranışı değiştirmesin.
 */

// selectListingMedia yalnız .type ve .size okur; testte 100MB ayırmamak için hafif sahte dosya.
function fakeFile(type: string, size: number): File {
  return { type, size } as unknown as File
}
const img = (size = 1024) => fakeFile('image/jpeg', size)
const vid = (size = 1024) => fakeFile('video/mp4', size)

const validSale: ListingValidationInput = {
  listingType: 'sale',
  title: 'İkinci el bisiklet',
  category: 'Spor & Hobi',
  condition: 'good',
  price: '500',
  description: 'Az kullanılmış, temiz durumda.',
  deliveryOptions: { pickup: true, shipping: false },
}

describe('needsPrice — yalnız satılık fiyat ister', () => {
  it('sale → true', () => expect(needsPrice('sale')).toBe(true))
  it('free → false', () => expect(needsPrice('free')).toBe(false))
  it('rental → false', () => expect(needsPrice('rental')).toBe(false))
  it('lend → false', () => expect(needsPrice('lend')).toBe(false))
})

describe('needsQuota — yalnız satılık/kiralık kota tüketir', () => {
  it('sale → true', () => expect(needsQuota('sale')).toBe(true))
  it('rental → true', () => expect(needsQuota('rental')).toBe(true))
  it('free → false', () => expect(needsQuota('free')).toBe(false))
  it('lend → false', () => expect(needsQuota('lend')).toBe(false))
})

describe('validateListingForm — alan doğrulaması', () => {
  it('geçerli satılık form → hata yok', () => {
    expect(validateListingForm(validSale)).toEqual({})
  })

  it('boş başlık → title hatası', () => {
    expect(validateListingForm({ ...validSale, title: '' }).title).toBeTruthy()
  })

  it('yalnız boşluktan oluşan başlık → title hatası (trim)', () => {
    expect(validateListingForm({ ...validSale, title: '   ' }).title).toBeTruthy()
  })

  it('kategori seçilmemiş → category hatası', () => {
    expect(validateListingForm({ ...validSale, category: '' }).category).toBeTruthy()
  })

  it('durum seçilmemiş → condition hatası', () => {
    expect(validateListingForm({ ...validSale, condition: '' }).condition).toBeTruthy()
  })

  it('satılıkta fiyat boş → price hatası', () => {
    expect(validateListingForm({ ...validSale, price: '' }).price).toBeTruthy()
  })

  it('ücretsiz ilanda fiyat boş → price hatası YOK', () => {
    const r = validateListingForm({ ...validSale, listingType: 'free', price: '' })
    expect(r.price).toBeUndefined()
  })

  it('kiralıkta fiyat boş → price hatası YOK (fiyat opsiyonel)', () => {
    const r = validateListingForm({ ...validSale, listingType: 'rental', price: '' })
    expect(r.price).toBeUndefined()
  })

  it('açıklama boş → description hatası', () => {
    expect(validateListingForm({ ...validSale, description: '' }).description).toBeTruthy()
  })

  it('teslimat seçeneği yok → delivery hatası', () => {
    const r = validateListingForm({ ...validSale, deliveryOptions: { pickup: false, shipping: false } })
    expect(r.delivery).toBeTruthy()
  })

  it('tek teslimat (kargo) seçili → delivery hatası YOK', () => {
    const r = validateListingForm({ ...validSale, deliveryOptions: { pickup: false, shipping: true } })
    expect(r.delivery).toBeUndefined()
  })

  it('tüm alanlar boş (satılık) → 6 hata', () => {
    const r = validateListingForm({
      listingType: 'sale',
      title: '',
      category: '',
      condition: '',
      price: '',
      description: '',
      deliveryOptions: { pickup: false, shipping: false },
    })
    expect(Object.keys(r).sort()).toEqual(
      ['category', 'condition', 'delivery', 'description', 'price', 'title'].sort()
    )
  })
})

describe('canSubmitListing — gönder kapısı', () => {
  it('geçerli + kota açık → gönderilebilir', () => {
    expect(canSubmitListing(validSale, false)).toBe(true)
  })

  it('geçerli satılık + kota kapalı → gönderilemez', () => {
    expect(canSubmitListing(validSale, true)).toBe(false)
  })

  it('geçerli ücretsiz + kota kapalı → yine gönderilebilir (kota free için geçersiz)', () => {
    expect(canSubmitListing({ ...validSale, listingType: 'free' }, true)).toBe(true)
  })

  it('geçerli ödünç + kota kapalı → gönderilebilir', () => {
    expect(canSubmitListing({ ...validSale, listingType: 'lend' }, true)).toBe(true)
  })

  it('geçersiz (başlıksız) + kota açık → gönderilemez', () => {
    expect(canSubmitListing({ ...validSale, title: '' }, false)).toBe(false)
  })
})

describe('selectListingMedia — medya kuralları', () => {
  it('slot içi görseller → hepsi kabul, hata yok', () => {
    const r = selectListingMedia([img(), img()], 0, 0)
    expect(r.accepted).toHaveLength(2)
    expect(r.errors).toEqual([])
  })

  it('desteklenmeyen tür → sessizce atılır', () => {
    const r = selectListingMedia([fakeFile('application/pdf', 100), img()], 0, 0)
    expect(r.accepted).toHaveLength(1)
    expect(r.errors).toEqual([])
  })

  it('boyutu aşan video → reddedilir + hata', () => {
    const r = selectListingMedia([vid(MAX_VIDEO_SIZE + 1)], 0, 0)
    expect(r.accepted).toHaveLength(0)
    expect(r.errors).toEqual(['Video dosyası çok büyük. Maksimum 100MB olmalı.'])
  })

  it('kalan slottan fazla görsel → slota göre kesilir (hata yok)', () => {
    // 8 dosya mevcut, 5 yeni gelir → yalnız 2 slot kalmış
    const r = selectListingMedia([img(), img(), img(), img(), img()], MAX_LISTING_MEDIA - 2, 0)
    expect(r.accepted).toHaveLength(2)
    expect(r.errors).toEqual([])
  })

  it('3 video → 2 kabul, 1 reddedilir (video adedi sınırı)', () => {
    const r = selectListingMedia([vid(), vid(), vid()], 0, 0)
    expect(r.accepted).toHaveLength(MAX_LISTING_VIDEOS)
    expect(r.errors).toContain('En fazla 2 video yükleyebilirsiniz.')
  })

  it('mevcut 2 video varken yeni video → reddedilir', () => {
    const r = selectListingMedia([vid()], 5, 2)
    expect(r.accepted).toHaveLength(0)
    expect(r.errors).toContain('En fazla 2 video yükleyebilirsiniz.')
  })

  it('görsel + video karışık, sınır içinde → hepsi kabul', () => {
    const r = selectListingMedia([img(), vid(), img()], 0, 0)
    expect(r.accepted).toHaveLength(3)
    expect(r.errors).toEqual([])
  })

  it('boyut aşan video diğerlerini engellemez', () => {
    const r = selectListingMedia([img(), vid(MAX_VIDEO_SIZE + 1), vid()], 0, 0)
    expect(r.accepted).toHaveLength(2)
    expect(r.errors).toEqual(['Video dosyası çok büyük. Maksimum 100MB olmalı.'])
  })

  it('webm ve quicktime videoları kabul edilir', () => {
    const r = selectListingMedia(
      [fakeFile('video/webm', 1000), fakeFile('video/quicktime', 1000)],
      0,
      0
    )
    expect(r.accepted).toHaveLength(2)
    expect(r.errors).toEqual([])
  })
})

describe('sabitler — tutarlılık', () => {
  it('her kategori için bir CATEGORY_ID_MAP girdisi var', () => {
    for (const cat of CATEGORIES) {
      expect(CATEGORY_ID_MAP[cat]).toBeTruthy()
    }
  })

  it('LISTING_TYPES dört türü kapsar', () => {
    const values = LISTING_TYPES.map((t) => t.value).sort()
    expect(values).toEqual((['free', 'lend', 'rental', 'sale'] as ListingType[]).sort())
  })

  it('CONDITIONS dört durum içerir', () => {
    expect(CONDITIONS).toHaveLength(4)
  })
})
