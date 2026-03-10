/**
 * e-Devlet Belge Doğrulama Kodu Okuyucu
 *
 * e-Devlet adres belgelerinden doğrulama kodunu (barkod numarası) otomatik çıkarır.
 * Format: NV02-ILLE-G5U8-RLN9 (4 grup, 4 karakter, tire ile ayrılmış)
 *
 * 1. PDF: pdfjs-dist ile metin çıkarma → regex ile kod bulma
 * 2. Görüntü: BarcodeDetector API ile barkod okuma
 */

export interface BarcodeResult {
  code: string
  source: 'pdf-text' | 'barcode-api' | 'pattern-match'
  confidence: 'high' | 'medium' | 'low'
}

export interface DocumentExtraction {
  code: string | null
  tcKimlikNo: string | null
  fullName: string | null
  address: string | null
  neighborhood: string | null
  district: string | null
  city: string | null
  source: 'pdf-text' | 'barcode-api' | 'pattern-match'
}

/**
 * e-Devlet belge doğrulama kodu formatı:
 * NV02-ILLE-G5U8-RLN9
 * - 4 grup, her biri 4 alfanumerik karakter
 * - Tire ile ayrılmış
 * - Genellikle NV ile başlar
 */
const EDEVLET_CODE_PATTERN = /\b([A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4})\b/g

/**
 * Extract verification code from a file (PDF or image)
 */
export async function extractVerificationCode(file: File): Promise<BarcodeResult | null> {
  if (file.type === 'application/pdf') {
    return extractFromPDF(file)
  } else if (file.type.startsWith('image/')) {
    return extractFromImage(file)
  }
  return null
}

/**
 * Extract code from PDF using pdfjs-dist text extraction
 */
async function extractFromPDF(file: File): Promise<BarcodeResult | null> {
  try {
    const pdfjsLib = await import('pdfjs-dist')
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    // Extract text from first page (belge doğrulama kodu genelde 1. sayfada)
    const page = await pdf.getPage(1)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ')

    // e-Devlet belge doğrulama kodu ara (NV02-ILLE-G5U8-RLN9 formatı)
    const code = findEdevletCode(pageText)
    if (code) {
      return {
        code,
        source: 'pdf-text',
        confidence: 'high'
      }
    }

    // Fallback: PDF'i canvas'a render edip barkod tara
    const viewport = page.getViewport({ scale: 2.0 })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext('2d')!

    await page.render({ canvasContext: ctx, viewport }).promise

    const barcodeResult = await detectBarcodeFromCanvas(canvas)
    if (barcodeResult) return barcodeResult

    return null
  } catch (error) {
    console.error('PDF extraction error:', error)
    return null
  }
}

/**
 * Extract code from image using BarcodeDetector API
 */
async function extractFromImage(file: File): Promise<BarcodeResult | null> {
  try {
    const imageUrl = URL.createObjectURL(file)
    const img = new Image()

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = reject
      img.src = imageUrl
    })

    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0)
    URL.revokeObjectURL(imageUrl)

    // BarcodeDetector ile tara
    const barcodeResult = await detectBarcodeFromCanvas(canvas)
    if (barcodeResult) return barcodeResult

    return null
  } catch (error) {
    console.error('Image extraction error:', error)
    return null
  }
}

/**
 * BarcodeDetector API ile barkod oku (QR kod dahil)
 */
async function detectBarcodeFromCanvas(canvas: HTMLCanvasElement): Promise<BarcodeResult | null> {
  try {
    if ('BarcodeDetector' in window) {
      const detector = new (window as any).BarcodeDetector({
        formats: ['qr_code', 'code_128', 'code_39', 'data_matrix', 'pdf417']
      })

      const barcodes = await detector.detect(canvas)

      if (barcodes.length > 0) {
        for (const barcode of barcodes) {
          const raw = barcode.rawValue.trim()
          // Barkod içinde e-Devlet kodu ara
          const code = findEdevletCode(raw)
          if (code) {
            return { code, source: 'barcode-api', confidence: 'high' }
          }
          // Doğrudan barkod değerini döndür (8+ karakter ise)
          if (raw.length >= 8) {
            return { code: raw, source: 'barcode-api', confidence: 'medium' }
          }
        }
      }
    }
  } catch (error) {
    console.warn('BarcodeDetector failed:', error)
  }
  return null
}

/**
 * e-Devlet belge doğrulama kodunu metinde bul
 * Format: NV02-ILLE-G5U8-RLN9 (XXXX-XXXX-XXXX-XXXX)
 */
function findEdevletCode(text: string): string | null {
  // Ana pattern: 4 grup, 4 karakter, tire ile ayrılmış
  const matches = text.match(EDEVLET_CODE_PATTERN)

  if (matches && matches.length > 0) {
    for (const match of matches) {
      // NV ile başlayan kodlar en yüksek öncelikli
      if (match.startsWith('NV')) {
        return match
      }
    }
    return matches[0]
  }

  return null
}

/**
 * TC Kimlik No validation algorithm
 */
function isValidTCKimlik(tc: string): boolean {
  if (tc.length !== 11 || tc[0] === '0' || !/^\d{11}$/.test(tc)) return false
  const d = tc.split('').map(Number)
  const c10 = ((d[0]+d[2]+d[4]+d[6]+d[8])*7 - (d[1]+d[3]+d[5]+d[7])) % 10
  if ((c10 < 0 ? c10+10 : c10) !== d[9]) return false
  return d.slice(0,10).reduce((a,b)=>a+b,0) % 10 === d[10]
}

/**
 * TC Kimlik No'yu metinden bul (11 haneli, algoritma geçerli)
 */
function findTCKimlikNo(text: string): string | null {
  // 11 haneli rakam gruplarını bul
  const matches = text.match(/\b([1-9]\d{10})\b/g)
  if (!matches) return null

  for (const match of matches) {
    if (isValidTCKimlik(match)) {
      return match
    }
  }
  return null
}

/**
 * PDF'den tüm belge bilgilerini çıkar (barkod, TC, ad, adres)
 */
export async function extractFullDocumentInfo(file: File): Promise<DocumentExtraction | null> {
  if (file.type !== 'application/pdf') {
    // Görüntü dosyası ise sadece barkod tara
    const barcodeResult = await extractFromImage(file)
    if (barcodeResult) {
      return {
        code: barcodeResult.code,
        tcKimlikNo: null,
        fullName: null,
        address: null,
        neighborhood: null,
        district: null,
        city: null,
        source: barcodeResult.source,
      }
    }
    return null
  }

  try {
    const pdfjsLib = await import('pdfjs-dist')
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    const page = await pdf.getPage(1)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ')

    // Barkod kodu
    const code = findEdevletCode(pageText)

    // TC Kimlik No
    const tcKimlikNo = findTCKimlikNo(pageText)

    // Ad Soyad - genellikle "Adı Soyadı" veya TC No'dan sonra gelir
    let fullName: string | null = null
    const nameMatch = pageText.match(/(?:Adı?\s*(?:ve\s*)?Soyadı?|Ad\s*Soyad)\s*[:\-]?\s*([A-ZÇĞİÖŞÜa-zçğıöşü\s]+?)(?:\s*T\.C\.|Doğum|Adres|Nüfus)/i)
    if (nameMatch) {
      fullName = nameMatch[1].trim()
    }

    // Adres bilgileri
    let address: string | null = null
    let neighborhood: string | null = null
    let district: string | null = null
    let city: string | null = null

    // Mahalle
    const mahalleMatch = pageText.match(/([A-ZÇĞİÖŞÜa-zçğıöşü]+\s*MAH\.?)/i)
    if (mahalleMatch) neighborhood = mahalleMatch[1].trim()

    // İlçe / İl - genellikle "İLÇE / İL" formatında
    const ilceIlMatch = pageText.match(/([A-ZÇĞİÖŞÜ]+)\s*\/\s*([A-ZÇĞİÖŞÜ]+)\s*$/m)
    if (ilceIlMatch) {
      district = ilceIlMatch[1].trim()
      city = ilceIlMatch[2].trim()
    }

    // Tam adres
    const addressMatch = pageText.match(/(?:Adres|Yerleşim\s*Yeri\s*Adresi?)\s*[:\-]?\s*(.+?)(?:\n|Belge|Nüfus|Düzenle)/i)
    if (addressMatch) {
      address = addressMatch[1].trim().replace(/\s+/g, ' ')
    }

    return {
      code,
      tcKimlikNo,
      fullName,
      address,
      neighborhood,
      district,
      city,
      source: 'pdf-text',
    }
  } catch (error) {
    console.error('Full document extraction error:', error)
    return null
  }
}
