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
