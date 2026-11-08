import {
    PET_BREED_KEYS,
    PET_BREEDS,
    type BreedSpecies,
    type PetBreed,
} from './constants';

// Species whose breed is picked from PET_BREEDS instead of typed.
export function hasBreedList(
    species: string | null | undefined,
): species is BreedSpecies {
    return !!species && Object.hasOwn(PET_BREEDS, species);
}

export function isPetBreed(value: unknown): value is PetBreed {
    return (
        typeof value === 'string' &&
        (PET_BREED_KEYS as readonly string[]).includes(value)
    );
}

// Breed as shown to people: a list key is translated, free text stays as is.
export function breedLabel(
    breed: string | null | undefined,
    translate: (key: PetBreed) => string,
) {
    if (!breed) return null;
    return isPetBreed(breed) ? translate(breed) : breed;
}

// Case- and accent-insensitive, so "britska" finds "Britská".
function normalize(value: string) {
    return value
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()
        .trim();
}

// Keys whose name in any of the given locales contains the query. Lets the
// catalog search find "labrador" although the database stores a key.
export function findBreedKeys(
    query: string,
    namesByLocale: readonly Record<PetBreed, string>[],
): PetBreed[] {
    const needle = normalize(query);
    if (!needle) return [];
    return PET_BREED_KEYS.filter((key) =>
        namesByLocale.some((names) => normalize(names[key]).includes(needle)),
    );
}
