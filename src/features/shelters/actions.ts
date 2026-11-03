'use server';

import getSupabaseWithUser from '@shared/lib/supabase/auth';
import { readFormData } from '@shared/lib/form';
import { revalidatePath } from 'next/cache';
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
    revalidatePath('/dashboard/shelters');
    return { success: true };
}

export async function updateShelter(shelterId: string, formData: FormData) {
    const { supabase, user } = await getSupabaseWithUser();
    const parsed = parseShelterForm(formData);
    if (!parsed.success) {
        return { success: false, errors: parsed.error.flatten() };
    }

    const { error } = await supabase
        .from('shelters')
        .update({ ...parsed.data, updated_at: new Date().toISOString() })
        .eq('id', shelterId)
        .eq('owner_id', user.id);

    if (error) throw error;
    revalidatePath('/dashboard/shelters');
    return { success: true };
}

export async function deleteShelter(shelterId: string) {
    const { supabase, user } = await getSupabaseWithUser();

    const { error } = await supabase
        .from('shelters')
        .delete()
        .eq('id', shelterId)
        .eq('owner_id', user.id);

    if (error) throw error;
    revalidatePath('/dashboard/shelters');
    return { success: true };
}
