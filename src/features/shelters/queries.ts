import getSupabaseWithUser from '@shared/lib/supabase/auth';
import { supabaseServer } from '@shared/lib/supabase/server';
import { ShelterFiltersSchema } from './schemas';
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

export async function getPublicShelter(shelterId: string) {
    const supabase = await supabaseServer();

    const { data, error } = await supabase
        .from('shelters')
        .select('*')
        .eq('id', shelterId)
        .single();

    if (error) throw error;
    return data;
}

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
        });

    if (parsed.city) query = query.eq('city', parsed.city);
    if (parsed.q) {
        const q = `%${parsed.q}%`;
        query = query.or(`name.ilike.${q},description.ilike.${q}`);
    }

    const { data, error, count } = await query.range(from, from + pageSize - 1);

    if (error) throw error;

    return { data, total: count ?? 0 };
}
