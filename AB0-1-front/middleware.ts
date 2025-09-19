import { NextRequest, NextResponse } from 'next/server';

// This middleware runs on the edge
export function middleware(request: NextRequest) {
  // Get the token from cookies
  const token = request.cookies.get('auth_token')?.value;
  
  // Define protected routes
  const protectedPaths = [
    '/dashboard',
    '/profile',
    '/companies/[id]/review',
    '/admin',
  ];
  
  // Check if the current path is protected
  const isProtectedRoute = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path.replace('[id]', ''))
  );
  
  // If it's a protected route and there's no token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If user is logged in and trying to access login page, redirect to dashboard
  if (request.nextUrl.pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Continue with the request
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};