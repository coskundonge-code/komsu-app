import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/verify-document
 *
 * e-Devlet belge doğrulama kodu ile turkiye.gov.tr/belge-dogrulama üzerinden
 * belgeyi doğrular.
 *
 * Production'da: Puppeteer/Playwright ile turkiye.gov.tr'ye gidip formu doldurur.
 * Demo'da: Kod formatını doğrulayıp simüle eder.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, documentInfo } = body

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { verified: false, message: 'Doğrulama kodu gereklidir.' },
        { status: 400 }
      )
    }

    const cleanCode = code.trim()

    // e-Devlet belge doğrulama kodu format kontrolü: XXXX-XXXX-XXXX-XXXX
    const codePattern = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/
    if (!codePattern.test(cleanCode)) {
      return NextResponse.json({
        verified: false,
        message: 'Geçersiz belge doğrulama kodu formatı. Beklenen format: NV02-ILLE-G5U8-RLN9'
      }, { status: 400 })
    }

    // ===== Production: turkiye.gov.tr/belge-dogrulama entegrasyonu =====
    // const browser = await puppeteer.launch({ headless: true })
    // const page = await browser.newPage()
    // await page.goto('https://www.turkiye.gov.tr/belge-dogrulama')
    // await page.waitForSelector('input[name="sorgulama_kodu"]')
    //
    // // Barkod numarasını gir (tire olmadan veya tireli)
    // await page.type('input[name="sorgulama_kodu"]', cleanCode)
    // await page.click('button[type="submit"]')
    // await page.waitForNavigation()
    //
    // // Sonucu oku
    // const resultText = await page.evaluate(() => {
    //   return document.querySelector('.belge-sonuc')?.textContent || ''
    // })
    // await browser.close()
    // ====================================================================

    // Simülasyon: 2 saniye gecikme (turkiye.gov.tr yanıt süresi)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Doğrulama başarılı
    return NextResponse.json({
      verified: true,
      message: 'Belge doğrulaması başarıyla tamamlandı.',
      code: cleanCode,
      details: {
        documentType: 'Yerleşim Yeri ve Diğer Adres Belgesi',
        issueDate: '10.03.2026',
        validUntil: '09.04.2026',
        issuedBy: 'Nüfus ve Vatandaşlık İşleri Genel Müdürlüğü',
        // Belge bilgileri (documentInfo API'ye gönderildiyse kullan)
        ...(documentInfo || {}),
      },
      verificationUrl: `https://www.turkiye.gov.tr/belge-dogrulama`
    })
  } catch (error) {
    console.error('Document verification error:', error)
    return NextResponse.json(
      { verified: false, message: 'Doğrulama sırasında bir sunucu hatası oluştu.' },
      { status: 500 }
    )
  }
}
