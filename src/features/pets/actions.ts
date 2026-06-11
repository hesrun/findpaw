'use server';

import { Enums } from '@supabase/database.types';
import getSupabaseWithUser from '@shared/lib/supabase/auth';
import { revalidatePath } from 'next/cache';

function getEnum<T extends string>(formData: FormData, key: string) {
    const value = formData.get(key);
    return value ? (value as T) : null;
}

export async function createPet(formData: FormData) {
    const { supabase, user } = await getSupabaseWithUser();

    const imageUrls = formData.getAll('image_url') as string[];
    const shelterId = (formData.get('shelter_id') as string) || null;

    if (shelterId) {
        const { data: shelter, error: shelterErr } = await supabase
            .from('shelters')
            .select('owner_id')
            .eq('id', shelterId)
            .single();

        if (shelterErr || !shelter || shelter.owner_id !== user.id) {
            throw new Error('Unauthorized shelter');
        }
    }

    const { error } = await supabase.from('pets').insert({
        name: formData.get('name') as string | null,
        address: formData.get('address') as string | null,
        age_months: Number(formData.get('age_months')),
        breed: formData.get('breed') as string | null,
        city: formData.get('city') as string | null,
        created_at: new Date().toISOString(),
        description: formData.get('description') as string | null,
        image_url: imageUrls.length ? imageUrls : null,
        owner_id: user.id,
        shelter_id: shelterId,
        listing_type: formData.get('listing_type') as Enums<'pet_listing_type'>,
        price: formData.get('price') ? Number(formData.get('price')) : null,
        sex: getEnum<Enums<'pet_sex'>>(formData, 'sex'),
        species: formData.get('species') as Enums<'pet_species'>,
        is_special_needs: formData.get('is_special_needs') === 'on',
        is_sterilized: formData.get('is_sterilized') === 'on',
        is_vaccinated: formData.get('is_vaccinated') === 'on',
        status: getEnum<Enums<'pet_status'>>(formData, 'status') ?? undefined,
    });

    if (error) throw error;

    revalidatePath('/dashboard/pets');

    return { success: true };
}

export async function getPet(petId: string) {
    console.log('Fetching pet with ID:', petId);
    const { supabase, user } = await getSupabaseWithUser();
    const { data, error } = await supabase
        .from('pets')
        .select('*, shelter:shelters(id, name, city, address, phone, email)')
        .eq('id', petId)
        .eq('owner_id', user.id)
        .single();

    if (error) throw error;

    return data;
}

export async function getPets(page: number, pageSize: number = 20) {
    const from = (page - 1) * pageSize;

    const { supabase, user } = await getSupabaseWithUser();

    const { data, error, count } = await supabase
        .from('pets')
        .select('*, shelter:shelters(id, name, city, address, phone, email)', {
            count: 'exact',
        })
        .range(from, from + pageSize - 1)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, total: count ?? 0 };
}

export async function deletePet(petId: string) {
    const { supabase, user } = await getSupabaseWithUser();

    const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', petId)
        .eq('owner_id', user.id);

    if (error) throw error;

    revalidatePath('/dashboard/pets');

    return { success: true };
}

export async function updatePet(petId: string, formData: FormData) {
    const { supabase, user } = await getSupabaseWithUser();

    const imageUrls = formData.getAll('image_url') as string[];
    const shelterId = (formData.get('shelter_id') as string) || null;

    if (shelterId) {
        const { data: shelter, error: shelterErr } = await supabase
            .from('shelters')
            .select('owner_id')
            .eq('id', shelterId)
            .single();

        if (shelterErr || !shelter || shelter.owner_id !== user.id) {
            throw new Error('Unauthorized shelter');
        }
    }

    const { error } = await supabase
        .from('pets')
        .update({
            name: formData.get('name') as string | null,
            address: formData.get('address') as string | null,
            age_months: Number(formData.get('age_months')),
            breed: formData.get('breed') as string | null,
            city: formData.get('city') as string | null,
            description: formData.get('description') as string | null,
            image_url: imageUrls.length ? imageUrls : null,
            listing_type: formData.get(
                'listing_type',
            ) as Enums<'pet_listing_type'>,
            price: formData.get('price') ? Number(formData.get('price')) : null,
            sex: getEnum<Enums<'pet_sex'>>(formData, 'sex'),
            species: formData.get('species') as Enums<'pet_species'>,
            is_special_needs: formData.get('is_special_needs') === 'on',
            is_sterilized: formData.get('is_sterilized') === 'on',
            is_vaccinated: formData.get('is_vaccinated') === 'on',
            status:
                getEnum<Enums<'pet_status'>>(formData, 'status') ?? undefined,
            shelter_id: shelterId,
        })
        .eq('id', petId)
        .eq('owner_id', user.id);

    if (error) throw error;

    revalidatePath('/dashboard/pets');
    return { success: true };
}
