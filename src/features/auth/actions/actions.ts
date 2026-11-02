'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabaseServer } from '@shared/lib/supabase/server';
import { getCurrentUser } from '@shared/lib/supabase/auth';
import {
    ForgotPasswordSchema,
    ResetPasswordSchema,
    SignInSchema,
    SignUpSchema,
} from '@features/auth/schemas';
import { AUTH_CONFIRM_PATH } from '@features/auth/constants';

// Error values are `auth.errors.*` translation keys; raw Supabase messages are not exposed.
export type AuthResult = {
    error?:
        | 'invalidData'
        | 'signInFailed'
        | 'signUpFailed'
        | 'passwordsMismatch'
        | 'updatePasswordFailed'
        | 'linkExpired';
};

export async function signIn(formData: FormData): Promise<AuthResult> {
    const parsed = SignInSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!parsed.success) {
        return { error: 'invalidData' };
    }

    const supabase = await supabaseServer();

    const { error } = await supabase.auth.signInWithPassword(parsed.data);

    if (error) {
        return { error: 'signInFailed' };
    }

    return {};
}

export async function signUp(formData: FormData): Promise<AuthResult> {
    const parsed = SignUpSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        userName: formData.get('userName'),
        role: formData.get('role'),
    });

    if (!parsed.success) {
        return { error: 'invalidData' };
    }

    const { email, password, userName, role } = parsed.data;
    const supabase = await supabaseServer();

    // The role here is only a request: the database trigger enforces the allow-list.
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: userName, role },
        },
    });

    if (error) {
        console.error('[signUp]', error.message);
        return { error: 'signUpFailed' };
    }

    return {};
}

// Always reports success, so the form does not reveal which emails have accounts.
export async function requestPasswordReset(
    formData: FormData,
): Promise<AuthResult> {
    const parsed = ForgotPasswordSchema.safeParse({
        email: formData.get('email'),
        locale: formData.get('locale'),
    });

    if (!parsed.success) {
        return { error: 'invalidData' };
    }

    const { email, locale } = parsed.data;
    const origin = await getRequestOrigin();
    const supabase = await supabaseServer();

    // Supabase checks redirectTo against the project's Redirect URLs allow-list.
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}${AUTH_CONFIRM_PATH}?locale=${locale}`,
    });

    if (error) {
        console.error('[requestPasswordReset]', error.message);
    }

    return {};
}

export async function updatePassword(formData: FormData): Promise<AuthResult> {
    const parsed = ResetPasswordSchema.safeParse({
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    });

    if (!parsed.success) {
        const mismatch = parsed.error.issues.some(
            (issue) => issue.path[0] === 'confirmPassword',
        );
        return { error: mismatch ? 'passwordsMismatch' : 'invalidData' };
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
    redirect('/signin');
}
