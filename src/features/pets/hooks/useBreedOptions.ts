'use client';

import { useLocale, useTranslations } from 'next-intl';
import { PET_BREEDS, type BreedSpecies } from '@features/pets/constants';

// Breed options of one species, sorted by name in the current language.
// The "no pedigree" option stays first.
export function useBreedOptions(species: BreedSpecies) {
    const t = useTranslations('pets.breeds');
    const locale = useLocale();
    const [first, ...rest] = PET_BREEDS[species].map((id) => ({
        id,
        label: t(id),
    }));
    rest.sort((a, b) => a.label.localeCompare(b.label, locale));
    return [first, ...rest];
}
