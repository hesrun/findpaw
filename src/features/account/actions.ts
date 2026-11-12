'use server';

import { refresh } from 'next/cache';
import { after } from 'next/server';
import getSupabaseWithUser from '@shared/lib/supabase/auth';
import { readFormData } from '@shared/lib/form';
import { deleteUserImages, removedImages } from '@shared/lib/cloudinary/server';
import { ProfileFormSchema } from './schemas';

// Error values are `dashboard.settings.errors.*` translation keys.
export type ProfileResult = { error?: 'invalidData' | 'updateFailed' };

export async function updateProfile(formData: FormData): Promise<ProfileResult> {
    const { supabase, user } = await getSupabaseWithUser();
    const parsed = ProfileFormSchema.safeParse(
        readFormData(formData, ['avatar_url']),
    );

    if (!parsed.success) {
        return { error: 'invalidData' };
    }

    const { data: before } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .maybeSingle();

    const { error } = await supabase
        .from('profiles')
        .update(parsed.data)
        .eq('id', user.id);

    if (error) {
        console.error('[updateProfile]', error.message);
        return { error: 'updateFailed' };
    }

    // A replaced or removed photo is deleted after the response is sent.
    after(() =>
        deleteUserImages(
            removedImages(
                before?.avatar_url ? [before.avatar_url] : [],
                parsed.data.avatar_url ? [parsed.data.avatar_url] : [],
            ),
            'avatars',
            user.id,
        ),
    );

    // The name and photo are also shown in the header on every page.
    refresh();
    return {};
}
