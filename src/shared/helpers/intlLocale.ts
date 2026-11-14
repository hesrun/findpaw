import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { INTL_LOCALES } from '@shared/constants/locales';

// Intl tag for an app locale; an unknown value falls back to the default locale.
export function toIntlLocale(locale: string) {
    return INTL_LOCALES[
        hasLocale(routing.locales, locale) ? locale : routing.defaultLocale
    ];
}
