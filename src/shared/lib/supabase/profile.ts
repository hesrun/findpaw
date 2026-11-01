import { cache } from 'react';
import { getCurrentUser } from './auth';

// Memoized per request; returns null for anonymous visitors.
const getProfile = cache(async () => {
    const { supabase, user } = await getCurrentUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select(`*`)
        .eq('id', user.id)
        .maybeSingle();

    return profile;
});

export default getProfile;
