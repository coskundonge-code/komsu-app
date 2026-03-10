/**
 * Barcode & NVI Code Reader Utility
 *
 * Extracts NVI verification codes from e-Devlet documents:
 * 1. PDF files: Extracts text and searches for NVI/barcode patterns
 * 2. Images: Uses BarcodeDetector API (Chrome) + OCR fallback via canvas
 *
 * NVI Code Format: Alphanumeric, typically found in e-Devlet address documents
 * Barcode format on turkiye.gov.tr documents: Numeric/alphanumeric barcode
 */

// NVI/Barcode code patterns found in e-Devlet documents
const NVI_PATTERNS = [
  // e-Devlet belge doğrulama kodu (genellikle büyük harf + rakam kombinasyonu)
  /(?:Belge\s*Doğrulama\s*(?:Kodu|No)\s*[:\s]*)?([A-Z0-9]{8,20})/gi,
  // NVI formatı
  /NVI[-\s]?(\d{8,14})/gi,
  // Barkod numarası
  /(?:Barkod|Barcode)\s*(?:No|Numarası)?\s*[:\s]*([A-Z0-9]{8,20})/gi,
  // Doğrulama kodu
  /(?:Doğrulama|Verification)\s*(?:Kodu|Code)\s*[:\s]*([A-Z0-9]{8,20})/gi,
  // Genel belge numarası formatı (e-Devlet)
  /(?:Belge\s*No|Document\s*No)\s*[:\s]*([A-Z0-9]{8,20})/gi,
  // Sorgulama kodu
  /(?:Sorgulama\s*Kodu)\s*[:\s]*([A-Z0-9]{8,20})/gi,
  // UUID-like belge kodu
  /([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/g,
  // Pure numeric code (10+ digits - common in Turkish govt docs)
  /\b(\d{10,16})\b/g,
]

export interface BarcodeResult {
  code: string
  source: 'pdf-text' | 'barcode-api' | 'pattern-match'
  confidence: 'high' | 'medium' | 'low'
}

/**
 * Extract NVI/barcode code from a file (PDF or image)
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

    // Set worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    let allText = ''

    // Extract text from all pages
    for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      allText += pageText + '\n'
    }

    // Search for NVI/barcode patterns in extracted text
    const code = findCodeInText(allText)
    if (code) {
      return {
        code,
        source: 'pdf-text',
        confidence: 'high'
      }
    }

    // If text extraction failed, try rendering first page to image and scanning barcode
    const firstPage = await pdf.getPage(1)
    const viewport = firstPage.getViewport({ scale: 2.0 })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext('2d')!

    await firstPage.render({
      canvasContext: ctx,
      viewport: viewport
    }).promise

    // Try BarcodeDetector on the rendered image
    const barcodeResult = await detectBarcodeFromCanvas(canvas)
    if (barcodeResult) {
      return barcodeResult
    }

    return null
  } catch (error) {
    console.error('PDF extraction error:', error)
    return null
  }
}

/**
 * Extract code from image using BarcodeDetector API + pattern matching
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

    // Create canvas from image
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0)

    URL.revokeObjectURL(imageUrl)

    // Try BarcodeDetector API first
    const barcodeResult = await detectBarcodeFromCanvas(canvas)
    if (barcodeResult) {
      return barcodeResult
    }

    return null
  } catch (error) {
    console.error('Image extraction error:', error)
    return null
  }
}

/**
 * Use the browser's BarcodeDetector API to scan barcodes from canvas
 */
async function detectBarcodeFromCanvas(canvas: HTMLCanvasElement): Promise<BarcodeResult | null> {
  try {
    // Check if BarcodeDetector is available
    if ('BarcodeDetector' in window) {
      const detector = new (window as any).BarcodeDetector({
        formats: ['code_128', 'code_39', 'qr_code', 'data_matrix', 'pdf417', 'ean_13', 'ean_8']
      })

      const barcodes = await detector.detect(canvas)

      if (barcodes.length > 0) {
        // Find the most likely verification code
        for (const barcode of barcodes) {
          const code = barcode.rawValue.trim()
          if (code.length >= 8) {
            return {
              code,
              source: 'barcode-api',
              confidence: 'high'
            }
          }
        }
      }
    }
  } catch (error) {
    console.warn('BarcodeDetector not available or failed:', error)
  }

  return null
}

/**
 * Find NVI/verification code in extracted text using patterns
 */
function findCodeInText(text: string): string | null {
  // Priority ordered patterns
  const priorityPatterns = [
    // Belge Doğrulama Kodu - highest priority
    /Belge\s*Doğrulama\s*Kodu\s*[:\s]*([A-Z0-9-]{8,30})/i,
    // Sorgulama Kodu
    /Sorgulama\s*Kodu\s*[:\s]*([A-Z0-9-]{8,30})/i,
    // Doğrulama Kodu
    /Doğrulama\s*Kodu\s*[:\s]*([A-Z0-9-]{8,30})/i,
    // Barkod No
    /Barkod\s*(?:No|Numarası)\s*[:\s]*([A-Z0-9-]{8,30})/i,
    // NVI kodu
    /NVI[-\s]*([0-9]{8,14})/i,
    // UUID format
    /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i,
    // Generic long alphanumeric (likely a verification code)
    /(?:^|\s)([A-Z0-9]{12,20})(?:\s|$)/m,
  ]

  for (const pattern of priorityPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }

  return null
}

/**
 * Verify a document code against turkiye.gov.tr/belge-dogrulama
 */
export async function verifyDocumentCode(code: string): Promise<{
  verified: boolean
  message: string
  details?: {
    documentType?: string
    issueDate?: string
    holderName?: string
    address?: string
  }
}> {
  try {
    const response = await fetch('/api/verify-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })

    if (!response.ok) {
      throw new Error('Verification request failed')
    }

    return await response.json()
  } catch (error) {
    console.error('Verification error:', error)
    return {
      verified: false,
      message: 'Doğrulama sırasında bir hata oluştu. Lütfen tekrar deneyin.'
    }
  }
}
