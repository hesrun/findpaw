import SideBarAccount from './SideBarAccount';
import SideBarNav from './SidebarNav';
import getProfile from '@shared/lib/supabase/profile';

export default async function Sidebar() {
    const profile = await getProfile();

    return (
        // Stretches to the full grid row, so the account block sits at the bottom.
        <aside className="flex flex-col gap-4 rounded-card bg-surface p-3 shadow-my ring-1 ring-border">
            <SideBarNav role={profile?.role ?? 'user'} />
            <SideBarAccount />
        </aside>
    );
}
