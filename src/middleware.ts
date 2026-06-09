import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

type SupabaseMiddlewareClient = Awaited<ReturnType<typeof updateSession>>['supabase']

const publicRoutes = [
  '/blog',
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
  '/blog',
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

/**
 * Doğrulama kapısı. Durum (konum / e-Devlet) artık FORGE EDİLEBİLİR user_metadata'dan
 * DEĞİL, public.profiles'tan okunur — guard trigger (guard_profile_privileged_columns)
 * bu sütunları istemci yazımına karşı kilitler. is_admin kapısıyla aynı desen.
 * Kullanıcı kapıyı geçemezse redirect, geçerse null döner.
 */
async function checkVerification(
  request: NextRequest,
  userId: string,
  supabase: SupabaseMiddlewareClient,
): Promise<NextResponse | null> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('location_confirmed_at, edevlet_verified_at, edevlet_verification_deadline')
    .eq('id', userId)
    .single()

  if (!profile?.location_confirmed_at) {
    const url = request.nextUrl.clone()
    url.pathname = '/konum-secimi'
    return NextResponse.redirect(url)
  }

  if (profile.edevlet_verification_deadline && !profile.edevlet_verified_at) {
    const deadline = new Date(profile.edevlet_verification_deadline)
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
      const redirect = await checkVerification(request, user.id, supabase)
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
    const redirect = await checkVerification(request, user.id, supabase)
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
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
