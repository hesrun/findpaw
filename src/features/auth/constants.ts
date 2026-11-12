import type { EmailOtpType } from '@supabase/supabase-js';
import { Constants, type Database } from '@supabase/database.types';
import { DASHBOARD_HOME, ROUTES } from '@shared/constants/routes';

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
// Also capped in the sign-up trigger (handle_new_user), which reads it from metadata.
export const PROFILE_PHONE_MAX_LENGTH = 30;

export const SIGN_UP_ROLES = Constants.public.Enums.user_role.filter(
    (role): role is SignUpRole =>
        !(SIGN_UP_EXCLUDED_ROLES as readonly UserRole[]).includes(role),
);
export const DEFAULT_SIGN_UP_ROLE = 'user' satisfies SignUpRole;

// Route handler that verifies email links. It lives under /api so the
// next-intl proxy does not rewrite it with a locale prefix.
export const AUTH_CONFIRM_PATH = '/api/auth/confirm';

// Value of the `error` search parameter on the forgot-password page.
export const LINK_EXPIRED_ERROR = 'linkExpired';

// Email link types accepted by the confirm route. `email` confirms a sign-up
// (Supabase deprecated `signup` in its favor); `recovery` resets a password.
export const AUTH_CONFIRM_TYPES = [
    'email',
    'recovery',
] as const satisfies readonly EmailOtpType[];

export type AuthConfirmType = (typeof AUTH_CONFIRM_TYPES)[number];

// Locale-less pages the confirm route redirects to after verifying a link.
export const AUTH_CONFIRM_REDIRECTS = {
    email: {
        success: DASHBOARD_HOME,
        failure: ROUTES.auth.signIn,
    },
    recovery: {
        success: ROUTES.auth.resetPassword,
        failure: `${ROUTES.auth.forgotPassword}?error=${LINK_EXPIRED_ERROR}`,
    },
} as const satisfies Record<
    AuthConfirmType,
    { success: string; failure: string }
>;
