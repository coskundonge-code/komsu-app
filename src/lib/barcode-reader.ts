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
 * - PDF text extraction bazen boşluk ekler: "NV02 - ILLE - G5U8 - RLN9"
 */
const EDEVLET_CODE_PATTERN = /\b([A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4})\b/g
const EDEVLET_CODE_PATTERN_LOOSE = /([A-Za-z0-9]{4})\s*[-–—]\s*([A-Za-z0-9]{4})\s*[-–—]\s*([A-Za-z0-9]{4})\s*[-–—]\s*([A-Za-z0-9]{4})/g

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

    // Tüm sayfaları tara (genelde 1. sayfada ama bazen 2.'de olabilir)
    const numPages = Math.min(pdf.numPages, 3)

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()

      // Yöntem 1: Boşlukla birleştir
      const pageTextSpaced = textContent.items
        .map((item: any) => item.str)
        .join(' ')

      let code = findEdevletCode(pageTextSpaced)
      if (code) {
        return { code, source: 'pdf-text', confidence: 'high' }
      }

      // Yöntem 2: Boşluksuz birleştir (PDF bazen her karakteri ayrı item yapar)
      const pageTextNoSpace = textContent.items
        .map((item: any) => item.str)
        .join('')

      code = findEdevletCode(pageTextNoSpace)
      if (code) {
        return { code, source: 'pdf-text', confidence: 'high' }
      }

      // Yöntem 3: Her satırı ayrı birleştir (y koordinatına göre gruplama)
      const lineText = extractTextByLines(textContent.items as any[])
      code = findEdevletCode(lineText)
      if (code) {
        return { code, source: 'pdf-text', confidence: 'high' }
      }

      // Debug: Çıkarılan metni logla
      console.log(`[barcode-reader] Page ${pageNum} text (spaced):`, pageTextSpaced.substring(0, 500))
      console.log(`[barcode-reader] Page ${pageNum} text (nospace):`, pageTextNoSpace.substring(0, 500))
    }

    // Fallback: İlk sayfayı canvas'a render edip barkod tara
    const page = await pdf.getPage(1)
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
 * PDF text items'ı satır satır grupla (aynı Y koordinatındaki itemlar bir satır)
 */
function extractTextByLines(items: Array<{ str: string; transform: number[] }>): string {
  if (items.length === 0) return ''

  // Y koordinatına göre grupla (transform[5] = y)
  const lines: Map<number, string[]> = new Map()
  for (const item of items) {
    if (!item.str.trim()) continue
    const y = Math.round((item.transform?.[5] || 0) / 2) * 2 // 2px tolerans
    if (!lines.has(y)) lines.set(y, [])
    lines.get(y)!.push(item.str)
  }

  // Satırları Y'ye göre sırala ve birleştir
  return Array.from(lines.entries())
    .sort((a, b) => b[0] - a[0]) // PDF'de Y yukarıdan aşağı azalır
    .map(([, texts]) => texts.join(''))
    .join('\n')
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
 * PDF text extraction bazen boşluk ekler veya tire yerine dash kullanır
 */
function findEdevletCode(text: string): string | null {
  // Yöntem 1: Sıkı pattern (XXXX-XXXX-XXXX-XXXX, case-insensitive)
  const strictMatches = text.match(EDEVLET_CODE_PATTERN)
  if (strictMatches && strictMatches.length > 0) {
    for (const match of strictMatches) {
      if (match.toUpperCase().startsWith('NV')) return match.toUpperCase()
    }
    return strictMatches[0].toUpperCase()
  }

  // Yöntem 2: Gevşek pattern (boşluk ve farklı tire tipleri)
  let looseMatch: RegExpExecArray | null
  const looseRegex = new RegExp(EDEVLET_CODE_PATTERN_LOOSE.source, 'g')
  const looseResults: string[] = []
  while ((looseMatch = looseRegex.exec(text)) !== null) {
    const code = `${looseMatch[1]}-${looseMatch[2]}-${looseMatch[3]}-${looseMatch[4]}`.toUpperCase()
    looseResults.push(code)
  }
  if (looseResults.length > 0) {
    for (const code of looseResults) {
      if (code.startsWith('NV')) return code
    }
    return looseResults[0]
  }

  // Yöntem 3: Metindeki tüm boşlukları ve tireleri normalize et, sonra tekrar dene
  const normalized = text.replace(/\s+/g, '').replace(/[-–—]/g, '-')
  const normalizedMatches = normalized.match(EDEVLET_CODE_PATTERN)
  if (normalizedMatches && normalizedMatches.length > 0) {
    for (const match of normalizedMatches) {
      if (match.toUpperCase().startsWith('NV')) return match.toUpperCase()
    }
    return normalizedMatches[0].toUpperCase()
  }

  // Yöntem 4: 16 karakterlik alfanumerik blok ara (4'lü gruplar halinde)
  // PDF bazen tireleri tamamen yiyor
  const rawAlphaNum = text.replace(/[^A-Za-z0-9]/g, '')
  const blockMatch = rawAlphaNum.match(/([A-Za-z0-9]{16})/g)
  if (blockMatch) {
    for (const block of blockMatch) {
      // NV ile başlıyorsa büyük ihtimalle e-Devlet kodu
      if (block.toUpperCase().startsWith('NV')) {
        const formatted = `${block.slice(0,4)}-${block.slice(4,8)}-${block.slice(8,12)}-${block.slice(12,16)}`.toUpperCase()
        return formatted
      }
    }
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

    // Tüm sayfaların metnini topla
    let allTextSpaced = ''
    let allTextNoSpace = ''
    let allTextByLines = ''

    const numPages = Math.min(pdf.numPages, 3)
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()

      const spaced = textContent.items.map((item: any) => item.str).join(' ')
      const noSpace = textContent.items.map((item: any) => item.str).join('')
      const byLines = extractTextByLines(textContent.items as any[])

      allTextSpaced += ' ' + spaced
      allTextNoSpace += noSpace
      allTextByLines += '\n' + byLines
    }

    // Debug: Çıkarılan metni logla
    console.log('[barcode-reader] Full doc text (spaced):', allTextSpaced.substring(0, 800))
    console.log('[barcode-reader] Full doc text (no space):', allTextNoSpace.substring(0, 800))
    console.log('[barcode-reader] Full doc text (by lines):', allTextByLines.substring(0, 800))

    // Barkod kodu - tüm yöntemlerle dene
    let code = findEdevletCode(allTextSpaced)
    if (!code) code = findEdevletCode(allTextNoSpace)
    if (!code) code = findEdevletCode(allTextByLines)

    // TC Kimlik No - tüm metinlerde ara
    let tcKimlikNo = findTCKimlikNo(allTextSpaced)
    if (!tcKimlikNo) tcKimlikNo = findTCKimlikNo(allTextNoSpace)
    if (!tcKimlikNo) tcKimlikNo = findTCKimlikNo(allTextByLines)

    // Metin analizi için en iyi kaynağı seç
    const pageText = allTextSpaced

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
