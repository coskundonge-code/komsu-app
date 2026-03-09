import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Routes that don't require authentication
const publicRoutes = [
  '/giris',
  '/kayit',
  '/sifre-sifirla',
  '/api/auth',
]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Allow public routes
  if (publicRoutes.some(route => path.startsWith(route))) {
    return await updateSession(request)
  }

  const { response, user } = await updateSession(request)

  // Redirect to login if not authenticated on protected routes
  if (!user && !publicRoutes.some(route => path.startsWith(route))) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/giris'
    return response
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
