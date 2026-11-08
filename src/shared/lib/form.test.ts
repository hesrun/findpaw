import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { CLOUDINARY_IMAGE_URL_PREFIX } from '@shared/constants/images';
import {
    checkbox,
    imageUrls,
    nullableNumber,
    optionalNumber,
    optionalText,
    readFormData,
} from './form';

const image = (name: string) => `${CLOUDINARY_IMAGE_URL_PREFIX}${name}.jpg`;

describe('readFormData', () => {
    it('keeps one value for plain keys and all values for array keys', () => {
        const formData = new FormData();
        formData.append('name', 'Rex');
        formData.append('image_url', 'a');
        formData.append('image_url', 'b');

        expect(readFormData(formData, ['image_url'])).toEqual({
            name: 'Rex',
            image_url: ['a', 'b'],
        });
    });

    it('gives an empty array for a missing array key', () => {
        expect(readFormData(new FormData(), ['image_url'])).toEqual({
            image_url: [],
        });
    });
});

describe('nullableNumber', () => {
    const schema = nullableNumber(z.number().nonnegative());

    it('turns an empty field into null, not 0', () => {
        expect(schema.parse('')).toBeNull();
        expect(schema.parse(null)).toBeNull();
    });

    it('parses numeric strings', () => {
        expect(schema.parse('12.5')).toBe(12.5);
        expect(schema.parse('0')).toBe(0);
    });

    it('rejects values the inner schema rejects', () => {
        expect(schema.safeParse('-1').success).toBe(false);
        expect(schema.safeParse('abc').success).toBe(false);
    });
});

describe('optionalNumber', () => {
    const schema = optionalNumber(z.number().int().positive());

    it('turns an empty value into undefined', () => {
        expect(schema.parse('')).toBeUndefined();
        expect(schema.parse(undefined)).toBeUndefined();
    });

    it('parses numeric strings', () => {
        expect(schema.parse('3')).toBe(3);
    });

    it('rejects values the inner schema rejects', () => {
        expect(schema.safeParse('0').success).toBe(false);
        expect(schema.safeParse('1.5').success).toBe(false);
    });
});

describe('optionalText', () => {
    const schema = optionalText(z.string().trim().max(5));

    it('saves an empty field as null', () => {
        expect(schema.parse('')).toBeNull();
    });

    it('accepts a missing field', () => {
        expect(schema.parse(undefined)).toBeUndefined();
    });

    it('applies the inner schema to text', () => {
        expect(schema.parse(' abc ')).toBe('abc');
        expect(schema.safeParse('too long').success).toBe(false);
    });
});

describe('checkbox', () => {
    it('is true only for "on"', () => {
        expect(checkbox.parse('on')).toBe(true);
        expect(checkbox.parse(undefined)).toBe(false);
        expect(checkbox.parse('true')).toBe(false);
    });
});

describe('imageUrls', () => {
    const schema = imageUrls(2);

    it('accepts URLs from our Cloudinary cloud', () => {
        const urls = [image('a'), image('b')];
        expect(schema.parse(urls)).toEqual(urls);
    });

    it('saves no images as null', () => {
        expect(schema.parse([])).toBeNull();
        expect(schema.parse(undefined)).toBeNull();
    });

    it('rejects foreign URLs', () => {
        expect(
            schema.safeParse(['https://example.com/image.jpg']).success,
        ).toBe(false);
    });

    it('rejects more images than the limit', () => {
        expect(
            schema.safeParse([image('a'), image('b'), image('c')]).success,
        ).toBe(false);
    });
});
