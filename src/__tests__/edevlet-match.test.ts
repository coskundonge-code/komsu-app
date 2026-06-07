import { describe, it, expect } from 'vitest'
import {
  normalizeText,
  compareAddresses,
  compareDocuments,
  parseEdevletResult,
} from '@/lib/services/edevlet-match'

/**
 * e-Devlet belge eşleştirme — KİMLİK DOĞRULAMA GÜVENLİK KAPISI sözleşmesi.
 *
 * Üretim: src/app/api/verify-document/route.ts, kullanıcının yüklediği adres
 * belgesini turkiye.gov.tr'den kazınan kayıtla karşılaştırıp kişiyi "doğrulanmış
 * mahalle sakini" yapar. Eşik gevşerse YANLIŞ kişi mahalleye girer; sıkılaşırsa
 * gerçek sakin reddedilir. Bu yüzden eşleştirme eşiklerini ve bilinçli GEVŞEK
 * kararları (≥1 alan eşleşmesi → doğrula, karşılaştırılacak alan yoksa → doğrula,
 * %60 adres örtüşmesi) burada açıkça kilitliyoruz — gelecekte biri sessizce
 * değiştirmesin.
 */

describe('normalizeText — Türkçe-duyarlı normalleştirme', () => {
  it('Türkçe harfleri ASCII karşılığına indirir (İ→I, Ş→S, Ç→C, Ğ→G, Ü→U, Ö→O)', () => {
    expect(normalizeText('İstanbul Şişli Çağ Ğöz Üç Öz')).toBe('ISTANBUL SISLI CAG GOZ UC OZ')
  })

  it('noktalama/işaretleri atar, boşlukları sadeleştirir, trim eder', () => {
    expect(normalizeText('  Moda Mah.  No:5/A  ')).toBe('MODA MAH NO5A')
  })

  it('küçük/büyük harf farkını kaldırır (büyük harfe çevirir)', () => {
    expect(normalizeText('bağdat caddesi')).toBe('BAGDAT CADDESI')
  })
})

describe('compareAddresses — birebir VEYA %60 kelime örtüşmesi', () => {
  it('normalleştirme sonrası birebir eşleşme → true', () => {
    expect(compareAddresses('Bağdat Caddesi', 'bağdat caddesi')).toBe(true)
  })

  it('%60 üstü ortak kelime → true', () => {
    // [MODA, MAHALLESI, KADIKOY, ISTANBUL] vs [MODA, MAHALLESI, KADIKOY] → 3/3 = 1.0
    expect(
      compareAddresses('Moda Mahallesi Kadıköy İstanbul', 'Moda Mahallesi Kadıköy')
    ).toBe(true)
  })

  it('%60 altı ortak kelime → false (yanlış adres geçmez)', () => {
    // [MODA, MAHALLESI, KADIKOY, ISTANBUL] vs [BESIKTAS, ISTANBUL] → ortak 1, min 2 → 0.5
    expect(
      compareAddresses('Moda Mahallesi Kadıköy İstanbul', 'Beşiktaş İstanbul')
    ).toBe(false)
  })
})

describe('compareDocuments — doğrulama kararı (gevşek eşik bilinçli)', () => {
  it('scraped.error varsa → isMatch:false (e-Devlet "bulunamadı" güvenli reddi)', () => {
    const res = compareDocuments({ error: 'Belge bulunamadı veya bilgiler hatalı.' }, { fullName: 'AHMET YILMAZ' })
    expect(res.isMatch).toBe(false)
    expect(res.details.error).toBeTruthy()
  })

  it('karşılaştırılacak alan yoksa → isMatch:true (barkod+TC zaten sorgulandı — bilinçli)', () => {
    // uploaded boş → ne ad ne adres dalı çalışır → totalChecked 0 → doğrula.
    const res = compareDocuments({ fullName: 'AHMET YILMAZ', address: 'MODA KADIKOY' }, {})
    expect(res.isMatch).toBe(true)
    expect(res.details.note).toBeTruthy()
  })

  it('ad eşleşir (alt-dize, iki yönlü) → isMatch:true', () => {
    const res = compareDocuments({ fullName: 'AHMET YILMAZ' }, { fullName: 'Ahmet Yılmaz' })
    expect(res.isMatch).toBe(true)
    expect(res.details.fullName.match).toBe(true)
  })

  it('tek alan kontrol edilir ve eşleşmezse → isMatch:false', () => {
    const res = compareDocuments({ fullName: 'AHMET YILMAZ' }, { fullName: 'MEHMET KAYA' })
    expect(res.isMatch).toBe(false)
  })

  it('GEVŞEK eşik: ad uyuşmasa bile adres eşleşirse → isMatch:true (matchCount>0)', () => {
    const res = compareDocuments(
      { fullName: 'AHMET YILMAZ', address: 'MODA MAHALLESI KADIKOY ISTANBUL' },
      { fullName: 'MEHMET KAYA', address: 'Moda Mahallesi Kadıköy İstanbul' }
    )
    expect(res.isMatch).toBe(true) // 1/2 alan eşleşti yeter
  })

  it("yalnız il/ilçe/mahalle verildiğinde kısmi adres dalı çalışır (uploaded.address yok)", () => {
    const res = compareDocuments(
      { address: 'MODA MAHALLESI KADIKOY ISTANBUL' },
      { city: 'İstanbul' }
    )
    expect(res.isMatch).toBe(true) // scrapedAddr "ISTANBUL" içeriyor → partMatch
    expect(res.details.address.match).toBe(true)
  })
})

describe('parseEdevletResult — e-Devlet sonuç metni ayrıştırma', () => {
  it('ad/adres/tarih alanlarını + kurumu çıkarır', () => {
    const text = [
      'Adı Soyadı: AHMET YILMAZ',
      'Adres: MODA MAHALLESI KADIKOY ISTANBUL',
      '',
      'Belge Tarihi: 01.06.2026',
    ].join('\n')
    const r = parseEdevletResult(text)
    expect(r.fullName).toBe('AHMET YILMAZ')
    expect(r.address).toBe('MODA MAHALLESI KADIKOY ISTANBUL')
    expect(r.issueDate).toBe('01.06.2026')
    expect(r.issuedBy).toBe('Nüfus ve Vatandaşlık İşleri Genel Müdürlüğü')
    expect(r.error).toBeUndefined()
  })

  it('"Yerleşim Yeri" geçince belge türünü işaretler', () => {
    const r = parseEdevletResult('Yerleşim Yeri ve Diğer Adres Belgesi sorgu sonucu')
    expect(r.documentType).toBe('Yerleşim Yeri ve Diğer Adres Belgesi')
  })

  it('"bulunamadı" → error işaretlenir (doğrulama reddine yol açar)', () => {
    const r = parseEdevletResult('Sorgu sonucu: Belge bulunamadı')
    expect(r.error).toBeTruthy()
  })
})
