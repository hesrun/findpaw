import { getTranslations } from 'next-intl/server';
import { getCurrentUser } from '@shared/lib/supabase/auth';
import getProfile from '@shared/lib/supabase/profile';
import SettingsTabs from '@features/account/components/settings/SettingsTabs';
import DashboardPageHeader from '@UI/DashboardPageHeader';

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
        <>
            <DashboardPageHeader
                title={t('title')}
                description={t('description')}
            />
            <SettingsTabs profile={profile} email={user.email ?? ''} />
        </>
    );
}
