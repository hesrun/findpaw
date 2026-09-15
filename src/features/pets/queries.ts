import getSupabaseWithUser from '@shared/lib/supabase/auth';
import { supabaseServer } from '@shared/lib/supabase/server';
import { z } from 'zod';
import { PetFiltersSchema } from './schemas';
import type { Database } from '@supabase/database.types';

export type PetFilters = z.infer<typeof PetFiltersSchema>;

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

export async function getPublicPet(petId: string) {
    const supabase = await supabaseServer();
    const { data, error } = await supabase
        .from('pets')
        .select('*, shelter:shelters(id, name, city, address, phone, email)')
        .eq('id', petId)
        .single();

    if (error) throw error;

    return data;
}

export async function getPublicPets(filters: unknown) {
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
        .order(parsed.sortBy || 'created_at', {
            ascending: parsed.ascending ?? false,
        });

    if (parsed.species)
        query = query.eq(
            'species',
            parsed.species as Database['public']['Enums']['pet_species'],
        );
    if (parsed.city) query = query.eq('city', parsed.city);
    if (parsed.breed) query = query.eq('breed', parsed.breed);
    if (parsed.listing_type)
        query = query.eq(
            'listing_type',
            parsed.listing_type as Database['public']['Enums']['pet_listing_type'],
        );
    if (parsed.min_price !== undefined)
        query = query.gte('price', parsed.min_price);
    if (parsed.max_price !== undefined)
        query = query.lte('price', parsed.max_price);
    if (parsed.q) {
        const q = `%${parsed.q}%`;
        query = query.or(`name.ilike.${q},description.ilike.${q}`);
    }

    const { data, error, count } = await query.range(from, from + pageSize - 1);

    if (error) throw error;

    return { data, total: count ?? 0 };
}
