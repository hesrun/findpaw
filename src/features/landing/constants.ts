import {
    LuImages,
    LuLanguages,
    LuListChecks,
    LuMapPin,
    LuSlidersHorizontal,
} from 'react-icons/lu';
import { TbHomeShield } from 'react-icons/tb';
import type { Enums } from '@supabase/database.types';
import { AUTH_ROUTES } from '@features/auth/constants';
import { LISTING_TYPE_ICONS } from '@features/pets/constants';

const ADD_PET_PATH = '/dashboard/pets/add';

// "Who it helps" cards; text lives in HomePage.audience.items.<key>.
// Shelters go to sign-up: adding a shelter needs the shelter role.
export const LANDING_AUDIENCE = [
    {
        key: 'lost',
        icon: LISTING_TYPE_ICONS.lost,
        tone: 'rose',
        href: ADD_PET_PATH,
    },
    {
        key: 'found',
        icon: LISTING_TYPE_ICONS.found,
        tone: 'amber',
        href: ADD_PET_PATH,
    },
    {
        key: 'adopt',
        icon: LISTING_TYPE_ICONS.adoption,
        tone: 'accent',
        href: {
            pathname: '/pets',
            query: {
                listing_type: 'adoption' satisfies Enums<'pet_listing_type'>,
            },
        },
    },
    {
        key: 'shelters',
        icon: TbHomeShield,
        tone: 'sky',
        href: AUTH_ROUTES.signUp,
    },
] as const;

// "What it can do" cards; text lives in HomePage.features.items.<key>.
export const LANDING_FEATURES = [
    { key: 'filters', icon: LuSlidersHorizontal },
    { key: 'map', icon: LuMapPin },
    { key: 'shelters', icon: TbHomeShield },
    { key: 'photos', icon: LuImages },
    { key: 'status', icon: LuListChecks },
    { key: 'languages', icon: LuLanguages },
] as const;
