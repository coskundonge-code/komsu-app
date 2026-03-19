import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

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
  '/mesajlar',
  '/isletme-paneli',
  '/hesap-kilitli',
]

const adminRoutes = [
  '/admin',
]

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

function matchesRoute(path: string, routes: string[]): boolean {
  return routes.some(route => path === route || path.startsWith(route + '/'))
}

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request)
  const path = request.nextUrl.pathname

  if (path.startsWith('/api/')) {
    return response
  }

  if (matchesRoute(path, adminRoutes)) {
    if (!user) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/giris'
      loginUrl.searchParams.set('next', path)
      return NextResponse.redirect(loginUrl)
    }
    const metadata = user.user_metadata || {}
    const role = metadata.role || 'member'
    if (role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
    return response
  }

  if (matchesRoute(path, publicRoutes)) {
    if (user && !matchesRoute(path, locationExemptRoutes)) {
      const metadata = user.user_metadata || {}
      const locationConfirmedAt = metadata.location_confirmed_at
      const edevletVerifiedAt = metadata.edevlet_verified_at
      const edevletDeadline = metadata.edevlet_verification_deadline

      if (!locationConfirmedAt) {
        const url = request.nextUrl.clone()
        url.pathname = '/konum-secimi'
        return NextResponse.redirect(url)
      }

      if (edevletDeadline && !edevletVerifiedAt) {
        const deadline = new Date(edevletDeadline)
        if (deadline < new Date()) {
          const url = request.nextUrl.clone()
          url.pathname = '/hesap-kilitli'
          return NextResponse.redirect(url)
        }
      }
    }
    return response
  }

  if (!user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/giris'
    loginUrl.searchParams.set('next', path)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
