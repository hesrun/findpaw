'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FEATURED_PETS_COUNT, LISTING_TYPES } from '../../constants';
import type { PetFilters } from '../../schemas';
import type { getPublicPets } from '../../queries';
import { usePublicPets } from '../../hooks';
import PetCard from './PetCard';
import PetCardSkeleton from './PetCardSkeleton';
import clsx from 'clsx';
import ArrowLink from '@UI/ArrowLink';

type PublicPetsResult = Awaited<ReturnType<typeof getPublicPets>>;

const FILTER_BUTTON_BASE_CLASS =
    'px-4 py-1.5 rounded-full text-sm font-heading font-bold transition-colors duration-300 cursor-pointer';
const FILTER_BUTTON_ACTIVE_CLASS =
    'bg-accent text-accent-foreground shadow-[0_8px_18px_-8px_color-mix(in_oklch,var(--accent)_55%,transparent)]';
const FILTER_BUTTON_INACTIVE_CLASS =
    'bg-surface text-muted ring-1 ring-border hover:text-accent';

function getFilterButtonClass(isActive: boolean) {
    return clsx(
        FILTER_BUTTON_BASE_CLASS,
        isActive ? FILTER_BUTTON_ACTIVE_CLASS : FILTER_BUTTON_INACTIVE_CLASS,
    );
}

export default function FeaturedPets({
    initialData,
}: {
    initialData: PublicPetsResult;
}) {
    const tHome = useTranslations('HomePage');
    const tListingType = useTranslations('pets.listingType');
    const [filters, setFilters] = useState<PetFilters>({
        pageSize: FEATURED_PETS_COUNT,
    });
    // Server-rendered data matches only the unfiltered "all listings" tab.
    const { data, isFetching } = usePublicPets(
        filters,
        filters.listing_type ? undefined : initialData,
    );
    const pets = data?.data ?? [];

    return (
        <section>
            <div className="container">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mt-14 mb-4">
                    <h2 className="font-display font-extrabold text-3xl">
                        {tHome('recentPetsTitle')}
                    </h2>
                    <ArrowLink href="/pets">{tHome('viewAllPets')}</ArrowLink>
                </div>

                <div className="flex flex-wrap gap-2 mb-6" role="tablist">
                    <button
                        type="button"
                        aria-pressed={!filters.listing_type}
                        className={getFilterButtonClass(!filters.listing_type)}
                        onClick={() =>
                            setFilters({ pageSize: FEATURED_PETS_COUNT })
                        }
                    >
                        {tHome('allListings')}
                    </button>
                    {LISTING_TYPES.map(({ id }) => (
                        <button
                            key={id}
                            type="button"
                            aria-pressed={filters.listing_type === id}
                            className={getFilterButtonClass(
                                filters.listing_type === id,
                            )}
                            onClick={() =>
                                setFilters({
                                    listing_type: id,
                                    pageSize: FEATURED_PETS_COUNT,
                                })
                            }
                        >
                            {tListingType(id)}
                        </button>
                    ))}
                </div>
                {isFetching ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Array.from({ length: FEATURED_PETS_COUNT }).map(
                            (_, index) => (
                                <PetCardSkeleton key={index} />
                            ),
                        )}
                    </div>
                ) : pets.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {pets.map((pet) => (
                            <li key={pet.id}>
                                <PetCard pet={pet} />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>{tHome('noPetsFound')}</p>
                )}
            </div>
        </section>
    );
}
