import { z } from 'zod';
import { isHttpUrl } from '@shared/lib/url';

// Empty form inputs arrive as "": store them as null instead of failing validation.
const optional = <T extends z.ZodTypeAny>(schema: T) =>
    z.preprocess((value) => (value === '' ? null : value), schema.nullish());

export const ShelterCreateSchema = z.object({
    name: z.string().min(1),
    description: optional(z.string()),
    phone: optional(z.string()),
    email: optional(z.string().email()),
    website: optional(
        z.string().url().refine(isHttpUrl, { message: 'websiteInvalid' }),
    ),
    city: optional(z.string()),
    address: optional(z.string()),
    img_url: z.array(z.string()).optional(),
});

export const ShelterUpdateSchema = ShelterCreateSchema.partial();

export const ShelterFiltersSchema = z.object({
    page: z.preprocess(
        (v) => (v ? Number(v) : undefined),
        z.number().int().positive().optional(),
    ),
    pageSize: z.preprocess(
        (v) => (v ? Number(v) : undefined),
        z.number().int().positive().optional(),
    ),
    city: z.string().optional(),
    q: z.string().optional(),
    sortBy: z.string().optional(),
    ascending: z.preprocess(
        (v) => v === 'true' || v === true,
        z.boolean().optional(),
    ),
});

export type ShelterCreate = z.infer<typeof ShelterCreateSchema>;
export type ShelterUpdate = z.infer<typeof ShelterUpdateSchema>;
export type ShelterFilters = z.infer<typeof ShelterFiltersSchema>;
