import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths that do not require authentication
  const publicPaths = ['/login', '/register', '/api/auth/login', '/api/auth/register', '/icon.png', '/icon2.png'];
  
  // Allow next _next internal files, api routes, and public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    publicPaths.includes(pathname)
  ) {
    return NextResponse.next();
  }

  // Next.js middleware happens on the server, so we can't directly check localStorage here.
  // Instead, typically we check for an auth cookie. For MVP using localStorage, 
  // we do the route protection check in a client component or Layout.
  // We'll proceed with Client-Side protection in RootLayout for localStorage based auth.
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
