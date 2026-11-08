'use client';

import { FieldError, Input, Label, TextField } from '@heroui/react';
import { useTranslations } from 'next-intl';
import SearchableSelect from '@UI/SearchableSelect';
import type { BreedSpecies } from '@features/pets/constants';
import { hasBreedList, isPetBreed } from '@features/pets/breeds';
import { useBreedOptions } from '../hooks/useBreedOptions';

type BreedFieldProps = {
    species: string | null;
    // The pet being edited, if any.
    saved?: { species: string; breed: string | null };
};

// Dogs, cats and rabbits pick a breed from a list; other species type it.
// The parent remounts this field (key) when the species changes.
export default function BreedField({ species, saved }: BreedFieldProps) {
    // The saved breed only fits the species it was saved with.
    const defaultValue = saved?.species === species ? saved.breed : null;
    if (hasBreedList(species)) {
        return <BreedSelect species={species} defaultValue={defaultValue} />;
    }
    return <BreedText defaultValue={defaultValue} />;
}

function BreedSelect({
    species,
    defaultValue,
}: {
    species: BreedSpecies;
    defaultValue: string | null;
}) {
    const t = useTranslations('dashboard.myPets.fields');
    const tPets = useTranslations('pets');
    const options = useBreedOptions(species);
    const value = isPetBreed(defaultValue) ? defaultValue : null;

    return (
        <SearchableSelect
            name="breed"
            variant="secondary"
            fullWidth
            label={t('breed')}
            placeholder={t('breedPlaceholder')}
            searchPlaceholder={tPets('breedSearch')}
            emptyText={tPets('noBreeds')}
            options={options}
            defaultValue={value}
        />
    );
}

function BreedText({ defaultValue }: { defaultValue: string | null }) {
    const t = useTranslations('dashboard.myPets.fields');

    return (
        <TextField
            variant="secondary"
            name="breed"
            defaultValue={defaultValue ?? undefined}
        >
            <Label>{t('breed')}</Label>
            <Input placeholder={t('breed')} />
            <FieldError />
        </TextField>
    );
}
