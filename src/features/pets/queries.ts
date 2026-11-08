import getSupabaseWithUser from '@shared/lib/supabase/auth';
import { supabaseServer } from '@shared/lib/supabase/server';
import { cache } from 'react';
import { PetFiltersSchema, PetIdSchema } from './schemas';
import en from '@messages/en.json';
import cs from '@messages/cs.json';
import type { routing } from '@/i18n/routing';
import {
    PET_AGE_GROUP_MONTHS,
    PUBLIC_PET_STATUSES,
    type PetBreed,
} from './constants';
import { findBreedKeys } from './breeds';

// Breed names in every locale, so a search finds a breed in either language.
const BREED_NAMES = Object.values({
    en: en.pets.breeds,
    cs: cs.pets.breeds,
} satisfies Record<
    (typeof routing.locales)[number],
    Record<PetBreed, string>
>);

// User text goes into ILIKE patterns and into a PostgREST `or` filter string,
// where `,` `(` `)` `"` and `\` are syntax and `%` `_` `*` are wildcards.
// Replacing them with spaces keeps the search useful and the filter well-formed.
function toSearchPattern(value: string) {
    const cleaned = value.replace(/[%_*,()"\\]/g, ' ').trim();
    return cleaned ? `%${cleaned}%` : null;
}

export async function getMyPet(petId: string) {
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

export async function getMyPets(page: number, pageSize: number = 20) {
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

// Count only (HEAD request, no rows) for the landing hero.
export async function countPublicPets() {
    const supabase = await supabaseServer();
    const { count, error } = await supabase
        .from('pets')
        .select('id', { count: 'exact', head: true })
        .in('status', PUBLIC_PET_STATUSES);

    if (error) throw error;

    return count ?? 0;
}

// Returns null for malformed ids and for pets that are missing or not public.
// cache() lets generateMetadata and the page share one query per request.
export const getPublicPet = cache(async (petId: string) => {
    const id = PetIdSchema.safeParse(petId);
    if (!id.success) return null;

    const supabase = await supabaseServer();
    const { data, error } = await supabase
        .from('pets')
        .select('*, shelter:shelters(id, name, city, address, phone, email)')
        .eq('id', id.data)
        .in('status', PUBLIC_PET_STATUSES)
        .maybeSingle();

    if (error) throw error;

    return data;
});

// `scope` is set by the server, not by URL filters: the shelter page lists
// only that shelter's pets.
export async function getPublicPets(
    filters: unknown,
    scope: { shelterId?: string } = {},
) {
    const parsed = PetFiltersSchema.parse(filters);
    const page = parsed.page ?? 1;
    const pageSize = parsed.pageSize ?? 20;
    const from = (page - 1) * pageSize;

    const supabase = await supabaseServer();

    let query = supabase
        .from('pets')
        .select('*, shelter:shelters(id, name, city, address, phone, email)', {
            count: 'exact',
        })
        .in('status', PUBLIC_PET_STATUSES)
        .order(parsed.sortBy ?? 'created_at', {
            ascending: parsed.ascending ?? false,
            nullsFirst: false,
        })
        // Stable order across pages when the sort column has ties.
        .order('id');

    if (scope.shelterId) query = query.eq('shelter_id', scope.shelterId);
    if (parsed.species) query = query.eq('species', parsed.species);
    if (parsed.listing_type)
        query = query.eq('listing_type', parsed.listing_type);
    if (parsed.sex) query = query.eq('sex', parsed.sex);
    if (parsed.age) {
        const { min, max } = PET_AGE_GROUP_MONTHS[parsed.age];
        query = query.gte('age_months', min);
        if (max !== null) query = query.lt('age_months', max);
    }
    if (parsed.from_shelter) query = query.not('shelter_id', 'is', null);
    if (parsed.vaccinated) query = query.eq('is_vaccinated', true);
    if (parsed.sterilized) query = query.eq('is_sterilized', true);
    if (parsed.min_price !== undefined)
        query = query.gte('price', parsed.min_price);
    if (parsed.max_price !== undefined)
        query = query.lte('price', parsed.max_price);

    const city = parsed.city ? toSearchPattern(parsed.city) : null;
    if (city) query = query.ilike('city', city);

    if (parsed.breed?.length) query = query.in('breed', parsed.breed);

    // Free-text breeds match by substring; listed breeds are stored as keys,
    // so the query is matched against their names first.
    const q = parsed.q ? toSearchPattern(parsed.q) : null;
    if (q) {
        const conditions = [
            `name.ilike.${q}`,
            `breed.ilike.${q}`,
            `description.ilike.${q}`,
        ];
        const breedKeys = findBreedKeys(parsed.q ?? '', BREED_NAMES);
        if (breedKeys.length) {
            conditions.push(`breed.in.(${breedKeys.join(',')})`);
        }
        query = query.or(conditions.join(','));
    }

    const { data, error, count } = await query.range(from, from + pageSize - 1);

    // PostgREST rejects a range past the last row (e.g. ?page=999): show an empty page.
    if (error?.code === 'PGRST103') return { data: [], total: count ?? 0 };
    if (error) throw error;

    return { data, total: count ?? 0 };
}
