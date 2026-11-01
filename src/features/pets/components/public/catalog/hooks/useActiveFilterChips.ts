'use client';

import { useTranslations } from 'next-intl';
import {
    CATALOG_FLAG_FILTER_KEYS,
    CATALOG_FLAG_LABEL_KEYS,
    CATALOG_TEXT_FILTER_KEYS,
    type CatalogTextKey,
} from '@features/pets/constants';
import { useCatalogFilters } from '../CatalogFiltersContext';
import type { CatalogFilterKey } from './useCatalogUrl';

export type FilterChip = { key: CatalogFilterKey; label: string };

function isTextKey(key: CatalogFilterKey): key is CatalogTextKey {
    return (CATALOG_TEXT_FILTER_KEYS as readonly string[]).includes(key);
}

// Chips mirror the URL (not the text being typed), so they show what the
// results are actually filtered by.
export function useActiveFilterChips() {
    const t = useTranslations('petsPage.filters');
    const tPets = useTranslations('pets');
    const { filters, navigate, clearText, changeListingType } =
        useCatalogFilters();

    const chips: FilterChip[] = [];
    if (filters.listing_type) {
        chips.push({
            key: 'listing_type',
            label: tPets(`listingType.${filters.listing_type}`),
        });
    }
    if (filters.species) {
        chips.push({
            key: 'species',
            label: tPets(`species.${filters.species}`),
        });
    }
    if (filters.sex) {
        chips.push({ key: 'sex', label: tPets(`sex.${filters.sex}`) });
    }
    if (filters.age) {
        chips.push({ key: 'age', label: t(`ageGroups.${filters.age}`) });
    }
    for (const key of CATALOG_TEXT_FILTER_KEYS) {
        const value = filters[key];
        if (value !== undefined && value !== '') {
            chips.push({ key, label: t(`chips.${key}`, { value }) });
        }
    }
    for (const key of CATALOG_FLAG_FILTER_KEYS) {
        if (filters[key]) {
            chips.push({ key, label: t(CATALOG_FLAG_LABEL_KEYS[key]) });
        }
    }

    function removeFilter(key: CatalogFilterKey) {
        if (isTextKey(key)) clearText([key]);
        if (key === 'listing_type') changeListingType(null);
        else navigate({ [key]: null });
    }

    return { chips, removeFilter };
}
