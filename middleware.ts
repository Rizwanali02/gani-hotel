import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'jjsasadasdasda'
)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  const publicRoutes = [
    '/',
    '/auth/signin',
    '/auth/callback',
    '/api/auth/callback',
    '/api/check-db',
    '/api/ping',
    '/_next',
    '/favicon.ico',
    '/images',
    '/uploads',
    '/unauthorized',
  ]

  // Check if current path is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  )

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Get token from cookies
  const token = request.cookies.get('token')?.value

  // ─── PROTECT ADMIN ROUTES ───────────────────────────
  if (pathname.startsWith('/admin')) {
    if (!token) {
      // No token → redirect to sign in
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('redirect', pathname)
      signInUrl.searchParams.set('message', 'signin_required')
      return NextResponse.redirect(signInUrl)
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)

      // Check if user has ADMIN role
      if (payload.role !== 'ADMIN') {
        // Not admin → redirect to unauthorized page
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }

      // Admin verified → allow access
      return NextResponse.next()
    } catch (error) {
      // Invalid token → redirect to sign in
      console.error('JWT verification failed:', error)
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('message', 'session_expired')
      return NextResponse.redirect(signInUrl)
    }
  }

  // ─── DASHBOARD ROUTE (redirect to home) ─────────────
  if (pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // ─── PROTECTED API ROUTES ───────────────────────────
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/') && !pathname.startsWith('/api/public/')) {
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    try {
      await jwtVerify(token, JWT_SECRET)
      return NextResponse.next()
    } catch {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
  }

  // Default: allow request
  return NextResponse.next()
}

// Configure which routes middleware runs on
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}