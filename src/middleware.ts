import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/giris',
  '/kayit',
  '/sifre-sifirla',
  '/auth/callback',
  '/auth/signout',
  '/api/auth',
  '/pazar',
  '/kesfet',
  '/uyarilar',
  '/gruplar',
  '/etkinlikler',
  '/bildirimler',
  '/profil',
  '/ayarlar',
  '/isletmeler',
  '/isletme-ekle',
  '/yardim',
  '/blog',
  '/admin',
  '/isletme-paneli',
  '/favoriler',
  '/hakkinda',
  '/iletisim',
  '/kariyer',
  '/nasil-calisir',
  '/topluluk-kurallari',
  '/kosullar',
  '/gizlilik',
  '/kvkk',
  '/cerez-politikasi',
  '/guvenlik',
  '/gonderi',
  '/ara',
  '/davet',
  '/referans-kullan',
  '/adres-dogrulama',
  '/konum-secimi',
  '/api/verify-document',
  '/odunc-kirala',
  '/mahallem-kart',
  '/askida-bagis',
]

// Routes exempt from location check (user needs to access these even without location)
const locationExemptRoutes = [
  '/konum-secimi',
  '/giris',
  '/kayit',
  '/sifre-sifirla',
  '/auth/callback',
  '/auth/signout',
  '/api/auth',
  '/hesap-kilitli',
  '/adres-dogrulama',
  '/api/verify-document',
  '/hakkinda',
  '/iletisim',
  '/kosullar',
  '/gizlilik',
  '/kvkk',
  '/cerez-politikasi',
  '/guvenlik',
  '/topluluk-kurallari',
  '/nasil-calisir',
  '/kariyer',
  '/yardim',
]

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request)
  const path = request.nextUrl.pathname

  // Allow public routes without auth check
  if (publicRoutes.some(route => path === route || path.startsWith(route + '/'))) {
    // If user is logged in and on a non-exempt route, check location
    if (user && !locationExemptRoutes.some(route => path === route || path.startsWith(route + '/'))) {
      const metadata = user.user_metadata || {}
      const locationConfirmedAt = metadata.location_confirmed_at
      const edevletVerifiedAt = metadata.edevlet_verified_at
      const edevletDeadline = metadata.edevlet_verification_deadline

      // Check if location has been set
      if (!locationConfirmedAt) {
        const locationUrl = request.nextUrl.clone()
        locationUrl.pathname = '/konum-secimi'
        return NextResponse.redirect(locationUrl)
      }

      // Check 30-day e-Devlet verification deadline
      if (edevletDeadline && !edevletVerifiedAt) {
        const deadline = new Date(edevletDeadline)
        if (deadline < new Date()) {
          // Deadline passed without verification - redirect to locked page
          const lockedUrl = request.nextUrl.clone()
          lockedUrl.pathname = '/hesap-kilitli'
          return NextResponse.redirect(lockedUrl)
        }
      }
    }

    return response
  }

  // Redirect to login if not authenticated on protected routes
  if (!user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/giris'
    loginUrl.searchParams.set('next', path)
    return NextResponse.redirect(loginUrl)
  }

  // For authenticated users on protected routes, also check location
  const metadata = user.user_metadata || {}
  const locationConfirmedAt = metadata.location_confirmed_at
  const edevletVerifiedAt = metadata.edevlet_verified_at
  const edevletDeadline = metadata.edevlet_verification_deadline

  if (!locationExemptRoutes.some(route => path === route || path.startsWith(route + '/'))) {
    if (!locationConfirmedAt) {
      const locationUrl = request.nextUrl.clone()
      locationUrl.pathname = '/konum-secimi'
      return NextResponse.redirect(locationUrl)
    }

    if (edevletDeadline && !edevletVerifiedAt) {
      const deadline = new Date(edevletDeadline)
      if (deadline < new Date()) {
        const lockedUrl = request.nextUrl.clone()
        lockedUrl.pathname = '/hesap-kilitli'
        return NextResponse.redirect(lockedUrl)
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
