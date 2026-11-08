'use client';

import { useTranslations } from 'next-intl';
import type { PetWithShelter } from '@/types/pets';
import { breedLabel } from '@features/pets/breeds';

// Short facts under the pet name on a card: breed, age and sex.
export function usePetCardFacts(pet: PetWithShelter) {
    const tPets = useTranslations('pets');
    const tBreeds = useTranslations('pets.breeds');
    const tAge = useTranslations('PetAge');

    const age =
        pet.age_months < 12
            ? tAge('monthsShort', { count: pet.age_months })
            : tAge('yearsShort', { years: Math.floor(pet.age_months / 12) });

    return [
        breedLabel(pet.breed, tBreeds),
        pet.age_months != null ? age : null,
        pet.sex && pet.sex !== 'unknown' ? tPets(`sex.${pet.sex}`) : null,
    ].filter(Boolean);
}
