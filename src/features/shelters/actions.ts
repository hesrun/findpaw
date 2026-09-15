'use server';

import getSupabaseWithUser from '@shared/lib/supabase/auth';
import { revalidatePath } from 'next/cache';
import { ShelterCreateSchema, ShelterUpdateSchema } from './schemas';

export async function createShelter(formData: FormData) {
    const { supabase, user } = await getSupabaseWithUser();

    const imgUrls = formData.getAll('img_url') as string[];

    const raw = {
        name: formData.get('name'),
        description: formData.get('description'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        website: formData.get('website'),
        city: formData.get('city'),
        address: formData.get('address'),
        img_url: imgUrls,
    };

    const parsed = ShelterCreateSchema.safeParse(raw);
    if (!parsed.success) {
        return { success: false, errors: parsed.error.flatten() };
    }

    const data = parsed.data;

    const { error } = await supabase.from('shelters').insert({
        owner_id: user.id,
        name: data.name,
        description: data.description ?? null,
        phone: data.phone ?? null,
        email: data.email ?? null,
        website: data.website ?? null,
        city: data.city ?? null,
        address: data.address ?? null,
        img_url: data.img_url && data.img_url.length ? data.img_url : null,
    });

    if (error) throw error;
    revalidatePath('/dashboard/shelters');
    return { success: true };
}

export async function updateShelter(shelterId: string, formData: FormData) {
    const { supabase, user } = await getSupabaseWithUser();

    const imgUrls = formData.getAll('img_url') as string[];

    const raw = {
        name: formData.get('name'),
        description: formData.get('description'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        website: formData.get('website'),
        city: formData.get('city'),
        address: formData.get('address'),
        img_url: imgUrls,
    };

    const parsed = ShelterUpdateSchema.safeParse(raw);
    if (!parsed.success) {
        return { success: false, errors: parsed.error.flatten() };
    }

    const data = parsed.data;

    const { error } = await supabase
        .from('shelters')
        .update({
            name: data.name,
            description: data.description ?? null,
            phone: data.phone ?? null,
            email: data.email ?? null,
            website: data.website ?? null,
            city: data.city ?? null,
            address: data.address ?? null,
            img_url: data.img_url && data.img_url.length ? data.img_url : null,
            updated_at: new Date().toISOString(),
        })
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
