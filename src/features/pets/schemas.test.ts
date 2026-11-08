import { describe, expect, it } from 'vitest';
import { CLOUDINARY_IMAGE_URL_PREFIX } from '@shared/constants/images';
import { PET_BREED_MAX_LENGTH, PET_MAX_PHOTOS } from './constants';
import {
    PetFiltersSchema,
    PetFormSchema,
    PetStatusChangeSchema,
} from './schemas';

// A pet form as the browser sends it: every value is a string, empty
// fields are "", unchecked checkboxes are missing.
const validForm = {
    name: 'Rex',
    description: '',
    age_months: '14',
    breed: '',
    city: 'Praha',
    address: '',
    image_url: [`${CLOUDINARY_IMAGE_URL_PREFIX}rex.jpg`],
    shelter_id: '',
    listing_type: 'adoption',
    price: '',
    reward: '',
    latitude: '50.08',
    longitude: '14.43',
    species: 'dog',
    is_vaccinated: 'on',
};

describe('PetFormSchema', () => {
    it('parses a valid form', () => {
        const result = PetFormSchema.parse(validForm);

        expect(result).toMatchObject({
            name: 'Rex',
            age_months: 14,
            description: null,
            shelter_id: null,
            price: null,
            latitude: 50.08,
            is_vaccinated: true,
            is_sterilized: false,
            is_special_needs: false,
        });
    });

    it('requires a name and an age', () => {
        expect(PetFormSchema.safeParse({ ...validForm, name: '' }).success).toBe(
            false,
        );
        expect(
            PetFormSchema.safeParse({ ...validForm, age_months: '' }).success,
        ).toBe(false);
    });

    it('rejects a negative or fractional age', () => {
        expect(
            PetFormSchema.safeParse({ ...validForm, age_months: '-1' }).success,
        ).toBe(false);
        expect(
            PetFormSchema.safeParse({ ...validForm, age_months: '1.5' }).success,
        ).toBe(false);
    });

    it('rejects unknown enum values', () => {
        expect(
            PetFormSchema.safeParse({ ...validForm, species: 'dragon' }).success,
        ).toBe(false);
        expect(
            PetFormSchema.safeParse({ ...validForm, listing_type: 'gift' })
                .success,
        ).toBe(false);
    });

    it('rejects coordinates out of range', () => {
        expect(
            PetFormSchema.safeParse({ ...validForm, latitude: '91' }).success,
        ).toBe(false);
        expect(
            PetFormSchema.safeParse({ ...validForm, longitude: '-181' }).success,
        ).toBe(false);
    });

    it('rejects a zero reward', () => {
        expect(
            PetFormSchema.safeParse({ ...validForm, reward: '0' }).success,
        ).toBe(false);
    });

    it('rejects a shelter id that is not a uuid', () => {
        expect(
            PetFormSchema.safeParse({ ...validForm, shelter_id: '1' }).success,
        ).toBe(false);
    });

    it(`accepts at most ${PET_MAX_PHOTOS} photos`, () => {
        const photos = Array.from(
            { length: PET_MAX_PHOTOS + 1 },
            (_, i) => `${CLOUDINARY_IMAGE_URL_PREFIX}${i}.jpg`,
        );
        expect(
            PetFormSchema.safeParse({ ...validForm, image_url: photos }).success,
        ).toBe(false);
    });
});

describe('PetFormSchema breed', () => {
    const parse = (species: string, breed: string) =>
        PetFormSchema.safeParse({ ...validForm, species, breed });

    it('accepts a breed from the list of the species', () => {
        expect(parse('dog', 'beagle').success).toBe(true);
        expect(parse('cat', 'domestic').success).toBe(true);
    });

    it('rejects free text and breeds of another species', () => {
        const result = parse('dog', 'Labrador');
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].path).toEqual(['breed']);
        expect(parse('cat', 'beagle').success).toBe(false);
    });

    it('accepts no breed for any species', () => {
        expect(PetFormSchema.parse({ ...validForm, breed: '' }).breed).toBeNull();
    });

    it('keeps free text for species without a list', () => {
        const bird = { ...validForm, species: 'bird', breed: ' Budgie ' };
        expect(PetFormSchema.parse(bird).breed).toBe('Budgie');
        expect(
            parse('bird', 'x'.repeat(PET_BREED_MAX_LENGTH + 1)).success,
        ).toBe(false);
    });
});

describe('PetStatusChangeSchema', () => {
    it('requires a reason for a closed listing', () => {
        const result = PetStatusChangeSchema.safeParse({
            status: 'closed',
            close_reason: '',
        });
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].path).toEqual(['close_reason']);
    });

    it('accepts a closed listing with a reason', () => {
        expect(
            PetStatusChangeSchema.safeParse({
                status: 'closed',
                close_reason: 'adopted',
            }).success,
        ).toBe(true);
    });

    it('rejects a reason on a listing that is not closed', () => {
        expect(
            PetStatusChangeSchema.safeParse({
                status: 'active',
                close_reason: 'adopted',
            }).success,
        ).toBe(false);
    });

    it('accepts an open listing without a reason', () => {
        expect(
            PetStatusChangeSchema.safeParse({ status: 'active', close_reason: '' })
                .success,
        ).toBe(true);
    });
});

describe('PetFiltersSchema', () => {
    it('parses URL parameters', () => {
        expect(
            PetFiltersSchema.parse({
                page: '2',
                species: 'cat',
                min_price: '0',
                vaccinated: 'true',
                ascending: 'true',
                sortBy: 'price',
            }),
        ).toMatchObject({
            page: 2,
            species: 'cat',
            min_price: 0,
            vaccinated: true,
            ascending: true,
            sortBy: 'price',
        });
    });

    it('treats empty values and non-"true" flags as not set', () => {
        const result = PetFiltersSchema.parse({
            page: '',
            min_price: '',
            vaccinated: 'false',
            from_shelter: '1',
        });
        expect(result.page).toBeUndefined();
        expect(result.min_price).toBeUndefined();
        expect(result.vaccinated).toBeUndefined();
        expect(result.from_shelter).toBeUndefined();
    });

    it('parses comma-separated breed keys', () => {
        expect(PetFiltersSchema.parse({ breed: 'beagle,pug' }).breed).toEqual([
            'beagle',
            'pug',
        ]);
        expect(PetFiltersSchema.parse({ breed: '' }).breed).toEqual([]);
    });

    it('parses its own output again unchanged', () => {
        // getPublicPets re-parses filters the page has already parsed.
        const parsed = PetFiltersSchema.parse({ breed: 'beagle,pug', page: '2' });
        expect(PetFiltersSchema.parse(parsed)).toEqual(parsed);
    });

    it('rejects unknown breed keys', () => {
        expect(PetFiltersSchema.safeParse({ breed: 'beagle,dragon' }).success).toBe(
            false,
        );
    });

    it('rejects an oversized page size and unknown sort fields', () => {
        expect(PetFiltersSchema.safeParse({ pageSize: '1000' }).success).toBe(
            false,
        );
        expect(PetFiltersSchema.safeParse({ sortBy: 'owner_id' }).success).toBe(
            false,
        );
    });
});
