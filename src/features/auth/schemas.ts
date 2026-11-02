import { z } from 'zod';
import { Constants } from '@supabase/database.types';
import { routing } from '@/i18n/routing';
import {
    AUTH_CONFIRM_TYPES,
    DEFAULT_SIGN_UP_ROLE,
    PASSWORD_MIN_LENGTH,
    SIGN_UP_EXCLUDED_ROLES,
    USER_NAME_MIN_LENGTH,
} from '@features/auth/constants';

// Roles from SIGN_UP_EXCLUDED_ROLES are rejected and fall back to the default.
const SignUpRoleSchema = z
    .enum(Constants.public.Enums.user_role)
    .exclude([...SIGN_UP_EXCLUDED_ROLES]);

export const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const SignUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(PASSWORD_MIN_LENGTH),
    userName: z.string().trim().min(USER_NAME_MIN_LENGTH),
    role: SignUpRoleSchema.catch(DEFAULT_SIGN_UP_ROLE),
    locale: z.enum(routing.locales).catch(routing.defaultLocale),
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email(),
    locale: z.enum(routing.locales).catch(routing.defaultLocale),
});

export const ResetPasswordSchema = z
    .object({
        password: z.string().min(PASSWORD_MIN_LENGTH),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
    });

// Query of the email link. Only the locale is taken from the URL; the
// redirect target is built on the server, so the link cannot redirect elsewhere.
export const AuthConfirmParamsSchema = z.object({
    token_hash: z.string().min(1),
    type: z.enum(AUTH_CONFIRM_TYPES),
    locale: z.enum(routing.locales).catch(routing.defaultLocale),
});

export type { SignUpRole } from '@features/auth/constants';
export type SignIn = z.infer<typeof SignInSchema>;
export type SignUp = z.infer<typeof SignUpSchema>;
