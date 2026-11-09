import { getTranslations } from 'next-intl/server';
import ShelterForm from '@/features/shelters/components/dashboard/ShelterForm';
import { getCurrentUser } from '@shared/lib/supabase/auth';
import getProfile from '@shared/lib/supabase/profile';
import DashboardPageHeader from '@UI/DashboardPageHeader';

export default async function AddShelterPage() {
    const [t, profile, { user }] = await Promise.all([
        getTranslations('dashboard.myShelters'),
        getProfile(),
        getCurrentUser(),
    ]);
    return (
        <>
            <DashboardPageHeader title={t('titles.addShelter')} />
            <ShelterForm
                defaultContact={{
                    phone: profile?.phone ?? null,
                    email: user?.email ?? null,
                }}
            />
        </>
    );
}
