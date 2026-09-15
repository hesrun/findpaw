import { z } from 'zod';
import { Constants } from '@supabase/database.types';

const PetListingTypeSchema = z.enum(
    Constants.public.Enums.pet_listing_type as unknown as [string, ...string[]],
);

const PetSexSchema = z.enum(
    Constants.public.Enums.pet_sex as unknown as [string, ...string[]],
);

const PetSpeciesSchema = z.enum(
    Constants.public.Enums.pet_species as unknown as [string, ...string[]],
);

const optionalNumber = (schema: z.ZodNumber) =>
    z.preprocess(
        (value) => (value === '' || value == null ? undefined : Number(value)),
        schema.optional(),
    );

export const PetCreateSchema = z.object({
    name: z.string().min(1),
    description: z.string().nullish(),
    age_months: z.preprocess(
        (value) => (value === '' || value == null ? undefined : Number(value)),
        z.number().int().nonnegative(),
    ),
    breed: z.string().nullish(),
    city: z.string().nullish(),
    address: z.string().nullish(),
    image_url: z.array(z.string()).optional(),
    shelter_id: z.string().nullable().optional(),
    listing_type: PetListingTypeSchema.optional(),
    price: z.preprocess(
        (value) => (value === '' || value == null ? null : Number(value)),
        z.number().nonnegative().nullable().optional(),
    ),
    sex: PetSexSchema.optional(),
    species: PetSpeciesSchema,
    is_special_needs: z.boolean().optional(),
    is_sterilized: z.boolean().optional(),
    is_vaccinated: z.boolean().optional(),
});

export const PetUpdateSchema = PetCreateSchema.partial();

export const PetFiltersSchema = z.object({
    page: optionalNumber(z.number().int().positive()),
    pageSize: optionalNumber(z.number().int().positive()),
    species: PetSpeciesSchema.optional(),
    city: z.string().optional(),
    breed: z.string().optional(),
    listing_type: PetListingTypeSchema.optional(),
    min_price: optionalNumber(z.number().min(0)),
    max_price: optionalNumber(z.number().min(0)),
    q: z.string().optional(),
    sortBy: z.string().optional(),
    ascending: z.preprocess(
        (v) => v === 'true' || v === true,
        z.boolean().optional(),
    ),
});

export type PetCreate = z.infer<typeof PetCreateSchema>;
export type PetUpdate = z.infer<typeof PetUpdateSchema>;
export type PetFilters = z.infer<typeof PetFiltersSchema>;
