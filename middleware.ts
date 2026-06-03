import { auth } from '@/auth';
import { isEmailWhitelisted } from '@/lib/whitelist';

export const middleware = auth((req) => {
  // Check if user is authenticated and whitelisted
  if (!req.auth?.user?.email) {
    // Not authenticated, redirect to login
    const loginUrl = new URL('/auth/login', req.nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return Response.redirect(loginUrl);
  }

  // Check if email is whitelisted
  if (!isEmailWhitelisted(req.auth.user.email)) {
    // Not whitelisted, redirect to error page
    return Response.redirect(new URL('/auth/error', req.nextUrl.origin));
  }

  return null;
});

// Protect all routes except auth routes and public assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - auth (authentication pages)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
