import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { LuArrowLeft } from 'react-icons/lu';
import PetDetails from '@features/pets/components/public/PetDetails';
import ImageGallery from '@UI/ImageGallery';
import PetPlaceholder from '@UI/PetPlaceholder';
import { getPublicPet } from '@features/pets/queries';
import { Link } from '@/i18n/navigation';
import { metaDescription, pageMetadata } from '@shared/lib/seo';
import { ROUTES } from '@shared/constants/routes';

type Params = Promise<{ locale: string; id: string }>;

export async function generateMetadata({
    params,
}: {
    params: Params;
}): Promise<Metadata> {
    const { locale, id } = await params;
    const [pet, t, tPets, tPage] = await Promise.all([
        getPublicPet(id),
        getTranslations({ locale, namespace: 'petsPage.detail' }),
        getTranslations({ locale, namespace: 'pets' }),
        getTranslations({ locale, namespace: 'petsPage' }),
    ]);
    if (!pet) return {};

    const name = pet.name || t('unnamed');
    const image = pet.image_url?.[0];

    return pageMetadata({
        locale,
        path: ROUTES.pet(pet.id),
        title: t('metaTitle', {
            name,
            listingType: tPets(`listingType.${pet.listing_type}`),
        }),
        description:
            metaDescription(pet.description) || tPage('description'),
        image: image ? { url: image, alt: name } : undefined,
        type: 'article',
    });
}

export default async function PetPage({ params }: { params: Params }) {
    const { id } = await params;
    const [pet, t] = await Promise.all([
        getPublicPet(id),
        getTranslations('petsPage.detail'),
    ]);
    // Missing, malformed, hidden and closed listings all look the same.
    // [locale]/loading.tsx streams the response, so this renders the 404 page
    // with status 200 and robots noindex rather than an HTTP 404.
    if (!pet) notFound();

    return (
        <main className="container pt-8 pb-16">
            <Link
                href={ROUTES.pets}
                className="inline-flex items-center gap-1.5 font-heading font-bold text-muted hover:text-accent transition-colors mb-6"
            >
                <LuArrowLeft aria-hidden />
                {t('backToList')}
            </Link>

            <div className="grid gap-8 lg:grid-cols-[7fr_5fr] items-start">
                <div className="grid gap-6">
                    <ImageGallery
                        images={pet.image_url ?? []}
                        name={pet.name || t('unnamed')}
                        placeholder={<PetPlaceholder species={pet.species} />}
                    />
                    <section className="surface-card p-5">
                        <h2 className="font-display font-extrabold text-xl mb-2">
                            {t('about')}
                        </h2>
                        {pet.description ? (
                            <p className="whitespace-pre-line leading-relaxed">
                                {pet.description}
                            </p>
                        ) : (
                            <p className="text-muted">{t('noDescription')}</p>
                        )}
                    </section>
                </div>
                <PetDetails pet={pet} />
            </div>
        </main>
    );
}
