import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  // If Supabase URL or Key is missing, pass through safely
  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: '',
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: '',
          ...options,
        });
      },
    },
  });

  // Refresh auth session
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }

  const { pathname, searchParams } = request.nextUrl;

  // 1. Protect /studio route: Require authentication unless in Demo / Sample mode
  if (pathname.startsWith('/studio')) {
    const isDemo = searchParams.get('demo') === 'true' || searchParams.has('sample');
    if (!user && !isDemo) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set('redirectTo', pathname + (request.nextUrl.search || ''));
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 2. If authenticated user visits /login or /register, redirect to studio
  if (user && (pathname === '/login' || pathname === '/register')) {
    const redirectTo = searchParams.get('redirectTo');
    const redirectUrl = request.nextUrl.clone();
    
    // Ensure safe internal redirect
    if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
      redirectUrl.pathname = redirectTo;
      redirectUrl.searchParams.delete('redirectTo');
    } else {
      redirectUrl.pathname = '/studio';
      redirectUrl.search = '';
    }
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Static asset extensions (.svg, .png, .jpg, .jpeg, .gif, .webp, .pbix, .pbit)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pbix|pbit)$).*)',
  ],
};
