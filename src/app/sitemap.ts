import type { MetadataRoute } from 'next';
import { getSitemapPets } from '@features/pets/queries';
import { getSitemapShelters } from '@features/shelters/queries';
import { SITE_URL, SITEMAP_STATIC_PATHS } from '@shared/constants/seo';
import { sitemapEntries } from '@shared/lib/seo';

// Static public pages plus every public pet and shelter (docs/seo.md).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [pets, shelters] = await Promise.all([
        getSitemapPets(),
        getSitemapShelters(),
    ]);

    return [
        ...SITEMAP_STATIC_PATHS.flatMap((path) =>
            sitemapEntries(SITE_URL, path),
        ),
        ...pets.flatMap((pet) =>
            sitemapEntries(SITE_URL, `/pets/${pet.id}`, pet.updated_at),
        ),
        ...shelters.flatMap((shelter) =>
            sitemapEntries(
                SITE_URL,
                `/shelters/${shelter.id}`,
                shelter.updated_at,
            ),
        ),
    ];
}
