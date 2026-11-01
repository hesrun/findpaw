import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { LuArrowLeft } from 'react-icons/lu';
import PetDetails from '@features/pets/components/public/PetDetails';
import PetGallery from '@features/pets/components/public/PetGallery';
import { getPublicPet } from '@features/pets/queries';
import { Link } from '@/i18n/navigation';

type Params = Promise<{ locale: string; id: string }>;

const META_DESCRIPTION_LENGTH = 160;

export async function generateMetadata({
    params,
}: {
    params: Params;
}): Promise<Metadata> {
    const { id } = await params;
    const [pet, t, tPets, tPage] = await Promise.all([
        getPublicPet(id),
        getTranslations('petsPage.detail'),
        getTranslations('pets'),
        getTranslations('petsPage'),
    ]);
    if (!pet) return {};

    const name = pet.name || t('unnamed');
    const title = t('metaTitle', {
        name,
        listingType: tPets(`listingType.${pet.listing_type}`),
    });
    const description =
        pet.description?.slice(0, META_DESCRIPTION_LENGTH) ||
        tPage('description');
    const image = pet.image_url?.[0];

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            ...(image && { images: [{ url: image, alt: name }] }),
        },
    };
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
                href="/pets"
                className="inline-flex items-center gap-1.5 font-heading font-bold text-muted hover:text-accent transition-colors mb-6"
            >
                <LuArrowLeft aria-hidden />
                {t('backToList')}
            </Link>

            <div className="grid gap-8 lg:grid-cols-[7fr_5fr] items-start">
                <div className="grid gap-6">
                    <PetGallery
                        images={pet.image_url ?? []}
                        name={pet.name || t('unnamed')}
                        species={pet.species}
                    />
                    <section className="bg-surface rounded-card shadow-my ring-1 ring-border p-5">
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
