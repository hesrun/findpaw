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

// Recently added pets on the landing page (two rows of four on desktop).
export const FEATURED_PETS_COUNT = 8;

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

// Public catalog (/pets) filter UI. Every key below is a URL query parameter
// read by the catalog page through PetFiltersSchema.

// Select value meaning "no filter" for "All ..." options.
export const CATALOG_ALL_OPTION = 'all';

// Typing in text filters updates the URL after this pause.
export const CATALOG_TEXT_DEBOUNCE_MS = 400;

// Sort choices shown to users, mapped to the sortBy/ascending URL parameters.
export const CATALOG_SORT_OPTIONS = {
    newest: { sortBy: 'created_at', ascending: false },
    oldest: { sortBy: 'created_at', ascending: true },
    priceAsc: { sortBy: 'price', ascending: true },
    priceDesc: { sortBy: 'price', ascending: false },
    youngest: { sortBy: 'age_months', ascending: true },
    oldestPet: { sortBy: 'age_months', ascending: false },
} satisfies Record<
    string,
    { sortBy: (typeof PET_SORT_FIELDS)[number]; ascending: boolean }
>;
export type CatalogSortKey = keyof typeof CATALOG_SORT_OPTIONS;
export const CATALOG_SORT_KEYS = Object.keys(
    CATALOG_SORT_OPTIONS,
) as CatalogSortKey[];
// Matches the server default (created_at, descending), so it is not written to the URL.
export const CATALOG_DEFAULT_SORT: CatalogSortKey = 'newest';

// Filters edited as free text (debounced).
export const CATALOG_TEXT_FILTER_KEYS = [
    'q',
    'city',
    'breed',
    'min_price',
    'max_price',
] as const;
export type CatalogTextKey = (typeof CATALOG_TEXT_FILTER_KEYS)[number];

// Price only applies to this listing type.
export const PRICED_LISTING_TYPE = 'sale' satisfies Enums<'pet_listing_type'>;

// A finder's reward only applies to this listing type.
// Mirrors the pets_reward_only_for_lost check in the database.
export const REWARD_LISTING_TYPE = 'lost' satisfies Enums<'pet_listing_type'>;

// Leaving the priced listing type in the catalog clears the price range.
export const CATALOG_PRICED_LISTING_TYPE = PRICED_LISTING_TYPE;
export const CATALOG_PRICE_KEYS = [
    'min_price',
    'max_price',
] as const satisfies readonly CatalogTextKey[];

// Yes/no filters and their translation keys in petsPage.filters.
export const CATALOG_FLAG_FILTER_KEYS = [
    'from_shelter',
    'vaccinated',
    'sterilized',
] as const;
export type CatalogFlagKey = (typeof CATALOG_FLAG_FILTER_KEYS)[number];
export const CATALOG_FLAG_LABEL_KEYS = {
    from_shelter: 'fromShelter',
    vaccinated: 'vaccinated',
    sterilized: 'sterilized',
} as const satisfies Record<CatalogFlagKey, string>;

// "unknown" is a data-entry fallback, not something people search for.
export const SEX_FILTER_OPTIONS = SEX_OPTIONS.filter(
    ({ id }) => id !== 'unknown',
);


// Saved coordinates are rounded to this many decimals (~100 m), so a point
// placed on someone's home does not publish the exact address.
export const PET_LOCATION_DECIMALS = 3;

// The public pet page shows the point as an area of this radius, not a pin.
export const PET_LOCATION_PUBLIC_RADIUS_M = 300;

// Zoom used once a point is chosen or shown.
export const PET_LOCATION_ZOOM = 15;
