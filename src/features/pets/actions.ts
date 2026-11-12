'use server';

import getSupabaseWithUser from '@shared/lib/supabase/auth';
import { readFormData } from '@shared/lib/form';
import { refresh } from 'next/cache';
import { after } from 'next/server';
import { deleteUserImages, removedImages } from '@shared/lib/cloudinary/server';
import { PetFormSchema, PetStatusChangeSchema, type PetForm } from './schemas';
import { PET_LOCATION_DECIMALS, REWARD_LISTING_TYPE } from './constants';

function roundCoordinate(value: number) {
    const factor = 10 ** PET_LOCATION_DECIMALS;
    return Math.round(value * factor) / factor;
}

// Form values to a pets row, shared by create and update:
// - the database allows a reward only on lost listings, so switching the type
//   away from 'lost' must clear it in the same write;
// - a map point is kept only as a full pair, rounded so that a pin on
//   someone's home is not published exactly.
function toPetRow({ latitude, longitude, reward, ...pet }: PetForm) {
    const hasPoint = latitude != null && longitude != null;
    return {
        ...pet,
        reward:
            pet.listing_type === REWARD_LISTING_TYPE ? (reward ?? null) : null,
        latitude: hasPoint ? roundCoordinate(latitude) : null,
        longitude: hasPoint ? roundCoordinate(longitude) : null,
    };
}

function parsePetForm(formData: FormData) {
    return PetFormSchema.safeParse(readFormData(formData, ['image_url']));
}

// A pet may be attached only to a shelter of the current user.
async function assertOwnShelter(shelterId: string | null | undefined) {
    if (!shelterId) return;
    const { supabase, user } = await getSupabaseWithUser();
    const { data: shelter } = await supabase
        .from('shelters')
        .select('owner_id')
        .eq('id', shelterId)
        .maybeSingle();

    if (shelter?.owner_id !== user.id) {
        throw new Error('Unauthorized shelter');
    }
}

export async function createPet(formData: FormData) {
    const { supabase, user } = await getSupabaseWithUser();
    const parsed = parsePetForm(formData);
    if (!parsed.success) {
        return { success: false, errors: parsed.error.flatten() };
    }
    await assertOwnShelter(parsed.data.shelter_id);

    const { error } = await supabase
        .from('pets')
        .insert({ ...toPetRow(parsed.data), owner_id: user.id });

    if (error) throw error;

    return { success: true };
}

export async function updatePet(petId: string, formData: FormData) {
    const { supabase, user } = await getSupabaseWithUser();
    const parsed = parsePetForm(formData);
    if (!parsed.success) {
        return { success: false, errors: parsed.error.flatten() };
    }
    await assertOwnShelter(parsed.data.shelter_id);

    const { data: before } = await supabase
        .from('pets')
        .select('image_url')
        .eq('id', petId)
        .eq('owner_id', user.id)
        .maybeSingle();
    const row = toPetRow(parsed.data);

    const { error } = await supabase
        .from('pets')
        .update(row)
        .eq('id', petId)
        .eq('owner_id', user.id);

    if (error) throw error;

    // Photos removed in the form are deleted after the response is sent.
    after(() =>
        deleteUserImages(
            removedImages(before?.image_url, row.image_url),
            'pets',
            user.id,
        ),
    );

    return { success: true };
}

export async function deletePet(petId: string) {
    const { supabase, user } = await getSupabaseWithUser();

    const { data: deleted, error } = await supabase
        .from('pets')
        .delete()
        .eq('id', petId)
        .eq('owner_id', user.id)
        .select('image_url')
        .maybeSingle();

    if (error) throw error;

    after(() => deleteUserImages(deleted?.image_url ?? [], 'pets', user.id));

    // The list stays on screen after this action; re-render it with fresh data.
    refresh();
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

    // The list stays on screen after this action; re-render it with fresh data.
    refresh();
    return { success: true };
}
