import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const publicRoutes = [
  '/giris',
  '/kayit',
  '/sifre-sifirla',
  '/auth/callback',
  '/auth/signout',
  '/api/auth',
  '/hakkinda',
  '/kosullar',
  '/gizlilik',
  '/kvkk',
  '/cerez-politikasi',
  '/nasil-calisir',
  '/topluluk-kurallari',
  '/iletisim',
  '/kariyer',
  '/yardim',
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

  // Public routes - allow access but check location for logged-in users
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

  // Protected routes - require login
  if (!user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/giris'
    loginUrl.searchParams.set('next', path)
    return NextResponse.redirect(loginUrl)
  }

  // Check location for ALL authenticated protected routes
  if (!matchesRoute(path, locationExemptRoutes)) {
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

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
