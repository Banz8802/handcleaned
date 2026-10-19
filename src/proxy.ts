import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get('host') || '';
  const pathname = url.pathname;

  // Detect admin subdomain: e.g. "admin.handcleaned.com.au" or "admin.localhost:3000"
  const isAdminSubdomain =
    host.startsWith('admin.') ||
    host.includes('admin.handcleaned');

  if (isAdminSubdomain) {
    // 1. Root / on admin subdomain -> rewrite to internal /admin
    if (pathname === '/') {
      url.pathname = '/admin';
      return NextResponse.rewrite(url);
    }

    // 2. Standard admin routes on subdomain (/login, /dashboard, etc.) -> rewrite to /admin/*
    const subdomainAdminRoutes = ['/login', '/dashboard', '/bookings', '/transactions', '/reports', '/pricing', '/content'];
    for (const route of subdomainAdminRoutes) {
      if (pathname === route || pathname.startsWith(`${route}/`)) {
        url.pathname = `/admin${pathname}`;
        return NextResponse.rewrite(url);
      }
    }

    // 3. Admin API aliases on subdomain
    if (pathname === '/api/auth/login') {
      url.pathname = '/api/admin/auth/login';
      return NextResponse.rewrite(url);
    }
    if (pathname === '/api/export-csv') {
      url.pathname = '/api/admin/export-csv';
      return NextResponse.rewrite(url);
    }

    // 4. If already prefixed with /admin or /api/admin, let it pass through
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
      return NextResponse.next();
    }

    // 5. If user attempts to access public pages on the admin subdomain (e.g. /residential-cleaning),
    // redirect them to the admin dashboard / login instead
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Not on admin subdomain (i.e. public site https://handcleaned.com.au):
  // Let all public pages pass through.
  // The existing /admin routes also pass through for temporary backward compatibility.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.png, favicon.ico (favicon files)
     * - images, videos (public media folders)
     */
    '/((?!_next/static|_next/image|favicon.png|favicon.ico|images/|videos/).*)',
  ],
};
