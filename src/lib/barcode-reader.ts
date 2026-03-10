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

    const numPages = Math.min(pdf.numPages, 5)

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      const items = textContent.items as any[]

      // Yöntem 1: Boşlukla birleştir
      const pageTextSpaced = items.map((item: any) => item.str).join(' ')
      let code = findEdevletCode(pageTextSpaced)
      if (code) return { code, source: 'pdf-text', confidence: 'high' }

      // Yöntem 2: Boşluksuz birleştir
      const pageTextNoSpace = items.map((item: any) => item.str).join('')
      code = findEdevletCode(pageTextNoSpace)
      if (code) return { code, source: 'pdf-text', confidence: 'high' }

      // Yöntem 3: Satır bazlı birleştir (Y koordinatına göre)
      const lineText = extractTextByLines(items)
      code = findEdevletCode(lineText)
      if (code) return { code, source: 'pdf-text', confidence: 'high' }

      // Yöntem 4: Her satırı ayrı ayrı dene
      const lines = lineText.split('\n')
      for (const line of lines) {
        code = findEdevletCode(line)
        if (code) return { code, source: 'pdf-text', confidence: 'high' }
      }

      // Yöntem 5: İtem bazlı anahtar kelime kontrol
      code = findCodeNearKeyword(items)
      if (code) return { code, source: 'pdf-text', confidence: 'medium' }

      // Yöntem 6: Tüm text item'ları tek tek kontrol et
      for (const item of items) {
        const str = (item.str || '').trim()
        if (str.length >= 15) {
          code = findEdevletCode(str)
          if (code) return { code, source: 'pdf-text', confidence: 'medium' }
        }
      }

      // Debug logları
      console.log(`[barcode-reader] Page ${pageNum} spaced (first 600):`, pageTextSpaced.substring(0, 600))
      console.log(`[barcode-reader] Page ${pageNum} lines:`, lines.slice(0, 20))
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

  const lines: Map<number, Array<{ str: string; x: number }>> = new Map()
  for (const item of items) {
    if (!item.str.trim()) continue
    const y = Math.round((item.transform?.[5] || 0) / 2) * 2
    const x = item.transform?.[4] || 0
    if (!lines.has(y)) lines.set(y, [])
    lines.get(y)!.push({ str: item.str, x })
  }

  // Her satırı X koordinatına göre sırala ve birleştir
  return Array.from(lines.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([, texts]) => {
      texts.sort((a, b) => a.x - b.x)
      return texts.map(t => t.str).join('')
    })
    .join('\n')
}

/**
 * Anahtar kelime yakınında kod ara (PDF item bazlı)
 * "Barkod", "Doğrulama", "Belge No" gibi kelimelerin yakınındaki text item'lardan kod çıkar
 */
function findCodeNearKeyword(items: Array<{ str: string; transform: number[] }>): string | null {
  const keywords = ['barkod', 'doğrulama', 'belge no', 'referans', 'sorgu', 'kontrol']

  for (let i = 0; i < items.length; i++) {
    const itemText = (items[i].str || '').toLowerCase()
    const isKeyword = keywords.some(kw => itemText.includes(kw))

    if (isKeyword) {
      // Yakın item'ları topla (önceki 3, sonraki 5)
      const start = Math.max(0, i - 3)
      const end = Math.min(items.length, i + 6)
      const nearbyText = items.slice(start, end).map(it => it.str).join(' ')

      const code = findEdevletCode(nearbyText)
      if (code) return code

      // Birleşik de dene
      const nearbyJoined = items.slice(start, end).map(it => it.str).join('')
      const code2 = findEdevletCode(nearbyJoined)
      if (code2) return code2
    }
  }
  return null
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

    const barcodeResult = await detectBarcodeFromCanvas(canvas)
    if (barcodeResult) return barcodeResult

    return null
  } catch (error) {
    console.error('Image extraction error:', error)
    return null
  }
}

/**
 * BarcodeDetector API ile barkod oku
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
          const code = findEdevletCode(raw)
          if (code) return { code, source: 'barcode-api', confidence: 'high' }
          if (raw.length >= 8) return { code: raw, source: 'barcode-api', confidence: 'medium' }
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
 *
 * Çok esnek arama stratejisi:
 * 1. Standart format: XXXX-XXXX-XXXX-XXXX
 * 2. Boşluklu format: XXXX - XXXX - XXXX - XXXX
 * 3. Farklı tire tipleri: –, —, ‐
 * 4. Tiresiz 16 karakter alfanumerik blok
 * 5. 4'lü gruplar (boşluk/tire/nokta ile ayrılmış)
 * 6. Harfler+rakamlar mixed pattern (e-Devlet kodları genelde mixed)
 */
function findEdevletCode(text: string): string | null {
  if (!text || text.length < 10) return null

  // ---- Yöntem 1: Standart XXXX-XXXX-XXXX-XXXX ----
  const strictPattern = /([A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4})/g
  const strictMatches = [...text.matchAll(strictPattern)]
  if (strictMatches.length > 0) {
    // NV ile başlayanı tercih et
    for (const m of strictMatches) {
      if (m[1].toUpperCase().startsWith('NV')) return m[1].toUpperCase()
    }
    return strictMatches[0][1].toUpperCase()
  }

  // ---- Yöntem 2: Gevşek tire/boşluk (her türlü ayırıcı) ----
  const loosePattern = /([A-Za-z0-9]{4})\s*[-–—‐.:/\\|]\s*([A-Za-z0-9]{4})\s*[-–—‐.:/\\|]\s*([A-Za-z0-9]{4})\s*[-–—‐.:/\\|]\s*([A-Za-z0-9]{4})/g
  const looseMatches = [...text.matchAll(loosePattern)]
  if (looseMatches.length > 0) {
    for (const m of looseMatches) {
      const code = `${m[1]}-${m[2]}-${m[3]}-${m[4]}`.toUpperCase()
      if (code.startsWith('NV')) return code
    }
    return `${looseMatches[0][1]}-${looseMatches[0][2]}-${looseMatches[0][3]}-${looseMatches[0][4]}`.toUpperCase()
  }

  // ---- Yöntem 3: 4'lü gruplar boşlukla ayrılmış (tire yok) ----
  const spaceGroupPattern = /\b([A-Za-z0-9]{4})\s+([A-Za-z0-9]{4})\s+([A-Za-z0-9]{4})\s+([A-Za-z0-9]{4})\b/g
  const spaceMatches = [...text.matchAll(spaceGroupPattern)]
  if (spaceMatches.length > 0) {
    for (const m of spaceMatches) {
      const combined = m[1] + m[2] + m[3] + m[4]
      // Sadece sayı veya sadece harf değilse (mixed olmalı)
      if (isMixedAlphaNum(combined)) {
        const code = `${m[1]}-${m[2]}-${m[3]}-${m[4]}`.toUpperCase()
        if (code.startsWith('NV')) return code
        return code
      }
    }
  }

  // ---- Yöntem 4: Tüm ayırıcıları kaldır ve 16 karakterlik blok ara ----
  const normalized = text.replace(/[\s\-–—‐.:/\\|,;]+/g, '')
  const blockPattern = /([A-Za-z0-9]{16,20})/g
  const blockMatches = [...normalized.matchAll(blockPattern)]
  for (const m of blockMatches) {
    const block = m[1]
    // NV ile başlayan 16 karakter
    const nvIdx = block.toUpperCase().indexOf('NV')
    if (nvIdx >= 0 && nvIdx + 16 <= block.length) {
      const sub = block.substring(nvIdx, nvIdx + 16)
      if (isMixedAlphaNum(sub)) {
        return `${sub.slice(0,4)}-${sub.slice(4,8)}-${sub.slice(8,12)}-${sub.slice(12,16)}`.toUpperCase()
      }
    }
    // NV olmasa bile, 16 karakter mixed alfanumerik
    if (block.length >= 16 && isMixedAlphaNum(block.substring(0, 16))) {
      const sub = block.substring(0, 16)
      // Saf sayı değilse (TC Kimlik No ile karışmasın)
      if (!/^\d+$/.test(sub)) {
        return `${sub.slice(0,4)}-${sub.slice(4,8)}-${sub.slice(8,12)}-${sub.slice(12,16)}`.toUpperCase()
      }
    }
  }

  // ---- Yöntem 5: Sadece alfanumerikleri çıkar ve 16'lı blok ara ----
  const onlyAlphaNum = text.replace(/[^A-Za-z0-9]/g, '')
  if (onlyAlphaNum.length >= 16) {
    // NV ile başlayan yeri bul
    const nvPos = onlyAlphaNum.toUpperCase().indexOf('NV')
    if (nvPos >= 0 && nvPos + 16 <= onlyAlphaNum.length) {
      const sub = onlyAlphaNum.substring(nvPos, nvPos + 16)
      return `${sub.slice(0,4)}-${sub.slice(4,8)}-${sub.slice(8,12)}-${sub.slice(12,16)}`.toUpperCase()
    }
  }

  // ---- Yöntem 6: Kısa parçaları bitişik birleştirip dene ----
  // PDF bazen "NV" "02" "-" "IL" "LE" gibi parçalar çıkarır
  const pieces = text.split(/\s+/)
  if (pieces.length >= 3 && pieces.length <= 30) {
    const joined = pieces.join('')
    if (joined !== text) {
      const result = findEdevletCode(joined) // recursive ama farklı input
      if (result) return result
    }
  }

  return null
}

/**
 * Hem harf hem rakam içeren alfanumerik mi?
 */
function isMixedAlphaNum(s: string): boolean {
  return /[A-Za-z]/.test(s) && /[0-9]/.test(s)
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
 * TC Kimlik No'yu metinden bul
 */
function findTCKimlikNo(text: string): string | null {
  const matches = text.match(/\b([1-9]\d{10})\b/g)
  if (!matches) return null
  for (const match of matches) {
    if (isValidTCKimlik(match)) return match
  }
  return null
}

/**
 * PDF'den tüm belge bilgilerini çıkar
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

      const spaced = items.map((item: any) => item.str).join(' ')
      const noSpace = items.map((item: any) => item.str).join('')
      const byLines = extractTextByLines(items)

      allTextSpaced += ' ' + spaced
      allTextNoSpace += noSpace
      allTextByLines += '\n' + byLines
    }

    // Debug logging
    console.log('[barcode-reader] Full text (spaced, first 1000):', allTextSpaced.substring(0, 1000))
    console.log('[barcode-reader] Full text (by lines, first 1000):', allTextByLines.substring(0, 1000))
    console.log('[barcode-reader] All items count:', allItems.length)
    console.log('[barcode-reader] First 30 items:', allItems.slice(0, 30).map((i: any) => i.str))

    // Barkod kodu - tüm yöntemlerle dene
    let code = findEdevletCode(allTextSpaced)
    if (!code) code = findEdevletCode(allTextNoSpace)
    if (!code) code = findEdevletCode(allTextByLines)

    // Her satırı ayrı dene
    if (!code) {
      const lines = allTextByLines.split('\n')
      for (const line of lines) {
        code = findEdevletCode(line)
        if (code) break
      }
    }

    // Anahtar kelime yakınında ara
    if (!code) {
      code = findCodeNearKeyword(allItems)
    }

    // Her item'ı tek tek dene
    if (!code) {
      for (const item of allItems) {
        const str = (item.str || '').trim()
        if (str.length >= 4) {
          code = findEdevletCode(str)
          if (code) break
        }
      }
    }

    // Bitişik item'ları birleştirerek dene (sliding window)
    if (!code) {
      for (let i = 0; i < allItems.length - 3; i++) {
        const window = allItems.slice(i, i + 8).map((it: any) => it.str || '').join('')
        code = findEdevletCode(window)
        if (code) break
      }
    }

    // TC Kimlik No
    let tcKimlikNo = findTCKimlikNo(allTextSpaced)
    if (!tcKimlikNo) tcKimlikNo = findTCKimlikNo(allTextNoSpace)
    if (!tcKimlikNo) tcKimlikNo = findTCKimlikNo(allTextByLines)

    // Metin analizi
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
    if (ilceIlMatch) {
      district = ilceIlMatch[1].trim()
      city = ilceIlMatch[2].trim()
    }

    const addressMatch = pageText.match(/(?:Adres|Yerleşim\s*Yeri\s*Adresi?)\s*[:\-]?\s*(.+?)(?:\n|Belge|Nüfus|Düzenle)/i)
    if (addressMatch) address = addressMatch[1].trim().replace(/\s+/g, ' ')

    return {
      code, tcKimlikNo, fullName, address, neighborhood, district, city,
      source: 'pdf-text',
    }
  } catch (error) {
    console.error('Full document extraction error:', error)
    return null
  }
}
