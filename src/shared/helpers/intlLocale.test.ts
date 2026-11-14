import { describe, expect, it } from 'vitest';
import { routing } from '@/i18n/routing';
import { INTL_LOCALES } from '@shared/constants/locales';
import { toIntlLocale } from './intlLocale';

describe('toIntlLocale', () => {
    it.each(routing.locales)('maps "%s" to its Intl tag', (locale) => {
        expect(toIntlLocale(locale)).toBe(INTL_LOCALES[locale]);
    });

    it('falls back to the default locale for unknown values', () => {
        expect(toIntlLocale('xx')).toBe(INTL_LOCALES[routing.defaultLocale]);
    });
});
