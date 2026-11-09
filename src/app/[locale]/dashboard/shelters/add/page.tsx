import { getTranslations } from 'next-intl/server';
import ShelterForm from '@/features/shelters/components/dashboard/ShelterForm';
import { getCurrentUser } from '@shared/lib/supabase/auth';
import getProfile from '@shared/lib/supabase/profile';

export default async function AddShelterPage() {
    const [t, profile, { user }] = await Promise.all([
        getTranslations('dashboard.myShelters'),
        getProfile(),
        getCurrentUser(),
    ]);
    return (
        <div>
            <h1 className="text-accent text-3xl font-medium mb-8">
                {t('titles.addShelter')}
            </h1>
            <ShelterForm
                defaultContact={{
                    phone: profile?.phone ?? null,
                    email: user?.email ?? null,
                }}
            />
        </div>
    );
}
