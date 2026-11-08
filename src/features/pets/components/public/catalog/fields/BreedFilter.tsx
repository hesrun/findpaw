'use client';

import type { Key } from '@heroui/react';
import { useTranslations } from 'next-intl';
import SearchableSelect from '@UI/SearchableSelect';
import type { BreedSpecies } from '@features/pets/constants';
import { useBreedOptions } from '../../../hooks/useBreedOptions';
import { useCatalogFilters } from '../CatalogFiltersContext';

// Several breeds of the chosen species, with a search box.
export default function BreedFilter({ species }: { species: BreedSpecies }) {
    const t = useTranslations('petsPage.filters');
    const tPets = useTranslations('pets');
    const { filters, changeBreeds } = useCatalogFilters();
    const options = useBreedOptions(species);

    return (
        <SearchableSelect
            selectionMode="multiple"
            variant="secondary"
            fullWidth
            label={t('breed')}
            placeholder={t('breedPlaceholder')}
            searchPlaceholder={tPets('breedSearch')}
            emptyText={tPets('noBreeds')}
            options={options}
            value={filters.breed ?? []}
            onChange={(keys) => changeBreeds((keys as Key[]).map(String))}
        />
    );
}
