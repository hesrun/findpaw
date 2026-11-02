import FeaturedPets from '@features/pets/components/public/FeaturedPets';
import { getPublicPets } from '@features/pets/queries';
import { FEATURED_PETS_COUNT } from '@features/pets/constants';

export default async function PetsSection() {
    const pets = await getPublicPets({
        page: 1,
        pageSize: FEATURED_PETS_COUNT,
        sortBy: 'created_at',
        ascending: false,
    });
    return <FeaturedPets initialData={pets} />;
}
