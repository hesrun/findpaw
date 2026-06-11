import SideBarAccount from './SideBarAccount';
import SideBarNav from './SidebarNav';
import { supabaseServer } from '@shared/lib/supabase/server';
import type { Database } from '../../../../supabase/database.types';

type UserRole = Database['public']['Enums']['user_role'];

export default async function Sidebar() {
    const supabase = await supabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    let role: UserRole = 'user';
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
        if (profile?.role) role = profile.role;
    }

    return (
        <aside className="border-r border-border bg-white">
            <div className="flex flex-col gap-6 p-2 h-[calc(100vh-4rem)] sticky top-0">
                <SideBarNav role={role} />
                <SideBarAccount />
            </div>
        </aside>
    );
}
