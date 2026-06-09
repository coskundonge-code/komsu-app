import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { compareDocuments, parseEdevletResult } from '@/lib/services/edevlet-match'

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

    // Oturum zorunlu: doğrulama her zaman giriş yapmış bir kullanıcıya bağlıdır.
    // Hem rozeti onun adına kalıcı yazmak hem de anonim brute-force'u engellemek için.
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { verified: false, message: 'Bu işlem için giriş yapmalısınız.' },
        { status: 401 }
      )
    }

    // Açık 2: Kullanıcı başına rate limit (IP'ye EK). Paylaşımlı IP arkasındaki
    // (okul/yurt/şirket NAT) masum kullanıcıları tek bir saldırganın IP kotasını
    // tüketmesinden korur; ayrıca tek kullanıcının kendi brute-force'unu da sınırlar.
    const rlUser = await rateLimit(`verify-doc-user:${user.id}`, { limit: 5, windowMs: 10 * 60_000 })
    if (!rlUser.success) return rateLimitResponse(rlUser) as any

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

      // Açık 1 (tamamlayıcı): Gerçek doğrulama başarılıysa e-Devlet rozetini SUNUCU
      // tarafında kalıcı yaz. Tek doğruluk kaynağı profiles tablosu; bu yazım yalnızca
      // service_role ile yapılır (guard trigger'ı bypass eder), böylece kullanıcı
      // user_metadata üzerinden kendini "doğrulanmış" ilan edemez.
      if (comparison.isMatch) {
        await persistEdevletVerified(user.id)
      }

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
        const admin = getAdminClient()
        if (admin) {
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
 * Service-role Supabase istemcisi. RLS ve guard trigger'ı bypass eder; yalnızca
 * sunucu tarafı yazımları için (e-Devlet rozeti, manuel inceleme kuyruğu). Anahtar
 * eksikse null döner (build/env eksikliğinde patlamak yerine sessizce atla).
 */
function getAdminClient() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  if (!SUPABASE_URL || !SERVICE_KEY) return null
  return createAdminClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

/**
 * e-Devlet doğrulamasını profiles.edevlet_verified_at sütununa kalıcı yazar.
 * Tek doğruluk kaynağı budur (middleware buradan okur). guard trigger istemci
 * yazımını engellediğinden bu yazım service_role ile yapılır.
 */
async function persistEdevletVerified(userId: string): Promise<void> {
  const admin = getAdminClient()
  if (!admin) {
    console.error('[verify-document] SERVICE_ROLE_KEY yok; edevlet_verified_at yazılamadı')
    return
  }
  const { error } = await admin
    .from('profiles')
    .update({ edevlet_verified_at: new Date().toISOString() })
    .eq('id', userId)
  if (error) console.error('[verify-document] edevlet_verified_at yazımı başarısız:', error)
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

// SAF eşleştirme mantığı src/lib/services/edevlet-match.ts'e taşındı (K1: ince
// route + test edilebilir domain). parseEdevletResult & compareDocuments yukarıda
// import ediliyor; normalizeText & compareAddresses o modülde dahili kullanılır.
