/**
 * e-Devlet Belge Doğrulama Kodu Okuyucu v3
 *
 * e-Devlet adres belgelerinden doğrulama kodunu (barkod numarası) otomatik çıkarır.
 * Barkod No formatı: 16 alfanumerik karakter (genellikle NV ile başlar)
 * Gösterim: XXXX-XXXX-XXXX-XXXX veya düz 16 karakter
 *
 * Stratejiler (sırasıyla):
 * 1. PDF metin çıkarma + çoklu pattern matching
 * 2. QR kod tarama (jsQR) - farklı çözünürlüklerde
 * 3. BarcodeDetector API (Chrome)
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
// PDF.JS WORKER SETUP
// ============================================================

let workerConfigured = false

async function getPdfjs() {
  const pdfjsLib = await import('pdfjs-dist')

  if (!workerConfigured) {
    // pdfjs-dist 4.x: CDN'den worker yükle
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`
    workerConfigured = true
  }

  return pdfjsLib
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
    const pdfjsLib = await getPdfjs()
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    console.log('[barcode] PDF loaded, pages:', pdf.numPages)

    // ===== AŞAMA 1: Metin Çıkarma (TÜM sayfalardan) =====
    let allRawText = ''
    let allItemTexts: string[] = []
    let allItems: any[] = []
    let allLineTexts = ''

    const numPages = Math.min(pdf.numPages, 5)
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      const items = textContent.items as any[]

      // Her item'ın metnini al
      for (const item of items) {
        const str = (item.str || '').trim()
        if (str) {
          allItemTexts.push(str)
          allItems.push(item)
        }
      }

      // Ham metinler - boşluklu
      allRawText += ' ' + items.map((i: any) => i.str || '').join(' ')
      // Satır satır metin
      allLineTexts += '\n' + extractTextByLines(items)
    }

    // Tüm metni temizle
    allRawText = allRawText.trim()

    // DEBUG LOG
    console.log('[barcode] Total text items:', allItemTexts.length)
    console.log('[barcode] Raw text (first 1000):', allRawText.substring(0, 1000))
    console.log('[barcode] Line text (first 1000):', allLineTexts.substring(0, 1000))
    console.log('[barcode] All item values:', allItemTexts.map(s => `"${s}"`).join(', '))

    // ===== Metin tabanlı barkod arama (ÇOK KAPSAMLI) =====
    let code: string | null = null

    // Strateji 1: Tüm text kaynakları üzerinde pattern search
    code = findBarcodeInText(allRawText)
    if (code) { console.log('[barcode] Found via raw text:', code); }

    if (!code) {
      code = findBarcodeInText(allLineTexts)
      if (code) { console.log('[barcode] Found via line text:', code); }
    }

    // Strateji 2: Her item'ı tek tek kontrol et
    if (!code) {
      for (const str of allItemTexts) {
        code = findBarcodeInText(str)
        if (code) { console.log('[barcode] Found in single item:', str, '->', code); break }
      }
    }

    // Strateji 3: Ardışık item'ları birleştir (2'li, 3'lü, 4'lü ... 16'lı)
    if (!code) {
      code = findCodeByCombiningItems(allItemTexts)
      if (code) { console.log('[barcode] Found by combining items:', code); }
    }

    // Strateji 4: "Barkod" / "Doğrulama" etiketi yakınında ara
    if (!code) {
      code = findCodeNearLabel(allItemTexts)
      if (code) { console.log('[barcode] Found near label:', code); }
    }

    // Strateji 5: Tüm alfanumerik blokları tara
    if (!code) {
      code = findAlphanumericBlock(allRawText)
      if (code) { console.log('[barcode] Found alphanumeric block:', code); }
    }

    // ===== AŞAMA 2: QR Kod Tarama (Canvas) =====
    if (!code) {
      console.log('[barcode] Text strategies failed, trying QR scan...')
      for (let pageNum = 1; pageNum <= Math.min(numPages, 2); pageNum++) {
        const page = await pdf.getPage(pageNum)
        // Çok farklı çözünürlüklerde dene
        for (const scale of [2.0, 3.0, 4.0, 5.0, 1.5]) {
          const result = await scanPageForQR(page, scale)
          if (result) {
            code = result.code
            console.log(`[barcode] Found via QR scan (page ${pageNum}, scale ${scale}):`, code)
            break
          }
        }
        if (code) break
      }
    }

    // TC Kimlik No
    const tcKimlikNo = findTCKimlikNo(allRawText) || findTCKimlikNo(allLineTexts)

    // Ad, adres bilgileri
    let fullName: string | null = null
    const nameMatch = allRawText.match(/(?:Adı?\s*(?:ve\s*)?Soyadı?|Ad\s*Soyad)\s*[:\-]?\s*([A-ZÇĞİÖŞÜa-zçğıöşü\s]+?)(?:\s*T\.C\.|Doğum|Adres|Nüfus)/i)
    if (nameMatch) fullName = nameMatch[1].trim()

    let neighborhood: string | null = null
    let district: string | null = null
    let city: string | null = null
    let address: string | null = null

    const mahalleMatch = allRawText.match(/([A-ZÇĞİÖŞÜa-zçğıöşü]+\s*MAH\.?)/i)
    if (mahalleMatch) neighborhood = mahalleMatch[1].trim()

    const ilceIlMatch = allRawText.match(/([A-ZÇĞİÖŞÜ]+)\s*\/\s*([A-ZÇĞİÖŞÜ]+)\s*$/m)
    if (ilceIlMatch) { district = ilceIlMatch[1].trim(); city = ilceIlMatch[2].trim() }

    const addressMatch = allRawText.match(/(?:Adres|Yerleşim\s*Yeri\s*Adresi?)\s*[:\-]?\s*(.+?)(?:\n|Belge|Nüfus|Düzenle)/i)
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
// BARKOD BULMA STRATEJİLERİ
// ============================================================

/**
 * Metinde e-Devlet barkod kodu ara
 * Çok esnek: tire ile, tiresiz, boşluklu, her türlü formatı yakalar
 */
function findBarcodeInText(text: string): string | null {
  if (!text || text.length < 8) return null

  // 1. XXXX-XXXX-XXXX-XXXX (standart tire formatı)
  const dashPattern = /\b([A-Za-z0-9]{4})-([A-Za-z0-9]{4})-([A-Za-z0-9]{4})-([A-Za-z0-9]{4})\b/g
  const dashMatches = [...text.matchAll(dashPattern)]
  if (dashMatches.length > 0) {
    // NV ile başlayanı tercih et
    const nvMatch = dashMatches.find(m => m[0].toUpperCase().startsWith('NV'))
    const best = nvMatch || dashMatches[0]
    return best[0].toUpperCase()
  }

  // 2. Çeşitli ayırıcılarla (boşluk, nokta, eğik çizgi vb.)
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
    // Alfanumerik karışık olmalı (sadece rakam değil)
    if (/[A-Za-z]/.test(combined) && /[0-9]/.test(combined)) {
      return `${m[1]}-${m[2]}-${m[3]}-${m[4]}`.toUpperCase()
    }
  }

  // 4. "NV" ile başlayan herhangi bir 16 karakter alfanumerik blok
  const cleanText = text.replace(/[\s\-–—‐.:\/\\|,;()[\]{}]+/g, '')
  const nvIdx = cleanText.toUpperCase().indexOf('NV')
  if (nvIdx >= 0 && nvIdx + 16 <= cleanText.length) {
    const sub = cleanText.substring(nvIdx, nvIdx + 16)
    if (/^[A-Za-z0-9]{16}$/.test(sub)) {
      return formatAsBarcode(sub)
    }
  }

  // 5. "barkodNo=" parametresi olan URL
  const urlMatch = text.match(/barkodNo[=:]\s*([A-Za-z0-9\-]{10,25})/i)
  if (urlMatch) {
    const cleaned = urlMatch[1].replace(/[^A-Za-z0-9]/g, '')
    if (cleaned.length >= 16) {
      return formatAsBarcode(cleaned.substring(0, 16))
    }
  }

  // 6. turkiye.gov.tr URL'i
  const urlFullMatch = text.match(/turkiye\.gov\.tr[^\s]*barkodNo[=:]\s*([A-Za-z0-9\-]+)/i)
  if (urlFullMatch) {
    const cleaned = urlFullMatch[1].replace(/[^A-Za-z0-9]/g, '')
    if (cleaned.length >= 16) {
      return formatAsBarcode(cleaned.substring(0, 16))
    }
  }

  return null
}

/**
 * Ardışık item'ları birleştirerek barkod bul
 * PDF'de barkod metni parçalar halinde olabileceği için
 */
function findCodeByCombiningItems(items: string[]): string | null {
  // 2'li, 3'lü, ... 20'li pencereler
  for (let windowSize = 2; windowSize <= Math.min(20, items.length); windowSize++) {
    for (let i = 0; i <= items.length - windowSize; i++) {
      const window = items.slice(i, i + windowSize)

      // Birleşik (boşluksuz)
      const joined = window.join('')
      let code = findBarcodeInText(joined)
      if (code) return code

      // Boşluklu
      const spaced = window.join(' ')
      code = findBarcodeInText(spaced)
      if (code) return code

      // Tire ile
      const dashed = window.join('-')
      code = findBarcodeInText(dashed)
      if (code) return code
    }
  }

  // Son çare: tüm item'ları birleştirip NV ara
  const allJoined = items.join('')
  const nvIdx = allJoined.toUpperCase().indexOf('NV')
  if (nvIdx >= 0 && nvIdx + 16 <= allJoined.length) {
    const sub = allJoined.substring(nvIdx, nvIdx + 16)
    if (/^[A-Za-z0-9]{16}$/.test(sub)) {
      return formatAsBarcode(sub)
    }
  }

  return null
}

/**
 * "Barkod" veya "Doğrulama" gibi etiketlerin yakınındaki değeri bul
 */
function findCodeNearLabel(items: string[]): string | null {
  const labels = ['barkod', 'doğrulama', 'dogrulama', 'belge no', 'referans', 'sorgu no', 'kontrol']

  for (let i = 0; i < items.length; i++) {
    const lower = items[i].toLowerCase()
    const isLabel = labels.some(l => lower.includes(l))
    if (!isLabel) continue

    console.log(`[barcode] Found label "${items[i]}" at index ${i}`)

    // Etiketin sonrasındaki 15 item'a bak
    for (let range = 1; range <= 15; range++) {
      if (i + range >= items.length) break

      // Tek tek dene
      const val = items[i + range]
      let code = findBarcodeInText(val)
      if (code) return code

      // Birleştirerek dene (etiketin sonrası)
      const afterItems = items.slice(i + 1, i + 1 + range)
      code = findBarcodeInText(afterItems.join(''))
      if (code) return code
      code = findBarcodeInText(afterItems.join(' '))
      if (code) return code
      code = findBarcodeInText(afterItems.join('-'))
      if (code) return code
    }

    // Etiketin kendisi ile sonraki item'ları birleştir
    // Bazen "Barkod No:NV02ILLEG5U8RLN9" gibi birleşik olabilir
    const labelAndNext = items.slice(i, Math.min(i + 5, items.length)).join('')
    const afterColon = labelAndNext.match(/(?:barkod|doğrulama|dogrulama)\s*(?:no|kodu|numarası|numarasi)?\s*[:\-=]?\s*(.+)/i)
    if (afterColon) {
      const cleaned = afterColon[1].replace(/[^A-Za-z0-9]/g, '')
      if (cleaned.length >= 16) {
        return formatAsBarcode(cleaned.substring(0, 16))
      }
      // Daha kısa ama potansiyel kod
      const code = findBarcodeInText(afterColon[1])
      if (code) return code
    }
  }

  return null
}

/**
 * Tüm metin içinde herhangi bir 16 karakterlik alfanumerik mixed blok bul
 * Bu en geniş ve son çare strateji
 */
function findAlphanumericBlock(text: string): string | null {
  // Tüm ayırıcıları kaldır
  const clean = text.replace(/[^A-Za-z0-9]/g, '')

  // NV ile başlayan herhangi bir yeri bul
  let idx = 0
  while (true) {
    const nvPos = clean.toUpperCase().indexOf('NV', idx)
    if (nvPos < 0 || nvPos + 16 > clean.length) break

    const candidate = clean.substring(nvPos, nvPos + 16)
    if (/^[A-Za-z0-9]{16}$/.test(candidate) && /[0-9]/.test(candidate)) {
      // NVI (Nüfus ve Vatandaşlık İşleri) gibi kelimeleri atla
      if (!candidate.toUpperCase().startsWith('NVI') || /\d/.test(candidate.substring(0, 4))) {
        return formatAsBarcode(candidate)
      }
    }
    idx = nvPos + 1
  }

  // NV yoksa, harfle başlayan ve içinde hem harf hem rakam olan 16'lı bloklar
  // Bu çok geniş olabilir, sadece belirli koşullarda kullan
  const blocks = clean.match(/[A-Za-z][A-Za-z0-9]{15}/g)
  if (blocks) {
    for (const block of blocks) {
      const upper = block.toUpperCase()
      // Yaygın kelimeler/kısaltmalar değilse
      if (
        /[0-9]/.test(block) &&       // En az 1 rakam
        /[A-Za-z]/.test(block) &&     // En az 1 harf
        !/^[A-Z]+$/.test(upper) &&    // Tamamen büyük harf kelime değil
        !/^(YERLESIMYERIVE|NUFUSVEVATAN|TURKIYECUMHUR)/.test(upper) // Bilinen kelimeler değil
      ) {
        // En az 3 rakam ve 3 harf içermeli (gerçek barkod)
        const digitCount = (block.match(/[0-9]/g) || []).length
        const letterCount = (block.match(/[A-Za-z]/g) || []).length
        if (digitCount >= 3 && letterCount >= 3) {
          return formatAsBarcode(block)
        }
      }
    }
  }

  return null
}

/**
 * 16 karakterlik string'i XXXX-XXXX-XXXX-XXXX formatına çevir
 */
function formatAsBarcode(raw: string): string {
  const clean = raw.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
  if (clean.length >= 16) {
    return `${clean.slice(0, 4)}-${clean.slice(4, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}`
  }
  return clean.toUpperCase()
}

// ============================================================
// METİN SATIR ÇIKARMA
// ============================================================

function extractTextByLines(items: Array<{ str: string; transform: number[] }>): string {
  if (items.length === 0) return ''
  const lines: Map<number, Array<{ str: string; x: number }>> = new Map()

  for (const item of items) {
    if (!item.str.trim()) continue
    // Y koordinatını 2 piksel hassasiyetle grupla
    const y = Math.round((item.transform?.[5] || 0) / 2) * 2
    const x = item.transform?.[4] || 0
    if (!lines.has(y)) lines.set(y, [])
    lines.get(y)!.push({ str: item.str, x })
  }

  return Array.from(lines.entries())
    .sort((a, b) => b[0] - a[0]) // üstten alta
    .map(([, texts]) => {
      texts.sort((a, b) => a.x - b.x) // soldan sağa
      return texts.map(t => t.str).join(' ')
    })
    .join('\n')
}

// ============================================================
// QR KOD / BARKOD TARAMA (Canvas)
// ============================================================

async function scanPageForQR(page: any, scale: number): Promise<BarcodeResult | null> {
  try {
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext('2d')!

    // Beyaz arka plan (bazı PDF'ler transparent olabilir)
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    await page.render({ canvasContext: ctx, viewport }).promise

    // Tam sayfa QR tara
    let result = await scanCanvasForCodes(canvas)
    if (result) return result

    // Bölge tarama: üst yarı (QR genelde üstte)
    result = await scanRegion(canvas, 0, 0, canvas.width, Math.floor(canvas.height / 2))
    if (result) return result

    // Alt yarı
    result = await scanRegion(canvas, 0, Math.floor(canvas.height / 2), canvas.width, Math.floor(canvas.height / 2))
    if (result) return result

    // Sol üst çeyrek
    result = await scanRegion(canvas, 0, 0, Math.floor(canvas.width / 2), Math.floor(canvas.height / 2))
    if (result) return result

    // Sağ üst çeyrek
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

  // 1. jsQR - tüm tarayıcılarda çalışır
  try {
    const qrResult = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth',
    })
    if (qrResult && qrResult.data) {
      const raw = qrResult.data.trim()
      console.log('[barcode] jsQR found:', raw)

      // Direkt barkod kodu
      let code = findBarcodeInText(raw)
      if (code) return { code, source: 'qr-scan', confidence: 'high' }

      // URL ise parametrelerden çıkar
      if (raw.includes('turkiye.gov.tr') || raw.includes('belge-dogrulama') || raw.includes('barkodNo')) {
        code = extractCodeFromUrl(raw)
        if (code) return { code, source: 'qr-scan', confidence: 'high' }
      }

      // Ham değer (yeterli uzunlukta)
      const cleaned = raw.replace(/[^A-Za-z0-9]/g, '')
      if (cleaned.length >= 16) {
        return { code: formatAsBarcode(cleaned.substring(0, 16)), source: 'qr-scan', confidence: 'medium' }
      }
    }
  } catch (e) {
    console.warn('[barcode] jsQR error:', e)
  }

  // 2. BarcodeDetector API (varsa)
  try {
    if ('BarcodeDetector' in window) {
      const detector = new (window as any).BarcodeDetector({
        formats: ['qr_code', 'code_128', 'code_39', 'data_matrix', 'pdf417', 'aztec', 'ean_13', 'ean_8']
      })
      const barcodes = await detector.detect(canvas)
      for (const barcode of barcodes) {
        const raw = (barcode.rawValue || '').trim()
        if (!raw) continue
        console.log('[barcode] BarcodeDetector found:', raw)

        let code = findBarcodeInText(raw)
        if (code) return { code, source: 'barcode-api', confidence: 'high' }

        if (raw.includes('turkiye.gov.tr') || raw.includes('barkodNo')) {
          code = extractCodeFromUrl(raw)
          if (code) return { code, source: 'barcode-api', confidence: 'high' }
        }

        const cleaned = raw.replace(/[^A-Za-z0-9]/g, '')
        if (cleaned.length >= 16) {
          return { code: formatAsBarcode(cleaned.substring(0, 16)), source: 'barcode-api', confidence: 'medium' }
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
    for (const param of ['barkodNo', 'barkod', 'code', 'belgeNo', 'referans']) {
      const val = urlObj.searchParams.get(param)
      if (val) {
        const code = findBarcodeInText(val)
        if (code) return code
        const cleaned = val.replace(/[^A-Za-z0-9]/g, '')
        if (cleaned.length >= 16) return formatAsBarcode(cleaned.substring(0, 16))
      }
    }
  } catch {
    // URL değilse parametreleri regex ile ara
    const paramMatch = url.match(/barkodNo[=:]\s*([A-Za-z0-9\-]+)/i)
    if (paramMatch) {
      const cleaned = paramMatch[1].replace(/[^A-Za-z0-9]/g, '')
      if (cleaned.length >= 16) return formatAsBarcode(cleaned.substring(0, 16))
    }
  }
  return null
}

// ============================================================
// TEK DOSYA FONKSİYONLARI
// ============================================================

async function extractFromPDF(file: File): Promise<BarcodeResult | null> {
  const fullResult = await extractFullDocumentInfo(file)
  if (fullResult?.code) {
    return { code: fullResult.code, source: fullResult.source, confidence: 'high' }
  }
  return null
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
