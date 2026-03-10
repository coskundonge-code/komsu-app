/**
 * e-Devlet Belge Doğrulama Kodu Okuyucu v4
 *
 * PDF'ler custom font encoding (CMap) kullandığı için pdfjs-dist ZORUNLU.
 * Worker dosyası /public/pdf.worker.min.mjs'e kopyalanmıştır.
 *
 * Strateji sırası:
 * 1. pdfjs-dist text extraction (local worker file)
 * 2. QR code scanning (jsQR + BarcodeDetector)
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
// PDF.JS SETUP — Worker dosyası /public/ klasöründen yüklenir
// ============================================================

let pdfjsReady: typeof import('pdfjs-dist') | null = null

async function getPdfjs() {
  if (pdfjsReady) return pdfjsReady

  const pdfjsLib = await import('pdfjs-dist')

  // Worker URL'leri — sırasıyla denenecek
  const workerUrls = [
    '/pdf.worker.min.mjs', // Local copy in /public/
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`,
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`,
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`,
  ]

  let workerSet = false
  for (const url of workerUrls) {
    try {
      // Quick HEAD check for CDN URLs (skip for local)
      if (url.startsWith('http')) {
        const resp = await fetch(url, { method: 'HEAD', mode: 'cors' })
        if (!resp.ok) continue
      }
      pdfjsLib.GlobalWorkerOptions.workerSrc = url
      console.log('[barcode] Worker URL set:', url)
      workerSet = true
      break
    } catch {
      console.warn('[barcode] Worker URL failed:', url)
    }
  }

  if (!workerSet) {
    // Fallback: use local file without checking
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
    console.log('[barcode] Using local worker as fallback')
  }

  pdfjsReady = pdfjsLib
  return pdfjsLib
}

// ============================================================
// ANA FONKSİYONLAR
// ============================================================

export async function extractVerificationCode(file: File): Promise<BarcodeResult | null> {
  if (file.type === 'application/pdf') {
    const result = await extractFullDocumentInfo(file)
    if (result?.code) {
      return { code: result.code, source: result.source, confidence: 'high' }
    }
    return null
  } else if (file.type.startsWith('image/')) {
    return extractFromImage(file)
  }
  return null
}

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
    const arrayBuffer = await file.arrayBuffer()
    console.log('[barcode] PDF file size:', arrayBuffer.byteLength, 'bytes')

    // ===== pdfjs-dist TEXT EXTRACTION =====
    const pdfjsLib = await getPdfjs()
    console.log('[barcode] pdfjs-dist version:', pdfjsLib.version)

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    console.log('[barcode] PDF loaded successfully, pages:', pdf.numPages)

    let allText = ''
    const allItemTexts: string[] = []
    const numPages = Math.min(pdf.numPages, 5)

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      const items = textContent.items as Array<{ str: string; transform?: number[] }>

      console.log(`[barcode] Page ${pageNum}: ${items.length} text items`)

      for (const item of items) {
        const str = (item.str || '').trim()
        if (str) {
          allItemTexts.push(str)
          allText += ' ' + str
        }
      }
    }

    allText = allText.trim()
    console.log('[barcode] Total extracted text length:', allText.length)
    console.log('[barcode] Text items:', allItemTexts.length)
    console.log('[barcode] Full text:', allText.substring(0, 1500))
    console.log('[barcode] All items:', JSON.stringify(allItemTexts))

    // ===== BARKOD ARAMA =====
    let code: string | null = null

    // Strateji 1: Tam metin üzerinde pattern arama
    code = findBarcodeInText(allText)
    if (code) {
      console.log('[barcode] ✅ Found in full text:', code)
    }

    // Strateji 2: Her item tek tek kontrol
    if (!code) {
      for (const str of allItemTexts) {
        code = findBarcodeInText(str)
        if (code) {
          console.log('[barcode] ✅ Found in single item:', str, '->', code)
          break
        }
      }
    }

    // Strateji 3: Ardışık item'ları birleştir
    if (!code) {
      code = findCodeByCombiningItems(allItemTexts)
      if (code) console.log('[barcode] ✅ Found by combining items:', code)
    }

    // Strateji 4: "Barkod" etiketi yakınında ara
    if (!code) {
      code = findCodeNearLabel(allItemTexts)
      if (code) console.log('[barcode] ✅ Found near label:', code)
    }

    // Strateji 5: NV ile başlayan alfanumerik blok
    if (!code) {
      code = findAlphanumericBlock(allText)
      if (code) console.log('[barcode] ✅ Found alphanumeric block:', code)
    }

    // ===== QR KOD TARAMA (son çare) =====
    if (!code) {
      console.log('[barcode] Text strategies failed, trying QR scan...')
      for (let pageNum = 1; pageNum <= Math.min(numPages, 2); pageNum++) {
        const page = await pdf.getPage(pageNum)
        for (const scale of [2.0, 3.0, 4.0, 5.0]) {
          const result = await scanPageForQR(page, scale)
          if (result) {
            code = result.code
            console.log(`[barcode] ✅ Found via QR (page ${pageNum}, scale ${scale}):`, code)
            break
          }
        }
        if (code) break
      }
    }

    if (!code) {
      console.warn('[barcode] ❌ No barcode found after all strategies')
    }

    // ===== DİĞER BİLGİLER =====
    const tcKimlikNo = findTCKimlikNo(allText)

    let fullName: string | null = null
    const nameMatch = allText.match(/(?:Adı?\s*(?:ve\s*)?Soyadı?|Ad\s*Soyad)\s*[:\-]?\s*([A-ZÇĞİÖŞÜa-zçğıöşü\s]+?)(?:\s*T\.C\.|Doğum|Adres|Nüfus)/i)
    if (nameMatch) fullName = nameMatch[1].trim()

    let neighborhood: string | null = null
    let district: string | null = null
    let city: string | null = null
    let address: string | null = null

    const mahalleMatch = allText.match(/([A-ZÇĞİÖŞÜa-zçğıöşü]+\s*MAH\.?)/i)
    if (mahalleMatch) neighborhood = mahalleMatch[1].trim()

    const ilceIlMatch = allText.match(/([A-ZÇĞİÖŞÜ]+)\s*\/\s*([A-ZÇĞİÖŞÜ]+)\s*$/m)
    if (ilceIlMatch) { district = ilceIlMatch[1].trim(); city = ilceIlMatch[2].trim() }

    const addressMatch = allText.match(/(?:Adres|Yerleşim\s*Yeri\s*Adresi?)\s*[:\-]?\s*(.+?)(?:\n|Belge|Nüfus|Düzenle)/i)
    if (addressMatch) address = addressMatch[1].trim().replace(/\s+/g, ' ')

    return {
      code, tcKimlikNo, fullName, address, neighborhood, district, city,
      source: code ? 'pdf-text' : 'pdf-text',
    }
  } catch (error) {
    console.error('[barcode] ❌ CRITICAL ERROR:', error)
    return null
  }
}

// ============================================================
// BARKOD BULMA STRATEJİLERİ
// ============================================================

function findBarcodeInText(text: string): string | null {
  if (!text || text.length < 8) return null

  // 1. XXXX-XXXX-XXXX-XXXX (standart tire formatı)
  const dashPattern = /([A-Za-z0-9]{4})-([A-Za-z0-9]{4})-([A-Za-z0-9]{4})-([A-Za-z0-9]{4})/g
  const dashMatches = [...text.matchAll(dashPattern)]
  if (dashMatches.length > 0) {
    const nvMatch = dashMatches.find(m => m[0].toUpperCase().startsWith('NV'))
    const best = nvMatch || dashMatches[0]
    return best[0].toUpperCase()
  }

  // 2. Çeşitli ayırıcılarla
  const looseSep = /([A-Za-z0-9]{4})\s*[-–—‐.:\/\\|]\s*([A-Za-z0-9]{4})\s*[-–—‐.:\/\\|]\s*([A-Za-z0-9]{4})\s*[-–—‐.:\/\\|]\s*([A-Za-z0-9]{4})/g
  const looseMatches = [...text.matchAll(looseSep)]
  if (looseMatches.length > 0) {
    for (const m of looseMatches) {
      const c = `${m[1]}-${m[2]}-${m[3]}-${m[4]}`.toUpperCase()
      if (c.startsWith('NV')) return c
    }
    return `${looseMatches[0][1]}-${looseMatches[0][2]}-${looseMatches[0][3]}-${looseMatches[0][4]}`.toUpperCase()
  }

  // 3. Boşluk ile ayrılmış 4'lü gruplar
  const spaceGroups = /\b([A-Za-z0-9]{4})\s+([A-Za-z0-9]{4})\s+([A-Za-z0-9]{4})\s+([A-Za-z0-9]{4})\b/g
  const spaceMatches = [...text.matchAll(spaceGroups)]
  for (const m of spaceMatches) {
    const combined = m[1] + m[2] + m[3] + m[4]
    if (/[A-Za-z]/.test(combined) && /[0-9]/.test(combined)) {
      return `${m[1]}-${m[2]}-${m[3]}-${m[4]}`.toUpperCase()
    }
  }

  // 4. "NV" ile başlayan 16 karakter alfanumerik blok (ayırıcıları kaldır)
  const cleanText = text.replace(/[\s\-–—‐.:\/\\|,;()[\]{}]+/g, '')
  const nvIdx = cleanText.toUpperCase().indexOf('NV')
  if (nvIdx >= 0 && nvIdx + 16 <= cleanText.length) {
    const sub = cleanText.substring(nvIdx, nvIdx + 16)
    if (/^[A-Za-z0-9]{16}$/.test(sub)) {
      return formatAsBarcode(sub)
    }
  }

  // 5. barkodNo= parametresi
  const urlMatch = text.match(/barkodNo[=:]\s*([A-Za-z0-9\-]{10,25})/i)
  if (urlMatch) {
    const cleaned = urlMatch[1].replace(/[^A-Za-z0-9]/g, '')
    if (cleaned.length >= 16) return formatAsBarcode(cleaned.substring(0, 16))
  }

  // 6. turkiye.gov.tr URL'i
  const urlFullMatch = text.match(/turkiye\.gov\.tr[^\s]*barkodNo[=:]\s*([A-Za-z0-9\-]+)/i)
  if (urlFullMatch) {
    const cleaned = urlFullMatch[1].replace(/[^A-Za-z0-9]/g, '')
    if (cleaned.length >= 16) return formatAsBarcode(cleaned.substring(0, 16))
  }

  return null
}

function findCodeByCombiningItems(items: string[]): string | null {
  for (let windowSize = 2; windowSize <= Math.min(20, items.length); windowSize++) {
    for (let i = 0; i <= items.length - windowSize; i++) {
      const window = items.slice(i, i + windowSize)
      const joined = window.join('')
      let code = findBarcodeInText(joined)
      if (code) return code
      code = findBarcodeInText(window.join(' '))
      if (code) return code
      code = findBarcodeInText(window.join('-'))
      if (code) return code
    }
  }

  const allJoined = items.join('')
  const nvIdx = allJoined.toUpperCase().indexOf('NV')
  if (nvIdx >= 0 && nvIdx + 16 <= allJoined.length) {
    const sub = allJoined.substring(nvIdx, nvIdx + 16)
    if (/^[A-Za-z0-9]{16}$/.test(sub)) return formatAsBarcode(sub)
  }

  return null
}

function findCodeNearLabel(items: string[]): string | null {
  const labels = ['barkod', 'doğrulama', 'dogrulama', 'belge no', 'referans', 'sorgu no', 'kontrol']

  for (let i = 0; i < items.length; i++) {
    const lower = items[i].toLowerCase()
    const isLabel = labels.some(l => lower.includes(l))
    if (!isLabel) continue

    console.log(`[barcode] Found label "${items[i]}" at index ${i}`)

    for (let range = 1; range <= 15 && i + range < items.length; range++) {
      const val = items[i + range]
      let code = findBarcodeInText(val)
      if (code) return code

      const afterItems = items.slice(i + 1, i + 1 + range)
      code = findBarcodeInText(afterItems.join(''))
      if (code) return code
      code = findBarcodeInText(afterItems.join(' '))
      if (code) return code
      code = findBarcodeInText(afterItems.join('-'))
      if (code) return code
    }

    const labelAndNext = items.slice(i, Math.min(i + 5, items.length)).join('')
    const afterColon = labelAndNext.match(/(?:barkod|doğrulama|dogrulama)\s*(?:no|kodu|numarası|numarasi)?\s*[:\-=]?\s*(.+)/i)
    if (afterColon) {
      const cleaned = afterColon[1].replace(/[^A-Za-z0-9]/g, '')
      if (cleaned.length >= 16) return formatAsBarcode(cleaned.substring(0, 16))
      const code = findBarcodeInText(afterColon[1])
      if (code) return code
    }
  }

  return null
}

function findAlphanumericBlock(text: string): string | null {
  const clean = text.replace(/[^A-Za-z0-9]/g, '')

  let idx = 0
  while (true) {
    const nvPos = clean.toUpperCase().indexOf('NV', idx)
    if (nvPos < 0 || nvPos + 16 > clean.length) break
    const candidate = clean.substring(nvPos, nvPos + 16)
    if (/^[A-Za-z0-9]{16}$/.test(candidate) && /[0-9]/.test(candidate)) {
      if (!candidate.toUpperCase().startsWith('NVI') || /\d/.test(candidate.substring(0, 4))) {
        return formatAsBarcode(candidate)
      }
    }
    idx = nvPos + 1
  }

  return null
}

function formatAsBarcode(raw: string): string {
  const clean = raw.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
  if (clean.length >= 16) {
    return `${clean.slice(0, 4)}-${clean.slice(4, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}`
  }
  return clean.toUpperCase()
}

// ============================================================
// QR KOD TARAMA
// ============================================================

async function scanPageForQR(page: any, scale: number): Promise<BarcodeResult | null> {
  try {
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    await page.render({ canvasContext: ctx, viewport }).promise

    let result = await scanCanvasForCodes(canvas)
    if (result) return result

    // Top half
    result = await scanRegion(canvas, 0, 0, canvas.width, Math.floor(canvas.height / 2))
    if (result) return result

    // Top-right quadrant (where QR codes often are)
    result = await scanRegion(canvas, Math.floor(canvas.width / 2), 0, Math.floor(canvas.width / 2), Math.floor(canvas.height / 2))
    if (result) return result

    return null
  } catch (error) {
    console.warn('[barcode] Canvas scan error at scale', scale, error)
    return null
  }
}

async function scanRegion(
  source: HTMLCanvasElement,
  x: number, y: number, w: number, h: number
): Promise<BarcodeResult | null> {
  if (w < 50 || h < 50) return null
  const regionCanvas = document.createElement('canvas')
  regionCanvas.width = w
  regionCanvas.height = h
  const ctx = regionCanvas.getContext('2d')!
  ctx.drawImage(source, x, y, w, h, 0, 0, w, h)
  return scanCanvasForCodes(regionCanvas)
}

async function scanCanvasForCodes(canvas: HTMLCanvasElement): Promise<BarcodeResult | null> {
  const ctx = canvas.getContext('2d')!
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

  try {
    const qrResult = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth',
    })
    if (qrResult?.data) {
      const raw = qrResult.data.trim()
      console.log('[barcode] jsQR found:', raw)
      let code = findBarcodeInText(raw)
      if (code) return { code, source: 'qr-scan', confidence: 'high' }

      if (raw.includes('turkiye.gov.tr') || raw.includes('barkodNo')) {
        code = extractCodeFromUrl(raw)
        if (code) return { code, source: 'qr-scan', confidence: 'high' }
      }
    }
  } catch (e) {
    console.warn('[barcode] jsQR error:', e)
  }

  try {
    if ('BarcodeDetector' in window) {
      const detector = new (window as any).BarcodeDetector({
        formats: ['qr_code', 'code_128', 'code_39', 'data_matrix', 'pdf417']
      })
      const barcodes = await detector.detect(canvas)
      for (const barcode of barcodes) {
        const raw = (barcode.rawValue || '').trim()
        if (!raw) continue
        console.log('[barcode] BarcodeDetector found:', raw)
        let code = findBarcodeInText(raw)
        if (code) return { code, source: 'barcode-api', confidence: 'high' }
        if (raw.includes('barkodNo')) {
          code = extractCodeFromUrl(raw)
          if (code) return { code, source: 'barcode-api', confidence: 'high' }
        }
      }
    }
  } catch (e) {
    console.warn('[barcode] BarcodeDetector error:', e)
  }

  return null
}

function extractCodeFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    for (const param of ['barkodNo', 'barkod', 'code', 'belgeNo']) {
      const val = urlObj.searchParams.get(param)
      if (val) {
        const code = findBarcodeInText(val)
        if (code) return code
        const cleaned = val.replace(/[^A-Za-z0-9]/g, '')
        if (cleaned.length >= 16) return formatAsBarcode(cleaned.substring(0, 16))
      }
    }
  } catch {
    const paramMatch = url.match(/barkodNo[=:]\s*([A-Za-z0-9\-]+)/i)
    if (paramMatch) {
      const cleaned = paramMatch[1].replace(/[^A-Za-z0-9]/g, '')
      if (cleaned.length >= 16) return formatAsBarcode(cleaned.substring(0, 16))
    }
  }
  return null
}

// ============================================================
// GÖRÜNTÜ İŞLEME
// ============================================================

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
    return scanCanvasForCodes(canvas)
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
  const c10 = ((d[0] + d[2] + d[4] + d[6] + d[8]) * 7 - (d[1] + d[3] + d[5] + d[7])) % 10
  if ((c10 < 0 ? c10 + 10 : c10) !== d[9]) return false
  return d.slice(0, 10).reduce((a, b) => a + b, 0) % 10 === d[10]
}

function findTCKimlikNo(text: string): string | null {
  const matches = text.match(/\b([1-9]\d{10})\b/g)
  if (!matches) return null
  for (const match of matches) {
    if (isValidTCKimlik(match)) return match
  }
  return null
}
