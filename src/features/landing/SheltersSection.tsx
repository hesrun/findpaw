import FeaturedShelters from '@features/shelters/components/public/FeaturedShelters';
import { getPublicShelters } from '@features/shelters/queries';

import { FEATURED_SHELTERS_COUNT } from '@features/shelters/constants';

export default async function SheltersSection() {
    const shelters = await getPublicShelters({
        page: 1,
        pageSize: FEATURED_SHELTERS_COUNT,
        sortBy: 'created_at',
        ascending: false,
    });

    return <FeaturedShelters initialData={shelters} />;
}
