import { z } from 'zod';

export const ShelterCreateSchema = z.object({
    name: z.string().min(1),
    description: z.string().nullish(),
    phone: z.string().nullish(),
    email: z.string().email().nullish(),
    website: z.string().url().nullish(),
    city: z.string().nullish(),
    address: z.string().nullish(),
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
