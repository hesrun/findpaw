import { NextResponse, type NextRequest } from 'next/server';
import { supabaseServer } from '@shared/lib/supabase/server';
import { AuthConfirmParamsSchema } from '@features/auth/schemas';
import { routing } from '@/i18n/routing';
import { AUTH_CONFIRM_REDIRECTS } from '@features/auth/constants';

// Target of the sign-up confirmation and password recovery emails. Verifies
// the one-time token, which stores the session cookies, then redirects to the
// page for that link type.
export async function GET(request: NextRequest) {
    const parsed = AuthConfirmParamsSchema.safeParse(
        Object.fromEntries(request.nextUrl.searchParams),
    );

    if (!parsed.success) {
        return redirectTo(
            request,
            routing.defaultLocale,
            AUTH_CONFIRM_REDIRECTS.recovery.failure,
        );
    }

    const { type, token_hash, locale } = parsed.data;
    const supabase = await supabaseServer();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    const target = AUTH_CONFIRM_REDIRECTS[type];

    return redirectTo(
        request,
        locale,
        error ? target.failure : target.success,
    );
}

function redirectTo(request: NextRequest, locale: string, path: string) {
    return NextResponse.redirect(new URL(`/${locale}${path}`, request.url));
}
