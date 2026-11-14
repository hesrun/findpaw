import { describe, expect, it } from 'vitest';
import { routing } from '@/i18n/routing';
import {
    DEFAULT_SIGN_UP_ROLE,
    PASSWORD_MIN_LENGTH,
    PROFILE_PHONE_MAX_LENGTH,
    SIGN_UP_EXCLUDED_ROLES,
} from './constants';
import {
    AuthConfirmParamsSchema,
    ChangePasswordSchema,
    ResetPasswordSchema,
    SignInSchema,
    SignUpSchema,
} from './schemas';

const password = 'p'.repeat(PASSWORD_MIN_LENGTH);
const credentials = { email: 'jan@example.cz', password };

const validSignUp = {
    email: 'jan@example.cz',
    password,
    userName: 'Jan',
    role: 'shelter',
    locale: 'cs',
};

describe('SignUpSchema', () => {
    it('parses a valid sign-up', () => {
        expect(SignUpSchema.parse(validSignUp)).toEqual(validSignUp);
    });

    it.each(SIGN_UP_EXCLUDED_ROLES)(
        'replaces the excluded role "%s" with the default',
        (role) => {
            expect(SignUpSchema.parse({ ...validSignUp, role }).role).toBe(
                DEFAULT_SIGN_UP_ROLE,
            );
        },
    );

    it('falls back to the default locale', () => {
        expect(SignUpSchema.parse({ ...validSignUp, locale: 'de' }).locale).toBe(
            routing.defaultLocale,
        );
    });

    it('rejects a short password', () => {
        expect(
            SignUpSchema.safeParse({
                ...validSignUp,
                password: password.slice(1),
            }).success,
        ).toBe(false);
    });

    it('trims the user name before checking its length', () => {
        expect(
            SignUpSchema.safeParse({ ...validSignUp, userName: '  J  ' }).success,
        ).toBe(false);
    });

    it('accepts a sign-up without a phone', () => {
        expect(SignUpSchema.parse({ ...validSignUp, phone: '' }).phone).toBeNull();
        expect(
            SignUpSchema.parse({ ...validSignUp, phone: null }).phone,
        ).toBeNull();
    });

    it('trims the phone and rejects a too long one', () => {
        expect(
            SignUpSchema.parse({ ...validSignUp, phone: ' +420 777 123 456 ' })
                .phone,
        ).toBe('+420 777 123 456');
        expect(
            SignUpSchema.safeParse({
                ...validSignUp,
                phone: '1'.repeat(PROFILE_PHONE_MAX_LENGTH + 1),
            }).success,
        ).toBe(false);
    });
});

describe('captchaToken', () => {
    it('passes the Turnstile token through', () => {
        expect(
            SignInSchema.parse({ ...credentials, captchaToken: 'token' })
                .captchaToken,
        ).toBe('token');
    });

    // FormData.get gives null for a missing field; Supabase decides whether
    // a token is required, so the form itself stays valid.
    it.each([null, ''])('treats %j as no token', (captchaToken) => {
        expect(
            SignInSchema.parse({ ...credentials, captchaToken }).captchaToken,
        ).toBeUndefined();
    });
});

describe('ResetPasswordSchema', () => {
    it('accepts matching passwords', () => {
        expect(
            ResetPasswordSchema.safeParse({ password, confirmPassword: password })
                .success,
        ).toBe(true);
    });

    it('reports a mismatch on confirmPassword', () => {
        const result = ResetPasswordSchema.safeParse({
            password,
            confirmPassword: `${password}x`,
        });
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].path).toEqual(['confirmPassword']);
    });
});

describe('ChangePasswordSchema', () => {
    it('requires the current password', () => {
        expect(
            ChangePasswordSchema.safeParse({
                currentPassword: '',
                password,
                confirmPassword: password,
            }).success,
        ).toBe(false);
    });

    it('reports a mismatch on confirmPassword', () => {
        const result = ChangePasswordSchema.safeParse({
            currentPassword: 'old',
            password,
            confirmPassword: 'other',
        });
        expect(result.error?.issues[0].path).toEqual(['confirmPassword']);
    });
});

describe('AuthConfirmParamsSchema', () => {
    it('accepts only known link types', () => {
        expect(
            AuthConfirmParamsSchema.safeParse({
                token_hash: 'abc',
                type: 'recovery',
                locale: 'en',
            }).success,
        ).toBe(true);
        expect(
            AuthConfirmParamsSchema.safeParse({
                token_hash: 'abc',
                type: 'magiclink',
                locale: 'en',
            }).success,
        ).toBe(false);
    });

    it('requires a token hash', () => {
        expect(
            AuthConfirmParamsSchema.safeParse({
                token_hash: '',
                type: 'email',
            }).success,
        ).toBe(false);
    });
});
