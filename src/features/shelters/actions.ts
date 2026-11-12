'use server';

import getSupabaseWithUser from '@shared/lib/supabase/auth';
import { readFormData } from '@shared/lib/form';
import { refresh } from 'next/cache';
import { after } from 'next/server';
import { deleteUserImages, removedImages } from '@shared/lib/cloudinary/server';
import { ShelterFormSchema } from './schemas';

function parseShelterForm(formData: FormData) {
    return ShelterFormSchema.safeParse(readFormData(formData, ['img_url']));
}

export async function createShelter(formData: FormData) {
    const { supabase, user } = await getSupabaseWithUser();
    const parsed = parseShelterForm(formData);
    if (!parsed.success) {
        return { success: false, errors: parsed.error.flatten() };
    }

    const { error } = await supabase
        .from('shelters')
        .insert({ ...parsed.data, owner_id: user.id });

    if (error) throw error;
    return { success: true };
}

export async function updateShelter(shelterId: string, formData: FormData) {
    const { supabase, user } = await getSupabaseWithUser();
    const parsed = parseShelterForm(formData);
    if (!parsed.success) {
        return { success: false, errors: parsed.error.flatten() };
    }

    const { data: before } = await supabase
        .from('shelters')
        .select('img_url')
        .eq('id', shelterId)
        .eq('owner_id', user.id)
        .maybeSingle();

    const { error } = await supabase
        .from('shelters')
        .update({ ...parsed.data, updated_at: new Date().toISOString() })
        .eq('id', shelterId)
        .eq('owner_id', user.id);

    if (error) throw error;

    // Photos removed in the form are deleted after the response is sent.
    after(() =>
        deleteUserImages(
            removedImages(before?.img_url, parsed.data.img_url),
            'shelters',
            user.id,
        ),
    );
    return { success: true };
}

export async function deleteShelter(shelterId: string) {
    const { supabase, user } = await getSupabaseWithUser();

    const { data: deleted, error } = await supabase
        .from('shelters')
        .delete()
        .eq('id', shelterId)
        .eq('owner_id', user.id)
        .select('img_url')
        .maybeSingle();

    if (error) throw error;

    after(() => deleteUserImages(deleted?.img_url ?? [], 'shelters', user.id));
    // The list stays on screen after this action; re-render it with fresh data.
    refresh();
    return { success: true };
}
