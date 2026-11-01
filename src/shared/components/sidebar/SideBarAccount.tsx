import { getCurrentUser } from '@shared/lib/supabase/auth';
import getProfile from '@shared/lib/supabase/profile';

export default async function SideBarAccount() {
    const { user } = await getCurrentUser();

    if (!user) return null;

    const data = await getProfile();

    return (
        <div className="mt-auto flex items-center gap-2.5 rounded-[20px] bg-hero p-2.5">
            <div className="uppercase size-10 shrink-0 bg-soft text-accent font-display font-extrabold text-lg rounded-full flex items-center justify-center ring-2 ring-surface">
                {data?.full_name?.slice(0, 1)}
            </div>
            <div className="min-w-0">
                <div className="font-bold truncate">{data?.full_name}</div>
                <div className="text-xs text-muted truncate">{user?.email}</div>
            </div>
        </div>
    );
}
