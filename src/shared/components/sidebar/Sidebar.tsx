import SideBarNav from './SidebarNav';
import getProfile from '@shared/lib/supabase/profile';

export default async function Sidebar() {
    const profile = await getProfile();

    return (
        // Stretches to the full grid row, so the account block sits at the bottom.
        <aside className="flex flex-col gap-4 surface-card p-3">
            <SideBarNav role={profile?.role ?? 'user'} />
        </aside>
    );
}
