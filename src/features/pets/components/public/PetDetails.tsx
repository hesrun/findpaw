import { getLocale, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { LuBadgeAlert, LuMapPin } from 'react-icons/lu';
import { TbScissors, TbVaccine } from 'react-icons/tb';
import ListingChip from '@/shared/components/UI/ListingChips';
import { formatAge } from '@shared/helpers/ageFormat';
import { formatDate } from '@shared/helpers/dateFormat';
import type { PetWithShelter } from '@/types/pets';
import PetShelterContact from './PetShelterContact';

function Fact({ label, value }: { label: string; value: ReactNode }) {
    return (
        <div className="rounded-media bg-soft px-4 py-3">
            <dt className="text-xs font-bold uppercase tracking-wide text-muted">
                {label}
            </dt>
            <dd className="font-heading font-bold text-lg first-letter:uppercase">
                {value}
            </dd>
        </div>
    );
}

function HealthItem({
    icon,
    label,
    value,
    tone,
}: {
    icon: ReactNode;
    label: string;
    value: string;
    tone: string;
}) {
    return (
        <li className="flex items-center gap-3">
            <span
                aria-hidden
                className={`${tone} text-white rounded-2xl size-10 shrink-0 flex items-center justify-center text-xl`}
            >
                {icon}
            </span>
            <span className="grid">
                <span className="text-sm text-muted">{label}</span>
                <b className="font-heading">{value}</b>
            </span>
        </li>
    );
}

export default async function PetDetails({ pet }: { pet: PetWithShelter }) {
    const [t, tPets, tGlobal, locale] = await Promise.all([
        getTranslations('petsPage.detail'),
        getTranslations('pets'),
        getTranslations('global'),
        getLocale(),
    ]);
    const dateLocale = locale === 'cs' ? 'cs' : 'en';
    const age = await formatAge(pet.age_months, 'full');

    // A pet attached to a shelter lives at the shelter's address.
    const location = (
        pet.shelter
            ? [pet.shelter.city, pet.shelter.address]
            : [pet.city, pet.address]
    )
        .filter(Boolean)
        .join(', ');

    const yesNo = (value: boolean | null) =>
        value ? tGlobal('yes') : tGlobal('no');

    return (
        <div className="grid gap-6 content-start">
            <div className="grid gap-3">
                <div className="flex flex-wrap gap-1.5">
                    <ListingChip
                        label={tPets(`listingType.${pet.listing_type}`)}
                        type={pet.listing_type}
                        className="ring-1 ring-border"
                    />
                    {pet.status === 'reserved' && (
                        <span className="inline-flex items-center rounded-full bg-[#ffe2c4] px-3 py-1 text-xs font-extrabold text-[#7c2d12]">
                            {tPets('reserved')}
                        </span>
                    )}
                </div>
                <h1 className="font-display font-extrabold text-4xl leading-tight">
                    {pet.name || t('unnamed')}
                </h1>
                {location && (
                    <p className="flex items-center gap-1.5 text-muted">
                        <LuMapPin aria-hidden className="shrink-0" />
                        <span>
                            <span className="sr-only">{t('location')}: </span>
                            {location}
                        </span>
                    </p>
                )}
                {pet.listing_type === 'sale' && (
                    <p className="font-display font-extrabold text-3xl text-accent">
                        <span className="sr-only">{t('price')}: </span>
                        {pet.price
                            ? new Intl.NumberFormat(
                                  dateLocale === 'cs' ? 'cs-CZ' : 'en-US',
                                  {
                                      style: 'currency',
                                      currency: 'CZK',
                                      maximumFractionDigits: 0,
                                  },
                              ).format(pet.price)
                            : t('free')}
                    </p>
                )}
            </div>

            <dl className="grid grid-cols-2 gap-2">
                <Fact
                    label={t('species')}
                    value={tPets(`species.${pet.species}`)}
                />
                <Fact label={t('age')} value={age} />
                {pet.breed && <Fact label={t('breed')} value={pet.breed} />}
                {pet.sex && pet.sex !== 'unknown' && (
                    <Fact label={t('sex')} value={tPets(`sex.${pet.sex}`)} />
                )}
            </dl>

            <section className="bg-surface rounded-card shadow-my ring-1 ring-border p-5">
                <h2 className="font-display font-extrabold text-xl mb-4">
                    {t('health')}
                </h2>
                <ul className="grid gap-3 sm:grid-cols-3">
                    <HealthItem
                        icon={<TbVaccine />}
                        label={t('vaccinated')}
                        value={yesNo(pet.is_vaccinated)}
                        tone="bg-green-500"
                    />
                    <HealthItem
                        icon={<TbScissors />}
                        label={t('sterilized')}
                        value={yesNo(pet.is_sterilized)}
                        tone="bg-blue-500"
                    />
                    <HealthItem
                        icon={<LuBadgeAlert />}
                        label={t('specialNeeds')}
                        value={yesNo(pet.is_special_needs)}
                        tone="bg-red-500"
                    />
                </ul>
            </section>

            {pet.shelter ? (
                <PetShelterContact shelter={pet.shelter} />
            ) : (
                <p className="text-sm text-muted">{t('noContact')}</p>
            )}

            {pet.created_at && (
                <p className="text-sm text-muted">
                    {t('publishedAt', {
                        date: formatDate(pet.created_at, {
                            locale: dateLocale,
                            format: 'medium',
                        }),
                    })}
                </p>
            )}
        </div>
    );
}
