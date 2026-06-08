import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import type { User } from '@supabase/supabase-js'

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

/** Returns a redirect response if the user fails location/eDevlet checks, otherwise null. */
function checkVerification(request: NextRequest, user: User): NextResponse | null {
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

  return null
}

export async function middleware(request: NextRequest) {
  const { response, user, supabase } = await updateSession(request)
  const path = request.nextUrl.pathname

  if (path.startsWith('/api/')) {
    return response
  }

  // Public routes - allow access but enforce verification for logged-in users
  if (matchesRoute(path, publicRoutes)) {
    if (user && !matchesRoute(path, locationExemptRoutes)) {
      const redirect = checkVerification(request, user)
      if (redirect) return redirect
    }
    return response
  }

  // Protected routes - require login
  if (!user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/giris'
    const safePath = path.startsWith('/') && !path.startsWith('//') && !path.includes('://') ? path : '/'
    loginUrl.searchParams.set('next', safePath)
    return NextResponse.redirect(loginUrl)
  }

  // Enforce verification for all authenticated protected routes
  if (!matchesRoute(path, locationExemptRoutes)) {
    const redirect = checkVerification(request, user)
    if (redirect) return redirect
  }

  // Admin routes - require the is_admin flag server-side. Without this the
  // (admin) group is just a normal protected route, so any logged-in user could
  // open /admin/* and read every user's data. This is the authoritative gate;
  // the per-page client guard is only a UX nicety.
  if (path === '/admin' || path.startsWith('/admin/')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (profile?.is_admin !== true) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
