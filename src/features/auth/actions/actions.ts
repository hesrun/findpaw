'use server';

import { redirect } from 'next/navigation';
import { supabaseServer } from '@shared/lib/supabase/server';
import { SignInSchema, SignUpSchema } from '@features/auth/schemas';

// Error values are `auth.errors.*` translation keys; raw Supabase messages are not exposed.
export type AuthResult = {
    error?: 'invalidData' | 'signInFailed' | 'signUpFailed';
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

export async function signOut() {
    const supabase = await supabaseServer();
    await supabase.auth.signOut();
    redirect('/signin');
}
