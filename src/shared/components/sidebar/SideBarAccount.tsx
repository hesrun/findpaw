import { supabaseServer } from '../../lib/supabase/server';

export default async function SideBarAccount() {
    const supabase = await supabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user?.id)
        .single();

    return (
        <div className="mt-auto flex items-center gap-2 p-2">
            <div className="uppercase w-10 h-10 bg-accent white text-white rounded-full flex items-center justify-center">
                {data?.full_name?.slice(0, 1)}
            </div>
            <div>
                <div className="font-medium">{data?.full_name}</div>
                <div className="text-xs">{user?.email}</div>
            </div>
        </div>
    );
}
