import FeaturedPets from '@features/pets/components/public/FeaturedPets';
import { getPublicPets } from '@features/pets/queries';

export default async function PetsSection() {
    const pets = await getPublicPets({
        page: 1,
        pageSize: 8,
        sortBy: 'created_at',
        ascending: false,
    });
    return <FeaturedPets initialData={pets} />;
}
