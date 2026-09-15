import { getMyPet } from '@features/pets/queries';
import PetForm from '@/features/pets/components/dashboard/PetForm';
import getProfile from '@shared/lib/supabase/profile';
import { getMyAllShelters } from '@features/shelters/queries';

export default async function PetEditPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = await params;

    const pet = await getMyPet(id);
    const profile = await getProfile();
    const shelters =
        profile?.role === 'shelter' ? await getMyAllShelters() : null;

    return (
        <div>
            <h1 className="text-accent text-3xl font-medium mb-8">Edit Pet</h1>
            <PetForm shelters={shelters} initialData={pet} />
        </div>
    );
}
