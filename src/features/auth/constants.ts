import { Constants, type Database } from '@supabase/database.types';

type UserRole = Database['public']['Enums']['user_role'];

// Roles that cannot be picked at sign-up: 'admin' is assigned only by an
// administrator; 'clinic' is hidden until clinic features exist.
export const SIGN_UP_EXCLUDED_ROLES = ['admin', 'clinic'] as const;

export type SignUpRole = Exclude<
    UserRole,
    (typeof SIGN_UP_EXCLUDED_ROLES)[number]
>;

export const PASSWORD_MIN_LENGTH = 8;
export const USER_NAME_MIN_LENGTH = 3;

export const SIGN_UP_ROLES = Constants.public.Enums.user_role.filter(
    (role): role is SignUpRole =>
        !(SIGN_UP_EXCLUDED_ROLES as readonly UserRole[]).includes(role),
);
export const DEFAULT_SIGN_UP_ROLE = 'user' satisfies SignUpRole;

// Locale-less app paths; next-intl navigation adds the locale prefix.
export const AUTH_ROUTES = {
    signIn: '/signin',
    signUp: '/signup',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    afterSignIn: '/dashboard/pets',
} as const;

// Route handler that verifies email links. It lives under /api so the
// next-intl proxy does not rewrite it with a locale prefix.
export const AUTH_CONFIRM_PATH = '/api/auth/confirm';

// Value of the `error` search parameter on the forgot-password page.
export const LINK_EXPIRED_ERROR = 'linkExpired';
