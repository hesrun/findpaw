import { getTranslations } from 'next-intl/server';
import { getCurrentUser } from '@shared/lib/supabase/auth';
import getProfile from '@shared/lib/supabase/profile';
import SettingsTabs from '@features/account/components/settings/SettingsTabs';

export default async function DashboardSettings() {
    const [t, profile, { user }] = await Promise.all([
        getTranslations('dashboard.settings'),
        getProfile(),
        getCurrentUser(),
    ]);

    // The proxy lets only signed-in users into /dashboard, and every user
    // gets a profile row from the sign-up trigger.
    if (!profile || !user) return null;

    return (
        <div className="grid gap-6">
            <h1 className="text-accent text-3xl font-medium">{t('title')}</h1>
            <SettingsTabs profile={profile} email={user.email ?? ''} />
        </div>
    );
}
