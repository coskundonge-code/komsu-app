/**
 * e-Devlet belge eşleştirme — SAF (I/O'suz) kimlik-doğrulama mantığı.
 *
 * Bu modül, mahalle-güven modelinin GÜVENLİK KAPISIDIR: bir kullanıcının yüklediği
 * adres belgesinin, turkiye.gov.tr'den kazınan resmî kayıtla eşleşip eşleşmediğine
 * karar verir. Eşik gevşerse yanlış kişi mahalleye "doğrulanmış sakin" olarak girer;
 * sıkılaşırsa gerçek sakinler reddedilir. Bu yüzden saf eşleştirme mantığı route'tan
 * ayrıldı (K1: ince route + test edilebilir domain) ve burada testle kilitlenir.
 *
 * Tüketim: src/app/api/verify-document/route.ts
 *   - scrapeEdevlet() → parseEdevletResult(sonuç metni)
 *   - POST() → compareDocuments(scraped, uploaded)
 */

/**
 * Türkçe-duyarlı normalleştirme: büyük harfe çevir, Türkçe harfleri ASCII'ye
 * indir (İ→I, Ğ→G…), alfanümerik-dışını at, boşlukları sadeleştir.
 * Ad/adres karşılaştırmasının temeli — bozulursa hiçbir isim eşleşmez.
 */
export function normalizeText(text: string): string {
  return text
    .toUpperCase()
    .replace(/İ/g, 'I')
    .replace(/Ğ/g, 'G')
    .replace(/Ü/g, 'U')
    .replace(/Ş/g, 'S')
    .replace(/Ö/g, 'O')
    .replace(/Ç/g, 'C')
    .replace(/[^A-Z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * İki adresi karşılaştır: birebir eşleşme VEYA 3+ harfli kelimelerin
 * %60'ından fazlası ortaksa eşleşmiş say. Bu 0.6 eşiği güvenlik-kritiktir.
 */
export function compareAddresses(addr1: string, addr2: string): boolean {
  const norm1 = normalizeText(addr1)
  const norm2 = normalizeText(addr2)

  // Birebir eşleşme
  if (norm1 === norm2) return true

  // Kelime bazlı eşleşme (%60 üstü)
  const words1 = norm1.split(' ').filter(w => w.length > 2)
  const words2 = norm2.split(' ').filter(w => w.length > 2)
  const commonWords = words1.filter(w => words2.includes(w))
  const matchRatio = commonWords.length / Math.min(words1.length, words2.length)

  return matchRatio >= 0.6
}

/**
 * e-Devlet sonuç sayfası metnini yapısal alanlara parse et.
 * Kırılgan regex'ler — sözleşmeyi (ad/adres/tarih çıkarımı + "bulunamadı" hatası)
 * testle kilitliyoruz ki bir refactor sessizce yanlış alan çıkarmasın.
 */
export function parseEdevletResult(text: string): Record<string, string> {
  const result: Record<string, string> = {}

  // Ad Soyad
  const nameMatch = text.match(/(?:Adı?\s*Soyadı?|Ad\s*Soyad)\s*[:\-]?\s*([A-ZÇĞİÖŞÜ\s]+?)(?:\n|T\.C\.|Doğum)/i)
  if (nameMatch) result.fullName = nameMatch[1].trim()

  // Adres
  const addressMatch = text.match(/(?:Adres|Yerleşim\s*Yeri)\s*[:\-]?\s*(.+?)(?:\n\n|Belge|Tarih)/i)
  if (addressMatch) result.address = addressMatch[1].trim().replace(/\s+/g, ' ')

  // Belge türü
  if (text.includes('Yerleşim Yeri')) {
    result.documentType = 'Yerleşim Yeri ve Diğer Adres Belgesi'
  }

  // Düzenleme tarihi
  const dateMatch = text.match(/(?:Düzenlenme|Düzenleme|Belge)\s*Tarih[i]?\s*[:\-]?\s*(\d{2}[\./]\d{2}[\./]\d{4})/i)
  if (dateMatch) result.issueDate = dateMatch[1]

  // Geçerlilik tarihi
  const validMatch = text.match(/(?:Geçerlilik|Son\s*Kullanma)\s*Tarih[i]?\s*[:\-]?\s*(\d{2}[\./]\d{2}[\./]\d{4})/i)
  if (validMatch) result.validUntil = validMatch[1]

  // Kurum
  result.issuedBy = 'Nüfus ve Vatandaşlık İşleri Genel Müdürlüğü'

  // Hata kontrolü
  if (text.includes('Belge bulunamadı') || text.includes('bulunamadı') || text.includes('hatalı')) {
    result.error = 'Belge bulunamadı veya bilgiler hatalı.'
  }

  return result
}

/**
 * Yüklenen PDF bilgileri ile scrape edilen bilgileri karşılaştır.
 * Sözleşme: (a) scraped.error → eşleşmedi; (b) en az bir alan eşleşirse doğrula
 * (matchCount > 0 — bilinçli GEVŞEK eşik); (c) karşılaştırılacak hiç alan yoksa
 * doğrulandı say (barkod+TC zaten sorgulandı). Bu kararları testle belgeliyoruz.
 */
export function compareDocuments(
  scraped: Record<string, string>,
  uploaded: Record<string, string>
): { isMatch: boolean; details: Record<string, any> } {
  const details: Record<string, any> = {}
  let matchCount = 0
  let totalChecked = 0

  // Hata varsa doğrudan false döndür
  if (scraped.error) {
    return {
      isMatch: false,
      details: { error: scraped.error }
    }
  }

  // Ad Soyad karşılaştırma
  if (scraped.fullName && uploaded.fullName) {
    totalChecked++
    const scrapedName = normalizeText(scraped.fullName)
    const uploadedName = normalizeText(uploaded.fullName)
    const nameMatch = scrapedName.includes(uploadedName) || uploadedName.includes(scrapedName)
    details.fullName = { scraped: scraped.fullName, uploaded: uploaded.fullName, match: nameMatch }
    if (nameMatch) matchCount++
  }

  // Adres karşılaştırma (mahalle, ilçe, il bazında)
  if (scraped.address && uploaded.address) {
    totalChecked++
    const addressMatch = compareAddresses(scraped.address, uploaded.address)
    details.address = { scraped: scraped.address, uploaded: uploaded.address, match: addressMatch }
    if (addressMatch) matchCount++
  } else if (uploaded.neighborhood || uploaded.district || uploaded.city) {
    totalChecked++
    const scrapedAddr = normalizeText(scraped.address || '')
    let partMatch = false
    if (uploaded.neighborhood && scrapedAddr.includes(normalizeText(uploaded.neighborhood))) partMatch = true
    if (uploaded.district && scrapedAddr.includes(normalizeText(uploaded.district))) partMatch = true
    if (uploaded.city && scrapedAddr.includes(normalizeText(uploaded.city))) partMatch = true
    details.address = {
      scraped: scraped.address,
      uploaded: `${uploaded.neighborhood || ''} ${uploaded.district || ''} ${uploaded.city || ''}`.trim(),
      match: partMatch
    }
    if (partMatch) matchCount++
  }

  // Eğer hiç karşılaştırılacak bilgi yoksa, belge doğrulandı say
  // (barkod + TC ile sorgulama zaten yapıldı)
  if (totalChecked === 0) {
    return {
      isMatch: true,
      details: {
        note: 'Barkod ve TC Kimlik No ile doğrulama başarılı.',
        scrapedData: scraped
      }
    }
  }

  return {
    isMatch: matchCount > 0, // En az bir bilgi eşleşirse doğrula
    details
  }
}
