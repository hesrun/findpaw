import { getPet } from '@features/pets/actions';
import PetForm from '@/features/pets/components/dashboard/PetForm';
import getProfile from '@shared/lib/supabase/profile';
import { getAllShelters } from '@features/shelters/actions';

export default async function PetEditPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = await params;

    const pet = await getPet(id);
    const profile = await getProfile();
    const shelters =
        profile?.role === 'shelter' ? await getAllShelters() : null;

    return (
        <div>
            <h1 className="text-accent text-3xl font-medium mb-8">Edit Pet</h1>
            <PetForm shelters={shelters} initialData={pet} />
        </div>
    );
}
