import { supabaseServer } from './server';

export default async function getSupabaseWithUser() {
    const supabase = await supabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    return { supabase, user };
}
