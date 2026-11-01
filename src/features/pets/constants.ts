import { Enums } from '@supabase/database.types';

export const SPECIES: { id: Enums<'pet_species'> }[] = [
    { id: 'dog' },
    { id: 'cat' },
    { id: 'bird' },
    { id: 'fish' },
    { id: 'rodent' },
    { id: 'ferret' },
    { id: 'rabbit' },
    { id: 'reptile' },
    { id: 'horse' },
    { id: 'other' },
] as const;

export const LISTING_TYPES: { id: Enums<'pet_listing_type'> }[] = [
    { id: 'lost' },
    { id: 'found' },
    { id: 'adoption' },
    { id: 'sale' },
] as const;

export const SEX_OPTIONS: { id: Enums<'pet_sex'> }[] = [
    { id: 'male' },
    { id: 'female' },
    { id: 'unknown' },
] as const;

// Close reasons that make sense for each listing type.
// Mirrors the pets_close_reason_matches_listing_type check in the database.
export const CLOSE_REASONS_BY_LISTING_TYPE = {
    lost: ['reunited', 'withdrawn'],
    found: ['reunited', 'adopted', 'withdrawn'],
    adoption: ['adopted', 'withdrawn'],
    sale: ['sold', 'withdrawn'],
} satisfies Record<Enums<'pet_listing_type'>, Enums<'pet_close_reason'>[]>;

// Statuses visible to everyone. Public queries must filter by these explicitly:
// the owner's own RLS policy is OR-ed with the public one, so a signed-in owner
// would otherwise see their hidden/closed pets in public listings.
export const PUBLIC_PET_STATUSES = [
    'active',
    'reserved',
] satisfies Enums<'pet_status'>[];

// Cards per page in the public catalog (/pets): full rows of 2 or 3 columns.
export const CATALOG_PAGE_SIZE = 12;

// Columns the public catalog may sort by; anything else is rejected.
export const PET_SORT_FIELDS = ['created_at', 'price', 'age_months'] as const;

// Age buckets for the catalog filter. App-level, not a database enum.
export const PET_AGE_GROUPS = ['young', 'adult', 'senior'] as const;
export type PetAgeGroup = (typeof PET_AGE_GROUPS)[number];

// Month ranges for each age bucket: [min, max) in months.
export const PET_AGE_GROUP_MONTHS = {
    young: { min: 0, max: 12 },
    adult: { min: 12, max: 96 },
    senior: { min: 96, max: null },
} satisfies Record<PetAgeGroup, { min: number; max: number | null }>;
