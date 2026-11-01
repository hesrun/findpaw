'use server';

import { Enums } from '@supabase/database.types';
import getSupabaseWithUser from '@shared/lib/supabase/auth';
import { revalidatePath } from 'next/cache';
import {
    PetCreateSchema,
    PetStatusChangeSchema,
    PetUpdateSchema,
} from './schemas';

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

    const raw = {
        name: formData.get('name'),
        description: formData.get('description'),
        age_months: formData.get('age_months'),
        breed: formData.get('breed'),
        city: formData.get('city'),
        address: formData.get('address'),
        image_url: imageUrls,
        shelter_id: shelterId,
        listing_type: formData.get('listing_type'),
        price: formData.get('price'),
        sex: formData.get('sex'),
        species: formData.get('species'),
        is_special_needs: formData.get('is_special_needs') === 'on',
        is_sterilized: formData.get('is_sterilized') === 'on',
        is_vaccinated: formData.get('is_vaccinated') === 'on',
    };

    const parsed = PetCreateSchema.safeParse(raw);
    if (!parsed.success) {
        return { success: false, errors: parsed.error.flatten() };
    }

    const data = parsed.data;

    const { error } = await supabase.from('pets').insert({
        name: data.name,
        address: data.address,
        age_months: data.age_months,
        breed: data.breed,
        city: data.city,
        created_at: new Date().toISOString(),
        description: data.description,
        image_url:
            data.image_url && data.image_url.length ? data.image_url : null,
        owner_id: user.id,
        shelter_id: data.shelter_id ?? null,
        listing_type: (data.listing_type ??
            'adoption') as Enums<'pet_listing_type'>,
        price: (data.price ?? null) as number | null,
        sex: data.sex as Enums<'pet_sex'> | undefined,
        species: data.species as Enums<'pet_species'>,
        is_special_needs: data.is_special_needs ?? false,
        is_sterilized: data.is_sterilized ?? false,
        is_vaccinated: data.is_vaccinated ?? false,
    });

    if (error) throw error;

    revalidatePath('/dashboard/pets');

    return { success: true };
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

    const raw = {
        name: formData.get('name'),
        description: formData.get('description'),
        age_months: formData.get('age_months'),
        breed: formData.get('breed'),
        city: formData.get('city'),
        address: formData.get('address'),
        image_url: imageUrls,
        shelter_id: shelterId,
        listing_type: formData.get('listing_type'),
        price: formData.get('price'),
        sex: formData.get('sex'),
        species: formData.get('species'),
        is_special_needs: formData.get('is_special_needs') === 'on',
        is_sterilized: formData.get('is_sterilized') === 'on',
        is_vaccinated: formData.get('is_vaccinated') === 'on',
    };

    const parsed = PetUpdateSchema.safeParse(raw);

    if (!parsed.success) {
        return { success: false, errors: parsed.error.flatten() };
    }

    const data = parsed.data;

    const { error } = await supabase
        .from('pets')
        .update({
            name: data.name,
            address: data.address,
            age_months: data.age_months,
            breed: data.breed,
            city: data.city,
            description: data.description,
            image_url:
                data.image_url && data.image_url.length ? data.image_url : null,
            listing_type: (data.listing_type ?? undefined) as
                | Enums<'pet_listing_type'>
                | undefined,
            price: (data.price ?? null) as number | null,
            sex: data.sex as Enums<'pet_sex'> | undefined,
            species: data.species as Enums<'pet_species'> | undefined,
            is_special_needs: data.is_special_needs ?? false,
            is_sterilized: data.is_sterilized ?? false,
            is_vaccinated: data.is_vaccinated ?? false,
            shelter_id: data.shelter_id ?? null,
        })
        .eq('id', petId)
        .eq('owner_id', user.id);

    if (error) throw error;

    revalidatePath('/dashboard/pets');
    return { success: true };
}

// Status changes go through this action only; the edit form never sends a status.
// closed_at is set by a database trigger, and the database checks that the
// close reason fits the listing type.
export async function changePetStatus(petId: string, formData: FormData) {
    const parsed = PetStatusChangeSchema.safeParse({
        status: formData.get('status'),
        close_reason: formData.get('close_reason'),
    });

    if (!parsed.success) {
        return { success: false, error: 'invalidStatus' as const };
    }

    const { supabase, user } = await getSupabaseWithUser();
    const { status, close_reason } = parsed.data;

    const { error } = await supabase
        .from('pets')
        .update({ status, close_reason: close_reason ?? null })
        .eq('id', petId)
        .eq('owner_id', user.id);

    if (error) {
        console.error('[changePetStatus]', error.message);
        return { success: false, error: 'statusChangeError' as const };
    }

    revalidatePath('/dashboard/pets');
    return { success: true };
}
