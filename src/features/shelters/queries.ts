import getSupabaseWithUser from '@shared/lib/supabase/auth';
import { supabaseServer } from '@shared/lib/supabase/server';
import { cache } from 'react';
import { ShelterFiltersSchema, ShelterIdSchema } from './schemas';
import { z } from 'zod';

export type ShelterFilters = z.infer<typeof ShelterFiltersSchema>;

export async function getMyShelter(shelterId: string) {
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

export async function getMyAllShelters() {
    const { supabase, user } = await getSupabaseWithUser();

    const { data, error } = await supabase
        .from('shelters')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return data;
}

export async function getMyShelters(page: number, pageSize: number = 20) {
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

// Count only (HEAD request, no rows) for public stats.
export async function countPublicShelters() {
    const supabase = await supabaseServer();
    const { count, error } = await supabase
        .from('shelters')
        .select('id', { count: 'exact', head: true });

    if (error) throw error;

    return count ?? 0;
}

// Returns null for malformed ids and missing shelters.
// cache() lets generateMetadata and the page share one query per request.
export const getPublicShelter = cache(async (shelterId: string) => {
    const id = ShelterIdSchema.safeParse(shelterId);
    if (!id.success) return null;

    const supabase = await supabaseServer();

    const { data, error } = await supabase
        .from('shelters')
        .select('*')
        .eq('id', id.data)
        .maybeSingle();

    if (error) throw error;
    return data;
});

export async function getPublicShelters(filters: unknown) {
    const parsed = ShelterFiltersSchema.parse(filters);
    const page = parsed.page ?? 1;
    const pageSize = parsed.pageSize ?? 20;
    const from = (page - 1) * pageSize;

    const supabase = await supabaseServer();

    let query = supabase
        .from('shelters')
        .select('*', { count: 'exact' })
        .order(parsed.sortBy || 'created_at', {
            ascending: parsed.ascending ?? false,
        })
        // Stable order across pages when the sort column has ties.
        .order('id');

    if (parsed.city) query = query.eq('city', parsed.city);
    if (parsed.q) {
        const q = `%${parsed.q}%`;
        query = query.or(`name.ilike.${q},description.ilike.${q}`);
    }

    const { data, error, count } = await query.range(from, from + pageSize - 1);

    // PostgREST rejects a range past the last row (e.g. ?page=999): show an empty page.
    if (error?.code === 'PGRST103') return { data: [], total: count ?? 0 };
    if (error) throw error;

    return { data, total: count ?? 0 };
}
