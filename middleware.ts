import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Create a server client that updates the request/response headers
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do NOT remove this. This refreshes the session if expired.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  // 1. Guard /admin routes (require admin role)
  if (url.pathname.startsWith('/admin')) {
    if (!user) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    
    // Read the custom role claim from Supabase user_metadata
    const role = user.user_metadata?.role;
    if (role !== 'admin') {
      // If user is not an admin, redirect them back to home
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // 2. Guard buyer-only pages
  const buyerRoutes = ['/cart', '/checkout', '/orders'];
  const isBuyerRoute = buyerRoutes.some((route) => url.pathname.startsWith(route));
  
  if (isBuyerRoute && !user) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, icons, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
