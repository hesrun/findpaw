import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { LuArrowLeft } from 'react-icons/lu';
import ImageGallery from '@UI/ImageGallery';
import { ShelterPlaceholder } from '@UI/PetPlaceholder';
import ShelterContacts from '@features/shelters/components/public/ShelterContacts';
import ShelterPets from '@features/shelters/components/public/ShelterPets';
import { getPublicShelter } from '@features/shelters/queries';
import { parsePageParam } from '@features/shelters/schemas';
import { Link } from '@/i18n/navigation';
import { metaDescription, pageMetadata } from '@shared/lib/seo';

type Params = Promise<{ locale: string; id: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
    params,
}: {
    params: Params;
}): Promise<Metadata> {
    const { locale, id } = await params;
    const [shelter, t, tPage] = await Promise.all([
        getPublicShelter(id),
        getTranslations({ locale, namespace: 'sheltersPage.detail' }),
        getTranslations({ locale, namespace: 'sheltersPage' }),
    ]);
    if (!shelter) return {};

    const image = shelter.img_url?.[0];

    return pageMetadata({
        locale,
        path: `/shelters/${shelter.id}`,
        title: t('metaTitle', { name: shelter.name }),
        description:
            metaDescription(shelter.description) || tPage('description'),
        image: image ? { url: image, alt: shelter.name } : undefined,
        type: 'article',
    });
}

export default async function ShelterPage({
    params,
    searchParams,
}: {
    params: Params;
    searchParams: SearchParams;
}) {
    const [{ id }, query] = await Promise.all([params, searchParams]);
    const [shelter, t] = await Promise.all([
        getPublicShelter(id),
        getTranslations('sheltersPage.detail'),
    ]);
    // Missing and malformed ids look the same. As on the pet page,
    // [locale]/loading.tsx streams the response, so this is a 404 page
    // with status 200 and robots noindex rather than an HTTP 404.
    if (!shelter) notFound();

    const page = parsePageParam(query.page);

    return (
        <main className="container pt-8 pb-16">
            <Link
                href="/shelters"
                className="inline-flex items-center gap-1.5 font-heading font-bold text-muted hover:text-accent transition-colors mb-6"
            >
                <LuArrowLeft aria-hidden />
                {t('backToList')}
            </Link>

            <div className="grid gap-8 lg:grid-cols-[7fr_5fr] items-start">
                <div className="grid gap-6">
                    <ImageGallery
                        images={shelter.img_url ?? []}
                        name={shelter.name}
                        placeholder={<ShelterPlaceholder />}
                    />
                    <section className="bg-surface rounded-card shadow-my ring-1 ring-border p-5">
                        <h2 className="font-display font-extrabold text-xl mb-2">
                            {t('about')}
                        </h2>
                        {shelter.description ? (
                            <p className="whitespace-pre-line leading-relaxed">
                                {shelter.description}
                            </p>
                        ) : (
                            <p className="text-muted">{t('noDescription')}</p>
                        )}
                    </section>
                </div>
                <ShelterContacts shelter={shelter} />
            </div>

            <Suspense key={page} fallback={null}>
                <ShelterPets shelterId={shelter.id} page={page} />
            </Suspense>
        </main>
    );
}
