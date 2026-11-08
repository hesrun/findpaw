import { describe, expect, it } from 'vitest';
import { SHELTER_MAX_PAGE_SIZE } from './constants';
import {
    parsePageParam,
    ShelterFiltersSchema,
    ShelterFormSchema,
} from './schemas';

const validForm = {
    name: 'Happy Paws',
    description: '',
    phone: '',
    email: '',
    website: '',
    city: 'Brno',
    address: '',
};

describe('ShelterFormSchema', () => {
    it('saves empty optional fields as null', () => {
        expect(ShelterFormSchema.parse(validForm)).toEqual({
            name: 'Happy Paws',
            description: null,
            phone: null,
            email: null,
            website: null,
            city: 'Brno',
            address: null,
            img_url: null,
        });
    });

    it('requires a name', () => {
        expect(
            ShelterFormSchema.safeParse({ ...validForm, name: '' }).success,
        ).toBe(false);
    });

    it('rejects an invalid email', () => {
        expect(
            ShelterFormSchema.safeParse({ ...validForm, email: 'nope' }).success,
        ).toBe(false);
    });

    it('accepts only http(s) websites', () => {
        expect(
            ShelterFormSchema.safeParse({
                ...validForm,
                website: 'https://paws.cz',
            }).success,
        ).toBe(true);

        const result = ShelterFormSchema.safeParse({
            ...validForm,
            website: 'javascript:alert(1)',
        });
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe('websiteInvalid');
    });
});

describe('ShelterFiltersSchema', () => {
    it(`caps the page size at ${SHELTER_MAX_PAGE_SIZE}`, () => {
        expect(
            ShelterFiltersSchema.safeParse({
                pageSize: String(SHELTER_MAX_PAGE_SIZE),
            }).success,
        ).toBe(true);
        expect(
            ShelterFiltersSchema.safeParse({
                pageSize: String(SHELTER_MAX_PAGE_SIZE + 1),
            }).success,
        ).toBe(false);
    });

    it('rejects unknown sort fields', () => {
        expect(
            ShelterFiltersSchema.safeParse({ sortBy: 'owner_id' }).success,
        ).toBe(false);
    });
});

describe('parsePageParam', () => {
    it('parses a valid page', () => {
        expect(parsePageParam('3')).toBe(3);
    });

    it('takes the first of repeated values', () => {
        expect(parsePageParam(['2', '5'])).toBe(2);
    });

    it('falls back to the first page', () => {
        expect(parsePageParam(undefined)).toBe(1);
        expect(parsePageParam('')).toBe(1);
        expect(parsePageParam('0')).toBe(1);
        expect(parsePageParam('abc')).toBe(1);
    });
});
