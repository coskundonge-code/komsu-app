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
  '/blog',
]

const apiRoutes = [
  '/api/',
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
  '/hesap-kilitli',
  '/adres-dogrulama',
  '/api/',
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

  if (apiRoutes.some(route => path.startsWith(route))) {
    return response
  }

  if (matchesRoute(path, publicRoutes)) {
    if (user && !matchesRoute(path, locationExemptRoutes)) {
      const metadata = user.user_metadata || {}
      if (!metadata.location_confirmed_at) {
        const url = request.nextUrl.clone()
        url.pathname = '/konum-secimi'
        return NextResponse.redirect(url)
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

  if (matchesRoute(path, adminRoutes)) {
    const metadata = user.user_metadata || {}
    const role = metadata.role || 'member'
    if (role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  if (!matchesRoute(path, locationExemptRoutes)) {
    const metadata = user.user_metadata || {}

    if (!metadata.location_confirmed_at) {
      const url = request.nextUrl.clone()
      url.pathname = '/konum-secimi'
      return NextResponse.redirect(url)
    }

    if (metadata.edevlet_verification_deadline && !metadata.edevlet_verified_at) {
      const deadline = new Date(metadata.edevlet_verification_deadline)
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
