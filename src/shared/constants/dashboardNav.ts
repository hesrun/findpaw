import type { IconType } from 'react-icons';
import { MdPets, MdSettings } from 'react-icons/md';
import { TbHomeShield } from 'react-icons/tb';
import type { Database } from '@supabase/database.types';
import { ROUTES } from '@shared/constants/routes';

type UserRole = Database['public']['Enums']['user_role'];

export type DashboardNavItem = {
    // Key in the `sidebar` translation namespace.
    id: 'pets' | 'shelters' | 'settings';
    href: string;
    icon: IconType;
    roles: readonly UserRole[];
};

// Dashboard sections, shared by the sidebar and the header user menu.
// Route access is still enforced in `src/proxy.ts` and RLS.
export const DASHBOARD_NAV: readonly DashboardNavItem[] = [
    {
        id: 'pets',
        href: ROUTES.dashboard.pets,
        icon: MdPets,
        roles: ['user', 'shelter', 'admin', 'clinic'],
    },
    {
        id: 'shelters',
        href: ROUTES.dashboard.shelters,
        icon: TbHomeShield,
        roles: ['shelter', 'admin'],
    },
    {
        id: 'settings',
        href: ROUTES.dashboard.settings,
        icon: MdSettings,
        roles: ['user', 'shelter', 'admin', 'clinic'],
    },
];
