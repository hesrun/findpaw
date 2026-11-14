'use server';

import { headers } from 'next/headers';
import type { ZodError } from 'zod';
import type { AuthError } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { supabaseServer } from '@shared/lib/supabase/server';
import getSupabaseWithUser, {
    getCurrentUser,
} from '@shared/lib/supabase/auth';
import {
    ChangePasswordSchema,
    ForgotPasswordSchema,
    ResetPasswordSchema,
    SignInSchema,
    SignUpSchema,
} from '@features/auth/schemas';
import { AUTH_CONFIRM_PATH } from '@features/auth/constants';
import { ROUTES } from '@shared/constants/routes';

// Error values are `auth.errors.*` translation keys; raw Supabase messages are not exposed.
export type AuthResult = {
    error?:
        | 'invalidData'
        | 'signInFailed'
        | 'signUpFailed'
        | 'passwordsMismatch'
        | 'updatePasswordFailed'
        | 'linkExpired'
        | 'wrongCurrentPassword'
        | 'captchaFailed';
};

// Supabase rejects a missing, expired, or reused Turnstile token with this code.
const isCaptchaError = (error: AuthError) => error.code === 'captcha_failed';

// A failed new-password form: a mismatch gets its own message.
function newPasswordError(error: ZodError): AuthResult {
    const mismatch = error.issues.some(
        (issue) => issue.path[0] === 'confirmPassword',
    );
    return { error: mismatch ? 'passwordsMismatch' : 'invalidData' };
}

export async function signIn(formData: FormData): Promise<AuthResult> {
    const parsed = SignInSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        captchaToken: formData.get('captchaToken'),
    });

    if (!parsed.success) {
        return { error: 'invalidData' };
    }

    const { email, password, captchaToken } = parsed.data;
    const supabase = await supabaseServer();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: { captchaToken },
    });

    if (error) {
        return {
            error: isCaptchaError(error) ? 'captchaFailed' : 'signInFailed',
        };
    }

    return {};
}

export async function signUp(formData: FormData): Promise<AuthResult> {
    const parsed = SignUpSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        userName: formData.get('userName'),
        phone: formData.get('phone'),
        role: formData.get('role'),
        locale: formData.get('locale'),
        captchaToken: formData.get('captchaToken'),
    });

    if (!parsed.success) {
        return { error: 'invalidData' };
    }

    const { email, password, userName, phone, role, locale, captchaToken } =
        parsed.data;
    const origin = await getRequestOrigin();
    const supabase = await supabaseServer();

    // The role here is only a request: the database trigger enforces the allow-list
    // and copies the phone into the profile.
    // The confirmation email links to emailRedirectTo, checked against Redirect URLs.
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: userName, phone, role },
            emailRedirectTo: `${origin}${AUTH_CONFIRM_PATH}?locale=${locale}`,
            captchaToken,
        },
    });

    if (error) {
        console.error('[signUp]', error.message);
        return {
            error: isCaptchaError(error) ? 'captchaFailed' : 'signUpFailed',
        };
    }

    return {};
}

// Reports success for any email, so the form does not reveal which emails have
// accounts. Only a failed captcha is reported: it does not depend on the email.
export async function requestPasswordReset(
    formData: FormData,
): Promise<AuthResult> {
    const parsed = ForgotPasswordSchema.safeParse({
        email: formData.get('email'),
        locale: formData.get('locale'),
        captchaToken: formData.get('captchaToken'),
    });

    if (!parsed.success) {
        return { error: 'invalidData' };
    }

    const { email, locale, captchaToken } = parsed.data;
    const origin = await getRequestOrigin();
    const supabase = await supabaseServer();

    // Supabase checks redirectTo against the project's Redirect URLs allow-list.
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}${AUTH_CONFIRM_PATH}?locale=${locale}`,
        captchaToken,
    });

    if (error) {
        console.error('[requestPasswordReset]', error.message);
        if (isCaptchaError(error)) return { error: 'captchaFailed' };
    }

    return {};
}

export async function updatePassword(formData: FormData): Promise<AuthResult> {
    const parsed = ResetPasswordSchema.safeParse({
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    });

    if (!parsed.success) {
        return newPasswordError(parsed.error);
    }

    // The session comes from the recovery link; without it the link has expired.
    const { supabase, user } = await getCurrentUser();

    if (!user) {
        return { error: 'linkExpired' };
    }

    const { error } = await supabase.auth.updateUser({
        password: parsed.data.password,
    });

    if (error) {
        console.error('[updatePassword]', error.message);
        return { error: 'updatePasswordFailed' };
    }

    return {};
}

// Password change of a signed-in user. Supabase does not ask for the current
// password, so it is checked by signing in with it first.
export async function changePassword(formData: FormData): Promise<AuthResult> {
    const parsed = ChangePasswordSchema.safeParse({
        currentPassword: formData.get('currentPassword'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        captchaToken: formData.get('captchaToken'),
    });

    if (!parsed.success) {
        return newPasswordError(parsed.error);
    }

    const { supabase, user } = await getSupabaseWithUser();

    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email ?? '',
        password: parsed.data.currentPassword,
        options: { captchaToken: parsed.data.captchaToken },
    });

    if (signInError) {
        return {
            error: isCaptchaError(signInError)
                ? 'captchaFailed'
                : 'wrongCurrentPassword',
        };
    }

    const { error } = await supabase.auth.updateUser({
        password: parsed.data.password,
    });

    if (error) {
        console.error('[changePassword]', error.message);
        return { error: 'updatePasswordFailed' };
    }

    return {};
}

async function getRequestOrigin() {
    const headerList = await headers();
    const origin = headerList.get('origin');

    if (origin) return origin;

    const host = headerList.get('x-forwarded-host') ?? headerList.get('host');
    const protocol = headerList.get('x-forwarded-proto') ?? 'http';

    return `${protocol}://${host}`;
}

export async function signOut() {
    const supabase = await supabaseServer();
    await supabase.auth.signOut();
    redirect(ROUTES.auth.signIn);
}
