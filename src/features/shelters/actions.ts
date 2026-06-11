'use server';

import getSupabaseWithUser from '@shared/lib/supabase/auth';
import { revalidatePath } from 'next/cache';

export async function createShelter(formData: FormData) {
    const { supabase, user } = await getSupabaseWithUser();

    const imgUrls = formData.getAll('img_url') as string[];

    const { error } = await supabase.from('shelters').insert({
        owner_id: user.id,
        name: formData.get('name') as string,
        description: formData.get('description') as string | null,
        phone: formData.get('phone') as string | null,
        email: formData.get('email') as string | null,
        website: formData.get('website') as string | null,
        city: formData.get('city') as string | null,
        address: formData.get('address') as string | null,
        img_url: imgUrls.length ? imgUrls : null,
    });

    if (error) throw error;
    revalidatePath('/dashboard/shelters');
    return { success: true };
}

export async function updateShelter(shelterId: string, formData: FormData) {
    const { supabase, user } = await getSupabaseWithUser();

    const imgUrls = formData.getAll('img_url') as string[];

    const { error } = await supabase
        .from('shelters')
        .update({
            name: formData.get('name') as string,
            description: formData.get('description') as string | null,
            phone: formData.get('phone') as string | null,
            email: formData.get('email') as string | null,
            website: formData.get('website') as string | null,
            city: formData.get('city') as string | null,
            address: formData.get('address') as string | null,
            img_url: imgUrls.length ? imgUrls : null,
            updated_at: new Date().toISOString(),
        })
        .eq('id', shelterId)
        .eq('owner_id', user.id);

    if (error) throw error;
    revalidatePath('/dashboard/shelters');
    return { success: true };
}

export async function getShelter(shelterId: string) {
    const { supabase, user } = await getSupabaseWithUser();

    const { data, error } = await supabase
        .from('shelters')
        .select('*')
        .eq('id', shelterId)
        .eq('owner_id', user.id)
        .single();

    if (error) throw error;
    return data;
}

export async function getAllShelters() {
    const { supabase, user } = await getSupabaseWithUser();

    const { data, error } = await supabase
        .from('shelters')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return data;
}

export async function getShelters(page: number, pageSize: number = 20) {
    const from = (page - 1) * pageSize;

    const { supabase, user } = await getSupabaseWithUser();

    const { data, error, count } = await supabase
        .from('shelters')
        .select('*', { count: 'exact' })
        .range(from, from + pageSize - 1)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, total: count ?? 0 };
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
