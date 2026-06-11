import getSupabaseWithUser from './auth';

export default async function getProfile() {
    const { supabase, user } = await getSupabaseWithUser();

    const { data: profile } = await supabase
        .from('profiles')
        .select(`*`)
        .eq('id', user?.id)
        .single();

    return profile;
}
