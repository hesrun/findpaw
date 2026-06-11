import PetForm from '@/features/pets/components/dashboard/PetForm';
import { getTranslations } from 'next-intl/server';
import getProfile from '@shared/lib/supabase/profile';
import { getAllShelters } from '@features/shelters/actions';

export default async function AddPet() {
    const t = await getTranslations('dashboard.myPets');

    const profile = await getProfile();
    const shelters =
        profile?.role === 'shelter' ? await getAllShelters() : null;

    return (
        <div>
            <h1 className="text-accent text-3xl font-medium mb-8">
                {t('titles.addPet')}
            </h1>
            <PetForm shelters={shelters} />
        </div>
    );
}
