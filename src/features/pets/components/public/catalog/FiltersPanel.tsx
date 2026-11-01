'use client';

import { useTranslations } from 'next-intl';
import {
    CATALOG_PRICED_LISTING_TYPE,
    LISTING_TYPES,
    PET_AGE_GROUPS,
    SEX_FILTER_OPTIONS,
    SPECIES,
} from '@features/pets/constants';
import { useCatalogFilters } from './CatalogFiltersContext';
import FlagSwitches from './fields/FlagSwitches';
import OptionSelect from './fields/OptionSelect';
import PillGroup from './fields/PillGroup';
import PriceRange from './fields/PriceRange';
import TextFilterField from './fields/TextFilterField';

// The filter fields, rendered in the desktop sidebar and in the mobile drawer.
export default function FiltersPanel() {
    const t = useTranslations('petsPage.filters');
    const tPets = useTranslations('pets');
    const { filters, navigate, changeListingType } = useCatalogFilters();

    return (
        <div className="grid gap-6">
            <PillGroup
                label={t('listingType')}
                allLabel={t('allListings')}
                options={LISTING_TYPES.map(({ id }) => ({
                    id,
                    label: tPets(`listingType.${id}`),
                }))}
                value={filters.listing_type ?? null}
                onChange={changeListingType}
            />

            <OptionSelect
                label={t('species')}
                allLabel={t('allSpecies')}
                options={SPECIES.map(({ id }) => ({
                    id,
                    label: tPets(`species.${id}`),
                }))}
                value={filters.species}
                onChange={(id) => navigate({ species: id })}
            />

            <PillGroup
                label={t('sex')}
                allLabel={t('anySex')}
                options={SEX_FILTER_OPTIONS.map(({ id }) => ({
                    id,
                    label: tPets(`sex.${id}`),
                }))}
                value={filters.sex ?? null}
                onChange={(id) => navigate({ sex: id })}
            />

            <OptionSelect
                label={t('age')}
                allLabel={t('anyAge')}
                options={PET_AGE_GROUPS.map((id) => ({
                    id,
                    label: t(`ageGroups.${id}`),
                }))}
                value={filters.age}
                onChange={(id) => navigate({ age: id })}
            />

            <TextFilterField
                name="breed"
                label={t('breed')}
                placeholder={t('breedPlaceholder')}
            />
            <TextFilterField
                name="city"
                label={t('city')}
                placeholder={t('cityPlaceholder')}
            />

            {filters.listing_type === CATALOG_PRICED_LISTING_TYPE && (
                <PriceRange />
            )}

            <FlagSwitches />
        </div>
    );
}
