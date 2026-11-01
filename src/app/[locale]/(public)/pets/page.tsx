import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import PetFilters from '@features/pets/components/public/PetFilters';
import PetsCatalog from '@features/pets/components/public/PetsCatalog';
import PetsCatalogSkeleton from '@features/pets/components/public/PetsCatalogSkeleton';
import {
    PetFiltersSchema,
    type PetFilters as Filters,
} from '@features/pets/schemas';

type SearchParams = Record<string, string | string[] | undefined>;

// Repeated keys (?species=a&species=b) collapse to the first value; malformed
// filters fall back to the unfiltered catalog instead of an error page.
function parseFilters(searchParams: SearchParams): Filters {
    const flat = Object.fromEntries(
        Object.entries(searchParams).map(([key, value]) => [
            key,
            Array.isArray(value) ? value[0] : value,
        ]),
    );
    const parsed = PetFiltersSchema.safeParse(flat);
    return parsed.success ? parsed.data : {};
}

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('petsPage');
    return {
        title: t('metaTitle'),
        description: t('description'),
    };
}

export default async function PetsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const [params, t] = await Promise.all([
        searchParams,
        getTranslations('petsPage'),
    ]);
    const filters = parseFilters(params);

    return (
        <main className="container pt-10 pb-16">
            <h1 className="font-display font-extrabold text-4xl mb-2">
                {t('title')}
            </h1>
            <p className="text-muted mb-6">{t('description')}</p>
            <PetFilters>
                <Suspense
                    key={JSON.stringify(filters)}
                    fallback={<PetsCatalogSkeleton />}
                >
                    <PetsCatalog filters={filters} />
                </Suspense>
            </PetFilters>
        </main>
    );
}
