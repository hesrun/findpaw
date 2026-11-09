'use server';

import { headers } from 'next/headers';
import type { ZodError } from 'zod';
import { redirect } from 'next/navigation';
import { supabaseServer } from '@shared/lib/supabase/server';
import getSupabaseWithUser, {
    getCurrentUser,
} from '@shared/lib/supabase/auth';
import {
    ChangeEmailSchema,
    ChangePasswordSchema,
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
        | 'linkExpired'
        | 'wrongCurrentPassword'
        | 'updateEmailFailed';
};

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
        phone: formData.get('phone'),
        role: formData.get('role'),
        locale: formData.get('locale'),
    });

    if (!parsed.success) {
        return { error: 'invalidData' };
    }

    const { email, password, userName, phone, role, locale } = parsed.data;
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

// Supabase changes the password or email of any valid session without asking
// for the current password, so the change forms check it by signing in first.
// Returns the client of the signed-in user, or null for a wrong password.
async function reauthenticate(currentPassword: string) {
    const { supabase, user } = await getSupabaseWithUser();

    const { error } = await supabase.auth.signInWithPassword({
        email: user.email ?? '',
        password: currentPassword,
    });

    return error ? null : supabase;
}

export async function changePassword(formData: FormData): Promise<AuthResult> {
    const parsed = ChangePasswordSchema.safeParse({
        currentPassword: formData.get('currentPassword'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    });

    if (!parsed.success) {
        return newPasswordError(parsed.error);
    }

    const supabase = await reauthenticate(parsed.data.currentPassword);

    if (!supabase) {
        return { error: 'wrongCurrentPassword' };
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

// Supabase emails a confirmation link (to both addresses when "Secure email
// change" is on); the sign-in email changes only after the link is opened.
export async function changeEmail(formData: FormData): Promise<AuthResult> {
    const parsed = ChangeEmailSchema.safeParse({
        email: formData.get('email'),
        currentPassword: formData.get('currentPassword'),
        locale: formData.get('locale'),
    });

    if (!parsed.success) {
        return { error: 'invalidData' };
    }

    const { email, currentPassword, locale } = parsed.data;
    const supabase = await reauthenticate(currentPassword);

    if (!supabase) {
        return { error: 'wrongCurrentPassword' };
    }

    const origin = await getRequestOrigin();
    const { error } = await supabase.auth.updateUser(
        { email },
        { emailRedirectTo: `${origin}${AUTH_CONFIRM_PATH}?locale=${locale}` },
    );

    if (error) {
        console.error('[changeEmail]', error.message);
        return { error: 'updateEmailFailed' };
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
