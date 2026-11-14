import { z } from 'zod';
import { Constants } from '@supabase/database.types';
import { routing } from '@/i18n/routing';
import { optionalText } from '@shared/lib/form';
import {
    AUTH_CONFIRM_TYPES,
    DEFAULT_SIGN_UP_ROLE,
    PASSWORD_MIN_LENGTH,
    PROFILE_PHONE_MAX_LENGTH,
    SIGN_UP_EXCLUDED_ROLES,
    USER_NAME_MIN_LENGTH,
} from '@features/auth/constants';

// Roles from SIGN_UP_EXCLUDED_ROLES are rejected and fall back to the default.
const SignUpRoleSchema = z
    .enum(Constants.public.Enums.user_role)
    .exclude([...SIGN_UP_EXCLUDED_ROLES]);

// Optional contact phone of an account; shared by sign-up and profile settings.
export const PhoneSchema = optionalText(
    z.string().trim().max(PROFILE_PHONE_MAX_LENGTH),
);

// Cloudflare Turnstile token from the form's `captchaToken` field. Supabase Auth
// verifies it; here it is only passed through. Missing when no site key is set
// (local development against a stack without captcha).
const CaptchaTokenSchema = z.string().min(1).optional().catch(undefined);

export const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
    captchaToken: CaptchaTokenSchema,
});

export const SignUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(PASSWORD_MIN_LENGTH),
    userName: z.string().trim().min(USER_NAME_MIN_LENGTH),
    phone: PhoneSchema,
    role: SignUpRoleSchema.catch(DEFAULT_SIGN_UP_ROLE),
    locale: z.enum(routing.locales).catch(routing.defaultLocale),
    captchaToken: CaptchaTokenSchema,
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email(),
    locale: z.enum(routing.locales).catch(routing.defaultLocale),
    captchaToken: CaptchaTokenSchema,
});

// New password typed twice; shared by the reset and change forms.
const NewPasswordSchema = z.object({
    password: z.string().min(PASSWORD_MIN_LENGTH),
    confirmPassword: z.string(),
});

const passwordsMatch = (data: z.infer<typeof NewPasswordSchema>) =>
    data.password === data.confirmPassword;

const mismatchIssue = { path: ['confirmPassword'] };

export const ResetPasswordSchema = NewPasswordSchema.refine(
    passwordsMatch,
    mismatchIssue,
);

export const ChangePasswordSchema = NewPasswordSchema.extend({
    currentPassword: z.string().min(1),
    // Checking the current password is a sign-in, which also needs a token.
    captchaToken: CaptchaTokenSchema,
}).refine(passwordsMatch, mismatchIssue);

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
