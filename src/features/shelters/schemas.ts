import { z } from 'zod';
import { imageUrls, optionalNumber, optionalText } from '@shared/lib/form';
import { isHttpUrl } from '@shared/lib/url';
import { SHELTER_MAX_PAGE_SIZE, SHELTER_SORT_FIELDS } from './constants';

// One form creates and edits a shelter, so one schema serves both actions.
export const ShelterFormSchema = z.object({
    name: z.string().min(1),
    description: optionalText(z.string()),
    phone: optionalText(z.string()),
    email: optionalText(z.string().email()),
    website: optionalText(
        z.string().url().refine(isHttpUrl, { message: 'websiteInvalid' }),
    ),
    city: optionalText(z.string()),
    address: optionalText(z.string()),
    img_url: imageUrls,
});

export const ShelterIdSchema = z.string().uuid();

export const ShelterFiltersSchema = z.object({
    page: optionalNumber(z.number().int().positive()),
    pageSize: optionalNumber(
        z.number().int().positive().max(SHELTER_MAX_PAGE_SIZE),
    ),
    city: z.string().optional(),
    q: z.string().optional(),
    sortBy: z.enum(SHELTER_SORT_FIELDS).optional(),
    ascending: z.preprocess(
        (v) => v === 'true' || v === true,
        z.boolean().optional(),
    ),
});

// `?page=` of public shelter pages. Repeated or malformed values fall back
// to the first page instead of an error page.
export function parsePageParam(value: string | string[] | undefined) {
    const parsed = ShelterFiltersSchema.shape.page.safeParse(
        Array.isArray(value) ? value[0] : value,
    );
    return (parsed.success && parsed.data) || 1;
}

export type ShelterForm = z.infer<typeof ShelterFormSchema>;
export type ShelterFilters = z.infer<typeof ShelterFiltersSchema>;
