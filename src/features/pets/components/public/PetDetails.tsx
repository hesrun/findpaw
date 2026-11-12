import { getLocale, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { LuBadgeAlert, LuGift, LuMapPin } from 'react-icons/lu';
import { TbScissors, TbVaccine } from 'react-icons/tb';
import ListingChip from '@/shared/components/UI/ListingChips';
import ReportLink from '@UI/ReportLink';
import { formatAge } from '@shared/helpers/ageFormat';
import { formatCzk } from '@shared/helpers/currencyFormat';
import { PRICED_LISTING_TYPE, REWARD_LISTING_TYPE } from '../../constants';
import { breedLabel } from '../../breeds';
import { formatDate } from '@shared/helpers/dateFormat';
import type { PetWithShelter } from '@/types/pets';
import PetContact from './PetContact';
import PetOwnerContact from './PetOwnerContact';
import PetAreaSection from './location/PetAreaSection';

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
    const [t, tPets, tBreeds, tGlobal, locale] = await Promise.all([
        getTranslations('petsPage.detail'),
        getTranslations('pets'),
        getTranslations('pets.breeds'),
        getTranslations('global'),
        getLocale(),
    ]);
    const breed = breedLabel(pet.breed, tBreeds);
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
                {pet.listing_type === PRICED_LISTING_TYPE && (
                    <p className="font-display font-extrabold text-3xl text-accent">
                        <span className="sr-only">{t('price')}: </span>
                        {pet.price
                            ? formatCzk(pet.price, locale)
                            : t('free')}
                    </p>
                )}
                {pet.listing_type === REWARD_LISTING_TYPE && pet.reward && (
                    <p className="inline-flex items-center gap-2 self-start rounded-media bg-amber-100 px-4 py-2 text-amber-800">
                        <LuGift aria-hidden className="text-2xl shrink-0" />
                        <span className="grid">
                            <span className="text-xs font-bold uppercase tracking-wide">
                                {t('reward')}
                            </span>
                            <span className="font-display font-extrabold text-2xl leading-tight">
                                {formatCzk(pet.reward, locale)}
                            </span>
                        </span>
                    </p>
                )}
            </div>

            <dl className="grid grid-cols-2 gap-2">
                <Fact
                    label={t('species')}
                    value={tPets(`species.${pet.species}`)}
                />
                <Fact label={t('age')} value={age} />
                {breed && <Fact label={t('breed')} value={breed} />}
                {pet.sex && pet.sex !== 'unknown' && (
                    <Fact label={t('sex')} value={tPets(`sex.${pet.sex}`)} />
                )}
            </dl>

            <section className="surface-card p-5">
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

            <PetAreaSection pet={pet} />

            {/* A shelter is an organization: its contacts are public. A
                private author's contact is revealed on click. */}
            {pet.shelter ? (
                <PetContact
                    title={t('contactShelter')}
                    name={pet.shelter.name}
                    location={location}
                    phone={pet.shelter.phone}
                    email={pet.shelter.email}
                />
            ) : (
                <PetOwnerContact petId={pet.id} />
            )}

            <div className="flex flex-wrap items-center justify-between gap-2">
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
                <ReportLink path={`/pets/${pet.id}`} />
            </div>
        </div>
    );
}
