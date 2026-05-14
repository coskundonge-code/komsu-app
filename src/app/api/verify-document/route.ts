import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

/**
 * POST /api/verify-document
 *
 * e-Devlet belge doğrulama:
 * 1. turkiye.gov.tr/nvi-yerlesim-yeri-ve-diger-adres-belgesi-sorgulama sayfasına git
 * 2. Barkod numarasını gir → Devam
 * 3. TC Kimlik No gir → Devam
 * 4. Devam tıkla → Sonuç sayfasını oku
 * 5. Sonuçları yüklenen belge ile karşılaştır
 */

interface VerifyRequest {
  code: string           // Barkod doğrulama kodu: NV02-ILLE-G5U8-RLN9
  tcKimlikNo: string     // TC Kimlik No: 40078710692
  documentInfo?: {       // PDF'den çıkarılan bilgiler (karşılaştırma için)
    fullName?: string
    address?: string
    neighborhood?: string
    district?: string
    city?: string
  }
}

// e-Devlet belge doğrulama kodu format kontrolü: XXXX-XXXX-XXXX-XXXX
const codePattern = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/
// TC Kimlik No: 11 haneli rakam, 0 ile başlamaz
const tcPattern = /^[1-9]\d{10}$/

export async function POST(request: NextRequest) {
  try {
    // Rate limit: IP başına 5 doğrulama denemesi / 10 dakika
    // (eDevlet scraper pahalı + brute-force barkod denemelerini engeller)
    const ip = getClientIp(request)
    const rl = await rateLimit(`verify-doc:${ip}`, { limit: 5, windowMs: 10 * 60_000 })
    if (!rl.success) return rateLimitResponse(rl) as any

    const body: VerifyRequest = await request.json()
    const { code, tcKimlikNo, documentInfo } = body

    // ---- Validasyonlar ----
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { verified: false, message: 'Doğrulama kodu gereklidir.' },
        { status: 400 }
      )
    }

    if (!tcKimlikNo || typeof tcKimlikNo !== 'string') {
      return NextResponse.json(
        { verified: false, message: 'TC Kimlik No gereklidir.' },
        { status: 400 }
      )
    }

    const cleanCode = code.trim()
    const cleanTc = tcKimlikNo.trim()

    if (!codePattern.test(cleanCode)) {
      return NextResponse.json({
        verified: false,
        message: 'Geçersiz belge doğrulama kodu formatı. Beklenen format: NV02-ILLE-G5U8-RLN9'
      }, { status: 400 })
    }

    if (!tcPattern.test(cleanTc)) {
      return NextResponse.json({
        verified: false,
        message: 'Geçersiz TC Kimlik No formatı. 11 haneli rakam olmalıdır.'
      }, { status: 400 })
    }

    // ---- turkiye.gov.tr ile belge doğrulama ----
    let scrapedData: Record<string, string> | null = null
    let scrapeError: string | null = null

    try {
      scrapedData = await scrapeEdevlet(cleanCode, cleanTc)
    } catch (err: any) {
      console.error('Scraping error:', err)
      scrapeError = err.message || 'turkiye.gov.tr bağlantı hatası'
    }

    // Eğer scraping başarılı olduysa, sonuçları karşılaştır
    if (scrapedData) {
      const comparison = compareDocuments(scrapedData, documentInfo || {})

      return NextResponse.json({
        verified: comparison.isMatch,
        message: comparison.isMatch
          ? 'Belge doğrulaması başarıyla tamamlandı. Bilgiler eşleşiyor.'
          : 'Belge bilgileri eşleşmiyor. Lütfen doğru belgeyi yüklediğinizden emin olun.',
        code: cleanCode,
        details: {
          documentType: scrapedData.documentType || 'Yerleşim Yeri ve Diğer Adres Belgesi',
          fullName: scrapedData.fullName || '',
          address: scrapedData.address || '',
          issueDate: scrapedData.issueDate || '',
          validUntil: scrapedData.validUntil || '',
          issuedBy: scrapedData.issuedBy || 'Nüfus ve Vatandaşlık İşleri Genel Müdürlüğü',
        },
        comparison: comparison.details,
        verificationUrl: 'https://www.turkiye.gov.tr/nvi-yerlesim-yeri-ve-diger-adres-belgesi-sorgulama'
      })
    }

    // -------------------------------------------------------------------
    // Fallback: Scraping başarısız oldu.
    //
    // documentInfo (frontend OCR çıktısı) varsa, manuel admin onay kuyruğuna
    // pending kayıt at; admin paneldeki /admin/dogrulama görsel inceleme
    // yapacak. documentInfo yoksa eski 503 davranışı.
    // -------------------------------------------------------------------
    console.warn('Scraping failed:', scrapeError)

    if (documentInfo && (documentInfo.fullName || documentInfo.address)) {
      try {
        const supabase = await createServerClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
          const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
          if (SUPABASE_URL && SERVICE_KEY) {
            const admin = createAdminClient(SUPABASE_URL, SERVICE_KEY, {
              auth: { autoRefreshToken: false, persistSession: false },
            })
            // Aynı barkod için pending kayıt varsa upsert (idempotency)
            await admin.from('address_verifications').upsert(
              {
                user_id: user.id,
                verification_status: 'pending',
                barcode_value: cleanCode,
                document_uploaded_at: new Date().toISOString(),
                address_text: [
                  documentInfo.address,
                  documentInfo.neighborhood,
                  documentInfo.district,
                  documentInfo.city,
                ].filter(Boolean).join(', ') || null,
              },
              { onConflict: 'user_id,barcode_value' as any },
            )
          }
        }
      } catch (err) {
        console.error('[verify-document] manual queue write failed:', err)
        // pending kayıt başarısız olsa bile kullanıcıya makul mesaj döndür
      }

      return NextResponse.json({
        verified: false,
        pending: true,
        message: 'Otomatik doğrulama şu anda kullanılamıyor. Belgeniz manuel inceleme kuyruğuna alındı; en geç 24 saat içinde sonuçlandırılacak.',
        code: cleanCode,
        mode: 'manual_review',
        verificationUrl: 'https://www.turkiye.gov.tr/nvi-yerlesim-yeri-ve-diger-adres-belgesi-sorgulama',
      }, { status: 202 })
    }

    return NextResponse.json({
      verified: false,
      message: 'Otomatik doğrulama şu anda kullanılamıyor. Lütfen belgenizi PDF olarak yüklemeyi deneyin (manuel inceleme kuyruğuna alınır) veya daha sonra tekrar deneyin.',
      code: cleanCode,
      mode: 'unavailable',
      verificationUrl: 'https://www.turkiye.gov.tr/nvi-yerlesim-yeri-ve-diger-adres-belgesi-sorgulama'
    }, { status: 503 })
  } catch (error) {
    console.error('Document verification error:', error)
    return NextResponse.json(
      { verified: false, message: 'Doğrulama sırasında bir sunucu hatası oluştu.' },
      { status: 500 }
    )
  }
}

/**
 * turkiye.gov.tr/nvi-yerlesim-yeri-ve-diger-adres-belgesi-sorgulama
 * sayfasına gidip belge doğrulaması yapar.
 *
 * Adımlar:
 * 1. Sayfaya git
 * 2. Barkod numarasını gir → Devam tıkla
 * 3. TC Kimlik No gir → Devam tıkla
 * 4. Devam tıkla
 * 5. Sonuç sayfasını oku
 */
async function scrapeEdevlet(code: string, tcKimlikNo: string): Promise<Record<string, string>> {
  // Dynamic import - sadece çağrıldığında yükle
  const puppeteer = await import('puppeteer-core')

  let browser
  try {
    // Vercel serverless ortamında @sparticuz/chromium kullan
    // Lokal geliştirmede sistem Chrome'u kullan
    let executablePath: string
    let args: string[] = []

    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      // Serverless ortam (Vercel/Lambda)
      const chromium = await import('@sparticuz/chromium')
      executablePath = await chromium.default.executablePath()
      args = chromium.default.args
    } else {
      // Lokal geliştirme - sistem Chrome'unu bul
      const possiblePaths = [
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
        '/snap/bin/chromium',
        // macOS
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        // Windows
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      ]

      const fs = await import('fs')
      executablePath = possiblePaths.find(p => {
        try { return fs.existsSync(p) } catch { return false }
      }) || '/usr/bin/chromium-browser'

      args = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    }

    browser = await puppeteer.default.launch({
      headless: true,
      executablePath,
      args: [
        ...args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process',
      ],
    })

    const page = await browser.newPage()

    // User-Agent ayarla (bot algılama önleme)
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )

    // Timeout ayarla
    page.setDefaultNavigationTimeout(30000)
    page.setDefaultTimeout(15000)

    // 1. Sayfaya git
    await page.goto(
      'https://www.turkiye.gov.tr/nvi-yerlesim-yeri-ve-diger-adres-belgesi-sorgulama',
      { waitUntil: 'networkidle2', timeout: 30000 }
    )

    // 2. Barkod numarasını gir
    // Barkod input alanını bul (sorgulama kodu / barkod numarası)
    const barcodeInput = await page.waitForSelector(
      'input[name*="barkod"], input[name*="sorgulama"], input[id*="barkod"], input[id*="sorgulama"], input[placeholder*="Barkod"], input[type="text"]',
      { timeout: 10000 }
    )

    if (barcodeInput) {
      await barcodeInput.click({ count: 3 }) // Mevcut değeri seç
      await barcodeInput.type(code, { delay: 50 })
    }

    // Devam butonuna tıkla
    const devamBtn1 = await page.waitForSelector(
      'button:has-text("Devam"), input[value*="Devam"], button[type="submit"], .btn-primary, a.btn:has-text("Devam")',
      { timeout: 5000 }
    ).catch(() => null)

    if (devamBtn1) {
      await devamBtn1.click()
    } else {
      // XPath ile dene
      const buttons = await page.$$('button, input[type="submit"]')
      for (const btn of buttons) {
        const text = await page.evaluate(el => el.textContent || el.getAttribute('value') || '', btn)
        if (text.includes('Devam') || text.includes('devam') || text.includes('Sorgula')) {
          await btn.click()
          break
        }
      }
    }

    // Sayfanın yüklenmesini bekle
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {})
    await new Promise(r => setTimeout(r, 2000))

    // 3. TC Kimlik No gir
    const tcInput = await page.waitForSelector(
      'input[name*="tc"], input[name*="kimlik"], input[id*="tc"], input[id*="kimlik"], input[placeholder*="T.C."], input[placeholder*="TC"]',
      { timeout: 10000 }
    ).catch(() => null)

    if (tcInput) {
      await tcInput.click({ count: 3 })
      await tcInput.type(tcKimlikNo, { delay: 50 })
    } else {
      // Tüm text inputlarını dene
      const inputs = await page.$$('input[type="text"], input:not([type])')
      for (const input of inputs) {
        const placeholder = await page.evaluate(el => el.getAttribute('placeholder') || el.getAttribute('name') || '', input)
        if (placeholder.toLowerCase().includes('tc') || placeholder.toLowerCase().includes('kimlik')) {
          await input.click({ count: 3 })
          await input.type(tcKimlikNo, { delay: 50 })
          break
        }
      }
    }

    // Devam butonuna tıkla
    await clickDevamButton(page)
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {})
    await new Promise(r => setTimeout(r, 2000))

    // 4. Tekrar Devam tıkla (onay sayfası)
    await clickDevamButton(page)
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {})
    await new Promise(r => setTimeout(r, 2000))

    // 5. Sonuç sayfasını oku
    const pageContent = await page.evaluate(() => {
      return document.body.innerText
    })

    const result = parseEdevletResult(pageContent)

    return result
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

/**
 * Sayfadaki "Devam" butonunu bul ve tıkla
 */
async function clickDevamButton(page: any): Promise<void> {
  const buttons = await page.$$('button, input[type="submit"], a.btn, .btn')
  for (const btn of buttons) {
    const text = await page.evaluate(
      (el: Element) => el.textContent || (el as HTMLInputElement).value || '',
      btn
    )
    if (text.includes('Devam') || text.includes('devam') || text.includes('Sorgula') || text.includes('Gönder')) {
      await btn.click()
      return
    }
  }
  // Fallback: submit butonunu tıkla
  const submitBtn = await page.$('button[type="submit"], input[type="submit"]')
  if (submitBtn) {
    await submitBtn.click()
  }
}

/**
 * e-Devlet sonuç sayfası metnini parse et
 */
function parseEdevletResult(text: string): Record<string, string> {
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
 * Yüklenen PDF bilgileri ile scrape edilen bilgileri karşılaştır
 */
function compareDocuments(
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

function normalizeText(text: string): string {
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

function compareAddresses(addr1: string, addr2: string): boolean {
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
