'use client';

import { useTranslations } from 'next-intl';
import type { PetWithShelter } from '@/types/pets';
import Image from 'next/image';
import { LuMapPin } from 'react-icons/lu';
import ListingChip from '@/shared/components/UI/ListingChips';
import PetPlaceholder from '@UI/PetPlaceholder';

export default function PetCard({ pet }: { pet: PetWithShelter }) {
    const translations = useTranslations('pets');
    const ageTranslations = useTranslations('PetAge');
    const ageFormat =
        pet.age_months < 12
            ? ageTranslations('monthsShort', { count: pet.age_months })
            : ageTranslations('yearsShort', {
                  years: Math.floor(pet.age_months / 12),
              });
    const image = pet.image_url?.[0];
    const facts = [
        pet.breed,
        pet.age_months != null ? ageFormat : null,
        pet.sex && pet.sex !== 'unknown' ? translations(`sex.${pet.sex}`) : null,
    ].filter(Boolean);

    return (
        <article className="h-full bg-surface rounded-card shadow-my ring-1 ring-border flex flex-col">
            <div className="relative m-2 mb-0 aspect-4/3 overflow-hidden rounded-media">
                {image ? (
                    <Image
                        src={image}
                        alt={pet.name ?? ''}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                    />
                ) : (
                    <PetPlaceholder species={pet.species} />
                )}
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                    <ListingChip
                        label={translations(`listingType.${pet.listing_type}`)}
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
                <h3 className="font-display font-extrabold text-xl leading-tight">
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
            </div>
        </article>
    );
}
