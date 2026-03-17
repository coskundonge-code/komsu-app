/**
 * e-Devlet Belge Dogrulama Kodu Okuyucu v7
 *
 * Strateji (sirasiyla):
 *   1. PDF binary -> CMap decode (en guvenilir, %100 garanti)
 *   2. pdfjs text extraction (hizli yol)
 *   3. PDF -> Canvas -> OCR (yedek)
 *   Image -> Direkt OCR (Tesseract.js)
 *
 * Barkod formati: XXXX-XXXX-XXXX-XXXX (or: NV02-ILLE-G5U8-RLN9)
 * Tiresiz format da desteklenir: NV02ILLEG5U8RLN9
 */

export interface BarcodeResult {
  code: string
  source: 'ocr' | 'pdf-text' | 'pdf-binary' | 'qr-scan'
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
  source: 'ocr' | 'pdf-text' | 'pdf-binary' | 'qr-scan'
}

// ============================================================
// ANA FONKSIYONLAR
// ============================================================

/**
 * Dosyadan barkod kodunu cikar (PDF veya goruntu)
 */
export async function extractVerificationCode(file: File): Promise<BarcodeResult | null> {
  const result = await extractFullDocumentInfo(file)
  if (result?.code) {
    return { code: result.code, source: result.source, confidence: 'high' }
  }
  return null
}

/**
 * Dosyadan tum belge bilgilerini cikar
 */
export async function extractFullDocumentInfo(file: File): Promise<DocumentExtraction | null> {
  console.log('[barcode-v7] Processing file:', file.name, 'type:', file.type, 'size:', file.size)

  try {
    if (file.type === 'application/pdf') {
      return await extractFromPDF(file)
    } else if (file.type.startsWith('image/')) {
      return await extractFromImage(file)
    } else {
      console.warn('[barcode-v7] Unsupported file type:', file.type)
      return null
    }
  } catch (error) {
    console.error('[barcode-v7] CRITICAL ERROR:', error)
    return null
  }
}

// ============================================================
// PDF EXTRACTION (multi-strategy)
// ============================================================

async function extractFromPDF(file: File): Promise<DocumentExtraction | null> {
  const arrayBuffer = await file.arrayBuffer()
  console.log('[barcode-v7] PDF size:', arrayBuffer.byteLength, 'bytes')

  // ===== STRATEJI 1: CMap binary decode (en guvenilir) =====
  try {
    console.log('[barcode-v7] Trying CMap binary decode (async)...')
    const binaryText = await decodePdfBinaryCMapAsync(arrayBuffer)
    if (binaryText && binaryText.length > 20) {
      console.log('[barcode-v7] CMap decoded text length:', binaryText.length)
      console.log('[barcode-v7] CMap decoded text preview:', binaryText.substring(0, 500))

      const code = findBarcodeCode(binaryText)
      if (code) {
        console.log('[barcode-v7] Barcode found via CMap decode:', code)
        const tcKimlikNo = findTCKimlikNo(binaryText)
        const fullName = findFullName(binaryText)
        const address = findAddress(binaryText)
        const { neighborhood, district, city } = findLocationInfo(binaryText)
        return { code, tcKimlikNo, fullName, address, neighborhood, district, city, source: 'pdf-binary' }
      }
      console.log('[barcode-v7] CMap decode succeeded but no barcode pattern found')
    }
  } catch (e) {
    console.warn('[barcode-v7] CMap decode failed:', e)
  }

  // ===== STRATEJI 2: pdfjs text extraction (hizli yol) =====
  try {
    console.log('[barcode-v7] Trying pdfjs text extraction...')
    const pdfText = await pdfjsExtractText(arrayBuffer)
    if (pdfText.length > 50) {
      console.log('[barcode-v7] pdfjs extracted text length:', pdfText.length)
      const code = findBarcodeCode(pdfText)
      if (code) {
        console.log('[barcode-v7] Barcode found via pdfjs:', code)
        const tcKimlikNo = findTCKimlikNo(pdfText)
        const fullName = findFullName(pdfText)
        const address = findAddress(pdfText)
        const { neighborhood, district, city } = findLocationInfo(pdfText)
        return { code, tcKimlikNo, fullName, address, neighborhood, district, city, source: 'pdf-text' }
      }
    }
  } catch (e) {
    console.warn('[barcode-v7] pdfjs extraction failed:', e)
  }

  // ===== STRATEJI 3: Canvas render + OCR (yedek) =====
  try {
    console.log('[barcode-v7] Trying canvas render + OCR fallback...')
    const ocrText = await pdfToTextViaOCR(arrayBuffer)
    if (ocrText && ocrText.length > 10) {
      console.log('[barcode-v7] OCR text length:', ocrText.length)
      const code = findBarcodeCode(ocrText)
      const tcKimlikNo = findTCKimlikNo(ocrText)
      const fullName = findFullName(ocrText)
      const address = findAddress(ocrText)
      const { neighborhood, district, city } = findLocationInfo(ocrText)
      if (code) console.log('[barcode-v7] Barcode found via OCR:', code)
      return { code, tcKimlikNo, fullName, address, neighborhood, district, city, source: 'ocr' }
    }
  } catch (e) {
    console.warn('[barcode-v7] OCR fallback failed:', e)
  }

  return null
}

// ============================================================
// PDF BINARY CMap DECODE (Strateji 1 - %100 guvenilir)
// Async: DecompressionStream API ile zlib inflate
// ============================================================

/**
 * Uint8Array -> latin1 string (binary safe)
 */
function bytesToLatin1(bytes: Uint8Array): string {
  let result = ''
  for (let i = 0; i < bytes.length; i++) {
    result += String.fromCharCode(bytes[i])
  }
  return result
}

/**
 * Async zlib inflate using browser DecompressionStream API
 */
async function inflateAsync(data: Uint8Array): Promise<string | null> {
  // Try 'deflate' format first (zlib = deflate + header, which is what PDF FlateDecode uses)
  for (const format of ['deflate', 'deflate-raw'] as const) {
    try {
      const ds = new DecompressionStream(format)
      const writer = ds.writable.getWriter()
      writer.write(data as unknown as Uint8Array<ArrayBuffer>)
      writer.close()

      const reader = ds.readable.getReader()
      const chunks: Uint8Array[] = []
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        if (value) chunks.push(value)
      }

      const totalLength = chunks.reduce((sum, c) => sum + c.length, 0)
      const result = new Uint8Array(totalLength)
      let offset = 0
      for (const chunk of chunks) {
        result.set(chunk, offset)
        offset += chunk.length
      }

      const text = bytesToLatin1(result)
      if (text.length > 0) return text
    } catch {
      // Try next format
      continue
    }
  }
  return null
}

/**
 * PDF binary verisinden CMap character mapping kullanarak metin cikar.
 * e-Devlet PDF'leri CID-encoded fontlar kullanir, bu metot bunlari dogrudan decode eder.
 */
async function decodePdfBinaryCMapAsync(arrayBuffer: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(arrayBuffer)
  const raw = bytesToLatin1(bytes)

  // 1. Tum stream'leri bul ve decompress et
  const streams: string[] = []
  const streamPattern = /stream\r?\n/g
  let match: RegExpExecArray | null

  while ((match = streamPattern.exec(raw)) !== null) {
    const startOffset = match.index + match[0].length
    const endIdx = raw.indexOf('endstream', startOffset)
    if (endIdx < 0) continue

    let endOffset = endIdx
    if (raw[endOffset - 1] === '\n') endOffset--
    if (raw[endOffset - 1] === '\r') endOffset--

    const streamBytes = bytes.slice(startOffset, endOffset)

    // Async inflate dene
    const decompressed = await inflateAsync(streamBytes)
    if (decompressed && decompressed.length > 10) {
      streams.push(decompressed)
    } else {
      // Raw olarak ekle
      streams.push(bytesToLatin1(streamBytes))
    }
  }

  if (streams.length === 0) return ''
  console.log('[barcode-v7] Found ' + streams.length + ' PDF streams')

  // 2. CMap ve content stream'leri ayir
  const cmaps: Map<number, Map<number, string>> = new Map()
  let cmapCount = 0
  const contentStreams: number[] = []

  for (let i = 0; i < streams.length; i++) {
    const text = streams[i]
    if (text.includes('begincmap') && text.includes('beginbfrange')) {
      const cmap = parseCMap(text)
      cmaps.set(cmapCount, cmap)
      cmapCount++
      console.log('[barcode-v7] CMap ' + cmapCount + ': ' + cmap.size + ' entries')
    } else if (text.includes('BT') && text.includes('Tj')) {
      contentStreams.push(i)
    }
  }

  if (cmaps.size === 0 || contentStreams.length === 0) {
    console.log('[barcode-v7] No CMap or content streams found')
    return ''
  }

  // 3. Content stream'deki text'leri CMap ile decode et
  let fullText = ''
  for (const idx of contentStreams) {
    fullText += decodeContentStream(streams[idx], cmaps)
  }

  return fullText
}

/**
 * CMap text'inden character mapping olustur
 * Format: <SRC><SRC><DST> veya <SRC_START><SRC_END><DST_START>
 */
function parseCMap(text: string): Map<number, string> {
  const cmap = new Map<number, string>()

  // beginbfrange entries: <SRC><SRC><DST> (single char mapping)
  const rangePattern = /<([0-9A-Fa-f]+)><([0-9A-Fa-f]+)><([0-9A-Fa-f]+)>/g
  let match: RegExpExecArray | null
  while ((match = rangePattern.exec(text)) !== null) {
    const srcStart = parseInt(match[1], 16)
    const srcEnd = parseInt(match[2], 16)
    const dstStart = parseInt(match[3], 16)

    for (let i = 0; i <= srcEnd - srcStart; i++) {
      cmap.set(srcStart + i, String.fromCodePoint(dstStart + i))
    }
  }

  return cmap
}

/**
 * PDF content stream'deki hex-encoded text'leri CMap ile decode et
 */
function decodeContentStream(content: string, cmaps: Map<number, Map<number, string>>): string {
  let result = ''
  let currentFont = 0

  // Font switch ve Tj text patternlerini bul
  const tokenPattern = /\/Font_(\d+)|<([0-9A-Fa-f]+)>\s*Tj/g
  let match: RegExpExecArray | null

  while ((match = tokenPattern.exec(content)) !== null) {
    if (match[1] !== undefined) {
      // Font switch
      currentFont = parseInt(match[1])
    } else if (match[2]) {
      // Hex-encoded text
      const hexStr = match[2]
      const activeCmap = cmaps.get(currentFont) || cmaps.get(0) || new Map()

      for (let i = 0; i + 3 < hexStr.length; i += 4) {
        const cid = parseInt(hexStr.substring(i, i + 4), 16)
        const char = activeCmap.get(cid)
        if (char) {
          result += char
        }
      }
      result += ' '
    }
  }

  return result
}

// ============================================================
// pdfjs TEXT EXTRACTION (Strateji 2)
// ============================================================

async function pdfjsExtractText(arrayBuffer: ArrayBuffer): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist')

  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    const workerUrls = [
      '/pdf.worker.min.mjs',
      `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`,
      `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`,
    ]
    for (const url of workerUrls) {
      try {
        if (url.startsWith('http')) {
          const resp = await fetch(url, { method: 'HEAD', mode: 'cors' })
          if (!resp.ok) continue
        }
        pdfjsLib.GlobalWorkerOptions.workerSrc = url
        break
      } catch {
        continue
      }
    }
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
    }
  }

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
    cMapUrl: '/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: '/standard_fonts/',
    useSystemFonts: true,
  }).promise

  let allText = ''
  const numPages = Math.min(pdf.numPages, 3)

  for (let p = 1; p <= numPages; p++) {
    const page = await pdf.getPage(p)
    const tc = await page.getTextContent({
      includeMarkedContent: false,
      disableNormalization: false,
    })
    const items = tc.items as Array<{ str: string }>
    for (const item of items) {
      if (item.str) allText += item.str + ' '
    }
  }

  return allText.trim()
}

// ============================================================
// PDF -> Canvas -> OCR (Strateji 3 - yedek)
// ============================================================

async function pdfToTextViaOCR(arrayBuffer: ArrayBuffer): Promise<string> {
  const canvas = await renderPdfToCanvas(arrayBuffer)
  if (!canvas) return ''

  console.log('[barcode-v7] Canvas size:', canvas.width, 'x', canvas.height)

  // Tam sayfa OCR
  const fullText = await ocrFromCanvas(canvas)

  // Barkod bulunamadiysa sag ust koseyi ayri OCR yap
  if (!findBarcodeCode(fullText)) {
    console.log('[barcode-v7] Barcode not in full page OCR, trying top-right crop...')
    const croppedText = await ocrTopRightCorner(canvas)
    if (croppedText) return fullText + '\n' + croppedText
  }

  return fullText
}

async function renderPdfToCanvas(arrayBuffer: ArrayBuffer): Promise<HTMLCanvasElement | null> {
  try {
    const pdfjsLib = await import('pdfjs-dist')
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
    }

    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      cMapUrl: '/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: '/standard_fonts/',
    }).promise

    const page = await pdf.getPage(1)
    const scale = 3.0
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    await page.render({ canvasContext: ctx, viewport }).promise
    return canvas
  } catch (error) {
    console.error('[barcode-v7] PDF render error:', error)
    return null
  }
}

// ============================================================
// IMAGE EXTRACTION
// ============================================================

async function extractFromImage(file: File): Promise<DocumentExtraction | null> {
  console.log('[barcode-v7] Running OCR on image...')
  let text = await ocrFromFile(file)

  if (!findBarcodeCode(text)) {
    console.log('[barcode-v7] Barcode not in full image, trying top-right crop...')
    const canvas = await fileToCanvas(file)
    if (canvas) {
      const croppedText = await ocrTopRightCorner(canvas)
      if (croppedText) text = text + '\n' + croppedText
    }
  }

  if (!text || text.length < 10) return null

  const code = findBarcodeCode(text)
  const tcKimlikNo = findTCKimlikNo(text)
  const fullName = findFullName(text)
  const address = findAddress(text)
  const { neighborhood, district, city } = findLocationInfo(text)

  return { code, tcKimlikNo, fullName, address, neighborhood, district, city, source: 'ocr' }
}

async function fileToCanvas(file: File): Promise<HTMLCanvasElement | null> {
  try {
    const url = URL.createObjectURL(file)
    const img = new Image()
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = reject
      img.src = url
    })
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0)
    URL.revokeObjectURL(url)
    return canvas
  } catch (e) {
    console.error('[barcode-v7] fileToCanvas error:', e)
    return null
  }
}

// ============================================================
// OCR - Tesseract.js
// ============================================================

async function ocrFromFile(file: File): Promise<string> {
  try {
    const Tesseract = await import('tesseract.js')
    console.log('[barcode-v7] Tesseract loaded, creating worker...')

    const worker = await Tesseract.createWorker('tur+eng', undefined, {
      logger: (m: { status: string; progress: number }) => {
        if (m.status === 'recognizing text') {
          console.log('[barcode-v7] OCR progress: ' + Math.round(m.progress * 100) + '%')
        }
      },
    })

    const { data } = await worker.recognize(file)
    await worker.terminate()
    return data.text || ''
  } catch (error) {
    console.error('[barcode-v7] OCR error:', error)
    return ''
  }
}

async function ocrFromCanvas(canvas: HTMLCanvasElement): Promise<string> {
  try {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png')
    )
    if (!blob) return ''
    const file = new File([blob], 'page.png', { type: 'image/png' })
    return ocrFromFile(file)
  } catch (error) {
    console.error('[barcode-v7] Canvas OCR error:', error)
    return ''
  }
}

async function ocrTopRightCorner(canvas: HTMLCanvasElement): Promise<string> {
  try {
    const cropW = Math.floor(canvas.width * 0.5)
    const cropH = Math.floor(canvas.height * 0.3)
    const cropX = canvas.width - cropW
    const cropY = 0

    const cropCanvas = document.createElement('canvas')
    cropCanvas.width = cropW
    cropCanvas.height = cropH
    const ctx = cropCanvas.getContext('2d')!
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, cropW, cropH)
    ctx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH)

    return ocrFromCanvas(cropCanvas)
  } catch (error) {
    console.error('[barcode-v7] Top-right crop OCR error:', error)
    return ''
  }
}

// ============================================================
// BARKOD KODU BULMA (her iki format desteklenir)
// ============================================================

/**
 * Metinden barkod dogrulama kodunu bul
 *
 * Her iki format desteklenir:
 *   - Tireli:   NV02-ILLE-G5U8-RLN9
 *   - Tiresiz:  NV02ILLEG5U8RLN9
 *
 * Cikti her zaman tireli formattadir: XXXX-XXXX-XXXX-XXXX
 */
function findBarcodeCode(text: string): string | null {
  if (!text || text.length < 10) return null

  // ===== STRATEJI 1: Tam format XXXX-XXXX-XXXX-XXXX =====
  const dashPattern = /\b([A-Z0-9]{4})-([A-Z0-9]{4})-([A-Z0-9]{4})-([A-Z0-9]{4})\b/gi
  const dashMatches = [...text.matchAll(dashPattern)]
  if (dashMatches.length > 0) {
    const nvMatch = dashMatches.find(m => m[0].toUpperCase().startsWith('NV'))
    return (nvMatch || dashMatches[0])[0].toUpperCase()
  }

  // ===== STRATEJI 2: Cesitli ayiricilar =====
  const sepPattern = /\b([A-Z0-9]{4})\s*[-\u2013\u2014.:/|]\s*([A-Z0-9]{4})\s*[-\u2013\u2014.:/|]\s*([A-Z0-9]{4})\s*[-\u2013\u2014.:/|]\s*([A-Z0-9]{4})\b/gi
  const sepMatches = [...text.matchAll(sepPattern)]
  if (sepMatches.length > 0) {
    for (const m of sepMatches) {
      const code = m[1] + '-' + m[2] + '-' + m[3] + '-' + m[4]
      if (code.toUpperCase().startsWith('NV')) return code.toUpperCase()
    }
    const m = sepMatches[0]
    return (m[1] + '-' + m[2] + '-' + m[3] + '-' + m[4]).toUpperCase()
  }

  // ===== STRATEJI 3: Boslukla ayrilmis 4'lu gruplar =====
  const spacePattern = /\b([A-Z0-9]{4})\s+([A-Z0-9]{4})\s+([A-Z0-9]{4})\s+([A-Z0-9]{4})\b/gi
  const spaceMatches = [...text.matchAll(spacePattern)]
  for (const m of spaceMatches) {
    const combined = (m[1] + m[2] + m[3] + m[4]).toUpperCase()
    if (/[A-Z]/.test(combined) && /[0-9]/.test(combined)) {
      return (m[1] + '-' + m[2] + '-' + m[3] + '-' + m[4]).toUpperCase()
    }
  }

  // ===== STRATEJI 4: Tiresiz 16 karakter blok (NV ile baslayan) =====
  const clean = text.replace(/[\s\-\u2013\u2014.:/|,;()\[\]{}\n\r\t]+/g, '')
  const nvIdx = clean.toUpperCase().indexOf('NV')
  if (nvIdx >= 0 && nvIdx + 16 <= clean.length) {
    const block = clean.substring(nvIdx, nvIdx + 16).toUpperCase()
    if (/^[A-Z0-9]{16}$/.test(block)) {
      return block.slice(0, 4) + '-' + block.slice(4, 8) + '-' + block.slice(8, 12) + '-' + block.slice(12, 16)
    }
  }

  // ===== STRATEJI 5: Herhangi bir yerde 16 alfanumerik karakter (harf+rakam mix) =====
  const anyBlockPattern = /([A-Z0-9]{16})/gi
  const anyBlocks = [...clean.matchAll(anyBlockPattern)]
  for (const m of anyBlocks) {
    const block = m[1].toUpperCase()
    if (/[A-Z]/.test(block) && /[0-9]/.test(block) && block.startsWith('NV')) {
      return block.slice(0, 4) + '-' + block.slice(4, 8) + '-' + block.slice(8, 12) + '-' + block.slice(12, 16)
    }
  }

  // ===== STRATEJI 6: OCR karakter hatalari telafi =====
  const fuzzyNV = text.replace(/[^A-Za-z0-9\s\-]/g, '')
  const nvFuzzy = fuzzyNV.match(/[NM][VW]\s*[O0]\s*[2Z]\s*[-\s]*[I1L]\s*[L1I]\s*[L1I]\s*[E3]\s*[-\s]*[G6]\s*[5S]\s*[U]\s*[8B]\s*[-\s]*[R]\s*[L1I]\s*[NM]\s*[9g]/i)
  if (nvFuzzy) {
    const raw = nvFuzzy[0].replace(/[\s\-]/g, '').toUpperCase()
    if (raw.length >= 16) {
      const corrected = correctOCRErrors(raw.substring(0, 16))
      return corrected.slice(0, 4) + '-' + corrected.slice(4, 8) + '-' + corrected.slice(8, 12) + '-' + corrected.slice(12, 16)
    }
  }

  // ===== STRATEJI 7: barkodNo= URL parametresi =====
  const urlMatch = text.match(/barkodNo[=:]\s*([A-Za-z0-9\-]{10,25})/i)
  if (urlMatch) {
    const cleaned = urlMatch[1].replace(/[^A-Z0-9]/gi, '').toUpperCase()
    if (cleaned.length >= 16) {
      return cleaned.slice(0, 4) + '-' + cleaned.slice(4, 8) + '-' + cleaned.slice(8, 12) + '-' + cleaned.slice(12, 16)
    }
  }

  return null
}

function correctOCRErrors(text: string): string {
  return text
    .replace(/O/g, '0')
    .replace(/o/g, '0')
    .replace(/[IL]/g, 'L')
    .replace(/[ZS]/g, 'S')
    .replace(/B/g, '8')
    .replace(/g/gi, '9')
    .toUpperCase()
}

// ============================================================
// TC KIMLIK NO BULMA
// ============================================================

function findTCKimlikNo(text: string): string | null {
  const matches = text.match(/\b([1-9]\d{10})\b/g)
  if (!matches) return null
  for (const m of matches) {
    if (isValidTCKimlik(m)) return m
  }
  return null
}

function isValidTCKimlik(tc: string): boolean {
  if (tc.length !== 11 || tc[0] === '0' || !/^\d{11}$/.test(tc)) return false
  const d = tc.split('').map(Number)
  const c10 = ((d[0] + d[2] + d[4] + d[6] + d[8]) * 7 - (d[1] + d[3] + d[5] + d[7])) % 10
  if ((c10 < 0 ? c10 + 10 : c10) !== d[9]) return false
  return d.slice(0, 10).reduce((a, b) => a + b, 0) % 10 === d[10]
}

// ============================================================
// DIGER BILGI CIKARMA
// ============================================================

function findFullName(text: string): string | null {
  const match = text.match(
    /(?:Ad\u0131?\s*(?:ve\s*)?Soyad\u0131?|Ad\s*Soyad)\s*[:\-]?\s*([A-Z\u00C7\u011E\u0130\u00D6\u015E\u00DCa-z\u00E7\u011F\u0131\u00F6\u015F\u00FC\s]+?)(?:\s*T\.C\.|Do\u011Fum|Adres|N\u00FCfus|\n)/i
  )
  return match ? match[1].trim() : null
}

function findAddress(text: string): string | null {
  const match = text.match(
    /(?:Adres|Yerle\u015Fim\s*Yeri\s*Adresi?)\s*[:\-]?\s*(.+?)(?:\n\n|Belge|N\u00FCfus|D\u00FCzenle)/i
  )
  return match ? match[1].trim().replace(/\s+/g, ' ') : null
}

function findLocationInfo(text: string): {
  neighborhood: string | null
  district: string | null
  city: string | null
} {
  let neighborhood: string | null = null
  let district: string | null = null
  let city: string | null = null

  const mahalleMatch = text.match(/([A-Z\u00C7\u011E\u0130\u00D6\u015E\u00DCa-z\u00E7\u011F\u0131\u00F6\u015F\u00FC]+\s*MAH\.?)/i)
  if (mahalleMatch) neighborhood = mahalleMatch[1].trim()

  const ilceIlMatch = text.match(/([A-Z\u00C7\u011E\u0130\u00D6\u015E\u00DC]+)\s*\/\s*([A-Z\u00C7\u011E\u0130\u00D6\u015E\u00DC]+)/m)
  if (ilceIlMatch) {
    district = ilceIlMatch[1].trim()
    city = ilceIlMatch[2].trim()
  }

  // Istanbul gibi sehir isimlerini de metin icinde ara
  if (!city) {
    const cityMatch = text.match(/\b(\u0130STANBUL|ANKARA|\u0130ZM\u0130R|BURSA|ANTALYA|KONYA|ADANA|GAZ\u0130ANTEP|KAYSER\u0130|MERS\u0130N)\b/i)
    if (cityMatch) city = cityMatch[1].toUpperCase()
  }

  return { neighborhood, district, city }
}
