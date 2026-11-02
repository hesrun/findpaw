import type { Database } from '@supabase/database.types';
import { DASHBOARD_NAV } from '@shared/constants/dashboardNav';

type UserRole = Database['public']['Enums']['user_role'];

// Dashboard sections visible to the given role.
export function useDashboardNav(role: UserRole) {
    return DASHBOARD_NAV.filter((item) => item.roles.includes(role));
}
