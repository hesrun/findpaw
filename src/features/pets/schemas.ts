import { z } from 'zod';
import { Constants } from '@supabase/database.types';
import { PET_AGE_GROUPS, PET_SORT_FIELDS } from './constants';

const PetListingTypeSchema = z.enum(Constants.public.Enums.pet_listing_type);
const PetSexSchema = z.enum(Constants.public.Enums.pet_sex);
const PetSpeciesSchema = z.enum(Constants.public.Enums.pet_species);
const PetStatusSchema = z.enum(Constants.public.Enums.pet_status);
const PetCloseReasonSchema = z.enum(Constants.public.Enums.pet_close_reason);

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

// A closed listing needs a reason; other statuses must not carry one.
// The database enforces the same rule and checks the reason against the listing type.
export const PetStatusChangeSchema = z
    .object({
        status: PetStatusSchema,
        close_reason: z.preprocess(
            (value) => (value === '' ? null : value),
            PetCloseReasonSchema.nullish(),
        ),
    })
    .refine(
        ({ status, close_reason }) => (status === 'closed') === !!close_reason,
        { message: 'invalidCloseReason', path: ['close_reason'] },
    );

export const PetIdSchema = z.string().uuid();

// Checkbox-style URL flag: only "true" turns it on; anything else means "not set".
const flag = z.preprocess(
    (value) => (value === 'true' || value === true ? true : undefined),
    z.literal(true).optional(),
);

export const PetFiltersSchema = z.object({
    page: optionalNumber(z.number().int().positive()),
    pageSize: optionalNumber(z.number().int().positive().max(48)),
    species: PetSpeciesSchema.optional(),
    city: z.string().optional(),
    breed: z.string().optional(),
    listing_type: PetListingTypeSchema.optional(),
    sex: PetSexSchema.optional(),
    age: z.enum(PET_AGE_GROUPS).optional(),
    from_shelter: flag,
    vaccinated: flag,
    sterilized: flag,
    min_price: optionalNumber(z.number().min(0)),
    max_price: optionalNumber(z.number().min(0)),
    q: z.string().optional(),
    sortBy: z.enum(PET_SORT_FIELDS).optional(),
    ascending: z.preprocess(
        (v) => v === 'true' || v === true,
        z.boolean().optional(),
    ),
});

export type PetCreate = z.infer<typeof PetCreateSchema>;
export type PetUpdate = z.infer<typeof PetUpdateSchema>;
export type PetFilters = z.infer<typeof PetFiltersSchema>;
export type PetStatusChange = z.infer<typeof PetStatusChangeSchema>;
