import { describe, expect, it } from 'vitest';
import en from '@messages/en.json';
import cs from '@messages/cs.json';
import { PET_BREED_KEYS, PET_BREEDS } from './constants';
import { breedLabel, findBreedKeys, hasBreedList, isPetBreed } from './breeds';

const NAMES = [en.pets.breeds, cs.pets.breeds];

describe('PET_BREEDS', () => {
    it.each([
        ['en', en.pets.breeds],
        ['cs', cs.pets.breeds],
    ])('has a %s name for every breed and no extra names', (_, names) => {
        expect(Object.keys(names).sort()).toEqual([...PET_BREED_KEYS].sort());
    });

    it('has no duplicates within a species', () => {
        for (const breeds of Object.values(PET_BREEDS)) {
            expect(new Set(breeds).size).toBe(breeds.length);
        }
    });
});

describe('hasBreedList', () => {
    it('is true only for listed species', () => {
        expect(hasBreedList('dog')).toBe(true);
        expect(hasBreedList('cat')).toBe(true);
        expect(hasBreedList('rabbit')).toBe(true);
        expect(hasBreedList('bird')).toBe(false);
        expect(hasBreedList(null)).toBe(false);
        expect(hasBreedList('constructor')).toBe(false);
    });
});

describe('isPetBreed', () => {
    it('accepts list keys only', () => {
        expect(isPetBreed('beagle')).toBe(true);
        expect(isPetBreed('Beagle')).toBe(false);
        expect(isPetBreed(null)).toBe(false);
    });
});

describe('breedLabel', () => {
    const translate = (key: string) => `name:${key}`;

    it('translates list keys and keeps free text', () => {
        expect(breedLabel('beagle', translate)).toBe('name:beagle');
        expect(breedLabel('Budgerigar', translate)).toBe('Budgerigar');
    });

    it('gives null for no breed', () => {
        expect(breedLabel(null, translate)).toBeNull();
        expect(breedLabel('', translate)).toBeNull();
    });
});

describe('findBreedKeys', () => {
    it('matches names in any locale', () => {
        expect(findBreedKeys('labrador', NAMES)).toEqual(['labrador_retriever']);
        expect(findBreedKeys('jezevčík', NAMES)).toEqual(['dachshund']);
    });

    it('ignores case and accents', () => {
        expect(findBreedKeys('BRITSKA', NAMES)).toEqual(
            expect.arrayContaining(['british_shorthair', 'british_longhair']),
        );
    });

    it('finds nothing for an empty or unknown query', () => {
        expect(findBreedKeys('  ', NAMES)).toEqual([]);
        expect(findBreedKeys('dragon', NAMES)).toEqual([]);
    });
});
