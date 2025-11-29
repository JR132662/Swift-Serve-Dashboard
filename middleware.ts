import { NextResponse, NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const { pathname } = req.nextUrl

  // ============
  // 1. BLOCK AUTH PAGES WHEN LOGGED IN
  // ============
  if (token && (pathname === "/login" || pathname === "/signup")) {
    // redirect authenticated user to dashboard
    const url = req.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  // ============
  // 2. PROTECT DASHBOARD ROUTES
  // ============
  if (!token && pathname.startsWith("/dashboard")) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard/:path*",
  ],
}