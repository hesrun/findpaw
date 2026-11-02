import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from './shared/lib/supabase/proxy';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

const PROTECTED_PATHS = ['/dashboard'];
const AUTH_PATHS = ['/signin', '/signup', '/forgot-password'];
// Needs the session created by the recovery email link. Not an auth path:
// the user is already signed in when they get here.
const RECOVERY_PATH = '/reset-password';

// Routes that require specific roles. First matching rule wins.
const ROLE_RESTRICTED_ROUTES: Array<{
    path: string;
    allowedRoles: string[];
    redirectTo?: string;
}> = [{ path: '/dashboard/shelters', allowedRoles: ['shelter', 'admin'] }];

export async function proxy(request: NextRequest) {
    const {
        response: supabaseResponse,
        supabase,
        isAuthenticated,
        claims,
    } = await updateSession(request);

    const { pathname } = request.nextUrl;

    // Strip locale prefix to get the actual path segment
    const localePattern = routing.locales.join('|');
    const pathnameWithoutLocale =
        pathname.replace(new RegExp(`^/(${localePattern})(/|$)`), '/') || '/';

    // Detect current locale (fall back to default)
    const localeMatch = pathname.match(new RegExp(`^/(${localePattern})(/|$)`));
    const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;

    const isProtectedRoute = PROTECTED_PATHS.some((p) =>
        pathnameWithoutLocale.startsWith(p),
    );
    const isAuthRoute = AUTH_PATHS.some((p) =>
        pathnameWithoutLocale.startsWith(p),
    );

    // Unauthenticated user hitting a protected route → send to sign-in
    if (isProtectedRoute && !isAuthenticated) {
        const url = new URL(`/${locale}/signin`, request.url);
        const redirectResponse = NextResponse.redirect(url);
        supabaseResponse.cookies
            .getAll()
            .forEach(({ name, value, ...options }) => {
                redirectResponse.cookies.set(name, value, options);
            });
        return redirectResponse;
    }

    // No recovery session (expired or reused link) → ask for a new email
    if (pathnameWithoutLocale.startsWith(RECOVERY_PATH) && !isAuthenticated) {
        const url = new URL(
            `/${locale}/forgot-password?error=linkExpired`,
            request.url,
        );
        const redirectResponse = NextResponse.redirect(url);
        supabaseResponse.cookies
            .getAll()
            .forEach(({ name, value, ...options }) => {
                redirectResponse.cookies.set(name, value, options);
            });
        return redirectResponse;
    }

    // Authenticated user hitting an auth route → send to dashboard
    if (isAuthRoute && isAuthenticated) {
        const url = new URL(`/${locale}/dashboard`, request.url);
        const redirectResponse = NextResponse.redirect(url);
        supabaseResponse.cookies
            .getAll()
            .forEach(({ name, value, ...options }) => {
                redirectResponse.cookies.set(name, value, options);
            });
        return redirectResponse;
    }

    // Role-based route protection
    // Role comes from profiles.role (not user-writable), never from user_metadata.
    const restricted = isAuthenticated
        ? ROLE_RESTRICTED_ROUTES.find((r) =>
              pathnameWithoutLocale.startsWith(r.path),
          )
        : undefined;
    if (restricted) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', claims?.sub ?? '')
            .maybeSingle();
        const userRole = profile?.role;
        if (!userRole || !restricted.allowedRoles.includes(userRole)) {
            const fallback = restricted.redirectTo ?? '/dashboard';
            const url = new URL(`/${locale}${fallback}`, request.url);
            const redirectResponse = NextResponse.redirect(url);
            supabaseResponse.cookies
                .getAll()
                .forEach(({ name, value, ...options }) => {
                    redirectResponse.cookies.set(name, value, options);
                });
            return redirectResponse;
        }
    }

    const intlResponse = intlMiddleware(request);

    // Copy refreshed auth cookies from Supabase onto the intl response
    supabaseResponse.cookies.getAll().forEach(({ name, value, ...options }) => {
        intlResponse.cookies.set(name, value, options);
    });

    return intlResponse;
}

export const config = {
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
