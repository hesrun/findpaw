import { buttonVariants } from '@heroui/react';
import { getTranslations } from 'next-intl/server';
import type { Enums } from '@supabase/database.types';
import ListingChip from '@UI/ListingChips';
import { Link } from '@/i18n/navigation';
import { countPublicPets } from '@features/pets/queries';
import { countPublicShelters } from '@features/shelters/queries';
import { ABOUT_AUDIENCE, ABOUT_LISTING_TYPES } from './constants';

const LISTING_TYPE_ENTRIES = Object.entries(ABOUT_LISTING_TYPES) as [
    Enums<'pet_listing_type'>,
    (typeof ABOUT_LISTING_TYPES)[Enums<'pet_listing_type'>],
][];

export default async function AboutPage() {
    const [t, tPets, petsCount, sheltersCount] = await Promise.all([
        getTranslations('aboutPage'),
        getTranslations('pets.listingType'),
        countPublicPets(),
        countPublicShelters(),
    ]);

    return (
        <main className="container pt-6 pb-16 grid gap-14">
            <section className="bg-hero rounded-[36px] p-6 sm:p-10 lg:p-14 grid gap-8 lg:grid-cols-[1.4fr_1fr] items-center">
                <div>
                    <h1 className="font-display font-extrabold text-4xl sm:text-5xl leading-[1.05] tracking-tight text-balance">
                        {t('title')}
                    </h1>
                    <p className="mt-4 max-w-[52ch] text-lg text-muted">
                        {t('lead')}
                    </p>
                </div>
                <dl className="grid grid-cols-2 gap-3">
                    <div className="bg-surface rounded-card shadow-my ring-1 ring-border p-5">
                        <dt className="text-sm font-bold text-muted">
                            {t('stats.pets')}
                        </dt>
                        <dd className="font-display font-extrabold text-4xl text-accent">
                            {petsCount}
                        </dd>
                    </div>
                    <div className="bg-surface rounded-card shadow-my ring-1 ring-border p-5">
                        <dt className="text-sm font-bold text-muted">
                            {t('stats.shelters')}
                        </dt>
                        <dd className="font-display font-extrabold text-4xl text-accent">
                            {sheltersCount}
                        </dd>
                    </div>
                </dl>
            </section>

            <section>
                <h2 className="font-display font-extrabold text-3xl mb-2">
                    {t('listingTypesTitle')}
                </h2>
                <p className="text-muted mb-6 max-w-[60ch]">
                    {t('listingTypesLead')}
                </p>
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {LISTING_TYPE_ENTRIES.map(([type, Icon]) => (
                        <li
                            key={type}
                            className="bg-surface rounded-card shadow-my ring-1 ring-border p-5 grid gap-3 content-start"
                        >
                            <span
                                aria-hidden
                                className="size-11 rounded-2xl bg-soft text-accent flex items-center justify-center text-xl"
                            >
                                <Icon />
                            </span>
                            <ListingChip label={tPets(type)} type={type} />
                            <p className="text-sm leading-relaxed">
                                {t(`listingTypes.${type}`)}
                            </p>
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2 className="font-display font-extrabold text-3xl mb-6">
                    {t('audienceTitle')}
                </h2>
                <ul className="grid gap-4 md:grid-cols-2">
                    {ABOUT_AUDIENCE.map(({ key, icon: Icon }) => (
                        <li
                            key={key}
                            className="bg-surface rounded-card shadow-my ring-1 ring-border p-6 flex gap-4"
                        >
                            <span
                                aria-hidden
                                className="size-12 shrink-0 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center text-2xl"
                            >
                                <Icon />
                            </span>
                            <div>
                                <h3 className="font-display font-extrabold text-xl mb-1">
                                    {t(`audience.${key}.title`)}
                                </h3>
                                <p className="text-muted leading-relaxed">
                                    {t(`audience.${key}.text`)}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="bg-soft rounded-[36px] p-6 sm:p-10 text-center grid gap-4 justify-items-center">
                <h2 className="font-display font-extrabold text-3xl text-balance">
                    {t('ctaTitle')}
                </h2>
                <p className="text-muted max-w-[52ch]">{t('ctaText')}</p>
                <div className="flex flex-wrap justify-center gap-3">
                    <Link
                        href="/pets"
                        className={buttonVariants({ size: 'lg' })}
                    >
                        {t('ctaBrowse')}
                    </Link>
                    <Link
                        href="/dashboard/pets/add"
                        className={buttonVariants({
                            size: 'lg',
                            variant: 'outline',
                        })}
                    >
                        {t('ctaAdd')}
                    </Link>
                </div>
            </section>
        </main>
    );
}
