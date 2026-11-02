import { NextResponse, type NextRequest } from 'next/server';
import { supabaseServer } from '@shared/lib/supabase/server';
import { AuthConfirmParamsSchema } from '@features/auth/schemas';
import { routing } from '@/i18n/routing';
import { AUTH_ROUTES, LINK_EXPIRED_ERROR } from '@features/auth/constants';

// Target of the password recovery email. Verifies the one-time token,
// which stores the session cookies, then sends the user to set a new password.
export async function GET(request: NextRequest) {
    const parsed = AuthConfirmParamsSchema.safeParse(
        Object.fromEntries(request.nextUrl.searchParams),
    );
    const locale = parsed.success ? parsed.data.locale : routing.defaultLocale;

    if (parsed.success) {
        const supabase = await supabaseServer();
        const { error } = await supabase.auth.verifyOtp({
            type: parsed.data.type,
            token_hash: parsed.data.token_hash,
        });

        if (!error) {
            return NextResponse.redirect(
                new URL(`/${locale}${AUTH_ROUTES.resetPassword}`, request.url),
            );
        }
    }

    const failure = new URL(
        `/${locale}${AUTH_ROUTES.forgotPassword}`,
        request.url,
    );
    failure.searchParams.set('error', LINK_EXPIRED_ERROR);

    return NextResponse.redirect(failure);
}
