'use client';

import { useTranslations } from 'next-intl';
import {
    PASSWORD_MIN_LENGTH,
    USER_NAME_MIN_LENGTH,
} from '@features/auth/constants';

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

// Client-side field validators for auth forms. The server re-validates with Zod.
export function useAuthFieldValidation() {
    const t = useTranslations('auth');

    function validateEmail(value: string) {
        return EMAIL_PATTERN.test(value) ? null : t('errors.emailInvalid');
    }

    function validatePassword(value: string) {
        return value.length >= PASSWORD_MIN_LENGTH
            ? null
            : t('errors.passwordInvalid');
    }

    function validateUserName(value: string) {
        return value.trim().length >= USER_NAME_MIN_LENGTH
            ? null
            : t('errors.userNameInvalid');
    }

    return { validateEmail, validatePassword, validateUserName };
}
