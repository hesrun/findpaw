import { getTranslations } from 'next-intl/server';
import { getMyPet } from '@features/pets/queries';
import PetForm from '@/features/pets/components/dashboard/PetForm';
import getProfile from '@shared/lib/supabase/profile';
import { getMyAllShelters } from '@features/shelters/queries';
import DashboardPageHeader from '@UI/DashboardPageHeader';

export default async function PetEditPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const t = await getTranslations('dashboard.myPets');

    const pet = await getMyPet(id);
    const profile = await getProfile();
    const shelters =
        profile?.role === 'shelter' ? await getMyAllShelters() : null;

    return (
        <>
            <DashboardPageHeader title={t('titles.editPet')} />
            <PetForm shelters={shelters} initialData={pet} />
        </>
    );
}
