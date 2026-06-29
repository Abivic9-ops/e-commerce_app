import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_EMAIL } from '@/lib/config';

function isAdminEmail(email: string): boolean {
  if (!email) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const mockRole = request.cookies.get('mock_session_role')?.value;
  const mockEmail = request.cookies.get('mock_session_email')?.value;

  let user: any = null;
  let role: string | null = null;

  if (mockEmail) {
    user = { email: mockEmail };
    role = mockRole || 'buyer';
    if (isAdminEmail(mockEmail)) {
      role = 'admin';
    }
  } else {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet, headersToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
            if (headersToSet) {
              Object.entries(headersToSet).forEach(([key, value]) =>
                supabaseResponse.headers.set(key, value)
              );
            }
          },
        },
      }
    );

    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    user = supabaseUser;
    if (user) {
      role = user.user_metadata?.role || 'buyer';
      const email = user.email || '';
      if (isAdminEmail(email)) {
        role = 'admin';
      }
    }
  }

  const url = request.nextUrl.clone();

  if (url.pathname.startsWith('/admin')) {
    if (!user) {
      url.pathname = '/login';
      url.searchParams.set('redirectTo', '/admin');
      return NextResponse.redirect(url);
    }

    if (role !== 'admin') {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
