import FeaturedShelters from '@features/shelters/components/public/FeaturedShelters';
import { getPublicShelters } from '@features/shelters/queries';

const PAGE_SIZE = 6;

export default async function SheltersSection() {
    const shelters = await getPublicShelters({
        page: 1,
        pageSize: PAGE_SIZE,
        sortBy: 'created_at',
        ascending: false,
    });

    return <FeaturedShelters initialData={shelters} />;
}
