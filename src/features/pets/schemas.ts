import { z } from 'zod';
import { Constants } from '@supabase/database.types';
import {
    checkbox,
    imageUrls,
    nullableNumber,
    optionalNumber,
    optionalText,
    toNumber,
} from '@shared/lib/form';
import { PET_AGE_GROUPS, PET_MAX_PHOTOS, PET_SORT_FIELDS } from './constants';

const PetListingTypeSchema = z.enum(Constants.public.Enums.pet_listing_type);
const PetSexSchema = z.enum(Constants.public.Enums.pet_sex);
const PetSpeciesSchema = z.enum(Constants.public.Enums.pet_species);
const PetStatusSchema = z.enum(Constants.public.Enums.pet_status);
const PetCloseReasonSchema = z.enum(Constants.public.Enums.pet_close_reason);

// One form creates and edits a pet, so one schema serves both actions.
export const PetFormSchema = z.object({
    name: z.string().min(1),
    description: optionalText(z.string()),
    age_months: z.preprocess(
        toNumber(undefined),
        z.number().int().nonnegative(),
    ),
    breed: optionalText(z.string()),
    city: optionalText(z.string()),
    address: optionalText(z.string()),
    image_url: imageUrls(PET_MAX_PHOTOS),
    shelter_id: optionalText(z.string().uuid()),
    listing_type: PetListingTypeSchema,
    price: nullableNumber(z.number().nonnegative()),
    // Kept only for lost listings; the actions clear it for other types.
    reward: nullableNumber(z.number().positive()),
    // Map point; kept only as a pair.
    latitude: nullableNumber(z.number().min(-90).max(90)),
    longitude: nullableNumber(z.number().min(-180).max(180)),
    sex: PetSexSchema.optional(),
    species: PetSpeciesSchema,
    is_special_needs: checkbox,
    is_sterilized: checkbox,
    is_vaccinated: checkbox,
});

// A closed listing needs a reason; other statuses must not carry one.
// The database enforces the same rule and checks the reason against the listing type.
export const PetStatusChangeSchema = z
    .object({
        status: PetStatusSchema,
        close_reason: optionalText(PetCloseReasonSchema),
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

export type PetForm = z.infer<typeof PetFormSchema>;
export type PetFilters = z.infer<typeof PetFiltersSchema>;
export type PetStatusChange = z.infer<typeof PetStatusChangeSchema>;
