'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import PetPlaceholder from '@UI/PetPlaceholder';
import type { Enums } from '@supabase/database.types';

export default function PetGallery({
    images,
    name,
    species,
}: {
    images: string[];
    name: string;
    species: Enums<'pet_species'>;
}) {
    const t = useTranslations('petsPage.detail');
    const [activeIndex, setActiveIndex] = useState(0);
    const active = images[activeIndex];

    return (
        <div className="grid gap-3">
            <div className="relative aspect-4/3 overflow-hidden rounded-card bg-soft ring-1 ring-border">
                {active ? (
                    <Image
                        src={active}
                        alt={name}
                        fill
                        priority
                        sizes="(min-width: 1024px) 58vw, 100vw"
                        className="object-cover"
                    />
                ) : (
                    <PetPlaceholder species={species} />
                )}
            </div>

            {images.length > 1 && (
                <ul className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {images.map((url, index) => (
                        <li key={url}>
                            <button
                                type="button"
                                aria-label={t('photo', { index: index + 1 })}
                                aria-pressed={index === activeIndex}
                                onClick={() => setActiveIndex(index)}
                                className={clsx(
                                    'relative block w-full aspect-square overflow-hidden rounded-media cursor-pointer transition',
                                    index === activeIndex
                                        ? 'ring-3 ring-accent'
                                        : 'ring-1 ring-border opacity-70 hover:opacity-100',
                                )}
                            >
                                <Image
                                    src={url}
                                    alt=""
                                    fill
                                    sizes="120px"
                                    className="object-cover"
                                />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
