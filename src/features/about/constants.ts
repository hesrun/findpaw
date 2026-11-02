import type { IconType } from 'react-icons';
import { LuHandHeart, LuHouse, LuSearch, LuTag } from 'react-icons/lu';
import { TbHomeShield } from 'react-icons/tb';
import { FaRegUserCircle } from 'react-icons/fa';
import type { Enums } from '@supabase/database.types';

// One card per listing type; text lives in aboutPage.listingTypes.<type>.
export const ABOUT_LISTING_TYPES = {
    lost: LuSearch,
    found: LuHandHeart,
    adoption: LuHouse,
    sale: LuTag,
} satisfies Record<Enums<'pet_listing_type'>, IconType>;

// Audience cards; text lives in aboutPage.audience.<key>.
export const ABOUT_AUDIENCE = [
    { key: 'owners', icon: FaRegUserCircle },
    { key: 'shelters', icon: TbHomeShield },
] as const;
