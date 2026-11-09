import PetForm from '@/features/pets/components/dashboard/PetForm';
import { getTranslations } from 'next-intl/server';
import getProfile from '@shared/lib/supabase/profile';
import { getMyAllShelters } from '@features/shelters/queries';
import DashboardPageHeader from '@UI/DashboardPageHeader';

export default async function AddPet() {
    const t = await getTranslations('dashboard.myPets');

    const profile = await getProfile();
    const shelters =
        profile?.role === 'shelter' ? await getMyAllShelters() : null;

    return (
        <>
            <DashboardPageHeader title={t('titles.addPet')} />
            <PetForm shelters={shelters} />
        </>
    );
}
