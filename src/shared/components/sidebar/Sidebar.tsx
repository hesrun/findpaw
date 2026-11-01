import SideBarAccount from './SideBarAccount';
import SideBarNav from './SidebarNav';
import getProfile from '@shared/lib/supabase/profile';

export default async function Sidebar() {
    const profile = await getProfile();

    return (
        <aside className="bg-white rounded-2xl">
            <SideBarNav role={profile?.role ?? 'user'} />
            <SideBarAccount />
        </aside>
    );
}
