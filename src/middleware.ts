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
  '/api/auth',
  '/pazar',
  '/kesfet',
  '/uyarilar',
  '/gruplar',
  '/etkinlikler',
  '/bildirimler',
  '/mesajlar',
  '/profil',
  '/ayarlar',
  '/isletmeler',
  '/isletme-ekle',
  '/yardim',
]

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request)
  const path = request.nextUrl.pathname

  // Allow public routes without auth check
  if (publicRoutes.some(route => path === route || path.startsWith(route + '/'))) {
    return response
  }

  // Redirect to login if not authenticated on protected routes
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
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
