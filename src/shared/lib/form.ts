import { z } from 'zod';
import { CLOUDINARY_IMAGE_URL_PREFIX } from '@shared/constants/images';

// Building blocks for Zod schemas of HTML forms and URL parameters, where
// every value arrives as a string, an empty field as "", and an unchecked
// checkbox not at all.

// FormData as a plain object for `safeParse`. Keys in `arrayKeys` keep every
// value (multi-file inputs); other keys keep a single value.
export function readFormData(
    formData: FormData,
    arrayKeys: readonly string[] = [],
): Record<string, unknown> {
    const values: Record<string, unknown> = Object.fromEntries(formData);
    for (const key of arrayKeys) {
        values[key] = formData.getAll(key);
    }
    return values;
}

// An empty value becomes `empty` instead of Number('') / Number(null),
// which would silently give 0.
export const toNumber = (empty: null | undefined) => (value: unknown) =>
    value === '' || value == null ? empty : Number(value);

// Form field the user may clear: empty is saved as null.
export const nullableNumber = (schema: z.ZodNumber) =>
    z.preprocess(toNumber(null), schema.nullable().optional());

// URL filter: empty means "not set".
export const optionalNumber = (schema: z.ZodNumber) =>
    z.preprocess(toNumber(undefined), schema.optional());

// Text field the user may leave empty: saved as null, not "".
export const optionalText = <T extends z.ZodTypeAny>(schema: T) =>
    z.preprocess((value) => (value === '' ? null : value), schema.nullish());

// Checkbox or switch: the browser sends "on" only when it is checked.
export const checkbox = z.preprocess((value) => value === 'on', z.boolean());

// Uploaded image URLs, at most `max`, only from our Cloudinary cloud (a
// foreign URL would also break next/image). No images are saved as null.
export const imageUrls = (max: number) =>
    z
        .array(
            z
                .string()
                .refine((url) => url.startsWith(CLOUDINARY_IMAGE_URL_PREFIX)),
        )
        .max(max)
        .default([])
        .transform((urls) => (urls.length ? urls : null));
