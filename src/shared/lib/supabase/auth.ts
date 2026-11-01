import { cache } from 'react';
import { supabaseServer } from './server';

// Memoized per request: every caller in one render shares a single auth round-trip.
export const getCurrentUser = cache(async () => {
    const supabase = await supabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return { supabase, user };
});

export default async function getSupabaseWithUser() {
    const { supabase, user } = await getCurrentUser();

    if (!user) throw new Error('Unauthorized');

    return { supabase, user };
}
