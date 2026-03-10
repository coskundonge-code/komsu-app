/**
 * e-Devlet Belge Doğrulama Kodu Okuyucu
 *
 * e-Devlet adres belgelerinden doğrulama kodunu (barkod numarası) otomatik çıkarır.
 * Format: XXXX-XXXX-XXXX-XXXX (4 grup, 4 karakter, tire ile ayrılmış)
 *
 * Stratejiler:
 * 1. PDF metin çıkarma (pdfjs-dist) + pattern matching
 * 2. PDF'yi canvas'a render + BarcodeDetector API
 * 3. PDF'yi canvas'a render + jsQR (QR kod tarama)
 * 4. Görüntü dosyası için BarcodeDetector + jsQR
 */

import jsQR from 'jsqr'

export interface BarcodeResult {
  code: string
  source: 'pdf-text' | 'barcode-api' | 'qr-scan' | 'pattern-match'
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
  source: 'pdf-text' | 'barcode-api' | 'qr-scan' | 'pattern-match'
}

// ============================================================
// ANA FONKSİYONLAR
// ============================================================

/**
 * Dosyadan doğrulama kodu çıkar (PDF veya görüntü)
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
 * PDF'den tüm belge bilgilerini çıkar (barkod, TC, ad, adres)
 */
export async function extractFullDocumentInfo(file: File): Promise<DocumentExtraction | null> {
  if (file.type !== 'application/pdf') {
    const barcodeResult = await extractFromImage(file)
    if (barcodeResult) {
      return {
        code: barcodeResult.code,
        tcKimlikNo: null, fullName: null, address: null,
        neighborhood: null, district: null, city: null,
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

    // ===== AŞAMA 1: Metin Çıkarma =====
    let allTextSpaced = ''
    let allTextNoSpace = ''
    let allTextByLines = ''
    let allItems: any[] = []

    const numPages = Math.min(pdf.numPages, 5)
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      const items = textContent.items as any[]
      allItems = allItems.concat(items)

      allTextSpaced += ' ' + items.map((i: any) => i.str).join(' ')
      allTextNoSpace += items.map((i: any) => i.str).join('')
      allTextByLines += '\n' + extractTextByLines(items)
    }

    console.log('[barcode] Items count:', allItems.length)
    console.log('[barcode] Text (spaced, 800ch):', allTextSpaced.substring(0, 800))
    console.log('[barcode] Text (lines, 800ch):', allTextByLines.substring(0, 800))
    console.log('[barcode] First 40 items:', allItems.slice(0, 40).map((i: any) => `"${i.str}"`).join(', '))

    // Metin tabanlı barkod arama
    let code = findCodeFromTexts(allTextSpaced, allTextNoSpace, allTextByLines, allItems)

    // ===== AŞAMA 2: Canvas tabanlı barkod tarama =====
    if (!code) {
      console.log('[barcode] Text extraction failed, trying canvas scan...')
      for (let pageNum = 1; pageNum <= Math.min(numPages, 2); pageNum++) {
        const page = await pdf.getPage(pageNum)
        // Farklı çözünürlüklerde dene
        for (const scale of [3.0, 4.0, 2.0]) {
          const result = await scanPageAsImage(page, scale)
          if (result) {
            code = result.code
            console.log(`[barcode] Found via canvas scan (page ${pageNum}, scale ${scale}):`, code)
            break
          }
        }
        if (code) break
      }
    }

    // TC Kimlik No
    let tcKimlikNo = findTCKimlikNo(allTextSpaced)
    if (!tcKimlikNo) tcKimlikNo = findTCKimlikNo(allTextNoSpace)
    if (!tcKimlikNo) tcKimlikNo = findTCKimlikNo(allTextByLines)

    // Ad, adres bilgileri
    const pageText = allTextSpaced
    let fullName: string | null = null
    const nameMatch = pageText.match(/(?:Adı?\s*(?:ve\s*)?Soyadı?|Ad\s*Soyad)\s*[:\-]?\s*([A-ZÇĞİÖŞÜa-zçğıöşü\s]+?)(?:\s*T\.C\.|Doğum|Adres|Nüfus)/i)
    if (nameMatch) fullName = nameMatch[1].trim()

    let address: string | null = null
    let neighborhood: string | null = null
    let district: string | null = null
    let city: string | null = null

    const mahalleMatch = pageText.match(/([A-ZÇĞİÖŞÜa-zçğıöşü]+\s*MAH\.?)/i)
    if (mahalleMatch) neighborhood = mahalleMatch[1].trim()

    const ilceIlMatch = pageText.match(/([A-ZÇĞİÖŞÜ]+)\s*\/\s*([A-ZÇĞİÖŞÜ]+)\s*$/m)
    if (ilceIlMatch) { district = ilceIlMatch[1].trim(); city = ilceIlMatch[2].trim() }

    const addressMatch = pageText.match(/(?:Adres|Yerleşim\s*Yeri\s*Adresi?)\s*[:\-]?\s*(.+?)(?:\n|Belge|Nüfus|Düzenle)/i)
    if (addressMatch) address = addressMatch[1].trim().replace(/\s+/g, ' ')

    return {
      code, tcKimlikNo, fullName, address, neighborhood, district, city,
      source: code ? 'pdf-text' : 'pdf-text',
    }
  } catch (error) {
    console.error('[barcode] Full extraction error:', error)
    return null
  }
}

// ============================================================
// METİN TABANLI ARAMA
// ============================================================

/**
 * Tüm metin kaynaklarından barkod kodu bul
 */
function findCodeFromTexts(spaced: string, noSpace: string, byLines: string, items: any[]): string | null {
  // 1. Ana metin kaynaklarından dene
  for (const text of [spaced, noSpace, byLines]) {
    const code = findEdevletCode(text)
    if (code) return code
  }

  // 2. Her satırı ayrı dene
  const lines = byLines.split('\n')
  for (const line of lines) {
    const code = findEdevletCode(line)
    if (code) return code
  }

  // 3. "Barkod" veya "Doğrulama" yakınında ara
  const code3 = findCodeNearKeyword(items)
  if (code3) return code3

  // 4. Kayan pencere (sliding window) - bitişik item'ları birleştir
  for (let windowSize = 4; windowSize <= 12; windowSize++) {
    for (let i = 0; i < items.length - windowSize + 1; i++) {
      const windowText = items.slice(i, i + windowSize).map((it: any) => it.str || '').join('')
      const code = findEdevletCode(windowText)
      if (code) return code
      // Boşlukla da dene
      const windowSpaced = items.slice(i, i + windowSize).map((it: any) => it.str || '').join(' ')
      const code2 = findEdevletCode(windowSpaced)
      if (code2) return code2
    }
  }

  // 5. Her item'ı tek tek dene
  for (const item of items) {
    const str = (item.str || '').trim()
    if (str.length >= 4) {
      const code = findEdevletCode(str)
      if (code) return code
    }
  }

  return null
}

/**
 * e-Devlet belge doğrulama kodunu metinde bul
 * En esnek arama: 7 farklı strateji
 */
function findEdevletCode(text: string): string | null {
  if (!text || text.length < 8) return null

  // 1. XXXX-XXXX-XXXX-XXXX (standart)
  const strict = /([A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4})/g
  const m1 = [...text.matchAll(strict)]
  if (m1.length > 0) {
    const nvMatch = m1.find(m => m[1].toUpperCase().startsWith('NV'))
    return (nvMatch || m1[0])[1].toUpperCase()
  }

  // 2. Gevşek ayırıcı (boşluk, tire, nokta, slash vb.)
  const loose = /([A-Za-z0-9]{4})\s*[-–—‐.:\/\\|]\s*([A-Za-z0-9]{4})\s*[-–—‐.:\/\\|]\s*([A-Za-z0-9]{4})\s*[-–—‐.:\/\\|]\s*([A-Za-z0-9]{4})/g
  const m2 = [...text.matchAll(loose)]
  if (m2.length > 0) {
    for (const m of m2) {
      const c = `${m[1]}-${m[2]}-${m[3]}-${m[4]}`.toUpperCase()
      if (c.startsWith('NV')) return c
    }
    return `${m2[0][1]}-${m2[0][2]}-${m2[0][3]}-${m2[0][4]}`.toUpperCase()
  }

  // 3. Boşlukla ayrılmış 4'lü gruplar
  const spaceGroups = /\b([A-Za-z0-9]{4})\s+([A-Za-z0-9]{4})\s+([A-Za-z0-9]{4})\s+([A-Za-z0-9]{4})\b/g
  const m3 = [...text.matchAll(spaceGroups)]
  for (const m of m3) {
    const combined = m[1] + m[2] + m[3] + m[4]
    if (/[A-Za-z]/.test(combined) && /[0-9]/.test(combined)) {
      return `${m[1]}-${m[2]}-${m[3]}-${m[4]}`.toUpperCase()
    }
  }

  // 4. Tüm ayırıcıları kaldırıp 16 karakterlik blok
  const clean = text.replace(/[\s\-–—‐.:\/\\|,;]+/g, '')
  // NV ile başlayan yeri bul
  const nvIdx = clean.toUpperCase().indexOf('NV')
  if (nvIdx >= 0 && nvIdx + 16 <= clean.length) {
    const sub = clean.substring(nvIdx, nvIdx + 16)
    if (/^[A-Za-z0-9]{16}$/.test(sub) && /[A-Za-z]/.test(sub) && /[0-9]/.test(sub)) {
      return `${sub.slice(0,4)}-${sub.slice(4,8)}-${sub.slice(8,12)}-${sub.slice(12,16)}`.toUpperCase()
    }
  }

  // 5. Alfanumerik 16-char blok (NV olmadan)
  const alphaOnly = text.replace(/[^A-Za-z0-9]/g, '')
  if (alphaOnly.length >= 16 && alphaOnly.length <= 50) {
    // 16 karakterlik mixed alfanumerik blok bul
    const blockMatch = alphaOnly.match(/([A-Za-z][A-Za-z0-9]{15})/g) // Harfle başlayan
    if (blockMatch) {
      for (const block of blockMatch) {
        if (/[A-Za-z]/.test(block) && /[0-9]/.test(block) && !/^\d+$/.test(block)) {
          return `${block.slice(0,4)}-${block.slice(4,8)}-${block.slice(8,12)}-${block.slice(12,16)}`.toUpperCase()
        }
      }
    }
  }

  // 6. "Barkod" etiketinden sonraki değeri al
  const afterLabel = text.match(/[Bb]arkod\s*(?:No|Numaras[ıi])?\s*[:\-]?\s*([A-Za-z0-9\s\-–]{10,30})/i)
  if (afterLabel) {
    const val = afterLabel[1].replace(/\s+/g, '').replace(/[-–—]+/g, '-')
    const innerCode = findEdevletCode(val) // recursive ama farklı input
    if (innerCode) return innerCode
    // Temiz alfanumerik
    const cleaned = val.replace(/[^A-Za-z0-9]/g, '')
    if (cleaned.length >= 16) {
      return `${cleaned.slice(0,4)}-${cleaned.slice(4,8)}-${cleaned.slice(8,12)}-${cleaned.slice(12,16)}`.toUpperCase()
    }
  }

  // 7. "Doğrulama" etiketinden sonra
  const afterVerify = text.match(/[Dd]o[ğg]rulama\s*(?:Kodu|No)?\s*[:\-]?\s*([A-Za-z0-9\s\-–]{10,30})/i)
  if (afterVerify) {
    const cleaned = afterVerify[1].replace(/[^A-Za-z0-9]/g, '')
    if (cleaned.length >= 16) {
      return `${cleaned.slice(0,4)}-${cleaned.slice(4,8)}-${cleaned.slice(8,12)}-${cleaned.slice(12,16)}`.toUpperCase()
    }
  }

  return null
}

/**
 * Anahtar kelime yakınında kod ara
 */
function findCodeNearKeyword(items: any[]): string | null {
  const keywords = ['barkod', 'doğrulama', 'belge no', 'referans', 'sorgu', 'kontrol', 'dogrulama']

  for (let i = 0; i < items.length; i++) {
    const str = ((items[i] || {}).str || '').toLowerCase()
    if (!keywords.some(kw => str.includes(kw))) continue

    // Bu keyword'ün etrafındaki item'ları topla
    for (const range of [[i, i+8], [i-2, i+6], [i, i+12]]) {
      const start = Math.max(0, range[0])
      const end = Math.min(items.length, range[1])
      const nearby = items.slice(start, end).map((it: any) => it.str || '')

      // Boşlukla birleştir
      let code = findEdevletCode(nearby.join(' '))
      if (code) return code
      // Birleşik
      code = findEdevletCode(nearby.join(''))
      if (code) return code
    }
  }
  return null
}

/**
 * PDF text items'ı satır satır grupla (Y koordinatına göre)
 */
function extractTextByLines(items: Array<{ str: string; transform: number[] }>): string {
  if (items.length === 0) return ''
  const lines: Map<number, Array<{ str: string; x: number }>> = new Map()
  for (const item of items) {
    if (!item.str.trim()) continue
    const y = Math.round((item.transform?.[5] || 0) / 2) * 2
    const x = item.transform?.[4] || 0
    if (!lines.has(y)) lines.set(y, [])
    lines.get(y)!.push({ str: item.str, x })
  }
  return Array.from(lines.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([, texts]) => {
      texts.sort((a, b) => a.x - b.x)
      return texts.map(t => t.str).join('')
    })
    .join('\n')
}

// ============================================================
// CANVAS TABANLI TARAMA (BarcodeDetector + jsQR)
// ============================================================

/**
 * PDF sayfasını canvas'a render edip barkod/QR tara
 */
async function scanPageAsImage(page: any, scale: number): Promise<BarcodeResult | null> {
  try {
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext('2d')!
    await page.render({ canvasContext: ctx, viewport }).promise

    // Tam sayfa tara
    let result = await scanCanvas(canvas)
    if (result) return result

    // Üst 1/3 bölge (barkod genelde üstte)
    result = await scanRegion(canvas, ctx, 0, 0, canvas.width, Math.floor(canvas.height / 3))
    if (result) return result

    // Alt 1/3 bölge
    result = await scanRegion(canvas, ctx, 0, Math.floor(canvas.height * 2 / 3), canvas.width, Math.floor(canvas.height / 3))
    if (result) return result

    // Sol üst köşe
    result = await scanRegion(canvas, ctx, 0, 0, Math.floor(canvas.width / 2), Math.floor(canvas.height / 3))
    if (result) return result

    // Sağ üst köşe
    result = await scanRegion(canvas, ctx, Math.floor(canvas.width / 2), 0, Math.floor(canvas.width / 2), Math.floor(canvas.height / 3))
    if (result) return result

    return null
  } catch (error) {
    console.warn('[barcode] Canvas scan error:', error)
    return null
  }
}

/**
 * Belirli bir bölgeyi tara
 */
async function scanRegion(
  sourceCanvas: HTMLCanvasElement,
  sourceCtx: CanvasRenderingContext2D,
  x: number, y: number, width: number, height: number
): Promise<BarcodeResult | null> {
  const regionCanvas = document.createElement('canvas')
  regionCanvas.width = width
  regionCanvas.height = height
  const regionCtx = regionCanvas.getContext('2d')!
  regionCtx.drawImage(sourceCanvas, x, y, width, height, 0, 0, width, height)
  return scanCanvas(regionCanvas)
}

/**
 * Canvas'tan barkod ve QR kod tara
 */
async function scanCanvas(canvas: HTMLCanvasElement): Promise<BarcodeResult | null> {
  // 1. BarcodeDetector API (Chrome'da mevcut)
  try {
    if ('BarcodeDetector' in window) {
      const detector = new (window as any).BarcodeDetector({
        formats: ['qr_code', 'code_128', 'code_39', 'data_matrix', 'pdf417', 'aztec', 'ean_13', 'ean_8']
      })
      const barcodes = await detector.detect(canvas)
      if (barcodes.length > 0) {
        for (const barcode of barcodes) {
          const raw = barcode.rawValue.trim()
          console.log('[barcode] BarcodeDetector found:', raw)
          const code = findEdevletCode(raw)
          if (code) return { code, source: 'barcode-api', confidence: 'high' }
          // URL ise içinden kod çıkar
          if (raw.includes('turkiye.gov.tr') || raw.includes('edevlet')) {
            const urlCode = extractCodeFromUrl(raw)
            if (urlCode) return { code: urlCode, source: 'barcode-api', confidence: 'high' }
          }
          if (raw.length >= 8) return { code: raw, source: 'barcode-api', confidence: 'medium' }
        }
      }
    }
  } catch (e) {
    console.warn('[barcode] BarcodeDetector error:', e)
  }

  // 2. jsQR (QR kod tarama - tüm tarayıcılarda çalışır)
  try {
    const ctx = canvas.getContext('2d')!
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const qrResult = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth',
    })
    if (qrResult) {
      const raw = qrResult.data.trim()
      console.log('[barcode] jsQR found:', raw)
      const code = findEdevletCode(raw)
      if (code) return { code, source: 'qr-scan', confidence: 'high' }
      if (raw.includes('turkiye.gov.tr') || raw.includes('edevlet')) {
        const urlCode = extractCodeFromUrl(raw)
        if (urlCode) return { code: urlCode, source: 'qr-scan', confidence: 'high' }
      }
      if (raw.length >= 8) return { code: raw, source: 'qr-scan', confidence: 'medium' }
    }
  } catch (e) {
    console.warn('[barcode] jsQR error:', e)
  }

  return null
}

/**
 * URL'den e-Devlet belge doğrulama kodunu çıkar
 * Örn: https://www.turkiye.gov.tr/belge-dogrulama?barkodNo=NV02ILLEG5U8RLN9
 */
function extractCodeFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const params = ['barkodNo', 'barkod', 'code', 'belgeNo', 'referans']
    for (const p of params) {
      const val = urlObj.searchParams.get(p)
      if (val) {
        const code = findEdevletCode(val)
        if (code) return code
        // 16 karakter alfanumerik
        const cleaned = val.replace(/[^A-Za-z0-9]/g, '')
        if (cleaned.length >= 16) {
          return `${cleaned.slice(0,4)}-${cleaned.slice(4,8)}-${cleaned.slice(8,12)}-${cleaned.slice(12,16)}`.toUpperCase()
        }
      }
    }
    // Path'ten dene
    const pathParts = urlObj.pathname.split('/')
    for (const part of pathParts) {
      if (part.length >= 16) {
        const code = findEdevletCode(part)
        if (code) return code
      }
    }
  } catch { /* URL parse hatası — devam et */ }
  return null
}

// ============================================================
// GÖRÜNTÜ DOSYASINDAN ÇIKARMA
// ============================================================

async function extractFromPDF(file: File): Promise<BarcodeResult | null> {
  try {
    const pdfjsLib = await import('pdfjs-dist')
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const numPages = Math.min(pdf.numPages, 5)

    // Metin çıkarma
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      const items = textContent.items as any[]

      const spaced = items.map((i: any) => i.str).join(' ')
      const noSpace = items.map((i: any) => i.str).join('')
      const byLines = extractTextByLines(items)

      const code = findCodeFromTexts(spaced, noSpace, byLines, items)
      if (code) return { code, source: 'pdf-text', confidence: 'high' }
    }

    // Canvas tabanlı tarama
    for (let pageNum = 1; pageNum <= Math.min(numPages, 2); pageNum++) {
      const page = await pdf.getPage(pageNum)
      for (const scale of [3.0, 4.0, 2.0]) {
        const result = await scanPageAsImage(page, scale)
        if (result) return result
      }
    }

    return null
  } catch (error) {
    console.error('[barcode] PDF extraction error:', error)
    return null
  }
}

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

    return scanCanvas(canvas)
  } catch (error) {
    console.error('[barcode] Image extraction error:', error)
    return null
  }
}

// ============================================================
// TC KİMLİK NO
// ============================================================

function isValidTCKimlik(tc: string): boolean {
  if (tc.length !== 11 || tc[0] === '0' || !/^\d{11}$/.test(tc)) return false
  const d = tc.split('').map(Number)
  const c10 = ((d[0]+d[2]+d[4]+d[6]+d[8])*7 - (d[1]+d[3]+d[5]+d[7])) % 10
  if ((c10 < 0 ? c10+10 : c10) !== d[9]) return false
  return d.slice(0,10).reduce((a,b)=>a+b,0) % 10 === d[10]
}

function findTCKimlikNo(text: string): string | null {
  const matches = text.match(/\b([1-9]\d{10})\b/g)
  if (!matches) return null
  for (const match of matches) {
    if (isValidTCKimlik(match)) return match
  }
  return null
}
