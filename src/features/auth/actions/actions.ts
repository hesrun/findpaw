'use server';

import { redirect } from 'next/navigation';
import { supabaseServer } from '@shared/lib/supabase/server';

export async function signIn(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = await supabaseServer();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    return {};
}

export async function signUp(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('userName') as string;
    const role = formData.get('role') as string;

    const ALLOWED_ROLES = ['user', 'shelter', 'clinic'];
    const safeRole = ALLOWED_ROLES.includes(role) ? role : 'user';

    const supabase = await supabaseServer();

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: fullName, role: safeRole },
        },
    });

    if (error) {
        return { error: error.message };
    }

    return {};
}

export async function signOut() {
    const supabase = await supabaseServer();
    await supabase.auth.signOut();
    redirect('/signin');
}
