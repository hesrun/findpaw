'use client';

import { useLocale, useTranslations } from 'next-intl';
import type { PetWithShelter } from '@/types/pets';
import CloudImage from '@shared/components/UI/CloudImage';
import { LuGift, LuMapPin } from 'react-icons/lu';
import ListingChip from '@/shared/components/UI/ListingChips';
import { formatCzk } from '@shared/helpers/currencyFormat';
import { PRICED_LISTING_TYPE, REWARD_LISTING_TYPE } from '../../constants';
import { usePetCardFacts } from '@features/pets/hooks/usePetCardFacts';
import PetPlaceholder from '@UI/PetPlaceholder';
import { Link } from '@/i18n/navigation';

export default function PetCard({ pet }: { pet: PetWithShelter }) {
    const translations = useTranslations('pets');
    const tDetail = useTranslations('petsPage.detail');
    const locale = useLocale();
    const price =
        pet.listing_type === PRICED_LISTING_TYPE && pet.price
            ? formatCzk(pet.price, locale)
            : null;
    const reward =
        pet.listing_type === REWARD_LISTING_TYPE && pet.reward
            ? formatCzk(pet.reward, locale)
            : null;
    const image = pet.image_url?.[0];
    const facts = usePetCardFacts(pet);

    return (
        <Link
            href={`/pets/${pet.id}`}
            className="group block h-full rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
            <article className="h-full bg-surface rounded-card shadow-my ring-1 ring-border flex flex-col transition-shadow duration-300 group-hover:ring-accent/40">
                <div className="relative m-2 mb-0 aspect-4/3 overflow-hidden rounded-media">
                    {image ? (
                        <CloudImage
                            src={image}
                            alt={pet.name ?? ''}
                            fill
                            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <PetPlaceholder species={pet.species} />
                    )}
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                        <ListingChip
                            label={translations(
                                `listingType.${pet.listing_type}`,
                            )}
                            type={pet.listing_type}
                        />
                        {pet.status === 'reserved' && (
                            <span className="inline-flex items-center rounded-full bg-[#ffe2c4] px-3 py-1 text-xs font-extrabold text-[#7c2d12]">
                                {translations('reserved')}
                            </span>
                        )}
                    </div>
                </div>
                <div className="grid gap-1.5 px-4 pt-3 pb-4">
                    <h3 className="font-display font-extrabold text-xl leading-tight transition-colors duration-300 group-hover:text-accent">
                        {pet.name}
                    </h3>
                    {facts.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {facts.map((fact) => (
                                <span
                                    key={fact}
                                    className="rounded-full bg-soft px-2.5 py-0.5 text-[13px] font-bold text-muted"
                                >
                                    {fact}
                                </span>
                            ))}
                        </div>
                    )}
                    {pet.city && (
                        <p className="flex items-center gap-1 text-[13px] text-muted">
                            <LuMapPin aria-hidden className="size-3.5" />
                            {pet.city}
                        </p>
                    )}
                    {price && (
                        <p className="font-display font-extrabold text-lg text-accent">
                            <span className="sr-only">{tDetail('price')}: </span>
                            {price}
                        </p>
                    )}
                    {reward && (
                        <p className="inline-flex items-center gap-1.5 self-start rounded-full bg-amber-100 px-3 py-1 text-sm font-extrabold text-amber-800">
                            <LuGift aria-hidden className="shrink-0" />
                            {tDetail('rewardShort', { amount: reward })}
                        </p>
                    )}
                </div>
            </article>
        </Link>
    );
}
