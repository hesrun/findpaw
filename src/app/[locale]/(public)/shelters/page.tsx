import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import SheltersCatalog from '@features/shelters/components/public/SheltersCatalog';
import SheltersCatalogSkeleton from '@features/shelters/components/public/SheltersCatalogSkeleton';
import { parsePageParam } from '@features/shelters/schemas';
import { pageMetadata } from '@shared/lib/seo';
import { ROUTES } from '@shared/constants/routes';

// Pagination pages share the catalog canonical.
export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'sheltersPage' });
    return pageMetadata({
        locale,
        path: ROUTES.shelters,
        title: t('metaTitle'),
        description: t('description'),
    });
}

export default async function SheltersPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const [params, t] = await Promise.all([
        searchParams,
        getTranslations('sheltersPage'),
    ]);
    const page = parsePageParam(params.page);

    return (
        <main className="container pt-10 pb-16">
            <h1 className="font-display font-extrabold text-4xl mb-2">
                {t('title')}
            </h1>
            <p className="text-muted mb-6">{t('description')}</p>
            <Suspense key={page} fallback={<SheltersCatalogSkeleton />}>
                <SheltersCatalog page={page} />
            </Suspense>
        </main>
    );
}
