import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import PetCatalogShell from '@features/pets/components/public/catalog/PetCatalogShell';
import PetsCatalog from '@features/pets/components/public/PetsCatalog';
import PetsCatalogSkeleton from '@features/pets/components/public/PetsCatalogSkeleton';
import {
    PetFiltersSchema,
    type PetFilters as Filters,
} from '@features/pets/schemas';
import { pageMetadata } from '@shared/lib/seo';

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

// Filtered views share the catalog canonical: the filter combinations are
// near-duplicates of it and should not be indexed separately.
export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'petsPage' });
    return pageMetadata({
        locale,
        path: '/pets',
        title: t('metaTitle'),
        description: t('description'),
    });
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
            <PetCatalogShell>
                <Suspense
                    key={JSON.stringify(filters)}
                    fallback={<PetsCatalogSkeleton />}
                >
                    <PetsCatalog filters={filters} />
                </Suspense>
            </PetCatalogShell>
        </main>
    );
}
