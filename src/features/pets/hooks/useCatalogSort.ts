'use client';

import {
    CATALOG_DEFAULT_SORT,
    CATALOG_SORT_KEYS,
    CATALOG_SORT_OPTIONS,
    type CatalogSortKey,
} from '@features/pets/constants';
import type { PetFilters } from '@features/pets/schemas';
import { useCatalogFilters } from '../components/public/catalog/CatalogFiltersContext';

function getSortKey({ sortBy, ascending }: PetFilters): CatalogSortKey {
    const fallback = CATALOG_SORT_OPTIONS[CATALOG_DEFAULT_SORT];
    return (
        CATALOG_SORT_KEYS.find(
            (key) =>
                CATALOG_SORT_OPTIONS[key].sortBy ===
                    (sortBy ?? fallback.sortBy) &&
                CATALOG_SORT_OPTIONS[key].ascending === (ascending ?? false),
        ) ?? CATALOG_DEFAULT_SORT
    );
}

export function useCatalogSort() {
    const { filters, navigate } = useCatalogFilters();

    function changeSort(key: CatalogSortKey) {
        const { sortBy, ascending } = CATALOG_SORT_OPTIONS[key];
        // The default sort and the default (descending) direction stay out of the URL.
        navigate(
            key === CATALOG_DEFAULT_SORT
                ? { sortBy: null, ascending: null }
                : { sortBy, ascending: ascending ? 'true' : null },
        );
    }

    return { sortKey: getSortKey(filters), changeSort };
}
